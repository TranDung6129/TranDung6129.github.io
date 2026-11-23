const { chromium } = require('playwright'); const fs=require('fs');
const src=fs.readFileSync('/home/user/axe/node_modules/axe-core/axe.min.js','utf8');
(async()=>{ const b=await chromium.launch(); const out={};
 for (const scheme of ['light','dark']) { const p=await (await b.newContext({viewport:{width:1440,height:900},colorScheme:scheme})).newPage();
  await p.goto(''+(process.argv[2]||'http://127.0.0.1:1338/kinh-te/game_theory_nash/')+'',{waitUntil:'load'}); await p.evaluate(async()=>{ if (window.MathJax?.startup?.promise) await MathJax.startup.promise; }); await p.waitForTimeout(500);
  await p.addScriptTag({content:src});
  const r=await p.evaluate(async()=>{ const a=await axe.run(document,{runOnly:{type:'rule',values:['color-contrast']}}); const i=a.incomplete[0]; if(!i) return {};
    const g={}; i.nodes.forEach(n=>{ const sel=n.target.join(' '); const k=(n.any[0]?.data?.messageKey||'?')+' | '+sel.replace(/:nth-child\(\d+\)/g,'').split(' ').slice(-2).join(' '); g[k]=(g[k]||0)+1; }); return g; });
  out[scheme]=r; }
 console.log(JSON.stringify(out,null,1)); await b.close(); })();
