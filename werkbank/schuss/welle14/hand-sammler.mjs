/* DIE SAMMELHAND — Welle 14, Frage F (Instrumentierung, NICHT die Frage-A-Hand).

   Diese Hand unterliegt NICHT der Auflage "keine Liste, die man vorher kennt"
   — die gilt laut WELLE-14.md nur fuer die suchende Linie aus Frage A. Hier
   geht es um etwas anderes: eine kassenkraeftige, die volle Partie
   durchhaltende Linie bauen, um F1 (Preislage je Michaelitafel) und F3
   (Nutzen einer Festlegung, mit/ohne, sonst gleich) ueberhaupt messen zu
   koennen. Sie kennt darum bewusst ein paar Stueck-Verben (aus dem
   Quelltext gelesen, nicht geraten) und haelt sich von den beiden
   Partie-beendenden Antraegen ('fuhre:ausgang:*', 'fuhre:uebergabe:*')
   fern, ausser wenn FESTLEGE es ausdruecklich verlangt.

   Verhalten:
   - Erkundung wie in hand-suchend.mjs (alle Boards oeffnen).
   - Bezahlbare Knoepfe: bis zu 6 je Runde, aber NUR wenn |preis| <= 0,8 *
     Kasse (kein Alles-auf-eine-Karte) — und OHNE 'preis:festlege:*',
     'fuhre:ausgang:*', 'fuhre:uebergabe:*' anzufassen (siehe FESTLEGE unten).
   - FESTLEGE=<teilstring> : sobald zum ersten Mal eine bezahlbare Karte
     'preis:festlege:*' mit diesem Teilstring im Zug-Namen auftaucht, wird
     GENAU SIE genommen (einmalig) — fuer den F3-Vergleich mit/ohne.
     FESTLEGE=keine (Vorgabe) nimmt nie eine Festlegung.
   - Jede Michaelitafel wird geloggt (Preise aller Karten + Kasse), wie in
     hand-suchend.mjs.

   HAFEN=8936 SAAT=1350 FESTLEGE=keine node hand-sammler.mjs <epoche> <lauf-name> [maxWochen] [maxMinuten]
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
import crypto from 'crypto';

const ep        = +(process.argv[2] || 1);
const LAUF      = process.argv[3] || `e${ep}-sammel-1`;
const MAXWOCHEN = +(process.argv[4] || 430);
const MAXMIN    = +(process.argv[5] || 30);
const HAFEN     = process.env.HAFEN || '8936';
const SAAT      = process.env.SAAT || '1350';
const BR        = +(process.env.BREITE || 1600);
const HO        = +(process.env.HOEHE || 900);
const FESTLEGE  = process.env.FESTLEGE || 'keine';
const WURZ      = '/home/user/brewhousesim/werkbank/schuss/welle14';
const PROT      = `${WURZ}/protokoll/${LAUF}.jsonl`;
const SCHUSS    = `${WURZ}/schuesse`;
fs.mkdirSync(`${WURZ}/protokoll`, { recursive: true });
fs.mkdirSync(SCHUSS, { recursive: true });
fs.writeFileSync(PROT, '');

const T0 = Date.now();
const sek = () => Math.round((Date.now() - T0) / 100) / 10;
function schreib(o) { fs.appendFileSync(PROT, JSON.stringify({ t: sek(), ...o }) + '\n'); }

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: BR, height: HO }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 300)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 300)); });

const URL = `http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}&neu=1`;
await seite.goto(URL, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

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
    let deckung = null; try { deckung = B.welt.zugDeckung(); } catch (e) {}
    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche,
      ende: !!B.welt.zeit.ende, endgrund: B.welt.zeit.endgrund || null,
      kasse: B.welt.haus.kasse, deckung,
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
async function foto(name) { try { await seite.screenshot({ path: `${SCHUSS}/${LAUF}-${name}.png` }); } catch (e) {} }
async function klick(el) {
  await seite.mouse.move(el.x - 30, el.y - 20); await seite.waitForTimeout(20);
  await seite.mouse.move(el.x, el.y, { steps: 5 }); await seite.waitForTimeout(30);
  await seite.mouse.down(); await seite.waitForTimeout(55); await seite.mouse.up();
  await ruhe(150);
}

let klicksNav = 0, klicksPreis = 0, klicksWeiter = 0;
let letzteWoche = null, echteWochenGesamt = 0;
const wochenReihe = [];
const tafelJahreGesehen = new Set();
const tafelBeobachtungen = [];
let festlegungGenommen = null;
const navGesehen = new Map();   // zug -> zuletzt gesehener Text; erneut nur bei Aenderung

function merkeWoche(snap) {
  const kennung = snap.jahr * 100 + snap.woche;
  if (kennung === letzteWoche) return;
  letzteWoche = kennung; echteWochenGesamt++;
  wochenReihe.push({ n: echteWochenGesamt, jahr: snap.jahr, woche: snap.woche,
    kasse: snap.kasse, deckung: snap.deckung });
}
function merkeTafel(snap) {
  const fest = snap.zuege.filter(z => /^preis:festlege:/.test(z.zug || ''));
  if (!fest.length) return;
  if (tafelJahreGesehen.has(snap.jahr)) return;
  tafelJahreGesehen.add(snap.jahr);
  const kosten = fest.filter(z => z.preis !== null && z.preis < 0).map(z => -z.preis);
  tafelBeobachtungen.push({
    jahr: snap.jahr, woche: snap.woche, kasse: snap.kasse, anzahl: fest.length,
    billigsteKosten: kosten.length ? Math.min(...kosten) : null,
    kasseDurchBilligste: kosten.length ? snap.kasse / Math.min(...kosten) : null,
    karten: fest.map(z => ({ zug: z.zug, text: z.text, preis: z.preis, aus: z.aus }))
  });
}

const NIEMALS_AUTO = /^(preis:festlege:|fuhre:ausgang:|fuhre:uebergabe:)/;

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

  /* Erkundung */
  const triedThisPass = new Set();
  for (let pass = 0; pass < 10; pass++) {
    s = await schirm(); if (s.ende) break;
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
      await klick(el); klicksNav++; bewegt = true;
      const nach = await schirm(); merkeWoche(nach); merkeTafel(nach);
      if (nach.ende) break;
    }
    if (!bewegt) break;
  }
  s = await schirm(); if (s.ende) { endgrund = s.endgrund || 'zeitgrenze-erreicht'; break; }

  /* F3: die eine verlangte Festlegung greifen, sobald sie auftaucht */
  if (FESTLEGE !== 'keine' && !festlegungGenommen) {
    const ziel = s.zuege.find(z => z.hit && !z.aus && z.zug
      && z.zug.startsWith('preis:festlege:') && z.zug.includes(FESTLEGE)
      && z.preis !== null && (z.preis >= 0 || Math.abs(z.preis) <= s.kasse));
    if (ziel) {
      await klick(ziel); klicksPreis++;
      festlegungGenommen = { zug: ziel.zug, text: ziel.text, preis: ziel.preis,
        jahr: s.jahr, woche: s.woche, kasse: s.kasse };
      schreib({ was: 'festlegung-genommen', ...festlegungGenommen });
      const nach = await schirm(); merkeWoche(nach); merkeTafel(nach);
    }
  }

  /* Bezahlbare Knoepfe, bis zu sechs, nie mehr als 80% der Kasse auf einmal,
     nie 'festlege'/'ausgang'/'uebergabe' automatisch. */
  for (let k = 0; k < 6; k++) {
    s = await schirm(); if (s.ende) break;
    const priced = s.zuege.filter(z => z.hit && !z.aus && z.preis !== null && z.zug !== 'weiter'
      && !NIEMALS_AUTO.test(z.zug || ''));
    const geht = priced.filter(z => z.preis >= 0 || Math.abs(z.preis) <= s.kasse * 0.8);
    if (!geht.length) break;
    geht.sort((a, b) => b.preis - a.preis);
    const wahl = geht[0];
    await klick(wahl); klicksPreis++;
    const nach = await schirm(); merkeWoche(nach); merkeTafel(nach);
    schreib({ was: 'klick-preis', zug: wahl.zug, preis: wahl.preis, kasseNach: nach.kasse,
      jahr: nach.jahr, woche: nach.woche });
    if (nach.ende) { s = nach; break; }
  }
  s = await schirm(); if (s.ende) { endgrund = s.endgrund || 'zeitgrenze-erreicht'; break; }

  const w = s.zuege.find(z => z.zug === 'weiter' && z.hit && !z.aus);
  if (w) { await klick(w); klicksWeiter++; }

  const nach = await schirm(); merkeWoche(nach); merkeTafel(nach);
  if (nach.ende) { endgrund = nach.endgrund || 'zeitgrenze-erreicht'; break; }
  if (echteWochenGesamt === vorWocheGesamt) {
    abbruch = { grund: 'hand-festgefahren', jahr: nach.jahr, woche: nach.woche };
    await foto('abbruch-festgefahren'); break;
  }
  if (runde % 20 === 0) { schreib({ was: 'zwischenstand', runde, echteWochenGesamt, kasse: nach.kasse }); await foto(`r${runde}`); }
}
if (!endgrund && !abbruch) abbruch = { grund: 'maxWochen-erreicht', maxWochen: MAXWOCHEN };
await foto('99-schluss');
const schluss = await schirm();

