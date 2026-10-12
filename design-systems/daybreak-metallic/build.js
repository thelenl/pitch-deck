// Daybreak Metallic: Daybreak made sensuous and metallic. Liquid-metal silk (rose gold, lilac chrome,
// champagne), dark plum panels, serif display type, chrome spheres; fuller, editorial layouts.
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(path.join(__dirname, "..", "_shared", "apply_theme.js"));
const { scrubImagePaths } = require(path.join(__dirname, "..", "_shared", "scrub_image_paths.js"));

const OUT = process.argv[2] || path.join(__dirname, "..", "..", "pitch-deck-daybreak-metallic.pptx");
const ART = (f) => path.join(__dirname, "art", f);

const THEME = require("./theme.json"); // palette + fonts: edit theme.json
const H = THEME.colors;
const HEAD = "+mj-lt"; // theme heading font (Instrument Serif)

// Speaker notes come from the template so every style says the same thing.
const NOTES = [...fs.readFileSync(path.join(__dirname, "..", "template", "build.js"), "utf8")
  .matchAll(/addNotes\(("(?:[^"\\]|\\.)*")\)/g)].map((m) => JSON.parse(m[1]));
if (NOTES.length !== 15) throw new Error(`expected 15 notes in template/build.js, found ${NOTES.length}`);

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.title = "Investor Pitch Deck Template (Daybreak Metallic)";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;

// Split layouts: a full-height dark metallic panel (art/bg_split_*.jpg). Keep PANEL in sync with art.py PANEL_IN.
const SW = 13.333, PANEL = 4.9;
const R_W = SW - PANEL - 0.6 - 0.5;   // content width beside a right panel (x 0.6 .. 7.933)
const L_X = PANEL + 0.55;             // content x beside a left panel
const L_W = SW - L_X - 0.6;           // content width beside a left panel
const PX = SW - PANEL + 0.45;         // text x inside a right panel
const PW = PANEL - 0.9;               // text width inside a panel

// ---------- Layouts ----------
const eyebrowAndTitle = (x, w, titleSize) => [
  { image: { x, y: 0.47, w: 0.2, h: 0.2, path: ART("orb_orchid.png") } },
  { placeholder: { options: { name: "eyebrow", type: "body", x: x + 0.32, y: 0.42, w: w - 0.32, h: 0.3, fontSize: 13, bold: true, color: C.accent1, charSpacing: 3, valign: "middle", margin: 0 }, text: "" } },
  { placeholder: { options: { name: "title", type: "title", align: "left", x, y: 0.78, w, h: 1.1, fontSize: titleSize, lineSpacingMultiple: 0.88, bold: false, color: C.text1, valign: "top", margin: 0 }, text: "" } },
];
const footer = (x, color) => ({ text: { text: "[Company name] · Confidential", options: { x, y: 6.95, w: 4.5, h: 0.3, fontSize: 10, color, margin: 0 } } });

pres.defineSlideMaster({
  title: "TITLE",
  background: { path: ART("bg_title.jpg") },
  objects: [
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.8, y: 1.9, w: 8.2, h: 1.8, fontSize: 84, bold: false, color: C.text1, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "tagline", type: "body", x: 0.8, y: 3.85, w: 7.2, h: 1.0, fontSize: 22, color: C.text2, valign: "top", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "meta", type: "body", x: 0.8, y: 6.35, w: 7.0, h: 0.45, fontSize: 13, color: C.text2, valign: "top", margin: 0 }, text: "" } },
  ],
});
pres.defineSlideMaster({
  title: "CONTENT",
  background: { path: ART("bg_content.jpg") },
  margin: [0.5, 0.6, 0.8, 0.6],
  objects: [...eyebrowAndTitle(0.6, 12.13, 38), footer(0.6, C.text2)],
  slideNumber: { x: 12.23, y: 6.95, w: 0.5, h: 0.3, fontSize: 10, color: C.text2, align: "right", margin: 0 },
});
pres.defineSlideMaster({
  title: "SPLIT_RIGHT",
  background: { path: ART("bg_split_r.jpg") },
  margin: [0.5, PANEL + 0.5, 0.8, 0.6],
  objects: [...eyebrowAndTitle(0.6, R_W, 32), footer(0.6, C.text2)],
  slideNumber: { x: 12.23, y: 6.95, w: 0.5, h: 0.3, fontSize: 10, color: C.accent6, align: "right", margin: 0 },
});
pres.defineSlideMaster({
  title: "SPLIT_LEFT",
  background: { path: ART("bg_split_l.jpg") },
  margin: [0.5, 0.6, 0.8, L_X],
  objects: [...eyebrowAndTitle(L_X, L_W, 32), footer(L_X, C.text2)], // footer on the light side: the panel bottom is bright metal
  slideNumber: { x: 12.23, y: 6.95, w: 0.5, h: 0.3, fontSize: 10, color: C.text2, align: "right", margin: 0 },
});
pres.defineSlideMaster({
  title: "STATEMENT_DARK",
  background: { path: ART("bg_statement.jpg") },
  objects: [
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.8, y: 1.2, w: 11.7, h: 2.7, fontSize: 60, lineSpacingMultiple: 0.9, bold: false, color: C.background1, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "sub", type: "body", x: 0.8, y: 4.15, w: 11.7, h: 1.2, fontSize: 22, color: C.accent6, valign: "top", margin: 0 }, text: "" } },
  ],
});

