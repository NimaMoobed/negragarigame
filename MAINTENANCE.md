# Negargari App — Maintenance Guide

A copy‑paste manual for changing, extending, and shipping updates to **رنگ‌آمیزی هنر نگارگری ایرانی** (`app.negargari.iranian`) without remembering any of the underlying code.

Each section ends with a **READY-TO-USE PROMPT** you can paste into a fresh Claude session. The prompts are self-contained — they include file paths and context so a brand-new Claude can execute them without needing to read this whole guide.

---

## 1. The Big Picture (read once, then forget)

```
Your phone APK  ──opens──►  https://nimamoobed.github.io/negragarigame/
                                      │
                                      ▼
                              GitHub Pages (gh-pages branch)
                                      │
                                      ▼
                              Source on `main` branch
                                      │
                                      ▼
                              Local code at C:\Users\user\negargari\
```

You almost never touch the APK file on your phone. **You change the code, deploy, the phone picks up the new version next time it opens.**

### Two GitHub repos (don't get them confused)

| Repo | Purpose | URL |
|---|---|---|
| `negragarigame` | The actual app code + the published web build | https://github.com/NimaMoobed/negragarigame |
| `nimamoobed.github.io` | Only holds `.well-known/assetlinks.json` and a landing page — required so the TWA can hide the address bar | https://github.com/NimaMoobed/nimamoobed.github.io |

**99% of your changes happen in `negragarigame`.** The other repo only needs touching if you generate a new APK with a different signing key.

---

## 2. Project File Map (cheat sheet)

```
C:\Users\user\negargari\
│
├── public/                          ← Static assets served as-is
│   ├── designs/
│   │   ├── design_NN.png            ← 1024×1024 colouring designs
│   │   └── thumbs/thumb_NN.png      ← 256×256 thumbnails
│   ├── icons/                       ← app icons (auto-generated)
│   ├── .well-known/assetlinks.json  ← Digital Asset Links
│   └── .nojekyll                    ← tells GitHub Pages not to filter dotfiles
│
├── src/
│   ├── theme/
│   │   ├── classic.ts               ← All theme colours (primary, accent, …)
│   │   └── palette.ts               ← The 12 traditional palette colours
│   │
│   ├── data/
│   │   ├── categories.ts            ← The 3 categories on Home screen
│   │   ├── designs.ts               ← Which design files exist + their titles
│   │   └── onboarding.ts            ← Onboarding slide texts
│   │
│   ├── screens/                     ← Each screen of the app
│   │   ├── SplashScreen.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── DesignListScreen.tsx
│   │   ├── ColoringScreen.tsx       ← The most complex one
│   │   ├── ShareScreen.tsx
│   │   ├── GalleryScreen.tsx
│   │   └── SettingsScreen.tsx
│   │
│   ├── modals/LockModal.tsx         ← The "unlock for review" popup
│   ├── canvas/                      ← Drawing logic (rarely touched)
│   ├── components/                  ← Reusable UI bits (buttons, cards…)
│   ├── hooks/useUnlocked.ts         ← Unlock state
│   └── lib/storage.ts               ← Save/load via Capacitor Preferences
│
├── scripts/make-icons.py            ← Python script that regenerates icons
├── vite.config.ts                   ← App name, manifest, base path
├── package.json
└── MAINTENANCE.md                   ← This file
```

---

## 3. Test Locally Before Deploying

You don't have to do this — but it saves a deploy/uninstall cycle if you want to see changes first.

```bash
cd C:\Users\user\negargari
npm run dev
```

Then open `http://localhost:5173/` (or whichever port it shows) in any browser. Changes auto-reload. `Ctrl+C` to stop.

---

## 4. Deploy a Change to the Phone

After ANY code change, run these three commands in order:

```bash
cd C:\Users\user\negargari
npm run build
git add -A && git commit -m "describe what you changed"
git push
npx gh-pages -d dist -b gh-pages --dotfiles
```

Wait ~60 seconds, then:
1. Close the app fully on your phone (swipe up from task switcher)
2. Open it again — service worker fetches new files in the background
3. Close again, open again → new version is live

If the new version doesn't appear after 2 launches, go to **Phone Settings → Apps → رنگ‌آمیزی → Storage → Clear cache** and reopen.

> 💡 **Want Claude to do all the deploy steps for you?** Use prompt #1 below.

---

## 5. Ready-to-Use Prompts (the important part)

Copy-paste any of these into a NEW Claude Code session. Each one is fully self-contained.

---

### Prompt #1 — Just Deploy Pending Changes

> I have uncommitted changes in `C:\Users\user\negargari`. Please rebuild the project, commit with a clear message describing what changed, push to `main` on github.com/NimaMoobed/negragarigame, and redeploy the `dist/` folder to the `gh-pages` branch using `npx gh-pages -d dist -b gh-pages --dotfiles`. Then tell me to close+reopen the app on my phone.

---

### Prompt #2 — Add or Replace Designs

