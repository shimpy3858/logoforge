import { FILTERS, Opts, f1, mix, rng, scene } from "../shared";

/** 7. Lighthouse: night sea, beam sweeps over waves, a boat passes, the beam settles on the name and reveals it. */
export function lighthouse(o: Opts) {
  const [a, b] = o.colors;
  const r = rng(40);
  const beam = mix("#fff2c4", a, 0.12);
  const stars = Array.from({ length: 60 }, () => `<circle cx="${f1(-300 + r() * 1800)}" cy="${f1(-200 + r() * 700)}" r="${f1(0.7 + r() * 1.5)}" fill="#fff" style="animation:tw ${f1(1.5 + r() * 2.5)}s ease-in-out ${f1(-r() * 3)}s infinite alternate"/>`).join("");
  const wave = (y: number, amp: number, col: string, cls: string, op: number) => {
    let d = `M-1800 ${y}`; for (let x = -1800; x < 3000; x += 150) d += `q75 ${-amp} 150 0`; 
    return `<g class="${cls}"><path d="${d}V1200H-1800Z" fill="${col}" opacity="${op}"/></g>`;
  };
  const svg = `<defs>${FILTERS}
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#02040e"/><stop offset=".7" stop-color="#0a1633"/><stop offset="1" stop-color="#16294f"/></linearGradient>
<linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#112447"/><stop offset="1" stop-color="#030611"/></linearGradient>
<linearGradient id="bm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${beam}" stop-opacity=".95"/><stop offset=".5" stop-color="${beam}" stop-opacity=".28"/><stop offset="1" stop-color="${beam}" stop-opacity=".04"/></linearGradient>
<linearGradient id="bml" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="${beam}" stop-opacity=".95"/><stop offset=".5" stop-color="${beam}" stop-opacity=".28"/><stop offset="1" stop-color="${beam}" stop-opacity=".04"/></linearGradient>
<radialGradient id="lg"><stop offset="0" stop-color="#fffbe8"/><stop offset=".3" stop-color="${beam}" stop-opacity=".7"/><stop offset="1" stop-color="${beam}" stop-opacity="0"/></radialGradient>
<clipPath id="tw"><path d="M286 760L314 400H346L374 760Z"/></clipPath></defs>
<rect x="-3000" y="-3000" width="7200" height="3700" fill="url(#sky)"/>${stars}
<circle cx="900" cy="150" r="46" fill="#e8efff" opacity=".9"/><circle cx="900" cy="150" r="120" fill="#9db6ff" opacity=".12" filter="url(#b16)"/>
<rect x="-3000" y="600" width="7200" height="2400" fill="url(#sea)"/>
<ellipse cx="900" cy="640" rx="60" ry="8" fill="#e8efff" opacity=".25" filter="url(#b4)"/>
${wave(620, 10, "#16305a", "w1", 0.7)}
<g class="boat"><g class="bob"><path d="M-70 0H70L50 26H-48Z" fill="#0b0f1d"/><path d="M-4 -90V-6L52 -6Z" fill="#cfd6e6" opacity=".85" class="sail"/><path d="M-10 -92V-6L-56 -6Z" fill="#aab3c9" opacity=".8"/><rect x="-6" y="-100" width="3" height="100" fill="#0b0f1d"/><rect x="18" y="-22" width="14" height="14" fill="#ffcf6e"/><circle cx="25" cy="-15" r="26" fill="#ffcf6e" opacity=".25" filter="url(#b4)"/></g></g>
${wave(660, 14, "#0c2044", "w2", 0.85)}
<g class="beams">
<g class="bR"><path d="M330 365L3400 -100L3400 900Z" fill="url(#bm)" filter="url(#b4)"/><ellipse cx="900" cy="640" rx="560" ry="40" fill="${beam}" opacity=".25" filter="url(#b8)"/></g>
<g class="bL"><path d="M330 365L-2600 -100L-2600 900Z" fill="url(#bml)" filter="url(#b4)"/><ellipse cx="-200" cy="640" rx="560" ry="40" fill="${beam}" opacity=".25" filter="url(#b8)"/></g></g>
${wave(700, 18, "#071530", "w3", 0.95)}
<path d="M200 800L240 690L290 640L340 660L400 640L460 700L500 800Z" fill="#06080f"/>
<ellipse cx="330" cy="770" rx="220" ry="14" fill="#fff" opacity=".07" filter="url(#b4)"/>
<g clip-path="url(#tw)"><rect x="280" y="400" width="100" height="360" fill="#eceff6"/><g fill="${mix("#d92b2b", a, 0.35)}"><rect x="280" y="440" width="100" height="44"/><rect x="280" y="528" width="100" height="44"/><rect x="280" y="616" width="100" height="44"/><rect x="280" y="704" width="100" height="44"/></g><rect x="280" y="400" width="100" height="360" fill="#000" opacity=".28"/><rect x="280" y="400" width="30" height="360" fill="#fff" opacity=".1"/></g>
<rect x="298" y="390" width="64" height="10" fill="#2a3040"/><rect x="312" y="338" width="36" height="52" fill="#fff6cf"/>
<path d="M306 340L330 306L354 340Z" fill="${mix("#8a2020", a, 0.3)}"/><rect x="328" y="296" width="4" height="12" fill="#2a3040"/>
<path d="M312 338V390M330 338V390M348 338V390" stroke="#2a3040" stroke-width="3"/>
<circle class="lamp" cx="330" cy="365" r="110" fill="url(#lg)" style="mix-blend-mode:screen"/>`;
  const css = `
.w1{animation:wv 7s ease-in-out infinite alternate}.w2{animation:wv 5s ease-in-out -2s infinite alternate-reverse}.w3{animation:wv 4s ease-in-out -1s infinite alternate}
@keyframes wv{from{transform:translateX(-60px)}to{transform:translateX(60px)}}
@keyframes tw{from{opacity:.2}to{opacity:1}}
.bR{transform-origin:330px 365px;transform:scaleX(0);animation:sw 2.6s ease-in-out .8s 2,fin 1.6s cubic-bezier(.3,.1,.2,1) 6s forwards}
.bL{transform-origin:330px 365px;transform:scaleX(0);animation:swl 2.6s ease-in-out .8s 2,fin0 1s ease-out 6s forwards}
@keyframes sw{0%{transform:scaleX(0)}50%{transform:scaleX(1)}100%{transform:scaleX(0)}}
@keyframes swl{0%{transform:scaleX(1)}50%{transform:scaleX(0)}100%{transform:scaleX(1)}}
@keyframes fin{from{transform:scaleX(0)}to{transform:scaleX(1)}}@keyframes fin0{to{transform:scaleX(0)}}
.lamp{animation:pulse 1.3s ease-in-out infinite alternate}@keyframes pulse{from{opacity:.75}to{opacity:1}}
.boat{animation:sail 8s linear .6s both}@keyframes sail{from{transform:translate(1500px,630px)}to{transform:translate(-300px,630px)}}
.bob{animation:bb 1.8s ease-in-out infinite alternate}@keyframes bb{from{transform:rotate(-3deg) translateY(0)}to{transform:rotate(3deg) translateY(5px)}}
@keyframes reveal{from{clip-path:inset(-20% 100% -20% 0);opacity:1}to{clip-path:inset(-20% -2% -20% 0);opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:.9;transform:none}}`;
  return scene(o, {
    svg, css, top: 46, bg: "#071530", dur: 9, drift: ["scale(1.02)", "scale(1.07)"],
    brandCss: `.title{left:63%;width:min(64vw,56%)}.brand{background-image:linear-gradient(95deg,${mix("#fff2c4", a, 0.35)},${mix("#ffffff", b, 0.3)});clip-path:inset(-20% 100% -20% 0);animation:reveal 1.9s cubic-bezier(.3,.1,.2,1) 6s forwards}.tagline{opacity:0;animation:fadeUp 1.1s ease-out 7.6s forwards}`,
  });
}
