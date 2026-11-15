"""Verify text token pairings against WCAG relative luminance (no dependencies)."""
import re
from pathlib import Path

css = Path('assets/css/editorial/tokens.css').read_text()
blocks = re.findall(r'(?:\[data-ed-theme="light"\]|\[data-ed-theme="dark"\])\s*\{([^}]+)\}', css)
assert len(blocks) == 2

def luminance(value):
    channels = [int(value[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    linear = [c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4 for c in channels]
    return .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2]

for theme, block in zip(('light', 'dark'), blocks):
    values = dict(re.findall(r'--ed-([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;', block))
    for fg in ('fg', 'accent', 'muted'):
        for bg in ('bg', 'surface'):
            a, b = sorted((luminance(values[fg]), luminance(values[bg])))
            ratio = (b + .05) / (a + .05)
            print(f'{theme} {fg}/{bg}: {ratio:.2f}:1')
            assert ratio >= 4.5, (theme, fg, bg, ratio)
