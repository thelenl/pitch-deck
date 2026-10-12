# Acid Editorial: design system

- **Vibe:** a magazine spread on bone paper. Near-black ink, graphite panels, and one acid-lime highlighter swipe per slide.
- **Output:** `../../pitch-deck-acid-editorial.pptx` (or the path passed as the first CLI argument). Layout `LAYOUT_WIDE` (13.333 x 7.5 in).
- **Build:** `node acid-editorial/build.js` (run from `design-systems/`), or `npm run build:acid-editorial`.
- **Files:** `build.js`, `theme.json`, `notes.json` (speaker notes, `NOTES[0..14]`). No art script and no image assets.

## At a glance

- **Highlighter runs.** Each slide title has one phrase set in a lime text highlight (`hl()`, `highlight: LIME`). Eyebrow numbers, section tags and role badges use the same highlight.
- **Bone, ink, panel.** Light `F4F2F0` slides with near-black `0C0A08` type. Dark `1A1919` panels carry the stat, insight band, KPI band and chart.
- **Big Inter Tight numerals.** Oversized `01`/`02`/`03` counters (24–72 pt) and stats (36–80 pt) in the heading face.
- **Hairline structure.** 0.75 pt `D6D3CF` rules and card borders. No shadows, no rounded corners, no images.
- **Ink bookends.** Vision and Appendix sit on full-bleed ink (`STATEMENT_INK`). The title slide ends in a dark footer band.

## Palette

Every colour comes from `theme.json`. `build.js` reads it as `THEME`, and `H = THEME.colors`. Shapes and text use scheme colours (`pres.SchemeColor`), so they follow the theme. `_shared/apply_theme.js` writes the 12 slots into `ppt/theme/theme1.xml` after the build.

| Slot | Hex | Role (theme.json) | Alias in build.js | Where it's used |
|---|---|---|---|---|
| dk1 | `0C0A08` | ink | `INK` (`C.text1`) | All titles and body text, `STATEMENT_INK` background, TAM outline, matrix axes, Ask rule, GTM arrows, doughnut slice 2 and legend text (as hex `H.dk1`) |
| lt1 | `F4F2F0` | bone | `BONE` (`C.background1`) | Background of the title and content masters, text on panels, title-slide meta, statement title, financials header text, bar data labels (as hex `H.lt1`) |
| dk2 | `6D6C6B` | muted text | `MUTED` (`C.text2`) | Descriptions, footer, slide number, `[Logo]`/`[Photo]` placeholders, competitor names, doughnut title (as hex `H.dk2`) |
| lt2 | `FFFFFF` | card white | `WHITE` (`C.background2`) | `card()` fill, TAM circle, financials body rows |
| accent1 | `E4F222` | acid lime | `ACID` (scheme), `LIME` (hex) | Highlights (`hl`), raise tag, "With product" panel, featured tier, first traction stat, Ask panel, SOM circle, stat and KPI numerals, bar chart, doughnut slice 1, financials Revenue row |
| accent2 | `1A1919` | dark panel | `PANEL` | `panel()` default fill, title footer band, browser bar, SAM circle, financials header row |
| accent3 | `D6D3CF` | hairline | `HAIR` | `card()` border, `rule()`/`vrule()` default, photo placeholders, statement sub text, KPI labels, table border and doughnut slice 4 (as hex `H.accent3`) |
| accent4 | `9A9894` | mid gray | `GRAY` | Dashed logo border, browser dots 2–3, competitor dots, "Source" line, bar axis labels and doughnut slice 3 (as hex `H.accent4`) |
| accent5 | `BDBAB5` | light gray | (none) | Bar chart title only (`H.accent5`) |
| accent6 | `3D3B39` | graphite | `C.accent6` | Dividers between KPIs in the unit economics band |
| hlink | `0C0A08` | (none) | (none) | Not used in build.js |
| folHlink | `6D6C6B` | (none) | (none) | Not used in build.js |

### Off-theme colours

**None.** `build.js` has no literal hex values. Some options accept only hex: text `highlight`, `chartColors`, chart title, label and legend colours, and the table `border`. These read hex from `theme.json` (`LIME = H.accent1`, `H.dk1`, `H.accent3` and so on). That means:

- Editing `theme.json` and rebuilding recolours everything.
- Editing the theme inside PowerPoint after the build does **not** recolour highlights, charts or the table border. Those were baked in as hex.

