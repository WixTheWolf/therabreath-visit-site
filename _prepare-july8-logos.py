"""Prepare briefing logos for PDF. Run: python3 _prepare-july8-logos.py"""
import os
import subprocess
import sys

import cairosvg

ROOT = os.path.dirname(os.path.abspath(__file__))
LOGO_DIR = os.path.join(ROOT, "assets", "companies", "logos")

SVG_PAIRS = [
    ("therabreath-logo.svg", "therabreath-logo.png", 420),
]


def main():
    os.makedirs(LOGO_DIR, exist_ok=True)
    subprocess.run([sys.executable, os.path.join(ROOT, "_render-tff-logo.py")], check=True)
    for src, dst, width in SVG_PAIRS:
        svg_path = os.path.join(LOGO_DIR, src)
        png_path = os.path.join(LOGO_DIR, dst)
        if not os.path.isfile(svg_path):
            raise FileNotFoundError(svg_path)
        cairosvg.svg2png(url=svg_path, write_to=png_path, output_width=width)
        print("Wrote", png_path)


if __name__ == "__main__":
    main()
