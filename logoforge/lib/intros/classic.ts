import { Opts, esc, graphemes, ico, icoWhite, mix, nameBlock, page, rng } from "./shared";
function peacock(o: Opts) {
  const N = 11;
  const feathers = Array.from({ length: N }, (_, k) => ({ ang: -80 + k * (160 / (N - 1)), delay: 0.3 + Math.abs(k - (N - 1) / 2) * 0.1 }))
    .sort((x, y) => Math.abs(y.ang) - Math.abs(x.ang))
    .map(
      (f) => `<g class="f" style="--a:${f.ang}deg;animation-delay:${f.delay.toFixed(2)}s">
<path d="M200 238C176 196 174 120 200 58C226 120 224 196 200 238Z" fill="url(#fg)" opacity=".92"/>
<path d="M200 238V70" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/>
<ellipse cx="200" cy="88" rx="24" ry="32" fill="#f5c04a"/><ellipse cx="200" cy="90" rx="17" ry="24" fill="#0e9f9f"/>
<ellipse cx="200" cy="92" rx="10" ry="15" fill="#16307f"/><ellipse cx="200" cy="93" rx="4" ry="7" fill="#050816"/></g>`
    )
    .join("");
  const svg = `<svg viewBox="0 0 400 330" role="img" aria-label="Peacock opening its feathers" style="width:min(88vw,50vh,480px);height:auto;overflow:visible">
<defs><linearGradient id="fg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${o.colors[1]}"/><stop offset="1" stop-color="${o.colors[0]}"/></linearGradient></defs>
${feathers}
<g class="bird"><path d="M200 232C176 244 170 286 200 318C230 286 224 244 200 232Z" fill="#0b4a8f"/><path d="M200 238C188 252 186 280 200 304C214 280 212 252 200 238Z" fill="#1fb5c9" opacity=".6"/>
<circle cx="200" cy="222" r="13" fill="#0e5fb0"/><circle cx="195" cy="220" r="2" fill="#fff"/><circle cx="205" cy="220" r="2" fill="#fff"/><path d="M197 227L203 227L200 235Z" fill="#f5c04a"/>
<path d="M196 211L190 197M200 209V193M204 211L210 197" stroke="#f5c04a" stroke-width="2" stroke-linecap="round"/><circle cx="190" cy="195" r="3" fill="#f5c04a"/><circle cx="200" cy="191" r="3" fill="#f5c04a"/><circle cx="210" cy="195" r="3" fill="#f5c04a"/></g></svg>`;
  const css = `
@keyframes open{from{transform:rotate(0deg) scaleY(.15);opacity:0}50%{opacity:1}to{transform:rotate(var(--a)) scaleY(1);opacity:1}}
.f{transform-origin:200px 238px;animation:open 1.5s cubic-bezier(.2,1.25,.3,1) both}
.bird{animation:rise .8s ease-out both}`;
  return page(o, css, `<div class="stage">${svg}${nameBlock(o, 2.5)}</div>`);
}

function orbit(o: Opts) {
  const icons = Array.from({ length: 8 }, (_, k) => {
    const c = k % 2 ? o.colors[1] : o.colors[0];
    return `<span class="o" style="--r:${k * 45}deg;animation-delay:${(k * 0.05).toFixed(2)}s"><svg viewBox="0 0 100 100" width="56" height="56"><path d="${o.icon}" fill="${c}" fill-rule="evenodd"/></svg></span>`;
  }).join("");
  const css = `
.ring{position:absolute;left:50%;top:50%;width:0;height:0;animation:spin 3s cubic-bezier(.5,0,.8,.6) both}
.o{position:absolute;left:-28px;top:-28px;width:56px;height:56px;animation:fly 3s ease-in-out both}
.o svg{display:block}
.pulse{position:absolute;left:50%;top:50%;width:40px;height:40px;margin:-20px;border-radius:50%;border:3px solid ${o.colors[0]};opacity:0;animation:pulse 1s ease-out 2.6s both}
.center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:pop .9s cubic-bezier(.2,1.4,.3,1) 2.6s both}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(420deg)}}
@keyframes fly{0%{transform:rotate(var(--r)) translateX(0) scale(0);opacity:0}30%{transform:rotate(var(--r)) translateX(150px) scale(1);opacity:1}78%{transform:rotate(var(--r)) translateX(150px) scale(1);opacity:1}100%{transform:rotate(var(--r)) translateX(60vmax) scale(2.2);opacity:0}}
@keyframes pulse{from{transform:scale(1);opacity:.9}to{transform:scale(34);opacity:0}}
@keyframes pop{from{opacity:0;transform:scale(.3)}to{opacity:1;transform:scale(1)}}`;
  const text = `<h1 class="name">${esc(o.brand)}</h1>${o.tagline ? `<p class="tag">${esc(o.tagline)}</p>` : ""}`;
  return page(o, css, `<div class="stage"><div class="ring">${icons}</div><div class="pulse"></div><div class="center">${text}</div></div>`);
}

