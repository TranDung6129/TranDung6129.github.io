#!/usr/bin/env python3
"""Check owner originals and uncropped WebP derivatives without third-party services."""
from pathlib import Path
import hashlib
from PIL import Image, ImageChops, ImageStat, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SOURCES = {
    'epistemic_hero': ('cde246cfb8eb27594760578a1cea8003e543076a8602b3bd7a68a81918a4fa63', (640, 960, 1400, 1672)),
    'epistemic_probability_v2': ('e9e02fac9217baa9364692cec936d1ed6e644a7a616ea86c13a1a6c2e14fb42b', (320, 592)),
    'epistemic_decision_v2': ('d96c879c973f2753d4998f7873604e29026e821095916604c22909f93f531d37', (400, 775)),
    'epistemic_volume_1_cover': ('b6cee35dc60067fad34a72adc6555f7fd68b0683e50b43d24970cbdb9b54e874', (256, 512, 1024)),
}
for name, (digest, widths) in SOURCES.items():
    source = ROOT / 'assets' / 'editorial-source' / f'{name}.png'
    assert hashlib.sha256(source.read_bytes()).hexdigest() == digest, f'original changed: {name}'
    with Image.open(source) as src:
        original = ImageOps.exif_transpose(src).convert('RGB')
        for width in widths:
            expected_height = round(original.height * width / original.width)
            target = ROOT / 'assets' / 'editorial-art' / f'{name}-{width}.webp'
            with Image.open(target) as result:
                assert result.format == 'WEBP' and result.size == (width, expected_height), target
                reference = original if width == original.width else original.resize((width, expected_height), Image.Resampling.LANCZOS)
                mean_error = sum(ImageStat.Stat(ImageChops.difference(reference, result.convert('RGB'))).mean) / 3
                assert mean_error < 8, (target, mean_error)
                print(f'PASS {target.name}: {result.width}x{result.height}; mean RGB error {mean_error:.2f}')
print('PASS: four exact source hashes and eleven uncropped aspect-preserving WebP derivatives')
