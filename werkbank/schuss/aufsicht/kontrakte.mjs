/* DIE KONTRAKTE DER AUFSICHT.
 *
 *   node werkbank/schuss/aufsicht/kontrakte.mjs        # Arbeitsbaum auf 8899
 *   HAFEN=8900 node werkbank/schuss/aufsicht/kontrakte.mjs
 *
 * T0.6. Vier Stellen im Spiel sind NICHT ueber eine Schnittstelle gekoppelt,
 * sondern ueber einen Text oder eine CSS-Klasse, die ein Stueck schreibt und
 * ein anderes errät. Aendert die Formulierung sich, bricht die Mechanik —
 * lautlos, ohne Fehler in der Konsole, ohne dass eine Kennzahl es meldet.
 * Diese Datei spielt jeden der vier Faelle im laufenden Spiel nach und prueft,
 * ob die Kopplung TRAEGT. Fundstellen mit Datei und Zeile stehen in
 * werkbank/urteile/t0-6-kontrakte.md.
 *
 *   1. AUFGELD NACH LIEFERUNG   spiel/stuecke/name.js:500-559 (liest)
 *                                spiel/stuecke/fuhre.js:1848-1852, kern/welt.js:274-278 (schreibt)
 *   2. ERBE-AM_HAUS-WORTLISTE   spiel/stuecke/erbe.js:204 + erbe-daten.js:55 (liest)
 *                                spiel/stuecke/gegner.js (binde/loeseAb/zuvorkommen/mitbieten) (schreibt)
 *   3. STADT-RAHMENSCHLUESSEL   spiel/stuecke/sud.js:2271-2282 (liest, hartkodiert 'sud|'+'sud-brett')
 *                                spiel/stuecke/stadt.js:572-579 (baut den Schluessel), sud.js:1594 (Klassenname)
 *   4. GEGNER LIEST .pr-griff   spiel/stuecke/gegner.js:339-363 (liest)
 *                                spiel/stuecke/preis.js:3103 (schreibt die Klasse)
 *
 * DREI AUSGAENGE, NICHT ZWEI. "nicht messbar" heisst: die Vorbedingung liess
 * sich im gegebenen Zeitbudget nicht herstellen (z.B. kein Hausgeschaeft des
 * GEGNERS bezahlbar) — das ist KEIN Beleg fuer einen Bruch und wird nie als
 * "gerissen" gezaehlt. Diese Trennung ist in diesem Projekt teuer gelernt
 * worden (siehe STAND.md, "gerissen" vs. Messluecke).
 *
 * WARUM node.click() UND NICHT Playwright-Koordinatenklicks: mehrere Bretter
 * dieses Spiels liegen beim Laden zugeklappt (clip-path) oder liegen unter
 * einem fremden Band/Griff — ein Koordinatenklick trifft dann das Bild
 * dahinter, nicht den Knopf. Das ist derselbe Kniff wie in
 * werkbank/schuss/aufsicht/mitbieten.mjs (dort: `e.click()` im evaluate()).
 * Fuer eine Bedienbarkeitspruefung waere das der falsche Weg — hier geht es
 * nur darum, einen bekannten Spielzustand zuverlaessig zu erreichen, um die
 * KOPPLUNG zu pruefen, nicht die Erreichbarkeit des Knopfes selbst.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = process.env.HAFEN || '8899';
const SAAT = process.env.SAAT || '1350';
const VIEWPORT = { width: 1600, height: 1000 };

async function neueSeite(b, epoche) {
  const s = await b.newPage({ viewport: VIEWPORT });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${epoche}&saat=${SAAT}&neu=1`,
               { waitUntil: 'networkidle' });
  await s.waitForTimeout(1200);
  return s;
}

/* Klickt einen data-zug direkt am Knoten (siehe Kopfkommentar). true, wenn
   ein aktiver Knopf gefunden und geklickt wurde. */
