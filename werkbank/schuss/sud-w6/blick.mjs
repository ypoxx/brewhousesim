/* BLICK — reine Aufnahme: lade eine Epoche, schlag DEN SUD auf, warte bis der
   Takt der STADT einmal durch ist, und schreib jeden Knopf mit Trefferprobe
   (elementFromPoint auf dem KNOPF, nicht auf dem Brett), disabled,
   data-soll-aus, data-aus-grund, data-verdeckt, data-preis, Text.
   HAFEN=8917 node blick.mjs <epoche> <ziel.json>        */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const ZIEL = process.argv[3] || `/tmp/sudw6/blick-e${ep}.json`;
const HAFEN = process.env.HAFEN || '8917';
const SAAT = process.env.SAAT || '1350';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 300)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 300)); });

await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1500);

async function aufnahme() {
  return await seite.evaluate(() => {
    const B = window.BRAUHAUS;
    const zuege = [];
    document.querySelectorAll('[data-zug]').forEach(el => {
      const r = el.getBoundingClientRect();
      const sicht = !!(r.width && r.height);
      let hit = false, t = null;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (sicht && cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
        const e2 = document.elementFromPoint(cx, cy);
        hit = !!(e2 && (e2 === el || el.contains(e2)));
        t = e2 ? (e2.tagName + '.' + String(e2.className || '').slice(0, 50)) : null;
      }
      zuege.push({
        zug: el.getAttribute('data-zug'), tag: el.tagName,
        sicht, hit, deckEl: t,
        aus: !!el.disabled, sollAus: el.getAttribute('data-soll-aus'),
        grund: el.getAttribute('data-aus-grund'), verdeckt: el.getAttribute('data-verdeckt'),
        preis: el.getAttribute('data-preis'),
        x: Math.round(cx), y: Math.round(cy), w: Math.round(r.width), h: Math.round(r.height),
        text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 100)
      });
    });
    let z = null;
    try { z = JSON.parse(JSON.stringify(B.sud.zustand())); } catch (e) { z = 'unlesbar: ' + e; }
    let daten = null;
    try {
      daten = (window.SUD_DATEN.achsen || []).map(a => ({
        schluessel: a.schluessel, name: a.name, frage: a.frage,
        epochen: a.epochen || null,
        optionen: (a.optionen || []).map(o => ({ k: o.k, name: o.name, preis: o.preis || 0,
          fest: !!o.fest, einmal: !!o.einmal, hoechst: o.hoechst, siegel: o.siegel || null }))
      }));
    } catch (e) { daten = 'unlesbar: ' + e; }
    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, epoche: B.welt.zeit.epoche,
      kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff,
      lage: B.lage.length, lageTexte: B.lage.slice(0, 6),
      zuege, zustand: z, daten
    };
  });
}

const reiter = async () => seite.evaluate(() =>
  [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e => ({
    zug: e.getAttribute('data-zug'), text: (e.innerText || '').trim().slice(0, 30) })));

const r = await reiter();
const sudReiter = r.find(x => /sud/i.test(x.zug));
if (sudReiter) {
  const l = await seite.evaluate((z) => {
    const el = document.querySelector(`[data-zug="${z}"]`); const b = el.getBoundingClientRect();
    return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
  }, sudReiter.zug);
  await seite.mouse.click(l.x, l.y);
  await seite.waitForTimeout(1500);
}
const n = await aufnahme();

fs.mkdirSync(ZIEL.replace(/\/[^/]*$/, ''), { recursive: true });
fs.writeFileSync(ZIEL, JSON.stringify({ epoche: ep, hafen: HAFEN, fehler, reiter: r, sudReiter, n }, null, 1));
const sz = n.zuege.filter(z => /^sud:/.test(z.zug));
console.log(`E${ep} jahr=${n.jahr} lage=${n.lage} fehler=${fehler.length} sud-zuege=${sz.length}`);
for (const z of sz) console.log(`  ${z.zug.padEnd(28)} aus=${z.aus?1:0} soll=${z.sollAus} grund=${z.grund} verd=${z.verdeckt} hit=${z.hit?1:0} preis=${z.preis} | ${z.text}`);
await browser.close();