// ---------- Helpers ----------
const T = (slide, text, o) => slide.addText(text, { isTextBox: true, margin: 0, valign: "top", ...o });
const shadow = () => ({ type: "outer", color: H.accent2, opacity: 0.14, blur: 30, offset: 6, angle: 90 });
const card = (slide, x, y, w, h, name) =>
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.28, fill: { color: C.background1 }, line: { color: C.accent5, width: 0.75 }, shadow: shadow(), objectName: name });
const tint = (slide, x, y, w, h, name) =>
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.28, fill: { color: "F0E4E6" }, line: { type: "none" }, objectName: name });
const img = (slide, file, x, y, w, h, name) => slide.addImage({ path: ART(file), x, y, w, h, altText: "", objectName: name });
// Rose-gold chrome sphere with an italic serif numeral
const num = (slide, x, y, d, label) => {
  img(slide, "orb_rosegold.png", x, y, d, d, `Marker ${label}`);
  T(slide, label, { x, y, w: d, h: d, fontSize: Math.round(d * 34), fontFace: HEAD, italic: true, color: C.text1, align: "center", valign: "middle" });
};
// Title = plain runs + one serif-italic emphasised phrase (orchid on light, rose gold on dark)
const titleRuns = (parts, size, dark = false) => parts.map(([t, em]) => em
  ? { text: t, options: { fontFace: HEAD, italic: true, color: dark ? C.accent3 : C.accent1, fontSize: size } }
  : { text: t });
const content = (eyebrow, parts, section, master = "CONTENT") => {
  const s = pres.addSlide({ masterName: master, sectionTitle: section });
  s.addText(eyebrow, { placeholder: "eyebrow" });
  s.addText(titleRuns(parts, master === "CONTENT" ? 41 : 35), { placeholder: "title" });
  return s;
};
const label = (slide, text, x, y, w, color = C.accent1) =>
  T(slide, text, { x, y, w, h: 0.3, fontSize: 13, bold: true, color, charSpacing: 3 });
const COL3 = [0.6, 4.74, 8.88], W3 = 3.85;
const COL4 = [0.6, 3.705, 6.81, 9.915], W4 = 2.815;
const n2 = (i) => String(i).padStart(2, "0");

// ---------- 1. Title ----------
pres.addSection({ title: "Intro" });
{
  const s = pres.addSlide({ masterName: "TITLE", sectionTitle: "Intro" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 0.7, w: 1.6, h: 0.8, rectRadius: 0.14, fill: { color: C.background1, transparency: 40 }, line: { color: C.accent3, width: 1, dashType: "dash" }, objectName: "Logo placeholder" });
  T(s, "[Logo]", { x: 0.8, y: 0.7, w: 1.6, h: 0.8, fontSize: 12, color: C.text2, align: "center", valign: "middle" });
  s.addText("[Company name]", { placeholder: "title" });
  s.addText("[One-liner: We help (who) do (what) by (how)]", { placeholder: "tagline" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 5.1, w: 5.0, h: 0.62, rectRadius: 0.31, fill: { color: C.text1 }, line: { type: "none" }, shadow: shadow(), objectName: "Raise chip" });
  T(s, [
    { text: "Raising ", options: { color: C.accent6 } },
    { text: "$[X]M", options: { fontFace: HEAD, italic: true, fontSize: 22, color: C.accent3 } },
    { text: "  ·  [Pre-seed / Seed / Series A]", options: { color: C.background1 } },
  ], { x: 0.8, y: 5.1, w: 5.0, h: 0.62, fontSize: 15, bold: true, align: "center", valign: "middle" });
  s.addText("[Founder name], [Title]  ·  [email@company.com]  ·  [Month YYYY]", { placeholder: "meta" });
  s.addNotes(NOTES[0]);
}

