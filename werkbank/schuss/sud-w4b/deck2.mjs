import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = +(process.argv[2] || 8915);
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=1&saat=1350`, { waitUntil: 'networkidle', timeout: 60000 });
await seite.waitForTimeout(1000);
const lage = (z) => seite.evaluate((zz) => {
  const k = document.querySelector(`button[data-zug="${zz}"]`);
  if (!k) return null;
  const r = k.getBoundingClientRect();
  const x = r.left + r.width/2, y = r.top + r.height/2;
  const t = document.elementFromPoint(x,y);
  const kette = [];
  let e = t; while (e && kette.length < 6) { kette.push(e.tagName + (e.id ? '#'+e.id : '') + (e.className ? '.'+String(e.className).split(' ').join('.') : '')); e = e.parentElement; }
  return { x, y, aus: !!k.disabled, trifft: !!(t && (t===k || k.contains(t))), kette };
}, z);
const klick = async (z, w=60) => { const p = await lage(z); if (!p||p.aus||!p.trifft) return false;
  await seite.mouse.click(p.x,p.y); await seite.waitForTimeout(w); return true; };
// Anschlagtafel auf, Rohstoff kaufen, zu — wie das Skript
await klick('stadt:reiter:fuhre-fu-brett-fu-schiefer-fu-tafel');
await klick('fuhre:kauf:rohstoff');
await klick('stadt:reiter:fuhre-fu-brett-fu-schiefer-fu-tafel');
await klick('stadt:reiter:fuhre-fu-brett-fu-wagen');
await seite.waitForTimeout(400);
console.log('fuhre:fuellen  ->', JSON.stringify(await lage('fuhre:fuellen'), null, 1));
const z = await seite.evaluate(() => { const q = document.querySelector('.sud-zettel');
  const r = q.getBoundingClientRect(); return { klasse: q.className, r: [r.left,r.top,r.right,r.bottom],
    sitz: window.BRAUHAUS.SUD_ZUSTAND.zettelSitz }; });
console.log('Zettel:', JSON.stringify(z));
await browser.close();
