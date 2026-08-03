// partie.mjs — eine SORGFAELTIG gespielte Partie, vierzehn Jahre, und was
// dabei ueber DEN SUD am Bildschirm steht.
//
//   node partie.mjs <epoche> <stil> <wochen> <hafen> <ausgabe.json> [saat]
//
// stil = faul       nur WEITER (und der Sommerzettel zu)
//        sorgfaeltig  Fuhre laden und abschicken, Rohstoff kaufen, Hefe
//                     fuehren — aber KEINE Festlegung kaufen. So laesst sich
//                     zaehlen, wie oft die Bierentscheidung ueberhaupt
//                     bedienbar dasteht.
//        siegel     wie sorgfaeltig, aber die teure Festlegung wird genommen,
//                   sobald die Kasse sie traegt.
//
// Gemessen wird JEDE Woche zweimal:
//   A "gereicht"  — der Stand, den der Spieler zu Wochenbeginn vorfindet
//   B "nach Hand" — nachdem er seine sonstigen Zuege getan hat
// Jeder Knopf einzeln mit elementFromPoint, nicht der Mittelpunkt des Bretts.

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const EPOCHE = +(process.argv[2] || 1);
const STIL = process.argv[3] || 'sorgfaeltig';
const WOCHEN = +(process.argv[4] || 420);
const HAFEN = +(process.argv[5] || 8911);
const AUS = process.argv[6] || '/tmp/partie.json';
const SAAT = +(process.argv[7] || 1350);

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const fehler = [];
seite.on('pageerror', (e) => fehler.push('pageerror: ' + String(e).slice(0, 240)));
seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 240)); });

