# Daybreak: design system

- **Vibe:** light, airy, future-forward ("Innovation + value creation", per the `build.js` header). Pale aurora washes, a rising violet-to-mint value curve, faint constellations, and white cards with a violet glow shadow.
- **Output:** `../../pitch-deck-daybreak.pptx` (that is, `pitch-deck/pitch-deck-daybreak.pptx`). An optional first argument overrides the path: `node daybreak/build.js out.pptx`.
- **Build:** `node daybreak/build.js` (run from `design-systems/`), or `npm run build:daybreak`.
- **Pipeline:** pptxgenjs writes the file, then `_shared/apply_theme.js` writes the 12 theme colours from `theme.json` (theme name "Daybreak") into `ppt/theme/theme1.xml`, then `_shared/scrub_image_paths.js` blanks local file paths out of image alt text. Speaker notes are written inline in `daybreak/build.js`.

## At a glance

- **Painted light backgrounds.** All three masters use full-bleed procedural JPGs from `art.py`: aurora blobs (lilac, sky, mint, peach) on near-white, plus constellations and, on title and statement slides, a glowing value curve that runs violet to sky to mint.
- **Two-voice titles.** Titles are Sora in regular weight, with one phrase in each set in *Instrument Serif italic* in violet `accent1` (`titleRuns()`).
- **Floating white cards.** `card()` draws a white rounded rectangle with a hairline `accent5` border and a soft violet outer shadow. One "hero" card per slide is often swapped for an aurora-gradient PNG (`aurora()`).
- **Violet ring numerals.** `num()` draws white circles with a violet outline and a Sora numeral. It marks lists, steps and the why-now cards. A small gradient orb sits before each eyebrow.
- **Strict grid.** The content width is 12.13 in, from x 0.6 to 12.73, split by `COL3`/`W3` or `COL4`/`W4` with 0.29 in gutters.

## Palette

`theme.json` has no per-slot role field. The roles below are the pptxgenjs `SchemeColor` names (`C.*`) or the raw hex (`H.*`) that `build.js` uses.

| Slot | Hex | Role (as used) | Where it's used |
|---|---|---|---|
| dk1 | `0E1430` | `C.text1`, deep navy ink | All titles; row and card headings; stat values; "With product" bullets; insight text; SAM label; bottom-up line; prices; financials row labels; assumptions bullets; raise amount and terms; milestone heads; doughnut legend (`H.dk1`) |
| lt1 | `FFFFFF` | `C.background1`, white | `card()` fill; `num()` circle fill; Solution arrow circle; logo box (40% transparency); raise-chip text; SOM label; outline of the "you" dot; financials rows r = 0, 2, 4 |
| dk2 | `5A6380` | `C.text2`, slate | Tagline, meta and sub placeholders; footer and slide number; descriptions; "TODAY" label and bullets; "[Logo]", "[Photo]" and screenshot captions; Source line; TAM label; axis captions; competitor names; advisor names; table values; chart title, data labels and category labels (`H.dk2`) |
| lt2 | `F3F2FF` | `C.background2`, lavender mist | `tint()` fill; screenshot placeholder; TAM circle; team photo circles; financials header fill |
| accent1 | `5B4BFF` | Brand violet | Eyebrows; serif-italic title phrases; `num()` ring and numeral; card labels; Solution arrow; raise chip; SOM circle and SOM value; "Bottom-up:"; "Our insight" and "Advisors & investors" lead-ins; team roles; table header text; the "you" dot; `shadow()` colour (`H.accent1`); bar series; doughnut segment 1 |
| accent2 | `3BA7FF` | Sky blue | Doughnut segment 2 only (`H.accent2`) |
| accent3 | `2FCFA4` | Mint | Doughnut segment 3 only (`H.accent3`) |
| accent4 | `08876A` | Deep green, positive | Value of the "+[X]%" month-over-month traction stat |
| accent5 | `E3E7F2` | Hairline grey-blue | `card()` border; Solution arrow-circle border; screenshot-frame browser dots; 2x2 axes; table border (`H.accent5`) |
| accent6 | `C9B8FF` | Lilac | Dashed outlines (logo, screenshot); TAM outline; dashed GTM connector arrows; photo-circle outlines; doughnut segment 4 |
| hlink | `5B4BFF` | Hyperlink | Not referenced in `build.js` |
| folHlink | `5A6380` | Followed hyperlink | Not referenced in `build.js` |

