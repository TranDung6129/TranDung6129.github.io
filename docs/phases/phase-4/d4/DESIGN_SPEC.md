# D4 — Content Architecture: design specification

**Status:** APPROVED by the owner 2026-11-24 and implemented in `feat/d4-content-architecture` (D-018). Prototype screenshots: `docs/audits/d4/screenshots/`. Implementation evidence: `docs/audits/d4/final/`. The review-only prototype overlay and `scripts/preview-d4.sh` were removed once the production templates replaced them (same files, now in `layouts/`, `assets/`, `content/`, `data/`).

**Owner answers at approval:**
- Merged topic names: "Khoa học cơ bản" (en "Fundamental Sciences") and "Triết học & Suy ngẫm" (en "Philosophy & Reflection").
- The heatmap stays at the end of the Journal.

The design reuses the approved Phase 3 and D1 vocabulary: numbered section headings, the reading list, the list header, top rules instead of boxes, accent kickers, and the D1 article unchanged except for one box. No new colours, fonts or imagery.

## 1. Journal (`/journal/`)
Order:
1. Header.
2. **01 Topics:** four entries, each with name, essay count and one-line description. The entry links to the topic hub.
3. **02 Series:** series cards.
4. **03 All essays:** the existing reading list.

The publishing heatmap stays as section 04 at the end (owner, 2026-11-24).
Screenshots: `journal-1440-light.png`, `journal-390-light.png`, `journal-1440-dark.png`.

## 2. Topic hub (`/categories/<topic>/`)
Header (kicker "Chủ đề", name, description, essay count), then numbered sections. A section is shown only when it has content:
1. Series in this topic.
2. Essays.
3. Films and labs whose companion essay belongs to the topic.
4. Resources tagged with the topic, with a link to the whole library.

Tags keep the plain list page.
Screenshots: `topic-economics-*`, `topic-philosophy-*` (a topic with only essays).

## 3. Series
- **Index (`/series/`):** series cards.
- **Series page (`/series/<slug>/`):**
  - kicker "Chuỗi bài · <topic>", title, subtitle, summary;
  - "n phần · đang tiếp tục / đã hoàn thành";
  - an optional note, e.g. the English edition says parts 2–5 are Vietnamese only;
  - "Bắt đầu từ phần 1 →";
  - ordered parts with summary and reading time.
- **Card:** kicker, title, subtitle, the numbered part titles, count and status.
Screenshots: `series-*`, `en-series-*`.

## 4. Essay in a series
The D1 article is unchanged except that the header box "Chương n / N · Tập I" becomes "Chuỗi bài · Phần n / N · <series> ○●○○○ · Phần tiếp: <title>". The dots are decorative (`aria-hidden`); the text carries the position. The D1 footer is not changed.
Screenshots: `essay-in-series-*`.

## 5. Volumes (`/volumes/`) while no book exists
- Header description: "Những cuốn sách được viết có chủ đích…".
- A short "Đang biên soạn" note explaining what a volume is.
- A link to Series.

When a volume exists, the current volume index and page are used unchanged.
Screenshot: `volumes-*`.

## 6. Discover library (`/discover/`)
- **Intro:** the disclosure "Không có liên kết trả phí", plus counts by type ("Sách 1 · Bài báo 4").
- **Grouping:** one section per topic with resources, grouped by each resource's *main* topic so nothing is listed twice. Topics without resources are omitted.
- **Entry:** type and year, title (linked to its verified source), authors and source, the editorial reason, and related essays in the reader's language.
- **Data:** only works cited by essays on the site. All five URLs were verified (Crossref/doi.org or the authors' site). No affiliate links (D6).
Screenshots: `discover-*`.

## 7. Data model (as prototyped)
- **Series:** `content/series/<slug>.md` (+ `.en.md`) with `title`, `subtitle`, `description`, `topic` (category slug), `status` (ongoing | complete), optional `note`, and ordered `essays` (content paths). Membership is derived from the series file, as Volume chapters are today, so no essay front matter has to change.
- **Topics:** the existing `categories` taxonomy. The first category of an essay is its main topic.
- **Resources:** `data/resources.yaml` with `title`, `type`, `authors`, `year`, `source`, `url`, `topics`, `why {vi,en}`, `essays`, and later `affiliate` + `disclosure` (D6). It replaces `data/discover.yaml`; `data/d1_resources.yaml` (the D1 Curated Reading) stays separate until D3 unifies citations.

## 8. Accessibility and quality (prototype evidence)
`docs/audits/d4/tools/d4-shots.cjs` → `docs/audits/d4/d4-results.json`: 8 pages × 1440/390 × light/dark = 32 states. Each state:
- HTTP 200;
- no horizontal overflow;
- no page errors;
- exactly one h1;
- axe-core WCAG 2.1 A/AA: 0 violations (light).

Keyboard and screen-reader runs belong to the implementation PR.

## 9. Owner review: what to approve
1. The six page designs above, from the screenshots.
2. **Topic names:** whether the merged topics keep their names ("Toán học", "Triết học") or show the merge ("Toán học & Vật lý", "Triết học & Suy ngẫm").
3. **Heatmap:** moving the publishing heatmap off the Journal.
