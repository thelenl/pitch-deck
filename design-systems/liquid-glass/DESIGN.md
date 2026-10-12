# Liquid Glass: design system

- **Vibe:** a dark, near-black canvas lit by soft liquid-metal orbs (peach, lavender and steel, with a periwinkle glow), and translucent "frosted glass" cards on top.
- **Output:** `../pitch-deck-liquid-glass.pptx` (repo root), or the path given as the first CLI argument.
- **Build:** `node liquid-glass/build.js` (run from `design-systems/`), or `npm run build:liquid-glass`.
- **Pipeline (end of build.js):** `pres.writeFile` → `applyTheme(OUT, THEME)` (writes theme.json colours into `ppt/theme/theme1.xml`) → `scrubImagePaths(OUT)` (blanks local file paths left in image alt text). Both helpers live in `../_shared/`.
- Speaker notes are written inline in this build.js (`s.addNotes(...)` on every slide).

## At a glance

- **Dark canvas from images.** Every master background is a 1920×1080 JPG rendered by `assets.py`: `#15151E` with blurred metallic orbs and film grain.
- **Frosted glass cards.** `glass()` draws rounded rectangles (`rectRadius: 0.2`) filled with white at 93% transparency and edged with a 0.75 pt white hairline at 82% transparency. Variants: `dark`, `accent` and `dash`.
- **Orb sprites behind key cards.** `orb.png`, a transparent metallic sphere, sits behind the hero card or stat on 9 of the 15 slides.
- **One cool accent.** Periwinkle `accent6 #9AA6FF` (ACC_LT) is used for hero numerals, eyebrow dots, lead-in words and "highlight" labels. Deeper `accent1 #5266EB` (ACC) fills solid shapes and charts.
- **Light, tight headings.** All titles are Inter Tight with `bold: false` and negative `charSpacing`. Small caps-style labels are 11 pt with `charSpacing: 3`.

## Palette

Source: `theme.json` → `THEME.colors` (`H` in build.js). Shapes and text use scheme colours (`pres.SchemeColor`), so they follow the theme. Charts and the table border use the raw hex from `H.*`.

| Slot | Hex | build.js alias | Role | Where it's used |
|---|---|---|---|---|
| dk1 | `15151E` | `INK` (text1) | Canvas / darkest fill | `glass({dark})` fill at 35% transparency; financials table rows 1, 3, 5; doughnut % labels (`H.dk1`); baked into all backgrounds (`assets.py` `BG`) |
| lt1 | `FAFAFC` | `WHITE` (background1) | Primary text, glass | All titles, card headings, strong body; glass fill and edge; `gdot` ring; TAM/SAM circles; matrix axes; doughnut legend (`H.lt1`) |
| dk2 | `1D1D29` | `CARD` (text2) | Secondary dark fill | Financials table header row and rows 2, 4, 6 |
| lt2 | `8A8C99` | `MUTED` (background2) | Muted text | Eyebrows, meta line, descriptions, `label()` default, `[Logo]`, axis captions; chart title and category axis (`H.lt2`) |
| accent1 | `5266EB` | `ACC` | Solid accent | `glass({accent})` fill at 78%; SOM circle; "Your company" dot; bar chart series; doughnut slice 1; periwinkle glow in art (`PERI`) |
| accent2 | `C9A99A` | `PEACH` | Metallic warm stop | Doughnut slice 4 only (`H.accent2`); first orb gradient stop in `assets.py`. The `PEACH` constant itself is never used |
| accent3 | `B7B6CE` | `LAV` | Secondary text accent | Taglines and statement subs; source line; screenshot placeholder text; `[Photo]`; SAM label; Why-now numerals 02/03; table header text; "RAISING"; bar data labels; doughnut slice 2; middle orb stop |
| accent4 | `7E8A9E` | `STEEL` | Footer, minor marks | Footer text and slide number; competitor dots (30% transparency); doughnut slice 3; final orb stop |
| accent5 | `2C2C3B` | `HAIR` | Hairline | Financials table border, 0.5 pt (`H.accent5`). The `HAIR` constant itself is never used |
| accent6 | `9AA6FF` | `ACC_LT` | Highlight | Hero numerals; eyebrow dot and raise-chip dot; accent glass edge (40%); solution arrow; "Our insight" / "Bottom-up" / "Advisors & investors" lead-ins; highlighted labels; team roles |
| hlink | `9AA6FF` | — | Hyperlink | Not referenced in build.js |
| folHlink | `B7B6CE` | — | Followed link | Not referenced in build.js |

### Off-theme colours

build.js contains **no hard-coded hex values**. Every colour is either a scheme colour or `H.<slot>`. The colours are duplicated as RGB tuples in **`assets.py`** instead, and they are baked into the pixels of the background and orb images. If you change the palette in theme.json, edit these too and regenerate the art.

