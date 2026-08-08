/* MASS — was die Auflagen R15 und R16 an der GEOMETRIE anrichten.

   Die Lehre der Aufsicht heißt: Größen bewegen die Wirtschaft. R16 schreibt
   die Zahl der Züge in die Überschrift meines Reiters; ein breiterer oder
   höherer Reiter kann die Reiterzeile umbrechen lassen, die Werkbank tiefer
   machen und damit Knöpfe verschieben, die eine messende Hand trifft oder
   nicht trifft. Also wird nachgemessen und nicht behauptet.

   Gemessen wird an derselben Woche in zwei Bäumen (Hafen A und B):
   Reiterzeile, Werkbank, der eigene Reiter, und die drei Knöpfe, an denen
   jede Messung dieses Loops hängt.

   HAFEN_A=8931 HAFEN_B=8932 node mass.mjs <epoche> <wochen>                 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const ep = +(process.argv[2] || 1);
const N = +(process.argv[3] || 34);
const A = process.env.HAFEN_A || '8931';
const Bp = process.env.HAFEN_B || '8932';
const BREITE = +(process.env.BREITE || 1600);
const HOEHE = +(process.env.HOEHE || 900);

const browser = await chromium.launch();

async function lauf(hafen) {
  const seite = await browser.newPage({ viewport: { width: BREITE, height: HOEHE }, deviceScaleFactor: 1 });
  await seite.goto(`http://127.0.0.1:${hafen}/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(1200);
  const mass = () => seite.evaluate(() => {
    const r = (s) => { const e = document.querySelector(s); if (!e) return null;
      const b = e.getBoundingClientRect();
      return { x: Math.round(b.x), y: Math.round(b.y), b: Math.round(b.width), h: Math.round(b.height) }; };
    const B = window.BRAUHAUS;
    return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche,
      zeile: r('.stadt-reiterzeile'), werkbank: r('.stadt-werkbank'),
      schmal: !!document.querySelector('.stadt-werkbank.schmal'),
      reiterZahl: document.querySelectorAll('[data-zug^="stadt:reiter:"]').length,
      meiner: r('[data-zug="stadt:reiter:gegner-amort-gg-band"]'),
      meinerText: (() => { const e = document.querySelector('[data-zug="stadt:reiter:gegner-amort-gg-band"]');
        return e ? (e.innerText || '').trim().replace(/\s+/g, ' ') : null; })(),
      weiter: r('[data-zug="weiter"]'), abschicken: r('[data-zug="fuhre:abschicken"]'),
      wievorige: r('[data-zug="fuhre:wie-vorige"]') };
  });
  async function klick(zug) {
    const l = await seite.evaluate(z => {
      const e = document.querySelector(`[data-zug="${z}"]`); if (!e) return null;
      const b = e.getBoundingClientRect(); if (!b.width || !b.height) return null;
      const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      const t = document.elementFromPoint(cx, cy);
      return { x: cx, y: cy, aus: !!e.disabled, hit: !!(t && (t === e || e.contains(t))) };
    }, zug);
    if (!l || l.aus || !l.hit) return false;
    await seite.mouse.click(l.x, l.y); await seite.waitForTimeout(240); return true;
  }
  const reihe = [];
  for (let i = 0; i < N; i++) {
    reihe.push(await mass());
    if (!(await klick('fuhre:wie-vorige'))) await klick('fuhre:fuellen');
    await klick('fuhre:abschicken');
    await klick('weiter');
  }
  await seite.close();
  return reihe;
}

const a = await lauf(A);
const b = await lauf(Bp);
const gleich = (x, y) => JSON.stringify(x) === JSON.stringify(y);
let abw = 0;
for (let i = 0; i < Math.min(a.length, b.length); i++) {
  const felder = ['zeile', 'werkbank', 'schmal', 'reiterZahl', 'meiner', 'weiter', 'abschicken', 'wievorige'];
  const diff = felder.filter(f => !gleich(a[i][f], b[i][f]));
  if (diff.length || i < 2 || i === 30) {
    console.log(`W${i + 1} A=${a[i].jahr}/${a[i].woche} B=${b[i].jahr}/${b[i].woche}  `
      + `${diff.length ? 'ABWEICHUNG: ' + diff.join(',') : 'gleich'}`);
    diff.forEach(f => console.log(`     ${f}\n       A ${JSON.stringify(a[i][f])}\n       B ${JSON.stringify(b[i][f])}`));
    if (i < 2 || i === 30) {
      console.log(`     Reiter A "${a[i].meinerText}"  ${JSON.stringify(a[i].meiner)}`);
      console.log(`     Reiter B "${b[i].meinerText}"  ${JSON.stringify(b[i].meiner)}`);
      console.log(`     Zeile A ${JSON.stringify(a[i].zeile)}  B ${JSON.stringify(b[i].zeile)}`);
      console.log(`     Werkbank A ${JSON.stringify(a[i].werkbank)}  B ${JSON.stringify(b[i].werkbank)}`);
    }
  }
  if (diff.length) abw++;
}
console.log(`\nWochen mit Abweichung an Zeile/Werkbank/Reiter/Knöpfen: ${abw} von ${Math.min(a.length, b.length)}`);
await browser.close();