// ---------- 2. Problem (split right) ----------
pres.addSection({ title: "Opportunity" });
{
  const s = content("01 — THE PROBLEM", [["[Target customers] struggle to [do X], and it costs them "], ["[time / money]", true]], "Opportunity", "SPLIT_RIGHT");
  [
    ["[Pain point 1]", "[Who feels it, how often, and what it costs them]"],
    ["[Pain point 2]", "[Make it concrete: a real customer story beats an abstract claim]"],
    ["How it's handled today: [current workaround]", "[Spreadsheets, manual work, legacy tools, and why they fall short]"],
  ].forEach(([h, d], i) => {
    const y = 2.1 + i * 1.55;
    num(s, 0.6, y, 0.62, n2(i + 1));
    T(s, h, { x: 1.45, y: y + 0.02, w: R_W - 0.85, h: 0.45, fontSize: 20, bold: true, color: C.text1 });
    T(s, d, { x: 1.45, y: y + 0.52, w: R_W - 0.85, h: 0.85, fontSize: 16, color: C.text2 });
  });
  label(s, "THE COST", PX, 1.3, PW, C.accent3);
  T(s, "[XX%]", { x: PX, y: 1.7, w: PW, h: 1.75, fontSize: 120, fontFace: HEAD, color: C.background1 });
  T(s, "of [target customers] [experience this pain / lose $X per year to it]", { x: PX, y: 3.6, w: PW, h: 1.6, fontSize: 22, color: C.background1 });
  T(s, "Source: [citation]", { x: PX, y: 6.25, w: PW, h: 0.35, fontSize: 12, color: C.accent6 });
  s.addNotes(NOTES[1]);
}

// ---------- 3. Solution ----------
{
  const s = content("02 — THE SOLUTION", [["[Product] lets [customer] "], ["[achieve outcome]", true], [" in [time] instead of [time]"]], "Opportunity");
  card(s, 0.6, 2.05, 5.4, 3.4, "Today card");
  label(s, "TODAY", 0.95, 2.35, 4.7, C.text2);
  T(s, [
    { text: "[Slow / manual step]", options: { bullet: true, breakLine: true } },
    { text: "[Costly or error-prone step]", options: { bullet: true, breakLine: true } },
    { text: "[The outcome customers settle for]", options: { bullet: true } },
  ], { x: 0.95, y: 2.85, w: 4.75, h: 2.4, fontSize: 19, color: C.text2, paraSpaceAfter: 14 });
  num(s, 6.22, 3.33, 0.85, "→");
  img(s, "card_solution.png", 7.3, 2.05, 5.43, 3.4, "With product card");
  label(s, "WITH [PRODUCT]", 7.65, 2.35, 4.7, C.accent3);
  T(s, [
    { text: "[What becomes fast or automatic]", options: { bullet: true, breakLine: true } },
    { text: "[Measurable gain: X× faster, $Y saved]", options: { bullet: true, breakLine: true } },
    { text: "[A new outcome that wasn't possible before]", options: { bullet: true } },
  ], { x: 7.65, y: 2.85, w: 4.8, h: 2.4, fontSize: 19, color: C.background1, paraSpaceAfter: 14 });
  img(s, "card_insight.png", 0.6, 5.7, 12.13, 1.05, "Insight card");
  T(s, [
    { text: "Our insight   ", options: { fontFace: HEAD, italic: true, fontSize: 32, color: C.accent3 } },
    { text: "[The non-obvious thing you understand about this problem that others miss]", options: { color: C.background1 } },
  ], { x: 0.95, y: 5.7, w: 11.5, h: 1.05, fontSize: 18, valign: "middle" });
  s.addNotes(NOTES[2]);
}

