// P1-08 production smoke test against the public site (not localhost).
//
// Usage: BASE=https://trandung6129.github.io OUT=/tmp/p108-smoke node live-smoke.cjs
// Default Chromium launch options: certificate validation stays on, no interception or mocks.
// 1) Matrix: 6 representative pages x 390/768/1440 px x light/dark — HTTP status, document
//    overflow, page errors, console errors, failed requests, viewport screenshot.
// 2) Interactions: desktop and mobile navigation, search (+ Escape), theme toggle and persistence,
//    TOC, code expand and copy, Nash preset/keyboard slider, Nash mobile fallback, video poster.
// Exit 1 when a named check fails. Third-party failures are reported separately from the site's own.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const base = (process.env.BASE || 'https://trandung6129.github.io').replace(/\/$/, '');
const out = process.env.OUT || path.join(__dirname, 'smoke-output');
fs.mkdirSync(path.join(out, 'screenshots'), { recursive: true });
const host = new URL(base).host;
const PAGES = [
  ['home-vi', '/'], ['home-en', '/en/'], ['home-ja', '/ja/'],
  ['math', '/kinh-te/toan-co-ban-2/'], ['nash', '/kinh-te/game_theory_nash/'], ['code', '/khoa-hoc-may-tinh/complexity-theory-quantum/'],
];

