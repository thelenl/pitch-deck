// Acid Editorial restyle of the pitch deck template.
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(path.join(__dirname, "..", "_shared", "apply_theme.js"));
const { scrubImagePaths } = require(path.join(__dirname, "..", "_shared", "scrub_image_paths.js"));
const NOTES = require(path.join(__dirname, "notes.json"));

const OUT = process.argv[2] || path.join(__dirname, "..", "..", "pitch-deck-acid-editorial.pptx");

const THEME = require("./theme.json"); // palette + fonts: edit theme.json
const H = THEME.colors;
const LIME = H.accent1; // hex: highlight + charts are hex-only

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.title = "Investor Pitch Deck Template (Acid Editorial)";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const INK = C.text1, MUTED = C.text2, BONE = C.background1, WHITE = C.background2;
const ACID = C.accent1, PANEL = C.accent2, HAIR = C.accent3, GRAY = C.accent4;

// ---------- Layouts ----------
pres.defineSlideMaster({
  title: "TITLE_EDITORIAL",
  background: { color: BONE },
  objects: [
    { rect: { x: 0, y: 6.35, w: 13.333, h: 1.15, fill: { color: PANEL }, line: { type: "none" } } },
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.6, y: 1.45, w: 12.13, h: 2.0, fontSize: 88, color: INK, valign: "bottom", margin: 0, lineSpacingMultiple: 0.9 }, text: "" } },
    { placeholder: { options: { name: "tagline", type: "body", x: 0.6, y: 3.7, w: 11.0, h: 0.9, fontSize: 28, color: INK, valign: "top", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "meta", type: "body", x: 0.6, y: 6.55, w: 12.13, h: 0.75, fontSize: 16, color: BONE, valign: "middle", margin: 0 }, text: "" } },
  ],
});

pres.defineSlideMaster({
  title: "CONTENT_EDITORIAL",
  background: { color: BONE },
  margin: [0.5, 0.6, 0.8, 0.6],
  objects: [
    { placeholder: { options: { name: "eyebrow", type: "body", x: 0.6, y: 0.5, w: 9.0, h: 0.35, fontSize: 13, color: INK, valign: "top", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.6, y: 0.95, w: 12.13, h: 1.25, fontSize: 36, color: INK, valign: "top", margin: 0, lineSpacingMultiple: 0.95 }, text: "" } },
    { text: { text: "[Company name] · Confidential", options: { x: 0.6, y: 6.98, w: 6.0, h: 0.3, fontSize: 10, color: MUTED, margin: 0 } } },
  ],
  slideNumber: { x: 12.23, y: 6.98, w: 0.5, h: 0.3, fontSize: 10, color: MUTED, align: "right", margin: 0 },
});

pres.defineSlideMaster({
  title: "STATEMENT_INK",
  background: { color: INK },
  objects: [
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.6, y: 1.2, w: 12.13, h: 3.2, fontSize: 54, color: BONE, valign: "bottom", margin: 0, lineSpacingMultiple: 0.95 }, text: "" } },
    { placeholder: { options: { name: "sub", type: "body", x: 0.6, y: 4.75, w: 12.13, h: 1.3, fontSize: 20, color: HAIR, valign: "top", margin: 0 }, text: "" } },
  ],
});

// ---------- Helpers ----------
const T = (slide, text, o) => slide.addText(text, { isTextBox: true, margin: 0, valign: "top", ...o });
const hl = (text, o = {}) => ({ text, options: { highlight: LIME, color: INK, ...o } });
const card = (slide, o, name) => slide.addShape(pres.shapes.RECTANGLE, { fill: { color: WHITE }, line: { color: HAIR, width: 0.75 }, objectName: name, ...o });
const panel = (slide, o, name, color = PANEL) => slide.addShape(pres.shapes.RECTANGLE, { fill: { color }, line: { type: "none" }, objectName: name, ...o });
const rule = (slide, x, y, w, color = HAIR) => slide.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color, width: 0.75 } });
const vrule = (slide, x, y, h, color = HAIR) => slide.addShape(pres.shapes.LINE, { x, y, w: 0, h, line: { color, width: 0.75 } });
const label = (slide, text, o) => T(slide, text.toUpperCase(), { fontSize: 11, bold: true, charSpacing: 1.5, color: INK, ...o });

