# Daybreak Metallic: design system

- **Vibe:** "Daybreak made sensuous and metallic. Liquid-metal silk (rose gold, lilac chrome, champagne), dark plum panels, serif display type, chrome spheres; fuller, editorial layouts." (the `build.js` header).
- **Output:** `../../pitch-deck-daybreak-metallic.pptx` (that is, `pitch-deck/pitch-deck-daybreak-metallic.pptx`); an optional first argument overrides the path.
- **Build:** `npm run build:daybreak-metallic` (from `design-systems/`) or `node daybreak-metallic/build.js [out.pptx]`.
- **Pipeline:** pptxgenjs writes the file, `_shared/apply_theme.js` writes the 12 `theme.json` colours (theme name "Daybreak Metallic") into the theme XML, then `_shared/scrub_image_paths.js` blanks local paths out of image alt text. Speaker notes are not written here: `build.js` regex-reads the 15 `addNotes("...")` strings from `../template/build.js` and throws if it doesn't find exactly 15.
- **Lineage:**
  - **daybreak:** light and airy. Sora headings, a glowing value curve with constellations on near-white aurora art, `TITLE_LIGHT` / `CONTENT` / `STATEMENT_LIGHT` masters.
  - **`daybreak-silk` ("more sensuous"; kept as its own style):** draped silk ribbons in place of the value curve, a warm pearl/blush/apricot/orchid palette, Instrument Serif headings, pearl-orb number markers, rounder corners (`rectRadius` 0.28), rose-tinted shadows, grain on every image. It kept three light masters and white cards.
  - **`daybreak-metallic`, this style ("more metallic, less generic, less whitespace", built on silk):** the ribbons became liquid metal (rose-gold / lilac-chrome / champagne ramps with specular streaks). It added dark plum split-panel masters (`SPLIT_RIGHT`, `SPLIT_LEFT`) and a dark `STATEMENT_DARK`, dark metallic hero cards, chrome spheres and a ring, and larger type throughout (titles 41/35 pt, 120 pt panel stats). The theme moved to rose gold `accent3` (`D9A08F`), champagne `accent6` (`F3DCC4`) and deep rose `accent2` (`B5487A`), and the notes now come from the template.

## At a glance

- **Five masters**, each with a full-bleed painted JPG: a light title page, a light content page, two light pages with a 4.9 in dark plum metal panel (right or left), and a dark statement page.
- **Liquid metal, kept off the text.** On light pages the metal sits at the right edge (title) or as a small top-right wisp (content). On dark art, bright metal stays in the lower part, under the text.
- **Light/dark emphasis pair.** One phrase per title is set in Instrument Serif *italic*: orchid `accent1` on light and rose gold `accent3` on dark (`titleRuns()`). On dark, primary text is white and secondary text is champagne `accent6`.
- **Dark hero cards.** One card per slide (slides 3, 5, 7, 12) is a rounded dark-silk PNG instead of a white `card()`.
- **Chrome objects.** A rose-gold sphere sits under every `num()` numeral, an orchid sphere before every eyebrow and on the SOM / "you" markers, and a rose-gold ring frames each team photo.
- **Strict grid.** Content runs from x 0.6 to 12.73 (12.13 in), split by `COL3`/`W3` (3.85 in) or `COL4`/`W4` (2.815 in); split layouts use the panel constants below.

## Palette

`theme.json` slots (`C.*` are scheme colours, `H.*` raw hex). The roles come from `theme.json`; "where used" comes from `build.js`.

