"""
Render slides.html to a shareable presentation PDF (20 slides, letter landscape).
Run: python _build-presentation-pdf.py

Requires Google Chrome. Falls back to common install paths on Windows.
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SLIDES = ROOT / "slides.html"
OUT = ROOT / "booklet" / "documents" / "breath-of-innovation-presentation.pdf"

CHROME_PATHS = [
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"),
    Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"),
    Path("/usr/bin/google-chrome"),
    Path("/usr/bin/chromium"),
    Path("/usr/bin/chromium-browser"),
]


def find_chrome():
    for path in CHROME_PATHS:
        if path.exists():
            return path
    return None


def build():
    chrome = find_chrome()
    if not chrome:
        print("Chrome not found — install Google Chrome or set CHROME_PATH.", file=sys.stderr)
        sys.exit(1)

    if not SLIDES.exists():
        print(f"Missing {SLIDES}", file=sys.stderr)
        sys.exit(1)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    file_url = SLIDES.as_uri()

    cmd = [
        str(chrome),
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--run-all-compositor-stages-before-draw",
        "--virtual-time-budget=10000",
        f"--print-to-pdf={OUT}",
        "--no-pdf-header-footer",
        file_url,
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stderr or result.stdout, file=sys.stderr)
        sys.exit(result.returncode)

    if not OUT.exists() or OUT.stat().st_size < 1000:
        print("PDF was not created or is empty.", file=sys.stderr)
        sys.exit(1)

    pages = OUT.stat().st_size // 1024
    print(f"Wrote {OUT} ({pages} KB approx)")


if __name__ == "__main__":
    build()