const content = (num, eyebrow, titleRuns, section, notes) => {
  const s = pres.addSlide({ masterName: "CONTENT_EDITORIAL", sectionTitle: section });
  s.addText([hl(` ${num} `, { bold: true }), { text: `   ${eyebrow}` }], { placeholder: "eyebrow" });
  s.addText(titleRuns, { placeholder: "title" });
  s.addNotes(notes);
  return s;
};
const COL3 = [0.6, 4.74, 8.88], W3 = 3.85;
const COL4 = [0.6, 3.705, 6.81, 9.915], W4 = 2.815;
const Y0 = 2.4; // content top

// ---------- 1. Title ----------
pres.addSection({ title: "Intro" });
{
  const s = pres.addSlide({ masterName: "TITLE_EDITORIAL", sectionTitle: "Intro" });
  card(s, { x: 0.6, y: 0.55, w: 1.5, h: 0.6, fill: { color: BONE }, line: { color: GRAY, width: 0.75, dashType: "dash" } }, "Logo placeholder");
  T(s, "[Logo]", { x: 0.6, y: 0.55, w: 1.5, h: 0.6, fontSize: 11, color: MUTED, align: "center", valign: "middle" });
  T(s, "INVESTOR PRESENTATION", { x: 8.73, y: 0.55, w: 4.0, h: 0.6, fontSize: 11, bold: true, charSpacing: 1.5, color: INK, align: "right", valign: "middle" });
  s.addText([hl("[Company name]")], { placeholder: "title" });
  s.addText("[One-liner: We help (who) do (what) by (how)]", { placeholder: "tagline" });
  panel(s, { x: 0.6, y: 5.0, w: 5.2, h: 0.6 }, "Raise tag", ACID);
  T(s, "Raising $[X]M · [Pre-seed / Seed / Series A]", { x: 0.8, y: 5.0, w: 4.9, h: 0.6, fontSize: 15, bold: true, color: INK, valign: "middle" });
  s.addText("[Founder name], [Title]  ·  [email@company.com]  ·  [Month YYYY]", { placeholder: "meta" });
  s.addNotes(NOTES[0]);
}

// ---------- 2. Problem ----------
pres.addSection({ title: "Opportunity" });
{
  const s = content("01", "The problem", [{ text: "[Target customers] struggle to [do X], and it costs them " }, hl("[time / money]")], "Opportunity", NOTES[1]);
  const rows = [
    ["[Pain point 1]", "[Who feels it, how often, and what it costs them]"],
    ["[Pain point 2]", "[Make it concrete: a real customer story beats an abstract claim]"],
    ["How it's handled today: [current workaround]", "[Spreadsheets, manual work, legacy tools, and why they fall short]"],
  ];
  rows.forEach(([h, d], i) => {
    const y = Y0 + i * 1.45;
    if (i > 0) rule(s, 0.6, y - 0.2, 7.0);
    T(s, `0${i + 1}`, { x: 0.6, y: y - 0.05, w: 0.9, h: 0.7, fontSize: 36, color: INK, fontFace: THEME.headFontFace });
    T(s, h, { x: 1.6, y, w: 6.0, h: 0.45, fontSize: 20, color: INK });
    T(s, d, { x: 1.6, y: y + 0.5, w: 6.0, h: 0.65, fontSize: 14, color: MUTED });
  });
  panel(s, { x: 8.1, y: Y0, w: 4.63, h: 4.3 }, "Stat panel");
  T(s, "[XX%]", { x: 8.45, y: 2.7, w: 4.0, h: 1.3, fontSize: 80, color: ACID, fontFace: THEME.headFontFace });
  T(s, "of [target customers] [experience this pain / lose $X per year to it]", { x: 8.45, y: 4.15, w: 3.95, h: 1.4, fontSize: 18, color: BONE });
  T(s, "Source: [citation]", { x: 8.45, y: 6.15, w: 3.9, h: 0.3, fontSize: 11, color: GRAY });
}

