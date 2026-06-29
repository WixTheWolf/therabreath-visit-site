"""Studio lineup photo -> clean transparent PNG (bottles only, no floor/reflections)."""
from __future__ import annotations

import pathlib
from collections import deque

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "visit" / "therabreath-lineup-source.jpg"
OUT = ROOT / "assets" / "visit" / "therabreath-lineup.png"


def flood_background(rgb: Image.Image, threshold: int = 242, tolerance: int = 32) -> list[list[bool]]:
    w, h = rgb.size
    px = rgb.load()
    bg = [[False] * w for _ in range(h)]
    seen = [[False] * w for _ in range(h)]
    q: deque[tuple[int, int]] = deque()

    def light(x: int, y: int) -> bool:
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
        if not light(x, y):
            continue
        bg[y][x] = True
        q.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])

    return bg


def find_bottle_bottom(rgba: Image.Image) -> int:
    """Last row with meaningful opaque bottle pixels (skip reflection band)."""
    w, h = rgba.size
    px = rgba.load()
    last = 0
    for y in range(h):
        opaque = 0
        for x in range(0, w, 4):
            if px[x, y][3] > 200:
                opaque += 1
        if opaque > (w // 4) * 0.08:
            last = y
    return last


def cutout(src: Image.Image) -> Image.Image:
    rgb = src.convert("RGB")
    w, h = rgb.size

    # Drop reflection / glossy floor (lower ~32% of studio shot)
    crop_h = int(h * 0.68)
    rgb = rgb.crop((0, 0, w, crop_h))

    w, h = rgb.size
    px_rgb = rgb.load()
    bg = flood_background(rgb, threshold=240, tolerance=34)
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    px_out = out.load()

    for y in range(h):
        for x in range(w):
            if bg[y][x]:
                continue
            r, g, b = px_rgb[x, y]
            alpha = 255
            if (
                (x > 0 and bg[y][x - 1])
                or (x < w - 1 and bg[y][x + 1])
                or (y > 0 and bg[y - 1][x])
                or (y < h - 1 and bg[y + 1][x])
            ):
                light = min(r, g, b)
                if light > 210:
                    alpha = int(max(0, min(255, (238 - light) * 14)))
            px_out[x, y] = (r, g, b, alpha)

    bottom = find_bottle_bottom(out)
    out = out.crop((0, 0, w, bottom + 4))

    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)

    pad = 8
    canvas = Image.new("RGBA", (out.width + pad * 2, out.height + pad * 2), (0, 0, 0, 0))
    canvas.paste(out, (pad, pad))
    return canvas


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Missing source image: {SRC}")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    result = cutout(Image.open(SRC))
    result.save(OUT, optimize=True)
    print("Wrote", OUT, result.size)


if __name__ == "__main__":
    main()