## Typography

| Face | Source | Font folder |
|---|---|---|
| Inter Tight (heading, `headFontFace`) | Theme major font. Used by title placeholders and by any `fontFace: THEME.headFontFace` | `../../fonts/InterTight/` |
| Inter (body, `bodyFontFace`) | Theme minor font. Default for every `T()` text box, and charts use it through `"+mn-lt"` | `../../fonts/Inter/` |

No accent face. Glyphs `→` and `↑` are set in body text.

| Element | Font | Size pt | Weight / style | Colour |
|---|---|---|---|---|
| Cover title (`TITLE_EDITORIAL` title) | Inter Tight | 88 | line spacing 0.9, bottom-aligned, lime highlight | INK |
| Cover tagline | Inter | 28 | regular | INK |
| Cover meta (in footer band) | Inter | 16 | regular | BONE |
| Raise tag text | Inter | 15 | bold | INK on ACID |
| "INVESTOR PRESENTATION" | Inter | 11 | bold, charSpacing 1.5 | INK |
| Content title | Inter Tight | 36 | line spacing 0.95, one `hl()` run | INK |
| Eyebrow (`content()`) | Inter | 13 | number bold with lime highlight, then label | INK |
| Statement title (`STATEMENT_INK`) | Inter Tight | 54 | line spacing 0.95, bottom-aligned | BONE |
| Statement sub | Inter | 20 | regular | HAIR |
| VISION / BACKUP tag | Inter | 13 | bold, charSpacing 1.5, highlight | INK on lime |
| `label()` | Inter | 11 | bold, UPPERCASE, charSpacing 1.5 | INK (default), MUTED or ACID |
| Highlight tags (Why now, GTM steps) | Inter | 11 | bold, UPPERCASE, charSpacing 1.5 | INK on lime |
| Hero stat (Problem, Ask) | Inter Tight | 80 | regular | ACID on panel / INK on lime |
| Column counters | Inter Tight | 72 (Why now), 60 (GTM), 36 (Problem), 24 (Competition) | regular | INK |
| Mid stats (Market, Traction) | Inter Tight | 36 | regular | INK |
| Pricing and KPI values | Inter Tight | 40 (pricing suffix 14) | regular | INK / ACID |
| Row headings | Inter | 20 (Problem, Product), 16 bold (Market, Competition) | regular / bold | INK |
| Why-now and GTM headlines | Inter | 22 / 19 | regular | INK |
| Bullets (Solution) | Inter | 17 | bullets, paraSpaceAfter 10 | INK |
| Insight band | Inter | 18 | "Our insight" bold ACID + BONE text | — |
| Descriptions | Inter | 14 (13 on Market, Traction, Competition, Team, Ask) | regular | MUTED |
| TAM / SAM / SOM | Inter | 14 | bold, charSpacing 1.5 | INK / BONE / INK |
| Team name / role | Inter Tight 20 / Inter 12 | — | role bold with highlight | INK |
| Milestone headline | Inter Tight | 17 | regular | INK |
| Financials table | Inter | 14 | header bold BONE on PANEL; row labels bold | INK / MUTED |
| Source line | Inter | 11 | regular | GRAY |
| Footer + slide number | Inter | 10 | regular | MUTED |
| Chart title / data labels / axis / legend | Inter (`+mn-lt`) | 13 / 12 / 12 / 13 | regular | `accent5` or `dk2` / `lt1` / `accent4` / `dk1` |

## Layouts

Positions are in inches, written as x, y, w, h.

**`TITLE_EDITORIAL`** has a BONE background.
- Fixed object: a PANEL rect (0, 6.35, 13.333, 1.15) as the footer band.
- `title` placeholder (0.6, 1.45, 12.13, 2.0): 88 pt INK, bottom-aligned, margin 0, line spacing 0.9.
- `tagline` body placeholder (0.6, 3.7, 11.0, 0.9): 28 pt INK, top.
- `meta` body placeholder (0.6, 6.55, 12.13, 0.75): 16 pt BONE, middle (sits on the band).

**`CONTENT_EDITORIAL`** has a BONE background and margin `[0.5, 0.6, 0.8, 0.6]`.
- `eyebrow` body placeholder (0.6, 0.5, 9.0, 0.35): 13 pt INK.
- `title` placeholder (0.6, 0.95, 12.13, 1.25): 36 pt INK, top, line spacing 0.95.
- Fixed text "[Company name] · Confidential" (0.6, 6.98, 6.0, 0.3): 10 pt MUTED.
- Slide number (12.23, 6.98, 0.5, 0.3): 10 pt MUTED, right-aligned.

