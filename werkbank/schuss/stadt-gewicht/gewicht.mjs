/* DAS GEWICHT — was der Browser beim Laden einer Epoche WIRKLICH anfordert.
 *
 *   node werkbank/schuss/stadt-gewicht/gewicht.mjs <ziel.json> [wartesekunden]
 *   HAFEN=8899 node …
 *
 * Zwei verschiedene Zahlen, und nur die erste ist das Veto:
 *   (a) was ueber die Leitung geht — encodedBodySize je Antwort, aus der
 *       Resource-Timing-API des Browsers, plus die Antworten, die Playwright
 *       sieht (Bilder, die per new Image() geholt werden, stehen in beidem).
 *   (b) was auf der Platte liegt — `du -sh`, und das ist NICHT die Zahl.
 *
 * Gemessen wird bis 'networkidle' UND danach noch <wartesekunden>, weil das
 * Vorladen in stadt.js `aufbau` erst nach dem ersten Zeichnen anlaeuft und die
 * Nachzuegler sonst durchs Netz rutschen, ohne gezaehlt zu werden.
 *
 * Die Ausgabe zaehlt je Stueck-Ordner getrennt auf, damit die Frage
 * "wer traegt das Gewicht" nicht geraten werden muss.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8899';
const ZIEL = process.argv[2] || 'werkbank/schuss/stadt-gewicht/gewicht.json';
const RUHE = Number(process.argv[3] || 8) * 1000;
const SAAT = process.env.SAAT || '1350';

function fach(u) {
  const p = u.replace(/^https?:\/\/[^/]+/, '');
  if (/\/bild\/hof\//.test(p)) return 'bild/hof';
  if (/\/bild\/gegner\//.test(p)) return 'bild/gegner';
  if (/\/bild\/name\//.test(p)) return 'bild/name';
  if (/\/bild\/platte-/.test(p)) return 'bild/platte';
  if (/\/bild\//.test(p)) return 'bild/sonst';
  if (/\/ton\//.test(p)) return 'ton';
  if (/\.css(\?|$)/.test(p)) return 'css';
  if (/\.js(\?|$)/.test(p)) return 'js';
  return 'rest';
}

const b = await chromium.launch();
const alles = {};

for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: 1366, height: 768 } });
  const fehler = [];
  s.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
  s.on('pageerror', x => fehler.push('pageerror: ' + x.message));

  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=${SAAT}`,
               { waitUntil: 'networkidle' });
  await s.waitForTimeout(RUHE);

  /* Resource-Timing sieht ALLES, was der Browser geholt hat — auch Bilder aus
     new Image(), die nie im DOM landen. encodedBodySize ist die Zahl auf der
     Leitung (ohne Kopfzeilen); transferSize enthaelt die Kopfzeilen und ist 0
     bei einem Treffer im Zwischenspeicher. */
  const { roh, ladeEnde } = await s.evaluate(() => {
    const doc = performance.getEntriesByType('navigation')[0];
    const l = performance.getEntriesByType('resource').map(r => ({
      u: r.name,
      enc: r.encodedBodySize,
      tra: r.transferSize,
      dec: r.decodedBodySize,
      ende: r.responseEnd,
      art: r.initiatorType
    }));
    if (doc) l.push({ u: location.href, enc: doc.encodedBodySize, tra: doc.transferSize,
                      dec: doc.decodedBodySize, ende: doc.responseEnd, art: 'navigation' });
    return { roh: l, ladeEnde: doc ? doc.loadEventEnd : 0 };
  });

  const nach = {};
  let sumEnc = 0, sumTra = 0;
  for (const r of roh) {
    const f = fach(r.u);
    nach[f] = nach[f] || { n: 0, enc: 0, tra: 0 };
    nach[f].n++; nach[f].enc += r.enc; nach[f].tra += r.tra;
    sumEnc += r.enc; sumTra += r.tra;
  }

  const gross = roh.slice().sort((a, c) => c.enc - a.enc).slice(0, 12)
    .map(r => ({ datei: r.u.replace(/^https?:\/\/[^/]+\//, ''), kb: Math.round(r.enc / 1024) }));

  /* DER ERSTE AUFRUF, scharf abgegrenzt: alles, was der Browser geholt hat,
     BEVOR das 'load'-Ereignis durch war. Das ist die Zahl, um die es der
     Sperrliste geht ("bevor irgendetwas zu sehen ist"). Was danach im
     Leerlauf nachkommt, steht daneben als Gesamtzahl. */
  const bisLade = roh.filter(r => r.ende <= ladeEnde || ladeEnde === 0);
  const encLade = bisLade.reduce((s, r) => s + r.enc, 0);

  alles['e' + e] = {
    anfragen: roh.length,
    anfragen_bis_load: bisLade.length,
    encodedBodySize_bis_load: encLade,
    mb_bis_load: +(encLade / 1048576).toFixed(2),
    encodedBodySize: sumEnc,
    transferSize: sumTra,
    mb_enc: +(sumEnc / 1048576).toFixed(2),
    mb_tra: +(sumTra / 1048576).toFixed(2),
    nach_fach: Object.fromEntries(Object.entries(nach)
      .sort((a, c) => c[1].enc - a[1].enc)
      .map(([k, v]) => [k, { n: v.n, mb: +(v.enc / 1048576).toFixed(2) }])),
    groesste: gross,
    seitenfehler: fehler.length,
    fehler: fehler.slice(0, 3)
  };

  console.log(`E${e}: bis 'load' ${bisLade.length} Anfragen / ${(encLade / 1048576).toFixed(2)} MB` +
              `   —   gesamt nach ${RUHE / 1000}s: ${roh.length} Anfragen / ` +
              `${(sumEnc / 1048576).toFixed(2)} MB (encoded) · Fehler ${fehler.length}`);
  for (const [k, v] of Object.entries(alles['e' + e].nach_fach)) {
    console.log(`      ${k.padEnd(12)} ${String(v.n).padStart(3)} Dateien  ${v.mb.toFixed(2)} MB`);
  }
  await s.close();
}

await b.close();
alles.stand = new Date().toISOString();
alles.hafen = HAFEN;
alles.fenster = '1366x768';
alles.ruhe_s = RUHE / 1000;
writeFileSync(ZIEL, JSON.stringify(alles, null, 2));
console.log('geschrieben: ' + ZIEL);
const schlimm = Math.max(...[1, 2, 3, 4].map(e => alles['e' + e].encodedBodySize));
const schlimmLade = Math.max(...[1, 2, 3, 4].map(e => alles['e' + e].encodedBodySize_bis_load));
console.log(`SCHWERSTE EPOCHE bis 'load': ${(schlimmLade / 1048576).toFixed(2)} MB — Veto bei 8 MB → ` +
            (schlimmLade <= 8 * 1048576 ? 'UNTER DER GRENZE' : 'UEBER DER GRENZE'));
console.log(`SCHWERSTE EPOCHE gesamt   : ${(schlimm / 1048576).toFixed(2)} MB → ` +
            (schlimm <= 8 * 1048576 ? 'UNTER DER GRENZE' : 'UEBER DER GRENZE'));
