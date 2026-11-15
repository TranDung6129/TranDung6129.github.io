// Phase 3 regression and acceptance harness (P3-07; reused live in P3-08).
//
// P4-04: Nash simulation checked on /labs/nash-explorer/, video on /films/nash-animation/, essay checked for link cards.
// Usage: BASE=http://127.0.0.1:1316 OUT=/tmp/p3 [AXE=/path/to/axe.min.js] [MATRIX_SHOTS=1] node p3-smoke.cjs
// Default Chromium options (certificate validation on, no interception). Exit 1 if a named check fails.
// 1) Matrix: 10 pages x 360/390/768/1024/1440 px x light/dark — status, theme, overflow, page errors,
//    own-site failed requests, fonts, touch-target sizes of masthead controls, screenshot.
// 2) Functional checks: navigation in four languages, search (vi/en) + Escape, theme persistence,
//    TOC, code copy, MathJax on every math page, heatmap rendering and theme colours, Nash preset /
//    keyboard / mobile fallback / poster / video, volume chapter links, mobile menu + Escape,
//    keyboard focus, no commerce wording, reduced motion.
// 3) axe-core on 8 pages x light/dark at 390 and 1440 px (when AXE is given).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const base = (process.env.BASE || 'http://127.0.0.1:1316').replace(/\/$/, '');
const out = process.env.OUT || path.join(__dirname, 'p3-output');
const shots = process.env.MATRIX_SHOTS !== '0';
fs.mkdirSync(path.join(out, 'screenshots'), { recursive: true });
const host = new URL(base).host;
const PAGES = [
  ['home', '/'], ['journal', '/journal/'], ['article', '/kinh-te/toan-co-ban-2/'], ['volume', '/volumes/volume-i/'],
  ['films', '/films/'], ['labs', '/labs/'], ['nash', '/labs/nash-explorer/'], ['discover', '/discover/'],
  ['essay', '/kinh-te/game_theory_nash/'], ['film', '/films/nash-animation/'],
];
const MATH = ['/kinh-te/toan-co-ban-1/', '/en/kinh-te/toan-co-ban-1/', '/kinh-te/toan-co-ban-2/', '/kinh-te/toan-co-ban-3/', '/kinh-te/toan-co-ban-4/',
  '/kinh-te/toan-co-ban-5/', '/en/kinh-te/toan-co-ban-5/', '/kinh-te/co-gian-cung-cau-cong-thuc/', '/kinh-te/doanh-thu-co-gian-dinh-thuc/',
  '/kinh-te/ly-thuyet-tro-choi-nash/', '/kinh-te/game_theory_nash/', '/en/kinh-te/game_theory_nash/', '/toan-hoc/riemann-hypothesis-number-theory/',
  '/en/toan-hoc/riemann-hypothesis-number-theory/', '/khoa-hoc-may-tinh/complexity-theory-quantum/', '/en/khoa-hoc-may-tinh/complexity-theory-quantum/',
  '/labs/nash-explorer/', '/en/labs/nash-explorer/'];

