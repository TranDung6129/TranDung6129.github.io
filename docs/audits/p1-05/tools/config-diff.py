#!/usr/bin/env python3
"""Semantic diff of two `hugo config --format json` dumps. Prints dotted paths that differ."""
import json, sys
def flat(o, p=''):
    if isinstance(o, dict):
        if not o: yield p, {}
        for k, v in sorted(o.items()): yield from flat(v, f'{p}.{k}' if p else k)
    elif isinstance(o, list):
        yield p, json.dumps(o, sort_keys=True, ensure_ascii=False)
    else: yield p, o
a, b = (dict(flat(json.load(open(f)))) for f in sys.argv[1:3])
only_a = sorted(set(a) - set(b)); only_b = sorted(set(b) - set(a)); changed = sorted(k for k in set(a) & set(b) if a[k] != b[k])
limit = int(sys.argv[3]) if len(sys.argv) > 3 else 400
for k in only_a[:limit]: print('-', k, '=', str(a[k])[:160])
for k in only_b[:limit]: print('+', k, '=', str(b[k])[:160])
for k in changed[:limit]: print('~', k, ':', str(a[k])[:120], '=>', str(b[k])[:120])
print(f'# only-in-first {len(only_a)}, only-in-second {len(only_b)}, changed {len(changed)}, total keys {len(a)}/{len(b)}')
sys.exit(1 if (only_a or only_b or changed) else 0)
