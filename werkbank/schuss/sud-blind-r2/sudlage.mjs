/* DER SUD, blind, Runde 2 — DIE KLEMME und DIE PREISSCHILDER, Woche fuer Woche.

   HAFEN=8901 node werkbank/schuss/sud-blind-r2/sudlage.mjs <epoche> <wochen> <ziel.json>
   Zusaetzlich: BRETT=auf|zu   (Vorgabe auf: das Sudbrett wird aufgeschlagen
                                und offen gehalten, so wie ein Spieler es tut)
                BREITE/HOEHE   (Vorgabe 1366x768 — der Schirm der Latte 4)

   WAS GEMESSEN WIRD, je Woche:
     * DIE KLEMME: das Sudbrett steht im Bild (kein `stadt-zugeklappt`, also
       kein clip-path, Mitte von elementFromPoint getroffen) und trotzdem ist
       KEIN einziger seiner Knoepfe bedienbar. Zusaetzlich die Aufschluesselung
       nach `data-aus-grund` und die Zahl der Knoepfe mit `data-soll-aus="0"`,
       also derer, die das Spiel ausdruecklich erlaubt.
     * DIE PREISSCHILDER: alle `[data-zug^="sud:"][data-preis]`, die zugleich
       SICHTBAR (Rechteck > 0), AKTIV (nicht disabled) und ERREICHBAR
       (elementFromPoint trifft sie) sind. Gezaehlt wird je Woche, wie viele
       davon NEBENEINANDER stehen und ob sie einander ausschliessen (gleiche
       Achse) oder nicht.
     * die Reiterprobe: wenn das Brett zufaellt, wie viele Reiterklicks
       braucht es, bis es wieder offen UND bedienbar ist.

   Der Klickapparat ist wortgleich der aus rueckkopplung-r3/linie.mjs
   (BEHARR + RUHE) — sonst faellt unter Last ein Klick aus und die Partie ist
   eine andere.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 400);
const ZIEL = process.argv[4] || `werkbank/schuss/sud-blind-r2/lage-e${ep}.json`;
const HAFEN = process.env.HAFEN || '8901';
const SAAT = process.env.SAAT || '1350';
const BRETT = process.env.BRETT || 'auf';
const BREITE = +(process.env.BREITE || 1366), HOEHE = +(process.env.HOEHE || 768);
const WARTE = +(process.env.WARTE || 1);
const BEHARR = +(process.env.BEHARR || 6);

const browser = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
const seite = await browser.newPage({ viewport: { width: BREITE, height: HOEHE }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });

async function ruhe(ms) {
  await seite.waitForTimeout(Math.min(ms, 40));
  try {
    await seite.evaluate(() => new Promise((f) => {
      let ab = false;
      const fertig = () => { if (!ab) { ab = true; f(1); } };
      setTimeout(fertig, 2000);
      requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(fertig, 0)));
    }));
  } catch (e) {}
}

await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

async function lage(zug) {
  return await seite.evaluate((z) => {
    const el = document.querySelector(`[data-zug="${z}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return { sichtbar: false, aus: !!el.disabled, hit: false };
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const t = (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight)
      ? document.elementFromPoint(cx, cy) : null;
    return { sichtbar: true, aus: !!el.disabled, hit: !!(t && (t === el || el.contains(t))), x: cx, y: cy };
  }, zug);
}

const reiterListe = () => seite.evaluate(() =>
  [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e => e.getAttribute('data-zug')));

async function klick(zug, warte = 60) {
  let l = null;
  for (let v = 0; v < BEHARR; v++) {
    l = await lage(zug);
    if (!l || !l.sichtbar) { if (v + 1 < BEHARR) await ruhe(60); continue; }
    if (l.aus) return false;
    if (l.hit) break;
    for (const r of await reiterListe()) {
      const rl = await lage(r);
      if (!rl || !rl.sichtbar || rl.aus || !rl.hit) continue;
      await seite.mouse.click(rl.x, rl.y);
      await ruhe(90 * WARTE);
      l = await lage(zug);
      if (l && l.hit) break;
    }
    if (l && l.hit) break;
    if (v + 1 < BEHARR) await ruhe(60);
  }
  if (!l || !l.sichtbar || l.aus || !l.hit) return false;
  await seite.mouse.click(l.x, l.y);
  await ruhe(warte * WARTE);
  return true;
}

/* ---------------------------------------------------------------- Ablesung */

