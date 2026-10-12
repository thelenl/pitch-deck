// Vault Engraving restyle of the pitch deck template.
// Same 15 slides, sections, placeholder text and speaker notes as ../../build.js; new look.
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(path.join(__dirname, "..", "_shared", "apply_theme.js"));
const { scrubImagePaths } = require(path.join(__dirname, "..", "_shared", "scrub_image_paths.js"));

const OUT = process.argv[2] || path.join(__dirname, "..", "..", "pitch-deck-vault-engraving.pptx");
const ART = path.join(__dirname, "art");
const A = (f) => path.join(ART, f);

// Speaker notes: reuse the original template's notes verbatim, in slide order.
const NOTES = [...fs.readFileSync(path.join(__dirname, "..", "template", "build.js"), "utf8").matchAll(/s\.addNotes\(("(?:[^"\\]|\\.)*")\);/g)].map((m) => JSON.parse(m[1]));
if (NOTES.length !== 15) throw new Error(`expected 15 notes, got ${NOTES.length}`);

const THEME = require("./theme.json"); // palette + fonts: edit theme.json
const H = THEME.colors;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.title = "Investor Pitch Deck Template";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const VAULT = C.text1, CREAM = C.background1, CARD = C.text2, MUTED = C.background2;
const GOLD = C.accent1, MINT = C.accent2, SAGE = C.accent4, LINE = C.accent5;
const SERIF = "+mj-lt"; // theme heading font (Fraunces)

// ---------- Layouts ----------
pres.defineSlideMaster({
  title: "TITLE_VAULT",
  background: { path: A("bg-title.jpg") },
  objects: [
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.8, y: 2.2, w: 6.5, h: 1.4, fontSize: 50, color: C.background1, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "tagline", type: "body", x: 0.8, y: 3.8, w: 6.3, h: 1.0, fontSize: 20, color: C.background2, valign: "top", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "meta", type: "body", x: 0.8, y: 6.35, w: 6.5, h: 0.4, fontSize: 13, color: C.accent4, valign: "top", margin: 0 }, text: "" } },
  ],
});

pres.defineSlideMaster({
  title: "CONTENT",
  background: { path: A("bg-content.jpg") },
  margin: [0.5, 0.6, 0.8, 0.6],
  objects: [
    { image: { x: 12.33, y: 0.45, w: 0.55, h: 0.55, path: A("seal.png"), altText: "Holographic seal" } },
    { placeholder: { options: { name: "eyebrow", type: "body", x: 0.6, y: 0.5, w: 9.0, h: 0.3, fontSize: 11, bold: true, color: C.accent1, charSpacing: 3, valign: "top", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.6, y: 0.85, w: 11.4, h: 1.0, fontSize: 28, color: C.background1, valign: "top", margin: 0 }, text: "" } },
    { text: { text: "[Company name] · Confidential", options: { x: 0.6, y: 6.88, w: 6.0, h: 0.28, fontSize: 10, color: C.accent4, margin: 0 } } },
  ],
  slideNumber: { x: 12.23, y: 6.88, w: 0.5, h: 0.28, fontSize: 10, color: C.accent1, align: "right", margin: 0 },
});

pres.defineSlideMaster({
  title: "STATEMENT_VAULT",
  background: { path: A("bg-statement.jpg") },
  objects: [
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.8, y: 1.8, w: 8.8, h: 2.3, fontSize: 40, color: C.background1, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "sub", type: "body", x: 0.8, y: 4.4, w: 8.8, h: 1.4, fontSize: 18, color: C.background2, valign: "top", margin: 0 }, text: "" } },
  ],
});

// ---------- Helpers ----------
const T = (slide, text, o) => slide.addText(text, { isTextBox: true, margin: 0, valign: "top", ...o });