### Off-theme colours

These hexes are hard-coded and do **not** change when `theme.json` changes.

| Hex | File | Where it's used |
|---|---|---|
| `DCD5FF` | `build.js` | SAM circle fill (slide 6) |
| `C3C8D6` | `build.js` | Competitor dots on the 2x2 (slide 9) |
| `FAFBFF` | `build.js` | Financials table stripe, rows r = 1, 3, 5 (slide 12) |
| `F8FAFF` | `art.py` (`BG`) | Base colour of `bg_title.jpg` and `bg_statement.jpg` |
| `FBFCFF` | `art.py` | Base colour of `bg_content.jpg` |
| `C9B8FF` | `art.py` (`LILAC`) | Aurora blob; duplicates `accent6` |
| `9FD3FF` | `art.py` (`SKY`) | Aurora blob |
| `A6F0DC` | `art.py` (`MINT`) | Aurora blob |
| `FFD2BD` | `art.py` (`PEACH`) | Aurora blob |
| `5B4BFF` | `art.py` (`VIOLET`, and RGB `91,75,255` in `constellation()`) | Value-curve start; constellation dots and links; glow and orb; duplicates `accent1` |
| `3BA7FF` | `art.py` (`SKYD`) | Value-curve middle stop (t = 0.55) and glow base; glow and orb; duplicates `accent2` |
| `2FCFA4` | `art.py` (`MINTD`) | Value-curve end; duplicates `accent3` |
| `E6E0FF` | `art.py` | Centre blob of `bg_statement.jpg` |
| `EEEAFF` | `art.py` | Base colour of every `card_*.png` |

## Typography

| Face | Role | How it's set | Font folder |
|---|---|---|---|
| Sora | Headings (`headFontFace`) | Title placeholders, and `fontFace: HEAD` (`"+mj-lt"`) | `fonts/Sora/` |
| Inter | Body (`bodyFontFace`) | Default for body placeholders and `T()`; charts use `"+mn-lt"` | `fonts/Inter/` |
| Instrument Serif (italic) | Accent, one phrase per title, plus two lead-ins | `fontFace: SERIF` (`"Instrument Serif"`), named directly, not a theme font | `fonts/InstrumentSerif/` |

All text is regular weight unless the table says otherwise. Sora titles are explicitly `bold: false`.

| Element | Font | Size pt | Weight / style | Colour |
|---|---|---|---|---|
| Cover title | Sora | 56 | Regular | `text1` |
| Cover tagline | Inter | 20 | Regular | `text2` |
| Cover meta line | Inter | 13 | Regular | `text2` |
| Raise chip | Inter | 14 | Bold | `background1` on `accent1` |
| Eyebrow | Inter | 12 | Bold, charSpacing 3 | `accent1` |
| Content title, plain runs | Sora | 26 (placeholder size) | Regular | `text1` |
| Content title, emphasised phrase | Instrument Serif | 31 | Italic | `accent1` |
| Statement title (slide 14) | Sora 40 + Instrument Serif 48 | 40 / 48 | Regular / italic | `text1` / `accent1` |
| "Appendix" | Instrument Serif | 56 | Italic | `accent1` |
| Statement sub | Inter | 20 | Regular | `text2` |
| Card labels ("TODAY", tier names, "WHY WE WIN" and so on) | Inter | 12 (11 on milestones) | Bold, charSpacing 3 | `accent1` (`text2` for "TODAY") |
| Hero stat (Problem %, raise $) | Sora | 64 / 60 | Regular | `text1` |
| Stat values (market, prices, traction) | Sora | 30 | Regular | `text1`; SOM `accent1`; MoM `accent4` |
| Unit-economics values | Sora | 28 | Regular | `text1` |
| Card headings | Sora | 19 why-now, 18 team names, 17 GTM, 15 milestones and TAM/SAM/SOM | Regular | `text1` |
| Row headings | Inter | 17 problem and product, 16 unfair advantage, 15 market, 14 GTM cards | Bold | `text1` |
| Bulleted lists | Inter | 16 (paraSpaceAfter 10) | Regular | `text2` before, `text1` after |
| Descriptions and body | Inter | 14 (13 on competition, team, unit-economics labels) | Regular | `text2` |
| Serif lead-ins | Instrument Serif | 22 "Our insight", 18 "Advisors & investors" | Italic | `accent1` |
| `num()` numerals | Sora | 10–16 (default 13) | Regular | `accent1` |
| Financials table | Inter | 14 | Header and labels bold | Header `accent1`, labels `text1`, values `text2` |
| Source line | Inter | 11 | Regular | `text2` |
| Footer and slide number | Inter | 10 | Regular | `text2` |
| Chart title / data and axis labels / legend | Inter (`+mn-lt`) | 13 / 12 / 13 | Regular | `dk2` / `dk2` / `dk1` |

