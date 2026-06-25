"""Product photos on white studio backgrounds -> transparent PNG bottle cutouts."""
from __future__ import annotations

import pathlib
from collections import deque

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "portfolio" / "production"
OUT = ROOT / "assets" / "bottles"
OUT.mkdir(parents=True, exist_ok=True)

BOTTLES = {
    "clean-mint": "clean-mint.jpg",
    "revitalizing-mint": "revitalizing-mint.jpg",
    "rainforest-mint": "rainforest-mint.jpg",
    "dazzling-mint": "dazzling-mint.jpg",
    "tingling-mint": "tingling-mint.jpg",
    "overnight": "overnight-rinse.png",
    "grapes-galore": "grapes-galore.jpg",
    "wacky-watermelon": "wacky-watermelon.png",
    "strawberry-splash": "strawberry-splash.png",
    "bubble-gum": "bubble-gum.jpg",
}


def flood_background_mask(rgb: Image.Image, threshold: int = 248, tolerance: int = 22) -> list[list[bool]]:
    """Mark pixels connected to image edges that match near-white studio bg."""
    w, h = rgb.size
    px = rgb.load()
    bg = [[False] * w for _ in range(h)]
    seen = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def light_enough(x: int, y: int) -> bool:
        r, g, b = px[x, y]
        return min(r, g, b) >= threshold - tolerance

    for x in range(w):
        q.append((x, 0))
        q.append((x, h - 1))
    for y in range(h):
        q.append((0, y))
        q.append((w - 1, y))

    while q:
        x, y = q.popleft()
        if x < 0 or y < 0 or x >= w or y >= h or seen[y][x]:
            continue
        seen[y][x] = True
        if not light_enough(x, y):
            continue
        bg[y][x] = True
        q.append((x + 1, y))
        q.append((x - 1, y))
        q.append((x, y + 1))
        q.append((x, y - 1))

    return bg


def cutout_bottle(img: Image.Image, threshold: int = 248) -> Image.Image:
    rgb = img.convert("RGB")
    w, h = rgb.size
    px_rgb = rgb.load()
    bg = flood_background_mask(rgb, threshold=threshold)
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    px_out = out.load()

    for y in range(h):
        for x in range(w):
            if bg[y][x]:
                continue
            r, g, b = px_rgb[x, y]
            alpha = 255
            # Feather edge pixels touching background for clean anti-alias
            if (
                (x > 0 and bg[y][x - 1])
                or (x < w - 1 and bg[y][x + 1])
                or (y > 0 and bg[y - 1][x])
                or (y < h - 1 and bg[y + 1][x])
            ):
                lightness = min(r, g, b)
                if lightness > threshold - 40:
                    alpha = int(max(0, min(255, (threshold - 30 - lightness) * 10)))
            px_out[x, y] = (r, g, b, alpha)

    return out


def trim_transparent(im: Image.Image, pad: int = 2) -> Image.Image:
    bbox = im.getbbox()
    if not bbox:
        return im
    left, top, right, bottom = bbox
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(im.width, right + pad)
    bottom = min(im.height, bottom + pad)
    return im.crop((left, top, right, bottom))


for slug, fname in BOTTLES.items():
    src = SRC / fname
    if not src.exists():
        print("skip missing", src)
        continue
    im = Image.open(src)
    threshold = 245 if fname.endswith(".png") else 248
    out = cutout_bottle(im, threshold=threshold)
    out = trim_transparent(out)
    dest = OUT / f"{slug}.png"
    out.save(dest, optimize=True)
    print(dest.name, out.size)

print("Done.")