// Nimmt eine laufende Seite auf, damit ein Kritiker echte Pixel sieht statt einer
// Beschreibung. Das ist die Bedingung, unter der ein Gauntlet Loop ueberhaupt
// funktioniert: der Kritiker darf nie eine Zusammenfassung des Builders bewerten.
//
//   node werkbank/schuss.mjs <url> <ziel.png> [breite] [hoehe] [wartems]
//
// Beispiel:
//   npx http-server -p 8899 -s . &
//   node werkbank/schuss.mjs http://127.0.0.1:8899/spiel/ werkbank/schuss/stadt-1884-r3.png 2752 1536
//
// Die Vorgabe 2752x1536 ist bewusst die Groesse der Zielbilder unter zielbild/ —
// ein Blindvergleich taugt nur, wenn beide Bilder dasselbe Format haben.
//
// Gibt JS-Fehler der Seite auf stdout aus. Eine Seite, die beim Laden wirft, hat
// die Runde schon verloren, bevor jemand hinsieht.

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const [url, ziel, breite = '2752', hoehe = '1536', wartems = '900'] = process.argv.slice(2);

if (!url || !ziel) {
  console.error('Aufruf: node werkbank/schuss.mjs <url> <ziel.png> [breite] [hoehe] [wartems]');
  process.exit(1);
}

const browser = await chromium.launch();
const seite = await browser.newPage({
  viewport: { width: +breite, height: +hoehe },
  deviceScaleFactor: 1,
});

const fehler = [];
seite.on('pageerror', (e) => fehler.push('pageerror: ' + e));
seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
seite.on('requestfailed', (r) => fehler.push('request: ' + r.url() + ' — ' + r.failure()?.errorText));

/* `neu=1` seit dem 8. August (T0.5): ein Schuss zeigt, was ein frischer
   Aufruf zeigt, nicht was ein liegengebliebener Spielstand daraus macht.
   NUR fuer Spieladressen und nur, wenn der Rufer nichts anderes verlangt —
   wer ausdruecklich `neu=` mitgibt, behaelt seine Wahl. */
const adr = (/\/spiel\//.test(url) && !/[?&]neu=/.test(url))
  ? url + (url.includes('?') ? '&' : '?') + 'neu=1'
  : url;
await seite.goto(adr, { waitUntil: 'networkidle', timeout: 60000 });
await seite.waitForTimeout(+wartems);
await seite.screenshot({ path: ziel });
await browser.close();

console.log(ziel);
console.log(fehler.length ? 'FEHLER AUF DER SEITE:\n' + fehler.join('\n') : 'keine Fehler auf der Seite');
