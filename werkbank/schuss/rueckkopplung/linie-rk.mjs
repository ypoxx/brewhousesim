/* DIE RUECKKOPPLUNG — MESSGERAET DES BLINDEN KRITIKERS.
   node linie-rk.mjs <epoche> <wochen> <ausgabe.json> [lauf]

   Eigenes Geraet, neben werkbank/schuss/eichung/preis-linie.mjs gestellt und
   nicht an dessen Stelle (ZUSTAENDIGKEIT 16 — am Messgeraet anderer wird nicht
   gedreht). Zwei Unterschiede, die den Ausschlag geben:

     1. HAFEN 8900. preis-linie.mjs zeigt fest auf 8899 (Zeile mit seite.goto),
        wo gerade zwei Builder schreiben. Eine Zahl von dort steht auf einem
        wandernden Ziel.
     2. Es wird NICHT NUR die LEITER abgelesen (ein Wert je Jahr, im Bild
        festgehalten), sondern ZUSAETZLICH JEDE WOCHE die Kopfzeile .deckung
        mitsamt Zugschluessel, Art und Preis des genannten Zuges. Damit laesst
        sich pruefen, ob der Nenner der Kennzahl ueberhaupt etwas misst, das
        im Spiel umkaempft ist — oder einen billigen Dauerposten.

   Die spielende Hand ist die der Eichung nachgebaut: Sudplan nach Michaeli,
   Rohstoff bevor er ausgeht, Zahlungsziel einmal im Jahr, die Knappheit der
   Epoche einloesen wenn sie sich traegt, zu Michaeli nur nehmen was die Kasse
   handlungsfaehig laesst. Jeder Zug geht als echter Mausklick auf einen Knopf,
   der am Bildschirm steht und sich selbst trifft.

   GEMESSEN WIRD VOR DEM RUNDGANG: die Kopfzeile wird am Anfang der Woche
   gelesen, bevor dieser Automat irgendein Brett aufschlaegt. Wer erst alle
   Bretter aufklappt und dann liest, misst seinen eigenen Rundgang.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 400);
const ZIEL = process.argv[4] || `/tmp/linie-rk-e${ep}.json`;
const LAUF = process.argv[5] || 'A';
const HAFEN = 8900, SAAT = 1350;

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });

await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(900);

/* ---------------------------------------------------------------- Handgriffe */

