import { FILTERS, Opts, f1, mix, rng, scene, deep } from "../shared";

/** 13. Paper plane glides through clouds, its trail underlines the name as it is revealed. */
export function paperPlane(o: Opts) {
  const [a, b] = o.colors;
  const r = rng(121);
  const cloud = (x: number, y: number, s: number) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="130" ry="32"/><ellipse cx="-70" cy="-18" rx="64" ry="34"/><ellipse cx="30" cy="-32" rx="78" ry="42"/><ellipse cx="100" cy="-8" rx="58" ry="28"/></g>`;
  const layer = (n: number, y0: number, y1: number, s0: number, s1: number) => Array.from({ length: n }, () => cloud(f1(-1000 + r() * 3200), f1(y0 + r() * (y1 - y0)), f1(s0 + r() * (s1 - s0)))).join("");
  const A = "M-500 920C-300 880-100 770 70 665C105 640 130 622 150 610";
  const B = "M150 610L1050 610C1250 610 1450 480 1700 300";
  const dB = 4.6, strait = 0.53;
  const plane = (cls: string, path: string, delay: number, dur: number, ease: string, extra = "") => `<g class="${cls}" style="offset-path:path('${path}');animation-delay:${delay}s;animation-duration:${dur}s;animation-timing-function:${ease}${extra}"><g class="bank"><g filter="url(#soft)"><path d="M0 0L-96 -26L-62 2Z" fill="#fff"/><path d="M0 0L-96 -26L-70 -4Z" fill="#dfe6f4"/><path d="M-62 2L0 0L-84 24Z" fill="#c5cfe4"/><path d="M-62 2L-96 -26L-70 -4Z" fill="#b3bfd8"/><path d="M0 0L-62 2" stroke="#9aa8c6" stroke-width="1.5"/></g></g></g>`;
  const svg = `<defs>${FILTERS}
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix("#1565e0", a, 0.08)}"/><stop offset=".55" stop-color="${mix("#4fa6f5", b, 0.05)}"/><stop offset="1" stop-color="#ffe3c4"/></linearGradient>
<radialGradient id="sun"><stop offset="0" stop-color="#fff8dc"/><stop offset=".25" stop-color="#ffe9a8" stop-opacity=".6"/><stop offset="1" stop-color="#ffd78a" stop-opacity="0"/></radialGradient>
<linearGradient id="tr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
<rect x="-3000" y="-3000" width="7200" height="6200" fill="url(#sky)"/>
<circle cx="980" cy="200" r="300" fill="url(#sun)" opacity=".6"/>
<g fill="#fff" opacity=".4" filter="url(#b8)" class="c1">${layer(10, 100, 380, 0.9, 1.6)}</g>
<g fill="#fff" opacity=".6" filter="url(#b4)" class="c2">${layer(10, 380, 720, 1, 1.8)}</g>
<path class="trail" pathLength="1" d="${A}" fill="none" stroke="url(#tr)" stroke-width="5" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="1" opacity=".85" style="animation:trA 3.2s ease-in-out .3s both"/>
<path class="trail tb" pathLength="1" d="${B}" fill="none" stroke="url(#tr)" stroke-width="6" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="1" style="animation:trB ${dB}s linear 3.5s both"/>
${plane("pA", A, 0.3, 3.2, "cubic-bezier(.4,.1,.4,1)", ";animation-fill-mode:both")}${plane("pB", B, 3.5, dB, "linear", ";animation-fill-mode:both")}
<g fill="#fff" class="c3" filter="url(#b4)" opacity=".95">${layer(8, 760, 940, 1.5, 2.4)}</g>`;
  const css = `
.c1{animation:d1 30s linear infinite alternate}.c2{animation:d2 20s linear infinite alternate}.c3{animation:d1 16s linear infinite alternate}
@keyframes d1{to{transform:translateX(-140px)}}@keyframes d2{to{transform:translateX(180px)}}
.pA,.pB{offset-rotate:auto;offset-distance:0%;offset-anchor:0 0}
.pA{animation-name:flyA}.pB{animation-name:flyB;opacity:0}
@keyframes flyA{from{offset-distance:0%;opacity:1}to{offset-distance:100%;opacity:1}}
@keyframes flyB{0%{offset-distance:0%;opacity:1}100%{offset-distance:100%;opacity:1}}
.bank{animation:bank 1.4s ease-in-out infinite alternate}@keyframes bank{from{transform:rotate(-7deg)}to{transform:rotate(6deg)}}
@keyframes trA{0%{stroke-dashoffset:1;opacity:.85}100%{stroke-dashoffset:0;opacity:.85}}
@keyframes trB{0%{stroke-dashoffset:1}100%{stroke-dashoffset:0}}
.pA{animation:flyA 3.2s cubic-bezier(.4,.1,.4,1) .3s both,hideA .01s linear 3.5s forwards}@keyframes hideA{to{opacity:0}}
@keyframes show{to{opacity:1}}
.pB{animation:flyB ${dB}s linear 3.5s both}
@keyframes wipe{from{clip-path:inset(-10% 100% -10% 0)}to{clip-path:inset(-10% 0 -10% 0)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:.9;transform:none}}`;
  const d0 = deep(a, 0.22), d1 = deep(b, 0.22);
  return scene(o, {
    svg, css, top: 53, bg: "#9cc8f2", dur: 9, dark: false, drift: ["scale(1.05)", "scale(1)"],
    brandCss: `.title{width:75%}.brand{max-width:92vw;margin:0 auto;background-image:linear-gradient(95deg,${d0},${d1});clip-path:inset(-10% 100% -10% 0);animation:wipe ${(dB * strait).toFixed(2)}s linear 3.5s forwards;filter:drop-shadow(0 2px 0 rgba(255,255,255,.7)) drop-shadow(0 6px 14px rgba(20,40,90,.3))}.tagline{color:#17325a;text-shadow:0 1px 0 rgba(255,255,255,.6);opacity:0;animation:fadeUp 1.2s ease-out 7.8s forwards}.vig{background:radial-gradient(ellipse at 50% 46%,transparent 65%,rgba(10,30,80,.18))}`,
  });
}
