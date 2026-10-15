import { FILTERS, Opts, esc, f1, mix, rng, scene } from "../shared";

/** 12. Train arrives at a small station at dusk; steam, lit windows; the name lights up on the station board. */
export function train(o: Opts) {
  const [a, b] = o.colors;
  const r = rng(101);
  const coach = (x: number, col: string) => `<g transform="translate(${x} 0)"><rect x="0" y="-150" width="250" height="130" rx="10" fill="${col}"/><rect x="0" y="-48" width="250" height="14" fill="#000" opacity=".3"/><rect x="0" y="-150" width="250" height="10" rx="5" fill="#fff" opacity=".18"/>
${[0, 1, 2, 3].map((k) => `<rect x="${22 + k * 56}" y="-122" width="40" height="46" rx="5" fill="#ffd98a"/><rect x="${22 + k * 56}" y="-122" width="40" height="46" rx="5" fill="url(#wg)"/>`).join("")}
<rect x="-10" y="-34" width="270" height="18" fill="#1a1620"/>${[40, 190].map((w) => `<g transform="translate(${w} -14)"><circle r="22" fill="#15121a"/><circle r="15" fill="#3a3540"/><g class="wh"><path d="M-15 0H15M0 -15V15" stroke="#9a94a8" stroke-width="3"/></g></g>`).join("")}</g>`;
  const puffs = Array.from({ length: 9 }, (_, k) => `<circle class="pf" cx="0" cy="0" r="${f1(16 + r() * 10)}" fill="#f4eef6" style="animation-delay:${f1(k * 0.38)}s;--dx:${f1(40 + r() * 70)}px"/>`).join("");
  const svg = `<defs>${FILTERS}
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e1a4a"/><stop offset=".5" stop-color="${mix("#8a4a86", a, 0.15)}"/><stop offset="1" stop-color="#ff9a5a"/></linearGradient>
<linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#ff9a3c" stop-opacity=".3"/></linearGradient>
<radialGradient id="lg"><stop offset="0" stop-color="#ffd98a" stop-opacity=".9"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>
<linearGradient id="hb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff2c4" stop-opacity=".6"/><stop offset="1" stop-color="#fff2c4" stop-opacity="0"/></linearGradient></defs>
<rect x="-3000" y="-3000" width="7200" height="3900" fill="url(#sky)"/>
<circle cx="300" cy="640" r="260" fill="#ffb066" opacity=".5" filter="url(#b30)"/>
<g>${Array.from({ length: 25 }, () => `<circle cx="${f1(-300 + r() * 1800)}" cy="${f1(-200 + r() * 450)}" r="${f1(0.6 + r() * 1.2)}" fill="#fff" opacity=".6"/>`).join("")}</g>
<g class="h1"><path d="M-1500 640C-1100 560-800 600-500 620S100 560 500 600 1100 560 1500 610 2300 570 2800 620V780H-1500Z" fill="#4a3366"/></g>
<g class="h2"><path d="M-1500 680C-1000 630-700 660-300 670S300 630 700 660 1300 630 1800 670 2400 650 2800 680V780H-1500Z" fill="#2c2147"/></g>
<g class="stn"><path d="M180 300H1020L990 270H210Z" fill="#2a1f3d"/><rect x="180" y="300" width="840" height="14" fill="#3a2c52"/>
<g fill="#241a38">${[230, 430, 770, 970].map((x) => `<rect x="${x}" y="314" width="12" height="340"/>`).join("")}</g>
<rect x="150" y="650" width="900" height="70" fill="#3b3050"/><rect x="150" y="650" width="900" height="8" fill="#5a4a78"/>
<g>${[260, 600, 940].map((x) => `<g><rect x="${x}" y="330" width="4" height="320" fill="#1c1430"/><circle cx="${x + 2}" cy="334" r="12" fill="#fff0c0"/><circle class="lm" cx="${x + 2}" cy="334" r="70" fill="url(#lg)"/></g>`).join("")}</g></g>
<rect x="-3000" y="720" width="7200" height="2200" fill="#150f22"/>
<g stroke="#4a3f63" stroke-width="6"><path d="M-3000 742H4200"/></g><g stroke="#2a2040" stroke-width="12">${Array.from({ length: 60 }, (_, k) => `<path d="M${-1400 + k * 62} 760H${-1370 + k * 62}"/>`).join("")}</g>
<g class="tr"><g transform="translate(0 738)">
<g transform="translate(-290 0)">${coach(0, mix("#b8352f", a, 0.3))}</g>
${coach(-10, mix("#2d6ea8", b, 0.3))}
<g transform="translate(270 0)">
<rect x="0" y="-100" width="190" height="64" rx="30" fill="#2a2630"/><rect x="0" y="-100" width="190" height="64" rx="30" fill="url(#hb)" opacity=".15"/>
<rect x="-20" y="-150" width="110" height="114" rx="8" fill="#1d1a24"/><rect x="-10" y="-136" width="64" height="44" rx="4" fill="#ffd98a"/><rect x="-20" y="-160" width="130" height="14" rx="4" fill="${a}"/>
<rect x="132" y="-142" width="30" height="46" rx="4" fill="#111"/><rect x="124" y="-152" width="46" height="12" rx="3" fill="#111"/>
<ellipse cx="108" cy="-104" rx="22" ry="16" fill="#3a3540"/>
<path d="M190 -90L226 -26H190Z" fill="#14111a"/><circle cx="188" cy="-72" r="11" fill="#fff4c4"/><path d="M190 -72L1200 -150V20Z" fill="url(#hb)" class="hl"/>
<rect x="0" y="-34" width="190" height="18" fill="#14111a"/><rect x="0" y="-60" width="190" height="6" fill="${b}"/>
${[26, 90, 150].map((w, k) => `<g transform="translate(${w} -14)"><circle r="${k === 1 ? 28 : 24}" fill="#15121a"/><circle r="${k === 1 ? 20 : 16}" fill="#3a3540"/><g class="wh"><path d="M-18 0H18M0 -18V18" stroke="#9a94a8" stroke-width="3"/></g></g>`).join("")}
<g transform="translate(147 -152)">${puffs}</g></g></g></g>
<g class="brk" fill="#fff">${Array.from({ length: 6 }, (_, k) => `<circle cx="${f1(220 + k * 100)}" cy="728" r="${f1(14 + r() * 12)}" style="animation-delay:${f1(4.6 + k * 0.1)}s"/>`).join("")}</g>`;
  const brd = `<div class="brd"><i class="ch l"></i><i class="ch r"></i><div class="lampl"></div><div class="lampr"></div><div class="plate"><h1 class="bn">${esc(o.brand)}</h1>${o.tagline ? `<p class="bt">${esc(o.tagline)}</p>` : ""}</div></div>`;
  const css = `
.h1{animation:p1 6s cubic-bezier(.3,.3,.3,1) .3s both}.h2{animation:p2 6s cubic-bezier(.3,.3,.3,1) .3s both}.stn{animation:p3 6s cubic-bezier(.3,.3,.3,1) .3s both}
@keyframes p1{from{transform:translateX(80px)}}@keyframes p2{from{transform:translateX(200px)}}@keyframes p3{from{transform:translateX(400px)}}
.tr{animation:arrive 5.2s cubic-bezier(.12,.6,.25,1) .3s both}@keyframes arrive{from{transform:translateX(-1500px)}to{transform:translateX(120px)}}
.wh{animation:spinw 5.2s cubic-bezier(.12,.6,.25,1) .3s both}@keyframes spinw{from{transform:rotate(0)}to{transform:rotate(3000deg)}}
.pf{opacity:0;animation:puff 3.4s ease-out infinite}@keyframes puff{0%{opacity:0;transform:translate(0,0) scale(.4)}15%{opacity:.85}100%{opacity:0;transform:translate(calc(var(--dx)*-1),-190px) scale(3)}}
.hl{opacity:0;animation:hlo 1s ease-out .3s both}@keyframes hlo{to{opacity:.5}}
.brk circle{opacity:0;transform-box:fill-box;transform-origin:center;animation:brk 2.6s ease-out both}@keyframes brk{0%{opacity:0;transform:scale(.3)}25%{opacity:.8}100%{opacity:0;transform:scale(2.6) translateY(-30px)}}
.lm{animation:lmp 5s ease-in-out infinite alternate}@keyframes lmp{from{opacity:.8}to{opacity:1}}
.brd{position:relative;display:inline-block;margin-top:0}.ch,.lampl,.lampr{opacity:0;animation:fi .5s ease-out 5.1s forwards}@keyframes fi{to{opacity:1}}
.ch{position:absolute;top:-70px;width:3px;height:70px;background:#2a2040}.ch.l{left:14%}.ch.r{right:14%}
.lampl,.lampr{position:absolute;top:-14px;width:46px;height:16px;border-radius:8px;background:#3a2c52}.lampl{left:-8px}.lampr{right:-8px}
.plate{position:relative;padding:.35em 1em .45em;border-radius:10px;background:linear-gradient(180deg,#1b3b5a,#0f2438);border:3px solid #f4f1e8;outline:2px solid #0f2438;outline-offset:-9px;box-shadow:0 0 0 0 transparent;transform-origin:50% -70px;opacity:0;animation:lit2 1.3s linear 5.1s forwards,swing 3s ease-out 5.2s both}
.bn{font-size:clamp(24px,min(7vw,9.5vh),84px);line-height:1.1;color:#fff;text-shadow:0 0 .25em rgba(255,230,160,.6);overflow-wrap:anywhere;font-weight:inherit}
.bt{font-size:clamp(12px,min(2.4vw,3.2vh),22px);letter-spacing:.2em;color:${mix("#ffd98a", b, 0.2)};margin-top:.15em;text-transform:uppercase}
@keyframes lit2{0%{opacity:0}12%{opacity:1}20%{opacity:.2}32%{opacity:1}42%{opacity:.5}55%,100%{opacity:1;box-shadow:0 0 50px 8px rgba(255,214,140,.35)}}
@keyframes swing{0%{transform:rotate(3deg)}30%{transform:rotate(-2deg)}60%{transform:rotate(1deg)}100%{transform:rotate(0)}}`;
  return scene(o, { svg, css, top: 36, bg: "#150f22", dur: 9, drift: ["scale(1.05)", "scale(1)"], titleHtml: brd });
}
