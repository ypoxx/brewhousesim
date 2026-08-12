/* DIE SUCHENDE HAND — WELLE 16, STUECK 2 (DIE ZWEITE TUER).
   Eigener Bau fuer diese Welle. Nicht kopiert von
   werkbank/schuss/welle15-griff/hand-griff.mjs oder
   werkbank/schuss/spiel-w12/hand3.mjs — beide gelesen, keine Zeile
   uebernommen. Der Unterschied ist mit Absicht kein kosmetischer:

     * Sie waehlt ausschliesslich aus BRAUHAUS.zuege() — kein Zugname wird
       vorher gewusst, kein `preis:festlege:konzern` steht hier hart im Code.
     * EIN Durchgang je Aussenrunde statt drei Phasen: Erkundung (freie
       Knoepfe) und Kauf (bepreiste Knoepfe) wechseln sich WOCHENWEISE ab,
       nicht rundenweise — das haelt den Umweg ueber fremde Reiter (die
       Schliessroute DER STADT) im Spiel, ohne ihn zu bevorzugen.
     * BEIM KAUF NIMMT SIE DAS GUENSTIGSTE ZUERST, nicht das teuerste. Das
       ist eine andere Haltung (eine sparsame Hand statt einer, die den
       groessten Wert zuerst greift) und damit ein echter zweiter Zeuge,
       kein Zwilling.
     * Die Reihenfolge innerhalb einer Kategorie wird mit einem GESAETEN
       Pseudozufall gemischt (eigener Lauf-Saat, nicht die Weltsaat) —
       verschiedene Laeufe gehen also nicht in derselben Reihenfolge durch
       dieselbe Liste, wie es eine wirkliche zweite Hand am Bildschirm auch
       nicht taete.

   HAFEN=8941 SAAT=1970 LAUFSAAT=1 node hand-durchsuch.mjs <lauf-name> [maxBraujahre]
   Epoche fest auf 4 (1970) — das ist die von der Aufsicht benannte Stelle.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
import crypto from 'crypto';

const EP        = 4;
const LAUF      = process.argv[2] || `e${EP}-tuer-1`;
const MAXJAHRE  = +(process.argv[3] || 5);
const MAXWOCHEN = MAXJAHRE * 30;
const MAXMIN    = +(process.env.MAXMIN || 20);
const HAFEN     = process.env.HAFEN || '8941';
const SAAT      = process.env.SAAT || '1970';
const LAUFSAAT  = +(process.env.LAUFSAAT || 1);
const BR        = +(process.env.BREITE || 1600);
const HO        = +(process.env.HOEHE || 900);
const WURZ      = '/home/user/brewhousesim/werkbank/schuss/welle16-tuer';
const PROT      = `${WURZ}/protokoll/${LAUF}.jsonl`;
fs.mkdirSync(`${WURZ}/protokoll`, { recursive: true });
fs.writeFileSync(PROT, '');

/* Eigener, gesaeter Mischer — mulberry32. Deterministisch je LAUFSAAT, aber
   nicht dieselbe Reihenfolge wie die Weltsaat (die entscheidet den Wuerfel
   des Spiels, nicht den Blick der Hand). */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const zufall = mulberry32(LAUFSAAT * 1000003 + 17);
