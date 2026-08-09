/* DIE SUCHENDE HAND — Welle 14, Frage A.

   Baut NEU (kopiert keine vorhandene Hand). Sie waehlt ihre Knoepfe
   ausschliesslich aus dem, was `BRAUHAUS.zuege()` / `[data-zug]` JETZT auf
   dem Bildschirm zeigt — kein Regex auf einen Zugnamen, den ein frueheres
   Stueck erfunden hat.

   WIE SIE WAEHLT (zwei Saetze, wie im Auftrag verlangt):
   1. Sie klappt zuerst ALLE sichtbaren, freien Knoepfe OHNE Preisschild auf,
      und erneut, sobald sich deren sichtbarer Text aendert (das sind
      strukturell die Bretter/Reiter — irgendein neues Verb einer spaeteren
      Welle sieht genauso aus: kein `data-preis`, und die Hand kennt seinen
      Namen nicht im Voraus).
   2. Danach nimmt sie aus allen sichtbaren, freien Knoepfen MIT Preisschild
      die mit dem groessten Zahlenwert zuerst (das bevorzugt eine Einnahme
      vor jeder Ausgabe und die billigste Ausgabe vor der teuren) — bis zu
      drei je Woche, nur wenn die Kasse eine Ausgabe deckt — und schliesst
      die Woche mit dem einen Knopf, der laut kern/kopf.js in JEDER Epoche
      unveraendert existiert ('weiter', "der eine Knopf, den es immer gibt").
      Das ist Rahmen-Chrome, kein Stueck-Verb, und darum kein Verstoss gegen
      "keine Liste, die man vorher kennt".

   HAFEN=8936 SAAT=1350 node hand-suchend.mjs <epoche> <lauf-name> [maxWochen] [maxMinuten]
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
import crypto from 'crypto';

const ep        = +(process.argv[2] || 1);
const LAUF      = process.argv[3] || `e${ep}-such-1`;
const MAXWOCHEN = +(process.argv[4] || 420);
const MAXMIN    = +(process.argv[5] || 25);
const HAFEN     = process.env.HAFEN || '8936';
const SAAT      = process.env.SAAT || '1350';
const BR        = +(process.env.BREITE || 1600);
const HO        = +(process.env.HOEHE || 900);
const WURZ      = '/home/user/brewhousesim/werkbank/schuss/welle14';
const PROT      = `${WURZ}/protokoll/${LAUF}.jsonl`;
const SCHUSS    = `${WURZ}/schuesse`;
fs.mkdirSync(`${WURZ}/protokoll`, { recursive: true });
fs.mkdirSync(SCHUSS, { recursive: true });
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

const URL = `http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}&neu=1`;
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
        x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2),
        top: Math.round(r.top), bottom: Math.round(r.bottom)
      });
    });
    let deckung = null; try { deckung = B.welt.zugDeckung(); } catch (e) {}
    let bester = null; try { bester = B.welt.besterZug(); } catch (e) {}
    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, epoche: B.welt.zeit.epoche,
      ende: !!B.welt.zeit.ende, endgrund: B.welt.zeit.endgrund || null,
      kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff, ansehen: B.welt.haus.ansehen,
      deckung, besterPreis: bester ? bester.preis : null,
      lage: (B.lage || []).length,
      letzteChronik: (B.welt.chronik && B.welt.chronik.length)
        ? B.welt.chronik[B.welt.chronik.length - 1] : null,
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

async function foto(name) {
  const p = `${SCHUSS}/${LAUF}-${name}.png`;
  try { await seite.screenshot({ path: p }); } catch (e) {}
  return p;
}

let klicksNav = 0, klicksPreis = 0, klicksWeiter = 0, klicksNotfall = 0;
let unterhalbFaltkante = 0;   // Knoepfe, die es gab, aber deren Mitte y > HO war

/* Manche zero-price Knoepfe (z.B. 'fuhre:sprung', oder ein 'fuhre:plan:*'
   mit Preisschild) beenden selbst mehrere echte Spielwochen in einem Klick
   ("Weiter wie zuletzt" — B.uhr.springeWochen unter der Haube). Eine
   Aussenschleife ist deshalb NICHT eine Spielwoche; echte Wochen werden hier
   gezaehlt, jedes Mal wenn sich jahr/woche aendert, gleich in welcher Phase. */
