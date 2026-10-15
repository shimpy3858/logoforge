import { FILTERS, Opts, esc, f1, graphemes, mix, rng, scene, vivid } from "../shared";

/** 11. Fireflies in a night forest drift, then each one settles into a letter and lights it up. */
export function fireflies(o: Opts) {
  const [a, b] = o.colors;
  const glow = "#e4ff7a";
  const r = rng(90);
  const trees = (base: number, seed: number, fill: string, n: number, h0: number, h1: number, op: number) => {
    const q = rng(seed); let s = "";
    for (let k = 0; k < n; k++) { const x = -1500 + (k * 4300) / n + q() * 60, h = h0 + q() * (h1 - h0), w = 22 + q() * 26;
      s += `<path d="M${f1(x)} ${base + 200}L${f1(x + w * 0.35)} ${f1(base - h)}L${f1(x + w * 0.65)} ${f1(base - h)}L${f1(x + w)} ${base + 200}Z"/>`;
      s += `<ellipse cx="${f1(x + w / 2)}" cy="${f1(base - h - 30)}" rx="${f1(70 + q() * 60)}" ry="${f1(90 + q() * 60)}"/>`; }
    return `<g fill="${fill}" opacity="${op}">${s}</g>`;
  };
  const free = Array.from({ length: 40 }, () => {
    const x = -100 + r() * 1400, y = 300 + r() * 450, c = r();
    return `<g transform="translate(${f1(x)} ${f1(y)})"><g class="wd" style="--ax:${f1((r() - 0.5) * 160)}px;--ay:${f1((r() - 0.5) * 120)}px;--bx:${f1((r() - 0.5) * 200)}px;--by:${f1((r() - 0.5) * 140)}px;--cx:${f1((r() - 0.5) * 160)}px;--cy:${f1((r() - 0.5) * 120)}px;animation-duration:${f1(9 + r() * 8)}s;animation-delay:${f1(-r() * 9)}s"><circle r="${f1(14 + c * 8)}" fill="url(#ffg)" style="animation:pls ${f1(1.2 + r() * 1.8)}s ease-in-out ${f1(-r() * 2)}s infinite alternate"/><circle r="2.4" fill="#fbffd0"/></g></g>`;
  }).join("");
  const grass = Array.from({ length: 90 }, () => { const x = -600 + r() * 2400, h = 30 + r() * 60, w = (r() - 0.5) * 24; return `<path d="M${f1(x)} 920q${f1(w)} ${f1(-h * 0.6)} ${f1(w * 1.7)} ${f1(-h)}" style="animation-delay:${f1(-r() * 3)}s"/>`; }).join("");
  const gs = graphemes(o.brand), n = Math.max(gs.length, 1);
  const letters = gs.map((ch, k) => {
    if (!ch.trim()) return `<span class="sp">&nbsp;</span>`;
    const c = vivid(mix(a, b, n > 1 ? k / (n - 1) : 0), 0.45), d = (4.1 + k * 0.14).toFixed(2);
    const sx = f1((r() - 0.5) * 900), sy = f1(-120 - r() * 360);
    return `<span class="lt" style="--c:${c};--d:${d}s"><i class="ff" style="--sx:${sx}px;--sy:${sy}px"></i><b>${esc(ch)}</b></span>`;
  }).join("");
  const svg = `<defs>${FILTERS}
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#030a14"/><stop offset=".6" stop-color="#08202a"/><stop offset="1" stop-color="#0d3a3a"/></linearGradient>
<radialGradient id="ffg"><stop offset="0" stop-color="${glow}" stop-opacity=".95"/><stop offset=".35" stop-color="${glow}" stop-opacity=".35"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient>
<linearGradient id="shaft" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe9ff" stop-opacity=".28"/><stop offset="1" stop-color="#cfe9ff" stop-opacity="0"/></linearGradient></defs>
<rect x="-3000" y="-3000" width="7200" height="4000" fill="url(#sky)"/>
<circle cx="880" cy="140" r="52" fill="#eef6ff"/><circle cx="880" cy="140" r="200" fill="#9fd0ff" opacity=".16" filter="url(#b16)"/>
<g style="mix-blend-mode:screen"><path d="M850 160L560 900L760 900L900 160Z" fill="url(#shaft)"/><path d="M900 160L880 900L1080 900L930 160Z" fill="url(#shaft)" opacity=".7"/></g>
${trees(700, 4, "#082028", 22, 360, 640, 0.9)}
<g class="fog1"><ellipse cx="300" cy="700" rx="600" ry="70" fill="#8fd6c8" opacity=".15" filter="url(#b30)"/></g>
${trees(780, 6, "#05141c", 18, 300, 560, 1)}
<g class="fog2"><ellipse cx="900" cy="760" rx="650" ry="70" fill="#8fd6c8" opacity=".14" filter="url(#b30)"/></g>
${trees(860, 12, "#030c12", 12, 220, 480, 1)}
<g class="ffs">${free}</g>
<rect x="-3000" y="900" width="7200" height="2000" fill="#020609"/>
<g class="gr" fill="none" stroke="#02080b" stroke-width="5" stroke-linecap="round">${grass}</g>`;
  const css = `
.fog1{animation:fg 14s ease-in-out infinite alternate}.fog2{animation:fg 18s ease-in-out -4s infinite alternate-reverse}@keyframes fg{to{transform:translateX(160px)}}
.wd{animation:wander ease-in-out infinite}
@keyframes wander{0%,100%{transform:translate(0,0)}25%{transform:translate(var(--ax),var(--ay))}50%{transform:translate(var(--bx),var(--by))}75%{transform:translate(var(--cx),var(--cy))}}
@keyframes pls{from{opacity:.2;transform:scale(.7)}to{opacity:1;transform:scale(1.15)}}
.gr path{transform-box:fill-box;transform-origin:50% 100%;animation:sw 3s ease-in-out infinite alternate}@keyframes sw{from{transform:rotate(-3deg)}to{transform:rotate(4deg)}}
.fw{background:none!important;-webkit-text-fill-color:initial!important;color:inherit!important;filter:none!important;display:flex;flex-wrap:wrap;justify-content:center;gap:0 .02em}
.lt{position:relative;display:inline-block}.sp{display:inline-block;width:.3em}
.lt b{font-weight:inherit;display:inline-block;opacity:0;filter:blur(8px);color:var(--c);transform:scale(.8);animation:lit .9s ease-out var(--d) both}
@keyframes lit{0%{opacity:0;filter:blur(8px);transform:scale(.8);text-shadow:none}100%{opacity:1;filter:blur(0);transform:none;text-shadow:0 0 .35em var(--c),0 0 1em ${glow}66}}
.ff{position:absolute;left:50%;top:50%;width:10px;height:10px;margin:-5px;border-radius:50%;background:radial-gradient(circle,#fbffd0 20%,${glow} 45%,transparent 72%);box-shadow:0 0 14px 6px ${glow}88;opacity:0;animation:gath 1.4s cubic-bezier(.45,0,.2,1) calc(var(--d) - 1.2s) both}
@keyframes gath{0%{opacity:0;transform:translate(var(--sx),var(--sy)) scale(1)}15%{opacity:1}85%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(0,0) scale(2.4)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:.85;transform:none}}`;
  return scene(o, {
    svg, css, top: 46, bg: "#020609", dur: 9, drift: ["scale(1.06)", "scale(1)"],
    titleHtml: `<h1 class="brand fw" aria-label="${esc(o.brand)}">${letters}</h1>${o.tagline ? `<p class="tagline" style="opacity:0;animation:fadeUp 1.2s ease-out ${(4.1 + n * 0.14 + 0.9).toFixed(2)}s forwards">${esc(o.tagline)}</p>` : ""}`,
  });
}
