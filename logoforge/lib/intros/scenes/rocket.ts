import { FILTERS, Opts, f1, mix, rng, scene } from "../shared";

/** 9. Rocket launch: countdown, ignition glow, smoke billows, liftoff, the name emerges from the smoke trail. */
export function rocket(o: Opts) {
  const [a, b] = o.colors;
  const r = rng(61);
  const stars = Array.from({ length: 50 }, () => `<circle cx="${f1(-300 + r() * 1800)}" cy="${f1(-200 + r() * 800)}" r="${f1(0.7 + r() * 1.4)}" fill="#fff" opacity=".7"/>`).join("");
  const bank = Array.from({ length: 26 }, (_, k) => { const side = k % 2 ? 1 : -1, d = 60 + r() * 520, s = 50 + r() * 60;
    return `<circle class="sm" cx="${f1(600 + side * 20)}" cy="${f1(735 - r() * 30)}" r="${f1(s)}" fill="url(#smk)" style="--dx:${f1(side * d)}px;--dy:${f1(-r() * 40)}px;animation-delay:${f1(2.0 + r() * 1.2)}s"/>`; }).join("");
  const column = Array.from({ length: 16 }, (_, k) => { const y = 720 - k * 36; const s = 34 + k * 4 + r() * 12;
    return `<circle class="sm col" cx="${f1(600 + (r() - 0.5) * 40)}" cy="${y}" r="${f1(s)}" fill="url(#smk)" style="--dx:${f1((r() - 0.5) * 140)}px;--dy:0px;animation-delay:${f1(2.7 + k * 0.17)}s"/>`; }).join("");
  const lattice = Array.from({ length: 12 }, (_, k) => `<path d="M360 ${760 - k * 40}L440 ${720 - k * 40}M440 ${760 - k * 40}L360 ${720 - k * 40}"/>`).join("");
  const svg = `<defs>${FILTERS}
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#02030c"/><stop offset=".65" stop-color="#0b1330"/><stop offset="1" stop-color="#2b2140"/></linearGradient>
<radialGradient id="smk"><stop offset="0" stop-color="#e9e4ee" stop-opacity=".95"/><stop offset=".6" stop-color="#b9b3c4" stop-opacity=".55"/><stop offset="1" stop-color="#8b869a" stop-opacity="0"/></radialGradient>
<linearGradient id="bd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#aab0c0"/><stop offset=".35" stop-color="#ffffff"/><stop offset=".75" stop-color="#cfd5e2"/><stop offset="1" stop-color="#7d8497"/></linearGradient>
<linearGradient id="fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff7d6"/><stop offset=".3" stop-color="#ffc24a"/><stop offset="1" stop-color="#ff5a1a" stop-opacity="0"/></linearGradient>
<radialGradient id="padg"><stop offset="0" stop-color="#ffb56a" stop-opacity=".85"/><stop offset="1" stop-color="#ff7a2e" stop-opacity="0"/></radialGradient>
<linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1424"/><stop offset="1" stop-color="#07050b"/></linearGradient></defs>
<rect x="-3000" y="-3000" width="7200" height="3900" fill="url(#sky)"/>${stars}
<ellipse class="hz" cx="600" cy="720" rx="1000" ry="260" fill="url(#padg)" style="mix-blend-mode:screen"/>
<g class="shk">
<rect x="-3000" y="745" width="7200" height="2200" fill="url(#gd)"/>
<g stroke="#2d2740" stroke-width="5" fill="none"><path d="M360 760V160M440 760V160M360 760H440M360 160H440"/><g stroke-width="3">${lattice}</g><path d="M440 380H540M440 520H540" stroke-width="8"/></g>
<g fill="#ffcf6e"><circle cx="400" cy="150" r="5"/><circle cx="400" cy="150" r="22" opacity=".3" filter="url(#b4)"/></g>
<g class="flood"><path d="M200 748L90 748L200 520Z" fill="#fff3c4" opacity=".08"/></g>
<g class="rk"><g class="vib">
<g class="flame" transform="translate(600 742)"><ellipse cx="0" cy="40" rx="54" ry="150" fill="url(#fl)" filter="url(#b4)"/><path d="M-26 0C-30 70 0 170 0 170C0 170 30 70 26 0Z" fill="url(#fl)"/><path d="M-12 0C-12 40 0 90 0 90C0 90 12 40 12 0Z" fill="#fff"/></g>
<path d="M560 700L520 760L560 740Z M640 700L680 760L640 740Z" fill="${b}"/><path d="M560 640L540 706L560 700Z M640 640L660 706L640 700Z" fill="${mix(b, "#000", 0.25)}" opacity=".8"/>
<path d="M560 740V470C560 410 584 360 600 330C616 360 640 410 640 470V740Z" fill="url(#bd)"/>
<path d="M560 470C560 410 584 360 600 330C616 360 640 410 640 470Z" fill="${a}"/><path d="M560 470C560 410 584 360 600 330C616 360 640 410 640 470Z" fill="url(#bd)" opacity=".28"/>
<rect x="560" y="640" width="80" height="22" fill="${b}"/><rect x="560" y="470" width="80" height="8" fill="${a}"/>
<circle cx="600" cy="540" r="26" fill="#2a3042"/><circle cx="600" cy="540" r="20" fill="#7ec8ff"/><path d="M586 530Q596 520 610 524" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
<rect x="575" y="740" width="50" height="14" rx="4" fill="#4a5064"/></g></g>
<g>${bank}</g><g>${column}</g>
</g>
<g class="spk">${Array.from({ length: 24 }, () => `<circle cx="${f1(560 + r() * 80)}" cy="745" r="${f1(1.5 + r() * 2.5)}" fill="#ffd27a" style="--dx:${f1((r() - 0.5) * 520)}px;--dy:${f1(-30 - r() * 120)}px;animation-delay:${f1(2.1 + r() * 1.2)}s"/>`).join("")}</g>`;
  const cd = `<div class="cd"><span style="animation-delay:.3s">3</span><span style="animation-delay:1.0s">2</span><span style="animation-delay:1.7s">1</span></div>`;
  const css = `
.cd{position:absolute;left:50%;top:22%;transform:translate(-50%,-50%);z-index:3;font-size:clamp(40px,10vw,120px);color:#ffe3b0;text-shadow:0 0 24px #ff9a3c}
.cd span{position:absolute;left:50%;transform:translateX(-50%);opacity:0;animation:cnt .7s ease-out both}
@keyframes cnt{0%{opacity:0;transform:translateX(-50%) scale(1.6)}20%{opacity:1;transform:translateX(-50%) scale(1)}85%{opacity:.9}100%{opacity:0;transform:translateX(-50%) scale(.8)}}
.hz{opacity:0;animation:hz 9s ease-in-out both}@keyframes hz{0%{opacity:0}22%{opacity:.35}30%,60%{opacity:1}100%{opacity:.5}}
.flame{opacity:0;transform-origin:600px 742px;animation:fl2 9s linear both}
@keyframes fl2{0%,21%{opacity:0;transform:translate(600px,742px) scaleY(.1)}23%{opacity:1;transform:translate(600px,742px) scaleY(.8)}26%{transform:translate(600px,742px) scaleY(1.1)}40%{transform:translate(600px,742px) scaleY(1.6)}100%{opacity:1;transform:translate(600px,742px) scaleY(1.9)}}
.flame{transform-origin:0 0}
.rk{animation:lift 4s cubic-bezier(.55,0,.9,.55) 2.7s both}
@keyframes lift{0%{transform:translateY(0)}100%{transform:translateY(-1500px)}}
.vib{animation:vib .06s linear 1.9s 14 alternate}@keyframes vib{from{transform:translateX(-1.5px)}to{transform:translateX(1.5px)}}
.shk{animation:shake .08s linear 2.2s 30 alternate}@keyframes shake{from{transform:translate(-3px,2px)}to{transform:translate(3px,-2px)}}
.sm{opacity:0;transform-box:fill-box;transform-origin:center;animation:smk 4.8s cubic-bezier(.1,.6,.3,1) both}
@keyframes smk{0%{opacity:0;transform:translate(0,0) scale(.2)}18%{opacity:.95}100%{opacity:.8;transform:translate(var(--dx),var(--dy)) scale(1.5)}}
.sm.col{animation-duration:6s}
.spk circle{opacity:0;animation:sp 1.5s ease-out both}@keyframes sp{0%{opacity:0;transform:translate(0,0)}15%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy))}}
@keyframes emerge{0%{opacity:0;filter:blur(18px);letter-spacing:.14em;transform:translateY(24px)}100%{opacity:1;filter:blur(0) drop-shadow(0 6px 18px rgba(255,150,60,.5));letter-spacing:-.01em;transform:none}}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:.9;transform:none}}`;
  return scene(o, {
    svg, css, top: 54, bg: "#07050b", dur: 9, html: cd, drift: ["scale(1.02)", "scale(1.08)"],
    brandCss: `.brand{background-image:linear-gradient(180deg,#ffffff,${mix("#d8d4e6", a, 0.3)});animation:emerge 2.2s cubic-bezier(.2,.7,.2,1) 5.6s both}.tagline{opacity:0;animation:fadeUp 1.2s ease-out 7.4s forwards}`,
  });
}