(async () => {
  const browser = await chromium.launch();
  const R = { base, browser: browser.version(), method: 'Headless Chromium, default launch options, certificate validation on.', matrix: [], checks: [], axe: [], thirdPartyFailures: [] };
  const own = u => { try { return new URL(u).host === host; } catch (e) { return false; } };
  const check = (name, passed, detail) => { R.checks.push({ name, passed: !!passed, ...detail }); };
  function watch(page, b) {
    page.on('pageerror', e => b.pageErrors.push(e.message.slice(0, 200)));
    page.on('requestfailed', r => { const f = { url: r.url().slice(0, 160), error: r.failure() && r.failure().errorText };
      if (f.error === 'net::ERR_ABORTED' && /\.mp4$/.test(r.url())) return; (own(r.url()) ? b.siteFailed : R.thirdPartyFailures).push(f); });
    page.on('response', r => { if (r.status() >= 400) (own(r.url()) ? b.siteFailed : R.thirdPartyFailures).push({ url: r.url().slice(0, 160), status: r.status() }); });
  }
  const settle = p => p.evaluate(async () => { if (window.MathJax && MathJax.startup && MathJax.startup.promise) await MathJax.startup.promise; await document.fonts.ready; }).catch(() => {});

  // ---- 1. Matrix ----
  for (const width of [360, 390, 768, 1024, 1440]) for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, reducedMotion: 'reduce' });
    for (const [name, route] of PAGES) {
      const page = await ctx.newPage(); const b = { pageErrors: [], siteFailed: [] }; watch(page, b);
      const resp = await page.goto(base + route, { waitUntil: 'load', timeout: 60000 });
      await settle(page); await page.waitForTimeout(300);
      const info = await page.evaluate(() => {
        const box = s => { const e = document.querySelector(s); if (!e || !e.offsetParent) return null; const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; };
        return { theme: document.documentElement.dataset.theme || 'light', bg: getComputedStyle(document.body).backgroundColor,
          overflow: document.documentElement.scrollWidth > innerWidth, scrollWidth: document.documentElement.scrollWidth,
          fonts: [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family))].filter(f => /Newsreader|Source Serif/i.test(f)),
          targets: { search: box('.search-toggle'), theme: box('.theme-toggle'), menu: box('.menu-toggle') }, h1: document.querySelectorAll('h1').length };
      });
      let file = null;
      if (shots) { file = `${name}-${width}-${scheme}.png`; await page.screenshot({ path: path.join(out, 'screenshots', file) }); }
      R.matrix.push({ page: name, route, width, scheme, status: resp.status(), ...info, pageErrors: b.pageErrors, siteFailed: b.siteFailed, screenshot: file });
      await page.close();
    }
    await ctx.close();
  }
  const M = R.matrix;
  check('Matrix: 200, theme follows scheme, no overflow, no page errors, no failed own-site requests', M.every(m => m.status === 200 && m.theme === m.scheme && !m.overflow && !m.pageErrors.length && !m.siteFailed.length), { states: M.length, failing: M.filter(m => !(m.status === 200 && m.theme === m.scheme && !m.overflow && !m.pageErrors.length && !m.siteFailed.length)).map(m => [m.page, m.width, m.scheme, m.status, m.overflow, m.pageErrors, m.siteFailed]).slice(0, 10) });
  check('Approved paper colours: light #F7F5F0, dark #1A1816', [...new Set(M.filter(m => m.scheme === 'light').map(m => m.bg))].join() === 'rgb(247, 245, 240)' && [...new Set(M.filter(m => m.scheme === 'dark').map(m => m.bg))].join() === 'rgb(26, 24, 22)');
  check('Newsreader and Source Serif 4 load on every page', M.every(m => m.fonts.length === 2));
  check('One h1 per page', M.every(m => m.h1 === 1), { exceptions: M.filter(m => m.h1 !== 1).map(m => [m.page, m.h1]).slice(0, 5) });
  check('Masthead controls are at least 44x44 px', M.every(m => Object.values(m.targets).every(t => !t || (t[0] >= 44 && t[1] >= 44))), { sample: M.filter(m => m.width === 360).map(m => m.targets)[0] });

  // ---- 2. Functional ----
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', permissions: ['clipboard-read', 'clipboard-write'] });
  let p = await ctx.newPage(); const fb = { pageErrors: [], siteFailed: [] }; watch(p, fb);
  const fetchStatus = u => p.evaluate(x => fetch(x).then(r => r.status), u);
  const nav = {};
  for (const lang of ['/', '/en/', '/ja/', '/zh-cn/']) {
    await p.goto(base + lang, { waitUntil: 'load' });
    const links = await p.evaluate(() => [...document.querySelectorAll('#site-nav a, .footer a, .language a')].map(a => a.getAttribute('href')).filter(h => h && h.startsWith('/')));
    nav[lang] = [];
    for (const h of [...new Set(links)]) nav[lang].push([h, await fetchStatus(h)]);
  }
  check('Masthead, language and footer links resolve in all four languages', Object.values(nav).every(l => l.length >= 10 && l.every(([, s]) => s === 200)), { nav });
  check('Five editorial sections in the navigation', (await p.evaluate(() => [...document.querySelectorAll('#site-nav > a')].map(a => a.textContent.trim()))).length === 5);

  for (const [lang, q] of [['/', 'nash'], ['/en/', 'nash'], ['/', 'toi uu']]) {
    await p.goto(base + lang, { waitUntil: 'load' });
    await p.click('.search-toggle'); await p.fill('#site-search', q); await p.waitForTimeout(1200);
    const hits = await p.locator('.search-results a').count();
    const first = hits ? await p.locator('.search-results a').first().getAttribute('href') : null;
    check(`Search "${q}" on ${lang} returns results that resolve`, hits > 0 && (await fetchStatus(first)) === 200, { hits, first });
  }
  await p.keyboard.press('Escape'); await p.waitForTimeout(200);
  check('Escape closes the search panel and returns focus to its button', await p.evaluate(() => document.getElementById('search-panel').hidden && document.activeElement.classList.contains('search-toggle')));

  await p.goto(base + '/', { waitUntil: 'load' });
  await p.click('.theme-toggle'); const t1 = await p.evaluate(() => document.documentElement.dataset.theme);
  await p.goto(base + '/journal/', { waitUntil: 'load' }); const t2 = await p.evaluate(() => document.documentElement.dataset.theme);
  await p.click('.theme-toggle'); const t3 = await p.evaluate(() => document.documentElement.dataset.theme || 'light');
  check('Theme toggle switches and persists across pages', t1 === 'dark' && t2 === 'dark' && t3 === 'light', { t1, t2, t3 });

  await p.goto(base + '/kinh-te/toan-co-ban-2/', { waitUntil: 'load' });
  const toc = p.locator('.toc a').first(); const href = await toc.getAttribute('href'); await toc.click(); await p.waitForTimeout(400);
  const top = await p.evaluate(h => { const e = document.getElementById(decodeURIComponent(h.slice(1))); return e ? Math.round(e.getBoundingClientRect().top) : null; }, href);
  check('TOC link scrolls to its heading', top !== null && top >= -5 && top < 200, { href, top });

  await p.goto(base + '/khoa-hoc-may-tinh/complexity-theory-quantum/', { waitUntil: 'load' });
  await p.click('.code-copy'); await p.waitForTimeout(200);
  const clip = await p.evaluate(() => navigator.clipboard.readText());
  check('Code copy writes the code (without line numbers) to the clipboard', clip.startsWith('def vertex_cover_approx') && !/^\s*1\s*$/m.test(clip.split('\n')[0]), { characters: clip.length });

  const math = [];
  for (const r of MATH) {
    await p.goto(base + r, { waitUntil: 'load' });
    await p.waitForFunction(() => window.MathJax && MathJax.startup && MathJax.startup.promise, null, { timeout: 45000 }).catch(() => {});
    await settle(p);
    math.push(await p.evaluate(r => ({ route: r, containers: document.querySelectorAll('mjx-container').length, errors: document.querySelectorAll('mjx-merror').length }), r));
  }
  check('MathJax typesets every math page without errors', math.every(m => m.containers > 0 && !m.errors), { total: math.reduce((a, m) => a + m.containers, 0), math });

  for (const route of ['/journal/', '/en/journal/']) {
    await p.goto(base + route, { waitUntil: 'load' }); await p.waitForTimeout(1500);
    const h = await p.evaluate(() => ({ domains: document.querySelectorAll('#cal-heatmap .graph-domain').length, cells: document.querySelectorAll('#cal-heatmap .graph-subdomain-group rect').length,
      fills: [...new Set([...document.querySelectorAll('#cal-heatmap .graph-subdomain-group rect')].map(r => getComputedStyle(r).fill))] }));
    await p.click('.theme-toggle'); await p.waitForTimeout(500);
    const dark = await p.evaluate(() => [...new Set([...document.querySelectorAll('#cal-heatmap .graph-subdomain-group rect')].map(r => getComputedStyle(r).fill))]);
    await p.click('.theme-toggle');
    check(`Heatmap on ${route}: six months, active days highlighted, colours follow the theme`, h.domains === 6 && h.cells > 150 && h.fills.length >= 2 && dark.join() !== h.fills.join(), { ...h, dark });
  }

  // P4-04: the essay links out to its lab and film; the simulation lives on the lab page.
  await p.goto(base + '/kinh-te/game_theory_nash/', { waitUntil: 'load' });
  const cards = await p.evaluate(() => ({ react: !!document.querySelector('[id^="react-root"]'), video: !!document.querySelector('.prose video'), links: [...document.querySelectorAll('.prose .media-card a.text-link')].map(a => a.getAttribute('href')) }));
  const cardStatus = []; for (const l of cards.links) cardStatus.push([l, await fetchStatus(l)]);
  check('Essay links to its film and lab pages instead of embedding them', !cards.react && !cards.video && cards.links.length === 2 && cardStatus.every(([, s]) => s === 200), { cardStatus });
  await p.goto(base + '/labs/nash-explorer/', { waitUntil: 'load' }); await p.waitForTimeout(800);
  const react = p.locator('[id^="react-root-Nash"]'); const before = await react.innerText();
  await p.getByRole('button', { name: 'Matching Pennies', exact: true }).click(); await p.waitForTimeout(300);
  const after = await react.innerText();
  check('Nash: simulation renders and Matching Pennies gives p* = q* = 0.500', before.includes('Pure-strategy NE') && after.includes('p* = 0.500') && after.includes('q* = 0.500'));
  const slider = react.locator('input[type=range]').first(); const s0 = await slider.inputValue(); await slider.focus(); await slider.press('ArrowRight');
  check('Nash: payoff slider responds to the keyboard', (await slider.inputValue()) !== s0);
  await p.goto(base + '/films/nash-animation/', { waitUntil: 'load' });
  const media = await p.evaluate(async () => { const v = document.querySelector('.film-media video'); const i = new Image(); i.src = v.getAttribute('poster'); await new Promise(r => { i.onload = i.onerror = r; }); return { poster: i.naturalWidth > 0, src: v.getAttribute('src') }; });
  const vid = await p.evaluate(u => fetch(u, { headers: { Range: 'bytes=0-1023' } }).then(r => [r.status, r.headers.get('content-type')]), media.src);
  check('Film page: poster loads and video is served', media.poster && [200, 206].includes(vid[0]) && /video\/mp4/.test(vid[1]), { vid });
  await p.goto(base + '/films/', { waitUntil: 'load' });
  check('Films list: each film has a loading poster and a working page link', await p.evaluate(async () => { const f = [...document.querySelectorAll('.film')]; if (!f.length) return false; for (const e of f) { const i = e.querySelector('img'); await new Promise(r => { if (i.complete) r(); else { i.onload = i.onerror = r; } }); if (!i.naturalWidth || !(await fetch(e.querySelector('h2 a').href)).ok) return false; } return true; }));
  await p.goto(base + '/labs/', { waitUntil: 'load' });
  const lab = await p.locator('.lab h2 a').getAttribute('href');
  await p.goto(base + lab, { waitUntil: 'load' });
  check('Labs: the experiment link opens the live simulation', await p.evaluate(() => !!document.querySelector('[id^="react-root-Nash"]')), { lab });
  await p.goto(base + '/volumes/volume-i/', { waitUntil: 'load' });
  const chapters = await p.evaluate(() => [...document.querySelectorAll('.chapter-list a')].map(a => a.getAttribute('href')));
  const cs = []; for (const c of chapters) cs.push([c, await fetchStatus(c)]);
  check('Volume I: six chapters, all resolve', chapters.length === 6 && cs.every(([, s]) => s === 200), { cs });
  await p.goto(base + chapters[2], { waitUntil: 'load' });
  check('Chapter page shows its volume position and links back', await p.evaluate(() => { const n = document.querySelector('.volume-position'); return !!n && /3/.test(n.textContent) && !!n.querySelector('a[href*="/volumes/"]'); }));
  const commerce = [];
  for (const route of ['/', '/volumes/', '/volumes/volume-i/', '/films/', '/labs/', '/discover/', '/en/discover/']) {
    await p.goto(base + route, { waitUntil: 'load' });
    if (await p.evaluate(() => /(\$\s?\d|₫|\bbuy\b|\bprice\b|checkout|subscribe now|mua ngay|giá bán)/i.test(document.querySelector('main').innerText) || !!document.querySelector('main a[href*="amazon."], main a[href*="tag="], main a[rel~="sponsored"]'))) commerce.push(route);
  }
  check('No purchase, price, sponsored or affiliate links', commerce.length === 0, { commerce });
  R.functionalErrors = { pageErrors: fb.pageErrors, siteFailed: fb.siteFailed };
  check('No page errors or failed own-site requests during functional checks', !fb.pageErrors.length && !fb.siteFailed.length, R.functionalErrors);
  await ctx.close();

  const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  p = await mob.newPage();
  await p.goto(base + '/labs/nash-explorer/', { waitUntil: 'load' }); await p.waitForTimeout(500);
  const fbk = await p.evaluate(() => [getComputedStyle(document.querySelector('.react-mobile-fallback')).display, getComputedStyle(document.querySelector('.react-component-wrapper')).display]);
  check('Nash mobile fallback at 390 px', fbk[0] !== 'none' && fbk[1] === 'none', { fbk });
  await p.goto(base + '/', { waitUntil: 'load' });
  await p.click('.menu-toggle'); await p.waitForTimeout(200);
  const opened = await p.evaluate(() => ({ open: document.getElementById('site-nav').classList.contains('is-open'), links: document.querySelectorAll('#site-nav > a').length, langs: document.querySelectorAll('#site-nav .language li').length }));
  await p.screenshot({ path: path.join(out, 'screenshots', 'mobile-menu-390.png') });
  await p.keyboard.press('Escape'); await p.waitForTimeout(150);
  const closed = await p.evaluate(() => !document.getElementById('site-nav').classList.contains('is-open') && document.activeElement.classList.contains('menu-toggle'));
  check('Mobile menu opens with sections and languages, Escape closes it and restores focus', opened.open && opened.links === 5 && opened.langs === 4 && closed, opened);
  await mob.close();

  const kb = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  p = await kb.newPage(); await p.goto(base + '/', { waitUntil: 'load' });
  const focus = [];
  for (let i = 0; i < 10; i++) { await p.keyboard.press('Tab'); focus.push(await p.evaluate(() => { const a = document.activeElement; const s = getComputedStyle(a); return { tag: a.tagName, text: (a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 24), outline: s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2 }; })); }
  check('Keyboard: skip link first, then masthead controls, every stop has a visible outline', /Skip|Bỏ qua/.test(focus[0].text) && focus.every(f => f.outline), { focus });
  const motion = await p.evaluate(() => ({ reduce: matchMedia('(prefers-reduced-motion: reduce)').matches, scroll: getComputedStyle(document.documentElement).scrollBehavior }));
  check('Reduced motion disables smooth scrolling', motion.reduce && motion.scroll === 'auto', motion);
  await kb.close();

  // ---- 3. axe ----
  if (process.env.AXE) {
    const axeSource = fs.readFileSync(process.env.AXE, 'utf8');
    for (const width of [390, 1440]) for (const scheme of ['light', 'dark']) {
      const c = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, reducedMotion: 'reduce' }); const ap = await c.newPage();
      for (const [name, route] of PAGES) {
        await ap.goto(base + route, { waitUntil: 'load' }); await settle(ap); await ap.waitForTimeout(400);
        await ap.addScriptTag({ content: axeSource });
        const res = await ap.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } }));
        R.axe.push({ page: name, width, scheme, violations: res.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, sample: v.nodes.slice(0, 2).map(n => n.target.join(' ')) })), incomplete: res.incomplete.map(v => ({ id: v.id, nodes: v.nodes.length })) });
      }
      await c.close();
    }
    const serious = R.axe.flatMap(a => a.violations.filter(v => ['serious', 'critical'].includes(v.impact)).map(v => [a.page, a.width, a.scheme, v.id, v.nodes, v.sample]));
    check('axe-core: no serious or critical WCAG 2.1 A/AA violations', serious.length === 0, { serious: serious.slice(0, 20) });
  }

  fs.writeFileSync(path.join(out, 'p3-results.json'), JSON.stringify(R, null, 2) + '\n');
  await browser.close();
  console.log(JSON.stringify({ browser: R.browser, states: M.length, checks: R.checks.map(c => [c.passed, c.name]), thirdParty: [...new Set(R.thirdPartyFailures.map(f => f.url.split('/')[2]))] }, null, 1));
  if (R.checks.some(c => !c.passed)) process.exitCode = 1;
})().catch(e => { console.error(e); process.exit(1); });
