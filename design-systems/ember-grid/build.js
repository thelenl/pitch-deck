// Ember Grid: Swiss precision with heat. Same 15 slides, placeholders and notes as the base template.
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(path.join(__dirname, "..", "_shared", "apply_theme.js"));
const { scrubImagePaths } = require(path.join(__dirname, "..", "_shared", "scrub_image_paths.js"));

const OUT = process.argv[2] || path.join(__dirname, "..", "..", "pitch-deck-ember-grid.pptx");

// Speaker notes, verbatim from the base template's generator, in slide order
const ORIG = fs.readFileSync(path.join(__dirname, "..", "template", "build.js"), "utf8");
const NOTES = [...ORIG.matchAll(/addNotes\(("(?:[^"\\]|\\.)*")\)/g)].map((m) => JSON.parse(m[1]));
if (NOTES.length !== 15) throw new Error(`expected 15 notes, got ${NOTES.length}`);
let noteIdx = 0;
const notes = (s) => s.addNotes(NOTES[noteIdx++]);

const THEME = require("./theme.json"); // palette + fonts: edit theme.json
const H = THEME.colors;
const HEAD = "+mj-lt"; // theme heading font (Archivo Black) for numerals and display text

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.title = "Investor Pitch Deck Template";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;

// ---------- Grid ----------
const GX = 0.6, GW = 12.13, NCOL = 12;
const colX = (i) => GX + (GW * i) / NCOL; // left edge of column i (0..12)
const gridLines = (color, y0 = 0.3, y1 = 7.2) =>
  Array.from({ length: NCOL + 1 }, (_, i) => ({ line: { x: colX(i), y: y0, w: 0, h: y1 - y0, line: { color, width: 0.75 } } }));
// Stepped "pixel" bar: solid blocks yellow → amber → orange → ink
const STEPS = [C.accent3, C.accent2, C.accent1, C.text1];
const stepBar = (x, y, bw, bh, colors = STEPS) => colors.map((color, i) => ({ rect: { x: x + i * bw, y, w: bw, h: bh, fill: { color }, line: { type: "none" } } }));

// ---------- Layouts ----------
// Title: full-bleed ember with a pixel staircase on the right
const stair = [];
{
  const s = 1.0, x0 = 8.73, yBase = 6.9; // 4 columns × up to 4 blocks, bottom-aligned
  const rowColors = [C.text1, C.accent3, C.background1, C.accent2]; // bottom row → top row
  for (let c = 0; c < 4; c++) for (let r = 0; r <= c; r++)
    stair.push({ rect: { x: x0 + c * s, y: yBase - (r + 1) * s, w: s, h: s, fill: { color: rowColors[r] }, line: { type: "none" } } });
}
pres.defineSlideMaster({
  title: "TITLE_EMBER",
  background: { color: C.accent1 },
  objects: [
    ...gridLines("FF6A2E"),
    ...stair,
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.6, y: 1.9, w: 8.6, h: 2.5, fontSize: 64, bold: true, color: C.text1, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "tagline", type: "body", x: 0.6, y: 4.55, w: 8.4, h: 0.9, fontSize: 22, color: C.text1, valign: "top", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "meta", type: "body", x: 0.6, y: 6.55, w: 7.9, h: 0.4, fontSize: 13, color: C.text1, valign: "top", margin: 0 }, text: "" } },
  ],
});

// Content: white, visible 12-column grid, square eyebrow marker, footer pixel bar
pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: C.background1 },
  margin: [0.5, 0.6, 0.8, 0.6],
  objects: [
    ...gridLines(C.accent5),
    { rect: { x: 0.6, y: 0.5, w: 0.16, h: 0.16, fill: { color: C.accent1 }, line: { type: "none" } } },
    { placeholder: { options: { name: "eyebrow", type: "body", x: 0.9, y: 0.43, w: 8.0, h: 0.3, fontSize: 12, bold: true, color: C.text1, charSpacing: 3, valign: "middle", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.6, y: 0.85, w: 10.0, h: 1.0, fontSize: 26, bold: true, color: C.text1, valign: "top", margin: 0 }, text: "" } },
    ...stepBar(0.6, 7.03, 0.28, 0.12),
    { text: { text: "[Company name] · Confidential", options: { x: 1.9, y: 6.95, w: 6.0, h: 0.3, fontSize: 10, color: C.text2, margin: 0, valign: "middle" } } },
  ],
  slideNumber: { x: 12.03, y: 6.95, w: 0.7, h: 0.3, fontSize: 10, bold: true, color: C.text1, align: "right", margin: 0 },
});