// Engraved card: square corners, gold outer rule plus a fine inner rule (banknote frame).
// cream = "certificate" card: cream paper with a faint green guilloche watermark.
function card(slide, x, y, w, h, { cream = false, name, watermark = cream, dash } = {}) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h, fill: { color: cream ? CREAM : CARD },
    line: { color: GOLD, width: cream ? 1.25 : 0.75, ...(dash ? { dashType: dash } : {}) }, objectName: name,
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: x + 0.07, y: y + 0.07, w: w - 0.14, h: h - 0.14,
    line: { color: cream ? GOLD : LINE, width: 0.5, transparency: cream ? 40 : 0 }, objectName: `${name} inner rule`,
  });
  if (watermark) {
    const d = Math.min(w, h) * 0.95;
    slide.addImage({ path: A("rosette-green.png"), x: x + w - d * 0.75, y: y + (h - d) / 2, w: d, h: d, altText: "" });
  }
}

const ROMAN = ["I", "II", "III", "IV"];
// Engraved medallion: double gold ring with a serif roman numeral.
function medallion(slide, x, y, d, n) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: VAULT }, line: { color: GOLD, width: 1.25 } });
  slide.addShape(pres.shapes.OVAL, { x: x + 0.05, y: y + 0.05, w: d - 0.1, h: d - 0.1, line: { color: GOLD, width: 0.5, transparency: 45 } });
  T(slide, ROMAN[n - 1], { x, y, w: d, h: d, fontFace: SERIF, fontSize: Math.round(d * 26), color: GOLD, align: "center", valign: "middle" });
}

// Serial stamp, e.g. "No. 000417".
const serial = (slide, x, y, w, n, color = GOLD) =>
  T(slide, `No. ${String(n).padStart(6, "0")}`, { x, y, w, h: 0.25, fontSize: 9, color, charSpacing: 2, align: "right" });

// Heading + description in one box, so a wrapped heading pushes the description down.
const headDesc = (slide, h, d, o, hs = 18, ds = 14, hOpts = {}) => T(slide, [
  { text: h, options: { fontSize: hs, bold: true, color: CREAM, breakLine: true, ...hOpts } },
  { text: d, options: { fontSize: ds, color: MUTED, paraSpaceBefore: 6 } },
], o);

// Short gold rule under a numeral.
const rule = (slide, x, y, w = 0.6) => slide.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color: GOLD, width: 1.5 } });

// Small vault-coloured plate behind a label sitting on guilloche.
const plate = (slide, x, y, w, h, text, o = {}) => {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: VAULT }, line: { color: GOLD, width: 0.75 } });
  T(slide, text, { x, y, w, h, fontSize: 13, bold: true, color: GOLD, align: "center", valign: "middle", charSpacing: 2, ...o });
};

let note = 0;
const content = (eyebrow, title, section) => {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: section });
  s.addText(eyebrow, { placeholder: "eyebrow" });
  s.addText(title, { placeholder: "title" });
  return s;
};
const notes = (s) => s.addNotes(NOTES[note++]);

const COL3 = [0.6, 4.74, 8.88], W3 = 3.85;
const COL4 = [0.6, 3.705, 6.81, 9.915], W4 = 2.815;

// ---------- 1. Title ----------
pres.addSection({ title: "Intro" });
{
  const s = pres.addSlide({ masterName: "TITLE_VAULT", sectionTitle: "Intro" });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 0.75, w: 1.6, h: 0.8, line: { color: GOLD, width: 1, dashType: "dash" }, objectName: "Logo placeholder" });
  T(s, "[Logo]", { x: 0.8, y: 0.75, w: 1.6, h: 0.8, fontSize: 12, color: GOLD, align: "center", valign: "middle" });
  serial(s, 4.9, 0.95, 2.3, 1);
  s.addText("[Company name]", { placeholder: "title" });
  s.addText("[One-liner: We help (who) do (what) by (how)]", { placeholder: "tagline" });
  // Gold engraved plate for the raise
  s.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 5.1, w: 6.0, h: 0.6, fill: { color: GOLD }, line: { type: "none" }, objectName: "Raise plate" });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.86, y: 5.16, w: 5.88, h: 0.48, line: { color: VAULT, width: 0.5, transparency: 30 }, objectName: "Raise plate rule" });
  T(s, "Raising $[X]M · [Pre-seed / Seed / Series A]", { x: 0.8, y: 5.1, w: 6.0, h: 0.6, fontSize: 14, bold: true, color: VAULT, align: "center", valign: "middle" });
  s.addText("[Founder name], [Title]  ·  [email@company.com]  ·  [Month YYYY]", { placeholder: "meta" });
  notes(s);
}

