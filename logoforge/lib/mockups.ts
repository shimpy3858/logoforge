import { Input, brandText, esc, fileSlug, makeAppIconSvg, makeLogoSvg, palettesFor } from "./logo";
import { getFont } from "./fonts";
import { fontStyle } from "./fontdata";
import type { AppStyle } from "./logo";

export type MockupId =
  | "card" | "tshirt" | "mug" | "billboard" | "shop" | "tote"
  | "bag" | "social" | "laptop" | "letterhead" | "homescreen" | "appstore";

export const MOCKUPS: { id: MockupId; label: string }[] = [
  { id: "card", label: "Business cards" },
  { id: "tshirt", label: "T-shirt" },
  { id: "mug", label: "Coffee mug" },
  { id: "billboard", label: "Billboard" },
  { id: "shop", label: "Shop front sign" },
  { id: "tote", label: "Tote bag" },
  { id: "bag", label: "Shopping bag" },
  { id: "social", label: "Social profile" },
  { id: "laptop", label: "Laptop website" },
  { id: "letterhead", label: "Letterhead" },
  { id: "homescreen", label: "Phone home screen" },
  { id: "appstore", label: "App store page" },
];

const UI = "Arial, Helvetica, sans-serif";

type Ctx = { i: Input; n: number; a: string; b: string; name: string; tag: string; slug: string; font: string };

function ctx(i: Input, n: number): Ctx {
  const pal = palettesFor(i);
  const [a, b] = pal[n % pal.length];
  const raw = i.name.trim() || "Brand";
  return { i, n, a, b, name: esc(raw), tag: esc(i.tagline.trim()), slug: esc(fileSlug(raw)), font: getFont(i.font).stack };
}

/** Put a whole logo / app icon SVG inside another SVG at x,y. */
const nest = (svg: string, x: number, y: number, w: number, h: number, vb: string) =>
  svg.replace(/<svg [^>]*>/, `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${vb}">`);
const logo = (c: Ctx, theme: "light" | "dark", x: number, y: number, w: number) =>
  nest(makeLogoSvg(c.i, c.n, theme, true, false), x, y, w, w / 2, "0 0 600 300");
const icon = (c: Ctx, x: number, y: number, s: number, style: AppStyle = "gradient") =>
  nest(makeAppIconSvg(c.i, c.n, s, style, false), x, y, s, s, "0 0 512 512");

const mg = (c: Ctx) => `<linearGradient id="mg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c.a}"/><stop offset="1" stop-color="${c.b}"/></linearGradient>`;

type TOpts = { w?: number; anchor?: string; font?: string; op?: number };
const T = (x: number, y: number, size: number, fill: string, t: string, o: TOpts = {}) =>
  t ? `<text x="${x}" y="${y}" font-family="${o.font ?? UI}" font-size="${size}" font-weight="${o.w ?? 400}" fill="${fill}" text-anchor="${o.anchor ?? "middle"}"${o.op != null ? ` opacity="${o.op}"` : ""}>${t}</text>` : "";

const frame = (inner: string, defs = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><defs><filter id="sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000" flood-opacity=".28"/></filter>${defs}</defs>${inner}</svg>`;

function card(c: Ctx) {
  return frame(
    `<rect width="800" height="600" fill="#e5e7eb"/>
<g transform="rotate(-8 330 215)" filter="url(#sh)"><rect x="150" y="110" width="360" height="210" rx="14" fill="#fff"/>${logo(c, "light", 200, 150, 260)}</g>
<g transform="rotate(6 480 440)" filter="url(#sh)"><rect x="300" y="335" width="360" height="210" rx="14" fill="url(#mg)"/>
${T(480, 430, 32, "#fff", c.name, { font: c.font, w: 700 })}${T(480, 458, 14, "#fff", c.tag, { op: 0.9 })}${T(480, 508, 12, "#fff", `hello@${c.slug}.com  •  www.${c.slug}.com`, { op: 0.85 })}</g>`,
    mg(c)
  );
}

function tshirt(c: Ctx) {
  return frame(
    `<rect width="800" height="600" fill="#f1f5f9"/>
<ellipse cx="400" cy="560" rx="260" ry="18" fill="#000" opacity=".12"/>
<path filter="url(#sh)" d="M300 70 L220 100 L110 170 L160 250 L220 215 L220 540 L580 540 L580 215 L640 250 L690 170 L580 100 L500 70 Q400 130 300 70 Z" fill="#111827"/>
<path d="M300 70 Q400 130 500 70 L494 84 Q400 152 306 84 Z" fill="#1f2937"/>
<path d="M220 215 L220 540 M580 215 L580 540" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
${logo(c, "dark", 300, 205, 200)}`
  );
}

function mug(c: Ctx) {
  return frame(
    `<rect width="800" height="600" fill="#f8fafc"/><rect width="800" height="600" fill="${c.a}" opacity=".12"/>
<ellipse cx="390" cy="470" rx="190" ry="22" fill="#000" opacity=".15"/>
<path d="M520 235 H548 Q602 235 602 292 Q602 349 548 349 H514" fill="none" stroke="#cbd5e1" stroke-width="26" stroke-linecap="round"/><path d="M520 235 H548 Q602 235 602 292 Q602 349 548 349 H514" fill="none" stroke="#f1f5f9" stroke-width="12" stroke-linecap="round"/>
<path d="M260 190 V400 Q260 452 390 452 Q520 452 520 400 V190 Z" fill="url(#cy)"/>
<ellipse cx="390" cy="190" rx="130" ry="26" fill="#f9fafb"/><ellipse cx="390" cy="192" rx="116" ry="20" fill="#d1d5db"/>
${logo(c, "light", 275, 250, 230)}`,
    `<linearGradient id="cy" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d1d5db"/><stop offset=".35" stop-color="#ffffff"/><stop offset="1" stop-color="#cbd5e1"/></linearGradient>`
  );
}

