# Studio — local authoring dashboard (D7)

```
npm run studio          # http://127.0.0.1:4318, preview on http://127.0.0.1:1414
```

- **Nội dung:** every essay, series, film, lab and page, with filters (type, status, topic, language) and "Bài mới".
- **Soạn bài:** Markdown with a metadata panel (title, date, draft, topic, tags), buttons for the D2/D3 blocks, a citation picker over `data/bibliography.yaml`, Ctrl+S to save, and a live preview from the real Hugo server.
- **Thống kê:** GoatCounter numbers once `goatcounter` is set in `config/_default/params.toml` and the Studio runs with `GOATCOUNTER_TOKEN=…` (token on the machine only, never in the repository).
- **Đăng thay đổi…:** runs a test build first, lists the changed files in `content/` and `data/`, and only after confirmation commits them and pushes (GitHub Pages deploys).

Safety:
- listens on 127.0.0.1 only and checks Host/Origin;
- writes only `content/**.md` and `data/*.yaml`;
- no login, server or secret.

Git-ignored content files (private local drafts) are left out of the preview and the test build, since they never reach the site.