async function sudLage() {
  return await seite.evaluate(() => {
    const B = window.BRAUHAUS;
    const trifft = (el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return { sicht: false, hit: false, r: null };
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) return { sicht: true, hit: false, r };
      const t = document.elementFromPoint(cx, cy);
      return { sicht: true, hit: !!(t && (t === el || el.contains(t))), r };
    };

    const fach = document.getElementById('fach-hand-sud');
    const brett = fach ? fach.firstElementChild : null;
    const zettel = document.querySelector('.sud-zettel');

    function brettBild(el) {
      if (!el) return null;
      const zu = el.classList.contains('stadt-zugeklappt');
      const t = trifft(el);
      /* clip-path: inset(50%) laesst das Rechteck stehen, malt aber nichts.
         Also zusaetzlich der wirkliche Malbefund. */
      const cs = getComputedStyle(el);
      const geclippt = /inset\(\s*50%/.test(cs.clipPath || '') || cs.clipPath === 'inset(50%)';
      return { klasseZu: zu, geclippt, sicht: t.sicht, hit: t.hit,
               breite: t.r ? Math.round(t.r.width) : 0, hoehe: t.r ? Math.round(t.r.height) : 0,
               anzeige: cs.display, sichtbarkeit: cs.visibility, deck: +cs.opacity };
    }

    function knoepfe(wurzel) {
      if (!wurzel) return [];
      return [...wurzel.querySelectorAll('button[data-zug]')].map(el => {
        const t = trifft(el);
        return { zug: el.getAttribute('data-zug'),
                 preis: el.hasAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
                 fass: el.getAttribute('data-preis-art') === 'fass'
                   ? +el.getAttribute('data-preis-menge') : null,
                 aus: !!el.disabled,
                 sollAus: el.getAttribute('data-soll-aus'),
                 verdeckt: el.getAttribute('data-verdeckt'),
                 grund: el.getAttribute('data-aus-grund'),
                 sicht: t.sicht, hit: t.hit,
                 w: t.r ? Math.round(t.r.width) : 0, h: t.r ? Math.round(t.r.height) : 0,
                 text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 50) };
      });
    }

    /* ALLE sud-Zuege am ganzen Schirm, egal in welchem Kasten. */
    const alleSud = [...document.querySelectorAll('button[data-zug^="sud:"]')].map(el => {
      const t = trifft(el);
      return { zug: el.getAttribute('data-zug'),
               preis: el.hasAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
               fass: el.getAttribute('data-preis-art') === 'fass'
                 ? +el.getAttribute('data-preis-menge') : null,
               aus: !!el.disabled, sollAus: el.getAttribute('data-soll-aus'),
               grund: el.getAttribute('data-aus-grund'),
               sicht: t.sicht, hit: t.hit,
               text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 50) };
    });

    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
      kasse: B.welt.haus.kasse, lage: B.lage.length,
      brett: brettBild(brett),
      brettKnoepfe: knoepfe(brett),
      zettelDa: !!zettel,
      zettel: zettel ? brettBild(zettel) : null,
      zettelKnoepfe: knoepfe(zettel),
      alleSud
    };
  });
}

/* Ist das Sudbrett offen? (Klasse weg = aufgeschlagen) */
async function brettOffen() {
  return await seite.evaluate(() => {
    const f = document.getElementById('fach-hand-sud');
    const b = f ? f.firstElementChild : null;
    return b ? !b.classList.contains('stadt-zugeklappt') : null;
  });
}

const SUDREITER = 'stadt:reiter:sud-sud-brett';

