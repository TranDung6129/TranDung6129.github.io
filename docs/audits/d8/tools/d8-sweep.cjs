// D8 site-wide sweep over every URL in the sitemaps of a built site served locally.
// Per page: HTTP status, page errors, horizontal overflow (390 and 1440), axe WCAG 2.1 A/AA,
// images without alt, and internal links/anchors that do not resolve in the build.
// Usage: SITE=<build dir> BASE=http://127.0.0.1:1338 AXE=<axe.min.js> OUT=<dir> node docs/audits/d8/tools/d8-sweep.cjs
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const site = process.env.SITE, base = (process.env.BASE || 'http://127.0.0.1:1338').replace(/\/$/, ''), out = process.env.OUT || '/tmp/d8';
const axe = fs.readFileSync(process.env.AXE, 'utf8'); fs.mkdirSync(out, { recursive: true });
const sitemaps = ['sitemap.xml', ...fs.readdirSync(site).filter(d => fs.existsSync(path.join(site, d, 'sitemap.xml'))).map(d => `${d}/sitemap.xml`)];
const urls = [...new Set(sitemaps.flatMap(f => [...fs.readFileSync(path.join(site, f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname)).filter(p => !p.endsWith('.xml')))];
const exists = p => { const clean = decodeURIComponent(p.split('#')[0].split('?')[0]); const f = path.join(site, clean); return fs.existsSync(f) && (fs.statSync(f).isFile() || fs.existsSync(path.join(f, 'index.html'))); };
(async () => {
  const b = await chromium.launch(); const results = [];
  for (const u of urls) {
    const r = { url: u, problems: [] };
    for (const [w, h] of [[1440, 900], [390, 844]]) {
      const ctx = await b.newContext({ viewport: { width: w, height: h } }); const p = await ctx.newPage(); const errs = [];
      p.on('pageerror', e => errs.push(e.message));
      let res; try { res = await p.goto(base + u, { waitUntil: 'load', timeout: 45000 }); } catch (e) { r.problems.push(`load ${w}: ${e.message.slice(0, 80)}`); await ctx.close(); continue; }
      await p.waitForTimeout(250);
      if (res.status() !== 200) r.problems.push(`status ${res.status()}`);
      const info = await p.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        noAlt: [...document.querySelectorAll('img:not([alt])')].map(i => i.getAttribute('src')).slice(0, 3),
        links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => h.startsWith('/') || h.startsWith('#')),
        ids: [...document.querySelectorAll('[id]')].map(e => e.id),
      }));
      if (info.overflow) r.problems.push(`overflow ${w}`);
      if (errs.length) r.problems.push(`errors ${w}: ${errs[0].slice(0, 100)}`);
      if (w === 1440) {
        if (info.noAlt.length) r.problems.push(`img without alt: ${info.noAlt.join(', ')}`);
        const ids = new Set(info.ids);
        const bad = [...new Set(info.links.filter(hh => hh.startsWith('#') ? hh.length > 1 && !ids.has(decodeURIComponent(hh.slice(1))) : !exists(hh)))];
        if (bad.length) r.problems.push(`broken links: ${bad.slice(0, 5).join(', ')}`);
        await p.addScriptTag({ content: axe });
        const v = await p.evaluate(async () => (await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] })).violations.map(x => `${x.id}×${x.nodes.length}`));
        if (v.length) r.problems.push(`axe: ${v.join(', ')}`);
      }
      await ctx.close();
    }
    results.push(r); if (r.problems.length) console.log(u, '→', r.problems.join(' | '));
  }
  await b.close(); fs.writeFileSync(path.join(out, 'd8-sweep.json'), JSON.stringify(results, null, 1));
  const bad = results.filter(r => r.problems.length); console.log(`${results.length} pages, ${bad.length} with problems`); if (bad.length) process.exitCode = 1;
})();