let letzteWoche = null;
let echteWochenGesamt = 0;
const wochenReihe = [];
const tafelJahreGesehen = new Set();
const tafelBeobachtungen = [];   // Frage F1: Preislage jeder Michaelitafel

/* Erkundung ueber die GANZE Partie gemerkt (zug -> zuletzt gesehener Text),
   nicht je Woche zurueckgesetzt: ein Brett, das schon offen ist, muss nicht
   jede Woche neu aufgeklappt werden (das waere nur Zu-Auf-Zu-Auf und kostet
   Zeit ohne neue Information). Erneut versucht wird ein Knopf nur, wenn sein
   sichtbarer Text sich seit dem letzten Versuch geaendert hat — das bleibt
   generisch (kein Name wird bevorzugt) und faengt trotzdem neue Zustaende ab. */
const navGesehen = new Map();

function merkeWoche(snap) {
  const kennung = snap.jahr * 100 + snap.woche;
  if (kennung === letzteWoche) return;
  const sprung = letzteWoche === null ? 1 : (kennung - letzteWoche);
  letzteWoche = kennung;
  echteWochenGesamt++;
  wochenReihe.push({ n: echteWochenGesamt, jahr: snap.jahr, woche: snap.woche,
    kasse: snap.kasse, deckung: snap.deckung, besterPreis: snap.besterPreis,
    mehrwochenSprung: sprung > 1 ? sprung : undefined });
}

function merkeTafel(snap) {
  const fest = snap.zuege.filter(z => /^preis:festlege:/.test(z.zug || ''));
  if (!fest.length) return;
  const key = snap.jahr;
  if (tafelJahreGesehen.has(key)) return;
  tafelJahreGesehen.add(key);
  const bezahlbar = fest.filter(z => z.preis !== null);
  const kosten = bezahlbar.filter(z => z.preis < 0).map(z => -z.preis);
  tafelBeobachtungen.push({
    jahr: snap.jahr, woche: snap.woche, kasse: snap.kasse,
    anzahl: fest.length,
    billigsteKosten: kosten.length ? Math.min(...kosten) : null,
    kasseDurchBilligste: kosten.length ? snap.kasse / Math.min(...kosten) : null,
    karten: fest.map(z => ({ zug: z.zug, text: z.text, preis: z.preis, aus: z.aus }))
  });
}

async function klick(el, grund) {
  await seite.mouse.move(el.x - 30, el.y - 20);
  await seite.waitForTimeout(20);
  await seite.mouse.move(el.x, el.y, { steps: 5 });
  await seite.waitForTimeout(30);
  await seite.mouse.down();
  await seite.waitForTimeout(55);
  await seite.mouse.up();
  await ruhe(150);
}

/* ---------------------------------------------------------------- Partie */

const ENDE_UHR = T0 + MAXMIN * 60 * 1000;
let runde = 0, abbruch = null, endgrund = null;

await foto('00-start');
{ const s0 = await schirm(); merkeWoche(s0); merkeTafel(s0); }