## Layouts

All slides use `LAYOUT_WIDE` (13.33 x 7.5 in).

| Master | Background | Placeholders (x, y, w, h in inches) | Fixed objects |
|---|---|---|---|
| `TITLE_LIGHT` | `art/bg_title.jpg` | `title` 0.8, 2.2, 7.4, 1.4, 56 pt, bottom-aligned; `tagline` 0.8, 3.8, 6.4, 1.0, 20 pt; `meta` 0.8, 6.3, 7.0, 0.45, 13 pt | None |
| `CONTENT` | `art/bg_content.jpg`; margin [0.5, 0.6, 0.8, 0.6] | `eyebrow` 0.88, 0.44, 8.5, 0.3, 12 pt bold `accent1`; `title` 0.6, 0.82, 12.13, 1.0, 26 pt, top-aligned | `orb.png` at 0.6, 0.5, 0.16 x 0.16; footer "[Company name] · Confidential" at 0.6, 6.95, 6.0 x 0.3, 10 pt; slide number at 12.23, 6.95, 0.5 x 0.3, right-aligned |
| `STATEMENT_LIGHT` | `art/bg_statement.jpg` | `title` 0.8, 1.5, 11.7, 2.3, 40 pt, bottom-aligned; `sub` 0.8, 4.05, 11.7, 1.2, 20 pt | None |

Sections: Intro (1), Opportunity (2–6), Business (7–10), Team & Financials (11–13), Close (14–15).

## Components & signature moves

| Helper / pattern | What it draws | Used on |
|---|---|---|
| `T(slide, text, o)` | Text box with `margin: 0` and `valign: "top"` | Every free text element |
| `shadow()` | Outer shadow: `H.accent1`, opacity 0.1, blur 18, offset 4, angle 90 | `card()`, raise chip, Solution arrow circle |
| `card(slide, x, y, w, h, name)` | `ROUNDED_RECTANGLE`, rectRadius 0.16, `background1` fill, `accent5` 0.75 pt line, `shadow()` | Slides 3, 4, 5, 7, 8, 9, 10, 11, 13 |
| `tint(...)` | Same shape, `background2` fill, no line | Insight bar (3), bottom-up math (6), key assumptions (12) |
| `aurora(slide, file, x, y, w, h, name)` | Places an `art/card_*.png` gradient card | Problem stat (2), "With product" (3), middle tier (7), MRR tile (8), raise card (13) |
| `num(slide, x, y, d, label, size = 13)` | `background1` oval with `accent1` 1.25 pt ring and a Sora numeral | 2, 4, 5, 9, 10 |
| `titleRuns(parts, size)` | `[text, em]` pairs to runs; `em` runs become Instrument Serif italic `accent1` at `size` | All content titles, 14, 15 |
| `content(eyebrow, parts, section)` | Adds a `CONTENT` slide, fills eyebrow and title (`titleRuns(parts, 31)`) | Slides 2–13 |
| `COL3 = [0.6, 4.74, 8.88]`, `W3 = 3.85` | Three-column grid, 0.29 in gutter | 5, 7, 10 |
| `COL4 = [0.6, 3.705, 6.81, 9.915]`, `W4 = 2.815` | Four-column grid, 0.29 in gutter | 7 (unit economics), 11 |
| Eyebrow numbering | "01 — THE PROBLEM" ... "12 — THE ASK" | Slides 2–13 |
| Pill chip | Rounded rect, rectRadius 0.27, `accent1` fill and shadow | Raise chip (1) |
| Dashed placeholder | `accent6` 1 pt dash outline | Logo (1), screenshot (4) |
| Glow halo | `art/glow.png` under an `accent1` dot | SOM (6), "you" marker (9) |
| Browser chrome | Three 0.13 in `accent5` dots at y 2.15 | Screenshot frame (4) |

