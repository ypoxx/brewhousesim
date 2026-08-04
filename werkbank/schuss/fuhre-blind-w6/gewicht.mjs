/* BLINDER KRITIKER · DIE FUHRE · Welle 6 — DAS GEWICHTSVETO (8 MB).
   Was ein einziger Aufruf laedt, aufgeschluesselt nach Stueck. Fuer die
   Frage, ob DIE FUHRE am Veto beteiligt ist.
     HAFEN=8900 node gewicht.mjs <ziel.json>  */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const HAFEN = process.env.HAFEN || '8900';
const ZIEL = process.argv[2] || 'gewicht.json';
const browser = await chromium.launch();
const alles = { epochen: {} };
for (const e of [1, 2, 3, 4]) {
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const seite = await ctx.newPage();
  const anf = [];
  seite.on('response', async (r) => {
    let n = 0;
    try { n = (await r.body()).length; } catch (x) { n = 0; }
    anf.push({ url: r.url().replace(`http://127.0.0.1:${HAFEN}`, ''), n, typ: r.request().resourceType() });
  });
  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(2000);
  const summe = anf.reduce((a, x) => a + x.n, 0);
  const je = {};
  anf.forEach(x => {
    let s = 'skelett/uebrig';
    const m = x.url.match(/\/(bild|ton|stuecke|stil)\/([a-z]+)/);
    if (m) s = m[2];
    if (/\/(bild)\//.test(x.url) && !m) s = 'bild';
    je[s] = (je[s] || 0) + x.n;
  });
  alles.epochen[e] = { anfragen: anf.length, summe, je,
    groesste: anf.slice().sort((a, b) => b.n - a.n).slice(0, 8) };
  console.log(`E${e}: ${anf.length} Anfragen, ${(summe / 1048576).toFixed(2)} MB`);
  Object.entries(je).sort((a, b) => b[1] - a[1]).forEach(([k, v]) =>
    console.log(`     ${k}: ${(v / 1048576).toFixed(3)} MB`));
  await ctx.close();
}
fs.writeFileSync(ZIEL, JSON.stringify(alles, null, 1));
await browser.close();
