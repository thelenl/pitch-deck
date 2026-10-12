# Daybreak Silk: design system

- **Vibe:** "Daybreak made sensuous. Draped silk, warm pearl, serif display, soft depth." (the `build.js` header). Warm pearl pages, blush, apricot and lavender washes, draped silk ribbons that rise left to right, fine film grain, and white cards with a soft rose shadow.
- **Output:** `../../pitch-deck-daybreak-silk.pptx` (that is, `pitch-deck/pitch-deck-daybreak-silk.pptx`). An optional first argument overrides the path: `node daybreak-silk/build.js out.pptx`.
- **Build:** `node daybreak-silk/build.js` (run from `design-systems/`), or `npm run build:daybreak-silk`.
- **Pipeline:** pptxgenjs writes the file, then `_shared/apply_theme.js` writes the 12 theme colours from `theme.json` (theme name "Daybreak Silk") into the theme XML, then `_shared/scrub_image_paths.js` blanks local file paths out of image alt text. Speaker notes are written inline in `build.js`.
- **How it differs from daybreak:** silk ribbons instead of a value curve with nodes and constellations, a warmer pearl/blush/apricot/orchid palette, Instrument Serif as the *heading* font (titles, numerals, stats), pearl-orb number markers instead of ring outlines, rounder corners (rectRadius 0.28), rose-tinted shadows, and grain on every painted image.

## At a glance

- **Painted silk backgrounds.** All three masters use full-bleed procedural JPGs from `art.py`: aurora washes on pearl, draped ribbons with violet-tinted folds and a white sheen, and Gaussian grain.
- **Serif display.** `headFontFace` is Instrument Serif. Titles, cover name, big stats, prices and card headings are Instrument Serif Regular; one phrase per title is Instrument Serif *italic* in orchid `accent1` (`titleRuns()`). Body text is Inter.
- **Floating white cards.** `card()` draws a white rounded rectangle (rectRadius 0.28) with an `accent5` hairline and a rose outer shadow. One hero card per slide is often a silk PNG (`aurora()`).
- **Pearl orbs.** `num()` places `orb_soft.png` (lavender-to-blush sphere) under an Instrument Serif italic numeral. A smaller violet-to-rose `orb.png` sits before every eyebrow.
- **Strict grid.** Content width is 12.13 in, from x 0.6 to 12.73, split by `COL3`/`W3` or `COL4`/`W4` with 0.29 in gutters.

## Palette

Roles are from `theme.json`'s `roles` block; usage is what `build.js` does with `C.*` (scheme colours) and `H.*` (raw hex).

| Slot | Hex | Role | Where it's used |
|---|---|---|---|
| dk1 | `22152E` | Plum ink (`C.text1`) | All titles; cover title; `num()` numerals; big stats and values (except SOM, MoM); row and card headings; "With product" bullets; insight text; SAM label; bottom-up line; MRR label; raise terms; financials row labels; assumptions bullets; doughnut legend (`H.dk1`) |
| lt1 | `FFFFFF` | White (`C.background1`) | `card()` fill; Solution arrow circle; logo box (40% transparency); raise-chip text; SOM label; outline of the "you" dot; financials rows r = 0, 2, 4 |
| dk2 | `6B5E73` | Muted plum (`C.text2`) | Tagline, meta, sub; footer and slide number; descriptions; "TODAY" label and bullets; "[Logo]", "[Photo]", screenshot caption; Source; TAM label; axis captions; competitor names; table values; chart title, data and category labels (`H.dk2`) |
| lt2 | `F7F0F4` | Blush tint (`C.background2`) | `tint()` fill; screenshot placeholder; TAM circle; team photo circles; financials header fill |
| accent1 | `7B3FE4` | Orchid violet | Eyebrows; serif-italic title phrases; card labels; raise chip fill; "→"; SOM circle and value; "Bottom-up:"; "Our insight" and "Advisors & investors"; team roles; table header text; "you" dot; bar series; doughnut segment 1 |
| accent2 | `D6567E` | Rose | `shadow()` colour (`H.accent2`); doughnut segment 2 |
| accent3 | `F2A27A` | Apricot | Doughnut segment 3 only |
| accent4 | `1E8C73` | Value green | "+[X]%" month-over-month value (slide 8) |
| accent5 | `EDE4EA` | Warm hairline | `card()` border; arrow-circle border; browser dots; 2x2 axes; table border (`H.accent5`) |
| accent6 | `E3C8F0` | Light orchid | Dashed outlines (logo, screenshot); TAM outline; dashed GTM arrows; photo-circle outlines; doughnut segment 4 |
| hlink / folHlink | `7B3FE4` / `6B5E73` | Hyperlinks | Not referenced in `build.js` |

