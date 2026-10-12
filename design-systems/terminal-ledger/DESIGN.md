# Terminal Ledger: design system

- **Vibe:** "a Bloomberg terminal written by engineers" (build.js line 1). Near-black panes, phosphor-green money numbers, amber warnings, monospace everything that counts.
- **Output:** `../../pitch-deck-terminal-ledger.pptx` (i.e. `pitch-deck/pitch-deck-terminal-ledger.pptx`); a path passed as the first argument overrides it.
- **Build:** `node terminal-ledger/build.js` (run from `design-systems/`), or `npm run build:terminal-ledger`.
- **Files:** `build.js`, `theme.json`, `notes.json` (15 speaker-note strings, `NOTES[0..14]`), `art.py`, `bg_title.png`, `bg_content.png`, `halo.png`.

## At a glance

- Dark, 16:9 `LAYOUT_WIDE` (13.333 x 7.5 in) on a raster background: a 24 px dot grid with soft green glows (plus scanlines on title/statement slides).
- Everything sits in **panes**: flat `accent3` rectangles with 1 pt `dk2` hairline borders, laid edge to edge on touching 3- and 4-column grids (`G3`, `G4`).
- Shell-prompt flourishes: `// 0N · SECTION` eyebrows, `$ ./pitch --investor` and `$ echo $VISION` prompts with a solid green block cursor, `>` and `$` lead-ins, `──→` step arrows, `▲` ticks.
- One hero highlight per slide: a **green-tinted pane** (`accent1` at 92% transparency, green 1.25–1.5 pt border) marks the key card.
- Numbers, labels and titles in Geist Mono; body copy in Geist.

## Palette

`build.js` reads scheme colours through `pres.SchemeColor`, so text and shapes follow `theme.json` (written into the deck by `_shared/apply_theme.js`). Charts and the table border need raw hex, so they read `H = THEME.colors`.

| Slot | Hex | Role (theme.json) | build.js alias | Where it's used |
|---|---|---|---|---|
| dk1 | `0A0A0A` | background | `BG` (`text1`) | "SOM" label text, team photo-box fill, even financial-table rows |
| lt1 | `EDEDED` | text | `FG` (`background1`) | Titles, taglines, headings, body text in panes; bar-chart data labels and doughnut legend (`H.lt1`) |
| dk2 | `2A2A2A` | hairlines / panes | `LINE` (`text2`) | Default pane border, `hair()` rules; chart dashed value gridlines and table border (`H.dk2`) |
| lt2 | `8F8F8F` | muted labels | `MUTED` (`background2`) | Meta line, statement sub, footer text, slide number, `label()` default, descriptions; chart titles, category-axis labels, doughnut slice 3 (`H.lt2`) |
| accent1 | `3DFF8A` | money / up | `GRN` | Eyebrows, big stats, step numbers, cursors, footer square, tint fill, "You" marker, bar series, doughnut slice 1 |
| accent2 | `FFB000` | highlights / warnings | `AMB` | "− TODAY" label, pain-row 3 number, problem `▲`, Why-now and GTM step labels, product-window dot, doughnut slice 2 |
| accent3 | `141414` | pane fill | `PANE` | Default `pane()` fill, chart/plot area fills, doughnut slice borders, odd financial-table rows |
| accent4 | `5C5C5C` | dim marks | `DIM` | Dashed logo/photo outlines, matrix axes, competitor squares, SAM border, team card numbers, `──→`, cat-axis line, doughnut slice 4 |
| accent5 | `1F1F1F` | raised pane | `RAISED` | SAM square fill, financial-table header row fill |
| accent6 | `B8FFD3` | (none) | (none) | Not referenced in build.js; theme slot only |
| hlink | `3DFF8A` | (none) | (none) | Theme hyperlink colour only |
| folHlink | `8F8F8F` | (none) | (none) | Theme followed-link colour only |

### Off-theme colours

`build.js` contains **no literal hex values**: every colour is a scheme alias or `H.<slot>`. The only colours outside theme.json are baked into the art by `art.py`, so a palette change must also edit and rerun it:

| Value in art.py | Equals | Used in |
|---|---|---|
| `base = [10, 10, 10]` | `0A0A0A` (dk1) | Background of `bg_title.png` and `bg_content.png` |
| `green = [61, 255, 138]` | `3DFF8A` (accent1) | Glows in both backgrounds; RGB of `halo.png` (hard-coded again as `61, 255, 138` in the `np.full` calls) |
| `amber = [255, 176, 0]` | `FFB000` (accent2) | Faint top-left glow in `bg_title.png` |
| `dots(…, val)`, `scan(val)` | additive grey | Dot grid (+14 content, +16 title) and scanlines (+4) on top of `base` |

