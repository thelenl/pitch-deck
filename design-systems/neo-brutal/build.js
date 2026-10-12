const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(path.join(__dirname, "..", "_shared", "apply_theme.js"));
const { scrubImagePaths } = require(path.join(__dirname, "..", "_shared", "scrub_image_paths.js"));

const OUT = process.argv[2] || path.join(__dirname, "..", "..", "pitch-deck-neo-brutal.pptx");

// Neo-Brutal Money: cream paper, black ink, loud colour blocks, hard offset shadows
const THEME = require("./theme.json"); // palette + fonts: edit theme.json
const H = THEME.colors;
const MONO = "Space Mono";
const HEAD = "+mj-lt"; // theme heading font, for big numerals in text boxes

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.title = "Investor Pitch Deck Template";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const INK = C.text1, PAPER = C.background1, WHITE = C.background2;
const BLUE = C.accent1, LIME = C.accent2, YELLOW = C.accent3, PINK = C.accent4;

// ---------- Layouts ----------
pres.defineSlideMaster({
  title: "TITLE_BLOCK",
  background: { color: YELLOW },
  objects: [
    { placeholder: { options: { name: "title", type: "title", align: "left", bold: true, x: 0.8, y: 2.0, w: 9.0, h: 1.6, fontSize: 66, color: INK, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "tagline", type: "body", align: "left", x: 0.8, y: 3.8, w: 8.3, h: 1.0, fontSize: 22, color: INK, valign: "top", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "meta", type: "body", align: "left", x: 0.8, y: 6.45, w: 11.0, h: 0.4, fontSize: 13, fontFace: MONO, color: INK, valign: "top", margin: 0 }, text: "" } },
  ],
});

pres.defineSlideMaster({
  title: "CONTENT",
  background: { color: PAPER },
  margin: [0.5, 0.6, 0.8, 0.6],
  objects: [
    { placeholder: { options: { name: "eyebrow", type: "body", align: "left", x: 0.78, y: 0.42, w: 6.0, h: 0.42, fontSize: 12, bold: true, fontFace: MONO, color: INK, valign: "middle", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "title", type: "title", align: "left", bold: true, x: 0.6, y: 1.02, w: 12.13, h: 1.05, fontSize: 28, color: INK, valign: "top", margin: 0 }, text: "" } },
    { text: { text: "[Company name] · Confidential", options: { x: 0.6, y: 6.98, w: 6.0, h: 0.3, fontSize: 10, fontFace: MONO, color: C.text2, margin: 0 } } },
    { rect: { x: 12.23, y: 6.93, w: 0.5, h: 0.38, fill: { color: INK } } },
  ],
  slideNumber: { x: 12.23, y: 6.93, w: 0.5, h: 0.38, fontSize: 11, fontFace: MONO, bold: true, color: PAPER, align: "center", valign: "middle", margin: 0 },
});

pres.defineSlideMaster({
  title: "STATEMENT_INK",
  background: { color: INK },
  objects: [
    { placeholder: { options: { name: "title", type: "title", align: "left", bold: true, x: 0.8, y: 1.9, w: 9.2, h: 2.2, fontSize: 40, color: PAPER, valign: "bottom", margin: 0 }, text: "" } },
    { placeholder: { options: { name: "sub", type: "body", align: "left", x: 0.8, y: 4.45, w: 9.6, h: 1.4, fontSize: 17, fontFace: MONO, color: LIME, valign: "top", margin: 0 }, text: "" } },
  ],
});

// ---------- Helpers ----------
const SH = 0.09; // hard shadow offset
const T = (slide, text, o) => slide.addText(text, { isTextBox: true, margin: 0, valign: "top", ...o });
// Card: solid black offset shadow + thick black outline
const brut = (s, { x, y, w, h, fill = WHITE, name, lw = 2.25, shadow = INK, rotate }) => {
  s.addShape(pres.shapes.RECTANGLE, { x: x + SH, y: y + SH, w, h, fill: { color: shadow }, line: { type: "none" }, ...(rotate ? { rotate } : {}) });
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: INK, width: lw }, objectName: name, ...(rotate ? { rotate } : {}) });
};
// Square number chip with outline
const chip = (s, x, y, d, label, fill = YELLOW, color = INK, size = 16) => {
  s.addShape(pres.shapes.RECTANGLE, { x, y, w: d, h: d, fill: { color: fill }, line: { color: INK, width: 2 } });
  T(s, label, { x, y, w: d, h: d, fontSize: size, fontFace: HEAD, bold: true, color, align: "center", valign: "middle" });
};
// Round marker with outline
const disc = (s, x, y, d, fill, label, color = INK, size = 12) => {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: INK, width: 2 } });
  if (label) T(s, label, { x, y, w: d, h: d, fontSize: size, bold: true, color, align: "center", valign: "middle" });
};
// Rotated sticker badge
const sticker = (s, text, { x, y, w, h, fill = PINK, color = INK, rotate = -5, size = 13 }) => {
  s.addShape(pres.shapes.RECTANGLE, { x: x + 0.06, y: y + 0.06, w, h, fill: { color: INK }, line: { type: "none" }, rotate });
  s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: INK, width: 2 }, rotate, objectName: "Sticker" });
  T(s, text, { x, y, w, h, fontSize: size, fontFace: MONO, bold: true, color, align: "center", valign: "middle", rotate });
};
const label = (s, text, x, y, w, color = INK) => T(s, text, { x, y, w, h: 0.3, fontSize: 11, fontFace: MONO, bold: true, color });