### Off-theme colours

Hard-coded; these do **not** change when `theme.json` changes. None of the `art.py` colours equals a theme slot (`VIOLET` `8A55F0` is close to, but not, `accent1`).

| Hex | File (name) | Where it's used |
|---|---|---|
| `EBD9F4` | `build.js` | SAM circle fill (slide 6) |
| `D9CCD6` | `build.js` | Competitor dots on the 2x2 (slide 9) |
| `FCF8FA` | `build.js` | Financials table stripe, rows r = 1, 3, 5 (slide 12) |
| `FAF6F4` | `art.py` (`PEARL`) | Base of `bg_title.jpg` and `bg_statement.jpg` |
| `FCFAF9` | `art.py` (`PAGE`) | Base of `bg_content.jpg` |
| `F6C3D2` | `art.py` (`BLUSH`) | Aurora washes; ribbon stops; card wash; `orb_soft.png` end colour |
| `FFCFAE` | `art.py` (`APRICOT`) | Aurora washes; ribbon end stops; card wash |
| `D8B4F4` | `art.py` (`ORCHID`) | Ribbon stops (title, statement, cards) |
| `C8BEFF` | `art.py` (`LAVENDER`) | Aurora washes; ribbon start stops; card wash; `orb_soft.png` start colour |
| `C9DDFF` | `art.py` (`MIST`) | One faint top-left wash on `bg_title.jpg` |
| `E58CA8` | `art.py` (`ROSE`) | Ribbon stops; `orb.png` end; 55% of the glow colour |
| `8A55F0` | `art.py` (`VIOLET`) | Ribbon fold shadows (every ribbon); thin title ribbon start; `orb.png` start; 45% of the glow colour |
| `F7A982` | `art.py` (`PEACH`) | Ribbon end stops (title, statement) |
| `F1E6F6` | `art.py` (inline) | Large centre wash of `bg_statement.jpg` |
| `F6ECF4` | `art.py` (inline, in `card()`) | Base of every `card_*.png` |
| `BC73C8` | `art.py` (computed `ROSE*0.55 + VIOLET*0.45`) | `glow.png` colour |
| `FFFFFF` | `art.py` (`255`) | Ribbon light folds and sheen; orb highlight |

## Typography

| Face | Role | How it's set | Font folder |
|---|---|---|---|
| Instrument Serif | Headings (`headFontFace`), numerals, stats, and the italic emphasis | Title placeholders, `HEAD` and `SERIF` (both `"+mj-lt"`, the theme heading font) | `fonts/InstrumentSerif/` (Regular, Italic only) |
| Inter | Body (`bodyFontFace`) | Default for body placeholders and `T()`; charts use `"+mn-lt"` | `fonts/Inter/` |

Instrument Serif is never bold; title placeholders set `bold: false`. Inter is regular unless noted.

