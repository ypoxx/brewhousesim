// KANN MAN ES SPIELEN? — mit der Maus, nicht mit der Konsole.
//
// Jeder Zug ist ein echter Mausklick auf den sichtbaren Knopf (page.click),
// kein el.click() und kein Aufruf ins Spiel hinein. Was verdeckt liegt oder
// zu klein ist, scheitert hier genau so, wie es beim Menschen scheitert.
//
// Gespielt wird nach einer schlichten, menschlichen Regel:
//   1. Wenn ein Bauhof-Knopf bezahlbar ist und noch nicht gebaut wurde, bauen.
//   2. Sonst einen bezahlbaren Zug eines anderen Bretts nehmen, im Wechsel.
//   3. Sonst WEITER.
// Protokolliert wird, was der Bildschirm zeigt: Kasse, Woche, Jahr, Zahl der
// bedienbaren Knoepfe, was geklickt wurde und ob der Klick angekommen ist.
//
//   HAFEN=8903 EPOCHE=1 WOCHEN=90 node …/spielen.mjs <ziel.json>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const HAFEN = process.env.HAFEN || '8903';
const EPOCHE = +(process.env.EPOCHE || 1);
const WOCHEN = +(process.env.WOCHEN || 90);
const BREITE = +(process.env.BREITE || 1366), HOEHE = +(process.env.HOEHE || 768);
const ziel = process.argv[2] || `werkbank/schuss/stadt-blind-w7/spiel-e${EPOCHE}.json`;

const b = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
const s = await b.newPage({ viewport: { width: BREITE, height: HOEHE } });
const fehler = [];
s.on('pageerror', (e) => fehler.push('pageerror: ' + e));
s.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EPOCHE}&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(1500);

const lage = () => s.evaluate(() => ({
  kasse: BRAUHAUS.welt.haus.kasse,
  jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
  epoche: BRAUHAUS.welt.zeit.epoche,
  bauten: document.querySelectorAll('img.stadt-haus').length,
  chronik: BRAUHAUS.welt.chronik.length,
  lagefehler: (BRAUHAUS.lage || []).length,
}));

/* Alles, was JETZT mit der Maus zu treffen ist: nicht disabled, sichtbar,
   und die Mitte gehoert wirklich diesem Knopf. */
const zuege = () => s.evaluate(() => {
  const raus = [];
  for (const el of document.querySelectorAll('button[data-zug]')) {
    if (el.disabled) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
    const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    const treffbar = !!(t && (t === el || el.contains(t) || el.contains(t.parentElement)));
    const preis = el.querySelector('.preis');
    raus.push({ zug: el.dataset.zug, text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 46),
      preis: preis ? preis.textContent.trim() : '', treffbar,
      w: Math.round(r.width), h: Math.round(r.height) });
  }
  return raus;
});

const buch = [];
let gebaut = 0, geklickt = 0, danebengegangen = 0, gescheitert = 0;
const gesehen = new Set();
let zuletzt = '';
const bauversuche = new Set();

for (let w = 0; w < WOCHEN; w++) {
  const z = await zuege();
  z.forEach((x) => gesehen.add(x.zug));
  const vorher = await lage();

  /* Ein vorsichtiger Spieler: er baut nur, was hoechstens die Haelfte der
     Kasse kostet, und er nimmt nie zweimal hintereinander denselben Zug. */
  const kostet = (x) => { const m = (x.preis || '').replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
    const n = Math.abs(parseFloat(m)); return isFinite(n) ? n : 0; };
  let wahl = z.find((x) => x.zug.startsWith('stadt:bau:') && x.treffbar && !bauversuche.has(x.zug)
    && kostet(x) > 0 && kostet(x) <= vorher.kasse * (process.env.SPARSAM === '0' ? 1 : 0.5));
  let art = 'bau';
  if (!wahl) {
    // sonst reihum ein Zug eines anderen Bretts mit Preisschild, den es sich leistet
    const andere = z.filter((x) => x.treffbar && x.preis && !x.zug.startsWith('stadt:reiter')
      && x.zug !== 'weiter' && !x.zug.startsWith('stadt:alles')
      && kostet(x) <= vorher.kasse * 0.5 && x.zug !== zuletzt);
    if (andere.length && w % 2 === 1) { wahl = andere[(w * 7) % andere.length]; art = 'zug'; }
  }
  if (!wahl) { wahl = z.find((x) => x.zug === 'weiter'); art = 'weiter'; }
  if (!wahl) { buch.push({ w, fehler: 'KEIN ZUG ERREICHBAR', zahl: z.length }); break; }

  if (art === 'bau') bauversuche.add(wahl.zug);
  zuletzt = wahl.zug;
  let ok = true;
  try { await s.click(`button[data-zug="${wahl.zug}"]`, { timeout: 4000 }); }
  catch (e) { ok = false; gescheitert++; }
  await s.waitForTimeout(art === 'weiter' ? 260 : 200);
  const nachher = await lage();
  geklickt++;
  const bewegt = nachher.kasse !== vorher.kasse || nachher.woche !== vorher.woche
    || nachher.bauten !== vorher.bauten || nachher.chronik !== vorher.chronik;
  if (ok && !bewegt && art !== 'bau') danebengegangen++;
  if (nachher.bauten > vorher.bauten) gebaut++;
  buch.push({ w, art, zug: wahl.zug, text: wahl.text, preis: wahl.preis, ok, bewegt,
    kasse: nachher.kasse, jahr: nachher.jahr, woche: nachher.woche, epoche: nachher.epoche,
    bauten: nachher.bauten, erreichbar: z.length, treffbar: z.filter((x) => x.treffbar).length });
  if (nachher.lagefehler) { buch.push({ w, fehler: 'BRAUHAUS.lage ' + nachher.lagefehler }); break; }
}

const letzte = buch.filter((x) => x.jahr).slice(-1)[0] || {};
const erg = {
  epoche: EPOCHE, fenster: [BREITE, HOEHE], schritte: buch.length,
  klicks: geklickt, gescheiterte_klicks: gescheitert, folgenlose_klicks: danebengegangen,
  gebaut, verschiedene_zuege_gesehen: gesehen.size, letzte,
  epochenwechsel: [...new Set(buch.filter((x) => x.epoche).map((x) => x.epoche))],
  seitenfehler: fehler.slice(0, 12), buch,
};
fs.writeFileSync(ziel, JSON.stringify(erg, null, 1));
console.log(`E${EPOCHE}: ${buch.length} Schritte · ${geklickt} Klicks · ${gescheitert} gescheitert · ` +
  `${danebengegangen} folgenlos · ${gebaut} Bauten entstanden · ${gesehen.size} verschiedene Zuege · ` +
  `Ende ${letzte.jahr}/${letzte.woche}, Kasse ${letzte.kasse} · Seitenfehler ${fehler.length}`);
await b.close();
