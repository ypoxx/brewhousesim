/* OBERGRENZE — der Hof mit ALLEN Aufbauten, ohne eine Woche zu spielen.
     HAFEN=8906 node werkbank/schuss/bild-w8/obergrenze.mjs <epoche>

   Warum zusaetzlich zur gespielten Partie: ?bau=alle zeigt, was das Bild
   ueberhaupt je werden kann. Verliert schon dieses Bild gegen das Zielblatt,
   liegt es am Gezeichneten. Gewinnt es, waehrend die gespielte Partie
   verliert, liegt es am Tempo — zwei ganz verschiedene Auflagen.

   Auch hier je zwei Aufnahmen: mit und ohne die oberen vier Ebenen.         */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
const HAFEN = process.env.HAFEN || '8906';
const EP = process.argv[2] || '1';
const AUS = 'werkbank/schuss/bild-w8/bilder';
mkdirSync(AUS, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 2752, height: 1536 }, deviceScaleFactor: 1 });
const fehler = [];
p.on('pageerror', e => fehler.push('pageerror: ' + e));
p.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
await p.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EP}&saat=1350&bau=alle`,
             { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(2200);
const nackt = (an) => p.evaluate((an) => {
  ['marken', 'hand', 'kopf', 'blatt'].forEach(n => {
    const w = document.querySelector('#ebene-' + n); if (w) w.style.visibility = an ? 'hidden' : '';
  });
}, an);
await p.screenshot({ path: `${AUS}/e${EP}-20-baualle.png` });
await nackt(true); await p.waitForTimeout(300);
await p.screenshot({ path: `${AUS}/e${EP}-21-baualle-nackt.png` });
const n = await p.evaluate(() => document.querySelector('#ebene-bau')?.children.length || 0);
console.log(`EPOCHE ${EP} bau=alle · Stuecke in ebene-bau: ${n}`);
console.log(fehler.length ? 'FEHLER: ' + fehler.slice(0, 5).join(' | ') : 'keine Fehler auf der Seite');
await b.close();
