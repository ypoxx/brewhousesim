import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const EP = process.argv[2];
const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required','--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1400, height: 1200 } });
const mp3 = [], fehl = [];
p.on('response', r => { if (/\.mp3/.test(r.url())) mp3.push({ d: r.url().split('/').pop(), s: r.status() }); });
p.on('requestfailed', r => fehl.push(r.url().split('/').pop() + ' ' + r.failure()?.errorText));
p.on('console', m => { if (m.type()==='error') fehl.push('CONSOLE '+m.text().slice(0,120)); });
p.on('pageerror', e => fehl.push('PAGEERROR '+e.message.slice(0,120)));
await p.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await p.waitForFunction(() => window.BRAUHAUS && window.BRAUHAUS.ton);
for (const z of ['klang:ton','klang:ton']) { const e=p.locator(`[data-zug="${z}"]`).first(); if (await e.count()) await e.click({timeout:2000}).catch(()=>{}); await p.waitForTimeout(300);}
await p.waitForTimeout(6000);
for (let i=0;i<6;i++){ const e=p.locator('[data-zug="weiter"]').first(); await e.click({timeout:2000}).catch(()=>{}); await p.waitForTimeout(400);}
await p.waitForTimeout(3000);
console.log(JSON.stringify({ epoche: EP, mp3Gesamt: mp3.length, nichtOk: mp3.filter(m=>m.s!==200&&m.s!==206), geladen: mp3.map(m=>m.d).sort(), fehl: fehl.slice(0,8),
  lage: await p.evaluate(()=>BRAUHAUS.lage.length), pegel: await p.evaluate(()=>BRAUHAUS.ton.pegel()) }));
await b.close();
