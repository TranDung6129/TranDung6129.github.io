const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const out=process.env.BASELINE_OUTPUT || '/tmp/p1-02-browser';fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const results={method:'Single-run headless Chromium against unmodified production output served by python http.server on localhost:1314; normal external requests retained; no production-origin rewrites, trust bypass, CPU/network throttle or field CWV claim.',browser:browser.version(),screenshots:[],pages:[],checks:[],errors:[],requestsFailed:[]};
 const context=await browser.newContext({viewport:{width:1440,height:1000},colorScheme:'light',permissions:['clipboard-read','clipboard-write']});
 const page=await context.newPage();
 page.on('pageerror',e=>results.errors.push({page:page.url(),message:e.message}));
 page.on('requestfailed',r=>results.requestsFailed.push({page:page.url(),url:r.url(),error:r.failure()?.errorText}));
 page.on('response',r=>{if(r.status()>=400)results.errors.push({page:page.url(),url:r.url(),status:r.status()});});
 const base='http://127.0.0.1:1314';
 async function visit(p){const r=await page.goto(base+p,{waitUntil:'load',timeout:45000});await page.waitForTimeout(1200);return r.status();}
 for(const route of ['/','/en/','/ja/','/zh-cn/','/kinh-te/game_theory_nash/','/en/kinh-te/game_theory_nash/','/khoa-hoc-may-tinh/complexity-theory-quantum/','/about/']){
  const status=await visit(route);
  results.pages.push({route,status,...await page.evaluate(()=>({lang:document.documentElement.lang,title:document.title,h1:document.querySelectorAll('h1').length,canonical:document.querySelector('link[rel=canonical]')?.href,mathContainers:document.querySelectorAll('mjx-container').length,mathLoader:!!document.querySelector('script[src*="mathjax"]'),codeBlocks:document.querySelectorAll('.highlight').length,tocLinks:document.querySelectorAll('#toc-auto a').length,images:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),performance:{navigation:performance.getEntriesByType('navigation').map(n=>({duration:n.duration,domContentLoaded:n.domContentLoadedEventEnd,load:n.loadEventEnd,transferSize:n.transferSize})),paint:performance.getEntriesByType('paint').map(p=>({name:p.name,startTime:p.startTime})),resources:performance.getEntriesByType('resource').length}}))});
 }
 await visit('/kinh-te/game_theory_nash/');
 const react=page.locator('[id^="react-root-Nash"]');
 const before=await react.innerText();await page.getByRole('button',{name:'Matching Pennies',exact:true}).click();await page.waitForTimeout(300);const after=await react.innerText();
 results.checks.push({name:'Nash preset state updates (vi)',passed:before.includes('Pure-strategy NE: (Bottom, Right)')&&after.includes('p* = 0.500')&&after.includes('q* = 0.500'),before:before.match(/Pure-strategy NE:[^\n]*/),after:after.slice(after.indexOf('Equilibrium Analysis'),after.indexOf('Expected Payoffs'))});
 const first=react.locator('input[type=range]').first(); const old=await first.inputValue();await first.focus();await first.press('ArrowRight');const current=await first.inputValue();results.checks.push({name:'Nash payoff keyboard slider',passed:old!==current,before:old,after:current});
 const toc=page.locator('#toc-auto a').first();const href=await toc.getAttribute('href');await toc.click();results.checks.push({name:'TOC anchor navigation',passed:page.url().endsWith(href),href,url:page.url()});
 const theme=page.locator('.theme-switch').first();const themeBefore=await page.evaluate(()=>document.documentElement.getAttribute('data-theme'));await theme.click();const themeAfter=await page.evaluate(()=>document.documentElement.getAttribute('data-theme'));results.checks.push({name:'Theme toggle changes html data-theme',passed:themeBefore!==themeAfter,before:themeBefore,after:themeAfter});
 await page.reload({waitUntil:'load'});results.checks.push({name:'Theme choice survives reload',passed:await page.evaluate(()=>document.documentElement.getAttribute('data-theme'))===themeAfter,theme:await page.evaluate(()=>document.documentElement.getAttribute('data-theme'))});
 await visit('/');await page.locator('#search-toggle-desktop').click();await page.locator('#search-input-desktop').fill('Nash');await page.waitForTimeout(2000);results.checks.push({name:'Desktop search returns Nash results',passed:await page.locator('#search-dropdown-desktop a').count()>0,count:await page.locator('#search-dropdown-desktop a').count(),text:(await page.locator('#search-dropdown-desktop').innerText()).slice(0,300)});
 await visit('/khoa-hoc-may-tinh/complexity-theory-quantum/');results.checks.push({name:'Fenced code rendered',passed:await page.locator('.highlight').count()>0,blocks:await page.locator('.highlight').count(),copyControls:await page.locator('.highlight .copy').count()});
 await page.locator('.highlight .code-title').first().click();const code=page.locator('.highlight .code-header').first();await code.hover();const copy=page.locator('.highlight .copy').first();if(await copy.isVisible()){await copy.click({timeout:2000});await page.waitForTimeout(200);const clipboard=await page.evaluate(()=>navigator.clipboard.readText());results.checks.push({name:'Code copy writes clipboard',passed:clipboard.length>0,characters:clipboard.length,prefix:clipboard.slice(0,120)});}else{results.checks.push({name:'Code copy writes clipboard',passed:false,reason:'Copy control exists but remains display:none after code-header hover; user-like click unavailable; no force click used.'});}
 for(const width of [360,768,1024,1440])for(const scheme of ['light','dark']){
  const shotContext=await browser.newContext({viewport:{width,height:1000},colorScheme:scheme,reducedMotion:'reduce'});const sp=await shotContext.newPage();
  for(const [name,route] of [['home','/'],['nash','/kinh-te/game_theory_nash/']]){
   await sp.goto(base+route,{waitUntil:'load',timeout:45000});await sp.waitForTimeout(800);
   const file=`${name}-${width}-${scheme}.png`;await sp.screenshot({path:path.join(out,file)});
   results.screenshots.push({file,width,scheme,route,...await sp.evaluate(()=>({bodyTheme:document.documentElement.getAttribute('data-theme'),horizontalOverflow:document.documentElement.scrollWidth>innerWidth,scrollWidth:document.documentElement.scrollWidth,innerWidth,reactDisplay:document.querySelector('[id^="react-root-Nash"]')?getComputedStyle(document.querySelector('[id^="react-root-Nash"]')).display:null,mobileFallback:document.querySelector('.react-mobile-fallback')?getComputedStyle(document.querySelector('.react-mobile-fallback')).display:null}))});
  }await shotContext.close();
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2)+'\n');await browser.close();if(results.checks.some(c=>!c.passed))process.exitCode=1;console.log(JSON.stringify({checks:results.checks,screenshots:results.screenshots.length,errors:results.errors,failed:results.requestsFailed.length},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
