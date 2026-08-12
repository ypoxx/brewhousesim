/* DIE SUCHENDE HAND — Welle 16, Stueck 1 (DER KAEUFER).
   Neu geschrieben fuer diese Welle, keine Kopie einer vorhandenen Hand.

   Waehlt ausschliesslich aus dem, was [data-zug] JETZT auf dem Bildschirm
   zeigt (sichtbar, im Fenster, nicht verdeckt), kennt keinen Zugnamen vorher
   und keine Zahl aus dieser Welle im Voraus.

   ABLAUF JE AUSSENRUNDE (eine Aussenrunde ist nicht dasselbe wie eine
   Spielwoche — ein Klick auf 'fuhre:abschicken' oder 'weiter' kann die Woche
   weiterschalten, ein Klick auf ein Brett tut das nicht):

     1. ERKUNDEN. Jeder sichtbare, freigegebene Knopf OHNE Preisschild wird
        geklickt, wenn sein jetziger Anblick (der sichtbare Text) bei DIESEM
        Knopf noch nie vorkam. Ein Schalter mit zwei Textzustaenden (auf/zu)
        wird so zweimal probiert und dann liegengelassen; ein Zaehler, der
        weiterlaeuft, bleibt dagegen attraktiv. Bis zu ERKUNDE_RUNDEN
        Durchgaenge, danach weiter zu Schritt 2.
     2. GREIFEN. Aus den sichtbaren, freigegebenen Knoepfen MIT Preisschild
        wird der mit dem groessten Wert genommen — eine Einnahme schlaegt
        jede Ausgabe, unter den Ausgaben die billigste zuerst — sofern eine
        Ausgabe die Kasse nicht leerraeumt. Bis zu GREIF_KNOEPFE je Runde.
     3. SCHLIESSEN. Der Knopf 'weiter' schliesst die Woche. Fehlt er, wird
        ein beliebiger freigegebener Knopf gedrueckt, um nicht steckenzubleiben.

   Die Partie laeuft bis MAXWOCHEN echte Spielwochen erzaehlt sind, das Haus
   schliesst oder die Wanduhrfrist MAXMIN erreicht ist.

   Aufruf:
     HAFEN=8945 SAAT=1350 node hand.mjs <epoche> <lauf-name> [maxWochen] [maxMinuten]
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
import crypto from 'crypto';

const EPOCHE   = Number(process.argv[2] || 1);
const LAUFNAME = process.argv[3] || `e${EPOCHE}-lauf-1`;
const MAXWOCHEN = Number(process.argv[4] || 220);
const MAXMIN    = Number(process.argv[5] || 14);
const HAFEN     = process.env.HAFEN || '8945';
const SAAT      = process.env.SAAT || '1350';
const BREITE    = Number(process.env.BREITE || 1600);
const HOEHE     = Number(process.env.HOEHE || 900);

const ERKUNDE_RUNDEN = 14;
const GREIF_KNOEPFE   = 3;

const WURZEL = '/home/user/brewhousesim/werkbank/schuss/welle16-kaeufer';
const PROTOKOLL = `${WURZEL}/protokoll/${LAUFNAME}.jsonl`;
const BILDER    = `${WURZEL}/schuesse`;
fs.mkdirSync(`${WURZEL}/protokoll`, { recursive: true });
fs.mkdirSync(BILDER, { recursive: true });
fs.writeFileSync(PROTOKOLL, '');

const ZEITNULL = Date.now();
function stopUhr() { return Math.round((Date.now() - ZEITNULL) / 100) / 10; }
function notiere(o) { fs.appendFileSync(PROTOKOLL, JSON.stringify({ t: stopUhr(), ...o }) + '\n'); }

const hashKette = [];
function inHash(o) { hashKette.push(JSON.stringify(o)); }

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: BREITE, height: HOEHE }, deviceScaleFactor: 1 });
const seitenfehler = [];
seite.on('pageerror', (e) => seitenfehler.push('pageerror: ' + String(e).slice(0, 300)));
seite.on('console', (m) => { if (m.type() === 'error') seitenfehler.push('console: ' + m.text().slice(0, 300)); });

const ZIEL_URL = `http://127.0.0.1:${HAFEN}/spiel/?epoche=${EPOCHE}&saat=${SAAT}&neu=1`;
await seite.goto(ZIEL_URL, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);
notiere({ was: 'start', url: ZIEL_URL, fenster: `${BREITE}x${HOEHE}` });

async function blick() {
  return seite.evaluate(() => {
    const B = window.BRAUHAUS;
    const knoepfe = [];
    document.querySelectorAll('[data-zug]').forEach((el) => {
      const r = el.getBoundingClientRect();
      let treffer = false;
      if (r.width && r.height) {
        const mx = r.left + r.width / 2, my = r.top + r.height / 2;
        if (mx >= 0 && my >= 0 && mx <= innerWidth && my <= innerHeight) {
          const t = document.elementFromPoint(mx, my);
          treffer = !!(t && (t === el || el.contains(t)));
        }
      }
      knoepfe.push({
        zug: el.getAttribute('data-zug'),
        text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90),
        preis: el.hasAttribute('data-preis') ? Number(el.getAttribute('data-preis')) : null,
        gesperrt: !!el.disabled, treffer,
        mx: Math.round(r.left + r.width / 2), my: Math.round(r.top + r.height / 2)
      });
    });
    let deckung = null;
    try { deckung = B.welt.zugDeckung(); } catch (e) { /* kein Nenner gemeldet */ }
    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, epoche: B.welt.zeit.epoche,
      vorbei: !!B.welt.zeit.ende, ursache: B.welt.zeit.endgrund || null,
      kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff,
      deckung,
      stoerung: (B.lage || []).length,
      knoepfe
    };
  });
}

