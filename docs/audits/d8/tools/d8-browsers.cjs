// D8 cross-browser smoke: key pages in Firefox and WebKit (Chromium is covered by the other suites).
// Usage: BASE=http://127.0.0.1:1338 OUT=<dir> node docs/audits/d8/tools/d8-browsers.cjs
const pw = require('playwright'); const fs = require('fs'), path = require('path');
const base = (process.env.BASE || 'http://127.0.0.1:1338').replace(/\/$/, ''), out = process.env.OUT || '/tmp/d8b'; fs.mkdirSync(out, { recursive: true });
const ROUTES = [['home', '/'], ['journal', '/journal/'], ['essay-math', '/toan-hoc/riemann-hypothesis-number-theory/'], ['essay-en', '/en/kinh-te/game_theory_nash/'], ['series', '/series/toan-co-ban-cho-kinh-te/'], ['discover', '/discover/'], ['film', '/films/nash-animation/']];
(async () => {
  const rows = [];
  for (const name of ['firefox', 'webkit']) {
    let b; try { b = await pw[name].launch(); } catch (e) { rows.push({ browser: name, launched: false, error: e.message.split('\n')[0] }); console.log(name, 'not launchable:', e.message.split('\n')[0]); continue; }
    for (const [label, r] of ROUTES) for (const [w, h] of [[1440, 900], [390, 844]]) {
      const ctx = await b.newContext({ viewport: { width: w, height: h } }); const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
      const res = await p.goto(base + r, { waitUntil: 'load', timeout: 60000 });
      await p.evaluate(async () => { if (window.MathJax?.startup?.promise) await MathJax.startup.promise; await document.fonts.ready; }).catch(() => {}); await p.waitForTimeout(400);
      const info = await p.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth + 1, mathErrors: document.querySelectorAll('mjx-merror').length, mask: getComputedStyle(document.querySelector('.ornament-mask') || document.body).maskImage || getComputedStyle(document.querySelector('.ornament-mask') || document.body).webkitMaskImage || '' }));
      await p.screenshot({ path: path.join(out, `${name}-${label}-${w}.png`) });
      const row = { browser: name, route: r, w, status: res.status(), errors: errs.slice(0, 2), ...info }; rows.push(row);
      if (row.status !== 200 || row.overflow || row.errors.length || row.mathErrors) console.log('PROBLEM', JSON.stringify(row));
      await ctx.close();
    }
    await b.close();
  }
  fs.writeFileSync(path.join(out, 'd8-browsers.json'), JSON.stringify(rows, null, 1));
  const ran = rows.filter(r => r.route); const bad = ran.filter(r => r.status !== 200 || r.overflow || r.errors.length || r.mathErrors);
  console.log(`${ran.length} page states in ${[...new Set(ran.map(r => r.browser))].join(', ') || 'no browser'}; ${bad.length} with problems`);
  if (bad.length) process.exitCode = 1;
})();