function carousel(o: Opts) {
  const N = 10;
  const cards = Array.from({ length: N }, (_, k) => {
    const [a, b] = k % 2 ? [o.colors[1], o.colors[0]] : o.colors;
    return `<div class="c" style="--a:${(k * 360) / N}deg;background:linear-gradient(135deg,${a},${b})"><svg viewBox="0 0 100 100" width="58" height="58"><path d="${o.icon}" fill="#fff" fill-rule="evenodd"/></svg></div>`;
  }).join("");
  const css = `
.scene{position:absolute;inset:0;perspective:1000px}
.tilt,.drop,.spin,.burst{position:absolute;left:50%;top:50%;width:0;height:0;transform-style:preserve-3d}
.tilt{transform:rotateX(-14deg)}
.drop{animation:drop 1.7s cubic-bezier(.3,1.25,.5,1) both}
.spin{animation:rot 3.6s ease-in-out both}
.burst{animation:burst 1s ease-in 2.8s both}
.c{position:absolute;left:-55px;top:-55px;width:110px;height:110px;border-radius:20px;display:grid;place-items:center;transform:rotateY(var(--a)) translateZ(250px);box-shadow:0 10px 30px rgba(0,0,0,.45);animation:cfade .5s ease-in 3.3s both}
.title{position:absolute;left:0;right:0;bottom:14%;z-index:2;display:flex;flex-direction:column;align-items:center}
@keyframes drop{from{transform:translateY(-75vh)}to{transform:none}}
@keyframes rot{from{transform:rotateY(0)}to{transform:rotateY(540deg)}}
@keyframes burst{from{transform:scale(1)}to{transform:scale(4.5)}}
@keyframes cfade{from{opacity:1}to{opacity:0}}`;
  return page(o, css, `<div class="stage"><div class="scene"><div class="tilt"><div class="drop"><div class="spin"><div class="burst">${cards}</div></div></div></div></div><div class="title">${nameBlock(o, 3.2)}</div></div>`);
}

function typewriter(o: Opts) {
  const n = Math.max(graphemes(o.brand).length, 1);
  const dur = Math.min(0.14 * n + 0.6, 3.2);
  // clip-path reveal in n steps works with any font (the old width-in-ch trick only worked for monospace)
  const css = `
.twrap{position:relative;display:inline-block;max-width:94vw}
.tw{display:inline-block;white-space:nowrap;font-size:clamp(24px,min(6.5vw,64px),64px);padding:0 .08em;color:#f8fafc;clip-path:inset(-10% 100% -10% 0);animation:type ${dur.toFixed(2)}s steps(${n}) .6s forwards}
.caret{position:absolute;top:8%;bottom:8%;left:0;width:.09em;min-width:3px;background:${o.colors[1]};animation:cmove ${dur.toFixed(2)}s steps(${n}) .6s forwards,caret .7s step-end infinite}
@keyframes type{to{clip-path:inset(-10% 0 -10% 0)}}
@keyframes cmove{to{left:100%}}
@keyframes caret{50%{background:transparent}}
.ic{animation:rise .8s ease-out both;margin-bottom:22px}`;
  const tag = o.tagline ? `<p class="tag" style="animation:rise .9s ease-out ${(0.6 + dur + 0.2).toFixed(2)}s both">${esc(o.tagline)}</p>` : "";
  return page(o, css, `<div class="stage">${ico(o, 84, "t1", 'class="ic"')}<div class="twrap"><div class="tw">${esc(o.brand)}</div><i class="caret"></i></div>${tag}</div>`);
}

