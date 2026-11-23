# D4 prototype overlay (review only)

These files are a **prototype for owner approval**, not production code. `scripts/preview-d4.sh`
copies the site into a temporary directory, applies this overlay (files copied over the tree,
`REMOVE` entries deleted, `i18n-append/*.toml` appended) and builds it there. The normal build
never sees these files: Hugo does not read `docs/`.

After approval, the implementation moves these files into place with the URL migration
(Volume I → Series redirects, merged topics), tests and documentation required by
`docs/QUALITY_GATES.md`.
