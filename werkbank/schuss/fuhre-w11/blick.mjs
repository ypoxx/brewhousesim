/* BLICK — das Bild ansehen, nicht nur zaehlen.
 *   HAFEN=8952 WOCHEN=30 BREITE=2752 HOEHE=1536 node …/blick.mjs name
 * Schreibt je Epoche zwei Aufnahmen: den Anschlag und den aufgeschlagenen
 * Bericht. Dazu die Masse beider Zustaende.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8952';
const W = +(process.env.BREITE || 2752), H = +(process.env.HOEHE || 1536);
const WOCHEN = +(process.env.WOCHEN || 30);
const NAME = process.argv[2] || 'blick';
const EPOCHEN = (process.env.EPOCHEN || '1,2,3,4').split(',').map(Number);

const mass = () => {
  const el = document.querySelector('.fu-sommerblatt');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const roll = el.scrollHeight - el.clientHeight;
  const knopf = [...document.querySelectorAll('[data-zug^="fuhre:jahresplan:"], [data-zug="fuhre:sommer-zu"], [data-zug="fuhre:sommer-bericht"]')]
    .map(k => {
      const q = k.getBoundingClientRect();
      const x = q.left + q.width / 2, y = q.top + q.height / 2;
      const t = (x >= 0 && y >= 0 && x <= innerWidth && y <= innerHeight) ? document.elementFromPoint(x, y) : null;
      return k.getAttribute('data-zug') + ' ' + Math.round(q.width) + '×' + Math.round(q.height)
        + ((t && (t === k || k.contains(t))) ? '' : ' VERDECKT');
    });
  return { mass: Math.round(r.width) + '×' + Math.round(r.height) + ' @' + Math.round(r.x) + ',' + Math.round(r.y),
    flaeche: Math.round(r.width * r.height), rollrest: Math.round(roll), knopf };
};

const b = await chromium.launch();
for (const e of EPOCHEN) {
  const s = await b.newPage({ viewport: { width: W, height: H } });
  const fehler = [];
  s.on('pageerror', x => fehler.push(x.message));
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1600);
  for (let i = 0; i < WOCHEN; i++) {
    await s.evaluate(() => { const k = document.querySelector('[data-zug="weiter"]'); if (k) k.click(); });
    await s.waitForTimeout(180);
  }
  await s.waitForTimeout(900);
  console.log(`E${e} ANSCHLAG  ${JSON.stringify(await s.evaluate(mass))}`);
  writeFileSync(`werkbank/schuss/fuhre-w11/bilder/${NAME}-e${e}-anschlag.png`, await s.screenshot());
  await s.evaluate(() => { const k = document.querySelector('[data-zug="fuhre:sommer-bericht"]'); if (k) k.click(); });
  await s.waitForTimeout(900);
  console.log(`E${e} BERICHT   ${JSON.stringify(await s.evaluate(mass))}`);
  writeFileSync(`werkbank/schuss/fuhre-w11/bilder/${NAME}-e${e}-bericht.png`, await s.screenshot());
  /* und wieder zu */
  await s.evaluate(() => { const k = document.querySelector('[data-zug="fuhre:sommer-bericht"]'); if (k) k.click(); });
  await s.waitForTimeout(700);
  console.log(`E${e} ZURUECK   ${JSON.stringify(await s.evaluate(mass))}  Seitenfehler ${fehler.length}`);
  await s.close();
}
await b.close();
