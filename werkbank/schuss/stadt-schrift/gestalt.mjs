/* DIE GESTALT — was sich beim Setzen der Schriftboeden im Bau bewegt.
 *
 *   HAFEN=8899 node werkbank/schuss/stadt-schrift/gestalt.mjs <ziel.json>
 *
 * WOZU. Der Knopfboden hat bewiesen, dass Groessen die WIRTSCHAFT bewegen:
 * A/B der Aufsicht am selben Commit, 1970 mit Boden rho +0,699, ohne −0,112,
 * Unterschied 0,811 bei null Fehlern. Der Mechanismus ist Geometrie — die
 * Messhand spielt bei 1920x1000, groessere Knoepfe lassen die Bretter
 * umfliessen, und damit aendert sich, welcher Zug der naechste sinnvolle ist.
 *
 * Eine 400-Wochen-Messung kostet 7 bis 15 Minuten im geteilten Messfenster.
 * Die GEOMETRIE kostet Sekunden und beantwortet dieselbe Frage schaerfer:
 * bewegt sich die Oberkante der Werkbank, bewegt sich ein Brett, aendert
 * sich die Zahl der Reiter? Bewegt sich nichts davon, kann rho sich nicht
 * ueber diesen Weg aendern.
 *
 * Gemessen bei 1920x1000 (die Fenstergroesse der Messhand,
 * rueckkopplung-r3/linie.mjs:61) UND bei 1366x768 (die vierte Latte).
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8899';
const ZIEL = process.argv[2] || 'werkbank/schuss/stadt-schrift/gestalt.json';
const FENSTER = [{ w: 1920, h: 1000 }, { w: 1366, h: 768 }];

const b = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
const alles = { stand: new Date().toISOString() };

for (const f of FENSTER) {
  for (const e of [1, 2, 3, 4]) {
    const s = await b.newPage({ viewport: { width: f.w, height: f.h } });
    await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
    await s.waitForTimeout(4200);   /* LADEZEIT in stadt.js ist 2500 ms — darunter
                                       ist die Reiterzahl nicht ausgemessen, sondern
                                       erwischt. Gemessen: bei 1800 ms lieferte 1600
                                       einmal 11 Reiter und einmal 10. */
    const r = await s.evaluate(() => {
      const bue = document.getElementById('buehne').getBoundingClientRect();
      const pr = (el) => {
        if (!el) return null;
        const c = el.getBoundingClientRect();
        return { x: +(100 * (c.left - bue.left) / bue.width).toFixed(3),
                 y: +(100 * (c.top - bue.top) / bue.height).toFixed(3),
                 b: +(100 * c.width / bue.width).toFixed(3),
                 h: +(100 * c.height / bue.height).toFixed(3) };
      };
      const wb = document.querySelector('.stadt-werkbank');
      const bretter = {};
      for (const el of document.querySelectorAll('[id]')) {
        if (!/^(fach|ebene)-/.test(el.id) && el.id !== 'buehne' && el.id !== 'kern-lage'
            && el.getBoundingClientRect().width > 0) bretter[el.id] = pr(el);
      }
      /* jeder bedienbare Zug mit Kasten — daran haengt, was die Messhand trifft */
      const zuege = [...document.querySelectorAll('[data-zug]')].map(x => {
        const c = x.getBoundingClientRect();
        return { zug: x.getAttribute('data-zug'), aus: !!x.disabled,
                 b: Math.round(c.width), h: Math.round(c.height),
                 x: Math.round(c.left), y: Math.round(c.top) };
      });
      /* Die eine Zahl, an der haengt, ob die Werkbank einem fremden Stueck
         einen Zug wegnimmt: ein aktiver Zug, der unter Reiterzeile oder
         Bauhof liegt und dort nicht mehr obenauf ist. Muss 0 bleiben. */
      const verdeckt = (window.BRAUHAUS && BRAUHAUS.stadt && BRAUHAUS.stadt.rahmen)
        ? BRAUHAUS.stadt.rahmen.verdeckt() : null;
      return {
        verdeckt: Array.isArray(verdeckt) ? verdeckt.length : verdeckt,
        verdeckt_wer: Array.isArray(verdeckt) ? verdeckt.slice(0, 5) : null,
        werkbank: pr(wb),
        reiterzeile: pr(document.querySelector('.stadt-reiterzeile')),
        bauhof: pr(document.querySelector('.stadt-bauhof')),
        reiter: document.querySelectorAll('.knopf.stadt-reiter').length,
        zugeklappt: document.querySelectorAll('.stadt-zugeklappt').length,
        pfloecke: document.querySelectorAll('.knopf.stadt-pflock').length,
        weiter: pr(document.querySelector('[data-zug="weiter"]')),
        bretter,
        zuege_n: zuege.length,
        zuege_aktiv: zuege.filter(z => !z.aus).length,
        zuege
      };
    });
    alles[`${f.w}x${f.h}_e${e}`] = r;
    console.log(`${f.w}x${f.h} E${e}: Werkbank oben ${r.werkbank.y} %  hoch ${r.werkbank.h} %  ` +
                `| Reiter ${r.reiter} · zugeklappt ${r.zugeklappt} · Pfloecke ${r.pfloecke} ` +
                `| Zuege ${r.zuege_n} (aktiv ${r.zuege_aktiv}) · verdeckt ${r.verdeckt}`);
    await s.close();
  }
}
await b.close();
writeFileSync(ZIEL, JSON.stringify(alles, null, 2));
console.log('geschrieben: ' + ZIEL);
