"""Procedural art for the Daybreak deck: aurora washes, value curve, constellation, aurora cards."""
import os, sys, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "art")
os.makedirs(OUT, exist_ok=True)

def hx(h):
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32)

BG = hx("F8FAFF"); WHITE = hx("FFFFFF")
LILAC = hx("C9B8FF"); SKY = hx("9FD3FF"); MINT = hx("A6F0DC"); PEACH = hx("FFD2BD")
VIOLET = hx("5B4BFF"); SKYD = hx("3BA7FF"); MINTD = hx("2FCFA4")

def field(w, h, base, blobs, seed=0):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    xx /= w; yy /= h
    aspect = w / h
    img = np.empty((h, w, 3), np.float32); img[:] = base
    for (cx, cy, r, col, a) in blobs:
        d2 = ((xx - cx) * aspect) ** 2 + (yy - cy) ** 2
        wgt = a * np.exp(-d2 / (2 * (r ** 2)))
        img = img * (1 - wgt[..., None]) + col * wgt[..., None]
    rng = np.random.default_rng(seed)
    img += rng.normal(0, 1.2, img.shape)  # dither: no banding
    return np.clip(img, 0, 255)

def to_img(arr):
    return Image.fromarray(arr.astype(np.uint8), "RGB").convert("RGBA")

