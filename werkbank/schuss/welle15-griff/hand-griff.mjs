/* DIE SUCHENDE HAND — WELLE 15, ABNAHME 1 (DER GRIFF).

   Baut NEU, im selben Geist wie werkbank/schuss/welle14/hand-suchend.mjs
   (dieselben zwei Regeln, wortgleich uebernommen, weil sie sich bewaehrt
   haben — kein Zugname wird vorher gewusst, alles kommt aus
   BRAUHAUS.zuege() / [data-zug] JETZT auf dem Bildschirm):

   1. Sie klappt zuerst ALLE sichtbaren, freien Knoepfe OHNE Preisschild auf,
      und erneut, sobald sich deren sichtbarer Text seit dem letzten Versuch
      geaendert hat (das sind strukturell die Bretter/Reiter/Griffe — ein
      neues Verb einer spaeteren Welle sieht genauso aus: kein `data-preis`,
      und die Hand kennt seinen Namen nicht im Voraus).
   2. Danach nimmt sie aus allen sichtbaren, freien Knoepfen MIT Preisschild
      die mit dem groessten Zahlenwert zuerst (das bevorzugt eine Einnahme
      vor jeder Ausgabe und die billigste Ausgabe vor der teuren) — bis zu
      drei je Aussenrunde, nur wenn die Kasse eine Ausgabe deckt — und
      schliesst die Woche mit 'weiter', dem einen Knopf, der laut
      kern/kopf.js in JEDER Epoche existiert.

   WAS HIER DAZUKOMMT, gegenueber Welle 14: die Hand liest nach jedem
   Bildschirm `BRAUHAUS.preis.lage().festGenommen` — Grundwahrheit, kein
   Text-Raten — und merkt sich, in welchem Braujahr `konzern` (oder eine
   andere Festlegung) zum ersten Mal auftaucht. Das ist reines LESEN, es
   lenkt die Hand nicht: sie waehlt weiterhin nur aus BRAUHAUS.zuege().

   HAFEN=8942 SAAT=1970 node hand-griff.mjs <lauf-name> [maxBraujahre]
   Epoche ist immer 4 (1970) — das ist die vom Analysten isolierte Epoche.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
import crypto from 'crypto';

const EP        = 4;
const LAUF      = process.argv[2] || `e${EP}-griff-1`;
const MAXJAHRE  = +(process.argv[3] || 6);
const MAXWOCHEN = MAXJAHRE * 30;
const MAXMIN    = +(process.env.MAXMIN || 20);
const HAFEN     = process.env.HAFEN || '8942';
const SAAT      = process.env.SAAT || '1970';
const BR        = +(process.env.BREITE || 1600);
const HO        = +(process.env.HOEHE || 900);
const WURZ      = '/home/user/brewhousesim/werkbank/schuss/welle15-griff';
const PROT      = `${WURZ}/protokoll/${LAUF}.jsonl`;
fs.mkdirSync(`${WURZ}/protokoll`, { recursive: true });
fs.writeFileSync(PROT, '');

const T0 = Date.now();
const sek = () => Math.round((Date.now() - T0) / 100) / 10;
function schreib(o) { fs.appendFileSync(PROT, JSON.stringify({ t: sek(), ...o }) + '\n'); }

const hashteile = [];
function hashe(o) { hashteile.push(JSON.stringify(o)); }

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: BR, height: HO }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 300)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 300)); });

const URL = `http://127.0.0.1:${HAFEN}/spiel/?epoche=${EP}&saat=${SAAT}&neu=1`;
await seite.goto(URL, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);
schreib({ was: 'laden', url: URL, fenster: BR + 'x' + HO });

async function schirm() {
  return await seite.evaluate(() => {
    const B = window.BRAUHAUS;
    const zuege = [];
    document.querySelectorAll('[data-zug]').forEach(el => {
      const r = el.getBoundingClientRect();
      let hit = false;
      if (r.width && r.height) {
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
          const t = document.elementFromPoint(cx, cy);
          hit = !!(t && (t === el || el.contains(t)));
        }
      }
      zuege.push({
        zug: el.getAttribute('data-zug'),
        text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90),
        preis: el.hasAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
        aus: !!el.disabled, hit,
        x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2)
      });
    });
    let festGenommen = null;
    try { festGenommen = Object.keys(B.preis.lage().festGenommen || {}); } catch (e) {}
    let deckung = null; try { deckung = B.welt.zugDeckung(); } catch (e) {}
    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, epoche: B.welt.zeit.epoche,
      ende: !!B.welt.zeit.ende, endgrund: B.welt.zeit.endgrund || null,
      kasse: B.welt.haus.kasse, deckung,
      lage: (B.lage || []).length,
      festGenommen,
      zuege
    };
  });
}

async function ruhe(ms) {
  await seite.waitForTimeout(Math.min(ms, 60));
  try {
    await seite.evaluate(() => new Promise(f => {
      let ab = false; const fertig = () => { if (!ab) { ab = true; f(1); } };
      setTimeout(fertig, 2000);
      requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(fertig, 0)));
    }));
  } catch (e) {}
  const rest = ms - 60; if (rest > 0) await seite.waitForTimeout(rest);
}

async function klick(el) {
  await seite.mouse.move(el.x - 30, el.y - 20);
  await seite.waitForTimeout(20);
  await seite.mouse.move(el.x, el.y, { steps: 5 });
  await seite.waitForTimeout(30);
  await seite.mouse.down();
  await seite.waitForTimeout(55);
  await seite.mouse.up();
  await ruhe(150);
}

let klicksNav = 0, klicksPreis = 0, klicksWeiter = 0, klicksNotfall = 0;

let letzteWoche = null;
let echteWochenGesamt = 0;
const wochenReihe = [];
const navGesehen = new Map();
let konzernJahr = null;           // erstes Braujahr, in dem 'konzern' genommen wurde
const festGenommenGesehen = new Set();
const festGenommenEreignisse = [];

function merkeWoche(snap) {
  const kennung = snap.jahr * 100 + snap.woche;
  if (kennung === letzteWoche) return;
  letzteWoche = kennung;
  echteWochenGesamt++;
  wochenReihe.push({ n: echteWochenGesamt, jahr: snap.jahr, woche: snap.woche,
    kasse: snap.kasse, deckung: snap.deckung });
}

function merkeFestgenommen(snap) {
  (snap.festGenommen || []).forEach(k => {
    if (festGenommenGesehen.has(k)) return;
    festGenommenGesehen.add(k);
    festGenommenEreignisse.push({ k, jahr: snap.jahr, woche: snap.woche, echteWochenGesamt });
    if (k === 'konzern' && konzernJahr === null) konzernJahr = snap.jahr;
  });
}

const ENDE_UHR = T0 + MAXMIN * 60 * 1000;
let runde = 0, abbruch = null, endgrund = null;

{ const s0 = await schirm(); merkeWoche(s0); merkeFestgenommen(s0); }

while (echteWochenGesamt < MAXWOCHEN) {
  if (Date.now() > ENDE_UHR) { abbruch = { grund: 'wanduhr-limit', minuten: MAXMIN }; break; }

  let s = await schirm();
  if (s.ende) { endgrund = s.endgrund || 'zeitgrenze-erreicht'; break; }
  runde++;

  const vorWocheGesamt = echteWochenGesamt;

  /* PHASE 1 — Erkundung: alle sichtbaren, freien Knoepfe OHNE Preisschild. */
  for (let pass = 0; pass < 10; pass++) {
    s = await schirm();
    if (s.ende) break;
    merkeFestgenommen(s);
    const cand = s.zuege.filter(z => z.hit && !z.aus && z.preis === null
      && z.zug !== 'weiter' && navGesehen.get(z.zug) !== z.text);
    if (!cand.length) break;
    let bewegt = false;
    for (const c of cand) {
      navGesehen.set(c.zug, c.text);
      const vor = await schirm(); if (vor.ende) break;
      const el = vor.zuege.find(x => x.zug === c.zug && x.hit && !x.aus);
      if (!el) continue;
      await klick(el); klicksNav++; bewegt = true;
      const nach = await schirm();
      merkeWoche(nach); merkeFestgenommen(nach);
      schreib({ was: 'klick-nav', zug: c.zug, text: c.text, jahr: nach.jahr, woche: nach.woche,
        kasse: nach.kasse, ende: nach.ende });
      hashe({ nav: c.zug, kasse: nach.kasse });
      if (nach.ende) break;
    }
    if (!bewegt) break;
  }

  s = await schirm();
  if (s.ende) { endgrund = s.endgrund || 'zeitgrenze-erreicht'; break; }

  /* PHASE 2 — bezahlbare Knoepfe MIT Preisschild, groesster Wert zuerst,
     hoechstens drei je Aussenrunde. */
  for (let k = 0; k < 3; k++) {
    s = await schirm();
    if (s.ende) break;
    const priced = s.zuege.filter(z => z.hit && !z.aus && z.preis !== null && z.zug !== 'weiter');
    const geht = priced.filter(z => z.preis >= 0 || Math.abs(z.preis) <= s.kasse);
    if (!geht.length) break;
    geht.sort((a, b) => b.preis - a.preis);
    const wahl = geht[0];
    await klick(wahl); klicksPreis++;
    const nach = await schirm();
    merkeWoche(nach); merkeFestgenommen(nach);
    schreib({ was: 'klick-preis', zug: wahl.zug, text: wahl.text, preis: wahl.preis,
      kasseVor: s.kasse, kasseNach: nach.kasse, jahr: nach.jahr, woche: nach.woche, ende: nach.ende });
    hashe({ preis: wahl.zug, wert: wahl.preis, kasse: nach.kasse });
    if (nach.ende) { s = nach; break; }
  }

  s = await schirm();
  if (s.ende) { endgrund = s.endgrund || 'zeitgrenze-erreicht'; break; }

  /* PHASE 3 — die Woche schliessen: 'weiter'. */
  const w = s.zuege.find(z => z.zug === 'weiter' && z.hit && !z.aus);
  if (w) { await klick(w); klicksWeiter++; }
  else {
    const irgendeiner = s.zuege.find(z => z.hit && !z.aus);
    if (irgendeiner) { await klick(irgendeiner); klicksNotfall++; }
  }

  const nach = await schirm();
  merkeWoche(nach); merkeFestgenommen(nach);
  schreib({ was: 'runde-ende', runde, jahr: nach.jahr, woche: nach.woche, kasse: nach.kasse,
    deckung: nach.deckung, ende: nach.ende, echteWochenGesamt });

  if (nach.ende) { endgrund = nach.endgrund || 'zeitgrenze-erreicht'; break; }

  if (echteWochenGesamt === vorWocheGesamt) {
    abbruch = { grund: 'hand-festgefahren', jahr: nach.jahr, woche: nach.woche };
    break;
  }
}

