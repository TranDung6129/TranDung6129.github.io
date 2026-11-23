// Page weight and paint observations (P3-07). Usage: node perf.cjs <baseA> <baseB> out.json
// Fresh context per run, no cache, no throttling: local observations, not field Core Web Vitals.
const { chromium } = require('playwright');
const fs = require('fs');
const ROUTES = ['/', '/en/kinh-te/game_theory_nash/', '/kinh-te/toan-co-ban-2/'];
(async () => {
  const [a, b, out] = process.argv.slice(2);
  const browser = await chromium.launch(); const rows = [];
  for (const [label, base] of [['before', a], ['after', b]]) for (const route of ROUTES) for (const width of [390, 1440]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } }); const p = await ctx.newPage();
    await p.addInitScript(() => { window.__cls = 0; window.__lcp = 0;
      new PerformanceObserver(l => l.getEntries().forEach(e => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver(l => { const e = l.getEntries().pop(); window.__lcp = e.startTime; window.__lcpEl = e.element ? e.element.tagName + (e.element.className ? '.' + String(e.element.className).split(' ')[0] : '') : ''; }).observe({ type: 'largest-contentful-paint', buffered: true }); });
    await p.goto(base + route, { waitUntil: 'load' }); await p.waitForTimeout(2500);
    const m = await p.evaluate(() => { const res = performance.getEntriesByType('resource'); const by = {};
      for (const r of res) { const t = r.initiatorType === 'link' && /\.css/.test(r.name) ? 'css' : /\.(woff2?)(\?|$)/.test(r.name) ? 'font' : /\.(png|webp|jpe?g|svg)(\?|$)/.test(r.name) ? 'image' : /\.js(\?|$)/.test(r.name) ? 'js' : r.initiatorType; by[t] = (by[t] || 0) + (r.transferSize || r.encodedBodySize || 0); }
      const nav = performance.getEntriesByType('navigation')[0]; by.html = nav.transferSize || nav.encodedBodySize;
      return { bytes: by, total: Object.values(by).reduce((x, y) => x + y, 0), requests: res.length + 1, fcp: Math.round((performance.getEntriesByName('first-contentful-paint')[0] || {}).startTime || 0),
        lcp: Math.round(window.__lcp), lcpElement: window.__lcpEl, cls: +window.__cls.toFixed(4), blockingCss: document.querySelectorAll('head link[rel=stylesheet]').length, scripts: document.querySelectorAll('script[src]').length }; });
    rows.push({ label, route, width, ...m }); await ctx.close();
  }
  fs.writeFileSync(out, JSON.stringify({ method: 'Single local unthrottled run per state, fresh context; third-party CDNs reached through the environment proxy. Not field CWV.', rows }, null, 2) + '\n');
  for (const r of rows) console.log(r.label, r.route, r.width, 'KB', Math.round(r.total / 1024), JSON.stringify(Object.fromEntries(Object.entries(r.bytes).map(([k, v]) => [k, Math.round(v / 1024)]))), 'req', r.requests, 'fcp', r.fcp, 'lcp', r.lcp, r.lcpElement, 'cls', r.cls, 'css', r.blockingCss, 'js', r.scripts);
  await browser.close();
})();
