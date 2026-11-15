#!/usr/bin/env python3
"""Fetch every file of a local production build from the live site and compare.

Usage: live-mirror.py LOCAL_BUILD LIVE_BASE OUT_DIR REPORT.json
Requests use normal certificate verification (system trust store / SSL_CERT_FILE) and the
environment's HTTPS proxy. For each path: HTTP status, final URL after redirects, content type,
size, SHA-256 of the live body vs the local file. Bodies are saved under OUT_DIR. Differences are
classified afterwards: byte-identical, or different. Exit 1 on any non-200 response.
"""
import concurrent.futures, hashlib, json, pathlib, ssl, sys, time, urllib.parse, urllib.request
local, base, out, report_path = pathlib.Path(sys.argv[1]), sys.argv[2].rstrip('/'), pathlib.Path(sys.argv[3]), sys.argv[4]
ctx = ssl.create_default_context()  # verification on; never disabled
opener = urllib.request.build_opener(urllib.request.HTTPSHandler(context=ctx))
paths = sorted(p.relative_to(local).as_posix() for p in local.rglob('*') if p.is_file())
def fetch(rel):
    url = base + '/' + urllib.parse.quote(rel.removesuffix('index.html') if rel.endswith('/index.html') or rel == 'index.html' else rel)
    for attempt in range(4):
        try:
            with opener.open(urllib.request.Request(url, headers={'User-Agent': 'p1-08-smoke'}), timeout=60) as r:
                body = r.read(); status = r.status; final = r.geturl(); ctype = r.headers.get('content-type')
            break
        except urllib.error.HTTPError as e:
            body, status, final, ctype = e.read(), e.code, url, e.headers.get('content-type'); break
        except Exception as e:
            if attempt == 3: return {'path': rel, 'url': url, 'error': repr(e)[:200]}
            time.sleep(2 * (attempt + 1))
    dest = out / rel; dest.parent.mkdir(parents=True, exist_ok=True); dest.write_bytes(body)
    lb = (local / rel).read_bytes()
    return {'path': rel, 'url': url, 'status': status, 'final_url': final, 'content_type': ctype, 'bytes': len(body),
            'identical_to_local': hashlib.sha256(body).digest() == hashlib.sha256(lb).digest()}
with concurrent.futures.ThreadPoolExecutor(6) as ex: rows = list(ex.map(fetch, paths))
bad = [r for r in rows if r.get('status') != 200]
report = {'base': base, 'local_build': str(local), 'files': len(rows), 'status_200': sum(r.get('status') == 200 for r in rows),
          'non_200_or_error': bad, 'identical_to_local': sum(bool(r.get('identical_to_local')) for r in rows),
          'different_from_local': [r['path'] for r in rows if r.get('status') == 200 and not r['identical_to_local']], 'rows': rows}
json.dump(report, open(report_path, 'w'), indent=1)
print(json.dumps({k: (v if not isinstance(v, list) or len(v) < 15 else v[:15] + [f'... {len(v) - 15} more']) for k, v in report.items() if k != 'rows'}, indent=1))
sys.exit(1 if bad else 0)
