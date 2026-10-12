// Terminal Ledger: a Bloomberg terminal written by engineers.
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(path.join(__dirname, "..", "_shared", "apply_theme.js"));
const { scrubImagePaths } = require(path.join(__dirname, "..", "_shared", "scrub_image_paths.js"));

const OUT = process.argv[2] || path.join(__dirname, "..", "..", "pitch-deck-terminal-ledger.pptx");
const ART = (f) => path.join(__dirname, f);
const NOTES = require(path.join(__dirname, "notes.json"));

const THEME = require("./theme.json"); // palette + fonts: edit theme.json
const H = THEME.colors; // hex, for hex-only options (charts, table borders)

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.title = "Investor Pitch Deck Template";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const BG = C.text1, FG = C.background1, LINE = C.text2, MUTED = C.background2;
const GRN = C.accent1, AMB = C.accent2, PANE = C.accent3, DIM = C.accent4, RAISED = C.accent5;
const M = "+mj-lt"; // theme heading font (Geist Mono) for labels and numbers

// ---------- Layouts ----------
pres.defineSlideMaster({
  title: "TITLE_DARK",
  background: { path: ART("bg_title.png") },
  objects: [
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.8, y: 2.25, w: 11.7, h: 1.35, fontSize: 66, bold: true, color: FG, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "tagline", type: "body", x: 1.3, y: 3.9, w: 10.9, h: 0.9, fontSize: 22, color: FG, valign: "top", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "meta", type: "body", x: 0.8, y: 6.35, w: 11.0, h: 0.4, fontSize: 13, fontFace: M, color: MUTED, valign: "top", margin: 0 }, text: "" } },
  ],
});

pres.defineSlideMaster({
  title: "CONTENT",
  background: { path: ART("bg_content.png") },
  margin: [0.5, 0.6, 0.8, 0.6],
  objects: [
    { placeholder: { options: { name: "eyebrow", type: "body", x: 0.6, y: 0.45, w: 9.0, h: 0.32, fontSize: 13, fontFace: M, bold: true, color: GRN, charSpacing: 1, valign: "top", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.6, y: 0.85, w: 12.13, h: 1.0, fontSize: 26, bold: true, color: FG, valign: "top", margin: 0 }, text: "" } },
    { rect: { x: 0.6, y: 7.04, w: 0.09, h: 0.09, fill: { color: GRN }, line: { type: "none" } } },
    { text: { text: "[Company name] · Confidential", options: { x: 0.8, y: 6.95, w: 6.0, h: 0.3, fontSize: 10, fontFace: M, color: MUTED, margin: 0, valign: "middle" } } },
  ],
  slideNumber: { x: 12.13, y: 6.95, w: 0.6, h: 0.3, fontSize: 10, fontFace: M, color: MUTED, align: "right", valign: "middle", margin: 0 },
});

pres.defineSlideMaster({
  title: "STATEMENT_DARK",
  background: { path: ART("bg_title.png") },
  objects: [
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.8, y: 2.3, w: 11.7, h: 2.4, fontSize: 36, bold: true, color: FG, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "sub", type: "body", x: 0.8, y: 5.0, w: 11.7, h: 1.3, fontSize: 16, fontFace: M, color: MUTED, valign: "top", margin: 0 }, text: "" } },
  ],
});

// ---------- Helpers ----------
const T = (slide, text, o) => slide.addText(text, { isTextBox: true, margin: 0, valign: "top", ...o });
const pane = (slide, x, y, w, h, o = {}) => slide.addShape(pres.shapes.RECTANGLE, {
  x, y, w, h,
  fill: o.tint ? { color: GRN, transparency: 92 } : o.clear ? { type: "none" } : { color: o.fill || PANE },
  line: { color: o.line || LINE, width: o.lw || 1, dashType: o.dash || "solid" },
  objectName: o.name,
});
const hair = (slide, x, y, w) => slide.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color: LINE, width: 1 } });
const label = (slide, text, x, y, w, color = MUTED, size = 11) => T(slide, text, { x, y, w, h: 0.3, fontSize: size, fontFace: M, bold: true, color, charSpacing: 1 });
const content = (eyebrow, title, section) => {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: section });
  s.addText(eyebrow, { placeholder: "eyebrow" });
  s.addText(title, { placeholder: "title" });
  return s;
};
// touching grid columns across the 12.13" content width
const G3 = [0, 1, 2].map((i) => 0.6 + i * (12.13 / 3)), W3 = 12.13 / 3;
const G4 = [0, 1, 2, 3].map((i) => 0.6 + i * (12.13 / 4)), W4 = 12.13 / 4;
const TOP = 2.05;

