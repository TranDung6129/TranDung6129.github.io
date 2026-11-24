// D7 Studio: screens, keyboard, axe and read-only behaviour checks (never saves or publishes).
// Start the Studio first: node tools/studio/server.mjs   then: OUT=/tmp/d7 AXE=... node docs/audits/d7/tools/d7-check.cjs
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const base = 'http://127.0.0.1:' + (process.env.STUDIO_PORT || 4318); const out = process.env.OUT || '/tmp/d7'; fs.mkdirSync(out, { recursive: true });
const axe = process.env.AXE && fs.readFileSync(process.env.AXE, 'utf8');
const checks = []; const check = (n, ok, d = {}) => { checks.push({ name: n, passed: !!ok, ...d }); console.log(ok ? 'PASS' : 'FAIL', n); };
const runAxe = async (p, name) => { if (!axe) return; await p.addScriptTag({ content: axe }); const v = await p.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'], exclude: [['iframe']] })).violations.map(x => [x.id, x.nodes.length])); check(`${name}: axe 0 violations`, !v.length, { v }); };
(async () => {
  const b = await chromium.launch();
  for (const scheme of ['light', 'dark']) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: scheme }); const p = await ctx.newPage(); const errors = []; p.on('pageerror', e => errors.push(e.message));
    const writes = []; p.on('request', r => { if (['PUT', 'POST'].includes(r.method()) && /\/api\/(file|publish|new)/.test(r.url()) && !/dryRun/.test(r.postData() || '')) writes.push(r.url()); });
    await p.goto(base + '/#/'); await p.waitForSelector('#rows tr'); await p.evaluate(() => document.fonts.ready);
    const rows = await p.$$eval('#rows tr', r => r.length);
    if (scheme === 'light') { check('Content list shows the essays with status badges', rows >= 10, { rows }); await runAxe(p, 'content list'); }
    await p.screenshot({ path: path.join(out, `content-${scheme}.png`) });
    await p.selectOption('select[name=topic]', 'triet-hoc'); await p.waitForTimeout(150);
    const filtered = await p.$$eval('#rows tr', r => r.length);
    if (scheme === 'light') check('Topic filter narrows the list', filtered >= 1 && filtered < rows, { filtered });
    await p.goto(base + '/#/edit?path=' + encodeURIComponent('content/toan-hoc/riemann-hypothesis-number-theory.md')); await p.waitForSelector('#src');
    await p.waitForTimeout(2500);
    const ed = await p.evaluate(() => ({ title: document.querySelector('#m-title').value, src: document.querySelector('#src').value.length, cat: document.querySelector('#m-cat').value, frame: document.querySelector('#preview').src }));
    if (scheme === 'light') { check('Editor loads the essay, its metadata and a live Hugo preview', ed.title.length > 10 && ed.src > 1000 && ed.cat === 'toan-hoc' && /1414/.test(ed.frame), ed); await runAxe(p, 'editor'); }
    await p.screenshot({ path: path.join(out, `editor-${scheme}.png`) });
    await p.click('#cite'); await p.waitForSelector('#cl button'); await p.fill('#cq', 'nash'); await p.waitForTimeout(150);
    const picks = await p.$$eval('#cl button', x => x.map(y => y.textContent));
    if (scheme === 'light') check('Citation picker searches the verified source library', picks.length >= 1 && picks.every(t => /nash/i.test(t)), { picks });
    await p.screenshot({ path: path.join(out, `cite-${scheme}.png`) }); await p.keyboard.press('Escape');
    await p.goto(base + '/#/stats'); await p.waitForSelector('.stats-off, .tiles'); await p.evaluate(() => document.fonts.ready);
    if (scheme === 'light') { check('Stats screen explains how to enable no-cookie analytics while it is off', !!(await p.$('.stats-off'))); await runAxe(p, 'stats'); }
    await p.screenshot({ path: path.join(out, `stats-${scheme}.png`) });
    if (scheme === 'light') check('No save, new-essay or publish request was sent during the checks; no page errors', !writes.length && !errors.length, { writes, errors });
    await ctx.close();
  }
  await b.close(); fs.writeFileSync(path.join(out, 'd7-results.json'), JSON.stringify(checks, null, 1));
  const f = checks.filter(c => !c.passed); console.log(`${checks.length - f.length}/${checks.length} passed`); if (f.length) process.exitCode = 1;
})();