// Statement: ink background, hairline grid, big stepped bar
pres.defineSlideMaster({
  title: "STATEMENT_INK",
  background: { color: C.text1 },
  objects: [
    ...gridLines(C.accent6),
    ...stepBar(0.6, 1.2, 0.9, 0.3),
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.6, y: 2.0, w: 11.1, h: 2.2, fontSize: 40, bold: true, color: C.background1, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "sub", type: "body", x: 0.6, y: 4.5, w: 11.1, h: 1.4, fontSize: 20, color: C.accent5, valign: "top", margin: 0 }, text: "" } },
  ],
});

// ---------- Helpers ----------
const T = (slide, text, o) => slide.addText(text, { isTextBox: true, margin: 0, valign: "top", ...(o.fontFace === HEAD ? { bold: true } : {}), ...o });
const rect = (slide, o) => slide.addShape(pres.shapes.RECTANGLE, { line: { type: "none" }, ...o });
const panel = (slide, x, y, w, h, name, fill = C.background2) => rect(slide, { x, y, w, h, fill: { color: fill }, objectName: name });
const sq = (slide, x, y, d, label, fill = C.accent1, color = C.text1, size = 14) => {
  rect(slide, { x, y, w: d, h: d, fill: { color: fill } });
  if (label) T(slide, label, { x, y, w: d, h: d, fontSize: size, fontFace: HEAD, color, align: "center", valign: "middle" });
};
const steps = (slide, x, y, bw, bh, colors) => colors.map((color, i) => rect(slide, { x: x + i * bw, y, w: bw, h: bh, fill: { color } }));
const content = (num, label, title, section) => {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: section });
  s.addText(label, { placeholder: "eyebrow" });
  s.addText(title, { placeholder: "title" });
  // Oversized section number in the top-right margin
  T(s, num, { x: 10.83, y: 0.3, w: 1.9, h: 1.3, fontSize: 72, fontFace: HEAD, color: C.accent1, align: "right", valign: "top", objectName: "Section number" });
  return s;
};
// Column spans on the grid
const span = (from, n) => ({ x: colX(from), w: colX(from + n) - colX(from) });
const COL3 = [span(0, 4), span(4, 4), span(8, 4)].map((c) => ({ x: c.x, w: c.w - 0.2 }));
const COL4 = [span(0, 3), span(3, 3), span(6, 3), span(9, 3)].map((c) => ({ x: c.x, w: c.w - 0.2 }));

// ---------- 1. Title ----------
pres.addSection({ title: "Intro" });
{
  const s = pres.addSlide({ masterName: "TITLE_EMBER", sectionTitle: "Intro" });
  rect(s, { x: 0.6, y: 0.6, w: 1.6, h: 0.8, fill: { color: C.accent1 }, line: { color: C.text1, width: 1, dashType: "dash" }, objectName: "Logo placeholder" });
  T(s, "[Logo]", { x: 0.6, y: 0.6, w: 1.6, h: 0.8, fontSize: 12, color: C.text1, align: "center", valign: "middle" });
  s.addText("[Company name]", { placeholder: "title" });
  s.addText("[One-liner: We help (who) do (what) by (how)]", { placeholder: "tagline" });
  rect(s, { x: 0.6, y: 5.6, w: 4.9, h: 0.55, fill: { color: C.text1 }, objectName: "Raise chip" });
  T(s, "Raising $[X]M · [Pre-seed / Seed / Series A]", { x: 0.6, y: 5.6, w: 4.9, h: 0.55, fontSize: 14, bold: true, color: C.background1, align: "center", valign: "middle" });
  s.addText("[Founder name], [Title]  ·  [email@company.com]  ·  [Month YYYY]", { placeholder: "meta" });
  notes(s);
}