Transparency: the tint pane is `GRN` at `transparency: 92`.

## Typography

| Face | Source | Font folder |
|---|---|---|
| **Geist Mono**: theme heading font (`headFontFace`), referenced as `M = "+mj-lt"` | theme.json | `pitch-deck/fonts/GeistMono/` |
| **Geist**: theme body font (`bodyFontFace`), the default for text boxes without `fontFace` (charts name it `+mn-lt`) | theme.json | `pitch-deck/fonts/Geist/` |

No other face is named in build.js. Unicode glyphs (`●`, `▲`, `→`, `──→`, `−`, `▸` bullet `25B8`) come from whichever font renders them.

| Element | Font | Size pt | Weight / style | Colour |
|---|---|---|---|---|
| Title slide title (placeholder) | heading (Geist Mono) | 66 | bold | FG |
| Title slide tagline | body | 22 | regular | FG, with a 22 pt bold mono `>` in GRN |
| Title slide meta | Geist Mono | 13 | regular | MUTED |
| Title chips: confidential tag / prompt / raise chip | Geist Mono | 11 / 16 / 14 | bold / regular / bold | MUTED + GRN `●` / MUTED + GRN `$` / GRN |
| Content eyebrow (`// 0N · …`) | Geist Mono | 13 | bold, charSpacing 1 | GRN |
| Content title | heading (Geist Mono) | 26 | bold | FG |
| Statement title (vision, appendix) | heading (Geist Mono) | 36 | bold | FG |
| Statement sub | Geist Mono | 16 | regular | MUTED |
| Hero stats (problem %, raise) | Geist Mono | 66 / 64 | bold | GRN |
| Big index numbers (Why now / GTM) | Geist Mono | 54 / 40 | bold | GRN |
| Stats (market values, prices, KPI tiles) | Geist Mono | 30–34 | bold | FG (GRN when highlighted) |
| Row numbers `01…` | Geist Mono | 26 (problem), 14 (product, competition) | bold | GRN / AMB |
| Card headings | body | 15–20 | bold | FG |
| Body / descriptions | body | 13–17 | regular | MUTED (FG inside panes and lists) |
| `label()` small caps-style labels | Geist Mono | 11 default, 12–13 used | bold, charSpacing 1 | MUTED, GRN or AMB |
| Team role | Geist Mono | 13 | bold | GRN |
| Footer text, slide number | Geist Mono | 10 | regular | MUTED |
| Chart title | `+mj-lt` | 13 | regular | `H.lt2` |
| Bar data labels / cat axis | `+mj-lt` | 12 / 12 | regular | `H.lt1` / `H.lt2` |
| Doughnut legend | `+mn-lt` | 13 | regular | `H.lt1` |
| Financial table | body; numbers and header in Geist Mono | 14 | header bold | header GRN, cells FG |
| Matrix axis captions | Geist Mono | 12 | regular | MUTED |

## Layouts

All three masters use image backgrounds; none sets a solid colour.

### TITLE_DARK (slide 1)
- Background `bg_title.png`.
- `title` (title): x 0.8, y 2.25, w 11.7, h 1.35; 66 pt bold FG, left, valign bottom, margin 0.
- `tagline` (body): x 1.3, y 3.9, w 10.9, h 0.9; 22 pt FG, valign top.
- `meta` (body): x 0.8, y 6.35, w 11.0, h 0.4; 13 pt Geist Mono MUTED.
- No fixed objects.

### CONTENT (slides 2–13)
- Background `bg_content.png`; margin `[0.5, 0.6, 0.8, 0.6]`.
- `eyebrow` (body): x 0.6, y 0.45, w 9.0, h 0.32; 13 pt Geist Mono bold GRN, charSpacing 1.
- `title` (title): x 0.6, y 0.85, w 12.13, h 1.0; 26 pt bold FG, left, valign top.
- Fixed: GRN square 0.09 x 0.09 at (0.6, 7.04); footer text "[Company name] · Confidential" at x 0.8, y 6.95, w 6.0, h 0.3, 10 pt mono MUTED.
- Slide number: x 12.13, y 6.95, w 0.6, h 0.3, 10 pt mono MUTED, right-aligned.

### STATEMENT_DARK (slides 14–15)
- Background `bg_title.png`.
- `title` (title): x 0.8, y 2.3, w 11.7, h 2.4; 36 pt bold FG, valign bottom.
- `sub` (body): x 0.8, y 5.0, w 11.7, h 1.3; 16 pt Geist Mono MUTED, valign top.
- No fixed objects.

