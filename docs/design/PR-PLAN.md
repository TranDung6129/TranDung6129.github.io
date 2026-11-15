# Review branch sequence

All branches were pushed without merging or deploying. A `gh pr create` attempt for P1-08 returned `Post https://api.github.com/graphql: Forbidden`; no PR was created by this session. Open focused, stacked PRs in the order below when GitHub API or the web UI is available. Retarget the next branch to `main` after its base is merged; resolve shared task-board/log/registry changes serially.

| Head | Base | Scope |
|---|---|---|
| `docs/p1-08-live-retry` | `main` | Record blocked trusted live-site retry; P1-08 stays blocked |
| `feat/p2-01-tokens` | `docs/p1-08-live-retry` | Specimen-only tokens, contrast and documentation |
| `feat/p2-02-typography` | `feat/p2-01-tokens` | Local-only Hugo typography specimen and initial screenshots |
| `feat/p2-03-navigation` | `feat/p2-02-typography` | Specimen navigation/search and interaction checks; section anchors are completed by later stacked components |
| `feat/p2-04-editorial-components` | `feat/p2-03-navigation` | Review-only editorial composition and original illustrative SVGs |
| `feat/p2-05-future-specimens` | `feat/p2-04-editorial-components` | Static future-format samples and integrated P2-03 verification |
| `feat/p2-06-review` | `feat/p2-05-future-specimens` | QA fixes, 10 screenshots, evidence, owner-review gate |

The first design review should consider the complete final branch, not prematurely approve or deploy any intermediate production visual change. No branch changes `layouts/index.html`; production builds do not emit the temporary review route. P2-06 and P1-08 remain BLOCKED for separate reasons: owner visual review and trusted live-site access, respectively.
