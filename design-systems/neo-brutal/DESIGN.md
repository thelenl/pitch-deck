# Neo-Brutal Money: design system

- **Vibe:** cream paper, black ink, loud colour blocks, hard offset shadows (the comment at the top of `build.js`).
- **Output:** `../../pitch-deck-neo-brutal.pptx` (that is, `pitch-deck/pitch-deck-neo-brutal.pptx`). An optional first argument overrides it: `node neo-brutal/build.js out.pptx`.
- **Build:** `node neo-brutal/build.js` (run from `design-systems/`), or `npm run build:neo-brutal`.
- **Layout:** `LAYOUT_WIDE` (13.333 x 7.5 in). Theme name written into the file: "Neo-Brutal Money".

## At a glance

- **Hard, unblurred offset shadows.** Every card is two rectangles: a solid black copy offset by `SH = 0.09` in, and the coloured card on top with a 2.25 pt black outline (`brut()`).
- **Flat colour blocks.** Cards are filled in blue, lime, yellow or pink with no gradients, on a cream `FFF8E7` page. Everything has a thick black outline (2-3 pt).
- **Rotated "stickers".** Small badges tilted between -5 and 8 degrees ("OUCH.", "[POPULAR]", "LET'S GO", "UP & TO THE RIGHT ↗").
- **Three faces.** Archivo Black for titles and big numerals, Space Grotesk for body text, Space Mono for eyebrows, labels, footers and metadata.
- **Bookend slides in solid colour.** The title slide is full-bleed yellow. The vision and appendix slides are full-bleed black, with outlined geometric shapes (star, disc, rotated square).

## Palette

`theme.json` sets all 12 slots, and `build.js` refers to them through `pres.SchemeColor` (aliased as `C`), so most fills follow the theme. Charts can't take scheme colours, so they read the hex values directly from `THEME.colors` (aliased as `H`).

| Slot | Hex | Alias in build.js | Role | Where it's used |
|---|---|---|---|---|
| dk1 | `000000` | `INK` (`C.text1`), `H.dk1` | Ink: text, outlines, shadows | All outlines and shadow copies, body text, the CONTENT slide-number square, the STATEMENT_INK background, chart text |
| lt1 | `FFF8E7` | `PAPER` (`C.background1`) | Cream page | CONTENT background, alternate table rows, competitor discs, text on black (titles, the slide number), outlines of shapes on black slides |
| dk2 | `3A3A3A` | `C.text2` | Secondary text | Descriptions under card headings, the footer, the TODAY label, the screenshot placeholder, matrix axis labels, table values |
| lt2 | `FFFFFF` | `WHITE` (`C.background2`) | Card white | Default `brut()` fill, text on blue fills, the "+" on the appendix |
| accent1 | `5B5BFF` | `BLUE`, `H.accent1` | Electric blue | Insight bar, SOM circle, raise card, team role text, the eyebrow tag on slides 5 and 10, the blue disc and blue block, bar-chart bars, the first doughnut slice |
| accent2 | `9FE870` | `LIME`, `H.accent2` | Lime | "With product" card, stars, STATEMENT_INK subtitle text, `LIME` labels on black bars and the table header, sticker text on slide 1 |
| accent3 | `FFD400` | `YELLOW`, `H.accent3` | Yellow | TITLE_BLOCK background, default `chip()` fill, TAM circle, assumptions card, arrow |
| accent4 | `FF90E8` | `PINK`, `H.accent4` | Pink | Default `sticker()` fill, stat card, SAM circle, pink block and disc, "you" dot in the matrix, shadow under the advisors bar |
| accent5 | `6B6B6B` | not used | Neutral grey | Theme slot only |
| accent6 | `FF5C39` | not used | Orange-red | Theme slot only |
| hlink | `5B5BFF` | not used | Hyperlink | Theme slot only (same value as accent1) |
| folHlink | `6B6B6B` | not used | Followed hyperlink | Theme slot only |

### Off-theme colours

`build.js` hard-codes a single hex value, and it is the same as dk1. If you change dk1 away from black, edit these too:

| Hex | Where in build.js | What it colours |
|---|---|---|
| `000000` | Slide 8 bar chart: `dataBorder.color`, `catAxisLineColor` | Bar outlines (2 pt) and the category axis line (2 pt) |
| `000000` | Slide 12 table: `border.color` | 1.5 pt cell borders |
| `000000` | Slide 13 doughnut: `dataBorder.color` | Slice outlines (2 pt) |

All other colours are scheme references or `H.*` hex values read from `theme.json`.

## Typography

