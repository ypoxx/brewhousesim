/* BELEG — die Kopfzeile im Anfangsbild jeder Epoche, als Bild und als Zahl.
   node schirmbild.mjs <verzeichnis>
   Nichts wird geklickt: was hier zu sehen ist, sieht auch der Spieler in der
   ersten Sekunde. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ORT = process.argv[2] || '/home/user/brewhousesim/werkbank/schuss/rueckkopplung';
const HAFEN = 8900, SAAT = 1350;
const browser = await chromium.launch();
const zeilen = [];
for (const ep of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(1200);
  const d = await seite.evaluate(() => {
    const k = document.querySelector('.deckung');
    if (!k) return { da: false };
    const r = k.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const t = document.elementFromPoint(cx, cy);
    return { da: true, text: k.textContent, wert: k.getAttribute('data-deckung'),
             frei: !!(t && (t === k || k.contains(t))),
             kasten: { x: Math.round(r.left), y: Math.round(r.top),
                       b: Math.round(r.width), h: Math.round(r.height) },
             zweite: (() => { const g = document.querySelector('.gg-kennzahl');
               return g ? { text: g.textContent, wert: g.getAttribute('data-umkaempft') } : null; })() };
  });
  zeilen.push({ ep, ...d });
  await seite.screenshot({ path: `${ORT}/kopfzeile-e${ep}.png`,
    clip: { x: 1100, y: 830, width: 800, height: 140 } });
  await seite.close();
}
fs.writeFileSync(`${ORT}/kopfzeile.json`, JSON.stringify(zeilen, null, 1));
console.log(JSON.stringify(zeilen, null, 1));
await browser.close();