| assets.py constant | Value | Matches slot | Used for |
|---|---|---|---|
| `BG` | `(0x15, 0x15, 0x1E)` = `15151E` | dk1 | Canvas fill of all three backgrounds |
| `STOPS[0]` | `(0xC9, 0xA9, 0x9A)` = `C9A99A` | accent2 | Peach start of the metallic sweep (`metallic()`) |
| `STOPS[1]` | `(0xB7, 0xB6, 0xCE)` = `B7B6CE` | accent3 | Lavender middle of the sweep |
| `STOPS[2]` | `(0x7E, 0x8A, 0x9E)` = `7E8A9E` | accent4 | Steel end of the sweep |
| `PERI` | `(0x52, 0x66, 0xEB)` = `5266EB` | accent1 | `peri=True` glow blobs; the highlight on `orb.png` |

## Typography

| Role | Family | Set by | Font folder |
|---|---|---|---|
| Heading (major, `+mj-lt`) | **Inter Tight** | `theme.json headFontFace` → `pres.theme`; `HEAD = "+mj-lt"` for numerals and card headings | `../fonts/InterTight/` |
| Body (minor, `+mn-lt`) | **Inter** | `theme.json bodyFontFace`; charts set `+mn-lt` explicitly | `../fonts/Inter/` |

build.js names no accent face. It never sets `bold: true` or italic. Master titles are explicitly `bold: false`.

| Element | Font | Size pt | Weight / style | Colour |
|---|---|---|---|---|
| Title slide: company name | Heading | 64 | regular, charSpacing -1.5 | lt1 |
| Title slide: tagline | Body | 22 | regular | accent3 |
| Title slide: meta line | Body | 13 | regular | lt2 |
| Statement title | Heading | 44 | regular, charSpacing -1 | lt1 |
| Statement sub | Body | 20 | regular | accent3 |
| Content title | Heading | 28 | regular, charSpacing -0.5 | lt1 |
| Eyebrow (e.g. "01 · THE PROBLEM") | Body | 11 | caps text, charSpacing 3 | lt2 |
| Hero stat (Problem `[XX%]`, Ask `$[X]M`) | Heading | 66 | charSpacing -1.5 | accent6 |
| Why-now numerals | Heading | 40 | charSpacing -1 | accent6 (01), accent3 (02, 03) |
| Stat values (market, pricing, traction) | Heading | 34 | charSpacing -1 (price has none) | lt1, or accent6 when highlighted |
| Unit-economics values | Heading | 30 | charSpacing -0.5 | lt1; accent6 for LTV:CAC |
| Card headings | Heading | 20 / 19 / 18 / 16 / 15 | regular | lt1 |
| Stat caption (Problem) | Body | 17 | regular | lt1 |
| Bullets, insight line | Body | 16 | regular | lt2 (Today) / lt1 (With product) |
| Descriptions | Body | 14 / 13 / 12 | regular | lt2 |
| `label()` caps labels | Body | 11 (10 on milestones) | charSpacing 3 | lt2 by default, accent6 / accent3 overrides |
| TAM / SAM / SOM tags | Body | 13 | charSpacing 3, centred | lt2 / accent3 / lt1 |
| `gdot` numerals | Heading | 10–15 (default 13) | centred | lt1 |
| Source line, axis captions | Body | 11 | regular | accent3 / lt2 |
| Footer, slide number | Body | 9 | regular | accent4 |
| Table cells | Body (labels: Heading) | 13 | regular | header accent3, labels lt1, values lt2 |
| Chart title | Body | 13 | regular | lt2 |
| Bar data labels / category axis | Body | 11 / 11 | regular | accent3 / lt2 |
| Doughnut legend / % labels | Body | 12 / 10 | regular | lt1 / dk1 |

## Layouts

Slide size: `LAYOUT_WIDE`, 13.333 × 7.5 in. All positions below are in inches (x, y, w, h). Every placeholder has `margin: 0`.

**TITLE_DARK**: background `bg_title.jpg`. No fixed objects.

| Placeholder | Type | x, y, w, h | Notes |
|---|---|---|---|
| `title` | title | 0.8, 2.2, 8.6, 1.5 | 64 pt, left, valign bottom |
| `tagline` | body | 0.8, 3.9, 7.6, 1.0 | 22 pt, accent3, valign top |
| `meta` | body | 0.8, 6.35, 9.0, 0.4 | 13 pt, lt2 |

**CONTENT**: background `bg_content.jpg`; `margin: [0.5, 0.6, 0.8, 0.6]`.

