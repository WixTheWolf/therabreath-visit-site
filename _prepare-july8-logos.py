"""Rasterize briefing logos for PDF. Run: python3 _prepare-july8-logos.py"""
import os

import cairosvg

ROOT = os.path.dirname(os.path.abspath(__file__))
LOGO_DIR = os.path.join(ROOT, "assets", "companies", "logos")

PAIRS = [
    ("tff-logo.svg", "tff-logo.png", 360),
    ("therabreath-logo.svg", "therabreath-logo.png", 420),
]


def main():
    os.makedirs(LOGO_DIR, exist_ok=True)
    for src, dst, width in PAIRS:
        svg_path = os.path.join(LOGO_DIR, src)
        png_path = os.path.join(LOGO_DIR, dst)
        if not os.path.isfile(svg_path):
            raise FileNotFoundError(svg_path)
        cairosvg.svg2png(url=svg_path, write_to=png_path, output_width=width)
        print("Wrote", png_path)


if __name__ == "__main__":
    main()