// ---------- 4. Product ----------
{
  const s = content("03 — PRODUCT", [["How it works: "], ["[the product in one sentence]", true]], "Opportunity");
  card(s, 0.6, 1.95, 7.9, 4.8, "Screenshot frame");
  [0, 1, 2].forEach((i) => s.addShape(pres.shapes.OVAL, { x: 0.88 + i * 0.24, y: 2.17, w: 0.14, h: 0.14, fill: { color: C.accent5 }, line: { type: "none" } }));
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.85, y: 2.5, w: 7.4, h: 4.0, rectRadius: 0.14, fill: { color: "F0E4E6" }, line: { color: C.accent3, width: 1, dashType: "dash" }, objectName: "Screenshot placeholder" });
  T(s, "[Product screenshot, mockup, or demo GIF]", { x: 0.85, y: 2.5, w: 7.4, h: 4.0, fontSize: 18, color: C.text2, align: "center", valign: "middle" });
  [1, 2, 3].forEach((n, i) => {
    const y = 2.0 + i * 1.6;
    num(s, 8.85, y, 0.62, n2(n));
    T(s, `[Key feature ${n}]`, { x: 9.65, y: y + 0.03, w: 3.08, h: 0.45, fontSize: 21, bold: true, color: C.text1 });
    T(s, "[What it does and why the user cares]", { x: 9.65, y: y + 0.52, w: 3.08, h: 0.95, fontSize: 16, color: C.text2 });
  });
  s.addNotes(NOTES[3]);
}

// ---------- 5. Why now ----------
{
  const s = content("04 — WHY NOW", [["Why now: "], ["[the shift that makes this possible today]", true]], "Opportunity");
  [["TECHNOLOGY", "[What changed in the tech]"], ["MARKET / BEHAVIOR", "[What changed in how people buy or work]"], ["REGULATION / COST", "[What changed in rules or costs]"]].forEach(([lab, head], i) => {
    const x = COL3[i], dark = i === 1;
    if (dark) img(s, "card_whynow.png", x, 2.0, W3, 4.75, "Why now card 2");
    else card(s, x, 2.0, W3, 4.75, `Why now card ${i + 1}`);
    num(s, x + 0.35, 2.35, 0.7, n2(i + 1));
    label(s, lab, x + 0.35, 3.3, W3 - 0.7, dark ? C.accent3 : C.accent1);
    T(s, head, { x: x + 0.35, y: 3.7, w: W3 - 0.7, h: 1.45, fontSize: 27, fontFace: HEAD, color: dark ? C.background1 : C.text1 });
    T(s, "[Why this makes your solution possible, or necessary, now and not 5 years ago]", { x: x + 0.35, y: 5.25, w: W3 - 0.7, h: 1.35, fontSize: 16, color: dark ? C.accent6 : C.text2 });
  });
  s.addNotes(NOTES[4]);
}

// ---------- 6. Market ----------
{
  const s = content("05 — MARKET SIZE", [["A $[X]B market, and we can win "], ["$[Y]M of it", true], [" in [N] years"]], "Opportunity");
  const cx = 3.175;
  s.addShape(pres.shapes.OVAL, { x: cx - 2.425, y: 1.92, w: 4.85, h: 4.85, fill: { color: C.background1 }, line: { color: C.accent3, width: 1.5 }, shadow: shadow(), objectName: "TAM circle" });
  s.addShape(pres.shapes.OVAL, { x: cx - 1.7, y: 3.37, w: 3.4, h: 3.4, fill: { color: "EADDF0" }, line: { type: "none" }, objectName: "SAM circle" });
  img(s, "orb_orchid.png", cx - 1.0, 4.77, 2.0, 2.0, "SOM sphere");
  T(s, "TAM", { x: cx - 1, y: 2.3, w: 2, h: 0.5, fontSize: 26, fontFace: HEAD, italic: true, color: C.text2, align: "center" });
  T(s, "SAM", { x: cx - 1, y: 3.75, w: 2, h: 0.5, fontSize: 26, fontFace: HEAD, italic: true, color: C.text1, align: "center" });
  T(s, "SOM", { x: cx - 1, y: 5.5, w: 2, h: 0.5, fontSize: 26, fontFace: HEAD, italic: true, color: C.background1, align: "center" });
  [
    ["$[X]B", "Total addressable market (TAM)", "[Everyone who could ever buy this × annual spend]"],
    ["$[X]B", "Serviceable market (SAM)", "[The segment you can reach with today's product and channels]"],
    ["$[X]M", "Obtainable in [3–5] years (SOM)", "[The realistic share you can win: the number to defend]"],
  ].forEach(([v, l, d], i) => {
    const y = 1.95 + i * 1.33;
    T(s, v, { x: 6.3, y: y - 0.05, w: 2.4, h: 0.9, fontSize: 56, fontFace: HEAD, color: i === 2 ? C.accent1 : C.text1 });
    T(s, l, { x: 8.8, y: y + 0.02, w: 3.93, h: 0.4, fontSize: 18, bold: true, color: C.text1 });
    T(s, d, { x: 8.8, y: y + 0.45, w: 3.93, h: 0.8, fontSize: 16, color: C.text2 });
  });
  tint(s, 6.3, 6.0, 6.43, 0.75, "Bottom-up math");
  T(s, [
    { text: "Bottom-up  ", options: { fontFace: HEAD, italic: true, fontSize: 24, color: C.accent1 } },
    { text: "[# customers] × $[ACV] = $[SAM]" },
  ], { x: 6.6, y: 6.0, w: 6.0, h: 0.75, fontSize: 16, color: C.text1, valign: "middle" });
  s.addNotes(NOTES[5]);
}