| Slot | Hex | Role | Where used |
|---|---|---|---|
| dk1 | `22152E` | Plum ink (`C.text1`) | Titles; row and card headings; light-card stats and values; `num()` numerals; raise-chip fill; table header fill; bottom-up line; doughnut segment 1 and legend (`H.dk1`) |
| lt1 | `FFFFFF` | White (`C.background1`) | `card()` fill; logo box (40% transparent); TAM circle; text on dark (panel stats, dark-card text, statement title, raise-chip terms, SOM label); table rows 0, 2, 4 |
| dk2 | `6B5E73` | Muted plum (`C.text2`) | Tagline, meta; descriptions; footers; slide numbers on light; "TODAY" label and bullets; TAM label; axis captions; competitor names; table values; chart title, data and axis labels (`H.dk2`) |
| lt2 | `F7F1F0` | Porcelain blush page | Not referenced in `build.js`; it equals `art.py` `PAGE`, the light art base |
| accent1 | `7B3FE4` | Orchid violet | Eyebrows; title emphasis on light; `label()` default; team roles; milestone labels; SOM value; "Bottom-up" and "Advisors & investors"; bar series (`H.accent1`); doughnut segment 2 |
| accent2 | `B5487A` | Deep rose | `shadow()` colour only (`H.accent2`) |
| accent3 | `D9A08F` | Rose gold | Title emphasis on dark; labels on dark; "$[X]M" in the raise chip; "Our insight", "Key assumptions"; MoM value; logo and screenshot dashed outlines; TAM outline; GTM arrows; doughnut segment 3 |
| accent4 | `1E8C73` | Value green | Not referenced in `build.js` (its role says growth figures on light, but the only growth figure, slide 8 MoM, is on the dark panel in `accent3`) |
| accent5 | `E8DCDF` | Warm hairline | `card()` stroke; browser dots; 2x2 axes; table border (`H.accent5`) |
| accent6 | `F3DCC4` | Champagne | Secondary text on dark (statement sub, panel captions, dark-card body); "Raising "; table header text; `SPLIT_RIGHT` slide number |
| hlink / folHlink | `7B3FE4` / `6B5E73` | Hyperlinks | Not referenced |

### Off-theme colours

These are hard-coded, so they **do not follow `theme.json`**. All art is painted from the `art.py` constants, never from the theme. Only `PAGE` (= `lt2`) and `ORCHID` (= `accent1`) match a slot, and `ORCHID` is defined but never used. `PLUM` `1E1226` is darker than `dk1` `22152E`.

| Hex | File (name) | Where used |
|---|---|---|
| `F0E4E6` | build.js | `tint()` fill (slide 6 bottom-up bar); screenshot placeholder fill; team photo circles |
| `EADDF0` | build.js | SAM circle (slide 6) |
| `D9CCD6` | build.js | Competitor dots (slide 9) |
| `FBF6F6` | build.js | Financials alternate rows (1, 3, 5) |
| `C9B8F0` | build.js | Doughnut segment 4, "[Other]" (the chart extra) |
| `F7F1F0` | art.py `PAGE` | Base of title, content and split-page art |
| `1E1226` | art.py `PLUM` | Base of statement art, split panels and dark cards |
| `F2C6CF` / `F8CDB2` / `CFC3F5` | art.py `BLUSH` / `APRICOT` / `LAVENDER` | Aurora washes on the light pages |
| `3A2050` / `4A1F38` | art.py (inline) | Violet and wine glows in `dark_silk()` and the statement art |
| `2E1824 7A4A55 C08878 E9C0A8 FFF4EC D8A898` | art.py `ROSE_GOLD` | Metal ramp; stops 1 to 4 colour `orb_rosegold.png` and `ring_rosegold.png` |
| `221A38 6B5A92 A895D0 DCD0F2 FFFFFF B7A6E0` | art.py `LILAC_CHROME` | Metal ramp |
| `33251F 8A6E5A CFB49A F3E3D0 FFFBF5 D9C2A8` | art.py `CHAMPAGNE` | Metal ramp |
| `2A1450 5B2FC0 9C78F0 E6DCFF` | art.py (inline) | `orb_orchid.png` ramp |
| `FFFFFF` (255) | art.py | Ribbon specular streaks; sphere highlights |

## Typography

- **Heading:** Instrument Serif (`theme.json` `headFontFace`; `HEAD = "+mj-lt"` in `build.js`), at `fonts/InstrumentSerif/` (Regular and Italic only). **Body:** Inter (`bodyFontFace`; charts use `"+mn-lt"`), at `fonts/Inter/`.
- Title placeholders inherit the heading font. Serif stats and numerals set `fontFace: HEAD`. Everything else is Inter.
- `titleRuns()` sets a size only on emphasis runs. Plain runs take the layout size, so the italic phrase is 3–4 pt larger than the regular part of the title.

