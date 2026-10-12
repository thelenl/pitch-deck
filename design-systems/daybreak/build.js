// Daybreak: light, airy, future-forward. Innovation + value creation.
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(path.join(__dirname, "..", "_shared", "apply_theme.js"));
const { scrubImagePaths } = require(path.join(__dirname, "..", "_shared", "scrub_image_paths.js"));

const OUT = process.argv[2] || path.join(__dirname, "..", "..", "pitch-deck-daybreak.pptx");
const ART = (f) => path.join(__dirname, "art", f);

const THEME = require("./theme.json"); // palette + fonts: edit theme.json
const H = THEME.colors;
const HEAD = "+mj-lt";            // theme heading font (Sora)
const SERIF = "Instrument Serif"; // accent: one emphasised phrase per title

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.title = "Investor Pitch Deck Template (Daybreak)";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;

// ---------- Layouts ----------
pres.defineSlideMaster({
  title: "TITLE_LIGHT",
  background: { path: ART("bg_title.jpg") },
  objects: [
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.8, y: 2.2, w: 7.4, h: 1.4, fontSize: 56, bold: false, color: C.text1, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "tagline", type: "body", x: 0.8, y: 3.8, w: 6.4, h: 1.0, fontSize: 20, color: C.text2, valign: "top", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "meta", type: "body", x: 0.8, y: 6.3, w: 7.0, h: 0.45, fontSize: 13, color: C.text2, valign: "top", margin: 0 }, text: "" } },
  ],
});

pres.defineSlideMaster({
  title: "CONTENT",
  background: { path: ART("bg_content.jpg") },
  margin: [0.5, 0.6, 0.8, 0.6],
  objects: [
    { image: { x: 0.6, y: 0.5, w: 0.16, h: 0.16, path: ART("orb.png") } },
    { placeholder: { options: { name: "eyebrow", type: "body", x: 0.88, y: 0.44, w: 8.5, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 3, valign: "middle", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.6, y: 0.82, w: 12.13, h: 1.0, fontSize: 26, bold: false, color: C.text1, valign: "top", margin: 0 }, text: "" } },
    { text: { text: "[Company name] · Confidential", options: { x: 0.6, y: 6.95, w: 6.0, h: 0.3, fontSize: 10, color: C.text2, margin: 0 } } },
  ],
  slideNumber: { x: 12.23, y: 6.95, w: 0.5, h: 0.3, fontSize: 10, color: C.text2, align: "right", margin: 0 },
});

pres.defineSlideMaster({
  title: "STATEMENT_LIGHT",
  background: { path: ART("bg_statement.jpg") },
  objects: [
    { placeholder: { options: { name: "title", type: "title", align: "left", x: 0.8, y: 1.5, w: 11.7, h: 2.3, fontSize: 40, bold: false, color: C.text1, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "sub", type: "body", x: 0.8, y: 4.05, w: 11.7, h: 1.2, fontSize: 20, color: C.text2, valign: "top", margin: 0 }, text: "" } },
  ],
});

// ---------- Helpers ----------
const T = (slide, text, o) => slide.addText(text, { isTextBox: true, margin: 0, valign: "top", ...o });
const shadow = () => ({ type: "outer", color: H.accent1, opacity: 0.1, blur: 18, offset: 4, angle: 90 });
const card = (slide, x, y, w, h, name) =>
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.16, fill: { color: C.background1 }, line: { color: C.accent5, width: 0.75 }, shadow: shadow(), objectName: name });
const tint = (slide, x, y, w, h, name) =>
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.16, fill: { color: C.background2 }, line: { type: "none" }, objectName: name });
const aurora = (slide, file, x, y, w, h, name) => slide.addImage({ path: ART(file), x, y, w, h, altText: "", objectName: name });
const num = (slide, x, y, d, label, size = 13) => {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: C.background1 }, line: { color: C.accent1, width: 1.25 } });
  T(slide, label, { x, y, w: d, h: d, fontSize: size, fontFace: HEAD, color: C.accent1, align: "center", valign: "middle" });
};
// Title = plain runs + one serif-italic emphasised phrase
const titleRuns = (parts, size) => parts.map(([t, em]) => em
  ? { text: t, options: { fontFace: SERIF, italic: true, color: C.accent1, fontSize: size } }
  : { text: t });
const content = (eyebrow, parts, section) => {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: section });
  s.addText(eyebrow, { placeholder: "eyebrow" });
  s.addText(titleRuns(parts, 31), { placeholder: "title" });
  return s;
};
const COL3 = [0.6, 4.74, 8.88], W3 = 3.85;
const COL4 = [0.6, 3.705, 6.81, 9.915], W4 = 2.815;

