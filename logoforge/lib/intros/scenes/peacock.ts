import { FILTERS, Opts, f1, mix, rng, scene, vivid } from "../shared";

/** 2. Rainy peacock: rainy dusk, ripples, lightning, a peacock dances and opens a shimmering fan, name appears below. */
export function rainyPeacock(o: Opts) {
  const [a, b] = o.colors;
  const fa = vivid(a, 0.22), fb = vivid(b, 0.22);
  const r = rng(5);
  const rainFar = Array.from({ length: 46 }, () => { const x = -500 + r() * 2200, y = -200 + r() * 1100; return `<path d="M${f1(x)} ${f1(y)}l-6 34" style="animation-delay:${f1(-r() * 1.2)}s"/>`; }).join("");
  const rainNear = Array.from({ length: 30 }, () => { const x = -500 + r() * 2200, y = -200 + r() * 1100; return `<path d="M${f1(x)} ${f1(y)}l-11 62" style="animation-delay:${f1(-r() * 0.7)}s"/>`; }).join("");
  const ripples = Array.from({ length: 22 }, () => { const x = -300 + r() * 1800, y = 720 + r() * 160, s = 0.5 + (y - 720) / 160; return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(30 * s)}" ry="${f1(7 * s)}" style="animation-delay:${f1(-r() * 1.4)}s"/>`; }).join("");
  const trees = (base: number, n: number, seed: number, fill: string, hmin: number, hmax: number) => {
    const q = rng(seed); let d = `M-1500 ${base}`;
    for (let k = 0; k < n; k++) { const x = -1500 + (k * 4200) / n, h = hmin + q() * (hmax - hmin), w = 60 + q() * 70; d += `L${f1(x)} ${base}L${f1(x + w * 0.5)} ${f1(base - h)}L${f1(x + w)} ${base}`; }
    return `<path d="${d}L2800 ${base}V${base + 60}H-1500Z" fill="${fill}"/>`;
  };
  // one feather points up from the fan centre; CSS rotates it into the fan
  const N = 19;
  const feathers = Array.from({ length: N }, (_, k) => {
    const ang = -84 + (k * 168) / (N - 1), d = Math.abs(k - (N - 1) / 2);
    const len = 1 - Math.abs(ang) / 420;
    return { ang, d, len };
  }).sort((p, q) => q.d - p.d).map((f, idx) => `<g class="fe" style="--a:${f1(f.ang)}deg;--dl:${f1(2.7 + f.d * 0.07)}s"><g transform="scale(${f1(f.len)})">
<path d="M0 0C-16 -80 -20 -190 0 -300C20 -190 16 -80 0 0Z" fill="url(#fg)" opacity=".95"/>
<path d="M0 0V-290" stroke="#fff" stroke-opacity=".22" stroke-width="1.4"/>
<g stroke="${mix(fa, "#fff", 0.4)}" stroke-opacity=".35" stroke-width="1"><path d="M0 -120L-14 -150M0 -150L-16 -185M0 -120L14 -150M0 -150L16 -185M0 -190L-13 -225M0 -190L13 -225"/></g>
<g class="eye" style="animation-delay:${f1(-idx * 0.23)}s"><ellipse cx="0" cy="-262" rx="27" ry="38" fill="#e8b64a"/><ellipse cx="0" cy="-260" rx="20" ry="29" fill="#0f9a9a"/><ellipse cx="0" cy="-258" rx="13" ry="20" fill="#17398f"/><ellipse cx="0" cy="-256" rx="6" ry="10" fill="#060a1c"/><ellipse cx="-7" cy="-268" rx="3" ry="7" fill="#fff" opacity=".35"/></g></g></g>`).join("");
  const svg = `<defs>${FILTERS}
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050816"/><stop offset=".6" stop-color="#0d1c36"/><stop offset="1" stop-color="#1b3550"/></linearGradient>
<linearGradient id="gnd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f2236"/><stop offset=".5" stop-color="#091422"/><stop offset="1" stop-color="#04070d"/></linearGradient>
<linearGradient id="fg" x1="0" y1="0" x2="0" y2="-1"><stop offset="0" stop-color="${fb}"/><stop offset="1" stop-color="${fa}"/></linearGradient>
<linearGradient id="bd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1668c9"/><stop offset=".6" stop-color="#0c3f93"/><stop offset="1" stop-color="#0a8aa0"/></linearGradient>
<radialGradient id="rimg"><stop offset="0" stop-color="#9cc2ff" stop-opacity=".35"/><stop offset="1" stop-color="#9cc2ff" stop-opacity="0"/></radialGradient></defs>
<rect x="-3000" y="-3000" width="7200" height="3700" fill="url(#sky)"/>
<ellipse cx="600" cy="560" rx="900" ry="200" fill="#2b4f78" opacity=".35" filter="url(#b30)"/>
${trees(640, 26, 3, "#0a1626", 70, 150)}${trees(660, 30, 8, "#070f1b", 50, 110)}
<rect x="-3000" y="640" width="7200" height="2500" fill="url(#gnd)"/>
<g stroke="#a9c7f0" stroke-width="1.2" fill="none" opacity=".26" class="rain far">${rainFar}</g>
<g class="bolt" fill="none" stroke="#e8eeff" stroke-linejoin="round"><path d="M250 -80L218 120L258 130L196 330L236 340L170 560" stroke-width="7" filter="url(#glow)"/><path d="M250 -80L218 120L258 130L196 330L236 340L170 560" stroke-width="2.5"/></g>
<g fill="none" stroke="#bcd6ff" stroke-width="2" class="rip">${ripples}</g>
<ellipse cx="600" cy="722" rx="270" ry="26" fill="#000" opacity=".5" filter="url(#b8)"/>
<g class="pd"><g class="fan" transform="translate(600 618)">${feathers}</g>
<g class="legs"><path class="lg1" d="M584 676L578 726M578 726l-16 8M578 726l2 11M578 726l12 8" stroke="#6b6b7c" stroke-width="7" stroke-linecap="round" fill="none"/><path class="lg2" d="M618 676L624 726M624 726l-12 8M624 726l-2 11M624 726l16 8" stroke="#6b6b7c" stroke-width="7" stroke-linecap="round" fill="none"/></g>
<g class="body"><path d="M600 560C556 560 538 620 548 660C556 690 580 700 600 700C620 700 644 690 652 660C662 620 644 560 600 560Z" fill="url(#bd)"/>
<path d="M566 620C572 660 590 686 600 690C592 660 584 640 566 620Z" fill="#17a9bd" opacity=".5"/><path d="M560 600C548 630 556 660 570 676" stroke="#2c7ee0" stroke-width="3" fill="none" opacity=".6"/>
<g class="neck"><path d="M588 578C582 546 586 522 596 506L608 506C616 524 618 548 614 578Z" fill="url(#bd)"/>
<g class="head"><ellipse cx="601" cy="498" rx="17" ry="20" fill="#0f55c0"/><ellipse cx="607" cy="494" rx="8" ry="5" fill="#fff"/><circle cx="609" cy="494" r="2.6" fill="#050816"/><path d="M613 500L626 506L612 508Z" fill="#cfa24a"/>
<g stroke="#caa84a" stroke-width="1.6" stroke-linecap="round"><path d="M596 480L588 454M601 478L601 448M606 480L614 454"/></g><circle cx="588" cy="452" r="3.6" fill="#17b6c8"/><circle cx="601" cy="446" r="3.6" fill="#17b6c8"/><circle cx="614" cy="452" r="3.6" fill="#17b6c8"/></g></g></g></g>
<rect x="-3000" y="640" width="7200" height="2500" fill="url(#rimg)" opacity="0"/>
<g stroke="#c9dcff" stroke-width="2.4" fill="none" opacity=".5" class="rain near">${rainNear}</g>
<rect class="flash" x="-3000" y="-3000" width="7200" height="6400" fill="#cfdcff" style="mix-blend-mode:screen"/>`;
  const css = `
.rain path{animation:rain .75s linear infinite}.rain.near path{animation-duration:.5s}
@keyframes rain{from{transform:translate(0,0)}to{transform:translate(-70px,420px)}}
.rip ellipse{opacity:0;transform-box:fill-box;transform-origin:center;animation:rip 1.4s ease-out infinite}
@keyframes rip{0%{transform:scale(.1);opacity:.7}100%{transform:scale(1.3);opacity:0}}
.flash{opacity:0;animation:flash 6s linear both}
@keyframes flash{0%,35%{opacity:0}36%{opacity:.62}38%{opacity:.12}40%{opacity:.7}44%{opacity:.08}50%{opacity:.02}86%{opacity:0}87%{opacity:.35}89.5%,100%{opacity:0}}
.bolt{opacity:0;animation:bolt 6s linear both}
@keyframes bolt{0%,35%{opacity:0}36%,38%{opacity:1}39%{opacity:0}40%,43%{opacity:1}44.5%,100%{opacity:0}}
.pd{transform-origin:600px 720px;animation:dance 1.1s ease-in-out 1.3s infinite alternate}
@keyframes dance{from{transform:translateY(0) rotate(-1.6deg)}to{transform:translateY(-9px) rotate(1.6deg)}}
.fe{transform-origin:0 0;transform:rotate(0) scaleY(.12);opacity:0;animation:open 1.7s cubic-bezier(.2,1.3,.3,1) var(--dl) both}
@keyframes open{0%{transform:rotate(0) scaleY(.12);opacity:0}25%{opacity:1}100%{transform:rotate(var(--a)) scaleY(1);opacity:1}}
.fan{transform-origin:0 0;animation:quiver .16s ease-in-out 4.6s 14 alternate,brite 6s linear both}
@keyframes quiver{from{transform:translate(600px,618px) rotate(-1.4deg)}to{transform:translate(600px,618px) rotate(1.4deg)}}
@keyframes brite{0%,35%{filter:brightness(.7)}36%,44%{filter:brightness(2)}50%,100%{filter:brightness(1)}}
.eye{animation:shim 2.4s ease-in-out infinite}
@keyframes shim{0%,100%{filter:hue-rotate(0) brightness(1)}50%{filter:hue-rotate(28deg) brightness(1.5)}}
.neck{transform-origin:601px 580px;animation:nod 1.1s ease-in-out 1.3s infinite alternate}.head{transform-origin:601px 510px;animation:tilt .55s ease-in-out 1.3s infinite alternate}
@keyframes nod{from{transform:rotate(-4deg)}to{transform:rotate(5deg)}}@keyframes tilt{from{transform:rotate(-8deg)}to{transform:rotate(7deg)}}
.lg1{transform-origin:584px 676px;animation:foot 1.1s ease-in-out 1.3s infinite alternate}.lg2{transform-origin:618px 676px;animation:foot 1.1s ease-in-out 1.3s infinite alternate-reverse}
@keyframes foot{from{transform:translateY(0)}to{transform:translateY(-8px)}}
.refl{display:block;transform:scaleY(-1);transform-origin:50% 0;opacity:.2;margin-top:.1em;filter:blur(2px);-webkit-mask-image:linear-gradient(#000,transparent 70%);mask-image:linear-gradient(#000,transparent 70%);height:1.05em;overflow:hidden}
@keyframes nameIn{from{opacity:0;filter:blur(10px) drop-shadow(0 0 0 transparent);transform:translateY(18px)}to{opacity:1;filter:blur(0) drop-shadow(0 0 16px ${fb}aa);transform:none}}
@keyframes shine{from{background-position:130% 0}to{background-position:-30% 0}}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:.85;transform:none}}`;
  const text = o.brand.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
  const tag = o.tagline.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
  return scene(o, {
    svg, css, top: 87, bg: "#04070d", dur: 9, drift: ["scale(1.06) translateY(-10px)", "scale(1)"],
    brandCss: `.brand{background-image:linear-gradient(100deg,${fa} 20%,#ffffff 46%,${fb} 70%);background-size:250% 100%;animation:nameIn 1.5s ease-out 5.0s both,shine 2.6s ease-in-out 5.6s both}.tagline{animation:fadeUp 1.2s ease-out 6.2s both}.rf{animation:nameIn 1.5s ease-out 5.0s both}`,
    titleHtml: `<h1 class="brand">${text}</h1><div class="refl brand rf" aria-hidden="true">${text}</div>${tag ? `<p class="tagline">${tag}</p>` : ""}`,
  });
}
