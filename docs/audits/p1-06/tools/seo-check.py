#!/usr/bin/env python3
"""SEO invariants for a production build (P1-06). Usage: seo-check.py PUBLIC_DIR CONTENT_DIR REPORT.json

Checks every non-alias HTML page: exactly one canonical, canonical and hreflang targets exist in
the build, hreflang sets are reciprocal and include x-default, an untranslated copy (Markdown body
identical to the default-language file) points its canonical at the original and carries no
hreflang, title/description/og:image are present, icon and poster references resolve, JSON-LD
parses. Also parses sitemaps and search indexes. Exit 1 on any violation.
"""
import json, pathlib, re, sys, urllib.parse, xml.etree.ElementTree as ET
pub, content = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]); BASE = 'https://trandung6129.github.io'
def body(p):
    s = p.read_text(encoding='utf8'); m = re.match(r'---\n.*?\n---\n', s, flags=re.S); return s[m.end():] if m else s
copies = {str(f.relative_to(content))[:-6] for f in content.rglob('*.en.md') if (v := f.with_name(f.name[:-6] + '.md')).exists() and body(f) == body(v)}
def exists(url):
    if not url.startswith(BASE): return None
    path = urllib.parse.unquote(url[len(BASE):].split('#')[0].split('?')[0]); t = pub / path.lstrip('/')
    return (t / 'index.html').exists() if path.endswith('/') or not t.suffix else t.exists()
pages = {}; problems = []
for p in sorted(pub.rglob('*.html')):
    h = p.read_text(encoding='utf8')
    if 'http-equiv=refresh' in h[:600]: continue
    rel = '/' + p.relative_to(pub).as_posix(); rel = rel[:-len('index.html')] if rel.endswith('index.html') else rel
    head = h[:h.index('</head>')] if '</head>' in h else h
    pages[rel] = {'canonical': re.findall(r'<link rel=canonical [^>]*href=([^ >]+)', head),
                  'hreflang': dict(re.findall(r'<link rel=alternate hreflang=([^ >]+) href=([^ >]+)', head)),
                  'title': re.search(r'<title>(.*?)</title>', head), 'desc': re.search(r'<meta name=description content=("[^"]+"|[^ >]+)', head),
                  'ogimage': re.findall(r'property="og:image" content="([^"]+)"', head), 'icons': re.findall(r'<link rel=(?:icon|apple-touch-icon|mask-icon)[^>]*href=([^ >]+)', head),
                  'posters': re.findall(r'poster="?([^" >]+)', h), 'ld': re.findall(r'<script type=application/ld\+json>(.*?)</script>', h, flags=re.S)}
url = lambda rel: BASE + rel
for rel, m in pages.items():
    if len(m['canonical']) != 1: problems.append([rel, 'canonical count', len(m['canonical'])]); continue
    c = urllib.parse.unquote(m['canonical'][0])
    if not exists(c): problems.append([rel, 'canonical target missing', c])
    key = rel[len('/en/'):].rstrip('/') if rel.startswith('/en/') else None
    is_copy = key is not None and any(key == k.replace('/index', '') or key == k for k in copies)
    if is_copy:
        if c != url(rel[len('/en'):]): problems.append([rel, 'copy canonical should be the original', c])
        if m['hreflang']: problems.append([rel, 'copy must not carry hreflang', m['hreflang']])
    elif c != url(rel) and rel != '/404.html': problems.append([rel, 'canonical is not self', c])
    for lang, target in m['hreflang'].items():
        if not exists(target): problems.append([rel, 'hreflang target missing', target])
        other = pages.get(target[len(BASE):])
        if lang != 'x-default' and other is not None and other['hreflang'] != m['hreflang']: problems.append([rel, 'hreflang not reciprocal', target])
    if m['hreflang'] and 'x-default' not in m['hreflang']: problems.append([rel, 'x-default missing'])
    if not m['title'] or not m['desc']: problems.append([rel, 'title/description missing'])
    if not m['ogimage'] or not all(exists(i) for i in m['ogimage']): problems.append([rel, 'og:image missing or unresolved', m['ogimage']])
    for i in m['icons'] + m['posters']:
        if not i.startswith('/') or not (pub / i.lstrip('/')).exists(): problems.append([rel, 'icon/poster unresolved', i])
    for block in m['ld']:
        try: json.loads(block)
        except ValueError as e: problems.append([rel, 'JSON-LD invalid', str(e)])
sitemaps = sorted(pub.rglob('sitemap.xml')); locs = 0
for s in sitemaps: locs += len(ET.parse(s).getroot().findall('.//{*}loc'))
search = {str(p.relative_to(pub)): len(json.load(open(p))) for p in sorted(pub.rglob('search.json'))}
canon = {}
for rel, m in pages.items():
    if len(m['canonical']) == 1: canon.setdefault(m['canonical'][0], []).append(rel)
report = {'pages': len(pages), 'untranslated_copies_in_content': len(copies), 'pages_with_hreflang': sorted(r for r, m in pages.items() if m['hreflang']),
          'copies_canonicalised_to_original': sorted(r for r, m in pages.items() if len(m['canonical']) == 1 and urllib.parse.unquote(m['canonical'][0]) != url(r)),
          'shared_canonical_groups_other_than_copy_plus_original': {c: v for c, v in canon.items() if len(v) > 1 and not (len(v) == 2 and any(x.startswith('/en/') for x in v))},
          'sitemap_files': len(sitemaps), 'sitemap_locs': locs, 'search_index_records': search, 'robots': (pub / 'robots.txt').read_text()[:120], 'problems': problems, 'pass': not problems}
json.dump(report, open(sys.argv[3], 'w'), indent=2, ensure_ascii=False)
print(json.dumps({k: (v if k not in ('copies_canonicalised_to_original',) else len(v)) for k, v in report.items()}, indent=1, ensure_ascii=False)[:2500])
sys.exit(1 if problems else 0)