// ---------- 1. Title ----------
pres.addSection({ title: "Intro" });
{
  const s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "Intro" });
  pane(s, 0.8, 0.7, 1.6, 0.8, { clear: true, line: DIM, dash: "dash", name: "Logo placeholder" });
  T(s, "[Logo]", { x: 0.8, y: 0.7, w: 1.6, h: 0.8, fontSize: 12, fontFace: M, color: MUTED, align: "center", valign: "middle" });
  T(s, [
    { text: "● ", options: { color: GRN } },
    { text: "CONFIDENTIAL // INVESTOR BUILD", options: { color: MUTED } },
  ], { x: 7.5, y: 0.95, w: 5.0, h: 0.3, fontSize: 11, fontFace: M, bold: true, align: "right", charSpacing: 1 });
  T(s, [
    { text: "$ ", options: { color: GRN } },
    { text: "./pitch --investor", options: { color: MUTED } },
  ], { x: 0.8, y: 1.85, w: 4.0, h: 0.32, fontSize: 16, fontFace: M });
  s.addShape(pres.shapes.RECTANGLE, { x: 3.62, y: 1.88, w: 0.14, h: 0.27, fill: { color: GRN }, line: { type: "none" }, objectName: "Cursor" });
  s.addText("[Company name]", { placeholder: "title" });
  T(s, ">", { x: 0.8, y: 3.9, w: 0.4, h: 0.5, fontSize: 22, fontFace: M, bold: true, color: GRN });
  s.addText("[One-liner: We help (who) do (what) by (how)]", { placeholder: "tagline" });
  pane(s, 0.8, 5.05, 5.9, 0.55, { tint: true, line: GRN, lw: 1.25, name: "Raise chip" });
  T(s, "Raising $[X]M · [Pre-seed / Seed / Series A]", { x: 0.8, y: 5.05, w: 5.9, h: 0.55, fontSize: 14, fontFace: M, bold: true, color: GRN, align: "center", valign: "middle" });
  s.addText("[Founder name], [Title]  ·  [email@company.com]  ·  [Month YYYY]", { placeholder: "meta" });
  s.addNotes(NOTES[0]);
}

// ---------- 2. Problem ----------
pres.addSection({ title: "Opportunity" });
{
  const s = content("// 01 · THE PROBLEM", "[Target customers] struggle to [do X], and it costs them [time / money]", "Opportunity");
  const rows = [
    ["[Pain point 1]", "[Who feels it, how often, and what it costs them]", GRN],
    ["[Pain point 2]", "[Make it concrete: a real customer story beats an abstract claim]", GRN],
    ["How it's handled today: [current workaround]", "[Spreadsheets, manual work, legacy tools, and why they fall short]", AMB],
  ];
  hair(s, 0.6, TOP, 7.0);
  rows.forEach(([h, d, col], i) => {
    const y = TOP + i * 1.45;
    T(s, `0${i + 1}`, { x: 0.6, y: y + 0.22, w: 0.8, h: 0.5, fontSize: 26, fontFace: M, bold: true, color: col });
    T(s, h, { x: 1.5, y: y + 0.25, w: 6.1, h: 0.4, fontSize: 18, bold: true, color: FG });
    T(s, d, { x: 1.5, y: y + 0.7, w: 6.1, h: 0.6, fontSize: 14, color: MUTED });
    hair(s, 0.6, y + 1.45, 7.0);
  });
  pane(s, 8.1, TOP, 4.63, 4.35, { name: "Stat pane" });
  label(s, "problem.stat", 8.4, TOP + 0.25, 3.0);
  T(s, "▲", { x: 11.9, y: TOP + 0.22, w: 0.5, h: 0.3, fontSize: 12, fontFace: M, color: AMB, align: "right" });
  T(s, "[XX%]", { x: 8.4, y: 2.75, w: 4.1, h: 1.2, fontSize: 66, fontFace: M, bold: true, color: GRN });
  T(s, "of [target customers] [experience this pain / lose $X per year to it]", { x: 8.4, y: 4.05, w: 4.05, h: 1.3, fontSize: 17, color: FG });
  T(s, "Source: [citation]", { x: 8.4, y: 5.9, w: 4.0, h: 0.3, fontSize: 11, fontFace: M, color: MUTED });
  s.addNotes(NOTES[1]);
}

