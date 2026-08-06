/* DER SCHMALE SCHIRM — welcher Kasten schneidet bei 1366x768 wirklich ab.

   `aufsicht/lesbarkeit.mjs` zaehlt Ueberlaeufe und nennt nur das erste Wort
   der Klasse: „gg:1". Das genuegt fuer eine Latte und nicht fuer eine
   Reparatur — man weiss nicht, WELCHER Kasten, um WIEVIEL, und ob eine ZAHL
   oder ein Satz darunter leidet. Auflage 10 unterscheidet das ausdruecklich:
   eine falsch gelesene Zahl ist schlimmer als ein gekuerzter Satz.

   Dieselbe Pruefung wie dort, Zeichen fuer Zeichen (`kappt()` je Richtung),
   nur mit Namen, Mass und Text dahinter.

     HAFEN=8962 BREITE=1366 HOEHE=768 node werkbank/schuss/gegner-w11/schmal.mjs
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN  = process.env.HAFEN || '8962';
const BREITE = +(process.env.BREITE || 1366), HOEHE = +(process.env.HOEHE || 768);
const b = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: BREITE, height: HOEHE } });
  const fehler = [];
  s.on('pageerror', x => fehler.push(String(x)));
  s.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1300);
  const r = await s.evaluate(() => {
    const kappt = v => v === 'hidden' || v === 'clip';
    const raus = [];
    [...document.querySelectorAll('*')].forEach(el => {
      const c = getComputedStyle(el);
      const dY = el.scrollHeight - el.clientHeight, dX = el.scrollWidth - el.clientWidth;
      const abY = dY > 1 && kappt(c.overflowY), abX = dX > 1 && kappt(c.overflowX);
      if (!abY && !abX) return;
      const k = typeof el.className === 'string' ? el.className : '?';
      const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      raus.push({
        stueck: k.split(/[\s-]/)[0], klasse: k, tag: el.tagName.toLowerCase(),
        richtung: (abX ? 'waagerecht ' : '') + (abY ? 'senkrecht' : ''),
        fehlt: (abX ? `${dX} px breit` : '') + (abX && abY ? ' · ' : '') + (abY ? `${dY} px hoch` : ''),
        mass: `${Math.round(el.clientWidth)}×${Math.round(el.clientHeight)}`,
        ziffern: /\d/.test(t), text: t.slice(0, 90),
      });
    });
    const lage = (window.BRAUHAUS && BRAUHAUS.lage && BRAUHAUS.lage.length) || 0;
    return { raus, lage, jahr: window.BRAUHAUS && BRAUHAUS.jahr };
  });
  console.log(`=== EPOCHE ${e}  Jahr ${r.jahr}  lage ${r.lage}  Seitenfehler ${fehler.length}`);
  if (!r.raus.length) console.log('  kein abgeschnittener Kasten');
  for (const x of r.raus)
    console.log(`  ${x.stueck.padEnd(6)} ${x.richtung.padEnd(22)} fehlt ${x.fehlt.padEnd(24)} ` +
                `${x.mass.padStart(9)}  ${x.tag}.${x.klasse}${x.ziffern ? '  [ZIFFERN]' : ''}\n` +
                `         „${x.text}“`);
  fehler.forEach(f => console.log('  SEITENFEHLER ' + f));
  await s.close();
}
await b.close();