// ---------- 3. Solution ----------
{
  const s = content("02", "The solution", [{ text: "[Product] lets [customer] " }, hl("[achieve outcome]"), { text: " in [time] instead of [time]" }], "Opportunity", NOTES[2]);
  card(s, { x: 0.6, y: Y0, w: 5.4, h: 2.95 }, "Today card");
  label(s, "Today", { x: 0.95, y: 2.7, w: 4.7, h: 0.3, color: MUTED });
  T(s, [
    { text: "[Slow / manual step]", options: { bullet: true, breakLine: true } },
    { text: "[Costly or error-prone step]", options: { bullet: true, breakLine: true } },
    { text: "[The outcome customers settle for]", options: { bullet: true } },
  ], { x: 0.95, y: 3.15, w: 4.75, h: 1.95, fontSize: 17, color: INK, paraSpaceAfter: 10 });

  T(s, "→", { x: 6.0, y: 3.3, w: 1.3, h: 0.9, fontSize: 48, color: INK, align: "center", valign: "middle" });

  panel(s, { x: 7.3, y: Y0, w: 5.43, h: 2.95 }, "With product card", ACID);
  label(s, "With [Product]", { x: 7.65, y: 2.7, w: 4.7, h: 0.3 });
  T(s, [
    { text: "[What becomes fast or automatic]", options: { bullet: true, breakLine: true } },
    { text: "[Measurable gain: X× faster, $Y saved]", options: { bullet: true, breakLine: true } },
    { text: "[A new outcome that wasn't possible before]", options: { bullet: true } },
  ], { x: 7.65, y: 3.15, w: 4.8, h: 1.95, fontSize: 17, color: INK, paraSpaceAfter: 10 });

  panel(s, { x: 0, y: 5.65, w: 13.333, h: 1.0 }, "Insight band");
  T(s, [
    { text: "Our insight  ", options: { bold: true, color: ACID } },
    { text: "[The non-obvious thing you understand about this problem that others miss]", options: { color: BONE } },
  ], { x: 0.6, y: 5.65, w: 12.13, h: 1.0, fontSize: 18, valign: "middle" });
}

// ---------- 4. Product ----------
{
  const s = content("03", "Product", [{ text: "[How it works: " }, hl("the product in one sentence"), { text: "]" }], "Opportunity", NOTES[3]);
  card(s, { x: 0.6, y: Y0, w: 7.4, h: 4.3 }, "Browser frame");
  panel(s, { x: 0.6, y: Y0, w: 7.4, h: 0.4 }, "Browser bar");
  [0, 1, 2].forEach((i) => s.addShape(pres.shapes.OVAL, { x: 0.8 + i * 0.22, y: Y0 + 0.13, w: 0.14, h: 0.14, fill: { color: i === 0 ? ACID : GRAY }, line: { type: "none" } }));
  T(s, "[Product screenshot, mockup, or demo GIF]", { x: 0.6, y: Y0 + 0.4, w: 7.4, h: 3.9, fontSize: 16, color: MUTED, align: "center", valign: "middle" });
  [1, 2, 3].forEach((n, i) => {
    const y = Y0 + i * 1.45;
    if (i > 0) rule(s, 8.45, y - 0.2, 4.28);
    T(s, [hl(` 0${n} `, { bold: true })], { x: 8.45, y, w: 0.6, h: 0.35, fontSize: 13 });
    T(s, `[Key feature ${n}]`, { x: 9.2, y: y - 0.04, w: 3.53, h: 0.45, fontSize: 20, color: INK });
    T(s, "[What it does and why the user cares]", { x: 9.2, y: y + 0.45, w: 3.53, h: 0.65, fontSize: 14, color: MUTED });
  });
}

