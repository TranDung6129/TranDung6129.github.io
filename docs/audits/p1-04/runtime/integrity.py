#!/usr/bin/env python3
"""Cross-check CDN bytes executed by the browser against the npm registry releases.

Usage: integrity.py runtime-results.json NPM_DIR OUT.json
NPM_DIR holds `npm pack mathjax@3.2.2 cal-heatmap@3.3.10 d3@3.5.17` tarballs extracted
to <name>-<version>/package/. Exit code is nonzero on any mismatch.
"""
import base64, hashlib, json, pathlib, sys, urllib.request

results, npm_dir, out = json.load(open(sys.argv[1])), pathlib.Path(sys.argv[2]), sys.argv[3]
PAIRS = {
    "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js": ("mathjax", "3.2.2", "es5/tex-mml-chtml.js"),
    "https://cdn.jsdelivr.net/npm/mathjax@3/es5/ui/safe.js": ("mathjax", "3.2.2", "es5/ui/safe.js"),
    "https://cdn.jsdelivr.net/cal-heatmap/3.3.10/cal-heatmap.min.js": ("cal-heatmap", "3.3.10", "cal-heatmap.min.js"),
    "https://cdn.jsdelivr.net/cal-heatmap/3.3.10/cal-heatmap.css": ("cal-heatmap", "3.3.10", "cal-heatmap.css"),
    "https://d3js.org/d3.v3.min.js": ("d3", "3.5.17", "d3.min.js"),
}
report = {"method": "sha256 of each CDN response body captured by Chromium vs the same file inside the npm registry tarball; "
                    "tarball sha512 checked against the registry's dist.integrity.", "packages": {}, "files": []}
ok = True
for name, version in sorted({(n, v) for n, v, _ in PAIRS.values()}):
    meta = json.load(urllib.request.urlopen(f"https://registry.npmjs.org/{name}/{version}"))
    tarball = (npm_dir / f"{name}-{version}.tgz").read_bytes()
    sri = "sha512-" + base64.b64encode(hashlib.sha512(tarball).digest()).decode()
    match = sri == meta["dist"]["integrity"]
    ok &= match
    report["packages"][f"{name}@{version}"] = {"registryIntegrity": meta["dist"]["integrity"], "tarballIntegrity": sri, "match": match}
for url, (name, version, rel) in PAIRS.items():
    cdn = results["external"].get(url, {})
    data = (npm_dir / f"{name}-{version}" / "package" / rel).read_bytes()
    npm_sha = hashlib.sha256(data).hexdigest()
    match = cdn.get("sha256") == npm_sha
    ok &= match
    report["files"].append({"url": url, "cdnSha256": cdn.get("sha256"), "cdnBytes": cdn.get("bytes"), "cdnResolvedVersion": cdn.get("resolvedVersion"),
                            "npm": f"{name}@{version}/{rel}", "npmSha256": npm_sha, "npmBytes": len(data), "match": match})
report["allMatch"] = bool(ok)
json.dump(report, open(out, "w"), indent=2); open(out, "a").write("\n")
print(json.dumps(report, indent=1))
sys.exit(0 if ok else 1)
