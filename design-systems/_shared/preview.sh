#!/usr/bin/env bash
# Build one style into <style>/preview/ and render every slide to PNG (plus a PDF).
# Usage: _shared/preview.sh <style> [dpi]      (run from design-systems/)
# Needs: node, LibreOffice (soffice), pdftoppm. Set SOFFICE to override the soffice command.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
root="$(dirname "$here")"
style="${1:?usage: preview.sh <style> [dpi]}"
dpi="${2:-80}"
[ -f "$root/$style/build.js" ] || { echo "no such style: $style" >&2; exit 1; }
out="$root/$style/preview"
rm -rf "$out" && mkdir -p "$out"
node "$root/$style/build.js" "$out/$style.pptx"
FONTCONFIG_FILE="$here/fonts.conf" ${SOFFICE:-soffice} --headless --convert-to pdf --outdir "$out" "$out/$style.pptx" >/dev/null
pdftoppm -png -r "$dpi" "$out/$style.pdf" "$out/slide"
echo "Preview: $out ($(ls "$out"/slide-*.png | wc -l) slides)"
