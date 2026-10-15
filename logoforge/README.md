# LogoForge

Next.js 14 + TypeScript + Tailwind + React Three Fiber.
One brand name in, and out come: logos (10 styles x 12 colour options), 12 kinds of 3D model,
30 animated intros (13 cinematic story scenes), 30 fonts, 12 app-icon styles, favicons, 12 real-world mockups and a full brand-kit ZIP.

## Run locally
    npm install
    npm run dev          # http://localhost:3000

## AI generate tab (optional)
Enter the website/app name, describe the logo or animation you want, then press
"Generate logo" or "Generate intro animation". The AI draws a fresh SVG logo or a full
animated intro (HTML + CSS, no JavaScript). Results are checked on the server and shown in a
sandboxed frame; anything with scripts or external links is rejected. Intro generation can
take up to a minute, and each click costs a small amount of API usage.

## AI setup (login + daily limit)
The AI tab needs a signed-in account and gives each user 3 designs per day (change with `DAILY_LIMIT`).
The day resets at midnight India time. If the AI fails, the credit is given back.

1. Create a free project at https://supabase.com
2. SQL Editor > New query > paste the whole of `supabase/schema.sql` > Run
3. Authentication > Providers: Email is on by default. Keep "Confirm email" ON to block fake sign-ups.
4. Project Settings > API: copy the Project URL, the anon key and the service_role key
5. Get an Anthropic key at https://console.anthropic.com (set a monthly spend limit there)
6. Copy `.env.example` to `.env.local` and fill every value, then `npm run dev`

On Vercel add the same variables (Settings > Environment Variables) and Redeploy.
In Supabase, Authentication > URL Configuration: set Site URL to your Vercel link.
`SUPABASE_SERVICE_ROLE_KEY` and `ANTHROPIC_API_KEY` stay on the server only.
If any variable is missing, the AI tab switches itself off and the rest of the site still works.

## Deploy
1. `git init && git add . && git commit -m "first commit"`
2. Push to a GitHub repo.
3. On vercel.com choose Add New > Project, import the repo, Deploy.

## Where things are
- `lib/icons.ts`     36 icons (3 per industry). Add more here.
- `lib/logo.ts`      10 logo styles, 12 app-icon styles, brand-kit ZIP, 12 colour palettes
- `lib/fonts.ts`     the 30-font registry (category, scripts, measured width) + Hindi hints
- `lib/fontdata.ts`  loads font files and embeds them (base64) into SVG / PNG / mockups / intros
- `lib/intros/`      30 intro animations as standalone HTML. `index.ts` = list + categories,
                     `classic.ts` = 17 logo/text intros, `scenes/*.ts` = 13 story scenes (one file each),
                     `shared.ts` = colour helpers and the `scene()` shell
- `lib/mockups.ts`   12 mockups: business cards, t-shirt, mug, billboard, shop sign, tote bag,
                     shopping bag, social profile, laptop, letterhead, phone home screen, app store page
- `components/Studio.tsx`  the main screen
- `components/Logo3D.tsx`  12 3D scenes (icon, gold, neon, tile, glass, phone, laptop, coin, cube, orb, hex badge, podium)
- `components/Intro3D.tsx` the opening animation of this site: a canvas forge scene (anvil, hammer, sparks, wordmark)
- `components/FontPicker.tsx` searchable font menu, each font shown in its own typeface
- `scripts/`         font build + measuring, intro renderer and Playwright screenshot checks
- `app/api/ai/route.ts`    AI endpoint: checks login, takes 1 daily credit, refunds on failure
- `supabase/schema.sql`    usage table and credit functions
- `lib/safe.ts`            safety check for AI-written SVG/HTML

## Fonts (30)
4 system fonts plus 26 web fonts (script, handwritten, display, serif, slab, tech, rounded, condensed, retro and
8 that also cover Hindi/Devanagari: Poppins, Hind, Mukta, Tiro Devanagari Hindi, Yatra One, Rozha One, Kalam, Baloo 2).
The files are self-hosted in `public/fonts` (from the `@fontsource` packages, so no Google request at build or run time).

**Why exports needed special handling:** an SVG shown through `<img src="data:...">` (and the PNG made from it) cannot load
web fonts, so it would silently use a default font. `lib/fontdata.ts` fetches the font file once, turns it into base64 and writes it
into the SVG as `@font-face` inside `<defs>`. Logos, app icons, mockups, the brand-kit ZIP and the standalone intro HTML files are
therefore fully self-contained and work offline. A font is embedded for the scripts the text needs (Latin, plus Devanagari when
Hindi is typed). The preview grid strips the embedded copy because the page already has the font.

Auto-sizing uses the real average glyph width of each font (measured by `scripts/measure_fonts.py`), not a guess.
If you type Hindi with a Latin-only font, or a script no font covers, the font picker shows a warning.
To change the list: edit `scripts/font-specs.json`, then `npm run fonts` (needs `npm i` first and Python with fonttools + brotli).

## Intros
Open the Intro animations tab: three groups (Story scenes, Classic, Text effects). Every intro is one HTML file with inline SVG + CSS,
no scripts and no network, honours `prefers-reduced-motion` (shows the final frame with the name) and embeds the chosen font.
Story scenes: lamp pull, rainy peacock, sunrise, hungry dog, chai pour, diya lighting, lighthouse, hot air balloon, rocket launch,
fireworks, fireflies, station arrival, paper plane. To check them visually:
    npx tsx scripts/render-intros.ts /tmp/intros
    python3 scripts/shoot_intros.py /tmp/intros /tmp/shots 1280x720 lamp,dog 1,3,5,8.9
