# D6 — Discovery & monetization: discovery

**Status:** IN PROGRESS. Started 2026-11-24 after D2 was verified on production.

## Current state
| Area | Today |
|---|---|
| Recommendations | D1 Further Essays: Hugo related content, then the latest essays if none is left (unlabelled). |
| Resources | D4 Discover library and D1 Curated Reading, both drawing on the D3 source library; no store links. |
| Support | None. |
| Analytics | None (FixIt Google/Fathom parameters unused; `analytics.enable = false`). |

## Owner decisions (2026-11-24)
1. **Recommendations:** editor first, automatic fallback, with the reason shown ("Biên tập chọn", "Phần tiếp của chuỗi", "Cùng chủ đề", "Bài mới").
2. **Monetization to enable first:** affiliate book links and voluntary support. Premium content later (it needs real accounts and payments, not client-side hiding).
3. **Analytics:** privacy-friendly, without cookies (GoatCounter or Cloudflare Web Analytics), on the owner's account.