// ---------- 5. Why now ----------
{
  const s = content("04", "Why now", [{ text: "Why now: " }, hl("[the shift that makes this possible today]")], "Opportunity", NOTES[4]);
  const cols = [
    ["Technology", "[What changed in the tech]"],
    ["Market / behavior", "[What changed in how people buy or work]"],
    ["Regulation / cost", "[What changed in rules or costs]"],
  ];
  cols.forEach(([lab, head], i) => {
    const x = COL3[i] + (i ? 0.3 : 0), w = W3 - 0.3;
    if (i > 0) vrule(s, COL3[i] - 0.15, Y0, 4.3);
    T(s, `0${i + 1}`, { x, y: Y0 - 0.1, w, h: 1.2, fontSize: 72, color: INK, fontFace: THEME.headFontFace });
    T(s, [hl(` ${lab.toUpperCase()} `, { bold: true })], { x, y: 3.7, w, h: 0.3, fontSize: 11, charSpacing: 1.5 });
    T(s, head, { x, y: 4.15, w: w - 0.1, h: 0.9, fontSize: 22, color: INK });
    T(s, "[Why this makes your solution possible, or necessary, now and not 5 years ago]", { x, y: 5.2, w: w - 0.1, h: 1.2, fontSize: 14, color: MUTED });
  });
}

// ---------- 6. Market ----------
{
  const s = content("05", "Market size", [{ text: "A $[X]B market, and we can win " }, hl("$[Y]M of it"), { text: " in [N] years" }], "Opportunity", NOTES[5]);
  const cx = 3.15, bottom = 6.7;
  s.addShape(pres.shapes.OVAL, { x: cx - 2.15, y: bottom - 4.3, w: 4.3, h: 4.3, fill: { color: WHITE }, line: { color: INK, width: 0.75 }, objectName: "TAM circle" });
  s.addShape(pres.shapes.OVAL, { x: cx - 1.5, y: bottom - 3.0, w: 3.0, h: 3.0, fill: { color: PANEL }, line: { type: "none" }, objectName: "SAM circle" });
  s.addShape(pres.shapes.OVAL, { x: cx - 0.85, y: bottom - 1.7, w: 1.7, h: 1.7, fill: { color: ACID }, line: { type: "none" }, objectName: "SOM circle" });
  T(s, "TAM", { x: cx - 1, y: bottom - 3.85, w: 2, h: 0.4, fontSize: 14, bold: true, charSpacing: 1.5, color: INK, align: "center" });
  T(s, "SAM", { x: cx - 1, y: bottom - 2.6, w: 2, h: 0.4, fontSize: 14, bold: true, charSpacing: 1.5, color: BONE, align: "center" });
  T(s, "SOM", { x: cx - 1, y: bottom - 1.05, w: 2, h: 0.4, fontSize: 14, bold: true, charSpacing: 1.5, color: INK, align: "center" });

  const rows = [
    ["$[X]B", "Total addressable market (TAM)", "[Everyone who could ever buy this × annual spend]"],
    ["$[X]B", "Serviceable market (SAM)", "[The segment you can reach with today's product and channels]"],
    ["$[X]M", "Obtainable in [3–5] years (SOM)", "[The realistic share you can win: the number to defend]"],
  ];
  rows.forEach(([v, l, d], i) => {
    const y = Y0 + i * 1.2;
    if (i > 0) rule(s, 6.1, y - 0.15, 6.63);
    T(s, i === 2 ? [hl(v)] : v, { x: 6.1, y, w: 2.2, h: 0.75, fontSize: 36, color: INK, fontFace: THEME.headFontFace });
    T(s, l, { x: 8.45, y: y + 0.02, w: 4.28, h: 0.35, fontSize: 16, bold: true, color: INK });
    T(s, d, { x: 8.45, y: y + 0.42, w: 4.28, h: 0.6, fontSize: 13, color: MUTED });
  });
  panel(s, { x: 6.1, y: 5.85, w: 6.63, h: 0.85 }, "Bottom-up math");
  T(s, [
    { text: "BOTTOM-UP", options: { bold: true, color: ACID, fontSize: 11, charSpacing: 1.5, breakLine: true } },
    { text: "[# target customers] × $[annual contract value] = $[SAM]", options: { color: BONE, fontSize: 14 } },
  ], { x: 6.35, y: 5.85, w: 6.3, h: 0.85, valign: "middle", paraSpaceAfter: 2 });
}