function billboard(c: Ctx) {
  return frame(
    `<rect width="800" height="600" fill="url(#sky)"/>
<rect y="520" width="800" height="80" fill="#94a3b8"/>
<rect x="260" y="380" width="20" height="150" fill="#64748b"/><rect x="520" y="380" width="20" height="150" fill="#64748b"/>
<g filter="url(#sh)"><rect x="90" y="90" width="620" height="300" rx="10" fill="#1f2937"/><rect x="104" y="104" width="592" height="272" rx="4" fill="url(#mg)"/></g>
${logo(c, "dark", 250, 125, 300)}${T(400, 345, 20, "#fff", `www.${c.slug}.com`, { op: 0.9, w: 700 })}`,
    `${mg(c)}<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bae6fd"/><stop offset="1" stop-color="#f0f9ff"/></linearGradient>`
  );
}

function shop(c: Ctx) {
  const w = 540 / 8;
  let awning = "";
  for (let k = 0; k < 8; k++) awning += `<path d="M${130 + k * w} 290 h${w} v22 a${w / 2} ${w / 2} 0 0 1 ${-w} 0 Z" fill="${k % 2 ? "#fff" : c.a}"/>`;
  return frame(
    `<rect width="800" height="600" fill="#d1d5db"/>
<rect y="540" width="800" height="60" fill="#9ca3af"/>
<rect x="100" y="110" width="600" height="430" fill="#f3f4f6" filter="url(#sh)"/>
<rect x="160" y="130" width="480" height="150" rx="12" fill="#111827"/>
${logo(c, "dark", 270, 140, 260)}
<rect x="130" y="286" width="540" height="6" fill="${c.a}"/>${awning}
<rect x="140" y="360" width="230" height="170" fill="#bae6fd" opacity=".75"/><path d="M140 530 L250 360 H290 L180 530Z" fill="#fff" opacity=".35"/>
<rect x="440" y="350" width="170" height="190" fill="#1f2937"/><rect x="456" y="366" width="138" height="150" fill="#374151"/><circle cx="580" cy="450" r="6" fill="#fbbf24"/>
<rect x="490" y="330" width="70" height="22" rx="4" fill="${c.b}"/>${T(525, 346, 12, "#fff", "OPEN", { w: 700 })}`
  );
}

function tote(c: Ctx) {
  return frame(
    `<rect width="800" height="600" fill="#f5f5f4"/><rect width="800" height="600" fill="${c.a}" opacity=".14"/>
<ellipse cx="400" cy="572" rx="200" ry="14" fill="#000" opacity=".12"/>
<path d="M330 245 C330 90 470 90 470 245" fill="none" stroke="#d6cfc2" stroke-width="16" stroke-linecap="round"/>
<rect x="240" y="230" width="320" height="340" rx="6" fill="#efe7d6" filter="url(#sh)"/>
<rect x="240" y="230" width="320" height="22" fill="#000" opacity=".05"/>
${logo(c, "light", 290, 330, 220)}${T(400, 470, 14, "#6b7280", c.tag)}`
  );
}