// ---------- 1. Title ----------
pres.addSection({ title: "Intro" });
{
  const s = pres.addSlide({ masterName: "TITLE_LIGHT", sectionTitle: "Intro" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 0.7, w: 1.6, h: 0.8, rectRadius: 0.12, fill: { color: C.background1, transparency: 40 }, line: { color: C.accent6, width: 1, dashType: "dash" }, objectName: "Logo placeholder" });
  T(s, "[Logo]", { x: 0.8, y: 0.7, w: 1.6, h: 0.8, fontSize: 12, color: C.text2, align: "center", valign: "middle" });
  s.addText("[Company name]", { placeholder: "title" });
  s.addText("[One-liner: We help (who) do (what) by (how)]", { placeholder: "tagline" });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.8, y: 5.05, w: 4.6, h: 0.55, rectRadius: 0.27, fill: { color: C.accent1 }, line: { type: "none" }, shadow: shadow(), objectName: "Raise chip" });
  T(s, "Raising $[X]M · [Pre-seed / Seed / Series A]", { x: 0.8, y: 5.05, w: 4.6, h: 0.55, fontSize: 14, bold: true, color: C.background1, align: "center", valign: "middle" });
  s.addText("[Founder name], [Title]  ·  [email@company.com]  ·  [Month YYYY]", { placeholder: "meta" });
  s.addNotes("TITLE / ONE-LINER\n\nIf an investor reads only this slide, they should know what you do. Use a plain-language one-liner (YC style: 'We help [who] do [what]'), not a slogan. Avoid jargon and buzzwords.\n\nThe raise chip is optional; some founders prefer to save the ask for the end. In a cold, send-ahead deck it's useful up front.");
}

// ---------- 2. Problem ----------
pres.addSection({ title: "Opportunity" });
{
  const s = content("01 — THE PROBLEM", [["[Target customers] struggle to [do X], and it costs them "], ["[time / money]", true]], "Opportunity");
  const rows = [
    ["[Pain point 1]", "[Who feels it, how often, and what it costs them]"],
    ["[Pain point 2]", "[Make it concrete: a real customer story beats an abstract claim]"],
    ["How it's handled today: [current workaround]", "[Spreadsheets, manual work, legacy tools, and why they fall short]"],
  ];
  rows.forEach(([h, d], i) => {
    const y = 2.05 + i * 1.5;
    num(s, 0.6, y, 0.55, String(i + 1).padStart(2, "0"), 12);
    T(s, h, { x: 1.4, y: y + 0.02, w: 6.2, h: 0.4, fontSize: 17, bold: true, color: C.text1 });
    T(s, d, { x: 1.4, y: y + 0.47, w: 6.2, h: 0.75, fontSize: 14, color: C.text2 });
  });
  aurora(s, "card_problem.png", 8.1, 2.0, 4.63, 4.4, "Stat card");
  T(s, "[XX%]", { x: 8.5, y: 2.4, w: 3.9, h: 1.2, fontSize: 64, fontFace: HEAD, color: C.text1 });
  T(s, "of [target customers] [experience this pain / lose $X per year to it]", { x: 8.5, y: 3.8, w: 3.9, h: 1.4, fontSize: 18, color: C.text1 });
  T(s, "Source: [citation]", { x: 8.5, y: 5.75, w: 3.9, h: 0.35, fontSize: 11, color: C.text2 });
  s.addNotes("PROBLEM (Sequoia: 'Describe the pain of the customer'; YC: 'Why is this a big, urgent problem?')\n\n- Who has the problem, specifically? Name the customer segment.\n- How painful is it? Quantify in time, money, or risk.\n- How do they solve it today, and why does that fall short?\n- One sharp stat or a short customer quote is more persuasive than a list.\n\nInvestors need to believe the problem is real, frequent, and expensive before they care about your solution.");
}

