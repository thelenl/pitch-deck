import numpy as np, sys
from PIL import Image
import os
out = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))
W, H = 1920, 1080
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
base = np.array([10, 10, 10], np.float32)
green = np.array([61, 255, 138], np.float32)
amber = np.array([255, 176, 0], np.float32)

def glow(cx, cy, r, strength):
    d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / r
    return (np.exp(-d ** 2) * strength)[..., None]

def dots(step=24, val=30):
    m = ((xx % step) < 2) & ((yy % step) < 2)
    return m[..., None] * val

def scan(val=5):
    return ((yy % 4) < 1)[..., None] * val

def save(img, name):
    Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert("RGB").save(f"{out}/{name}", optimize=True)

# content: dot grid + faint green glow top-right
img = base + glow(1800, -80, 520, 0.10) * green + dots(24, 14)
save(img, "bg_content.png")
# title / statement: dot grid, scanlines, strong green glow bottom-right + faint amber top-left
img = base + glow(1700, 1150, 760, 0.22) * green + glow(-100, -100, 520, 0.06) * amber + dots(24, 16) + scan(4)
save(img, "bg_title.png")
# small glow halo for the "you" marker on the 2x2
s = 200; y2, x2 = np.mgrid[0:s, 0:s].astype(np.float32)
d = np.sqrt((x2 - s / 2) ** 2 + (y2 - s / 2) ** 2) / (s / 2)
a = np.clip(np.exp(-(d * 2.0) ** 2) * 200, 0, 255)
rgba = np.dstack([np.full((s, s), 61), np.full((s, s), 255), np.full((s, s), 138), a]).astype(np.uint8)
Image.fromarray(rgba, "RGBA").save(f"{out}/halo.png", optimize=True)