**`STATEMENT_INK`** has an INK background and no fixed objects.
- `title` placeholder (0.6, 1.2, 12.13, 3.2): 54 pt BONE, bottom-aligned, line spacing 0.95.
- `sub` body placeholder (0.6, 4.75, 12.13, 1.3): 20 pt HAIR, top.

## Components & signature moves

| Helper | Draws | Used on |
|---|---|---|
| `T(slide, text, o)` | Text box with `margin: 0`, `valign: "top"` | Every text box outside placeholders |
| `hl(text, o)` | Text run with `highlight: LIME`, `color: INK`. Pad with spaces (`" 01 "`) to make a tag | Titles, eyebrows, tags, role badges, SOM value, "[Your company]" |
| `card(slide, o, name)` | RECTANGLE, WHITE fill, 0.75 pt HAIR border | Today card, browser frame, pricing tiers, traction stats 2–3, matrix, GTM cards, team cards, assumptions, milestones, logo box (override) |
| `panel(slide, o, name, color = PANEL)` | Borderless filled RECTANGLE, PANEL by default | Stat panel, insight band, browser bar, bottom-up box, KPI band, chart panel. ACID variant on raise tag, "With product", featured tier, traction stat 1, Ask panel. HAIR variant for photo boxes |
| `rule(slide, x, y, w, color = HAIR)` | 0.75 pt horizontal line | Row dividers (Problem, Product, Market, Competition), matrix axis (INK), Ask (INK) |
| `vrule(slide, x, y, h, color = HAIR)` | 0.75 pt vertical line | Why-now columns, KPI band (`accent6`), matrix axis (INK) |
| `label(slide, text, o)` | 11 pt bold uppercase, charSpacing 1.5 | Card and section labels |
| `content(num, eyebrow, titleRuns, section, notes)` | Adds a `CONTENT_EDITORIAL` slide. Fills the eyebrow with `hl(" num ")` and three spaces before the label, sets the title, adds notes | Slides 2–13 |

**Grid constants**
- `COL3 = [0.6, 4.74, 8.88]` with `W3 = 3.85` (about 0.29 in gutter).
- `COL4 = [0.6, 3.705, 6.81, 9.915]` with `W4 = 2.815`.
- `Y0 = 2.4` is the content top.
- Content width is 12.13 from x 0.6, so the right edge is 12.73.

**Recurring patterns**
- Numbered rows: an Inter Tight `0n` counter, a heading and a MUTED description, separated by `rule()` 0.2 in above each row after the first. Rows step 1.45 (Problem, Product), 1.2 (Market) or 1.15 (Competition).
- Full-bleed PANEL bands (x 0, w 13.333): insight band on Solution, unit economics on Business model.
- One ACID block per content slide marks the "answer": the featured tier, the first stat or the raise panel.
- Every shape is given an `objectName` (for example "Stat panel" or "Pricing tier 2") so it is easy to find in the Selection Pane.

## Slide by slide