// ---------- 3. Solution ----------
{
  const s = content("02 — THE SOLUTION", [["[Product] lets [customer] "], ["[achieve outcome]", true], [" in [time] instead of [time]"]], "Opportunity");
  card(s, 0.6, 2.05, 5.4, 3.35, "Today card");
  T(s, "TODAY", { x: 0.95, y: 2.35, w: 4.7, h: 0.3, fontSize: 12, bold: true, color: C.text2, charSpacing: 3 });
  T(s, [
    { text: "[Slow / manual step]", options: { bullet: true, breakLine: true } },
    { text: "[Costly or error-prone step]", options: { bullet: true, breakLine: true } },
    { text: "[The outcome customers settle for]", options: { bullet: true } },
  ], { x: 0.95, y: 2.85, w: 4.7, h: 2.3, fontSize: 16, color: C.text2, paraSpaceAfter: 10 });

  s.addShape(pres.shapes.OVAL, { x: 6.25, y: 3.33, w: 0.8, h: 0.8, fill: { color: C.background1 }, line: { color: C.accent5, width: 0.75 }, shadow: shadow() });
  T(s, "→", { x: 6.25, y: 3.33, w: 0.8, h: 0.8, fontSize: 24, color: C.accent1, align: "center", valign: "middle" });

  aurora(s, "card_solution.png", 7.3, 2.05, 5.43, 3.35, "With product card");
  T(s, "WITH [PRODUCT]", { x: 7.65, y: 2.35, w: 4.7, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 3 });
  T(s, [
    { text: "[What becomes fast or automatic]", options: { bullet: true, breakLine: true } },
    { text: "[Measurable gain: X× faster, $Y saved]", options: { bullet: true, breakLine: true } },
    { text: "[A new outcome that wasn't possible before]", options: { bullet: true } },
  ], { x: 7.65, y: 2.85, w: 4.75, h: 2.3, fontSize: 16, color: C.text1, paraSpaceAfter: 10 });

  tint(s, 0.6, 5.7, 12.13, 0.85, "Insight card");
  T(s, [
    { text: "Our insight  ", options: { fontFace: SERIF, italic: true, fontSize: 22, color: C.accent1 } },
    { text: "[The non-obvious thing you understand about this problem that others miss]", options: { color: C.text1 } },
  ], { x: 0.95, y: 5.7, w: 11.5, h: 0.85, fontSize: 16, valign: "middle" });
  s.addNotes("SOLUTION (Sequoia: 'Demonstrate your company's value proposition')\n\n- Focus on what changes for the customer, not on a feature list.\n- Make the before/after contrast obvious and, if possible, measurable.\n- The 'insight' line is your secret: what you know that incumbents and other founders don't. Strong insights are often counter-intuitive.");
}

// ---------- 4. Product ----------
{
  const s = content("03 — PRODUCT", [["How it works: "], ["[the product in one sentence]", true]], "Opportunity");
  card(s, 0.6, 1.95, 7.4, 4.7, "Screenshot frame");
  [0, 1, 2].forEach((i) => s.addShape(pres.shapes.OVAL, { x: 0.85 + i * 0.22, y: 2.15, w: 0.13, h: 0.13, fill: { color: C.accent5 }, line: { type: "none" } }));
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.85, y: 2.45, w: 6.9, h: 3.95, rectRadius: 0.1, fill: { color: C.background2 }, line: { color: C.accent6, width: 1, dashType: "dash" }, objectName: "Screenshot placeholder" });
  T(s, "[Product screenshot, mockup, or demo GIF]", { x: 0.85, y: 2.45, w: 6.9, h: 3.95, fontSize: 16, color: C.text2, align: "center", valign: "middle" });
  [1, 2, 3].forEach((n, i) => {
    const y = 2.0 + i * 1.6;
    num(s, 8.4, y, 0.5, String(n).padStart(2, "0"), 11);
    T(s, `[Key feature ${n}]`, { x: 9.15, y: y + 0.03, w: 3.58, h: 0.4, fontSize: 17, bold: true, color: C.text1 });
    T(s, "[What it does and why the user cares]", { x: 9.15, y: y + 0.48, w: 3.58, h: 0.8, fontSize: 14, color: C.text2 });
  });
  s.addNotes("PRODUCT / DEMO\n\n- Show, don't tell: real screenshots beat mockups; a short GIF or live demo beats both.\n- Call out the 'magic moment', the point where the user gets value.\n- Mention the product roadmap only briefly; you can put it in the appendix.\n- If you're pre-product, show the prototype and what you've validated with users.");
}

// ---------- 5. Why now ----------
{
  const s = content("04 — WHY NOW", [["Why now: "], ["[the shift that makes this possible today]", true]], "Opportunity");
  const cards = [
    ["TECHNOLOGY", "[What changed in the tech]"],
    ["MARKET / BEHAVIOR", "[What changed in how people buy or work]"],
    ["REGULATION / COST", "[What changed in rules or costs]"],
  ];
  cards.forEach(([label, head], i) => {
    const x = COL3[i];
    card(s, x, 2.05, W3, 3.95, `Why now card ${i + 1}`);
    num(s, x + 0.35, 2.4, 0.6, String(i + 1).padStart(2, "0"), 13);
    T(s, label, { x: x + 0.35, y: 3.3, w: W3 - 0.7, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 3 });
    T(s, head, { x: x + 0.35, y: 3.68, w: W3 - 0.7, h: 1.05, fontSize: 19, fontFace: HEAD, color: C.text1 });
    T(s, "[Why this makes your solution possible, or necessary, now and not 5 years ago]", { x: x + 0.35, y: 4.8, w: W3 - 0.7, h: 1.0, fontSize: 14, color: C.text2 });
  });
  s.addNotes("WHY NOW (Sequoia: 'Set up the historical evolution of your category. Why hasn't this been done before?')\n\n- Investors look hard at this slide: great ideas often failed because they were too early.\n- Common 'why now' drivers: a new platform or technology (e.g., AI models, cheaper sensors), a regulatory change, a behavior shift, a collapse in cost, or a market dislocation.\n- You don't need all three cards; one compelling shift is better than three weak ones.");
}

