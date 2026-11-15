// Proof that removed CSS selectors match nothing in the rendered site.
// Usage: BASE=http://127.0.0.1:1314 node dead-selectors.cjs routes.json out.json
// Loads every non-alias page (JS executed), counts matches for each selector removed in P1-05.
// "sitewide" selectors must match nowhere; "homeOnly" selectors were inline on the home pages
// only, so they must match nothing on the four home routes. Exit 1 if any selector matches.
const { chromium } = require('playwright');
const fs = require('fs');
const SITEWIDE = ['.site-title', '.post-content', '.post-card', '.collection-navigation',
  '.right-panel', '.collections-panel', '.panel-title', '.custom-details', '.panel-title-summary', '.collections-list'];
const HOME_ONLY = ['.collection-item', '.collection-name', '.collection-count'];
const HOMES = ['/', '/en/', '/ja/', '/zh-cn/'];
(async () => {
  const base = process.env.BASE; const routes = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).all;
  const browser = await chromium.launch();
  const totals = Object.fromEntries([...SITEWIDE, ...HOME_ONLY.map(s => 'home: ' + s)].map(s => [s, 0]));
  const hits = []; let next = 0;
  async function worker() {
    const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
    while (next < routes.length) {
      const route = routes[next++];
      await page.goto(base + route, { waitUntil: 'load', timeout: 60000 });
      await page.waitForTimeout(250);
      const counts = await page.evaluate(([a, b, isHome]) => Object.fromEntries([...a.map(s => [s, document.querySelectorAll(s).length]),
        ...(isHome ? b.map(s => ['home: ' + s, document.querySelectorAll(s).length]) : [])]), [SITEWIDE, HOME_ONLY, HOMES.includes(route)]);
      for (const [s, n] of Object.entries(counts)) { totals[s] += n; if (n) hits.push({ route, selector: s, matches: n }); }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
  const report = { method: 'querySelectorAll after load in Chromium on every non-alias page', pages: routes.length, homePages: HOMES, totals, hits, allDead: hits.length === 0 };
  fs.writeFileSync(process.argv[3], JSON.stringify(report, null, 2) + '\n');
  await browser.close(); console.log(JSON.stringify(report, null, 1)); if (hits.length) process.exitCode = 1;
})().catch(e => { console.error(e); process.exit(1); });