// ---------- 2. Problem ----------
pres.addSection({ title: "Opportunity" });
{
  const s = content("No. 01  ·  THE PROBLEM", "[Target customers] struggle to [do X], and it costs them [time / money]", "Opportunity");
  const rows = [
    ["[Pain point 1]", "[Who feels it, how often, and what it costs them]"],
    ["[Pain point 2]", "[Make it concrete: a real customer story beats an abstract claim]"],
    ["How it's handled today: [current workaround]", "[Spreadsheets, manual work, legacy tools, and why they fall short]"],
  ];
  rows.forEach(([h, d], i) => {
    const y = 2.05 + i * 1.5;
    medallion(s, 0.6, y, 0.6, i + 1);
    headDesc(s, h, d, { x: 1.45, y: y + 0.04, w: 6.3, h: 1.35 });
  });
  card(s, 8.1, 2.0, 4.63, 4.4, { cream: true, name: "Stat certificate" });
  serial(s, 10.2, 2.25, 2.25, 417, CARD);
  T(s, "[XX%]", { x: 8.5, y: 2.55, w: 3.9, h: 1.2, fontFace: SERIF, fontSize: 66, color: VAULT });
  rule(s, 8.5, 3.9, 0.8);
  T(s, "of [target customers] [experience this pain / lose $X per year to it]", { x: 8.5, y: 4.1, w: 3.8, h: 1.3, fontSize: 17, color: CARD });
  T(s, "Source: [citation]", { x: 8.5, y: 5.8, w: 3.8, h: 0.3, fontSize: 11, italic: true, color: CARD });
  notes(s);
}

// ---------- 3. Solution ----------
{
  const s = content("No. 02  ·  THE SOLUTION", "[Product] lets [customer] [achieve outcome] in [time] instead of [time]", "Opportunity");
  card(s, 0.6, 2.0, 5.4, 3.4, { name: "Today card" });
  T(s, "TODAY", { x: 0.95, y: 2.3, w: 4.7, h: 0.3, fontSize: 12, bold: true, color: MUTED, charSpacing: 3 });
  T(s, [
    { text: "[Slow / manual step]", options: { bullet: true, breakLine: true } },
    { text: "[Costly or error-prone step]", options: { bullet: true, breakLine: true } },
    { text: "[The outcome customers settle for]", options: { bullet: true } },
  ], { x: 0.95, y: 2.8, w: 4.7, h: 2.3, fontSize: 16, color: CREAM, paraSpaceAfter: 10 });

  s.addShape(pres.shapes.RIGHT_ARROW, { x: 6.25, y: 3.4, w: 0.8, h: 0.6, fill: { color: GOLD }, line: { type: "none" } });

  card(s, 7.3, 2.0, 5.43, 3.4, { cream: true, name: "With product certificate" });
  T(s, "WITH [PRODUCT]", { x: 7.65, y: 2.3, w: 4.7, h: 0.3, fontSize: 12, bold: true, color: VAULT, charSpacing: 3 });
  T(s, [
    { text: "[What becomes fast or automatic]", options: { bullet: true, breakLine: true } },
    { text: "[Measurable gain: X× faster, $Y saved]", options: { bullet: true, breakLine: true } },
    { text: "[A new outcome that wasn't possible before]", options: { bullet: true } },
  ], { x: 7.65, y: 2.8, w: 4.75, h: 2.3, fontSize: 16, color: VAULT, paraSpaceAfter: 10 });

  card(s, 0.6, 5.7, 12.13, 0.85, { name: "Insight card" });
  T(s, [
    { text: "Our insight: ", options: { bold: true, color: GOLD } },
    { text: "[The non-obvious thing you understand about this problem that others miss]", options: { color: CREAM } },
  ], { x: 0.95, y: 5.7, w: 11.5, h: 0.85, fontSize: 16, valign: "middle" });
  notes(s);
}

