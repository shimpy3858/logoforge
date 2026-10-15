import { FILTERS, Opts, deep, f1, mix, rng, scene } from "../shared";

/** 4. Hungry dog: walking cycle (legs, knees, tail, head bob), finds a bowl, heart pops, eats, name appears. */
export function hungryDog(o: Opts) {
  const [a, b] = o.colors;
  const r = rng(33);
  const fur = "#d9953b", furD = "#a9651f", furL = "#f2c887", ear = "#6b3a14";
  const leg = (cls: string, x: number, y: number, fill: string, paw: string) =>
    `<g transform="translate(${x} ${y})"><g class="${cls}"><path d="M-14 -8Q-18 28 -10 54H11Q16 28 14 -8Z" fill="${fill}"/><g transform="translate(0 52)"><g class="${cls}k"><path d="M-9 0H9L8 48H-8Z" fill="${fill}"/><path d="M-10 44H16Q21 53 12 58H-10Z" fill="${paw}"/></g></g></g></g>`;
  const grass = Array.from({ length: 70 }, () => { const x = -600 + r() * 2400, h = 26 + r() * 34, w = (r() - 0.5) * 14; return `<path d="M${f1(x)} 900q${f1(w)} ${f1(-h * 0.6)} ${f1(w * 1.6)} ${f1(-h)}" style="animation-delay:${f1(-r() * 2)}s" />`; }).join("");
  const kibble = Array.from({ length: 6 }, (_, k) => `<ellipse class="kb" cx="${715 - 18 + k * 7}" cy="728" rx="5" ry="4" fill="${k % 2 ? "#8a4b1d" : "#a65f27"}" style="--kx:${f1((r() - 0.3) * 50)}px;animation-delay:${f1(5.5 + k * 0.28)}s"/>`).join("");
  const dog = `<g class="dogx"><g transform="translate(0 760)">
<ellipse cx="10" cy="2" rx="170" ry="13" fill="#2a1608" opacity=".35" filter="url(#b4)"/>
<g class="dbob">
${leg("lfarB", -82, -96, furD, "#8a4f18")}${leg("lfarF", 92, -92, furD, "#8a4f18")}
<g class="tailw" transform="translate(-116 -128)"><g class="tail"><path d="M0 0C-34 -14-56 -52-44 -92C-36 -76-28 -50 8 -26Z" fill="${fur}"/><path d="M-44 -92C-38 -80-34 -70-30 -62" stroke="${furL}" stroke-width="5" stroke-linecap="round" fill="none"/></g></g>
<path d="M-120 -118C-122 -166-60 -180 0 -178C70 -178 114 -170 130 -134C138 -104 122 -84 90 -80L-70 -76C-106 -76-120 -92-120 -118Z" fill="${fur}"/>
<path d="M-100 -96C-60 -80 40 -76 112 -90C100 -78 90 -74 70 -72L-70 -70C-92 -72-100 -84-100 -96Z" fill="${furL}"/>
<path d="M-110 -150C-70 -176 40 -182 110 -160" stroke="#fff" stroke-opacity=".18" stroke-width="6" fill="none" stroke-linecap="round"/>
${leg("lnearB", -70, -96, fur, "#b2682a")}${leg("lnearF", 104, -92, fur, "#b2682a")}
<g transform="translate(112 -146)"><g class="neckg">
<path d="M-22 -22Q4 -30 20 -18L22 28Q-6 38-24 24Z" fill="${fur}"/>
<path d="M-24 16Q0 28 24 18L25 32Q-2 44-26 30Z" fill="${a}"/><circle class="tg" cx="2" cy="40" r="7" fill="${b}"/>
<g class="head">
<ellipse cx="30" cy="-22" rx="38" ry="34" fill="${fur}"/>
<path d="M52 -36Q94 -38 102 -14Q104 6 86 10L56 10Z" fill="${furL}"/>
<ellipse cx="99" cy="-17" rx="9.5" ry="7.5" fill="#1b1008"/><ellipse cx="96" cy="-20" rx="3" ry="2" fill="#fff" opacity=".5"/>
<path d="M64 6Q80 12 94 4" stroke="#6b3a14" stroke-width="2.6" fill="none" stroke-linecap="round"/>
<path class="tongue" d="M76 8Q82 28 90 12Z" fill="#ef6f86"/>
<circle cx="58" cy="-40" r="6" fill="#1b1008"/><circle cx="60" cy="-42" r="2" fill="#fff"/>
<path d="M48 -54Q60 -60 70 -52" stroke="${furD}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
<g transform="translate(14 -46)"><g class="ear"><path d="M2 0Q-26 6 -22 52Q-4 56 10 40Q22 20 20 -4Z" fill="${ear}"/></g></g>
</g></g></g>
</g></g></g>`;
  const heart = `<g transform="translate(${530 + 205} 575)"><g class="heartg"><path class="heart" d="M0 14C-26 -4 -26 -28 -10 -28C-3 -28 0 -22 0 -20C0 -22 3 -28 10 -28C26 -28 26 -4 0 14Z" fill="#ff4d79"/><path class="hl" d="M-12 -20Q-18 -16 -16 -8" stroke="#fff" stroke-opacity=".6" stroke-width="3" fill="none" stroke-linecap="round"/></g></g>
<g transform="translate(${530 + 262} 530)"><g class="spk"><path d="M0 -14Q2 -2 14 0Q2 2 0 14Q-2 2 -14 0Q-2 -2 0 -14Z" fill="#fff3a6"/></g></g><g transform="translate(${530 + 160} 520)"><g class="spk s2"><path d="M0 -10Q1.5 -1.5 10 0Q1.5 1.5 0 10Q-1.5 1.5 -10 0Q-1.5 -1.5 0 -10Z" fill="#ffe27a"/></g></g>`;
  const svg = `<defs>${FILTERS}
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix("#ffc58a", a, 0.12)}"/><stop offset=".6" stop-color="#ffe3b8"/><stop offset="1" stop-color="#fff2d8"/></linearGradient>
<linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fb24a"/><stop offset=".25" stop-color="#6e9a38"/><stop offset="1" stop-color="#3f6a24"/></linearGradient>
<linearGradient id="path" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8b27a"/><stop offset="1" stop-color="#b98c55"/></linearGradient>
<radialGradient id="sunb"><stop offset="0" stop-color="#fff4cf" stop-opacity=".95"/><stop offset="1" stop-color="#ffd88a" stop-opacity="0"/></radialGradient></defs>
<rect x="-3000" y="-3000" width="7200" height="3700" fill="url(#sky)"/>
<circle cx="900" cy="250" r="360" fill="url(#sunb)"/>
<g class="cl"><g fill="#fff" opacity=".85" filter="url(#b4)"><ellipse cx="260" cy="190" rx="120" ry="30"/><ellipse cx="330" cy="168" rx="70" ry="28"/></g><g fill="#fff" opacity=".7" filter="url(#b4)"><ellipse cx="980" cy="120" rx="100" ry="24"/><ellipse cx="1040" cy="100" rx="60" ry="22"/></g></g>
<g class="hills1"><path d="M-1500 520C-1100 440-800 470-500 500S100 440 500 480 1100 440 1500 490 2300 450 2800 500V760H-1500Z" fill="#a9c47a"/></g>
<g class="hills2"><path d="M-1500 580C-1000 520-700 560-300 570S300 520 700 560 1300 520 1800 570 2400 540 2800 580V760H-1500Z" fill="#86ab52"/>
<g fill="#4a7a30"><rect x="140" y="470" width="14" height="100"/><circle cx="147" cy="450" r="56"/><rect x="1000" y="490" width="12" height="90"/><circle cx="1006" cy="474" r="46"/></g></g>
<rect x="-3000" y="640" width="7200" height="2300" fill="url(#gr)"/>
<g class="fence"><g fill="#f4e8d2" stroke="#c9b48e" stroke-width="2">${Array.from({ length: 24 }, (_, k) => `<path d="M${-1500 + k * 140} 640V560L${-1500 + k * 140 + 16} 544L${-1500 + k * 140 + 32} 560V640Z"/>`).join("")}</g><path d="M-1500 580H2800M-1500 620H2800" stroke="#e5d6b8" stroke-width="9"/></g>
<path d="M-3000 700H4200V830H-3000Z" fill="url(#path)"/><path d="M-3000 704H4200" stroke="#fff" stroke-opacity=".25" stroke-width="3"/>
<g class="bowl"><ellipse cx="715" cy="764" rx="74" ry="11" fill="#2a1608" opacity=".3" filter="url(#b4)"/><path d="M645 722H785L770 760Q715 772 660 760Z" fill="${mix("#e8e2d6", a, 0.2)}"/><path d="M645 722H785L778 738H652Z" fill="${mix("#ffffff", b, 0.25)}" opacity=".55"/>
<ellipse cx="715" cy="722" rx="70" ry="10" fill="#c9bfae"/><g class="food"><path d="M650 722Q680 692 715 700Q752 692 780 722Z" fill="#a65f27"/>${Array.from({ length: 9 }, (_, k) => `<circle cx="${662 + k * 13}" cy="${708 + (k % 3) * 4}" r="5" fill="${k % 2 ? "#8a4b1d" : "#c27633"}"/>`).join("")}</g>
<path d="M690 748Q715 756 740 748" stroke="#fff" stroke-opacity=".7" stroke-width="3" fill="none" stroke-linecap="round"/><text x="715" y="750" text-anchor="middle" font-size="16" fill="${b}" opacity=".9">♥</text></g>
${kibble}${dog}${heart}
<g class="gr" fill="none" stroke="#3a6a1e" stroke-width="3.4" stroke-linecap="round">${grass}</g>`;
  const css = `
.hills1{animation:pan1 5s cubic-bezier(.3,.3,.3,1) .3s both}.hills2{animation:pan2 5s cubic-bezier(.3,.3,.3,1) .3s both}.fence{animation:pan3 5s cubic-bezier(.3,.3,.3,1) .3s both}.gr{animation:pan3 5s cubic-bezier(.3,.3,.3,1) .3s both}
@keyframes pan1{to{transform:translateX(-70px)}}@keyframes pan2{to{transform:translateX(-170px)}}@keyframes pan3{to{transform:translateX(-340px)}}
.gr path{transform-box:fill-box;transform-origin:50% 100%;animation:sway 2.4s ease-in-out infinite alternate}@keyframes sway{from{transform:rotate(-4deg)}to{transform:rotate(5deg)}}
.cl{animation:clm 30s linear infinite alternate}@keyframes clm{to{transform:translateX(160px)}}
.dogx{animation:go 5s cubic-bezier(.2,.55,.35,1) .3s both}
@keyframes go{from{transform:translateX(-770px)}to{transform:translateX(530px)}}
.dbob{animation:bob .6s ease-in-out .3s 8,idle 1.6s ease-in-out 5.3s infinite alternate}
@keyframes bob{0%,100%{transform:translateY(0)}25%,75%{transform:translateY(-6px)}50%{transform:translateY(1px)}}@keyframes idle{from{transform:translateY(0)}to{transform:translateY(1.5px)}}
.lnearF,.lfarB{animation:swA .6s linear .3s 8 both}.lnearB,.lfarF{animation:swB .6s linear .3s 8 both}
.lnearFk,.lfarBk{animation:knA .6s linear .3s 8 both}.lnearBk,.lfarFk{animation:knB .6s linear .3s 8 both}
@keyframes swA{0%,100%{transform:rotate(0)}25%{transform:rotate(30deg)}75%{transform:rotate(-30deg)}}
@keyframes swB{0%,100%{transform:rotate(0)}25%{transform:rotate(-30deg)}75%{transform:rotate(30deg)}}
@keyframes knA{0%,100%{transform:rotate(0)}25%{transform:rotate(-6deg)}50%{transform:rotate(-46deg)}75%{transform:rotate(6deg)}}
@keyframes knB{0%,100%{transform:rotate(0)}25%{transform:rotate(6deg)}50%{transform:rotate(-46deg)}75%{transform:rotate(-6deg)}}
.tail{transform-origin:0 0;animation:wag .3s ease-in-out .2s infinite alternate}@keyframes wag{from{transform:rotate(-14deg)}to{transform:rotate(20deg)}}
.neckg{transform-origin:0 0;animation:nbob .6s ease-in-out .3s 8,dip 3s cubic-bezier(.4,0,.3,1) 5.15s both}
@keyframes nbob{0%,100%{transform:rotate(0)}25%{transform:rotate(3deg)}75%{transform:rotate(-3deg)}}
@keyframes dip{0%{transform:rotate(0) translate(0,0)}12%{transform:rotate(66deg) translate(10px,30px)}22%{transform:rotate(58deg) translate(8px,28px)}32%{transform:rotate(68deg) translate(10px,31px)}42%{transform:rotate(58deg) translate(8px,28px)}52%{transform:rotate(68deg) translate(10px,31px)}62%{transform:rotate(58deg) translate(8px,28px)}72%{transform:rotate(66deg) translate(10px,30px)}100%{transform:rotate(66deg) translate(10px,30px)}}
.head{transform-origin:10px -10px;animation:hsnf .5s ease-in-out 4.5s 2 alternate both}@keyframes hsnf{from{transform:rotate(0)}to{transform:rotate(-8deg)}}
.ear{transform-origin:0 0;animation:eflap .6s ease-in-out .3s 8,eflap2 .3s ease-in-out 5.15s 9 alternate}
@keyframes eflap{0%,100%{transform:rotate(0)}30%{transform:rotate(10deg)}70%{transform:rotate(-8deg)}}@keyframes eflap2{from{transform:rotate(0)}to{transform:rotate(12deg)}}
.tongue{opacity:0;animation:tg .7s ease-out 4.6s both}@keyframes tg{0%{opacity:0}30%,100%{opacity:1}}
.tg{transform-origin:2px 34px;animation:tgs .6s ease-in-out .3s 8}@keyframes tgs{0%,100%{transform:rotate(0)}50%{transform:rotate(14deg)}}
.heartg{opacity:0;animation:hp 2.1s ease-out 4.65s both}
.heart{transform-box:fill-box;transform-origin:50% 100%;animation:hpop .7s cubic-bezier(.2,1.8,.3,1) 4.65s both}
@keyframes hp{0%{opacity:0;transform:translateY(20px)}12%{opacity:1}70%{opacity:1}100%{opacity:0;transform:translateY(-60px)}}@keyframes hpop{from{transform:scale(0)}to{transform:scale(1)}}
.spk{opacity:0;transform-box:fill-box;transform-origin:center;animation:spk 1.3s ease-out 4.8s both}.spk.s2{animation-delay:5s}@keyframes spk{0%{opacity:0;transform:scale(0) rotate(0)}40%{opacity:1;transform:scale(1.2) rotate(90deg)}100%{opacity:0;transform:scale(.4) rotate(180deg)}}
.food{transform-origin:715px 722px;animation:eat 3s ease-in 5.3s both}@keyframes eat{to{transform:scaleY(.45)}}
.kb{opacity:0;animation:kbj .7s ease-out both}@keyframes kbj{0%{opacity:0;transform:translate(0,0)}15%{opacity:1}60%{transform:translate(var(--kx),-42px)}100%{opacity:0;transform:translate(calc(var(--kx)*1.6),6px)}}
.kb{animation-iteration-count:3}
@keyframes nameIn{0%{opacity:0;transform:translateY(-30px) scale(.8)}55%{opacity:1;transform:translateY(5px) scale(1.04)}100%{opacity:1;transform:none}}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:.9;transform:none}}`;
  const d0 = deep(a, 0.2), d1 = deep(b, 0.2);
  return scene(o, {
    svg, css, top: 17, bg: "#fff2d8", dur: 9, dark: false, drift: ["scale(1.04)", "scale(1)"],
    brandCss: `.brand{background-image:linear-gradient(95deg,${d0},${d1});filter:drop-shadow(0 3px 0 rgba(255,255,255,.6));animation:nameIn 1s cubic-bezier(.2,.9,.3,1) 6.9s both}.tagline{color:#5b3a1a;text-shadow:none;animation:fadeUp 1.1s ease-out 7.7s both}.vig{background:radial-gradient(ellipse at 50% 46%,transparent 58%,rgba(70,30,0,.28))}`,
  });
}