> I want to add/replace colouring designs in my app at `C:\Users\user\negargari`. The new images are at `<PASTE_FOLDER_PATH_HERE>` as JPG or PNG files.
>
> Please:
> 1. Use the existing pre-processing script at `C:\Users\user\PaintAppScripts\process_designs.py` as reference, or write a fresh Python+Pillow script if needed. The processed designs must be 1024×1024 PNG with pure black-on-white lines (threshold at 128) and thumbnails 256×256. Output to `C:\Users\user\negargari\public\designs\design_NN.png` and `thumbs/thumb_NN.png` (zero-padded numbering).
> 2. Update `C:\Users\user\negargari\src\data\designs.ts` so the `DESIGNS` array covers all the new files. Adjust the `length` in the `Array.from` call.
> 3. Update the `count` field in `C:\Users\user\negargari\src\data\categories.ts` for category `tazhib` (or whichever category these belong to).
> 4. Build and deploy (see Prompt #1).
>
> Designs that REPLACE existing ones must overwrite by filename. New ones should pick the next free number (e.g. `design_15.png`).

---

### Prompt #3 — Add Designs to a New Category (نگارگری or گل و مرغ)

> I want to add real designs to the currently-empty category `<negar OR gol>` in my coloring book app at `C:\Users\user\negargari`. New images are at `<PASTE_FOLDER_PATH_HERE>`.
>
> Please:
> 1. Pre-process them to 1024×1024 PNG line-art + 256×256 thumbs, naming them like `negar_01.png` (or `gol_01.png`). Place in `public/designs/` and `public/designs/thumbs/` respectively.
> 2. Open `src/data/designs.ts` and ADD entries to the DESIGNS array for the new category. Keep the existing tazhib entries unchanged. Each new entry needs `id`, `category` (set to `'negar'` or `'gol'`), `title`, `fullUrl`, `thumbUrl`.
> 3. Update the `count` in `src/data/categories.ts` for that category.
> 4. Build + deploy (Prompt #1 instructions).

---

### Prompt #4 — Change Category Title or Description

> In my app at `C:\Users\user\negargari`, open `src/data/categories.ts` and change the `title` (and/or `sub`) of the category whose `id` is `<tazhib | negar | gol>` to `<NEW_TITLE>` and `<NEW_SUB>`. Then build + deploy as in Prompt #1.

---

### Prompt #5 — Add a Whole New Category

> Add a fourth category to the Home screen of my app at `C:\Users\user\negargari`.
>
> Category details:
> - id: `<short_lowercase_english_id>`
> - title (Persian): `<TITLE>`
> - sub (Persian): `<SUB>`
> - locked: `<true | false>`
> - count: 0 (or however many designs you'll add)
> - motifKey: pick one of `motif1` through `motif6`
>
> Please:
> 1. In `src/data/categories.ts`, add the new entry to CATEGORIES and extend the CategoryId type union.
> 2. In `src/hooks/useUnlocked.ts`, the unlock logic auto-handles any new categories so no change is needed there.
> 3. Build + deploy.

---

### Prompt #6 — Change a Theme Colour

> In my app at `C:\Users\user\negargari`, the theme is defined in `src/theme/classic.ts` and `tailwind.config.js`. I want to change `<primary | accent | bg | …>` from its current value to `<NEW_HEX>`.
>
> Please update BOTH files consistently, also update `theme_color` in `vite.config.ts` if it's the primary that changed, and also `<meta name="theme-color">` in `index.html`. Then build + deploy.

---

### Prompt #7 — Change Onboarding Text

> In my app at `C:\Users\user\negargari`, open `src/data/onboarding.ts`. Edit the slide at index `<0 | 1 | 2>` so its `title` is `<NEW_TITLE>` and `text` is `<NEW_TEXT>`. Then build + deploy.

---

### Prompt #8 — Add a New Settings Item

> In my app at `C:\Users\user\negargari`, open `src/screens/SettingsScreen.tsx`. Add a new entry to the ITEMS array:
> - icon: `<one of: star, share, sparkles, external, settings, heart>`
> - label: `<LABEL_IN_PERSIAN>`
> - sub: `<optional small grey text under the label>`
> - action: `<new-short-id>`
>
> Also add a new case to the `handle()` switch statement that does `<WHAT_SHOULD_HAPPEN_ON_TAP>`. Then build + deploy.

---

### Prompt #9 — Change the "سایت من" URL

> In my app at `C:\Users\user\negargari`, open `src/screens/SettingsScreen.tsx`. Change `DEV_SITE_URL` to `<NEW_URL>` and change the `sub` of the corresponding ITEMS entry (the one with action `'visit-site'`) to show the new domain. Build + deploy.

---

### Prompt #10 — Add a Palette Colour

> In my app at `C:\Users\user\negargari`, open `src/theme/palette.ts`. Append a new colour to PERSIAN_PALETTE:
> - hex: `<#RRGGBB>`
> - name: `<NAME_IN_PERSIAN>`
>
> Build + deploy. The colour will appear automatically in the coloring screen's swatch row.

---

### Prompt #11 — Update App Name / Title

> In my app at `C:\Users\user\negargari`, change the app's display name from "رنگ‌آمیزی هنر نگارگری ایرانی" to `<NEW_NAME>`. This means updating:
> 1. `vite.config.ts` → `manifest.name` and `manifest.short_name`
> 2. `index.html` → `<title>` tag
> 3. `capacitor.config.ts` → `appName`
> 4. Any user-visible text in `src/screens/SplashScreen.tsx` and headers.
>
> Note: The APK file's app name on the launcher comes from the PWABuilder/TWA package — changing it requires regenerating the APK. The web title and in-app name will update on the next deploy.

---

### Prompt #12 — Bump Version + Cache Bust

> In my app at `C:\Users\user\negargari`, update the version string from `1.0` to `<NEW_VERSION>` in:
> 1. `package.json` `version` field
> 2. The about-app text in `src/screens/SettingsScreen.tsx` (look for "نسخهٔ ۱.۰")
> 3. `vite.config.ts` — increment the workbox cache version so users get the new build forced
>
> Build + deploy.

---

### Prompt #13 — Fix a Bug / Investigate a Problem

> Something is wrong with my app at `C:\Users\user\negargari`. Symptom:
> `<DESCRIBE_THE_PROBLEM>`
> Screenshot (if available): `<PATH_TO_SCREENSHOT>`
>
> Please investigate, find the root cause, fix it, and deploy. Tell me what you changed.

---

### Prompt #14 — Add a Completely New Mini-App Under the Same Suite

> I want to add a second mini-app to my project. It should appear as a button on the landing page at `https://nimamoobed.github.io/`.
>
> The new app concept: `<DESCRIBE_THE_APP>`
>
> Please:
> 1. Plan the structure (will it be a separate Vite project at `C:\Users\user\<new_name>` or another route inside the existing one?). Recommend the simpler option for me.
> 2. Show me the proposed folder structure.
> 3. Then build it after I approve.
>
> If you create a new project, deploy it to GitHub Pages on a new repo, and add a card on my user-site landing page (the repo is at `C:\Users\user\nimamoobed-site\index.html`) linking to it.

---

### Prompt #15 — Make a New APK for Cafe Bazaar

> I have my app deployed and ready at `https://nimamoobed.github.io/negragarigame/`. I want a new APK that I can upload to Cafe Bazaar. Walk me through:
> 1. Going to pwabuilder.com
> 2. The exact clicks to generate an Android package
> 3. What to do with the downloaded ZIP
> 4. Where assetlinks.json lives in case my signing key changed (and the steps to update it at `C:\Users\user\nimamoobed-site\.well-known\assetlinks.json` if so)
>
> Also remind me what to fill in on Cafe Bazaar's upload page.

---

## 6. Phone Update Flow (the boring but critical bit)

After every deploy:

1. **Close the app fully** from task switcher
2. **Open it** — likely shows the OLD version (service worker just downloaded the new one in the background)
3. **Close it again**
4. **Open it** — now the new version

If after 2 launches it's still old:
- Settings → Apps → رنگ‌آمیزی هنر نگارگری ایرانی → Storage → **Clear cache** (not Clear Data — that wipes saved coloring progress)
- Open the app

If still old (very rare):
- Uninstall the APK
- Reinstall from the original APK ZIP at `C:\Users\user\Downloads\نگارگری - Google Play package.zip`

---

## 7. Backups & Important Files

Keep these around — losing them is annoying:

| File | Why it matters |
|---|---|
| `C:\Users\user\Downloads\نگارگری - Google Play package.zip` | Contains the APK + signing key. If you lose the signing key, you can't release updates to Bazaar as the same app — Bazaar will treat it as a new app. |
| `C:\Users\user\Downloads\pwabuilder_extract\signing.keystore` | Same — DO NOT DELETE. |
| `C:\Users\user\Downloads\pwabuilder_extract\signing-key-info.txt` | The keystore password is in here. |
| `D:\New folder (2)\` | Your original 14 source JPGs. |

**Recommended**: copy the signing-key files to a USB drive or cloud backup. Without them, Bazaar updates become impossible.

---

## 8. Common Gotchas

- **GitHub Pages takes 30–90 sec to refresh** after `npx gh-pages` finishes. Be patient before testing.
- **Service worker caches aggressively.** First reload after deploy = often still old. Second = new.
- **The address bar at the top of the app** appears when Chrome can't verify Digital Asset Links. This happens if you make a new APK with a different signing key. Fix: copy the new SHA256 from the PWABuilder ZIP into `C:\Users\user\nimamoobed-site\.well-known\assetlinks.json`, then commit + push that repo.
- **TypeScript errors during `npm run build`** mean Vite refuses to build. If something breaks, run `npm run dev` instead — that's more permissive and will show the error in the browser console.
- **`base: '/negragarigame/'` in vite.config.ts** is tied to the repo name. If you ever rename the GitHub repo, update this OR your assets will 404.

---

## 9. How to Hand This to a New Claude

When you open a new Claude Code session in the future, you can give it instant context with:

> Please read `C:\Users\user\negargari\MAINTENANCE.md` to understand my coloring book app project. Then I want to: `<DESCRIBE_TASK>`

That's it. Claude will read the guide and know everything it needs.

---

_Last updated: 2026-05-27_