// ---------- 3. Solution ----------
{
  const s = content("// 02 · THE SOLUTION", "[Product] lets [customer] [achieve outcome] in [time] instead of [time]", "Opportunity");
  const items = (sign, col, list, textCol) => list.flatMap((t, i) => [
    { text: `${sign}  `, options: { color: col, fontFace: M, bold: true } },
    { text: t, options: { color: textCol, breakLine: i < list.length - 1 } },
  ]);
  pane(s, 0.6, TOP, 5.4, 3.25, { name: "Today pane" });
  label(s, "− TODAY", 0.9, TOP + 0.28, 4.5, AMB, 12);
  T(s, items("−", AMB, ["[Slow / manual step]", "[Costly or error-prone step]", "[The outcome customers settle for]"], FG),
    { x: 0.9, y: TOP + 0.8, w: 4.85, h: 2.2, fontSize: 16, paraSpaceAfter: 12 });

  T(s, "→", { x: 6.0, y: 3.15, w: 1.3, h: 0.9, fontSize: 44, fontFace: M, bold: true, color: GRN, align: "center", valign: "middle" });

  pane(s, 7.33, TOP, 5.4, 3.25, { tint: true, line: GRN, lw: 1.25, name: "With product pane" });
  label(s, "+ WITH [PRODUCT]", 7.63, TOP + 0.28, 4.5, GRN, 12);
  T(s, items("+", GRN, ["[What becomes fast or automatic]", "[Measurable gain: X× faster, $Y saved]", "[A new outcome that wasn't possible before]"], FG),
    { x: 7.63, y: TOP + 0.8, w: 4.9, h: 2.2, fontSize: 16, paraSpaceAfter: 12 });

  pane(s, 0.6, 5.6, 12.13, 0.9, { name: "Insight pane" });
  T(s, [
    { text: "> ", options: { color: GRN, fontFace: M, bold: true } },
    { text: "Our insight: ", options: { bold: true, color: GRN } },
    { text: "[The non-obvious thing you understand about this problem that others miss]", options: { color: FG } },
  ], { x: 0.9, y: 5.6, w: 11.6, h: 0.9, fontSize: 16, valign: "middle" });
  s.addNotes(NOTES[2]);
}

// ---------- 4. Product ----------
{
  const s = content("// 03 · PRODUCT", "[How it works: the product in one sentence]", "Opportunity");
  pane(s, 0.6, TOP, 7.4, 4.55, { name: "Product window" });
  [AMB, GRN, DIM].forEach((col, i) => s.addShape(pres.shapes.RECTANGLE, { x: 0.85 + i * 0.22, y: TOP + 0.17, w: 0.11, h: 0.11, fill: { color: col }, line: { type: "none" } }));
  label(s, "product.preview", 1.6, TOP + 0.08, 4.0);
  hair(s, 0.6, TOP + 0.45, 7.4);
  T(s, "[Product screenshot, mockup, or demo GIF]", { x: 0.6, y: TOP + 0.45, w: 7.4, h: 4.1, fontSize: 16, color: MUTED, align: "center", valign: "middle" });
  hair(s, 8.4, TOP, 4.33);
  [1, 2, 3].forEach((n, i) => {
    const y = TOP + i * 1.5;
    T(s, `0${n}`, { x: 8.4, y: y + 0.25, w: 0.6, h: 0.4, fontSize: 14, fontFace: M, bold: true, color: GRN });
    T(s, `[Key feature ${n}]`, { x: 9.05, y: y + 0.22, w: 3.68, h: 0.4, fontSize: 18, bold: true, color: FG });
    T(s, "[What it does and why the user cares]", { x: 9.05, y: y + 0.66, w: 3.68, h: 0.65, fontSize: 14, color: MUTED });
    hair(s, 8.4, y + 1.5, 4.33);
  });
  s.addNotes(NOTES[3]);
}