// ---------- 2. Problem ----------
pres.addSection({ title: "Opportunity" });
{
  const s = content("01", "THE PROBLEM", "[Target customers] struggle to [do X], and it costs them [time / money]", "Opportunity");
  const rows = [
    ["[Pain point 1]", "[Who feels it, how often, and what it costs them]"],
    ["[Pain point 2]", "[Make it concrete: a real customer story beats an abstract claim]"],
    ["How it's handled today: [current workaround]", "[Spreadsheets, manual work, legacy tools, and why they fall short]"],
  ];
  rows.forEach(([h, d], i) => {
    const y = 2.1 + i * 1.5;
    sq(s, 0.6, y, 0.55, String(i + 1).padStart(2, "0"), i === 2 ? C.text1 : C.accent1, i === 2 ? C.background1 : C.text1, 13);
    T(s, h, { x: 1.45, y: y + 0.02, w: 6.0, h: 0.4, fontSize: 18, bold: true, color: C.text1 });
    T(s, d, { x: 1.45, y: y + 0.47, w: 6.0, h: 0.75, fontSize: 14, color: C.text2 });
  });
  const c = span(8, 4);
  panel(s, c.x, 2.1, c.w, 4.4, "Stat card", C.accent1);
  T(s, "[XX%]", { x: c.x + 0.35, y: 2.4, w: c.w - 0.7, h: 1.3, fontSize: 66, fontFace: HEAD, color: C.text1 });
  T(s, "of [target customers] [experience this pain / lose $X per year to it]", { x: c.x + 0.35, y: 3.85, w: c.w - 0.7, h: 1.4, fontSize: 18, color: C.text1 });
  steps(s, c.x + 0.35, 5.6, 0.3, 0.12, [C.accent3, C.accent2, C.text1]);
  T(s, "Source: [citation]", { x: c.x + 0.35, y: 5.9, w: c.w - 0.7, h: 0.35, fontSize: 11, color: C.text1 });
  notes(s);
}

// ---------- 3. Solution ----------
{
  const s = content("02", "THE SOLUTION", "[Product] lets [customer] [achieve outcome] in [time] instead of [time]", "Opportunity");
  const L = span(0, 5), R = span(6, 6);
  panel(s, L.x, 2.1, L.w, 3.3, "Today card");
  T(s, "TODAY", { x: L.x + 0.35, y: 2.4, w: L.w - 0.7, h: 0.3, fontSize: 12, bold: true, color: C.text2, charSpacing: 3 });
  T(s, [
    { text: "[Slow / manual step]", options: { bullet: true, breakLine: true } },
    { text: "[Costly or error-prone step]", options: { bullet: true, breakLine: true } },
    { text: "[The outcome customers settle for]", options: { bullet: true } },
  ], { x: L.x + 0.35, y: 2.9, w: L.w - 0.7, h: 2.2, fontSize: 16, color: C.text1, paraSpaceAfter: 10 });

  // Stepped blocks as the "arrow" between states
  const ax = colX(5) + 0.12, aw = (colX(6) - colX(5) - 0.24) / 3;
  [0.3, 0.5, 0.7].forEach((h, i) => rect(s, { x: ax + i * aw, y: 3.75 - h / 2, w: aw - 0.04, h, fill: { color: [C.accent3, C.accent2, C.accent1][i] } }));

  panel(s, R.x, 2.1, R.w, 3.3, "With product card", C.text1);
  T(s, "WITH [PRODUCT]", { x: R.x + 0.35, y: 2.4, w: R.w - 0.7, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 3 });
  T(s, [
    { text: "[What becomes fast or automatic]", options: { bullet: true, breakLine: true } },
    { text: "[Measurable gain: X× faster, $Y saved]", options: { bullet: true, breakLine: true } },
    { text: "[A new outcome that wasn't possible before]", options: { bullet: true } },
  ], { x: R.x + 0.35, y: 2.9, w: R.w - 0.7, h: 2.2, fontSize: 16, color: C.background1, paraSpaceAfter: 10 });

  rect(s, { x: 0.6, y: 5.7, w: GW, h: 0.85, fill: { color: C.background1 }, line: { color: C.text1, width: 1.25 }, objectName: "Insight card" });
  rect(s, { x: 0.9, y: 6.05, w: 0.16, h: 0.16, fill: { color: C.accent1 } });
  T(s, [
    { text: "Our insight: ", options: { bold: true } },
    { text: "[The non-obvious thing you understand about this problem that others miss]" },
  ], { x: 1.25, y: 5.7, w: 11.2, h: 0.85, fontSize: 16, color: C.text1, valign: "middle" });
  notes(s);
}

