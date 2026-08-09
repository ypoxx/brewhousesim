// Zusatzpruefung: wie oft wird 'fuhre:sprung' in der Hauptstrategie ueberhaupt
// ANGEBOTEN (nicht geklickt)? Gleiche Strategie wie spielhand.mjs, nur ohne
// Klickprotokoll-Overhead, dafuer mit einer Zeile je Woche zu 'fuhre:sprung'.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const epoche = process.argv[2] || '1';
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
await seite.goto(`http://127.0.0.1:8933/spiel/?epoche=${epoche}&saat=1350&neu=1`, { waitUntil: 'networkidle', timeout: 60000 });
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
  return seite.evaluate(() => { const w = BRAUHAUS.welt; return { jahr: w.zeit.jahr, woche: w.zeit.woche, ende: !!w.zeit.ende, kasse: w.haus.kasse }; });
}
let z0 = await zuege();
if (z0.some(z => z.zug === 'kern:anfangen')) { await echterKlick('kern:anfangen'); await seite.waitForTimeout(150); }

let sprungAngeboten = 0;
for (let w = 1; w <= 100; w++) {
  const vorZustand = await weltZustand();
  if (vorZustand.ende) break;
  const vorZuege = await zuege();
  const sprung = vorZuege.find(z => z.zug === 'fuhre:sprung');
  if (sprung && sprung.offen) sprungAngeboten++;

  async function greifbar(zug) {
    const e = vorZuege.find(zz => zz.zug === zug);
    if (!e || !e.offen) return false;
    if (e.preis !== null && e.preis !== undefined) {
      const p = parseFloat(e.preis);
      if (!isNaN(p) && p < 0 && (-p) > vorZustand.kasse) return false;
    }
    return true;
  }
  async function klick(zug) { if (await greifbar(zug)) { const r = await echterKlick(zug); await seite.waitForTimeout(50); return r.ok; } return false; }

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
  const planZuege = vorZuege.filter(zz => zz.zug && zz.zug.indexOf('fuhre:plan:') === 0 && zz.offen);
  let planGeklickt = false;
  if (planZuege.length) planGeklickt = await klick(planZuege[0].zug);
  if (!planGeklickt) { await echterKlick('weiter'); await seite.waitForTimeout(70); }
}
console.log('Epoche', epoche, '— fuhre:sprung angeboten in', sprungAngeboten, 'von 100 Wochen (nie geklickt).');
await browser.close();
