# P1-01: inventory repository and document cleanup candidates

The FixIt migration needs a verified inventory before cleanup can preserve public
content and features. This audit records all 245 parent-tree entries and 3,334
pinned theme files, tests effective Hugo configuration precedence, identifies
active layout/asset/shortcode consumers, and publishes a KEEP/REPLACE/REMOVE matrix.

No application source, content, configuration, workflows, dependencies or theme
pins change. Existing issues, including the missing Nash video poster, are logged
for P1-02. The homepage and all later commercial features remain outside scope.

Validation:

- Two production builds using Hugo Extended 0.149.0 passed.
- All 645 emitted files are byte-identical; zero added/removed public routes.
- Verified four home languages/canonicals, feeds/search/sitemap/robots and emitted
  React/collection/heatmap consumers. Browser behavior and live deployment are unrun.
- Separate audit contributors inspected assets/content and config/deployment;
  contributor review checked inventory completeness and precedence findings.

See `docs/audits/P1-01.md`, the committed evidence under `docs/audits/p1-01/`,
and the exact commands/results in `docs/AGENT_LOG.md`. This PR requires maintainer
review; it does not declare Phase 1 complete or authorize candidate removals.

Delivery note: the branch was pushed, but the onboarding environment's enforced
network policy blocked `api.github.com`. The task remains BLOCKED until PR creation
is confirmed; update the task log with the actual PR URL before marking it DONE.
