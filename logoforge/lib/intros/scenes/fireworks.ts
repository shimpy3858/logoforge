import { FILTERS, Opts, f1, mix, rng, scene, vivid } from "../shared";

/** 10. Fireworks over a city skyline; the last big burst blooms into the name. */
export function fireworks(o: Opts) {
  const [a, b] = o.colors;
  const ca = vivid(a, 0.4), cb = vivid(b, 0.4);
  const r = rng(77);
  const skyline = (base: number, seed: number, fill: string, hmin: number, hmax: number, win: boolean) => {
    const q = rng(seed); let x = -1500, d = "", w = "";
    while (x < 2800) {
      const bw = 50 + q() * 90, h = hmin + q() * (hmax - hmin);
      d += `<rect x="${f1(x)}" y="${f1(base - h)}" width="${f1(bw)}" height="${f1(h + 400)}" fill="${fill}"/>`;
      if (q() > 0.6) d += `<rect x="${f1(x + bw / 2 - 2)}" y="${f1(base - h - 26)}" width="4" height="26" fill="${fill}"/>`;
      if (win) for (let k = 0; k < 7; k++) { if (q() > 0.55) w += `<rect x="${f1(x + 8 + q() * (bw - 20))}" y="${f1(base - h + 14 + q() * (h - 30))}" width="5" height="7" fill="#ffd77a" style="animation:tw ${f1(1 + q() * 3)}s ease-in-out ${f1(-q() * 3)}s infinite alternate"/>`; }
      x += bw + q() * 6;
    }
    return d + `<g opacity=".9">${w}</g>`;
  };
  const palette = [ca, cb, "#ffe27a", "#ffffff", mix(ca, cb, 0.5), "#7ad7ff"];
  const burst = (x: number, y: number, col: string, col2: string, t: number, n0: number, R: number, id: number) => {
    const n = Math.round(n0 * 1.5);
    const sp = Array.from({ length: n }, (_, k) => { const ang = (k / n) * Math.PI * 2 + r() * 0.15, rr = R * (0.75 + r() * 0.3); const c = k % 3 === 0 ? col2 : col;
      return `<circle r="${f1(3.2 + r() * 2)}" fill="${c}" style="--x:${f1(Math.cos(ang) * rr)}px;--y:${f1(Math.sin(ang) * rr)}px;animation-delay:${t}s"/>`; }).join("");
    const inner = Array.from({ length: Math.round(n / 2) }, (_, k) => { const ang = (k / (n / 2)) * Math.PI * 2 + 0.2, rr = R * 0.5 * (0.8 + r() * 0.3);
      return `<circle r="2.2" fill="${col2}" style="--x:${f1(Math.cos(ang) * rr)}px;--y:${f1(Math.sin(ang) * rr)}px;animation-delay:${t}s"/>`; }).join("");
    return `<path class="up" pathLength="1" d="M${x} 790L${x} ${y}" stroke="#ffe9b0" stroke-width="3" fill="none" stroke-linecap="round" style="animation-delay:${f1(t - 0.75)}s"/>
<g transform="translate(${x} ${y})"><circle class="fl" r="${f1(R * 0.7)}" fill="${col}" style="animation-delay:${t}s;mix-blend-mode:screen"/><g class="bs" style="filter:drop-shadow(0 0 6px ${col});animation-delay:${t}s">${sp}${inner}</g></g>`;
  };
  const bursts = [
    burst(300, 330, palette[0], "#fff", 1.1, 30, 150, 1), burst(900, 280, palette[1], "#ffe27a", 1.9, 30, 160, 2),
    burst(520, 200, palette[2], palette[4], 2.9, 28, 130, 3), burst(780, 430, palette[5], "#fff", 3.6, 26, 120, 4),
    burst(210, 480, palette[3], palette[0], 4.3, 26, 110, 5), burst(600, 400, palette[1], palette[2], 5.1, 64, 400, 6),
  ].join("");
  const glitter = Array.from({ length: 40 }, () => `<circle cx="${f1(120 + r() * 960)}" cy="${f1(120 + r() * 360)}" r="${f1(1.3 + r() * 2)}" fill="#ffe9a0" style="--dy:${f1(120 + r() * 260)}px;animation-delay:${f1(5.7 + r() * 1.5)}s"/>`).join("");
  const svg = `<defs>${FILTERS}
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05051a"/><stop offset=".6" stop-color="#150f3a"/><stop offset="1" stop-color="${mix("#4a2160", a, 0.2)}"/></linearGradient></defs>
<rect x="-3000" y="-3000" width="7200" height="4000" fill="url(#sky)"/>
<g>${Array.from({ length: 45 }, () => `<circle cx="${f1(-300 + r() * 1800)}" cy="${f1(-200 + r() * 700)}" r="${f1(0.6 + r() * 1.2)}" fill="#fff" opacity=".6"/>`).join("")}</g>
<g class="bursts">${bursts}</g>
<g class="glit">${glitter}</g>
<g>${skyline(790, 3, "#150f33", 80, 230, true)}</g><g>${skyline(850, 9, "#0a0719", 60, 180, true)}</g>
<rect x="-3000" y="850" width="7200" height="2000" fill="#06040f"/>`;
  const css = `
.up{stroke-dasharray:.08 1;stroke-dashoffset:.08;opacity:0;animation:up .75s cubic-bezier(.3,.6,.4,1) forwards}
@keyframes up{0%{stroke-dashoffset:.08;opacity:1}90%{opacity:1}100%{stroke-dashoffset:-1;opacity:0}}
.fl{opacity:0;animation:flash .5s ease-out forwards}@keyframes flash{0%{opacity:.7;transform:scale(.2)}100%{opacity:0;transform:scale(1)}}
.bs circle{opacity:0;animation:spark 2.6s cubic-bezier(.1,.7,.3,1) forwards;animation-delay:inherit}
.bs circle{animation-delay:inherit}
@keyframes spark{0%{opacity:1;transform:translate(0,0)}60%{opacity:1;transform:translate(var(--x),var(--y))}100%{opacity:0;transform:translate(var(--x),calc(var(--y) + 70px))}}
@keyframes tw{from{opacity:.3}to{opacity:1}}
.glit circle{opacity:0;animation:gl 2.5s ease-in forwards}@keyframes gl{0%{opacity:0;transform:translateY(0)}30%{opacity:1}100%{opacity:0;transform:translateY(var(--dy))}}
@keyframes boom{0%{opacity:0;transform:scale(.3);filter:blur(16px)}60%{opacity:1;transform:scale(1.06);filter:blur(0)}100%{opacity:1;transform:none;filter:blur(0) drop-shadow(0 0 24px ${ca}aa)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:.9;transform:none}}`;
  return scene(o, {
    svg, css, top: 33, bg: "#06040f", dur: 9, drift: ["scale(1.03)", "scale(1)"],
    brandCss: `.brand{background-image:linear-gradient(95deg,#fff,${mix("#ffe9a8", a, 0.25)} 40%,${mix("#ffffff", b, 0.3)});opacity:0;animation:boom 1.8s cubic-bezier(.2,.8,.3,1) 5.3s both}.tagline{opacity:0;animation:fadeUp 1.2s ease-out 6.8s forwards}`,
  });
}
