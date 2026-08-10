/* DIE SUCHENDE HAND — Welle 15, Stueck 2 (DER ERSTE PFENNIG).
   Neu gebaut fuer diese Welle, keine Kopie einer vorhandenen Hand.

   Waehlt ausschliesslich aus dem, was BRAUHAUS.zuege() / [data-zug] JETZT
   auf dem Bildschirm zeigt, kennt keinen Zugnamen vorher.

   Wie sie waehlt, in zwei Saetzen:
   1. Jede Aussenrunde klappt sie zuerst alle sichtbaren, freien Knoepfe OHNE
      Preisschild auf (das sind strukturell die Bretter/Reiter) — erneut, sobald
      sich deren sichtbarer Text seit dem letzten Versuch geaendert hat.
   2. Danach nimmt sie aus den sichtbaren, freien Knoepfen MIT Preisschild den
      mit dem groessten Zahlenwert zuerst (Einnahme vor Ausgabe, billige Ausgabe
      vor teurer), bis zu drei je Runde, nur wenn die Kasse eine Ausgabe deckt,
      und schliesst die Woche mit dem einen Knopf, der in jeder Epoche
      unveraendert existiert (zug:'weiter').

   Zusatz gegenueber einer reinen Einmal-Erkundung: WIEDERHOLBARE Knoepfe ohne
   Preisschild, deren Text sich NICHT aendert (z.B. "+ 1 Fass" bleibt "+ 1
   Fass", auch wenn der Wagen dadurch voller wird), werden trotzdem bis zu
   MEHRFACH_GRENZE mal je Woche versucht — sonst waere jeder Mehrfach-Knopf
   (laden, fuellen, kaufen) strukturell auf einen Klick je Woche begrenzt, nur
   weil sein Text stabil bleibt. Das ist keine Kenntnis eines Namens: die Hand
   behandelt jeden textstabilen freien Knopf gleich, unabhaengig davon, wie er
   heisst.

   HAFEN=8942 SAAT=1350 node hand-such.mjs <epoche> <lauf-name> [maxWochen] [maxMinuten]
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
import crypto from 'crypto';

const ep        = +(process.argv[2] || 1);
const LAUF      = process.argv[3] || `e${ep}-such-1`;
const MAXWOCHEN = +(process.argv[4] || 210);
const MAXMIN    = +(process.argv[5] || 14);
const HAFEN     = process.env.HAFEN || '8942';
const SAAT      = process.env.SAAT || '1350';
const BR        = +(process.env.BREITE || 1600);
const HO        = +(process.env.HOEHE || 900);
const MEHRFACH_GRENZE = +(process.env.MEHRFACH || 8);
const WURZ      = '/home/user/brewhousesim/werkbank/schuss/welle15-pfennig';
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
    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, epoche: B.welt.zeit.epoche,
      ende: !!B.welt.zeit.ende, endgrund: B.welt.zeit.endgrund || null,
      kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff, ansehen: B.welt.haus.ansehen,
      deckung,
      lage: (B.lage || []).length,
      protokollLaenge: (B.protokoll || []).length,
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
let unterhalbFaltkante = 0;

let letzteWoche = null;
let echteWochenGesamt = 0;
const wochenReihe = [];

/* Erkundung ueber die GANZE Partie gemerkt (zug -> zuletzt gesehener Text UND
   zuletzt gesehene Wochenkennung), nicht je Woche zurueckgesetzt: ein Brett,
   das schon offen ist, muss nicht jede Woche neu aufgeklappt werden. Erneut
   versucht wird ein Knopf, wenn entweder sein sichtbarer Text sich geaendert
   hat, ODER eine neue Woche begonnen hat (dann darf ein textstabiler
   Mehrfach-Knopf wieder MEHRFACH_GRENZE mal versucht werden). */
const navGesehenText = new Map();
const navVersucheDieseWoche = new Map();

