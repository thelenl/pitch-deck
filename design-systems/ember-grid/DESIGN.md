# Ember Grid: design system

- **Vibe:** "Swiss precision with heat" (the comment at the top of `build.js`): a visible 12-column grid, hard square blocks, and a yellow → amber → orange → ink stepped "pixel" bar.
- **Output:** `../../pitch-deck-ember-grid.pptx` (that is, `pitch-deck/pitch-deck-ember-grid.pptx`). An optional first argument overrides it: `node ember-grid/build.js out.pptx`.
- **Build:** `node ember-grid/build.js` (run from `design-systems/`), or `npm run build:ember-grid`.
- **Layout:** `LAYOUT_WIDE` (13.333 x 7.5 in). Theme name written into the file: "Ember Grid".
- **Files:** `build.js`, `theme.json`. No art generator and no image files; every slide is native shapes, text, tables and charts.

## At a glance

- **The grid is on the page.** Every master draws 13 vertical hairlines (0.75 pt) at the 12-column boundaries, from y 0.3 to 7.2 in. Content sits on the same columns via `colX()` / `span()`.
- **Stepped "pixel" bars.** Runs of solid blocks in accent3 → accent2 → accent1 → dk1 (`STEPS`) stand in for arrows, progress and dividers: footer bar, statement bar, why-now cards, the solution "arrow", the market bars, the GTM staircase.
- **Squares as markers.** A 0.16 in accent1 square marks every eyebrow and card label; numbered squares (`sq()`) mark list items; competitors are grey squares in the matrix.
- **Oversized numerals.** Archivo Black section numbers ("01"–"12") at 72 pt in accent1, top right of each content slide, and big Archivo Black stats (54–66 pt).
- **Three surfaces.** Full-bleed ember orange for the title, white with a light grid for content, near-black ink with a dark grid for the close.

## Palette

`theme.json` sets all 12 slots (it gives no roles; the roles below come from how `build.js` uses them). Shapes and text use `pres.SchemeColor` (aliased `C`, so `C.text1` = dk1, `C.background1` = lt1, `C.text2` = dk2, `C.background2` = lt2). Charts and the table border take hex only, so they read `THEME.colors` (aliased `H`).

| Slot | Hex | Alias in build.js | Role | Where it's used |
|---|---|---|---|---|
| dk1 | `111111` | `C.text1`, `H.dk1` | Ink | Almost all text, card outlines (1.25 pt), matrix axes, last block of `STEPS`, STATEMENT_INK background, bottom row of the title staircase, dark cards (With-product card, bottom-up bar, raise chip, traction stat 1, milestone 3, table header, "why we win" squares), chart data labels, bar-chart axis line, legend, 4th doughnut slice |
| lt1 | `FFFFFF` | `C.background1` | Page white | CONTENT background, 3rd row of the title staircase, outlined cards (insight, unit economics, GTM, milestones), table rows Operating expenses and Ending cash, text on ink (statement title, raise chip, With-product bullets, bottom-up math, table header) |
| dk2 | `5E5A55` | `C.text2`, `H.dk2` | Secondary text | Footer, descriptions under headings, TODAY label, screenshot and photo labels, matrix axis labels, competitor names, table values, chart titles, bar-chart category labels |
| lt2 | `F4F3F0` | `C.background2` | Card fill | Default `panel()` fill (Today, why-now, pricing tiers 1 and 3, traction stats 2–3, team, assumptions), matrix background, screenshot placeholder, table rows Gross margin, Net burn and Headcount |
| accent1 | `FA520F` | `C.accent1`, `H.accent1` | Ember orange (hero) | TITLE_EMBER background, eyebrow and label marker squares, section numbers, default `sq()` fill, problem stat card, pricing tier 2, raise card, SOM bar, table Revenue row, "WITH [PRODUCT]" / "Bottom-up:" / dark-card labels and values, logo placeholder, bar-chart bars, 1st doughnut slice, 3rd block of `STEPS` |
| accent2 | `FFA110` | `C.accent2`, `H.accent2` | Amber | 2nd block of `STEPS`, top row of the title staircase, SAM bar, GTM step 2, middle solution-arrow block, 2nd doughnut slice |
| accent3 | `FFD900` | `C.accent3`, `H.accent3` | Yellow | 1st block of `STEPS`, 2nd row of the title staircase, TAM bar, GTM step 1, first solution-arrow block, 3rd doughnut slice |
| accent4 | `9A958E` | `C.accent4` | Warm grey | Competitor squares in the matrix |
| accent5 | `E9E6E1` | `C.accent5`, `H.accent5` | Light grid | CONTENT grid lines, table borders (0.75 pt), photo placeholders, STATEMENT_INK subtitle text, milestone 3 description |
| accent6 | `2A2A2A` | `C.accent6` | Dark grid | STATEMENT_INK grid lines |
| hlink | `FA520F` | not used | Hyperlink | Theme slot only (same as accent1) |
| folHlink | `9A958E` | not used | Followed hyperlink | Theme slot only (same as accent4) |

