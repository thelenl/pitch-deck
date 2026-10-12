// Liquid Glass restyle of the pitch deck template.
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(path.join(__dirname, "..", "_shared", "apply_theme.js"));
const { scrubImagePaths } = require(path.join(__dirname, "..", "_shared", "scrub_image_paths.js"));

const OUT = process.argv[2] || path.join(__dirname, "..", "..", "pitch-deck-liquid-glass.pptx");
const A = (f) => path.join(__dirname, f);

// Dark deck: dk1 is the canvas, lt1 the text.
const THEME = require("./theme.json"); // palette + fonts: edit theme.json
const H = THEME.colors;

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.title = "Investor Pitch Deck Template";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const INK = C.text1, CARD = C.text2, WHITE = C.background1, MUTED = C.background2;
const ACC = C.accent1, PEACH = C.accent2, LAV = C.accent3, STEEL = C.accent4, HAIR = C.accent5, ACC_LT = C.accent6;
const HEAD = "+mj-lt"; // theme heading font, for numerals and card headings

// ---------- Layouts ----------
pres.defineSlideMaster({
  title: "TITLE_DARK",
  background: { path: A("bg_title.jpg") },
  objects: [
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.8, y: 2.2, w: 8.6, h: 1.5, fontSize: 64, bold: false, color: WHITE, charSpacing: -1.5, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "tagline", type: "body", x: 0.8, y: 3.9, w: 7.6, h: 1.0, fontSize: 22, color: LAV, valign: "top", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "meta", type: "body", x: 0.8, y: 6.35, w: 9.0, h: 0.4, fontSize: 13, color: MUTED, valign: "top", margin: 0 }, text: "" } },
  ],
});

pres.defineSlideMaster({
  title: "CONTENT",
  background: { path: A("bg_content.jpg") },
  margin: [0.5, 0.6, 0.8, 0.6],
  objects: [
    { placeholder: { options: { name: "eyebrow", type: "body", x: 0.82, y: 0.45, w: 9.0, h: 0.3, fontSize: 11, color: MUTED, charSpacing: 3, valign: "middle", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.6, y: 0.85, w: 12.13, h: 1.0, fontSize: 28, bold: false, color: WHITE, charSpacing: -0.5, valign: "top", margin: 0 }, text: "" } },
    { text: { text: "[Company name] · Confidential", options: { x: 0.6, y: 6.98, w: 6.0, h: 0.3, fontSize: 9, color: STEEL, margin: 0 } } },
  ],
  slideNumber: { x: 12.23, y: 6.98, w: 0.5, h: 0.3, fontSize: 9, color: STEEL, align: "right", margin: 0 },
});

pres.defineSlideMaster({
  title: "STATEMENT_DARK",
  background: { path: A("bg_statement.jpg") },
  objects: [
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.8, y: 1.6, w: 10.4, h: 2.4, fontSize: 44, bold: false, color: WHITE, charSpacing: -1, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "sub", type: "body", x: 0.8, y: 4.3, w: 10.0, h: 1.4, fontSize: 20, color: LAV, valign: "top", margin: 0 }, text: "" } },
  ],
});

// ---------- Helpers ----------
const T = (slide, text, o) => slide.addText(text, { isTextBox: true, margin: 0, valign: "top", ...o });
// Frosted glass panel: a whisper of white fill and a hairline edge.
const glass = (slide, o) => {
  const { tint = 93, edge = 82, dark, accent, dash, ...rest } = o;
  const fill = dark ? { color: INK, transparency: 35 } : accent ? { color: ACC, transparency: 78 } : { color: WHITE, transparency: tint };
  const line = { color: accent ? ACC_LT : WHITE, transparency: accent ? 40 : edge, width: 0.75 };
  if (dash) line.dashType = "dash";
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { rectRadius: 0.2, fill, line, ...rest });
};
const orb = (slide, x, y, d, transparency = 0) => slide.addImage({ path: A("orb.png"), x, y, w: d, h: d, transparency, altText: "" });
const gdot = (slide, x, y, d, label, size = 13) => {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: WHITE, transparency: 90 }, line: { color: WHITE, transparency: 70, width: 0.75 } });
  if (label) T(slide, label, { x, y, w: d, h: d, fontSize: size, fontFace: HEAD, color: WHITE, align: "center", valign: "middle" });
};
const label = (slide, text, o) => T(slide, text, { fontSize: 11, color: MUTED, charSpacing: 3, ...o });
const content = (eyebrow, title, section) => {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: section });
  s.addShape(pres.shapes.OVAL, { x: 0.6, y: 0.55, w: 0.1, h: 0.1, fill: { color: ACC_LT }, line: { type: "none" }, objectName: "Eyebrow dot" });
  s.addText(eyebrow, { placeholder: "eyebrow" });
  s.addText(title, { placeholder: "title" });
  return s;
};
const COL3 = [0.6, 4.74, 8.88], W3 = 3.85;
const COL4 = [0.6, 3.705, 6.81, 9.915], W4 = 2.815;

