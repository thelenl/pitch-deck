# Template: design system

- **Vibe:** the original, plain investor deck. Charcoal and white, one brick-red accent, rounded cards and numbered dots. Every element is a native, editable PowerPoint shape, chart or table.
- **Output:** `../../pitch-deck-template.pptx` (that is, `pitch-deck/pitch-deck-template.pptx`). An optional first argument overrides the path: `node template/build.js out.pptx`.
- **Build:** `node template/build.js` (run from `design-systems/`), or `npm run build:template`.
- **Pipeline:** pptxgenjs writes the file, then `_shared/apply_theme.js` writes the 12 theme colours from `theme.json` into `ppt/theme/theme1.xml`, then `_shared/scrub_image_paths.js` blanks local file paths out of image alt text.

## At a glance

- **Theme-driven colour.** Shapes and text use `pres.SchemeColor` slots (`C.text1`, `C.accent1` and so on), so the deck recolours from PowerPoint's Design > Variants as well as from `theme.json`. No hex is hard-coded in `build.js`.
- **Dark bookends, light middle.** Slides 1, 14 and 15 sit on full-bleed `dk1`. Slides 2 to 13 are white `CONTENT` slides with a red, letter-spaced eyebrow above a 28 pt bold title.
- **Cards plus one hero.** Most cards are pale grey (`lt2`) rounded rectangles. One card per slide is often inverted to charcoal (`dk1`) with white text, to carry the key stat or the "after" state.
- **Numbered red dots** (`dot()`) mark lists, steps and the "you" point on the 2x2.
- **A strict grid.** The content width is 12.13 in, from x 0.6 to 12.73, split by `COL3`/`W3` or `COL4`/`W4` with 0.29 in gutters.

## Palette

`theme.json` has no per-slot role field. The roles below are the pptxgenjs `SchemeColor` names that `build.js` uses.

| Slot | Hex | Role (as used) | Where it's used |
|---|---|---|---|
| dk1 | `16181D` | `C.text1`, near-black | Backgrounds of `TITLE_DARK` and `STATEMENT_DARK`; content titles; headings in body; hero cards (Problem stat, Solution "with", middle pricing tier, first traction tile, raise card); table header fill; "why we win" dots; logo box fill; doughnut segment 2 (`H.dk1`) |
| lt1 | `FFFFFF` | `C.background1`, white | `CONTENT` background; all text on dark; dot labels; unit-economics tile fill; even rows of the financials table (r = 0, 2, 4); doughnut % labels (`H.lt1`) |
| dk2 | `4A505C` | `C.text2`, slate | Description and body copy; the "TODAY" and "UNIT ECONOMICS" labels; the TAM label; axis captions; "[Photo]" label; chart titles, axis labels, data labels and legend (`H.dk2`) |
| lt2 | `F2F3F5` | `C.background2`, pale grey | Default card fill; screenshot placeholder; TAM circle; 2x2 matrix background; odd rows of the financials table |
| accent1 | `C2391A` | Brand accent, brick red | Eyebrows; card labels; numbered dots; Solution arrow; raise chip; SOM circle and SOM value; "Our insight:" lead-in; team roles; bar-chart series (`H.accent1`); doughnut segment 1 |
| accent2 | `1F8A70` | Green | Not referenced in `build.js`. It is available for user-added charts and shapes. |
| accent3 | `E3A42B` | Amber | Not referenced in `build.js`. |
| accent4 | `8A93A3` | Grey, muted text | Title-slide meta line; footer and slide number; dashed placeholder outlines (logo, screenshot); "[Logo]" text; "Source:" line; competitor dots; doughnut segment 3 |
| accent5 | `D5D9E0` | Light grey, hairlines | Tagline and sub on dark slides; secondary text on dark cards; TAM outline; SAM circle; 2x2 axes; GTM connector arrows; unit-tile borders; table border (`H.accent5`); photo circles; doughnut segment 4 |
| accent6 | `5B3FD1` | Violet | Not referenced in `build.js`. |
| hlink | `C2391A` | Hyperlink | No links in the deck. It matches accent1. |
| folHlink | `8A93A3` | Followed link | No links in the deck. It matches accent4. |

### Off-theme colours