| Element | Font | pt | Style | Colour |
|---|---|---|---|---|
| Cover title | Instrument Serif | 80 | Regular | `text1` |
| Cover tagline / meta | Inter | 20 / 13 | Regular | `text2` |
| Raise chip | Inter | 14 | Bold | `background1` on `accent1` |
| Eyebrow | Inter | 12 | Bold, charSpacing 3 | `accent1` |
| Content title, plain runs | Instrument Serif | 35, lineSpacingMultiple 0.88 | Regular | `text1` |
| Content title, emphasised phrase | Instrument Serif | 38 | Italic | `accent1` |
| Statement title (slide 14) | Instrument Serif | 56 plain / 58 emphasis, lineSpacingMultiple 0.9 | Regular / italic | `text1` / `accent1` |
| "Appendix" | Instrument Serif | 72 | Italic | `accent1` |
| Statement sub | Inter | 20 | Regular | `text2` |
| Card labels ("TODAY", tiers, "WHY WE WIN", "RAISING"...) | Inter | 12 (11 on milestones) | Bold, charSpacing 3 | `accent1` ("TODAY" `text2`) |
| Hero stat: Problem % / raise $ | Instrument Serif | 92 / 88 | Regular | `text1` |
| Values: market, tier prices, traction / unit economics | Instrument Serif | 42 / 40 | Regular | `text1`; SOM `accent1`; MoM `accent4` |
| Card headings: why-now and team names / GTM steps / milestones | Instrument Serif | 25 / 23 / 21 | Regular | `text1` |
| TAM / SAM / SOM labels | Instrument Serif | 21 | Italic | `text2` / `text1` / `background1` |
| `num()` numerals | Instrument Serif | `round(size × 1.35)`: 14–22 (default 18) | Italic | `text1` |
| Serif lead-ins: "Our insight" / "Advisors & investors" | Instrument Serif | 27 / 23 | Italic | `accent1` |
| Row headings | Inter | 17 problem and product, 16 unfair advantage, 15 market, 14 GTM cards and "[Your company]" | Bold | `text1` |
| Problem stat caption | Inter | 18 | Regular | `text1` |
| Bulleted lists / raise terms | Inter | 16 (paraSpaceAfter 10 / 8) | Regular | `text2` before, `text1` after |
| Descriptions | Inter | 14 (13 on competition, team, unit-economics and milestone captions) | Regular | `text2` |
| Tier price suffix | Inter | 14 | Regular | `text1` |
| Financials table | Inter | 14 | Header and labels bold | Header `accent1`, labels `text1`, values `text2` |
| Source / "[Photo]" / footer and slide number | Inter | 11 / 11 / 10 | Regular | `text2` |
| Chart title / data and axis labels / legend | Inter (`+mn-lt`) | 13 / 12 / 13 | Regular | `dk2` / `dk2` / `dk1` |

## Layouts

All slides use `LAYOUT_WIDE` (13.33 x 7.5 in).

| Master | Background | Placeholders (x, y, w, h in inches) | Fixed objects |
|---|---|---|---|
| `TITLE_LIGHT` | `art/bg_title.jpg` | `title` 0.8, 2.2, 7.4, 1.5, 80 pt, bottom-aligned; `tagline` 0.8, 3.8, 6.4, 1.0, 20 pt; `meta` 0.8, 6.3, 7.0, 0.45, 13 pt | None |
| `CONTENT` | `art/bg_content.jpg`; margin [0.5, 0.6, 0.8, 0.6] | `eyebrow` 0.88, 0.44, 8.5, 0.3, 12 pt bold `accent1`, middle; `title` 0.6, 0.78, 12.13, 1.1, 35 pt, lineSpacingMultiple 0.88, top-aligned | `orb.png` at 0.6, 0.5, 0.16 x 0.16; footer "[Company name] · Confidential" at 0.6, 6.95, 6.0 x 0.3, 10 pt; slide number at 12.23, 6.95, 0.5 x 0.3, right-aligned |
| `STATEMENT_LIGHT` | `art/bg_statement.jpg` | `title` 0.8, 1.4, 11.7, 2.4, 56 pt, lineSpacingMultiple 0.9, bottom-aligned; `sub` 0.8, 4.05, 11.7, 1.2, 20 pt | None |

Sections: Intro (1), Opportunity (2–6), Business (7–10), Team & Financials (11–13), Close (14–15).

## Components & signature moves