// ---------- 5. Why now ----------
{
  const s = content("// 04 · WHY NOW", "Why now: [the shift that makes this possible today]", "Opportunity");
  const cards = [
    ["TECHNOLOGY", "[What changed in the tech]"],
    ["MARKET / BEHAVIOR", "[What changed in how people buy or work]"],
    ["REGULATION / COST", "[What changed in rules or costs]"],
  ];
  cards.forEach(([lab, head], i) => {
    const x = G3[i];
    pane(s, x, TOP, W3, 4.1, { name: `Why now pane ${i + 1}` });
    T(s, `0${i + 1}`, { x: x + 0.35, y: TOP + 0.3, w: 2, h: 0.85, fontSize: 54, fontFace: M, bold: true, color: GRN });
    label(s, lab, x + 0.35, TOP + 1.4, W3 - 0.7, AMB, 12);
    T(s, head, { x: x + 0.35, y: TOP + 1.8, w: W3 - 0.7, h: 0.85, fontSize: 20, bold: true, color: FG });
    T(s, "[Why this makes your solution possible, or necessary, now and not 5 years ago]", { x: x + 0.35, y: TOP + 2.8, w: W3 - 0.7, h: 1.0, fontSize: 14, color: MUTED });
  });
  s.addNotes(NOTES[4]);
}

// ---------- 6. Market ----------
{
  const s = content("// 05 · MARKET SIZE", "A $[X]B market, and we can win $[Y]M of it in [N] years", "Opportunity");
  pane(s, 0.6, TOP, 4.45, 4.45, { name: "TAM square" });
  pane(s, 0.6, TOP + 1.45, 3.0, 3.0, { fill: RAISED, line: DIM, name: "SAM square" });
  pane(s, 0.6, TOP + 2.85, 1.6, 1.6, { fill: GRN, line: GRN, name: "SOM square" });
  label(s, "TAM", 0.8, TOP + 0.18, 1.5, MUTED, 13);
  label(s, "SAM", 0.8, TOP + 1.63, 1.5, FG, 13);
  label(s, "SOM", 0.8, TOP + 3.03, 1.2, BG, 13);
  const rows = [
    ["$[X]B", "Total addressable market (TAM)", "[Everyone who could ever buy this × annual spend]"],
    ["$[X]B", "Serviceable market (SAM)", "[The segment you can reach with today's product and channels]"],
    ["$[X]M", "Obtainable in [3–5] years (SOM)", "[The realistic share you can win: the number to defend]"],
  ];
  hair(s, 5.6, TOP, 7.13);
  rows.forEach(([v, l, d], i) => {
    const y = TOP + i * 1.25;
    T(s, v, { x: 5.6, y: y + 0.25, w: 2.2, h: 0.6, fontSize: 30, fontFace: M, bold: true, color: i === 2 ? GRN : FG });
    T(s, l, { x: 8.0, y: y + 0.2, w: 4.73, h: 0.35, fontSize: 16, bold: true, color: FG });
    T(s, d, { x: 8.0, y: y + 0.58, w: 4.73, h: 0.6, fontSize: 14, color: MUTED });
    hair(s, 5.6, y + 1.25, 7.13);
  });
  pane(s, 5.6, 5.95, 7.13, 0.55, { name: "Bottom-up math" });
  T(s, [
    { text: "$ ", options: { color: GRN, fontFace: M, bold: true } },
    { text: "Bottom-up: ", options: { bold: true, color: GRN } },
    { text: "[# target customers] × $[annual contract value] = $[SAM]", options: { color: FG } },
  ], { x: 5.85, y: 5.95, w: 6.75, h: 0.55, fontSize: 14, valign: "middle" });
  s.addNotes(NOTES[5]);
}