await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EPOCHE}&saat=${SAAT}`,
  { waitUntil: 'networkidle', timeout: 60000 });
await seite.waitForTimeout(900);

/* --------------------------------------------------------------------------
   DIE AUFNAHME. Jeder Knopf des SUD einzeln: da? aktiv? von der Maus
   getroffen? Dazu die Lage der Welt, damit sich "was aendert sich danach"
   ueberhaupt messen laesst.
   -------------------------------------------------------------------------- */
const AUFNAHME = () => {
  const B = window.BRAUHAUS;
  const Z = B.SUD_ZUSTAND, W = B.welt;
  const knopf = (k) => {
    const r = k.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const drin = r.width >= 3 && r.height >= 3 && cx >= 0 && cy >= 0
      && cx <= innerWidth && cy <= innerHeight;
    const t = drin ? document.elementFromPoint(cx, cy) : null;
    const txt = (k.innerText || '').replace(/\s+/g, ' ').trim();
    const pm = txt.match(/−([\d.,]+)/);
    return {
      zug: k.getAttribute('data-zug'), aus: !!k.disabled,
      trifft: !!(t && (t === k || k.contains(t))),
      preis: pm ? +pm[1].replace(/\./g, '').replace(',', '.') : 0,
      text: txt.slice(0, 70)
    };
  };
  const alle = [...document.querySelectorAll('button[data-zug]')];
  const sud = alle.filter((k) => /^sud:/.test(k.getAttribute('data-zug'))).map(knopf);
  const faesser = W.vorrat.faesser;
  const sorten = {};
  faesser.forEach((f) => { const k = f.k || f.sorte || '?'; sorten[k] = (sorten[k] || 0) + 1; });
  const stufen = {};
  faesser.forEach((f) => { const s = f.stufe === undefined ? '?' : f.stufe; stufen[s] = (stufen[s] || 0) + 1; });
  const kopf = document.getElementById('ebene-kopf');
  const kt = kopf ? (kopf.innerText || '') : '';
  const dm = kt.match(/Kasse reicht ([\d.,]+)×/);
  return {
    jahr: W.zeit.jahr, woche: W.zeit.woche, ende: !!W.zeit.ende,
    kasse: Math.round(W.haus.kasse), rohstoff: Math.round(W.haus.rohstoff),
    lager: faesser.length,
    halt: faesser.length ? +(faesser.reduce((n, f) => n + (f.haltbar || 0), 0) / faesser.length).toFixed(2) : 0,
    sorten, stufen,
    bottiche: Z.bottiche.length,
    gaerfass: Z.bottiche.reduce((n, b) => n + b.fass, 0),
    plaetze: B.sud.gaerkeller ? B.sud.gaerkeller.plaetze() : null,
    guete: Math.round(Z.guete), sude: Z.gesamtSude, gesamtFass: Math.round(Z.gesamtFass),
    legte: Z.gesamtLegte, fehl: Z.jahrFehl, gestuftGesamt: Z.gestuftGesamt || 0,
    gestuft: Z.gestuft || 0,
    verfahren: JSON.parse(JSON.stringify(Z.verfahren)),
    fest: Object.keys(Z.fest),
    brettZu: !!Z.brettZu,
    deckung: dm ? +dm[1].replace(/\./g, '').replace(',', '.') : null,
    lage: B.lage.length,
    sud
  };
};

// Ein echter Mausklick auf die Mitte des Knopfes — nicht element.click().
async function maus(zug, opt = {}) {
  const p = await seite.evaluate((z) => {
    const k = document.querySelector(`button[data-zug="${z}"]`);
    if (!k || k.disabled) return null;
    const r = k.getBoundingClientRect();
    if (r.width < 3 || r.height < 3) return null;
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return null;
    const t = document.elementFromPoint(x, y);
    return { x, y, trifft: !!(t && (t === k || k.contains(t))) };
  }, zug);
  if (!p) return 'weg';
  if (!p.trifft && !opt.egal) return 'verdeckt';
  await seite.mouse.click(p.x, p.y);
  await seite.waitForTimeout(opt.warte || 25);
  return 'geklickt';
}

const wochen = [];
let abbruch = null;

for (let w = 0; w < WOCHEN; w++) {
  // Der Sommerzettel der FUHRE sperrt WEITER darunter ab — zu damit.
  await maus('fuhre:sommer-zu', { egal: true });

  const A = await seite.evaluate(AUFNAHME);

  const hand = [];
  if (STIL !== 'faul') {
    // 1. Die Fuhre. Ihre Knoepfe liegen auf einem zugeklappten Brett —
    //    ein sorgfaeltiger Spieler schlaegt es auf. FUELLEN und ABSCHICKEN
    //    haengen am Wagenbrett, nicht am Haeuserbrett.
    if (!A.sud.length || true) {
      const offen = await seite.evaluate(() => {
        const k = document.querySelector('button[data-zug="fuhre:fuellen"]');
        if (!k) return false;
        const r = k.getBoundingClientRect();
        const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return !!(t && (t === k || k.contains(t)));
      });
      if (!offen) await maus('stadt:reiter:fuhre-fu-brett-fu-wagen', { egal: true, warte: 60 });
    }
    if (await maus('fuhre:fuellen') === 'geklickt') hand.push('fuellen');
    else if (await maus('fuhre:wie-vorige') === 'geklickt') hand.push('wie-vorige');
    if (await maus('fuhre:abschicken', { warte: 70 }) === 'geklickt') hand.push('abschicken');
    // 2. Rohstoff nachkaufen, wenn er knapp wird.
    if (A.rohstoff < 40) { if (await maus('fuhre:kauf:rohstoff') === 'geklickt') hand.push('rohstoff'); }
    // 3. Der Zettel wieder frei: das Wagenbrett zuklappen, sonst deckt es ihn.
    await maus('stadt:reiter:fuhre-fu-brett-fu-wagen', { egal: true, warte: 60 });
    // 4. Die Hefe — der Zug des SUD, der nichts kostet ausser Bier.
    if (await maus('sud:zettel-anstich') === 'geklickt') hand.push('hefe');
    // 5. Gesperrte Charge (1970) — Frist geht vor.
    if (await maus('sud:zettel-charge-frei', { egal: true }) === 'geklickt') hand.push('charge');
    if (STIL === 'siegel') {
      // Die teure Festlegung nehmen, sobald die Kasse sie traegt.
      const r = await maus('sud:zettel-wechsel-kauf');
      if (r === 'geklickt') hand.push('KAUF');
    }
    if (STIL === 'brett') {
      // Der Spieler schlaegt jede Woche DAS SUDHAUS auf und sieht nach.
      await maus('stadt:reiter:sud-sud-brett', { egal: true, warte: 70 });
      const c = await seite.evaluate(AUFNAHME);
      wochen.push({ w: w + 1, C: c, marke: 'brett-offen' });
      await maus('stadt:reiter:sud-sud-brett', { egal: true, warte: 70 });
    }
  }

  const Bm = await seite.evaluate(AUFNAHME);
  wochen.push({ w: w + 1, A, B: Bm, hand });

  if (A.ende || Bm.ende) { abbruch = 'ende in Woche ' + (w + 1); break; }
  const r = await maus('weiter', { warte: 45 });
  if (r !== 'geklickt') {
    // WEITER kann unter einem fremden Blatt liegen — dann alles zuklappen.
    await maus('stadt:alles-zuklappen', { egal: true });
    const r2 = await maus('weiter', { egal: true, warte: 45 });
    if (r2 !== 'geklickt') { abbruch = 'WEITER ' + r + '/' + r2 + ' in Woche ' + (w + 1); break; }
  }
}

const letzte = await seite.evaluate(AUFNAHME);
writeFileSync(AUS, JSON.stringify({
  epoche: EPOCHE, stil: STIL, saat: SAAT, hafen: HAFEN,
  abbruch, fehler, letzte, wochen
}, null, 0));
console.log('EPOCHE ' + EPOCHE + ' ' + STIL + ': ' + wochen.length + ' Wochen, '
  + letzte.jahr + ', Kasse ' + letzte.kasse + ', Sude ' + letzte.sude
  + ', Fehler ' + fehler.length + (abbruch ? ', ABBRUCH ' + abbruch : ''));
await browser.close();