// ---------- 7. Business model ----------
pres.addSection({ title: "Business" });
{
  const s = content("06", "Business model", [{ text: "We charge [customer] " }, hl("[$X per unit]"), { text: ": [pricing model in one line]" }], "Business", NOTES[6]);
  ["[Tier 1]", "[Tier 2]", "[Tier 3]"].forEach((name, i) => {
    const x = COL3[i], feat = i === 1;
    if (feat) panel(s, { x, y: Y0 - 0.1, w: W3, h: 2.1 }, `Pricing tier ${i + 1}`, ACID);
    else card(s, { x, y: Y0 - 0.1, w: W3, h: 2.1 }, `Pricing tier ${i + 1}`);
    label(s, name, { x: x + 0.35, y: Y0 + 0.15, w: W3 - 0.7, h: 0.3, color: feat ? INK : MUTED });
    T(s, [
      { text: "$[X]", options: { fontSize: 40, fontFace: THEME.headFontFace } },
      { text: "  / [user · month]", options: { fontSize: 14 } },
    ], { x: x + 0.35, y: Y0 + 0.5, w: W3 - 0.7, h: 0.75, color: INK, valign: "bottom" });
    T(s, "[Who it's for and what's included]", { x: x + 0.35, y: Y0 + 1.4, w: W3 - 0.7, h: 0.45, fontSize: 14, color: feat ? INK : MUTED });
  });
  // KPI ticker band
  panel(s, { x: 0, y: 4.6, w: 13.333, h: 2.1 }, "Unit economics band");
  label(s, "Unit economics", { x: 0.6, y: 4.85, w: 6, h: 0.3, color: ACID });
  [["$[X]", "Avg. contract value (ACV)"], ["[X]%", "Gross margin"], ["[N] mo", "CAC payback period"], ["[X]:1", "LTV : CAC"]].forEach(([v, l], i) => {
    const x = COL4[i];
    if (i > 0) vrule(s, x - 0.15, 5.35, 1.1, C.accent6);
    T(s, v, { x: x + (i ? 0.1 : 0), y: 5.3, w: W4 - 0.2, h: 0.75, fontSize: 40, color: ACID, fontFace: THEME.headFontFace });
    T(s, l, { x: x + (i ? 0.1 : 0), y: 6.08, w: W4 - 0.2, h: 0.35, fontSize: 13, color: HAIR });
  });
}

// ---------- 8. Traction ----------
{
  const s = content("07", "Traction", [hl("[Key metric] grew [X]×"), { text: " in [N] months" }], "Business", NOTES[7]);
  panel(s, { x: 0.6, y: Y0, w: 7.6, h: 4.3 }, "Chart panel");
  s.addChart(pres.charts.BAR, [{ name: "[Metric]", labels: ["[M1]", "[M2]", "[M3]", "[M4]", "[M5]", "[M6]"], values: [10, 14, 19, 26, 34, 45] }], {
    x: 0.8, y: Y0 + 0.15, w: 7.2, h: 4.0, barDir: "col", barGapWidthPct: 45,
    chartColors: [LIME], showLegend: false,
    showTitle: true, title: "[Revenue / users] by month (sample data: replace)", titleFontSize: 13, titleColor: H.accent5, titleFontFace: "+mn-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: H.lt1, dataLabelFontFace: "+mn-lt",
    catAxisLabelColor: H.accent4, catAxisLabelFontSize: 12, catAxisLabelFontFace: "+mn-lt", catAxisLineShow: false,
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
  });
  [["$[X]", "Monthly recurring revenue"], ["[X]%", "Month-over-month growth"], ["[X]%", "Net revenue retention"]].forEach(([v, l], i) => {
    const y = Y0 + i * 1.5;
    if (i === 0) panel(s, { x: 8.5, y, w: 4.23, h: 1.3 }, `Traction stat ${i + 1}`, ACID);
    else card(s, { x: 8.5, y, w: 4.23, h: 1.3 }, `Traction stat ${i + 1}`);
    T(s, v, { x: 8.8, y: y + 0.12, w: 3.7, h: 0.7, fontSize: 36, color: INK, fontFace: THEME.headFontFace });
    T(s, l, { x: 8.8, y: y + 0.85, w: 3.7, h: 0.3, fontSize: 13, color: i === 0 ? INK : MUTED });
  });
}