| Role | Face | Set in | Font folder |
|---|---|---|---|
| Heading (`+mj-lt`) | Archivo Black | `theme.json` `headFontFace`; `HEAD = "+mj-lt"` in build.js | `fonts/ArchivoBlack/` (Regular only) |
| Body (`+mn-lt`) | Space Grotesk | `theme.json` `bodyFontFace` | `fonts/SpaceGrotesk/` (variable font plus `static/`) |
| Accent mono | Space Mono | `const MONO = "Space Mono"` in build.js (hard-coded) | `fonts/SpaceMono/` (Regular, Bold, Italic, BoldItalic) |

Title placeholders use the heading font. Text boxes without a `fontFace` fall back to the body font.

| Element | Font | Size (pt) | Weight/style | Colour |
|---|---|---|---|---|
| Cover title (TITLE_BLOCK `title`) | Archivo Black | 66 | bold | INK |
| Cover tagline | Space Grotesk | 22 | regular | INK |
| Cover meta line | Space Mono | 13 | regular | INK |
| Content title | Archivo Black | 28 | bold | INK |
| Eyebrow (in a tag) | Space Mono | 12 | bold | INK (WHITE on a BLUE tag) |
| Footer "[Company name] · Confidential" | Space Mono | 10 | regular | text2 |
| Slide number (in a black square) | Space Mono | 11 | bold | PAPER |
| Statement title | Archivo Black | 40 | bold | PAPER |
| Statement subtitle | Space Mono | 17 | regular | LIME |
| Hero numerals: "[XX%]" (slide 2), "$[X]M" (slide 13) | Archivo Black | 64 / 60 | bold | INK / WHITE |
| Why-now numerals "01"–"03" | Archivo Black | 54 | bold | INK |
| Appendix "+" | Archivo Black | 96 | bold | WHITE |
| Stat values (pricing / traction and market / unit economics) | Archivo Black | 30 / 28 / 26 | bold | INK (WHITE on BLUE) |
| TAM / SAM / SOM circle labels | Archivo Black | 18 | bold | INK (SOM: WHITE) |
| Team name | Archivo Black | 18 | bold | INK |
| Team role | Space Mono | 12 | bold | BLUE |
| Card heading | Space Grotesk | 15–19 (17 is most common) | bold | INK |
| Card description | Space Grotesk | 12–14 (13 is most common) | regular | text2 or INK |
| Bullets (slides 3, 12) | Space Grotesk | 16 / 13 | regular (bold in the "with product" card) | INK |
| `label()` small caps line | Space Mono | 11 | bold | INK (or as passed) |
| Sticker text | Space Mono | 13 default (11–14) | bold | INK (or as passed) |
| `chip()` number | Archivo Black | 16 default (14 on slide 9) | bold | INK (WHITE on BLUE) |
| `disc()` label | Space Grotesk | 12 default (11 on team photos) | bold | INK (WHITE on BLUE) |
| Price unit "/ [user · month]" | Space Mono | 13 | regular | INK |
| Source / bottom-up line | Space Mono | 11 / 12 | regular, with a bold run | INK; LIME and PAPER on black |
| Chart title | `+mn-lt` | 13 (bar) / 12 (doughnut) | regular | dk1 |
| Chart data labels | `+mn-lt` | 13 (bar) / 11 (doughnut %) | bold | dk1 |
| Chart axis / legend | `+mn-lt` | 12 | regular | dk1 |
| Table body / header | Space Grotesk / Space Mono | 14 | header bold LIME on INK; row labels bold INK; values text2 | as noted |

## Layouts

| Master | Background | Placeholders (x, y, w, h in inches) | Fixed objects |
|---|---|---|---|
| `TITLE_BLOCK` | YELLOW (accent3) | `title` 0.8, 2.0, 9.0 x 1.6, 66 pt bold, bottom-aligned · `tagline` (body) 0.8, 3.8, 8.3 x 1.0, 22 pt · `meta` (body) 0.8, 6.45, 11.0 x 0.4, Space Mono 13 pt | none |
| `CONTENT` | PAPER (lt1) | `eyebrow` (body) 0.78, 0.42, 6.0 x 0.42, Space Mono 12 pt bold, vertically centred · `title` 0.6, 1.02, 12.13 x 1.05, 28 pt bold, top-aligned | Footer text at 0.6, 6.98 (6.0 x 0.3) · INK square at 12.23, 6.93 (0.5 x 0.38) with the slide number centred on it. Master margin is `[0.5, 0.6, 0.8, 0.6]` |
| `STATEMENT_INK` | INK (dk1) | `title` 0.8, 1.9, 9.2 x 2.2, 40 pt bold PAPER, bottom-aligned · `sub` (body) 0.8, 4.45, 9.6 x 1.4, Space Mono 17 pt LIME | none |

