"""Procedural art for Daybreak Silk: warm aurora washes, draped silk ribbons, fine grain."""
import os
import numpy as np
from PIL import Image, ImageDraw

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "art")
os.makedirs(OUT, exist_ok=True)

def hx(h):
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32)

PEARL = hx("FAF6F4"); PAGE = hx("FCFAF9")
BLUSH = hx("F6C3D2"); APRICOT = hx("FFCFAE"); ORCHID = hx("D8B4F4"); LAVENDER = hx("C8BEFF"); MIST = hx("C9DDFF")
ROSE = hx("E58CA8"); VIOLET = hx("8A55F0"); PEACH = hx("F7A982")

def aurora(w, h, base, blobs):
    """Soft colour washes: (cx, cy, radius, colour, strength) in 0..1 slide units."""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    xx /= w; yy /= h
    img = np.empty((h, w, 3), np.float32); img[:] = base
    for cx, cy, r, col, a in blobs:
        d2 = ((xx - cx) * (w / h)) ** 2 + (yy - cy) ** 2
        k = a * np.exp(-d2 / (2 * r * r))
        img = img * (1 - k[..., None]) + col * k[..., None]
    return img

def ribbon(img, base_y, amp, freq, phase, rise, power, thick, cols, alpha, sheen=0.45, x0=0.0, x1=1.0, fade=0.25):
    """Paint one draped silk ribbon across img (float HxWx3, modified in place).

    The centre line wanders on two sine waves and rises with u**power (value creation).
    Width breathes along the length; folds tint toward violet (not grey) and a soft
    highlight rides one edge. The ribbon fades in from x0 and runs past the right edge.
    """
    h, w, _ = img.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    x = xx / w; y = yy / h
    u = (x - x0) / (x1 - x0)
    uc = np.clip(u, 0, 1)
    yc = base_y + amp * np.sin(freq * 2 * np.pi * uc + phase) + 0.35 * amp * np.sin(2.3 * freq * 2 * np.pi * uc + 1.7 * phase) - rise * uc ** power
    t = thick * (0.55 + 0.45 * np.sin(1.3 * np.pi * uc + phase * 0.6) ** 2)
    d = (y - yc) / t
    body = np.exp(-(d ** 2) * 1.3)
    f = np.cos(d * np.pi * 1.1 + 3.0 * uc + phase)          # fold: -1 shadow .. +1 light
    hi = np.exp(-((d + 0.35) / 0.22) ** 2) * sheen
    stops = np.linspace(0, 1, len(cols))
    col = np.zeros((h, w, 3), np.float32)
    for i in range(3):
        col[..., i] = np.interp(uc, stops, [c[i] for c in cols])
    shadow = np.clip(-f, 0, 1)[..., None] * 0.22
    light = np.clip(f, 0, 1)[..., None] * 0.10
    col = col * (1 - shadow) + VIOLET * shadow * 0.9
    col = col * (1 - light) + 255 * light
    col = col * (1 - hi[..., None]) + 255 * hi[..., None]
    e = np.clip(u / fade, 0, 1); env = e * e * (3 - 2 * e)
    a = (alpha * body * env)[..., None]
    img[:] = img * (1 - a) + col * a

def grain(img, sigma=2.6, seed=0):
    rng = np.random.default_rng(seed)
    n = rng.normal(0, sigma, img.shape[:2]).astype(np.float32)
    return np.clip(img + n[..., None], 0, 255)

def save_jpg(arr, name, q=90):
    Image.fromarray(arr.astype(np.uint8), "RGB").save(os.path.join(OUT, name), quality=q, optimize=True)

SW, SH = 2000, 1125  # slide at 150 dpi

# Title: warm aurora on the right, three silk ribbons rising lower-left -> upper-right
t = aurora(SW, SH, PEARL, [
    (0.82, 0.20, 0.26, BLUSH, 0.85), (1.00, 0.70, 0.24, LAVENDER, 0.8), (0.62, 1.00, 0.22, APRICOT, 0.8),
    (0.30, 1.10, 0.18, BLUSH, 0.45), (0.05, -0.10, 0.20, MIST, 0.25)])
ribbon(t, 1.05, 0.040, 0.8, 0.4, 0.80, 1.6, 0.150, [LAVENDER, ORCHID, BLUSH, APRICOT], 0.70, x0=0.30, x1=1.0)
ribbon(t, 1.12, 0.050, 0.7, 2.2, 0.72, 1.9, 0.200, [ORCHID, ROSE, PEACH], 0.50, x0=0.40, x1=1.0)
ribbon(t, 1.00, 0.030, 1.0, 4.0, 0.90, 1.4, 0.070, [VIOLET, ROSE, APRICOT], 0.45, sheen=0.6, x0=0.26, x1=1.0)
save_jpg(grain(t, seed=1), "bg_title.jpg")