const content = (eyebrow, title, section, tagColor) => {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: section });
  const w = 0.45 + eyebrow.length * 0.112;
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6 + 0.06, y: 0.42 + 0.06, w, h: 0.42, fill: { color: INK }, line: { type: "none" } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 0.42, w, h: 0.42, fill: { color: tagColor }, line: { color: INK, width: 2 }, objectName: "Eyebrow tag" });
  s.addText(eyebrow, { placeholder: "eyebrow", ...(tagColor === BLUE ? { color: WHITE } : {}) });
  s.addText(title, { placeholder: "title" });
  return s;
};
const COL3 = [0.6, 4.74, 8.88], W3 = 3.76;
const COL4 = [0.6, 3.705, 6.81, 9.915], W4 = 2.72;

// ---------- 1. Title ----------
pres.addSection({ title: "Intro" });
{
  const s = pres.addSlide({ masterName: "TITLE_BLOCK", sectionTitle: "Intro" });
  // decorative composition
  s.addShape(pres.shapes.OVAL, { x: 10.0 + 0.1, y: 0.7 + 0.1, w: 2.6, h: 2.6, fill: { color: INK }, line: { type: "none" } });
  s.addShape(pres.shapes.OVAL, { x: 10.0, y: 0.7, w: 2.6, h: 2.6, fill: { color: BLUE }, line: { color: INK, width: 3 }, objectName: "Blue disc" });
  s.addShape(pres.shapes.RECTANGLE, { x: 11.0 + 0.1, y: 4.0 + 0.1, w: 1.7, h: 1.7, fill: { color: INK }, line: { type: "none" }, rotate: 12 });
  s.addShape(pres.shapes.RECTANGLE, { x: 11.0, y: 4.0, w: 1.7, h: 1.7, fill: { color: PINK }, line: { color: INK, width: 3 }, rotate: 12, objectName: "Pink block" });
  s.addShape(pres.shapes.STAR_5_POINT, { x: 9.55, y: 3.15, w: 1.45, h: 1.45, fill: { color: LIME }, line: { color: INK, width: 3 }, rotate: -10, objectName: "Lime star" });

  brut(s, { x: 0.8, y: 0.7, w: 1.6, h: 0.8, fill: WHITE, name: "Logo placeholder" });
  T(s, "[Logo]", { x: 0.8, y: 0.7, w: 1.6, h: 0.8, fontSize: 12, fontFace: MONO, color: INK, align: "center", valign: "middle" });
  s.addText("[Company name]", { placeholder: "title" });
  s.addText("[One-liner: We help (who) do (what) by (how)]", { placeholder: "tagline" });
  sticker(s, "Raising $[X]M · [Pre-seed / Seed / Series A]", { x: 0.8, y: 5.15, w: 5.6, h: 0.62, fill: INK, color: LIME, rotate: -3, size: 14 });
  s.addText("[Founder name], [Title]  ·  [email@company.com]  ·  [Month YYYY]", { placeholder: "meta" });
  s.addNotes("TITLE / ONE-LINER\n\nIf an investor reads only this slide, they should know what you do. Use a plain-language one-liner (YC style: 'We help [who] do [what]'), not a slogan. Avoid jargon and buzzwords.\n\nThe raise chip is optional; some founders prefer to save the ask for the end. In a cold, send-ahead deck it's useful up front.");
}

// ---------- 2. Problem ----------
pres.addSection({ title: "Opportunity" });
{
  const s = content("01 · THE PROBLEM", "[Target customers] struggle to [do X], and it costs them [time / money]", "Opportunity", PINK);
  const rows = [
    ["[Pain point 1]", "[Who feels it, how often, and what it costs them]"],
    ["[Pain point 2]", "[Make it concrete: a real customer story beats an abstract claim]"],
    ["How it's handled today: [current workaround]", "[Spreadsheets, manual work, legacy tools, and why they fall short]"],
  ];
  const fills = [YELLOW, LIME, PINK];
  rows.forEach(([h, d], i) => {
    const y = 2.3 + i * 1.42;
    brut(s, { x: 0.6, y, w: 7.1, h: 1.18, fill: WHITE, name: `Pain card ${i + 1}` });
    chip(s, 0.85, y + 0.29, 0.6, String(i + 1), fills[i]);
    T(s, h, { x: 1.7, y: y + 0.2, w: 5.8, h: 0.4, fontSize: 17, bold: true, color: INK });
    T(s, d, { x: 1.7, y: y + 0.62, w: 5.8, h: 0.45, fontSize: 13, color: C.text2 });
  });
  brut(s, { x: 8.2, y: 2.3, w: 4.4, h: 4.02, fill: PINK, name: "Stat card" });
  T(s, "[XX%]", { x: 8.55, y: 2.7, w: 3.8, h: 1.25, fontSize: 64, fontFace: HEAD, bold: true, color: INK });
  T(s, "of [target customers] [experience this pain / lose $X per year to it]", { x: 8.55, y: 4.1, w: 3.75, h: 1.3, fontSize: 18, bold: true, color: INK });
  T(s, "Source: [citation]", { x: 8.55, y: 5.75, w: 3.75, h: 0.35, fontSize: 11, fontFace: MONO, color: INK });
  sticker(s, "OUCH.", { x: 11.45, y: 2.0, w: 1.25, h: 0.48, fill: YELLOW, rotate: 8 });
  s.addNotes("PROBLEM (Sequoia: 'Describe the pain of the customer'; YC: 'Why is this a big, urgent problem?')\n\n- Who has the problem, specifically? Name the customer segment.\n- How painful is it? Quantify in time, money, or risk.\n- How do they solve it today, and why does that fall short?\n- One sharp stat or a short customer quote is more persuasive than a list.\n\nInvestors need to believe the problem is real, frequent, and expensive before they care about your solution.");
}

