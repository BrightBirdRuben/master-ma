const {chromium}=require('C:/Users/Ruben/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'), path=require('path'), assert=require('assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try {
 const context=await browser.newContext(); let posts=0;
 await context.route('**/*', async route=>{
  const url=new URL(route.request().url());
  if(url.hostname==='formspree.io') {posts++; assert.equal(url.pathname,'/f/mgaelydl'); return route.fulfill({contentType:'application/json',body:'{"ok":true}'});}
  if(url.hostname==='www.googletagmanager.com') return route.fulfill({contentType:'application/javascript',body:''});
  if(url.hostname!=='www.masterma.be') return route.abort();
  const file=path.join(__dirname,'meting-upload-opnieuw',url.pathname);
  if(!fs.existsSync(file))return route.fulfill({status:404,body:''});
  return route.fulfill({body:fs.readFileSync(file),contentType:({'.html':'text/html','.js':'application/javascript','.css':'text/css'})[path.extname(file)]||'application/octet-stream'});
 });
 const page=await context.newPage(); await page.goto('https://www.masterma.be/contact.html');
 assert.deepEqual(await page.locator('#contact-form [required]').evaluateAll(els=>els.map(e=>e.id)),['name','email','privacy']);
 assert.equal(await page.locator('#company,#kbo,#timing').count(),0);
 await page.getByRole('button',{name:'Statistieken aanvaarden'}).click();
 await page.locator('#name').fill('Lokale test'); await page.locator('#email').fill('test@example.invalid'); await page.locator('#privacy').check();
 await page.locator('#contact-form button[type=submit]').first().click();
 await page.waitForFunction(()=>document.getElementById('contact-status').textContent.startsWith('Bedankt voor uw aanvraag'));
 assert.equal(posts,1);
 assert.equal(await page.evaluate(()=>window.dataLayer.filter(e=>e[0]==='event'&&e[1]==='generate_lead').length),1);
 for(const width of [390,1280]) {await page.setViewportSize({width,height:900}); assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow at '+width);}
 console.log('PASS: minimum fields accepted, existing endpoint, success text, one lead event, mobile and desktop width. No external requests sent.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