// ---------- 1. Title ----------
pres.addSection({ title: "Intro" });
{
  const s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "Intro" });
  glass(s, { x: 0.8, y: 0.7, w: 1.6, h: 0.8, dash: true, edge: 60, objectName: "Logo placeholder" });
  T(s, "[Logo]", { x: 0.8, y: 0.7, w: 1.6, h: 0.8, fontSize: 12, color: MUTED, align: "center", valign: "middle" });
  s.addText("[Company name]", { placeholder: "title" });
  s.addText("[One-liner: We help (who) do (what) by (how)]", { placeholder: "tagline" });
  glass(s, { x: 0.8, y: 5.15, w: 4.9, h: 0.56, rectRadius: 0.28, tint: 90, edge: 65, objectName: "Raise chip" });
  s.addShape(pres.shapes.OVAL, { x: 1.05, y: 5.37, w: 0.12, h: 0.12, fill: { color: ACC_LT }, line: { type: "none" } });
  T(s, "Raising $[X]M · [Pre-seed / Seed / Series A]", { x: 1.3, y: 5.15, w: 4.3, h: 0.56, fontSize: 14, color: WHITE, valign: "middle" });
  s.addText("[Founder name], [Title]  ·  [email@company.com]  ·  [Month YYYY]", { placeholder: "meta" });
  s.addNotes("TITLE / ONE-LINER\n\nIf an investor reads only this slide, they should know what you do. Use a plain-language one-liner (YC style: 'We help [who] do [what]'), not a slogan. Avoid jargon and buzzwords.\n\nThe raise chip is optional; some founders prefer to save the ask for the end. In a cold, send-ahead deck it's useful up front.");
}

// ---------- 2. Problem ----------
pres.addSection({ title: "Opportunity" });
{
  const s = content("01 · THE PROBLEM", "[Target customers] struggle to [do X], and it costs them [time / money]", "Opportunity");
  const rows = [
    ["[Pain point 1]", "[Who feels it, how often, and what it costs them]"],
    ["[Pain point 2]", "[Make it concrete: a real customer story beats an abstract claim]"],
    ["How it's handled today: [current workaround]", "[Spreadsheets, manual work, legacy tools, and why they fall short]"],
  ];
  rows.forEach(([h, d], i) => {
    const y = 2.05 + i * 1.5;
    gdot(s, 0.6, y, 0.55, String(i + 1).padStart(2, "0"), 12);
    T(s, h, { x: 1.4, y: y + 0.02, w: 6.0, h: 0.42, fontSize: 18, fontFace: HEAD, color: WHITE });
    T(s, d, { x: 1.4, y: y + 0.48, w: 6.0, h: 0.75, fontSize: 14, color: MUTED });
  });
  orb(s, 7.3, 0.9, 6.2);
  glass(s, { x: 8.1, y: 2.05, w: 4.63, h: 4.35, dark: true, objectName: "Stat card" });
  T(s, "[XX%]", { x: 8.5, y: 2.45, w: 3.9, h: 1.25, fontSize: 66, fontFace: HEAD, color: ACC_LT, charSpacing: -1.5 });
  T(s, "of [target customers] [experience this pain / lose $X per year to it]", { x: 8.5, y: 3.85, w: 3.8, h: 1.4, fontSize: 17, color: WHITE });
  T(s, "Source: [citation]", { x: 8.5, y: 5.75, w: 3.9, h: 0.35, fontSize: 11, color: LAV });
  s.addNotes("PROBLEM (Sequoia: 'Describe the pain of the customer'; YC: 'Why is this a big, urgent problem?')\n\n- Who has the problem, specifically? Name the customer segment.\n- How painful is it? Quantify in time, money, or risk.\n- How do they solve it today, and why does that fall short?\n- One sharp stat or a short customer quote is more persuasive than a list.\n\nInvestors need to believe the problem is real, frequent, and expensive before they care about your solution.");
}

