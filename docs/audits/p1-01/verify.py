"""Compare fresh Hugo outputs, inventory routes, and verify audited consumers.

Run: python3 docs/audits/p1-01/verify.py BEFORE_DIR AFTER_DIR OUTPUT_DIR
This is an audit evidence tool, not a browser/runtime or complete link checker.
"""
import hashlib
import json
import pathlib
import sys
from html.parser import HTMLParser

before, after, output = map(pathlib.Path, sys.argv[1:])
output.mkdir(parents=True, exist_ok=True)


def files(root):
    return {p.relative_to(root).as_posix(): p for p in root.rglob("*") if p.is_file()}


old, new = files(before), files(after)
for label, entries in [("before", old), ("after", new)]:
    routes = ["/" + (p[:-10] if p.endswith("index.html") else p) for p in entries]
    (output / f"routes-{label}.txt").write_text("\n".join(sorted(routes)) + "\n")


class Metadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.lang = None
        self.canonical = None
        self.titles = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "html":
            self.lang = attrs.get("lang")
        if tag == "title":
            self.titles += 1
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href")


homes = {}
for path, lang in [("index.html", "vi"), ("en/index.html", "en"),
                   ("ja/index.html", "ja"), ("zh-cn/index.html", "zh-cn")]:
    parser = Metadata()
    parser.feed(new[path].read_text())
    assert parser.lang == lang and parser.titles == 1, (path, parser.__dict__)
    assert parser.canonical == "https://trandung6129.github.io/" + path[:-10], path
    homes[path] = {"lang": parser.lang, "title_elements": parser.titles,
                   "canonical": parser.canonical}

markers = {}
for marker, expected in [("react-root-NashEquilibriumSim", 2),
                         ("collection-name-custom", 10), ("cal-heatmap", 4)]:
    hits = [p for p in sorted(new) if p.endswith(".html") and marker in new[p].read_text()]
    assert len(hits) == expected, (marker, hits)
    markers[marker] = hits

required = ["index.xml", "sitemap.xml", "robots.txt",
            "js/mount-react-root-NashEquilibriumSim-0.js", "videos/game_theory_nash.mp4"]
for path in required:
    assert path in new and new[path].stat().st_size > 0, path
search = [p for p in sorted(new) if p.endswith(".json")]
assert len(search) == 4, search
changed = [p for p in sorted(old.keys() & new.keys())
           if hashlib.sha256(old[p].read_bytes()).digest()
           != hashlib.sha256(new[p].read_bytes()).digest()]
result = {"emitted_files_before": len(old), "emitted_files_after": len(new),
          "removed": sorted(old.keys() - new.keys()), "added": sorted(new.keys() - old.keys()),
          "byte_differences": changed, "home_metadata": homes,
          "emitted_consumer_markers": markers, "required_outputs_present": required,
          "search_json_files": search,
          "known_missing_asset": "/images/game_theory_nash_poster.png",
          "limits": "No browser interaction, screenshots, full links/fragments, accessibility, performance or live deployment validated."}
assert not new.get("images/game_theory_nash_poster.png")
(output / "verification.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
assert old and not result["removed"] and not result["added"] and not changed, result
print(json.dumps(result, ensure_ascii=False, indent=2))
