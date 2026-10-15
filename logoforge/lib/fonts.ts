import SPECS from "../scripts/font-specs.json";
import { METRICS } from "./fontMetrics";

export type FontId = string;
export type FontScript = "latin" | "devanagari";
export type FontCat = "Sans" | "Serif" | "Slab" | "Display" | "Script" | "Handwritten" | "Tech" | "Rounded" | "Condensed" | "Retro";
export type FontDef = {
  id: FontId; label: string; cat: FontCat;
  stack: string;      // CSS font-family value incl. fallbacks (used in SVG, mockups, intros, UI)
  wide: number;       // average advance per character (em), measured from the real font file
  wideDev: number;    // same for Devanagari text
  scripts: FontScript[];
  web: boolean;       // true = file in /public/fonts (embedded into exports); false = system font
};

const DEV_FALLBACK = "'Noto Sans Devanagari','Nirmala UI','Mangal','Kohinoor Devanagari',";
const system = (id: string, label: string, cat: FontCat, stack: string, wide: number): FontDef => ({
  id, label, cat, stack: stack.replace(/,\s*(serif|sans-serif|monospace)$/, `,${DEV_FALLBACK}$1`), wide, wideDev: 0.62, scripts: ["latin"], web: false,
});

// The 4 original system fonts keep their ids so saved settings and old links still work.
const SYSTEM: FontDef[] = [
  system("serif", "Classic serif", "Serif", "Georgia, 'Times New Roman', serif", 0.58),
  system("sans", "Modern sans", "Sans", "'Helvetica Neue', Arial, sans-serif", 0.56),
  system("rounded", "Friendly rounded", "Rounded", "'Trebuchet MS', 'Segoe UI', Verdana, sans-serif", 0.6),
  system("mono", "Tech mono", "Tech", "'Courier New', Consolas, monospace", 0.66),
];

type Spec = { id: string; label: string; cat: FontCat; dev: boolean; fb: string };
const WEB: FontDef[] = (SPECS as Spec[]).map((s) => ({
  id: s.id, label: s.label, cat: s.cat,
  stack: `'LF ${s.label}', ${s.fb.replace(/,\s*(serif|sans-serif|monospace|cursive)$/, `,${DEV_FALLBACK}$1`)}`,
  wide: METRICS[s.id]?.wide ?? 0.6,
  wideDev: METRICS[s.id]?.wideDev ?? 0.62,
  scripts: s.dev ? (["latin", "devanagari"] as FontScript[]) : (["latin"] as FontScript[]),
  web: true,
}));

export const FONT_LIST: FontDef[] = [...SYSTEM, ...WEB];
export const FONTS: Record<FontId, FontDef> = Object.fromEntries(FONT_LIST.map((f) => [f.id, f]));
export const FONT_CATS: FontCat[] = ["Sans", "Serif", "Slab", "Display", "Script", "Handwritten", "Tech", "Rounded", "Condensed", "Retro"];
export const getFont = (id: string): FontDef => FONTS[id] || FONTS.serif;

export const hasDevanagari = (s: string) => /[\u0900-\u097F]/.test(s);
// anything that is neither Latin-ish, Devanagari, digits, punctuation nor whitespace
export const hasOtherScript = (s: string) => /[^\u0000-\u024F\u0900-\u097F\u1E00-\u1EFF\u2000-\u206F\u20A0-\u20CF\s]/.test(s);

/** Average character width (em) for this text in this font; used for auto-sizing. */
export const widthFactor = (f: FontDef, text: string) => (hasDevanagari(text) ? f.wideDev : f.wide);

/** A short warning when the font cannot draw what was typed, otherwise null. */
export function fontHint(f: FontDef, text: string): string | null {
  if (hasOtherScript(text)) return `${f.label} only covers Latin${f.scripts.includes("devanagari") ? " and Devanagari" : ""} letters. Other scripts will use your device's default font.`;
  if (hasDevanagari(text) && !f.scripts.includes("devanagari"))
    return `${f.label} has no Hindi (Devanagari) letters, so they will fall back to a system font. Pick a font tagged "Hindi" for a matching look.`;
  return null;
}

/** Splits text into user-visible characters (keeps Hindi letters + vowel signs together). */
export function graphemes(s: string): string[] {
  const Seg = (Intl as unknown as { Segmenter?: new (l?: string, o?: { granularity: string }) => { segment: (t: string) => Iterable<{ segment: string }> } }).Segmenter;
  return Seg ? Array.from(new Seg(undefined, { granularity: "grapheme" }).segment(s), (x) => x.segment) : Array.from(s);
}