## Components & signature moves

| Name | What it draws | Used on |
|---|---|---|
| `T(slide, text, o)` | `addText` with `isTextBox`, margin 0, valign top, then `o` | Every slide |
| `pane(slide, x, y, w, h, o)` | Rectangle. Fill: `o.tint` = GRN at 92% transparency, `o.clear` = none, else `o.fill` or PANE. Line: `o.line` or LINE, width `o.lw` or 1, `o.dash` or solid. `o.name` sets `objectName` | All panes, cards, chips, TAM/SAM/SOM squares, photo boxes |
| `hair(slide, x, y, w)` | 1 pt horizontal LINE in `dk2` | Problem, product, market, competition row rules |
| `label(slide, text, x, y, w, color = MUTED, size = 11)` | 0.3 in high mono bold label, charSpacing 1 | Pane headers (`problem.stat`, `product.preview`, `// WHY WE WIN`, tier names…) |
| `content(eyebrow, title, section)` | New CONTENT slide with both placeholders filled | Slides 2–13 |
| `items(sign, col, list, textCol)` (slide 3 local) | Runs of `−`/`+` mono bold sign + text with line breaks | Solution panes |
| `hdr(t)` (slide 12 local) | Table header cell: bold GRN mono on RAISED, right-aligned unless empty | Financials table |
| **Grid** `G3`, `W3` | 3 touching columns: x = 0.6 + i·(12.13/3), width 4.043 | Why now, pricing tiers, GTM steps and cards |
| **Grid** `G4`, `W4` | 4 touching columns: x = 0.6 + i·(12.13/4), width 3.0325 | Unit-economics tiles, team cards |
| `TOP = 2.05` | Top of the content area under the title | Slides 2–13 |
| Content width | 12.13 in from x 0.6 (right edge 12.73) | Full-width panes, table, title |
| Prompt + cursor | `$ ` (GRN) + command (MUTED), 16 pt mono, and a 0.14 x 0.27 GRN rectangle named "Cursor" | Slides 1, 14 (prompt only on 15) |
| Tint highlight | `pane(…, { tint: true, line: GRN, lw: 1.25 or 1.5 })` | Raise chip, "With product", tier 2, traction stat 1, GTM step 1, raise pane |
| Window chrome | Three 0.11 in squares (AMB, GRN, DIM) at 0.22 in spacing plus a hairline | Product window |
| Numbered rows | `0N` mono number + bold heading + muted description between hairlines | Problem, product, competition |
| `▲` tick | Mono triangle top-right of a stat (AMB on problem, GRN on traction) | Slides 2, 8 |
| Section names | `Intro`, `Opportunity`, `Business`, `Team & Financials`, `Close` via `addSection` | Whole deck |

## Art assets

All made by `art.py` (numpy + Pillow). Regenerate from the style folder with `python3 art.py` (writes beside the script; `python3 art.py <dir>` writes elsewhere).

| File | What it is | Parameters worth tweaking |
|---|---|---|
| `bg_content.png` | 1920x1080 RGB: `base` + green glow at (1800, -80), radius 520, strength 0.10 + dot grid `dots(24, 14)` | Glow centre/radius/strength; dot `step` and `val` |
| `bg_title.png` | 1920x1080 RGB: green glow at (1700, 1150), r 760, 0.22 + amber glow at (-100, -100), r 520, 0.06 + `dots(24, 16)` + scanlines `scan(4)` (every 4th row) | Glow strengths, scanline value, dot brightness |
| `halo.png` | 200x200 RGBA soft green disc: alpha = `exp(-(d·2)²)·200` | Falloff factor `2.0`, peak alpha `200`, RGB |

`halo.png` sits at x 5.83, y 2.25, 1.1 x 1.1 behind the "You" marker on the competition matrix, with `altText: ""`.

## Slide by slide