// ---------- 6. Market ----------
{
  const s = content("05 — MARKET SIZE", [["A $[X]B market, and we can win "], ["$[Y]M of it", true], [" in [N] years"]], "Opportunity");
  const cx = 3.15;
  s.addShape(pres.shapes.OVAL, { x: cx - 2.25, y: 1.95, w: 4.5, h: 4.5, fill: { color: C.background2 }, line: { color: C.accent6, width: 1 }, objectName: "TAM circle" });
  s.addShape(pres.shapes.OVAL, { x: cx - 1.6, y: 3.25, w: 3.2, h: 3.2, fill: { color: "DCD5FF" }, line: { type: "none" }, objectName: "SAM circle" });
  s.addImage({ path: ART("glow.png"), x: cx - 1.9, y: 3.6, w: 3.8, h: 3.8, altText: "", objectName: "SOM glow" });
  s.addShape(pres.shapes.OVAL, { x: cx - 0.95, y: 4.55, w: 1.9, h: 1.9, fill: { color: C.accent1 }, line: { type: "none" }, objectName: "SOM circle" });
  T(s, "TAM", { x: cx - 1, y: 2.4, w: 2, h: 0.4, fontSize: 15, fontFace: HEAD, color: C.text2, align: "center" });
  T(s, "SAM", { x: cx - 1, y: 3.7, w: 2, h: 0.4, fontSize: 15, fontFace: HEAD, color: C.text1, align: "center" });
  T(s, "SOM", { x: cx - 1, y: 5.3, w: 2, h: 0.4, fontSize: 15, fontFace: HEAD, color: C.background1, align: "center" });
  const rows = [
    ["$[X]B", "Total addressable market (TAM)", "[Everyone who could ever buy this × annual spend]"],
    ["$[X]B", "Serviceable market (SAM)", "[The segment you can reach with today's product and channels]"],
    ["$[X]M", "Obtainable in [3–5] years (SOM)", "[The realistic share you can win: the number to defend]"],
  ];
  rows.forEach(([v, l, d], i) => {
    const y = 2.0 + i * 1.3;
    T(s, v, { x: 6.1, y, w: 2.2, h: 0.6, fontSize: 30, fontFace: HEAD, color: i === 2 ? C.accent1 : C.text1 });
    T(s, l, { x: 8.4, y: y + 0.02, w: 4.33, h: 0.35, fontSize: 15, bold: true, color: C.text1 });
    T(s, d, { x: 8.4, y: y + 0.42, w: 4.33, h: 0.7, fontSize: 14, color: C.text2 });
  });
  tint(s, 6.1, 5.9, 6.63, 0.6, "Bottom-up math");
  T(s, [
    { text: "Bottom-up: ", options: { bold: true, color: C.accent1 } },
    { text: "[# customers] × $[annual contract value] = $[SAM]" },
  ], { x: 6.35, y: 5.9, w: 6.2, h: 0.6, fontSize: 14, color: C.text1, valign: "middle" });
  s.addNotes("MARKET SIZE (Sequoia: 'Identify/profile the customer you cater to')\n\n- Build the number bottom-up: (number of target customers) × (what each pays per year). Top-down figures ('1% of a $50B market') are a red flag to most VCs.\n- Venture investors generally need to see a path to a $1B+ company, so the TAM should support that.\n- Show your math, or keep it ready for the appendix; cite sources for any third-party numbers.");
}

