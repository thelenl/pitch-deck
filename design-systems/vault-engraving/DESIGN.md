# Vault Engraving: design system

- **Vibe:** a banknote or share certificate in a bank vault: deep green, gold engraved rules, guilloche rosettes, a holographic foil seal.
- **Output:** `../../pitch-deck-vault-engraving.pptx` (i.e. `pitch-deck/pitch-deck-vault-engraving.pptx`; pass a path as the first argument to override).
- **Build:** `node vault-engraving/build.js` (run from `design-systems/`), or `npm run build:vault-engraving`.
- **Post-processing:** `build.js` writes the deck, then runs `_shared/apply_theme.js` (writes theme.json colours into the theme) and `_shared/scrub_image_paths.js` (blanks local file paths from image alt text).
- **Speaker notes:** read verbatim from `../template/build.js` (regex on `s.addNotes("...")`); the build throws unless it finds exactly 15.

## At a glance

- Full-bleed procedural backgrounds: vault green with a soft radial glow, a double gold frame with tiny rosettes on the corners, and big gold guilloche rosettes.
- Every card is an **engraved frame**: square corners, a gold outer rule plus a fine inner rule inset 0.07 in. Hero cards are cream "certificates" with a faint green rosette watermark.
- Numbered items use **medallions**: a double gold ring with a serif roman numeral (I to IV).
- Serial stamps (`No. 000417`) and `No. 01 · THE PROBLEM` eyebrows give the "numbered security document" feel.
- Fraunces (serif) for titles and big numbers; IBM Plex Sans for everything else; gold, letter-spaced caps labels.

## Palette

Colours come from `theme.json` and are applied as PowerPoint **scheme colours** (`pres.SchemeColor`), so most shapes recolour when the theme changes. Aliases are defined at `build.js` lines 25–26.

| Slot | Hex | Role (theme.json) | build.js alias | Where it's used |
|---|---|---|---|---|
| dk1 | `0E2A22` | vault green (slide background) | `VAULT` (`C.text1`) | Medallion fill, `plate` fill, photo circle fill, dark text on cream cards and gold plates, financials table header text and odd body rows; doughnut data labels (`H.dk1`) |
| lt1 | `F3EBD8` | cream (text on vault; certificate cards) | `CREAM` (`C.background1`) | All master titles, cream card fill, headings in `headDesc`, stat numbers on dark cards, body copy; bar-chart data labels and doughnut legend (`H.lt1`) |
| dk2 | `1B3D33` | raised card | `CARD` (`C.text2`) | Dark card fill, SAM circle fill, even financials rows; also the text colour on cream cards (serials, captions, sources) |
| lt2 | `B9C2B0` | muted text on dark | `MUTED` (`C.background2`) | Taglines/subs on title and statement masters, descriptions, axis labels, `TODAY` label; chart titles and bar-chart category labels (`H.lt2`) |
| accent1 | `C9A24B` | gold | `GOLD` | Card outer rules, cream-card inner rule, medallions, `rule`, `plate` border/text, eyebrows, labels, slide number, raise plate, SOM circle, GTM arrows, matrix axes, financials header fill; bar colour and first doughnut slice (`H.accent1`) |
| accent2 | `7FD6C2` | holographic mint | `MINT` (declared, unused as alias) | Second doughnut slice (`H.accent2`) only |
| accent3 | `E9A6C9` | holographic pink | none | Third doughnut slice (`H.accent3`) only |
| accent4 | `8FA597` | sage | `SAGE` | Title-slide `meta` placeholder, CONTENT footer text, competitor dots; fourth doughnut slice (`H.accent4`) |
| accent5 | `2E5A4B` | hairline / inner frame | `LINE` | Inner rule of dark cards; financials table borders (`H.accent5`) |
| accent6 | `E2C77A` | light gold | none | Not referenced in build.js (mirrored in the art as `GOLD_LT`) |
| hlink | `C9A24B` | (same as gold) | none | No links in the deck |
| folHlink | `8FA597` | (same as sage) | none | No links in the deck |

