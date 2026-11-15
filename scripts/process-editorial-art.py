#!/usr/bin/env python3
"""Make uncropped, aspect-preserving review WebPs from the owner-supplied originals.

Requires Pillow with WebP support. Originals are never modified. Each width is
bounded by the source width; generated files are deterministic for a given
Pillow/libwebp build. Run from any directory.
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'assets' / 'editorial-source'
OUTPUT = ROOT / 'assets' / 'editorial-art'
SIZES = {
    'epistemic_hero': (640, 960, 1400, 1672),
    'epistemic_probability_v2': (320, 592),
    'epistemic_decision_v2': (400, 775),
    'epistemic_volume_1_cover': (256, 512, 1024),
}

OUTPUT.mkdir(parents=True, exist_ok=True)
for name, widths in SIZES.items():
    with Image.open(SOURCE / f'{name}.png') as raw:
        image = ImageOps.exif_transpose(raw).convert('RGB')
        for width in widths:
            if width > image.width:
                raise ValueError(f'{name}: cannot upscale {width} from {image.width}')
            height = round(image.height * width / image.width)
            resized = image if width == image.width else image.resize((width, height), Image.Resampling.LANCZOS)
            target = OUTPUT / f'{name}-{width}.webp'
            resized.save(target, 'WEBP', quality=84, method=6)
            print(f'{target.relative_to(ROOT)}: {width}x{height}, {target.stat().st_size} bytes')
