// D2 content and media blocks: behaviour checks and review screenshots.
// Usage: BASE=http://127.0.0.1:1353 OUT=/tmp/d2 AXE=/path/axe.min.js ROUTE=/kinh-te/<page>/ node docs/audits/d2/tools/d2-check.cjs
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const base = (process.env.BASE || 'http://127.0.0.1:1353').replace(/\/$/, ''), out = process.env.OUT || '/tmp/d2'; fs.mkdirSync(out, { recursive: true });
const route = process.env.ROUTE || '/kinh-te/d2-mau-matching-pennies/';
const axe = process.env.AXE && fs.readFileSync(process.env.AXE, 'utf8');
const checks = []; const check = (n, ok, d = {}) => { checks.push({ name: n, passed: !!ok, ...d }); console.log(ok ? 'PASS' : 'FAIL', n); };
(async () => {
  const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const plotColour = {};
  for (const [w, h] of [[1440, 900], [390, 844]]) for (const scheme of ['light', 'dark']) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, reducedMotion: 'reduce' }); const p = await ctx.newPage(); const errors = [];
    p.on('pageerror', e => errors.push(e.message));
    const res = await p.goto(base + route, { waitUntil: 'load' });
    await p.evaluate(async () => { if (window.MathJax?.startup?.promise) await MathJax.startup.promise; await document.fonts.ready; }); await p.waitForTimeout(400);
    const info = await p.evaluate(() => {
      const tags = [...document.querySelectorAll('mjx-container[display="true"]')].map(m => (m.textContent.match(/^\((\d+)\)/) || [])[1]).filter(Boolean);
      const refs = [...document.querySelectorAll('.prose a.eqref')].map(a => { const t = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1))); return { href: a.getAttribute('href'), text: a.textContent.trim(), ok: !!t, eqTag: t ? (t.textContent.match(/^\((\d+)\)/) || [])[1] : null }; });
      const path = document.querySelector('.plot-svg path[style*="--plot-1"], .plot-svg path[style*="plot-1"]');
      return {
        overflow: document.documentElement.scrollWidth > innerWidth, mathErrors: document.querySelectorAll('mjx-merror').length, tags, refs,
        callouts: [...document.querySelectorAll('.callout')].map(c => c.querySelector('.callout-label').textContent.trim()),
        fig: document.querySelector('.plot-figure figcaption .fig-label')?.textContent.trim(), tab: document.querySelector('.table-figure caption .fig-label')?.textContent.trim(),
        plotRole: document.querySelector('.plot-svg')?.getAttribute('role'), plotLabel: (document.querySelector('.plot-svg')?.getAttribute('aria-label') || '').length,
        plotStroke: path ? getComputedStyle(path).stroke : null, handFont: (() => { const t = [...document.querySelectorAll('.plot-svg text')].find(t => /patrick hand/i.test(getComputedStyle(t).fontFamily)); return t ? getComputedStyle(t).fontFamily : null; })(),
        handLoaded: document.fonts.check('16px "Patrick Hand"'), frames: [...document.querySelectorAll('.storyboard img')].map(i => i.complete && i.naturalWidth > 0),
      };
    });
    plotColour[`${w}-${scheme}`] = info.plotStroke;
    if (w === 1440 && scheme === 'light') {
      check('Display equations are numbered (1), (2) and every eqref link reaches its equation with the same number', info.tags.length >= 2 && info.tags[0].includes('1') && info.refs.length >= 2 && info.refs.every(r => r.ok && r.eqTag === r.text.replace(/[()]/g, '')), { tags: info.tags, refs: info.refs });
      check('Callouts render with localised labels (Định nghĩa, Cảnh báo, Định lý)', ['Định nghĩa', 'Cảnh báo', 'Định lý'].every(k => info.callouts.some(c => c.startsWith(k))), { callouts: info.callouts });
      check('Figure and table are numbered (Hình 1, Bảng 1)', info.fig === 'Hình 1.' && info.tab === 'Bảng 1.', { fig: info.fig, tab: info.tab });
      check('Plot is an image with a text alternative; annotation uses the handwriting face, which is loaded', info.plotRole === 'img' && info.plotLabel > 20 && /patrick hand/i.test(info.handFont || '') && info.handLoaded, info);
      check('Storyboard frames load', info.frames.length === 3 && info.frames.every(Boolean), { frames: info.frames });
      if (axe) { await p.addScriptTag({ content: axe }); const v = await p.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] })).violations.map(x => [x.id, x.nodes.length])); check('axe WCAG 2.1 A/AA: 0 violations', !v.length, { v }); }
    }
    check(`${w} ${scheme}: HTTP 200, no overflow, no page or MathJax errors`, res.status() === 200 && !info.overflow && !errors.length && !info.mathErrors, { errors, mathErrors: info.mathErrors });
    await p.screenshot({ path: path.join(out, `d2-${w}-${scheme}.png`), fullPage: true });
    if (w === 1440) for (const sel of ['.table-figure', '.plot-figure', '.callout-theorem']) {
      const el = p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await p.evaluate(() => scrollBy(0, -160)); await p.waitForTimeout(150);
      await p.screenshot({ path: path.join(out, `d2-${w}-${scheme}-${sel.replace(/[^a-z]/g, '')}.png`) });
    }
    await ctx.close();
  }
  check('Plot colours follow the theme (series 1 differs between light and dark)', plotColour['1440-light'] && plotColour['1440-light'] !== plotColour['1440-dark'], { plotColour });
  await b.close(); fs.writeFileSync(path.join(out, 'd2-results.json'), JSON.stringify(checks, null, 1));
  const f = checks.filter(c => !c.passed); console.log(`${checks.length - f.length}/${checks.length} passed`); if (f.length) process.exitCode = 1;
})();