// ---------- 4. Product ----------
{
  const s = content("No. 03  ·  PRODUCT", "[How it works: the product in one sentence]", "Opportunity");
  card(s, 0.6, 1.95, 7.4, 4.7, { name: "Screenshot placeholder", dash: "dash" });
  T(s, "[Product screenshot, mockup, or demo GIF]", { x: 0.6, y: 1.95, w: 7.4, h: 4.7, fontSize: 16, color: MUTED, align: "center", valign: "middle" });
  [1, 2, 3].forEach((n, i) => {
    const y = 2.0 + i * 1.6;
    medallion(s, 8.4, y, 0.55, n);
    headDesc(s, `[Key feature ${n}]`, "[What it does and why the user cares]", { x: 9.2, y: y + 0.05, w: 3.53, h: 1.4 });
  });
  notes(s);
}

// ---------- 5. Why now ----------
{
  const s = content("No. 04  ·  WHY NOW", "Why now: [the shift that makes this possible today]", "Opportunity");
  const cards = [
    ["TECHNOLOGY", "[What changed in the tech]"],
    ["MARKET / BEHAVIOR", "[What changed in how people buy or work]"],
    ["REGULATION / COST", "[What changed in rules or costs]"],
  ];
  cards.forEach(([label, head], i) => {
    const x = COL3[i];
    card(s, x, 2.0, W3, 3.9, { name: `Why now card ${i + 1}` });
    medallion(s, x + 0.35, 2.35, 0.7, i + 1);
    T(s, label, { x: x + 0.35, y: 3.3, w: W3 - 0.7, h: 0.3, fontSize: 12, bold: true, color: GOLD, charSpacing: 3 });
    headDesc(s, head, "[Why this makes your solution possible, or necessary, now and not 5 years ago]", { x: x + 0.35, y: 3.7, w: W3 - 0.7, h: 2.05 }, 20, 14);
  });
  notes(s);
}

// ---------- 6. Market ----------
{
  const s = content("No. 05  ·  MARKET SIZE", "A $[X]B market, and we can win $[Y]M of it in [N] years", "Opportunity");
  const cx = 3.15;
  s.addImage({ path: A("rosette-gold.png"), x: cx - 2.25, y: 1.95, w: 4.5, h: 4.5, altText: "Guilloche rosette representing the total addressable market" });
  s.addShape(pres.shapes.OVAL, { x: cx - 1.6, y: 3.25, w: 3.2, h: 3.2, fill: { color: CARD }, line: { color: GOLD, width: 1 }, objectName: "SAM circle" });
  s.addShape(pres.shapes.OVAL, { x: cx - 0.95, y: 4.55, w: 1.9, h: 1.9, fill: { color: GOLD }, line: { type: "none" }, objectName: "SOM circle" });
  s.addShape(pres.shapes.OVAL, { x: cx - 0.89, y: 4.61, w: 1.78, h: 1.78, line: { color: VAULT, width: 0.5, transparency: 40 }, objectName: "SOM inner rule" });
  plate(s, cx - 0.5, 2.35, 1.0, 0.38, "TAM");
  T(s, "SAM", { x: cx - 1, y: 3.7, w: 2, h: 0.4, fontSize: 15, bold: true, color: CREAM, align: "center", charSpacing: 2 });
  T(s, "SOM", { x: cx - 1, y: 5.3, w: 2, h: 0.4, fontSize: 15, bold: true, color: VAULT, align: "center", charSpacing: 2 });

  const rows = [
    ["$[X]B", "Total addressable market (TAM)", "[Everyone who could ever buy this × annual spend]"],
    ["$[X]B", "Serviceable market (SAM)", "[The segment you can reach with today's product and channels]"],
    ["$[X]M", "Obtainable in [3–5] years (SOM)", "[The realistic share you can win: the number to defend]"],
  ];
  rows.forEach(([v, l, d], i) => {
    const y = 2.0 + i * 1.3;
    T(s, v, { x: 6.1, y: y - 0.05, w: 2.2, h: 0.7, fontFace: SERIF, fontSize: 34, color: i === 2 ? GOLD : CREAM });
    T(s, l, { x: 8.45, y: y + 0.02, w: 4.28, h: 0.35, fontSize: 16, bold: true, color: CREAM });
    T(s, d, { x: 8.45, y: y + 0.42, w: 4.28, h: 0.7, fontSize: 14, color: MUTED });
  });
  card(s, 6.1, 5.8, 6.63, 0.75, { name: "Bottom-up math" });
  T(s, [
    { text: "Bottom-up: ", options: { bold: true, color: GOLD } },
    { text: "[# target customers] × $[annual contract value] = $[SAM]", options: { color: CREAM } },
  ], { x: 6.35, y: 5.8, w: 6.2, h: 0.75, fontSize: 13, valign: "middle" });
  notes(s);
}