// ---------- 3. Solution ----------
{
  const s = content("02 · THE SOLUTION", "[Product] lets [customer] [achieve outcome] in [time] instead of [time]", "Opportunity");
  glass(s, { x: 0.6, y: 2.05, w: 5.4, h: 3.3, objectName: "Today card" });
  label(s, "TODAY", { x: 0.95, y: 2.35, w: 4.7, h: 0.3 });
  T(s, [
    { text: "[Slow / manual step]", options: { bullet: true, breakLine: true } },
    { text: "[Costly or error-prone step]", options: { bullet: true, breakLine: true } },
    { text: "[The outcome customers settle for]", options: { bullet: true } },
  ], { x: 0.95, y: 2.85, w: 4.75, h: 2.2, fontSize: 16, color: MUTED, paraSpaceAfter: 12 });

  s.addShape(pres.shapes.LINE, { x: 6.2, y: 3.7, w: 0.9, h: 0, line: { color: ACC_LT, width: 1.5, endArrowType: "triangle" } });

  orb(s, 9.3, 1.4, 3.6, 30);
  glass(s, { x: 7.3, y: 2.05, w: 5.43, h: 3.3, accent: true, objectName: "With product card" });
  T(s, "WITH [PRODUCT]", { x: 7.65, y: 2.35, w: 4.7, h: 0.3, fontSize: 11, color: ACC_LT, charSpacing: 3 });
  T(s, [
    { text: "[What becomes fast or automatic]", options: { bullet: true, breakLine: true } },
    { text: "[Measurable gain: X× faster, $Y saved]", options: { bullet: true, breakLine: true } },
    { text: "[A new outcome that wasn't possible before]", options: { bullet: true } },
  ], { x: 7.65, y: 2.85, w: 4.8, h: 2.2, fontSize: 16, color: WHITE, paraSpaceAfter: 12 });

  glass(s, { x: 0.6, y: 5.65, w: 12.13, h: 0.9, objectName: "Insight card" });
  T(s, [
    { text: "Our insight   ", options: { color: ACC_LT } },
    { text: "[The non-obvious thing you understand about this problem that others miss]", options: { color: WHITE } },
  ], { x: 0.95, y: 5.65, w: 11.5, h: 0.9, fontSize: 16, valign: "middle" });
  s.addNotes("SOLUTION (Sequoia: 'Demonstrate your company's value proposition')\n\n- Focus on what changes for the customer, not on a feature list.\n- Make the before/after contrast obvious and, if possible, measurable.\n- The 'insight' line is your secret: what you know that incumbents and other founders don't. Strong insights are often counter-intuitive.");
}

// ---------- 4. Product ----------
{
  const s = content("03 · PRODUCT", "[How it works: the product in one sentence]", "Opportunity");
  orb(s, 1.8, 1.6, 5.0, 45);
  glass(s, { x: 0.6, y: 1.95, w: 7.4, h: 4.7, dash: true, edge: 65, objectName: "Screenshot placeholder" });
  T(s, "[Product screenshot, mockup, or demo GIF]", { x: 0.6, y: 1.95, w: 7.4, h: 4.7, fontSize: 16, color: LAV, align: "center", valign: "middle" });
  [1, 2, 3].forEach((n, i) => {
    const y = 2.05 + i * 1.6;
    gdot(s, 8.4, y, 0.5, String(n).padStart(2, "0"), 11);
    T(s, `[Key feature ${n}]`, { x: 9.15, y: y + 0.03, w: 3.58, h: 0.42, fontSize: 18, fontFace: HEAD, color: WHITE });
    T(s, "[What it does and why the user cares]", { x: 9.15, y: y + 0.5, w: 3.5, h: 0.8, fontSize: 14, color: MUTED });
  });
  s.addNotes("PRODUCT / DEMO\n\n- Show, don't tell: real screenshots beat mockups; a short GIF or live demo beats both.\n- Call out the 'magic moment', the point where the user gets value.\n- Mention the product roadmap only briefly; you can put it in the appendix.\n- If you're pre-product, show the prototype and what you've validated with users.");
}

// ---------- 5. Why now ----------
{
  const s = content("04 · WHY NOW", "Why now: [the shift that makes this possible today]", "Opportunity");
  const cards = [
    ["TECHNOLOGY", "[What changed in the tech]"],
    ["MARKET / BEHAVIOR", "[What changed in how people buy or work]"],
    ["REGULATION / COST", "[What changed in rules or costs]"],
  ];
  cards.forEach(([lab, head], i) => {
    const x = COL3[i];
    glass(s, { x, y: 2.05, w: W3, h: 4.1, objectName: `Why now card ${i + 1}` });
    T(s, String(i + 1).padStart(2, "0"), { x: x + 0.35, y: 2.3, w: 1.5, h: 0.75, fontSize: 40, fontFace: HEAD, color: i === 0 ? ACC_LT : LAV, charSpacing: -1 });
    label(s, lab, { x: x + 0.35, y: 3.3, w: W3 - 0.7, h: 0.3 });
    T(s, head, { x: x + 0.35, y: 3.7, w: W3 - 0.7, h: 0.95, fontSize: 20, fontFace: HEAD, color: WHITE });
    T(s, "[Why this makes your solution possible, or necessary, now and not 5 years ago]", { x: x + 0.35, y: 4.75, w: W3 - 0.7, h: 1.2, fontSize: 14, color: MUTED });
  });
  s.addNotes("WHY NOW (Sequoia: 'Set up the historical evolution of your category. Why hasn't this been done before?')\n\n- Investors look hard at this slide: great ideas often failed because they were too early.\n- Common 'why now' drivers: a new platform or technology (e.g., AI models, cheaper sensors), a regulatory change, a behavior shift, a collapse in cost, or a market dislocation.\n- You don't need all three cards; one compelling shift is better than three weak ones.");
}