// ---------- 7. Business model ----------
pres.addSection({ title: "Business" });
{
  const s = content("06 — BUSINESS MODEL", [["We charge [customer] "], ["[$X per unit]", true], [": [pricing model in one line]"]], "Business");
  ["[TIER 1]", "[TIER 2]", "[TIER 3]"].forEach((name, i) => {
    const x = COL3[i], dark = i === 1;
    if (dark) img(s, "card_tier.png", x, 1.95, W3, 2.45, "Pricing tier 2");
    else card(s, x, 1.95, W3, 2.45, `Pricing tier ${i + 1}`);
    label(s, name, x + 0.35, 2.2, W3 - 0.7, dark ? C.accent3 : C.accent1);
    T(s, [
      { text: "$[X]", options: { fontSize: 54, fontFace: HEAD } },
      { text: "  / [user · month]", options: { fontSize: 16 } },
    ], { x: x + 0.35, y: 2.5, w: W3 - 0.7, h: 0.95, color: dark ? C.background1 : C.text1, valign: "bottom" });
    T(s, "[Who it's for and what's included]", { x: x + 0.35, y: 3.6, w: W3 - 0.7, h: 0.6, fontSize: 16, color: dark ? C.accent6 : C.text2 });
  });
  label(s, "UNIT ECONOMICS", 0.6, 4.62, 6);
  [["$[X]", "Avg. contract value (ACV)"], ["[X]%", "Gross margin"], ["[N] mo", "CAC payback period"], ["[X]:1", "LTV : CAC"]].forEach(([v, l], i) => {
    const x = COL4[i];
    card(s, x, 4.98, W4, 1.77, `Unit economics ${i + 1}`);
    T(s, v, { x: x + 0.3, y: 5.12, w: W4 - 0.6, h: 0.9, fontSize: 52, fontFace: HEAD, color: C.text1 });
    T(s, l, { x: x + 0.3, y: 6.08, w: W4 - 0.6, h: 0.45, fontSize: 16, color: C.text2 });
  });
  s.addNotes(NOTES[6]);
}

// ---------- 8. Traction (split right) ----------
{
  const s = content("07 — TRACTION", [["[Key metric] "], ["grew [X]×", true], [" in [N] months"]], "Business", "SPLIT_RIGHT");
  card(s, 0.6, 1.95, R_W, 4.8, "Chart card");
  s.addChart(pres.charts.BAR, [{ name: "[Metric]", labels: ["[M1]", "[M2]", "[M3]", "[M4]", "[M5]", "[M6]"], values: [10, 14, 19, 26, 34, 45] }], {
    x: 0.8, y: 2.1, w: R_W - 0.4, h: 4.5, barDir: "col", barGapWidthPct: 55,
    chartColors: [H.accent1], showLegend: false,
    showTitle: true, title: "[Revenue / users] by month (sample data: replace)", titleFontSize: 14, titleColor: H.dk2, titleFontFace: "+mn-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 13, dataLabelColor: H.dk2, dataLabelFontFace: "+mn-lt",
    catAxisLabelColor: H.dk2, catAxisLabelFontSize: 13, catAxisLabelFontFace: "+mn-lt", catAxisLineShow: false,
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
  });
  label(s, "KEY METRICS", PX, 1.0, PW, C.accent3);
  [["$[X]", "Monthly recurring revenue", C.background1], ["+[X]%", "Month-over-month growth", C.accent3], ["[X]%", "Net revenue retention", C.background1]].forEach(([v, l, col], i) => {
    const y = 1.5 + i * 1.75;
    T(s, v, { x: PX, y, w: PW, h: 1.05, fontSize: 64, fontFace: HEAD, color: col });
    T(s, l, { x: PX, y: y + 1.05, w: PW, h: 0.4, fontSize: 17, color: C.accent6 });
  });
  s.addNotes(NOTES[7]);
}