// ---------- 4. Product ----------
{
  const s = content("03", "PRODUCT", "[How it works: the product in one sentence]", "Opportunity");
  const P = span(0, 8);
  rect(s, { x: P.x, y: 2.1, w: P.w - 0.2, h: 4.5, fill: { color: C.background2 }, line: { color: C.text1, width: 1, dashType: "dash" }, objectName: "Screenshot placeholder" });
  T(s, "[Product screenshot, mockup, or demo GIF]", { x: P.x, y: 2.1, w: P.w - 0.2, h: 4.5, fontSize: 16, color: C.text2, align: "center", valign: "middle" });
  const fx = colX(8);
  [1, 2, 3].forEach((n, i) => {
    const y = 2.1 + i * 1.55;
    sq(s, fx, y, 0.5, String(n).padStart(2, "0"), C.accent1, C.text1, 12);
    T(s, `[Key feature ${n}]`, { x: fx + 0.7, y: y + 0.04, w: colX(12) - fx - 0.7, h: 0.4, fontSize: 18, bold: true, color: C.text1 });
    T(s, "[What it does and why the user cares]", { x: fx + 0.7, y: y + 0.5, w: colX(12) - fx - 0.7, h: 0.8, fontSize: 14, color: C.text2 });
  });
  notes(s);
}

// ---------- 5. Why now ----------
{
  const s = content("04", "WHY NOW", "Why now: [the shift that makes this possible today]", "Opportunity");
  const cards = [
    ["TECHNOLOGY", "[What changed in the tech]"],
    ["MARKET / BEHAVIOR", "[What changed in how people buy or work]"],
    ["REGULATION / COST", "[What changed in rules or costs]"],
  ];
  cards.forEach(([label, head], i) => {
    const { x, w } = COL3[i];
    panel(s, x, 2.1, w, 4.4, `Why now card ${i + 1}`);
    // Stepped bar grows card by card: 1, 2, 3 blocks
    steps(s, x + 0.35, 2.45, 0.42, 0.18, STEPS.slice(0, i + 2));
    T(s, String(i + 1).padStart(2, "0"), { x: x + 0.35, y: 2.8, w: 2.0, h: 0.95, fontSize: 54, fontFace: HEAD, color: C.accent1 });
    T(s, label, { x: x + 0.35, y: 3.85, w: w - 0.7, h: 0.3, fontSize: 12, bold: true, color: C.text1, charSpacing: 3 });
    T(s, head, { x: x + 0.35, y: 4.2, w: w - 0.7, h: 0.9, fontSize: 19, bold: true, color: C.text1 });
    T(s, "[Why this makes your solution possible, or necessary, now and not 5 years ago]", { x: x + 0.35, y: 5.2, w: w - 0.7, h: 1.1, fontSize: 14, color: C.text2 });
  });
  notes(s);
}

// ---------- 6. Market ----------
{
  const s = content("05", "MARKET SIZE", "A $[X]B market, and we can win $[Y]M of it in [N] years", "Opportunity");
  // Stepped bars on the grid: TAM 6 cols, SAM 4 cols, SOM 2 cols
  const rows = [
    ["TAM", 6, C.accent3, "$[X]B", "Total addressable market (TAM)", "[Everyone who could ever buy this × annual spend]"],
    ["SAM", 4, C.accent2, "$[X]B", "Serviceable market (SAM)", "[The segment you can reach with today's product and channels]"],
    ["SOM", 2, C.accent1, "$[X]M", "Obtainable in [3–5] years (SOM)", "[The realistic share you can win: the number to defend]"],
  ];
  const tx = colX(6) + 0.25, tw = colX(12) - tx;
  rows.forEach(([k, ncol, color, v, l, d], i) => {
    const y = 2.1 + i * 1.3;
    rect(s, { x: colX(0), y, w: colX(ncol) - colX(0), h: 1.1, fill: { color }, objectName: `${k} bar` });
    T(s, k, { x: colX(0) + 0.2, y: y + 0.12, w: 1.2, h: 0.35, fontSize: 12, bold: true, color: C.text1, charSpacing: 3 });
    T(s, v, { x: colX(0) + 0.2, y: y + 0.45, w: 1.6, h: 0.55, fontSize: 24, fontFace: HEAD, color: C.text1 });
    T(s, l, { x: tx, y: y + 0.1, w: tw, h: 0.35, fontSize: 16, bold: true, color: C.text1 });
    T(s, d, { x: tx, y: y + 0.5, w: tw, h: 0.6, fontSize: 14, color: C.text2 });
  });
  rect(s, { x: 0.6, y: 6.05, w: GW, h: 0.6, fill: { color: C.text1 }, objectName: "Bottom-up math" });
  T(s, [
    { text: "Bottom-up: ", options: { bold: true, color: C.accent1 } },
    { text: "[# target customers] × $[annual contract value] = $[SAM]", options: { color: C.background1 } },
  ], { x: 0.9, y: 6.05, w: 11.6, h: 0.6, fontSize: 14, valign: "middle" });
  notes(s);
}