function neon(o: Opts) {
  const [a, b] = o.colors;
  const css = `
.frame{border:3px solid ${b};border-radius:18px;padding:26px 46px;box-shadow:0 0 16px ${b},inset 0 0 16px ${b};animation:flick 3.2s linear .3s both}
.nn{font-size:clamp(30px,8vw,76px);letter-spacing:.06em;color:#fff;text-align:center;text-shadow:0 0 6px #fff,0 0 16px ${a},0 0 36px ${a},0 0 70px ${b}}
.glow{filter:drop-shadow(0 0 12px ${a}) drop-shadow(0 0 28px ${b});margin-bottom:24px;animation:flick 3.2s linear 0s both}
@keyframes flick{0%{opacity:0}5%{opacity:1}8%{opacity:.1}12%{opacity:1}15%{opacity:.2}20%{opacity:1}24%{opacity:.35}30%,100%{opacity:1}}`;
  return page(o, css, `<div class="stage">${ico(o, 90, "n1", 'class="glow"')}<div class="frame"><div class="nn">${esc(o.brand)}</div></div>${o.tagline ? `<p class="tag" style="animation:rise .9s ease-out 2.6s both">${esc(o.tagline)}</p>` : ""}</div>`);
}

function glitch(o: Opts) {
  const [a, b] = o.colors;
  const css = `
.g{position:relative;font-size:clamp(30px,8vw,76px);font-weight:800;color:#fff;text-align:center;padding:0 16px;animation:rise .6s ease-out .2s both}
.g::before,.g::after{content:attr(data-t);position:absolute;left:0;top:0;width:100%;overflow:hidden;padding:0 16px}
.g::before{color:${a};clip-path:inset(0 0 60% 0);animation:gl1 .9s steps(2) .6s 3 both}
.g::after{color:${b};clip-path:inset(60% 0 0 0);animation:gl2 .8s steps(2) .6s 3 both}
@keyframes gl1{0%{clip-path:inset(10% 0 70% 0);transform:translate(-7px,0)}25%{clip-path:inset(55% 0 20% 0);transform:translate(6px,0)}50%{clip-path:inset(30% 0 45% 0);transform:translate(-4px,0)}75%{clip-path:inset(75% 0 5% 0);transform:translate(5px,0)}100%{clip-path:inset(0 0 100% 0);transform:none}}
@keyframes gl2{0%{clip-path:inset(70% 0 10% 0);transform:translate(7px,0)}25%{clip-path:inset(20% 0 55% 0);transform:translate(-6px,0)}50%{clip-path:inset(45% 0 30% 0);transform:translate(4px,0)}75%{clip-path:inset(5% 0 75% 0);transform:translate(-5px,0)}100%{clip-path:inset(100% 0 0 0);transform:none}}
.scan{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(255,255,255,.05) 0 2px,transparent 2px 4px)}
.ic{margin-bottom:20px;animation:blink 1.2s steps(2) .3s 2 both}
@keyframes blink{0%{opacity:0}50%{opacity:1}100%{opacity:1}}`;
  return page(o, css, `<div class="stage">${ico(o, 80, "g1", 'class="ic"')}<div class="g" data-t="${esc(o.brand)}">${esc(o.brand)}</div>${o.tagline ? `<p class="tag" style="animation:rise .9s ease-out 2.2s both">${esc(o.tagline)}</p>` : ""}<div class="scan"></div></div>`);
}

function bounce(o: Opts) {
  const chars = graphemes(o.brand);
  const L = Math.max(chars.length - 1, 1);
  const letters = chars.map((ch, k) => `<span class="l" style="color:${mix(o.colors[0], o.colors[1], k / L)};animation-delay:${(0.3 + k * 0.07).toFixed(2)}s">${ch === " " ? "&nbsp;" : esc(ch)}</span>`).join("");
  const css = `
.word{font-size:clamp(34px,9vw,84px);font-weight:700;text-align:center;padding:0 16px;line-height:1.15}
.l{display:inline-block;animation:drop .9s cubic-bezier(.2,1.7,.4,1) both}
@keyframes drop{from{opacity:0;transform:translateY(-140px) rotate(-25deg) scale(.4)}to{opacity:1;transform:none}}`;
  const tag = o.tagline ? `<p class="tag" style="animation:rise .9s ease-out ${(0.6 + chars.length * 0.07 + 0.5).toFixed(2)}s both">${esc(o.tagline)}</p>` : "";
  return page(o, css, `<div class="stage"><div class="word">${letters}</div>${tag}</div>`);
}

