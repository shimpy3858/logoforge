"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  APP_STYLES, FONTS, INDUSTRIES, Input, LogoType, Theme, brandText, downloadBlob, downloadBrandKit, downloadPng, downloadSvg,
  fileSlug, iconFor, makeAppIconSvg, makeLogoSvg, makeLogos, palettesFor, svgToPngBlob,
} from "@/lib/logo";
import { INTRO_CATS, INTRO_STYLES, IntroStyle, buildIntro } from "@/lib/intros";
import { fontVersion, loadFontData, stripFontStyle } from "@/lib/fontdata";
import FontPicker from "./FontPicker";
import { MOCKUPS, makeMockup } from "@/lib/mockups";
import type { Mode3D } from "./Logo3D";
import type { Session } from "@supabase/supabase-js";
import { getBrowserClient } from "@/lib/supabase-browser";

const Logo3D = dynamic(() => import("./Logo3D"), {
  ssr: false,
  loading: () => <div className="grid h-[420px] place-items-center text-white/50">Loading 3D...</div>,
});

const TYPES: { id: LogoType; label: string; hint: string }[] = [
  { id: "wordmark", label: "Wordmark", hint: "Just the name" },
  { id: "icon", label: "Icon + name", hint: "Symbol above name" },
  { id: "horizontal", label: "Side by side", hint: "Symbol left, name right" },
  { id: "emblem", label: "Emblem", hint: "Symbol inside a ring" },
  { id: "monogram", label: "Monogram", hint: "Initials in a badge" },
  { id: "badge", label: "Hex badge", hint: "Symbol in a hexagon" },
  { id: "stamp", label: "Stamp seal", hint: "Double ring seal" },
  { id: "outline", label: "Line art", hint: "Thin outline symbol" },
  { id: "split", label: "Two-tone name", hint: "Name in two colours" },
  { id: "ribbon", label: "Ribbon", hint: "Name on a banner" },
];
const TABS = [
  { id: "logos", label: "Logos" },
  { id: "ai", label: "AI generate" },
  { id: "3d", label: "3D models" },
  { id: "intro", label: "Intro animations" },
  { id: "mockups", label: "App icons & mockups" },
] as const;
type Tab = (typeof TABS)[number]["id"];
const MODES: { id: Mode3D; label: string }[] = [
  { id: "icon", label: "Floating icon" },
  { id: "gold", label: "Gold icon" },
  { id: "neon", label: "Neon" },
  { id: "tile", label: "App tile" },
  { id: "glass", label: "Glass tile" },
  { id: "phone", label: "Phone" },
  { id: "laptop", label: "Laptop" },
  { id: "coin", label: "Coin" },
  { id: "cube", label: "Cube" },
  { id: "orb", label: "Orb" },
  { id: "badge", label: "Hex badge" },
  { id: "podium", label: "Podium" },
];

