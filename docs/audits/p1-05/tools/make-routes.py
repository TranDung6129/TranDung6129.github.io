#!/usr/bin/env python3
"""List the non-alias HTML routes of a Hugo output tree for visual-compare.cjs.

Usage: make-routes.py PUBLIC_DIR OUT.json
"all" = every HTML page that is not a meta-refresh alias; "matrix" = one representative per template kind.
"""
import json, pathlib, sys
root = pathlib.Path(sys.argv[1])
pages = []
for p in sorted(root.rglob('*.html')):
    head = p.read_text(encoding='utf8', errors='replace')[:600]
    if 'http-equiv=refresh' in head or 'http-equiv="refresh"' in head: continue
    rel = p.relative_to(root).as_posix()
    pages.append('/' + (rel[:-len('index.html')] if rel.endswith('index.html') else rel))
MATRIX = ['/', '/en/', '/ja/', '/zh-cn/', '/about/', '/en/about/', '/kinh-te/', '/en/kinh-te/',
          '/kinh-te/game_theory_nash/', '/en/kinh-te/game_theory_nash/', '/kinh-te/toan-co-ban-2/', '/en/kinh-te/toan-co-ban-1/',
          '/khoa-hoc-may-tinh/complexity-theory-quantum/', '/toan-hoc/riemann-hypothesis-number-theory/', '/triet-hoc/husserl-hien-tuong-hoc/',
          '/categories/', '/categories/kinh-te/', '/tags/', '/collections/', '/archives/', '/en/archives/', '/404.html']
matrix = [r for r in MATRIX if r in pages]
json.dump({'all': pages, 'matrix': matrix, 'missingMatrixRoutes': [r for r in MATRIX if r not in pages]}, open(sys.argv[2], 'w'), indent=1)
print(len(pages), 'pages;', len(matrix), 'matrix routes; missing:', [r for r in MATRIX if r not in pages])
