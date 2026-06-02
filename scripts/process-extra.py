"""
Re-process negar + gol designs — KEEP THE ORIGINAL LOOK.

Previous version aggressively thresholded + dilated, which made the line-art
look too heavy. This version:
  - Converts to RGB (drops transparency)
  - Resizes to fit 1024x1024 (full) and 256x256 (thumb) keeping aspect ratio
  - White padding
  - NO threshold, NO dilation — preserves the artist's original tonality

For flood fill to work properly with non-pure-black lines, ColoringCanvas's
floodFill.ts uses a "wall-or-fillable" predicate (any pixel darker than the
threshold = wall, lighter = fillable) instead of exact-color matching.
"""

from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).parent.parent
OUT_FULL  = ROOT / "public" / "designs"
OUT_THUMB = ROOT / "public" / "designs" / "thumbs"

CANVAS = 1024
THUMB  = 256

SOURCES = [
    (Path(r"C:\Users\user\Pictures\negargari"),    "negar"),
    (Path(r"C:\Users\user\Pictures\gol & morgh"),  "gol"),
]


def fit_in_square(img: Image.Image, size: int) -> Image.Image:
    img = img.convert("RGB")
    img.thumbnail((size, size), Image.LANCZOS)
    canvas = Image.new("RGB", (size, size), (255, 255, 255))
    canvas.paste(img, ((size - img.width) // 2, (size - img.height) // 2))
    return canvas


def process_one(src_path: Path, prefix: str, idx: int) -> None:
    n = f"{idx:02d}"
    with Image.open(src_path) as raw:
        # Convert mode but DON'T threshold or dilate — preserve original look
        base = raw.convert("RGB")

        full = fit_in_square(base.copy(), CANVAS)
        full.save(OUT_FULL / f"{prefix}_{n}.png", "PNG", optimize=True)

        thumb = fit_in_square(base.copy(), THUMB)
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


# Keep ImageOps imported to make tooling happy even though autocontrast is removed
_ = ImageOps
