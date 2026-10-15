// Writes SVG files with and without embedded fonts for the Playwright proof. Run: npx tsx scripts/font-proof.ts /tmp/fproof
import fs from "node:fs";
import { makeLogoSvg, makeAppIconSvg } from "../lib/logo";
import { loadFontData, onFontLoaded } from "../lib/fontdata";
import { fontHint, getFont } from "../lib/fonts";
const out = process.argv[2] || "/tmp/fproof"; fs.mkdirSync(out, { recursive: true });
(globalThis as any).fetch = async (u: string) => { const b = fs.readFileSync("public" + u); return { ok: true, arrayBuffer: async () => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) }; };
const cases: [string, string, string][] = [
  ["pacifico", "Chai Corner", "Fresh every morning"], ["anton", "URBAN FORGE", "Built to last"], ["greatvibes", "Aria Studio", "Wedding stories"],
  ["orbitron", "NovaLabs", "Future ready"], ["tiro", "चाय कॉर्नर", "हर सुबह ताज़ा"], ["kalam", "नमस्ते भारत", "अपना बाज़ार"],
  ["yatra", "श्री गणेश स्वीट्स", "शुद्ध मिठाई"], ["pacifico", "चाय कॉर्नर", "(latin-only font)"],
];
(async () => {
  let html = "<body style='margin:0;background:#fff;display:grid;grid-template-columns:repeat(4,300px);gap:6px'>";
  for (const mode of ["embedded", "no-embed"]) for (const [font, name, tagline] of cases) {
    const i = { name, tagline, industry: "Food", type: "wordmark" as const, font };
    if (mode === "embedded") await loadFontData(font, name + " " + tagline);
    let svg = makeLogoSvg(i, 1, "light");
    if (mode === "no-embed") svg = makeLogoSvg(i, 1, "light", false, false);
    const f = `${out}/${mode}_${font}_${cases.findIndex((c) => c[0] === font && c[1] === name)}.svg`; fs.writeFileSync(f, svg);
    html += `<div><small style='font:11px sans-serif'>${mode} · ${font} · hint: ${fontHint(getFont(font), name + " " + tagline) ? "YES" : "-"} · ${(svg.length / 1024) | 0}KB</small><img width=300 src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}"></div>`;
  }
  fs.writeFileSync(`${out}/proof.html`, html + "</body>");
  console.log("ok");
})();