async function stille(ms) {
  await seite.waitForTimeout(Math.min(ms, 60));
  try {
    await seite.evaluate(() => new Promise((fertig) => {
      let ab = false;
      const los = () => { if (!ab) { ab = true; fertig(1); } };
      setTimeout(los, 2000);
      requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(los, 0)));
    }));
  } catch (e) { /* Seite wechselt gerade */ }
  const rest = ms - 60;
  if (rest > 0) await seite.waitForTimeout(rest);
}

async function schnappschuss(name) {
  try { await seite.screenshot({ path: `${BILDER}/${LAUFNAME}-${name}.png` }); } catch (e) { /* egal */ }
}

async function tippe(k) {
  await seite.mouse.move(k.mx - 25, k.my - 15);
  await seite.waitForTimeout(18);
  await seite.mouse.move(k.mx, k.my, { steps: 5 });
  await seite.waitForTimeout(28);
  await seite.mouse.down();
  await seite.waitForTimeout(50);
  await seite.mouse.up();
  await stille(150);
}

let klicksErkunden = 0, klicksGreifen = 0, klicksSchliessen = 0, klicksNotweg = 0;

let vorigeWoche = null;
let wochenZahl = 0;
const wochenListe = [];
function merke(s) {
  const kennung = s.jahr * 100 + s.woche;
  if (kennung === vorigeWoche) return;
  vorigeWoche = kennung;
  wochenZahl++;
  wochenListe.push({ n: wochenZahl, jahr: s.jahr, woche: s.woche, kasse: s.kasse, deckung: s.deckung });
}

/* zug -> Menge aller je bei DIESEM Knopf gesehenen Texte, ueber die ganze
   Partie hinweg gemerkt (nicht je Woche geloescht). */
const jeKnopfGesehen = new Map();

const FRIST = ZEITNULL + MAXMIN * 60 * 1000;
let aussenrunde = 0, abbruchGrund = null, endeGrund = null;

await schnappschuss('anfang');
merke(await blick());

