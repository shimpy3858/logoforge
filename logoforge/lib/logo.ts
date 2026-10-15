import { ICONS, INDUSTRIES } from "./icons";
import { FONTS, FontId, getFont, graphemes, widthFactor } from "./fonts";
import { fontStyle, loadFontData } from "./fontdata";
export { INDUSTRIES, FONTS };
export type { FontId };

export type LogoType = "wordmark" | "icon" | "emblem" | "monogram" | "horizontal" | "badge" | "stamp" | "outline" | "split" | "ribbon";
export type Theme = "light" | "dark";
export type Colors = [string, string];
export type Input = {
  name: string;
  tagline: string;
  industry: string;
  type: LogoType;
  font: FontId;
  colors?: Colors; // set by AI (optional)
  customIcon?: string; // AI-drawn icon path (optional)
};

const PALETTES: Colors[] = [
  ["#6366f1", "#ec4899"],
  ["#f59e0b", "#ef4444"],
  ["#10b981", "#06b6d4"],
  ["#0ea5e9", "#6366f1"],
  ["#a855f7", "#f43f5e"],
  ["#14532d", "#84cc16"],
  ["#0f172a", "#38bdf8"],
  ["#be123c", "#fb923c"],
  ["#7c3aed", "#22d3ee"],
  ["#facc15", "#16a34a"],
  ["#1e3a8a", "#f59e0b"],
  ["#111827", "#d4af37"],
];

const shade = (hex: string, f: number) =>
  "#" + [1, 3, 5].map((k) => Math.round(parseInt(hex.slice(k, k + 2), 16) * f).toString(16).padStart(2, "0")).join("");

export const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));

export const isHex = (s: unknown): s is string => typeof s === "string" && /^#[0-9a-fA-F]{6}$/.test(s);

/** Accepts only plain SVG path data. Used to validate AI output before it is drawn. */
export function cleanPath(d: unknown): string | null {
  if (typeof d !== "string") return null;
  const t = d.trim();
  if (t.length < 10 || t.length > 1500) return null;
  if (!/^[Mm][MmLlHhVvCcSsQqTtAaZz0-9eE.,\s-]+$/.test(t)) return null;
  return t;
}

export const palettesFor = (i: Input): Colors[] => (i.colors ? [i.colors, ...PALETTES.slice(0, 11)] : PALETTES);
export const iconFor = (i: Input, n: number): string => {
  if (i.customIcon) return i.customIcon;
  const set = ICONS[i.industry] || ICONS.Other;
  return set[n % set.length];
};
export const fileSlug = (name: string) =>
  name.trim().toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "") || "logo";

function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const first = (w: string) => graphemes(w)[0] || "";
  return (words.length > 1 ? words.slice(0, 2).map(first).join("") : first(words[0] || "B")).toUpperCase();
}

/** Text that decides which font files are needed (Latin vs Devanagari). */
export const brandText = (i: Input) => `${i.name} ${i.tagline}`;