// ---------- 9. Competition ----------
{
  const s = content("08", "Competition", [{ text: "[Company] is the only [category] that " }, hl("[key differentiator]")], "Business", NOTES[8]);
  T(s, "↑  [Y axis: e.g., Depth / power]", { x: 0.6, y: Y0 - 0.05, w: 6.4, h: 0.3, fontSize: 12, color: MUTED });
  card(s, { x: 0.6, y: Y0 + 0.35, w: 6.4, h: 3.55 }, "Matrix");
  vrule(s, 3.8, Y0 + 0.35, 3.55, INK);
  rule(s, 0.6, Y0 + 2.125, 6.4, INK);
  T(s, "[X axis: e.g., Ease of use]  →", { x: 0.6, y: 6.35, w: 6.4, h: 0.3, fontSize: 12, color: MUTED, align: "right" });
  s.addShape(pres.shapes.OVAL, { x: 6.3, y: Y0 + 0.6, w: 0.45, h: 0.45, fill: { color: ACID }, line: { color: INK, width: 1.5 } });
  T(s, [hl(" [Your company] ", { bold: true })], { x: 4.0, y: Y0 + 0.6, w: 2.2, h: 0.45, fontSize: 14, align: "right", valign: "middle" });
  [[1.0, 3.25, "[Competitor A]"], [4.3, 5.0, "[Competitor B]"], [1.0, 5.4, "[Competitor C]"]].forEach(([x, y, n]) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: 0.32, h: 0.32, fill: { color: GRAY }, line: { type: "none" } });
    T(s, n, { x: x + 0.45, y, w: 1.9, h: 0.32, fontSize: 13, color: MUTED, valign: "middle" });
  });
  label(s, "Why we win", { x: 7.6, y: Y0 + 0.35, w: 5, h: 0.3 });
  [1, 2, 3].forEach((n, i) => {
    const y = Y0 + 0.85 + i * 1.15;
    if (i > 0) rule(s, 7.6, y - 0.15, 5.13);
    T(s, `0${n}`, { x: 7.6, y: y - 0.05, w: 0.7, h: 0.5, fontSize: 24, color: INK, fontFace: THEME.headFontFace });
    T(s, `[Unfair advantage ${n}]`, { x: 8.35, y, w: 4.38, h: 0.35, fontSize: 16, bold: true, color: INK });
    T(s, "[e.g., proprietary data, network effects, distribution, deep tech]", { x: 8.35, y: y + 0.4, w: 4.38, h: 0.55, fontSize: 13, color: MUTED });
  });
}

// ---------- 10. Go-to-market ----------
{
  const s = content("09", "Go-to-market", [{ text: "How we reach customers: " }, hl("[primary channel]")], "Business", NOTES[9]);
  const steps = [["Step 1 · Land", "[e.g., Founder-led sales to 10 design partners]"], ["Step 2 · Expand", "[e.g., Referrals and upsell within accounts]"], ["Step 3 · Scale", "[e.g., Inside sales team + partner channel]"]];
  steps.forEach(([lab, head], i) => {
    const x = COL3[i];
    T(s, `0${i + 1}`, { x, y: Y0 - 0.15, w: 1.4, h: 1.0, fontSize: 60, color: INK, fontFace: THEME.headFontFace });
    if (i < 2) s.addShape(pres.shapes.LINE, { x: x + 1.5, y: Y0 + 0.38, w: COL3[i + 1] - x - 1.7, h: 0, line: { color: INK, width: 1, endArrowType: "triangle" } });
    T(s, [hl(` ${lab.toUpperCase()} `, { bold: true })], { x, y: 3.45, w: W3 - 0.2, h: 0.3, fontSize: 11, charSpacing: 1.5 });
    T(s, head, { x, y: 3.85, w: W3 - 0.3, h: 0.85, fontSize: 19, color: INK });
    T(s, "[Timing, target, and what success looks like]", { x, y: 4.7, w: W3 - 0.3, h: 0.5, fontSize: 14, color: MUTED });
  });
  [["Ideal customer", "[Industry, company size, buyer title]"], ["Sales motion", "[Self-serve · Product-led · Sales-led]"], ["Proof it works", "[CAC by channel, conversion rate, pipeline]"]].forEach(([h, d], i) => {
    const x = COL3[i];
    card(s, { x, y: 5.4, w: W3, h: 1.3 }, `GTM card ${i + 1}`);
    label(s, h, { x: x + 0.3, y: 5.6, w: W3 - 0.6, h: 0.3 });
    T(s, d, { x: x + 0.3, y: 5.98, w: W3 - 0.6, h: 0.6, fontSize: 14, color: MUTED });
  });
}

