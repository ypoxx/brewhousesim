import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const EP = Number(process.argv[2] || 4);
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
await s.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(600);
const info = await s.evaluate(() => {
  const e = document.querySelector('[data-zug="gegner:blatt"]');
  const q = e.getBoundingClientRect();
  const t = document.elementFromPoint(q.left+q.width/2, q.top+q.height/2);
  return { rect: [q.left,q.top,q.width,q.height], treffer: t ? t.outerHTML.slice(0,120) : null, selbst: t===e||e.contains(t) };
});
console.log(JSON.stringify(info, null, 1));
await s.click('[data-zug="gegner:blatt"]');
await s.waitForTimeout(300);
console.log('nach Klick, Blatt da?', await s.evaluate(()=>!!document.querySelector('.gg-blatt')));
console.log('zuege:', await s.evaluate(()=>BRAUHAUS.zuege().filter(z=>/gegner/.test(z.zug)).length));
await b.close();
