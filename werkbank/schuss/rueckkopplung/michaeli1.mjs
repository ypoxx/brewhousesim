/* BELEG zu Spalte (a) — der erste Michaelitag jeder Epoche, ohne dass etwas
   gekauft wird: wie viele Entscheidungen mit Preisschild liegen NEBENEINANDER,
   erreichbar und aktiv? Gezaehlt wird zweimal: alles, was am Schirm steht, und
   die Michaelitafel, sobald sie aufgeschlagen ist.
   node michaeli1.mjs <ausgabe.json> */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ZIEL = process.argv[2] || '/home/user/brewhousesim/werkbank/schuss/rueckkopplung/michaeli1.json';
const HAFEN = 8900, SAAT = 1350;
const browser = await chromium.launch();
const raus = [];

const zaehle = (seite) => seite.evaluate(() => {
  const l = [];
  document.querySelectorAll('[data-zug][data-preis]').forEach(el => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let hit = false;
    if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
      const t = document.elementFromPoint(cx, cy);
      hit = !!(t && (t === el || el.contains(t)));
    }
    l.push({ zug: el.getAttribute('data-zug'), preis: +el.getAttribute('data-preis'),
             aus: !!el.disabled, hit });
  });
  return { kasse: BRAUHAUS.welt.haus.kasse, alle: l };
});

for (const ep of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(1100);
  const vorher = await zaehle(seite);
  // Michaelitafel aufschlagen — nur aufschlagen, nichts nehmen.
  const griff = await seite.evaluate(() => {
    const el = document.querySelector('[data-zug="preis:tafel"]');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  if (griff) { await seite.mouse.click(griff.x, griff.y); await seite.waitForTimeout(700); }
  const nachher = await zaehle(seite);
  const f = (s) => ({
    kasse: s.kasse,
    aktivErreichbar: s.alle.filter(z => !z.aus && z.hit).length,
    aktiv: s.alle.filter(z => !z.aus).length,
    gesamt: s.alle.length,
    angeboteAktiv: s.alle.filter(z => /^preis:nimm:/.test(z.zug) && !z.aus).map(z => [z.zug, z.preis]),
    angeboteGesamt: s.alle.filter(z => /^preis:nimm:/.test(z.zug)).length,
    festAktiv: s.alle.filter(z => /^preis:festlege:/.test(z.zug) && !z.aus).map(z => [z.zug, z.preis]),
    festGesamt: s.alle.filter(z => /^preis:festlege:/.test(z.zug)).length
  });
  raus.push({ ep, vorTafel: f(vorher), mitTafel: f(nachher) });
  await seite.close();
}
fs.writeFileSync(ZIEL, JSON.stringify(raus, null, 1));
raus.forEach(r => console.log(`E${r.ep}  Kasse ${r.vorTafel.kasse}  |  ohne Tafel: `
  + `${r.vorTafel.aktivErreichbar} aktiv+erreichbar von ${r.vorTafel.gesamt}  |  mit Tafel: `
  + `${r.mitTafel.aktivErreichbar} aktiv+erreichbar; Angebote ${r.mitTafel.angeboteAktiv.length}/`
  + `${r.mitTafel.angeboteGesamt}, Festlegungen ${r.mitTafel.festAktiv.length}/${r.mitTafel.festGesamt}`));
console.log(JSON.stringify(raus.map(r => ({ ep: r.ep, angebote: r.mitTafel.angeboteAktiv,
  fest: r.mitTafel.festAktiv })), null, 1));
await browser.close();