// ---------- 7. Business model ----------
pres.addSection({ title: "Business" });
{
  const s = content("06", "BUSINESS MODEL", "We charge [customer] [$X per unit]: [pricing model in one line]", "Business");
  const tiers = [["[TIER 1]", "$[X]"], ["[TIER 2]", "$[X]"], ["[TIER 3]", "$[X]"]];
  tiers.forEach(([name, price], i) => {
    const { x, w } = COL3[i], hot = i === 1;
    panel(s, x, 2.1, w, 2.05, `Pricing tier ${i + 1}`, hot ? C.accent1 : C.background2);
    T(s, name, { x: x + 0.35, y: 2.35, w: w - 0.7, h: 0.3, fontSize: 12, bold: true, color: C.text1, charSpacing: 3 });
    T(s, [
      { text: price, options: { fontSize: 32, fontFace: HEAD, bold: true } },
      { text: "  / [user · month]", options: { fontSize: 14 } },
    ], { x: x + 0.35, y: 2.7, w: w - 0.7, h: 0.65, color: C.text1, valign: "bottom" });
    T(s, "[Who it's for and what's included]", { x: x + 0.35, y: 3.48, w: w - 0.7, h: 0.5, fontSize: 14, color: hot ? C.text1 : C.text2 });
  });
  T(s, "UNIT ECONOMICS", { x: 0.6, y: 4.45, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.text1, charSpacing: 3 });
  const tiles = [["$[X]", "Avg. contract value (ACV)"], ["[X]%", "Gross margin"], ["[N] mo", "CAC payback period"], ["[X]:1", "LTV : CAC"]];
  tiles.forEach(([v, l], i) => {
    const { x, w } = COL4[i];
    rect(s, { x, y: 4.85, w, h: 1.6, fill: { color: C.background1 }, line: { color: C.text1, width: 1.25 }, objectName: `Unit economics ${i + 1}` });
    T(s, v, { x: x + 0.3, y: 5.08, w: w - 0.6, h: 0.65, fontSize: 28, fontFace: HEAD, color: C.text1 });
    T(s, l, { x: x + 0.3, y: 5.82, w: w - 0.6, h: 0.45, fontSize: 13, color: C.text2 });
  });
  notes(s);
}

// ---------- 8. Traction ----------
{
  const s = content("07", "TRACTION", "[Key metric] grew [X]× in [N] months", "Business");
  const ch = span(0, 8);
  s.addChart(pres.charts.BAR, [{ name: "[Metric]", labels: ["[M1]", "[M2]", "[M3]", "[M4]", "[M5]", "[M6]"], values: [10, 14, 19, 26, 34, 45] }], {
    x: ch.x, y: 2.05, w: ch.w - 0.3, h: 4.6, barDir: "col", barGapWidthPct: 35,
    chartColors: [H.accent1], showLegend: false,
    showTitle: true, title: "[Revenue / users] by month (sample data: replace)", titleFontSize: 14, titleColor: H.dk2, titleFontFace: "+mn-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 13, dataLabelColor: H.dk1, dataLabelFontFace: "+mj-lt",
    catAxisLabelColor: H.dk2, catAxisLabelFontSize: 12, catAxisLabelFontFace: "+mn-lt",
    catAxisLineShow: true, catAxisLineColor: H.dk1,
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
  });
  const tiles = [["$[X]", "Monthly recurring revenue"], ["[X]%", "Month-over-month growth"], ["[X]%", "Net revenue retention"]];
  const tx = colX(8), tw = colX(12) - tx;
  tiles.forEach(([v, l], i) => {
    const y = 2.1 + i * 1.5;
    const dark = i === 0;
    panel(s, tx, y, tw, 1.35, `Traction stat ${i + 1}`, dark ? C.text1 : C.background2);
    T(s, v, { x: tx + 0.35, y: y + 0.15, w: tw - 0.7, h: 0.65, fontSize: 32, fontFace: HEAD, color: dark ? C.accent1 : C.text1 });
    T(s, l, { x: tx + 0.35, y: y + 0.85, w: tw - 0.7, h: 0.35, fontSize: 14, color: dark ? C.background1 : C.text2 });
  });
  notes(s);
}