while (echteWochenGesamt < MAXWOCHEN) {
  if (Date.now() > ENDE_UHR) { abbruch = { grund: 'wanduhr-limit', minuten: MAXMIN }; break; }

  let s = await schirm();
  if (s.ende) { endgrund = s.endgrund || 'zeitgrenze-erreicht'; break; }
  runde++;

  const vorWocheGesamt = echteWochenGesamt;

  /* PHASE 1 — Erkundung: alle sichtbaren, freien Knoepfe OHNE Preisschild,
     einmal je Aussenrunde, in Bildschirm-Reihenfolge, bis nichts Neues mehr
     auftaucht. Manche dieser Knoepfe (Michaelitafel, Wochenplan-"Sprung")
     erzaehlen dabei selbst mehrere echte Wochen — merkeWoche() zaehlt das
     bei jeder Aenderung von jahr/woche mit, nicht nur am Rundenende. */
  const triedThisPass = new Set();
  for (let pass = 0; pass < 10; pass++) {
    s = await schirm();
    if (s.ende) break;
    for (const z of s.zuege) {
      if (z.bottom > HO || z.top < 0) unterhalbFaltkante++;
    }
    merkeTafel(s);
    const cand = s.zuege.filter(z => z.hit && !z.aus && z.preis === null
      && z.zug !== 'weiter' && !triedThisPass.has(z.zug)
      && navGesehen.get(z.zug) !== z.text);
    if (!cand.length) break;
    let bewegt = false;
    for (const c of cand) {
      triedThisPass.add(c.zug);
      navGesehen.set(c.zug, c.text);
      const vor = await schirm(); if (vor.ende) break;
      const el = vor.zuege.find(x => x.zug === c.zug && x.hit && !x.aus);
      if (!el) continue;
      await klick(el, 'erkundung'); klicksNav++; bewegt = true;
      const nach = await schirm();
      merkeWoche(nach); merkeTafel(nach);
      schreib({ was: 'klick-nav', zug: c.zug, text: c.text, jahr: nach.jahr, woche: nach.woche,
        kasse: nach.kasse, ende: nach.ende, endgrund: nach.endgrund });
      hashe({ nav: c.zug, kasse: nach.kasse });
      if (nach.ende) break;
    }
    if (!bewegt) break;
  }

  s = await schirm();
  if (s.ende) { endgrund = s.endgrund || 'zeitgrenze-erreicht'; break; }

  /* PHASE 2 — bezahlbare Knoepfe MIT Preisschild, groesster Wert zuerst,
     hoechstens drei je Aussenrunde. Manche davon (z.B. ein Fuhrplan) sind
     selbst der Wochenschluss — auch das faengt merkeWoche() ab. */
  for (let k = 0; k < 3; k++) {
    s = await schirm();
    if (s.ende) break;
    const priced = s.zuege.filter(z => z.hit && !z.aus && z.preis !== null && z.zug !== 'weiter');
    const geht = priced.filter(z => z.preis >= 0 || Math.abs(z.preis) <= s.kasse);
    if (!geht.length) break;
    geht.sort((a, b) => b.preis - a.preis);
    const wahl = geht[0];
    await klick(wahl, 'preis'); klicksPreis++;
    const nach = await schirm();
    merkeWoche(nach); merkeTafel(nach);
    schreib({ was: 'klick-preis', zug: wahl.zug, text: wahl.text, preis: wahl.preis,
      kasseVor: s.kasse, kasseNach: nach.kasse, jahr: nach.jahr, woche: nach.woche,
      ende: nach.ende, endgrund: nach.endgrund });
    hashe({ preis: wahl.zug, wert: wahl.preis, kasse: nach.kasse });
    if (nach.ende) { s = nach; break; }
  }

  s = await schirm();
  if (s.ende) { endgrund = s.endgrund || 'zeitgrenze-erreicht'; break; }

  /* PHASE 3 — die Woche schliessen: 'weiter', der eine Knopf, der immer da ist. */
  const w = s.zuege.find(z => z.zug === 'weiter' && z.hit && !z.aus);
  if (w) { await klick(w, 'weiter'); klicksWeiter++; }
  else {
    /* Notfall, sollte laut kern/kopf.js nie eintreten: irgendeinen freien
       sichtbaren Knopf versuchen, damit die Partie nicht ohne Befund haengt. */
    const irgendeiner = s.zuege.find(z => z.hit && !z.aus);
    if (irgendeiner) { await klick(irgendeiner, 'notfall-kein-weiter'); klicksNotfall++; }
  }

  const nach = await schirm();
  merkeWoche(nach); merkeTafel(nach);
  schreib({ was: 'runde-ende', runde, jahr: nach.jahr, woche: nach.woche, kasse: nach.kasse,
    deckung: nach.deckung, besterPreis: nach.besterPreis, ende: nach.ende, endgrund: nach.endgrund,
    echteWochenGesamt });

  if (nach.ende) { endgrund = nach.endgrund || 'zeitgrenze-erreicht'; break; }

  if (echteWochenGesamt === vorWocheGesamt) {
    /* Woche hat sich trotz aller drei Phasen nicht bewegt — festgefahren. */
    abbruch = { grund: 'hand-festgefahren', jahr: nach.jahr, woche: nach.woche };
    await foto('abbruch-festgefahren');
    break;
  }

  if (runde % 15 === 0) await foto(`r${runde}-w${echteWochenGesamt}`);
}