All placeholders have `margin: 0` and are left-aligned. No master uses an image.

## Components & signature moves

| Helper / constant | What it draws | Where it's used |
|---|---|---|
| `SH = 0.09` | The hard-shadow offset in inches | `brut()`, and the table shadow on slide 12 |
| `T(slide, text, o)` | A text box with `margin: 0` and `valign: "top"` | Every free text box |
| `brut(s, {x, y, w, h, fill = WHITE, name, lw = 2.25, shadow = INK, rotate})` | A shadow rectangle at +SH (no line), then the card with a black `lw` outline; `name` becomes `objectName` | Every card on slides 1–13. On the black bars it takes `shadow: LIME` (slide 6) or `shadow: PINK` (slide 11) |
| `chip(s, x, y, d, label, fill = YELLOW, color = INK, size = 16)` | A square with a 2 pt outline and a centred HEAD numeral | Numbered rows on slides 2, 4 and 9 |
| `disc(s, x, y, d, fill, label, color = INK, size = 12)` | A circle with a 2 pt outline and an optional bold label | Matrix dots (slide 9), team photo placeholders (slide 11) |
| `sticker(s, text, {x, y, w, h, fill = PINK, color = INK, rotate = -5, size = 13})` | A rotated badge: a black shadow at +0.06 (smaller than SH), a filled box with a 2 pt outline, and Space Mono bold text rotated with it. `objectName: "Sticker"` | Slides 1, 2, 7, 8, 9 and 13 |
| `label(s, text, x, y, w, color = INK)` | A Space Mono 11 pt bold line, 0.3 in tall | Section labels in cards (TODAY, UNIT ECONOMICS, WHY WE WIN, …) |
| `content(eyebrow, title, section, tagColor)` | Adds a CONTENT slide with an eyebrow tag in brut style (shadow at +0.06; width `0.45 + eyebrow.length * 0.112`; fill `tagColor`; 2 pt outline), then fills the eyebrow and title. The eyebrow text turns WHITE when `tagColor === BLUE` | Slides 2–13 |
| `COL3 = [0.6, 4.74, 8.88]`, `W3 = 3.76` | Three-column grid with gaps of 0.38 | Slides 5 and 7 (tiers) |
| `COL4 = [0.6, 3.705, 6.81, 9.915]`, `W4 = 2.72` | Four-column grid with gaps of 0.385 | Slides 7 (unit economics) and 11 |
| `SX = [0.6, 4.85, 9.1]`, `SW = 3.5` (local) | GTM three-step grid, with INK arrows in the 0.75 gaps | Slide 10 |
| Shadowed shape pattern | The same shape drawn twice, an INK copy at +0.07 to +0.1 with no line, then the coloured shape with a 3 pt INK outline | Title disc and block, the arrow on slide 3, the TAM circle |
| Black bar | `brut()` with `fill: INK` and a coloured shadow, holding a Space Mono line with a LIME bold lead-in and PAPER text | "BOTTOM-UP" (slide 6), "ADVISORS & INVESTORS" (slide 11) |

The content area is 0.6 to 12.6 in wide (a 12.0 in span), and the cards start at y ≈ 2.25–2.3.

## Slide by slide

1. **Title** (TITLE_BLOCK): yellow page. Top right has a shadowed blue disc, a pink block rotated 12°, and a lime star rotated -10°. Logo `brut` card at the top left. A black raise sticker with lime text, rotated -3°.
2. **Problem** (eyebrow tag PINK): three white pain cards with YELLOW, LIME and PINK chips. A pink stat card with a 64 pt "[XX%]" and a yellow "OUCH." sticker at 8°.
3. **Solution** (LIME): a white "Today" card, a shadowed yellow right arrow, a lime "With [product]" card, and a full-width blue insight bar with white text.
4. **Product** (YELLOW): a white screenshot frame with a black browser bar and pink, yellow and lime window dots. Three feature cards with LIME, PINK and BLUE chips.
5. **Why now** (BLUE, white eyebrow text): three full-height cards on COL3 in LIME, YELLOW and PINK, each with a 54 pt numeral.
6. **Market** (PINK): concentric outlined circles (yellow TAM with a shadow, pink SAM, blue SOM) with square colour keys. A black "BOTTOM-UP" bar with a lime shadow.
7. **Business model** (LIME): three tiers on COL3 (the middle one is lime) with a "[POPULAR]" sticker, and four unit-economics tiles on COL4 in BLUE, YELLOW, PINK and LIME.
8. **Traction** (YELLOW): a white chart card holding a blue bar chart (black bar outlines, no value axis), a lime "UP & TO THE RIGHT ↗" sticker, and three stat tiles in BLUE, PINK and LIME.
9. **Competition** (PINK): a white 2x2 matrix card with 2.25 pt cross lines, a pink "you" disc with a black sticker, cream competitor discs, and three advantage cards with chips.
10. **Go-to-market** (BLUE): three coloured step cards joined by black arrows, and three white detail cards below them.
11. **Team** (YELLOW): four white cards on COL4, each with a coloured round photo disc, the name in HEAD, and the role in blue Space Mono. A black advisors bar with a pink shadow.
12. **Financials** (LIME): a table with a black header row and lime Space Mono text, cream and white banded rows, and a hand-drawn INK shadow rectangle behind it. A yellow assumptions card.
13. **The ask** (PINK): a blue raise card with a 60 pt "$[X]M" and a lime "LET'S GO" sticker. A white card holding the use-of-funds doughnut in accent1–4. Three milestone cards in LIME, YELLOW and PINK.
14. **Vision** (STATEMENT_INK): black page with a lime star, a pink disc and a yellow block, all outlined 3 pt in PAPER. The title is cream and the subtitle is lime mono.
15. **Appendix** (STATEMENT_INK): a blue block rotated 8° with a 96 pt white "+" that rotates with it. The subtitle lists the backup topics.