export function makeLogoSvg(i: Input, n: number, theme: Theme = "light", transparent = false, embed = true): string {
  const pal = palettesFor(i);
  const [a, b] = pal[n % pal.length];
  const raw = i.name.trim() || "Brand";
  const name = esc(raw), tag = esc(i.tagline.trim()), initials = esc(initialsOf(raw));
  const F = getFont(i.font);
  const wide = widthFactor(F, raw);
  const dark = theme === "dark";
  const ink = dark ? "#f9fafb" : "#111827", sub = dark ? "#9ca3af" : "#6b7280";
  const icon = iconFor(i, n);
  const len = Math.max(Array.from(raw).length, 1);
  const fs = (max: number, w: number) => Math.round(Math.min(max, w / (len * wide)));
  const id = `g${n}${a.slice(1)}${b.slice(1)}`;
  const g = `<defs>${embed ? fontStyle(i.font, brandText(i)) : ""}<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;
  const T = (y: number, size: number, fill: string, t: string, w = 700, x = 300, anchor = "middle", ls = 0) =>
    t ? `<text x="${x}" y="${y}" font-family="${F.stack}" font-size="${size}" font-weight="${w}" fill="${fill}" text-anchor="${anchor}"${ls ? ` letter-spacing="${ls}"` : ""}>${t}</text>` : "";
  const tagUp = esc(i.tagline.trim().toUpperCase());
  const P = (extra: string) => `<path d="${icon}" fill="url(#${id})" fill-rule="evenodd" ${extra}/>`;
  let body = "";
  if (i.type === "wordmark") body = T(160, fs(88, 520), `url(#${id})`, name) + T(205, 20, sub, tag, 400);
  if (i.type === "icon") body = P('transform="translate(250 22)"') + T(190, fs(52, 520), ink, name) + T(230, 18, sub, tag, 400);
  if (i.type === "emblem")
    body = `<circle cx="300" cy="150" r="130" fill="none" stroke="url(#${id})" stroke-width="10"/>` + P('transform="translate(272 62) scale(.56)"') + T(172, fs(40, 300), ink, name) + T(204, 15, sub, tag, 400);
  if (i.type === "monogram")
    body = `<rect x="200" y="14" width="200" height="200" rx="48" fill="url(#${id})"/><text x="300" y="148" font-family="${F.stack}" font-size="104" font-weight="700" fill="#fff" text-anchor="middle">${initials}</text>` + T(256, fs(32, 480), ink, name) + T(284, 14, sub, tag, 400);
  if (i.type === "horizontal")
    body = P('transform="translate(66 60) scale(1.4)"') + T(142, fs(64, 340), ink, name, 700, 232, "start") + T(178, 18, sub, tag, 400, 234, "start");
  if (i.type === "badge")
    body = `<polygon points="300,18 378,63 378,153 300,198 222,153 222,63" fill="url(#${id})"/><path d="${icon}" fill="#fff" fill-rule="evenodd" transform="translate(262 70) scale(.76)"/>` + T(248, fs(44, 520), ink, name) + T(278, 15, sub, tag, 400);
  if (i.type === "stamp")
    body = `<circle cx="300" cy="150" r="136" fill="none" stroke="url(#${id})" stroke-width="8"/><circle cx="300" cy="150" r="118" fill="none" stroke="url(#${id})" stroke-width="2" stroke-dasharray="3 7"/>` + P('transform="translate(276 56) scale(.48)"') + T(160, fs(38, 210), ink, name, 800, 300, "middle", 1) + `<rect x="250" y="176" width="100" height="3" fill="url(#${id})"/>` + T(206, 11, sub, tagUp, 400, 300, "middle", 2);
  if (i.type === "outline")
    body = `<path d="${icon}" fill="none" stroke="url(#${id})" stroke-width="3" stroke-linejoin="round" fill-rule="evenodd" transform="translate(250 20)"/>` + T(192, fs(40, 440), ink, esc(raw.toUpperCase()), 400, 300, "middle", 6) + T(230, 14, sub, tagUp, 400, 300, "middle", 4);
  if (i.type === "split") {
    const words = raw.split(/\s+/).filter(Boolean);
    const chars = Array.from(raw);
    const half = Math.ceil(chars.length / 2);
    const p1 = words.length > 1 ? words[0] + " " : chars.slice(0, half).join("");
    const p2 = words.length > 1 ? words.slice(1).join(" ") : chars.slice(half).join("");
    body = `<text x="300" y="160" font-family="${F.stack}" font-size="${fs(88, 520)}" font-weight="800" text-anchor="middle"><tspan fill="url(#${id})">${esc(p1)}</tspan><tspan fill="${ink}">${esc(p2)}</tspan></text>` + T(205, 20, sub, tag, 400);
  }
  if (i.type === "ribbon")
    body = P('transform="translate(268 22) scale(.64)"') + `<polygon points="50,108 550,108 520,160 550,212 50,212 80,160" fill="url(#${id})"/>` + T(176, fs(54, 400), "#fff", name, 800) + T(256, 18, sub, tag, 400);
  const bg = transparent ? "" : `<rect width="600" height="300" fill="${dark ? "#0b0d14" : "#ffffff"}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300">${g}${bg}${body}</svg>`;
}

export type AppStyle = "gradient" | "glossy" | "glass" | "layered" | "duotone" | "flat" | "dark" | "neon" | "minimal" | "outline" | "sticker" | "circle";
export const APP_STYLES: { id: AppStyle; label: string }[] = [
  { id: "gradient", label: "Gradient" },
  { id: "glossy", label: "Glossy" },
  { id: "glass", label: "Glass" },
  { id: "layered", label: "3D layered" },
  { id: "duotone", label: "Duotone" },
  { id: "flat", label: "Flat" },
  { id: "dark", label: "Dark" },
  { id: "neon", label: "Neon glow" },
  { id: "minimal", label: "Minimal" },
  { id: "outline", label: "Outline" },
  { id: "sticker", label: "Sticker" },
  { id: "circle", label: "Round" },
];

export function makeAppIconSvg(i: Input, n: number, size = 512, style: AppStyle = "gradient", embed = true): string {
  const pal = palettesFor(i);
  const [a, b] = pal[n % pal.length];
  const F = getFont(i.font);
  const id = `a${n}${a.slice(1)}${b.slice(1)}`;
  const mono = i.type === "monogram";
  const ini = esc(initialsOf(i.name.trim() || "Brand"));
  const icon = iconFor(i, n);
  const U = `url(#${id})`;
  const gl = (o: { fill: string; stroke?: string; sw?: number; dx?: number; dy?: number; s?: number; op?: number; extra?: string }) => {
    const { fill, stroke, sw = 0, dx = 0, dy = 0, s = 2.8, op = 1, extra = "" } = o;
    const st = stroke ? ` stroke="${stroke}" stroke-width="${mono ? sw : sw / s}" stroke-linejoin="round"` : "";
    const opa = op !== 1 ? ` opacity="${op}"` : "";
    if (mono) {
      const fsz = (230 * s) / 2.8;
      return `<text x="${256 + dx}" y="${(256 + fsz * 0.36 + dy).toFixed(1)}" font-family="${F.stack}" font-size="${fsz.toFixed(1)}" font-weight="700" fill="${fill}" text-anchor="middle"${st}${opa}${extra}>${ini}</text>`;
    }
    return `<path d="${icon}" fill="${fill}" fill-rule="evenodd"${st}${opa}${extra} transform="translate(${(256 - 50 * s + dx).toFixed(1)} ${(256 - 50 * s + dy).toFixed(1)}) scale(${s})"/>`;
  };
  const rect = (fill: string, rx = 112) => `<rect width="512" height="512" rx="${rx}" fill="${fill}"/>`;
  let defs = `${embed && mono ? fontStyle(i.font, brandText(i)) : ""}<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  let body = "";
  switch (style) {
    case "flat":
      body = rect(a) + gl({ fill: "#fff" });
      break;
    case "glossy":
      defs += `<linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
      body = rect(U) + `<path d="M0 112A112 112 0 0 1 112 0H400A112 112 0 0 1 512 112V196Q256 276 0 196Z" fill="url(#${id}h)"/>` + gl({ fill: "#000", dy: 8, op: 0.25 }) + gl({ fill: "#fff" });
      break;
    case "glass":
      body = rect(U) + `<circle cx="140" cy="130" r="90" fill="#fff" opacity=".18"/><rect x="72" y="72" width="368" height="368" rx="92" fill="#fff" fill-opacity=".16" stroke="#fff" stroke-opacity=".55" stroke-width="4"/>` + gl({ fill: "#fff", s: 2.4 });
      break;
    case "layered": {
      let ex = "";
      const side = shade(b, 0.55);
      for (let k = 20; k >= 1; k--) ex += gl({ fill: side, dx: k * 0.9, dy: k * 1.3, s: 2.5 });
      body = rect(U) + gl({ fill: "#000", dx: 26, dy: 38, op: 0.18, s: 2.5 }) + ex + gl({ fill: "#fff", s: 2.5 });
      break;
    }
    case "duotone":
      defs += `<clipPath id="${id}c"><rect width="512" height="512" rx="112"/></clipPath>`;
      body = `<g clip-path="url(#${id}c)"><rect width="512" height="512" fill="${a}"/><polygon points="512,0 512,512 0,512" fill="${b}"/></g>` + gl({ fill: "#fff" });
      break;
    case "dark":
      body = rect("#0b0d14") + `<rect x="4" y="4" width="504" height="504" rx="108" fill="none" stroke="${U}" stroke-width="8"/>` + gl({ fill: U, s: 2.6 });
      break;
    case "neon":
      defs += `<filter id="${id}f" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
      body = rect("#070816") + `<rect x="10" y="10" width="492" height="492" rx="104" fill="none" stroke="${b}" stroke-opacity=".35" stroke-width="3"/><g filter="url(#${id}f)">${gl({ fill: "none", stroke: U, sw: 10, s: 2.6 })}</g>`;
      break;
    case "minimal":
      body = rect("#f3f4f6") + gl({ fill: U });
      break;
    case "outline":
      body = rect("#fff") + `<rect x="14" y="14" width="484" height="484" rx="100" fill="none" stroke="${U}" stroke-width="20"/>` + gl({ fill: U, s: 2.4 });
      break;
    case "sticker":
      body = rect("#f8fafc") + `<circle cx="256" cy="264" r="196" fill="#000" opacity=".12"/><circle cx="256" cy="256" r="196" fill="${U}" stroke="#fff" stroke-width="18"/>` + gl({ fill: "#fff", s: 2.1 });
      break;
    case "circle":
      body = `<circle cx="256" cy="256" r="256" fill="${U}"/>` + gl({ fill: "#fff", s: 2.4 });
      break;
    default:
      body = rect(U) + gl({ fill: "#fff" });
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512"><defs>${defs}</defs>${body}</svg>`;
}

export const makeLogos = (i: Input, theme: Theme = "light") => palettesFor(i).map((_, n) => makeLogoSvg(i, n, theme));

export function svgToPngBlob(svg: string, w: number, h: number): Promise<Blob> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const x = c.getContext("2d");
      if (!x) return rej(new Error("Canvas not supported"));
      x.drawImage(img, 0, 0, w, h);
      c.toBlob((b) => (b ? res(b) : rej(new Error("PNG export failed"))), "image/png");
    };
    img.onerror = () => rej(new Error("Could not render SVG"));
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
export const downloadSvg = (svg: string, file: string) => downloadBlob(new Blob([svg], { type: "image/svg+xml" }), file + ".svg");
export const downloadPng = async (svg: string, file: string, w = 1800, h = 900) => downloadBlob(await svgToPngBlob(svg, w, h), file + ".png");

