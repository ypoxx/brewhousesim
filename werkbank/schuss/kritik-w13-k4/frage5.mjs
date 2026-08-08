// Frage 5: begleitende Beobachtung. Spielt dieselbe Strategie wie die
// Hauptmessung 50 Wochen weit (Epoche 1) und liest danach die Chronik sowie
// den 'stadt:reiter:gegner-amort-gg-band'-Text JEDE Woche mit, um zu pruefen,
// ob "neuer Text auf der Karte" wirklich neu ist, nicht nur ein Zaehler.

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
await seite.goto('http://127.0.0.1:8933/spiel/?epoche=1&saat=1350&neu=1', { waitUntil: 'networkidle', timeout: 60000 });
await seite.waitForTimeout(700);

async function echterKlick(zug) {
  const handle = await seite.$(`[data-zug="${zug}"]`);
  if (!handle) return { ok: false };
  const box = await handle.boundingBox();
  if (!box || box.width <= 0 || box.height <= 0) return { ok: false };
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  const treffer = await seite.evaluate(([x, y, zug]) => {
    const el = document.elementFromPoint(x, y);
    const ziel = el ? el.closest('[data-zug]') : null;
    return !!ziel && ziel.getAttribute('data-zug') === zug;
  }, [x, y, zug]);
  if (!treffer) return { ok: false };
  await seite.mouse.click(x, y);
  return { ok: true };
}
async function zuege() { return seite.evaluate(() => BRAUHAUS.zuege()); }
async function weltZustand() {
  return seite.evaluate(() => {
    const w = BRAUHAUS.welt;
    return { jahr: w.zeit.jahr, woche: w.zeit.woche, ende: !!w.zeit.ende, kasse: w.haus.kasse };
  });
}

let z0 = await zuege();
if (z0.some(z => z.zug === 'kern:anfangen')) { await echterKlick('kern:anfangen'); await seite.waitForTimeout(150); }

const reiterVerlauf = [];
const markenVerlauf = [];

for (let w = 1; w <= 50; w++) {
  const vorZustand = await weltZustand();
  if (vorZustand.ende) break;
  const vorZuege = await zuege();

  const r = vorZuege.find(z => z.zug === 'stadt:reiter:gegner-amort-gg-band');
  reiterVerlauf.push({ w, text: r ? r.text : null });
  const marken = vorZuege.filter(z => z.zug && z.zug.indexOf('stadt:marke:gegner-') === 0).map(z => z.text);
  markenVerlauf.push({ w, marken });

  async function greifbar(zug) {
    const e = vorZuege.find(zz => zz.zug === zug);
    if (!e || !e.offen) return false;
    if (e.preis !== null && e.preis !== undefined) {
      const p = parseFloat(e.preis);
      const kasse = (await weltZustand()).kasse;
      if (!isNaN(p) && p < 0 && (-p) > kasse) return false;
    }
    return true;
  }
  async function klick(zug) { if (await greifbar(zug)) { await echterKlick(zug); await seite.waitForTimeout(60); return true; } return false; }

  if (!(await klick('sud:zettel-anstich'))) await klick('sud:zettel-hefe-fass');
  const gegnerKandidaten = vorZuege.filter(zz => zz.zug && zz.zug.indexOf('gegner:') === 0 && zz.offen
    && zz.zug.indexOf('gegner:oeffnen:') !== 0 && zz.zug !== 'gegner:blatt' && zz.zug.indexOf('gegner:zeige:') !== 0
    && zz.zug.indexOf('gegner:beschwerde-bild') !== 0);
  let bester = null, besteFrist = Infinity;
  for (const g of gegnerKandidaten) {
    const m = /noch (\d+) Wo/.exec(g.text || '');
    if (!m) continue;
    const frist = parseInt(m[1], 10);
    if (frist < besteFrist) { besteFrist = frist; bester = g; }
  }
  if (bester) await klick(bester.zug);

  // Woche abschliessen: ENTWEDER ein Fuhrplan-Chip (ruft naechsteWoche()
  // selbst auf) ODER 'weiter' — niemals beides (stuecke/fuhre.js:1892).
  const planZuege = vorZuege.filter(zz => zz.zug && zz.zug.indexOf('fuhre:plan:') === 0 && zz.offen);
  let planGeklickt = false;
  if (planZuege.length) planGeklickt = await klick(planZuege[0].zug);
  if (!planGeklickt) {
    await echterKlick('weiter');
    await seite.waitForTimeout(80);
  }
}

const chronik = await seite.evaluate(() => BRAUHAUS.welt.chronik.map(c => (typeof c === 'string') ? c : JSON.stringify(c)));
fs.writeFileSync('werkbank/schuss/kritik-w13-k4/frage5-daten.json', JSON.stringify({ reiterVerlauf, markenVerlauf, chronik }, null, 1));
console.log('reiterVerlauf:');
reiterVerlauf.forEach(r => console.log(r.w, r.text));
console.log('Chronik-Eintraege:', chronik.length);
chronik.slice(0, 40).forEach(c => console.log(' -', c));
await browser.close();
