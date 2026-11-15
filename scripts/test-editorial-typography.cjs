const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  for (const width of [360, 1440]) for (const theme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const response = await page.goto('http://127.0.0.1:1317/editorial-review/', { waitUntil: 'load' });
    await page.evaluate(value => document.documentElement.dataset.edTheme = value, theme);
    const result = await page.evaluate(() => ({
      vietnamese: document.body.innerText.includes('Giả thuyết Riemann'),
      mathWidth: document.querySelector('math')?.getBoundingClientRect().width,
      code: document.querySelector('pre code')?.innerText,
      overflow: document.documentElement.scrollWidth > innerWidth
    }));
    if (response.status() !== 200 || !result.vietnamese || !result.mathWidth || !result.code || result.overflow) throw Error(JSON.stringify(result));
    await page.screenshot({ path: `/tmp/p202-${width}-${theme}.png`, fullPage: true });
    console.log(width, theme, JSON.stringify(result));
    await page.close();
  }
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