/* Reiterprobe: wie viele Klicks bis das Brett offen UND bedienbar ist? */
async function schlageAuf(hoechstens = 4) {
  const bericht = { klicks: 0, offenNach: null, bedienbarNach: null };
  for (let i = 1; i <= hoechstens; i++) {
    const l = await lage(SUDREITER);
    if (!l || !l.sichtbar || l.aus || !l.hit) return bericht;
    await seite.mouse.click(l.x, l.y);
    bericht.klicks = i;
    await ruhe(80 * WARTE);
    const s = await sudLage();
    const offen = s.brett && !s.brett.klasseZu;
    const bed = s.brettKnoepfe.some(k => !k.aus && k.hit);
    if (offen && bericht.offenNach === null) bericht.offenNach = i;
    if (offen && bed) { bericht.bedienbarNach = i; return bericht; }
    /* Wenn schon offen aber unbedienbar: NICHT nochmal klicken (das klappte
       frueher wieder zu) — stattdessen kurz warten und nochmal sehen. */
    if (offen && !bed) {
      await seite.waitForTimeout(600);
      const s2 = await sudLage();
      if (s2.brettKnoepfe.some(k => !k.aus && k.hit)) { bericht.bedienbarNach = i; return bericht; }
    }
  }
  return bericht;
}

/* -------------------------------------------------------------------- Lauf */

const reihe = [];
const reiterproben = [];

if (BRETT === 'auf') {
  const p = await schlageAuf(4);
  reiterproben.push({ woche: 0, ...p });
}

let abgebrochen = false;
for (let w = 0; w < WOCHEN; w++) {
  const s = await sudLage();
  s.w = w;
  reihe.push(s);
  if (s.ende) { abgebrochen = false; break; }

  /* Brett offen halten — und dabei zaehlen, was das kostet. */
  if (BRETT === 'auf') {
    const offen = await brettOffen();
    if (offen === false) {
      const p = await schlageAuf(4);
      reiterproben.push({ woche: w, ...p });
    }
  }

  const ok = await klick('weiter', 70);
  if (!ok) {
    /* Weiter nicht getroffen — Reiter aufraeumen und noch einmal. */
    const ok2 = await klick('weiter', 90);
    if (!ok2) { abgebrochen = true; break; }
  }
}

/* ------------------------------------------------------------- Auswertung */

function auswerten() {
  let klemme = 0, klemmeSollAus0 = 0, brettImBild = 0;
  const gruende = {};
  const preisWochen = { n0: 0, n1: 0, n2: 0, n3plus: 0 };
  let maxPreis = 0;
  const preisSaetze = {};
  const preisZuege = {};

  reihe.forEach(s => {
    if (s.brett && !s.brett.klasseZu && s.brett.hit) {
      brettImBild++;
      const bedienbar = s.brettKnoepfe.filter(k => !k.aus && k.hit).length;
      if (s.brettKnoepfe.length > 0 && bedienbar === 0) {
        klemme++;
        klemmeSollAus0 += s.brettKnoepfe.filter(k => k.aus && k.sollAus === '0').length;
      }
    }
    s.brettKnoepfe.concat(s.zettelKnoepfe).forEach(k => {
      if (k.aus && k.grund) gruende[k.grund] = (gruende[k.grund] || 0) + 1;
    });
    /* Preisschild = MUENZE. Was in BIER kostet (`data-preis-art="fass"`)
       wird getrennt gezaehlt und nie dazugerechnet — sonst waere die Zahl
       nicht mehr die der Messlatte. */
    const p = s.alleSud.filter(k => k.preis !== null && !k.aus && k.sicht && k.hit);
    const pf = s.alleSud.filter(k => (k.preis !== null || k.fass) && !k.aus && k.sicht && k.hit);
    if (pf.length >= 2) preisWochen.mitFass2plus = (preisWochen.mitFass2plus || 0) + 1;
    const n = p.length;
    if (n === 0) preisWochen.n0++;
    else if (n === 1) preisWochen.n1++;
    else if (n === 2) preisWochen.n2++;
    else preisWochen.n3plus++;
    if (n > maxPreis) maxPreis = n;
    const satz = p.map(x => x.zug).sort().join(' + ');
    if (n >= 1) preisSaetze[satz] = (preisSaetze[satz] || 0) + 1;
    p.forEach(x => { preisZuege[x.zug] = (preisZuege[x.zug] || 0) + 1; });
  });

  return {
    wochen: reihe.length,
    jahre: reihe.length ? (reihe[reihe.length - 1].jahr - reihe[0].jahr + 1) : 0,
    brettImBild, klemme, klemmeSollAus0,
    klemmeAnteil: brettImBild ? +(klemme / brettImBild).toFixed(3) : null,
    gruende,
    preisWochen,
    wochenMitZweiPlus: preisWochen.n2 + preisWochen.n3plus,
    maxPreisSchilder: maxPreis,
    preisSaetze, preisZuege
  };
}

