#!/usr/bin/env python3
"""Byte comparison of two builds that ignores only the source-path prefix embedded in source maps
and development bundles (themes/FixIt/assets/ -> assets/, and the checkout directory).

Usage: compare-normalised.py BEFORE AFTER REPORT.json [BEFORE_ROOT AFTER_ROOT]
Exit 1 if any file differs after normalisation.
"""
import hashlib, json, pathlib, sys
a, b = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
roots = sys.argv[4:6]
def norm(data):
    for old in [b'themes/FixIt/assets/', b'themes/FixIt/'] : data = data.replace(old, b'assets/' if old.endswith(b'assets/') else b'')
    for r in roots: data = data.replace(r.encode(), b'<repo>')
    return data
fa = {p.relative_to(a).as_posix() for p in a.rglob('*') if p.is_file()}; fb = {p.relative_to(b).as_posix() for p in b.rglob('*') if p.is_file()}
raw, real = [], []
for f in sorted(fa & fb):
    x, y = (a / f).read_bytes(), (b / f).read_bytes()
    if x != y:
        raw.append(f)
        if norm(x) != norm(y): real.append(f)
report = {'before_files': len(fa), 'after_files': len(fb), 'removed': sorted(fa - fb), 'added': sorted(fb - fa), 'byte_different': raw,
          'different_after_path_normalisation': real, 'equivalent': not (fa ^ fb or real)}
json.dump(report, open(sys.argv[3], 'w'), indent=2); print(json.dumps(report, indent=1)); sys.exit(0 if report['equivalent'] else 1)
