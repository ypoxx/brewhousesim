/* BLICK — eine Frage an die laufende Seite, ohne sie zu bedienen.
   HAFEN=8921 node blick.mjs "?epoche=1" "<js-ausdruck>"                    */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const suche = process.argv[2] || '?epoche=1';
const frage = process.argv[3] || '1';
const HAFEN = process.env.HAFEN || '8921';
const BR = +(process.env.BR || 2752), HO = +(process.env.HO || 1536);

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: BR, height: HO }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 300)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 300)); });

await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/${suche}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

let out;
try { out = await seite.evaluate(`(function(){ ${frage} })()`); }
catch (e) { out = 'FEHLER: ' + String(e).slice(0, 400); }
console.log(typeof out === 'string' ? out : JSON.stringify(out, null, 1));
console.log(fehler.length ? 'FEHLER AUF DER SEITE:\n' + fehler.join('\n') : 'keine Fehler auf der Seite');
await browser.close();