/* Nur eine gedraengte Reihe in die Datei — die volle Ablesung waere ein paar
   Megabyte je Epoche, und das gehoert nicht in die Historie. Jede Woche, in
   der die Klemme steht, wird VOLLSTAENDIG mitgeschrieben; sonst die Zahlen. */
const klemmeWochen = [];
const kurz = reihe.map(s => {
  const bed = s.brettKnoepfe.filter(k => !k.aus && k.hit).length;
  const offen = !!(s.brett && !s.brett.klasseZu && s.brett.hit);
  const klemme = offen && s.brettKnoepfe.length > 0 && bed === 0;
  const p = s.alleSud.filter(k => k.preis !== null && !k.aus && k.sicht && k.hit);
  const pf = s.alleSud.filter(k => (k.preis !== null || k.fass) && !k.aus && k.sicht && k.hit);
  if (klemme) klemmeWochen.push(s);
  return { w: s.w, jahr: s.jahr, woche: s.woche, kasse: s.kasse, lage: s.lage,
    brettOffen: offen, brettZu: !!(s.brett && s.brett.klasseZu),
    knoepfe: s.brettKnoepfe.length, bedienbar: bed, klemme,
    sollAus0UndAus: s.brettKnoepfe.filter(k => k.aus && k.sollAus === '0').length,
    muenzschilder: p.length, muenzUndBier: pf.length,
    schilder: p.map(x => x.zug) };
});

const erg = {
  epoche: ep, hafen: HAFEN, saat: SAAT, brett: BRETT, fenster: `${BREITE}x${HOEHE}`,
  abgebrochen, fehler,
  reiterproben,
  auswertung: auswerten(),
  klemmeWochen: klemmeWochen.slice(0, 20),
  reihe: kurz
};

fs.mkdirSync(ZIEL.replace(/\/[^/]+$/, ''), { recursive: true });
fs.writeFileSync(ZIEL, JSON.stringify(erg, null, 1));
const a = erg.auswertung;
console.log(`e${ep} ${BRETT} ${BREITE}x${HOEHE}: ${a.wochen} Wochen, ${a.jahre} Jahre`);
console.log(`  Brett im Bild: ${a.brettImBild}  KLEMME: ${a.klemme} (${a.klemmeAnteil})  soll-aus=0 dabei: ${a.klemmeSollAus0}`);
console.log(`  Preisschilder je Woche: 0=${a.preisWochen.n0} 1=${a.preisWochen.n1} 2=${a.preisWochen.n2} 3+=${a.preisWochen.n3plus}  max ${a.maxPreisSchilder}`);
console.log(`  Wochen mit >=2: ${a.wochenMitZweiPlus}`);
console.log(`  Gruende:`, JSON.stringify(a.gruende));
console.log(`  Reiterproben:`, JSON.stringify(erg.reiterproben.slice(0, 6)));
console.log(`  Seitenfehler: ${fehler.length}${abgebrochen ? '  ABGEBROCHEN' : ''}`);
await browser.close();