// ---------- 7. Business model ----------
pres.addSection({ title: "Business" });
{
  const s = content("No. 06  ·  BUSINESS MODEL", "We charge [customer] [$X per unit]: [pricing model in one line]", "Business");
  const tiers = [["[TIER 1]", "$[X]"], ["[TIER 2]", "$[X]"], ["[TIER 3]", "$[X]"]];
  tiers.forEach(([name, price], i) => {
    const x = COL3[i], hi = i === 1;
    card(s, x, 1.95, W3, 2.15, { cream: hi, name: `Pricing tier ${i + 1}` });
    T(s, name, { x: x + 0.35, y: 2.2, w: W3 - 0.7, h: 0.3, fontSize: 12, bold: true, color: hi ? VAULT : GOLD, charSpacing: 3 });
    T(s, [
      { text: price, options: { fontFace: SERIF, fontSize: 36 } },
      { text: "  / [user · month]", options: { fontSize: 14 } },
    ], { x: x + 0.35, y: 2.5, w: W3 - 0.7, h: 0.75, color: hi ? VAULT : CREAM, valign: "bottom" });
    T(s, "[Who it's for and what's included]", { x: x + 0.35, y: 3.4, w: W3 - 0.7, h: 0.5, fontSize: 14, color: hi ? CARD : MUTED });
  });
  T(s, "UNIT ECONOMICS", { x: 0.6, y: 4.38, w: 6, h: 0.3, fontSize: 12, bold: true, color: GOLD, charSpacing: 3 });
  const tiles = [["$[X]", "Avg. contract value (ACV)"], ["[X]%", "Gross margin"], ["[N] mo", "CAC payback period"], ["[X]:1", "LTV : CAC"]];
  tiles.forEach(([v, l], i) => {
    const x = COL4[i];
    card(s, x, 4.75, W4, 1.65, { name: `Unit economics ${i + 1}` });
    serial(s, x + W4 - 1.75, 4.88, 1.5, i + 1);
    T(s, v, { x: x + 0.3, y: 5.0, w: W4 - 0.6, h: 0.6, fontFace: SERIF, fontSize: 30, color: CREAM });
    rule(s, x + 0.3, 5.68, 0.45);
    T(s, l, { x: x + 0.3, y: 5.82, w: W4 - 0.6, h: 0.4, fontSize: 13, color: MUTED });
  });
  notes(s);
}

// ---------- 8. Traction ----------
{
  const s = content("No. 07  ·  TRACTION", "[Key metric] grew [X]× in [N] months", "Business");
  card(s, 0.6, 1.95, 7.7, 4.65, { name: "Chart frame" });
  s.addChart(pres.charts.BAR, [{ name: "[Metric]", labels: ["[M1]", "[M2]", "[M3]", "[M4]", "[M5]", "[M6]"], values: [10, 14, 19, 26, 34, 45] }], {
    x: 0.85, y: 2.1, w: 7.2, h: 4.35, barDir: "col", barGapWidthPct: 55,
    chartColors: [H.accent1], showLegend: false,
    showTitle: true, title: "[Revenue / users] by month (sample data: replace)", titleFontSize: 14, titleColor: H.lt2, titleFontFace: "+mn-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: H.lt1, dataLabelFontFace: "+mn-lt",
    catAxisLabelColor: H.lt2, catAxisLabelFontSize: 12, catAxisLabelFontFace: "+mn-lt", catAxisLineShow: false,
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
  });
  const tiles = [["$[X]", "Monthly recurring revenue"], ["[X]%", "Month-over-month growth"], ["[X]%", "Net revenue retention"]];
  tiles.forEach(([v, l], i) => {
    const y = 1.95 + i * 1.6, hi = i === 0;
    card(s, 8.6, y, 4.13, 1.45, { cream: hi, name: `Traction stat ${i + 1}` });
    serial(s, 10.9, y + 0.15, 1.6, 100 + i + 1, hi ? CARD : GOLD);
    T(s, v, { x: 8.95, y: y + 0.18, w: 3.0, h: 0.65, fontFace: SERIF, fontSize: 34, color: hi ? VAULT : CREAM });
    T(s, l, { x: 8.95, y: y + 0.9, w: 3.5, h: 0.35, fontSize: 14, color: hi ? CARD : MUTED });
  });
  notes(s);
}