// ---------- 9. Competition ----------
{
  const s = content("08", "COMPETITION", "[Company] is the only [category] that [key differentiator]", "Business");
  const mx = colX(0), mw = colX(7) - colX(0) - 0.25, my = 2.45, mh = 3.75;
  T(s, "↑  [Y axis: e.g., Depth / power]", { x: mx, y: 2.05, w: 6, h: 0.3, fontSize: 12, color: C.text2 });
  rect(s, { x: mx, y: my, w: mw, h: mh, fill: { color: C.background2 }, objectName: "Matrix background" });
  s.addShape(pres.shapes.LINE, { x: mx + mw / 2, y: my, w: 0, h: mh, line: { color: C.text1, width: 1 } });
  s.addShape(pres.shapes.LINE, { x: mx, y: my + mh / 2, w: mw, h: 0, line: { color: C.text1, width: 1 } });
  T(s, "[X axis: e.g., Ease of use]  →", { x: mx, y: 6.3, w: mw, h: 0.3, fontSize: 12, color: C.text2, align: "right" });
  // You: top-right quadrant
  sq(s, mx + mw - 0.75, my + 0.35, 0.45);
  T(s, "[Your company]", { x: mx + mw - 2.95, y: my + 0.35, w: 2.05, h: 0.45, fontSize: 14, bold: true, color: C.text1, align: "right", valign: "middle" });
  [[mx + 0.4, my + 0.6, "[Competitor A]"], [mx + mw / 2 + 0.35, my + mh / 2 + 0.6, "[Competitor B]"], [mx + 0.4, my + mh - 0.75, "[Competitor C]"]].forEach(([x, y, n]) => {
    sq(s, x, y, 0.32, null, C.accent4);
    T(s, n, { x: x + 0.45, y, w: 1.9, h: 0.32, fontSize: 13, color: C.text2, valign: "middle" });
  });
  const wx = colX(7) + 0.1, ww = colX(12) - wx;
  rect(s, { x: wx, y: 2.12, w: 0.16, h: 0.16, fill: { color: C.accent1 } });
  T(s, "WHY WE WIN", { x: wx + 0.3, y: 2.05, w: 4, h: 0.3, fontSize: 12, bold: true, color: C.text1, charSpacing: 3 });
  [1, 2, 3].forEach((n, i) => {
    const y = 2.6 + i * 1.25;
    sq(s, wx, y, 0.45, String(n).padStart(2, "0"), C.text1, C.background1, 11);
    T(s, `[Unfair advantage ${n}]`, { x: wx + 0.65, y: y + 0.03, w: ww - 0.65, h: 0.35, fontSize: 16, bold: true, color: C.text1 });
    T(s, "[e.g., proprietary data, network effects, distribution, deep tech]", { x: wx + 0.65, y: y + 0.45, w: ww - 0.65, h: 0.65, fontSize: 13, color: C.text2 });
  });
  notes(s);
}

// ---------- 10. Go-to-market ----------
{
  const s = content("09", "GO-TO-MARKET", "How we reach customers: [primary channel]", "Business");
  const steps3 = [["STEP 1 · LAND", "[e.g., Founder-led sales to 10 design partners]"], ["STEP 2 · EXPAND", "[e.g., Referrals and upsell within accounts]"], ["STEP 3 · SCALE", "[e.g., Inside sales team + partner channel]"]];
  const fills = [C.accent3, C.accent2, C.accent1];
  steps3.forEach(([label, head], i) => {
    const { x, w } = COL3[i];
    // Staircase: each step's block is taller than the last
    const bh = 0.45 + i * 0.3, base = 3.05;
    rect(s, { x, y: base - bh, w, h: bh, fill: { color: fills[i] }, objectName: `Step ${i + 1} block` });
    T(s, String(i + 1).padStart(2, "0"), { x: x + 0.25, y: base - bh, w: 1.2, h: bh, fontSize: 20, fontFace: HEAD, color: C.text1, valign: "middle" });
    T(s, label, { x, y: 3.25, w: w - 0.1, h: 0.3, fontSize: 12, bold: true, color: C.text1, charSpacing: 3 });
    T(s, head, { x, y: 3.6, w: w - 0.1, h: 0.85, fontSize: 18, bold: true, color: C.text1 });
    T(s, "[Timing, target, and what success looks like]", { x, y: 4.45, w: w - 0.1, h: 0.55, fontSize: 14, color: C.text2 });
  });
  const cards = [["Ideal customer", "[Industry, company size, buyer title]"], ["Sales motion", "[Self-serve · Product-led · Sales-led]"], ["Proof it works", "[CAC by channel, conversion rate, pipeline]"]];
  cards.forEach(([h, d], i) => {
    const { x, w } = COL3[i];
    rect(s, { x, y: 5.2, w, h: 1.4, fill: { color: C.background1 }, line: { color: C.text1, width: 1.25 }, objectName: `GTM card ${i + 1}` });
    T(s, h, { x: x + 0.3, y: 5.4, w: w - 0.6, h: 0.35, fontSize: 14, bold: true, color: C.text1 });
    T(s, d, { x: x + 0.3, y: 5.8, w: w - 0.6, h: 0.6, fontSize: 14, color: C.text2 });
  });
  notes(s);
}

