import { esc } from "../logo";
import type { Colors } from "../logo";
import { getFont, graphemes } from "../fonts";
import { fontFaceCss } from "../fontdata";

export type Opts = { style: string; brand: string; tagline: string; colors: Colors; icon: string; font?: string };

/* ---------- colour helpers ---------- */
export const mix = (a: string, b: string, t: number) => {
  const p = (h: string, k: number) => parseInt(h.slice(1 + k * 2, 3 + k * 2), 16);
  return "#" + [0, 1, 2].map((k) => Math.round(p(a, k) + (p(b, k) - p(a, k)) * t).toString(16).padStart(2, "0")).join("");
};
export const lum = (h: string) => {
  const c = [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
/** Brightens a colour until it is readable on a dark scene (dark brand colours like #111827 stay usable). */
export const vivid = (h: string, min = 0.2) => { let c = h, k = 0; while (lum(c) < min && k++ < 12) c = mix(c, "#ffffff", 0.14); return c; };
/** Darkens a colour until it is readable on a light scene. */
export const deep = (h: string, max = 0.25) => { let c = h, k = 0; while (lum(c) > max && k++ < 12) c = mix(c, "#000000", 0.14); return c; };
export const rng = (seed: number) => () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
export const f1 = (n: number) => Math.round(n * 10) / 10;
export { esc, graphemes };

/* ---------- icons ---------- */
export const ico = (o: Opts, size: number, id: string, attrs = "") =>
  `<svg viewBox="0 0 100 100" width="${size}" height="${size}" ${attrs}><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${o.colors[0]}"/><stop offset="1" stop-color="${o.colors[1]}"/></linearGradient></defs><path d="${o.icon}" fill="url(#${id})" fill-rule="evenodd"/></svg>`;
export const icoWhite = (o: Opts, size: number) => `<svg viewBox="0 0 100 100" width="${size}" height="${size}"><path d="${o.icon}" fill="#fff" fill-rule="evenodd"/></svg>`;

/* ---------- standalone page ---------- */
export const fontStackOf = (o: Opts) => getFont(o.font || "serif").stack;

const BASE = (o: Opts) => {
  const [a, b] = o.colors;
  return `
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%}
body{background:radial-gradient(circle at 50% 40%,#151b36,#05060a 72%);color:#f8fafc;font-family:${fontStackOf(o)};overflow:hidden}
.stage{position:relative;width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center}
.name{font-size:clamp(30px,8vw,72px);line-height:1.1;letter-spacing:-.02em;text-align:center;padding:0 16px;background:linear-gradient(90deg,${a},${b});-webkit-background-clip:text;background-clip:text;color:transparent}
.tag{margin-top:10px;opacity:.7;font-size:clamp(13px,2.4vw,20px);text-align:center;padding:0 16px}
@keyframes rise{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01s!important;animation-delay:0s!important;animation-iteration-count:1!important}}
`;
};

/** Full HTML document. The chosen font is embedded as base64 so the downloaded file still shows it offline. */
export const page = (o: Opts, css: string, body: string) =>
  `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(o.brand)}</title>
<style>${fontFaceCss(o.font || "serif", `${o.brand} ${o.tagline}`)}${BASE(o)}${css}</style></head>
<body>${body}</body></html>`;

export const nameBlock = (o: Opts, delay: number) =>
  `<h1 class="name" style="animation:rise .9s ease-out ${delay}s both">${esc(o.brand)}</h1>` +
  (o.tagline ? `<p class="tag" style="animation:rise .9s ease-out ${delay + 0.2}s both">${esc(o.tagline)}</p>` : "");

/* ---------- cinematic scene shell ---------- */
export type SceneParts = {
  svg: string;            // content in a 1200x900 viewBox (draw backgrounds far outside it, they are not clipped)
  css: string;
  top: number;            // vertical centre of the brand name, % of the 4:3 stage
  bg: string;             // page colour behind everything (matches the sky/ground edge colours)
  dur: number;            // seconds until the scene is finished (used for the camera move)
  drift?: [string, string]; // camera move: from / to transform
  brandCss?: string;      // extra CSS for .brand
  html?: string;          // extra HTML layered over the stage (inside .cam)
  titleHtml?: string;     // replaces the default <h1>/<p>
  dark?: boolean;         // dark scene (default true): light text shadow
};

/**
 * One cinematic scene. The 1200x900 SVG is scaled to fit; on a phone the stage is allowed to be wider
 * than the screen, so keep the important action inside the centre ~60% (x 250..950).
 * Everything is CSS + inline SVG, no scripts, no network. Reduced-motion users get the final frame.
 */
export function scene(o: Opts, p: SceneParts): string {
  const [a, b] = o.colors;
  const ga = vivid(a, 0.32), gb = vivid(b, 0.32);
  const [d0, d1] = p.drift || ["scale(1.07)", "scale(1)"];
  const css = `
html,body{background:${p.bg}}
.stage{position:fixed;inset:0;display:grid;place-items:center;overflow:hidden;background:${p.bg}}
.cam{position:relative;width:min(133.33vh,max(100vw,80vh),165vw);aspect-ratio:4/3}
.sv{position:absolute;inset:0;width:100%;height:100%;overflow:visible;transform-origin:50% 55%;animation:drift ${p.dur}s cubic-bezier(.25,.1,.25,1) both}
@keyframes drift{from{transform:${d0}}to{transform:${d1}}}
.title{position:absolute;left:50%;top:${p.top}%;transform:translate(-50%,-50%);width:min(94vw,100%);text-align:center;pointer-events:none;z-index:3}
.brand{font-size:clamp(26px,min(8vw,11vh),104px);line-height:1.1;letter-spacing:-.01em;overflow-wrap:anywhere;text-wrap:balance;padding:0 8px;
  background:linear-gradient(95deg,${ga},${gb});-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 3px 14px rgba(0,0,0,${p.dark === false ? ".25" : ".55"}))}
.tagline{margin-top:.5em;font-size:clamp(13px,min(2.6vw,3.6vh),26px);color:#f8fafc;opacity:.8;letter-spacing:.04em;padding:0 12px;text-shadow:0 2px 10px rgba(0,0,0,.6)}
.vig{position:fixed;inset:0;pointer-events:none;z-index:5;background:radial-gradient(ellipse at 50% 46%,transparent 52%,rgba(0,0,0,.5))}
.grain{position:fixed;inset:0;pointer-events:none;z-index:6;opacity:.09;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>")}
${p.brandCss || ""}
${p.css}`;
  const title = p.titleHtml ?? `<h1 class="brand">${esc(o.brand)}</h1>${o.tagline ? `<p class="tagline">${esc(o.tagline)}</p>` : ""}`;
  return page(
    o, css,
    `<div class="stage"><div class="cam"><svg class="sv" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(o.brand)}">${p.svg}</svg>${p.html || ""}<div class="title">${title}</div></div></div><div class="vig"></div><div class="grain"></div>`
  );
}

/** Shared SVG filters / gradients. Use ids: b2 b4 b8 b16 (blur), glow, soft. */
export const FILTERS = `<filter id="b2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2"/></filter>
<filter id="b4" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4"/></filter>
<filter id="b8" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="b16" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="16"/></filter>
<filter id="b30" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="30"/></filter>
<filter id="glow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="6" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="soft" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#000" flood-opacity=".5"/></filter>`;