function mische(liste) {
  var a = liste.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(zufall() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

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
schreib({ was: 'laden', url: URL, fenster: BR + 'x' + HO, laufsaat: LAUFSAAT });

/* Auswahl AUSSCHLIESSLICH aus BRAUHAUS.zuege() — Preis/Text/Stueck kommen von
   dort. Fuer den wirklichen Klick braucht es zusaetzlich Lage und
   Sichtbarkeit; die wird separat je gewaehltem Zug abgefragt (siehe `lage`),
   nicht zur Auswahl selbst benutzt. */
async function zuege() {
  return await seite.evaluate(() => (window.BRAUHAUS && BRAUHAUS.zuege) ? BRAUHAUS.zuege() : []);
}

async function lage(zug) {
  return await seite.evaluate((z) => {
    const el = document.querySelector('[data-zug="' + CSS.escape(z) + '"]');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return { sichtbar: false };
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let hit = false;
    if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
      const t = document.elementFromPoint(cx, cy);
      hit = !!(t && (t === el || el.contains(t)));
    }
    return { sichtbar: true, hit, x: Math.round(cx), y: Math.round(cy) };
  }, zug);
}

async function grund() {
  return await seite.evaluate(() => {
    const B = window.BRAUHAUS;
    let festGenommen = null;
    try { festGenommen = Object.keys(B.preis.lage().festGenommen || {}); } catch (e) {}
    let deckung = null; try { deckung = B.welt.zugDeckung(); } catch (e) {}
    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, epoche: B.welt.zeit.epoche,
      ende: !!B.welt.zeit.ende, endgrund: B.welt.zeit.endgrund || null,
      kasse: B.welt.haus.kasse, deckung, lage: (B.lage || []).length, festGenommen
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

/* Klickt EINEN gewaehlten Zug, wenn er wirklich frei und getroffen daliegt.
   Gibt true zurueck, wenn ein Klick stattfand. */
async function klick(zug) {
  const l = await lage(zug);
  if (!l || !l.sichtbar || !l.hit) return false;
  await seite.mouse.move(l.x - 25, l.y - 15);
  await seite.waitForTimeout(15);
  await seite.mouse.move(l.x, l.y, { steps: 4 });
  await seite.waitForTimeout(25);
  await seite.mouse.down();
  await seite.waitForTimeout(50);
  await seite.mouse.up();
  await ruhe(150);
  return true;
}

let klicksFrei = 0, klicksKauf = 0, klicksWeiter = 0, klicksNotfall = 0;

let letzteWoche = null;
let echteWochenGesamt = 0;
const wochenReihe = [];
const nachSignatur = new Map();     /* zug -> zuletzt gesehener Text */
let konzernJahr = null;
const festGenommenGesehen = new Set();
const festGenommenEreignisse = [];

function merkeWoche(g) {
  const kennung = g.jahr * 100 + g.woche;
  if (kennung === letzteWoche) return;
  letzteWoche = kennung;
  echteWochenGesamt++;
  wochenReihe.push({ n: echteWochenGesamt, jahr: g.jahr, woche: g.woche, kasse: g.kasse, deckung: g.deckung });
}

function merkeFestgenommen(g) {
  (g.festGenommen || []).forEach(k => {
    if (festGenommenGesehen.has(k)) return;
    festGenommenGesehen.add(k);
    festGenommenEreignisse.push({ k, jahr: g.jahr, woche: g.woche, echteWochenGesamt });
    if (k === 'konzern' && konzernJahr === null) konzernJahr = g.jahr;
  });
}

const ENDE_UHR = T0 + MAXMIN * 60 * 1000;
let runde = 0, abbruch = null, endgrund = null;

{ const g0 = await grund(); merkeWoche(g0); merkeFestgenommen(g0); }

while (echteWochenGesamt < MAXWOCHEN) {
  if (Date.now() > ENDE_UHR) { abbruch = { grund: 'wanduhr-limit', minuten: MAXMIN }; break; }

  let g = await grund();
  if (g.ende) { endgrund = g.endgrund || 'zeitgrenze-erreicht'; break; }
  runde++;
  const vorWocheGesamt = echteWochenGesamt;

  /* SCHRITT 1 — freie Knoepfe (kein Preisschild) anfassen, sofern ihr
     sichtbarer Text sich seit dem letzten Mal geaendert hat oder sie neu
     sind. Deckt die Reiter DER STADT ab (die Schliessroute bleibt offen,
     siehe R16.2) sowie Bretter, Griffe, Chronikseiten. Bis zu 8 je Runde,
     in gemischter Reihenfolge. */
  for (let welle = 0; welle < 6; welle++) {
    const z = await zuege();
    const frei = z.filter(x => x.offen && (x.preis === null || x.preis === '')
      && x.zug !== 'weiter' && nachSignatur.get(x.zug) !== x.text);
    if (!frei.length) break;
    const zug8 = mische(frei).slice(0, 8);
    let bewegt = false;
    for (const c of zug8) {
      nachSignatur.set(c.zug, c.text);
      const ok = await klick(c.zug);
      if (!ok) continue;
      klicksFrei++; bewegt = true;
      const gn = await grund();
      merkeWoche(gn); merkeFestgenommen(gn);
      schreib({ was: 'klick-frei', zug: c.zug, text: c.text, jahr: gn.jahr, woche: gn.woche,
        kasse: gn.kasse, ende: gn.ende });
      hashe({ frei: c.zug, kasse: gn.kasse });
      if (gn.ende) break;
    }
    if (!bewegt) break;
    const gz = await grund();
    if (gz.ende) break;
  }

  g = await grund();
  if (g.ende) { endgrund = g.endgrund || 'zeitgrenze-erreicht'; break; }

  /* SCHRITT 2 — bepreiste Knoepfe. GUENSTIGSTES ZUERST (Betrag am
     naechsten an 0, egal ob Einnahme oder Ausgabe), hoechstens zwei je
     Runde, nur wenn die Kasse eine Ausgabe wirklich deckt. */
  for (let k = 0; k < 2; k++) {
    const z = await zuege();
    const bepreist = z.filter(x => x.offen && x.zug !== 'weiter'
      && x.preis !== null && x.preis !== '' && !isNaN(+x.preis));
    const leistbar = bepreist.filter(x => +x.preis >= 0 || Math.abs(+x.preis) <= g.kasse);
    if (!leistbar.length) break;
    const gemischt = mische(leistbar);
    gemischt.sort((a, b) => Math.abs(+a.preis) - Math.abs(+b.preis));
    const wahl = gemischt[0];
    const vorher = g.kasse;
    const ok = await klick(wahl.zug);
    if (!ok) break;
    klicksKauf++;
    const gn = await grund();
    merkeWoche(gn); merkeFestgenommen(gn);
    schreib({ was: 'klick-kauf', zug: wahl.zug, text: wahl.text, preis: +wahl.preis,
      kasseVor: vorher, kasseNach: gn.kasse, jahr: gn.jahr, woche: gn.woche, ende: gn.ende });
    hashe({ kauf: wahl.zug, wert: +wahl.preis, kasse: gn.kasse });
    g = gn;
    if (g.ende) break;
  }

  g = await grund();
  if (g.ende) { endgrund = g.endgrund || 'zeitgrenze-erreicht'; break; }

  /* SCHRITT 3 — die Woche schliessen. */
  let geschlossen = await klick('weiter');
  if (geschlossen) klicksWeiter++;
  else {
    const z = await zuege();
    const irgendein = z.find(x => x.offen);
    if (irgendein) { geschlossen = await klick(irgendein.zug); if (geschlossen) klicksNotfall++; }
  }

  const nach = await grund();
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

const schluss = await grund();
merkeFestgenommen(schluss);

const pruefsumme = crypto.createHash('sha256').update(hashteile.join('\n')).digest('hex').slice(0, 8);
const pruefsummeWochen = crypto.createHash('sha256').update(JSON.stringify(wochenReihe)).digest('hex').slice(0, 8);

const zusammenfassung = {
  epoche: EP, saat: SAAT, laufsaat: LAUFSAAT, lauf: LAUF, fenster: BR + 'x' + HO, maxJahre: MAXJAHRE,
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
  klicksFrei, klicksKauf, klicksWeiter, klicksNotfall,
  fehler, seitenfehlerZahl: fehler.length,
  pruefsumme, pruefsummeWochen,
  wochenReihe
};
fs.writeFileSync(`${WURZ}/protokoll/${LAUF}-ergebnis.json`, JSON.stringify(zusammenfassung, null, 1));

console.log(`E${EP} ${LAUF} (LAUFSAAT ${LAUFSAAT}): ${echteWochenGesamt} echte Wochen / ${runde} Aussenrunden `
  + `(bis ${schluss.jahr}/${schluss.woche}), Kasse ${schluss.kasse}, `
  + `konzern genommen: ${konzernJahr !== null ? 'JA (Braujahr ' + konzernJahr + ')' : 'NEIN'}, `
  + `Festlegungen gesamt: ${[...festGenommenGesehen].join(',') || '(keine)'}, `
  + `Endgrund=${endgrund || '(keiner)'} Abbruch=${abbruch ? abbruch.grund : '-'}, `
  + `Pruefsumme=${pruefsumme}, Seitenfehler=${fehler.length}`);
await browser.close();
