/* Frage F, Kandidat 2 — SICHTBARKEIT.
   Wie viele Klicks/Reiterschritte liegen zwischen der Wochenansicht (frischer
   Start, Michaeli, Woche 1) und der Tafel, auf der die Festlegung steht?
   Steht der Knopf dorthin ueber oder unter der Faltkante?

   Kein Spielfortschritt noetig — nur EIN frischer Start je Epoche, EIN Blick,
   EIN Klick. Deshalb kein Playwright-Zufall zu wiederholen; trotzdem 2x je
   Epoche gefahren, um "wiederholbar" tatsaechlich zu zeigen.

   HAFEN=8936 SAAT=1350 node sichtbarkeit-f2.mjs <epoche> [breite] [hoehe]
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const ep    = +(process.argv[2] || 1);
const BR    = +(process.argv[3] || 1600);
const HO    = +(process.argv[4] || 900);
const HAFEN = process.env.HAFEN || '8936';
const SAAT  = process.env.SAAT || '1350';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: BR, height: HO }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push(String(e).slice(0, 200)));

const URL = `http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}&neu=1`;
await seite.goto(URL, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

async function schirm() {
  return await seite.evaluate(() => {
    const zuege = [];
    document.querySelectorAll('[data-zug]').forEach(el => {
      const r = el.getBoundingClientRect();
      let hit = false;
      if (r.width && r.height) {
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
          const t = document.elementFromPoint(cx, cy);
          hit = !!(t && (t === el || el.contains(t)));
        }
      }
      zuege.push({
        zug: el.getAttribute('data-zug'),
        text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90),
        preis: el.hasAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
        aus: !!el.disabled, hit,
        top: Math.round(r.top), bottom: Math.round(r.bottom),
        cx: Math.round(r.left + r.width / 2), cy: Math.round(r.top + r.height / 2),
        w: Math.round(r.width), h: Math.round(r.height)
      });
    });
    const B = window.BRAUHAUS;
    return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, zuege };
  });
}

const vor = await schirm();
const griff = vor.zuege.find(z => z.zug === 'preis:tafel');
const festVor = vor.zuege.filter(z => /^preis:festlege:/.test(z.zug || ''));

let klicksBisFestlegeSichtbar = null, griffPosition = null, festNachher = [];
if (festVor.length) {
  klicksBisFestlegeSichtbar = 0;   // Tafel liegt beim frischen Start schon offen
} else if (griff) {
  await seite.mouse.move(griff.cx, griff.cy, { steps: 3 });
  await seite.mouse.down(); await seite.waitForTimeout(50); await seite.mouse.up();
  await seite.waitForTimeout(400);
  const nach = await schirm();
  festNachher = nach.zuege.filter(z => /^preis:festlege:/.test(z.zug || ''));
  klicksBisFestlegeSichtbar = festNachher.length ? 1 : null;
}

if (griff) {
  griffPosition = {
    top: griff.top, bottom: griff.bottom, cy: griff.cy,
    unterhalbFaltkante: griff.cy > HO || griff.top < 0,
    prozentVonOben: Math.round((griff.cy / HO) * 1000) / 10
  };
}

const festAlle = festVor.length ? festVor : festNachher;
const festDetail = festAlle.map(z => ({
  zug: z.zug, text: z.text, preis: z.preis, aus: z.aus, hit: z.hit,
  cy: z.cy, unterhalbFaltkante: z.cy > HO || z.top < 0
}));

const ausgabe = {
  epoche: ep, fenster: BR + 'x' + HO,
  jahrWoche: vor.jahr + '/' + vor.woche,
  griffGefunden: !!griff, griffText: griff ? griff.text : null,
  griffPosition,
  tafelBeimStartOffen: festVor.length > 0,
  klicksBisFestlegeSichtbar,
  anzahlFestlegeKartenSichtbar: festAlle.length,
  anzahlFestlegeKartenNichtHit: festDetail.filter(f => !f.hit).length,
  festDetail,
  fehler
};
console.log(JSON.stringify(ausgabe));
await browser.close();
