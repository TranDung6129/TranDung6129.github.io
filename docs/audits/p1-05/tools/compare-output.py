#!/usr/bin/env python3
"""Compare two Hugo output trees: added, removed and byte-different files.

Usage: compare-output.py BEFORE AFTER [--report REPORT.json] [--show N]
Exit 0 when the trees are byte-identical, 1 otherwise. --show N prints the first N
lines of a unified diff (tags split onto lines) for each differing text file.
"""
import argparse, difflib, hashlib, json, pathlib, sys

ap = argparse.ArgumentParser()
ap.add_argument('before'); ap.add_argument('after'); ap.add_argument('--report'); ap.add_argument('--show', type=int, default=0)
args = ap.parse_args()
before, after = pathlib.Path(args.before), pathlib.Path(args.after)

def tree(root):
    return {p.relative_to(root).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(root.rglob('*')) if p.is_file()}

a, b = tree(before), tree(after)
removed = sorted(set(a) - set(b)); added = sorted(set(b) - set(a)); changed = sorted(k for k in set(a) & set(b) if a[k] != b[k])
by_ext = {}
for k in changed:
    ext = pathlib.PurePosixPath(k).suffix or '(none)'
    by_ext[ext] = by_ext.get(ext, 0) + 1
report = {'before_files': len(a), 'after_files': len(b), 'removed': removed, 'added': added, 'changed': changed,
          'changed_by_extension': by_ext, 'identical': not (removed or added or changed)}
if args.report:
    pathlib.Path(args.report).write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({k: (v if not isinstance(v, list) or len(v) <= 12 else v[:12] + [f'... {len(v) - 12} more']) for k, v in report.items()}, indent=1))
for k in changed if args.show else []:
    try:
        x = (before / k).read_text(encoding='utf8').replace('><', '>\n<').splitlines()
        y = (after / k).read_text(encoding='utf8').replace('><', '>\n<').splitlines()
    except UnicodeDecodeError:
        print(f'--- {k}: binary differs'); continue
    print('\n'.join(l[:300] for l in list(difflib.unified_diff(x, y, 'before/' + k, 'after/' + k, lineterm='', n=0))[:args.show]))
sys.exit(0 if report['identical'] else 1)