| Helper / pattern | Parameters and what it draws | Used on |
|---|---|---|
| `T(slide, text, o)` | Text box, `margin: 0`, `valign: "top"`, `o` spread last | Every free text element |
| `shadow()` | Outer, `H.accent2` rose, opacity 0.12, blur 28, offset 6, angle 90 | `card()`, raise chip, Solution arrow circle |
| `card(slide, x, y, w, h, name)` | `ROUNDED_RECTANGLE`, rectRadius 0.28, `background1` fill, `accent5` 0.75 pt line, `shadow()` | Slides 3, 4, 5, 7, 8, 9, 10, 11, 13 |
| `tint(slide, x, y, w, h, name)` | Same shape, `background2` fill, no line, no shadow | Insight bar (3), bottom-up math (6), key assumptions (12) |
| `aurora(slide, file, x, y, w, h, name)` | Places an `art/card_*.png` silk card | Problem stat (2), "With product" (3), middle tier (7), MRR tile (8), raise card (13) |
| `num(slide, x, y, d, label, size = 13)` | `orb_soft.png` at d x d, then a centred Instrument Serif italic numeral at `round(size × 1.35)` pt in `text1` | 2 (d 0.55), 4 (0.5), 5 (0.6), 9 (0.45), 10 (0.7) |
| `titleRuns(parts, size)` | `[text, em]` pairs to runs; `em` runs become `SERIF` italic `accent1` at `size`; plain runs take the placeholder size | All content titles (size 38), 14 (58), 15 (72) |
| `content(eyebrow, parts, section)` | Adds a `CONTENT` slide in `section`, fills eyebrow and `titleRuns(parts, 38)` | Slides 2–13 |
| `COL3 = [0.6, 4.74, 8.88]`, `W3 = 3.85` | Three columns, 0.29 in gutter | 5, 7, 10 |
| `COL4 = [0.6, 3.705, 6.81, 9.915]`, `W4 = 2.815` | Four columns, 0.29 in gutter | 7 (unit economics), 11 |
| Eyebrow numbering | "01 — THE PROBLEM" ... "12 — THE ASK" | 2–13 |
| Pill chip | Rounded rect 4.6 x 0.55, rectRadius 0.27, `accent1` fill, `shadow()` | Raise chip (1) |
| Dashed placeholder | `accent6` 1 pt dash outline | Logo (1, rectRadius 0.12), screenshot (4, rectRadius 0.1) |
| Glow halo | `art/glow.png` behind an `accent1` dot | SOM (6, 3.8 in), "you" marker (9, 1.55 in) |
| Browser chrome | Three 0.13 in `accent5` dots at y 2.15 | Screenshot frame (4) |

## Art assets

All made by `daybreak-silk/art.py` (numpy, Pillow). Regenerate with `python3 art.py` from `daybreak-silk/`; it always writes into `daybreak-silk/art/` and prints "art ok". Backgrounds are 2000 x 1125 (150 dpi) JPEG q90; cards are PNG at 110 dpi with transparent rounded corners.

| File | What it is | Made by |
|---|---|---|
| `bg_title.jpg` | Pearl page; washes of blush (top right), lavender (right), apricot (bottom), blush, mist; three ribbons rising from lower left to upper right | `aurora(SW, SH, PEARL, 5 blobs)`; ribbons (1) `1.05, .040, .8, .4, .80, 1.6, .150, [LAVENDER, ORCHID, BLUSH, APRICOT], .70, x0=.30`; (2) `1.12, .050, .7, 2.2, .72, 1.9, .200, [ORCHID, ROSE, PEACH], .50, x0=.40`; (3) thin `1.00, .030, 1.0, 4.0, .90, 1.4, .070, [VIOLET, ROSE, APRICOT], .45, sheen=.6, x0=.26`; `grain(seed=1)` |
| `bg_content.jpg` | `PAGE` with blush and lavender at the top-right corner, apricot bottom left, one small silk wisp top right | `aurora(SW, SH, PAGE, 3 blobs)`; ribbon `.15, .012, .8, 1.0, .18, 1.3, .050, [LAVENDER, BLUSH, APRICOT], .40, x0=.78, fade=.45`; `grain(sigma=2.0, seed=2)` |
| `bg_statement.jpg` | Full wash (lavender, blush, apricot, blush, `F1E6F6` centre); two ribbons along the lower third | ribbons `1.02, .035, .8, .9, .22, 1.3, .150, [LAVENDER, ORCHID, BLUSH, APRICOT], .65, x0=-.1` and `1.08, .040, .6, 2.8, .28, 1.6, .090, [ORCHID, ROSE, PEACH], .50, sheen=.6, x0=-.1`; `grain(seed=4)` |
| `card_problem.png` / `card_solution.png` / `card_tier.png` / `card_mrr.png` / `card_raise.png` | Silk card: `F6ECF4` base, random lavender, blush and apricot washes, one ribbon, grain | `card(name, w_in, h_in, seed, radius_in=0.30, dpi=110)`: 4.63 x 4.4 (seed 21), 5.43 x 3.35 (22), 3.85 x 2.1 (23), 4.13 x 1.4 (24), 4.6 x 4.6 (25). Ribbon `base_y U(.85, 1.0), .04, .7, phase U(0, 6), .35, 1.5, .30, [ORCHID, BLUSH, APRICOT], .40, sheen=.4, x0=-.1`; `grain(sigma=2.4, seed)` |
| `glow.png` | 400 x 400 transparent radial glow, colour `BC73C8`, sigma 0.13, peak alpha 190 | Inline block after the cards |
| `orb.png` | 160 px eyebrow orb, diagonal `VIOLET` to `ROSE` | `orb(name, size, c0, c1)`: shading 0.82–1.0, white highlight up-left at 75% |
| `orb_soft.png` | 220 px number marker, `LAVENDER` to `BLUSH` | `orb("orb_soft.png", 220, LAVENDER, BLUSH)` |

