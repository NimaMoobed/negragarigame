"""
Process the new negargari + gol-o-morgh designs from the user's Pictures folders.

Pipeline (per image):
  1) Grayscale
  2) Autocontrast (bring up faint pencil strokes)
  3) Threshold at 180 (aggressive — captures light gray lines as black)
  4) Slight dilation (MinFilter(3)) to close 1-pixel gaps in lines
  5) Resize to fit 1024x1024 keeping aspect ratio, white padding
  6) Output:
       public/designs/{prefix}_NN.png         (1024x1024)
       public/designs/thumbs/thumb_{prefix}_NN.png (256x256)
"""

from pathlib import Path
from PIL import Image, ImageOps, ImageFilter

ROOT = Path(__file__).parent.parent
OUT_FULL  = ROOT / "public" / "designs"
OUT_THUMB = ROOT / "public" / "designs" / "thumbs"

CANVAS = 1024
THUMB  = 256
THRESHOLD = 180   # higher = more pixels become black (catches faint lines)

# (folder_path, file_prefix)
SOURCES = [
    (Path(r"C:\Users\user\Pictures\negargari"),    "negar"),
    (Path(r"C:\Users\user\Pictures\gol & morgh"),  "gol"),
]


def clean_line_art(img: Image.Image) -> Image.Image:
    """Auto-contrast, threshold, slight dilation to close gaps."""
    gray = img.convert("L")
    gray = ImageOps.autocontrast(gray, cutoff=2)
    bw   = gray.point(lambda v: 0 if v < THRESHOLD else 255, mode="L")
    # MinFilter expands dark pixels (kernel minimum) — closes 1-pixel gaps
    bw = bw.filter(ImageFilter.MinFilter(3))
    return bw.convert("RGBA")


def fit_in_square(img: Image.Image, size: int) -> Image.Image:
    """Fit img inside a square with white padding, preserving aspect ratio."""
    img.thumbnail((size, size), Image.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    canvas.paste(img, ((size - img.width) // 2, (size - img.height) // 2))
    return canvas


def process_one(src_path: Path, prefix: str, idx: int) -> None:
    n = f"{idx:02d}"
    with Image.open(src_path) as raw:
        cleaned = clean_line_art(raw)

        full = fit_in_square(cleaned.copy(), CANVAS)
        full.save(OUT_FULL / f"{prefix}_{n}.png", "PNG", optimize=True)

        thumb = fit_in_square(cleaned.copy(), THUMB)
        thumb.save(OUT_THUMB / f"thumb_{prefix}_{n}.png", "PNG", optimize=True)
        print(f"  {prefix}_{n}.png  +  thumb_{prefix}_{n}.png  (from {src_path.name})")


def main() -> None:
    OUT_FULL.mkdir(parents=True, exist_ok=True)
    OUT_THUMB.mkdir(parents=True, exist_ok=True)

    for folder, prefix in SOURCES:
        if not folder.exists():
            print(f"!! Folder missing: {folder}")
            continue

        files = sorted(folder.glob("*.png"), key=lambda p: int(p.stem))
        print(f"\n== {prefix} ({len(files)} files) ==")
        for i, src in enumerate(files, start=1):
            process_one(src, prefix, i)


if __name__ == "__main__":
    main()
