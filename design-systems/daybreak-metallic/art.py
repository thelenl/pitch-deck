"""Procedural art for Daybreak Metallic: liquid-metal silk (rose gold, lilac chrome, champagne),
dark metallic panels and cards, chrome spheres and rings, fine grain."""
import os
import numpy as np
from PIL import Image, ImageDraw

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "art")
os.makedirs(OUT, exist_ok=True)
DPI = 150
SW, SH = 2000, 1125          # 13.333 x 7.5 in at 150 dpi
PANEL_IN = 4.9               # split-layout panel width (inches); keep in sync with build.js

def hx(h):
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32)

PAGE = hx("F7F1F0")          # porcelain blush page
PLUM = hx("1E1226")          # dark panel base
BLUSH = hx("F2C6CF"); APRICOT = hx("F8CDB2"); LAVENDER = hx("CFC3F5"); ORCHID = hx("7B3FE4")

# Metal ramps: shadow -> mid -> light -> specular -> rim. Indexed by the fold value.
ROSE_GOLD = [hx(c) for c in ("2E1824", "7A4A55", "C08878", "E9C0A8", "FFF4EC", "D8A898")]
LILAC_CHROME = [hx(c) for c in ("221A38", "6B5A92", "A895D0", "DCD0F2", "FFFFFF", "B7A6E0")]
CHAMPAGNE = [hx(c) for c in ("33251F", "8A6E5A", "CFB49A", "F3E3D0", "FFFBF5", "D9C2A8")]

def ramp(stops, f):
    xs = np.linspace(0, 1, len(stops))
    out = np.zeros(f.shape + (3,), np.float32)
    for i in range(3):
        out[..., i] = np.interp(f, xs, [s[i] for s in stops])
    return out

def aurora(w, h, base, blobs):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    xx /= w; yy /= h
    img = np.empty((h, w, 3), np.float32); img[:] = base
    for cx, cy, r, col, a in blobs:
        d2 = ((xx - cx) * (w / h)) ** 2 + (yy - cy) ** 2
        k = a * np.exp(-d2 / (2 * r * r))
        img = img * (1 - k[..., None]) + col * k[..., None]
    return img

def metal_ribbon(img, base_y, amp, freq, phase, rise, power, thick, ramps, alpha=1.0, x0=0.0, x1=1.0, fade=0.2, crisp=1.0, spec_gain=1.0):
    """One ribbon of liquid-metal silk painted into img (HxWx3 float, in place).

    Centre line: two sine waves plus a rise of `rise * u**power` (value creation).
    Folds index a metal ramp (dark folds, bright crests, a hard specular streak);
    `ramps` blends between metal ramps along the ribbon's length.
    """
    h, w, _ = img.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    x = xx / w; y = yy / h
    u = (x - x0) / (x1 - x0); uc = np.clip(u, 0, 1)
    yc = base_y + amp * np.sin(freq * 2 * np.pi * uc + phase) + 0.35 * amp * np.sin(2.3 * freq * 2 * np.pi * uc + 1.7 * phase) - rise * uc ** power
    t = thick * (0.55 + 0.45 * np.sin(1.3 * np.pi * uc + phase * 0.6) ** 2)
    d = (y - yc) / t
    body = np.exp(-((d * d) ** (1 + 0.6 * crisp)) * 1.4)
    f = 0.5 + 0.32 * np.cos(d * np.pi * 1.5 + 4.0 * uc + phase) + 0.18 * np.cos(d * np.pi * 3.6 - 2.5 * uc + 2 * phase)
    f = np.clip(f, 0, 1) ** 1.15
    # blend ramps along the length
    k = uc * (len(ramps) - 1)
    i0 = np.clip(np.floor(k).astype(int), 0, len(ramps) - 2)
    wgt = (k - i0)[..., None]
    col = np.zeros((h, w, 3), np.float32)
    for j in range(len(ramps) - 1):
        m = (i0 == j)[..., None]
        c = ramp(ramps[j], f) * (1 - wgt) + ramp(ramps[j + 1], f) * wgt
        col = np.where(m, c, col)
    spec = (np.exp(-((d + 0.28) / 0.07) ** 2) * 0.85 + np.exp(-((d - 0.42) / 0.05) ** 2) * 0.35) * spec_gain
    col = col * (1 - spec[..., None]) + 255 * spec[..., None]
    e = np.clip(u / fade, 0, 1); env = e * e * (3 - 2 * e)
    a = (alpha * body * env)[..., None]
    img[:] = img * (1 - a) + col * a

