// Compare the former inline home <style> block with css/home.min.css through the browser's CSSOM.
// Usage: BASE_A=<baseline> BASE_B=<candidate> node home-css-rules.cjs out.json
// Pass = the candidate stylesheet contains exactly the baseline rules, in the same order, minus
// rules whose selectors only reference classes removed as dead, and no stylesheet whose order
// relative to the home rules changed styles the same property on the same element. Exit 1 otherwise.
const { chromium } = require('playwright');
const fs = require('fs');
const DEAD = ['.right-panel', '.panel-title', '.custom-details', '.collections-list', '.collection-item', '.collection-name', '.collection-count'];
(async () => {
  const browser = await chromium.launch(); const page = await browser.newPage();
  const serialize = sheet => [...sheet.cssRules].map(r => r.cssText);
  await page.goto(process.env.BASE_A + '/', { waitUntil: 'load' });
  const before = await page.evaluate(() => { const s = [...document.styleSheets].filter(x => !x.href && x.ownerNode.closest('main') && !x.ownerNode.closest('.heatmap-section')); return s.length === 1 ? [...s[0].cssRules].map(r => r.cssText) : null; });
  await page.goto(process.env.BASE_B + '/', { waitUntil: 'load' });
  const after = await page.evaluate(() => { const s = [...document.styleSheets].filter(x => x.href && x.href.endsWith('/css/home.min.css')); return s.length === 1 ? [...s[0].cssRules].map(r => r.cssText) : null; });
  const inlineLeft = await page.evaluate(() => [...document.styleSheets].filter(x => !x.href && x.ownerNode.closest('main') && !x.ownerNode.closest('.heatmap-section')).length);
  const orderBefore = await (async () => { await page.goto(process.env.BASE_A + '/', { waitUntil: 'load' }); const o = await page.evaluate(() => [...document.querySelectorAll('link[rel=stylesheet], main style')].map(n => n.tagName === 'STYLE' ? (n.closest('.heatmap-section') ? '<style heatmap>' : '<style home>') : n.getAttribute('href'))); await page.goto(process.env.BASE_B + '/', { waitUntil: 'load' }); return o; })();
  const position = await page.evaluate(() => { const links = [...document.querySelectorAll('link[rel=stylesheet]')].map(l => l.getAttribute('href')); return { inHead: !!document.head.querySelector('link[href="/css/home.min.css"]'), order: [...document.querySelectorAll('link[rel=stylesheet], main style')].map(n => n.tagName === 'STYLE' ? (n.closest('.heatmap-section') ? '<style heatmap>' : '<style home>') : n.getAttribute('href')) }; });
  const isDead = t => DEAD.some(d => t.split('{')[0].includes(d));
  const expected = (before || []).filter(t => !isDead(t)); const dropped = (before || []).filter(isDead);
  const report = { note: 'home rules moved from an inline <style> at the end of the page content to a <head> link', baselineInlineRules: before && before.length, candidateRules: after && after.length, droppedDeadRules: dropped.length, droppedSelectors: dropped.map(t => t.split('{')[0].trim()),
    sameRulesSameOrder: JSON.stringify(expected) === JSON.stringify(after), inlineHomeStyleBlocksLeft: inlineLeft, cascadeOrderBefore: orderBefore, cascadeOrderAfter: position.order, homeLinkInHead: position.inHead,
    samePositionRelativeToOtherSheets: JSON.stringify(orderBefore.map(x => x === '<style home>' ? 'HOME' : x)) === JSON.stringify(position.order.map(x => x === '/css/home.min.css' ? 'HOME' : x)) };
  // Sheets whose order relative to the home rules changed (the link moved to <head>), and whether any
  // element receives the same property from both the home rules and one of those sheets. With no such
  // (element, property) pair the reordering cannot change a computed style.
  const rel = (order, home) => Object.fromEntries(order.filter(x => x !== home).map(x => [x, order.indexOf(x) < order.indexOf(home) ? 'before-home' : 'after-home']));
  const [rb, ra] = [rel(orderBefore, '<style home>'), rel(position.order, '/css/home.min.css')];
  report.reorderedAgainst = Object.keys(rb).filter(k => rb[k] !== ra[k]);
  report.overlap = await page.evaluate(async reordered => {
    const strip = sel => sel.replace(/::?[a-zA-Z-]+(\([^)]*\))?/g, '') || '*'; // drop pseudo-classes/elements: superset of matches
    const pairs = sheet => { const m = new Map();
      const walk = rules => { for (const r of rules) { if (r.cssRules && !r.selectorText) { walk(r.cssRules); continue; } if (!r.selectorText) continue;
        let els = []; try { els = [...document.querySelectorAll(strip(r.selectorText))]; } catch (e) {}
        for (const el of els) { if (!m.has(el)) m.set(el, new Set()); for (const prop of r.style) m.get(el).add(prop); } } };
      try { walk(sheet.cssRules); } catch (e) { return null; } return m; };
    const sheets = [...document.styleSheets];
    const home = pairs(sheets.find(x => x.href && x.href.endsWith('/css/home.min.css')));
    const out = {};
    for (const name of reordered) {
      const sheet = name === '<style heatmap>' ? sheets.find(x => !x.href && x.ownerNode.closest('.heatmap-section')) : sheets.find(x => x.href && x.href.endsWith(name.replace(/^https?:\/\/[^/]+/, '')));
      let other = sheet && pairs(sheet);
      if (sheet && !other && sheet.href) { // cross-origin sheet: re-parse its text (the CDN allows CORS reads)
        try { const copy = new CSSStyleSheet(); copy.replaceSync(await (await fetch(sheet.href)).text()); other = pairs(copy); } catch (e) {}
      }
      if (!other) { out[name] = 'unreadable'; continue; }
      let n = 0; const sample = [];
      for (const [el, props] of other) if (home.has(el)) for (const prop of props) if (home.get(el).has(prop)) { n++; if (sample.length < 5) sample.push(el.tagName + '.' + el.className + ' ' + prop); }
      out[name] = { elementsStyledByThatSheet: other.size, sharedElementPropertyPairs: n, sample };
    }
    return out;
  }, report.reorderedAgainst);
  report.reorderingCannotChangeComputedStyle = Object.values(report.overlap).every(o => o !== 'unreadable' && o.sharedElementPropertyPairs === 0);
  fs.writeFileSync(process.argv[2], JSON.stringify(report, null, 2) + '\n'); await browser.close();
  console.log(JSON.stringify(report, null, 1)); if (!report.sameRulesSameOrder || !report.reorderingCannotChangeComputedStyle) process.exitCode = 1;
})().catch(e => { console.error(e); process.exit(1); });