function bag(c: Ctx) {
  return frame(
    `<rect width="800" height="600" fill="#f1f5f9"/>
<ellipse cx="420" cy="566" rx="220" ry="14" fill="#000" opacity=".14"/>
<path d="M345 190 C345 80 455 80 455 190" fill="none" stroke="#1f2937" stroke-width="7"/>
<g filter="url(#sh)"><rect x="250" y="170" width="300" height="380" fill="url(#mg)"/>
<polygon points="550,170 594,188 594,532 550,550" fill="url(#mg)"/></g>
<polygon points="550,170 594,188 594,532 550,550" fill="#000" opacity=".25"/>
<rect x="250" y="170" width="300" height="28" fill="#fff" opacity=".18"/>
${logo(c, "dark", 290, 290, 220)}`,
    mg(c)
  );
}

function social(c: Ctx) {
  const tiles = (["gradient", "dark", "glossy"] as AppStyle[]).map((s, k) => icon(c, 242 + k * 108, 425, 100, s)).join("");
  return frame(
    `<rect width="800" height="600" fill="#f3f4f6"/>
<rect x="220" y="40" width="360" height="520" rx="24" fill="#fff" filter="url(#sh)"/>
<path d="M220 64 a24 24 0 0 1 24 -24 h312 a24 24 0 0 1 24 24 V150 H220 Z" fill="url(#mg)"/>
<circle cx="400" cy="150" r="56" fill="#fff"/>
<g clip-path="url(#av)">${icon(c, 354, 104, 92)}</g>
${T(400, 238, 26, "#111827", c.name, { font: c.font, w: 700 })}${T(400, 262, 14, "#6b7280", c.tag || `@${c.slug}`)}
${T(310, 306, 18, "#111827", "128", { w: 700 })}${T(400, 306, 18, "#111827", "12.4K", { w: 700 })}${T(490, 306, 18, "#111827", "310", { w: 700 })}
${T(310, 326, 12, "#6b7280", "Posts")}${T(400, 326, 12, "#6b7280", "Followers")}${T(490, 326, 12, "#6b7280", "Following")}
<rect x="330" y="352" width="140" height="38" rx="19" fill="url(#mg)"/>${T(400, 376, 15, "#fff", "Follow", { w: 700 })}
${tiles}`,
    `${mg(c)}<clipPath id="av"><circle cx="400" cy="150" r="46"/></clipPath>`
  );
}

function laptop(c: Ctx) {
  return frame(
    `<rect width="800" height="600" fill="#e2e8f0"/>
<g filter="url(#sh)"><rect x="150" y="90" width="500" height="334" rx="18" fill="#111827"/>
<path d="M90 430 H710 L684 470 Q682 474 676 474 H124 Q118 474 116 470 Z" fill="#cbd5e1"/></g>
<rect x="350" y="430" width="100" height="8" rx="4" fill="#94a3b8"/>
<rect x="166" y="106" width="468" height="302" fill="#fff"/>
${icon(c, 176, 114, 20)}${T(202, 129, 13, "#111827", c.name, { anchor: "start", font: c.font, w: 700 })}
<rect x="500" y="119" width="30" height="5" rx="2.5" fill="#d1d5db"/><rect x="540" y="119" width="30" height="5" rx="2.5" fill="#d1d5db"/><rect x="580" y="119" width="40" height="5" rx="2.5" fill="#d1d5db"/>
<rect x="166" y="146" width="468" height="170" fill="url(#mg)"/>
${T(400, 226, 40, "#fff", c.name, { font: c.font, w: 700 })}${T(400, 252, 14, "#fff", c.tag, { op: 0.9 })}
<rect x="355" y="268" width="90" height="28" rx="14" fill="#fff"/>${T(400, 286, 11, c.a, "Get started", { w: 700 })}
<rect x="182" y="332" width="140" height="62" rx="8" fill="#f3f4f6"/><rect x="330" y="332" width="140" height="62" rx="8" fill="#f3f4f6"/><rect x="478" y="332" width="140" height="62" rx="8" fill="#f3f4f6"/>`,
    mg(c)
  );
}

function letterhead(c: Ctx) {
  let lines = "";
  for (let k = 0; k < 13; k++) lines += `<rect x="250" y="${190 + k * 16}" width="${[300, 290, 296, 220, 300, 280, 300, 260, 190, 300, 288, 250, 120][k]}" height="7" rx="3.5" fill="#e5e7eb"/>`;
  return frame(
    `<rect width="800" height="600" fill="#e5e7eb"/>
<rect x="230" y="36" width="340" height="528" fill="#fff" filter="url(#sh)"/>
${logo(c, "light", 244, 46, 140)}
${T(550, 76, 9, "#6b7280", `hello@${c.slug}.com`, { anchor: "end" })}${T(550, 90, 9, "#6b7280", `www.${c.slug}.com`, { anchor: "end" })}
<rect x="250" y="122" width="300" height="3" fill="url(#mg)"/>
<rect x="250" y="150" width="90" height="8" rx="4" fill="#9ca3af"/>${lines}
<path d="M250 440 q14 -30 24 -4 t26 -6 t24 2 t20 -8" fill="none" stroke="${c.a}" stroke-width="2.5" stroke-linecap="round"/>
<rect x="230" y="546" width="340" height="18" fill="url(#mg)"/>`,
    mg(c)
  );
}