if (!endgrund && !abbruch) abbruch = { grund: 'maxWochen-erreicht', maxWochen: MAXWOCHEN };

await foto('99-schluss');
const schluss = await schirm();

const pruefsumme = crypto.createHash('sha256').update(hashteile.join('\n')).digest('hex').slice(0, 8);
/* Die "saubere" Pruefsumme: nur die Wochenreihe (Kasse/Deckung je echter Woche),
   ohne die Reihenfolge, in der gleichwertige Bretter ohne Preisschild besucht
   wurden — diese Reihenfolge ist nicht Teil der Spielökonomie. Siehe Messblatt. */
const pruefsummeWochen = crypto.createHash('sha256').update(JSON.stringify(wochenReihe)).digest('hex').slice(0, 8);

const deckungen = wochenReihe.map(w => w.deckung).filter(d => typeof d === 'number' && isFinite(d));
deckungen.sort((a, b) => a - b);
const median = deckungen.length
  ? (deckungen.length % 2 ? deckungen[(deckungen.length - 1) / 2]
      : (deckungen[deckungen.length / 2 - 1] + deckungen[deckungen.length / 2]) / 2)
  : null;

/* Woche, ab der die Deckung dauerhaft < 1x bleibt (letztes Mal >=1, plus 1;
   null, wenn sie nie unter 1x faellt oder nie dauerhaft dort bleibt). */
let letztesUeber = -1;
wochenReihe.forEach((w, i) => { if (typeof w.deckung === 'number' && w.deckung >= 1) letztesUeber = i; });
const dauerhaftUnter1x = (letztesUeber + 1 < wochenReihe.length)
  ? wochenReihe[letztesUeber + 1].n
  : null;

const zusammenfassung = {
  epoche: ep, saat: SAAT, lauf: LAUF, fenster: BR + 'x' + HO,
  minuten: Math.round((Date.now() - T0) / 6000) / 10,
  aussenrunden: runde, echteWochenGesamt,
  jahrStart: wochenReihe.length ? wochenReihe[0].jahr : null,
  jahrEnde: schluss.jahr, wocheEnde: schluss.woche,
  braujahre: wochenReihe.length ? (schluss.jahr - wochenReihe[0].jahr + 1) : null,
  kasseEnde: schluss.kasse,
  endgrund, abbruch,
  letzteChronik: schluss.letzteChronik,
  deckungMedian: median, wochenMitDeckung: deckungen.length,
  ersteWocheDauerhaftUnter1x: dauerhaftUnter1x,
  klicksNav, klicksPreis, klicksWeiter, klicksNotfall,
  knoepfeUnterhalbFaltkanteGesehen: unterhalbFaltkante,
  fehler, seitenfehlerZahl: fehler.length,
  pruefsumme, pruefsummeWochen,
  tafelBeobachtungen,
  wochenReihe
};
fs.writeFileSync(`${WURZ}/protokoll/${LAUF}-ergebnis.json`, JSON.stringify(zusammenfassung, null, 1));

console.log(`E${ep} ${LAUF}: ${echteWochenGesamt} echte Wochen / ${runde} Aussenrunden `
  + `(bis ${schluss.jahr}/${schluss.woche}), Kasse ${schluss.kasse}, `
  + `Endgrund=${endgrund || '(keiner)'} Abbruch=${abbruch ? abbruch.grund : '-'}, `
  + `Deckung-Median=${median}, Pruefsumme=${pruefsumme}, Seitenfehler=${fehler.length}`);
await browser.close();
