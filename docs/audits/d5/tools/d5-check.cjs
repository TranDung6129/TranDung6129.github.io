// D5 visual board and ornaments in context: screenshots plus overflow/error/axe checks.
// Usage: BASE=http://127.0.0.1:1352 OUT=/tmp/d5 AXE=/path/axe.min.js node docs/audits/d5/tools/d5-check.cjs
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const base = (process.env.BASE || 'http://127.0.0.1:1352').replace(/\/$/, ''); const out = process.env.OUT || '/tmp/d5'; fs.mkdirSync(out, { recursive: true });
const axe = process.env.AXE && fs.readFileSync(process.env.AXE, 'utf8');
const PAGES = [['board', '/d5-board/'], ['riemann', '/toan-hoc/riemann-hypothesis-number-theory/'], ['nash-vi', '/kinh-te/ly-thuyet-tro-choi-nash/']];
(async () => {
  const b = await chromium.launch(); const res = [];
  for (const [n, r] of PAGES) for (const [w, h] of [[1440, 900], [390, 844]]) for (const scheme of ['light', 'dark']) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: scheme }); const p = await ctx.newPage(); const errors = [];
    p.on('pageerror', e => errors.push(e.message)); const failed = []; p.on('requestfailed', q => failed.push(q.url()));
    await p.goto(base + r, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    const info = await p.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, masks: [...document.querySelectorAll('.ornament-mask')].map(e => { const c = getComputedStyle(e); return { w: Math.round(e.getBoundingClientRect().width), h: Math.round(e.getBoundingClientRect().height), shown: e.checkVisibility() }; }) }));
    let v = null; if (axe && scheme === 'light') { await p.addScriptTag({ content: axe }); v = await p.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] })).violations.map(x => [x.id, x.nodes.length])); }
    await p.screenshot({ path: path.join(out, `${n}-${w}-${scheme}.png`), fullPage: n === 'board' });
    if (n !== 'board' && w === 1440) { await p.evaluate(() => { const t = document.querySelector('.toc-ornament'); if (t) scrollTo(0, t.getBoundingClientRect().top + scrollY - 300); }); await p.waitForTimeout(300); await p.screenshot({ path: path.join(out, `${n}-${w}-${scheme}-toc.png`) });
      await p.evaluate(() => { const l = document.querySelector('.article-landscape'); if (l) scrollTo(0, l.getBoundingClientRect().top + scrollY - 500); }); await p.waitForTimeout(300); await p.screenshot({ path: path.join(out, `${n}-${w}-${scheme}-landscape.png`) }); }
    res.push({ n, w, scheme, errors, failed, ...info, violations: v }); await ctx.close();
  }
  await b.close(); fs.writeFileSync(path.join(out, 'd5-results.json'), JSON.stringify(res, null, 1));
  const bad = res.filter(x => x.overflow || x.errors.length || x.failed.length || (x.violations && x.violations.length) || x.masks.some(m => m.shown && (!m.w || !m.h)));
  console.log(`${res.length} states, ${bad.length} with problems`); bad.forEach(x => console.log(JSON.stringify(x).slice(0, 400))); if (bad.length) process.exitCode = 1;
})();
