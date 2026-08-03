// schritt.mjs — Dieselbe Spielweise wie rettung.mjs, aber jeder Klick wird
// einzeln protokolliert: gelungen, abgeschaltet, nicht getroffen — und wenn
// nicht getroffen, WAS stattdessen unter dem Mauszeiger lag.
//
//   node schritt.mjs <epoche> <hafen> <wochen>

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const EPOCHE = +(process.argv[2] || 1);
const HAFEN = +(process.argv[3] || 8915);
const WOCHEN = +(process.argv[4] || 14);
const ROH = [40, 65, 120, 340][EPOCHE - 1];

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EPOCHE}&saat=1350`,
  { waitUntil: 'networkidle', timeout: 60000 });
await seite.waitForTimeout(900);

const lage = (z) => seite.evaluate((zz) => {
  const k = document.querySelector(`button[data-zug="${zz}"]`);
  if (!k) return null;
  const r = k.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const drin = r.width >= 3 && r.height >= 3 && x >= 0 && y >= 0 && x <= innerWidth && y <= innerHeight;
  const t = drin ? document.elementFromPoint(x, y) : null;
  return { x, y, aus: !!k.disabled, trifft: !!(t && (t === k || k.contains(t))),
    drin, drauf: t ? (t.className || t.tagName) : null,
    sollAus: k.getAttribute('data-soll-aus'), verdeckt: k.getAttribute('data-verdeckt') };
}, z);

const spur = [];
const klick = async (z, w = 40) => {
  const p = await lage(z);
  if (!p) { spur.push([z, 'fehlt']); return false; }
  if (p.aus) { spur.push([z, 'aus', p.sollAus, p.verdeckt]); return false; }
  if (!p.trifft) { spur.push([z, 'NICHT GETROFFEN <- ' + p.drauf]); return false; }
  await seite.mouse.click(p.x, p.y); await seite.waitForTimeout(w);
  spur.push([z, 'ok']); return true;
};

for (let w = 0; w < WOCHEN; w++) {
  const st = await seite.evaluate(() => ({ jahr: window.BRAUHAUS.welt.zeit.jahr,
    woche: window.BRAUHAUS.welt.zeit.woche,
    kasse: Math.round(window.BRAUHAUS.welt.haus.kasse),
    roh: Math.round(window.BRAUHAUS.welt.haus.rohstoff),
    faesser: window.BRAUHAUS.welt.vorrat.faesser.length }));
  spur.length = 0;
  await klick('fuhre:sommer-zu');
  const roh = await seite.evaluate(() => Math.round(window.BRAUHAUS.welt.haus.rohstoff));
  if (roh < ROH / 2) { await klick('stadt:reiter:fuhre-fu-brett-fu-schiefer-fu-tafel', 60);
    await klick('fuhre:kauf:rohstoff'); await klick('stadt:reiter:fuhre-fu-brett-fu-schiefer-fu-tafel', 60); }
  await klick('stadt:reiter:fuhre-fu-brett-fu-wagen', 60);
  if (!await klick('fuhre:fuellen')) await klick('fuhre:wie-vorige');
  await klick('fuhre:abschicken', 70);
  await klick('stadt:reiter:fuhre-fu-brett-fu-wagen', 60);
  await klick('sud:zettel-anstich');
  console.log(String(st.jahr + '/' + st.woche).padEnd(9) + ' Kasse ' + String(st.kasse).padStart(5)
    + '  Roh ' + String(st.roh).padStart(4) + '  Fass ' + String(st.faesser).padStart(3) + '   '
    + spur.map((s) => s[0].replace(/^stadt:reiter:fuhre-fu-brett-fu-/, 'R:').replace(/^fuhre:/, '')
        + '=' + s.slice(1).join('/')).join('  '));
  if (!await klick('weiter', 45)) {
    await seite.evaluate(() => { const k = document.querySelector('button[data-zug="weiter"]');
      if (k) { k.disabled = false; k.click(); } });
    await seite.waitForTimeout(45);
  }
  const ende = await seite.evaluate(() => !!window.BRAUHAUS.welt.zeit.ende);
  if (ende) { console.log('   ENDE'); break; }
}
await browser.close();
