# Pitch deck: guide for agents

This is the investor pitch deck for a fintech + AI startup. The decks are **generated**: every `pitch-deck-*.pptx` in the root is built by a pptxgenjs script in `design-systems/<style>/build.js`. Change the scripts, never the .pptx files.

## Status (update this section as decisions are made)

- **Content:** 15-slide skeleton following the Sequoia/YC flow. All copy is still `[bracketed placeholders]`. Speaker notes on every slide explain what investors look for there.
- **Style:** not chosen yet. There are eight candidates (see below). The user's latest steer is "innovation", "value creation", "the light airiness of AI" and "future-forward tech". `daybreak` was built for that steer.
- **Pending:** the founders want a change to the team slide (slide 11, "10 · TEAM"). The specifics haven't been given, so ask before changing it.
- `pitch-deck-template.pptx` is the original baseline. Keep its design as is unless told otherwise.

## Layout

```
pitch-deck-<style>.pptx      build outputs (committed so humans can open them)
design-systems/
  README.md                  human overview: setup, build, preview, iterating
  package.json               npm run build:<style> | build:all
  _shared/                   apply_theme.js, scrub_image_paths.js, preview.sh, fonts.conf
  <style>/                   build.js, theme.json, DESIGN.md, optional art (*.py + png/jpg)
fonts/<Family>/              Google Fonts (OFL) used by the styles; static/ = per-weight files
```

Styles: `template`, `liquid-glass`, `terminal-ledger`, `vault-engraving`, `acid-editorial`, `neo-brutal`, `ember-grid` and `daybreak`. Each one's `DESIGN.md` is the design system: palette roles, off-theme hexes, type scale, layouts, helper components, art, a slide-by-slide breakdown and recipes. **Read the style's DESIGN.md before editing its build.js.**

## Commands (run from `design-systems/`)

```bash
npm install                          # once (pptxgenjs 4.0.1)
npm run build:<style>                # rebuild ../pitch-deck-<style>.pptx (overwrites it)
node <style>/build.js /tmp/x.pptx    # build somewhere else instead
_shared/preview.sh <style> [dpi]     # → <style>/preview/slide-NN.png (gitignored), rendered with ../fonts
python3 <style>/<art>.py             # regenerate a style's art (needs pillow, numpy)
```

`preview.sh` needs LibreOffice (`soffice`) and `pdftoppm`. Set `SOFFICE=...` if `soffice` isn't on PATH.

## How to work here

1. **Verify visually.** After any change, run `preview.sh` and look at the PNGs of the slides you touched. Check for text overflow, overlap, wrapped numbers and contrast. A build that runs is not proof the slide looks right.
2. **Content changes usually touch every style.** Slide copy and placeholders are duplicated in each `build.js`. Speaker notes live in different places depending on the style:
   - `template`, `liquid-glass`, `neo-brutal`, `daybreak`: inline in `build.js`.
   - `acid-editorial`, `terminal-ledger`: in their own `notes.json`.
   - `ember-grid`, `vault-engraving`: read from `template/build.js`, so edit them there.

   If the user has chosen a single style, only change that one, and say so.
3. **Palette and fonts:** edit `theme.json`, then the "Off-theme colours" listed in that style's `DESIGN.md` (hard-coded hexes in `build.js` and the art scripts).
4. **Rebuild the decks you changed and commit the scripts and the .pptx together.** A .pptx can't be merged. On a conflict, take either side and rebuild from the merged scripts.
5. **Keep placeholder conventions.** Fill-ins use `[square brackets]`, and the founders find unfinished items by searching for `[`. Never invent statistics, quotes, customers or financials; leave a placeholder and ask.

## pptxgenjs gotchas (these have bitten this repo)

- Hex colours never take a `#` and are always 6 digits. `#` or 8-digit hex corrupts the file.
- Never reuse an options or `shadow` object across calls. pptxgenjs mutates them; build a fresh object each time.
- Images with `altText: ""` get their **local file path** written as alt text. `_shared/scrub_image_paths.js` blanks these out on every build; keep that call after `applyTheme` in any new build script.
- Gradients, glows and blur aren't supported, so pre-render them as PNG/JPG with the style's art script.
- Use `charSpacing`, not `letterSpacing`. Use `bullet: true`, never a literal "•". Every text box needs `isTextBox: true`.
- On a stacked chart, `dataLabelPosition: "outEnd"` corrupts the file.
- Theme colours only apply because `_shared/apply_theme.js` runs after `writeFile`; keep it.
- Fonts aren't embedded in the .pptx. PowerPoint needs the families installed (from `fonts/`), or else present from a PDF.

## Ground rules

- This is confidential investor material. Don't upload decks, scripts or content to external services (published artifacts, file-sharing, design tools) unless the user explicitly asks.
- Keep everything as local files in this repo.
- Don't add new dependencies without a reason; the toolchain is node + pptxgenjs, plus python/pillow/numpy for art.