function spotlight(o: Opts) {
  const css = `
.name{animation:lit 4s ease-in-out both}
.ic{margin-bottom:18px;animation:lit 4s ease-in-out both}
@keyframes lit{0%{opacity:0}30%{opacity:.12}60%{opacity:.18}82%,100%{opacity:1}}
.beam{position:absolute;top:-6%;left:50%;width:70vmax;height:130%;margin-left:-35vmax;background:linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,.02) 85%);clip-path:polygon(47% 0,53% 0,100% 100%,0 100%);transform-origin:50% 0;animation:swing 3.6s ease-in-out both;pointer-events:none}
@keyframes swing{0%{transform:rotate(-38deg);opacity:0}12%{opacity:1}50%{transform:rotate(34deg)}80%{transform:rotate(0)}100%{transform:rotate(0);opacity:.3}}`;
  const tag = o.tagline ? `<p class="tag" style="animation:rise .9s ease-out 3.6s both">${esc(o.tagline)}</p>` : "";
  return page(o, css, `<div class="stage"><div class="beam"></div>${ico(o, 84, "s1", 'class="ic"')}<h1 class="name">${esc(o.brand)}</h1>${tag}</div>`);
}

function curtain(o: Opts) {
  const [a, b] = o.colors;
  const fold = "repeating-linear-gradient(90deg,rgba(0,0,0,.28) 0 14px,transparent 14px 42px)";
  const css = `
.cl,.cr{position:absolute;top:0;bottom:0;width:50.5%;z-index:3;background:${fold},linear-gradient(180deg,${a},${b})}
.cl{left:0;animation:openL 1.7s cubic-bezier(.7,0,.2,1) 1.1s forwards}
.cr{right:0;animation:openR 1.7s cubic-bezier(.7,0,.2,1) 1.1s forwards}
@keyframes openL{to{transform:translateX(-101%)}}
@keyframes openR{to{transform:translateX(101%)}}
.show{display:flex;flex-direction:column;align-items:center;animation:pop 1.2s cubic-bezier(.2,1.3,.3,1) 1.8s both}
@keyframes pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}`;
  return page(o, css, `<div class="stage"><div class="cl"></div><div class="cr"></div><div class="show">${ico(o, 96, "c1", 'style="margin-bottom:16px"')}<h1 class="name">${esc(o.brand)}</h1>${o.tagline ? `<p class="tag">${esc(o.tagline)}</p>` : ""}</div></div>`);
}

function iris(o: Opts) {
  const [a, b] = o.colors;
  const css = `
.iris{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,${a},${b});clip-path:circle(0% at 50% 50%);animation:iris 1.5s cubic-bezier(.7,0,.2,1) .4s forwards}
@keyframes iris{to{clip-path:circle(80% at 50% 50%)}}
.in{display:flex;flex-direction:column;align-items:center;animation:zin 1.6s ease-out .6s both}
@keyframes zin{from{transform:scale(.7)}to{transform:scale(1)}}
.wh{font-size:clamp(30px,8vw,72px);line-height:1.1;color:#fff;text-align:center;padding:0 16px;letter-spacing:-.02em}
.dot{position:absolute;left:50%;top:50%;width:14px;height:14px;margin:-7px;border-radius:50%;background:#fff;animation:dot .5s ease-out both}
@keyframes dot{from{transform:scale(0)}to{transform:scale(1)}}`;
  return page(o, css, `<div class="stage"><div class="dot"></div><div class="iris"><div class="in">${icoWhite(o, 90)}<h1 class="wh" style="margin-top:16px">${esc(o.brand)}</h1>${o.tagline ? `<p class="tag" style="color:#fff">${esc(o.tagline)}</p>` : ""}</div></div></div>`);
}