// ---------- 6. Market ----------
{
  const s = content("05 · MARKET SIZE", "A $[X]B market, and we can win $[Y]M of it in [N] years", "Opportunity");
  const cx = 3.15;
  s.addShape(pres.shapes.OVAL, { x: cx - 2.25, y: 1.95, w: 4.5, h: 4.5, fill: { color: WHITE, transparency: 95 }, line: { color: WHITE, transparency: 75, width: 0.75 }, objectName: "TAM circle" });
  s.addShape(pres.shapes.OVAL, { x: cx - 1.6, y: 3.25, w: 3.2, h: 3.2, fill: { color: WHITE, transparency: 90 }, line: { color: WHITE, transparency: 65, width: 0.75 }, objectName: "SAM circle" });
  orb(s, cx - 1.6, 3.9, 3.2);
  s.addShape(pres.shapes.OVAL, { x: cx - 0.95, y: 4.55, w: 1.9, h: 1.9, fill: { color: ACC }, line: { color: ACC_LT, transparency: 30, width: 0.75 }, objectName: "SOM circle" });
  T(s, "TAM", { x: cx - 1, y: 2.4, w: 2, h: 0.4, fontSize: 13, color: MUTED, align: "center", charSpacing: 3 });
  T(s, "SAM", { x: cx - 1, y: 3.65, w: 2, h: 0.4, fontSize: 13, color: LAV, align: "center", charSpacing: 3 });
  T(s, "SOM", { x: cx - 1, y: 5.3, w: 2, h: 0.4, fontSize: 13, color: WHITE, align: "center", charSpacing: 3 });

  const rows = [
    ["$[X]B", "Total addressable market (TAM)", "[Everyone who could ever buy this × annual spend]"],
    ["$[X]B", "Serviceable market (SAM)", "[The segment you can reach with today's product and channels]"],
    ["$[X]M", "Obtainable in [3–5] years (SOM)", "[The realistic share you can win: the number to defend]"],
  ];
  rows.forEach(([v, l, d], i) => {
    const y = 2.0 + i * 1.3;
    T(s, v, { x: 6.1, y: y - 0.05, w: 2.2, h: 0.7, fontSize: 34, fontFace: HEAD, color: i === 2 ? ACC_LT : WHITE, charSpacing: -1 });
    T(s, l, { x: 8.4, y: y + 0.02, w: 4.33, h: 0.38, fontSize: 16, fontFace: HEAD, color: WHITE });
    T(s, d, { x: 8.4, y: y + 0.44, w: 4.25, h: 0.7, fontSize: 13, color: MUTED });
  });
  glass(s, { x: 6.1, y: 5.9, w: 6.63, h: 0.6, objectName: "Bottom-up math" });
  T(s, [
    { text: "Bottom-up   ", options: { color: ACC_LT } },
    { text: "[# target customers] × $[annual contract value] = $[SAM]", options: { color: WHITE } },
  ], { x: 6.35, y: 5.9, w: 6.25, h: 0.6, fontSize: 13, valign: "middle" });
  s.addNotes("MARKET SIZE (Sequoia: 'Identify/profile the customer you cater to')\n\n- Build the number bottom-up: (number of target customers) × (what each pays per year). Top-down figures ('1% of a $50B market') are a red flag to most VCs.\n- Venture investors generally need to see a path to a $1B+ company, so the TAM should support that.\n- Show your math, or keep it ready for the appendix; cite sources for any third-party numbers.");
}