(async () => {
  const browser = await chromium.launch();
  const R = { method: 'Headless Chromium against the public GitHub Pages site; default launch options, certificate validation on, no request interception.',
    base, browser: browser.version(), matrix: [], checks: [], thirdPartyFailures: [], siteFailures: [] };
  const own = u => { try { return new URL(u).host === host; } catch (e) { return false; } };
  function watch(page, bucket) {
    page.on('pageerror', e => bucket.pageErrors.push(e.message.slice(0, 200)));
    page.on('console', m => { if (m.type() === 'error') bucket.consoleErrors.push(m.text().slice(0, 200)); });
    page.on('requestfailed', r => {
      const f = { url: r.url().slice(0, 160), error: r.failure() && r.failure().errorText };
      // A media element cancelling a ranged video request is normal streaming, not a failure.
      if (f.error === 'net::ERR_ABORTED' && /\.mp4$/.test(r.url())) return;
      (own(r.url()) ? bucket.siteFailed : bucket.thirdFailed).push(f);
    });
    page.on('response', r => { if (r.status() >= 400) (own(r.url()) ? bucket.siteFailed : bucket.thirdFailed).push({ url: r.url().slice(0, 160), status: r.status() }); });
  }
  const check = (name, passed, detail) => R.checks.push({ name, passed: !!passed, ...detail });

  // ---- 1. Matrix ------------------------------------------------------------------------
  for (const width of [390, 768, 1440]) for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme, reducedMotion: 'reduce' });
    for (const [name, route] of PAGES) {
      const page = await ctx.newPage();
      const b = { pageErrors: [], consoleErrors: [], siteFailed: [], thirdFailed: [] }; watch(page, b);
      const resp = await page.goto(base + route, { waitUntil: 'load', timeout: 60000 });
      await page.evaluate(async () => { if (window.MathJax && MathJax.startup && MathJax.startup.promise) await MathJax.startup.promise; await document.fonts.ready; }).catch(() => {});
      await page.waitForTimeout(700);
      // The head script sets data-theme="dark" only; light mode has no attribute. The background colour is recorded as well.
      const info = await page.evaluate(() => ({ theme: document.documentElement.getAttribute('data-theme') || 'light', background: getComputedStyle(document.body).backgroundColor, lang: document.documentElement.lang,
        overflow: document.documentElement.scrollWidth > innerWidth, scrollWidth: document.documentElement.scrollWidth,
        math: document.querySelectorAll('mjx-container').length, title: document.title }));
      const file = `${name}-${width}-${scheme}.png`;
      await page.screenshot({ path: path.join(out, 'screenshots', file) });
      R.matrix.push({ page: name, url: base + route, width, scheme, status: resp.status(), ...info, pageErrors: b.pageErrors, consoleErrors: b.consoleErrors.length,
        siteFailed: b.siteFailed, thirdFailed: b.thirdFailed.length, screenshot: file });
      R.siteFailures.push(...b.siteFailed.map(f => ({ page: route, width, scheme, ...f })));
      R.thirdPartyFailures.push(...b.thirdFailed.map(f => ({ page: route, ...f })));
      await page.close();
    }
    await ctx.close();
  }
  check('Matrix: every page 200, theme matches colour scheme, no overflow, no page error, no failed own-site request',
    R.matrix.every(m => m.status === 200 && m.theme === m.scheme && !m.overflow && m.pageErrors.length === 0 && m.siteFailed.length === 0),
    { states: R.matrix.length });
  const bg = s => [...new Set(R.matrix.filter(m => m.scheme === s).map(m => m.background))];
  // Expected values are those of the pre-migration FixIt build (P1-02/P1-07 baseline). Dark mode paints
  // the body with FixIt's own #292A2E instead of the documented #1A1816 — an existing defect, not a regression.
  check('Page backgrounds match the pre-migration baseline (light #F7F5F0, dark #292A2E)', bg('light').join() === 'rgb(247, 245, 240)' && bg('dark').join() === 'rgb(41, 42, 46)', { light: bg('light'), dark: bg('dark') });
  check('Math pages typeset at every width and theme', R.matrix.filter(m => m.page === 'math').every(m => m.math > 0), { counts: [...new Set(R.matrix.filter(m => m.page === 'math').map(m => m.math))] });

  // ---- 2. Interactions --------------------------------------------------------------------
  const desk = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', permissions: ['clipboard-read', 'clipboard-write'] });
  let p = await desk.newPage(); const db = { pageErrors: [], consoleErrors: [], siteFailed: [], thirdFailed: [] }; watch(p, db);

  await p.goto(base + '/', { waitUntil: 'load' });
  const menu = await p.evaluate(() => [...document.querySelectorAll('#header-desktop .menu-item a, #header-desktop .menu-link')].map(a => a.getAttribute('href')).filter(Boolean));
  const menuStatus = [];
  // In-page fetch so the request goes through the browser's network stack (Playwright's request API bypasses the proxy).
  for (const href of [...new Set(menu)].filter(h => h.startsWith('/')).slice(0, 12)) menuStatus.push([href, await p.evaluate(u => fetch(u).then(r => r.status), href)]);
  check('Desktop navigation links resolve (vi)', menuStatus.length > 0 && menuStatus.every(([, s]) => s === 200), { links: menuStatus });

  await p.locator('#search-toggle-desktop').click();
  await p.locator('#search-input-desktop').fill('Nash'); await p.waitForTimeout(2000);
  const hits = await p.locator('#search-dropdown-desktop a').count();
  await p.keyboard.press('Escape'); await p.waitForTimeout(300);
  const afterEsc = await p.evaluate(() => { const d = document.querySelector('#search-dropdown-desktop'); const i = document.querySelector('#search-input-desktop');
    return { dropdownVisible: !!d && getComputedStyle(d).display !== 'none' && d.offsetHeight > 0, inputValue: i ? i.value : null }; });
  check('Search returns results for "Nash"', hits > 0, { results: hits });
  R.observations = { searchAfterEscape: afterEsc };

  const t0 = await p.evaluate(() => document.documentElement.getAttribute('data-theme'));
  await p.locator('.theme-switch').first().click(); await p.waitForTimeout(300);
  const t1 = await p.evaluate(() => document.documentElement.getAttribute('data-theme'));
  await p.reload({ waitUntil: 'load' });
  const t2 = await p.evaluate(() => document.documentElement.getAttribute('data-theme'));
  check('Theme toggle changes theme and persists after reload', t0 !== t1 && t1 === t2, { before: t0, afterToggle: t1, afterReload: t2 });
  await p.evaluate(() => localStorage.clear());

  await p.goto(base + '/kinh-te/toan-co-ban-2/', { waitUntil: 'load' });
  const toc = p.locator('#toc-auto a').first(); const href = await toc.getAttribute('href'); await toc.click(); await p.waitForTimeout(500);
  const tocTarget = await p.evaluate(h => { const el = document.getElementById(decodeURIComponent(h.slice(1))); return el ? Math.round(el.getBoundingClientRect().top) : null; }, href);
  check('TOC link navigates to its heading', decodeURIComponent(p.url()).endsWith(href) && tocTarget !== null && tocTarget >= 0 && tocTarget < 300, { href, headingTop: tocTarget });

  await p.goto(base + '/khoa-hoc-may-tinh/complexity-theory-quantum/', { waitUntil: 'load' });
  await p.locator('.highlight .code-title').first().click(); await p.locator('.highlight .code-header').first().hover();
  await p.locator('.highlight .copy').first().click({ timeout: 3000 }); await p.waitForTimeout(200);
  const clip = await p.evaluate(() => navigator.clipboard.readText());
  // Second table cell holds the code; the first holds line numbers.
  const codeText = await p.evaluate(() => document.querySelector('.highlight code[data-lang]').innerText.trim().slice(0, 30));
  check('Code block expands and copy writes the code to the clipboard', clip.length > 0 && clip.includes(codeText.slice(0, 15)), { characters: clip.length, prefix: clip.slice(0, 60) });

  await p.goto(base + '/kinh-te/game_theory_nash/', { waitUntil: 'load' }); await p.waitForTimeout(800);
  const react = p.locator('[id^="react-root-Nash"]');
  const before = await react.innerText();
  await p.getByRole('button', { name: 'Matching Pennies', exact: true }).click(); await p.waitForTimeout(300);
  const after = await react.innerText();
  check('Nash simulation initialises and Matching Pennies preset gives p* = q* = 0.500', before.includes('Pure-strategy NE') && after.includes('p* = 0.500') && after.includes('q* = 0.500'));
  const slider = react.locator('input[type=range]').first(); const s0 = await slider.inputValue(); await slider.focus(); await slider.press('ArrowRight');
  check('Nash payoff slider responds to the keyboard', (await slider.inputValue()) !== s0, { before: s0, after: await slider.inputValue() });
  const media = await p.evaluate(async () => { const v = document.querySelector('video'); const img = new Image(); img.src = v.getAttribute('poster');
    await new Promise(r => { img.onload = img.onerror = r; }); return { poster: v.getAttribute('poster'), posterLoaded: img.naturalWidth > 0, posterSize: [img.naturalWidth, img.naturalHeight], src: v.currentSrc || v.getAttribute('src') }; });
  const vid = await p.evaluate(u => fetch(u, { headers: { Range: 'bytes=0-1023' } }).then(r => ({ status: r.status, type: r.headers.get('content-type') })), media.src);
  check('Nash video poster loads and the video file is served', media.posterLoaded && [200, 206].includes(vid.status) && /video\/mp4/.test(vid.type || ''),
    { ...media, videoStatus: vid.status, videoType: vid.type });
  R.desktopErrors = { pageErrors: db.pageErrors, siteFailed: db.siteFailed };
  await desk.close();

  const mob = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'light', isMobile: true, hasTouch: true });
  p = await mob.newPage();
  await p.goto(base + '/kinh-te/game_theory_nash/', { waitUntil: 'load' }); await p.waitForTimeout(600);
  const fb = await p.evaluate(() => ({ fallback: getComputedStyle(document.querySelector('.react-mobile-fallback')).display, wrapper: getComputedStyle(document.querySelector('.react-component-wrapper')).display }));
  check('Nash mobile fallback shown and interactive wrapper hidden at 390 px', fb.fallback !== 'none' && fb.wrapper === 'none', fb);
  await p.goto(base + '/', { waitUntil: 'load' });
  const toggle = p.locator('#menu-toggle-mobile');
  await toggle.click(); await p.waitForTimeout(400);
  const open = await p.evaluate(() => { const m = document.querySelector('#menu-mobile'); return { active: m.classList.contains('active'), visible: m.offsetHeight > 0,
    links: [...m.querySelectorAll('a.menu-link, .menu-item a')].map(a => a.getAttribute('href')).filter(h => h && h.startsWith('/')) }; });
  await p.screenshot({ path: path.join(out, 'screenshots', 'mobile-menu-open-390-light.png') });
  await toggle.click(); await p.waitForTimeout(400);
  const closed = await p.evaluate(() => document.querySelector('#menu-mobile').classList.contains('active'));
  check('Mobile menu opens and closes', open.active && open.visible && !closed, { links: open.links.length });
  // On mobile the search box sits inside the opened menu.
  await toggle.click(); await p.waitForTimeout(400);
  await p.locator('#search-input-mobile').fill('Nash'); await p.waitForTimeout(2000);
  await p.screenshot({ path: path.join(out, 'screenshots', 'mobile-search-390-light.png') });
  check('Mobile search returns results', (await p.locator('#search-dropdown-mobile a').count()) > 0);
  await mob.close();

  const kb = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  p = await kb.newPage(); await p.goto(base + '/', { waitUntil: 'load' });
  const focus = [];
  for (let i = 0; i < 8; i++) { await p.keyboard.press('Tab'); focus.push(await p.evaluate(() => { const a = document.activeElement; const s = getComputedStyle(a);
    return { tag: a.tagName, text: (a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 30), outline: s.outlineStyle !== 'none' && s.outlineWidth !== '0px' }; })); }
  check('Keyboard Tab reaches header links with a visible focus outline', focus.filter(f => f.tag === 'A').length >= 4 && focus.every(f => f.outline), { focus });
  await kb.close();

  fs.writeFileSync(path.join(out, 'live-smoke.json'), JSON.stringify(R, null, 2) + '\n');
  await browser.close();
  console.log(JSON.stringify({ browser: R.browser, checks: R.checks.map(c => [c.passed, c.name]), states: R.matrix.length, siteFailures: R.siteFailures.length,
    thirdPartyFailures: [...new Set(R.thirdPartyFailures.map(f => new URL(f.url).host))], searchAfterEscape: R.observations.searchAfterEscape }, null, 1));
  if (R.checks.some(c => !c.passed)) process.exitCode = 1;
})().catch(e => { console.error(e); process.exit(1); });
