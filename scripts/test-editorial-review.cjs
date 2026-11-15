const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const base = process.env.P2_URL;
if (!base) throw Error('P2_URL is required');
const out = process.env.P2_QA_OUT || '/tmp/p2-qa/output';
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const report={method:'Unthrottled headless Chromium; isolated local Hugo preview; reduced-motion preferred; fresh context per viewport/theme; no TLS bypass; synthetic interaction assertions only, no visual approval or full WCAG/performance certification.',browser:browser.version(),url:base,checks:[],screenshots:[],console:[],failedRequests:[],httpErrors:[],links:[],measurements:[]};
 function record(name,passed,details){report.checks.push({name,passed:!!passed,details});}
 for(const width of [360,390,768,1024,1440]) for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width,height:1000},colorScheme:theme,reducedMotion:'reduce'});
  const page=await context.newPage();
  page.on('pageerror',e=>report.console.push({width,theme,type:'pageerror',message:e.message}));
  page.on('console',m=>{if(['warning','error'].includes(m.type()))report.console.push({width,theme,type:m.type(),message:m.text()});});
  page.on('requestfailed',r=>report.failedRequests.push({width,theme,url:r.url(),error:r.failure()?.errorText}));
  page.on('response',r=>{if(r.status()>=400)report.httpErrors.push({width,theme,url:r.url(),status:r.status()});});
  const response=await page.goto(base,{waitUntil:'networkidle',timeout:45000});
  await page.screenshot({path:path.join(out,`specimen-${width}-${theme}.png`),fullPage:true});
  const metrics=await page.evaluate(()=>({statusTheme:document.documentElement.dataset.edTheme,scrollWidth:document.documentElement.scrollWidth,innerWidth,bodyHeight:document.documentElement.scrollHeight,heading:document.querySelector('h1')?.innerText,mathCount:document.querySelectorAll('math').length,mathWidth:document.querySelector('math')?.getBoundingClientRect().width,lang:document.documentElement.lang,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,resourceCount:performance.getEntriesByType('resource').length,nav:performance.getEntriesByType('navigation').map(n=>({duration:n.duration,domContentLoaded:n.domContentLoadedEventEnd,load:n.loadEventEnd,transferSize:n.transferSize})),paint:performance.getEntriesByType('paint').map(p=>({name:p.name,startTime:p.startTime})),images:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src), imagesWithoutAlt:[...document.querySelectorAll('img:not([alt])')].map(i=>i.src), buttonsWithoutNames:[...document.querySelectorAll('button')].filter(b=>!((b.getAttribute('aria-label')||b.innerText||b.getAttribute('title')||'').trim())).map(b=>b.outerHTML.slice(0,200)), headings:[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h=>({level:+h.tagName.slice(1),text:h.innerText.trim().slice(0,80)})),controls:[...document.querySelectorAll('.menu-toggle,.tools button')].filter(e=>getComputedStyle(e).display!=='none').map(e=>{let r=e.getBoundingClientRect();return {name:e.className,width:r.width,height:r.height}})}));
  report.screenshots.push({width,theme,path:`specimen-${width}-${theme}.png`,httpStatus:response?.status(),...metrics});
  record(`${width}/${theme}: http 200`,response?.status()===200,response?.status());
  record(`${width}/${theme}: no horizontal overflow`,metrics.scrollWidth<=metrics.innerWidth,{scrollWidth:metrics.scrollWidth,innerWidth:metrics.innerWidth});
  record(`${width}/${theme}: requested theme`,metrics.statusTheme===theme,metrics.statusTheme);
  record(`${width}/${theme}: reduced motion`,metrics.reducedMotion,metrics.reducedMotion);
  record(`${width}/${theme}: rendered MathML`,metrics.mathCount>0 && metrics.mathWidth>0,{count:metrics.mathCount,width:metrics.mathWidth});
  record(`${width}/${theme}: images have alt attributes`,metrics.imagesWithoutAlt.length===0,metrics.imagesWithoutAlt);
  record(`${width}/${theme}: buttons have accessible name candidates`,metrics.buttonsWithoutNames.length===0,metrics.buttonsWithoutNames);
  if(width<=390)record(`${width}/${theme}: mobile controls >=44x44`,metrics.controls.every(x=>x.width>=44&&x.height>=44),metrics.controls);
  if(width===1440 && theme==='light'){
   const links=await page.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>({text:a.innerText.trim().slice(0,80),href:a.getAttribute('href')})));
   for(const link of links){if(link.href.startsWith('#')){link.ok=await page.evaluate(h=>!!document.getElementById(h.slice(1)),link.href)}else if(link.href.startsWith('/')){const r=await page.request.get(new URL(link.href,base).href);link.ok=r.status()===200;link.status=r.status()}else link.ok=!/^(javascript:|#\s*$)/i.test(link.href)}
   report.links=links;record('no broken visible demo destinations',links.every(x=>x.ok),links.filter(x=>!x.ok));
   const nav=page.locator('#editorial-nav');record('desktop navigation visible',await nav.isVisible());
   const themeButton=page.locator('.theme-toggle');await themeButton.click();record('theme toggles',await page.evaluate(()=>document.documentElement.dataset.edTheme)==='dark');await page.reload({waitUntil:'networkidle'});record('theme persists on reload',await page.evaluate(()=>document.documentElement.dataset.edTheme)==='dark');
   await page.locator('.search-toggle').click();await page.locator('#specimen-search').fill('Nash');await page.waitForTimeout(700);const hits=await page.locator('.search-results a').count();record('search returns published Nash result',hits>0,{hits,text:await page.locator('.search-status').innerText()});
   await page.locator('#specimen-search').press('Escape');record('search closes on Escape',await page.locator('#search-panel').isHidden());
   await page.keyboard.press('Tab');const focus=await page.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.innerText.slice(0,80),outline:getComputedStyle(document.activeElement).outline,boxShadow:getComputedStyle(document.activeElement).boxShadow}));record('keyboard can focus an element',focus.tag!=='BODY',focus);report.keyboardFocus=[focus];for(let i=0;i<11;i++){await page.keyboard.press('Tab');report.keyboardFocus.push(await page.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.innerText.slice(0,80),outline:getComputedStyle(document.activeElement).outline,boxShadow:getComputedStyle(document.activeElement).boxShadow})));}
  }
  if(width===360 && theme==='light'){
   const button=page.locator('.menu-toggle'),nav=page.locator('#editorial-nav');record('mobile menu button visible',await button.isVisible());await button.click();record('mobile menu opens with aria-expanded',await button.getAttribute('aria-expanded')==='true' && await nav.isVisible());await nav.locator('a').first().click();record('mobile menu closes after selection',await button.getAttribute('aria-expanded')==='false');
  }
  await context.close();
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2)+'\n');
 await browser.close();
 const failures=report.checks.filter(x=>!x.passed);console.log(JSON.stringify({checks:report.checks.length,failures,screenshots:report.screenshots.length,console:report.console.length,failedRequests:report.failedRequests.length,httpErrors:report.httpErrors.length},null,2));
 if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