Other helpers: `aurora(w, h, base, blobs)` blends Gaussian washes `(cx, cy, radius, colour, strength)` in 0..1 slide units; `grain(img, sigma=2.6, seed)` adds monochrome Gaussian noise; `save_jpg(arr, name, q=90)`.

### `ribbon()` parameters

`ribbon(img, base_y, amp, freq, phase, rise, power, thick, cols, alpha, sheen=0.45, x0=0.0, x1=1.0, fade=0.25)`. Units are fractions of image height (y) and width (x); `u` runs 0..1 from `x0` to `x1`.

| Param | What it does |
|---|---|
| `base_y` | Height of the centre line at the start; values above 1.0 begin below the bottom edge |
| `amp` | Amplitude of the main sine sway; a second wave (2.3x the frequency, 0.35x the amplitude) adds irregular drape |
| `freq` | Main sway cycles across the span |
| `phase` | Offsets both waves (the second at 1.7x), the width breathing and the fold pattern; changing it gives a different drape with the same shape |
| `rise` | Total climb by `x1`, as `rise × u^power`: the "value creation" lift |
| `power` | Shape of the climb: above 1 is flat then steep, 1 is linear |
| `thick` | Width scale; the width breathes between 0.55x and 1.0x of it along the length |
| `cols` | Colour stops spread evenly along the length |
| `alpha` | Peak opacity of the ribbon body (Gaussian cross-section) |
| `sheen` | Strength of the white highlight along the upper edge |
| `x0`, `x1` | Start and end of the span; past `x1` the ribbon continues flat; `x0 < 0` starts it off-canvas |
| `fade` | Share of the span over which the ribbon fades in (smoothstep) from `x0` |

Folds shade up to about 20% toward `VIOLET` on one side and 10% toward white on the other. **More drama:** raise `rise`, `power`, `amp`, `thick`, `alpha` and `sheen`, or add a ribbon. **Calmer:** lower `alpha` (0.3–0.4), `amp` and `rise`, set `sheen` around 0.3, or drop the thin third title ribbon. `freq` above about 1.2 starts to look wavy rather than draped.

## Slide by slide

1. **Title:** `TITLE_LIGHT` on silk; dashed light-orchid logo box; 80 pt serif name; orchid pill raise chip with rose shadow at 0.8, 5.05.
2. **Problem:** three pearl-orb `num()` rows on the left; the `card_problem.png` silk card with a 92 pt serif stat.
3. **Solution:** white "TODAY" card, shadowed "→" circle, silk "WITH [PRODUCT]" card; blush `tint()` insight bar led by serif "Our insight".
4. **Product:** white screenshot frame with browser dots and a dashed blush placeholder; three `num()` features.
5. **Why now:** three `COL3` cards, each with an orb numeral, an orchid label and a 25 pt serif heading.
6. **Market:** stacked TAM (`lt2`, light-orchid outline), SAM (`EBD9F4`) and orchid SOM circles with a glow; 42 pt serif values; tint bottom-up bar.
7. **Business model:** three tier cards (middle one silk PNG) with 42 pt serif prices; four `COL4` unit-economics cards.
8. **Traction:** orchid bar chart (no value axis or gridlines) in a card; three stat tiles, the first silk, MoM in `accent4` green.
9. **Competition:** 2x2 in a card with `accent5` axes; `D9CCD6` competitor dots; orchid "you" dot with glow; "WHY WE WIN" `num()` list.
10. **Go-to-market:** three 0.7 in orb steps joined by dashed light-orchid arrows; 23 pt serif step heads; three GTM cards.
11. **Team:** four `COL4` cards with blush photo circles, 25 pt serif names, orchid roles; serif "Advisors & investors" line.
12. **Financials:** native table with blush header, white and `FCF8FA` stripes, `accent5` borders; tint "KEY ASSUMPTIONS" panel.
13. **The ask:** `card_raise.png` silk card with an 88 pt serif raise; four-colour doughnut (holeSize 62) in a card; three milestone cards.
14. **Vision:** `STATEMENT_LIGHT`, 56 pt serif title with a 58 pt italic orchid phrase; contact details in the sub.
15. **Appendix:** `STATEMENT_LIGHT`, "Appendix" entirely in 72 pt serif italic orchid.