// ---------- 3. Solution ----------
{
  const s = content("02 · THE SOLUTION", "[Product] lets [customer] [achieve outcome] in [time] instead of [time]", "Opportunity", LIME);
  brut(s, { x: 0.6, y: 2.3, w: 5.3, h: 3.0, fill: WHITE, name: "Today card" });
  label(s, "TODAY", 0.95, 2.55, 4.6, C.text2);
  T(s, [
    { text: "[Slow / manual step]", options: { bullet: true, breakLine: true } },
    { text: "[Costly or error-prone step]", options: { bullet: true, breakLine: true } },
    { text: "[The outcome customers settle for]", options: { bullet: true } },
  ], { x: 0.95, y: 3.0, w: 4.7, h: 2.1, fontSize: 16, color: INK, paraSpaceAfter: 10 });

  s.addShape(pres.shapes.RIGHT_ARROW, { x: 6.1 + 0.07, y: 3.4 + 0.07, w: 1.0, h: 0.85, fill: { color: INK }, line: { type: "none" } });
  s.addShape(pres.shapes.RIGHT_ARROW, { x: 6.1, y: 3.4, w: 1.0, h: 0.85, fill: { color: YELLOW }, line: { color: INK, width: 2 }, objectName: "Arrow" });

  brut(s, { x: 7.3, y: 2.3, w: 5.3, h: 3.0, fill: LIME, name: "With product card" });
  label(s, "WITH [PRODUCT]", 7.65, 2.55, 4.6);
  T(s, [
    { text: "[What becomes fast or automatic]", options: { bullet: true, breakLine: true } },
    { text: "[Measurable gain: X× faster, $Y saved]", options: { bullet: true, breakLine: true } },
    { text: "[A new outcome that wasn't possible before]", options: { bullet: true } },
  ], { x: 7.65, y: 3.0, w: 4.75, h: 2.1, fontSize: 16, bold: true, color: INK, paraSpaceAfter: 10 });

  brut(s, { x: 0.6, y: 5.6, w: 12.0, h: 0.9, fill: BLUE, name: "Insight card" });
  T(s, [
    { text: "Our insight: ", options: { bold: true, fontFace: MONO } },
    { text: "[The non-obvious thing you understand about this problem that others miss]" },
  ], { x: 0.95, y: 5.6, w: 11.4, h: 0.9, fontSize: 16, color: WHITE, valign: "middle" });
  s.addNotes("SOLUTION (Sequoia: 'Demonstrate your company's value proposition')\n\n- Focus on what changes for the customer, not on a feature list.\n- Make the before/after contrast obvious and, if possible, measurable.\n- The 'insight' line is your secret: what you know that incumbents and other founders don't. Strong insights are often counter-intuitive.");
}

// ---------- 4. Product ----------
{
  const s = content("03 · PRODUCT", "[How it works: the product in one sentence]", "Opportunity", YELLOW);
  brut(s, { x: 0.6, y: 2.25, w: 7.3, h: 4.25, fill: WHITE, name: "Screenshot frame" });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 2.25, w: 7.3, h: 0.45, fill: { color: INK }, line: { color: INK, width: 2.25 }, objectName: "Browser bar" });
  [PINK, YELLOW, LIME].forEach((f, i) => s.addShape(pres.shapes.OVAL, { x: 0.82 + i * 0.32, y: 2.38, w: 0.2, h: 0.2, fill: { color: f }, line: { type: "none" } }));
  T(s, "[Product screenshot, mockup, or demo GIF]", { x: 0.6, y: 2.7, w: 7.3, h: 3.8, fontSize: 16, fontFace: MONO, color: C.text2, align: "center", valign: "middle" });
  const fills = [LIME, PINK, BLUE];
  [1, 2, 3].forEach((n, i) => {
    const y = 2.25 + i * 1.47;
    brut(s, { x: 8.3, y, w: 4.3, h: 1.2, fill: WHITE, name: `Feature ${n}` });
    chip(s, 8.52, y + 0.3, 0.6, String(n), fills[i], i === 2 ? WHITE : INK);
    T(s, `[Key feature ${n}]`, { x: 9.32, y: y + 0.2, w: 3.1, h: 0.4, fontSize: 17, bold: true, color: INK });
    T(s, "[What it does and why the user cares]", { x: 9.32, y: y + 0.6, w: 3.1, h: 0.5, fontSize: 13, color: C.text2 });
  });
  s.addNotes("PRODUCT / DEMO\n\n- Show, don't tell: real screenshots beat mockups; a short GIF or live demo beats both.\n- Call out the 'magic moment', the point where the user gets value.\n- Mention the product roadmap only briefly; you can put it in the appendix.\n- If you're pre-product, show the prototype and what you've validated with users.");
}

