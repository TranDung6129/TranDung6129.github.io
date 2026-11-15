# P1-02: capture pre-migration behavior and defects

Capture a reproducible baseline before replacing FixIt. Add static URL/metadata/
feed/search checks, Chromium interaction/screenshot/performance evidence and
known-defect handoff without changing the application or public routes.

Validation: Hugo Extended 0.149.0 build passes; 645 emitted files remain identical
to the accepted P1-01 baseline. Static analyzer and its meaningful URL/fragment/
route-loss fixture pass. Browser evidence distinguishes passing interactions,
recorded interaction results and environmental external-resource failures; it does
not claim math, accessibility or production performance parity.

Known baseline defects: 745 missing internal target occurrences; four duplicate
canonical groups; incomplete ja/zh-cn content; external MathJax/font loading
blocked. These are recorded, not silently fixed.

Change impact: new audit entrypoints under docs/audits/p1-02 only; no application
ownership paths, configuration, content, dependencies or SQL runtime changes.
CODEBASE_MAP and INSPECTED_FILES record the new test entrypoints and reviewed
versions. D-010/P1-09 remains staged after P1-03, public articles remain static.

Knowledge captured: generated-output/browser evidence grouped with explicit
coverage/limits, analyzer/harness responsibilities and relevant documentation
versions recorded. See AGENT_LOG and docs/audits/P1-02.md for exact results.

Stacked on docs/p1-01-acceptance to keep task scopes separate; retarget to main
once that acceptance update merges. No automatic merge requested. API egress
currently blocks PR creation; update the task status/URL after delivery succeeds.