// ---------- 7. Business model ----------
pres.addSection({ title: "Business" });
{
  const s = content("06 — BUSINESS MODEL", [["We charge [customer] "], ["[$X per unit]", true], [": [pricing model in one line]"]], "Business");
  [["[TIER 1]", "$[X]"], ["[TIER 2]", "$[X]"], ["[TIER 3]", "$[X]"]].forEach(([name, price], i) => {
    const x = COL3[i];
    if (i === 1) aurora(s, "card_tier.png", x, 1.95, W3, 2.1, "Pricing tier 2");
    else card(s, x, 1.95, W3, 2.1, `Pricing tier ${i + 1}`);
    T(s, name, { x: x + 0.35, y: 2.2, w: W3 - 0.7, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 3 });
    T(s, [
      { text: price, options: { fontSize: 30, fontFace: HEAD } },
      { text: "  / [user · month]", options: { fontSize: 14 } },
    ], { x: x + 0.35, y: 2.55, w: W3 - 0.7, h: 0.65, color: C.text1, valign: "bottom" });
    T(s, "[Who it's for and what's included]", { x: x + 0.35, y: 3.35, w: W3 - 0.7, h: 0.55, fontSize: 14, color: i === 1 ? C.text1 : C.text2 });
  });
  T(s, "UNIT ECONOMICS", { x: 0.6, y: 4.35, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 3 });
  [["$[X]", "Avg. contract value (ACV)"], ["[X]%", "Gross margin"], ["[N] mo", "CAC payback period"], ["[X]:1", "LTV : CAC"]].forEach(([v, l], i) => {
    const x = COL4[i];
    card(s, x, 4.75, W4, 1.6, `Unit economics ${i + 1}`);
    T(s, v, { x: x + 0.3, y: 5.0, w: W4 - 0.6, h: 0.6, fontSize: 28, fontFace: HEAD, color: C.text1 });
    T(s, l, { x: x + 0.3, y: 5.68, w: W4 - 0.6, h: 0.5, fontSize: 13, color: C.text2 });
  });
  s.addNotes("BUSINESS MODEL (Sequoia: 'Revenue model, pricing, average account size, lifetime value')\n\n- Who pays, how much, how often? (subscription, usage-based, transaction fee, marketplace take rate…)\n- Swap the pricing tiers for a single price if that's simpler; delete what you don't need.\n- Unit economics: only show what you actually have. At pre-seed it's fine to show target or early numbers, labeled as such.\n- Rough benchmarks investors use for SaaS: LTV:CAC ≥ 3:1, CAC payback < 12–18 months, gross margin 70%+.");
}

// ---------- 8. Traction ----------
{
  const s = content("07 — TRACTION", [["[Key metric] "], ["grew [X]×", true], [" in [N] months"]], "Business");
  card(s, 0.6, 1.95, 7.6, 4.65, "Chart card");
  s.addChart(pres.charts.BAR, [{ name: "[Metric]", labels: ["[M1]", "[M2]", "[M3]", "[M4]", "[M5]", "[M6]"], values: [10, 14, 19, 26, 34, 45] }], {
    x: 0.8, y: 2.1, w: 7.2, h: 4.35, barDir: "col", barGapWidthPct: 70,
    chartColors: [H.accent1], showLegend: false,
    showTitle: true, title: "[Revenue / users] by month (sample data: replace)", titleFontSize: 13, titleColor: H.dk2, titleFontFace: "+mn-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: H.dk2, dataLabelFontFace: "+mn-lt",
    catAxisLabelColor: H.dk2, catAxisLabelFontSize: 12, catAxisLabelFontFace: "+mn-lt", catAxisLineShow: false,
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
  });
  [["$[X]", "Monthly recurring revenue"], ["+[X]%", "Month-over-month growth"], ["[X]%", "Net revenue retention"]].forEach(([v, l], i) => {
    const y = 1.95 + i * 1.6;
    if (i === 0) aurora(s, "card_mrr.png", 8.6, y, 4.13, 1.4, "Traction stat 1");
    else card(s, 8.6, y, 4.13, 1.4, `Traction stat ${i + 1}`);
    T(s, v, { x: 8.95, y: y + 0.2, w: 3.5, h: 0.6, fontSize: 30, fontFace: HEAD, color: i === 1 ? C.accent4 : C.text1 });
    T(s, l, { x: 8.95, y: y + 0.87, w: 3.5, h: 0.35, fontSize: 14, color: i === 0 ? C.text1 : C.text2 });
  });
  s.addNotes("TRACTION (YC: 'This is often the most important slide')\n\n- Put your single best number in the headline and make it big.\n- Show growth over time, not a snapshot: a chart going up and to the right is the point of this slide.\n- The chart uses SAMPLE data. Right-click it → Edit Data to enter your real numbers.\n- Pick metrics that fit your stage: revenue/MRR, active users, retention, paid pilots, LOIs, waitlist, notable customer logos.\n- If traction is your strongest card, move this slide up to right after the Solution.");
}