| Object | Kind | x, y, w, h | Notes |
|---|---|---|---|
| `eyebrow` | body placeholder | 0.82, 0.45, 9.0, 0.3 | 11 pt, lt2, charSpacing 3, valign middle |
| `title` | title placeholder | 0.6, 0.85, 12.13, 1.0 | 28 pt, left, valign top |
| Footer text | fixed text | 0.6, 6.98, 6.0, 0.3 | "[Company name] · Confidential", 9 pt, accent4 |
| Slide number | slideNumber | 12.23, 6.98, 0.5, 0.3 | 9 pt, accent4, right-aligned |

**STATEMENT_DARK**: background `bg_statement.jpg`. No fixed objects.

| Placeholder | Type | x, y, w, h | Notes |
|---|---|---|---|
| `title` | title | 0.8, 1.6, 10.4, 2.4 | 44 pt, valign bottom |
| `sub` | body | 0.8, 4.3, 10.0, 1.4 | 20 pt, accent3, valign top |

## Components & signature moves

| Helper | What it draws | Used on |
|---|---|---|
| `T(slide, text, o)` | `addText` with `isTextBox`, `margin: 0`, `valign: "top"` as defaults | All slides |
| `glass(slide, {tint=93, edge=82, dark, accent, dash, ...})` | `ROUNDED_RECTANGLE`, `rectRadius` 0.2. Default: lt1 fill at `tint`% transparency, lt1 0.75 pt edge at `edge`%. `dark`: dk1 fill at 35%. `accent`: accent1 fill at 78% with an accent6 edge at 40%. `dash`: dashed edge | Cards on slides 1–13; `tint: 96` for chart, matrix and unit-economics panels |
| `orb(slide, x, y, d, transparency=0)` | `orb.png` as a d×d image, with `altText: ""` | Slides 2, 3, 4, 6, 7, 8, 9, 10, 13 |
| `gdot(slide, x, y, d, label, size=13)` | Glass circle (lt1 fill at 90%, lt1 edge at 70%) with a centred Heading numeral | Problem rows, product features, Why-we-win, GTM steps |
| `label(slide, text, o)` | 11 pt lt2 caps label, charSpacing 3 | TODAY, UNIT ECONOMICS, WHY WE WIN, KEY ASSUMPTIONS, RAISING, milestones, card kickers |
| `content(eyebrow, title, section)` | New CONTENT slide with an accent6 0.1 in "Eyebrow dot" at (0.6, 0.55), and fills the eyebrow and title placeholders | Slides 2–13 |

**Grid constants**

- `COL3 = [0.6, 4.74, 8.88]`, `W3 = 3.85`: three columns, 0.29 in gutters.
- `COL4 = [0.6, 3.705, 6.81, 9.915]`, `W4 = 2.815`: four columns, 0.29 in gutters.
- Content spans x 0.6 → 12.73 (full width 12.13). The body area starts at y ≈ 1.95–2.05 and the footer sits at y 6.98.
- Card padding is usually 0.3–0.35 in from the card edge. The Ask milestones use `mw = (7.13 - 0.5) / 3` with 0.25 gaps.

**Recurring moves:** lead-in run in accent6 followed by lt1/lt2 text ("Our insight", "Bottom-up", "Advisors & investors"); a highlighted item marked by accent6 text and/or `accent: true` glass (middle pricing tier, first traction stat as `dark`); thin lt1 lines at 70–80% transparency for arrows and axes.

## Art assets

All are generated by `assets.py` (numpy + Pillow). It writes into its own folder. Regenerate with `python3 assets.py` from `liquid-glass/`.

| File | What it is | Composition (`blob` dicts) |
|---|---|---|
| `bg_title.jpg` | 1920×1080 TITLE_DARK background | Big metallic orb bleeding off the right (cx 1560, cy 420, r 620, i 0.92), a periwinkle glow bottom-right, and a small orb top |
| `bg_content.jpg` | 1920×1080 CONTENT background | Faint corner glow top-right (cx 1940, cy -80, r 430, i 0.42) plus a periwinkle blob; grain 3.5 |
| `bg_statement.jpg` | 1920×1080 STATEMENT_DARK background | Orb rising from the bottom-right (cx 1620, cy 1120, r 720, i 0.85) and a cool periwinkle glow top-left |
| `orb.png` | 900×900 RGBA sprite | Metallic sphere (radius `S*0.36`, k 1.8) with a periwinkle highlight at (0.66, 0.64)·S, intensity 0.6; alpha comes from the blob mask |

**Parameters worth tweaking:** `BG`, `STOPS`, `PERI` (colours); per-blob `cx, cy, r` (position and size, in px), `i` (intensity), `k` (falloff, higher is tighter), `sx, sy` (squash), `peri` (solid periwinkle instead of the metallic sweep); the sweep direction `0.8 / 0.6` and span `2.2 * r` in `compose()`; `grain` (noise sigma, 4.0 by default); `rng` seed 7; JPG `quality=86`.

## Slide by slide