// ---------- 7. Business model ----------
pres.addSection({ title: "Business" });
{
  const s = content("06 · BUSINESS MODEL", "We charge [customer] [$X per unit]: [pricing model in one line]", "Business");
  const tiers = [["[TIER 1]", "$[X]"], ["[TIER 2]", "$[X]"], ["[TIER 3]", "$[X]"]];
  orb(s, COL3[1] + 0.4, 1.2, 3.1, 25);
  tiers.forEach(([name, price], i) => {
    const x = COL3[i], hi = i === 1;
    glass(s, { x, y: 1.95, w: W3, h: 2.15, accent: hi, objectName: `Pricing tier ${i + 1}` });
    T(s, name, { x: x + 0.35, y: 2.2, w: W3 - 0.7, h: 0.3, fontSize: 11, color: hi ? ACC_LT : MUTED, charSpacing: 3 });
    T(s, [
      { text: price, options: { fontSize: 34, fontFace: HEAD } },
      { text: "  / [user · month]", options: { fontSize: 13, color: hi ? LAV : MUTED } },
    ], { x: x + 0.35, y: 2.55, w: W3 - 0.6, h: 0.7, color: WHITE, valign: "bottom" });
    T(s, "[Who it's for and what's included]", { x: x + 0.35, y: 3.4, w: W3 - 0.7, h: 0.55, fontSize: 14, color: hi ? LAV : MUTED });
  });
  label(s, "UNIT ECONOMICS", { x: 0.6, y: 4.38, w: 6, h: 0.3 });
  const tiles = [["$[X]", "Avg. contract value (ACV)"], ["[X]%", "Gross margin"], ["[N] mo", "CAC payback period"], ["[X]:1", "LTV : CAC"]];
  tiles.forEach(([v, l], i) => {
    const x = COL4[i];
    glass(s, { x, y: 4.78, w: W4, h: 1.6, tint: 96, objectName: `Unit economics ${i + 1}` });
    T(s, v, { x: x + 0.3, y: 5.0, w: W4 - 0.6, h: 0.65, fontSize: 30, fontFace: HEAD, color: i === 3 ? ACC_LT : WHITE, charSpacing: -0.5 });
    T(s, l, { x: x + 0.3, y: 5.72, w: W4 - 0.6, h: 0.5, fontSize: 12, color: MUTED });
  });
  s.addNotes("BUSINESS MODEL (Sequoia: 'Revenue model, pricing, average account size, lifetime value')\n\n- Who pays, how much, how often? (subscription, usage-based, transaction fee, marketplace take rate…)\n- Swap the pricing tiers for a single price if that's simpler; delete what you don't need.\n- Unit economics: only show what you actually have. At pre-seed it's fine to show target or early numbers, labeled as such.\n- Rough benchmarks investors use for SaaS: LTV:CAC ≥ 3:1, CAC payback < 12–18 months, gross margin 70%+.");
}

// ---------- 8. Traction ----------
{
  const s = content("07 · TRACTION", "[Key metric] grew [X]× in [N] months", "Business");
  glass(s, { x: 0.6, y: 1.95, w: 7.7, h: 4.65, tint: 96, objectName: "Chart panel" });
  s.addChart(pres.charts.BAR, [{ name: "[Metric]", labels: ["[M1]", "[M2]", "[M3]", "[M4]", "[M5]", "[M6]"], values: [10, 14, 19, 26, 34, 45] }], {
    x: 0.8, y: 2.1, w: 7.3, h: 4.35, barDir: "col", barGapWidthPct: 70,
    chartColors: [H.accent1], showLegend: false,
    showTitle: true, title: "[Revenue / users] by month (sample data: replace)", titleFontSize: 13, titleColor: H.lt2, titleFontFace: "+mn-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 11, dataLabelColor: H.accent3, dataLabelFontFace: "+mn-lt",
    catAxisLabelColor: H.lt2, catAxisLabelFontSize: 11, catAxisLabelFontFace: "+mn-lt", catAxisLineShow: false,
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
  });
  const tiles = [["$[X]", "Monthly recurring revenue"], ["[X]%", "Month-over-month growth"], ["[X]%", "Net revenue retention"]];
  orb(s, 9.2, 0.9, 3.3);
  tiles.forEach(([v, l], i) => {
    const y = 1.95 + i * 1.6;
    glass(s, { x: 8.6, y, w: 4.13, h: 1.42, dark: i === 0, objectName: `Traction stat ${i + 1}` });
    T(s, v, { x: 8.95, y: y + 0.18, w: 3.5, h: 0.7, fontSize: 34, fontFace: HEAD, color: i === 0 ? ACC_LT : WHITE, charSpacing: -1 });
    T(s, l, { x: 8.95, y: y + 0.9, w: 3.5, h: 0.35, fontSize: 13, color: i === 0 ? LAV : MUTED });
  });
  s.addNotes("TRACTION (YC: 'This is often the most important slide')\n\n- Put your single best number in the headline and make it big.\n- Show growth over time, not a snapshot: a chart going up and to the right is the point of this slide.\n- The chart uses SAMPLE data. Right-click it → Edit Data to enter your real numbers.\n- Pick metrics that fit your stage: revenue/MRR, active users, retention, paid pilots, LOIs, waitlist, notable customer logos.\n- If traction is your strongest card, move this slide up to right after the Solution.");
}