### Off-theme colours

**build.js hard-codes no hex values.** Every colour is a scheme colour or read from `THEME.colors` (`H.*`, used where pptxgenjs needs hex: chart options and the table border).

The art, however, is baked by `gen_art.py` with its own RGB constants. Changing theme.json does **not** recolour the backgrounds, seal or rosettes; edit these and regenerate:

| Constant (gen_art.py) | RGB | Hex | Matches slot | Used in |
|---|---|---|---|---|
| `GREEN` | (14, 42, 34) | `0E2A22` | dk1 | `rosette-green.png` (watermark on cream cards) |
| `GOLD` | (201, 162, 75) | `C9A24B` | accent1 | All rosettes on backgrounds, frame rules and corner rosettes, seal ring, `rosette-gold.png` |
| `GOLD_LT` | (226, 199, 122) | `E2C77A` | accent6 | Foil gradient stop |
| `MINT` | (127, 214, 194) | `7FD6C2` | accent2 | Foil gradient stops; mint echo rosette on title bg |
| `PINK` | (233, 166, 201) | `E9A6C9` | accent3 | Foil gradient stop |
| `LAV` | (185, 169, 232) | `B9A9E8` | **none** | Foil gradient stop (lavender) |
| `CREAM` | (243, 235, 216) | `F3EBD8` | lt1 | Declared, unused |
| `base_bg` `lo` | (9, 33, 26) | `09211A` | **none** | Background gradient, dark edge |
| `base_bg` `hi` | (22, 56, 45) | `16382D` | **none** | Background gradient, glow centre |
| seal engraving | (40, 70, 70) | `284646` | **none** | Rosette engraved over the foil in `seal.png` (55% alpha) |

`hexrgb()` is defined in gen_art.py but not called; you could use it to read colours from theme.json instead of the constants.

## Typography

| Face | Theme slot | Font folder | How build.js refers to it |
|---|---|---|---|
| Fraunces | heading (`headFontFace`) | `fonts/Fraunces/` (variable TTFs + `static/`) | Title placeholders by default; `fontFace: SERIF` where `SERIF = "+mj-lt"` |
| IBM Plex Sans | body (`bodyFontFace`) | `fonts/IBMPlexSans/` (variable TTFs + `static/`) | Default for body placeholders and text boxes; charts use `"+mn-lt"` |

No accent face. Fonts are referenced by name, not embedded.

| Element | Font | Size pt | Weight / style | Colour |
|---|---|---|---|---|
| Title-slide company name | Fraunces | 50 | regular | CREAM |
| Title-slide tagline | Plex Sans | 20 | regular | MUTED |
| Title-slide meta line | Plex Sans | 13 | regular | SAGE |
| Raise plate text (slide 1) | Plex Sans | 14 | bold | VAULT on GOLD |
| Statement title (14, 15) | Fraunces | 40 | regular | CREAM |
| Statement sub | Plex Sans | 18 | regular | MUTED |
| Content eyebrow | Plex Sans | 11 | bold, charSpacing 3 | GOLD |
| Content title | Fraunces | 28 | regular | CREAM |
| Footer "[Company name] · Confidential" | Plex Sans | 10 | regular | SAGE |
| Slide number | Plex Sans | 10 | regular, right | GOLD |
| Hero stat (slides 2, 13) | Fraunces | 66 | regular | VAULT on cream |
| Market values | Fraunces | 34 | regular | CREAM; SOM row GOLD |
| Traction stat tiles | Fraunces | 34 | regular | VAULT (cream tile) / CREAM |
| Pricing price | Fraunces | 36 (+ 14 suffix in Plex) | regular | VAULT (middle tier) / CREAM |
| Unit-economics values | Fraunces | 30 | regular | CREAM |
| Team name | Fraunces | 20 | regular | CREAM |
| GTM card heading | Fraunces | 17 | regular | GOLD |
| Milestone heading | Fraunces | 15 | not bold (`hOpts`) | CREAM |
| `headDesc` heading (default) | Plex Sans | 18 (20 on slide 5, 16 on slide 9) | bold | CREAM |
| `headDesc` description (default) | Plex Sans | 14 (13 on slide 9, 12 on slide 13) | regular, paraSpaceBefore 6 | MUTED |
| Caps labels (TODAY, WHY WE WIN, tier names...) | Plex Sans | 12 (11 on milestones) | bold, charSpacing 3 | GOLD / VAULT / MUTED |
| Medallion numeral | Fraunces | `round(d × 26)`: 13–20 | regular, centred | GOLD |
| Serial stamp | Plex Sans | 9 | charSpacing 2, right | GOLD or CARD |
| Bullets / body copy | Plex Sans | 16 (slide 3, 13), 14 (slide 12) | regular | CREAM or VAULT/CARD on cream |
| Source line | Plex Sans | 11 | italic | CARD |
| Chart title | Plex Sans | 14 | regular | lt2 |
| Bar data labels / category axis | Plex Sans | 12 / 12 | regular | lt1 / lt2 |
| Doughnut legend / % labels | Plex Sans | 13 / 11 | regular | lt1 / dk1 |
| Financials table | Plex Sans | 14 | header + row labels bold | header VAULT on GOLD; labels CREAM; values MUTED |