def grain(img, sigma=2.4, seed=0):
    n = np.random.default_rng(seed).normal(0, sigma, img.shape[:2]).astype(np.float32)
    return np.clip(img + n[..., None], 0, 255)

def save_jpg(arr, name, q=90):
    Image.fromarray(arr.astype(np.uint8), "RGB").save(os.path.join(OUT, name), quality=q, optimize=True)

def rounded(arr, radius_px, name):
    h, w, _ = arr.shape
    im = Image.fromarray(arr.astype(np.uint8), "RGB").convert("RGBA")
    ss = 4
    m = Image.new("L", (w * ss, h * ss), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, w * ss - 1, h * ss - 1], radius=radius_px * ss, fill=255)
    im.putalpha(m.resize((w, h), Image.LANCZOS))
    im.save(os.path.join(OUT, name), optimize=True)

def dark_silk(w, h, seed, mode="panel"):
    """Dark plum field with metallic silk, kept away from where text sits.

    panel: bright ribbons rise through the lower third only (text sits above).
    card:  a low-alpha sheen across the card plus one bright ribbon hugging the bottom edge.
    """
    rng = np.random.default_rng(seed)
    img = aurora(w, h, PLUM, [(0.2, 0.2, 0.35, hx("3A2050"), 0.8), (0.9, 0.9, 0.35, hx("4A1F38"), 0.7)])
    sets = [[ROSE_GOLD, LILAC_CHROME], [LILAC_CHROME, CHAMPAGNE], [CHAMPAGNE, ROSE_GOLD]]
    if mode == "panel":
        for i in range(3):
            metal_ribbon(img, rng.uniform(1.02, 1.12), rng.uniform(0.02, 0.04), rng.uniform(0.5, 0.9), rng.uniform(0, 6),
                         rng.uniform(0.22, 0.34), rng.uniform(1.2, 1.8), rng.uniform(0.05, 0.10), sets[i % 3],
                         alpha=rng.uniform(0.8, 0.95), x0=-0.15, x1=1.0)
    else:
        for i in range(2):
            metal_ribbon(img, rng.uniform(0.6, 0.9), 0.05, rng.uniform(0.5, 0.8), rng.uniform(0, 6), 0.4, 1.4, 0.22,
                         sets[i % 3], alpha=0.22, x0=-0.15, x1=1.0, spec_gain=0.25)
        metal_ribbon(img, 1.06, 0.02, 0.7, rng.uniform(0, 6), 0.10, 1.3, 0.07, sets[seed % 3], alpha=0.9, x0=-0.15, x1=1.0)
    return grain(img, 2.2, seed)

# ---- Title: page tint, large metallic silk mass sweeping up the right ----
t = aurora(SW, SH, PAGE, [(0.85, 0.25, 0.28, BLUSH, 0.8), (1.0, 0.75, 0.25, LAVENDER, 0.75), (0.6, 1.0, 0.22, APRICOT, 0.7)])
metal_ribbon(t, 1.10, 0.05, 0.7, 2.2, 0.85, 1.7, 0.22, [ROSE_GOLD, LILAC_CHROME], alpha=0.92, x0=0.46, x1=1.0)
metal_ribbon(t, 1.02, 0.04, 0.8, 0.4, 0.92, 1.5, 0.12, [LILAC_CHROME, CHAMPAGNE], alpha=0.95, x0=0.42, x1=1.0)
metal_ribbon(t, 1.00, 0.03, 1.0, 4.0, 0.98, 1.4, 0.05, [CHAMPAGNE, ROSE_GOLD], alpha=0.9, x0=0.38, x1=1.0)
save_jpg(grain(t, seed=1), "bg_title.jpg")

# ---- Content: page tint + a small metal wisp top-right ----
c = aurora(SW, SH, PAGE, [(1.02, -0.06, 0.12, BLUSH, 0.6), (-0.04, 1.08, 0.12, APRICOT, 0.35)])
metal_ribbon(c, 0.16, 0.012, 0.8, 1.0, 0.18, 1.3, 0.045, [LILAC_CHROME, ROSE_GOLD], alpha=0.75, x0=0.80, x1=1.0, fade=0.45)
save_jpg(grain(c, 1.8, seed=2), "bg_content.jpg")