async function klick(s, zug) {
  const el = await s.$(`[data-zug="${zug}"]:not([disabled])`).catch(() => null);
  if (!el) return false;
  await el.evaluate((n) => n.click());
  return true;
}

/* Klickt den ersten Treffer eines Selektors, gibt seinen data-zug zurueck
   (oder null). */
async function ersterKlick(s, selektor) {
  const el = await s.$(selektor).catch(() => null);
  if (!el) return null;
  const zug = await el.evaluate((n) => n.getAttribute('data-zug'));
  await el.evaluate((n) => n.click());
  return zug;
}

/* --------------------------------------------------------------------------
   KONTRAKT 1 — AUFGELD NACH LIEFERUNG.
   Beide Bretter DER FUHRE (Haeuser, Wagen) zuerst oeffnen — sonst liegen die
   Knoepfe unter dem Rahmen der STADT und ein Klick trifft ins Leere, auch
   wenn er als "erfolgreich" durchgeht. Eine Sorte anschlagen, so viele
   Haeuser wie moeglich beladen (mehrere Adressen, damit die Rechnung auch in
   fruehen Epochen mit kleinem Wagen nicht auf 0 rundet), abschicken. Danach
   muss im Protokoll ein Eintrag stehen, dessen Text mit "Aufgeld" beginnt —
   das ist der Text, den DER NAME selbst schreibt (name.js:509), NACHDEM er
   per Regex erkannt hat, dass eine Lieferung stattfand.
   -------------------------------------------------------------------------- */
async function kontraktAufgeld(s) {
  await klick(s, 'stadt:reiter:fuhre-fu-brett-fu-haeuser'); await s.waitForTimeout(200);
  await klick(s, 'stadt:reiter:fuhre-fu-brett-fu-wagen'); await s.waitForTimeout(200);
  await ersterKlick(s, '[data-zug^="fuhre:tafel-auf:"]:not([disabled])');
  await s.waitForTimeout(200);

  const adressen = ['lindenhof', 'ochse', 'torschenke', 'pfarrhof', 'muehlwirt', 'brueckenwirt'];
  for (const a of adressen) {
    for (let i = 0; i < 15; i++) {
      const ok = await klick(s, 'fuhre:laden:' + a);
      if (!ok) break;
    }
  }
  const abgeschickt = await klick(s, 'fuhre:abschicken');
  await s.waitForTimeout(500);
  if (!abgeschickt) return 'nicht messbar';   /* kein Fass zu laden — Vorbedingung nicht erreicht */

  const aufgeld = await s.evaluate(() => (BRAUHAUS.protokoll || [])
    .some((p) => p && typeof p.was === 'string' && p.was.indexOf('Aufgeld') === 0));
  return aufgeld ? 'bestanden' : 'gerissen';
}

/* --------------------------------------------------------------------------
   KONTRAKT 2 — ERBE-AM_HAUS-WORTLISTE.
   DER GEGNER bindet Adressen ans Haus (zuvorkommen/abloesen/abwehren) und
   uebergibt dabei einen Text (`m.womit`, aus gegner-daten.js) als Grund der
   Bindung. DAS ERBE entscheidet allein an diesem Text (AM_HAUS-Regex), ob die
   Adresse als "am Haus" zaehlt oder als "an der Person". Sobald eine solche
   Bindung wirklich zustandekommt (kein "nicht bezahlbar"), muss
   BRAUHAUS.erbe.stand().amHaus laenger werden.
   Nicht jedes Bindungsmittel traegt ein Wort aus der Liste (z.B.
   "Gevatterschaft" nicht, "Bannrecht" schon) — darum wird bis zu 50 Wochen
   und mehrere erfolgreiche Bindungen lang versucht, bevor "gerissen" gilt.
   Gelingt in der Zeit KEINE einzige Bindung (zu wenig Kasse, kein Angebot),
   ist das Ergebnis "nicht messbar", nicht "gerissen".
   -------------------------------------------------------------------------- */
