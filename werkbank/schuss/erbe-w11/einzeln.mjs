/* Abschrift von werkbank/schuss/rahmen-w10/einzeln.mjs — dasselbe Verfahren,
   nur die Auswahl der Kaesten kommt aus der Umgebung (SEL) und die Ausgabe
   liegt hier. Am fremden Messgeraet wird nicht gedreht. */
/* EIN EINZELNER KASTEN, photographisch gemessen — die Zahl, nach der Auflage
   R1 fragt: „die KOPFLEISTE ALLEIN unter 12 % des obersten Sechstels".
   Der Stueck-Anteil `kern` in messen.mjs traegt Kopfleiste, Hauszeile,
   WEITER-Tafel und Deckungsband zusammen; hier wird jeder fuer sich
   weggenommen und die Differenz zweier Aufnahmen gezaehlt — dasselbe
   Verfahren wie bild-w9/deckung.mjs, nur auf einen Kasten angesetzt.
     HAFEN=8930 NAME=vorher2 node werkbank/schuss/rahmen-w10/einzeln.mjs      */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { pngLesen } from '../aufsicht/png-lesen.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8930';
const NAME = process.env.NAME || 'lauf';
const W = 2752, H = 1536, S6 = Math.floor(H / 6);
const SEL = (process.env.SEL || '.erb-leiste,.erb-buch,.erb-knoepfe').split(',');
const ZIEL = 'werkbank/schuss/erbe-w11/messungen';
mkdirSync(ZIEL, { recursive: true });

const b = await chromium.launch();
const zeilen = [];
for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: W, height: H } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1600);
  await s.addStyleTag({ content:
    '*,*::before,*::after{animation-play-state:paused !important;'
    + 'animation-delay:0s !important;transition:none !important;}' });
  await s.waitForTimeout(400);
  const A = pngLesen(await s.screenshot());
  zeilen.push(`=== EPOCHE ${e}`);
  for (const sel of SEL) {
    const da = await s.evaluate((q) => {
      const el = document.querySelector('#buehne ' + q);
      if (!el) return null;
      el.setAttribute('data-einzeln', '1');
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), b: Math.round(r.width), h: Math.round(r.height) };
    }, sel);
    if (!da) { zeilen.push(`  ${sel.padEnd(20)} fehlt`); continue; }
    await s.evaluate(() => document.querySelectorAll('[data-einzeln]')
      .forEach(el => { el.style.visibility = 'hidden'; }));
    await s.waitForTimeout(260);
    const Bd = pngLesen(await s.screenshot());
    /* Maske: 30 px um die Huelle, damit der Schlagschatten mitzaehlt. */
    const x0 = Math.max(0, da.x - 30), y0 = Math.max(0, da.y - 30);
    const x1 = Math.min(W, da.x + da.b + 30), y1 = Math.min(H, da.y + da.h + 30);
    let ges = 0, oben = 0, unten = 0;
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * W + x) * 4;
        if (Math.abs(A.daten[i] - Bd.daten[i]) > 8 || Math.abs(A.daten[i+1] - Bd.daten[i+1]) > 8
            || Math.abs(A.daten[i+2] - Bd.daten[i+2]) > 8) {
          ges++; if (y < S6) oben++; if (y >= H - S6) unten++;
        }
      }
    }
    zeilen.push(`  ${sel.padEnd(20)} ${String(da.b).padStart(4)}×${String(da.h).padStart(3)} @${da.x},${da.y}`
      + `   Huelle ${String(da.b * da.h).padStart(7)}   gedeckt ${String(ges).padStart(7)} px`
      + `   = ${(100 * oben / (W * S6)).toFixed(1).padStart(5)} % des obersten 1/6`
      + `   ${(100 * unten / (W * S6)).toFixed(1).padStart(5)} % des untersten 1/6`
      + `   ${(100 * ges / (W * H)).toFixed(2).padStart(5)} % der Flaeche`);
    await s.evaluate(() => document.querySelectorAll('[data-einzeln]')
      .forEach(el => { el.style.visibility = ''; el.removeAttribute('data-einzeln'); }));
    await s.waitForTimeout(180);
  }
  await s.close();
}
await b.close();
const txt = zeilen.join('\n') + '\n';
console.log(txt);
writeFileSync(`${ZIEL}/${NAME}-einzeln.txt`, txt);