// ---------- 11. Team ----------
pres.addSection({ title: "Team & Financials" });
{
  const s = content("10", "Team", [{ text: "Why us: " }, hl("[the unfair advantage this team brings]")], "Team & Financials", NOTES[10]);
  [1, 2, 3, 4].forEach((n, i) => {
    const x = COL4[i];
    card(s, { x, y: Y0, w: W4, h: 3.9 }, `Team card ${n}`);
    panel(s, { x: x + 0.25, y: Y0 + 0.25, w: W4 - 0.5, h: 1.45 }, `Photo ${n}`, HAIR);
    T(s, "[Photo]", { x: x + 0.25, y: Y0 + 0.25, w: W4 - 0.5, h: 1.45, fontSize: 11, color: MUTED, align: "center", valign: "middle" });
    T(s, "[Name]", { x: x + 0.25, y: Y0 + 1.85, w: W4 - 0.5, h: 0.4, fontSize: 20, color: INK, fontFace: THEME.headFontFace });
    T(s, [hl(" [Role] ", { bold: true })], { x: x + 0.25, y: Y0 + 2.3, w: W4 - 0.5, h: 0.3, fontSize: 12 });
    T(s, "[Prior company, exit, or domain expertise: why you're the one to build this]", { x: x + 0.25, y: Y0 + 2.7, w: W4 - 0.5, h: 1.05, fontSize: 13, color: MUTED });
  });
  T(s, [
    { text: "Advisors & investors  ", options: { bold: true, color: INK } },
    { text: "[Name (credential)]  ·  [Name (credential)]  ·  [Name (credential)]", options: { color: MUTED } },
  ], { x: 0.6, y: 6.4, w: 12.13, h: 0.4, fontSize: 14, valign: "middle" });
}

// ---------- 12. Financials ----------
{
  const s = content("11", "Financials", [{ text: "Path to " }, hl("$[X]M revenue"), { text: " by [year]" }], "Team & Financials", NOTES[11]);
  const hdr = (t) => ({ text: t, options: { bold: true, color: BONE, fill: { color: PANEL }, align: t ? "center" : "left" } });
  const years = ["[Year 1]", "[Year 2]", "[Year 3]", "[Year 4]", "[Year 5]"];
  const rowsDef = [["Revenue", "$[ ]"], ["Gross margin", "[ ]%"], ["Operating expenses", "$[ ]"], ["Net burn / EBITDA", "$[ ]"], ["Ending cash", "$[ ]"], ["Headcount", "[ ]"]];
  const rows = [[hdr(""), ...years.map(hdr)]];
  rowsDef.forEach(([lab, v], r) => {
    const fill = { color: r === 0 ? ACID : WHITE };
    rows.push([{ text: lab, options: { bold: true, color: INK, fill } }, ...years.map(() => ({ text: v, options: { color: r === 0 ? INK : MUTED, align: "center", fill } }))]);
  });
  s.addTable(rows, { x: 0.6, y: Y0, w: 12.13, colW: [3.13, 1.8, 1.8, 1.8, 1.8, 1.8], rowH: 0.4, fontSize: 14, valign: "middle", border: { type: "solid", pt: 0.75, color: H.accent3 }, margin: [0, 0.12, 0, 0.12] });
  card(s, { x: 0.6, y: 5.4, w: 12.13, h: 1.3 }, "Assumptions card");
  label(s, "Key assumptions", { x: 0.9, y: 5.55, w: 6, h: 0.3 });
  T(s, [
    { text: "[Growth rate and what drives it]", options: { bullet: true, breakLine: true } },
    { text: "[Pricing, churn, and sales capacity assumptions]", options: { bullet: true, breakLine: true } },
    { text: "[When you reach breakeven, or what the next round funds]", options: { bullet: true } },
  ], { x: 0.9, y: 5.88, w: 11.5, h: 0.78, fontSize: 14, color: INK });
}