function particles(o: Opts) {
  const r = rng(7);
  const N = 36;
  const dots = Array.from({ length: N }, (_, k) => {
    const ang = r() * Math.PI * 2, dist = 28 + r() * 30, s = 5 + Math.round(r() * 9);
    return `<i class="p" style="--x:${(Math.cos(ang) * dist).toFixed(1)}vmin;--y:${(Math.sin(ang) * dist).toFixed(1)}vmin;--s:${s}px;--c:${mix(o.colors[0], o.colors[1], r())};--d:${(r() * 0.5).toFixed(2)}s"></i>`;
  }).join("");
  const css = `
.p{position:absolute;left:50%;top:50%;width:var(--s);height:var(--s);margin:calc(var(--s)/-2);border-radius:50%;background:var(--c);animation:gather 1.9s cubic-bezier(.6,0,.3,1) var(--d) both}
@keyframes gather{0%{transform:translate(var(--x),var(--y));opacity:0}20%{opacity:1}100%{transform:translate(0,0) scale(.3);opacity:0}}
.ic{animation:pop .9s cubic-bezier(.2,1.6,.3,1) 1.9s both;margin-bottom:20px}
.shock{position:absolute;left:50%;top:50%;width:60px;height:60px;margin:-30px;border-radius:50%;border:3px solid ${o.colors[1]};opacity:0;animation:sw 1.2s ease-out 1.9s both}
@keyframes pop{from{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}}
@keyframes sw{from{transform:scale(.4);opacity:.9}to{transform:scale(16);opacity:0}}`;
  return page(o, css, `<div class="stage">${dots}<div class="shock"></div>${ico(o, 100, "p1", 'class="ic"')}${nameBlock(o, 2.6)}</div>`);
}

function slide(o: Opts) {
  const css = `
.row{display:flex;align-items:center;gap:clamp(12px,3vw,26px);padding:0 16px}
.il{animation:fromL 1.1s cubic-bezier(.2,.9,.3,1) .2s both}
.name{animation:fromR 1.1s cubic-bezier(.2,.9,.3,1) .2s both}
@keyframes fromL{from{opacity:0;transform:translateX(-60vw)}to{opacity:1;transform:none}}
@keyframes fromR{from{opacity:0;transform:translateX(60vw)}to{opacity:1;transform:none}}
.line{height:3px;width:0;margin-top:18px;border-radius:2px;background:linear-gradient(90deg,${o.colors[0]},${o.colors[1]});animation:grow 1s ease-out 1.2s forwards}
@keyframes grow{to{width:min(70vw,520px)}}`;
  return page(o, css, `<div class="stage"><div class="row"><span class="il">${ico(o, 88, "sl1")}</span><h1 class="name">${esc(o.brand)}</h1></div><div class="line"></div>${o.tagline ? `<p class="tag" style="animation:rise .9s ease-out 1.8s both">${esc(o.tagline)}</p>` : ""}</div>`);
}

function flip(o: Opts) {
  const css = `
.scene{perspective:900px;margin-bottom:34px}
.tile{width:150px;height:150px;border-radius:34px;display:grid;place-items:center;background:linear-gradient(135deg,${o.colors[0]},${o.colors[1]});box-shadow:0 24px 60px rgba(0,0,0,.55),inset 0 2px 0 rgba(255,255,255,.35);transform-style:preserve-3d;animation:flip 2.3s cubic-bezier(.3,1.15,.4,1) both}
@keyframes flip{from{transform:rotateY(-720deg) rotateX(20deg) scale(.15);opacity:0}55%{opacity:1}to{transform:none}}`;
  return page(o, css, `<div class="stage"><div class="scene"><div class="tile">${icoWhite(o, 86)}</div></div>${nameBlock(o, 2.1)}</div>`);
}

function ripple(o: Opts) {
  const rings = Array.from({ length: 5 }, (_, k) => `<i class="rg" style="--d:${(0.3 + k * 0.45).toFixed(2)}s;border-color:${o.colors[k % 2]}"></i>`).join("");
  const css = `
.rg{position:absolute;left:50%;top:50%;width:80px;height:80px;margin:-40px;border-radius:50%;border:2px solid;opacity:0;animation:rip 2.8s ease-out var(--d) both}
@keyframes rip{0%{transform:scale(.2);opacity:.9}100%{transform:scale(14);opacity:0}}
.mid{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center}
.ic{animation:pop .9s cubic-bezier(.2,1.5,.3,1) .3s both,float 3s ease-in-out 1.2s infinite;margin-bottom:22px}
@keyframes pop{from{opacity:0;transform:scale(0)}to{opacity:1;transform:none}}
@keyframes float{50%{transform:translateY(-8px)}}`;
  return page(o, css, `<div class="stage">${rings}<div class="mid">${ico(o, 96, "r1", 'class="ic"')}${nameBlock(o, 1.3)}</div></div>`);
}