// ---------- 5. Why now ----------
{
  const s = content("04 · WHY NOW", "Why now: [the shift that makes this possible today]", "Opportunity", BLUE);
  const cards = [
    ["TECHNOLOGY", "[What changed in the tech]", LIME],
    ["MARKET / BEHAVIOR", "[What changed in how people buy or work]", YELLOW],
    ["REGULATION / COST", "[What changed in rules or costs]", PINK],
  ];
  cards.forEach(([lab, head, fill], i) => {
    const x = COL3[i];
    brut(s, { x, y: 2.3, w: W3, h: 4.1, fill, name: `Why now card ${i + 1}` });
    T(s, `0${i + 1}`, { x: x + 0.35, y: 2.5, w: 2, h: 0.95, fontSize: 54, fontFace: HEAD, bold: true, color: INK });
    label(s, lab, x + 0.35, 3.55, W3 - 0.7);
    T(s, head, { x: x + 0.35, y: 3.92, w: W3 - 0.7, h: 0.9, fontSize: 19, bold: true, color: INK });
    T(s, "[Why this makes your solution possible, or necessary, now and not 5 years ago]", { x: x + 0.35, y: 4.95, w: W3 - 0.7, h: 1.2, fontSize: 14, color: INK });
  });
  s.addNotes("WHY NOW (Sequoia: 'Set up the historical evolution of your category. Why hasn't this been done before?')\n\n- Investors look hard at this slide: great ideas often failed because they were too early.\n- Common 'why now' drivers: a new platform or technology (e.g., AI models, cheaper sensors), a regulatory change, a behavior shift, a collapse in cost, or a market dislocation.\n- You don't need all three cards; one compelling shift is better than three weak ones.");
}

// ---------- 6. Market ----------
{
  const s = content("05 · MARKET SIZE", "A $[X]B market, and we can win $[Y]M of it in [N] years", "Opportunity", PINK);
  const cx = 3.0;
  s.addShape(pres.shapes.OVAL, { x: cx - 2.1 + 0.1, y: 2.25 + 0.1, w: 4.2, h: 4.2, fill: { color: INK }, line: { type: "none" } });
  s.addShape(pres.shapes.OVAL, { x: cx - 2.1, y: 2.25, w: 4.2, h: 4.2, fill: { color: YELLOW }, line: { color: INK, width: 3 }, objectName: "TAM circle" });
  s.addShape(pres.shapes.OVAL, { x: cx - 1.5, y: 3.45, w: 3.0, h: 3.0, fill: { color: PINK }, line: { color: INK, width: 3 }, objectName: "SAM circle" });
  s.addShape(pres.shapes.OVAL, { x: cx - 0.9, y: 4.65, w: 1.8, h: 1.8, fill: { color: BLUE }, line: { color: INK, width: 3 }, objectName: "SOM circle" });
  T(s, "TAM", { x: cx - 1, y: 2.65, w: 2, h: 0.45, fontSize: 18, fontFace: HEAD, bold: true, color: INK, align: "center" });
  T(s, "SAM", { x: cx - 1, y: 3.85, w: 2, h: 0.45, fontSize: 18, fontFace: HEAD, bold: true, color: INK, align: "center" });
  T(s, "SOM", { x: cx - 1, y: 5.33, w: 2, h: 0.45, fontSize: 18, fontFace: HEAD, bold: true, color: WHITE, align: "center" });

  const rows = [
    ["$[X]B", "Total addressable market (TAM)", "[Everyone who could ever buy this × annual spend]", YELLOW],
    ["$[X]B", "Serviceable market (SAM)", "[The segment you can reach with today's product and channels]", PINK],
    ["$[X]M", "Obtainable in [3–5] years (SOM)", "[The realistic share you can win: the number to defend]", BLUE],
  ];
  rows.forEach(([v, l, d, f], i) => {
    const y = 2.3 + i * 1.2;
    s.addShape(pres.shapes.RECTANGLE, { x: 5.9, y: y + 0.08, w: 0.28, h: 0.28, fill: { color: f }, line: { color: INK, width: 2 } });
    T(s, v, { x: 6.35, y, w: 2.1, h: 0.6, fontSize: 28, fontFace: HEAD, bold: true, color: INK });
    T(s, l, { x: 8.55, y: y + 0.02, w: 4.05, h: 0.35, fontSize: 15, bold: true, color: INK });
    T(s, d, { x: 8.55, y: y + 0.4, w: 4.05, h: 0.65, fontSize: 13, color: C.text2 });
  });
  brut(s, { x: 5.9, y: 5.85, w: 6.7, h: 0.62, fill: INK, shadow: LIME, name: "Bottom-up math" });
  T(s, [
    { text: "BOTTOM-UP: ", options: { bold: true, color: LIME } },
    { text: "[# target customers] × $[annual contract value] = $[SAM]", options: { color: PAPER } },
  ], { x: 6.1, y: 5.85, w: 6.4, h: 0.62, fontSize: 12, fontFace: MONO, valign: "middle" });
  s.addNotes("MARKET SIZE (Sequoia: 'Identify/profile the customer you cater to')\n\n- Build the number bottom-up: (number of target customers) × (what each pays per year). Top-down figures ('1% of a $50B market') are a red flag to most VCs.\n- Venture investors generally need to see a path to a $1B+ company, so the TAM should support that.\n- Show your math, or keep it ready for the appendix; cite sources for any third-party numbers.");
}

