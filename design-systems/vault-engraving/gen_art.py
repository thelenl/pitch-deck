"""Procedural banknote art for the Vault Engraving deck: guilloche rosettes, holographic foil, backgrounds."""
import math, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "art")
os.makedirs(OUT, exist_ok=True)

DPI = 180
W, H = int(13.333 * DPI), int(7.5 * DPI)  # 2400 x 1350

GREEN = (14, 42, 34)
GOLD = (201, 162, 75)
GOLD_LT = (226, 199, 122)
MINT = (127, 214, 194)
PINK = (233, 166, 201)
LAV = (185, 169, 232)
CREAM = (243, 235, 216)


def hexrgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


# ---------- guilloche ----------
def rosette_mask(size, r_outer, ss=3, lw=1.0, density=1.0):
    """Return an 'L' mask (size x size) with a guilloche rosette centred, outer radius r_outer px."""
    S = size * ss
    img = Image.new("L", (S, S), 0)
    d = ImageDraw.Draw(img)
    c = S / 2
    R = r_outer * ss
    t = np.linspace(0, 2 * np.pi, 4000)
    # (radius fraction, amplitude fraction, frequency, number of curves)
    bands = [
        (0.86, 0.11, 18, int(26 * density)),
        (0.62, 0.10, 12, int(22 * density)),
        (0.40, 0.08, 9, int(18 * density)),
        (0.20, 0.07, 6, int(14 * density)),
    ]
    width = max(1, int(round(lw * ss)))
    for r0, a, m, n in bands:
        for k in range(n):
            ph = 2 * np.pi * k / n
            r = R * (r0 + a * np.sin(m * t + ph))
            # slow secondary modulation gives the woven, engraved feel
            r = r + R * 0.025 * np.sin(3 * t + ph * 2)
            pts = list(zip((c + r * np.cos(t)).tolist(), (c + r * np.sin(t)).tolist()))
            d.line(pts, fill=255, width=width)
    # hypotrochoid star in the centre
    for k in range(int(10 * density)):
        rot = 2 * np.pi * k / (10 * density) / 7
        Rh, rh, dh = 0.13 * R, 0.13 * R * 2 / 7, 0.09 * R
        tt = np.linspace(0, 2 * np.pi * 2, 4000)
        x = (Rh - rh) * np.cos(tt) + dh * np.cos((Rh - rh) / rh * tt)
        y = (Rh - rh) * np.sin(tt) - dh * np.sin((Rh - rh) / rh * tt)
        xr = x * math.cos(rot) - y * math.sin(rot)
        yr = x * math.sin(rot) + y * math.cos(rot)
        d.line(list(zip((c + xr).tolist(), (c + yr).tolist())), fill=255, width=width)
    # fine boundary rings
    for f in (0.99, 0.975):
        rr = R * f
        d.ellipse([c - rr, c - rr, c + rr, c + rr], outline=255, width=width)
    return img.resize((size, size), Image.LANCZOS)


def colorize(mask, color, alpha=1.0):
    rgba = Image.new("RGBA", mask.size, color + (0,))
    a = np.asarray(mask, dtype=np.float32) * alpha
    rgba.putalpha(Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)))
    return rgba


# ---------- foil ----------
def foil(w, h, seed=0):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    u, v = x / max(w, h), y / max(w, h)
    t = (u * 2.2 + v * 1.4 + 0.18 * np.sin(v * 14 + u * 6 + seed)) % 1.0
    stops = [MINT, LAV, PINK, GOLD_LT, MINT]
    stops = np.array(stops, dtype=np.float32)
    pos = t * (len(stops) - 1)
    i = np.floor(pos).astype(int)
    f = (pos - i)[..., None]
    col = stops[i] * (1 - f) + stops[np.minimum(i + 1, len(stops) - 1)] * f
    # diffraction micro-lines + sheen
    col *= (1 + 0.07 * np.sin((x + y) * 0.9))[..., None]
    sheen = np.exp(-((u - 0.35) ** 2 + (v - 0.3) ** 2) / 0.05)
    col += (sheen * 60)[..., None]
    return Image.fromarray(np.clip(col, 0, 255).astype(np.uint8), "RGB")


def seal(size=480):
    """Holographic foil seal disc with engraved rosette, transparent outside."""
    disc = foil(size, size, seed=1.3).convert("RGBA")
    ros = rosette_mask(size, size * 0.47, lw=1.2, density=0.8)
    eng = colorize(ros, (40, 70, 70), 0.55)
    disc = Image.alpha_composite(disc, eng)
    ss = 4
    m = Image.new("L", (size * ss, size * ss), 0)
    ImageDraw.Draw(m).ellipse([2 * ss, 2 * ss, (size - 2) * ss, (size - 2) * ss], fill=255)
    m = m.resize((size, size), Image.LANCZOS)
    ring = Image.new("L", (size * ss, size * ss), 0)
    ImageDraw.Draw(ring).ellipse([2 * ss, 2 * ss, (size - 2) * ss, (size - 2) * ss], outline=255, width=int(size * 0.025 * ss))
    ring = ring.resize((size, size), Image.LANCZOS)
    disc.putalpha(m)
    disc = Image.alpha_composite(disc, colorize(ring, GOLD, 1.0))
    return disc


