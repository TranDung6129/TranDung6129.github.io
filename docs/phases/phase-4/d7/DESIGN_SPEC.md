# D7 — Authoring & publishing dashboard (Studio): design specification

**Status:** BUILT AS A WORKING PROTOTYPE FOR OWNER REVIEW (2026-11-24). It runs only on the owner's machine and changes nothing on the public site.
- Code: `tools/studio/` (`npm run studio`).
- Screenshots: `docs/audits/d7/screenshots/`.
- Checks: `docs/audits/d7/tools/d7-check.cjs` → 9/9. They are read-only: no save, new essay or publish is sent.

## Owner decisions (2026-11-24)
1. Runs locally: reads and writes the repository's Markdown, previews with Hugo, publishes with git. No login, hosting or cost.
2. First screens: writing with preview, content management, statistics. The source and media library is later.

## Screens
1. **Nội dung:**
   - Every item with type, language, topic, date, status (nháp / đã đăng / chỉ trên máy), word count and series position.
   - Filters and search.
   - "Bài mới" creates a draft from the archetype in the chosen topic.
2. **Soạn bài:**
   - Left pane: metadata panel, an insert toolbar (Định nghĩa, Định lý, Lưu ý, Công thức đánh số, Tham chiếu công thức, Chú thích lề, Bảng, Biểu đồ, Danh mục tham khảo, Trích dẫn…) and the Markdown source in the publication's serif.
   - Right pane: the real page from `hugo server -D`, so maths, citations, notes and plots look exactly as published.
   - Ctrl+S saves; unsaved changes are flagged.
3. **Thống kê:**
   - Off state: explains the two steps to enable (GoatCounter endpoint; token in the environment).
   - On: views, top pages, referrers, and "Mua sách"/"Ủng hộ" clicks (D6 events).
4. **Đăng thay đổi…:** a test build first, then the list of changed `content/`/`data/` files, a message, confirm → commit and push. A failing build stops it.

## Architecture and safety
- **Dependencies:** Node built-ins only.
- **Network:** listens on 127.0.0.1 and checks Host (DNS rebinding) and Origin (cross-site requests).
- **Writes:** limited to `content/**.md` and `data/*.yaml`; path traversal is refused.
- **Private drafts:** git-ignored content files are excluded from preview and test builds.
- **Statistics token:** environment only.
- **Database:** P1-09 PostgreSQL stays separate; the Studio needs none.

## Not in this step
- Source library editor with DOI lookup.
- Media library with provenance forms.
- Scheduled publishing.
- Revision history view (git log is the history meanwhile).