// ---------- 7. Business model ----------
pres.addSection({ title: "Business" });
{
  const s = content("06 · BUSINESS MODEL", "We charge [customer] [$X per unit]: [pricing model in one line]", "Business", LIME);
  const tiers = [["[TIER 1]", WHITE], ["[TIER 2]", LIME], ["[TIER 3]", WHITE]];
  tiers.forEach(([name, fill], i) => {
    const x = COL3[i];
    brut(s, { x, y: 2.25, w: W3, h: 1.95, fill, name: `Pricing tier ${i + 1}` });
    label(s, name, x + 0.3, 2.45, W3 - 0.6);
    T(s, [
      { text: "$[X]", options: { fontSize: 30, fontFace: HEAD } },
      { text: "  / [user · month]", options: { fontSize: 13, fontFace: MONO } },
    ], { x: x + 0.3, y: 2.8, w: W3 - 0.6, h: 0.65, color: INK, valign: "bottom" });
    T(s, "[Who it's for and what's included]", { x: x + 0.3, y: 3.6, w: W3 - 0.6, h: 0.45, fontSize: 13, color: INK });
  });
  sticker(s, "[POPULAR]", { x: 7.25, y: 2.02, w: 1.45, h: 0.42, fill: PINK, rotate: 6, size: 11 });
  label(s, "UNIT ECONOMICS", 0.6, 4.5, 6);
  const tiles = [["$[X]", "Avg. contract value (ACV)", BLUE], ["[X]%", "Gross margin", YELLOW], ["[N] mo", "CAC payback period", PINK], ["[X]:1", "LTV : CAC", LIME]];
  tiles.forEach(([v, l, f], i) => {
    const x = COL4[i], txt = f === BLUE ? WHITE : INK;
    brut(s, { x, y: 4.88, w: W4, h: 1.55, fill: f, name: `Unit economics ${i + 1}` });
    T(s, v, { x: x + 0.28, y: 5.08, w: W4 - 0.5, h: 0.6, fontSize: 26, fontFace: HEAD, bold: true, color: txt });
    T(s, l, { x: x + 0.28, y: 5.78, w: W4 - 0.5, h: 0.5, fontSize: 13, bold: true, color: txt });
  });
  s.addNotes("BUSINESS MODEL (Sequoia: 'Revenue model, pricing, average account size, lifetime value')\n\n- Who pays, how much, how often? (subscription, usage-based, transaction fee, marketplace take rate…)\n- Swap the pricing tiers for a single price if that's simpler; delete what you don't need.\n- Unit economics: only show what you actually have. At pre-seed it's fine to show target or early numbers, labeled as such.\n- Rough benchmarks investors use for SaaS: LTV:CAC ≥ 3:1, CAC payback < 12–18 months, gross margin 70%+.");
}

// ---------- 8. Traction ----------
{
  const s = content("07 · TRACTION", "[Key metric] grew [X]× in [N] months", "Business", YELLOW);
  brut(s, { x: 0.6, y: 2.25, w: 7.6, h: 4.25, fill: WHITE, name: "Chart card" });
  s.addChart(pres.charts.BAR, [{ name: "[Metric]", labels: ["[M1]", "[M2]", "[M3]", "[M4]", "[M5]", "[M6]"], values: [10, 14, 19, 26, 34, 45] }], {
    x: 0.8, y: 2.4, w: 7.2, h: 3.95, barDir: "col", barGapWidthPct: 45,
    chartColors: [H.accent1], dataBorder: { pt: 2, color: "000000" }, showLegend: false,
    showTitle: true, title: "[Revenue / users] by month (sample data: replace)", titleFontSize: 13, titleColor: H.dk1, titleFontFace: "+mn-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 13, dataLabelFontBold: true, dataLabelColor: H.dk1, dataLabelFontFace: "+mn-lt",
    catAxisLabelColor: H.dk1, catAxisLabelFontSize: 12, catAxisLabelFontFace: "+mn-lt", catAxisLineShow: true, catAxisLineColor: "000000", catAxisLineSize: 2,
    valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" },
  });
  sticker(s, "UP & TO THE RIGHT ↗", { x: 5.6, y: 1.98, w: 2.75, h: 0.46, fill: LIME, rotate: 4, size: 12 });
  const tiles = [["$[X]", "Monthly recurring revenue", BLUE], ["[X]%", "Month-over-month growth", PINK], ["[X]%", "Net revenue retention", LIME]];
  tiles.forEach(([v, l, f], i) => {
    const y = 2.25 + i * 1.47, txt = f === BLUE ? WHITE : INK;
    brut(s, { x: 8.6, y, w: 4.0, h: 1.2, fill: f, name: `Traction stat ${i + 1}` });
    T(s, v, { x: 8.9, y: y + 0.15, w: 3.5, h: 0.55, fontSize: 28, fontFace: HEAD, bold: true, color: txt });
    T(s, l, { x: 8.9, y: y + 0.75, w: 3.5, h: 0.32, fontSize: 13, bold: true, color: txt });
  });
  s.addNotes("TRACTION (YC: 'This is often the most important slide')\n\n- Put your single best number in the headline and make it big.\n- Show growth over time, not a snapshot: a chart going up and to the right is the point of this slide.\n- The chart uses SAMPLE data. Right-click it → Edit Data to enter your real numbers.\n- Pick metrics that fit your stage: revenue/MRR, active users, retention, paid pilots, LOIs, waitlist, notable customer logos.\n- If traction is your strongest card, move this slide up to right after the Solution.");
}