## Art assets

All made by `daybreak/art.py` (needs numpy and Pillow). Regenerate with `python3 art.py` from `daybreak/`; it always writes into `daybreak/art/` and prints "art ok".

| File | What it is | Size | Parameters worth tweaking |
|---|---|---|---|
| `bg_title.jpg` | Aurora on the right, constellation (46 points, region 0.55–0.98 x, 0.05–0.65 y), value curve from (0.40, 0.97) to (0.985, 0.14), power 2.3, nodes at t 0.45, 0.72, 0.9, 1.0 | 2000 x 1125 (150 dpi), JPEG q88 | Blob list `(cx, cy, r, colour, alpha)`, `seed`, constellation `n`, `alpha`, `link`; curve `power`, `width`, `nodes` |
| `bg_content.jpg` | `FBFCFF` page, faint lilac/sky corner top right, mint bottom left, 14-point constellation top right | 2000 x 1125 | Blob alphas (0.85 / 0.65 / 0.45), constellation region |
| `bg_statement.jpg` | Fuller aurora (5 blobs incl. `E6E0FF` centre), 40-point constellation along the bottom, gentle curve (power 1.8, nodes 0.55, 0.8) | 2000 x 1125 | Same as title |
| `card_problem.png` | Rounded aurora card, transparent corners, seed 21 | 4.63 x 4.4 in | `card(name, w_in, h_in, seed, radius_in=0.18, dpi=110)` |
| `card_solution.png` | Seed 22 | 5.43 x 3.4 in (placed at 3.35 in tall) | As above |
| `card_tier.png` | Seed 23 | 3.85 x 2.1 in | As above |
| `card_mrr.png` | Seed 24 | 4.13 x 1.4 in | As above |
| `card_raise.png` | Seed 25 | 4.6 x 4.6 in | As above |
| `glow.png` | Transparent radial glow, a 50/50 mix of `VIOLET` and `SKYD`, sigma 0.13, peak alpha 200 | 400 x 400 | Sigma, alpha |
| `orb.png` | Eyebrow orb, a diagonal `VIOLET`-to-`SKYD` gradient sphere | 128 x 128 | Colours |

`field()` adds Gaussian dither (sigma 1.2) against banding. The `card()` comment says "160 dpi" but the default is `dpi=110`.

## Slide by slide

