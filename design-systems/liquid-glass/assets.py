import numpy as np
from PIL import Image
import os

OUT = os.path.dirname(os.path.abspath(__file__))
W, H = 1920, 1080
BG = np.array([0x15, 0x15, 0x1E], float)
STOPS = [np.array(c, float) for c in [(0xC9, 0xA9, 0x9A), (0xB7, 0xB6, 0xCE), (0x7E, 0x8A, 0x9E)]]
PERI = np.array([0x52, 0x66, 0xEB], float)
rng = np.random.default_rng(7)


def metallic(t):
    """t in [0,1] -> peach -> lavender -> steel."""
    t = np.clip(t, 0, 1)[..., None]
    a = np.where(t < 0.5, STOPS[0] + (STOPS[1] - STOPS[0]) * (t / 0.5), STOPS[1] + (STOPS[2] - STOPS[1]) * ((t - 0.5) / 0.5))
    return a


def blob(xx, yy, cx, cy, r, k=2.0, sx=1.0, sy=1.0):
    d2 = ((xx - cx) / (r * sx)) ** 2 + ((yy - cy) / (r * sy)) ** 2
    return np.exp(-d2 * k)


def compose(blobs, w=W, h=H, grain=4.0, bg=True):
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    img = np.tile(BG, (h, w, 1)) if bg else np.zeros((h, w, 3))
    alpha_total = np.zeros((h, w))
    for b in blobs:
        m = blob(xx, yy, b["cx"], b["cy"], b["r"], b.get("k", 2.0), b.get("sx", 1), b.get("sy", 1)) * b["i"]
        if b.get("peri"):
            col = np.tile(PERI, (h, w, 1))
        else:
            # diagonal sweep across the blob gives the liquid-metal shift
            t = ((xx - b["cx"]) * 0.8 + (yy - b["cy"]) * 0.6) / (2.2 * b["r"]) + 0.5
            col = metallic(t)
        img = img * (1 - m[..., None]) + col * m[..., None]
        alpha_total = 1 - (1 - alpha_total) * (1 - m)
    if grain:
        img = img + rng.normal(0, grain, (h, w))[..., None]
    return np.clip(img, 0, 255).astype(np.uint8), alpha_total


def save_jpg(name, blobs, grain=4.0):
    img, _ = compose(blobs, grain=grain)
    Image.fromarray(img).save(os.path.join(OUT, name), quality=86, optimize=True)


# Title: big orb bleeding off the right edge
save_jpg("bg_title.jpg", [
    dict(cx=1560, cy=420, r=620, i=0.92, k=1.7, sx=1.0, sy=0.85),
    dict(cx=1820, cy=820, r=380, i=0.55, k=2.0, peri=True),
    dict(cx=1250, cy=180, r=260, i=0.35, k=2.2),
])
# Content: a faint corner glow, top-right
save_jpg("bg_content.jpg", [
    dict(cx=1940, cy=-80, r=430, i=0.42, k=1.9),
    dict(cx=1700, cy=-160, r=300, i=0.22, k=2.0, peri=True),
], grain=3.5)
# Statement: orb rising from the bottom-right, cool glow top-left
save_jpg("bg_statement.jpg", [
    dict(cx=1620, cy=1120, r=720, i=0.85, k=1.7, sx=1.1, sy=0.8),
    dict(cx=260, cy=-120, r=420, i=0.28, k=2.0, peri=True),
])

# Transparent orb sprite to sit behind key cards
S = 900
yy, xx = np.mgrid[0:S, 0:S].astype(float)
m = blob(xx, yy, S / 2, S / 2, S * 0.36, 1.8)
t = ((xx - S / 2) * 0.8 + (yy - S / 2) * 0.6) / (2.2 * S * 0.36) + 0.5
col = metallic(t)
p = blob(xx, yy, S * 0.66, S * 0.64, S * 0.2, 2.0) * 0.6
col = col * (1 - p[..., None]) + PERI * p[..., None]
rgba = np.dstack([np.clip(col, 0, 255), np.clip(m * 255, 0, 255)]).astype(np.uint8)
Image.fromarray(rgba, "RGBA").save(os.path.join(OUT, "orb.png"), optimize=True)

for f in ["bg_title.jpg", "bg_content.jpg", "bg_statement.jpg", "orb.png"]:
    print(f, os.path.getsize(os.path.join(OUT, f)) // 1024, "KB")