while (wochenZahl < MAXWOCHEN) {
  if (Date.now() > FRIST) { abbruchGrund = { grund: 'wanduhr', minuten: MAXMIN }; break; }

  let s = await blick();
  if (s.vorbei) { endeGrund = s.ursache || 'ende-erreicht'; break; }
  aussenrunde++;
  const wochenVorRunde = wochenZahl;

  /* --- 1. ERKUNDEN ------------------------------------------------------ */
  for (let durchgang = 0; durchgang < ERKUNDE_RUNDEN; durchgang++) {
    s = await blick();
    if (s.vorbei) break;
    const kandidaten = s.knoepfe.filter((k) => {
      if (!k.treffer || k.gesperrt || k.preis !== null || k.zug === 'weiter') return false;
      const gesehen = jeKnopfGesehen.get(k.zug);
      return !gesehen || !gesehen.has(k.text);
    });
    if (!kandidaten.length) break;
    let etwasGetan = false;
    for (const kand of kandidaten) {
      if (!jeKnopfGesehen.has(kand.zug)) jeKnopfGesehen.set(kand.zug, new Set());
      jeKnopfGesehen.get(kand.zug).add(kand.text);
      const frisch = await blick();
      if (frisch.vorbei) break;
      const el = frisch.knoepfe.find((x) => x.zug === kand.zug && x.treffer && !x.gesperrt);
      if (!el) continue;
      await tippe(el); klicksErkunden++; etwasGetan = true;
      const danach = await blick();
      merke(danach);
      notiere({ was: 'erkunden', zug: kand.zug, text: kand.text, jahr: danach.jahr, woche: danach.woche,
        kasse: danach.kasse, vorbei: danach.vorbei, ursache: danach.ursache });
      inHash({ erkunden: kand.zug, kasse: danach.kasse });
      if (danach.vorbei) break;
    }
    if (!etwasGetan) break;
  }

  s = await blick();
  if (s.vorbei) { endeGrund = s.ursache || 'ende-erreicht'; break; }

  /* --- 2. GREIFEN -------------------------------------------------------- */
  for (let griff = 0; griff < GREIF_KNOEPFE; griff++) {
    s = await blick();
    if (s.vorbei) break;
    const bepreist = s.knoepfe.filter((k) => k.treffer && !k.gesperrt && k.preis !== null && k.zug !== 'weiter');
    const bezahlbar = bepreist.filter((k) => k.preis >= 0 || Math.abs(k.preis) <= s.kasse);
    if (!bezahlbar.length) break;
    bezahlbar.sort((a, b) => b.preis - a.preis);
    const wahl = bezahlbar[0];
    await tippe(wahl); klicksGreifen++;
    const danach = await blick();
    merke(danach);
    notiere({ was: 'greifen', zug: wahl.zug, text: wahl.text, preis: wahl.preis,
      kasseVor: s.kasse, kasseNach: danach.kasse, jahr: danach.jahr, woche: danach.woche,
      vorbei: danach.vorbei, ursache: danach.ursache });
    inHash({ greifen: wahl.zug, wert: wahl.preis, kasse: danach.kasse });
    if (danach.vorbei) { s = danach; break; }
  }

  s = await blick();
  if (s.vorbei) { endeGrund = s.ursache || 'ende-erreicht'; break; }

  /* --- 3. SCHLIESSEN ------------------------------------------------------ */
  const weiter = s.knoepfe.find((k) => k.zug === 'weiter' && k.treffer && !k.gesperrt);
  if (weiter) { await tippe(weiter); klicksSchliessen++; }
  else {
    const irgendwas = s.knoepfe.find((k) => k.treffer && !k.gesperrt);
    if (irgendwas) { await tippe(irgendwas); klicksNotweg++; }
  }

  const danach = await blick();
  merke(danach);
  notiere({ was: 'rundenende', aussenrunde, jahr: danach.jahr, woche: danach.woche, kasse: danach.kasse,
    deckung: danach.deckung, vorbei: danach.vorbei, ursache: danach.ursache, wochenZahl });

  if (danach.vorbei) { endeGrund = danach.ursache || 'ende-erreicht'; break; }

  if (wochenZahl === wochenVorRunde) {
    abbruchGrund = { grund: 'hand-haengt-fest', jahr: danach.jahr, woche: danach.woche };
    await schnappschuss('festgefahren');
    break;
  }

  if (aussenrunde % 20 === 0) await schnappschuss(`r${aussenrunde}-w${wochenZahl}`);
}

