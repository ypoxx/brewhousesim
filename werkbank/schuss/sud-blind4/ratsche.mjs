// ratsche.mjs — DIE RATSCHE bei voller Kasse.
// Am Brett steht "Zurueck geht es nicht — nur noch weiter hinauf". Diese
// Messung kauft die billigere Festlegung, prueft dass die teurere OFFEN
// bleibt und die Vorgabe ZU ist, kauft dann die teurere und prueft, dass
// jetzt beides darunter zu ist. Geld ist reichlich da, damit kein Preis die
// Antwort faelscht.
//
//   node ratsche.mjs <epoche> <hafen> <ausgabe.json>

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const EPOCHE = +(process.argv[2] || 4);
const HAFEN = +(process.argv[3] || 8911);
const AUS = process.argv[4] || '/tmp/ratsche.json';

const browser = await chromium.launch();
const bericht = { epoche: EPOCHE, schritte: [], fehler: [] };
const seite = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
seite.on('pageerror', (e) => bericht.fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', (m) => { if (m.type() === 'error') bericht.fehler.push('console: ' + m.text().slice(0, 200)); });
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EPOCHE}&saat=1350`,
  { waitUntil: 'networkidle', timeout: 60000 });
await seite.waitForTimeout(900);

const geld = () => seite.evaluate(() => { window.BRAUHAUS.welt.haus.kasse = 5000000;
  window.BRAUHAUS.sende('zeichne', { grund: 'pruef' }); });
const lage = (z) => seite.evaluate((zz) => {
  const k = document.querySelector(`button[data-zug="${zz}"]`);
  if (!k) return null;
  const r = k.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const drin = r.width >= 3 && r.height >= 3 && x >= 0 && y >= 0 && x <= innerWidth && y <= innerHeight;
  const t = drin ? document.elementFromPoint(x, y) : null;
  const ka = k.closest('.sud-karte');
  return { x, y, aus: !!k.disabled, sollAus: k.getAttribute('data-soll-aus') === '1',
    trifft: !!(t && (t === k || k.contains(t))),
    karte: ka ? ka.className : null,
    marke: ka && ka.querySelector('.sud-marke') ? ka.querySelector('.sud-marke').textContent.trim() : null,
    text: (k.innerText || '').replace(/\s+/g, ' ').slice(0, 60) };
}, z);
const verf = () => seite.evaluate(() => JSON.parse(JSON.stringify(window.BRAUHAUS.SUD_ZUSTAND.verfahren)));
async function auf() {
  for (let i = 0; i < 5; i++) {
    if (!(await seite.evaluate(() => !!window.BRAUHAUS.SUD_ZUSTAND.brettZu))) return true;
    const r = await lage('stadt:reiter:sud-sud-brett');
    if (r && !r.aus && r.trifft) { await seite.mouse.click(r.x, r.y); await seite.waitForTimeout(250); }
    else await seite.waitForTimeout(250);
  }
  return false;
}
async function klick(z, zwing) {
  if (zwing) await seite.evaluate((zz) => { const k = document.querySelector(`button[data-zug="${zz}"]`);
    if (k) { k.disabled = false; k.removeAttribute('aria-disabled'); } }, z);
  const p = await lage(z);
  if (!p) return { weg: 'kein Knopf' };
  if (p.aus && !zwing) return { weg: 'abgeschaltet', sollAus: p.sollAus, marke: p.marke };
  if (!p.trifft) return { weg: 'verdeckt', aus: p.aus };
  await seite.mouse.click(p.x, p.y); await seite.waitForTimeout(200);
  return { geklickt: true };
}

await geld();
await auf();
const opts = await seite.evaluate(() => [...document.querySelectorAll('button[data-zug^="sud:"]')]
  .map((k) => k.getAttribute('data-zug'))
  .filter((z) => z.split(':').length === 3 && !/^sud:(zettel|charge|anstich|hefe-|gaerraum)/.test(z))
  .map((z) => { const k = document.querySelector(`button[data-zug="${z}"]`);
    const t = (k.innerText || '').replace(/\s+/g, ' '); const m = t.match(/−([\d.,]+)/);
    const ka = k.closest('.sud-karte');
    return { zug: z, achse: z.split(':')[1], k: z.split(':')[2],
      preis: m ? +m[1].replace(/\./g, '').replace(',', '.') : 0,
      marke: ka && ka.querySelector('.sud-marke') ? ka.querySelector('.sud-marke').textContent.trim() : '' }; }));
bericht.optionen = opts;

for (const achse of [...new Set(opts.map((o) => o.achse))]) {
  const d = opts.filter((o) => o.achse === achse);
  const fest = d.filter((o) => /unwiderruflich/i.test(o.marke)).sort((a, b) => a.preis - b.preis);
  if (!fest.length) { bericht.schritte.push({ achse, hinweis: 'keine unwiderrufliche Option' }); continue; }
  for (const ziel of fest) {
    await geld(); await auf();
    const vor = await verf();
    const kauf = await klick(ziel.zug);
    await seite.waitForTimeout(250);
    await geld();                       // Geld bleibt reichlich: kein Preis faelscht die Antwort
    await auf();
    const nach = await verf();
    const stand = {};
    for (const o of d) stand[o.zug] = await lage(o.zug);
    // Rueckwege
    const wege = [];
    for (const o of d) {
      if (o.zug === ziel.zug) continue;
      const hinauf = fest.some((f) => f.zug === o.zug && f.preis > ziel.preis);
      if (hinauf) continue;
      for (const [name, zwing, synth] of [['echte Maus', false, false],
                                          ['zwangsweise aktiviert', true, false],
                                          ['synthetisches click-Ereignis', false, true]]) {
        const v = await verf();
        const r = synth ? await seite.evaluate((zz) => { const k = document.querySelector(`button[data-zug="${zz}"]`);
            if (!k) return 'kein Knopf'; k.disabled = false;
            k.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); return 'abgeschickt'; }, o.zug)
          : await klick(o.zug, zwing);
        await seite.waitForTimeout(150);
        const n = await verf();
        wege.push({ ziel: o.zug, art: name, ergebnis: r, vorher: v[achse], nachher: n[achse],
                    zurueck: n[achse] !== v[achse] });
        if (n[achse] !== v[achse]) { await seite.evaluate(([a, k]) => {
          window.BRAUHAUS.SUD_ZUSTAND.verfahren[a] = k; window.BRAUHAUS.sende('zeichne', { grund: 'p' }); },
          [achse, ziel.k]); await seite.waitForTimeout(120); }
      }
    }
    bericht.schritte.push({ achse, gekauft: ziel.zug, preis: ziel.preis, kauf, vor, nach, stand, wege });
  }
}

writeFileSync(AUS, JSON.stringify(bericht, null, 1));
console.log('=== RATSCHE Epoche ' + EPOCHE + ' (Kasse jederzeit 5.000.000)');
for (const s of bericht.schritte) {
  if (s.hinweis) { console.log('  ' + s.achse + ': ' + s.hinweis); continue; }
  console.log('  gekauft ' + s.gekauft + ' (' + s.preis + ') -> verfahren.' + s.achse + ' = ' + s.nach[s.achse]);
  for (const z of Object.keys(s.stand)) {
    const l = s.stand[z];
    console.log('      ' + z.padEnd(26) + (l ? (l.aus ? 'ZU ' : 'OFFEN') + '  ' + (l.marke || '') : 'kein Knopf'));
  }
  const zur = s.wege.filter((w) => w.zurueck);
  console.log('      Rueckwege: ' + s.wege.length + ' probiert, ' + zur.length + ' fuehrten zurueck'
    + (zur.length ? ' >>> ' + zur.map((w) => w.ziel + '/' + w.art).join(', ') : ''));
}
console.log('  Fehler: ' + bericht.fehler.length);
await browser.close();
