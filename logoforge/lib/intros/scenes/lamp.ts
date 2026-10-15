import { FILTERS, Opts, f1, mix, rng, scene } from "../shared";

/** 1. Lamp pull: dark room, a person walks in, pulls the cord, the lamp flickers on, dust floats in the beam, name appears in the light. */
export function lamp(o: Opts) {
  const [a, b] = o.colors;
  const warm = mix("#ffd98c", a, 0.18), warm2 = mix("#fff3cf", b, 0.12);
  const r = rng(11);
  // dust only inside the cone: half width grows from 40 (y=335) to 330 (y=760)
  const dust = Array.from({ length: 34 }, () => {
    const y = 360 + r() * 380, hw = 40 + ((y - 335) / 425) * 290, x = 600 + (r() * 2 - 1) * hw * 0.92;
    const s = 1 + r() * 2.4;
    return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(s)}" fill="#fff1c9" opacity="${f1(0.35 + r() * 0.55)}" ${s > 2.2 ? 'filter="url(#b2)"' : ""} style="--dx:${f1((r() - 0.5) * 60)}px;--dy:${f1((r() - 0.5) * 70)}px;animation:dust ${f1(5 + r() * 5)}s ease-in-out ${f1(-r() * 6)}s infinite alternate,tw ${f1(2 + r() * 3)}s ease-in-out ${f1(-r() * 3)}s infinite alternate"/>`;
  }).join("");
  // legs / arms: shapes are drawn once, rotated by CSS around the hip / shoulder (origin 0 0)
  const leg = (cls: string, fill: string) =>
    `<g transform="translate(0 -150)"><g class="${cls}"><path class="ps" d="M-11 -4H11L9 82H-9Z" fill="${fill}"/><g transform="translate(0 80)"><g class="${cls}k"><path class="ps" d="M-9 0H9L7 70H-7Z" fill="${fill}"/><path class="ps" d="M-8 66H22Q27 70 26 76H-8Z" fill="${fill}"/></g></g></g></g>`;
  const arm = (cls: string, wcls: string, fill: string, hand = false) =>
    `<g transform="translate(-4 -258)"><g class="${cls}"><g class="${wcls}"><path class="ps" d="M-8 -6H8L7 62H-7Z" fill="${fill}"/><g transform="translate(0 60)"><path class="ps" d="M-7 0H7L6 56H-6Z" fill="${fill}"/>${hand ? '<circle class="ps" cx="0" cy="60" r="9" fill="#0a0b11"/>' : '<circle class="ps" cx="0" cy="58" r="8" fill="#0a0b11"/>'}</g></g></g></g>`;
  const person = `<g class="person"><g transform="translate(540 760)">
<ellipse cx="0" cy="2" rx="62" ry="9" fill="#000" opacity=".55"/>
<g class="bob">
${leg("legB", "#080910")}${arm("armB", "armBw", "#090a10")}
<path class="ps" d="M-30 -150C-36 -210-32 -256-14 -276L20 -276C36 -256 40 -210 32 -150Z" fill="#0b0c13"/>
<rect class="ps" x="-6" y="-292" width="18" height="22" rx="6" fill="#0a0b11"/>
<g class="head"><circle class="ps" cx="3" cy="-312" r="27" fill="#0b0c13"/><path class="ps" d="M26 -312Q40 -308 28 -300Z" fill="#0b0c13"/><path d="M-22 -322C-18 -346 18 -348 28 -326C10 -334-8 -332-22 -322Z" fill="#05060a"/></g>
${leg("legF", "#0c0d15")}${arm("armF", "armFw", "#0c0d15", true)}
</g></g></g>`;
  const svg = `<defs>${FILTERS}
<linearGradient id="cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${warm2}" stop-opacity=".9"/><stop offset=".55" stop-color="${warm}" stop-opacity=".28"/><stop offset="1" stop-color="${warm}" stop-opacity=".1"/></linearGradient>
<radialGradient id="pool"><stop offset="0" stop-color="${warm}" stop-opacity=".75"/><stop offset="1" stop-color="${warm}" stop-opacity="0"/></radialGradient>
<radialGradient id="wallg"><stop offset="0" stop-color="${warm}" stop-opacity=".34"/><stop offset="1" stop-color="${warm}" stop-opacity="0"/></radialGradient>
<radialGradient id="bulbg"><stop offset="0" stop-color="#fffbe8"/><stop offset=".4" stop-color="${warm2}" stop-opacity=".9"/><stop offset="1" stop-color="${warm}" stop-opacity="0"/></radialGradient>
<linearGradient id="shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2b2f3f"/><stop offset=".55" stop-color="#171a26"/><stop offset="1" stop-color="#0d0f17"/></linearGradient>
<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#11131b"/><stop offset="1" stop-color="#05060a"/></linearGradient>
<pattern id="paper" width="90" height="90" patternUnits="userSpaceOnUse"><rect width="90" height="90" fill="#0c0e16"/><path d="M45 0V90" stroke="#161926" stroke-width="2"/></pattern></defs>
<rect x="-3000" y="-3000" width="7200" height="3700" fill="url(#paper)"/>
<rect x="-3000" y="700" width="7200" height="2500" fill="url(#floor)"/>
<rect x="-3000" y="690" width="7200" height="14" fill="#1a1d29"/>
<g stroke="#0a0b11" stroke-width="3" opacity=".9"><path d="M-3000 745H4200M-3000 800H4200M-3000 870H4200"/></g>
<g class="lit"><ellipse cx="600" cy="520" rx="640" ry="460" fill="url(#wallg)" style="mix-blend-mode:screen"/>
<ellipse cx="600" cy="758" rx="420" ry="64" fill="url(#pool)"/>
<path d="M-3000 745H4200M-3000 800H4200M-3000 870H4200" stroke="#2a2118" stroke-width="3" opacity=".7"/></g>
<g class="lampg"><line x1="600" y1="-3000" x2="600" y2="236" stroke="#1b1d29" stroke-width="5"/>
<line x1="654" y1="250" x2="654" y2="330" stroke="#1b1d29" stroke-width="3"/>
<g class="pull"><line x1="654" y1="330" x2="654" y2="528" stroke="#2a2e3d" stroke-width="3"/><circle cx="654" cy="536" r="9" fill="#3a3f52"/><path d="M654 545L648 566M654 545L654 570M654 545L660 566" stroke="#3a3f52" stroke-width="3" stroke-linecap="round"/></g>
<g class="lit"><path d="M560 338L640 338L690 776L510 776Z" fill="none"/></g>
<rect x="590" y="214" width="20" height="22" rx="4" fill="#2a2e3d"/>
<path d="M512 344C512 270 556 236 600 236C644 236 688 270 688 344Z" fill="url(#shade)"/>
<path d="M526 330C530 280 560 250 600 248" stroke="#fff" stroke-opacity=".16" stroke-width="4" fill="none" stroke-linecap="round"/>
<rect x="508" y="340" width="184" height="9" rx="4.5" fill="#3a3f52"/>
<g class="lit"><path d="M508 348H692" stroke="${warm2}" stroke-width="3" opacity=".9" filter="url(#b2)"/></g>
<g class="lit"><path d="M556 349L644 349L${600 + 330} 776L${600 - 330} 776Z" fill="url(#cone)" filter="url(#b4)"/></g>
<g class="lit"><circle cx="600" cy="354" r="86" fill="url(#bulbg)"/><circle cx="600" cy="352" r="19" fill="#fffbe9"/></g>
<g class="lit dustg">${dust}</g></g>
${person}`;
  const css = `
.lit{animation:flick 1.9s linear 3.35s both;opacity:0}
.lampg{transform-origin:600px 0;animation:swing 5s ease-out 3.25s both}
.pull{animation:pullc 1s cubic-bezier(.2,.8,.3,1) 3.0s both}
.person{animation:pwalk 8.5s both}
.bob{animation:bob .6s ease-in-out .3s 4,bob .6s ease-in-out 4.4s 4}
.legF{animation:stepA .6s linear .3s 4 both,stepA .6s linear 4.4s 4 both}.legFk{animation:kneeA .6s linear .3s 4 both,kneeA .6s linear 4.4s 4 both}
.legB{animation:stepB .6s linear .3s 4 both,stepB .6s linear 4.4s 4 both}.legBk{animation:kneeB .6s linear .3s 4 both,kneeB .6s linear 4.4s 4 both}
.armFw{animation:stepB .6s linear .3s 4 both,stepB .6s linear 4.4s 4 both}
.armBw{animation:stepA .6s linear .3s 4 both,stepA .6s linear 4.4s 4 both}
.armF{animation:reach 8.5s both}
.head{transform-origin:3px -290px;animation:look 8.5s both}
.ps{stroke:#ffd48a;stroke-width:2;stroke-opacity:0;animation:rim 1s ease-out 3.6s both}
@keyframes pwalk{0%,3.5%{transform:translateX(-640px);animation-timing-function:cubic-bezier(.3,.4,.45,1)}31.8%,51.8%{transform:translateX(0);animation-timing-function:cubic-bezier(.5,0,.8,.6)}80%,100%{transform:translateX(980px)}}
@keyframes bob{0%,100%{transform:translateY(0)}25%,75%{transform:translateY(-5px)}50%{transform:translateY(0)}}
@keyframes stepA{0%,100%{transform:rotate(0)}25%{transform:rotate(26deg)}75%{transform:rotate(-26deg)}}
@keyframes stepB{0%,100%{transform:rotate(0)}25%{transform:rotate(-26deg)}75%{transform:rotate(26deg)}}
@keyframes kneeA{0%,100%{transform:rotate(0)}25%{transform:rotate(-4deg)}50%{transform:rotate(-38deg)}75%{transform:rotate(-4deg)}}
@keyframes kneeB{0%,100%{transform:rotate(0)}25%{transform:rotate(-4deg)}50%{transform:rotate(-38deg)}75%{transform:rotate(-4deg)}}
@keyframes reach{0%,31%{transform:rotate(0)}35.5%,35.8%{transform:rotate(-90deg)}39.5%{transform:rotate(-60deg)}43%,45%{transform:rotate(-92deg)}49%,100%{transform:rotate(0)}}
@keyframes look{0%,31%{transform:rotate(0)}38%,48%{transform:rotate(-9deg)}56%,100%{transform:rotate(0)}}
@keyframes pullc{0%{transform:translateY(0)}35%{transform:translateY(46px)}60%{transform:translateY(-8px)}80%{transform:translateY(3px)}100%{transform:translateY(0)}}
@keyframes swing{0%{transform:rotate(0)}12%{transform:rotate(1.7deg)}30%{transform:rotate(-1.3deg)}50%{transform:rotate(.8deg)}72%{transform:rotate(-.4deg)}100%{transform:rotate(0)}}
@keyframes flick{0%{opacity:0}6%{opacity:.9}11%{opacity:.08}19%{opacity:1}26%{opacity:.3}34%{opacity:.85}41%{opacity:.15}52%,100%{opacity:1}}
@keyframes rim{from{stroke-opacity:0}to{stroke-opacity:.5}}
@keyframes dust{from{transform:translate(0,0)}to{transform:translate(var(--dx),var(--dy))}}
@keyframes tw{from{opacity:.25}to{opacity:1}}
@keyframes nameIn{from{opacity:0;filter:blur(16px) drop-shadow(0 0 0 transparent);letter-spacing:.09em}to{opacity:1;filter:blur(0) drop-shadow(0 0 22px ${mix(warm, "#ff9a3c", 0.4)}88);letter-spacing:-.01em}}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:.85;transform:none}}`;
  return scene(o, {
    svg, css, top: 58, bg: "#06070c", dur: 9, drift: ["scale(1.02)", "scale(1.08)"],
    brandCss: `.brand{background-image:linear-gradient(95deg,${mix(a, "#ffe6a6", 0.6)},${mix(b, "#fff6da", 0.55)});animation:nameIn 1.8s cubic-bezier(.2,.7,.2,1) 5.2s both}.tagline{animation:fadeUp 1.2s ease-out 6.2s both}`,
  });
}