### Off-theme colours

`build.js` hard-codes one hex value. It is a lighter tint of accent1, so change it whenever you change accent1:

| Hex | Where in build.js | What it colours |
|---|---|---|
| `FF6A2E` | line 49, `gridLines("FF6A2E")` in the TITLE_EMBER master | The 13 grid hairlines over the orange title background |

## Typography

| Face | Theme role | How build.js reaches it | Font folder |
|---|---|---|---|
| Archivo Black | heading (`headFontFace`) | Title placeholders; `HEAD = "+mj-lt"` for numerals and display text; `"+mj-lt"` on bar-chart data labels | `fonts/ArchivoBlack/` (Regular only) |
| Archivo | body (`bodyFontFace`) | Everything else by default; `"+mn-lt"` on chart titles, axis labels, legend and doughnut labels | `fonts/Archivo/` (variable + `static/`) |

No accent face. `T()` adds `bold: true` automatically whenever `fontFace === HEAD`.

| Element | Font | Size pt | Weight / style | Colour |
|---|---|---|---|---|
| Title slide company name (placeholder) | heading | 64 | bold, bottom-aligned | dk1 |
| Title slide tagline / meta | body | 22 / 13 | regular | dk1 |
| Raise chip (slide 1) | body | 14 | bold, centred | lt1 on dk1 |
| Content eyebrow (placeholder) | body | 12 | bold, charSpacing 3 | dk1 |
| Content title (placeholder) | heading | 26 | bold | dk1 |
| Section number | Archivo Black | 72 | bold, right-aligned | accent1 |
| Statement title / sub (placeholders) | heading / body | 40 / 20 | bold / regular | lt1 / accent5 |
| Hero stat (slide 2 / slide 13) | Archivo Black | 66 / 60 | bold | dk1 |
| Why-now numerals | Archivo Black | 54 | bold | accent1 |
| Price, traction values | Archivo Black | 32 | bold | dk1 (accent1 on the dark tile) |
| Unit-economics values / TAM-SAM-SOM values | Archivo Black | 28 / 24 | bold | dk1 |
| GTM step numbers / team names / milestone heads | Archivo Black | 20 / 18 / 16 | bold | dk1 (lt1 on dark milestone) |
| Card labels ("TODAY", "WHY WE WIN", tier names, "UNIT ECONOMICS") | body | 12 (11 on milestones) | bold, charSpacing 3 | dk1, dk2 or accent1 |
| Team role | body | 13 | bold, charSpacing 2 | dk1 |
| Card headings | body | 16–19 | bold | dk1 |
| Bullets in cards | body | 16 | regular, paraSpaceAfter 10 (8 on raise card) | dk1 or lt1 |
| Body / descriptions | body | 13–14 | regular | dk2 |
| Table | body | 14 | header and row labels bold | lt1 on dk1 header; dk1 / dk2 cells |
| `sq()` labels | Archivo Black | 14 default (11–13 used) | bold, centred | dk1 or lt1 |
| Source, photo label, axis labels | body | 11–12 | regular | dk1 / dk2 |
| Footer / slide number | body | 10 / 10 | regular / bold | dk2 / dk1 |
| Chart title | body (`+mn-lt`) | 14 | regular | dk2 |
| Bar-chart value labels / category axis | heading (`+mj-lt`) / body | 13 / 12 | regular | dk1 / dk2 |
| Doughnut legend / percent labels | body | 13 / 11 | regular | dk1 |

## Layouts

All positions in inches (x, y, w, h). Grid lines on every master come from `gridLines(color)`.

| Master | Background | Placeholders | Fixed objects |
|---|---|---|---|
| `TITLE_EMBER` | accent1 | `title` (0.6, 1.9, 8.6, 2.5) 64 pt bold, bottom; `tagline` body (0.6, 4.55, 8.4, 0.9) 22 pt; `meta` body (0.6, 6.55, 7.9, 0.4) 13 pt | Grid lines in `FF6A2E`; pixel staircase `stair`: 4 columns of 1.0 in blocks from x 8.73, bottom at y 6.9, column c holds c+1 blocks, rows bottom→top dk1, accent3, lt1, accent2 |
| `CONTENT` | lt1 | `eyebrow` body (0.9, 0.43, 8.0, 0.3) 12 pt bold, charSpacing 3; `title` (0.6, 0.85, 10.0, 1.0) 26 pt bold, top | Grid lines in accent5; 0.16 in accent1 marker square at (0.6, 0.5); `stepBar(0.6, 7.03, 0.28, 0.12)` footer bar; footer text "[Company name] · Confidential" (1.9, 6.95, 6.0, 0.3) 10 pt dk2; slide number (12.03, 6.95, 0.7, 0.3) 10 pt bold, right. Margin [0.5, 0.6, 0.8, 0.6] |
| `STATEMENT_INK` | dk1 | `title` (0.6, 2.0, 11.1, 2.2) 40 pt bold lt1, bottom; `sub` body (0.6, 4.5, 11.1, 1.4) 20 pt accent5, top | Grid lines in accent6; `stepBar(0.6, 1.2, 0.9, 0.3)` (four 0.9 x 0.3 blocks) |