// ---------- 9. Competition ----------
{
  const s = content("08 · COMPETITION", "[Company] is the only [category] that [key differentiator]", "Business");
  T(s, "↑  [Y axis: e.g., Depth / power]", { x: 1.0, y: 1.95, w: 6, h: 0.3, fontSize: 11, color: MUTED });
  glass(s, { x: 1.0, y: 2.3, w: 6.0, h: 3.9, tint: 96, objectName: "Matrix background" });
  s.addShape(pres.shapes.LINE, { x: 4.0, y: 2.3, w: 0, h: 3.9, line: { color: WHITE, transparency: 80, width: 0.75 } });
  s.addShape(pres.shapes.LINE, { x: 1.0, y: 4.25, w: 6.0, h: 0, line: { color: WHITE, transparency: 80, width: 0.75 } });
  T(s, "[X axis: e.g., Ease of use]  →", { x: 1.0, y: 6.3, w: 6, h: 0.3, fontSize: 11, color: MUTED, align: "right" });
  orb(s, 5.55, 1.95, 1.75);
  s.addShape(pres.shapes.OVAL, { x: 6.2, y: 2.6, w: 0.45, h: 0.45, fill: { color: ACC }, line: { color: WHITE, transparency: 40, width: 0.75 } });
  T(s, "[Your company]", { x: 4.1, y: 2.6, w: 1.95, h: 0.45, fontSize: 14, fontFace: HEAD, color: WHITE, align: "right", valign: "middle" });
  [[1.4, 2.9, "[Competitor A]"], [4.5, 4.8, "[Competitor B]"], [1.4, 5.3, "[Competitor C]"]].forEach(([x, y, n]) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: 0.32, h: 0.32, fill: { color: STEEL, transparency: 30 }, line: { type: "none" } });
    T(s, n, { x: x + 0.47, y: y - 0.02, w: 1.9, h: 0.36, fontSize: 13, color: MUTED, valign: "middle" });
  });
  label(s, "WHY WE WIN", { x: 7.6, y: 2.3, w: 5, h: 0.3, color: ACC_LT });
  [1, 2, 3].forEach((n, i) => {
    const y = 2.8 + i * 1.2;
    gdot(s, 7.6, y, 0.45, String(n).padStart(2, "0"), 10);
    T(s, `[Unfair advantage ${n}]`, { x: 8.3, y: y + 0.02, w: 4.43, h: 0.38, fontSize: 16, fontFace: HEAD, color: WHITE });
    T(s, "[e.g., proprietary data, network effects, distribution, deep tech]", { x: 8.3, y: y + 0.44, w: 4.3, h: 0.6, fontSize: 13, color: MUTED });
  });
  s.addNotes("COMPETITION (Sequoia: 'List competitors; list your plan to win')\n\n- Never say 'we have no competitors'. It signals naïveté or no market. Include the status quo (spreadsheets, doing nothing) and big incumbents.\n- Pick 2×2 axes that genuinely matter to customers and honestly put you in the top-right. If the axes feel contrived, use a comparison table instead.\n- The 'why we win' column matters more than the chart: what's defensible and gets stronger over time?");
}

// ---------- 10. Go-to-market ----------
{
  const s = content("09 · GO-TO-MARKET", "How we reach customers: [primary channel]", "Business");
  const steps = [["STEP 1 · LAND", "[e.g., Founder-led sales to 10 design partners]"], ["STEP 2 · EXPAND", "[e.g., Referrals and upsell within accounts]"], ["STEP 3 · SCALE", "[e.g., Inside sales team + partner channel]"]];
  steps.forEach(([lab, head], i) => {
    const x = COL3[i];
    if (i === 0) orb(s, x - 0.45, 1.55, 1.6, 20);
    gdot(s, x, 2.0, 0.7, String(i + 1).padStart(2, "0"), 15);
    if (i < 2) s.addShape(pres.shapes.LINE, { x: x + 0.85, y: 2.35, w: COL3[i + 1] - x - 1.0, h: 0, line: { color: WHITE, transparency: 70, width: 0.75, dashType: "dash", endArrowType: "triangle" } });
    label(s, lab, { x, y: 2.95, w: W3 - 0.2, h: 0.3, color: i === 0 ? ACC_LT : MUTED });
    T(s, head, { x, y: 3.3, w: W3 - 0.3, h: 0.9, fontSize: 18, fontFace: HEAD, color: WHITE });
    T(s, "[Timing, target, and what success looks like]", { x, y: 4.25, w: W3 - 0.3, h: 0.6, fontSize: 13, color: MUTED });
  });
  const cards = [["Ideal customer", "[Industry, company size, buyer title]"], ["Sales motion", "[Self-serve · Product-led · Sales-led]"], ["Proof it works", "[CAC by channel, conversion rate, pipeline]"]];
  cards.forEach(([h, d], i) => {
    const x = COL3[i];
    glass(s, { x, y: 5.1, w: W3, h: 1.45, objectName: `GTM card ${i + 1}` });
    T(s, h, { x: x + 0.3, y: 5.3, w: W3 - 0.6, h: 0.38, fontSize: 15, fontFace: HEAD, color: WHITE });
    T(s, d, { x: x + 0.3, y: 5.72, w: W3 - 0.6, h: 0.65, fontSize: 13, color: MUTED });
  });
  s.addNotes("GO-TO-MARKET\n\n- How do you find, win, and keep customers, and how does that scale?\n- Be specific about the first channel that works; 'viral growth' or 'partnerships' with no evidence won't land.\n- If you have data (CAC by channel, conversion rates, sales cycle length, pipeline), it belongs here.");
}

