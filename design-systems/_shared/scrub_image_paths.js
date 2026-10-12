// pptxgenjs fills an image's alt text (descr) with its local file path when altText is "".
// That path would ship inside the deck, so blank it out (decorative images get descr="").
const fs = require("fs");
const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));

async function scrubImagePaths(file) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  let n = 0;
  for (const name of Object.keys(zip.files)) {
    if (!/^ppt\/(slides|slideLayouts|slideMasters)\/[^/]+\.xml$/.test(name)) continue;
    const xml = await zip.file(name).async("string");
    const out = xml.replace(/descr="(?:\/|[A-Za-z]:\\)[^"]*"/g, () => (n++, 'descr=""'));
    if (out !== xml) zip.file(name, out);
  }
  if (n) fs.writeFileSync(file, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  return n;
}
module.exports = { scrubImagePaths };