function wipe(o: Opts) {
  const cols = [o.colors[0], mix(o.colors[0], o.colors[1], 0.5), o.colors[1], mix(o.colors[0], o.colors[1], 0.25)];
  const bars = cols.map((c, k) => `<i class="bar" style="--i:${k};--c:${c}"></i>`).join("");
  const css = `
.bar{position:absolute;left:0;width:100%;height:25.2%;top:calc(var(--i)*25%);background:var(--c);transform:translateX(-101%);z-index:3;animation:wipe 1.9s cubic-bezier(.7,0,.3,1) calc(var(--i)*.12s) both}
@keyframes wipe{0%{transform:translateX(-101%)}38%,55%{transform:none}100%{transform:translateX(101%)}}
.ic{margin-bottom:18px;animation:rise .8s ease-out 1.6s both}`;
  return page(o, css, `<div class="stage">${ico(o, 84, "w1", 'class="ic"')}${nameBlock(o, 1.8)}${bars}</div>`);
}

function draw(o: Opts) {
  const css = `
.dr{stroke-dasharray:1;stroke-dashoffset:1;fill-opacity:0;animation:draw 2.2s ease-in-out .3s forwards,fillin .9s ease-out 2.4s forwards}
@keyframes draw{to{stroke-dashoffset:0}}
@keyframes fillin{to{fill-opacity:1}}
.wrap{margin-bottom:26px}`;
  const svg = `<svg viewBox="-4 -4 108 108" width="170" height="170"><defs><linearGradient id="dg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${o.colors[0]}"/><stop offset="1" stop-color="${o.colors[1]}"/></linearGradient></defs><path class="dr" pathLength="1" d="${o.icon}" fill="url(#dg)" fill-rule="evenodd" stroke="url(#dg)" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
  return page(o, css, `<div class="stage"><div class="wrap">${svg}</div>${nameBlock(o, 3)}</div>`);
}

function cube(o: Opts) {
  const faces = ["translateZ(70px)", "rotateY(90deg) translateZ(70px)", "rotateY(180deg) translateZ(70px)", "rotateY(-90deg) translateZ(70px)", "rotateX(90deg) translateZ(70px)", "rotateX(-90deg) translateZ(70px)"]
    .map((t, k) => `<div class="face" style="transform:${t};background:linear-gradient(135deg,${k % 2 ? o.colors[1] : o.colors[0]},${k % 2 ? o.colors[0] : o.colors[1]})">${icoWhite(o, 68)}</div>`)
    .join("");
  const css = `
.scene{perspective:800px;margin:30px 0 70px}
.cube{position:relative;width:140px;height:140px;transform-style:preserve-3d;animation:cr 4s ease-in-out both}
.face{position:absolute;inset:0;display:grid;place-items:center;border-radius:14px;border:2px solid rgba(255,255,255,.28);box-shadow:inset 0 0 30px rgba(0,0,0,.25)}
@keyframes cr{0%{transform:rotateX(-22deg) rotateY(0) scale(.15);opacity:0}22%{opacity:1;transform:rotateX(-22deg) rotateY(200deg) scale(1)}80%{transform:rotateX(-22deg) rotateY(520deg) scale(1)}100%{transform:rotateX(-22deg) rotateY(720deg) scale(1.1)}}`;
  return page(o, css, `<div class="stage"><div class="scene"><div class="cube">${faces}</div></div>${nameBlock(o, 3.2)}</div>`);
}

export const CLASSIC: Record<string, (o: Opts) => string> = {
  peacock, orbit, carousel, typewriter, neon, glitch, bounce, spotlight, curtain, iris, particles, slide, flip, ripple, wipe, draw, cube,
};