| Element | Font | pt | Style | Colour | Line spacing |
|---|---|---|---|---|---|
| Cover title (TITLE) | Instrument Serif | 84 | Regular | text1 | default |
| Cover tagline / meta | Inter | 22 / 13 | Regular | text2 | default |
| Raise chip | Inter + Instrument Serif | 15 / 22 | Bold; amount italic | accent6, accent3, white | default |
| Eyebrow | Inter | 13 | Bold, charSpacing 3 | accent1 | default |
| Content title: plain / emphasis | Instrument Serif | 38 / 41 | Regular / italic | text1 / accent1 | 0.88 |
| Split title: plain / emphasis | Instrument Serif | 32 / 35 | Regular / italic | text1 / accent1 | 0.88 |
| Statement title (slide 14) | Instrument Serif | 60 / 64 | Regular / italic | white / accent3 | 0.9 |
| "Appendix" (slide 15) | Instrument Serif | 88 | Italic | accent3 | 0.9 |
| Statement sub | Inter | 22 | Regular | accent6 | default |
| Panel hero stat (slides 2, 13) | Instrument Serif | 120 | Regular | white | default |
| Panel metrics (slide 8) | Instrument Serif | 64 | Regular | white / accent3 | default |
| Big values (market / price / unit econ.) | Instrument Serif | 56 / 54 / 52 | Regular | text1 (SOM accent1) | default |
| Card headings (why now / GTM / team / milestone) | Instrument Serif | 27 / 28 / 31 / 22 | Regular | text1 (white on dark) | default |
| Italic lead-ins | Instrument Serif | 24–32 | Italic | accent1 / accent3 | default |
| TAM / SAM / SOM | Instrument Serif | 26 | Italic | text2 / text1 / white | default |
| `num()` numeral | Instrument Serif | round(d × 34): 19–29 | Italic | text1 | default |
| `label()` | Inter | 13 (milestones 12) | Bold, charSpacing 3 | accent1 / accent3 / text2 | default |
| Row headings | Inter | 17–21 | Bold | text1 | default |
| Descriptions / bullets | Inter | 15–17 / 19 | Regular | text2 (accent6 on dark) | bullets `paraSpaceAfter` 14 |
| Table | Inter | 16 | Header bold | accent6 on text1; text1 / text2 | default |
| Charts | Inter | 13–14 | Regular | dk2 / dk1 | n/a |
| Footer / slide number | Inter | 10 | Regular | text2 (SPLIT_RIGHT number accent6) | default |

## Layouts

Panel constants (`build.js`, 13.333 x 7.5 in):

| Constant | Value | Meaning |
|---|---|---|
| `SW` | 13.333 | Slide width |
| `PANEL` | 4.9 | Panel width. **Must equal `art.py` `PANEL_IN`**, or the text won't line up with the painted panel |
| `R_W` | SW − PANEL − 0.6 − 0.5 = 7.333 | Content width beside a right panel (x 0.6 to 7.933; the panel starts at 8.433) |
| `L_X` | PANEL + 0.55 = 5.45 | Content x beside a left panel |
| `L_W` | SW − L_X − 0.6 = 7.283 | Content width beside a left panel |
| `PX` | SW − PANEL + 0.45 = 8.883 | Text x inside a right panel (left panel text uses a literal 0.55) |
| `PW` | PANEL − 0.9 = 4.0 | Text width inside either panel |

| Master | Background | Placeholders and geometry (x, y, w, h in) | Footer / slide number |
|---|---|---|---|
| `TITLE` | `bg_title.jpg` | `title` 0.8, 1.9, 8.2, 1.8, 84 pt, bottom; `tagline` 0.8, 3.85, 7.2, 1.0, 22 pt; `meta` 0.8, 6.35, 7.0, 0.45, 13 pt | None / none |
| `CONTENT` | `bg_content.jpg`; margin [0.5, 0.6, 0.8, 0.6] | `eyebrowAndTitle(0.6, 12.13, 38)` | Footer at 0.6 in text2 / number text2 |
| `SPLIT_RIGHT` | `bg_split_r.jpg`; margin [0.5, PANEL + 0.5, 0.8, 0.6] | `eyebrowAndTitle(0.6, R_W, 32)`; the panel content is placed per slide at `PX`/`PW` | Footer at 0.6 in text2 / number accent6 (it sits on the panel) |
| `SPLIT_LEFT` | `bg_split_l.jpg`; margin [0.5, 0.6, 0.8, L_X] | `eyebrowAndTitle(L_X, L_W, 32)` | Footer at `L_X` in text2, on the light side because the panel bottom is bright metal / number text2 |
| `STATEMENT_DARK` | `bg_statement.jpg` | `title` 0.8, 1.2, 11.7, 2.7, 60 pt, white, line 0.9, bottom; `sub` 0.8, 4.15, 11.7, 1.2, 22 pt, accent6 | None / none |

