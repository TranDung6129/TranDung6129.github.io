const { chromium } = require('playwright');
const [base, out] = process.argv.slice(2);
(async () => { const b = await chromium.launch();
 const p = await (await b.newContext({ viewport:{width:1440,height:900}, reducedMotion:'reduce' })).newPage();
 await p.goto(base+'/kinh-te/game_theory_nash/',{waitUntil:'load'}); await p.waitForTimeout(800);
 const H = await p.evaluate(() => { const r = document.querySelector('.d1-article .prose').getBoundingClientRect(); return { top: r.top + scrollY, h: r.height }; });
 const probe = [];
 for (const f of [0.1,0.25,0.5,0.75,0.98]) { await p.evaluate(y => scrollTo(0, y), H.top + f*(H.h-900)); await p.waitForTimeout(400);
   probe.push(await p.evaluate(f => { const t=document.querySelector('.d1-article .toc').getBoundingClientRect(); return { fraction: f, tocTop: Math.round(t.top), tocBottom: Math.round(t.bottom), inView: t.top>=0 && t.bottom<=innerHeight, open: [...document.querySelectorAll('.toc-section')].filter(s=>!s.querySelector(':scope > ul').hidden).length }; }, f));
   if (f===0.5) await p.screenshot({ path: out+'/before-d1-1440-sticky-50.png' }); }
 const fp = await p.evaluate(() => { const f = document.querySelector('.d1-article .article-footer').getBoundingClientRect(); return { y: f.top + scrollY, h: f.height }; });
 await p.evaluate(()=>document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')); await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
 await p.screenshot({ path: out+'/before-d1-1440-light-footer-full.png', fullPage:true, clip:{x:0,y:fp.y-16,width:1440,height:fp.h+32} });
 require('fs').writeFileSync(out+'/before-sticky-probe.json', JSON.stringify(probe,null,2)+'\n'); console.log(JSON.stringify(probe));
 await b.close(); })();