## Layouts

Slide size `LAYOUT_WIDE` (13.333 × 7.5 in). Positions are inches (x, y, w, h).

| Master | Background | Placeholders | Fixed objects |
|---|---|---|---|
| `TITLE_VAULT` | `art/bg-title.jpg` | `title` (title) 0.8, 2.2, 6.5 × 1.4, 50 pt, bottom-aligned; `tagline` (body) 0.8, 3.8, 6.3 × 1.0, 20 pt; `meta` (body) 0.8, 6.35, 6.5 × 0.4, 13 pt | none |
| `CONTENT` | `art/bg-content.jpg`; margin [0.5, 0.6, 0.8, 0.6] | `eyebrow` (body) 0.6, 0.5, 9.0 × 0.3, 11 pt; `title` (title) 0.6, 0.85, 11.4 × 1.0, 28 pt | `seal.png` 12.33, 0.45, 0.55 × 0.55; footer text 0.6, 6.88, 6.0 × 0.28; slide number 12.23, 6.88, 0.5 × 0.28 |
| `STATEMENT_VAULT` | `art/bg-statement.jpg` | `title` (title) 0.8, 1.8, 8.8 × 2.3, 40 pt, bottom-aligned; `sub` (body) 0.8, 4.4, 8.8 × 1.4, 18 pt | none |

All placeholders have `margin: 0`; titles are left-aligned.

## Components & signature moves

| Helper / pattern | What it draws | Used on |
|---|---|---|
| `T(slide, text, o)` | `addText` with `isTextBox`, margin 0, top-aligned | Everywhere |
| `card(slide, x, y, w, h, {cream, name, watermark, dash})` | Rectangle filled CARD (or CREAM), gold outer line 0.75 pt (1.25 pt if cream, optional `dashType`); inner rectangle inset 0.07 in, 0.5 pt, LINE (or GOLD at 40% transparency if cream). If `watermark` (defaults to `cream`), adds `rosette-green.png` sized `min(w,h) × 0.95`, offset to the right edge | 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 |
| `medallion(slide, x, y, d, n)` | VAULT oval with 1.25 pt gold ring, inner ring inset 0.05 in at 0.5 pt / 45% transparency, roman numeral from `ROMAN = ["I","II","III","IV"]` | 2, 4, 5, 9, 10 |
| `serial(slide, x, y, w, n, color = GOLD)` | `No. ` + 6-digit zero-padded number, 9 pt, h 0.25 | 1, 2, 7, 8, 13 |
| `headDesc(slide, h, d, o, hs = 18, ds = 14, hOpts)` | Heading + description in one text box, so a wrapped heading pushes the description down | 2, 4, 5, 9, 10, 13 |
| `rule(slide, x, y, w = 0.6)` | Short gold line, 1.5 pt | 2, 7, 13 |
| `plate(slide, x, y, w, h, text, o)` | VAULT rectangle with 0.75 pt gold border, 13 pt bold gold caps label | 6 (TAM label on the rosette) |
| `content(eyebrow, title, section)` | New `CONTENT` slide with eyebrow and title filled | 2–13 |
| `notes(s)` | Adds the next template speaker note (counter `note`) | All 15 |
| Gold raise plate | GOLD rectangle with an inset VAULT rule (0.06 in, 0.5 pt, 30% transparency) | 1 |
| Rosette-as-diagram | `rosette-gold.png` as TAM ring / portrait frame | 6, 11 |
| Seal as "you" marker | `seal.png` 0.6 in on the competition matrix | 9 |