`eyebrowAndTitle(x, w, size)` places `orb_orchid.png` (0.2 in) at x, 0.47; an `eyebrow` at x + 0.32, 0.42, w − 0.32, 0.3; and a `title` at x, 0.78, w, 1.1, top-aligned. The footer text is "[Company name] · Confidential" at y 6.95, 4.5 x 0.3. The slide number is at 12.23, 6.95.

## Components & signature moves

| Helper | What it does | Used on |
|---|---|---|
| `T(slide, text, o)` | `addText` text box, margin 0, top-aligned | Everywhere |
| `shadow()` | Outer shadow, `accent2`, 14% opacity, blur 30, offset 6, angle 90 | `card()`, TAM circle, raise chip |
| `card(...)` | White rounded rect, `rectRadius` 0.28, `accent5` 0.75 pt stroke, `shadow()` | 3, 4, 5, 7, 8, 9, 10, 11, 13 |
| `tint(...)` | `F0E4E6` rounded rect, no line | 6 (bottom-up bar) |
| `img(slide, file, x, y, w, h, name)` | Places an `art/` image with empty alt text | Dark cards, spheres, ring |
| `num(slide, x, y, d, label)` | `orb_rosegold.png` at d x d plus a centred italic serif numeral, round(d × 34) pt | 2, 3 (the "→"), 4, 5, 9, 10 |
| `titleRuns(parts, size, dark)` | `[text, em]` pairs; em runs are italic serif in accent1, or accent3 when `dark` | Every title |
| `content(eyebrow, parts, section, master)` | New slide, eyebrow plus title; emphasis is 41 pt on `CONTENT`, 35 pt on the splits | 2 to 13 |
| `label(slide, text, x, y, w, color)` | 13 pt bold caps, charSpacing 3, default accent1 | 2, 3, 5, 7, 8, 9, 10, 13 |
| `eyebrowAndTitle`, `footer` | Master pieces (see Layouts) | `CONTENT`, both splits |
| `n2(i)` | Zero-pads to "01" | Numerals and eyebrows |

- **Emphasis:** on light it's `accent1` orchid (titles, labels, lead-ins). On dark it's `accent3` rose gold (`titleRuns(..., true)`, labels, "Our insight", "Key assumptions", the raise amount), with white for primary text and `accent6` champagne for secondary text.
- **Dark hero cards:** 3 (`card_solution.png` with "WITH [PRODUCT]", and `card_insight.png`), 5 (middle card, `card_whynow.png`), 7 (middle tier, `card_tier.png`), 12 (`card_insight.png` holding the assumptions). The raise chip on slide 1 is a plum `text1` pill.
- **Split panels:** 2 and 8 (`SPLIT_RIGHT`), 13 (`SPLIT_LEFT`). **Dark statement:** 14 and 15.

## Art assets

All art comes from `art.py` (numpy + Pillow). Regenerate with `python3 daybreak-metallic/art.py` from `design-systems/`, or `python3 art.py` inside the folder; it always writes to `daybreak-metallic/art/` and prints "art ok". Full-slide JPGs are 2000 x 1125 px (150 dpi, quality 90). Cards are rendered at 120 dpi with 0.28 in corners (`rounded()`).

