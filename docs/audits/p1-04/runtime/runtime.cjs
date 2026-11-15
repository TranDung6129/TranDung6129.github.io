// P1-04 external-runtime gate: MathJax typesetting and Cal-Heatmap execution in
// headless Chromium with ordinary certificate validation. No ignoreHTTPSErrors,
// no --ignore-certificate-errors, no request interception, no local substitutes.
//
// Usage: BASE=http://127.0.0.1:1316 OUT=/path/to/out node runtime.cjs
// Exit code is nonzero when any named check fails.
const { chromium } = require('playwright');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const base = process.env.BASE || 'http://127.0.0.1:1316';
const out = process.env.OUT || path.join(__dirname, 'output');
fs.mkdirSync(path.join(out, 'screenshots'), { recursive: true });

const MATH_ROUTES = [
  '/kinh-te/toan-co-ban-1/', '/en/kinh-te/toan-co-ban-1/',
  '/kinh-te/toan-co-ban-2/', '/kinh-te/toan-co-ban-3/',
  '/kinh-te/toan-co-ban-4/', '/kinh-te/toan-co-ban-5/', '/en/kinh-te/toan-co-ban-5/',
  '/kinh-te/co-gian-cung-cau-cong-thuc/', '/kinh-te/doanh-thu-co-gian-dinh-thuc/',
  '/kinh-te/ly-thuyet-tro-choi-nash/',
  '/kinh-te/game_theory_nash/', '/en/kinh-te/game_theory_nash/',
  '/toan-hoc/riemann-hypothesis-number-theory/', '/en/toan-hoc/riemann-hypothesis-number-theory/',
  '/khoa-hoc-may-tinh/complexity-theory-quantum/', '/en/khoa-hoc-may-tinh/complexity-theory-quantum/',
];
const HOME_ROUTES = ['/', '/en/', '/ja/', '/zh-cn/'];
const EXTERNAL_OF_INTEREST = /^https:\/\/(cdn\.jsdelivr\.net|d3js\.org)\//;