## Components & signature moves

**Grid constants.** `GX = 0.6` (left margin), `GW = 12.13` (grid width, so the right edge is 12.73 and the right margin 0.6), `NCOL = 12`. One column is about 1.011 in, with no gutter in the grid itself.

| Name | What it does | Where it's used |
|---|---|---|
| `colX(i)` | Left edge of column i (0–12): `GX + GW*i/NCOL` | All content positioning |
| `span(from, n)` | `{x, w}` covering n columns from `from` | Two-column splits (slides 2, 3, 4, 8, 13) |
| `COL3`, `COL4` | Three 4-column / four 3-column spans, each `w - 0.2` (0.2 in gutter) | Slides 5, 7, 10 (COL3); 7, 11 (COL4) |
| `gridLines(color, y0=0.3, y1=7.2)` | 13 vertical 0.75 pt lines at the column edges | All three masters |
| `STEPS` | `[accent3, accent2, accent1, dk1]` | Default for `stepBar`; sliced on slide 5 |
| `stepBar(x, y, bw, bh, colors)` | Master-object version of the stepped bar | CONTENT footer, STATEMENT_INK |
| `steps(slide, x, y, bw, bh, colors)` | Slide-level stepped bar | Slides 2, 5, 13 |
| `stair` | Bottom-aligned 4-column pixel staircase | TITLE_EMBER |
| `T(slide, text, o)` | Text box, margin 0, top-aligned; auto-bold for `HEAD` | All slide text |
| `rect(slide, o)` | Rectangle with no outline unless `o.line` is given | All shapes |
| `panel(slide, x, y, w, h, name, fill = lt2)` | Named flat card | Cards on most slides |
| `sq(slide, x, y, d, label, fill = accent1, color = dk1, size = 14)` | Square with an optional centred Archivo Black label | Numbered rows (2, 4, 9), matrix markers (9) |
| `content(num, label, title, section)` | Adds a CONTENT slide, fills eyebrow and title, adds the 72 pt section number at (10.83, 0.3, 1.9, 1.3) named "Section number" | Slides 2–13 |
| `notes(s)` | Adds the next speaker note read from `../template/build.js` | Every slide |

Recurring patterns:

- **Marker square:** `rect` 0.16 x 0.16 in accent1 beside a label (eyebrow, insight card, "WHY WE WIN", team photo corner, "KEY ASSUMPTIONS").
- **Outlined card:** lt1 fill with a 1.25 pt dk1 line (insight card, unit-economics tiles, GTM cards, milestones).
- **One card inverted:** in each set one card flips to ink or ember: problem row 3 square, pricing tier 2 (accent1), traction stat 1 (dk1), milestone 3 (dk1).
- **Dashed placeholder:** 1 pt dk1 dash outline for the logo (slide 1) and the screenshot (slide 4).
- **Eyebrow labels in caps** with charSpacing 3.

## Slide by slide

1. **Title** (TITLE_EMBER): ember background with staircase; dashed logo box; ink "Raise chip" at (0.6, 5.6, 4.9, 0.55).
2. **Problem** ("01"): three rows with numbered squares (the third in ink); accent1 stat card on columns 8–12 with a 66 pt stat and a 3-block step bar above the source.
3. **Solution** ("02"): lt2 "Today" card (cols 0–5) vs ink "With product" card (cols 6–12); three rising blocks (yellow/amber/orange) in column 5 as the arrow; outlined insight bar below.
4. **Product** ("03"): dashed lt2 screenshot box on columns 0–8; three numbered accent1 squares with features on columns 8–12.
5. **Why now** ("04"): three COL3 cards; the stepped bar grows 2, 3, 4 blocks; 54 pt accent1 numerals.
6. **Market** ("05"): TAM/SAM/SOM as solid bars 6, 4, 2 columns wide in yellow, amber, orange; ink bottom-up bar.
7. **Business model** ("06"): three pricing tiers, middle one ember; four outlined unit-economics tiles on COL4.
8. **Traction** ("07"): orange column chart on columns 0–8 (value axis hidden, no gridlines); three stat tiles, the first in ink.
9. **Competition** ("08"): lt2 2x2 matrix with dk1 axes, an accent1 "you" square top right and accent4 competitor squares; "WHY WE WIN" list with ink numbered squares.
10. **Go-to-market** ("09"): three-step staircase (block heights 0.45, 0.75, 1.05 in, yellow → orange) bottom-aligned at y 3.05; three outlined cards.
11. **Team** ("10"): four lt2 cards on COL4 with accent5 photo squares and an accent1 corner marker; advisors line.
12. **Financials** ("11"): table with ink header, ember Revenue row, alternating lt2/lt1 rows, accent5 borders; lt2 assumptions card.
13. **The ask** ("12"): ember raise card (60 pt); doughnut in accent1/accent2/accent3/dk1; three milestone cards, the runway one in ink.
14. **Vision** (STATEMENT_INK): ink background, dark grid, large stepped bar above the statement.
15. **Appendix** (STATEMENT_INK): same treatment, "Appendix" title.

