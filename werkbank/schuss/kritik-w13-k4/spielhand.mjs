// Eigene Messhand fuer K4. Baut ihre Knopfauswahl aus BRAUHAUS.zuege(),
// nicht aus einer vorher bekannten Liste. Echte Mausklicks, elementFromPoint-
// Pruefung vor jedem Klick.
//
// Aufruf: node spielhand.mjs <epoche> <wochenZiel> <ausgabe.json> [saat]
//
// Strategie (dokumentiert, damit sie nachvollziehbar ist — siehe Urteil,
// Abschnitt "Wie ich gespielt habe"):
//   - Einmalig 'kern:anfangen' klicken (Start-Anschlag beiseitelegen), nicht
//     in die Wochenzaehlung eingerechnet.
//   - Je Woche, in fester Reihenfolge, JEDER Schritt nur wenn der Knopf offen,
//     erreichbar (elementFromPoint) UND bezahlbar ist:
//       1. Sud anzapfen: 'sud:zettel-anstich' sonst 'sud:zettel-hefe-fass'
//          (haelt den Nachschub am Laufen, beide ohne Preisschild).
//       2. Die Wochenkarte der FUHRE: unter allen 'fuhre:plan:*' der mit der
//          CSS-Klasse 'fu-rat' (die eigene Empfehlung des Spiels), sonst der
//          erste in der vom Spiel gelieferten Reihenfolge.
//       3. Der Gegenzug: unter allen 'gegner:*' (ausser den reinen
//          Info-/Blattoeffnern oeffnen/blatt/zeige) der mit einem Textmuster
//          "noch N Wo." mit der kleinsten Frist — das ist die einzige
//          erkennbare Dringlichkeit, die am Bildschirm steht.
//     'erbe:uebergabe:*' und 'fuhre:uebergabe-auf' werden NIE automatisch
//     angeklickt — beide koennten die Epoche vorzeitig beenden, und das
//     ist eine bewusste Entscheidung, keine Beobachtung.
//   - WICHTIG, nach einer Korrektur waehrend der Messung: ein Klick auf
//     'fuhre:plan:*' schliesst die Woche SELBST ab (schicke() ruft am Ende
//     B.uhr.naechsteWoche() — Quelle: stuecke/fuhre.js:1892, Kommentar "DIE
//     FUHRE ABSCHICKEN — und damit die Woche schliessen"). Wird DANACH noch
//     'weiter' geklickt, laeuft eine zweite, unbeobachtete Woche mit. Die
//     Reihenfolge ist deshalb: erst Sud, dann der Gegenzug (beide schliessen
//     die Woche NICHT ab), dann ENTWEDER ein Fuhrplan-Klick ODER — nur wenn
//     keiner geklickt wurde — 'weiter'. `fuhre:sprung` wird in DIESEM Lauf
//     nicht benutzt, damit alle Wochen einzeln beobachtet werden (Frage 2).

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const [epocheArg, wochenZielArg, ausgabe, saatArg] = process.argv.slice(2);
const epoche = epocheArg || '1';
const wochenZiel = parseInt(wochenZielArg || '100', 10);
const saat = saatArg || '1350';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });

const seitenfehler = [];
seite.on('pageerror', (e) => seitenfehler.push('pageerror: ' + String(e)));
seite.on('console', (m) => { if (m.type() === 'error') seitenfehler.push('console: ' + m.text()); });
seite.on('requestfailed', (r) => seitenfehler.push('request: ' + r.url() + ' — ' + r.failure()?.errorText));

const url = `http://127.0.0.1:8933/spiel/?epoche=${epoche}&saat=${saat}&neu=1`;
await seite.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
await seite.waitForTimeout(700);

// ---- Werkzeug: echter Klick mit elementFromPoint-Pruefung -----------------
async function echterKlick(zug) {
  const handle = await seite.$(`[data-zug="${zug}"]`);
  if (!handle) return { ok: false, grund: 'nicht-im-dom' };
  try { await handle.scrollIntoViewIfNeeded({ timeout: 2000 }); } catch (e) {}
  const box = await handle.boundingBox();
  if (!box || box.width <= 0 || box.height <= 0) return { ok: false, grund: 'keine-flaeche' };
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const treffer = await seite.evaluate(([x, y, zug]) => {
    const el = document.elementFromPoint(x, y);
    if (!el) return { getroffen: false, was: null };
    const ziel = el.closest('[data-zug]');
    return { getroffen: !!ziel && ziel.getAttribute('data-zug') === zug, was: ziel ? ziel.getAttribute('data-zug') : (el.tagName) };
  }, [x, y, zug]);
  if (!treffer.getroffen) return { ok: false, grund: 'nicht-unter-zeiger', unterZeiger: treffer.was };
  await seite.mouse.click(x, y);
  return { ok: true };
}