There are none. `build.js` contains no literal hex. Every colour is either `C.<slot>` (a scheme reference) or `H.<slot>` (the hex read from `theme.json`, required for chart and table-border options that accept only hex). A palette change therefore needs only an edit to `theme.json`.

## Typography

| Role | Font | Source |
|---|---|---|
| Heading (theme major, `+mj-lt`) | **Arial** (`theme.json` `headFontFace`) | System font. Not in `pitch-deck/fonts/`. |
| Body (theme minor, `+mn-lt`) | **Calibri** (`theme.json` `bodyFontFace`) | System font. Not in `pitch-deck/fonts/`. |
| Accent face | None | `build.js` never sets `fontFace`. Title placeholders take the major font. Everything else, including charts (`"+mn-lt"`), takes the minor font. |

### Type scale (as used)

| Element | Font | pt | Weight / style | Colour |
|---|---|---|---|---|
| Cover title (`TITLE_DARK` title) | Arial | 54 | bold, bottom-aligned | lt1 |
| Cover tagline | Calibri | 24 | regular | accent5 |
| Cover meta line | Calibri | 14 | regular | accent4 |
| Statement title (`STATEMENT_DARK`) | Arial | 40 | bold, bottom-aligned | lt1 |
| Statement sub | Calibri | 20 | regular | accent5 |
| Content title | Arial | 28 | bold | dk1 |
| Eyebrow (master) | Calibri | 12 | bold, charSpacing 2, CAPS by convention | accent1 |
| In-slide card label ("TODAY", "TECHNOLOGY", "WHY WE WIN"…) | Calibri | 12 (11 on milestones) | bold, charSpacing 2 | accent1, or dk2 / accent5 by context |
| Hero stat (Problem %, Ask $) | Calibri | 60 | bold | lt1 |
| Big number (market, pricing, traction) | Calibri | 32 | bold | dk1, lt1 on hero, accent1 for SOM |
| Unit-economics value | Calibri | 28 | bold | dk1 |
| Item heading | Calibri | 18 (20 on Why now; 16 on Market labels, Why-we-win, Milestones) | bold | dk1 |
| Bullets (Solution) | Calibri | 16 | regular, paraSpaceAfter 10 | dk1 / lt1 |
| Description / body | Calibri | 14 | regular | dk2 |
| Small body (unit labels, bios, competitors, why-we-win detail) | Calibri | 13 | regular | dk2 |
| Pricing suffix "/ [user · month]" | Calibri | 14 | regular | as price |
| Dot numeral | Calibri | 14 default (12, 13, 18 by call) | bold, centred | lt1 |
| Source line | Calibri | 11 | regular | accent4 |
| Footer and slide number | Calibri | 10 | regular | accent4 |
| Table cells | Calibri | 14 | header bold lt1 on dk1; row label bold dk1; values dk2, centred | |
| Chart title | Calibri (`+mn-lt`) | 14 | regular | dk2 |
| Chart data labels | Calibri | 12 bar / 11 doughnut | regular | dk2 / lt1 |
| Chart axis / legend | Calibri | 12 axis / 13 legend | regular | dk2 |

## Layouts

Slide size: `LAYOUT_WIDE`, 13.333 x 7.5 in. Positions below are x, y, w, h in inches.

**`TITLE_DARK`**: background `C.text1` (dk1).
- `title` (title): 0.8, 2.4, 11.7, 1.3; 54 pt bold, lt1, left, valign bottom.
- `tagline` (body): 0.8, 3.85, 11.0, 0.9; 24 pt, accent5.
- `meta` (body): 0.8, 6.3, 11.0, 0.45; 14 pt, accent4.
- Fixed objects: none.

**`CONTENT`**: background `C.background1` (white); master margin `[0.5, 0.6, 0.8, 0.6]`.
- `eyebrow` (body): 0.6, 0.45, 9.0, 0.35; 12 pt bold, accent1, charSpacing 2.
- `title` (title): 0.6, 0.8, 12.13, 1.0; 28 pt bold, dk1, valign top.
- Fixed objects: a footer text "[Company name] · Confidential" at 0.6, 6.95, 6.0, 0.3 (10 pt, accent4), and a slide number at 12.23, 6.95, 0.5, 0.3 (10 pt, accent4, right-aligned).