// ---------- 9. Competition ----------
{
  const s = content("08 · COMPETITION", "[Company] is the only [category] that [key differentiator]", "Business", PINK);
  label(s, "↑ [Y axis: e.g., Depth / power]", 0.6, 2.2, 6, C.text2);
  brut(s, { x: 0.6, y: 2.55, w: 6.3, h: 3.6, fill: WHITE, name: "Matrix" });
  s.addShape(pres.shapes.LINE, { x: 3.75, y: 2.55, w: 0, h: 3.6, line: { color: INK, width: 2.25 } });
  s.addShape(pres.shapes.LINE, { x: 0.6, y: 4.35, w: 6.3, h: 0, line: { color: INK, width: 2.25 } });
  T(s, "[X axis: e.g., Ease of use] →", { x: 0.6, y: 6.28, w: 6.3, h: 0.3, fontSize: 11, fontFace: MONO, bold: true, color: C.text2, align: "right" });
  // You
  disc(s, 6.05, 2.8, 0.55, PINK);
  sticker(s, "[Your company]", { x: 4.05, y: 2.85, w: 1.85, h: 0.42, fill: INK, color: PAPER, rotate: -3, size: 12 });
  // Competitors
  [[1.0, 3.0, "[Competitor A]"], [4.2, 4.85, "[Competitor B]"], [1.0, 5.3, "[Competitor C]"]].forEach(([x, y, n]) => {
    disc(s, x, y, 0.36, PAPER);
    T(s, n, { x: x + 0.5, y, w: 1.9, h: 0.36, fontSize: 13, color: INK, valign: "middle" });
  });
  label(s, "WHY WE WIN", 7.5, 2.2, 5);
  const fills = [LIME, YELLOW, BLUE];
  [1, 2, 3].forEach((n, i) => {
    const y = 2.6 + i * 1.3;
    brut(s, { x: 7.5, y, w: 5.1, h: 1.05, fill: WHITE, name: `Advantage ${n}` });
    chip(s, 7.7, y + 0.25, 0.55, String(n), fills[i], i === 2 ? WHITE : INK, 14);
    T(s, `[Unfair advantage ${n}]`, { x: 8.45, y: y + 0.13, w: 4.0, h: 0.35, fontSize: 15, bold: true, color: INK });
    T(s, "[e.g., proprietary data, network effects, distribution, deep tech]", { x: 8.45, y: y + 0.48, w: 4.0, h: 0.5, fontSize: 12, color: C.text2 });
  });
  s.addNotes("COMPETITION (Sequoia: 'List competitors; list your plan to win')\n\n- Never say 'we have no competitors'. It signals naïveté or no market. Include the status quo (spreadsheets, doing nothing) and big incumbents.\n- Pick 2×2 axes that genuinely matter to customers and honestly put you in the top-right. If the axes feel contrived, use a comparison table instead.\n- The 'why we win' column matters more than the chart: what's defensible and gets stronger over time?");
}

// ---------- 10. Go-to-market ----------
{
  const s = content("09 · GO-TO-MARKET", "How we reach customers: [primary channel]", "Business", BLUE);
  const steps = [["STEP 1 · LAND", "[e.g., Founder-led sales to 10 design partners]", LIME], ["STEP 2 · EXPAND", "[e.g., Referrals and upsell within accounts]", YELLOW], ["STEP 3 · SCALE", "[e.g., Inside sales team + partner channel]", PINK]];
  const SW = 3.5, SX = [0.6, 4.85, 9.1];
  steps.forEach(([lab, head, f], i) => {
    const x = SX[i];
    brut(s, { x, y: 2.25, w: SW, h: 2.45, fill: f, name: `GTM step ${i + 1}` });
    label(s, lab, x + 0.3, 2.45, SW - 0.6);
    T(s, head, { x: x + 0.3, y: 2.85, w: SW - 0.6, h: 0.95, fontSize: 17, bold: true, color: INK });
    T(s, "[Timing, target, and what success looks like]", { x: x + 0.3, y: 3.85, w: SW - 0.6, h: 0.7, fontSize: 13, color: INK });
    if (i < 2) {
      const ax = x + SW + 0.17;
      s.addShape(pres.shapes.RIGHT_ARROW, { x: ax, y: 3.2, w: 0.55, h: 0.55, fill: { color: INK }, line: { type: "none" } });
    }
  });
  const cards = [["Ideal customer", "[Industry, company size, buyer title]"], ["Sales motion", "[Self-serve · Product-led · Sales-led]"], ["Proof it works", "[CAC by channel, conversion rate, pipeline]"]];
  cards.forEach(([h, d], i) => {
    const x = SX[i];
    brut(s, { x, y: 5.05, w: SW, h: 1.38, fill: WHITE, name: `GTM card ${i + 1}` });
    label(s, h.toUpperCase(), x + 0.3, 5.25, SW - 0.6);
    T(s, d, { x: x + 0.3, y: 5.6, w: SW - 0.6, h: 0.65, fontSize: 14, color: INK });
  });
  s.addNotes("GO-TO-MARKET\n\n- How do you find, win, and keep customers, and how does that scale?\n- Be specific about the first channel that works; 'viral growth' or 'partnerships' with no evidence won't land.\n- If you have data (CAC by channel, conversion rates, sales cycle length, pipeline), it belongs here.");
}