// ---------- 11. Team ----------
pres.addSection({ title: "Team & Financials" });
{
  const s = content("10", "TEAM", "Why us: [the unfair advantage this team brings]", "Team & Financials");
  [1, 2, 3, 4].forEach((n, i) => {
    const { x, w } = COL4[i];
    panel(s, x, 2.1, w, 3.8, `Team card ${n}`);
    rect(s, { x: x + 0.3, y: 2.4, w: 1.3, h: 1.3, fill: { color: C.accent5 }, objectName: `Photo ${n}` });
    T(s, "[Photo]", { x: x + 0.3, y: 2.4, w: 1.3, h: 1.3, fontSize: 11, color: C.text2, align: "center", valign: "middle" });
    rect(s, { x: x + 1.6, y: 3.54, w: 0.16, h: 0.16, fill: { color: C.accent1 } });
    T(s, "[Name]", { x: x + 0.3, y: 3.9, w: w - 0.6, h: 0.4, fontSize: 18, fontFace: HEAD, color: C.text1 });
    T(s, "[Role]", { x: x + 0.3, y: 4.3, w: w - 0.6, h: 0.35, fontSize: 13, bold: true, color: C.text1, charSpacing: 2 });
    T(s, "[Prior company, exit, or domain expertise: why you're the one to build this]", { x: x + 0.3, y: 4.7, w: w - 0.6, h: 1.05, fontSize: 13, color: C.text2 });
  });
  T(s, [
    { text: "Advisors & investors: ", options: { bold: true, color: C.text1 } },
    { text: "[Name (credential)]  ·  [Name (credential)]  ·  [Name (credential)]", options: { color: C.text2 } },
  ], { x: 0.6, y: 6.1, w: GW, h: 0.45, fontSize: 14, valign: "middle" });
  notes(s);
}

// ---------- 12. Financials ----------
{
  const s = content("11", "FINANCIALS", "Path to $[X]M revenue by [year]", "Team & Financials");
  const hdr = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text1 }, align: t ? "center" : "left" } });
  const years = ["[Year 1]", "[Year 2]", "[Year 3]", "[Year 4]", "[Year 5]"];
  const rowsDef = [["Revenue", "$[ ]"], ["Gross margin", "[ ]%"], ["Operating expenses", "$[ ]"], ["Net burn / EBITDA", "$[ ]"], ["Ending cash", "$[ ]"], ["Headcount", "[ ]"]];
  const rows = [[hdr(""), ...years.map(hdr)]];
  rowsDef.forEach(([label, v], r) => {
    const fill = { color: r === 0 ? C.accent1 : r % 2 ? C.background2 : C.background1 };
    rows.push([{ text: label, options: { bold: true, color: C.text1, fill } }, ...years.map(() => ({ text: v, options: { color: r === 0 ? C.text1 : C.text2, align: "center", fill } }))]);
  });
  s.addTable(rows, { x: 0.6, y: 2.05, w: GW, colW: [3.13, 1.8, 1.8, 1.8, 1.8, 1.8], rowH: 0.42, fontSize: 14, valign: "middle", border: { type: "solid", pt: 0.75, color: H.accent5 }, margin: [0, 0.12, 0, 0.12] });
  panel(s, 0.6, 5.25, GW, 1.4, "Assumptions card");
  rect(s, { x: 0.9, y: 5.5, w: 0.16, h: 0.16, fill: { color: C.accent1 } });
  T(s, "KEY ASSUMPTIONS", { x: 1.2, y: 5.43, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.text1, charSpacing: 3 });
  T(s, [
    { text: "[Growth rate and what drives it]", options: { bullet: true, breakLine: true } },
    { text: "[Pricing, churn, and sales capacity assumptions]", options: { bullet: true, breakLine: true } },
    { text: "[When you reach breakeven, or what the next round funds]", options: { bullet: true } },
  ], { x: 0.9, y: 5.8, w: 11.5, h: 0.8, fontSize: 14, color: C.text1 });
  notes(s);
}

