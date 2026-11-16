// D1 acceptance harness. Usage: D1_BASE=http://127.0.0.1:1331 D1_OUT=/tmp/d1 node scripts/test-d1.cjs
// Uses system Chromium deliberately so it can run in the managed environment without downloading a browser.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const base = (process.env.D1_BASE || 'http://127.0.0.1:1331').replace(/\/$/, '');
const out = process.env.D1_OUT || '/tmp/d1-qa';
const axePath = process.env.D1_AXE || '/tmp/p2-qa/node_modules/axe-core/axe.min.js';
const ignoreHTTPSErrors = process.env.D1_IGNORE_HTTPS_ERRORS === '1';
fs.mkdirSync(path.join(out, 'screenshots'), { recursive: true });
const result = { base, cases: [], checks: [], axe: [] };
const check = (name, passed, detail = {}) => result.checks.push({ name, passed: !!passed, ...detail });

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium' });
  for (const [width, height] of [[1440, 900], [1024, 768], [390, 844]]) for (const scheme of ['light', 'dark']) {
    const context = await browser.newContext({ viewport: { width, height }, colorScheme: scheme, reducedMotion: 'reduce', ignoreHTTPSErrors });
    const page = await context.newPage(); const errors = [], failed = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('requestfailed', r => failed.push({ url: r.url(), error: r.failure()?.errorText }));
    const response = await page.goto(`${base}/kinh-te/game_theory_nash/`, { waitUntil: 'load', timeout: 60000 });
    await page.evaluate(async () => { if (window.MathJax?.startup?.promise) await MathJax.startup.promise; await document.fonts.ready; }).catch(() => {});
    await page.waitForTimeout(250);
    const info = await page.evaluate(() => {
      const box = selector => { const r = document.querySelector(selector)?.getBoundingClientRect(); return r && { left: r.left, width: r.width, center: r.left + r.width / 2 }; };
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        viewport: innerWidth,
        prose: box('.prose'), nav: box('#site-nav'), aside: box('.article-aside'),
        staticAside: getComputedStyle(document.querySelector('.article-aside')).position,
        h2Links: document.querySelectorAll('.toc > nav > ul > li > a').length,
        toggles: document.querySelectorAll('.toc-toggle').length,
        progress: document.querySelector('.reading-progress')?.getAttribute('aria-valuenow'),
        discovery: [...document.querySelectorAll('.discovery-module h2')].map(n => n.textContent.trim()),
        mathErrors: document.querySelectorAll('mjx-merror').length,
        mathContainers: document.querySelectorAll('mjx-container').length,
        favicon: document.querySelector('link[rel="icon"]')?.getAttribute('href')
      };
    });
    const file = `nash-${width}-${scheme}.png`; await page.screenshot({ path: path.join(out, 'screenshots', file), fullPage: true });
    result.cases.push({ width, height, scheme, status: response.status(), errors, failed, screenshot: file, ...info });
    await context.close();
  }

  const desktop = result.cases.filter(c => c.width === 1440);
  const tablet = result.cases.filter(c => c.width === 1024);
  const mobile = result.cases.filter(c => c.width === 390);
  check('All desktop/tablet/mobile article states load without overflow or page errors', result.cases.every(c => c.status === 200 && !c.overflow && !c.errors.length), { states: result.cases.length });
  check('Wide prose centre is within 1px of viewport centre', desktop.every(c => Math.abs(c.prose.center - c.viewport / 2) <= 1), { centres: desktop.map(c => c.prose.center) });
  check('Tablet moves the rail into normal flow before it can collide with prose', tablet.every(c => c.staticAside === 'static'), { positions: tablet.map(c => c.staticAside) });
  check('Mobile prose remains fluid and centred', mobile.every(c => Math.abs(c.prose.center - c.viewport / 2) <= 1), { centres: mobile.map(c => c.prose.center) });
  check('TOC has visible top-level links, independent H3 toggles and a restrained progress control', result.cases.every(c => c.h2Links > 0 && c.toggles > 0 && c.progress !== null), { sample: result.cases[0] });
  check('Further Essays precedes Curated Reading and the favicon is the D1 vector', result.cases.every(c => c.discovery.join('|') === 'Further Essays|Curated Reading / Resources' && c.favicon === '/images/favicon.svg'));
  check('No MathJax render errors after loading', result.cases.every(c => c.mathErrors === 0), { errors: result.cases.map(c => c.mathErrors), containers: result.cases.map(c => c.mathContainers) });
  if (process.env.D1_REQUIRE_MATH_RENDER === '1') check('MathJax renders the article formulae', result.cases.every(c => c.mathContainers > 0), { containers: result.cases.map(c => c.mathContainers) });
  check('Desktop navigation is visually centred independent of side controls', desktop.every(c => Math.abs(c.nav.center - c.viewport / 2) <= 2), { centres: desktop.map(c => c.nav.center) });

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', reducedMotion: 'reduce', ignoreHTTPSErrors });
  const page = await context.newPage(); await page.goto(`${base}/kinh-te/game_theory_nash/`, { waitUntil: 'load' });
  const toggle = page.locator('.toc-toggle').nth(1); const before = await toggle.getAttribute('aria-expanded'); await toggle.click(); const after = await toggle.getAttribute('aria-expanded');
  await page.evaluate(() => scrollTo(0, document.querySelector('.prose').offsetTop + 600)); await page.waitForTimeout(100);
  const progress = await page.locator('.reading-progress').getAttribute('aria-valuenow');
  check('A TOC subsection toggle preserves its manual expansion state and progress changes within prose', before !== after && Number(progress) > 0 && Number(progress) < 100, { before, after, progress });
  await page.goto(`${base}/kinh-te/game_theory_nash/#4-nash-equilibrium`, { waitUntil: 'load' }); await page.waitForTimeout(250);
  check('Existing deep-link anchor remains present', await page.locator('[id="4-nash-equilibrium"]').count() === 1);
  await context.close();

  const zoomContext = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light', reducedMotion: 'reduce', ignoreHTTPSErrors });
  const zoomPage = await zoomContext.newPage(); await zoomPage.goto(`${base}/kinh-te/game_theory_nash/`, { waitUntil: 'load' });
  await zoomPage.addStyleTag({ content: 'html { font-size: 200% !important; }' }); await zoomPage.waitForTimeout(150);
  check('200% text zoom preserves a horizontal-scroll-free reading page', await zoomPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth), { scrollWidth: await zoomPage.evaluate(() => document.documentElement.scrollWidth) });
  await zoomContext.close();

  if (fs.existsSync(axePath)) {
    const axeSource = fs.readFileSync(axePath, 'utf8');
    for (const [width, scheme] of [[390, 'light'], [390, 'dark'], [1440, 'light'], [1440, 'dark']]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, ignoreHTTPSErrors }); const page = await context.newPage();
      await page.goto(`${base}/kinh-te/game_theory_nash/`, { waitUntil: 'load' }); await page.addScriptTag({ content: axeSource });
      const audit = await page.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } }));
      result.axe.push({ width, scheme, violations: audit.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length })), incomplete: audit.incomplete.map(v => ({ id: v.id, nodes: v.nodes.length })) });
      await context.close();
    }
    check('axe has no automatic WCAG 2.1 A/AA violations on the D1 article states', result.axe.every(a => !a.violations.length), { axe: result.axe });
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ states: result.cases.length, checks: result.checks.map(c => [c.passed, c.name]), axe: result.axe }, null, 2));
  if (result.checks.some(c => !c.passed)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exit(1); });