// ---------- 11. Team ----------
pres.addSection({ title: "Team & Financials" });
{
  const s = content("10 · TEAM", "Why us: [the unfair advantage this team brings]", "Team & Financials", YELLOW);
  const photo = [LIME, YELLOW, PINK, BLUE];
  [1, 2, 3, 4].forEach((n, i) => {
    const x = COL4[i];
    brut(s, { x, y: 2.25, w: W4, h: 3.7, fill: WHITE, name: `Team card ${n}` });
    disc(s, x + 0.28, 2.5, 1.25, photo[i], "[Photo]", i === 3 ? WHITE : INK, 11);
    T(s, "[Name]", { x: x + 0.28, y: 3.9, w: W4 - 0.5, h: 0.42, fontSize: 18, fontFace: HEAD, bold: true, color: INK });
    T(s, "[Role]", { x: x + 0.28, y: 4.32, w: W4 - 0.5, h: 0.32, fontSize: 12, fontFace: MONO, bold: true, color: BLUE });
    T(s, "[Prior company, exit, or domain expertise: why you're the one to build this]", { x: x + 0.28, y: 4.75, w: W4 - 0.5, h: 1.05, fontSize: 13, color: C.text2 });
  });
  brut(s, { x: 0.6, y: 6.15, w: 12.03, h: 0.5, fill: INK, shadow: PINK, name: "Advisors bar" });
  T(s, [
    { text: "ADVISORS & INVESTORS: ", options: { bold: true, color: LIME, fontFace: MONO } },
    { text: "[Name (credential)]  ·  [Name (credential)]  ·  [Name (credential)]", options: { color: PAPER } },
  ], { x: 0.85, y: 6.15, w: 11.6, h: 0.5, fontSize: 13, valign: "middle" });
  s.addNotes("TEAM (Sequoia: 'Founders, management, board of directors/advisors')\n\n- At early stages, investors are betting on the team more than anything else.\n- For each person, give the one credential that makes them uniquely suited to THIS problem (domain expertise, prior startup or exit, technical depth), not a full CV.\n- Show how long the founders have worked together and that you're full-time.\n- Delete or add cards to match your team; notable advisors and angels go in the bottom line.");
}

// ---------- 12. Financials ----------
{
  const s = content("11 · FINANCIALS", "Path to $[X]M revenue by [year]", "Team & Financials", LIME);
  const hdr = (t) => ({ text: t, options: { bold: true, color: LIME, fill: { color: INK }, align: t ? "center" : "left", fontFace: MONO } });
  const years = ["[Year 1]", "[Year 2]", "[Year 3]", "[Year 4]", "[Year 5]"];
  const rowsDef = [["Revenue", "$[ ]"], ["Gross margin", "[ ]%"], ["Operating expenses", "$[ ]"], ["Net burn / EBITDA", "$[ ]"], ["Ending cash", "$[ ]"], ["Headcount", "[ ]"]];
  const rows = [[hdr(""), ...years.map(hdr)]];
  rowsDef.forEach(([lab, v], r) => {
    const fill = { color: r % 2 ? PAPER : WHITE };
    rows.push([{ text: lab, options: { bold: true, color: INK, fill } }, ...years.map(() => ({ text: v, options: { color: C.text2, align: "center", fill } }))]);
  });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.6 + SH, y: 2.25 + SH, w: 12.0, h: 2.94, fill: { color: INK }, line: { type: "none" } });
  s.addTable(rows, { x: 0.6, y: 2.25, w: 12.0, colW: [3.0, 1.8, 1.8, 1.8, 1.8, 1.8], rowH: 0.42, fontSize: 14, valign: "middle", border: { type: "solid", pt: 1.5, color: "000000" }, margin: [0, 0.12, 0, 0.12] });
  brut(s, { x: 0.6, y: 5.45, w: 12.0, h: 1.12, fill: YELLOW, name: "Assumptions card" });
  label(s, "KEY ASSUMPTIONS", 0.9, 5.57, 6);
  T(s, [
    { text: "[Growth rate and what drives it]", options: { bullet: true, breakLine: true } },
    { text: "[Pricing, churn, and sales capacity assumptions]", options: { bullet: true, breakLine: true } },
    { text: "[When you reach breakeven, or what the next round funds]", options: { bullet: true } },
  ], { x: 0.9, y: 5.85, w: 11.4, h: 0.68, fontSize: 13, color: INK });
  s.addNotes("FINANCIALS\n\n- Keep it high level: 3–5 years of revenue, burn, and headcount. Detailed models go in the appendix or data room.\n- Investors know projections are guesses; they're judging whether your assumptions are reasonable and whether you understand your business's drivers.\n- Pre-revenue? Show the plan for the next 18–24 months and the milestones that unlock the next round instead.\n- Rename the year columns (e.g., 2027, 2028…) and delete rows you don't need.");
}

