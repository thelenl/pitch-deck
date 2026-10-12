# Pitch deck design systems

Each folder holds one visual style for the same 15-slide investor deck (Sequoia/YC flow). A style builds `../pitch-deck-<style>.pptx`. Every folder contains:

| File | What it is |
|---|---|
| `build.js` | pptxgenjs script: layouts, helpers and all 15 slides |
| `theme.json` | Theme colour slots plus heading and body fonts. Change the palette or fonts here |
| `DESIGN.md` | The design-system doc: palette roles, type scale, layouts, components, art and how to change them |
| `*.py` + art files | Generators for images pptxgenjs can't draw (glows, gradients, guilloche patterns). Only some styles have these |

| Style | Look | Fonts |
|---|---|---|
| `template` | The original: charcoal + brick orange, clean cards | Arial, Calibri |
| `liquid-glass` | Dark, metallic gradient orbs, frosted-glass cards | Inter Tight, Inter |
| `terminal-ledger` | Black terminal, phosphor-green mono data, ledger tables | Geist Mono, Geist |
| `vault-engraving` | Vault green + gold, guilloche patterns, holographic seals | Fraunces, IBM Plex Sans |
| `acid-editorial` | Bone + ink, lime highlighter, editorial type | Inter Tight, Inter |
| `neo-brutal` | Cream, thick outlines, hard shadows, colour blocks | Archivo Black, Space Grotesk, Space Mono |
| `ember-grid` | Swiss grid, orange, stepped colour bars | Archivo Black, Archivo |
| `daybreak` | Light pastel washes, rising value curve, serif-italic accents | Sora, Inter, Instrument Serif |
| `daybreak-silk` | Daybreak made sensuous: draped silk ribbons, warm pearl/blush, serif display, grain | Instrument Serif, Inter |
| `daybreak-metallic` | Silk made metallic: liquid-metal ribbons, dark plum split panels, chrome spheres, fuller layouts | Instrument Serif, Inter |

## Setup (once)

```bash
cd design-systems
npm install                      # pptxgenjs 4.0.1
pip install pillow numpy         # only for regenerating art
```

Fonts are in `../fonts/`. Install the families a style uses so PowerPoint renders it as designed. PowerPoint does not embed them, so the presenting machine needs them too. Use the files in each family's `static/` folder where there is one.

## Build

```bash
npm run build:daybreak           # or: node daybreak/build.js [output.pptx]
npm run build:all                # every style
```

With no argument, a build **overwrites** `../pitch-deck-<style>.pptx`. Pass an output path to build somewhere else. Each build runs two shared steps: `_shared/apply_theme.js` writes `theme.json`'s colours into the deck's theme, and `_shared/scrub_image_paths.js` strips local file paths from image alt text. Without the scrub, pptxgenjs embeds the file paths in the deck.

## Preview

```bash
_shared/preview.sh daybreak [dpi]   # → daybreak/preview/slide-NN.png + PDF
```

This needs LibreOffice and `pdftoppm`. It renders with the fonts in `../fonts` through `_shared/fonts.conf`, so nothing has to be installed system-wide.

## Iterating

- **Palette or fonts:** edit `theme.json`, then also edit the hard-coded hexes listed under "Off-theme colours" in that style's `DESIGN.md`.
- **Art:** tweak the style's `.py` generator, rerun it from inside the folder, then rebuild.
- **Content:** placeholder text and speaker notes are written out in each `build.js`. `ember-grid`, `vault-engraving` and `daybreak-metallic` read their notes from `template/build.js`, so edit the notes there.
- **New style:** copy the closest folder, rename it, edit `theme.json` and the helpers, add a `build:<name>` script to `package.json`, and write its `DESIGN.md`.
- **pptxgenjs gotchas:** hex colours never take a `#`. Never reuse an options or shadow object across two calls, because pptxgenjs mutates them. Gradients and glows have to be images. Check results with `_shared/preview.sh`.