// ---------- 9. Competition ----------
{
  const s = content("No. 08  ·  COMPETITION", "[Company] is the only [category] that [key differentiator]", "Business");
  T(s, "↑  [Y axis: e.g., Depth / power]", { x: 1.0, y: 1.95, w: 6, h: 0.3, fontSize: 12, color: MUTED });
  card(s, 1.0, 2.3, 6.0, 3.9, { name: "Matrix background" });
  s.addShape(pres.shapes.LINE, { x: 4.0, y: 2.37, w: 0, h: 3.76, line: { color: GOLD, width: 0.75, transparency: 40 } });
  s.addShape(pres.shapes.LINE, { x: 1.07, y: 4.25, w: 5.86, h: 0, line: { color: GOLD, width: 0.75, transparency: 40 } });
  T(s, "[X axis: e.g., Ease of use]  →", { x: 1.0, y: 6.3, w: 6, h: 0.3, fontSize: 12, color: MUTED, align: "right" });
  // You: the holographic seal
  s.addImage({ path: A("seal.png"), x: 6.1, y: 2.5, w: 0.6, h: 0.6, altText: "Your company" });
  T(s, "[Your company]", { x: 4.1, y: 2.57, w: 1.9, h: 0.45, fontSize: 14, bold: true, color: CREAM, align: "right", valign: "middle" });
  [[1.4, 2.9, "[Competitor A]"], [4.5, 4.8, "[Competitor B]"], [1.4, 5.3, "[Competitor C]"]].forEach(([x, y, n]) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: 0.35, h: 0.35, fill: { color: SAGE }, line: { type: "none" } });
    T(s, n, { x: x + 0.5, y, w: 1.9, h: 0.35, fontSize: 13, color: MUTED, valign: "middle" });
  });
  T(s, "WHY WE WIN", { x: 7.6, y: 2.3, w: 5, h: 0.3, fontSize: 12, bold: true, color: GOLD, charSpacing: 3 });
  [1, 2, 3].forEach((n, i) => {
    const y = 2.8 + i * 1.2;
    medallion(s, 7.6, y, 0.5, n);
    headDesc(s, `[Unfair advantage ${n}]`, "[e.g., proprietary data, network effects, distribution, deep tech]", { x: 8.35, y: y + 0.04, w: 4.38, h: 1.1 }, 16, 13);
  });
  notes(s);
}

// ---------- 10. Go-to-market ----------
{
  const s = content("No. 09  ·  GO-TO-MARKET", "How we reach customers: [primary channel]", "Business");
  const steps = [["STEP 1 · LAND", "[e.g., Founder-led sales to 10 design partners]"], ["STEP 2 · EXPAND", "[e.g., Referrals and upsell within accounts]"], ["STEP 3 · SCALE", "[e.g., Inside sales team + partner channel]"]];
  steps.forEach(([label, head], i) => {
    const x = COL3[i];
    medallion(s, x, 2.0, 0.75, i + 1);
    if (i < 2) s.addShape(pres.shapes.LINE, { x: x + 0.9, y: 2.375, w: COL3[i + 1] - x - 1.05, h: 0, line: { color: GOLD, width: 1, dashType: "sysDot", endArrowType: "triangle" } });
    T(s, label, { x, y: 2.98, w: W3 - 0.2, h: 0.3, fontSize: 12, bold: true, color: GOLD, charSpacing: 3 });
    headDesc(s, head, "[Timing, target, and what success looks like]", { x, y: 3.32, w: W3 - 0.2, h: 1.6 });
  });
  const cards = [["Ideal customer", "[Industry, company size, buyer title]"], ["Sales motion", "[Self-serve · Product-led · Sales-led]"], ["Proof it works", "[CAC by channel, conversion rate, pipeline]"]];
  cards.forEach(([h, d], i) => {
    const x = COL3[i];
    card(s, x, 5.1, W3, 1.45, { name: `GTM card ${i + 1}` });
    T(s, h, { x: x + 0.3, y: 5.3, w: W3 - 0.6, h: 0.35, fontFace: SERIF, fontSize: 17, color: GOLD });
    T(s, d, { x: x + 0.3, y: 5.72, w: W3 - 0.6, h: 0.6, fontSize: 14, color: CREAM });
  });
  notes(s);
}