## How to iterate

- **Change the palette:** edit the 12 hex values in `neo-brutal/theme.json`, and keep the `name` key, because `applyTheme` requires it. Scheme fills and the chart colours (`H.*`) follow automatically. If dk1 is no longer black, update the `"000000"` values in the off-theme table above (chart borders and axis, table border). Text on BLUE is chosen by comparing against `BLUE` (`txt = f === BLUE ? WHITE : INK`, and the `i === 2 ? WHITE : INK` chips), so recheck contrast if accent1 becomes light.
- **Swap fonts:** change `headFontFace` and `bodyFontFace` in `theme.json`. The mono face is the `MONO` constant on line 11 of `build.js`. Put the font files in `pitch-deck/fonts/<FamilyNoSpaces>/` so that previews pick them up (`_shared/fonts.conf` points LibreOffice at `../../fonts`).
- **Restyle the shadow:** change `SH` for the cards and table. Stickers (`+0.06`), eyebrow tags (`+0.06`) and the one-off decorative shapes (`+0.07` to `+0.1`) hard-code their own offsets.
- **Add or duplicate a content slide:** call `content("NN · EYEBROW", "Title", "<section>", TAGCOLOR)`. Lay cards out with `brut()` on `COL3`/`W3` or `COL4`/`W4`, put small caps headers in `label()`, number rows with `chip()`, and add at most one `sticker()` for emphasis. Add `s.addNotes(...)`. Put full-bleed statement slides on `STATEMENT_INK`.
- **Art:** this style has no art generator and no image files. Every decoration is a native shape.
- **Rebuild and preview:** `npm run build:neo-brutal`, or `_shared/preview.sh neo-brutal [dpi]` from `design-systems/`. The preview builds into `neo-brutal/preview/neo-brutal.pptx` and renders a PDF and `slide-*.png` files through LibreOffice and `pdftoppm` (80 dpi by default).

## Caveats

- **Everything stays editable.** No slide content is an image. The hard shadows are separate rectangles, not shape effects, so moving or resizing a card means moving or resizing its shadow too (only the top shape carries an `objectName`). The table shadow on slide 12 is sized by hand (12.0 x 2.94) to fit 7 rows of 0.42; add or remove rows and it won't match.
- **Text inside rotated stickers is rotated with them.** It lives in a separate text box that has to be rotated in step with the box if you edit it.
- **The eyebrow tag width is estimated** from the character count (`0.112` in per character). Long or wide eyebrows can overflow the tag, and short ones leave padding.
- **Faux bold on the heading font.** Archivo Black ships with Regular only (`fonts/ArchivoBlack/`), but titles and numerals set `bold: true`, so renderers may synthesise extra weight.
- **Fonts aren't embedded.** On a machine without Archivo Black, Space Grotesk or Space Mono, PowerPoint substitutes other fonts and the hand-placed text boxes may overflow.
- **Printing is ink-heavy.** Slide 1 is full-bleed yellow and slides 14–15 are full-bleed black.
- **Chart colours are frozen hex values.** They are copied from `theme.json` at build time, so changing the theme inside PowerPoint later won't recolour the charts, although it will recolour the shapes.
- **Placeholder data.** The bar chart (10–45) and the doughnut (25/25/25/25) are sample data. Edit them with Edit Data in PowerPoint.
- **Unused theme slots.** accent5, accent6, hlink and folHlink are set in `theme.json` but not used in `build.js`.