const zusammenfassung = {
  epoche: ep, saat: SAAT, lauf: LAUF, festlegeGesucht: FESTLEGE,
  minuten: Math.round((Date.now() - T0) / 6000) / 10,
  aussenrunden: runde, echteWochenGesamt,
  jahrStart: wochenReihe.length ? wochenReihe[0].jahr : null,
  jahrEnde: schluss.jahr, wocheEnde: schluss.woche,
  braujahre: wochenReihe.length ? (schluss.jahr - wochenReihe[0].jahr + 1) : null,
  kasseEnde: schluss.kasse, endgrund, abbruch,
  festlegungGenommen,
  klicksNav, klicksPreis, klicksWeiter,
  fehler, seitenfehlerZahl: fehler.length,
  tafelBeobachtungen, wochenReihe
};
fs.writeFileSync(`${WURZ}/protokoll/${LAUF}-ergebnis.json`, JSON.stringify(zusammenfassung, null, 1));
console.log(`E${ep} ${LAUF} (FESTLEGE=${FESTLEGE}): ${echteWochenGesamt} echte Wochen (bis ${schluss.jahr}/${schluss.woche}), `
  + `Kasse ${schluss.kasse}, Endgrund=${endgrund || '(keiner)'} Abbruch=${abbruch ? abbruch.grund : '-'}, `
  + `Festlegung=${festlegungGenommen ? festlegungGenommen.zug : '-'}, Seitenfehler=${fehler.length}`);
await browser.close();
