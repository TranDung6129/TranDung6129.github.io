const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('fs');
const url=process.env.P2_URL;
if(!url)throw Error('P2_URL required');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 let outputs=[];
 for(const width of [390,1440])for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width,height:1000},colorScheme:theme});
  const page=await context.newPage();await page.goto(url,{waitUntil:'networkidle'});
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  outputs.push({width,theme,passes:result.passes.length,incomplete:result.incomplete.map(x=>({id:x.id,count:x.nodes.length,nodes:x.nodes.map(n=>({target:n.target,summary:n.failureSummary,html:n.html}))})),violations:result.violations.map(x=>({id:x.id,impact:x.impact,description:x.description,help:x.help,nodes:x.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});await context.close();
 }
 await browser.close();fs.mkdirSync(process.env.P2_QA_OUT || '/tmp/p2-review-qa', {recursive:true});fs.writeFileSync((process.env.P2_QA_OUT || '/tmp/p2-review-qa') + '/axe-results.json',JSON.stringify(outputs,null,2)+'\n');
 console.log(JSON.stringify(outputs.map(x=>({width:x.width,theme:x.theme,violations:x.violations.map(v=>({id:v.id,count:v.nodes.length})),incomplete:x.incomplete})),null,2));
 if(outputs.some(x=>x.violations.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