async function kontraktAmHaus(s) {
  const hatAPI = await s.evaluate(() => !!(window.BRAUHAUS && BRAUHAUS.erbe && BRAUHAUS.erbe.stand));
  if (!hatAPI) return 'nicht messbar';

  const basis = await s.evaluate(() => BRAUHAUS.erbe.stand().amHaus.length);
  let erfolge = 0;
  const bindungsKnopf = '[data-zug^="gegner:zuvorkommen"]:not([disabled]), '
    + '[data-zug^="gegner:abloesen"]:not([disabled]), '
    + '[data-zug^="gegner:abwehren"]:not([disabled])';

  for (let w = 0; w < 50; w++) {
    const el = await s.$(bindungsKnopf).catch(() => null);
    if (el) {
      const vorLaenge = await s.evaluate(() => BRAUHAUS.protokoll.length);
      await el.evaluate((n) => n.click());
      await s.waitForTimeout(60);
      const text = await s.evaluate((v) => BRAUHAUS.protokoll.slice(v).map((p) => p && p.was).join(' | '),
                                     vorLaenge);
      if (text && text.trim() !== '' && text.indexOf('nicht bezahlbar') === -1) {
        erfolge++;
        const jetzt = await s.evaluate(() => BRAUHAUS.erbe.stand().amHaus.length);
        if (jetzt > basis) return 'bestanden';
      }
    }
    const weiter = await s.$('[data-zug="weiter"]:not([disabled])').catch(() => null);
    if (!weiter) break;
    await weiter.evaluate((n) => n.click());
    await s.waitForTimeout(30);
  }
  return erfolge > 0 ? 'gerissen' : 'nicht messbar';
}

/* --------------------------------------------------------------------------
   KONTRAKT 3 — STADT-RAHMENSCHLUESSEL.
   DIE STADT fuehrt Buch, welches Brett offen liegt, unter einem Schluessel,
   den sie selbst aus dem Stueck-Namen und der CSS-Klasse des Bretts baut
   (stadt.js:572-579, `wer + '|' + klassen`) und ueber
   BRAUHAUS.stadt.rahmen.lage() herausgibt. DER SUD liest genau diesen
   Schluessel zurueck, aber HARTKODIERT (sud.js:2271-2282): er sucht nach
   einem Eintrag, der mit "sud|" beginnt und "sud-brett" enthaelt — dem Namen
   seines eigenen Bretts. Kein Spielzug noetig: das Brett liegt vom Start an
   im DOM, der Schluessel muss also nach dem ersten Bildaufbau schon stehen.
   -------------------------------------------------------------------------- */
async function kontraktRahmenschluessel(s) {
  const hatAPI = await s.evaluate(() =>
    !!(window.BRAUHAUS && BRAUHAUS.stadt && BRAUHAUS.stadt.rahmen && BRAUHAUS.stadt.rahmen.lage));
  if (!hatAPI) return 'nicht messbar';

  const treffer = await s.evaluate(() => {
    const l = BRAUHAUS.stadt.rahmen.lage();
    return Object.keys(l).some((k) => k.indexOf('sud|') === 0 && k.indexOf('sud-brett') > 0);
  });
  return treffer ? 'bestanden' : 'gerissen';
}

/* --------------------------------------------------------------------------
   KONTRAKT 4 — GEGNER LIEST .pr-griff.
   DER GEGNER weicht beim Platzieren seiner Karten dem "Griff" DES PREISES
   aus — einem fremden DOM-Element, das er ausschliesslich ueber die CSS-
   Klasse `.pr-griff` erkennt (gegner.js:339-363), nicht ueber eine
   Schnittstelle. Gemessen und ueber BRAUHAUS.gegner.zonen().griffe
   herausgegeben. Auch hier reicht das Laden: der Griff steht, sobald die
   Michaelitafel DES PREISES zu ist (Normalzustand), von der ersten Sekunde
   an im Bild, und GEGNER misst ihn in seinen ersten zwoelf Bildaufbauten.
   -------------------------------------------------------------------------- */