1. **Title** (`TITLE_EDITORIAL`). Dashed GRAY logo box and right-aligned "INVESTOR PRESENTATION". Company name highlighted at 88 pt, tagline below, ACID raise tag at (0.6, 5.0, 5.2, 0.6), founder meta in the dark footer band.
2. **Problem**. Three numbered pain rows on the left (rules 7.0 wide). PANEL stat block at (8.1, 2.4, 4.63, 4.3) with an 80 pt ACID `[XX%]`, BONE caption and GRAY source.
3. **Solution**. WHITE "Today" card, 48 pt `→`, then an ACID "With [Product]" panel. Full-bleed PANEL insight band at y 5.65.
4. **Product**. White browser frame with a PANEL bar and three dots (first ACID). Three features on the right, each with a highlighted ` 0n ` tag.
5. **Why now**. Three columns on `COL3` split by `vrule`. Each has a 72 pt counter, a highlighted uppercase tag, a 22 pt headline and a MUTED description.
6. **Market**. Bottom-aligned concentric circles at cx 3.15: TAM in WHITE with an INK outline, SAM in PANEL, SOM in ACID. Value rows on the right (SOM value highlighted) and a PANEL "BOTTOM-UP" box.
7. **Business model**. Three pricing tiers on `COL3`, the middle one ACID. Full-bleed PANEL unit-economics band with four 40 pt ACID KPIs on `COL4`.
8. **Traction**. PANEL chart block holding a lime bar chart (gap 45%, no value axis or gridlines). Three stats on the right, the first in ACID.
9. **Competition**. White 2x2 matrix with INK axes. You are an ACID dot with an INK 1.5 pt outline; competitors are GRAY dots. "Why we win" numbered list on the right.
10. **Go-to-market**. Three 60 pt step counters joined by INK triangle-arrow lines, highlighted step tags, and three WHITE cards below at y 5.4.
11. **Team**. Four cards on `COL4`, each with a HAIR photo block, an Inter Tight name and a highlighted role. Advisors line at y 6.4.
12. **Financials**. Six-column table with a PANEL header, ACID Revenue row and WHITE rows (HAIR 0.75 pt border, rowH 0.4). Key assumptions card below.
13. **The ask**. ACID raise panel with an 80 pt `$[X]M` and an INK rule. Doughnut "Use of funds" (hole 62, legend right) and three milestone cards.
14. **Vision** (`STATEMENT_INK`). Highlighted " VISION " tag, 54 pt BONE statement with a lime phrase, contact line in HAIR.
15. **Appendix** (`STATEMENT_INK`). Highlighted " BACKUP " tag, highlighted "Appendix" title, backup topics in the sub placeholder.

## How to iterate

- **Change the palette.** Edit `colors` (and `roles`) in `theme.json`, then rebuild. There are no off-theme hexes to chase. Keep `accent1` light enough for INK text on it, because lime always carries INK text. Keep `accent2` dark, because panels carry BONE and ACID text.
- **Swap fonts.** Change `headFontFace` / `bodyFontFace` in `theme.json`. Install the family (add it under `../../fonts/<FamilyNoSpaces>/`) on any machine that builds, previews or presents. The 80/88 pt display sizes were tuned for Inter Tight's narrow width; recheck the title and stat box sizes if you change it.
- **Regenerate art.** Not applicable; this style has no generated art.
- **Add or duplicate a content slide.** Call `const s = content("13", "Eyebrow", [{ text: "Plain " }, hl("lime phrase")], "Section", notes)`. Then lay out from `Y0` on `COL3`/`W3` or `COL4`/`W4`, using `card()`, `panel()` (pass `ACID` for the hero block), `rule()`/`vrule()`, `label()` and `T()`. Use Inter Tight via `fontFace: THEME.headFontFace` for numerals. Add notes to `notes.json` or pass a string. For a dark closer, use `pres.addSlide({ masterName: "STATEMENT_INK" })` with the `title`/`sub` placeholders.
- **Rebuild and preview.** From `design-systems/`, run `npm run build:acid-editorial`, then `_shared/preview.sh acid-editorial`. PNGs are written to `acid-editorial/preview/`.

## Caveats

- **Highlights can disappear.** Lime highlights use the run-level `highlight` attribute. PowerPoint for Microsoft 365 / 2019+ renders it. Older PowerPoint, Keynote and some converters may drop it, which leaves plain INK text. That loses the signature look, though the text is still readable.
- **Hex-baked colours.** Highlights, chart colours and the table border are hex. A later theme change made inside PowerPoint will not update them; rebuild from `theme.json` instead.
- **Placeholder charts.** The bar chart (`10, 14, 19, 26, 34, 45`) and doughnut (`25 x 4`) use sample data, which the chart titles flag. They are native, editable charts.
- **Everything is editable.** There are no images; the logo, photo and screenshot areas are shapes with placeholder text.
- **Print.** Slides 14–15 are full-bleed INK, and several slides have large PANEL bands (title footer, Problem stat, insight band, KPI band, chart panel). These use a lot of toner and can band on office printers. Lime `E4F222` also prints weakly on some devices.
- **Font fallback.** pptxgenjs does not embed fonts. Without Inter / Inter Tight installed, PowerPoint substitutes them, which changes widths. The 88 pt cover title and 80 pt stats may then wrap or overflow their boxes.
- **Build order.** `applyTheme` must run after `writeFile`, otherwise scheme colours resolve to Office defaults. `scrubImagePaths` runs last; it is a no-op here because the deck has no images.