// ---------- 11. Team ----------
pres.addSection({ title: "Team & Financials" });
{
  const s = content("10 · TEAM", "Why us: [the unfair advantage this team brings]", "Team & Financials");
  [1, 2, 3, 4].forEach((n, i) => {
    const x = COL4[i];
    glass(s, { x, y: 1.95, w: W4, h: 3.9, objectName: `Team card ${n}` });
    s.addShape(pres.shapes.OVAL, { x: x + 0.3, y: 2.25, w: 1.3, h: 1.3, fill: { color: WHITE, transparency: 92 }, line: { color: WHITE, transparency: 60, width: 0.75, dashType: "dash" } });
    T(s, "[Photo]", { x: x + 0.3, y: 2.25, w: 1.3, h: 1.3, fontSize: 11, color: LAV, align: "center", valign: "middle" });
    T(s, "[Name]", { x: x + 0.3, y: 3.75, w: W4 - 0.6, h: 0.42, fontSize: 19, fontFace: HEAD, color: WHITE });
    T(s, "[Role]", { x: x + 0.3, y: 4.17, w: W4 - 0.6, h: 0.35, fontSize: 13, color: ACC_LT });
    T(s, "[Prior company, exit, or domain expertise: why you're the one to build this]", { x: x + 0.3, y: 4.6, w: W4 - 0.6, h: 1.1, fontSize: 12, color: MUTED });
  });
  T(s, [
    { text: "Advisors & investors   ", options: { color: ACC_LT } },
    { text: "[Name (credential)]  ·  [Name (credential)]  ·  [Name (credential)]", options: { color: MUTED } },
  ], { x: 0.6, y: 6.08, w: 12.13, h: 0.45, fontSize: 13, valign: "middle" });
  s.addNotes("TEAM (Sequoia: 'Founders, management, board of directors/advisors')\n\n- At early stages, investors are betting on the team more than anything else.\n- For each person, give the one credential that makes them uniquely suited to THIS problem (domain expertise, prior startup or exit, technical depth), not a full CV.\n- Show how long the founders have worked together and that you're full-time.\n- Delete or add cards to match your team; notable advisors and angels go in the bottom line.");
}

// ---------- 12. Financials ----------
{
  const s = content("11 · FINANCIALS", "Path to $[X]M revenue by [year]", "Team & Financials");
  const hdr = (t) => ({ text: t, options: { color: LAV, fill: { color: CARD }, align: t ? "center" : "left" } });
  const years = ["[Year 1]", "[Year 2]", "[Year 3]", "[Year 4]", "[Year 5]"];
  const rowsDef = [["Revenue", "$[ ]"], ["Gross margin", "[ ]%"], ["Operating expenses", "$[ ]"], ["Net burn / EBITDA", "$[ ]"], ["Ending cash", "$[ ]"], ["Headcount", "[ ]"]];
  const rows = [[hdr(""), ...years.map(hdr)]];
  rowsDef.forEach(([lab, v], r) => {
    const fill = { color: r % 2 ? CARD : INK };
    rows.push([{ text: lab, options: { color: WHITE, fill, fontFace: HEAD } }, ...years.map(() => ({ text: v, options: { color: MUTED, align: "center", fill } }))]);
  });
  s.addTable(rows, { x: 0.6, y: 1.95, w: 12.13, colW: [3.13, 1.8, 1.8, 1.8, 1.8, 1.8], rowH: 0.42, fontSize: 13, valign: "middle", border: { type: "solid", pt: 0.5, color: H.accent5 }, margin: [0, 0.14, 0, 0.14] });
  glass(s, { x: 0.6, y: 5.2, w: 12.13, h: 1.4, objectName: "Assumptions card" });
  label(s, "KEY ASSUMPTIONS", { x: 0.9, y: 5.38, w: 6, h: 0.3, color: ACC_LT });
  T(s, [
    { text: "[Growth rate and what drives it]", options: { bullet: true, breakLine: true } },
    { text: "[Pricing, churn, and sales capacity assumptions]", options: { bullet: true, breakLine: true } },
    { text: "[When you reach breakeven, or what the next round funds]", options: { bullet: true } },
  ], { x: 0.9, y: 5.72, w: 11.5, h: 0.8, fontSize: 13, color: WHITE });
  s.addNotes("FINANCIALS\n\n- Keep it high level: 3–5 years of revenue, burn, and headcount. Detailed models go in the appendix or data room.\n- Investors know projections are guesses; they're judging whether your assumptions are reasonable and whether you understand your business's drivers.\n- Pre-revenue? Show the plan for the next 18–24 months and the milestones that unlock the next round instead.\n- Rename the year columns (e.g., 2027, 2028…) and delete rows you don't need.");
}