if (!endeGrund && !abbruchGrund) abbruchGrund = { grund: 'maxwochen-erreicht', maxWochen: MAXWOCHEN };

await schnappschuss('ende');
const schluss = await blick();

const pruefsumme = crypto.createHash('sha256').update(hashKette.join('\n')).digest('hex').slice(0, 8);
const pruefsummeWochen = crypto.createHash('sha256').update(JSON.stringify(wochenListe)).digest('hex').slice(0, 8);

const deckungReihe = wochenListe.map((w) => w.deckung).filter((d) => typeof d === 'number' && isFinite(d));
const kassenReihe = wochenListe.map((w) => w.kasse).filter((k) => typeof k === 'number' && isFinite(k));
deckungReihe.sort((a, b) => a - b);
const deckungMedian = deckungReihe.length
  ? (deckungReihe.length % 2
      ? deckungReihe[(deckungReihe.length - 1) / 2]
      : (deckungReihe[deckungReihe.length / 2 - 1] + deckungReihe[deckungReihe.length / 2]) / 2)
  : null;
const kasseLeerWochen = wochenListe.filter((w) => typeof w.kasse === 'number' && w.kasse <= 0).length;
const kasseHoechst = kassenReihe.length ? Math.max(...kassenReihe) : null;
const kasseTiefst = kassenReihe.length ? Math.min(...kassenReihe) : null;

const bericht = {
  epoche: EPOCHE, saat: SAAT, lauf: LAUFNAME, fenster: `${BREITE}x${HOEHE}`,
  minuten: Math.round((Date.now() - ZEITNULL) / 6000) / 10,
  aussenrunden: aussenrunde, wochenZahl,
  jahrStart: wochenListe.length ? wochenListe[0].jahr : null,
  jahrEnde: schluss.jahr, wocheEnde: schluss.woche,
  braujahre: wochenListe.length ? (schluss.jahr - wochenListe[0].jahr + 1) : null,
  kasseStart: wochenListe.length ? wochenListe[0].kasse : null,
  kasseEnde: schluss.kasse,
  kasseHoechst, kasseTiefst,
  kasseLeerWochen, kasseLeerAnteil: wochenListe.length ? kasseLeerWochen / wochenListe.length : null,
  endeGrund, abbruchGrund,
  deckungMedian, wochenMitDeckung: deckungReihe.length,
  klicksErkunden, klicksGreifen, klicksSchliessen, klicksNotweg,
  seitenfehler, seitenfehlerZahl: seitenfehler.length,
  pruefsumme, pruefsummeWochen,
  wochenListe
};
fs.writeFileSync(`${WURZEL}/protokoll/${LAUFNAME}-ergebnis.json`, JSON.stringify(bericht, null, 1));

console.log(`E${EPOCHE} ${LAUFNAME}: ${wochenZahl} echte Wochen / ${aussenrunde} Aussenrunden `
  + `(bis ${schluss.jahr}/${schluss.woche}), Kasse hoechst=${kasseHoechst} ende=${schluss.kasse}, `
  + `leer=${kasseLeerWochen}/${wochenListe.length} `
  + `(${wochenListe.length ? Math.round(1000 * kasseLeerWochen / wochenListe.length) / 10 : '-'}%), `
  + `Deckung-Median=${deckungMedian}, Ende=${endeGrund || '(keins)'} Abbruch=${abbruchGrund ? abbruchGrund.grund : '-'}, `
  + `Pruefsumme=${pruefsumme}, Seitenfehler=${seitenfehler.length}`);
await browser.close();