# ---------- backgrounds ----------
def base_bg(seed=0):
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    g = np.exp(-(((x - W * 0.3) / (W * 0.8)) ** 2 + ((y - H * 0.25) / (H * 0.9)) ** 2))
    lo, hi = np.array([9, 33, 26], np.float32), np.array([22, 56, 45], np.float32)
    col = lo + (hi - lo) * g[..., None]
    rng = np.random.default_rng(seed)
    col += rng.normal(0, 2.2, (H, W, 1))
    return Image.fromarray(np.clip(col, 0, 255).astype(np.uint8), "RGB").convert("RGBA")


def frame(img):
    d = ImageDraw.Draw(img)
    o, i = int(0.18 * DPI), int(0.24 * DPI)
    ov = Image.new("RGBA", img.size, (0, 0, 0, 0))
    dv = ImageDraw.Draw(ov)
    dv.rectangle([o, o, W - o, H - o], outline=GOLD + (150,), width=3)
    dv.rectangle([i, i, W - i, H - i], outline=GOLD + (80,), width=1)
    # corner medallions: small rosettes on the frame corners
    small = colorize(rosette_mask(64, 30, lw=0.8, density=0.5), GOLD, 0.9)
    for cx, cy in ((o, o), (W - o, o), (o, H - o), (W - o, H - o)):
        ov.alpha_composite(small, (cx - 32, cy - 32))
    return Image.alpha_composite(img, ov)


def paste_center(img, layer, cx, cy):
    img.alpha_composite(layer, (int(cx - layer.width / 2), int(cy - layer.height / 2))) if (
        0 <= cx - layer.width / 2 and cx + layer.width / 2 <= img.width and 0 <= cy - layer.height / 2 and cy + layer.height / 2 <= img.height
    ) else _paste_clip(img, layer, int(cx - layer.width / 2), int(cy - layer.height / 2))


def _paste_clip(img, layer, x, y):
    sx, sy = max(0, -x), max(0, -y)
    ex, ey = min(layer.width, img.width - x), min(layer.height, img.height - y)
    img.alpha_composite(layer, dest=(x + sx, y + sy), source=(sx, sy, ex, ey))


def thread(img, x_in, w_in=0.2, windowed=True):
    """Vertical holographic security thread; windowed = dashed like a banknote's."""
    x0, w = int(x_in * DPI), int(w_in * DPI)
    strip = foil(w, H, seed=2.1).convert("RGBA")
    mask = Image.new("L", (w, H), 0)
    dm = ImageDraw.Draw(mask)
    if windowed:
        seg, gap = int(0.55 * DPI), int(0.3 * DPI)
        yy = int(0.18 * DPI)
        while yy < H - int(0.18 * DPI):
            dm.rectangle([0, yy, w, min(yy + seg, H - int(0.18 * DPI))], fill=235)
            yy += seg + gap
    else:
        dm.rectangle([0, int(0.18 * DPI), w, H - int(0.18 * DPI)], fill=235)
    strip.putalpha(mask)
    img.alpha_composite(strip, (x0, 0))


def save_jpg(img, name):
    img.convert("RGB").save(os.path.join(OUT, name), quality=86, optimize=True)


if __name__ == "__main__":
    # Big rosette layers (reused)
    big = rosette_mask(1500, 740, lw=1.1)

    # Title background: large gold rosette right, mint echo, windowed foil thread
    bg = base_bg(1)
    paste_center(bg, colorize(big, GOLD, 0.42), int(10.2 * DPI), int(3.75 * DPI))
    echo = rosette_mask(900, 440, lw=1.0, density=0.7).rotate(9)
    paste_center(bg, colorize(echo, MINT, 0.22), int(10.2 * DPI), int(3.75 * DPI))
    thread(bg, 7.6, 0.16)
    save_jpg(frame(bg), "bg-title.jpg")

    # Content background: faint rosette watermark bottom-right
    bg = base_bg(2)
    paste_center(bg, colorize(big, GOLD, 0.07), int(12.6 * DPI), int(7.0 * DPI))
    save_jpg(frame(bg), "bg-content.jpg")

    # Statement background: rosette right, solid foil thread
    bg = base_bg(3)
    paste_center(bg, colorize(big, GOLD, 0.2), int(11.6 * DPI), int(3.75 * DPI))
    thread(bg, 10.1, 0.14, windowed=False)
    save_jpg(frame(bg), "bg-statement.jpg")

    # Standalone pieces
    seal(360).save(os.path.join(OUT, "seal.png"), optimize=True)
    colorize(rosette_mask(640, 316, lw=1.1, density=0.85), GOLD, 0.8).save(os.path.join(OUT, "rosette-gold.png"), optimize=True)
    colorize(rosette_mask(480, 236, lw=1.0, density=0.7), GREEN, 0.18).save(os.path.join(OUT, "rosette-green.png"), optimize=True)
    for f in sorted(os.listdir(OUT)):
        print(f, os.path.getsize(os.path.join(OUT, f)) // 1024, "KB")