// ---------- 13. The ask ----------
{
  const s = content("12 · THE ASK", "We're raising $[X]M to reach [milestone] in [N] months", "Team & Financials");
  orb(s, -0.9, 0.9, 5.8);
  glass(s, { x: 0.6, y: 1.95, w: 4.6, h: 4.6, dark: true, objectName: "Raise card" });
  label(s, "RAISING", { x: 1.0, y: 2.35, w: 3.8, h: 0.3, color: LAV });
  T(s, "$[X]M", { x: 1.0, y: 2.75, w: 3.9, h: 1.2, fontSize: 66, fontFace: HEAD, color: ACC_LT, charSpacing: -1.5 });
  T(s, [
    { text: "[SAFE / priced round]", options: { breakLine: true } },
    { text: "[Pre-seed / Seed / Series A]", options: { breakLine: true } },
    { text: "[$X committed · Lead: (name)]" },
  ], { x: 1.0, y: 4.25, w: 3.9, h: 1.9, fontSize: 15, color: WHITE, paraSpaceAfter: 8 });

  glass(s, { x: 5.6, y: 1.95, w: 7.13, h: 2.85, tint: 96, objectName: "Use of funds panel" });
  s.addChart(pres.charts.DOUGHNUT, [{ name: "Use of funds", labels: ["Product & engineering", "Sales & marketing", "Operations & G&A", "[Other]"], values: [25, 25, 25, 25] }], {
    x: 5.75, y: 2.02, w: 6.85, h: 2.7, holeSize: 66,
    chartColors: [H.accent1, H.accent3, H.accent4, H.accent2],
    showTitle: true, title: "Use of funds (placeholder split: replace)", titleFontSize: 13, titleColor: H.lt2, titleFontFace: "+mn-lt",
    showLegend: true, legendPos: "r", legendFontSize: 12, legendColor: H.lt1, legendFontFace: "+mn-lt",
    showPercent: true, showValue: false, dataLabelColor: H.dk1, dataLabelFontSize: 10, dataLabelFontFace: "+mn-lt",
  });
  const ms = [["MILESTONE 1", "[e.g., $1M ARR]", "[by month N]"], ["MILESTONE 2", "[e.g., 50 logos]", "[by month N]"], ["RUNWAY", "[N] months", "[to Series X metrics]"]];
  const mw = (7.13 - 0.5) / 3;
  ms.forEach(([l, h, d], i) => {
    const x = 5.6 + i * (mw + 0.25);
    glass(s, { x, y: 5.05, w: mw, h: 1.5, objectName: `Milestone ${i + 1}` });
    label(s, l, { x: x + 0.25, y: 5.22, w: mw - 0.5, h: 0.3, fontSize: 10, color: i === 2 ? ACC_LT : MUTED });
    T(s, h, { x: x + 0.25, y: 5.55, w: mw - 0.4, h: 0.45, fontSize: 16, fontFace: HEAD, color: WHITE });
    T(s, d, { x: x + 0.25, y: 6.02, w: mw - 0.5, h: 0.35, fontSize: 12, color: MUTED });
  });
  s.addNotes("THE ASK / USE OF FUNDS\n\n- State the amount, instrument (SAFE or priced round), and anything already committed or a lead investor.\n- Tie the money to milestones: 'this round gets us to X, which sets us up for the next round'. Investors fund milestones, not runway.\n- 18–24 months of runway is a typical target.\n- The doughnut uses a placeholder 25/25/25/25 split. Right-click → Edit Data to change it.");
}

// ---------- 14. Vision / close ----------
pres.addSection({ title: "Close" });
{
  const s = pres.addSlide({ masterName: "STATEMENT_DARK", sectionTitle: "Close" });
  s.addText("[Your vision in one bold sentence: what the world looks like if you win]", { placeholder: "title" });
  s.addText("[Founder name]  ·  [email@company.com]  ·  [phone]  ·  [company.com]", { placeholder: "sub" });
  s.addNotes("VISION / CLOSE\n\n- End on the big picture: if everything works, what does this company become in 10 years?\n- Leave contact details on screen during Q&A.\n- Optionally restate the ask in one line.");
}

// ---------- 15. Appendix ----------
{
  const s = pres.addSlide({ masterName: "STATEMENT_DARK", sectionTitle: "Close" });
  s.addText("Appendix", { placeholder: "title" });
  s.addText("[Detailed financials  ·  Cohort and retention data  ·  Customer case studies  ·  Technical architecture  ·  Product roadmap  ·  Cap table]", { placeholder: "sub" });
  s.addNotes("APPENDIX\n\nBackup slides for diligence questions. Keep them out of the main flow, but have them ready. Typical contents: detailed model, cohort/retention curves, customer references and case studies, technical deep-dive, roadmap, cap table, and full TAM math.\n\nDuplicate any content slide (right-click → Duplicate Slide) to build these.");
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  await scrubImagePaths(OUT);
  console.log("wrote", OUT);
})();
