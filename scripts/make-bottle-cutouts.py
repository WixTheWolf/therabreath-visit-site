"""White-background bottle photos -> transparent PNG cutouts for site decor."""
from __future__ import annotations

import pathlib

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


def white_to_alpha(img: Image.Image, threshold: int = 238) -> Image.Image:
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r >= threshold and g >= threshold and b >= threshold:
                px[x, y] = (r, g, b, 0)
            elif r >= threshold - 18 and g >= threshold - 18 and b >= threshold - 18:
                # soft edge on light gray studio bg
                fade = min(r, g, b)
                alpha = int(max(0, (threshold - fade) * 14))
                px[x, y] = (r, g, b, min(255, alpha))
    return img


for slug, fname in BOTTLES.items():
    src = SRC / fname
    if not src.exists():
        print("skip missing", src)
        continue
    im = Image.open(src)
    if fname.endswith(".png"):
        im = im.convert("RGBA")
        # flatten near-white png backgrounds
        im = white_to_alpha(im.convert("RGB"), threshold=245)
    else:
        im = white_to_alpha(im, threshold=235)
    # trim vertical padding
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
    dest = OUT / f"{slug}.png"
    im.save(dest, optimize=True)
    print(dest.name, im.size)

print("Done.")