async function zuege() {
  return seite.evaluate(() => BRAUHAUS.zuege());
}

async function weltZustand() {
  return seite.evaluate(() => {
    const w = BRAUHAUS.welt;
    return {
      jahr: w.zeit.jahr, woche: w.zeit.woche, epoche: w.zeit.epoche, ende: !!w.zeit.ende,
      kasse: w.haus.kasse,
      naechsterZug: w.naechsterZug ? { was: w.naechsterZug.was, preis: w.naechsterZug.preis, zug: w.naechsterZug.zug, art: w.naechsterZug.art, rang: w.naechsterZug.rang } : null,
      bestesZiel: (w.bestesZiel && w.bestesZiel()) || null
    };
  });
}

// ---- Start: den Anschlag beiseitelegen -------------------------------------
const setupKlicks = [];
let z0 = await zuege();
if (z0.some(z => z.zug === 'kern:anfangen')) {
  const r = await echterKlick('kern:anfangen');
  setupKlicks.push({ zug: 'kern:anfangen', ergebnis: r });
  await seite.waitForTimeout(150);
}

const klickProtokoll = []; // {woche, zug, ergebnis, preis, kasseVorher}
const gegnerZensus = [];   // je Woche: {woche, greifbareGegnerzuege, liste}
const reiterSchnappschuss = {}; // woche(kumuliert) -> reiter-info
const tafelProtokoll = []; // je Woche: {woche, text, offen}

let kumWoche = 0;
let letzterFehlerZaehler = seitenfehler.length;
let lageMax = 0;

