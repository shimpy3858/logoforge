import { FILTERS, Opts, f1, mix, rng, scene } from "../shared";

/** 6. Diya: a match strikes, lights the wick, the flame grows, golden glow spreads, small diyas light up, name appears. */
export function diya(o: Opts) {
  const [a, b] = o.colors;
  const gold = mix("#ffc24a", a, 0.2), gold2 = mix("#ffe9a6", b, 0.15);
  const r = rng(14);
  const petals = Array.from({ length: 26 }, () => { const x = 250 + r() * 700, y = 760 + r() * 90; return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(10 + r() * 8)}" ry="${f1(5 + r() * 3)}" transform="rotate(${f1(r() * 180)} ${f1(x)} ${f1(y)})" fill="${r() > 0.5 ? "#f39a1e" : mix("#ff7a1a", a, 0.4)}" opacity=".85"/>`; }).join("");
  const dots = Array.from({ length: 22 }, (_, k) => { const t = (k / 22) * Math.PI * 2; return `<circle class="rd" cx="${f1(600 + Math.cos(t) * 300)}" cy="${f1(790 + Math.sin(t) * 46)}" r="4" fill="${gold}" style="animation-delay:${f1(4.2 + k * 0.05)}s"/>`; }).join("");
  const small = (x: number, y: number, s: number, d: number) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="40" rx="50" ry="8" fill="#000" opacity=".5"/><path d="M-50 0H50C48 34 24 46 0 46S-48 34-50 0Z" fill="#8a3d1f"/><ellipse cx="0" cy="0" rx="50" ry="9" fill="#5a2410"/><g class="sf" style="animation-delay:${d}s"><circle cx="0" cy="-14" r="46" fill="url(#fglow)"/><path d="M0 4C-9 -8-8 -22 0 -36C8 -22 9 -8 0 4Z" fill="#ffd25e"/></g></g>`;
  const flame = (cls: string, sc: number) => `<g class="${cls}"><path d="M0 0C-26 -22-30 -64 0 -118C30 -64 26 -22 0 0Z" fill="url(#fl)" transform="scale(${sc})"/><path d="M0 -4C-11 -16-12 -40 0 -66C12 -40 11 -16 0 -4Z" fill="#fffbe6" transform="scale(${sc})"/><path d="M0 0C-8 -4-10 -12 0 -22C10 -12 8 -4 0 0Z" fill="#6f9bff" opacity=".8" transform="scale(${sc})"/></g>`;
  const svg = `<defs>${FILTERS}
<radialGradient id="fglow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".9"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<linearGradient id="fl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff7a1a"/><stop offset=".5" stop-color="#ffb52e"/><stop offset="1" stop-color="#ffe27a"/></linearGradient>
<linearGradient id="clay" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d0653a"/><stop offset=".6" stop-color="#9a3d1f"/><stop offset="1" stop-color="#5e220f"/></linearGradient>
<radialGradient id="room"><stop offset="0" stop-color="${gold}" stop-opacity=".6"/><stop offset=".5" stop-color="${gold}" stop-opacity=".18"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient>
<linearGradient id="fl2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0d08"/><stop offset="1" stop-color="#070302"/></linearGradient></defs>
<rect x="-3000" y="-3000" width="7200" height="4000" fill="#07040a"/>
<rect x="-3000" y="740" width="7200" height="2200" fill="url(#fl2)"/>
<circle class="room" cx="600" cy="600" r="760" fill="url(#room)" style="mix-blend-mode:screen"/>
${small(300, 700, 0.8, 6.0)}${small(900, 700, 0.8, 6.3)}${small(180, 780, 0.6, 6.6)}${small(1020, 780, 0.6, 6.9)}
<g>${petals}${dots}</g>
<ellipse cx="600" cy="770" rx="210" ry="22" fill="#000" opacity=".6" filter="url(#b8)"/>
<g transform="translate(-130 0)"><g class="dy"><path d="M380 690H820C816 750 740 790 600 790S384 750 380 690Z" fill="url(#clay)"/>
<path d="M800 690C860 690 900 668 930 640C910 690 880 720 820 730Z" fill="url(#clay)"/>
<ellipse cx="600" cy="690" rx="220" ry="26" fill="#3a1608"/><ellipse cx="600" cy="690" rx="200" ry="20" fill="#d9a032" opacity=".85"/><ellipse cx="560" cy="686" rx="90" ry="7" fill="#fff" opacity=".25"/>
<path d="M404 726Q600 770 796 726" stroke="${gold}" stroke-width="4" fill="none" stroke-dasharray="2 14" stroke-linecap="round"/>
<path d="M420 700C470 760 740 760 780 700" stroke="#fff" stroke-opacity=".12" stroke-width="5" fill="none"/>
<path d="M908 646L930 640" stroke="#3a1608" stroke-width="8" stroke-linecap="round"/><circle class="ember" cx="926" cy="640" r="5" fill="#ff7a1a"/></g>
<g class="bigglow" style="mix-blend-mode:screen"><circle cx="926" cy="610" r="260" fill="url(#fglow)"/></g>
<g transform="translate(926 640)"><g class="fgrow">${flame("fl1", 1)}</g></g>
<g class="matchg"><g transform="translate(1250 440) rotate(-38)"><g class="match">
<rect x="-14" y="-3" width="250" height="7" rx="3" fill="#d9b27a"/><ellipse cx="-14" cy="0" rx="10" ry="8" fill="#b3261e"/>
<g transform="translate(-26 0) rotate(-90)">${flame("mf", 0.55)}</g>
<path d="M150 -9H300Q330 -9 330 4Q330 18 300 18H150Z" fill="#0d0807"/><path d="M150 -9H300" stroke="#ffd48a" stroke-opacity=".45" stroke-width="2"/></g></g></g>
<g class="sparks">${Array.from({ length: 16 }, () => `<circle cx="${f1(900 + r() * 60)}" cy="${f1(560 + r() * 60)}" r="${f1(1.2 + r() * 2)}" fill="#ffd27a" style="--dx:${f1((r() - 0.5) * 80)}px;--dy:${f1(-40 - r() * 120)}px;animation-delay:${f1(4.6 + r() * 2)}s"/>`).join("")}</g></g>`;
  const css = `
.matchg{animation:mfly 5.2s ease-in-out both}
@keyframes mfly{0%{transform:translate(0,0)}8%{transform:translate(0,0)}34%{transform:translate(-300px,170px)}46%{transform:translate(-300px,170px)}70%{transform:translate(120px,-60px)}100%{transform:translate(500px,-120px)}}
.mf{transform-origin:0 0;animation:flk .18s ease-in-out infinite alternate}
.mf,.fl1{transform-box:view-box}
.match{animation:mflame 5.2s linear both}.match g g{opacity:0;animation:mon 5.2s step-end both}@keyframes mon{0%,10%{opacity:0}11%,60%{opacity:1}61%,100%{opacity:0}}
@keyframes mflame{from{}to{}}
.ember{animation:emb 4.4s ease-in 0s both}@keyframes emb{0%,40%{opacity:.0}60%,100%{opacity:0}}
.fgrow{transform-origin:0 0;animation:grow 2.4s cubic-bezier(.2,1.4,.3,1) 3.0s both;transform:scale(0)}@keyframes grow{from{transform:scale(0)}60%{transform:scale(1.5)}to{transform:scale(1.3)}}
.fl1{transform-origin:0 0;animation:flk .22s ease-in-out infinite alternate}
@keyframes flk{from{transform:scale(1,1) skewX(-4deg)}50%{transform:scale(.94,1.06) skewX(3deg)}to{transform:scale(1.04,.96) skewX(-2deg)}}
.bigglow{opacity:0;animation:gl 3.5s ease-out 3.1s both}@keyframes gl{to{opacity:1}}
.room{opacity:0;animation:gl 4.5s ease-out 3.2s both}
.rd{opacity:0;animation:gl .8s ease-out both}
.sf{transform-origin:0 0;opacity:0;animation:sfi .9s ease-out both,flk .25s ease-in-out infinite alternate}
@keyframes sfi{from{opacity:0}to{opacity:1}}
.sparks circle{opacity:0;animation:spark 1.6s ease-out infinite}
@keyframes spark{0%{opacity:0;transform:translate(0,0)}20%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy))}}
@keyframes nameIn{from{opacity:0;filter:blur(14px);transform:scale(.9)}to{opacity:1;filter:blur(0) drop-shadow(0 0 24px ${gold}aa);transform:none}}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:.9;transform:none}}`;
  return scene(o, {
    svg, css, top: 24, bg: "#07040a", dur: 9, drift: ["scale(1.03)", "scale(1.09)"],
    brandCss: `.brand{background-image:linear-gradient(95deg,${mix("#ffd98a", a, 0.2)},${gold2},${mix("#ffcf7a", b, 0.25)});animation:nameIn 2s cubic-bezier(.2,.7,.2,1) 5.4s both}.tagline{animation:fadeUp 1.2s ease-out 6.9s both}`,
  });
}
