const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(path.join(__dirname, "..", "_shared", "apply_theme.js"));
const { scrubImagePaths } = require(path.join(__dirname, "..", "_shared", "scrub_image_paths.js"));

const OUT = process.argv[2] || path.join(__dirname, "..", "..", "pitch-deck-template.pptx");

const THEME = require("./theme.json"); // palette + fonts: edit theme.json
const H = THEME.colors; // hex, for hex-only options (charts, shadows)

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.title = "Investor Pitch Deck Template";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;

// ---------- Layouts ----------
pres.defineSlideMaster({
  title: "TITLE_DARK",
  background: { color: C.text1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.8, y: 2.4, w: 11.7, h: 1.3, fontSize: 54, bold: true, color: C.background1, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "tagline", type: "body", x: 0.8, y: 3.85, w: 11.0, h: 0.9, fontSize: 24, color: C.accent5, valign: "top", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "meta", type: "body", x: 0.8, y: 6.3, w: 11.0, h: 0.45, fontSize: 14, color: C.accent4, valign: "top", margin: 0 }, text: "" } },
  ],
});

pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: C.background1 },
  margin: [0.5, 0.6, 0.8, 0.6],
  objects: [
    { placeholder: { options: { name: "eyebrow", type: "body", x: 0.6, y: 0.45, w: 9.0, h: 0.35, fontSize: 12, bold: true, color: C.accent1, charSpacing: 2, valign: "top", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.6, y: 0.8, w: 12.13, h: 1.0, fontSize: 28, bold: true, color: C.text1, valign: "top", margin: 0 }, text: "" } },
    { text: { text: "[Company name] · Confidential", options: { x: 0.6, y: 6.95, w: 6.0, h: 0.3, fontSize: 10, color: C.accent4, margin: 0 } } },
  ],
  slideNumber: { x: 12.23, y: 6.95, w: 0.5, h: 0.3, fontSize: 10, color: C.accent4, align: "right", margin: 0 },
});

pres.defineSlideMaster({
  title: "STATEMENT_DARK",
  background: { color: C.text1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.8, y: 2.0, w: 11.7, h: 2.0, fontSize: 40, bold: true, color: C.background1, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "sub", type: "body", x: 0.8, y: 4.3, w: 11.7, h: 1.4, fontSize: 20, color: C.accent5, valign: "top", margin: 0 }, text: "" } },
  ],
});

// ---------- Helpers ----------
const T = (slide, text, o) => slide.addText(text, { isTextBox: true, margin: 0, valign: "top", ...o });
const box = (slide, o) => slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { rectRadius: 0.12, line: { type: "none" }, ...o });
const dot = (slide, x, y, d, label, fill = C.accent1, color = C.background1, size = 14) => {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" } });
  if (label) T(slide, label, { x, y, w: d, h: d, fontSize: size, bold: true, color, align: "center", valign: "middle" });
};
const content = (eyebrow, title, section) => {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: section });
  s.addText(eyebrow, { placeholder: "eyebrow" });
  s.addText(title, { placeholder: "title" });
  return s;
};
// 3 equal columns / 4 equal columns across the 12.13" content width
const COL3 = [0.6, 4.74, 8.88], W3 = 3.85;
const COL4 = [0.6, 3.705, 6.81, 9.915], W4 = 2.815;