// ---------- 9. Competition ----------
{
  const s = content("08 — COMPETITION", [["[Company] is the only [category] that "], ["[key differentiator]", true]], "Business");
  T(s, "↑  [Y axis: e.g., Depth / power]", { x: 1.0, y: 1.95, w: 6.3, h: 0.3, fontSize: 13, color: C.text2 });
  card(s, 1.0, 2.3, 6.3, 4.05, "Matrix background");
  s.addShape(pres.shapes.LINE, { x: 4.15, y: 2.45, w: 0, h: 3.75, line: { color: C.accent5, width: 1.25 } });
  s.addShape(pres.shapes.LINE, { x: 1.15, y: 4.33, w: 6.0, h: 0, line: { color: C.accent5, width: 1.25 } });
  T(s, "[X axis: e.g., Ease of use]  →", { x: 1.0, y: 6.42, w: 6.3, h: 0.3, fontSize: 13, color: C.text2, align: "right" });
  img(s, "orb_orchid.png", 6.4, 2.5, 0.62, 0.62, "Your company marker");
  T(s, "[Your company]", { x: 4.25, y: 2.5, w: 2.05, h: 0.62, fontSize: 16, bold: true, color: C.text1, align: "right", valign: "middle" });
  [[1.4, 2.95, "[Competitor A]"], [4.6, 4.85, "[Competitor B]"], [1.4, 5.35, "[Competitor C]"]].forEach(([x, y, n]) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: 0.42, h: 0.42, fill: { color: "D9CCD6" }, line: { type: "none" } });
    T(s, n, { x: x + 0.55, y, w: 1.95, h: 0.42, fontSize: 15, color: C.text2, valign: "middle" });
  });
  label(s, "WHY WE WIN", 7.85, 2.3, 4.88);
  [1, 2, 3].forEach((n, i) => {
    const y = 2.8 + i * 1.3;
    num(s, 7.85, y, 0.55, n2(n));
    T(s, `[Unfair advantage ${n}]`, { x: 8.6, y: y + 0.02, w: 4.13, h: 0.4, fontSize: 19, bold: true, color: C.text1 });
    T(s, "[e.g., proprietary data, network effects, distribution, deep tech]", { x: 8.6, y: y + 0.47, w: 4.13, h: 0.75, fontSize: 15, color: C.text2 });
  });
  s.addNotes(NOTES[8]);
}

// ---------- 10. Go-to-market ----------
{
  const s = content("09 — GO-TO-MARKET", [["How we reach customers: "], ["[primary channel]", true]], "Business");
  [["STEP 1 · LAND", "[e.g., Founder-led sales to 10 design partners]"], ["STEP 2 · EXPAND", "[e.g., Referrals and upsell within accounts]"], ["STEP 3 · SCALE", "[e.g., Inside sales team + partner channel]"]].forEach(([lab, head], i) => {
    const x = COL3[i];
    num(s, x, 1.95, 0.85, n2(i + 1));
    if (i < 2) s.addShape(pres.shapes.LINE, { x: x + 1.0, y: 2.375, w: COL3[i + 1] - x - 1.15, h: 0, line: { color: C.accent3, width: 1.5, dashType: "dash", endArrowType: "triangle" } });
    label(s, lab, x, 3.0, W3 - 0.2);
    T(s, head, { x, y: 3.35, w: W3 - 0.2, h: 1.05, fontSize: 28, fontFace: HEAD, color: C.text1 });
    T(s, "[Timing, target, and what success looks like]", { x, y: 4.42, w: W3 - 0.2, h: 0.65, fontSize: 16, color: C.text2 });
  });
  [["Ideal customer", "[Industry, company size, buyer title]"], ["Sales motion", "[Self-serve, PLG, or sales team]"], ["Proof it works", "[CAC by channel, conversion rate, pipeline]"]].forEach(([h, d], i) => {
    const x = COL3[i];
    card(s, x, 5.2, W3, 1.55, `GTM card ${i + 1}`);
    T(s, h, { x: x + 0.3, y: 5.38, w: W3 - 0.6, h: 0.4, fontSize: 17, bold: true, color: C.text1 });
    T(s, d, { x: x + 0.3, y: 5.8, w: W3 - 0.6, h: 0.75, fontSize: 16, color: C.text2 });
  });
  s.addNotes(NOTES[9]);
}