# ---- Split layouts: content page + full-height dark metallic panel ----
pw = int(PANEL_IN * DPI)
for side, seed in (("r", 31), ("l", 32)):
    base = aurora(SW, SH, PAGE, [(-0.04, 1.08, 0.12, APRICOT, 0.3)] if side == "r" else [(1.04, 1.08, 0.12, BLUSH, 0.3)])
    panel = dark_silk(pw, SH, seed, "panel")
    if side == "r":
        base[:, SW - pw:] = panel
    else:
        base[:, :pw] = panel[:, ::-1]
    save_jpg(grain(base, 1.6, seed), f"bg_split_{side}.jpg")

# ---- Statement: dark plum with metal sweeping the lower half ----
s = aurora(SW, SH, PLUM, [(0.15, 0.1, 0.3, hx("3A2050"), 0.8), (0.9, 0.2, 0.3, hx("4A1F38"), 0.7)])
metal_ribbon(s, 1.06, 0.04, 0.7, 0.9, 0.26, 1.3, 0.16, [LILAC_CHROME, ROSE_GOLD, CHAMPAGNE], alpha=0.9, x0=-0.1, x1=1.0)
metal_ribbon(s, 1.02, 0.03, 0.9, 2.8, 0.30, 1.5, 0.06, [ROSE_GOLD, CHAMPAGNE], alpha=0.9, x0=-0.1, x1=1.0)
save_jpg(grain(s, seed=4), "bg_statement.jpg")

# ---- Dark metallic hero cards (rounded) ----
CARD_DPI = 120
for name, w_in, h_in, seed in (("card_solution.png", 5.43, 3.4, 41), ("card_whynow.png", 3.85, 4.75, 42),
                               ("card_tier.png", 3.85, 2.45, 43), ("card_insight.png", 12.13, 1.05, 44)):
    w, h = int(w_in * CARD_DPI), int(h_in * CARD_DPI)
    rounded(dark_silk(w, h, seed, "card"), int(0.28 * CARD_DPI), name)

# ---- Chrome spheres and ring ----
def sphere(name, size, stops):
    yy, xx = np.mgrid[0:size, 0:size].astype(np.float32) / size - 0.5
    r = np.sqrt(xx ** 2 + yy ** 2) / 0.5
    z = np.sqrt(np.clip(1 - r ** 2, 0, 1))
    # fake environment: horizon band + sky gradient reflected on the sphere
    f = np.clip(0.55 - 0.45 * yy / 0.5 + 0.25 * np.sin(6 * xx + 3 * yy) * (1 - z), 0, 1)
    col = ramp(stops, f) * (0.65 + 0.35 * z)[..., None]
    hl = np.exp(-(((xx + 0.16) ** 2 + (yy + 0.2) ** 2) / 0.006)) * 0.95
    col = col * (1 - hl[..., None]) + 255 * hl[..., None]
    ss = 4
    m = Image.new("L", (size * ss, size * ss), 0)
    ImageDraw.Draw(m).ellipse([0, 0, size * ss - 1, size * ss - 1], fill=255)
    im = Image.fromarray(np.clip(col, 0, 255).astype(np.uint8), "RGB").convert("RGBA")
    im.putalpha(m.resize((size, size), Image.LANCZOS))
    im.save(os.path.join(OUT, name), optimize=True)

sphere("orb_rosegold.png", 220, ROSE_GOLD[1:5])            # number markers
sphere("orb_orchid.png", 320, [hx("2A1450"), hx("5B2FC0"), hx("9C78F0"), hx("E6DCFF")])   # eyebrow, SOM, "you"

def ring(name, size, width_frac, stops):
    yy, xx = np.mgrid[0:size, 0:size].astype(np.float32) / size - 0.5
    r = np.sqrt(xx ** 2 + yy ** 2) / 0.5
    ang = np.arctan2(yy, xx)
    f = np.clip(0.5 + 0.35 * np.cos(2 * ang + 0.8) + 0.15 * np.cos(5 * ang), 0, 1)
    col = ramp(stops, f)
    band = np.clip(1 - np.abs(r - (1 - width_frac / 2)) / (width_frac / 2), 0, 1)
    a = np.clip(band * 3, 0, 1) * 255
    Image.fromarray(np.dstack([col, a]).astype(np.uint8), "RGBA").save(os.path.join(OUT, name), optimize=True)

ring("ring_rosegold.png", 400, 0.09, ROSE_GOLD[1:5])         # team photo frames

print("art ok")
