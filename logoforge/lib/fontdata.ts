import { FontDef, FontScript, getFont, hasDevanagari } from "./fonts";

/**
 * Why this exists: an SVG used as <img src="data:image/svg+xml,..."> (and therefore the PNG made from it)
 * cannot load web fonts from the network, so it would silently fall back to a default font.
 * We fetch the woff2 file from /public/fonts once, keep it as base64, and write it into the SVG as
 * <style>@font-face{src:url(data:font/woff2;base64,...)}</style>. Nothing external is needed after that.
 */
const cache = new Map<string, string>(); // "id:script" -> base64
const inflight = new Map<string, Promise<void>>();
const listeners = new Set<() => void>();
let version = 0;
export const fontVersion = () => version;
export const onFontLoaded = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };

const RANGE: Record<FontScript, string> = {
  latin: "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
  devanagari: "U+0900-097F,U+1CD0-1CF9,U+200C-200D,U+20A8,U+20B9,U+25CC,U+A830-A839,U+A8E0-A8FF",
};

function needed(f: FontDef, text: string): FontScript[] {
  return f.scripts.includes("devanagari") && hasDevanagari(text) ? ["latin", "devanagari"] : ["latin"];
}

function toBase64(buf: ArrayBuffer) {
  const u = new Uint8Array(buf);
  let s = "";
  for (let k = 0; k < u.length; k += 0x8000) s += String.fromCharCode(...u.subarray(k, k + 0x8000));
  return btoa(s);
}

/** Download (once) whatever font files this text needs. Safe to call repeatedly. */
export async function loadFontData(id: string, text: string): Promise<void> {
  const f = getFont(id);
  if (!f.web) return;
  await Promise.all(
    needed(f, text).map((sc) => {
      const key = `${f.id}:${sc}`;
      if (cache.has(key)) return;
      let p = inflight.get(key);
      if (!p) {
        p = fetch(`/fonts/${f.id}-${sc}.woff2`)
          .then((r) => { if (!r.ok) throw new Error("font " + r.status); return r.arrayBuffer(); })
          .then((b) => { cache.set(key, toBase64(b)); version++; listeners.forEach((fn) => fn()); })
          .catch(() => {})
          .finally(() => inflight.delete(key));
        inflight.set(key, p);
      }
      return p;
    })
  );
}

/** @font-face CSS with the font inlined as base64. Empty for system fonts or if not loaded yet. */
export function fontFaceCss(id: string, text: string): string {
  const f = getFont(id);
  if (!f.web) return "";
  const fam = f.stack.match(/^'([^']+)'/)?.[1] ?? f.label;
  return needed(f, text)
    .map((sc) => {
      const b = cache.get(`${f.id}:${sc}`);
      return b ? `@font-face{font-family:'${fam}';font-weight:100 900;font-style:normal;src:url(data:font/woff2;base64,${b}) format('woff2');unicode-range:${RANGE[sc]}}` : "";
    })
    .join("");
}
export const fontStyle = (id: string, text: string) => {
  const c = fontFaceCss(id, text);
  return c ? `<style>${c}</style>` : "";
};

/** For on-screen inline <svg>: the page already has the font, so drop the (large) embedded copy. Downloads keep it. */
export const stripFontStyle = (svg: string) => svg.replace(/<style>@font-face[\s\S]*?<\/style>/, "");