// ---------- 13. The ask ----------
{
  const s = content("12", "THE ASK", "We're raising $[X]M to reach [milestone] in [N] months", "Team & Financials");
  const L = span(0, 4);
  panel(s, L.x, 2.05, L.w - 0.2, 4.6, "Raise card", C.accent1);
  T(s, "RAISING", { x: L.x + 0.35, y: 2.35, w: L.w - 0.9, h: 0.3, fontSize: 12, bold: true, color: C.text1, charSpacing: 3 });
  T(s, "$[X]M", { x: L.x + 0.35, y: 2.75, w: L.w - 0.9, h: 1.15, fontSize: 60, fontFace: HEAD, color: C.text1 });
  T(s, [
    { text: "[SAFE / priced round]", options: { breakLine: true } },
    { text: "[Pre-seed / Seed / Series A]", options: { breakLine: true } },
    { text: "[$X committed · Lead: (name)]" },
  ], { x: L.x + 0.35, y: 4.15, w: L.w - 0.9, h: 1.6, fontSize: 16, color: C.text1, paraSpaceAfter: 8 });
  steps(s, L.x + 0.35, 6.15, 0.3, 0.12, [C.accent3, C.accent2, C.text1]);

  const rx = colX(4) + 0.1, rw = colX(12) - rx;
  s.addChart(pres.charts.DOUGHNUT, [{ name: "Use of funds", labels: ["Product & engineering", "Sales & marketing", "Operations & G&A", "[Other]"], values: [25, 25, 25, 25] }], {
    x: rx, y: 2.0, w: rw, h: 2.85, holeSize: 55,
    chartColors: [H.accent1, H.accent2, H.accent3, H.dk1],
    showTitle: true, title: "Use of funds (placeholder split: replace)", titleFontSize: 14, titleColor: H.dk2, titleFontFace: "+mn-lt",
    showLegend: true, legendPos: "r", legendFontSize: 13, legendColor: H.dk1, legendFontFace: "+mn-lt",
    showPercent: true, showValue: false, dataLabelColor: H.dk1, dataLabelFontSize: 11, dataLabelFontFace: "+mn-lt",
  });
  const ms = [["MILESTONE 1", "[e.g., $1M ARR]", "[by month N]"], ["MILESTONE 2", "[e.g., 50 logos]", "[by month N]"], ["RUNWAY", "[N] months", "[to Series X metrics]"]];
  const mw = (rw - 0.4) / 3;
  ms.forEach(([l, h, d], i) => {
    const x = rx + i * (mw + 0.2), dark = i === 2;
    rect(s, { x, y: 5.05, w: mw, h: 1.6, fill: { color: dark ? C.text1 : C.background1 }, line: { color: C.text1, width: 1.25 }, objectName: `Milestone ${i + 1}` });
    T(s, l, { x: x + 0.25, y: 5.25, w: mw - 0.5, h: 0.3, fontSize: 11, bold: true, color: dark ? C.accent1 : C.text1, charSpacing: 3 });
    T(s, h, { x: x + 0.25, y: 5.6, w: mw - 0.5, h: 0.45, fontSize: 16, fontFace: HEAD, color: dark ? C.background1 : C.text1 });
    T(s, d, { x: x + 0.25, y: 6.1, w: mw - 0.5, h: 0.35, fontSize: 13, color: dark ? C.accent5 : C.text2 });
  });
  notes(s);
}

// ---------- 14. Vision / close ----------
pres.addSection({ title: "Close" });
{
  const s = pres.addSlide({ masterName: "STATEMENT_INK", sectionTitle: "Close" });
  s.addText("[Your vision in one bold sentence: what the world looks like if you win]", { placeholder: "title" });
  s.addText("[Founder name]  ·  [email@company.com]  ·  [phone]  ·  [company.com]", { placeholder: "sub" });
  notes(s);
}

// ---------- 15. Appendix ----------
{
  const s = pres.addSlide({ masterName: "STATEMENT_INK", sectionTitle: "Close" });
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
