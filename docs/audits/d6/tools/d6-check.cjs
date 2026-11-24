// D6 discovery and monetization placements: checks and review screenshots.
// Usage: BASE=http://127.0.0.1:1354 OUT=/tmp/d6 AXE=/path/axe.min.js node docs/audits/d6/tools/d6-check.cjs
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const base = (process.env.BASE || 'http://127.0.0.1:1354').replace(/\/$/, ''), out = process.env.OUT || '/tmp/d6'; fs.mkdirSync(out, { recursive: true });
const axe = process.env.AXE && fs.readFileSync(process.env.AXE, 'utf8');
const checks = []; const check = (n, ok, d = {}) => { checks.push({ name: n, passed: !!ok, ...d }); console.log(ok ? 'PASS' : 'FAIL', n); };
const SHOTS = [['nash-vi', '/kinh-te/ly-thuyet-tro-choi-nash/', '.d1-discovery'], ['nash-en', '/en/kinh-te/game_theory_nash/', '.discovery-reading'], ['discover', '/discover/', '.buy-links'], ['support', '/kinh-te/toan-co-ban-2/', '.support']];
(async () => {
  const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  for (const [name, route, sel] of SHOTS) for (const [w, h] of [[1440, 900], [390, 844]]) for (const scheme of ['light', 'dark']) {
    if (w === 390 && scheme === 'dark') continue;
    const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: scheme }); const p = await ctx.newPage(); const errors = []; p.on('pageerror', e => errors.push(e.message));
    const res = await p.goto(base + route, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
    const info = await p.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      buy: [...document.querySelectorAll('.buy-links a')].map(a => ({ rel: a.rel, hasDisclosure: !!a.closest('.buy-links').nextElementSibling?.classList.contains('buy-disclosure') })),
      why: [...document.querySelectorAll('.essay-meta .why')].map(e => e.textContent.trim()),
      support: !!document.querySelector('.support h2'), analytics: !!document.querySelector('script[data-goatcounter]'),
    }));
    if (w === 1440 && scheme === 'light') {
      if (info.buy.length) check(`${name}: every store link is rel=sponsored with the affiliate disclosure next to it`, info.buy.every(x => /sponsored/.test(x.rel) && x.hasDisclosure), { buy: info.buy });
      if (name === 'nash-vi') check('Recommendations show their reason (editor\'s pick first)', info.why[0] === 'Biên tập chọn' && info.why.length >= 2, { why: info.why });
      if (name === 'support') check('Voluntary support block present after the article; analytics not loaded in a non-production build', info.support && !info.analytics, info);
      if (axe) { await p.addScriptTag({ content: axe }); const v = await p.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] })).violations.map(x => [x.id, x.nodes.length])); check(`${name}: axe 0 violations`, !v.length, { v }); }
    }
    check(`${name} ${w} ${scheme}: 200, no overflow or errors`, res.status() === 200 && !info.overflow && !errors.length, { errors });
    const el = p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await p.evaluate(() => scrollBy(0, -120)); await p.waitForTimeout(200);
    await p.screenshot({ path: path.join(out, `${name}-${w}-${scheme}.png`) }); await ctx.close();
  }
  await b.close(); fs.writeFileSync(path.join(out, 'd6-results.json'), JSON.stringify(checks, null, 1));
  const f = checks.filter(c => !c.passed); console.log(`${checks.length - f.length}/${checks.length} passed`); if (f.length) process.exitCode = 1;
})();