// ---------- 9. Competition ----------
{
  const s = content("08 — COMPETITION", [["[Company] is the only [category] that "], ["[key differentiator]", true]], "Business");
  T(s, "↑  [Y axis: e.g., Depth / power]", { x: 1.0, y: 1.95, w: 6, h: 0.3, fontSize: 12, color: C.text2 });
  card(s, 1.0, 2.3, 6.0, 3.9, "Matrix background");
  s.addShape(pres.shapes.LINE, { x: 4.0, y: 2.45, w: 0, h: 3.6, line: { color: C.accent5, width: 1.25 } });
  s.addShape(pres.shapes.LINE, { x: 1.15, y: 4.25, w: 5.7, h: 0, line: { color: C.accent5, width: 1.25 } });
  T(s, "[X axis: e.g., Ease of use]  →", { x: 1.0, y: 6.3, w: 6, h: 0.3, fontSize: 12, color: C.text2, align: "right" });
  s.addImage({ path: ART("glow.png"), x: 5.65, y: 2.05, w: 1.55, h: 1.55, altText: "", objectName: "You glow" });
  s.addShape(pres.shapes.OVAL, { x: 6.2, y: 2.6, w: 0.45, h: 0.45, fill: { color: C.accent1 }, line: { color: C.background1, width: 2 } });
  T(s, "[Your company]", { x: 4.15, y: 2.6, w: 1.95, h: 0.45, fontSize: 14, bold: true, color: C.text1, align: "right", valign: "middle" });
  [[1.4, 2.9, "[Competitor A]"], [4.5, 4.8, "[Competitor B]"], [1.4, 5.3, "[Competitor C]"]].forEach(([x, y, n]) => {
    s.addShape(pres.shapes.OVAL, { x, y, w: 0.35, h: 0.35, fill: { color: "C3C8D6" }, line: { type: "none" } });
    T(s, n, { x: x + 0.5, y, w: 1.9, h: 0.35, fontSize: 13, color: C.text2, valign: "middle" });
  });
  T(s, "WHY WE WIN", { x: 7.6, y: 2.3, w: 5, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 3 });
  [1, 2, 3].forEach((n, i) => {
    const y = 2.8 + i * 1.2;
    num(s, 7.6, y, 0.45, String(n).padStart(2, "0"), 10);
    T(s, `[Unfair advantage ${n}]`, { x: 8.3, y: y + 0.02, w: 4.43, h: 0.35, fontSize: 16, bold: true, color: C.text1 });
    T(s, "[e.g., proprietary data, network effects, distribution, deep tech]", { x: 8.3, y: y + 0.42, w: 4.43, h: 0.6, fontSize: 13, color: C.text2 });
  });
  s.addNotes("COMPETITION (Sequoia: 'List competitors; list your plan to win')\n\n- Never say 'we have no competitors'. It signals naïveté or no market. Include the status quo (spreadsheets, doing nothing) and big incumbents.\n- Pick 2×2 axes that genuinely matter to customers and honestly put you in the top-right. If the axes feel contrived, use a comparison table instead.\n- The 'why we win' column matters more than the chart: what's defensible and gets stronger over time?");
}

// ---------- 10. Go-to-market ----------
{
  const s = content("09 — GO-TO-MARKET", [["How we reach customers: "], ["[primary channel]", true]], "Business");
  const steps = [["STEP 1 · LAND", "[e.g., Founder-led sales to 10 design partners]"], ["STEP 2 · EXPAND", "[e.g., Referrals and upsell within accounts]"], ["STEP 3 · SCALE", "[e.g., Inside sales team + partner channel]"]];
  steps.forEach(([label, head], i) => {
    const x = COL3[i];
    num(s, x, 2.0, 0.7, String(i + 1).padStart(2, "0"), 16);
    if (i < 2) s.addShape(pres.shapes.LINE, { x: x + 0.85, y: 2.35, w: COL3[i + 1] - x - 1.0, h: 0, line: { color: C.accent6, width: 1.5, dashType: "dash", endArrowType: "triangle" } });
    T(s, label, { x, y: 2.95, w: W3 - 0.2, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 3 });
    T(s, head, { x, y: 3.3, w: W3 - 0.2, h: 0.9, fontSize: 17, fontFace: HEAD, color: C.text1 });
    T(s, "[Timing, target, and what success looks like]", { x, y: 4.25, w: W3 - 0.2, h: 0.6, fontSize: 14, color: C.text2 });
  });
  [["Ideal customer", "[Industry, company size, buyer title]"], ["Sales motion", "[Self-serve, PLG, or sales team]"], ["Proof it works", "[CAC by channel, conversion rate, pipeline]"]].forEach(([h, d], i) => {
    const x = COL3[i];
    card(s, x, 5.1, W3, 1.4, `GTM card ${i + 1}`);
    T(s, h, { x: x + 0.3, y: 5.3, w: W3 - 0.6, h: 0.35, fontSize: 14, bold: true, color: C.text1 });
    T(s, d, { x: x + 0.3, y: 5.7, w: W3 - 0.6, h: 0.6, fontSize: 14, color: C.text2 });
  });
  s.addNotes("GO-TO-MARKET\n\n- How do you find, win, and keep customers, and how does that scale?\n- Be specific about the first channel that works; 'viral growth' or 'partnerships' with no evidence won't land.\n- If you have data (CAC by channel, conversion rates, sales cycle length, pipeline), it belongs here.");
}

