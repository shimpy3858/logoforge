// Dumps every intro as a standalone HTML file (used by the Playwright check). Run: npx tsx scripts/render-intros.ts /tmp/intros [brand] [font]
import fs from "node:fs";
import { INTRO_STYLES, buildIntro } from "../lib/intros";
import { ICONS } from "../lib/icons";
import { loadFontData } from "../lib/fontdata";

const out = process.argv[2] || "/tmp/intros";
const brand = process.argv[3] || "Chai Corner";
const font = process.argv[4] || "serif";
const colors: [string, string] = (process.argv[5] || "#f59e0b,#ef4444").split(",") as [string, string];
fs.mkdirSync(out, { recursive: true });
// node has no browser fetch for relative URLs; serve /fonts from disk
(globalThis as any).fetch = async (u: string) => { const b = fs.readFileSync("public" + u); return { ok: true, arrayBuffer: async () => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) }; };
(async () => {
  await loadFontData(font, brand + " tagline");
  for (const s of INTRO_STYLES) {
    const html = buildIntro({ style: s.id, brand, tagline: "Fresh every morning", colors, icon: ICONS.Food[0], font });
    fs.writeFileSync(`${out}/${s.id}.html`, html);
  }
  console.log(INTRO_STYLES.length, "intros written to", out);
})();