async function kontraktPrGriff(s) {
  const hatAPI = await s.evaluate(() => !!(window.BRAUHAUS && BRAUHAUS.gegner && BRAUHAUS.gegner.zonen));
  if (!hatAPI) return 'nicht messbar';

  const anzahl = await s.evaluate(() => BRAUHAUS.gegner.zonen().griffe.length);
  return anzahl > 0 ? 'bestanden' : 'gerissen';
}

/* --------------------------------------------------------------------------
   LAUF UEBER ALLE VIER EPOCHEN.
   -------------------------------------------------------------------------- */
const KONTRAKTE = [
  { kurz: 'Aufgeld nach Lieferung', lauf: kontraktAufgeld },
  { kurz: 'ERBE AM_HAUS-Wortliste', lauf: kontraktAmHaus },
  { kurz: 'STADT-Rahmenschluessel', lauf: kontraktRahmenschluessel },
  { kurz: 'GEGNER liest .pr-griff', lauf: kontraktPrGriff }
];

const b = await chromium.launch();
const ergebnisse = [];   /* [{kontrakt, epoche, ergebnis}] */

for (const k of KONTRAKTE) {
  for (const e of [1, 2, 3, 4]) {
    const s = await neueSeite(b, e);
    const fehler = [];
    s.on('pageerror', (x) => fehler.push(String(x.message || x).slice(0, 140)));
    let ergebnis;
    try {
      ergebnis = await k.lauf(s);
    } catch (err) {
      ergebnis = 'nicht messbar';
      fehler.push('Ausnahme: ' + String(err.message || err).slice(0, 140));
    }
    if (fehler.length && ergebnis !== 'nicht messbar') {
      /* Ein Seitenfehler waehrend des Laufs macht das Ergebnis unglaubwuerdig,
         egal was herauskam — lieber ehrlich "nicht messbar" als ein falsches
         Gruen oder Rot. */
      ergebnis = 'nicht messbar';
      fehler.unshift('Seitenfehler waehrend des Kontrakts');
    }
    ergebnisse.push({ kontrakt: k.kurz, epoche: e, ergebnis, fehler });
    await s.close();
  }
}
await b.close();

/* --------------------------------------------------------------------------
   DIE TABELLE — deutsch, kurz, kein JSON.
   -------------------------------------------------------------------------- */
const breite = Math.max(...KONTRAKTE.map((k) => k.kurz.length));
console.log('KONTRAKTE DER AUFSICHT — Hafen ' + HAFEN + ', Saat ' + SAAT);
console.log('');
for (const k of KONTRAKTE) {
  const zeile = ergebnisse.filter((x) => x.kontrakt === k.kurz);
  const zellen = zeile.map((x) => {
    const wort = x.ergebnis === 'bestanden' ? 'bestanden   '
               : x.ergebnis === 'gerissen'  ? 'GERISSEN    '
               :                              'nicht messb.';
    return 'E' + x.epoche + ':' + wort;
  }).join(' ');
  console.log(k.kurz.padEnd(breite) + '  ' + zellen);
  zeile.forEach((x) => x.fehler.forEach((f) => console.log('    E' + x.epoche + ' ! ' + f)));
}

const bestanden = ergebnisse.filter((x) => x.ergebnis === 'bestanden').length;
const gerissen = ergebnisse.filter((x) => x.ergebnis === 'gerissen').length;
const nichtMessbar = ergebnisse.filter((x) => x.ergebnis === 'nicht messbar').length;
console.log('');
console.log(`${bestanden} bestanden, ${gerissen} gerissen, ${nichtMessbar} nicht messbar `
  + `(von ${ergebnisse.length}).`);
console.log(bestanden === ergebnisse.length
  ? 'ALLE KONTRAKTE BESTANDEN'
  : 'NICHT ALLE KONTRAKTE BESTANDEN — kein Exit 0.');

process.exit(bestanden === ergebnisse.length ? 0 : 1);
