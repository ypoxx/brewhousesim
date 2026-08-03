/* Jede Probe, die der Katalog in irgendeiner Epoche ruft, gegen das
   Verzeichnis gehalten — in beide Richtungen:
     FEHLT   der Katalog ruft eine Datei, die es nicht gibt (404 im Lauf)
     TOT     eine Datei, die kein Eintrag je ruft
   Gelesen wird im laufenden Spiel, nicht im Quelltext. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const HAFEN = process.env.HAFEN || 'http://127.0.0.1:8931';
const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required','--no-sandbox'] });
const p = await (await b.newContext()).newPage();
const fehlt = new Set();
p.on('response', r => { if (r.status() === 404) fehlt.add(r.url().split('/').pop()); });
const gerufen = new Set();
for (const e of [1,2,3,4]) {
  await p.goto(`${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  const l = await p.evaluate(async (e) => {
    const B = window.BRAUHAUS;
    B.ton.wecke();
    const namen = B.ton.katalog();
    // jeden Namen einmal rufen, damit ladeStill() die Datei wirklich holt
    for (const n of namen) B.ton.spiele(n);
    await new Promise(r => setTimeout(r, 1500));
    return namen;
  }, e);
  await p.waitForTimeout(2500);
  const geladen = await p.evaluate(() => performance.getEntriesByType('resource')
      .map(r => r.name).filter(n => /\/ton\/klang\/.*\.mp3$/.test(n))
      .map(n => n.split('/').pop()));
  geladen.forEach(g => gerufen.add(g));
}
const da = fs.readdirSync('spiel/ton/klang').filter(n => n.endsWith('.mp3'));
console.log(JSON.stringify({
  fehlt: [...fehlt],
  tot: da.filter(d => !gerufen.has(d)),
  gerufen: gerufen.size, vorhanden: da.length
}, null, 1));
await b.close();
