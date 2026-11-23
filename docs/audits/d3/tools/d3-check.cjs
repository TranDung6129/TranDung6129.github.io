// D3 citations, sidenotes and references: behaviour checks and review screenshots.
// Usage: BASE=http://127.0.0.1:1351 OUT=/tmp/d3 AXE=/path/axe.min.js node docs/audits/d3/tools/d3-check.cjs
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const base = (process.env.BASE || 'http://127.0.0.1:1351').replace(/\/$/, '');
const out = process.env.OUT || '/tmp/d3'; fs.mkdirSync(out, { recursive: true });
const PAGES = [['riemann-vi', '/toan-hoc/riemann-hypothesis-number-theory/'], ['nash-en', '/en/kinh-te/game_theory_nash/']];
const checks = []; const check = (name, ok, detail = {}) => { checks.push({ name, passed: !!ok, ...detail }); console.log(ok ? 'PASS' : 'FAIL', name); };
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const axe = process.env.AXE && fs.readFileSync(process.env.AXE, 'utf8');
  for (const [name, route] of PAGES) {
    for (const scheme of ['light', 'dark']) {
      // Wide: note in the margin, preview on hover, reference list, target highlight.
      let ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: scheme, reducedMotion: 'reduce' });
      let p = await ctx.newPage(); const errors = []; p.on('pageerror', e => errors.push(e.message));
      await p.goto(base + route, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
      const wide = await p.evaluate(() => {
        const ids = [...document.querySelectorAll('a.cite')].map(a => a.id), back = [...document.querySelectorAll('.ref-back a')].map(a => a.getAttribute('href').slice(1));
        const refs = [...document.querySelectorAll('ol.references li')].map(li => li.id);
        const sorted = [...document.querySelectorAll('ol.references .ref-authors')].map(s => s.textContent.toLowerCase());
        const prose = document.querySelector('.d1-article .prose').getBoundingClientRect();
        const notes = [...document.querySelectorAll('.sn-body')].map(n => { const r = n.getBoundingClientRect(); return { left: r.left, right: r.right, visible: getComputedStyle(n).display !== 'none' }; });
        return { ids, back, refs, sortedOk: sorted.every((s, i) => i === 0 || sorted[i - 1].localeCompare(s) <= 0), citesResolve: [...document.querySelectorAll('a.cite')].every(a => document.getElementById(a.getAttribute('href').slice(1))), notes, proseRight: prose.right, overflow: document.documentElement.scrollWidth > innerWidth, expanded: [...document.querySelectorAll('.sn-mark')].map(b => b.getAttribute('aria-expanded')) };
      });
      if (scheme === 'light') {
        check(`${name}: every citation has a reference entry and every entry links back to each citation`, wide.citesResolve && JSON.stringify([...wide.ids].sort()) === JSON.stringify([...wide.back].sort()), { ids: wide.ids, back: wide.back });
        check(`${name}: reference list is A–Z by first author`, wide.sortedOk && wide.refs.length > 0, { refs: wide.refs });
        check(`${name}: at 1440 px notes sit in the right margin, clear of the prose, expanded`, wide.notes.length && wide.notes.every(n => n.visible && n.left >= wide.proseRight + 16 && n.right <= 1440 - 16) && wide.expanded.every(x => x === 'true'), { notes: wide.notes, proseRight: wide.proseRight });
        if (axe) { await p.addScriptTag({ content: axe }); const v = await p.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] })).violations.map(x => [x.id, x.nodes.length])); check(`${name}: axe WCAG 2.1 A/AA, 0 violations`, !v.length, { v }); }
      }
      check(`${name} ${scheme}: no overflow or page errors at 1440`, !wide.overflow && !errors.length, { errors });
      const sn = p.locator('.sn').first(); await sn.scrollIntoViewIfNeeded(); await p.evaluate(() => scrollBy(0, -200)); await p.waitForTimeout(200);
      await p.screenshot({ path: path.join(out, `${name}-1440-${scheme}-sidenote.png`) });
      const cite = p.locator('a.cite').first(); await cite.scrollIntoViewIfNeeded(); await p.evaluate(() => scrollBy(0, -250)); await cite.focus(); await p.waitForTimeout(150);
      const prev = await p.evaluate(() => { const c = document.querySelector('.cite-preview'); return c && { text: c.textContent.trim().slice(0, 60), hidden: c.getAttribute('aria-hidden') }; });
      if (scheme === 'light') check(`${name}: keyboard focus on a citation shows its reference preview (visual only)`, prev && prev.hidden === 'true' && prev.text.length > 10, { prev });
      await p.screenshot({ path: path.join(out, `${name}-1440-${scheme}-preview.png`) });
      await p.keyboard.press('Escape'); await p.keyboard.press('Enter'); await p.waitForTimeout(400);
      const atRef = await p.evaluate(() => ({ hash: location.hash, top: Math.round(document.querySelector(location.hash).getBoundingClientRect().top) }));
      await p.screenshot({ path: path.join(out, `${name}-1440-${scheme}-references.png`) });
      await p.locator(`${atRef.hash} .ref-back a`).first().click(); await p.waitForTimeout(400);
      const back = await p.evaluate(() => ({ hash: location.hash, top: Math.round(document.querySelector(location.hash).getBoundingClientRect().top) }));
      if (scheme === 'light') check(`${name}: citation → reference → back to the same citation`, atRef.hash.startsWith('#ref-') && atRef.top >= -2 && atRef.top < 300 && back.hash.startsWith('#cite-') && back.top >= -2 && back.top < 400, { atRef, back });
      await ctx.close();
      // Narrow: notes folded behind their number; the button opens them in place.
      ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: scheme, reducedMotion: 'reduce' });
      p = await ctx.newPage(); await p.goto(base + route, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
      const mark = p.locator('.sn-mark').first(); await mark.scrollIntoViewIfNeeded(); await p.evaluate(() => scrollBy(0, -200));
      const closed = await p.evaluate(() => ({ shown: getComputedStyle(document.querySelector('.sn-body')).display !== 'none', exp: document.querySelector('.sn-mark').getAttribute('aria-expanded'), overflow: document.documentElement.scrollWidth > innerWidth }));
      await p.screenshot({ path: path.join(out, `${name}-390-${scheme}-note-closed.png`) });
      await mark.focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(150);
      const open = await p.evaluate(() => ({ shown: getComputedStyle(document.querySelector('.sn-body')).display !== 'none', exp: document.querySelector('.sn-mark').getAttribute('aria-expanded') }));
      await p.screenshot({ path: path.join(out, `${name}-390-${scheme}-note-open.png`) });
      if (scheme === 'light') check(`${name}: at 390 px a note is folded, opens with the keyboard, aria-expanded follows; no overflow`, !closed.shown && closed.exp === 'false' && open.shown && open.exp === 'true' && !closed.overflow, { closed, open });
      await p.evaluate(() => document.querySelector('ol.references').scrollIntoView()); await p.evaluate(() => scrollBy(0, -80));
      await p.screenshot({ path: path.join(out, `${name}-390-${scheme}-references.png`) });
      await ctx.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'd3-results.json'), JSON.stringify(checks, null, 1));
  const failed = checks.filter(c => !c.passed); console.log(`${checks.length - failed.length}/${checks.length} passed`);
  if (failed.length) process.exitCode = 1;
})();
