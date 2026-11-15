#!/usr/bin/env python3
"""Check that two builds differ in HTML only by the metadata P1-06 intends to change.

Usage: explain-html-diff.py BEFORE AFTER REPORT.json
Removes the intended <head> metadata (icons, keywords, canonical, hreflang, descriptions,
JSON-LD description/publisher, social image tags) from both versions of every HTML file and requires the rest to be
byte-identical. Exit 1 if any file has an unexplained difference.
"""
import json, pathlib, re, sys
before, after = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
PATTERNS = [
    r'<link rel=icon href=[^>]*>', r'<link rel=mask-icon [^>]*>', r'<meta name=keywords content=(?:\'[^\']*\'|"[^"]*"|[^ >]*)>',
    r'<link rel=canonical [^>]*>', r'<link rel=alternate hreflang=[^>]*>',
    r'<meta (?:name=description|itemprop=description|property="og:description"|name=twitter:description) content=(?:"[^"]*"|\'[^\']*\'|[^ >]*)>',
    r'"description":"(?:[^"\\]|\\.)*",?',
    r'<meta (?:itemprop=image|property="og:image"|name=twitter:image|name=twitter:card) content=(?:"[^"]*"|[^ >]*)>',
    r'"publisher":\{[^}]*\},?', r'"image":(?:\[[^\]]*\]|"[^"]*"),?', r'<meta name=application-name content=[^>]*>', r'<meta name=apple-mobile-web-app-title content=[^>]*>',
]
def norm(s):
    for p in PATTERNS: s = re.sub(p, '', s)
    return s
counts = {'identical': 0, 'metadata_only': 0}; unexplained = []
for p in sorted(before.rglob('*.html')):
    rel = p.relative_to(before); q = after / rel
    if not q.exists(): unexplained.append(str(rel) + ' (missing)'); continue
    a, b = p.read_text(encoding='utf8'), q.read_text(encoding='utf8')
    if a == b: counts['identical'] += 1
    elif norm(a) == norm(b): counts['metadata_only'] += 1
    else: unexplained.append(str(rel))
report = {'html_files': sum(counts.values()) + len(unexplained), **counts, 'unexplained': unexplained}
json.dump(report, open(sys.argv[3], 'w'), indent=2); print(json.dumps(report, indent=1)[:1500])
sys.exit(1 if unexplained else 0)
