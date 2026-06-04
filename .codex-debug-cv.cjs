const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(`PAGEERROR: ${err.message}\n${err.stack}`));
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => localStorage.setItem('jobready_demo_session', JSON.stringify({id:'debug', name:'Debug User', email:'debug@example.com', provider:'phone', profileCompleted:true, role:'user'})));
  await page.goto('http://localhost:3000/cv/create', { waitUntil: 'networkidle', timeout: 30000 }).catch(async e => errors.push(`GOTO: ${e.message}`));
  await page.waitForTimeout(3000);
  console.log('URL:', page.url());
  console.log('TITLE:', await page.title());
  console.log('TEXT:', (await page.locator('body').innerText().catch(e => `ERR ${e.message}`)).slice(0, 1200));
  console.log('HTMLLEN:', (await page.content()).length);
  console.log('ERRORS:', JSON.stringify(errors, null, 2));
  await page.screenshot({ path: 'cv-create-debug.png', fullPage: false });
  await browser.close();
})();