function homescreen(c: Ctx) {
  const cols = ["#64748b", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#a855f7", "#14b8a6", "#eab308", "#ec4899", "#0ea5e9"];
  let grid = "";
  for (let r = 0; r < 5; r++)
    for (let k = 0; k < 4; k++) {
      const cx = 323.5 + k * 51, y = 96 + r * 72, idx = r * 4 + k;
      if (idx === 5) {
        grid += icon(c, cx - 20, y, 40) + T(cx, y + 54, 8, "#fff", c.name, { font: c.font, w: 700 });
      } else {
        grid += `<rect x="${cx - 20}" y="${y}" width="40" height="40" rx="10" fill="${cols[idx % cols.length]}"/><circle cx="${cx}" cy="${y + 20}" r="7" fill="#fff" opacity=".8"/><rect x="${cx - 12}" y="${y + 48}" width="24" height="4" rx="2" fill="#fff" opacity=".5"/>`;
      }
    }
  let dock = "";
  for (let k = 0; k < 4; k++) dock += `<rect x="${323.5 + k * 51 - 19}" y="503" width="38" height="38" rx="10" fill="${cols[(k * 3 + 1) % cols.length]}"/>`;
  return frame(
    `<rect width="800" height="600" fill="#e2e8f0"/>
<g filter="url(#sh)"><rect x="290" y="30" width="220" height="540" rx="38" fill="#0f172a" stroke="#475569" stroke-width="3"/></g>
<g clip-path="url(#sc)"><rect x="298" y="38" width="204" height="524" fill="url(#wp)"/><rect x="298" y="38" width="204" height="524" fill="url(#wg)"/></g>
<rect x="368" y="46" width="64" height="16" rx="8" fill="#000"/>${T(326, 60, 10, "#fff", "9:41", { w: 700 })}
${grid}<rect x="306" y="494" width="188" height="56" rx="20" fill="#fff" opacity=".2"/>${dock}`,
    `<linearGradient id="wp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f172a"/><stop offset="1" stop-color="#1e293b"/></linearGradient><radialGradient id="wg" cx=".8" cy=".95" r=".8"><stop offset="0" stop-color="${c.b}" stop-opacity=".75"/><stop offset="1" stop-color="${c.b}" stop-opacity="0"/></radialGradient><clipPath id="sc"><rect x="298" y="38" width="204" height="524" rx="32"/></clipPath>`
  );
}

function appstore(c: Ctx) {
  const shots = [0, 1, 2].map((k) => {
    const x = 165 + k * 170;
    const fill = k === 0 ? "url(#mg)" : k === 1 ? "#0b0d14" : c.b;
    return `<rect x="${x}" y="292" width="150" height="230" rx="18" fill="${fill}"/>${icon(c, x + 40, 352, 70, (["glossy", "neon", "flat"] as AppStyle[])[k])}${T(x + 75, 462, 13, "#fff", c.name, { font: c.font, w: 700 })}`;
  }).join("");
  return frame(
    `<rect width="800" height="600" fill="#f3f4f6"/>
<rect x="140" y="60" width="520" height="480" rx="28" fill="#fff" filter="url(#sh)"/>
${icon(c, 170, 90, 120)}
${T(310, 132, 28, "#111827", c.name, { anchor: "start", font: c.font, w: 700 })}${T(310, 160, 15, "#6b7280", c.tag || "Free · In-App Purchases", { anchor: "start" })}
<rect x="310" y="178" width="84" height="32" rx="16" fill="url(#mg)"/>${T(352, 200, 15, "#fff", "GET", { w: 700 })}
${T(170, 252, 15, "#f59e0b", "★★★★★", { anchor: "start" })}${T(262, 252, 13, "#6b7280", "4.9 · 12K Ratings", { anchor: "start" })}
<rect x="170" y="268" width="460" height="1.5" fill="#e5e7eb"/>${shots}`,
    mg(c)
  );
}

const MAKERS: Record<MockupId, (c: Ctx) => string> = { card, tshirt, mug, billboard, shop, tote, bag, social, laptop, letterhead, homescreen, appstore };

export function makeMockup(id: MockupId, i: Input, n: number): string {
  // the font is embedded once for the whole mockup (the nested logos / icons skip their own copy)
  return MAKERS[id](ctx(i, n)).replace("<defs>", "<defs>" + fontStyle(i.font, brandText(i)));
}