1. **Title:** dashed DIM logo box, `● CONFIDENTIAL // INVESTOR BUILD` tag, `$ ./pitch --investor` prompt with cursor, `>` before tagline, green tint raise chip.
2. **Problem:** three numbered rows between hairlines (01/02 GRN, 03 AMB for "today"), right stat pane `problem.stat` with amber `▲` and a 66 pt GRN `[XX%]`.
3. **Solution:** "− TODAY" plain pane (AMB) → 44 pt GRN `→` → "+ WITH [PRODUCT]" tint pane; full-width insight pane with `> Our insight:`.
4. **Product:** 7.4 x 4.55 window pane with traffic-light squares and `product.preview`; three numbered features between hairlines on the right.
5. **Why now:** three touching `G3` panes, 54 pt GRN `01–03`, AMB labels.
6. **Market:** nested TAM (PANE) / SAM (RAISED, DIM border) / SOM (solid GRN) squares from a shared bottom-left corner; value rows at right; `$ Bottom-up:` pane.
7. **Business model:** three tier panes drawn in order 0, 2, 1 so the tinted middle tier's border sits on top; `// UNIT ECONOMICS` and four `G4` tiles.
8. **Traction:** single-series GRN column chart on PANE fill with dashed `dk2` gridlines, hidden value axis; three stat panes with GRN `▲`, first one tinted.
9. **Competition:** pane matrix with dashed DIM quadrant lines; GRN "You" square on `halo.png`; DIM competitor squares; `// WHY WE WIN` numbered list.
10. **Go-to-market:** three `G3` step panes (first tinted) with 40 pt numbers and DIM `──→`; three clear-fill cards with `> ` headings.
11. **Team:** four `G4` cards with dashed photo boxes on BG, DIM `0N`, GRN mono role; `> Advisors & investors:` line.
12. **Financials:** striped table (BG/PANE rows, RAISED header, 0.75 pt `dk2` borders, row height 0.42); `// KEY ASSUMPTIONS` pane with `▸` bullets.
13. **The ask:** tinted raise pane with 64 pt `$[X]M`; doughnut (hole 62, GRN/AMB/lt2/accent4) in a pane; three milestone panes at width 7.23/3.
14. **Vision:** STATEMENT_DARK with `$ echo $VISION` prompt and cursor above the 36 pt title.
15. **Appendix:** STATEMENT_DARK, `$ ls ./appendix` prompt (no cursor), title "Appendix".

## How to iterate

- **Change the palette:** edit `theme.json` `colors` (six hex digits, no `#`). Shapes and text follow automatically; charts and the table border follow via `H`. Then update `base`, `green`, `amber` and the halo's `61, 255, 138` in `art.py` and regenerate the art, or the backgrounds keep the old colours. Keep `roles` in sync for documentation.
- **Swap fonts:** change `headFontFace` (labels, numbers, titles via `+mj-lt`) and `bodyFontFace` in `theme.json`. Add the family under `pitch-deck/fonts/<FamilyNoSpaces>/` so previews render it. No font names are hard-coded in build.js.
- **Regenerate art:** `cd terminal-ledger && python3 art.py`, then rebuild.
- **Add or duplicate a slide:** copy a `{ … }` block; start with `content("// NN · NAME", "Title", "<Section>")`; build with `pane`, `label`, `hair`, `T`; place columns on `G3`/`W3` or `G4`/`W4` from `TOP`; use one `tint` pane as the highlight. Add a matching string to `notes.json` and call `s.addNotes(NOTES[i])`. Renumber later eyebrows.
- **Charts:** pass hex (`H.accent1` etc.) to `chartColors`, `valGridLine`, `catAxisLineColor` and other hex-only options; `applyTheme` throws if a scheme colour lands there.
- **Rebuild and preview:** `node terminal-ledger/build.js`, then `_shared/preview.sh terminal-ledger` (renders `terminal-ledger/preview/slide-*.png` plus a PDF via LibreOffice and `pdftoppm`; optional second argument is DPI, default 80).

## Caveats

- **Images, not shapes:** backgrounds (dot grid, glows, scanlines) and the "You" halo are PNGs; they don't recolour with the theme and can't be edited in PowerPoint.
- **Print:** every slide is near-black (`0A0A0A`) with full-bleed raster backgrounds; heavy ink on paper, and the faint dot grid and glows may vanish or band in print/PDF.
- **Fonts:** Geist and Geist Mono must be installed on the presenting machine or PowerPoint substitutes another face, which changes widths of the tight mono layouts (e.g. the cursor rectangles are placed by hand at x 3.62 and x 2.9 to sit after the prompt text).
- **Glyphs:** `●`, `▲`, `→`, `──→`, `▸` rely on font coverage and may fall back.
- **Transparency:** the green tint relies on fill transparency 92 over the image background; check it in whatever viewer will present the deck.
- **Placeholders:** all chart data is sample data (titles say "replace"); the doughnut is an even 25/25/25/25 split.
- **Unused slots:** `accent6`, `hlink`, `folHlink` have no visible use in the deck.
- **Post-processing:** the build rewrites the .pptx with `applyTheme` (theme colours and name) and `scrubImagePaths` (clears local file paths from image alt text); hand edits to the .pptx, including its theme, are overwritten on rebuild.