**`STATEMENT_DARK`**: background `C.text1` (dk1).
- `title` (title): 0.8, 2.0, 11.7, 2.0; 40 pt bold, lt1, valign bottom.
- `sub` (body): 0.8, 4.3, 11.7, 1.4; 20 pt, accent5.
- Fixed objects: none.

Body content on `CONTENT` slides starts at y ≈ 1.95–2.0 and ends by y ≈ 6.65, which leaves the footer band clear.

## Components & signature moves

| Name | What it draws | Used on |
|---|---|---|
| `T(slide, text, o)` | A text box with `margin: 0`, `valign: "top"` defaults | Every slide |
| `box(slide, o)` | A `ROUNDED_RECTANGLE` with `rectRadius: 0.12` and no line | All cards. Overrides: 0.27 radius for the raise chip, 0.08 for the matrix background |
| `dot(slide, x, y, d, label, fill = accent1, color = lt1, size = 14)` | A filled `OVAL`, with an optional centred bold label | Problem, Product, Why now, Competition, GTM, Team (photo circles) |
| `content(eyebrow, title, section)` | Adds a `CONTENT` slide, fills both placeholders and returns it | Slides 2–13 |
| `COL3 = [0.6, 4.74, 8.88]`, `W3 = 3.85` | Three equal columns with 0.29 in gutters | Why now, pricing tiers, GTM steps and cards |
| `COL4 = [0.6, 3.705, 6.81, 9.915]`, `W4 = 2.815` | Four equal columns with 0.29 in gutters | Unit-economics tiles, team cards |
| `hdr(t)` (local to slide 12) | Table header cell: bold lt1 on dk1 fill | Financials table |
| `mw = (7.13 - 0.5) / 3` (local to slide 13) | Three milestone cards across the right 7.13 in, with 0.25 gaps | The ask |

Recurring patterns:
- **Hero card inversion:** `fill: C.text1`, a 12 pt accent5 label, lt1 numbers and accent5 secondary text. On slides 7 and 8 it is driven by `dark = i === 1` / `i === 0`.
- **Dashed placeholder frame:** `line: { color: C.accent4, width: 1, dashType: "dash" }`, with centred hint text. Used for the logo (slide 1) and the screenshot (slide 4).
- **Numbered list row:** a dot at the left, a bold heading at y+0.02 and a description at about y+0.45, on a fixed row pitch (1.5 on Problem, 1.6 on Product, 1.2 on Why-we-win).
- **Inline lead-in:** a text-run array with a bold first run ("Our insight: ", "Bottom-up: ", "Advisors & investors: ").
- **`objectName`** is set on every card and placeholder (for example "Stat card" and "Team card 1"), so the Selection Pane is readable.
- **Sections:** Intro (1), Opportunity (2–6), Business (7–10), Team & Financials (11–13), Close (14–15).

## Slide by slide

1. **Title**: `TITLE_DARK`; a dashed logo box at the top left, the company name at 54 pt, the tagline, and a red pill "Raising $[X]M" chip (4.6 x 0.55) above the meta line.
2. **Problem**: three numbered rows on the left (0.55 in dots); a dk1 stat card on the right with a 60 pt "[XX%]" and a source line.
3. **Solution**: a grey "TODAY" card, a red `RIGHT_ARROW`, a dark "WITH [PRODUCT]" card, and a full-width "Our insight:" strip.
4. **Product**: a large dashed screenshot placeholder (7.4 x 4.7) beside three numbered features.
5. **Why now**: three `COL3` grey cards, each with a dot, a red label, a 20 pt heading and a body.
6. **Market**: nested TAM/SAM/SOM circles (lt2 with an accent5 outline, then accent5, then accent1), three 32 pt values with the SOM in red, and a "Bottom-up:" strip.
7. **Business model**: three `COL3` pricing tiers with the middle one dark, then four `COL4` white unit-economics tiles with accent5 borders.
8. **Traction**: a native column chart in accent1 (sample values 10–45, no value axis, no gridlines) and three stat tiles with the first one dark.
9. **Competition**: a 2x2 on lt2 with accent5 axes, a red "you" dot at the top right, grey competitor dots, and a "WHY WE WIN" list with dk1 numbered dots.
10. **Go-to-market**: three red step dots joined by accent5 arrow lines, then three grey `COL3` cards.
11. **Team**: four `COL4` cards, each with a 1.3 in accent5 photo circle, name, red role and bio, plus an advisors line.
12. **Financials**: a native 6-column table (header row plus 6 rows; header dk1, zebra lt1/lt2, accent5 0.75 pt border) and a "KEY ASSUMPTIONS" card.
13. **The ask**: a dark raise card with a 60 pt amount, a doughnut chart (accent1, dk1, accent4 and accent5; hole 60) with a right legend, and three milestone cards.
14. **Vision / close**: `STATEMENT_DARK` with a 40 pt vision line and contact details.
15. **Appendix**: `STATEMENT_DARK`, "Appendix" with a list of backup topics.