**Grid constants:** `COL3 = [0.6, 4.74, 8.88]`, `W3 = 3.85` (3 columns, 0.29 in gutter); `COL4 = [0.6, 3.705, 6.81, 9.915]`, `W4 = 2.815` (4 columns, 0.29 in gutter). Content spans x 0.6 to 12.73 (12.13 in wide). Eyebrows follow `No. NN  ·  LABEL`.

## Art assets

All made by `gen_art.py` (needs numpy and Pillow). Regenerate from the style folder with `python3 gen_art.py`; output always goes to `art/` beside the script, then it prints each file's size. Backgrounds render at `DPI = 180` (about 2400 × 1350 px).

| File | What it is | Parameters worth tweaking |
|---|---|---|
| `bg-title.jpg` | `base_bg(1)` + gold rosette (alpha 0.42) centred at (10.2, 3.75) in + mint echo rosette (900 px, rotated 9°, alpha 0.22) + windowed foil thread at x 7.6 in, 0.16 in wide + frame | Rosette centre/alpha, thread x/width, `windowed` |
| `bg-content.jpg` | `base_bg(2)` + faint gold rosette (alpha 0.07) at (12.6, 7.0) in + frame | Watermark alpha (keep low for legibility) |
| `bg-statement.jpg` | `base_bg(3)` + gold rosette (alpha 0.2) at (11.6, 3.75) in + solid foil thread at x 10.1 in, 0.14 in wide + frame | Rosette position, thread x |
| `seal.png` | 360 px holographic foil disc (`foil`, seed 1.3) with engraved rosette and gold ring, transparent outside | `size`, foil `seed`, engraving colour/alpha |
| `rosette-gold.png` | 640 px gold guilloche rosette, alpha 0.8, density 0.85 | `lw`, `density`, alpha |
| `rosette-green.png` | 480 px green rosette, alpha 0.18, density 0.7 (cream-card watermark) | Alpha (watermark strength) |

Shared knobs: `rosette_mask(size, r_outer, ss, lw, density)` and its `bands` list (radius, amplitude, frequency, curve count); `foil()` gradient `stops` and sheen; `frame()` insets `o = 0.18` / `i = 0.24` in and line alphas 150 / 80; `thread()` segment 0.55 in, gap 0.3 in; `save_jpg` quality 86.

## Slide by slide

