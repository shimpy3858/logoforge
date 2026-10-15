"use client";
import { useEffect, useRef } from "react";

/**
 * LogoForge opening: a dark workshop, a white-hot ingot on an anvil, three hammer blows
 * (screen shake, spark physics, heat glow), the metal flattens, cools into the brand colours and
 * becomes the wordmark with a metallic shine. ~5.3s, then `onOpen` is called (the page fades it out).
 * Pure canvas 2D: no extra dependencies, additive blending ("lighter") gives the bloom look.
 * Deterministic: all randomness is seeded, all motion is driven by elapsed time.
 */
const HITS = [1.25, 2.0, 2.75];
const T_OPEN = 5.3;
const T_STOP = 7; // stop drawing shortly after the page starts fading us out

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (p: number) => { p = clamp(p); return p * p * (3 - 2 * p); };
const easeOutBack = (p: number) => { p = clamp(p); const c = 2.2; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
type RGB = [number, number, number];
const mixc = (a: RGB, b: RGB, t: number): RGB => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const css = (c: RGB, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const mulberry = (seed: number) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

const WHITE: RGB = [255, 246, 214], YEL: RGB = [255, 190, 70], ORG: RGB = [255, 96, 20], DEEP: RGB = [150, 40, 12];
const BRAND_A: RGB = [245, 158, 11], BRAND_B: RGB = [239, 68, 68];

// the ingot flattens with every blow
const SY = [1, 0.68, 0.44, 0.28], SX = [1, 1.28, 1.55, 1.82];
function squash(t: number) {
  let n = 0; for (const h of HITS) if (t >= h) n++;
  if (n === 0) return { sy: 1, sx: 1 };
  const e = easeOutBack((t - HITS[n - 1]) / 0.2);
  return { sy: lerp(SY[n - 1], SY[n], e), sx: lerp(SX[n - 1], SX[n], e) };
}
const PIVOT = { x: 330, y: -200 }, HANDLE = 300;
const angDown = (top: number) => Math.PI - Math.asin(clamp((top - 40 - PIVOT.y) / HANDLE, -0.99, 0.99));
const A_REST = 3.72, A_WIND = 3.85; // radians (pointing up and to the left)
function hammerAngle(t: number) {
  const tops = [-90 * SY[0], -90 * SY[1], -90 * SY[2]];
  for (let i = 0; i < HITS.length; i++) {
    const hit = HITS[i], down = angDown(tops[i]), base = i === 0 ? A_REST : A_REST - 0.1;
    if (t < hit - 0.4) return base + (i === 0 ? Math.sin(t * 2) * 0.02 : 0);
    if (t < hit - 0.12) return lerp(base, A_WIND, smooth((t - (hit - 0.4)) / 0.28));
    if (t < hit) { const p = (t - (hit - 0.12)) / 0.12; return lerp(A_WIND, down, p * p * p); }
    if (t < hit + 0.25) return lerp(down, A_REST - 0.1, smooth((t - hit) / 0.25));
  }
  return A_REST - 0.1 + smooth((t - 3.0) / 0.6) * 0.9; // after the last blow the hammer lifts away
}

type Spark = { x: number; y: number; px: number; py: number; vx: number; vy: number; life: number; max: number; size: number };

export default function Intro3D({ open, onOpen, brand }: { open: boolean; onOpen: () => void; brand: string }) {
  const cv = useRef<HTMLCanvasElement | null>(null);
  const fired = useRef(false);
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  useEffect(() => {
    const canvas = cv.current!;
    const ctx = canvas.getContext("2d");
    if (ctx && !ctx.roundRect) (ctx as CanvasRenderingContext2D).roundRect = function (this: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) { this.rect(x, y, w, h); };
    if (!ctx) { const t = setTimeout(() => onOpenRef.current(), 300); return () => clearTimeout(t); }
    let w = 0, h = 0, dpr = 1, k = 1, raf = 0, last = 0, t = 0, stopped = false;
    const rnd = mulberry(2024);
    const sparks: Spark[] = [];
    const embers = Array.from({ length: 56 }, () => ({ x: rnd(), y: rnd(), s: 0.4 + rnd() * 1.4, v: 12 + rnd() * 34, ph: rnd() * 6.28, a: 0.3 + rnd() * 0.6 }));
    let shake = 0, flash = 0, struck = 0;
    let textCv: HTMLCanvasElement | null = null, shineCv: HTMLCanvasElement | null = null;
    let tW = 600, tH = 150, tFs = 150;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const cap = (navigator.hardwareConcurrency || 4) <= 4 || r.width < 500 ? 1.5 : 2;
      dpr = Math.min(window.devicePixelRatio || 1, cap);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      k = Math.min(w / 720, h / 640);
      textCv = null; // rebuilt lazily for the new size
    };

    const FONT = '"LF Anton", Impact, "Arial Black", sans-serif';
    const buildText = () => {
      const m = document.createElement("canvas").getContext("2d")!;
      m.font = `100px ${FONT}`;
      const w100 = m.measureText(brand).width || 400;
      tW = Math.min(640, (w / k) * 0.88); tFs = Math.min(190, (100 * tW) / w100); tW = (w100 * tFs) / 100; tH = tFs * 1.05;
      const pad = 24, sc = k * dpr;
      const mk = () => { const c = document.createElement("canvas"); c.width = Math.ceil((tW + pad * 2) * sc); c.height = Math.ceil((tH + pad * 2) * sc); return c; };
      textCv = mk(); shineCv = mk();
      const c = textCv.getContext("2d")!; c.scale(sc, sc);
      c.font = `${tFs}px ${FONT}`; c.textAlign = "center"; c.textBaseline = "middle";
      const cx = tW / 2 + pad, cy = tH / 2 + pad + tFs * 0.04;
      const gh = c.createLinearGradient(pad, 0, pad + tW, 0); gh.addColorStop(0, css(BRAND_A)); gh.addColorStop(1, css(BRAND_B));
      c.shadowColor = "rgba(0,0,0,.55)"; c.shadowBlur = 14; c.shadowOffsetY = 6;
      c.fillStyle = gh; c.fillText(brand, cx, cy);
      c.shadowColor = "transparent";
      c.globalCompositeOperation = "source-atop";
      const gv = c.createLinearGradient(0, pad, 0, pad + tH);
      gv.addColorStop(0, "rgba(255,255,255,.75)"); gv.addColorStop(0.42, "rgba(255,255,255,.05)"); gv.addColorStop(0.5, "rgba(0,0,0,.12)"); gv.addColorStop(1, "rgba(0,0,0,.45)");
      c.fillStyle = gv; c.fillRect(0, 0, tW + pad * 2, tH + pad * 2);
    };

    const burst = (n: number, power: number) => {
      const top = -90 * squash(t + 0.01).sy;
      for (let i = 0; i < n; i++) {
        const a = -Math.PI * (0.08 + rnd() * 0.84), sp = (220 + rnd() * 760) * power;
        const x = (rnd() - 0.5) * 120 * squash(t).sx;
        sparks.push({ x, y: top, px: x, py: top, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: 0.6 + rnd() * 1.1, size: 1 + rnd() * 2.2 });
      }
      if (sparks.length > 420) sparks.splice(0, sparks.length - 420);
    };

    const step = (dt: number) => {
      for (let i = 0; i < HITS.length; i++) if (struck === i && t >= HITS[i]) { struck++; shake = [11, 8, 6][i]; flash = [0.4, 0.3, 0.45][i]; burst([80, 70, 110][i], [1, 0.95, 1.15][i]); }
      shake *= Math.pow(0.0009, dt); flash *= Math.pow(0.0004, dt);
      for (const s of sparks) {
        s.life += dt; s.px = s.x; s.py = s.y; s.vy += 1700 * dt; s.vx *= 1 - 0.6 * dt;
        s.x += s.vx * dt; s.y += s.vy * dt;
        if (s.y > 0 && Math.abs(s.x) < 205 && s.vy > 0) { s.y = 0; s.vy *= -0.38; s.vx *= 0.7; }
      }
      for (let i = sparks.length - 1; i >= 0; i--) if (sparks[i].life > sparks[i].max || sparks[i].y > 420) sparks.splice(i, 1);
      for (const e of embers) { e.y -= (e.v * dt) / h; e.x += Math.sin(t * 0.8 + e.ph) * 0.02 * dt; if (e.y < -0.05) { e.y = 1.05; e.x = rnd(); } }
    };

    const heat = () => 1 - smooth((t - 2.65) / 1.7);

    const drawHammer = (ang: number, alpha: number, blur: boolean) => {
      const draw = (a: number, al: number) => {
        ctx.save(); ctx.globalAlpha = al * alpha; ctx.translate(PIVOT.x, PIVOT.y); ctx.rotate(a);
        const hg = ctx.createLinearGradient(0, -9, 0, 9); hg.addColorStop(0, "#7a5230"); hg.addColorStop(0.5, "#5a3a20"); hg.addColorStop(1, "#2e1c0e");
        ctx.fillStyle = hg; ctx.beginPath(); ctx.roundRect(-40, -9, HANDLE + 14, 18, 6); ctx.fill();
        const sg = ctx.createLinearGradient(0, -58, 0, 58); sg.addColorStop(0, "#8d95a6"); sg.addColorStop(0.35, "#4a5060"); sg.addColorStop(1, "#1b1e27");
        ctx.fillStyle = sg; ctx.beginPath(); ctx.roundRect(HANDLE - 36, -58, 92, 116, 9); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,.3)"; ctx.fillRect(HANDLE - 32, -54, 84, 7);
        ctx.restore();
      };
      if (blur) for (let g = 3; g >= 1; g--) draw(ang + g * 0.07, 0.16);
      draw(ang, 1);
    };

    const advance = (dt: number) => {
      t += dt; step(dt);
      if (t >= T_OPEN && !fired.current) { fired.current = true; onOpenRef.current(); }
    };
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      advance(Math.min(0.05, (now - last) / 1000 || 0)); last = now;
      if (t > T_STOP && !stopped) { stopped = true; cancelAnimationFrame(raf); return; }
      render();
    };
    const render = () => {
      if (t > 3 && !textCv) buildText();

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      // workshop background
      const bg = ctx.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, "#05060a"); bg.addColorStop(0.6, "#0d0907"); bg.addColorStop(1, "#150b06");
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      const fadeIn = smooth(t / 0.7), hh = heat();
      const flick = 0.92 + Math.sin(t * 17) * 0.04 + Math.sin(t * 7.3) * 0.04;
      const OX = w / 2, OY = h * 0.58;
      // dark beams and a forge glow on the left
      ctx.fillStyle = "#0b0807"; ctx.fillRect(w * 0.04, 0, w * 0.035, h); ctx.fillRect(w * 0.93, 0, w * 0.03, h);
      ctx.globalCompositeOperation = "lighter";
      let g = ctx.createRadialGradient(0, h, 0, 0, h, Math.max(w, h) * 0.8);
      g.addColorStop(0, `rgba(255,110,30,${0.34 * flick * fadeIn})`); g.addColorStop(1, "rgba(255,110,30,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";

      // ---- world (shaken)
      const sx = (rnd() - 0.5) * shake * k * 2, sy = (rnd() - 0.5) * shake * k * 2;
      const sink = smooth((t - 3.3) / 1.0);               // anvil sinks away while the wordmark takes over
      ctx.save(); ctx.translate(OX + sx, OY + sy + sink * 90 * k); ctx.scale(k, k);
      const worldAlpha = fadeIn * (1 - smooth((t - 3.5) / 0.9));

      ctx.globalAlpha = worldAlpha;
      // floor + stump
      ctx.fillStyle = "#0a0706"; ctx.fillRect(-900, 300, 1800, 600);
      const sg = ctx.createLinearGradient(-170, 0, 170, 0); sg.addColorStop(0, "#2a1a0f"); sg.addColorStop(0.5, "#4a2f1a"); sg.addColorStop(1, "#1d1109");
      ctx.fillStyle = sg; ctx.fillRect(-165, 188, 330, 112);
      ctx.strokeStyle = "rgba(0,0,0,.5)"; ctx.lineWidth = 3; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 55, 190); ctx.lineTo(i * 55 + 6, 300); ctx.stroke(); }
      // anvil
      const ag = ctx.createLinearGradient(0, -10, 0, 190); ag.addColorStop(0, "#6c7488"); ag.addColorStop(0.12, "#3b4152"); ag.addColorStop(1, "#14161d");
      ctx.fillStyle = ag; ctx.beginPath();
      ctx.moveTo(-262, 4); ctx.quadraticCurveTo(-200, -10, -150, 0); ctx.lineTo(170, 0); ctx.quadraticCurveTo(205, 0, 205, 24); ctx.quadraticCurveTo(195, 44, 150, 48);
      ctx.lineTo(122, 62); ctx.quadraticCurveTo(100, 122, 132, 152); ctx.lineTo(192, 152); ctx.lineTo(192, 192); ctx.lineTo(-192, 192); ctx.lineTo(-192, 152); ctx.lineTo(-132, 152);
      ctx.quadraticCurveTo(-100, 122, -122, 62); ctx.lineTo(-150, 48); ctx.quadraticCurveTo(-190, 40, -152, 26); ctx.quadraticCurveTo(-200, 24, -262, 4); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-150, 1.5); ctx.lineTo(170, 1.5); ctx.stroke();
      // heat light on the anvil face
      ctx.globalCompositeOperation = "lighter";
      g = ctx.createRadialGradient(0, 0, 0, 0, 0, 280); g.addColorStop(0, css(ORG, 0.5 * hh * flick)); g.addColorStop(1, css(ORG, 0)); ctx.fillStyle = g; ctx.fillRect(-300, -300, 600, 600);
      ctx.globalCompositeOperation = "source-over";

      // ingot
      const { sy: isy, sx: isx } = squash(t);
      const m = clamp((t - 3.05) / 0.9), ingotA = 1 - smooth(m * 1.4);
      if (ingotA > 0.01) {
        const bw = 190 * isx, bh = 90 * isy;
        const core = mixc(mixc([200, 90, 40], BRAND_A, 0.0), mixc(ORG, WHITE, clamp((hh - 0.5) * 2)), clamp(hh * 1.6));
        const edge = mixc(mixc(DEEP, BRAND_B, 0.5), mixc(ORG, YEL, clamp((hh - 0.5) * 2)), clamp(hh * 1.5));
        ctx.globalAlpha = worldAlpha * ingotA;
        const ig = ctx.createLinearGradient(-bw / 2, 0, bw / 2, 0); ig.addColorStop(0, css(edge)); ig.addColorStop(0.5, css(core)); ig.addColorStop(1, css(edge));
        ctx.fillStyle = ig; ctx.beginPath(); ctx.roundRect(-bw / 2, -bh, bw, bh, [10, 10, 4, 4]); ctx.fill();
        const tg = ctx.createLinearGradient(0, -bh, 0, 0); tg.addColorStop(0, "rgba(255,255,255,.55)"); tg.addColorStop(0.4, "rgba(255,255,255,0)"); ctx.fillStyle = tg; ctx.beginPath(); ctx.roundRect(-bw / 2, -bh, bw, bh, [10, 10, 4, 4]); ctx.fill();
      }
      // bloom around the metal
      ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = worldAlpha;
      const br = (230 + 40 * Math.sin(t * 9)) * (0.55 + 0.7 * hh) * isx ** 0.5;
      g = ctx.createRadialGradient(0, -45 * isy, 0, 0, -45 * isy, br);
      g.addColorStop(0, css(mixc(ORG, WHITE, hh), 0.75 * (0.35 + 0.65 * hh) * flick)); g.addColorStop(0.4, css(ORG, 0.25 * hh)); g.addColorStop(1, css(ORG, 0));
      ctx.fillStyle = g; ctx.fillRect(-br, -45 * isy - br, br * 2, br * 2);
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = worldAlpha;
      drawHammer(hammerAngle(t), worldAlpha, t > 0.5 && t < 3.2);
      ctx.restore();

      // ---- sparks (not faded with the world so they die naturally)
      ctx.save(); ctx.translate(OX + sx, OY + sy + sink * 90 * k); ctx.scale(k, k); ctx.globalCompositeOperation = "lighter"; ctx.lineCap = "round";
      for (const s of sparks) {
        const f = 1 - s.life / s.max, c = f > 0.7 ? WHITE : f > 0.38 ? YEL : ORG;
        ctx.strokeStyle = css(c, clamp(f * 1.4)); ctx.lineWidth = s.size * (0.4 + f);
        ctx.beginPath(); ctx.moveTo(s.px - s.vx * 0.012, s.py - s.vy * 0.012); ctx.lineTo(s.x, s.y); ctx.stroke();
        ctx.strokeStyle = css(ORG, f * 0.25); ctx.lineWidth = s.size * 4; ctx.stroke();
      }
      ctx.restore();

      // ---- ambient embers
      ctx.globalCompositeOperation = "lighter";
      for (const e of embers) {
        const a = e.a * (0.6 + 0.4 * Math.sin(t * 3 + e.ph)) * fadeIn;
        ctx.fillStyle = css(e.s > 1.2 ? YEL : ORG, a); ctx.beginPath(); ctx.arc(e.x * w, e.y * h, e.s * (w < 500 ? 1 : 1.3), 0, 6.283); ctx.fill();
      }

      // ---- wordmark
      if (textCv && shineCv && t > 3.05) {
        const p = smooth(m), a = smooth(m * 1.3);
        const ty = lerp(-tH / 2 - 10, -(h * 0.12) / k - 20, smooth((t - 3.3) / 1.1));
        const cw = lerp(190 * SX[3], tW + 60, p), ch = lerp(90 * SY[3], tH + 40, p);
        ctx.save(); ctx.translate(OX, OY + ty * k + sink * 40 * k); ctx.scale(k, k);
        // glow behind the letters cools from orange to a soft warm light
        ctx.globalCompositeOperation = "lighter";
        g = ctx.createRadialGradient(0, 0, 0, 0, 0, tW * 0.75); g.addColorStop(0, css(mixc(BRAND_A, ORG, hh), (0.32 * (0.4 + hh) + 0.1) * a)); g.addColorStop(1, css(ORG, 0));
        ctx.fillStyle = g; ctx.fillRect(-tW * 0.8, -tW * 0.8, tW * 1.6, tW * 1.6);
        ctx.globalCompositeOperation = "source-over";
        ctx.beginPath(); ctx.rect(-cw / 2, -ch / 2, cw, ch); ctx.clip();
        // metallic shine sweep
        const sc2 = shineCv.getContext("2d")!; sc2.setTransform(1, 0, 0, 1, 0, 0);
        sc2.globalCompositeOperation = "source-over"; sc2.clearRect(0, 0, shineCv.width, shineCv.height); sc2.drawImage(textCv, 0, 0);
        const sp = clamp((t - 4.0) / 1.15);
        if (sp > 0 && sp < 1) {
          const W = shineCv.width, H = shineCv.height, cx = lerp(-0.25, 1.25, smooth(sp)) * W, sl = H * 0.7;
          const sg2 = sc2.createLinearGradient(cx - W * 0.09, 0, cx + W * 0.09, 0);
          sg2.addColorStop(0, "rgba(255,255,255,0)"); sg2.addColorStop(0.5, "rgba(255,255,255,.95)"); sg2.addColorStop(1, "rgba(255,255,255,0)");
          sc2.globalCompositeOperation = "source-atop"; sc2.save(); sc2.translate(cx, H / 2); sc2.transform(1, 0, -0.35, 1, 0, 0); sc2.translate(-cx, -H / 2);
          sc2.fillStyle = sg2; sc2.fillRect(cx - W * 0.2, -sl, W * 0.4, H + sl * 2); sc2.restore();
        }
        const pad = 24;
        ctx.globalAlpha = a;
        ctx.drawImage(shineCv, -(tW / 2 + pad), -(tH / 2 + pad), tW + pad * 2, tH + pad * 2);
        ctx.restore();
      }

      // impact flash + vignette
      if (flash > 0.01) { ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = `rgba(255,205,140,${flash})`; ctx.fillRect(0, 0, w, h); }
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      const vg = ctx.createRadialGradient(w / 2, h * 0.5, Math.min(w, h) * 0.3, w / 2, h * 0.5, Math.max(w, h) * 0.75);
      vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.72)"); ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
    };

    resize();
    window.addEventListener("resize", resize);
    // make sure the wordmark font is on its way (it is declared in app/fonts.css)
    try { document.fonts?.load('150px "LF Anton"'); } catch {}
    last = performance.now();
    raf = requestAnimationFrame(frame);
    // Test hook (only when a test sets window.__FORGE_TEST before load): freeze and render the frame at time tt.
    const win = window as unknown as { __FORGE_TEST?: boolean; __forgeSeek?: (tt: number) => void };
    if (win.__FORGE_TEST) win.__forgeSeek = (tt: number) => { cancelAnimationFrame(raf); while (t < tt) advance(1 / 60); render(); };
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [brand]);

  return (
    <div className={`fixed inset-0 z-50 bg-[#05060a] transition-opacity duration-1000 ${open ? "pointer-events-none opacity-0" : "opacity-100"}`}>
      <canvas ref={cv} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      <h1 className="sr-only">{brand}</h1>
      <button onClick={() => onOpenRef.current()} className="absolute right-5 top-5 rounded border border-white/30 bg-black/30 px-3 py-1 text-sm text-white/80 backdrop-blur hover:bg-white/10">Skip intro</button>
    </div>
  );
}
