// DAS GEWICHT — eigener Weg, nicht der der Aufsicht und nicht der des Baus.
//
// Gezaehlt werden die ANTWORTEN, die der Browser selbst empfaengt (Playwrights
// 'response'-Ereignis), mit der Laenge des Koerpers auf der Leitung. Kein
// Resource-Timing, keine Angabe der Seite ueber sich selbst.
//
// Zweistufig, weil das Spiel nachlaedt:
//   (a) bis 'load'
//   (b) 'load' + 6 s Ruhe   — was ohne einen Klick noch hereinkommt
//   (c) nach dem ersten Wochenklick + 3 s — was der erste Zug kostet
//
//   node werkbank/schuss/stadt-blind-w7/gewicht.mjs <ziel.json>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const ziel = process.argv[2] || 'werkbank/schuss/stadt-blind-w7/gewicht.json';
const HAFEN = process.env.HAFEN || '8903';
const browser = await chromium.launch();
const alles = {};

for (const ep of [1, 2, 3, 4]) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1 });
  const s = await ctx.newPage();
  const treffer = [];
  s.on('response', async (r) => {
    let n = 0;
    try { n = (await r.body()).length; } catch { n = 0; }
    treffer.push({ url: r.url().replace(`http://127.0.0.1:${HAFEN}`, ''), n, t: Date.now(), st: r.status() });
  });
  const t0 = Date.now();
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'load', timeout: 60000 });
  const tLoad = Date.now();
  await s.waitForTimeout(6000);
  const tRuhe = Date.now();
  try { await s.click('[data-zug="weiter"]', { timeout: 5000 }); } catch { /* egal */ }
  await s.waitForTimeout(3000);

  const summe = (bis) => treffer.filter((x) => x.t <= bis).reduce((a, b) => a + b.n, 0);
  const zahl = (bis) => treffer.filter((x) => x.t <= bis).length;
  const nachTyp = {};
  for (const x of treffer) {
    const e = (x.url.split('?')[0].match(/\.([a-z0-9]+)$/i) || [0, 'html'])[1].toLowerCase();
    nachTyp[e] = nachTyp[e] || { n: 0, byte: 0 };
    nachTyp[e].n++; nachTyp[e].byte += x.n;
  }
  alles['e' + ep] = {
    bis_load: { byte: summe(tLoad), anfragen: zahl(tLoad), mb: +(summe(tLoad) / 1048576).toFixed(3) },
    bis_ruhe: { byte: summe(tRuhe), anfragen: zahl(tRuhe), mb: +(summe(tRuhe) / 1048576).toFixed(3) },
    nach_klick: { byte: summe(Date.now()), anfragen: treffer.length, mb: +(summe(Date.now()) / 1048576).toFixed(3) },
    nach_typ: nachTyp,
    schwerste: treffer.slice().sort((a, b) => b.n - a.n).slice(0, 8).map((x) => [x.url, x.n]),
    fehlstatus: treffer.filter((x) => x.st >= 400).map((x) => [x.url, x.st]),
    ms_bis_load: tLoad - t0,
  };
  console.log(`e${ep}  bis load ${alles['e' + ep].bis_load.mb} MB / ${alles['e' + ep].bis_load.anfragen} Anfr.` +
    `  | +6s Ruhe ${alles['e' + ep].bis_ruhe.mb} MB / ${alles['e' + ep].bis_ruhe.anfragen}` +
    `  | nach 1. Klick ${alles['e' + ep].nach_klick.mb} MB / ${alles['e' + ep].nach_klick.anfragen}`);
  await ctx.close();
}
fs.writeFileSync(ziel, JSON.stringify(alles, null, 1));
await browser.close();