// ---------- 13. The ask ----------
{
  const s = content("12 · THE ASK", "We're raising $[X]M to reach [milestone] in [N] months", "Team & Financials", PINK);
  brut(s, { x: 0.6, y: 2.25, w: 4.5, h: 4.25, fill: BLUE, name: "Raise card" });
  label(s, "RAISING", 0.95, 2.5, 3.8, WHITE);
  T(s, "$[X]M", { x: 0.95, y: 2.85, w: 4.0, h: 1.15, fontSize: 60, fontFace: HEAD, bold: true, color: WHITE });
  T(s, [
    { text: "[SAFE / priced round]", options: { breakLine: true } },
    { text: "[Pre-seed / Seed / Series A]", options: { breakLine: true } },
    { text: "[$X committed · Lead: (name)]" },
  ], { x: 0.95, y: 4.3, w: 3.9, h: 1.9, fontSize: 16, bold: true, color: WHITE, paraSpaceAfter: 8 });
  sticker(s, "LET'S GO", { x: 3.75, y: 2.0, w: 1.5, h: 0.46, fill: LIME, rotate: 7, size: 13 });

  brut(s, { x: 5.5, y: 2.25, w: 7.1, h: 2.55, fill: WHITE, name: "Use of funds card" });
  s.addChart(pres.charts.DOUGHNUT, [{ name: "Use of funds", labels: ["Product & engineering", "Sales & marketing", "Operations & G&A", "[Other]"], values: [25, 25, 25, 25] }], {
    x: 5.65, y: 2.33, w: 6.8, h: 2.4, holeSize: 50,
    chartColors: [H.accent1, H.accent2, H.accent3, H.accent4], dataBorder: { pt: 2, color: "000000" },
    showTitle: true, title: "Use of funds (placeholder split: replace)", titleFontSize: 12, titleColor: H.dk1, titleFontFace: "+mn-lt",
    showLegend: true, legendPos: "r", legendFontSize: 12, legendColor: H.dk1, legendFontFace: "+mn-lt",
    showPercent: true, showValue: false, dataLabelColor: H.dk1, dataLabelFontSize: 11, dataLabelFontBold: true, dataLabelFontFace: "+mn-lt",
  });
  const ms = [["MILESTONE 1", "[e.g., $1M ARR]", "[by month N]", LIME], ["MILESTONE 2", "[e.g., 50 logos]", "[by month N]", YELLOW], ["RUNWAY", "[N] months", "[to Series X metrics]", PINK]];
  const mw = (7.1 - 0.5) / 3;
  ms.forEach(([l, h, d, f], i) => {
    const x = 5.5 + i * (mw + 0.25);
    brut(s, { x, y: 5.1, w: mw, h: 1.4, fill: f, name: `Milestone ${i + 1}` });
    label(s, l, x + 0.22, 5.25, mw - 0.4);
    T(s, h, { x: x + 0.22, y: 5.58, w: mw - 0.4, h: 0.42, fontSize: 15, bold: true, color: INK });
    T(s, d, { x: x + 0.22, y: 6.02, w: mw - 0.4, h: 0.32, fontSize: 12, color: INK });
  });
  s.addNotes("THE ASK / USE OF FUNDS\n\n- State the amount, instrument (SAFE or priced round), and anything already committed or a lead investor.\n- Tie the money to milestones: 'this round gets us to X, which sets us up for the next round'. Investors fund milestones, not runway.\n- 18–24 months of runway is a typical target.\n- The doughnut uses a placeholder 25/25/25/25 split. Right-click → Edit Data to change it.");
}

// ---------- 14. Vision / close ----------
pres.addSection({ title: "Close" });
{
  const s = pres.addSlide({ masterName: "STATEMENT_INK", sectionTitle: "Close" });
  s.addShape(pres.shapes.STAR_5_POINT, { x: 10.7, y: 0.8, w: 1.9, h: 1.9, fill: { color: LIME }, line: { color: PAPER, width: 3 }, rotate: 12, objectName: "Lime star" });
  s.addShape(pres.shapes.OVAL, { x: 11.0, y: 4.7, w: 1.6, h: 1.6, fill: { color: PINK }, line: { color: PAPER, width: 3 }, objectName: "Pink disc" });
  s.addShape(pres.shapes.RECTANGLE, { x: 11.4, y: 3.15, w: 0.9, h: 0.9, fill: { color: YELLOW }, line: { color: PAPER, width: 3 }, rotate: -14, objectName: "Yellow block" });
  s.addText("[Your vision in one bold sentence: what the world looks like if you win]", { placeholder: "title" });
  s.addText("[Founder name]  ·  [email@company.com]  ·  [phone]  ·  [company.com]", { placeholder: "sub" });
  s.addNotes("VISION / CLOSE\n\n- End on the big picture: if everything works, what does this company become in 10 years?\n- Leave contact details on screen during Q&A.\n- Optionally restate the ask in one line.");
}

// ---------- 15. Appendix ----------
{
  const s = pres.addSlide({ masterName: "STATEMENT_INK", sectionTitle: "Close" });
  s.addShape(pres.shapes.RECTANGLE, { x: 10.6, y: 1.0, w: 2.0, h: 2.0, fill: { color: BLUE }, line: { color: PAPER, width: 3 }, rotate: 8, objectName: "Blue block" });
  T(s, "+", { x: 10.6, y: 1.0, w: 2.0, h: 2.0, fontSize: 96, fontFace: HEAD, bold: true, color: WHITE, align: "center", valign: "middle", rotate: 8 });
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