// ---------- 7. Business model ----------
pres.addSection({ title: "Business" });
{
  const s = content("// 06 · BUSINESS MODEL", "We charge [customer] [$X per unit]: [pricing model in one line]", "Business");
  const tiers = ["[TIER 1]", "[TIER 2]", "[TIER 3]"];
  [0, 2, 1].forEach((i) => { // draw the highlighted middle tier last so its border sits on top
    const x = G3[i], hot = i === 1;
    pane(s, x, TOP, W3, 2.1, hot ? { tint: true, line: GRN, lw: 1.5, name: "Pricing tier 2" } : { name: `Pricing tier ${i + 1}` });
    label(s, tiers[i], x + 0.35, TOP + 0.25, W3 - 0.7, hot ? GRN : MUTED, 12);
    T(s, [
      { text: "$[X]", options: { fontSize: 34, bold: true, fontFace: M, color: FG } },
      { text: "  / [user · month]", options: { fontSize: 14, color: MUTED } },
    ], { x: x + 0.35, y: TOP + 0.6, w: W3 - 0.7, h: 0.7, valign: "bottom" });
    T(s, "[Who it's for and what's included]", { x: x + 0.35, y: TOP + 1.45, w: W3 - 0.7, h: 0.5, fontSize: 14, color: MUTED });
  });
  label(s, "// UNIT ECONOMICS", 0.6, 4.45, 6, GRN, 12);
  const tiles = [["$[X]", "Avg. contract value (ACV)"], ["[X]%", "Gross margin"], ["[N] mo", "CAC payback period"], ["[X]:1", "LTV : CAC"]];
  tiles.forEach(([v, l], i) => {
    const x = G4[i];
    pane(s, x, 4.85, W4, 1.6, { name: `Unit economics ${i + 1}` });
    T(s, v, { x: x + 0.3, y: 5.07, w: W4 - 0.6, h: 0.6, fontSize: 30, fontFace: M, bold: true, color: FG });
    T(s, l, { x: x + 0.3, y: 5.8, w: W4 - 0.6, h: 0.45, fontSize: 13, color: MUTED });
  });
  s.addNotes(NOTES[6]);
}

// ---------- 8. Traction ----------
{
  const s = content("// 07 · TRACTION", "[Key metric] grew [X]× in [N] months", "Business");
  pane(s, 0.6, TOP, 7.7, 4.5, { name: "Chart pane" });
  s.addChart(pres.charts.BAR, [{ name: "[Metric]", labels: ["[M1]", "[M2]", "[M3]", "[M4]", "[M5]", "[M6]"], values: [10, 14, 19, 26, 34, 45] }], {
    x: 0.75, y: TOP + 0.1, w: 7.4, h: 4.3, barDir: "col", barGapWidthPct: 45,
    chartArea: { fill: { color: H.accent3 } }, plotArea: { fill: { color: H.accent3 } },
    chartColors: [H.accent1], showLegend: false,
    showTitle: true, title: "[Revenue / users] by month (sample data: replace)", titleFontSize: 13, titleColor: H.lt2, titleFontFace: "+mj-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: H.lt1, dataLabelFontFace: "+mj-lt",
    catAxisLabelColor: H.lt2, catAxisLabelFontSize: 12, catAxisLabelFontFace: "+mj-lt", catAxisLineShow: true, catAxisLineColor: H.accent4,
    valAxisHidden: true, valGridLine: { color: H.dk2, size: 0.75, style: "dash" }, catGridLine: { style: "none" },
  });
  const tiles = [["$[X]", "Monthly recurring revenue"], ["[X]%", "Month-over-month growth"], ["[X]%", "Net revenue retention"]];
  tiles.forEach(([v, l], i) => {
    const y = TOP + i * 1.5;
    pane(s, 8.6, y, 4.13, 1.5, i === 0 ? { tint: true, line: GRN, lw: 1.25, name: "Traction stat 1" } : { name: `Traction stat ${i + 1}` });
    T(s, v, { x: 8.9, y: y + 0.22, w: 3.0, h: 0.65, fontSize: 34, fontFace: M, bold: true, color: i === 0 ? GRN : FG });
    T(s, "▲", { x: 11.9, y: y + 0.28, w: 0.55, h: 0.35, fontSize: 14, fontFace: M, color: GRN, align: "right" });
    T(s, l, { x: 8.9, y: y + 0.95, w: 3.6, h: 0.35, fontSize: 14, color: MUTED });
  });
  s.addNotes(NOTES[7]);
}