if (!endgrund && !abbruch) abbruch = { grund: 'maxWochen-erreicht', maxWochen: MAXWOCHEN };

const schluss = await schirm();
merkeFestgenommen(schluss);

const pruefsumme = crypto.createHash('sha256').update(hashteile.join('\n')).digest('hex').slice(0, 8);
const pruefsummeWochen = crypto.createHash('sha256').update(JSON.stringify(wochenReihe)).digest('hex').slice(0, 8);

const zusammenfassung = {
  epoche: EP, saat: SAAT, lauf: LAUF, fenster: BR + 'x' + HO, maxJahre: MAXJAHRE,
  minuten: Math.round((Date.now() - T0) / 6000) / 10,
  aussenrunden: runde, echteWochenGesamt,
  jahrStart: wochenReihe.length ? wochenReihe[0].jahr : null,
  jahrEnde: schluss.jahr, wocheEnde: schluss.woche,
  braujahre: wochenReihe.length ? (schluss.jahr - wochenReihe[0].jahr + 1) : null,
  kasseEnde: schluss.kasse,
  endgrund, abbruch,
  konzernGenommen: konzernJahr !== null,
  konzernJahr,
  festGenommenGesamt: [...festGenommenGesehen],
  festGenommenEreignisse,
  klicksNav, klicksPreis, klicksWeiter, klicksNotfall,
  fehler, seitenfehlerZahl: fehler.length,
  pruefsumme, pruefsummeWochen,
  wochenReihe
};
fs.writeFileSync(`${WURZ}/protokoll/${LAUF}-ergebnis.json`, JSON.stringify(zusammenfassung, null, 1));

console.log(`E${EP} ${LAUF}: ${echteWochenGesamt} echte Wochen / ${runde} Aussenrunden `
  + `(bis ${schluss.jahr}/${schluss.woche}), Kasse ${schluss.kasse}, `
  + `konzern genommen: ${konzernJahr !== null ? 'JA (Braujahr ' + konzernJahr + ')' : 'NEIN'}, `
  + `Festlegungen gesamt: ${[...festGenommenGesehen].join(',') || '(keine)'}, `
  + `Endgrund=${endgrund || '(keiner)'} Abbruch=${abbruch ? abbruch.grund : '-'}, `
  + `Pruefsumme=${pruefsumme}, Seitenfehler=${fehler.length}`);
await browser.close();
