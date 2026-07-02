"""Render official-style TFF horizontal wordmark to PNG (serif type + bubble column)."""
from __future__ import annotations

import math
import os

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "assets", "companies", "logos", "tff-logo.png")
FONT_BOLD = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
TARGET_W = 1200


def _font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_BOLD, size)


def _sphere(draw: ImageDraw.ImageDraw, cx: float, cy: float, r: float, color: tuple[int, int, int]) -> None:
    x0, y0, x1, y1 = cx - r, cy - r, cx + r, cy + r
    draw.ellipse((x0, y0, x1, y1), fill=color)
    highlight = (
        int(color[0] + (255 - color[0]) * 0.45),
        int(color[1] + (255 - color[1]) * 0.45),
        int(color[2] + (255 - color[2]) * 0.45),
    )
    hr = max(2, r * 0.35)
    draw.ellipse((cx - r * 0.45, cy - r * 0.55, cx - r * 0.45 + hr, cy - r * 0.55 + hr), fill=highlight)


def render(width: int = TARGET_W) -> Image.Image:
  scale = width / 1200.0
  h = int(170 * scale)
  img = Image.new("RGBA", (width, h), (0, 0, 0, 0))
  draw = ImageDraw.Draw(img)

  f_big = _font(int(92 * scale))
  f_mid = _font(int(58 * scale))
  f_small = _font(int(24 * scale))

  x = int(8 * scale)
  y_base = int(118 * scale)

  draw.text((x + int(18 * scale), int(24 * scale)), "The", font=f_small, fill=(0, 0, 0, 255))
  draw.text((x, y_base - int(78 * scale)), "F", font=f_big, fill=(0, 0, 0, 255))
  f_bbox = draw.textbbox((0, 0), "F", font=f_big)
  f_w = f_bbox[2] - f_bbox[0]
  draw.text((x + f_w - int(8 * scale), y_base - int(52 * scale)), "LAVOR", font=f_mid, fill=(0, 0, 0, 255))
  lavor_bbox = draw.textbbox((0, 0), "LAVOR", font=f_mid)
  lavor_w = lavor_bbox[2] - lavor_bbox[0]
  bubble_x = x + f_w + lavor_w + int(18 * scale)

  spheres = [
    (bubble_x + int(8 * scale), int(28 * scale), int(11 * scale), (142, 36, 170)),
    (bubble_x + int(24 * scale), int(52 * scale), int(15 * scale), (245, 124, 0)),
    (bubble_x + int(6 * scale), int(78 * scale), int(13 * scale), (251, 192, 45)),
    (bubble_x + int(26 * scale), int(104 * scale), int(18 * scale), (67, 160, 71)),
    (bubble_x + int(4 * scale), int(132 * scale), int(10 * scale), (229, 57, 53)),
  ]
  for cx, cy, r, color in spheres:
    _sphere(draw, cx, cy, r, color)

  factory_x = bubble_x + int(52 * scale)
  draw.text((factory_x, y_base - int(52 * scale)), "FACTORY", font=f_mid, fill=(0, 0, 0, 255))

  # Trim transparent padding
  bbox = img.getbbox()
  if bbox:
    img = img.crop(bbox)
  return img


def main() -> None:
  os.makedirs(os.path.dirname(OUT), exist_ok=True)
  img = render(TARGET_W)
  img.save(OUT, "PNG")
  print("Wrote", OUT, img.size)


if __name__ == "__main__":
  main()