// ---------- 1. Title ----------
pres.addSection({ title: "Intro" });
{
  const s = pres.addSlide({ masterName: "TITLE_DARK", sectionTitle: "Intro" });
  box(s, { x: 0.8, y: 0.7, w: 1.6, h: 0.8, fill: { color: C.text1 }, line: { color: C.accent4, width: 1, dashType: "dash" }, objectName: "Logo placeholder" });
  T(s, "[Logo]", { x: 0.8, y: 0.7, w: 1.6, h: 0.8, fontSize: 12, color: C.accent4, align: "center", valign: "middle" });
  s.addText("[Company name]", { placeholder: "title" });
  s.addText("[One-liner: We help (who) do (what) by (how)]", { placeholder: "tagline" });
  box(s, { x: 0.8, y: 5.05, w: 4.6, h: 0.55, fill: { color: C.accent1 }, rectRadius: 0.27, objectName: "Raise chip" });
  T(s, "Raising $[X]M · [Pre-seed / Seed / Series A]", { x: 0.8, y: 5.05, w: 4.6, h: 0.55, fontSize: 14, bold: true, color: C.background1, align: "center", valign: "middle" });
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
    const y = 2.0 + i * 1.5;
    dot(s, 0.6, y, 0.55, String(i + 1));
    T(s, h, { x: 1.4, y: y + 0.02, w: 6.2, h: 0.4, fontSize: 18, bold: true, color: C.text1 });
    T(s, d, { x: 1.4, y: y + 0.47, w: 6.2, h: 0.75, fontSize: 14, color: C.text2 });
  });
  box(s, { x: 8.1, y: 2.0, w: 4.63, h: 4.4, fill: { color: C.text1 }, objectName: "Stat card" });
  T(s, "[XX%]", { x: 8.5, y: 2.4, w: 3.9, h: 1.2, fontSize: 60, bold: true, color: C.background1 });
  T(s, "of [target customers] [experience this pain / lose $X per year to it]", { x: 8.5, y: 3.75, w: 3.9, h: 1.4, fontSize: 18, color: C.accent5 });
  T(s, "Source: [citation]", { x: 8.5, y: 5.75, w: 3.9, h: 0.35, fontSize: 11, color: C.accent4 });
  s.addNotes("PROBLEM (Sequoia: 'Describe the pain of the customer'; YC: 'Why is this a big, urgent problem?')\n\n- Who has the problem, specifically? Name the customer segment.\n- How painful is it? Quantify in time, money, or risk.\n- How do they solve it today, and why does that fall short?\n- One sharp stat or a short customer quote is more persuasive than a list.\n\nInvestors need to believe the problem is real, frequent, and expensive before they care about your solution.");
}

// ---------- 3. Solution ----------
{
  const s = content("02 · THE SOLUTION", "[Product] lets [customer] [achieve outcome] in [time] instead of [time]", "Opportunity");
  box(s, { x: 0.6, y: 2.0, w: 5.4, h: 3.4, fill: { color: C.background2 }, objectName: "Today card" });
  T(s, "TODAY", { x: 0.95, y: 2.3, w: 4.7, h: 0.3, fontSize: 12, bold: true, color: C.text2, charSpacing: 2 });
  T(s, [
    { text: "[Slow / manual step]", options: { bullet: true, breakLine: true } },
    { text: "[Costly or error-prone step]", options: { bullet: true, breakLine: true } },
    { text: "[The outcome customers settle for]", options: { bullet: true } },
  ], { x: 0.95, y: 2.8, w: 4.7, h: 2.3, fontSize: 16, color: C.text1, paraSpaceAfter: 10 });

  s.addShape(pres.shapes.RIGHT_ARROW, { x: 6.2, y: 3.35, w: 0.9, h: 0.7, fill: { color: C.accent1 }, line: { type: "none" } });

  box(s, { x: 7.3, y: 2.0, w: 5.43, h: 3.4, fill: { color: C.text1 }, objectName: "With product card" });
  T(s, "WITH [PRODUCT]", { x: 7.65, y: 2.3, w: 4.7, h: 0.3, fontSize: 12, bold: true, color: C.accent5, charSpacing: 2 });
  T(s, [
    { text: "[What becomes fast or automatic]", options: { bullet: true, breakLine: true } },
    { text: "[Measurable gain: X× faster, $Y saved]", options: { bullet: true, breakLine: true } },
    { text: "[A new outcome that wasn't possible before]", options: { bullet: true } },
  ], { x: 7.65, y: 2.8, w: 4.75, h: 2.3, fontSize: 16, color: C.background1, paraSpaceAfter: 10 });

  box(s, { x: 0.6, y: 5.7, w: 12.13, h: 0.85, fill: { color: C.background2 }, objectName: "Insight card" });
  T(s, [
    { text: "Our insight: ", options: { bold: true, color: C.accent1 } },
    { text: "[The non-obvious thing you understand about this problem that others miss]", options: { color: C.text1 } },
  ], { x: 0.95, y: 5.7, w: 11.5, h: 0.85, fontSize: 16, valign: "middle" });
  s.addNotes("SOLUTION (Sequoia: 'Demonstrate your company's value proposition')\n\n- Focus on what changes for the customer, not on a feature list.\n- Make the before/after contrast obvious and, if possible, measurable.\n- The 'insight' line is your secret: what you know that incumbents and other founders don't. Strong insights are often counter-intuitive.");
}

