import { FILTERS, Opts, f1, mix, rng, scene } from "../shared";

/** 3. Sunrise: starry deep-blue sky, ridge silhouettes, sun rises, sky goes blue > orange > gold, rays, lens glow, birds, name. */
export function sunrise(o: Opts) {
  const [a, b] = o.colors;
  const r = rng(21);
  const ridge = (base: number, seed: number, amp: number, step: number, fill: string) => {
    const q = rng(seed); let y = base - amp * 0.5, d = `M-1500 ${base + 400}L-1500 ${f1(y)}`;
    for (let x = -1500; x <= 2800; x += step) { y = base - amp * (0.2 + q() * 0.8); d += `L${x} ${f1(y)}`; }
    return `<path d="${d}L2800 ${base + 400}Z" class="${fill}"/>`;
  };
  const stars = Array.from({ length: 70 }, () => `<circle cx="${f1(-200 + r() * 1600)}" cy="${f1(-200 + r() * 760)}" r="${f1(0.8 + r() * 1.6)}" fill="#fff" style="animation:tws ${f1(1.5 + r() * 2.5)}s ease-in-out ${f1(-r() * 3)}s infinite alternate"/>`).join("");
  const rays = Array.from({ length: 16 }, (_, k) => `<path d="M0 0L${f1(-26 + 0)} -1900L${f1(26)} -1900Z" transform="rotate(${k * 22.5})" fill="#fff4c4" opacity="${k % 2 ? 0.5 : 0.85}"/>`).join("");
  const bird = (k: number) => {
    const y = 250 + k * 38 + r() * 30, d = 0.6 + k * 0.5, s = 0.8 + r() * 0.7;
    return `<g class="bd" style="--y:${f1(y)}px;--s:${f1(s)};animation-delay:${f1(4.2 + d)}s"><g class="wg" style="animation-delay:${f1(-r())}s"><path d="M0 0Q-13 -13 -28 -3Q-14 -5 0 4Q14 -5 28 -3Q13 -13 0 0Z" fill="#150b17"/></g></g>`;
  };
  const sparkle = Array.from({ length: 9 }, (_, k) => `<path d="M${570 - k * 3} ${770 + k * 14}h${60 + k * 6}" stroke="#ffe6a0" stroke-width="3" stroke-linecap="round" style="animation:glint ${f1(0.9 + r())}s ease-in-out ${f1(-r())}s infinite alternate"/>`).join("");
  const tintA = mix("#ff7a2e", a, 0.28), tintB = mix("#ffd067", b, 0.22);
  const svg = `<defs>${FILTERS}
<linearGradient id="s0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03061a"/><stop offset=".7" stop-color="#0c1b46"/><stop offset="1" stop-color="#1c3270"/></linearGradient>
<linearGradient id="s1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2468"/><stop offset=".5" stop-color="${mix("#a8447a", a, 0.2)}"/><stop offset="1" stop-color="${tintA}"/></linearGradient>
<linearGradient id="s2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix("#d4552a", a, 0.2)}"/><stop offset=".5" stop-color="${mix("#f58b3c", b, 0.15)}"/><stop offset="1" stop-color="#ffd98a"/></linearGradient>
<radialGradient id="sunc"><stop offset="0" stop-color="#fffbe6"/><stop offset=".55" stop-color="#ffe49a"/><stop offset="1" stop-color="#ffb347"/></radialGradient>
<radialGradient id="halo"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".7"/><stop offset=".35" stop-color="#ffb55a" stop-opacity=".45"/><stop offset="1" stop-color="#ff8a3c" stop-opacity="0"/></radialGradient>
<linearGradient id="lk0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16295f"/><stop offset="1" stop-color="#050a1e"/></linearGradient>
<linearGradient id="lk1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf80"/><stop offset=".5" stop-color="${tintA}"/><stop offset="1" stop-color="#5a2a3a"/></linearGradient>
<clipPath id="above"><rect x="-3000" y="-3000" width="7200" height="3700"/></clipPath></defs>
<rect x="-3000" y="-3000" width="7200" height="4000" fill="url(#s0)"/>
<g class="stars">${stars}</g>
<rect class="sk1" x="-3000" y="-3000" width="7200" height="4000" fill="url(#s1)"/>
<rect class="sk2" x="-3000" y="-3000" width="7200" height="4000" fill="url(#s2)"/>
<g class="sunwrap" style="mix-blend-mode:screen"><circle class="halo" cx="600" cy="640" r="520" fill="url(#halo)"/></g>
<g transform="translate(600 640)"><g class="raysg" style="mix-blend-mode:screen"><g class="rot">${rays}</g></g></g>
<g class="sun"><circle cx="600" cy="640" r="66" fill="url(#sunc)"/><circle class="red" cx="600" cy="640" r="66" fill="#ff5a1f"/></g>
${ridge(660, 4, 120, 70, "mt1")}
<ellipse cx="600" cy="670" rx="900" ry="60" fill="#ffd9a0" opacity=".35" filter="url(#b16)" class="mist"/>
${ridge(700, 9, 100, 56, "mt2")}${ridge(740, 14, 90, 44, "mt3")}
<rect x="-3000" y="740" width="7200" height="2200" fill="url(#lk0)"/><rect class="lk1" x="-3000" y="740" width="7200" height="2200" fill="url(#lk1)"/>
<g class="refl"><ellipse cx="600" cy="800" rx="90" ry="12" fill="#fff0b8" opacity=".5" filter="url(#b4)"/>${sparkle}</g>
<g class="flare">${[0, 1, 2, 3, 4].map((k) => `<circle cx="${f1(600 + (k + 1) * 80 * (k % 2 ? 1 : 1.1))}" cy="${f1(380 + (k + 1) * 62)}" r="${f1(12 + k * 7)}" fill="${k % 2 ? "#ffd37a" : "#ffffff"}" opacity=".22" style="mix-blend-mode:screen" filter="url(#b4)"/>`).join("")}</g>
${[0, 1, 2, 3, 4, 5].map(bird).join("")}`;
  const css = `
.stars{animation:starsOut 5s ease-in 1s both}
@keyframes starsOut{to{opacity:0}}@keyframes tws{from{opacity:.25}to{opacity:1}}
.sk1{opacity:0;animation:fade 3.6s ease-in-out 1.2s both}.sk2{opacity:0;animation:fade 3.8s ease-in-out 3.8s both}
@keyframes fade{to{opacity:1}}
.sun{animation:rise 6.2s cubic-bezier(.35,.05,.25,1) .9s both}
@keyframes rise{from{transform:translateY(190px)}to{transform:translateY(-225px)}}
.red{animation:cool 5s ease-in-out 1.2s both}@keyframes cool{from{opacity:.95}to{opacity:0}}
.halo{transform-origin:600px 640px;animation:haloUp 6.2s cubic-bezier(.35,.05,.25,1) .9s both}
@keyframes haloUp{from{transform:translateY(190px) scale(.5);opacity:0}30%{opacity:.6}to{transform:translateY(-225px) scale(1.05);opacity:1}}
.raysg{animation:raysIn 6s ease-out .9s both}@keyframes raysIn{from{opacity:0;transform:translateY(190px)}to{opacity:.3;transform:translateY(-225px)}}
.rot{animation:spin 40s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
.mt1{animation:mt1c 7s ease-in-out .8s both}.mt2{animation:mt2c 7s ease-in-out .8s both}.mt3{animation:mt3c 7s ease-in-out .8s both}
@keyframes mt1c{from{fill:#16224b}45%{fill:#7a4a86}to{fill:${mix("#c9785a", a, 0.18)}}}
@keyframes mt2c{from{fill:#0c1436}45%{fill:#472a58}to{fill:${mix("#7a3e45", a, 0.2)}}}
@keyframes mt3c{from{fill:#060a20}45%{fill:#1d1232}to{fill:#2a1620}}
.mist{opacity:0;animation:fade 4s ease-in 2s both}.lk1{opacity:0;animation:fade 5s ease-in-out 1.5s both}
.refl{opacity:0;animation:reflIn 5s ease-out 2s both}@keyframes reflIn{to{opacity:1}}
@keyframes glint{from{opacity:.3;transform:translateX(-6px) scaleX(.7)}to{opacity:1;transform:translateX(6px) scaleX(1.1)}}
.flare{opacity:0;animation:flr 4s ease-out 4.4s both}@keyframes flr{to{opacity:1}}
.bd{transform:translate(-200px,var(--y)) scale(var(--s));opacity:0;animation:fly 6.5s linear both}
@keyframes fly{0%{opacity:0;transform:translate(-160px,var(--y)) scale(var(--s))}8%{opacity:1}50%{transform:translate(620px,calc(var(--y) - 50px)) scale(var(--s))}92%{opacity:1}100%{opacity:0;transform:translate(1440px,calc(var(--y) + 10px)) scale(var(--s))}}
.wg{transform-box:fill-box;transform-origin:50% 100%;animation:flap .5s ease-in-out infinite alternate}
@keyframes flap{from{transform:scaleY(1)}to{transform:scaleY(-.55)}}
@keyframes nameIn{from{opacity:0;transform:scale(.94) translateY(14px);filter:blur(10px)}to{opacity:1;transform:none;filter:blur(0) drop-shadow(0 2px 1px rgba(110,35,0,.75)) drop-shadow(0 0 22px rgba(120,40,0,.5))}}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:.95;transform:none}}`;
  return scene(o, {
    svg, css, top: 19, bg: "#0c1b46", dur: 9, drift: ["scale(1.1) translateY(30px)", "scale(1)"],
    brandCss: `.brand{background-image:linear-gradient(180deg,#ffffff,#fff4dc);animation:nameIn 1.8s cubic-bezier(.2,.7,.2,1) 6.1s both}.tagline{animation:fadeUp 1.2s ease-out 7.0s both}`,
  });
}