// ---------- 11. Team ----------
pres.addSection({ title: "Team & Financials" });
{
  const s = content("10 — TEAM", [["Why us: "], ["[the unfair advantage this team brings]", true]], "Team & Financials");
  [1, 2, 3, 4].forEach((n, i) => {
    const x = COL4[i];
    card(s, x, 1.95, W4, 3.85, `Team card ${n}`);
    s.addShape(pres.shapes.OVAL, { x: x + 0.3, y: 2.25, w: 1.3, h: 1.3, fill: { color: C.background2 }, line: { color: C.accent6, width: 1.25 } });
    T(s, "[Photo]", { x: x + 0.3, y: 2.25, w: 1.3, h: 1.3, fontSize: 11, color: C.text2, align: "center", valign: "middle" });
    T(s, "[Name]", { x: x + 0.3, y: 3.75, w: W4 - 0.6, h: 0.4, fontSize: 18, fontFace: HEAD, color: C.text1 });
    T(s, "[Role]", { x: x + 0.3, y: 4.17, w: W4 - 0.6, h: 0.35, fontSize: 13, bold: true, color: C.accent1 });
    T(s, "[Prior company, exit, or domain expertise: why you're the one to build this]", { x: x + 0.3, y: 4.6, w: W4 - 0.6, h: 1.05, fontSize: 13, color: C.text2 });
  });
  T(s, [
    { text: "Advisors & investors  ", options: { fontFace: SERIF, italic: true, fontSize: 18, color: C.accent1 } },
    { text: "[Name (credential)]  ·  [Name (credential)]  ·  [Name (credential)]", options: { color: C.text2 } },
  ], { x: 0.6, y: 6.05, w: 12.13, h: 0.45, fontSize: 14, valign: "middle" });
  s.addNotes("TEAM (Sequoia: 'Founders, management, board of directors/advisors')\n\n- At early stages, investors are betting on the team more than anything else.\n- For each person, give the one credential that makes them uniquely suited to THIS problem (domain expertise, prior startup or exit, technical depth), not a full CV.\n- Show how long the founders have worked together and that you're full-time.\n- Delete or add cards to match your team; notable advisors and angels go in the bottom line.");
}

// ---------- 12. Financials ----------
{
  const s = content("11 — FINANCIALS", [["Path to "], ["$[X]M revenue", true], [" by [year]"]], "Team & Financials");
  const hdr = (t) => ({ text: t, options: { bold: true, color: C.accent1, fill: { color: C.background2 }, align: t ? "center" : "left" } });
  const years = ["[Year 1]", "[Year 2]", "[Year 3]", "[Year 4]", "[Year 5]"];
  const rowsDef = [["Revenue", "$[ ]"], ["Gross margin", "[ ]%"], ["Operating expenses", "$[ ]"], ["Net burn / EBITDA", "$[ ]"], ["Ending cash", "$[ ]"], ["Headcount", "[ ]"]];
  const rows = [[hdr(""), ...years.map(hdr)]];
  rowsDef.forEach(([label, v], r) => {
    const fill = { color: r % 2 ? "FAFBFF" : C.background1 };
    rows.push([{ text: label, options: { bold: true, color: C.text1, fill } }, ...years.map(() => ({ text: v, options: { color: C.text2, align: "center", fill } }))]);
  });
  s.addTable(rows, { x: 0.6, y: 1.95, w: 12.13, colW: [3.13, 1.8, 1.8, 1.8, 1.8, 1.8], rowH: 0.42, fontSize: 14, valign: "middle", border: { type: "solid", pt: 0.75, color: H.accent5 }, margin: [0, 0.12, 0, 0.12] });
  tint(s, 0.6, 5.2, 12.13, 1.4, "Assumptions card");
  T(s, "KEY ASSUMPTIONS", { x: 0.9, y: 5.38, w: 6, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 3 });
  T(s, [
    { text: "[Growth rate and what drives it]", options: { bullet: true, breakLine: true } },
    { text: "[Pricing, churn, and sales capacity assumptions]", options: { bullet: true, breakLine: true } },
    { text: "[When you reach breakeven, or what the next round funds]", options: { bullet: true } },
  ], { x: 0.9, y: 5.72, w: 11.5, h: 0.8, fontSize: 14, color: C.text1 });
  s.addNotes("FINANCIALS\n\n- Keep it high level: 3–5 years of revenue, burn, and headcount. Detailed models go in the appendix or data room.\n- Investors know projections are guesses; they're judging whether your assumptions are reasonable and whether you understand your business's drivers.\n- Pre-revenue? Show the plan for the next 18–24 months and the milestones that unlock the next round instead.\n- Rename the year columns (e.g., 2027, 2028…) and delete rows you don't need.");
}