// ---------- 9. Competition ----------
{
  const s = content("// 08 · COMPETITION", "[Company] is the only [category] that [key differentiator]", "Business");
  T(s, "↑  [Y axis: e.g., Depth / power]", { x: 1.0, y: 2.0, w: 6, h: 0.3, fontSize: 12, fontFace: M, color: MUTED });
  pane(s, 1.0, 2.35, 6.0, 3.85, { name: "Matrix" });
  s.addShape(pres.shapes.LINE, { x: 4.0, y: 2.35, w: 0, h: 3.85, line: { color: DIM, width: 1, dashType: "dash" } });
  s.addShape(pres.shapes.LINE, { x: 1.0, y: 4.275, w: 6.0, h: 0, line: { color: DIM, width: 1, dashType: "dash" } });
  T(s, "[X axis: e.g., Ease of use]  →", { x: 1.0, y: 6.3, w: 6, h: 0.3, fontSize: 12, fontFace: M, color: MUTED, align: "right" });
  // You: green square with a glow halo
  s.addImage({ path: ART("halo.png"), x: 5.83, y: 2.25, w: 1.1, h: 1.1, altText: "" });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.21, y: 2.63, w: 0.34, h: 0.34, fill: { color: GRN }, line: { type: "none" }, objectName: "You marker" });
  T(s, "[Your company]", { x: 3.9, y: 2.6, w: 2.15, h: 0.4, fontSize: 13, fontFace: M, bold: true, color: GRN, align: "right", valign: "middle" });
  [[1.4, 2.9, "[Competitor A]"], [4.5, 4.8, "[Competitor B]"], [1.4, 5.3, "[Competitor C]"]].forEach(([x, y, n]) => {
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.28, h: 0.28, fill: { color: DIM }, line: { type: "none" } });
    T(s, n, { x: x + 0.45, y: y - 0.04, w: 2.0, h: 0.36, fontSize: 13, color: MUTED, valign: "middle" });
  });
  label(s, "// WHY WE WIN", 7.6, 2.35, 5, GRN, 12);
  hair(s, 7.6, 2.75, 5.13);
  [1, 2, 3].forEach((n, i) => {
    const y = 2.75 + i * 1.15;
    T(s, `0${n}`, { x: 7.6, y: y + 0.18, w: 0.6, h: 0.35, fontSize: 14, fontFace: M, bold: true, color: GRN });
    T(s, `[Unfair advantage ${n}]`, { x: 8.25, y: y + 0.16, w: 4.48, h: 0.35, fontSize: 16, bold: true, color: FG });
    T(s, "[e.g., proprietary data, network effects, distribution, deep tech]", { x: 8.25, y: y + 0.52, w: 4.48, h: 0.55, fontSize: 13, color: MUTED });
    hair(s, 7.6, y + 1.15, 5.13);
  });
  s.addNotes(NOTES[8]);
}

// ---------- 10. Go-to-market ----------
{
  const s = content("// 09 · GO-TO-MARKET", "How we reach customers: [primary channel]", "Business");
  const steps = [["STEP 1 · LAND", "[e.g., Founder-led sales to 10 design partners]"], ["STEP 2 · EXPAND", "[e.g., Referrals and upsell within accounts]"], ["STEP 3 · SCALE", "[e.g., Inside sales team + partner channel]"]];
  steps.forEach(([lab, head], i) => {
    const x = G3[i];
    pane(s, x, TOP, W3, 2.85, i === 0 ? { tint: true, line: GRN, lw: 1.25, name: "GTM step 1" } : { name: `GTM step ${i + 1}` });
    T(s, `0${i + 1}`, { x: x + 0.35, y: TOP + 0.22, w: 1.5, h: 0.7, fontSize: 40, fontFace: M, bold: true, color: GRN });
    if (i < 2) T(s, "──→", { x: x + W3 - 1.6, y: TOP + 0.35, w: 1.3, h: 0.45, fontSize: 20, fontFace: M, color: DIM, align: "right" });
    label(s, lab, x + 0.35, TOP + 1.05, W3 - 0.7, AMB, 12);
    T(s, head, { x: x + 0.35, y: TOP + 1.4, w: W3 - 0.7, h: 0.75, fontSize: 18, bold: true, color: FG });
    T(s, "[Timing, target, and what success looks like]", { x: x + 0.35, y: TOP + 2.2, w: W3 - 0.7, h: 0.55, fontSize: 14, color: MUTED });
  });
  const cards = [["Ideal customer", "[Industry, company size, buyer title]"], ["Sales motion", "[Self-serve · Product-led · Sales-led]"], ["Proof it works", "[CAC by channel, conversion rate, pipeline]"]];
  cards.forEach(([h, d], i) => {
    const x = G3[i];
    pane(s, x, 5.1, W3, 1.4, { clear: true, name: `GTM card ${i + 1}` });
    T(s, `> ${h}`, { x: x + 0.35, y: 5.3, w: W3 - 0.7, h: 0.35, fontSize: 13, fontFace: M, bold: true, color: GRN });
    T(s, d, { x: x + 0.35, y: 5.7, w: W3 - 0.7, h: 0.6, fontSize: 14, color: FG });
  });
  s.addNotes(NOTES[9]);
}