// ---------- 4. Product ----------
{
  const s = content("03 · PRODUCT", "[How it works: the product in one sentence]", "Opportunity");
  box(s, { x: 0.6, y: 1.95, w: 7.4, h: 4.7, fill: { color: C.background2 }, line: { color: C.accent4, width: 1, dashType: "dash" }, objectName: "Screenshot placeholder" });
  T(s, "[Product screenshot, mockup, or demo GIF]", { x: 0.6, y: 1.95, w: 7.4, h: 4.7, fontSize: 16, color: C.text2, align: "center", valign: "middle" });
  [1, 2, 3].forEach((n, i) => {
    const y = 2.0 + i * 1.6;
    dot(s, 8.4, y, 0.5, String(n), C.accent1, C.background1, 13);
    T(s, `[Key feature ${n}]`, { x: 9.15, y: y + 0.03, w: 3.58, h: 0.4, fontSize: 18, bold: true, color: C.text1 });
    T(s, "[What it does and why the user cares]", { x: 9.15, y: y + 0.48, w: 3.58, h: 0.8, fontSize: 14, color: C.text2 });
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
  cards.forEach(([label, head], i) => {
    const x = COL3[i];
    box(s, { x, y: 2.0, w: W3, h: 3.9, fill: { color: C.background2 }, objectName: `Why now card ${i + 1}` });
    dot(s, x + 0.35, 2.35, 0.6, String(i + 1));
    T(s, label, { x: x + 0.35, y: 3.25, w: W3 - 0.7, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 2 });
    T(s, head, { x: x + 0.35, y: 3.65, w: W3 - 0.7, h: 0.9, fontSize: 20, bold: true, color: C.text1 });
    T(s, "[Why this makes your solution possible, or necessary, now and not 5 years ago]", { x: x + 0.35, y: 4.7, w: W3 - 0.7, h: 1.4, fontSize: 14, color: C.text2 });
  });
  s.addNotes("WHY NOW (Sequoia: 'Set up the historical evolution of your category. Why hasn't this been done before?')\n\n- Investors look hard at this slide: great ideas often failed because they were too early.\n- Common 'why now' drivers: a new platform or technology (e.g., AI models, cheaper sensors), a regulatory change, a behavior shift, a collapse in cost, or a market dislocation.\n- You don't need all three cards; one compelling shift is better than three weak ones.");
}

// ---------- 6. Market ----------
{
  const s = content("05 · MARKET SIZE", "A $[X]B market, and we can win $[Y]M of it in [N] years", "Opportunity");
  const cx = 3.15;
  s.addShape(pres.shapes.OVAL, { x: cx - 2.25, y: 1.95, w: 4.5, h: 4.5, fill: { color: C.background2 }, line: { color: C.accent5, width: 1 }, objectName: "TAM circle" });
  s.addShape(pres.shapes.OVAL, { x: cx - 1.6, y: 3.25, w: 3.2, h: 3.2, fill: { color: C.accent5 }, line: { type: "none" }, objectName: "SAM circle" });
  s.addShape(pres.shapes.OVAL, { x: cx - 0.95, y: 4.55, w: 1.9, h: 1.9, fill: { color: C.accent1 }, line: { type: "none" }, objectName: "SOM circle" });
  T(s, "TAM", { x: cx - 1, y: 2.4, w: 2, h: 0.4, fontSize: 16, bold: true, color: C.text2, align: "center" });
  T(s, "SAM", { x: cx - 1, y: 3.7, w: 2, h: 0.4, fontSize: 16, bold: true, color: C.text1, align: "center" });
  T(s, "SOM", { x: cx - 1, y: 5.3, w: 2, h: 0.4, fontSize: 16, bold: true, color: C.background1, align: "center" });

  const rows = [
    ["$[X]B", "Total addressable market (TAM)", "[Everyone who could ever buy this × annual spend]"],
    ["$[X]B", "Serviceable market (SAM)", "[The segment you can reach with today's product and channels]"],
    ["$[X]M", "Obtainable in [3–5] years (SOM)", "[The realistic share you can win: the number to defend]"],
  ];
  rows.forEach(([v, l, d], i) => {
    const y = 2.0 + i * 1.3;
    T(s, v, { x: 6.1, y, w: 2.1, h: 0.6, fontSize: 32, bold: true, color: i === 2 ? C.accent1 : C.text1 });
    T(s, l, { x: 8.4, y: y + 0.02, w: 4.33, h: 0.35, fontSize: 16, bold: true, color: C.text1 });
    T(s, d, { x: 8.4, y: y + 0.42, w: 4.33, h: 0.7, fontSize: 14, color: C.text2 });
  });
  box(s, { x: 6.1, y: 5.9, w: 6.63, h: 0.6, fill: { color: C.background2 }, objectName: "Bottom-up math" });
  T(s, [
    { text: "Bottom-up: ", options: { bold: true } },
    { text: "[# target customers] × $[annual contract value] = $[SAM]" },
  ], { x: 6.35, y: 5.9, w: 6.2, h: 0.6, fontSize: 14, color: C.text1, valign: "middle" });
  s.addNotes("MARKET SIZE (Sequoia: 'Identify/profile the customer you cater to')\n\n- Build the number bottom-up: (number of target customers) × (what each pays per year). Top-down figures ('1% of a $50B market') are a red flag to most VCs.\n- Venture investors generally need to see a path to a $1B+ company, so the TAM should support that.\n- Show your math, or keep it ready for the appendix; cite sources for any third-party numbers.");
}

// ---------- 7. Business model ----------
pres.addSection({ title: "Business" });
{
  const s = content("06 · BUSINESS MODEL", "We charge [customer] [$X per unit]: [pricing model in one line]", "Business");
  const tiers = [["[TIER 1]", "$[X]"], ["[TIER 2]", "$[X]"], ["[TIER 3]", "$[X]"]];
  tiers.forEach(([name, price], i) => {
    const x = COL3[i], dark = i === 1;
    box(s, { x, y: 1.95, w: W3, h: 2.1, fill: { color: dark ? C.text1 : C.background2 }, objectName: `Pricing tier ${i + 1}` });
    T(s, name, { x: x + 0.35, y: 2.2, w: W3 - 0.7, h: 0.3, fontSize: 12, bold: true, color: dark ? C.accent5 : C.accent1, charSpacing: 2 });
    T(s, [
      { text: price, options: { fontSize: 32, bold: true } },
      { text: "  / [user · month]", options: { fontSize: 14 } },
    ], { x: x + 0.35, y: 2.55, w: W3 - 0.7, h: 0.65, color: dark ? C.background1 : C.text1, valign: "bottom" });
    T(s, "[Who it's for and what's included]", { x: x + 0.35, y: 3.35, w: W3 - 0.7, h: 0.55, fontSize: 14, color: dark ? C.accent5 : C.text2 });
  });
  T(s, "UNIT ECONOMICS", { x: 0.6, y: 4.35, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.text2, charSpacing: 2 });
  const tiles = [["$[X]", "Avg. contract value (ACV)"], ["[X]%", "Gross margin"], ["[N] mo", "CAC payback period"], ["[X]:1", "LTV : CAC"]];
  tiles.forEach(([v, l], i) => {
    const x = COL4[i];
    box(s, { x, y: 4.75, w: W4, h: 1.6, fill: { color: C.background1 }, line: { color: C.accent5, width: 1 }, objectName: `Unit economics ${i + 1}` });
    T(s, v, { x: x + 0.3, y: 5.0, w: W4 - 0.6, h: 0.6, fontSize: 28, bold: true, color: C.text1 });
    T(s, l, { x: x + 0.3, y: 5.65, w: W4 - 0.6, h: 0.5, fontSize: 13, color: C.text2 });
  });
  s.addNotes("BUSINESS MODEL (Sequoia: 'Revenue model, pricing, average account size, lifetime value')\n\n- Who pays, how much, how often? (subscription, usage-based, transaction fee, marketplace take rate…)\n- Swap the pricing tiers for a single price if that's simpler; delete what you don't need.\n- Unit economics: only show what you actually have. At pre-seed it's fine to show target or early numbers, labeled as such.\n- Rough benchmarks investors use for SaaS: LTV:CAC ≥ 3:1, CAC payback < 12–18 months, gross margin 70%+.");
}

// ---------- 8. Traction ----------
{
  const s = content("07 · TRACTION", "[Key metric] grew [X]× in [N] months", "Business");
  s.addChart(pres.charts.BAR, [{ name: "[Metric]", labels: ["[M1]", "[M2]", "[M3]", "[M4]", "[M5]", "[M6]"], values: [10, 14, 19, 26, 34, 45] }], {
    x: 0.6, y: 1.95, w: 7.6, h: 4.65, barDir: "col", barGapWidthPct: 60,
    chartColors: [H.accent1], showLegend: false,
    showTitle: true, title: "[Revenue / users] by month (sample data: replace)", titleFontSize: 14, titleColor: H.dk2, titleFontFace: "+mn-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: H.dk2, dataLabelFontFace: "+mn-lt",
    catAxisLabelColor: H.dk2, catAxisLabelFontSize: 12, catAxisLabelFontFace: "+mn-lt", catAxisLineShow: false,
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
  });
  const tiles = [["$[X]", "Monthly recurring revenue"], ["[X]%", "Month-over-month growth"], ["[X]%", "Net revenue retention"]];
  tiles.forEach(([v, l], i) => {
    const y = 1.95 + i * 1.6;
    box(s, { x: 8.6, y, w: 4.13, h: 1.4, fill: { color: i === 0 ? C.text1 : C.background2 }, objectName: `Traction stat ${i + 1}` });
    T(s, v, { x: 8.95, y: y + 0.2, w: 3.5, h: 0.6, fontSize: 32, bold: true, color: i === 0 ? C.background1 : C.text1 });
    T(s, l, { x: 8.95, y: y + 0.85, w: 3.5, h: 0.35, fontSize: 14, color: i === 0 ? C.accent5 : C.text2 });
  });
  s.addNotes("TRACTION (YC: 'This is often the most important slide')\n\n- Put your single best number in the headline and make it big.\n- Show growth over time, not a snapshot: a chart going up and to the right is the point of this slide.\n- The chart uses SAMPLE data. Right-click it → Edit Data to enter your real numbers.\n- Pick metrics that fit your stage: revenue/MRR, active users, retention, paid pilots, LOIs, waitlist, notable customer logos.\n- If traction is your strongest card, move this slide up to right after the Solution.");
}

// ---------- 9. Competition ----------
{
  const s = content("08 · COMPETITION", "[Company] is the only [category] that [key differentiator]", "Business");
  T(s, "↑  [Y axis: e.g., Depth / power]", { x: 1.0, y: 1.95, w: 6, h: 0.3, fontSize: 12, color: C.text2 });
  box(s, { x: 1.0, y: 2.3, w: 6.0, h: 3.9, fill: { color: C.background2 }, rectRadius: 0.08, objectName: "Matrix background" });
  s.addShape(pres.shapes.LINE, { x: 4.0, y: 2.3, w: 0, h: 3.9, line: { color: C.accent5, width: 1.5 } });
  s.addShape(pres.shapes.LINE, { x: 1.0, y: 4.25, w: 6.0, h: 0, line: { color: C.accent5, width: 1.5 } });
  T(s, "[X axis: e.g., Ease of use]  →", { x: 1.0, y: 6.3, w: 6, h: 0.3, fontSize: 12, color: C.text2, align: "right" });
  // You
  dot(s, 6.2, 2.6, 0.45);
  T(s, "[Your company]", { x: 4.2, y: 2.6, w: 1.9, h: 0.45, fontSize: 14, bold: true, color: C.text1, align: "right", valign: "middle" });
  // Competitors
  [[1.4, 2.9, "[Competitor A]"], [4.5, 4.8, "[Competitor B]"], [1.4, 5.3, "[Competitor C]"]].forEach(([x, y, n]) => {
    dot(s, x, y, 0.35, null, C.accent4);
    T(s, n, { x: x + 0.5, y, w: 1.9, h: 0.35, fontSize: 13, color: C.text2, valign: "middle" });
  });
  T(s, "WHY WE WIN", { x: 7.6, y: 2.3, w: 5, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 2 });
  [1, 2, 3].forEach((n, i) => {
    const y = 2.8 + i * 1.2;
    dot(s, 7.6, y, 0.45, String(n), C.text1, C.background1, 12);
    T(s, `[Unfair advantage ${n}]`, { x: 8.3, y: y + 0.02, w: 4.43, h: 0.35, fontSize: 16, bold: true, color: C.text1 });
    T(s, "[e.g., proprietary data, network effects, distribution, deep tech]", { x: 8.3, y: y + 0.42, w: 4.43, h: 0.6, fontSize: 13, color: C.text2 });
  });
  s.addNotes("COMPETITION (Sequoia: 'List competitors; list your plan to win')\n\n- Never say 'we have no competitors'. It signals naïveté or no market. Include the status quo (spreadsheets, doing nothing) and big incumbents.\n- Pick 2×2 axes that genuinely matter to customers and honestly put you in the top-right. If the axes feel contrived, use a comparison table instead.\n- The 'why we win' column matters more than the chart: what's defensible and gets stronger over time?");
}

// ---------- 10. Go-to-market ----------
{
  const s = content("09 · GO-TO-MARKET", "How we reach customers: [primary channel]", "Business");
  const steps = [["STEP 1 · LAND", "[e.g., Founder-led sales to 10 design partners]"], ["STEP 2 · EXPAND", "[e.g., Referrals and upsell within accounts]"], ["STEP 3 · SCALE", "[e.g., Inside sales team + partner channel]"]];
  steps.forEach(([label, head], i) => {
    const x = COL3[i];
    dot(s, x, 2.0, 0.7, String(i + 1), C.accent1, C.background1, 18);
    if (i < 2) s.addShape(pres.shapes.LINE, { x: x + 0.85, y: 2.35, w: COL3[i + 1] - x - 1.0, h: 0, line: { color: C.accent5, width: 2, endArrowType: "triangle" } });
    T(s, label, { x, y: 2.95, w: W3 - 0.2, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 2 });
    T(s, head, { x, y: 3.3, w: W3 - 0.2, h: 0.85, fontSize: 18, bold: true, color: C.text1 });
    T(s, "[Timing, target, and what success looks like]", { x, y: 4.2, w: W3 - 0.2, h: 0.6, fontSize: 14, color: C.text2 });
  });
  const cards = [["Ideal customer", "[Industry, company size, buyer title]"], ["Sales motion", "[Self-serve · Product-led · Sales-led]"], ["Proof it works", "[CAC by channel, conversion rate, pipeline]"]];
  cards.forEach(([h, d], i) => {
    const x = COL3[i];
    box(s, { x, y: 5.1, w: W3, h: 1.4, fill: { color: C.background2 }, objectName: `GTM card ${i + 1}` });
    T(s, h, { x: x + 0.3, y: 5.3, w: W3 - 0.6, h: 0.35, fontSize: 14, bold: true, color: C.text1 });
    T(s, d, { x: x + 0.3, y: 5.7, w: W3 - 0.6, h: 0.6, fontSize: 14, color: C.text2 });
  });
  s.addNotes("GO-TO-MARKET\n\n- How do you find, win, and keep customers, and how does that scale?\n- Be specific about the first channel that works; 'viral growth' or 'partnerships' with no evidence won't land.\n- If you have data (CAC by channel, conversion rates, sales cycle length, pipeline), it belongs here.");
}

// ---------- 11. Team ----------
pres.addSection({ title: "Team & Financials" });
{
  const s = content("10 · TEAM", "Why us: [the unfair advantage this team brings]", "Team & Financials");
  [1, 2, 3, 4].forEach((n, i) => {
    const x = COL4[i];
    box(s, { x, y: 1.95, w: W4, h: 3.85, fill: { color: C.background2 }, objectName: `Team card ${n}` });
    dot(s, x + 0.3, 2.25, 1.3, "[Photo]", C.accent5, C.text2, 11);
    T(s, "[Name]", { x: x + 0.3, y: 3.75, w: W4 - 0.6, h: 0.4, fontSize: 18, bold: true, color: C.text1 });
    T(s, "[Role]", { x: x + 0.3, y: 4.15, w: W4 - 0.6, h: 0.35, fontSize: 14, bold: true, color: C.accent1 });
    T(s, "[Prior company, exit, or domain expertise: why you're the one to build this]", { x: x + 0.3, y: 4.6, w: W4 - 0.6, h: 1.05, fontSize: 13, color: C.text2 });
  });
  T(s, [
    { text: "Advisors & investors: ", options: { bold: true, color: C.text1 } },
    { text: "[Name (credential)]  ·  [Name (credential)]  ·  [Name (credential)]", options: { color: C.text2 } },
  ], { x: 0.6, y: 6.05, w: 12.13, h: 0.45, fontSize: 14, valign: "middle" });
  s.addNotes("TEAM (Sequoia: 'Founders, management, board of directors/advisors')\n\n- At early stages, investors are betting on the team more than anything else.\n- For each person, give the one credential that makes them uniquely suited to THIS problem (domain expertise, prior startup or exit, technical depth), not a full CV.\n- Show how long the founders have worked together and that you're full-time.\n- Delete or add cards to match your team; notable advisors and angels go in the bottom line.");
}

// ---------- 12. Financials ----------
{
  const s = content("11 · FINANCIALS", "Path to $[X]M revenue by [year]", "Team & Financials");
  const hdr = (t) => ({ text: t, options: { bold: true, color: C.background1, fill: { color: C.text1 }, align: t ? "center" : "left" } });
  const years = ["[Year 1]", "[Year 2]", "[Year 3]", "[Year 4]", "[Year 5]"];
  const rowsDef = [["Revenue", "$[ ]"], ["Gross margin", "[ ]%"], ["Operating expenses", "$[ ]"], ["Net burn / EBITDA", "$[ ]"], ["Ending cash", "$[ ]"], ["Headcount", "[ ]"]];
  const rows = [[hdr(""), ...years.map(hdr)]];
  rowsDef.forEach(([label, v], r) => {
    const fill = { color: r % 2 ? C.background2 : C.background1 };
    rows.push([{ text: label, options: { bold: true, color: C.text1, fill } }, ...years.map(() => ({ text: v, options: { color: C.text2, align: "center", fill } }))]);
  });
  s.addTable(rows, { x: 0.6, y: 1.95, w: 12.13, colW: [3.13, 1.8, 1.8, 1.8, 1.8, 1.8], rowH: 0.42, fontSize: 14, valign: "middle", border: { type: "solid", pt: 0.75, color: H.accent5 }, margin: [0, 0.12, 0, 0.12] });
  box(s, { x: 0.6, y: 5.2, w: 12.13, h: 1.4, fill: { color: C.background2 }, objectName: "Assumptions card" });
  T(s, "KEY ASSUMPTIONS", { x: 0.9, y: 5.38, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 2 });
  T(s, [
    { text: "[Growth rate and what drives it]", options: { bullet: true, breakLine: true } },
    { text: "[Pricing, churn, and sales capacity assumptions]", options: { bullet: true, breakLine: true } },
    { text: "[When you reach breakeven, or what the next round funds]", options: { bullet: true } },
  ], { x: 0.9, y: 5.72, w: 11.5, h: 0.8, fontSize: 14, color: C.text1 });
  s.addNotes("FINANCIALS\n\n- Keep it high level: 3–5 years of revenue, burn, and headcount. Detailed models go in the appendix or data room.\n- Investors know projections are guesses; they're judging whether your assumptions are reasonable and whether you understand your business's drivers.\n- Pre-revenue? Show the plan for the next 18–24 months and the milestones that unlock the next round instead.\n- Rename the year columns (e.g., 2027, 2028…) and delete rows you don't need.");
}

// ---------- 13. The ask ----------
{
  const s = content("12 · THE ASK", "We're raising $[X]M to reach [milestone] in [N] months", "Team & Financials");
  box(s, { x: 0.6, y: 1.95, w: 4.6, h: 4.6, fill: { color: C.text1 }, objectName: "Raise card" });
  T(s, "RAISING", { x: 1.0, y: 2.35, w: 3.8, h: 0.3, fontSize: 12, bold: true, color: C.accent5, charSpacing: 2 });
  T(s, "$[X]M", { x: 1.0, y: 2.75, w: 3.8, h: 1.1, fontSize: 60, bold: true, color: C.background1 });
  T(s, [
    { text: "[SAFE / priced round]", options: { breakLine: true } },
    { text: "[Pre-seed / Seed / Series A]", options: { breakLine: true } },
    { text: "[$X committed · Lead: (name)]" },
  ], { x: 1.0, y: 4.2, w: 3.8, h: 1.9, fontSize: 16, color: C.accent5, paraSpaceAfter: 8 });

  s.addChart(pres.charts.DOUGHNUT, [{ name: "Use of funds", labels: ["Product & engineering", "Sales & marketing", "Operations & G&A", "[Other]"], values: [25, 25, 25, 25] }], {
    x: 5.6, y: 1.95, w: 7.13, h: 2.85, holeSize: 60,
    chartColors: [H.accent1, H.dk1, H.accent4, H.accent5],
    showTitle: true, title: "Use of funds (placeholder split: replace)", titleFontSize: 14, titleColor: H.dk2, titleFontFace: "+mn-lt",
    showLegend: true, legendPos: "r", legendFontSize: 13, legendColor: H.dk2, legendFontFace: "+mn-lt",
    showPercent: true, showValue: false, dataLabelColor: H.lt1, dataLabelFontSize: 11, dataLabelFontFace: "+mn-lt",
  });
  const ms = [["MILESTONE 1", "[e.g., $1M ARR]", "[by month N]"], ["MILESTONE 2", "[e.g., 50 logos]", "[by month N]"], ["RUNWAY", "[N] months", "[to Series X metrics]"]];
  const mw = (7.13 - 0.5) / 3;
  ms.forEach(([l, h, d], i) => {
    const x = 5.6 + i * (mw + 0.25);
    box(s, { x, y: 5.05, w: mw, h: 1.5, fill: { color: C.background2 }, objectName: `Milestone ${i + 1}` });
    T(s, l, { x: x + 0.25, y: 5.22, w: mw - 0.5, h: 0.3, fontSize: 11, bold: true, color: C.accent1, charSpacing: 2 });
    T(s, h, { x: x + 0.25, y: 5.55, w: mw - 0.5, h: 0.45, fontSize: 16, bold: true, color: C.text1 });
    T(s, d, { x: x + 0.25, y: 6.02, w: mw - 0.5, h: 0.35, fontSize: 13, color: C.text2 });
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