| File | How it's made |
|---|---|
| `bg_title.jpg` | `aurora(PAGE)` with BLUSH, LAVENDER and APRICOT washes on the right, then three `metal_ribbon`s from x0 0.38–0.46: (base_y 1.10, thick 0.22, rise 0.85, [ROSE_GOLD, LILAC_CHROME]), (1.02, 0.12, 0.92, [LILAC_CHROME, CHAMPAGNE]), (1.00, 0.05, 0.98, [CHAMPAGNE, ROSE_GOLD]); grain 2.4, seed 1 |
| `bg_content.jpg` | `aurora(PAGE)` with a BLUSH glow top-right and an APRICOT glow bottom-left, plus one wisp `metal_ribbon(0.16, amp 0.012, rise 0.18, thick 0.045, [LILAC_CHROME, ROSE_GOLD], alpha 0.75, x0 0.80, fade 0.45)`; grain 1.8 |
| `bg_split_r.jpg` / `bg_split_l.jpg` | A PAGE base plus `dark_silk(int(PANEL_IN × 150) = 735 px, 1125, seed 31 / 32, "panel")` pasted at the right, or mirrored at the left; grain 1.6 |
| `bg_statement.jpg` | `aurora(PLUM)` with `3A2050` / `4A1F38` glows up top and two ribbons in the lower half: (1.06, thick 0.16, rise 0.26, [LILAC_CHROME, ROSE_GOLD, CHAMPAGNE]) and (1.02, 0.06, 0.30, [ROSE_GOLD, CHAMPAGNE]); grain 2.4 |
| `card_solution.png` 5.43 x 3.4, `card_whynow.png` 3.85 x 4.75, `card_tier.png` 3.85 x 2.45, `card_insight.png` 12.13 x 1.05 | `rounded(dark_silk(w, h, seed 41 / 42 / 43 / 44, "card"))`; the sizes match the `img()` calls in `build.js` |
| `orb_rosegold.png` | `sphere(220 px, ROSE_GOLD[1:5])`: a fake-environment reflection, shading 0.65–1.0, white highlight up-left |
| `orb_orchid.png` | `sphere(320 px, 2A1450 → 5B2FC0 → 9C78F0 → E6DCFF)` |
| `ring_rosegold.png` | `ring(400 px, width_frac 0.09, ROSE_GOLD[1:5])`, banded by angle |

**`metal_ribbon(img, base_y, amp, freq, phase, rise, power, thick, ramps, alpha, x0, x1, fade, crisp, spec_gain)`.** All values are fractions of the image size.
- `base_y`: centre height at the start (above 1.0 starts below the bottom edge).
- `amp`, `freq`, `phase`: two stacked sine waves.
- `rise`, `power`: how far it climbs by the end (`rise × u^power`; `power` above 1 accelerates, "value creation").
- `thick`: half-thickness, modulated 0.55–1.0 along the length.
- `ramps`: metal ramps blended along the length.
- `alpha`: opacity.
- `x0`, `x1`: horizontal span.
- `fade`: smoothstep fade-in length.
- `crisp`: edge hardness (falloff exponent 1 + 0.6 × crisp; default 1.0, never overridden).
- `spec_gain`: scales the two white specular streaks (0.85 and 0.35 strength).

Fold value `f` indexes the ramp, so folds go dark and crests go bright.

**Metal ramps:** `ROSE_GOLD`, `LILAC_CHROME` and `CHAMPAGNE` each have six stops, running shadow → mid → light → specular → rim, evenly spaced over f 0–1.

**`dark_silk(w, h, seed, mode)`:** a `PLUM` aurora with `3A2050` and `4A1F38` glows, grain 2.2.
- `"panel"`: three random ribbons with `base_y` 1.02–1.12 and `rise` 0.22–0.34, so the bright metal stays in the lower third and the text above sits on calm plum.
- `"card"`: two wide, low sheens (alpha 0.22, `spec_gain` 0.25, thick 0.22) plus one bright ribbon hugging the bottom edge (base_y 1.06, thick 0.07, alpha 0.9, ramp pair `sets[seed % 3]`).

**Tweaking:**
- **More or less metal:** raise or lower `alpha`, `thick` or `spec_gain`.
- **More drama:** increase `rise` (metal climbs higher), use `crisp` above 1 (harder satin edges), or add ribbons.
- **Calmer:** lower `spec_gain` and alpha.

Text areas are kept calm on purpose. White and champagne text needs an even plum field, and orchid/plum text needs flat PAGE, so bright metal stays below the panel text, at the bottom edge of cards and off to the side of light pages. If you move ribbons up, check legibility.

## Slide by slide