1. **Title** (`TITLE_VAULT`): dashed gold logo box, serial `No. 000001`, company name, tagline, gold engraved raise plate, sage meta line.
2. **Problem**: three medallion rows (I–III) with `headDesc`; cream stat certificate on the right with serial `No. 000417`, 66 pt serif `[XX%]`, gold rule, italic source.
3. **Solution**: dark "Today" card, gold right arrow, cream "With [Product]" certificate; full-width insight card with a gold "Our insight:" lead-in.
4. **Product**: dashed dark card as screenshot placeholder; three medallion feature rows on the right.
5. **Why now**: three `COL3` cards, each with a 0.7 in medallion, gold caps label and 20/14 pt `headDesc`.
6. **Market**: `rosette-gold.png` as TAM with a `plate` label, CARD SAM circle, gold SOM circle with inner rule; serif values (SOM in gold); bottom-up math card.
7. **Business model**: three pricing cards, middle tier cream; "UNIT ECONOMICS" label over four `COL4` tiles with serials and short gold rules.
8. **Traction**: gold bar chart inside a dark card frame; three stat tiles, first one cream, with serials `No. 000101`–`000103`.
9. **Competition**: framed 2×2 matrix with translucent gold axes, seal for "[Your company]", sage competitor dots; "WHY WE WIN" medallion list.
10. **Go-to-market**: three medallion steps joined by dotted gold arrows; three `COL3` cards with serif gold headings.
11. **Team**: four `COL4` cards with banknote-portrait medallions (gold rosette behind a VAULT photo circle); advisors line.
12. **Financials**: table with gold header row and alternating VAULT/CARD rows, accent5 borders; key-assumptions card.
13. **The ask**: cream raise certificate (66 pt `$[X]M`); doughnut in gold/mint/pink/sage; three milestone cards with serif headings.
14. **Vision** (`STATEMENT_VAULT`): 40 pt statement and contact line.
15. **Appendix** (`STATEMENT_VAULT`): "Appendix" and the list of backup material.

## How to iterate

- **Change the palette:** edit `theme.json` `colors` (six hex digits, no `#`); shapes, text, charts and the table follow. Then update the RGB constants in `gen_art.py` (table above, including the off-theme `LAV`, `lo`, `hi` and seal engraving colour) and regenerate the art, or the backgrounds and rosettes stay green and gold. Keep `roles` in theme.json in sync.
- **Swap fonts:** set `headFontFace` / `bodyFontFace` in `theme.json`; everything uses `+mj-lt` / `+mn-lt` or the theme defaults, so nothing else needs editing. Add the family to `pitch-deck/fonts/<FamilyNoSpaces>/` and install it wherever the deck is opened or previewed.
- **Regenerate art:** `cd vault-engraving && python3 gen_art.py`, then rebuild. Background composition lives in the `__main__` block.
- **Add or duplicate a slide:** call `content("No. NN  ·  LABEL", "Title", "Section")`, lay out on `COL3`/`W3` or `COL4`/`W4`, use `card` (pass `cream: true` for the one hero element), `medallion` for numbered items, `headDesc` for heading + description, `serial`/`rule` for detail. Use the `STATEMENT_VAULT` master for big statements. Every slide calls `notes(s)`; a new slide needs a matching `s.addNotes(...)` in `template/build.js` and the `NOTES.length !== 15` check updated, or it will take the next slide's note.
- **Rebuild and preview:** `npm run build:vault-engraving`, then `_shared/preview.sh vault-engraving` renders PNGs into `vault-engraving/preview/`.

## Caveats

- **Baked art:** backgrounds, the seal and all rosettes (TAM ring, portrait frames, watermarks) are images. They are not editable in PowerPoint and ignore theme changes.
- **Dark backgrounds:** every slide is a full-bleed dark JPG, which is heavy on ink and prints poorly; cream text is light-on-dark. There is no light/print variant.
- **Fonts are not embedded:** without Fraunces and IBM Plex Sans installed, PowerPoint or LibreOffice substitutes faces, and sizes tuned for these fonts (for example the 66 pt hero stats in 3.8–3.9 in boxes) may wrap or overflow.
- **Scheme colours depend on `applyTheme`:** pptxgenjs writes Office's default palette; if the post-build `applyTheme` step fails or is skipped, scheme colours show as Office blue/orange. Hex-only options (chart colours, table border) must use `H.*` values, never `C.*`.
- **Alt text:** decorative images use `altText: ""`; `scrubImagePaths` removes the local path pptxgenjs would otherwise insert.
- **Medallions** cover numerals I to IV only (`ROMAN` array).
- **Charts** are native and editable, but sample data (`[10, 14, 19, 26, 34, 45]`, `[25, 25, 25, 25]`) must be replaced.
- The `MINT` alias, `accent6`, `hlink` and `folHlink` are unused in build.js.