1. **Title**: TITLE_DARK. Dashed glass logo box; a pill "raise chip" (glass, `rectRadius` 0.28) with an accent6 dot.
2. **Problem**: three `gdot`-numbered pain rows on the left; a large orb (6.2 in) behind a `dark` glass stat card with a 66 pt accent6 `[XX%]`.
3. **Solution**: plain glass "Today" card → accent6 arrow → `accent` glass "With product" card with an orb behind it; full-width insight glass bar.
4. **Product**: dashed glass screenshot placeholder over a faded orb (45%); three `gdot` features on the right.
5. **Why now**: three COL3 glass cards with 40 pt numerals (01 in accent6).
6. **Market**: nested TAM/SAM glass circles, an orb, and a solid accent1 SOM circle; 34 pt values on the right; "Bottom-up" glass bar.
7. **Business model**: three pricing tiers (middle one `accent`, orb behind it); four COL4 unit-economics tiles (`tint: 96`).
8. **Traction**: glass chart panel with an accent1 bar chart (hidden value axis, no gridlines); three stat cards, the first one `dark`.
9. **Competition**: glass 2×2 matrix with hairline axes; small orb behind the accent1 "Your company" dot; steel competitor dots; `gdot` Why-we-win list.
10. **Go-to-market**: three `gdot` steps joined by dashed arrow lines (small orb behind step 1); three COL3 glass cards.
11. **Team**: four COL4 glass cards with dashed glass photo circles; accent6 roles; advisors line.
12. **Financials**: native table on alternating dk1/dk2 rows with an accent5 0.5 pt border; glass "Key assumptions" card. No orb.
13. **The ask**: orb bleeding off the left behind a `dark` raise card (66 pt `$[X]M`); glass doughnut panel (hole 66, legend right); three milestone glass tiles.
14. **Vision**: STATEMENT_DARK, 44 pt statement plus contact sub.
15. **Appendix**: STATEMENT_DARK with the backup-slide list in the sub.

## How to iterate

- **Change the palette:** edit `theme.json` `colors` (six hex digits, no `#`). Shapes and text follow automatically. Charts and the table border read `H.*` at build time, so rebuilding picks them up. Then update `BG` / `STOPS` / `PERI` in `assets.py` and regenerate the art, because the backgrounds and orb are bitmaps. Keep the dark/light pairing: dk1 is the canvas and lt1 the text.
- **Swap fonts:** change `headFontFace` / `bodyFontFace` in `theme.json`. Everything uses the theme fonts (`+mj-lt` / `+mn-lt`), so no build.js edits are needed. Add the font files under `../fonts/<FamilyNoSpaces>/` so previews render them.
- **Regenerate art:** `cd liquid-glass && python3 assets.py`, then rebuild. To move the glow on a layout, edit that file's `save_jpg([...])` blob list.
- **Add or duplicate a slide:** `const s = content("NN · LABEL", "Title", "Section")`. Lay out cards on `COL3`/`W3` or `COL4`/`W4` with `glass()`; use `label()` for kickers, `T()` for text with `fontFace: HEAD` on headings and numerals, `gdot()` for numbered lists, and an optional `orb()` behind the hero card (add it before the glass so it sits underneath). Statement slides use `pres.addSlide({ masterName: "STATEMENT_DARK" })` with the `title`/`sub` placeholders. Add `s.addNotes(...)`.
- **Rebuild and preview:** `npm run build:liquid-glass`, or `_shared/preview.sh liquid-glass [dpi]` (from `design-systems/`), which builds into `liquid-glass/preview/` and renders `slide-*.png` plus a PDF. It needs LibreOffice and pdftoppm, and uses `_shared/fonts.conf`.

## Caveats

- **Backgrounds and orbs are images.** The gradient glow cannot be recoloured in PowerPoint, and changing the theme in PowerPoint (or theme.json without rerunning `assets.py`) leaves them in the old palette.
- **The "glass" is not real blur.** It is fill and line transparency only; nothing behind a card is blurred. The look depends on the renderer honouring shape transparency. Check imports into Keynote or Google Slides.
- **Charts and the table border use fixed hex** (`H.*`; scheme colours are not allowed in those hex-only options, see `_shared/apply_theme.js`). They will not follow a later theme switch inside PowerPoint.
- **Dark deck for print:** the near-black canvas is baked into full-bleed JPGs, so printing uses heavy ink and there is no light variant in the code.
- **Fonts are not embedded.** Inter Tight and Inter must be installed on the presenting machine, or PowerPoint substitutes a fallback and the tight negative letter-spacing and metrics shift.
- **Unused slots and aliases:** `PEACH` and `HAIR` are declared but never used directly, and `hlink`/`folHlink` are unused. Changing them only affects the doughnut slice, the table border and the art.
- **Image size:** the three JPGs and the PNG come to about 0.9 MB, which is most of the deck's file size.