// ---------- 13. The ask ----------
{
  const s = content("12", "The ask", [{ text: "We're raising " }, hl("$[X]M"), { text: " to reach [milestone] in [N] months" }], "Team & Financials", NOTES[12]);
  panel(s, { x: 0.6, y: Y0, w: 4.6, h: 4.3 }, "Raise panel", ACID);
  label(s, "Raising", { x: 0.95, y: 2.7, w: 3.9, h: 0.3 });
  T(s, "$[X]M", { x: 0.95, y: 3.05, w: 4.0, h: 1.3, fontSize: 80, color: INK, fontFace: THEME.headFontFace });
  rule(s, 0.95, 4.6, 3.9, INK);
  T(s, [
    { text: "[SAFE / priced round]", options: { breakLine: true } },
    { text: "[Pre-seed / Seed / Series A]", options: { breakLine: true } },
    { text: "[$X committed · Lead: (name)]" },
  ], { x: 0.95, y: 4.8, w: 3.95, h: 1.6, fontSize: 16, color: INK, paraSpaceAfter: 6 });

  s.addChart(pres.charts.DOUGHNUT, [{ name: "Use of funds", labels: ["Product & engineering", "Sales & marketing", "Operations & G&A", "[Other]"], values: [25, 25, 25, 25] }], {
    x: 5.6, y: Y0 - 0.05, w: 7.13, h: 2.75, holeSize: 62,
    chartColors: [LIME, H.dk1, H.accent4, H.accent3],
    showTitle: true, title: "Use of funds (placeholder split: replace)", titleFontSize: 13, titleColor: H.dk2, titleFontFace: "+mn-lt",
    showLegend: true, legendPos: "r", legendFontSize: 13, legendColor: H.dk1, legendFontFace: "+mn-lt",
    showPercent: false, showValue: false, showLabel: false,
  });
  const ms = [["Milestone 1", "[e.g., $1M ARR]", "[by month N]"], ["Milestone 2", "[e.g., 50 logos]", "[by month N]"], ["Runway", "[N] months", "[to Series X metrics]"]];
  const mw = (7.13 - 0.5) / 3;
  ms.forEach(([l, h, d], i) => {
    const x = 5.6 + i * (mw + 0.25);
    card(s, { x, y: 5.1, w: mw, h: 1.6 }, `Milestone ${i + 1}`);
    label(s, l, { x: x + 0.25, y: 5.28, w: mw - 0.5, h: 0.3, color: MUTED });
    T(s, h, { x: x + 0.25, y: 5.62, w: mw - 0.4, h: 0.45, fontSize: 17, color: INK, fontFace: THEME.headFontFace });
    T(s, d, { x: x + 0.25, y: 6.12, w: mw - 0.4, h: 0.35, fontSize: 13, color: MUTED });
  });
}

// ---------- 14. Vision / close ----------
pres.addSection({ title: "Close" });
{
  const s = pres.addSlide({ masterName: "STATEMENT_INK", sectionTitle: "Close" });
  T(s, [hl(" VISION ", { bold: true })], { x: 0.6, y: 0.6, w: 3, h: 0.35, fontSize: 13, charSpacing: 1.5 });
  s.addText([{ text: "[Your vision in one bold sentence: " }, hl("what the world looks like if you win"), { text: "]" }], { placeholder: "title" });
  s.addText("[Founder name]  ·  [email@company.com]  ·  [phone]  ·  [company.com]", { placeholder: "sub" });
  s.addNotes(NOTES[13]);
}

// ---------- 15. Appendix ----------
{
  const s = pres.addSlide({ masterName: "STATEMENT_INK", sectionTitle: "Close" });
  T(s, [hl(" BACKUP ", { bold: true })], { x: 0.6, y: 0.6, w: 3, h: 0.35, fontSize: 13, charSpacing: 1.5 });
  s.addText([hl("Appendix")], { placeholder: "title" });
  s.addText("[Detailed financials  ·  Cohort and retention data  ·  Customer case studies  ·  Technical architecture  ·  Product roadmap  ·  Cap table]", { placeholder: "sub" });
  s.addNotes(NOTES[14]);
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  await scrubImagePaths(OUT);
  console.log("wrote", OUT);
})();
