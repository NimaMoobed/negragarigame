"""
Generate PWA icons for the negargari coloring book app.
Theme: classic — سبز اسلیمی (#0F7A6E) background, white motif outline.
Produces standard + maskable icons at multiple sizes.
"""

from pathlib import Path
from PIL import Image, ImageDraw

ROOT       = Path(__file__).parent.parent
OUT        = ROOT / "public" / "icons"
SOURCE_PNG = ROOT / "public" / "designs" / "design_01.png"

PRIMARY      = (15, 122, 110, 255)    # #0F7A6E سبز اسلیمی
PRIMARY_DEEP = (10,  89,  80, 255)    # #0A5950
ACCENT       = (30,  58, 107, 255)    # #1E3A6B لاجوردی
CREAM        = (246, 239, 221, 255)   # #F6EFDD کاغذ

SIZES = [72, 96, 128, 144, 152, 192, 256, 384, 512]


def make_icon(size: int, maskable: bool = False):
    """Standard icon: rounded square with gradient + motif outline."""
    bg = Image.new("RGBA", (size, size), PRIMARY)

    # Subtle inner glow (lighter top-left, darker bottom-right)
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    pad_steps = [(int(size * 0.08), 30), (int(size * 0.16), 18), (int(size * 0.24), 10)]
    for pad, alpha in pad_steps:
        gd.rounded_rectangle(
            (pad, pad, size - pad, size - pad),
            radius=int(size * 0.20),
            fill=(35, 160, 145, alpha),
        )
    bg = Image.alpha_composite(bg, glow)

    # Load design_01, convert to white-on-transparent
    art = Image.open(SOURCE_PNG).convert("RGBA")
    px = art.load()
    w, h = art.size
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            if r < 90 and g < 90 and b < 90:
                px[x, y] = (255, 255, 255, 255)
            else:
                px[x, y] = (0, 0, 0, 0)

    # Maskable icons need ~60% safe zone, standard ~82%
    fit = int(size * (0.55 if maskable else 0.78))
    art.thumbnail((fit, fit), Image.LANCZOS)
    bg.paste(art, ((size - art.width) // 2, (size - art.height) // 2), art)

    if maskable:
        # Maskable icons should fill the whole square (no rounded corners — OS does it)
        bg.save(OUT / f"icon-maskable-{size}.png", "PNG", optimize=True)
        return

    # Standard icon: rounded corners via mask
    mask = Image.new("L", (size, size), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle((0, 0, size, size), radius=int(size * 0.18), fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(bg, (0, 0), mask)
    out.save(OUT / f"icon-{size}.png", "PNG", optimize=True)


def make_favicon():
    """Small favicon for browser tabs (32×32)."""
    make_icon(32)  # produces icon-32.png
    src = OUT / "icon-32.png"
    src.rename(OUT / "favicon-32.png")


def make_apple_touch():
    """iOS home-screen icon — must NOT be transparent, must be 180×180."""
    bg = Image.new("RGBA", (180, 180), PRIMARY)
    art = Image.open(SOURCE_PNG).convert("RGBA")
    px = art.load()
    for y in range(art.height):
        for x in range(art.width):
            r, g, b, _ = px[x, y]
            if r < 90 and g < 90 and b < 90:
                px[x, y] = (255, 255, 255, 255)
            else:
                px[x, y] = (0, 0, 0, 0)
    art.thumbnail((140, 140), Image.LANCZOS)
    bg.paste(art, ((180 - art.width) // 2, (180 - art.height) // 2), art)
    bg.save(OUT / "apple-touch-icon.png", "PNG", optimize=True)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    print(f"Source: {SOURCE_PNG}")
    print(f"Output: {OUT}")
    for s in SIZES:
        make_icon(s, maskable=False)
        print(f"  + icon-{s}.png")
    for s in [192, 512]:
        make_icon(s, maskable=True)
        print(f"  + icon-maskable-{s}.png")
    make_favicon()
    print("  + favicon-32.png")
    make_apple_touch()
    print("  + apple-touch-icon.png")
    print("Done.")


if __name__ == "__main__":
    main()