async function lage(zug) {
  return await seite.evaluate((z) => {
    const el = document.querySelector(`[data-zug="${z}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return { sichtbar: false, aus: !!el.disabled, hit: false };
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const t = (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight)
      ? document.elementFromPoint(cx, cy) : null;
    return { sichtbar: true, aus: !!el.disabled, hit: !!(t && (t === el || el.contains(t))),
             x: cx, y: cy, preis: el.getAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
             text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60) };
  }, zug);
}

const reiterListe = () => seite.evaluate(() =>
  [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e => e.getAttribute('data-zug')));

async function klick(zug, warte = 60) {
  let l = await lage(zug);
  if (!l || !l.sichtbar || l.aus) return false;
  if (!l.hit) {
    for (const r of await reiterListe()) {
      const rl = await lage(r);
      if (!rl || !rl.sichtbar || rl.aus || !rl.hit) continue;
      await seite.mouse.click(rl.x, rl.y);
      await seite.waitForTimeout(90);
      l = await lage(zug);
      if (l && l.hit) break;
    }
  }
  if (!l || !l.sichtbar || l.aus || !l.hit) return false;
  await seite.mouse.click(l.x, l.y);
  await seite.waitForTimeout(warte);
  return true;
}

/* Ein Blick auf den ganzen Schirm. Fasst nichts an. */
async function schirm() {
  return await seite.evaluate(() => {
    const B = window.BRAUHAUS;
    const zuege = [];
    document.querySelectorAll('[data-zug]').forEach(el => {
      const r = el.getBoundingClientRect();
      const sichtbar = !!(r.width && r.height);
      let hit = false;
      if (sichtbar && r.left + r.width / 2 >= 0 && r.top + r.height / 2 >= 0
          && r.left + r.width / 2 <= innerWidth && r.top + r.height / 2 <= innerHeight) {
        const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        hit = !!(t && (t === el || el.contains(t)));
      }
      zuege.push({ zug: el.getAttribute('data-zug'),
        preis: el.getAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
        aus: !!el.disabled, sichtbar, hit });
    });
    const kopf = document.querySelector('.deckung');
    const nz = B.welt.naechsterZug;
    const chronik = B.welt.chronik || [];
    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
      amt: B.welt.zeit.amtszeit ? B.welt.zeit.amtszeit.nr : null,
      kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff,
      faesser: B.welt.vorrat.faesser.length, plaetze: B.welt.vorrat.plaetze,
      lage: B.lage.length,
      /* --- die Kopfzeile, so wie sie dasteht --- */
      kopfText: kopf ? kopf.textContent : null,
      kopfDeckung: kopf ? parseFloat(kopf.getAttribute('data-deckung')) : null,
      nzWas: nz ? nz.was : null, nzPreis: nz ? nz.preis : null,
      nzArt: nz ? nz.art : null, nzZug: nz ? nz.zug : null, nzRang: nz ? nz.rang : null,
      /* --- Spalte (b): unwiderrufliche Festlegungen in der Chronik --- */
      festlegungen: chronik.filter(c => c && c.art === 'festlegung').length,
      chronikGesamt: chronik.length,
      /* --- Spalte (c): Zuege des Gegners, die ohne Hand geschehen --- */
      gegnerZuege: B.protokoll.filter(p => p.wer === 'gegner').length,
      protokollGesamt: B.protokoll.length,
      zuege
    };
  });
}

/* DIE LEITER am Bildschirm — was das Spiel selbst je Jahr aufschreibt.
   Spalte 0 Jahr, 1 Kasse, 2 Preis des naechsten Zuges, 3 KENNZAHL,
   4 eigene Tafel, 5 deren Verhaeltnis (preis.js leiterFeld). */
async function leiter() {
  return await seite.evaluate(() => {
    const z = [...document.querySelectorAll('.pr-leiter .pr-leiter-zeile')];
    return z.filter(r => !r.classList.contains('pr-leiter-kopf'))
            .map(r => [...r.children].map(c => c.textContent.trim()));
  });
}

const alle = (s, muster) => s.zuege.filter(z => muster.test(z.zug) && !z.aus);

/* --------------------------------------------------- DIE HAND, WOCHE FUER WOCHE */

const reihe = [], jahre = [], zugSchluessel = {}, nennerZaehler = {}, nennerArt = {};
let abgebrochen = null, zielGesetzt = 0, festGesetzt = 0;

for (let i = 0; i < WOCHEN; i++) {
  let s = await schirm();
  if (s.ende) { abgebrochen = { grund: 'Haus zu', i, stand: s.jahr + '/' + s.woche }; break; }

  /* ============ GEMESSEN WIRD HIER, VOR JEDEM EIGENEN HANDGRIFF ============ */
  const preisZuege = s.zuege.filter(z => z.preis !== null && z.preis !== 0);
  const aktivErreichbar = preisZuege.filter(z => !z.aus && z.hit);
  s.zuege.forEach(z => { zugSchluessel[z.zug] = (zugSchluessel[z.zug] || 0) + 1; });
  const nk = s.nzZug || ('(ohne Schluessel) ' + s.nzArt + ' ' + String(s.nzWas).slice(0, 28));
  nennerZaehler[nk] = (nennerZaehler[nk] || 0) + 1;
  nennerArt[s.nzArt] = (nennerArt[s.nzArt] || 0) + 1;
  reihe.push({ n: i, jahr: s.jahr, woche: s.woche, amt: s.amt, kasse: s.kasse,
    rohstoff: s.rohstoff, faesser: s.faesser, plaetze: s.plaetze, lage: s.lage,
    deckung: s.kopfDeckung, nzWas: s.nzWas, nzPreis: s.nzPreis, nzArt: s.nzArt,
    nzZug: s.nzZug, nzRang: s.nzRang, kopfText: s.kopfText,
    aPreisAktivErreichbar: aktivErreichbar.length,
    aPreisAktiv: preisZuege.filter(z => !z.aus).length,
    aListe: aktivErreichbar.map(z => [z.zug, z.preis]),
    bFestlegungen: s.festlegungen, cGegnerZuege: s.gegnerZuege });
  /* ======================================================================== */

  if (s.woche === 1) {
    if (await seite.evaluate(() => !!document.querySelector('.fu-sommerblatt'))) {
      if (!(await klick('fuhre:jahresplan:grut', 80))) await klick('fuhre:jahresplan:duenn', 80);
      await klick('fuhre:sommer-zu', 160);
    }

    const griff = await lage('preis:tafel');
    if (griff && !/schließen/.test(griff.text || '')) await klick('preis:tafel', 220);
    let m = await schirm();

    const feste = alle(m, /^preis:festlege:/).filter(z => z.preis && Math.abs(z.preis) <= m.kasse * 0.45);
    if (feste.length) {
      const b = feste.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
      if (await klick(b.zug, 220)) { festGesetzt++; m = await schirm(); }
    }

    const ang = alle(m, /^preis:nimm:/).filter(z => z.preis);
    if (ang.length) {
      const b = ang.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
      const p = Math.abs(b.preis);
      if (m.kasse - p >= 2 * p) { await klick(b.zug, 220); m = await schirm(); }
    }

    jahre.push({ jahr: s.jahr, amt: s.amt, kasseMichaeli: m.kasse,
                 kopfVorTafel: s.kopfDeckung, nzVorTafel: s.nzWas, nzZugVorTafel: s.nzZug,
                 kopfNachTafel: m.kopfDeckung, nzNachTafel: m.nzWas, nzZugNachTafel: m.nzZug,
                 festAmSchirm: alle(m, /^preis:festlege:/).length,
                 angebotAktiv: alle(m, /^preis:nimm:/).length,
                 leiter: await leiter() });

    const g2 = await lage('preis:tafel');
    if (g2 && /schließen/.test(g2.text || '')) await klick('preis:tafel', 200);

    if (await klick('fuhre:ziel:bar', 80)) zielGesetzt++;

    for (let n = 0; n < 6; n++) {
      const st = await schirm();
      if (st.plaetze && st.faesser / st.plaetze > 0.6) break;
      const auf = alle(st, /^fuhre:tafel-auf:/).filter(z => !z.preis || Math.abs(z.preis) === 0);
      if (!auf.length) break;
      if (!(await klick(auf[Math.min(1, auf.length - 1)].zug, 60))) break;
    }
  }

  s = await schirm();

  if (s.plaetze && s.faesser / s.plaetze > 0.95) {
    const ab = alle(s, /^fuhre:tafel-ab:/);
    if (ab.length) await klick(ab[ab.length - 1].zug, 60);
  }

  const kaufRoh = s.zuege.find(z => z.zug === 'fuhre:kauf:rohstoff' && !z.aus);
  if (kaufRoh && kaufRoh.preis && s.rohstoff < 40
      && s.kasse >= 3 * Math.abs(kaufRoh.preis)) await klick('fuhre:kauf:rohstoff', 70);

  s = await schirm();
  const eng = alle(s, /^fuhre:(bann|listen|pfand):/).filter(z => z.preis);
  if (eng.length) {
    const b = eng.reduce((a, z) => (Math.abs(z.preis) < Math.abs(a.preis) ? z : a));
    if (s.kasse - Math.abs(b.preis) >= 4 * Math.abs(b.preis)) await klick(b.zug, 90);
  }

  if (!(await klick('fuhre:wie-vorige', 60))) await klick('fuhre:fuellen', 60);
  await klick('fuhre:abschicken', 120);

  const vorher = s.jahr * 100 + s.woche;
  let nach = await schirm();
  if (nach.jahr * 100 + nach.woche === vorher) {
    if (!(await klick('weiter', 120))) {
      abgebrochen = { grund: 'WEITER nicht anzufassen', i, stand: s.jahr + '/' + s.woche, kasse: s.kasse };
      break;
    }
    nach = await schirm();
    if (nach.jahr * 100 + nach.woche === vorher) {
      abgebrochen = { grund: 'kein Zug veraendert die Woche', i, stand: s.jahr + '/' + s.woche, kasse: s.kasse };
      break;
    }
  }
}

const schluss = await schirm();
const kassen = reihe.map(r => r.kasse);

/* DIE LEITER: je Jahr eine Zeile, entdoppelt (das Blatt zeigt sie zweimal). */
const leiterZeilen = [];
jahre.forEach(j => (j.leiter || []).forEach(z => {
  const v = parseFloat(String(z[3]).replace(/\./g, '').replace(',', '.'));
  if (!isNaN(v) && !leiterZeilen.some(e => e.jahr === z[0]))
    leiterZeilen.push({ jahr: z[0], kasse: z[1], zugPreis: z[2], mal: v, eigenTafel: z[4], eigenMal: z[5] });
}));

fs.writeFileSync(ZIEL, JSON.stringify({
  epoche: ep, lauf: LAUF, hafen: HAFEN, saat: SAAT,
  wochen: reihe.length, fehler, abgebrochen, zielGesetzt, festGesetzt,
  kasseMin: Math.min(...kassen), kasseMax: Math.max(...kassen),
  leiter: leiterZeilen,
  nennerZaehler, nennerArt,
  zugSchluessel: Object.keys(zugSchluessel).sort(),
  schluss: { jahr: schluss.jahr, woche: schluss.woche, kasse: schluss.kasse, lage: schluss.lage,
             festlegungen: schluss.festlegungen, gegnerZuege: schluss.gegnerZuege,
             protokollGesamt: schluss.protokollGesamt },
  jahre, reihe
}, null, 1));

const mal = leiterZeilen.map(e => e.mal);
console.log(`E${ep}/${LAUF}: ${reihe.length} Wochen (${reihe[0] && reihe[0].jahr}-${schluss.jahr}), `
  + `Kasse ${Math.min(...kassen)}-${Math.max(...kassen)}, `
  + `LEITER ${mal.length ? mal[0].toFixed(2) + ' -> ' + mal[mal.length - 1].toFixed(2) : '-'} `
  + `ueber ${leiterZeilen.length} Jahre, Festlegungen ${schluss.festlegungen}, `
  + `Gegnerzuege ${schluss.gegnerZuege}, Seitenfehler ${fehler.length}`, abgebrochen || '');
await browser.close();