(async () => {
  const launchOptions = {}; // deliberately empty: default sandbox/trust behaviour of the installed browser
  const browser = await chromium.launch(launchOptions);
  const results = {
    method: 'Headless Chromium against the unmodified production build served by python http.server. ' +
      'External CDN requests are real network requests with certificate validation enabled; ' +
      'no ignoreHTTPSErrors, no certificate-error flags, no interception or mocked assets.',
    base, browser: browser.version(), launchOptions, contextOptions: { ignoreHTTPSErrors: false },
    external: {}, math: [], heatmap: [], checks: [], consoleErrors: [], requestsFailed: [], screenshots: [],
  };

  function instrument(page) {
    page.on('pageerror', e => results.consoleErrors.push({ page: page.url(), type: 'pageerror', message: e.message }));
    page.on('console', m => { if (m.type() === 'error') results.consoleErrors.push({ page: page.url(), type: 'console.error', message: m.text().slice(0, 300) }); });
    page.on('requestfailed', r => results.requestsFailed.push({ page: page.url(), url: r.url(), error: r.failure()?.errorText }));
    page.on('response', async r => {
      const url = r.url();
      if (!EXTERNAL_OF_INTEREST.test(url) || results.external[url]) return;
      const entry = results.external[url] = { status: r.status(), firstSeenOn: page.url() };
      try {
        const sec = await r.securityDetails();
        entry.tls = sec ? { protocol: sec.protocol, subjectName: sec.subjectName, issuer: sec.issuer,
          validFrom: new Date(sec.validFrom * 1000).toISOString(), validTo: new Date(sec.validTo * 1000).toISOString() } : null;
        const headers = r.headers();
        entry.contentType = headers['content-type'];
        entry.resolvedVersion = headers['x-jsd-version'] || null;
        const body = await r.body();
        entry.bytes = body.length;
        entry.sha256 = crypto.createHash('sha256').update(body).digest('hex');
      } catch (e) { entry.captureError = e.message; }
    });
  }

  async function shot(page, name, locator) {
    const file = path.join('screenshots', name + '.png');
    if (locator) await locator.screenshot({ path: path.join(out, file) });
    else await page.screenshot({ path: path.join(out, file) });
    results.screenshots.push(file);
  }

  // ---- MathJax ---------------------------------------------------------
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light' });
  const page = await ctx.newPage();
  instrument(page);
  for (const route of MATH_ROUTES) {
    const resp = await page.goto(base + route, { waitUntil: 'load', timeout: 60000 });
    let ready = true;
    try {
      await page.waitForFunction(() => window.MathJax && window.MathJax.startup && window.MathJax.startup.promise, null, { timeout: 45000 });
      await page.evaluate(() => window.MathJax.startup.promise);
    } catch (e) { ready = false; }
    const data = await page.evaluate(() => {
      const mj = window.MathJax || {};
      const containers = [...document.querySelectorAll('mjx-container')];
      const zeroSize = containers.filter(c => { const b = c.getBoundingClientRect(); return b.width === 0 || b.height === 0; }).length;
      // Raw TeX left in visible prose would mean typesetting was skipped for that node.
      const walker = document.createTreeWalker(document.querySelector('.content') || document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: n => n.parentElement.closest('pre,code,script,style,textarea,mjx-container,.react-root,[id^="react-root"]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
      const leftovers = [];
      while (walker.nextNode()) { const t = walker.currentNode.nodeValue; if (/\$\$|\\\(|\\\[|\$[^$\s][^$]*\$/.test(t)) leftovers.push(t.trim().slice(0, 80)); }
      const list = mj.startup && mj.startup.document && mj.startup.document.math;
      let mathItems = null; if (list) { mathItems = 0; for (const _ of list) mathItems++; }
      return { version: mj.version || null, containers: containers.length,
        display: containers.filter(c => c.getAttribute('display') === 'true').length,
        errors: document.querySelectorAll('mjx-merror').length, zeroSize, mathItems,
        rawTexLeftovers: leftovers.length, rawTexSamples: leftovers.slice(0, 3),
        outputJax: containers[0] ? containers[0].getAttribute('jax') : null,
        lang: document.documentElement.lang, title: document.title };
    });
    results.math.push({ route, status: resp.status(), ready, ...data });
  }
  const mathOK = results.math.every(m => m.status === 200 && m.ready && m.containers > 0 && m.errors === 0 && m.zeroSize === 0 && m.containers === m.mathItems && m.rawTexLeftovers === 0);
  results.checks.push({ name: 'MathJax loads from CDN and typesets every math page', passed: mathOK,
    pages: results.math.length, totalContainers: results.math.reduce((a, m) => a + m.containers, 0),
    versions: [...new Set(results.math.map(m => m.version))] });

  // Screenshots of typeset math: desktop/mobile x light/dark.
  for (const width of [1440, 360]) for (const scheme of ['light', 'dark']) {
    const c = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: scheme, reducedMotion: 'reduce' });
    const p = await c.newPage(); instrument(p);
    await p.goto(base + '/kinh-te/toan-co-ban-2/', { waitUntil: 'load', timeout: 60000 });
    await p.waitForFunction(() => window.MathJax && window.MathJax.startup && window.MathJax.startup.promise, null, { timeout: 45000 });
    await p.evaluate(() => window.MathJax.startup.promise);
    const first = p.locator('mjx-container[display="true"]').first();
    await first.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
    await shot(p, `math-${width}-${scheme}`);
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    results.checks.push({ name: `Math page has no document horizontal overflow (${width}px ${scheme})`, passed: !overflow });
    await c.close();
  }

  // ---- Cal-Heatmap -----------------------------------------------------
  for (const scheme of ['light', 'dark']) {
    const c = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: scheme, reducedMotion: 'reduce' });
    const p = await c.newPage(); instrument(p);
    for (const route of HOME_ROUTES) {
      const resp = await p.goto(base + route, { waitUntil: 'load', timeout: 60000 });
      await p.waitForTimeout(1500); // the page applies theme colours 500 ms after init
      const data = await p.evaluate(() => {
        // Cal-Heatmap 3.3.10 emits one <rect> per day inside .graph-subdomain-group (no per-cell class when legendColors is set).
        const rects = [...document.querySelectorAll('#cal-heatmap .graph-subdomain-group rect')];
        const fills = {}; rects.forEach(r => { const f = getComputedStyle(r).fill; fills[f] = (fills[f] || 0) + 1; });
        // Expected day cells: the six calendar months starting at the page's own startDate.
        const first = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        const end = new Date(first.getFullYear(), first.getMonth() + 6, 1);
        const expectedCells = Math.round((end - first) / 86400000);
        const postDays = Object.keys(postData).map(Number);
        const postDaysInWindow = postDays.filter(t => t * 1000 >= first.getTime() && t * 1000 < end.getTime()).length;
        return { d3: typeof d3 === 'object' || typeof d3 === 'function' ? d3.version : null,
          calHeatMap: typeof CalHeatMap, instance: typeof cal === 'object' && !!cal,
          svg: document.querySelectorAll('#cal-heatmap svg.cal-heatmap-container').length,
          domains: document.querySelectorAll('#cal-heatmap .graph-domain').length,
          labels: [...document.querySelectorAll('#cal-heatmap .graph-label')].map(l => l.textContent),
          cells: rects.length, expectedCells, postDays: postDays.length, postDaysInWindow, fills,
          theme: document.documentElement.getAttribute('data-theme'), lang: document.documentElement.lang };
      });
      // Tooltip is created on hover over a day cell.
      let tooltip = null;
      const cell = p.locator('#cal-heatmap .graph-subdomain-group rect').first();
      if (await cell.count()) { await cell.scrollIntoViewIfNeeded(); await cell.hover(); await p.waitForTimeout(300);
        tooltip = await p.evaluate(() => { const t = document.querySelector('.ch-tooltip'); return t ? { text: t.textContent.trim(), display: getComputedStyle(t).display } : null; }); }
      results.heatmap.push({ route, scheme, status: resp.status(), ...data, tooltip });
      if (route === '/' ) { const el = p.locator('#cal-heatmap'); await el.scrollIntoViewIfNeeded(); await p.mouse.move(0, 0); await p.waitForTimeout(200); await shot(p, `heatmap-1440-${scheme}`); }
    }
    await c.close();
  }
  { // mobile render of the heatmap
    const c = await browser.newContext({ viewport: { width: 360, height: 1000 }, colorScheme: 'light', reducedMotion: 'reduce' });
    const p = await c.newPage(); instrument(p);
    await p.goto(base + '/', { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(1500);
    const el = p.locator('#cal-heatmap'); if (await el.count()) { await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(200); }
    await shot(p, 'heatmap-360-light');
    results.heatmapMobile = await p.evaluate(() => ({ svg: document.querySelectorAll('#cal-heatmap svg.cal-heatmap-container').length, cells: document.querySelectorAll('#cal-heatmap .graph-subdomain-group rect').length,
      documentOverflow: document.documentElement.scrollWidth > innerWidth }));
    await c.close();
  }
  { // Observation only: does the in-page theme switch recolour an already rendered heatmap?
    const c = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light', reducedMotion: 'reduce' });
    const p = await c.newPage(); instrument(p);
    await p.goto(base + '/', { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(1500);
    const fill = () => p.evaluate(() => { const r = document.querySelector('#cal-heatmap .graph-subdomain-group rect'); return r ? getComputedStyle(r).fill : null; });
    const before = await fill(); await p.locator('.theme-switch').first().click(); await p.waitForTimeout(1200);
    const afterToggle = await fill(); const theme = await p.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await p.reload({ waitUntil: 'load' }); await p.waitForTimeout(1500);
    results.heatmapThemeToggle = { before, afterToggle, themeAfterToggle: theme, afterReload: await fill(), recolouredWithoutReload: before !== afterToggle };
    await c.close();
  }
  const heatOK = results.heatmap.every(h => h.status === 200 && h.d3 && h.calHeatMap === 'function' && h.instance && h.svg === 1 && h.domains === 6 && h.cells > 0 && h.cells === h.expectedCells && h.tooltip && h.tooltip.text.length > 0);
  results.checks.push({ name: 'D3 + Cal-Heatmap load from CDN and render six month domains on every home language', passed: heatOK,
    pages: results.heatmap.length, d3: [...new Set(results.heatmap.map(h => h.d3))], cells: [...new Set(results.heatmap.map(h => h.cells))] });
  // Observation, not a gate: the baseline heatmap keeps one fill in both themes (see README, existing defect).
  const fillsOf = scheme => [...new Set(results.heatmap.filter(h => h.scheme === scheme).flatMap(h => Object.keys(h.fills)))];
  results.heatmapThemeObservation = { lightFills: fillsOf('light'), darkFills: fillsOf('dark'),
    coloursDifferBetweenThemes: fillsOf('light').join('|') !== fillsOf('dark').join('|') };

  // ---- Network/trust summary ------------------------------------------
  const ext = Object.entries(results.external);
  const required = ['https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js', 'https://d3js.org/d3.v3.min.js',
    'https://cdn.jsdelivr.net/cal-heatmap/3.3.10/cal-heatmap.min.js', 'https://cdn.jsdelivr.net/cal-heatmap/3.3.10/cal-heatmap.css'];
  results.checks.push({ name: 'Required CDN resources return 200 over validated TLS', passed: required.every(u => results.external[u] && results.external[u].status === 200 && results.external[u].tls && results.external[u].sha256),
    resources: required.map(u => ({ url: u, status: results.external[u]?.status, sha256: results.external[u]?.sha256 })) });
  const cdnFailures = results.requestsFailed.filter(f => EXTERNAL_OF_INTEREST.test(f.url));
  results.checks.push({ name: 'No failed CDN request and no MathJax/CalHeatMap runtime error', passed: cdnFailures.length === 0 && !results.consoleErrors.some(e => /MathJax|CalHeatMap|d3 is not defined/i.test(e.message)),
    cdnFailures: cdnFailures.length, externalResponses: ext.length });

  fs.writeFileSync(path.join(out, 'runtime-results.json'), JSON.stringify(results, null, 2) + '\n');
  await browser.close();
  console.log(JSON.stringify({ browser: results.browser, checks: results.checks, mathPages: results.math.map(m => [m.route, m.containers, m.mathItems, m.errors, m.rawTexLeftovers]),
    heatmap: results.heatmap.map(h => [h.route, h.scheme, h.d3, h.domains, h.cells, h.expectedCells, h.postDaysInWindow, JSON.stringify(h.fills), h.tooltip && h.tooltip.text]),
    consoleErrors: results.consoleErrors.length, requestsFailed: results.requestsFailed.length, screenshots: results.screenshots.length }, null, 1));
  if (results.checks.some(c => !c.passed)) process.exitCode = 1;
})().catch(e => { console.error(e); process.exit(1); });