## How to iterate

- **Change the palette:** edit the 12 slots in `theme.json`. There are no off-theme hexes to chase. Charts and the table border read `H.*`, so they follow on rebuild. Keep the roles: dk1 must stay dark (it is the hero and dark-slide fill), and lt1 must contrast with it. To bring green, amber or violet into the deck, reference `C.accent2`, `C.accent3` or `C.accent6`. In chart options, use `H.accent2` and so on, because `applyTheme` aborts if a scheme colour reaches a hex-only option.
- **Swap fonts:** change `headFontFace` and `bodyFontFace` in `theme.json`. Nothing in `build.js` names a font. If you use a non-system face, put it in `pitch-deck/fonts/<FamilyNoSpaces>/` like the other styles, and install it wherever the deck is viewed.
- **Regenerate art:** not applicable. This style has no art files or generator.
- **Add or duplicate a slide:** call `content("NN · LABEL", "Title", "<Section>")`, then lay the body out on `COL3`/`W3` or `COL4`/`W4` between y 1.95 and 6.65. Use `box()` for cards (lt2, or dk1 for one hero), `dot()` for numbered items, and `T()` for text, with the type scale above. For a dark divider, use `pres.addSlide({ masterName: "STATEMENT_DARK", sectionTitle })` and the `title`/`sub` placeholders. Add one `s.addNotes("...")` per slide (see Caveats).
- **Rebuild and preview:** `npm run build:template`, then `_shared/preview.sh template [dpi]`. The preview script builds into `template/preview/template.pptx` and renders `template.pdf` plus `slide-*.png` (80 dpi by default). It needs node, LibreOffice (`soffice`, or override with `SOFFICE`) and `pdftoppm`.

## Caveats

- **Notes are shared.** `ember-grid/build.js` and `vault-engraving/build.js` regex-parse this file's `s.addNotes("...")` calls for their own speaker notes. Keep each note a single double-quoted string literal, one per slide, in slide order. ember-grid throws if it does not find exactly 15. Editing a note here changes those decks on their next build.
- **Hex is baked into charts and the table border.** The bar series, doughnut slices, chart text and table border are written as literal hex from `theme.json` at build time. Switching the theme in PowerPoint recolours shapes and text but not those parts, so rebuild instead.
- **Everything is editable.** There are no images: charts are native (right-click > Edit Data), and the 2x2, circles and arrows are shapes. The chart data is sample or placeholder data (bar 10–45, doughnut 25/25/25/25).
- **Dark slides in print.** Slides 1, 14 and 15 are full-bleed dk1 (`16181D`), and so are several hero cards. They use a lot of ink and lose contrast on greyscale printers.
- **Font fallback.** Arial and Calibri are not bundled. On machines without Calibri (for example, a Linux preview), LibreOffice substitutes a metric-compatible or default font, so line breaks in `preview/` PNGs can differ from PowerPoint. `preview.sh` points fontconfig at `_shared/fonts.conf`.
- **Footer text is in the master.** "[Company name] · Confidential" is a fixed object on `CONTENT` (line 35). Edit it once in Slide Master view or in `build.js`, not per slide. The cover and dark statement slides have no footer or slide number.
- **PowerPoint features** are basic: sections, `charSpacing`, dashed lines, a doughnut chart and line-end arrows. No transparency, gradients or effects are used, so the deck opens the same in older PowerPoint, Keynote and Google Slides.