1. **Title:** `TITLE` over the metal mass, a dashed logo box, 84 pt name, tagline, plum raise chip with a rose-gold serif amount, meta line.
2. **Problem:** `SPLIT_RIGHT`. Three rose-gold `num()` rows on the left; the panel holds "THE COST", a 120 pt white "[XX%]" and a source line.
3. **Solution:** a white "TODAY" card, a "→" sphere, a dark `card_solution.png` "WITH [PRODUCT]" card, and a full-width `card_insight.png` "Our insight" bar.
4. **Product:** a white browser-frame card with a dashed screenshot placeholder, and three numbered features on the right.
5. **Why now:** three `COL3` cards with spheres, labels and 27 pt serif heads; the middle one is dark `card_whynow.png`.
6. **Market:** nested TAM/SAM circles with an orchid SOM sphere; 56 pt serif values (SOM in orchid); `tint()` bottom-up bar.
7. **Business model:** three price tiers (the middle one dark `card_tier.png`) and four unit-economics cards with 52 pt serif values.
8. **Traction:** `SPLIT_RIGHT`. An orchid bar chart in a white card; the panel shows three 64 pt metrics (MoM in rose gold).
9. **Competition:** a 2x2 matrix card, an orchid "you" sphere, grey competitor dots, and three numbered "WHY WE WIN" rows.
10. **Go-to-market:** three 0.85 in spheres joined by dashed rose-gold arrows, 28 pt serif steps, three GTM cards.
11. **Team:** four `COL4` cards, each a photo circle inside a rose-gold ring, a 31 pt serif name and an orchid role; "Advisors & investors" line.
12. **Financials:** a 7-row x 6-column table with a plum header and champagne header text; `card_insight.png` "Key assumptions" bar.
13. **The ask:** `SPLIT_LEFT`. The panel has "RAISING", a 120 pt "$[X]M" and champagne terms; on the right are the use-of-funds doughnut card and three milestone cards.
14. **Vision:** `STATEMENT_DARK`, 60 pt white with a 64 pt rose-gold italic phrase; contacts in champagne.
15. **Appendix:** `STATEMENT_DARK`, "Appendix" in 88 pt rose-gold italic; the appendix list in the sub.

## How to iterate

- **Re-colour:** edit `theme.json` (the slots drive all `C.*`/`H.*` usage). Then update the off-theme hexes in `build.js` (`F0E4E6`, `EADDF0`, `D9CCD6`, `FBF6F6`, `C9B8F0`) and the constants and inline hexes in `art.py` (`PAGE`, `PLUM`, `BLUSH`, `APRICOT`, `LAVENDER`, the three metal ramps, the glows, the orchid orb stops). Regenerate the art and rebuild.
- **Fonts:** change `headFontFace` / `bodyFontFace` in `theme.json` and add the family under `pitch-deck/fonts/<FamilyNoSpaces>/`. Titles and serif stats follow `+mj-lt` automatically. Check the italic emphasis, which needs an italic face.
- **Regenerate art:** `python3 daybreak-metallic/art.py`, then rebuild. If you resize a dark card in `build.js`, change its inches in the `art.py` card list too, so the corners don't stretch.
- **Panel width:** change `PANEL` in `build.js` **and** `PANEL_IN` in `art.py` to the same value, regenerate the art, then check the slide 13 literal `0.55` and the panel text heights.
- **Add a slide:** `content("13 — LABEL", [["Plain "], ["emphasis", true]], "Section", "CONTENT" | "SPLIT_RIGHT" | "SPLIT_LEFT")`.
  - Lay out with `COL3`/`W3`, `COL4`/`W4`, or `R_W`/`L_X`/`L_W` with `PX`/`PW` for the panel.
  - Use `card()`, `tint()`, `num()` and `label()`, and `img()` for a dark card (add it to `art.py`).
  - For a closing slide, use `STATEMENT_DARK` with `titleRuns(parts, size, true)`.
  - Add a note too: the notes count check expects exactly 15, so update that check and `template/build.js` together.
- **Edit notes:** change the `addNotes("...")` strings in `template/build.js`. Every style that reads them picks up the change.
- **Preview:** `_shared/preview.sh daybreak-metallic [dpi]` (from `design-systems/`; needs LibreOffice and pdftoppm). It builds into `daybreak-metallic/preview/` and renders PNGs plus a PDF.

## Caveats

- **The art is raster.** Backgrounds, panels, dark cards, spheres and the ring are JPG/PNG, painted from `art.py` constants. They don't follow `theme.json` or PowerPoint's Design > Variants, and can't be recoloured in PowerPoint.
- **File size:** the built deck is about 2.9 MB (mostly the five 2000 px JPGs and four card PNGs).
- **Instrument Serif has only Regular and Italic.** Don't set `bold` on serif runs (the masters set `bold: false`), or PowerPoint will synthesise a fake bold.
- **Long titles wrap** to two lines in the 1.1 in title box. That's why the split layouts use a smaller title size (32/35 vs 38/41). Keep titles short, or check that line two doesn't collide with content at y ≈ 1.95.
- **Check text over art in preview.** That includes panel text against the metal in the lower third, the `SPLIT_RIGHT` footer and slide number, and white text on the dark cards near their bright bottom-edge ribbon. Re-seeding `art.py` moves ribbons.
