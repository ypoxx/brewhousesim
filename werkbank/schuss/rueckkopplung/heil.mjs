/* HEIL-PROBE — laedt alle vier Epochen am eingefrorenen Stand (Hafen 8900),
   liest BRAUHAUS.lage.length, Konsolenfehler, und die Kopfzeile im Anfangsbild.
   Eigenes Geraet des blinden Kritikers. Nichts wird geklickt. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = 8900, SAAT = 1350;
const browser = await chromium.launch();
const out = [];
for (const ep of [1,2,3,4]) {
  const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
  const fehler = [];
  seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0,300)));
  seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0,300)); });
  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(1200);
  const d = await seite.evaluate(() => {
    const B = window.BRAUHAUS;
    const k = document.querySelector('.deckung');
    return {
      lage: B.lage.length, lageTexte: B.lage.slice(0,5),
      zeit: B.welt.zeit, kasse: B.welt.haus.kasse,
      epocheName: (B.welt.epoche && (B.welt.epoche.name || B.welt.epoche.jahr)) || null,
      kopf: k ? k.textContent : null,
      kopfDeckung: k ? k.getAttribute('data-deckung') : null,
      nz: B.welt.naechsterZug,
      dataDeckungAlle: [...document.querySelectorAll('[data-deckung]')].map(e => ({
        klasse: e.className, wert: e.getAttribute('data-deckung'),
        text: (e.textContent||'').trim().replace(/\s+/g,' ').slice(0,80) })),
      zugZahl: document.querySelectorAll('[data-zug]').length
    };
  });
  out.push({ ep, fehler, ...d });
  await seite.close();
}
console.log(JSON.stringify(out, null, 1));
await browser.close();
