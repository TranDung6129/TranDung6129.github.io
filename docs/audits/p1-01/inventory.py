"""Read-only Git inventory; run from repository root. Output files go to argv[2]."""
import csv
import pathlib
import re
import subprocess
import sys

ref, output = sys.argv[1:]
out = pathlib.Path(output)
out.mkdir(parents=True, exist_ok=True)


def entries(directory, revision, prefix=""):
    raw = subprocess.check_output(
        ["git", "-C", directory, "ls-tree", "-rlz", revision]
    )
    for entry in raw.split(b"\0"):
        if entry:
            metadata, path = entry.split(b"\t", 1)
            mode, kind, oid, size = metadata.decode().split()
            yield [prefix + path.decode(), kind, mode, oid, size]


def write(name, header, rows):
    with (out / name).open("w") as handle:
        writer = csv.writer(handle, delimiter="\t", lineterminator="\n")
        writer.writerow(header)
        writer.writerows(rows)


header = ["path", "type", "mode", "git_object", "bytes"]
tracked = list(entries(".", ref))
write("tracked-files.tsv", header, tracked)
theme_rows = []
for path, kind, mode, oid, size in tracked:
    if kind == "commit":
        theme_rows.extend(entries(path, oid, path + "/"))
write("theme-files.tsv", header, theme_rows)

calls = []
for path, kind, mode, oid, size in tracked:
    if path.startswith("content/") and path.endswith(".md"):
        source = subprocess.check_output(["git", "show", f"{ref}:{path}"]).decode()
        for number, line in enumerate(source.splitlines(), 1):
            for match in re.finditer(r"{{([<%])\s*([\w-]+)\b.*?[>%]}}", line):
                calls.append([path, number, match[1], match[2], match[0]])
write("shortcode-calls.tsv", ["path", "line", "delimiter", "name", "call"], calls)
print(f"{len(tracked)} project entries; {len(theme_rows)} theme files; {len(calls)} shortcode calls")