for (let w = 1; w <= wochenZiel; w++) {
  kumWoche++;
  const vorZustand = await weltZustand();
  if (vorZustand.ende) { break; }

  const vorZuege = await zuege();

  // -- Gegner-Zensus dieser Woche (vor jeder eigenen Aktion) ---------------
  const gegnerZuege = vorZuege.filter(zz => zz.zug && zz.zug.indexOf('gegner:') === 0);
  const greifbar = [];
  for (const g of gegnerZuege) {
    if (!g.offen) continue;
    const handle = await seite.$(`[data-zug="${g.zug}"]`);
    if (!handle) continue;
    const box = await handle.boundingBox();
    if (!box || box.width <= 0 || box.height <= 0) continue;
    const x = box.x + box.width / 2, y = box.y + box.height / 2;
    const treffer = await seite.evaluate(([x, y, zug]) => {
      const el = document.elementFromPoint(x, y);
      const ziel = el ? el.closest('[data-zug]') : null;
      return !!ziel && ziel.getAttribute('data-zug') === zug;
    }, [x, y, g.zug]);
    if (!treffer) continue;
    // bezahlbar: Preisschild nicht groesser als die Kasse. Ohne Preisschild:
    // zaehlt, weil offen+Flaeche+elementFromPoint schon "wirklich ausfuehrbar" belegen.
    let bezahlbar = true;
    if (g.preis !== null && g.preis !== undefined) {
      const preisZahl = parseFloat(g.preis);
      if (!isNaN(preisZahl) && preisZahl < 0) bezahlbar = (-preisZahl) <= vorZustand.kasse;
    }
    if (bezahlbar) greifbar.push({ zug: g.zug, text: g.text, preis: g.preis });
  }
  gegnerZensus.push({ kumWoche, jahr: vorZustand.jahr, woche: vorZustand.woche, epoche: vorZustand.epoche, anzahlGreifbar: greifbar.length, liste: greifbar });

  // -- Tafel-Protokoll (preis:tafel Aufschrift) -----------------------------
  const tafel = vorZuege.find(zz => zz.zug === 'preis:tafel');
  tafelProtokoll.push({ kumWoche, text: tafel ? tafel.text : null, offen: tafel ? tafel.offen : null });

  // -- Reiter-Schnappschuss (OHNE DICH GESCHEHEN) an best. Wochen -----------
  if (kumWoche === 15 || kumWoche === 45) {
    const r = vorZuege.find(zz => zz.zug === 'stadt:reiter:gegner-amort-gg-band');
    reiterSchnappschuss[kumWoche] = r ? { zug: r.zug, text: r.text, offen: r.offen } : null;
  }

  // -- Eigene Strategie: bis zu drei feste Schritte, siehe Kopf der Datei --
  async function istGreifbarUndBezahlbar(zug, aktuelleKasse) {
    const eintrag = vorZuege.find(zz => zz.zug === zug);
    if (!eintrag || !eintrag.offen) return false;
    if (eintrag.preis !== null && eintrag.preis !== undefined) {
      const p = parseFloat(eintrag.preis);
      if (!isNaN(p) && p < 0 && (-p) > aktuelleKasse) return false;
    }
    return true;
  }

  async function klickeWennMoeglich(zug, quelle) {
    const aktuelleKasse = (await weltZustand()).kasse;
    if (!(await istGreifbarUndBezahlbar(zug, aktuelleKasse))) return false;
    const r = await echterKlick(zug);
    klickProtokoll.push({ kumWoche, zug, ergebnis: r.ok ? 'geklickt' : 'nicht-gegriffen:' + r.grund, quelle, kasseVorher: aktuelleKasse });
    await seite.waitForTimeout(70);
    return r.ok;
  }

  // Schritt 1: Sud anzapfen (schliesst die Woche NICHT ab).
  if (!(await klickeWennMoeglich('sud:zettel-anstich', 'sud-anzapfen'))) {
    await klickeWennMoeglich('sud:zettel-hefe-fass', 'sud-anzapfen');
  }

  // Schritt 2: der Gegenzug (schliesst die Woche NICHT ab) — dringendster
  // gegner:*-Zug mit "noch N Wo.".
  const gegnerKandidaten = vorZuege.filter(zz => zz.zug && zz.zug.indexOf('gegner:') === 0
    && zz.offen
    && zz.zug.indexOf('gegner:oeffnen:') !== 0 && zz.zug !== 'gegner:blatt'
    && zz.zug.indexOf('gegner:zeige:') !== 0 && zz.zug.indexOf('gegner:beschwerde-bild') !== 0);
  let bester = null, besteFrist = Infinity;
  for (const g of gegnerKandidaten) {
    const m = /noch (\d+) Wo/.exec(g.text || '');
    if (!m) continue;
    const frist = parseInt(m[1], 10);
    if (frist < besteFrist) { besteFrist = frist; bester = g; }
  }
  if (bester) await klickeWennMoeglich(bester.zug, 'gegenzug');

  // Schritt 3: die Woche abschliessen — ENTWEDER ein Fuhrplan-Chip (der
  // ruft naechsteWoche() selbst auf) ODER, wenn keiner gegriffen wurde,
  // 'weiter'. Niemals beides.
  const planZuege = vorZuege.filter(zz => zz.zug && zz.zug.indexOf('fuhre:plan:') === 0 && zz.offen);
  let planGeklickt = false;
  if (planZuege.length) {
    const klassen = await seite.evaluate((zuegeListe) => {
      const out = {};
      zuegeListe.forEach(z => {
        const el = document.querySelector('[data-zug="' + z + '"]');
        out[z] = el ? el.className : '';
      });
      return out;
    }, planZuege.map(p => p.zug));
    const empfohlen = planZuege.find(p => (klassen[p.zug] || '').indexOf('fu-rat') !== -1);
    const zielPlan = (empfohlen || planZuege[0]).zug;
    planGeklickt = await klickeWennMoeglich(zielPlan, 'fuhre-woche');
  }

  if (!planGeklickt) {
    const kasseVorWeiter = (await weltZustand()).kasse;
    const rW = await echterKlick('weiter');
    klickProtokoll.push({ kumWoche, zug: 'weiter', ergebnis: rW.ok ? 'geklickt' : 'nicht-gegriffen:' + rW.grund, quelle: 'pflicht', kasseVorher: kasseVorWeiter });
    await seite.waitForTimeout(90);
  }

  // -- lage.length & Seitenfehler laufend pruefen ---------------------------
  const lageLen = await seite.evaluate(() => (BRAUHAUS.lage || []).length);
  if (lageLen > lageMax) lageMax = lageLen;
  if (seitenfehler.length > letzterFehlerZaehler) {
    letzterFehlerZaehler = seitenfehler.length;
  }
}

const endZustand = await weltZustand();
const lageEintraege = await seite.evaluate(() => (BRAUHAUS.lage || []).map(String));

await seite.screenshot({ path: ausgabe.replace(/\.json$/, '.png') });

const ergebnis = {
  epoche, saat, wochenZiel, kumWocheErreicht: kumWoche,
  setupKlicks, klickProtokoll, gegnerZensus, tafelProtokoll, reiterSchnappschuss,
  endZustand, lageMax, lageEintraege, seitenfehler
};
fs.writeFileSync(ausgabe, JSON.stringify(ergebnis, null, 1));
console.log('fertig:', ausgabe, 'kumWoche=', kumWoche, 'ende=', endZustand.ende, 'lageMax=', lageMax, 'seitenfehler=', seitenfehler.length);

await browser.close();