// ---------- 11. Team ----------
pres.addSection({ title: "Team & Financials" });
{
  const s = content("10 — TEAM", [["Why us: "], ["[the unfair advantage this team brings]", true]], "Team & Financials");
  [1, 2, 3, 4].forEach((n, i) => {
    const x = COL4[i];
    card(s, x, 1.95, W4, 4.3, `Team card ${n}`);
    s.addShape(pres.shapes.OVAL, { x: x + 0.4, y: 2.35, w: 1.35, h: 1.35, fill: { color: "F0E4E6" }, line: { type: "none" }, objectName: `Photo ${n}` });
    T(s, "[Photo]", { x: x + 0.4, y: 2.35, w: 1.35, h: 1.35, fontSize: 12, color: C.text2, align: "center", valign: "middle" });
    img(s, "ring_rosegold.png", x + 0.3, 2.25, 1.55, 1.55, `Photo ring ${n}`);
    T(s, "[Name]", { x: x + 0.3, y: 3.95, w: W4 - 0.6, h: 0.55, fontSize: 31, fontFace: HEAD, color: C.text1 });
    T(s, "[Role]", { x: x + 0.3, y: 4.52, w: W4 - 0.6, h: 0.35, fontSize: 14, bold: true, color: C.accent1 });
    T(s, "[Prior company, exit, or domain expertise: why you're the one to build this]", { x: x + 0.3, y: 4.95, w: W4 - 0.6, h: 1.15, fontSize: 15, color: C.text2 });
  });
  T(s, [
    { text: "Advisors & investors   ", options: { fontFace: HEAD, italic: true, fontSize: 27, color: C.accent1 } },
    { text: "[Name (credential)]  ·  [Name (credential)]  ·  [Name (credential)]", options: { color: C.text2 } },
  ], { x: 0.6, y: 6.32, w: 12.13, h: 0.48, fontSize: 16, valign: "middle" });
  s.addNotes(NOTES[10]);
}

// ---------- 12. Financials ----------
{
  const s = content("11 — FINANCIALS", [["Path to "], ["$[X]M revenue", true], [" by [year]"]], "Team & Financials");
  const hdr = (t) => ({ text: t, options: { bold: true, color: C.accent6, fill: { color: C.text1 }, align: t ? "center" : "left" } });
  const years = ["[Year 1]", "[Year 2]", "[Year 3]", "[Year 4]", "[Year 5]"];
  const rowsDef = [["Revenue", "$[ ]"], ["Gross margin", "[ ]%"], ["Operating expenses", "$[ ]"], ["Net burn / EBITDA", "$[ ]"], ["Ending cash", "$[ ]"], ["Headcount", "[ ]"]];
  const rows = [[hdr(""), ...years.map(hdr)]];
  rowsDef.forEach(([lab, v], r) => {
    const fill = { color: r % 2 ? "FBF6F6" : C.background1 };
    rows.push([{ text: lab, options: { bold: true, color: C.text1, fill } }, ...years.map(() => ({ text: v, options: { color: C.text2, align: "center", fill } }))]);
  });
  s.addTable(rows, { x: 0.6, y: 1.95, w: 12.13, colW: [3.13, 1.8, 1.8, 1.8, 1.8, 1.8], rowH: 0.5, fontSize: 16, valign: "middle", border: { type: "solid", pt: 0.75, color: H.accent5 }, margin: [0, 0.14, 0, 0.14] });
  img(s, "card_insight.png", 0.6, 5.7, 12.13, 1.05, "Assumptions card");
  T(s, "Key assumptions", { x: 0.95, y: 5.7, w: 2.6, h: 1.05, fontSize: 30, fontFace: HEAD, italic: true, color: C.accent3, valign: "middle" });
  T(s, [
    { text: "[Growth rate and what drives it]", options: { bullet: true, breakLine: true } },
    { text: "[Pricing, churn, and sales capacity assumptions]", options: { bullet: true, breakLine: true } },
    { text: "[When you reach breakeven, or what the next round funds]", options: { bullet: true } },
  ], { x: 3.7, y: 5.78, w: 8.8, h: 0.9, fontSize: 15, color: C.background1, valign: "middle" });
  s.addNotes(NOTES[11]);
}

