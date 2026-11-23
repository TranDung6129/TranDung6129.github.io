#!/usr/bin/env python3
"""Every redirect page in a built site must point at a real page (no 404, no chain).
Also reports HTML routes of a reference build that the new build lost.
Usage: python3 check-redirects.py <site-dir> [<reference-site-dir>]"""
import os, re, sys
site = sys.argv[1]; ref = sys.argv[2] if len(sys.argv) > 2 else None
pat = re.compile(r'http-equiv="?refresh"? content="0; url=https?://[^/"]+([^"]*)"')
def routes(d):
    return {os.path.relpath(os.path.join(r, f), d) for r, _, fs in os.walk(d) for f in fs if f == 'index.html'}
bad, n = [], 0
for rel in sorted(routes(site)):
    m = pat.search(open(os.path.join(site, rel), errors='ignore').read(800))
    if not m: continue
    n += 1
    tgt = os.path.join(site, m.group(1).lstrip('/'), 'index.html')
    if not os.path.exists(tgt) or pat.search(open(tgt, errors='ignore').read(800)):
        bad.append((rel, m.group(1)))
print(f'{n} redirect pages, {len(bad)} broken or chained'); [print('  BAD', a, '->', b) for a, b in bad]
lost = sorted(routes(ref) - routes(site)) if ref else []
if ref: print(f'{len(lost)} HTML routes of the reference build missing'); [print('  LOST', x) for x in lost]
sys.exit(1 if bad or lost else 0)
