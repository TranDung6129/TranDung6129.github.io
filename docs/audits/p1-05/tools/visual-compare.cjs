// Pixel comparison of two builds of the site in headless Chromium.
//
// Usage: BASE_A=http://127.0.0.1:1314 BASE_B=http://127.0.0.1:1315 OUT=/tmp/visual \
//        node visual-compare.cjs [routes.json]
// routes.json: {"all": ["/", ...], "matrix": ["/", ...]}
//   "all" routes are compared at 1440 px light; "matrix" routes at 360/768/1024/1440 x light/dark.
// Full-page screenshots, reduced motion, fonts and MathJax settled. A state passes only when
// both PNGs have the same size and zero differing pixels. A mismatch is retried (same-build
// captures show occasional one-pixel raster noise) and finally rechecked serially; a real
// difference never becomes identical. Exit code 1 on any remaining difference.
// Certificate validation is left at the browser default.
const { chromium } = require('playwright');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const A = process.env.BASE_A, B = process.env.BASE_B;
const out = process.env.OUT || path.join(__dirname, 'visual-output');
const workers = Number(process.env.WORKERS || 4);
const routes = process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) : { all: ['/'], matrix: ['/'] };
fs.mkdirSync(path.join(out, 'diffs'), { recursive: true });

const states = [];
for (const r of routes.all || []) states.push({ route: r, width: 1440, scheme: 'light' });
for (const r of routes.matrix || []) for (const width of [360, 768, 1024, 1440]) for (const scheme of ['light', 'dark'])
  if (!states.some(s => s.route === r && s.width === width && s.scheme === scheme)) states.push({ route: r, width, scheme });

// Determinism aids, applied identically to both builds: a fixed Math.random (the 404 page picks a
// random kaomoji), a scroll pass plus eager loading so lazy images are present, and a wait for
// every image to finish or fail.
async function capture(context, url) {
  const page = await context.newPage();
  const resp = await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await page.evaluate(async () => {
    if (window.MathJax && window.MathJax.startup && window.MathJax.startup.promise) await window.MathJax.startup.promise;
    const step = innerHeight, total = document.documentElement.scrollHeight;
    for (let y = 0; y < total; y += step) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
    scrollTo(0, 0);
    await Promise.race([Promise.all([...document.images].map(img => { img.loading = 'eager';
      return img.complete ? null : new Promise(r => { img.addEventListener('load', r); img.addEventListener('error', r); }); })),
      new Promise(r => setTimeout(r, 10000))]);
    await document.fonts.ready;
  }).catch(() => {});
  await page.waitForTimeout(Number(process.env.SETTLE || 900));
  const png = await page.screenshot({ fullPage: true, animations: 'disabled' });
  await page.close();
  return { status: resp ? resp.status() : 0, png };
}