// ---------- 11. Team ----------
pres.addSection({ title: "Team & Financials" });
{
  const s = content("// 10 · TEAM", "Why us: [the unfair advantage this team brings]", "Team & Financials");
  [1, 2, 3, 4].forEach((n, i) => {
    const x = G4[i];
    pane(s, x, TOP, W4, 3.85, { name: `Team card ${n}` });
    pane(s, x + 0.3, TOP + 0.3, 1.3, 1.3, { fill: BG, line: DIM, dash: "dash", name: `Photo ${n}` });
    T(s, "[Photo]", { x: x + 0.3, y: TOP + 0.3, w: 1.3, h: 1.3, fontSize: 10, fontFace: M, color: MUTED, align: "center", valign: "middle" });
    T(s, `0${n}`, { x: x + W4 - 0.9, y: TOP + 0.3, w: 0.6, h: 0.3, fontSize: 11, fontFace: M, bold: true, color: DIM, align: "right" });
    T(s, "[Name]", { x: x + 0.3, y: TOP + 1.85, w: W4 - 0.6, h: 0.4, fontSize: 18, bold: true, color: FG });
    T(s, "[Role]", { x: x + 0.3, y: TOP + 2.25, w: W4 - 0.6, h: 0.35, fontSize: 13, fontFace: M, bold: true, color: GRN });
    T(s, "[Prior company, exit, or domain expertise: why you're the one to build this]", { x: x + 0.3, y: TOP + 2.65, w: W4 - 0.6, h: 1.05, fontSize: 13, color: MUTED });
  });
  T(s, [
    { text: "> ", options: { color: GRN, fontFace: M, bold: true } },
    { text: "Advisors & investors: ", options: { bold: true, color: FG } },
    { text: "[Name (credential)]  ·  [Name (credential)]  ·  [Name (credential)]", options: { color: MUTED } },
  ], { x: 0.6, y: 6.1, w: 12.13, h: 0.45, fontSize: 14, valign: "middle" });
  s.addNotes(NOTES[10]);
}

// ---------- 12. Financials ----------
{
  const s = content("// 11 · FINANCIALS", "Path to $[X]M revenue by [year]", "Team & Financials");
  const years = ["[Year 1]", "[Year 2]", "[Year 3]", "[Year 4]", "[Year 5]"];
  const hdr = (t) => ({ text: t, options: { bold: true, color: GRN, fill: { color: RAISED }, align: t ? "right" : "left", fontFace: M } });
  const rowsDef = [["Revenue", "$[ ]"], ["Gross margin", "[ ]%"], ["Operating expenses", "$[ ]"], ["Net burn / EBITDA", "$[ ]"], ["Ending cash", "$[ ]"], ["Headcount", "[ ]"]];
  const rows = [[hdr(""), ...years.map(hdr)]];
  rowsDef.forEach(([lab, v], r) => {
    const fill = { color: r % 2 ? PANE : BG };
    rows.push([{ text: lab, options: { bold: true, color: FG, fill } }, ...years.map(() => ({ text: v, options: { color: FG, align: "right", fontFace: M, fill } }))]);
  });
  s.addTable(rows, { x: 0.6, y: TOP, w: 12.13, colW: [3.13, 1.8, 1.8, 1.8, 1.8, 1.8], rowH: 0.42, fontSize: 14, valign: "middle", border: { type: "solid", pt: 0.75, color: H.dk2 }, margin: [0, 0.15, 0, 0.15] });
  pane(s, 0.6, 5.2, 12.13, 1.35, { name: "Assumptions pane" });
  label(s, "// KEY ASSUMPTIONS", 0.9, 5.35, 6, GRN, 12);
  T(s, [
    { text: "[Growth rate and what drives it]", options: { bullet: { code: "25B8" }, breakLine: true } },
    { text: "[Pricing, churn, and sales capacity assumptions]", options: { bullet: { code: "25B8" }, breakLine: true } },
    { text: "[When you reach breakeven, or what the next round funds]", options: { bullet: { code: "25B8" } } },
  ], { x: 0.9, y: 5.68, w: 11.5, h: 0.8, fontSize: 14, color: FG });
  s.addNotes(NOTES[11]);
}