## How to iterate

- **Re-colour:** edit `theme.json` (slots move all `C.*`/`H.*` uses). Then edit the off-theme hexes in `build.js` (`EBD9F4`, `D9CCD6`, `FCF8FA`). The art does **not** read `theme.json`: change the constants at the top of `art.py` (`PEARL`, `PAGE`, `BLUSH`, `APRICOT`, `ORCHID`, `LAVENDER`, `MIST`, `ROSE`, `VIOLET`, `PEACH`) plus inline `F1E6F6` and `F6ECF4`, keep `VIOLET` near `accent1` (it also tints every ribbon fold and the glow), then regenerate art and rebuild.
- **Swap fonts:** change `headFontFace` / `bodyFontFace` in `theme.json`. Because `HEAD` and `SERIF` are both `"+mj-lt"`, the heading face drives titles, stats, numerals *and* the italic emphasis, so pick a family with a real italic. Put it in `fonts/<FamilyNoSpaces>/` so `_shared/fonts.conf` finds it for previews. Re-check title wrapping; sizes were tuned for Instrument Serif's narrow set.
- **Regenerate art:** `cd daybreak-silk && python3 art.py`. If you resize a silk card in `build.js`, change its `card(...)` call in `art.py` to the same inches so corners and grain don't stretch. Change a `seed` for a different wash and drape.
- **Add a slide:** `content("13 — LABEL", [["Plain "], ["emphasis", true]], "Section")`. Lay out with `COL3`/`W3` or `COL4`/`W4`; use `card()` for panels, `tint()` for callouts, `num()` for lists, `aurora()` for one hero card (add a matching `card()` call in `art.py`). For a closing slide use `masterName: "STATEMENT_LIGHT"` with `titleRuns(parts, size)`.
- **Preview:** `_shared/preview.sh daybreak-silk [dpi]` (from `design-systems/`) builds into `daybreak-silk/preview/daybreak-silk.pptx` and renders a PDF and `slide-*.png` (default 80 dpi; needs LibreOffice and pdftoppm).

## Caveats

- **Baked-in art.** Washes, ribbons and grain are JPG backgrounds; the five silk cards, glow and both orbs (including every `num()` marker) are PNGs. None recolour from `theme.json` or PowerPoint's Design > Variants, and their fills can't be edited in PowerPoint. `art.py` card corners use radius 0.30 in, `card()` shapes 0.28, so silk and white cards differ slightly.
- **Grain and file size.** Grain defeats compression: backgrounds are about 190–260 KB each, the larger silk PNGs about 250–300 KB, about 1.8 MB of art in all. Lowering `sigma` or the JPEG `q` shrinks them; heavy recompression can band the washes.
- **Font fallbacks.** Fonts aren't embedded. Instrument Serif has only Regular and Italic, so any bold applied to `HEAD` text would be synthesised; the deck avoids it. Without Instrument Serif installed, PowerPoint substitutes a wider face and titles, stats and numerals reflow.
- **Long titles.** Measured with Instrument Serif's widths, slide 2's title fills 11.97 of 12.13 in and slide 3's (12.16 in) wraps to two lines; both still fit the 1.1 in title box at lineSpacingMultiple 0.88, but a third line would run into content at y 1.95. Slide 14's vision line always takes two lines (bottom-aligned, so it grows upward). "[Company name]" at 80 pt fills 6.72 of 7.4 in, so longer names wrap on the cover.
- **Split title sizes.** `titleRuns()` sizes only the emphasised runs; plain runs take the placeholder size (35 / 56 pt), so the italic phrase is deliberately a few points larger.
- **Hex snapshots.** `shadow()`, chart colours and text, and the table border use `H.*` hex, as `apply_theme.js` requires; they don't follow a theme change made inside PowerPoint.
- **Low contrast.** `accent5` hairlines (`EDE4EA`), the `FCF8FA` stripe and the pale washes may vanish on projectors or paper.
