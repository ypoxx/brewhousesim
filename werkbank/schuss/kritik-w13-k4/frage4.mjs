// Frage 4, zweiter (richtiger) Anlauf: dieselbe Spielweise wie die
// Hauptmessung (sud anzapfen, Wochenkarte der FUHRE, Gegenzug) — die beruehrt
// nie einen 'stadt:reiter:*'-Knopf. Diesmal bis 1355/1356 gespielt und bei
// jeder Aenderung von 'fuhre:uebergabe-auf' ein Schuss.

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const zielVerzeichnis = 'werkbank/schuss/kritik-w13-k4/frage4';
fs.mkdirSync(zielVerzeichnis, { recursive: true });

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const seitenfehler = [];
seite.on('pageerror', (e) => seitenfehler.push('pageerror: ' + String(e)));

await seite.goto('http://127.0.0.1:8933/spiel/?epoche=1&saat=1350&neu=1', { waitUntil: 'networkidle', timeout: 60000 });
await seite.waitForTimeout(700);

async function echterKlick(zug) {
  const handle = await seite.$(`[data-zug="${zug}"]`);
  if (!handle) return { ok: false, grund: 'nicht-im-dom' };
  const box = await handle.boundingBox();
  if (!box || box.width <= 0 || box.height <= 0) return { ok: false, grund: 'keine-flaeche' };
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  const treffer = await seite.evaluate(([x, y, zug]) => {
    const el = document.elementFromPoint(x, y);
    const ziel = el ? el.closest('[data-zug]') : null;
    return !!ziel && ziel.getAttribute('data-zug') === zug;
  }, [x, y, zug]);
  if (!treffer) return { ok: false, grund: 'nicht-unter-zeiger' };
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

let letzterUebergabeZustand = undefined;
const wechsel = [];
let w = 0;
const MAX = 220;

while (w < MAX) {
  w++;
  const vorZustand = await weltZustand();
  if (vorZustand.ende) break;
  if (vorZustand.jahr >= 1357) break;
  const vorZuege = await zuege();

  const uebergabeKnopf = vorZuege.find(z => z.zug === 'fuhre:uebergabe-auf');
  const marker = uebergabeKnopf ? (uebergabeKnopf.text + '|' + uebergabeKnopf.offen) : null;
  if (marker !== letzterUebergabeZustand) {
    wechsel.push({ w, jahr: vorZustand.jahr, woche: vorZustand.woche, uebergabeKnopf: uebergabeKnopf || null });
    letzterUebergabeZustand = marker;
    await seite.screenshot({ path: `${zielVerzeichnis}/wechsel-w${String(w).padStart(3, '0')}.png` });
  }

  // -- dieselbe Strategie wie die Hauptmessung, aber ohne Protokoll-Overhead
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
    && zz.zug.indexOf('gegner:oeffnen:') !== 0 && zz.zug !== 'gegner:blatt'
    && zz.zug.indexOf('gegner:zeige:') !== 0 && zz.zug.indexOf('gegner:beschwerde-bild') !== 0);
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
  if (planZuege.length) {
    const klassen = await seite.evaluate((liste) => {
      const out = {};
      liste.forEach(z => { const el = document.querySelector('[data-zug="' + z + '"]'); out[z] = el ? el.className : ''; });
      return out;
    }, planZuege.map(p => p.zug));
    const empfohlen = planZuege.find(p => (klassen[p.zug] || '').indexOf('fu-rat') !== -1);
    planGeklickt = await klick((empfohlen || planZuege[0]).zug);
  }
  if (!planGeklickt) {
    await echterKlick('weiter');
    await seite.waitForTimeout(80);
  }
}

const endZustand = await weltZustand();
await seite.screenshot({ path: `${zielVerzeichnis}/ende.png` });
fs.writeFileSync(`${zielVerzeichnis}/protokoll.json`, JSON.stringify({ wechsel, endZustand, wochenGespielt: w, seitenfehler }, null, 1));
console.log('fertig. wochen=', w, 'endZustand=', JSON.stringify(endZustand));
console.log('Uebergabe-Wechsel:', JSON.stringify(wechsel, null, 1));
await browser.close();