// ---------- 13. The ask ----------
{
  const s = content("// 12 · THE ASK", "We're raising $[X]M to reach [milestone] in [N] months", "Team & Financials");
  pane(s, 0.6, TOP, 4.6, 4.5, { tint: true, line: GRN, lw: 1.5, name: "Raise pane" });
  label(s, "RAISING", 0.95, TOP + 0.35, 3.8, MUTED, 12);
  T(s, "$[X]M", { x: 0.95, y: TOP + 0.75, w: 4.0, h: 1.15, fontSize: 64, fontFace: M, bold: true, color: GRN });
  T(s, [
    { text: "[SAFE / priced round]", options: { breakLine: true } },
    { text: "[Pre-seed / Seed / Series A]", options: { breakLine: true } },
    { text: "[$X committed · Lead: (name)]" },
  ], { x: 0.95, y: TOP + 2.2, w: 3.95, h: 1.9, fontSize: 16, color: FG, paraSpaceAfter: 8 });

  pane(s, 5.5, TOP, 7.23, 2.75, { name: "Use of funds pane" });
  s.addChart(pres.charts.DOUGHNUT, [{ name: "Use of funds", labels: ["Product & engineering", "Sales & marketing", "Operations & G&A", "[Other]"], values: [25, 25, 25, 25] }], {
    x: 5.6, y: TOP + 0.05, w: 7.03, h: 2.65, holeSize: 62,
    chartArea: { fill: { color: H.accent3 } }, plotArea: { fill: { color: H.accent3 } },
    chartColors: [H.accent1, H.accent2, H.lt2, H.accent4], dataBorder: { pt: 1.5, color: H.accent3 },
    showTitle: true, title: "Use of funds (placeholder split: replace)", titleFontSize: 13, titleColor: H.lt2, titleFontFace: "+mj-lt",
    showLegend: true, legendPos: "r", legendFontSize: 13, legendColor: H.lt1, legendFontFace: "+mn-lt",
    showPercent: false, showValue: false,
  });
  const ms = [["MILESTONE 1", "[e.g., $1M ARR]", "[by month N]"], ["MILESTONE 2", "[e.g., 50 logos]", "[by month N]"], ["RUNWAY", "[N] months", "[to Series X metrics]"]];
  const mw = 7.23 / 3;
  ms.forEach(([l, h, d], i) => {
    const x = 5.5 + i * mw;
    pane(s, x, 5.0, mw, 1.55, { name: `Milestone ${i + 1}` });
    label(s, l, x + 0.25, 5.17, mw - 0.5, GRN, 11);
    T(s, h, { x: x + 0.25, y: 5.52, w: mw - 0.45, h: 0.42, fontSize: 15, bold: true, color: FG });
    T(s, d, { x: x + 0.25, y: 6.0, w: mw - 0.45, h: 0.35, fontSize: 13, color: MUTED });
  });
  s.addNotes(NOTES[12]);
}

// ---------- 14. Vision / close ----------
pres.addSection({ title: "Close" });
{
  const s = pres.addSlide({ masterName: "STATEMENT_DARK", sectionTitle: "Close" });
  T(s, [
    { text: "$ ", options: { color: GRN } },
    { text: "echo $VISION", options: { color: MUTED } },
  ], { x: 0.8, y: 2.0, w: 5, h: 0.35, fontSize: 16, fontFace: M });
  s.addShape(pres.shapes.RECTANGLE, { x: 2.9, y: 2.03, w: 0.14, h: 0.27, fill: { color: GRN }, line: { type: "none" }, objectName: "Cursor" });
  s.addText("[Your vision in one bold sentence: what the world looks like if you win]", { placeholder: "title" });
  s.addText("[Founder name]  ·  [email@company.com]  ·  [phone]  ·  [company.com]", { placeholder: "sub" });
  s.addNotes(NOTES[13]);
}

// ---------- 15. Appendix ----------
{
  const s = pres.addSlide({ masterName: "STATEMENT_DARK", sectionTitle: "Close" });
  T(s, [
    { text: "$ ", options: { color: GRN } },
    { text: "ls ./appendix", options: { color: MUTED } },
  ], { x: 0.8, y: 3.55, w: 5, h: 0.35, fontSize: 16, fontFace: M });
  s.addText("Appendix", { placeholder: "title" });
  s.addText("[Detailed financials  ·  Cohort and retention data  ·  Customer case studies  ·  Technical architecture  ·  Product roadmap  ·  Cap table]", { placeholder: "sub" });
  s.addNotes(NOTES[14]);
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  await scrubImagePaths(OUT);
  console.log("wrote", OUT);
})();