// ---------- 11. Team ----------
pres.addSection({ title: "Team & Financials" });
{
  const s = content("No. 10  ·  TEAM", "Why us: [the unfair advantage this team brings]", "Team & Financials");
  [1, 2, 3, 4].forEach((n, i) => {
    const x = COL4[i];
    card(s, x, 1.95, W4, 3.95, { name: `Team card ${n}` });
    // Portrait medallion: guilloche ring around the photo, like a banknote portrait
    s.addImage({ path: A("rosette-gold.png"), x: x + 0.25, y: 2.1, w: 1.75, h: 1.75, altText: "" });
    s.addShape(pres.shapes.OVAL, { x: x + 0.5, y: 2.35, w: 1.25, h: 1.25, fill: { color: VAULT }, line: { color: GOLD, width: 1.25 } });
    T(s, "[Photo]", { x: x + 0.5, y: 2.35, w: 1.25, h: 1.25, fontSize: 11, color: MUTED, align: "center", valign: "middle" });
    T(s, "[Name]", { x: x + 0.3, y: 4.0, w: W4 - 0.6, h: 0.42, fontFace: SERIF, fontSize: 20, color: CREAM });
    T(s, "[Role]", { x: x + 0.3, y: 4.42, w: W4 - 0.6, h: 0.32, fontSize: 13, bold: true, color: GOLD, charSpacing: 1 });
    T(s, "[Prior company, exit, or domain expertise: why you're the one to build this]", { x: x + 0.3, y: 4.82, w: W4 - 0.6, h: 0.95, fontSize: 13, color: MUTED });
  });
  T(s, [
    { text: "Advisors & investors: ", options: { bold: true, color: GOLD } },
    { text: "[Name (credential)]  ·  [Name (credential)]  ·  [Name (credential)]", options: { color: CREAM } },
  ], { x: 0.6, y: 6.1, w: 12.13, h: 0.45, fontSize: 14, valign: "middle" });
  notes(s);
}

// ---------- 12. Financials ----------
{
  const s = content("No. 11  ·  FINANCIALS", "Path to $[X]M revenue by [year]", "Team & Financials");
  const hdr = (t) => ({ text: t, options: { bold: true, color: VAULT, fill: { color: GOLD }, align: t ? "center" : "left" } });
  const years = ["[Year 1]", "[Year 2]", "[Year 3]", "[Year 4]", "[Year 5]"];
  const rowsDef = [["Revenue", "$[ ]"], ["Gross margin", "[ ]%"], ["Operating expenses", "$[ ]"], ["Net burn / EBITDA", "$[ ]"], ["Ending cash", "$[ ]"], ["Headcount", "[ ]"]];
  const rows = [[hdr(""), ...years.map(hdr)]];
  rowsDef.forEach(([label, v], r) => {
    const fill = { color: r % 2 ? VAULT : CARD };
    rows.push([{ text: label, options: { bold: true, color: CREAM, fill } }, ...years.map(() => ({ text: v, options: { color: MUTED, align: "center", fill } }))]);
  });
  s.addTable(rows, { x: 0.6, y: 1.95, w: 12.13, colW: [3.13, 1.8, 1.8, 1.8, 1.8, 1.8], rowH: 0.42, fontSize: 14, valign: "middle", border: { type: "solid", pt: 0.75, color: H.accent5 }, margin: [0, 0.12, 0, 0.12] });
  card(s, 0.6, 5.2, 12.13, 1.4, { name: "Assumptions card" });
  T(s, "KEY ASSUMPTIONS", { x: 0.9, y: 5.38, w: 6, h: 0.3, fontSize: 12, bold: true, color: GOLD, charSpacing: 3 });
  T(s, [
    { text: "[Growth rate and what drives it]", options: { bullet: true, breakLine: true } },
    { text: "[Pricing, churn, and sales capacity assumptions]", options: { bullet: true, breakLine: true } },
    { text: "[When you reach breakeven, or what the next round funds]", options: { bullet: true } },
  ], { x: 0.9, y: 5.72, w: 11.5, h: 0.8, fontSize: 14, color: CREAM });
  notes(s);
}

