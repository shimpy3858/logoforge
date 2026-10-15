"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { FONT_CATS, FONT_LIST, FontCat, fontHint, getFont } from "@/lib/fonts";

type Cat = "All" | "Hindi" | FontCat;

/** Searchable font menu. Every row is drawn in its own typeface; chips filter by style or by Hindi support. */
export default function FontPicker({ value, onChange, text }: { value: string; onChange: (id: string) => void; text: string }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Cat>("All");
  const box = useRef<HTMLDivElement>(null);
  const cur = getFont(value);
  const hint = fontHint(cur, text);

  useEffect(() => {
    if (!open) return;
    box.current?.scrollIntoView({ block: "center", behavior: "smooth" }); // the list can open below the fold
    const away = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", away); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [open]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return FONT_LIST.filter((f) => (cat === "All" ? true : cat === "Hindi" ? f.scripts.includes("devanagari") : f.cat === cat) && (!s || f.label.toLowerCase().includes(s) || f.cat.toLowerCase().includes(s)));
  }, [q, cat]);
  const chips: Cat[] = ["All", "Hindi", ...FONT_CATS];

  return (
    <div ref={box} className="relative grid gap-1">
      <span id="font-label">Font <span className="text-white/40">({FONT_LIST.length})</span></span>
      <button type="button" aria-haspopup="listbox" aria-expanded={open} aria-labelledby="font-label" onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded border border-white/20 bg-white/5 px-3 py-2 text-left">
        <span className="truncate text-xl" style={{ fontFamily: cur.stack }}>{cur.label}</span>
        <span className="ml-2 shrink-0 text-xs text-white/50">{cur.cat}{cur.scripts.includes("devanagari") ? " · हिं" : ""} ▾</span>
      </button>
      {hint && <p role="status" className="rounded border border-amber-400/40 bg-amber-400/10 p-2 text-xs text-amber-100">{hint}</p>}
      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 rounded border border-white/25 bg-[#12151f] p-2 shadow-2xl">
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search fonts..." aria-label="Search fonts"
            className="mb-2 w-full rounded border border-white/20 bg-white/5 px-2 py-1 text-sm" />
          <div className="mb-2 flex flex-wrap gap-1" role="group" aria-label="Font category">
            {chips.map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}
                className={`rounded-full border px-2 py-0.5 text-xs ${cat === c ? "border-amber-400 bg-amber-400/20 text-amber-200" : "border-white/20 text-white/70 hover:bg-white/10"}`}>{c === "Hindi" ? "Hindi / हिंदी" : c}</button>
            ))}
          </div>
          <ul role="listbox" aria-label="Fonts" className="max-h-72 overflow-y-auto">
            {list.map((f) => (
              <li key={f.id} role="option" aria-selected={f.id === value}>
                <button type="button" onClick={() => { onChange(f.id); setOpen(false); }}
                  className={`flex w-full items-center justify-between gap-2 rounded px-2 py-1.5 text-left hover:bg-white/10 ${f.id === value ? "bg-amber-400/15" : ""}`}>
                  <span className="truncate text-xl leading-tight" style={{ fontFamily: f.stack }}>{f.label}</span>
                  <span className="shrink-0 text-[10px] uppercase tracking-wide text-white/40">{f.cat}{f.scripts.includes("devanagari") ? " · हिं" : ""}</span>
                </button>
              </li>
            ))}
            {list.length === 0 && <li className="p-3 text-sm text-white/50">No font matches. Try another word or category.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}