/** One ZIP with logos (light/dark/transparent), app icons and favicons. */
export async function downloadBrandKit(i: Input, n: number) {
  await loadFontData(i.font, brandText(i)); // make sure the font is embedded in every file below
  const { default: JSZip } = await import("jszip");
  const slug = fileSlug(i.name);
  const zip = new JSZip();
  const f = zip.folder(`${slug}-brand-kit`)!;
  const light = makeLogoSvg(i, n, "light"), dark = makeLogoSvg(i, n, "dark"), clear = makeLogoSvg(i, n, "light", true);
  f.file("logo-light.svg", light); f.file("logo-dark.svg", dark); f.file("logo-transparent.svg", clear);
  f.file("logo-light.png", await svgToPngBlob(light, 1800, 900));
  f.file("logo-dark.png", await svgToPngBlob(dark, 1800, 900));
  f.file("logo-transparent.png", await svgToPngBlob(clear, 1800, 900));
  const icon = makeAppIconSvg(i, n);
  f.file("app-icon.svg", icon);
  const sizes: [number, string][] = [[1024, "app-icon-1024.png"], [512, "app-icon-512.png"], [192, "app-icon-192.png"], [180, "apple-touch-icon.png"], [32, "favicon-32x32.png"], [16, "favicon-16x16.png"]];
  for (const [s, file] of sizes) f.file(file, await svgToPngBlob(makeAppIconSvg(i, n, s), s, s));
  const sf = f.folder("app-icon-styles")!;
  for (const st of APP_STYLES) sf.file(`${st.id}.png`, await svgToPngBlob(makeAppIconSvg(i, n, 512, st.id), 512, 512));
  const { MOCKUPS, makeMockup } = await import("./mockups");
  const mf = f.folder("mockups")!;
  for (const m of MOCKUPS) {
    const svg = makeMockup(m.id, i, n);
    mf.file(`${m.id}.svg`, svg);
    mf.file(`${m.id}.png`, await svgToPngBlob(svg, 1600, 1200));
  }
  f.file("README.txt", `${i.name.trim() || "Brand"} brand kit\n\nlogo-*.svg/png   website header, social, print\napp-icon-*.png   app stores and PWA (192 / 512)\napp-icon-styles/ the same icon in 12 styles\nmockups/         business card, t-shirt, mug, billboard, shop sign, bags, social, laptop, letterhead, app store\napple-touch-icon iOS home screen\nfavicon-*.png    browser tab\n`);
  downloadBlob(await zip.generateAsync({ type: "blob" }), `${slug}-brand-kit.zip`);
}
