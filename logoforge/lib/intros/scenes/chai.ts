import { FILTERS, Opts, f1, mix, rng, scene } from "../shared";

/** 5. Chai: kettle tilts and pours into a glass, steam rises and curls into the name. */
export function chai(o: Opts) {
  const [a, b] = o.colors;
  const r = rng(8);
  const bokeh = Array.from({ length: 16 }, () => `<circle cx="${f1(-200 + r() * 1600)}" cy="${f1(r() * 520)}" r="${f1(14 + r() * 40)}" fill="${r() > 0.5 ? "#ffb25a" : mix("#ff8a3c", a, 0.4)}" opacity="${f1(0.08 + r() * 0.16)}" filter="url(#b8)" style="animation:bk ${f1(3 + r() * 4)}s ease-in-out ${f1(-r() * 4)}s infinite alternate"/>`).join("");
  const wisp = (x: number, d: number, delay: number, w: number) =>
    `<path class="wsp" pathLength="1" d="M${x} 560C${x - 40} 500 ${x + 50} 440 ${x - 10} 380S${x + 40} 280 ${x} 230" style="animation-delay:${delay}s;stroke-width:${w}"/>`;
  const svg = `<defs>${FILTERS}
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b0d08"/><stop offset=".7" stop-color="#2d150b"/><stop offset="1" stop-color="#120804"/></linearGradient>
<linearGradient id="tea" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a4a1e"/><stop offset=".5" stop-color="#c98a4c"/><stop offset="1" stop-color="#7a3d17"/></linearGradient>
<linearGradient id="steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6e7380"/><stop offset=".35" stop-color="#e9edf4"/><stop offset=".7" stop-color="#9aa0ad"/><stop offset="1" stop-color="#555a66"/></linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".25" stop-color="#fff" stop-opacity=".04"/><stop offset=".8" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity=".3"/></linearGradient>
<linearGradient id="wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a2a15"/><stop offset="1" stop-color="#1c0e06"/></linearGradient>
<radialGradient id="lamp"><stop offset="0" stop-color="#ffb35a" stop-opacity=".5"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></radialGradient>
<clipPath id="gl"><path d="M545 590L655 590L644 738Q600 748 556 738Z"/></clipPath></defs>
<rect x="-3000" y="-3000" width="7200" height="3900" fill="url(#bg)"/>${bokeh}
<ellipse cx="600" cy="560" rx="620" ry="420" fill="url(#lamp)"/>
<rect x="-3000" y="740" width="7200" height="2200" fill="url(#wood)"/><path d="M-3000 740H4200" stroke="#ffb25a" stroke-opacity=".35" stroke-width="3"/>
<path d="M-3000 800H4200M-3000 860H4200" stroke="#000" stroke-opacity=".3" stroke-width="2"/>
<ellipse cx="600" cy="752" rx="150" ry="18" fill="#000" opacity=".55" filter="url(#b8)"/>
<ellipse cx="600" cy="746" rx="130" ry="16" fill="#e8dcc8"/><ellipse cx="600" cy="742" rx="108" ry="11" fill="#cdbfa6"/>
<g class="steam" fill="none" stroke="#fff" stroke-linecap="round" filter="url(#b8)">${wisp(590, 0, 3.7, 14)}${wisp(615, 0, 4.1, 11)}${wisp(600, 0, 4.5, 16)}</g>
<g class="kettle"><g transform="translate(250 330)"><g class="tilt">
<path d="M0 -20C-60 -20 -86 20 -86 80C-86 130 -50 150 0 150C50 150 86 130 86 80C86 20 60 -20 0 -20Z" fill="url(#steel)"/>
<ellipse cx="0" cy="-20" rx="48" ry="12" fill="#c9ced8"/><circle cx="0" cy="-34" r="9" fill="#2a2c33"/>
<path d="M70 60C110 70 150 50 186 6L196 16C160 74 110 100 70 100Z" fill="url(#steel)"/>
<path d="M-60 0C-130 -40 -120 130 -62 100" stroke="#2a2c33" stroke-width="12" fill="none" stroke-linecap="round"/>
<path d="M-50 30C-60 70 -50 110 -30 130" stroke="#fff" stroke-opacity=".5" stroke-width="6" fill="none" stroke-linecap="round"/></g></g></g>
<path class="stream" pathLength="1" d="M436 336C500 346 548 400 596 590" fill="none" stroke="#c98a4c" stroke-width="9" stroke-linecap="round"/>
<path class="stream s2" pathLength="1" d="M436 336C500 346 548 400 596 590" fill="none" stroke="#f0c68c" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>
<g clip-path="url(#gl)"><rect class="tealvl" x="540" y="590" width="120" height="160" fill="url(#tea)"/><ellipse class="foam" cx="600" cy="590" rx="55" ry="7" fill="#f0d3a6"/></g>
<path d="M545 590L655 590L644 738Q600 748 556 738Z" fill="url(#glass)" stroke="#fff" stroke-opacity=".5" stroke-width="2.5"/>
<ellipse cx="600" cy="590" rx="55" ry="8" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2.5"/>
<path d="M556 604L566 724" stroke="#fff" stroke-opacity=".5" stroke-width="5" stroke-linecap="round"/>
<g fill="${mix("#ffcf8a", b, 0.25)}">${Array.from({ length: 10 }, (_, k) => `<circle cx="${f1(300 + r() * 600)}" cy="${f1(150 + r() * 420)}" r="${f1(1 + r() * 2)}" opacity=".5" style="animation:tw ${f1(2 + r() * 2)}s ease-in-out ${f1(-r() * 2)}s infinite alternate"/>`).join("")}</g>`;
  const css = `
.tilt{animation:pour 8s cubic-bezier(.45,0,.3,1) both}
@keyframes pour{0%,6%{transform:translate(-140px,-90px) rotate(0)}20%{transform:translate(0,0) rotate(0)}30%{transform:translate(0,0) rotate(30deg)}58%{transform:translate(0,0) rotate(30deg)}70%{transform:translate(0,0) rotate(0)}85%,100%{transform:translate(-260px,-120px) rotate(0)}}
.kettle{animation:kfade 8s linear both}@keyframes kfade{0%{opacity:0}5%,86%{opacity:1}100%{opacity:0}}
.stream{stroke-dasharray:1 2;stroke-dashoffset:1;opacity:0;animation:flow 8s linear both}.stream.s2{animation-name:flow2}
@keyframes flow{0%,29.9%{stroke-dashoffset:1;opacity:0}30%{opacity:1}34%{stroke-dashoffset:0}57%{stroke-dashoffset:0;opacity:1}61%{stroke-dashoffset:-.6;opacity:1}62%,100%{stroke-dashoffset:-1;opacity:0}}
@keyframes flow2{0%,29.9%{stroke-dashoffset:1;opacity:0}30%{opacity:1}34%{stroke-dashoffset:0}57%{stroke-dashoffset:0;opacity:1}61%{stroke-dashoffset:-.6}62%,100%{stroke-dashoffset:-1;opacity:0}}
.tealvl{transform-origin:600px 750px;animation:fill 3s cubic-bezier(.3,.1,.3,1) 2.8s both;transform:scaleY(0)}
@keyframes fill{from{transform:scaleY(0)}to{transform:scaleY(.8)}}
.foam{animation:foam 3s cubic-bezier(.3,.1,.3,1) 2.8s both;transform:translateY(150px)}
@keyframes foam{from{transform:translateY(150px)}to{transform:translateY(0)}}
.steam path{stroke-dasharray:1;stroke-dashoffset:1;opacity:0;stroke-opacity:.55;animation:rise 3.4s ease-out both}
@keyframes rise{0%{stroke-dashoffset:1;opacity:0}20%{opacity:.8}100%{stroke-dashoffset:0;opacity:.28}}
@keyframes bk{from{transform:translateY(0);opacity:.5}to{transform:translateY(-14px);opacity:1}}@keyframes tw{from{opacity:.1}to{opacity:.8}}
@keyframes steamName{0%{opacity:0;filter:blur(22px);transform:translateY(60px) scale(.96);}100%{opacity:1;filter:blur(0);transform:none}}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:.85;transform:none}}`;
  return scene(o, {
    svg, css, top: 17, bg: "#120804", dur: 9, drift: ["scale(1.05)", "scale(1)"],
    brandCss: `.brand{background-image:linear-gradient(95deg,${mix("#ffe3bd", a, 0.3)},${mix("#fff3dd", b, 0.3)});animation:steamName 2.6s cubic-bezier(.2,.7,.2,1) 5.3s both}.tagline{animation:fadeUp 1.2s ease-out 7.2s both}`,
  });
}