(async () => {
  const browser = await chromium.launch();
  const helperCtx = await browser.newContext();
  const helper = await helperCtx.newPage();
  await helper.setContent('<canvas></canvas>');
  async function pixelDiff(a, b) {
    return helper.evaluate(async ([x, y]) => {
      const load = async b64 => createImageBitmap(await (await fetch('data:image/png;base64,' + b64)).blob());
      const [p, q] = [await load(x), await load(y)];
      if (p.width !== q.width || p.height !== q.height) return { sameSize: false, a: [p.width, p.height], b: [q.width, q.height], differing: null };
      const data = bmp => { const c = new OffscreenCanvas(bmp.width, bmp.height); const g = c.getContext('2d'); g.drawImage(bmp, 0, 0); return g.getImageData(0, 0, bmp.width, bmp.height).data; };
      const [d, e] = [data(p), data(q)]; let n = 0, maxDelta = 0;
      for (let i = 0; i < d.length; i += 4) { const delta = Math.max(Math.abs(d[i] - e[i]), Math.abs(d[i + 1] - e[i + 1]), Math.abs(d[i + 2] - e[i + 2]), Math.abs(d[i + 3] - e[i + 3])); if (delta) { n++; if (delta > maxDelta) maxDelta = delta; } }
      return { sameSize: true, a: [p.width, p.height], differing: n, maxChannelDelta: maxDelta };
    }, [a.toString('base64'), b.toString('base64')]);
  }
  async function compareState(s, attempts) {
    const ctx = await browser.newContext({ viewport: { width: s.width, height: 900 }, colorScheme: s.scheme, reducedMotion: 'reduce', deviceScaleFactor: 1 });
    await ctx.addInitScript(() => { Math.random = () => 0.42; });
    const entry = { route: s.route, width: s.width, scheme: s.scheme, attempts: 0 };
    try {
      // Raster noise of a pixel or two occurs between two captures of the same build (large scaled
      // images, load), so a mismatch is retried; a real rendering difference never matches on retry.
      for (let attempt = 1; attempt <= attempts && !entry.identical; attempt++) {
        entry.attempts = attempt;
        const [a, b] = [await capture(ctx, A + s.route), await capture(ctx, B + s.route)];
        entry.statusA = a.status; entry.statusB = b.status;
        entry.shaA = crypto.createHash('sha256').update(a.png).digest('hex');
        entry.shaB = crypto.createHash('sha256').update(b.png).digest('hex');
        if (entry.shaA === entry.shaB) { entry.identical = true; entry.differing = 0; delete entry.maxChannelDelta; }
        else {
          const d = await pixelDiff(a.png, b.png);
          Object.assign(entry, d, { identical: d.sameSize && d.differing === 0 });
          if (!entry.identical && attempt === attempts) {
            const name = (s.route.replace(/[^a-z0-9]+/gi, '_') || 'home') + `-${s.width}-${s.scheme}`;
            fs.writeFileSync(path.join(out, 'diffs', name + '-A.png'), a.png); fs.writeFileSync(path.join(out, 'diffs', name + '-B.png'), b.png);
          }
        }
      }
    } catch (e) { entry.identical = false; entry.error = e.message.slice(0, 200); }
    await ctx.close();
    return entry;
  }
  const results = [];
  let next = 0;
  async function worker() { while (next < states.length) results.push(await compareState(states[next++], 3)); }
  await Promise.all(Array.from({ length: workers }, worker));
  // Serial recheck: states that still differ are compared again one at a time, without parallel load.
  for (let i = 0; i < results.length; i++) {
    if (results[i].identical) continue;
    const first = { differing: results[i].differing, maxChannelDelta: results[i].maxChannelDelta, sameSize: results[i].sameSize, error: results[i].error };
    const again = await compareState(results[i], 5);
    results[i] = { ...again, recheck: true, parallelRunDifference: first };
  }
  results.sort((x, y) => (x.route + x.width + x.scheme).localeCompare(y.route + y.width + y.scheme));
  const failed = results.filter(r => !r.identical);
  const summary = { method: 'Full-page Chromium screenshots of two builds, reduced motion, fonts and MathJax settled; pass = same size and zero differing pixels.',
    browser: browser.version(), baseA: A, baseB: B, states: results.length, identical: results.length - failed.length, different: failed.length, retried: results.filter(r => r.attempts > 1 || r.recheck).length, rechecked: results.filter(r => r.recheck).length,
    routesAll: (routes.all || []).length, routesMatrix: (routes.matrix || []).length, failed, results };
  fs.writeFileSync(path.join(out, 'visual-results.json'), JSON.stringify(summary, null, 2) + '\n');
  await browser.close();
  console.log(JSON.stringify({ states: summary.states, identical: summary.identical, different: summary.different, retried: summary.retried, rechecked: summary.rechecked, failed: failed.slice(0, 15) }, null, 1));
  if (failed.length) process.exitCode = 1;
})().catch(e => { console.error(e); process.exit(1); });