# Content: pearl page, a small silk wisp top-right, a blush breath bottom-left
c = aurora(SW, SH, PAGE, [(1.02, -0.06, 0.13, BLUSH, 0.7), (0.92, -0.10, 0.10, LAVENDER, 0.5), (-0.04, 1.08, 0.13, APRICOT, 0.4)])
ribbon(c, 0.15, 0.012, 0.8, 1.0, 0.18, 1.3, 0.050, [LAVENDER, BLUSH, APRICOT], 0.40, x0=0.78, x1=1.0, fade=0.45)
save_jpg(grain(c, sigma=2.0, seed=2), "bg_content.jpg")

# Statement: rich full wash, ribbons flowing along the lower third
s = aurora(SW, SH, PEARL, [
    (0.12, 0.08, 0.26, LAVENDER, 0.7), (0.88, 0.12, 0.26, BLUSH, 0.75), (0.95, 0.95, 0.22, APRICOT, 0.8),
    (0.35, 1.05, 0.20, BLUSH, 0.6), (0.55, 0.45, 0.30, hx("F1E6F6"), 0.5)])
ribbon(s, 1.02, 0.035, 0.8, 0.9, 0.22, 1.3, 0.150, [LAVENDER, ORCHID, BLUSH, APRICOT], 0.65, x0=-0.1, x1=1.0)
ribbon(s, 1.08, 0.040, 0.6, 2.8, 0.28, 1.6, 0.090, [ORCHID, ROSE, PEACH], 0.50, sheen=0.6, x0=-0.1, x1=1.0)
save_jpg(grain(s, seed=4), "bg_statement.jpg")

# Silk cards: warm wash + one ribbon + grain, soft rounded corners
def card(name, w_in, h_in, seed, radius_in=0.30, dpi=110):
    w, h = int(w_in * dpi), int(h_in * dpi)
    rng = np.random.default_rng(seed)
    img = aurora(w, h, hx("F6ECF4"), [
        (rng.uniform(0.0, 0.3), rng.uniform(0.0, 0.4), 0.45, LAVENDER, 0.9),
        (rng.uniform(0.7, 1.0), rng.uniform(0.0, 0.5), 0.40, BLUSH, 0.9),
        (rng.uniform(0.6, 1.0), rng.uniform(0.7, 1.1), 0.38, APRICOT, 0.85)])
    ribbon(img, rng.uniform(0.85, 1.0), 0.04, 0.7, rng.uniform(0, 6), 0.35, 1.5, 0.30, [ORCHID, BLUSH, APRICOT], 0.40, sheen=0.4, x0=-0.1)
    img = grain(img, sigma=2.4, seed=seed)
    rgba = Image.fromarray(img.astype(np.uint8), "RGB").convert("RGBA")
    ss = 4
    m = Image.new("L", (w * ss, h * ss), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, w * ss - 1, h * ss - 1], radius=int(radius_in * dpi * ss), fill=255)
    rgba.putalpha(m.resize((w, h), Image.LANCZOS))
    rgba.save(os.path.join(OUT, name), optimize=True)

card("card_problem.png", 4.63, 4.4, 21)
card("card_solution.png", 5.43, 3.35, 22)
card("card_tier.png", 3.85, 2.1, 23)
card("card_mrr.png", 4.13, 1.4, 24)
card("card_raise.png", 4.6, 4.6, 25)

# Soft rose-orchid glow (transparent)
G = 400
yy, xx = np.mgrid[0:G, 0:G].astype(np.float32) / G - 0.5
a = np.clip(np.exp(-(xx ** 2 + yy ** 2) / (2 * 0.13 ** 2)) * 190, 0, 255)
rgb = np.zeros((G, G, 3), np.float32); rgb[:] = ROSE * 0.55 + VIOLET * 0.45
Image.fromarray(np.dstack([rgb, a]).astype(np.uint8), "RGBA").save(os.path.join(OUT, "glow.png"), optimize=True)

# Pearl orb: a shaded sphere (orchid -> rose) with a soft highlight
def orb(name, size, c0, c1):
    yy, xx = np.mgrid[0:size, 0:size].astype(np.float32) / size - 0.5
    r = np.sqrt(xx ** 2 + yy ** 2) / 0.5
    tt = np.clip((xx + yy + 1) / 2, 0, 1)[..., None]
    col = c0 * (1 - tt) + c1 * tt
    shade = (0.82 + 0.18 * np.sqrt(np.clip(1 - r ** 2, 0, 1)))[..., None]
    hl = np.exp(-(((xx + 0.17) ** 2 + (yy + 0.2) ** 2) / 0.012))[..., None] * 0.75
    col = np.clip(col * shade * (1 - hl) + 255 * hl, 0, 255)
    ss = 4
    m = Image.new("L", (size * ss, size * ss), 0)
    ImageDraw.Draw(m).ellipse([0, 0, size * ss - 1, size * ss - 1], fill=255)
    im = Image.fromarray(col.astype(np.uint8), "RGB").convert("RGBA")
    im.putalpha(m.resize((size, size), Image.LANCZOS))
    im.save(os.path.join(OUT, name), optimize=True)

orb("orb.png", 160, VIOLET, ROSE)
orb("orb_soft.png", 220, LAVENDER, BLUSH)   # number markers

print("art ok")
