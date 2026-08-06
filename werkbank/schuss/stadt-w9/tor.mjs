/* SCHNELLPROBE — alle vier Epochen laden, `BRAUHAUS.lage` lesen, die Zahlen
 * der Werkbank ablesen. Das ist die Runde, die vor JEDER Fertigmeldung
 * laufen muss (spiel/LIESMICH.md) — und dazu, was Welle 9 selbst pruefen
 * muss: liegt die BAUHOF-Lade zu, schneidet die Werkbank keinen Blattkopf
 * an, und deckt sie keinen fremden Zug zu?
 *
 *   HAFEN=8899 node werkbank/schuss/stadt-w9/tor.mjs [breite] [hoehe]
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = process.env.HAFEN || '8899';
const BR = +(process.argv[2] || 2752), HO = +(process.argv[3] || 1536);
const b = await chromium.launch();
let schlecht = 0;
for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: BR, height: HO }, deviceScaleFactor: 1 });
  const fehler = [];
  s.on('pageerror', (x) => fehler.push('pageerror: ' + String(x).slice(0, 200)));
  s.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1500);
  const d = await s.evaluate(() => {
    const B = window.BRAUHAUS;
    const kr = (q) => { const el = document.querySelector(q); if (!el) return null;
      const r = el.getBoundingClientRect();
      return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; };
    return {
      lage: B.lage.slice(0, 3), lagen: B.lage.length,
      bauhof: B.stadt.rahmen.bauhof ? B.stadt.rahmen.bauhof() : '(alt)',
      verdeckt: B.stadt.rahmen.verdeckt(),
      schneidet: B.stadt.rahmen.schneidet ? B.stadt.rahmen.schneidet() : [],
      werkbank: kr('.stadt-werkbank'), zeile: kr('.stadt-reiterzeile'),
      reiter: [...document.querySelectorAll('.knopf.stadt-reiter')].map((k) => ({
        w: (k.querySelector('.wort') || {}).textContent,
        z: (k.querySelector('.zahl') || {}).textContent,
        kw: /…$/.test((k.querySelector('.wort') || {}).textContent || ''),
        kz: /…$/.test((k.querySelector('.zahl') || {}).textContent || '')
      })),
      bauzuege: [...document.querySelectorAll('[data-zug^="stadt:bau:"]')].length,
      zuege: [...document.querySelectorAll('[data-zug]')].length,
      nenner: (B.welt.naechsterZug || {}).was + ' ' + (B.welt.naechsterZug || {}).preis
    };
  });
  const kw = d.reiter.filter((r) => r.kw).length, kz = d.reiter.filter((r) => r.kz).length;
  const ok = !fehler.length && !d.lagen && !d.verdeckt.length && !d.schneidet.length && !kw && !kz;
  if (!ok) schlecht++;
  console.log(`E${e} ${ok ? 'OK ' : 'XX '} lage=${d.lagen} fehler=${fehler.length}`
    + ` · Lade ${d.bauhof} · Werkbank ${d.werkbank} Zeile ${d.zeile}`
    + ` · ${d.reiter.length} Reiter, gekuerzt ${kw}/${kz}`
    + ` · verdeckt ${d.verdeckt.length} · schneidet ${d.schneidet.length}`
    + ` · stadt:bau ${d.bauzuege} · Zuege ${d.zuege} · Nenner ${d.nenner}`);
  if (fehler.length) fehler.slice(0, 3).forEach((f) => console.log('     ! ' + f));
  if (d.lagen) console.log('     ! lage: ' + JSON.stringify(d.lage));
  if (d.verdeckt.length) console.log('     ! verdeckt: ' + JSON.stringify(d.verdeckt).slice(0, 300));
  if (d.schneidet.length) console.log('     ! schneidet: ' + JSON.stringify(d.schneidet).slice(0, 300));
  if (process.env.LAUT) d.reiter.forEach((r) => console.log(`      "${r.w}" / "${r.z}"`));
  await s.close();
}
await b.close();
console.log(schlecht ? `${schlecht} Epochen mit Befund` : 'alle vier Epochen sauber');