const btnS = "rounded border border-white/30 px-2 py-1 text-xs hover:bg-white/10";
const btnSMain = "rounded bg-amber-500 px-2 py-1 text-xs font-semibold text-black hover:bg-amber-400";
// Plain <img> on purpose: logos and mockups are inline SVG data, not files Next can optimise.
function Pic({ svg, alt, className }: { svg: string; alt: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={"data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg)} alt={alt} className={className} />;
}

const field = "w-full rounded border border-white/20 bg-white/5 px-3 py-2";
const btn = "rounded border border-white/30 px-4 py-2 hover:bg-white/10 disabled:opacity-40";
const btnMain = "rounded bg-amber-500 px-4 py-2 font-semibold text-black hover:bg-amber-400 disabled:opacity-40";

export default function Studio() {
  const [v, setV] = useState<Input>({ name: "Chai Corner", tagline: "Fresh every morning", industry: "Food", type: "icon", font: "serif" });
  const [tab, setTab] = useState<Tab>("logos");
  const [theme, setTheme] = useState<Theme>("light");
  const [sel, setSel] = useState(0);
  const [mode, setMode] = useState<Mode3D>("tile");
  const [introStyle, setIntroStyle] = useState<IntroStyle>("lamp");
  const [replay, setReplay] = useState(0);
  const [compare, setCompare] = useState(false);
  const [busy, setBusy] = useState("");
  const [aiOn, setAiOn] = useState(false);
  const [msg, setMsg] = useState("");
  const [aiName, setAiName] = useState("");
  const [aiDesc, setAiDesc] = useState("");
  const [aiBusy, setAiBusy] = useState<"" | "logo" | "intro">("");
  const [aiLogos, setAiLogos] = useState<string[]>([]);
  const [aiIntro, setAiIntro] = useState("");
  const [aiRun, setAiRun] = useState(0);
  const [session, setSession] = useState<Session | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [limit, setLimit] = useState(3);
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const sb = useMemo(() => getBrowserClient(), []);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fontTick, setFontTick] = useState(0);
  const [introCat, setIntroCat] = useState<(typeof INTRO_CATS)[number]["id"]>("Story scenes");

  const set = (p: Partial<Input>) => setV((o) => ({ ...o, ...p }));
  const slug = fileSlug(v.name);
  // Download the font file (as base64) so every SVG / PNG / mockup / intro embeds it. Re-render when it arrives.
  useEffect(() => {
    let live = true;
    loadFontData(v.font, brandText(v)).then(() => live && setFontTick(fontVersion()));
    return () => { live = false; };
  }, [v.font, v.name, v.tagline]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const logos = useMemo(() => makeLogos(v, theme), [v, theme, fontTick]);
  const colors = palettesFor(v)[sel] || palettesFor(v)[0];
  const icon = iconFor(v, sel);
  const brand = v.name.trim() || "Your Brand";
  const introHtml = useMemo(() => buildIntro({ style: introStyle, brand, tagline: v.tagline.trim(), colors, icon, font: v.font }), [introStyle, brand, v.tagline, colors, icon, v.font, fontTick]);
  const appIcon = useMemo(() => makeAppIconSvg(v, sel), [v, sel, fontTick]);
  const styleLogos = useMemo(() => (tab === "logos" && compare ? TYPES.map((t) => ({ ...t, svg: makeLogoSvg({ ...v, type: t.id }, sel, theme) })) : []), [tab, compare, v, sel, theme, fontTick]);
  const iconStyles = useMemo(() => (tab === "mockups" ? APP_STYLES.map((s) => ({ ...s, svg: makeAppIconSvg(v, sel, 512, s.id) })) : []), [tab, v, sel, fontTick]);
  const mockups = useMemo(() => (tab === "mockups" ? MOCKUPS.map((m) => ({ ...m, svg: makeMockup(m.id, v, sel) })) : []), [tab, v, sel, fontTick]);

  useEffect(() => {
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = sb.auth.onAuthStateChange((_e, sess) => setSession(sess));
    return () => data.subscription.unsubscribe();
  }, [sb]);

  const token = session?.access_token;
  useEffect(() => {
    fetch("/api/ai", { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((r) => r.json())
      .then((j) => { setAiOn(!!j.enabled && !!sb); if (typeof j.limit === "number") setLimit(j.limit); setLeft(typeof j.remaining === "number" ? j.remaining : null); })
      .catch(() => setAiOn(false));
  }, [token, sb]);

  const run = async (label: string, fn: () => Promise<void>) => {
    setBusy(label);
    try { await fn(); } catch { setMsg("Download failed. Please try again."); } finally { setBusy(""); }
  };

  async function auth(mode: "in" | "up") {
    if (!sb) return;
    setAuthBusy(true); setMsg("");
    try {
      if (mode === "in") {
        const { error } = await sb.auth.signInWithPassword({ email: authEmail.trim(), password: authPass });
        if (error) throw error;
      } else {
        const { data, error } = await sb.auth.signUp({ email: authEmail.trim(), password: authPass });
        if (error) throw error;
        if (!data.session) setMsg("Account created. Check your email to confirm it, then sign in.");
      }
      setAuthPass("");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Sign in failed");
    } finally { setAuthBusy(false); }
  }

  async function generate(kind: "logo" | "intro") {
    setAiBusy(kind); setMsg("");
    try {
      const r = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token ?? ""}` }, body: JSON.stringify({ kind, name: aiName, prompt: aiDesc }) });
      const j = await r.json();
      if (typeof j.remaining === "number") setLeft(j.remaining);
      if (!r.ok) throw new Error(j.error || "AI request failed");
      if (kind === "logo") setAiLogos((l) => [j.svg as string, ...l].slice(0, 6));
      else { setAiIntro(j.html as string); setAiRun((n) => n + 1); }
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "AI request failed");
    } finally { setAiBusy(""); }
  }
  const svgUrl = (svg: string) => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  const aiSlug = fileSlug(aiName);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <h2 className="text-4xl tracking-tight md:text-5xl">Design your brand</h2>
      <p className="mt-2 max-w-2xl text-white/70">Logos, app icons, 3D models and animated intros from one set of details. Everything updates as you type.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="grid h-fit gap-5 rounded border border-white/15 bg-white/[0.03] p-5">
          <label className="grid gap-1">Brand name
            <input className={field} value={v.name} maxLength={24} onChange={(e) => set({ name: e.target.value })} placeholder="Chai Corner" />
          </label>
          <label className="grid gap-1">Tagline (optional)
            <input className={field} value={v.tagline} maxLength={40} onChange={(e) => set({ tagline: e.target.value })} placeholder="Fresh every morning" />
          </label>
          <label className="grid gap-1">Industry
            <select className={field} value={v.industry} onChange={(e) => set({ industry: e.target.value, customIcon: undefined })}>
              {INDUSTRIES.map((x) => <option key={x} className="text-black">{x}</option>)}
            </select>
          </label>
          <fieldset className="grid gap-2">
            <legend className="mb-1">Logo style</legend>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map((t) => (
                <button key={t.id} aria-pressed={v.type === t.id} onClick={() => set({ type: t.id })} className={`rounded border p-2 text-left text-sm ${v.type === t.id ? "border-amber-400 bg-amber-400/10" : "border-white/20 hover:bg-white/5"}`}>
                  <div>{t.label}</div><div className="text-white/50">{t.hint}</div>
                </button>
              ))}
            </div>
          </fieldset>
          <FontPicker value={v.font} onChange={(id) => set({ font: id })} text={`${v.name} ${v.tagline}`} />

        </aside>

        <section>
          <div role="tablist" className="flex flex-wrap gap-2 border-b border-white/15 pb-3">
            {TABS.map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={`rounded px-4 py-2 ${tab === t.id ? "bg-amber-500 font-semibold text-black" : "border border-white/20 hover:bg-white/10"}`}>{t.label}</button>
            ))}
          </div>

          {tab === "logos" && (
            <div className="mt-6">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <button className={btn} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>Show on {theme === "light" ? "dark" : "light"} background</button>
                <button className={btn} aria-pressed={compare} onClick={() => setCompare(!compare)}>{compare ? "Back to colour options" : "Compare all 10 styles"}</button>
                <button className={btnMain} disabled={!!busy} onClick={() => run("kit", () => downloadBrandKit(v, sel))}>{busy === "kit" ? "Building ZIP..." : `Download brand kit (option ${sel + 1})`}</button>
              </div>
              {compare && (
                <>
                  <p className="mb-3 text-sm text-white/60">All styles in colour option {sel + 1}. Click one to use it everywhere.</p>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {styleLogos.map((t) => (
                      <figure key={t.id} className="grid gap-2">
                        <button aria-pressed={v.type === t.id} aria-label={`Use ${t.label} style`} onClick={() => { set({ type: t.id }); setCompare(false); }} className={`overflow-hidden rounded border-2 ${v.type === t.id ? "border-amber-400" : "border-transparent"}`}>
                          <Pic svg={t.svg} alt={t.label} className="h-auto w-full" />
                        </button>
                        <figcaption className="flex items-center gap-2 text-sm"><span className="flex-1">{t.label}</span>
                          <button className={btnS} onClick={() => downloadSvg(t.svg, `${slug}-${t.id}`)}>SVG</button>
                          <button className={btnSMain} onClick={() => run("png", () => downloadPng(t.svg, `${slug}-${t.id}`))}>PNG</button>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </>
              )}
              {!compare && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {logos.map((svg, n) => (
                  <figure key={n} className="grid gap-3">
                    <button aria-pressed={sel === n} aria-label={`Select logo option ${n + 1}`} onClick={() => setSel(n)} className={`overflow-hidden rounded border-2 ${sel === n ? "border-amber-400" : "border-transparent"} [&>div>svg]:h-auto [&>div>svg]:w-full`}>
                      <div dangerouslySetInnerHTML={{ __html: stripFontStyle(svg) }} />
                    </button>
                    <figcaption className="flex gap-2">
                      <button onClick={() => downloadSvg(svg, `${slug}-${n + 1}`)} className={`flex-1 ${btn}`}>SVG</button>
                      <button onClick={() => run(`png${n}`, () => downloadPng(svg, `${slug}-${n + 1}`))} className={`flex-1 ${btnMain}`}>PNG</button>
                    </figcaption>
                  </figure>
                ))}
              </div>}
            </div>
          )}

          {msg && <p role="status" className="mt-3 rounded border border-red-400/40 bg-red-400/10 p-3 text-sm">{msg}</p>}

          {tab === "ai" && (
            <div className="mt-6 grid gap-6">
              {!aiOn ? (
                <p className="rounded border border-amber-400/40 bg-amber-400/10 p-3 text-sm">AI is off. The site owner needs to add the API key and login settings (see README), then restart.</p>
              ) : !session ? (
                <div className="grid max-w-md gap-3">
                  <h3 className="text-2xl">Sign in to use AI</h3>
                  <p className="text-sm text-white/40">Free accounts get {limit} AI designs per day. Everything else on this site works without signing in.</p>
                  <label className="grid gap-1">Email
                    <input className={field} type="email" autoComplete="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
                  </label>
                  <label className="grid gap-1">Password (6+ characters)
                    <input className={field} type="password" autoComplete="current-password" value={authPass} onChange={(e) => setAuthPass(e.target.value)} />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button className={btnMain} disabled={authBusy || !authEmail.includes("@") || authPass.length < 6} onClick={() => auth("in")}>Sign in</button>
                    <button className={btn} disabled={authBusy || !authEmail.includes("@") || authPass.length < 6} onClick={() => auth("up")}>Create account</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
                    <span>Signed in as {session.user.email}</span>
                    <button className="underline" onClick={() => sb?.auth.signOut()}>Sign out</button>
                  </div>
                  <div className="grid max-w-2xl gap-4">
                    <label className="grid gap-1">Website or app name
                      <input className={field} value={aiName} maxLength={40} onChange={(e) => setAiName(e.target.value)} placeholder="Chai Corner" />
                    </label>
                    <label className="grid gap-1">Describe the logo or animation you want
                      <textarea className={field} rows={5} maxLength={600} value={aiDesc} onChange={(e) => setAiDesc(e.target.value)} placeholder="A peacock that opens its feathers in blue and gold, then the name appears below it" />
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button className={btnMain} disabled={!!aiBusy || left === 0 || !aiName.trim() || aiDesc.trim().length < 5} onClick={() => generate("logo")}>{aiBusy === "logo" ? "Designing logo..." : "Generate logo"}</button>
                      <button className={btnMain} disabled={!!aiBusy || left === 0 || !aiName.trim() || aiDesc.trim().length < 5} onClick={() => generate("intro")}>{aiBusy === "intro" ? "Animating (up to 1 min)..." : "Generate intro animation"}</button>
                    </div>
                    <p className="text-sm text-white/40">
                      {left === 0 ? `Daily limit reached. You get ${limit} designs per day; it resets at midnight IST.` : `${left ?? limit} of ${limit} designs left today. Each logo or intro uses one. Resets at midnight IST.`}
                    </p>
                  </div>
                </>
              )}

              {aiLogos.length > 0 && (
                <div>
                  <button className={`mb-4 ${btn}`} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>Show on {theme === "light" ? "dark" : "light"} background</button>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {aiLogos.map((svg, n) => (
                      <figure key={n} className="grid gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={svgUrl(svg)} alt={`AI logo ${n + 1}`} className={`w-full rounded ${theme === "light" ? "bg-white" : "bg-[#0b0d14]"}`} />
                        <figcaption className="flex gap-2">
                          <button className={`flex-1 ${btn}`} onClick={() => downloadSvg(svg, `${aiSlug}-ai-${aiLogos.length - n}`)}>SVG</button>
                          <button className={`flex-1 ${btnMain}`} onClick={() => run("aipng", () => downloadPng(svg, `${aiSlug}-ai-${aiLogos.length - n}`))}>PNG</button>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              )}

              {aiIntro && (
                <div>
                  <iframe key={aiRun} title="AI intro animation" sandbox="" srcDoc={aiIntro} className="aspect-video w-full rounded border border-white/15 bg-black" />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className={btn} onClick={() => setAiRun((n) => n + 1)}>Replay</button>
                    <button className={btnMain} onClick={() => downloadBlob(new Blob([aiIntro], { type: "text/html" }), `${aiSlug}-ai-intro.html`)}>Download intro (HTML)</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "3d" && (
            <div className="mt-6">
              <p className="text-white/60">Drag to rotate. 12 styles. Uses logo option {sel + 1} (pick another in the Logos tab).</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {MODES.map((m) => <button key={m.id} aria-pressed={mode === m.id} onClick={() => setMode(m.id)} className={`rounded px-4 py-2 ${mode === m.id ? "bg-amber-500 font-semibold text-black" : "border border-white/20"}`}>{m.label}</button>)}
                <button className={btn} onClick={() => canvasRef.current?.toBlob((b) => b && downloadBlob(b, `${slug}-3d-${mode}.png`))}>Download PNG (transparent)</button>
              </div>
              <div className="mt-4 rounded border border-white/15 bg-black/30">
                <Logo3D path={icon} colors={colors} mode={mode} canvasRef={canvasRef} />
              </div>
            </div>
          )}

          {tab === "intro" && (
            <div className="mt-6">
              <p className="mb-3 text-white/60">{INTRO_STYLES.length} intro styles in 3 groups. Pick one to preview.</p>
              <div role="tablist" aria-label="Intro categories" className="mb-4 flex flex-wrap gap-2">
                {INTRO_CATS.map((c) => (
                  <button key={c.id} role="tab" aria-selected={introCat === c.id} onClick={() => setIntroCat(c.id)} className={`rounded-full border px-4 py-1.5 text-sm ${introCat === c.id ? "border-amber-400 bg-amber-400/15 text-amber-200" : "border-white/20 hover:bg-white/10"}`}>
                    {c.label} <span className="text-white/40">({INTRO_STYLES.filter((s) => s.cat === c.id).length})</span>
                  </button>
                ))}
              </div>
              <p className="mb-3 text-sm text-white/50">{INTRO_CATS.find((c) => c.id === introCat)?.hint}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {INTRO_STYLES.filter((s) => s.cat === introCat).map((s) => (
                  <button key={s.id} aria-pressed={introStyle === s.id} onClick={() => { setIntroStyle(s.id); setReplay((r) => r + 1); }} className={`rounded border p-4 text-left ${introStyle === s.id ? "border-amber-400 bg-amber-400/10" : "border-white/20 hover:bg-white/5"}`}>
                    <div className="text-lg">{s.label}</div><div className="text-sm text-white/60">{s.hint}</div>
                  </button>
                ))}
              </div>
              <iframe key={`${introStyle}-${replay}`} title="Intro animation preview" srcDoc={introHtml} className="mt-5 aspect-video w-full rounded border border-white/15 bg-black" />
              <div className="mt-3 flex flex-wrap gap-2">
                <button className={btn} onClick={() => setReplay((r) => r + 1)}>Replay</button>
                <button className={btnMain} onClick={() => downloadBlob(new Blob([introHtml], { type: "text/html" }), `${slug}-intro-${introStyle}.html`)}>Download intro (HTML)</button>
              </div>
              <p className="mt-2 text-sm text-white/50">The HTML file is standalone. Open it as a splash page, or show it in a full-screen iframe on your site.</p>
            </div>
          )}

          {tab === "mockups" && (
            <div className="mt-6 grid gap-8">
              <div className="flex flex-wrap items-end gap-6">
                {[96, 64, 40, 24].map((s) => <div key={s} style={{ width: s, height: s }} className="[&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: stripFontStyle(appIcon) }} />)}
                <div className="flex flex-wrap gap-2">
                  <button className={btnMain} onClick={() => run("icon", async () => downloadBlob(await svgToPngBlob(appIcon, 1024, 1024), `${slug}-app-icon.png`))}>App icon PNG (1024)</button>
                  <button className={btn} onClick={() => run("fav", async () => downloadBlob(await svgToPngBlob(makeAppIconSvg(v, sel, 32), 32, 32), `${slug}-favicon.png`))}>Favicon PNG</button>
                  <button className={btn} onClick={() => downloadSvg(appIcon, `${slug}-app-icon`)}>App icon SVG</button>
                </div>
              </div>

              <div className="grid items-start gap-8 md:grid-cols-[1fr_220px]">
                <div className="overflow-hidden rounded-lg border border-white/15 bg-white text-gray-900">
                  <div className="flex items-center gap-2 bg-gray-200 px-3 py-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-yellow-400" /><span className="h-3 w-3 rounded-full bg-green-400" />
                    <span className="ml-3 flex-1 truncate rounded bg-white px-3 py-1 text-sm text-gray-500">{slug}.com</span>
                  </div>
                  <div className="flex items-center justify-between border-b px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: stripFontStyle(appIcon) }} />
                      <b className="text-xl" style={{ fontFamily: FONTS[v.font].stack }}>{brand}</b>
                    </div>
                    <nav className="hidden gap-5 text-sm text-gray-500 sm:flex"><span>Home</span><span>About</span><span>Contact</span></nav>
                  </div>
                  <div className="px-6 py-14 text-center text-white" style={{ background: `linear-gradient(135deg,${colors[0]},${colors[1]})` }}>
                    <div className="text-3xl md:text-5xl" style={{ fontFamily: FONTS[v.font].stack }}>{brand}</div>
                    {v.tagline.trim() && <p className="mt-2 opacity-90">{v.tagline}</p>}
                  </div>
                </div>

                <div className="mx-auto w-[220px] rounded-[2rem] border-4 border-gray-700 bg-gray-900 p-2">
                  <div className="grid h-[400px] place-items-center rounded-[1.5rem] text-white" style={{ background: `linear-gradient(160deg,${colors[0]},${colors[1]})` }}>
                    <div className="grid place-items-center gap-3 text-center">
                      <div className="h-20 w-20 [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: stripFontStyle(appIcon) }} />
                      <div className="text-xl" style={{ fontFamily: FONTS[v.font].stack }}>{brand}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl">App icon styles</h3>
                <p className="mt-1 text-sm text-white/60">The same icon in 12 looks (logo option {sel + 1}). The brand kit ZIP includes all of them.</p>
                <div className="mt-4 grid grid-cols-3 gap-5 sm:grid-cols-4 lg:grid-cols-6">
                  {iconStyles.map((st) => (
                    <figure key={st.id} className="grid gap-2 text-center text-sm">
                      <Pic svg={st.svg} alt={`${st.label} app icon`} className="w-full" />
                      <figcaption>{st.label}</figcaption>
                      <div className="flex gap-1">
                        <button className={`flex-1 ${btnS}`} onClick={() => downloadSvg(st.svg, `${slug}-icon-${st.id}`)}>SVG</button>
                        <button className={`flex-1 ${btnSMain}`} onClick={() => run("ic", async () => downloadBlob(await svgToPngBlob(makeAppIconSvg(v, sel, 1024, st.id), 1024, 1024), `${slug}-icon-${st.id}.png`))}>PNG</button>
                      </div>
                    </figure>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl">Mockups</h3>
                <p className="mt-1 text-sm text-white/60">Your logo on real-world items. Click SVG or PNG to download.</p>
                <div className="mt-4 grid gap-6 sm:grid-cols-2">
                  {mockups.map((m) => (
                    <figure key={m.id} className="grid gap-2">
                      <Pic svg={m.svg} alt={`${m.label} mockup`} className="h-auto w-full rounded border border-white/15" />
                      <figcaption className="flex items-center gap-2 text-sm"><span className="flex-1">{m.label}</span>
                        <button className={btnS} onClick={() => downloadSvg(m.svg, `${slug}-${m.id}`)}>SVG</button>
                        <button className={btnSMain} onClick={() => run("mk", () => downloadPng(m.svg, `${slug}-${m.id}`, 1600, 1200))}>PNG</button>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
