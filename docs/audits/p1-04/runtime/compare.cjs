// Compare two runtime-results.json files (baseline build vs candidate build).
// Usage: node compare.cjs baseline/runtime-results.json candidate/runtime-results.json [out.json]
const fs = require('fs');
const [a, b] = [process.argv[2], process.argv[3]].map(f => JSON.parse(fs.readFileSync(f, 'utf8')));
const pick = r => ({
  browser: r.browser,
  checks: r.checks.map(c => [c.name, c.passed]),
  math: r.math.map(m => [m.route, m.status, m.ready, m.version, m.containers, m.display, m.mathItems, m.errors, m.zeroSize, m.rawTexLeftovers, m.outputJax, m.lang, m.title]),
  heatmap: r.heatmap.map(h => [h.route, h.scheme, h.status, h.d3, h.calHeatMap, h.instance, h.svg, h.domains, h.cells, h.expectedCells, h.postDays, h.postDaysInWindow, h.fills, h.labels, h.tooltip, h.theme, h.lang]),
  heatmapMobile: r.heatmapMobile, heatmapThemeToggle: r.heatmapThemeToggle, heatmapThemeObservation: r.heatmapThemeObservation,
  external: Object.fromEntries(Object.entries(r.external).sort().map(([u, e]) => [u, [e.status, e.bytes, e.sha256, e.resolvedVersion]])),
  consoleErrors: r.consoleErrors.map(e => [e.type, e.message]).sort(),
  requestsFailed: r.requestsFailed.map(f => [f.url.replace(/^http:\/\/127\.0\.0\.1:\d+/, ''), f.error]).sort(),
});
const [pa, pb] = [pick(a), pick(b)];
const differences = Object.keys(pa).filter(k => JSON.stringify(pa[k]) !== JSON.stringify(pb[k]));
const summary = { baseline: process.argv[2], candidate: process.argv[3], comparedSections: Object.keys(pa), differences,
  identical: differences.length === 0, allChecksPass: { baseline: a.checks.every(c => c.passed), candidate: b.checks.every(c => c.passed) } };
if (process.argv[4]) fs.writeFileSync(process.argv[4], JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
if (!summary.identical || !summary.allChecksPass.baseline || !summary.allChecksPass.candidate) process.exitCode = 1;
