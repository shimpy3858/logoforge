import { FILTERS, Opts, f1, mix, rng, scene, deep } from "../shared";

/** 8. Hot air balloon rises through clouds at sunrise; the name appears on the horizon. */
export function balloon(o: Opts) {
  const [a, b] = o.colors;
  const r = rng(52);
  const cloud = (x: number, y: number, s: number, op: number) =>
    `<g transform="translate(${x} ${y}) scale(${s})" opacity="${op}"><ellipse cx="0" cy="0" rx="130" ry="34"/><ellipse cx="-70" cy="-20" rx="70" ry="38"/><ellipse cx="30" cy="-34" rx="80" ry="44"/><ellipse cx="100" cy="-8" rx="60" ry="30"/></g>`;
  const clouds = (n: number, ymin: number, ymax: number, smin: number, smax: number, op: number) =>
    Array.from({ length: n }, () => cloud(f1(-900 + r() * 3000), f1(ymin + r() * (ymax - ymin)), f1(smin + r() * (smax - smin)), op)).join("");
  const cols = [a, "#fff3e0", b, "#fff3e0", mix(a, b, 0.5), "#fff3e0", a];
  const bands = cols.map((c, k) => `<rect x="${-190 + k * 54.3}" y="-180" width="55" height="360" fill="${c}"/>`).join("");
  const svg = `<defs>${FILTERS}
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4c5fa8"/><stop offset=".45" stop-color="#c9779a"/><stop offset=".8" stop-color="#ff9f6a"/><stop offset="1" stop-color="#ffd08a"/></linearGradient>
<radialGradient id="sun"><stop offset="0" stop-color="#fff5cf"/><stop offset=".3" stop-color="#ffd17a" stop-opacity=".8"/><stop offset="1" stop-color="#ff9a5a" stop-opacity="0"/></radialGradient>
<clipPath id="env"><path d="M0 -170C150 -170 192 -40 122 70C92 120 52 150 30 172H-30C-52 150 -92 120 -122 70C-192 -40 -150 -170 0 -170Z"/></clipPath>
<radialGradient id="shade" cx=".35" cy=".3"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient></defs>
<rect x="-3000" y="-3000" width="7200" height="3900" fill="url(#sky)"/>
<circle cx="600" cy="700" r="430" fill="url(#sun)" opacity=".7" style="mix-blend-mode:screen"/>
<g fill="#fff" opacity=".55" filter="url(#b4)" class="cl1">${clouds(14, 250, 520, 0.7, 1.3, 0.55)}</g>
<g class="balloon"><g transform="translate(600 262)" ><g class="sway" >
<ellipse cx="0" cy="360" rx="120" ry="14" fill="#000" opacity="0" />
<g stroke="#4a3320" stroke-width="2"><path d="M-30 172L-26 252M30 172L26 252M-12 176L-10 252M12 176L10 252" opacity=".8"/></g>
<g class="bk"><rect x="-32" y="250" width="64" height="44" rx="6" fill="#a8743a"/><path d="M-32 262H32M-32 274H32M-32 286H32M-16 250V294M0 250V294M16 250V294" stroke="#6b4420" stroke-width="2"/><rect x="-34" y="246" width="68" height="8" rx="3" fill="#7a4e24"/></g>
<g class="burn"><circle cx="0" cy="208" r="34" fill="#ffb35a" opacity=".5" filter="url(#b8)"/><path d="M0 214C-7 204-6 192 0 182C6 192 7 204 0 214Z" fill="#ffd27a"/></g>
<path d="M0 -170C150 -170 192 -40 122 70C92 120 52 150 30 172H-30C-52 150 -92 120 -122 70C-192 -40 -150 -170 0 -170Z" fill="#fff"/>
<g clip-path="url(#env)">${bands}<rect x="-200" y="-180" width="400" height="360" fill="url(#shade)"/><path d="M-120 20H120M-90 -70H90" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none"/><path d="M-130 110H130" stroke="${b}" stroke-width="10"/></g>
<path d="M-118 -90C-110 -140-60 -160-40 -150" stroke="#fff" stroke-opacity=".5" stroke-width="6" fill="none" stroke-linecap="round"/>
<g class="flag" transform="translate(0 -170)"><path d="M0 0V-34" stroke="#4a3320" stroke-width="3"/><path class="fl" d="M0 -34L34 -26L0 -16Z" fill="${b}"/></g>
</g></g></g>
<g fill="#fff" class="cl2" filter="url(#b4)" opacity=".9">${clouds(10, 640, 760, 1.1, 1.8, 0.8)}</g>
<g fill="#ffe4d0" class="cl3" filter="url(#b8)">${clouds(8, 760, 900, 1.6, 2.4, 0.95)}</g>
<rect x="-3000" y="860" width="7200" height="2000" fill="#ffd8b6"/>`;
  const css = `
.balloon{animation:up 6.4s cubic-bezier(.2,.65,.2,1) .2s both}@keyframes up{from{transform:translateY(760px)}to{transform:translateY(0)}}
.sway{transform-origin:0 -170px;animation:sway 3.6s ease-in-out infinite alternate}@keyframes sway{from{transform:rotate(-2.2deg)}to{transform:rotate(2.2deg)}}
.burn{transform-origin:0 214px;animation:burn .16s ease-in-out infinite alternate}@keyframes burn{from{transform:scale(.9,.85);opacity:.8}to{transform:scale(1.1,1.2);opacity:1}}
.fl{transform-origin:0 -26px;animation:flag .5s ease-in-out infinite alternate}@keyframes flag{from{transform:skewY(-8deg) scaleX(1)}to{transform:skewY(8deg) scaleX(.85)}}
.cl1{animation:d1 22s linear infinite alternate}.cl2{animation:d2 14s linear infinite alternate}.cl3{animation:d1 18s linear infinite alternate-reverse}
@keyframes d1{to{transform:translateX(-120px)}}@keyframes d2{to{transform:translateX(160px)}}
@keyframes nameIn{from{opacity:0;transform:translateY(40px) scale(.95);filter:blur(10px)}to{opacity:1;transform:none;filter:blur(0) drop-shadow(0 0 3px rgba(255,255,255,.9)) drop-shadow(0 0 16px rgba(255,255,255,.6))}}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:.95;transform:none}}`;
  return scene(o, {
    svg, css, top: 71, bg: "#ffe9d6", dur: 9, dark: false, drift: ["scale(1.04) translateY(20px)", "scale(1)"],
    brandCss: `.brand{background-image:linear-gradient(95deg,${deep(a, 0.12)},${deep(b, 0.12)});animation:nameIn 1.8s cubic-bezier(.2,.7,.2,1) 5.6s both}.tagline{color:#3a1a2e;opacity:0;animation:fadeUp 1.2s ease-out 6.8s forwards;text-shadow:0 0 10px rgba(255,255,255,.9)}.vig{background:radial-gradient(ellipse at 50% 46%,transparent 58%,rgba(60,20,40,.3))}`,
  });
}
