// D4 prototype screenshots and structural checks.
// Usage: BASE=http://127.0.0.1:1350 OUT=/tmp/d4 AXE=/path/axe.min.js node docs/audits/d4/tools/d4-shots.cjs
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const base = (process.env.BASE || 'http://127.0.0.1:1350').replace(/\/$/, '');
const out = process.env.OUT || '/tmp/d4'; fs.mkdirSync(out, { recursive: true });
const PAGES = [
  ['journal', '/journal/'], ['topic-economics', '/categories/kinh-te/'], ['topic-philosophy', '/categories/triet-hoc/'],
  ['series', '/series/toan-co-ban-cho-kinh-te/'], ['essay-in-series', '/kinh-te/toan-co-ban-2/'],
  ['discover', '/discover/'], ['volumes', '/volumes/'], ['en-series', '/en/series/toan-co-ban-cho-kinh-te/'],
];
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const axe = process.env.AXE && fs.readFileSync(process.env.AXE, 'utf8');
  const results = [];
  for (const [name, route] of PAGES) for (const [w, h] of [[1440, 900], [390, 844]]) for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, reducedMotion: 'reduce' });
    const p = await ctx.newPage(); const errors = [];
    p.on('pageerror', e => errors.push(e.message));
    const res = await p.goto(base + route, { waitUntil: 'load' });
    await p.evaluate(() => document.fonts.ready);
    const info = await p.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, h1: document.querySelectorAll('h1').length, lang: document.documentElement.lang }));
    let violations = null;
    if (axe && scheme === 'light') { await p.addScriptTag({ content: axe }); violations = await p.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] })).violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length }))); }
    await p.screenshot({ path: path.join(out, `${name}-${w}-${scheme}.png`), fullPage: true });
    results.push({ name, route, w, scheme, status: res.status(), errors, ...info, violations });
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'd4-results.json'), JSON.stringify(results, null, 1));
  const bad = results.filter(r => r.status !== 200 || r.errors.length || r.overflow || r.h1 !== 1 || (r.violations && r.violations.length));
  console.log(`${results.length} states, ${bad.length} with problems`); bad.forEach(b => console.log(JSON.stringify(b)));
  process.exit(bad.length ? 1 : 0);
})();