def constellation(size, region, n, seed, alpha=60, link=0.11, ss=2):
    w, h = size
    lay = Image.new("RGBA", (w * ss, h * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    rnd = random.Random(seed)
    x0, y0, x1, y1 = region
    pts = [(rnd.uniform(x0, x1) * w * ss, rnd.uniform(y0, y1) * h * ss) for _ in range(n)]
    lim = link * w * ss
    for i, p in enumerate(pts):
        for q in pts[i + 1:]:
            dist = ((p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2) ** 0.5
            if dist < lim:
                a = int(alpha * 0.55 * (1 - dist / lim))
                d.line([p, q], fill=(91, 75, 255, a), width=ss)
    for p in pts:
        r = rnd.uniform(1.5, 3.5) * ss
        d.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=(91, 75, 255, alpha))
    return lay.resize((w, h), Image.LANCZOS)

def lerp_col(t):
    stops = [(0.0, VIOLET), (0.55, SKYD), (1.0, MINTD)]
    for (t0, c0), (t1, c1) in zip(stops, stops[1:]):
        if t <= t1:
            u = (t - t0) / (t1 - t0)
            return tuple(int(v) for v in c0 * (1 - u) + c1 * u)
    return tuple(int(v) for v in stops[-1][1])

def value_curve(size, p0, p1, power, width, nodes, ss=2):
    w, h = size
    W, H = w * ss, h * ss
    pts = []
    for i in range(401):
        t = i / 400
        x = (p0[0] + (p1[0] - p0[0]) * t) * W
        y = (p0[1] + (p1[1] - p0[1]) * (t ** power)) * H
        pts.append((x, y, t))
    glow = Image.new("RGBA", (W, H), tuple(int(v) for v in SKYD) + (0,)); g = ImageDraw.Draw(glow)
    line = Image.new("RGBA", (W, H), (0, 0, 0, 0)); l = ImageDraw.Draw(line)
    for (xa, ya, ta), (xb, yb, _) in zip(pts, pts[1:]):
        c = lerp_col(ta)
        g.line([(xa, ya), (xb, yb)], fill=c + (110,), width=width * ss * 6)
        l.line([(xa, ya), (xb, yb)], fill=c + (255,), width=width * ss)
    glow = glow.filter(ImageFilter.GaussianBlur(width * ss * 5))
    for t in nodes:
        x, y, _ = pts[int(t * 400)]
        c = lerp_col(t)
        R = width * ss * 9
        halo = Image.new("RGBA", (W, H), c + (0,))
        ImageDraw.Draw(halo).ellipse([x - R, y - R, x + R, y + R], fill=c + (150,))
        glow = Image.alpha_composite(glow, halo.filter(ImageFilter.GaussianBlur(R * 0.6)))
        r1, r2 = width * ss * 2.6, width * ss * 1.4
        l.ellipse([x - r1, y - r1, x + r1, y + r1], fill=c + (255,))
        l.ellipse([x - r2, y - r2, x + r2, y + r2], fill=(255, 255, 255, 255))
    out = Image.alpha_composite(glow, line)
    return out.resize((w, h), Image.LANCZOS)

def save_jpg(img, name):
    img.convert("RGB").save(os.path.join(OUT, name), quality=88, optimize=True)

SW, SH = 2000, 1125  # slide at 150 dpi

# Title: aurora on the right, rising value curve, constellation
t = to_img(field(SW, SH, BG, [
    (0.80, 0.22, 0.24, LILAC, 0.95), (1.00, 0.62, 0.22, SKY, 0.9), (0.66, 0.92, 0.20, MINT, 0.85),
    (0.40, 1.08, 0.16, PEACH, 0.6), (0.05, -0.10, 0.18, LILAC, 0.35)], seed=1))
t = Image.alpha_composite(t, constellation((SW, SH), (0.55, 0.05, 0.98, 0.65), 46, seed=7, alpha=70))
t = Image.alpha_composite(t, value_curve((SW, SH), (0.40, 0.97), (0.985, 0.14), 2.3, 3, [0.45, 0.72, 0.9, 1.0]))
save_jpg(t, "bg_title.jpg")

# Content: white page, faint aurora corner top-right, faint mint bottom-left
c = to_img(field(SW, SH, hx("FBFCFF"), [
    (1.02, -0.08, 0.15, LILAC, 0.85), (0.92, -0.12, 0.11, SKY, 0.65), (-0.04, 1.10, 0.13, MINT, 0.45)], seed=2))
c = Image.alpha_composite(c, constellation((SW, SH), (0.80, 0.02, 0.99, 0.20), 14, seed=3, alpha=45, link=0.08))
save_jpg(c, "bg_content.jpg")

# Statement: fuller aurora, gentle rising curve along the bottom
s = to_img(field(SW, SH, BG, [
    (0.15, 0.10, 0.25, LILAC, 0.8), (0.85, 0.15, 0.25, SKY, 0.75), (0.95, 0.95, 0.22, MINT, 0.8),
    (0.35, 1.05, 0.2, PEACH, 0.65), (0.55, 0.45, 0.30, hx("E6E0FF"), 0.5)], seed=4))
s = Image.alpha_composite(s, constellation((SW, SH), (0.05, 0.80, 0.95, 0.98), 40, seed=11, alpha=55))
s = Image.alpha_composite(s, value_curve((SW, SH), (-0.01, 0.985), (1.01, 0.80), 1.8, 3, [0.55, 0.8]))
save_jpg(s, "bg_statement.jpg")

# Aurora cards (rounded, transparent corners), sized in inches at 160 dpi
def card(name, w_in, h_in, seed, radius_in=0.18, dpi=110):
    w, h = int(w_in * dpi), int(h_in * dpi)
    rnd = random.Random(seed)
    blobs = [(rnd.uniform(0.0, 0.3), rnd.uniform(0.0, 0.4), 0.45, LILAC, 0.95),
             (rnd.uniform(0.7, 1.0), rnd.uniform(0.0, 0.5), 0.40, SKY, 0.9),
             (rnd.uniform(0.6, 1.0), rnd.uniform(0.7, 1.1), 0.38, MINT, 0.85),
             (rnd.uniform(0.0, 0.4), rnd.uniform(0.8, 1.1), 0.30, PEACH, 0.7)]
    img = to_img(field(w, h, hx("EEEAFF"), blobs, seed=seed))
    ss = 4
    m = Image.new("L", (w * ss, h * ss), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, w * ss - 1, h * ss - 1], radius=int(radius_in * dpi * ss), fill=255)
    img.putalpha(m.resize((w, h), Image.LANCZOS))
    img.save(os.path.join(OUT, name), optimize=True)

card("card_problem.png", 4.63, 4.4, 21)
card("card_solution.png", 5.43, 3.4, 22)
card("card_tier.png", 3.85, 2.1, 23)
card("card_mrr.png", 4.13, 1.4, 24)
card("card_raise.png", 4.6, 4.6, 25)

# Soft glow (transparent) for the "you" marker and similar
G = 400
yy, xx = np.mgrid[0:G, 0:G].astype(np.float32) / G - 0.5
d2 = xx ** 2 + yy ** 2
a = np.clip(np.exp(-d2 / (2 * 0.13 ** 2)) * 200, 0, 255)
rgb = np.zeros((G, G, 3), np.float32); rgb[:] = VIOLET * 0.5 + SKYD * 0.5
glow = Image.fromarray(np.dstack([rgb, a]).astype(np.uint8), "RGBA")
glow.save(os.path.join(OUT, "glow.png"), optimize=True)

# Eyebrow orb: tiny gradient sphere
O = 128
yy, xx = np.mgrid[0:O, 0:O].astype(np.float32) / O
t = np.clip((xx + yy) / 2, 0, 1)[..., None]
rgb = VIOLET * (1 - t) + SKYD * t
ss = 4
m = Image.new("L", (O * ss, O * ss), 0)
ImageDraw.Draw(m).ellipse([0, 0, O * ss - 1, O * ss - 1], fill=255)
orb = Image.fromarray(rgb.astype(np.uint8), "RGB").convert("RGBA")
orb.putalpha(m.resize((O, O), Image.LANCZOS))
orb.save(os.path.join(OUT, "orb.png"), optimize=True)

print("art ok")