// ---------- 13. The ask ----------
{
  const s = content("12 — THE ASK", [["We're raising $[X]M to reach "], ["[milestone]", true], [" in [N] months"]], "Team & Financials");
  aurora(s, "card_raise.png", 0.6, 1.95, 4.6, 4.6, "Raise card");
  T(s, "RAISING", { x: 1.0, y: 2.35, w: 3.8, h: 0.3, fontSize: 12, bold: true, color: C.accent1, charSpacing: 3 });
  T(s, "$[X]M", { x: 1.0, y: 2.75, w: 3.8, h: 1.1, fontSize: 60, fontFace: HEAD, color: C.text1 });
  T(s, [
    { text: "[SAFE / priced round]", options: { breakLine: true } },
    { text: "[Pre-seed / Seed / Series A]", options: { breakLine: true } },
    { text: "[$X committed · Lead: (name)]" },
  ], { x: 1.0, y: 4.2, w: 3.8, h: 1.9, fontSize: 16, color: C.text1, paraSpaceAfter: 8 });

  card(s, 5.6, 1.95, 7.13, 2.85, "Use of funds card");
  s.addChart(pres.charts.DOUGHNUT, [{ name: "Use of funds", labels: ["Product & engineering", "Sales & marketing", "Operations & G&A", "[Other]"], values: [25, 25, 25, 25] }], {
    x: 5.75, y: 2.05, w: 6.85, h: 2.65, holeSize: 62,
    chartColors: [H.accent1, H.accent2, H.accent3, H.accent6],
    showTitle: true, title: "Use of funds (placeholder split: replace)", titleFontSize: 13, titleColor: H.dk2, titleFontFace: "+mn-lt",
    showLegend: true, legendPos: "r", legendFontSize: 13, legendColor: H.dk1, legendFontFace: "+mn-lt",
    showPercent: false, showValue: false,
  });
  const ms = [["MILESTONE 1", "[e.g., $1M ARR]", "[by month N]"], ["MILESTONE 2", "[e.g., 50 logos]", "[by month N]"], ["RUNWAY", "[N] months", "[to next round]"]];
  const mw = (7.13 - 0.5) / 3;
  ms.forEach(([l, h, d], i) => {
    const x = 5.6 + i * (mw + 0.25);
    card(s, x, 5.05, mw, 1.5, `Milestone ${i + 1}`);
    T(s, l, { x: x + 0.25, y: 5.22, w: mw - 0.5, h: 0.3, fontSize: 11, bold: true, color: C.accent1, charSpacing: 3 });
    T(s, h, { x: x + 0.25, y: 5.55, w: mw - 0.5, h: 0.45, fontSize: 15, fontFace: HEAD, color: C.text1 });
    T(s, d, { x: x + 0.25, y: 6.02, w: mw - 0.5, h: 0.35, fontSize: 13, color: C.text2 });
  });
  s.addNotes("THE ASK / USE OF FUNDS\n\n- State the amount, instrument (SAFE or priced round), and anything already committed or a lead investor.\n- Tie the money to milestones: 'this round gets us to X, which sets us up for the next round'. Investors fund milestones, not runway.\n- 18–24 months of runway is a typical target.\n- The doughnut uses a placeholder 25/25/25/25 split. Right-click → Edit Data to change it.");
}

// ---------- 14. Vision / close ----------
pres.addSection({ title: "Close" });
{
  const s = pres.addSlide({ masterName: "STATEMENT_LIGHT", sectionTitle: "Close" });
  s.addText(titleRuns([["[Your vision in one bold sentence: "], ["what the world looks like if you win]", true]], 48), { placeholder: "title" });
  s.addText("[Founder name]  ·  [email@company.com]  ·  [phone]  ·  [company.com]", { placeholder: "sub" });
  s.addNotes("VISION / CLOSE\n\n- End on the big picture: if everything works, what does this company become in 10 years?\n- Leave contact details on screen during Q&A.\n- Optionally restate the ask in one line.");
}

// ---------- 15. Appendix ----------
{
  const s = pres.addSlide({ masterName: "STATEMENT_LIGHT", sectionTitle: "Close" });
  s.addText(titleRuns([["Appendix", true]], 56), { placeholder: "title" });
  s.addText("[Detailed financials  ·  Cohort and retention data  ·  Customer case studies  ·  Technical architecture  ·  Product roadmap  ·  Cap table]", { placeholder: "sub" });
  s.addNotes("APPENDIX\n\nBackup slides for diligence questions. Keep them out of the main flow, but have them ready. Typical contents: detailed model, cohort/retention curves, customer references and case studies, technical deep-dive, roadmap, cap table, and full TAM math.\n\nDuplicate any content slide (right-click → Duplicate Slide) to build these.");
}

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  await scrubImagePaths(OUT);
  console.log("wrote", OUT);
})();