## How to iterate

- **Change the palette.** Edit `colors` in `theme.json` (and `name` if it's a new style). Then edit the one off-theme hex, `FF6A2E` on line 49 (a tint of accent1). Rebuild; shapes and text follow the theme, and charts pick up the new hex from `H` at build time. `STEPS`, `stair` and the market/GTM/doughnut fills are all slot references, so the warm ramp follows accent3 → accent2 → accent1.
- **Swap fonts.** Change `headFontFace` / `bodyFontFace` in `theme.json`. Numerals use `"+mj-lt"` and charts use `"+mj-lt"` / `"+mn-lt"`, so nothing else in `build.js` names a font. Put the font files in `../../fonts/<FamilyNoSpaces>/` so previews find them (`_shared/fonts.conf`). If the new heading face has a real bold, note that `T()` still forces `bold: true` for `HEAD`. Big numerals sit in fixed-height boxes (e.g. 72 pt in 1.3 in), so check for overflow with a wider face.
- **Regenerate art.** Not applicable: this style has no generator or image files.
- **Add or duplicate a content slide.** Copy one `{ ... }` block. Start with `content("NN", "EYEBROW", "Title", "<section>")` (the section numbers are hard-coded strings, so renumber the later slides). Lay it out with `span()` / `COL3` / `COL4` / `colX()` and build it from `panel()`, `rect()`, `sq()`, `steps()` and `T()`. For a closing-style slide use `pres.addSlide({ masterName: "STATEMENT_INK", sectionTitle: "Close" })` with the `title` and `sub` placeholders.
- **Notes for new slides.** `notes(s)` takes the next of the 15 notes parsed from `../template/build.js`, in order. A new slide should call `s.addNotes("...")` directly; calling `notes()` a 16th time would pass `undefined`, and inserting a slide in the middle shifts every later note.
- **Rebuild and preview.** `node ember-grid/build.js`, then `_shared/preview.sh ember-grid [dpi]` (from `design-systems/`) builds into `ember-grid/preview/` and renders `slide-*.png` plus a PDF (needs LibreOffice and `pdftoppm`; dpi defaults to 80).

## Caveats

- **Everything is editable.** No images. The grid lines, staircase, footer bar, marker square and footer text are master objects, so you edit them in Slide Master view, not on the slides. The footer reads "[Company name] · Confidential" literally and must be changed in `build.js` or the master.
- **Section numbers are text boxes, not placeholders.** They are hard-coded ("01"–"12") and don't renumber when slides move.
- **Faux bold on the heading font.** `fonts/ArchivoBlack/` has Regular only, but title placeholders and every `HEAD` text set `bold: true`, so renderers may synthesise extra weight.
- **Fonts aren't embedded.** Without Archivo Black and Archivo installed, PowerPoint substitutes, and the fixed-size text boxes (big numerals, card headings) may overflow.
- **Printing is ink-heavy.** Slide 1 is full-bleed `FA520F` and slides 14–15 are full-bleed `111111`.
- **Chart colours are frozen hex values** copied from `theme.json` at build time; re-theming inside PowerPoint recolours shapes but not the charts or the table border. `FF6A2E` never follows the theme.
- **Placeholder data.** The bar chart (10–45) and the doughnut (25/25/25/25) are sample data; edit them with Edit Data in PowerPoint.
- **Hex-only options.** `applyTheme` throws if a scheme colour reaches a hex-only option (e.g. `chartColors` on the one-series bar chart, table `border.color`); keep using `H.*` there.
- **Notes dependency.** The build throws unless `../template/build.js` contains exactly 15 `addNotes("...")` calls.
- **Unused theme slots.** hlink and folHlink are set but not referenced in `build.js`.