1. **Title:** `TITLE_LIGHT` on the aurora and curve; a dashed lilac logo box; a violet pill raise chip with shadow at 0.8, 5.05.
2. **Problem:** three `num()` rows on the left; the `card_problem.png` aurora card on the right with a 64 pt Sora stat.
3. **Solution:** a white "TODAY" card, then a shadowed arrow circle, then the aurora "WITH [PRODUCT]" card; a lavender `tint()` insight bar led by serif "Our insight".
4. **Product:** a white screenshot frame with browser dots and a dashed lavender placeholder; three `num()` features on the right.
5. **Why now:** three `COL3` cards, each with a `num()` ring, a violet label and a 19 pt Sora heading.
6. **Market:** stacked TAM (`lt2`, lilac outline), SAM (`DCD5FF`) and violet SOM circles, with a glow; 30 pt values (SOM in violet); a tint bottom-up bar.
7. **Business model:** three tier cards with the middle one an aurora PNG; four `COL4` unit-economics cards.
8. **Traction:** a violet bar chart (no value axis or gridlines) in a card; three stat tiles, the first an aurora PNG and MoM growth in `accent4` green.
9. **Competition:** a 2x2 in a card with `accent5` axes; grey `C3C8D6` competitor dots; a violet "you" dot with a glow halo; "WHY WE WIN" `num()` list.
10. **Go-to-market:** three 0.7 in `num()` steps joined by dashed lilac arrows; three GTM cards below.
11. **Team:** four `COL4` cards with lavender photo circles, Sora names and violet roles; a serif "Advisors & investors" line.
12. **Financials:** a native table with a lavender header, white and `FAFBFF` stripes and `accent5` borders; a tint "KEY ASSUMPTIONS" panel.
13. **The ask:** the `card_raise.png` aurora card with a 60 pt raise; a four-colour doughnut (holeSize 62) in a card; three milestone cards.
14. **Vision:** `STATEMENT_LIGHT`, a 40 pt Sora title with a 48 pt serif-italic phrase, and contact details in the sub.
15. **Appendix:** `STATEMENT_LIGHT`, the word "Appendix" set entirely in 56 pt serif italic.

## How to iterate

- **Change the palette:** edit `theme.json`, then also edit (a) `DCD5FF`, `C3C8D6` and `FAFBFF` in `build.js`, and (b) the hex constants at the top of `art.py` (`BG`, `LILAC`, `SKY`, `MINT`, `PEACH`, `VIOLET`, `SKYD`, `MINTD`) plus the inline `FBFCFF`, `E6E0FF` and `EEEAFF`, and the RGB `(91, 75, 255)` in `constellation()`. Then regenerate the art and rebuild.
- **Swap fonts:** change `headFontFace` / `bodyFontFace` in `theme.json`. The accent face is the `SERIF` constant in `build.js`. Put the new family in `fonts/<FamilyNoSpaces>/` so `_shared/fonts.conf` finds it for previews.
- **Regenerate art:** `cd daybreak && python3 art.py`. If you resize an aurora card in `build.js`, change its `card(...)` call in `art.py` to the same inches so the corners don't stretch.
- **Add or duplicate a slide:** call `content("13 — LABEL", [["Plain "], ["emphasis", true]], "Section")`. Lay out with `COL3`/`W3` or `COL4`/`W4`, and use `card()` for panels, `tint()` for callout bars, `num()` for lists and `aurora()` for one hero card. Add a matching `card()` call in `art.py` if you need a new PNG. For a closing-style slide, use `masterName: "STATEMENT_LIGHT"` with `titleRuns(parts, size)`.
- **Rebuild and preview:** `npm run build:daybreak`, or `_shared/preview.sh daybreak [dpi]`, which builds into `daybreak/preview/daybreak.pptx` and renders a PDF and `slide-*.png` (default 80 dpi; it needs LibreOffice and pdftoppm).

## Caveats

- **Baked-in art.** The aurora, constellations and value curves are JPG backgrounds, and five hero cards, the glow and the orb are PNG images. None of them recolour from `theme.json` or PowerPoint's Design > Variants, and their fills can't be edited in PowerPoint.
- **Split title sizes.** `titleRuns()` sets a size only on the serif runs. Plain runs take the placeholder size (26 / 40 pt), so changing the `size` argument resizes only the emphasised phrase.
- **Hex snapshots.** `shadow()`, chart colours, chart text and the table border use `H.*` hex values, as `apply_theme.js` requires. They are fixed at build time and do not follow a theme change made inside PowerPoint.
- **Fonts aren't embedded.** Sora, Inter and Instrument Serif must be installed on the viewing machine, or PowerPoint substitutes them. Instrument Serif is not a theme font, so it can't be swapped from the theme.
- **Low-contrast details.** `accent5` hairlines (`E3E7F2`) on white, the `FAFBFF` row stripe and the pale aurora washes are very light and may disappear on projectors or paper. Because this is a light style, there is no dark-background ink problem.
- **PowerPoint features.** The deck uses sections, outer shadows, shape transparency (logo box) and dashed lines with arrowheads. The bar and doughnut charts and the financials table are native and editable (Edit Data).