// ---------- 13. The ask (split left) ----------
{
  const s = content("12 — THE ASK", [["We're raising $[X]M to reach "], ["[milestone]", true], [" in [N] months"]], "Team & Financials", "SPLIT_LEFT");
  label(s, "RAISING", 0.55, 1.3, PW, C.accent3);
  T(s, "$[X]M", { x: 0.55, y: 1.7, w: PW, h: 1.75, fontSize: 120, fontFace: HEAD, color: C.background1 });
  T(s, [
    { text: "[SAFE / priced round]", options: { breakLine: true } },
    { text: "[Pre-seed / Seed / Series A]", options: { breakLine: true } },
    { text: "[$X committed · Lead: (name)]" },
  ], { x: 0.55, y: 3.75, w: PW, h: 1.9, fontSize: 20, color: C.accent6, paraSpaceAfter: 10 });
  card(s, L_X, 1.95, L_W, 2.9, "Use of funds card");
  s.addChart(pres.charts.DOUGHNUT, [{ name: "Use of funds", labels: ["Product & engineering", "Sales & marketing", "Operations & G&A", "[Other]"], values: [25, 25, 25, 25] }], {
    x: L_X + 0.15, y: 2.05, w: L_W - 0.3, h: 2.7, holeSize: 62,
    chartColors: [H.dk1, H.accent1, H.accent3, "C9B8F0"],
    showTitle: true, title: "Use of funds (placeholder split: replace)", titleFontSize: 14, titleColor: H.dk2, titleFontFace: "+mn-lt",
    showLegend: true, legendPos: "r", legendFontSize: 14, legendColor: H.dk1, legendFontFace: "+mn-lt",
    showPercent: false, showValue: false,
  });
  const mw = (L_W - 0.5) / 3;
  [["MILESTONE 1", "[e.g., $1M ARR]", "[by month N]"], ["MILESTONE 2", "[e.g., 50 logos]", "[by month N]"], ["RUNWAY", "[N] months", "[to next round]"]].forEach(([l, h, d], i) => {
    const x = L_X + i * (mw + 0.25);
    card(s, x, 5.05, mw, 1.7, `Milestone ${i + 1}`);
    T(s, l, { x: x + 0.25, y: 5.22, w: mw - 0.5, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 3 });
    T(s, h, { x: x + 0.25, y: 5.55, w: mw - 0.5, h: 0.55, fontSize: 22, fontFace: HEAD, color: C.text1 });
    T(s, d, { x: x + 0.25, y: 6.15, w: mw - 0.5, h: 0.4, fontSize: 15, color: C.text2 });
  });
  s.addNotes(NOTES[12]);
}

// ---------- 14. Vision / close ----------
pres.addSection({ title: "Close" });
{
  const s = pres.addSlide({ masterName: "STATEMENT_DARK", sectionTitle: "Close" });
  s.addText(titleRuns([["[Your vision in one bold sentence: "], ["what the world looks like if you win]", true]], 64, true), { placeholder: "title" });
  s.addText("[Founder name]  ·  [email@company.com]  ·  [phone]  ·  [company.com]", { placeholder: "sub" });
  s.addNotes(NOTES[13]);
}

// ---------- 15. Appendix ----------
{
  const s = pres.addSlide({ masterName: "STATEMENT_DARK", sectionTitle: "Close" });
  s.addText(titleRuns([["Appendix", true]], 88, true), { placeholder: "title" });
  s.addText("[Detailed financials  ·  Cohort and retention data  ·  Customer case studies  ·  Technical architecture  ·  Product roadmap  ·  Cap table]", { placeholder: "sub" });
  s.addNotes(NOTES[14]);
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  await scrubImagePaths(OUT);
  console.log("wrote", OUT);
})();
