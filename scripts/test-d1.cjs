// D1 acceptance harness (article reading layer).
// Usage: D1_BASE=http://127.0.0.1:1338 D1_OUT=/tmp/d1 D1_AXE=/path/axe.min.js node scripts/test-d1.cjs
// Browser: Playwright's bundled Chromium by default; CHROMIUM_PATH selects another binary.
// Certificate validation stays on (MathJax loads from cdn.jsdelivr.net).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const base = (process.env.D1_BASE || 'http://127.0.0.1:1338').replace(/\/$/, '');
const out = process.env.D1_OUT || '/tmp/d1-qa';
const axePath = process.env.D1_AXE || require.resolve('axe-core/axe.min.js', { paths: [process.cwd(), '/home/user/axe'] });
const shots = path.join(out, 'screenshots');
fs.mkdirSync(shots, { recursive: true });
const result = { base, date: new Date().toISOString(), cases: [], sticky: [], pages: [], checks: [], axe: [] };
const check = (name, passed, detail = {}) => result.checks.push({ name, passed: !!passed, ...detail });
const NASH = '/kinh-te/game_theory_nash/';
const settle = page => page.evaluate(async () => {
  if (window.MathJax?.startup?.promise) await MathJax.startup.promise;
  await document.fonts.ready;
}).catch(() => {});