function merkeWoche(snap) {
  const kennung = snap.jahr * 100 + snap.woche;
  if (kennung === letzteWoche) return;
  letzteWoche = kennung;
  echteWochenGesamt++;
  navVersucheDieseWoche.clear();
  wochenReihe.push({ n: echteWochenGesamt, jahr: snap.jahr, woche: snap.woche,
    kasse: snap.kasse, deckung: snap.deckung });
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

const ENDE_UHR = T0 + MAXMIN * 60 * 1000;
let runde = 0, abbruch = null, endgrund = null;

await foto('00-start');
{ const s0 = await schirm(); merkeWoche(s0); }

while (echteWochenGesamt < MAXWOCHEN) {
  if (Date.now() > ENDE_UHR) { abbruch = { grund: 'wanduhr-limit', minuten: MAXMIN }; break; }

  let s = await schirm();
  if (s.ende) { endgrund = s.endgrund || 'zeitgrenze-erreicht'; break; }
  runde++;

  const vorWocheGesamt = echteWochenGesamt;

  /* PHASE 1 — Erkundung: alle sichtbaren, freien Knoepfe OHNE Preisschild,
     je Aussenrunde bis zu 14 Durchgaenge, in Bildschirm-Reihenfolge. Ein
     Knopf, dessen Text sich seit dem letzten Versuch nicht geaendert hat,
     bekommt trotzdem bis zu MEHRFACH_GRENZE Versuche in dieser Woche —
     das faengt Mehrfach-Knoepfe wie "+ 1 Fass" ab, ohne einen Namen zu
     kennen: es gilt fuer JEDEN freien Knopf gleich. */
  for (let pass = 0; pass < 14; pass++) {
    s = await schirm();
    if (s.ende) break;
    for (const z of s.zuege) {
      if (z.bottom > HO || z.top < 0) unterhalbFaltkante++;
    }
    const cand = s.zuege.filter(z => {
      if (!z.hit || z.aus || z.preis !== null || z.zug === 'weiter') return false;
      const versucheBisher = navVersucheDieseWoche.get(z.zug) || 0;
      if (navGesehenText.get(z.zug) !== z.text) return true;         // neuer Text
      return versucheBisher < MEHRFACH_GRENZE;                        // textstabil, aber noch Kontingent
    });
    if (!cand.length) break;
    let bewegt = false;
    for (const c of cand) {
      navGesehenText.set(c.zug, c.text);
      navVersucheDieseWoche.set(c.zug, (navVersucheDieseWoche.get(c.zug) || 0) + 1);
      const vor = await schirm(); if (vor.ende) break;
      const el = vor.zuege.find(x => x.zug === c.zug && x.hit && !x.aus);
      if (!el) continue;
      await klick(el); klicksNav++; bewegt = true;
      const nach = await schirm();
      merkeWoche(nach);
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
    merkeWoche(nach);
    schreib({ was: 'klick-preis', zug: wahl.zug, text: wahl.text, preis: wahl.preis,
      kasseVor: s.kasse, kasseNach: nach.kasse, jahr: nach.jahr, woche: nach.woche,
      ende: nach.ende, endgrund: nach.endgrund });
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
  merkeWoche(nach);
  schreib({ was: 'runde-ende', runde, jahr: nach.jahr, woche: nach.woche, kasse: nach.kasse,
    deckung: nach.deckung, ende: nach.ende, endgrund: nach.endgrund, echteWochenGesamt });

  if (nach.ende) { endgrund = nach.endgrund || 'zeitgrenze-erreicht'; break; }

  if (echteWochenGesamt === vorWocheGesamt) {
    abbruch = { grund: 'hand-festgefahren', jahr: nach.jahr, woche: nach.woche };
    await foto('abbruch-festgefahren');
    break;
  }

  if (runde % 20 === 0) await foto(`r${runde}-w${echteWochenGesamt}`);
}

if (!endgrund && !abbruch) abbruch = { grund: 'maxWochen-erreicht', maxWochen: MAXWOCHEN };

await foto('99-schluss');
const schluss = await schirm();

const pruefsumme = crypto.createHash('sha256').update(hashteile.join('\n')).digest('hex').slice(0, 8);
const pruefsummeWochen = crypto.createHash('sha256').update(JSON.stringify(wochenReihe)).digest('hex').slice(0, 8);

const deckungen = wochenReihe.map(w => w.deckung).filter(d => typeof d === 'number' && isFinite(d));
const kassen = wochenReihe.map(w => w.kasse).filter(k => typeof k === 'number' && isFinite(k));
deckungen.sort((a, b) => a - b);
const median = deckungen.length
  ? (deckungen.length % 2 ? deckungen[(deckungen.length - 1) / 2]
      : (deckungen[deckungen.length / 2 - 1] + deckungen[deckungen.length / 2]) / 2)
  : null;
const kasseLeer = wochenReihe.filter(w => typeof w.kasse === 'number' && w.kasse <= 0).length;
const kasseHoechst = kassen.length ? Math.max(...kassen) : null;
const kasseTiefst = kassen.length ? Math.min(...kassen) : null;

const zusammenfassung = {
  epoche: ep, saat: SAAT, lauf: LAUF, fenster: BR + 'x' + HO,
  minuten: Math.round((Date.now() - T0) / 6000) / 10,
  aussenrunden: runde, echteWochenGesamt,
  jahrStart: wochenReihe.length ? wochenReihe[0].jahr : null,
  jahrEnde: schluss.jahr, wocheEnde: schluss.woche,
  braujahre: wochenReihe.length ? (schluss.jahr - wochenReihe[0].jahr + 1) : null,
  kasseStart: wochenReihe.length ? wochenReihe[0].kasse : null,
  kasseEnde: schluss.kasse,
  kasseHoechst, kasseTiefst,
  kasseLeerWochen: kasseLeer,
  kasseLeerAnteil: wochenReihe.length ? kasseLeer / wochenReihe.length : null,
  endgrund, abbruch,
  letzteChronik: (await seite.evaluate(() => {
    const c = window.BRAUHAUS.welt.chronik;
    return c && c.length ? c[c.length - 1] : null;
  })),
  deckungMedian: median, wochenMitDeckung: deckungen.length,
  klicksNav, klicksPreis, klicksWeiter, klicksNotfall,
  knoepfeUnterhalbFaltkanteGesehen: unterhalbFaltkante,
  fehler, seitenfehlerZahl: fehler.length,
  pruefsumme, pruefsummeWochen,
  wochenReihe
};
fs.writeFileSync(`${WURZ}/protokoll/${LAUF}-ergebnis.json`, JSON.stringify(zusammenfassung, null, 1));

console.log(`E${ep} ${LAUF}: ${echteWochenGesamt} echte Wochen / ${runde} Aussenrunden `
  + `(bis ${schluss.jahr}/${schluss.woche}), Kasse hoechst=${kasseHoechst} ende=${schluss.kasse}, `
  + `leer=${kasseLeer}/${wochenReihe.length} (${wochenReihe.length ? Math.round(1000*kasseLeer/wochenReihe.length)/10 : '-'}%), `
  + `Endgrund=${endgrund || '(keiner)'} Abbruch=${abbruch ? abbruch.grund : '-'}, `
  + `Deckung-Median=${median}, Pruefsumme=${pruefsumme}, Seitenfehler=${fehler.length}`);
await browser.close();
