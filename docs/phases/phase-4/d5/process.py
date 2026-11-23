# Engraving → alpha mask (ink opaque, paper transparent). Crop and blank boxes are fractions.
import sys, json
from PIL import Image, ImageFilter, ImageOps, ImageDraw, ImageChops
src, out = sys.argv[1], sys.argv[2]
SPEC = {
 'branch-mattioli-vicia': dict(crop=(.525,.272,.835,.575), blank=[], lo=45, hi=150, width=440),
 'flower-fuchs-primula':   dict(crop=(.08,.10,.80,.96), blank=[(.0,.26,.36,.355),(.36,.27,.43,.33),(.55,.26,.75,.34),(.62,.77,.76,.85),(.66,.84,.90,.93)], lo=45, hi=150, width=560),
 'flower-fuchs-euphorbia': dict(crop=(.22,.10,.80,.86), blank=[(.0,.60,.40,.69),(.52,.60,.80,.69),(.70,.71,.82,.77)], lo=45, hi=150, width=560),
 'landscape-hollar-coblenz': dict(crop=(.03,.46,.968,.84), blank=[], lo=60, hi=165, width=1400),
 'landscape-rhine-bonn':     dict(crop=(.05,.635,.955,.86), blank=[], lo=70, hi=175, width=1400),
}
for name, sp in SPEC.items():
    im = Image.open(f'{src}/{name}.jpg').convert('RGB')
    W, H = im.size
    d = ImageDraw.Draw(im)
    for (x0, y0, x1, y1) in sp['blank']:
        d.rectangle([x0*W, y0*H, x1*W, y1*H], fill=(255, 255, 255))   # blank before crop, page coords
    x0, y0, x1, y1 = sp['crop']; im = im.crop((int(x0*W), int(y0*H), int(x1*W), int(y1*H)))
    r, g, b = im.split()
    L = ImageChops.darker(ImageChops.darker(r, g), b)          # darkest channel: ink stays dark, colour washes lighten
    bg = L.filter(ImageFilter.GaussianBlur(40))
    flat = Image.eval(Image.merge('RGB', (L, bg, bg)).split()[0], lambda v: v)
    import numpy as np
    a = np.asarray(L, dtype=np.float32); bgv = np.asarray(bg, dtype=np.float32)
    a = np.clip(a / np.maximum(bgv, 1) * 235, 0, 255)                # flatten uneven paper
    lo, hi = sp['lo'], sp['hi']
    alpha = np.clip((hi - a) / (hi - lo), 0, 1) * 255
    m = Image.fromarray(alpha.astype('uint8'))
    bbox = m.point(lambda v: 255 if v > 40 else 0).getbbox(); m = m.crop(bbox)
    s = sp['width'] / m.width; m = m.resize((sp['width'], int(m.height*s)), Image.LANCZOS)
    rgba = Image.new('RGBA', m.size, (0, 0, 0, 0)); rgba.putalpha(m)
    rgba.save(f'{out}/{name}.png', optimize=True)
    rgba.save(f'{out}/{name}.webp', lossless=False, quality=82, method=6)
    print(name, m.size)