// ---------- 13. The ask ----------
{
  const s = content("No. 12  ·  THE ASK", "We're raising $[X]M to reach [milestone] in [N] months", "Team & Financials");
  card(s, 0.6, 1.95, 4.6, 4.6, { cream: true, name: "Raise certificate" });
  serial(s, 2.7, 2.2, 2.25, 1, CARD);
  T(s, "RAISING", { x: 1.0, y: 2.4, w: 3.8, h: 0.3, fontSize: 12, bold: true, color: VAULT, charSpacing: 3 });
  T(s, "$[X]M", { x: 1.0, y: 2.75, w: 3.8, h: 1.2, fontFace: SERIF, fontSize: 66, color: VAULT });
  rule(s, 1.0, 4.1, 0.8);
  T(s, [
    { text: "[SAFE / priced round]", options: { breakLine: true } },
    { text: "[Pre-seed / Seed / Series A]", options: { breakLine: true } },
    { text: "[$X committed · Lead: (name)]" },
  ], { x: 1.0, y: 4.3, w: 3.8, h: 1.8, fontSize: 16, color: CARD, paraSpaceAfter: 8 });

  s.addChart(pres.charts.DOUGHNUT, [{ name: "Use of funds", labels: ["Product & engineering", "Sales & marketing", "Operations & G&A", "[Other]"], values: [25, 25, 25, 25] }], {
    x: 5.6, y: 1.9, w: 7.13, h: 2.85, holeSize: 58,
    chartColors: [H.accent1, H.accent2, H.accent3, H.accent4],
    showTitle: true, title: "Use of funds (placeholder split: replace)", titleFontSize: 14, titleColor: H.lt2, titleFontFace: "+mn-lt",
    showLegend: true, legendPos: "r", legendFontSize: 13, legendColor: H.lt1, legendFontFace: "+mn-lt",
    showPercent: true, showValue: false, dataLabelColor: H.dk1, dataLabelFontSize: 11, dataLabelFontFace: "+mn-lt",
  });
  const ms = [["MILESTONE 1", "[e.g., $1M ARR]", "[by month N]"], ["MILESTONE 2", "[e.g., 50 logos]", "[by month N]"], ["RUNWAY", "[N] months", "[to Series X metrics]"]];
  const mw = (7.13 - 0.5) / 3;
  ms.forEach(([l, h, d], i) => {
    const x = 5.6 + i * (mw + 0.25);
    card(s, x, 4.95, mw, 1.6, { name: `Milestone ${i + 1}` });
    T(s, l, { x: x + 0.22, y: 5.1, w: mw - 0.44, h: 0.3, fontSize: 11, bold: true, color: GOLD, charSpacing: 3 });
    headDesc(s, h, d, { x: x + 0.22, y: 5.42, w: mw - 0.4, h: 1.0 }, 15, 12, { bold: false, fontFace: SERIF });
  });
  notes(s);
}

// ---------- 14. Vision / close ----------
pres.addSection({ title: "Close" });
{
  const s = pres.addSlide({ masterName: "STATEMENT_VAULT", sectionTitle: "Close" });
  s.addText("[Your vision in one bold sentence: what the world looks like if you win]", { placeholder: "title" });
  s.addText("[Founder name]  ·  [email@company.com]  ·  [phone]  ·  [company.com]", { placeholder: "sub" });
  notes(s);
}

// ---------- 15. Appendix ----------
{
  const s = pres.addSlide({ masterName: "STATEMENT_VAULT", sectionTitle: "Close" });
  s.addText("Appendix", { placeholder: "title" });
  s.addText("[Detailed financials  ·  Cohort and retention data  ·  Customer case studies  ·  Technical architecture  ·  Product roadmap  ·  Cap table]", { placeholder: "sub" });
  notes(s);
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  await scrubImagePaths(OUT);
  console.log("wrote", OUT);
})();