(async () => {
  const launch = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};
  const browser = await chromium.launch(launch);
  const open = async (route, { width = 1440, height = 900, scheme = 'light' } = {}) => {
    const context = await browser.newContext({ viewport: { width, height }, colorScheme: scheme, reducedMotion: 'reduce', deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = [], failed = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('requestfailed', r => failed.push({ url: r.url(), error: r.failure()?.errorText }));
    const response = await page.goto(base + route, { waitUntil: 'load', timeout: 60000 });
    await settle(page); await page.waitForTimeout(250);
    return { context, page, errors, failed, status: response.status() };
  };

  // 1. Matrix: Nash essay at 1440/1024/390 × light/dark; start, middle and footer viewports.
  for (const [width, height] of [[1440, 900], [1024, 768], [390, 844]]) for (const scheme of ['light', 'dark']) {
    const { context, page, errors, failed, status } = await open(NASH, { width, height, scheme });
    const info = await page.evaluate(() => {
      const box = s => { const r = document.querySelector(s)?.getBoundingClientRect(); return r && { left: r.left, right: r.right, width: r.width, center: r.left + r.width / 2 }; };
      const mod = s => { const r = document.querySelector(s)?.getBoundingClientRect(); return r && { width: Math.round(r.width), height: Math.round(r.height) }; };
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        viewport: innerWidth,
        prose: box('.d1-article .prose'), header: box('.d1-article .article-header'), nav: box('#site-nav'), aside: box('.article-aside'), footer: box('.d1-article .article-footer'),
        asidePosition: getComputedStyle(document.querySelector('.article-aside')).position,
        h2Links: document.querySelectorAll('.toc > nav > ul > li > a').length,
        toggles: document.querySelectorAll('.toc-toggle').length,
        discovery: [...document.querySelectorAll('.d1-discovery .discovery-module')].map(m => m.classList[1]),
        headings: [...document.querySelectorAll('.d1-discovery h2')].map(n => n.textContent.trim()),
        featured: document.querySelectorAll('.essay-feature').length,
        featuredArt: !!document.querySelector('.essay-feature .essay-feature-art img'),
        supporting: document.querySelectorAll('.essay-supporting li').length,
        sources: document.querySelectorAll('.source-item').length,
        modules: { essays: mod('.discovery-essays'), reading: mod('.discovery-reading') },
        relatedReading: document.querySelectorAll('.related-reading').length,
        bodyBackground: getComputedStyle(document.body).backgroundImage,
        mathErrors: document.querySelectorAll('mjx-merror').length,
        mathContainers: document.querySelectorAll('mjx-container').length,
        favicon: document.querySelector('link[rel="icon"]')?.getAttribute('href'),
        tocNavLabel: document.querySelector('.d1-article .toc nav')?.getAttribute('aria-label'),
        asideLabel: document.querySelector('.article-aside')?.getAttribute('aria-label'),
        toggleLabels: [...document.querySelectorAll('.toc-toggle')].map(b => b.getAttribute('aria-label')),
        sourceLinks: [...document.querySelectorAll('.source-item .discovery-cta')].map(a => a.getAttribute('href')),
        doubleRules: [...document.querySelectorAll('.d1-article .prose hr + h2')].filter(h => getComputedStyle(h).borderTopStyle !== 'none').length,
        tocTopBorder: getComputedStyle(document.querySelector('.d1-article .toc')).borderTopStyle,
        ornamentStroke: (() => { const g = document.querySelector('.toc-ornament svg g, .article-landscape svg g'); return g && getComputedStyle(g).stroke; })(),
      };
    });
    const prefix = `nash-${width}-${scheme}`;
    await page.screenshot({ path: path.join(shots, `${prefix}-start.png`) });
    await page.evaluate(() => { const p = document.querySelector('.d1-article .prose'); scrollTo(0, p.offsetTop + p.offsetHeight * 0.5); });
    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(shots, `${prefix}-middle.png`) });
    await page.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach(i => { i.loading = 'eager'; }));
    await page.evaluate(() => { const f = document.querySelector('.d1-article .article-footer'); scrollTo(0, f.getBoundingClientRect().top + scrollY - 24); });
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(shots, `${prefix}-footer.png`) });
    const fp = await page.evaluate(() => { const f = document.querySelector('.d1-article .article-footer').getBoundingClientRect(); return { y: f.top + scrollY, h: f.height }; });
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(shots, `${prefix}-footer-full.png`), fullPage: true, clip: { x: 0, y: Math.max(0, fp.y - 16), width, height: fp.h + 32 } });
    result.cases.push({ width, height, scheme, status, errors, failed, ...info });
    await context.close();
  }

  const desktop = result.cases.filter(c => c.width === 1440);
  const tablet = result.cases.filter(c => c.width === 1024);
  const mobile = result.cases.filter(c => c.width === 390);
  const centred = c => Math.abs(c.prose.center - c.viewport / 2) <= 2;
  check('All 6 Nash states load (HTTP 200) without horizontal overflow, page errors or failed requests', result.cases.every(c => c.status === 200 && !c.overflow && !c.errors.length && !c.failed.length), { states: result.cases.map(c => ({ w: c.width, s: c.scheme, overflow: c.overflow, errors: c.errors, failed: c.failed })) });
  check('Prose column centre within 2px of the viewport centre at 1440, 1024 and 390', result.cases.every(centred), { centres: result.cases.map(c => [c.width, c.scheme, +c.prose.center.toFixed(2), c.viewport / 2]) });
  check('Article header and footer share the prose centre (±2px)', result.cases.every(c => Math.abs(c.header.center - c.prose.center) <= 2 && Math.abs(c.footer.center - c.prose.center) <= 2));
  check('Desktop rail sits left of the prose without overlap; tablet/mobile put it in flow', desktop.every(c => c.asidePosition === 'absolute' && c.aside.right <= c.prose.left - 16) && [...tablet, ...mobile].every(c => c.asidePosition === 'static'), { positions: result.cases.map(c => [c.width, c.asidePosition]) });
  check('Desktop navigation centred within 2px', desktop.every(c => Math.abs(c.nav.center - c.viewport / 2) <= 2), { centres: desktop.map(c => c.nav.center) });
  check('TOC has H2 links and H3 toggles', result.cases.every(c => c.h2Links > 0 && c.toggles > 0), { h2: result.cases[0].h2Links, toggles: result.cases[0].toggles });
  check('Footer: Further Essays then Curated Reading; one featured essay with its artwork, up to two supporting; three sources', result.cases.every(c => c.discovery.join('|') === 'discovery-essays|discovery-reading' && c.featured === 1 && c.featuredArt && c.supporting <= 2 && c.supporting >= 1 && c.sources === 3), { headings: result.cases[0].headings, supporting: result.cases[0].supporting });
  check('Both discovery modules have the same width (equal prominence)', result.cases.every(c => c.modules.essays.width === c.modules.reading.width), { modules: result.cases.map(c => [c.width, c.modules]) });
  check('Old duplicate "Related reading" list removed; no texture behind the page', result.cases.every(c => c.relatedReading === 0 && c.bodyBackground === 'none'));
  check('TOC: one labelled navigation landmark (no unlabelled nav, no nested aside landmark); toggle names localised', result.cases.every(c => c.tocNavLabel === 'Nội dung' && !c.asideLabel && c.toggleLabels.length && c.toggleLabels.every(l => l.startsWith('Mục con của ') && l.length > 12)), { navLabel: result.cases[0].tocNavLabel, toggles: result.cases[0].toggleLabels });
  check('Curated Reading: every source opens its verified external page', result.cases.every(c => c.sourceLinks.length === 3 && c.sourceLinks.every(h => /^https:\/\//.test(h))), { links: result.cases[0].sourceLinks });
  check('No doubled rules: a Markdown rule before a section heading and the TOC top border are not drawn twice', result.cases.every(c => c.doubleRules === 0 && c.tocTopBorder === 'none'));
  check('No MathJax errors and formulas rendered', result.cases.every(c => c.mathErrors === 0 && c.mathContainers > 0), { containers: result.cases.map(c => c.mathContainers) });
  check('Ornament line colour follows the theme (inline SVG, currentColor)', new Set(desktop.map(c => c.ornamentStroke)).size === 2, { strokes: desktop.map(c => [c.scheme, c.ornamentStroke]) });

  // 2. Sticky TOC and progress through a long essay at desktop sizes.
  for (const [width, height] of [[1440, 900], [1280, 720]]) {
    const { context, page } = await open(NASH, { width, height });
    const H = await page.evaluate(() => { const r = document.querySelector('.d1-article .prose').getBoundingClientRect(); return { top: r.top + scrollY, h: r.height }; });
    for (const f of [0.1, 0.25, 0.5, 0.75, 0.98]) {
      await page.evaluate(y => scrollTo(0, y), H.top + f * (H.h - height)); await page.waitForTimeout(300);
      const s = await page.evaluate(() => {
        const t = document.querySelector('.d1-article .toc').getBoundingClientRect();
        const pr = document.querySelector('.reading-progress').getBoundingClientRect();
        const cur = document.querySelector('.toc a[aria-current="location"]');
        const curBox = cur?.getBoundingClientRect();
        const open = [...document.querySelectorAll('.toc-section')].filter(s => !s.querySelector(':scope > ul').hidden).map(s => s.querySelector(':scope > a').textContent.trim().slice(0, 30));
        // The heading the reader is on: last whose top passed 30% of the viewport.
        let expected = null;
        document.querySelectorAll('.d1-article .prose :is(h2,h3)[id]').forEach(h => { if (h.getBoundingClientRect().top <= innerHeight * 0.3 && document.querySelector(`.toc a[href="#${CSS.escape(h.id)}"]`)) expected = h.id; });
        return { tocTop: Math.round(t.top), tocBottom: Math.round(t.bottom), inView: t.top >= 0 && t.bottom <= innerHeight, progressTop: Math.round(pr.top), progress: +document.querySelector('.reading-progress').getAttribute('aria-valuenow'), current: cur && decodeURIComponent(cur.getAttribute('href').slice(1)), expected, currentVisible: !!curBox && curBox.top >= t.top && curBox.bottom <= t.bottom, open };
      });
      result.sticky.push({ width, height, fraction: f, ...s });
      if (width === 1440 && (f === 0.5 || f === 0.98)) await page.screenshot({ path: path.join(shots, `nash-1440-sticky-${Math.round(f * 100)}.png`) });
    }
    await context.close();
  }
  check('TOC panel and progress stay fully in view at 10/25/50/75/98% of the essay (1440×900, 1280×720)', result.sticky.every(s => s.inView && s.progressTop >= 0 && s.progressTop < 40), { sticky: result.sticky.map(s => [s.width, s.fraction, s.tocTop, s.tocBottom]) });
  check('Active TOC entry matches the heading being read and is visible inside the panel', result.sticky.every(s => s.current === s.expected && s.currentVisible), { pairs: result.sticky.map(s => [s.fraction, s.current, s.expected]) });
  check('H3 lists collapse contextually: at most one section open at each position', result.sticky.every(s => s.open.length <= 1), { open: result.sticky.map(s => s.open) });
  check('Progress tracks the article body (monotonic, 0–100)', result.sticky.filter(s => s.width === 1440).every((s, i, a) => i === 0 || s.progress > a[i - 1].progress) && result.sticky.every(s => s.progress >= 0 && s.progress <= 100), { progress: result.sticky.map(s => s.progress) });

  // 3. Manual toggle respected while scrolling; deep link; keyboard.
  {
    const { context, page } = await open(NASH);
    const toggle = page.locator('.toc-toggle').last();
    const before = await toggle.getAttribute('aria-expanded'); await toggle.click(); const after = await toggle.getAttribute('aria-expanded');
    await page.evaluate(() => { const p = document.querySelector('.d1-article .prose'); scrollTo(0, p.offsetTop + p.offsetHeight * 0.3); }); await page.waitForTimeout(300);
    const kept = await toggle.getAttribute('aria-expanded');
    check('A section opened by hand stays open while the reader is elsewhere', before === 'false' && after === 'true' && kept === 'true', { before, after, kept });
    await page.goto(`${base}${NASH}#4-nash-equilibrium`, { waitUntil: 'load' }); await settle(page); await page.waitForTimeout(600);
    const deep = await page.evaluate(() => { const cur = document.querySelector('.toc a[aria-current]'); return { top: document.getElementById('4-nash-equilibrium')?.getBoundingClientRect().top, current: cur?.getAttribute('href'), section: cur?.closest('.toc-section, nav > ul > li')?.querySelector(':scope > a')?.getAttribute('href') }; });
    // Landing on §4 may already mark its first subsection (4.1 starts within the 30% reading line); the section must be §4.
    check('Deep link lands on its heading and the TOC marks that section', deep.top !== undefined && Math.abs(deep.top) < 120 && deep.section === '#4-nash-equilibrium', deep);
    await page.goto(base + NASH, { waitUntil: 'load' }); await page.waitForTimeout(200);
    const stops = [];
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      stops.push(await page.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return { tag: a.tagName, cls: a.className, text: (a.textContent || '').trim().slice(0, 30), outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 }; }));
    }
    check('Keyboard: skip link first, TOC links and toggles reachable, every stop has a visible outline', stops[0].cls.includes('skip-link') && stops.some(s => s.cls.includes('toc-toggle')) && stops.every(s => s.outline), { stops: stops.slice(0, 12) });
    await page.evaluate(() => document.querySelector('.discovery-essays h3 a').focus());
    const discFocus = []; for (let i = 0; i < 8; i++) { discFocus.push(await page.evaluate(() => `${document.activeElement.getAttribute('href')} ${(document.activeElement.textContent || '').trim().slice(0, 40)}`)); await page.keyboard.press('Tab'); }
    check('Footer links are reachable without duplicate stops for the same essay', new Set(discFocus).size === discFocus.length, { order: discFocus });
    await context.close();
  }

  // 4. Other essays: Vietnamese text, English page, math and tables, a page without curated reading.
  for (const [route, label] of [['/kinh-te/toan-co-ban-1/', 'vi-economics'], ['/en/kinh-te/game_theory_nash/', 'en-nash'], ['/toan-hoc/riemann-hypothesis-number-theory/', 'vi-riemann'], ['/en/toan-hoc/riemann-hypothesis-number-theory/', 'en-riemann']]) {
    for (const [width, height] of [[1440, 900], [390, 844]]) {
      const { context, page, errors, status } = await open(route, { width, height });
      const info = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        lang: document.documentElement.lang,
        prose: (() => { const r = document.querySelector('.d1-article .prose').getBoundingClientRect(); return r.left + r.width / 2; })(),
        title: document.querySelector('.article-title')?.textContent.trim(),
        titleLines: (() => { const h = document.querySelector('.article-title'); return Math.round(h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight)); })(),
        tablesScroll: [...document.querySelectorAll('.d1-article .prose table')].every(t => t.getBoundingClientRect().right <= innerWidth + 0.5),
        math: document.querySelectorAll('mjx-container').length, mathErrors: document.querySelectorAll('mjx-merror').length,
        displayMathInside: [...document.querySelectorAll('mjx-container[display="true"]')].every(m => m.getBoundingClientRect().right <= innerWidth + 0.5),
        footer: [...document.querySelectorAll('.d1-discovery .discovery-module')].map(m => m.classList[1]),
        featuredArt: !!document.querySelector('.essay-feature-art img'),
        textOnly: !!document.querySelector('.essay-feature.text-only'),
        fontSize: parseFloat(getComputedStyle(document.querySelector('.d1-article .prose > p')).fontSize),
      }));
      await page.screenshot({ path: path.join(shots, `${label}-${width}-start.png`) });
      await page.evaluate(() => { const f = document.querySelector('.d1-article .article-footer'); scrollTo(0, f.getBoundingClientRect().top + scrollY - 24); }); await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(shots, `${label}-${width}-footer.png`) });
      result.pages.push({ route, width, status, errors, ...info, centred: Math.abs(info.prose - width / 2) <= 2 });
      await context.close();
    }
  }
  check('Vietnamese, English, math and table essays: 200, centred, no overflow, tables and display math inside the viewport, no MathJax errors', result.pages.every(p => p.status === 200 && !p.errors.length && !p.overflow && p.centred && p.tablesScroll && p.displayMathInside && p.mathErrors === 0), { pages: result.pages.map(p => [p.route, p.width, p.overflow, p.centred, p.math]) });
  check('Body text is not shrunk below 16px at any tested width', result.pages.every(p => p.fontSize >= 16), { sizes: result.pages.map(p => [p.route, p.width, p.fontSize]) });

  // 5. 200% text zoom (root font size doubled) at 390 and 1440.
  for (const width of [390, 1440]) {
    const { context, page } = await open(NASH, { width, height: 900 });
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' }); await page.waitForTimeout(300);
    const z = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, innerWidth, prose: (() => { const r = document.querySelector('.d1-article .prose').getBoundingClientRect(); return { left: r.left, right: r.right }; })(), aside: getComputedStyle(document.querySelector('.article-aside')).position }));
    await page.evaluate(() => { const f = document.querySelector('.d1-article .article-footer'); scrollTo(0, f.getBoundingClientRect().top + scrollY - 24); }); await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(shots, `nash-${width}-zoom200-footer.png`) });
    result[`zoom${width}`] = z;
    check(`200% text zoom at ${width}px: no horizontal page scroll and prose inside the viewport`, z.scrollWidth <= z.innerWidth && z.prose.left >= 0 && z.prose.right <= z.innerWidth, z);
    await context.close();
  }

  // 6. Homepage untouched by D1 ornaments.
  {
    const { context, page } = await open('/');
    const home = await page.evaluate(() => ({ branches: document.querySelectorAll('.ornament, .article-headpiece').length, bg: getComputedStyle(document.body).backgroundImage }));
    check('Homepage carries no D1 article ornaments or texture', home.branches === 0 && home.bg === 'none', home);
    await context.close();
  }

  // 7. axe-core WCAG 2.1 A/AA.
  if (fs.existsSync(axePath)) {
    const axeSource = fs.readFileSync(axePath, 'utf8');
    for (const route of [NASH, '/kinh-te/toan-co-ban-1/', '/en/toan-hoc/riemann-hypothesis-number-theory/'])
      for (const [width, scheme] of [[390, 'light'], [390, 'dark'], [1440, 'light'], [1440, 'dark']]) {
        const { context, page } = await open(route, { width, scheme });
        await page.addScriptTag({ content: axeSource });
        const audit = await page.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } }));
        result.axe.push({ route, width, scheme, violations: audit.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, targets: v.nodes.slice(0, 3).map(n => n.target.join(' ')) })), incomplete: audit.incomplete.map(v => ({ id: v.id, nodes: v.nodes.length })) });
        await context.close();
      }
    check('axe: no automatic WCAG 2.1 A/AA violations (3 essays × 390/1440 × light/dark)', result.axe.every(a => !a.violations.length), { violations: result.axe.filter(a => a.violations.length) });
  } else check('axe-core available', false, { axePath });

  await browser.close();
  fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result.checks.map(c => [c.passed ? 'PASS' : 'FAIL', c.name]), null, 1));
  if (result.checks.some(c => !c.passed)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exit(1); });
