// werkbank/sud-schuss.mjs — nimmt das Sudhaus-Brett AUFGESCHLAGEN auf.
//   node werkbank/sud-schuss.mjs <epoche> <ziel.png> [wochen] [verfahren]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const [epoche = '1', ziel = '/tmp/sud.png', wochen = '0', verfahren = ''] = process.argv.slice(2);
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 2752, height: 1536 } });
const fehler = [];
seite.on('pageerror', (e) => fehler.push('pageerror: ' + e));
seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });

await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${epoche}&saat=7`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(800);

if (verfahren) {
  for (const zug of verfahren.split(',')) {
    const k = await seite.$(`button[data-zug="${zug}"]`);
    if (k) { await k.click(); await seite.waitForTimeout(150); }
    else console.log('  Zug nicht gefunden:', zug);
  }
}
for (let w = 0; w < +wochen; w++) {
  const weiter = await seite.$('button[data-zug="weiter"]');
  if (!weiter) break;
  try { await weiter.click({ timeout: 3000 }); } catch { break; }
}
await seite.waitForTimeout(300);
const zumachen = await seite.$('button[data-zug="stadt:alles-zuklappen"]');
if (zumachen) { await zumachen.click(); await seite.waitForTimeout(250); }
const reiter = await seite.$('button[data-zug="stadt:reiter:sud-sud-brett"]');
if (reiter) { await reiter.click(); await seite.waitForTimeout(500); }
await seite.screenshot({ path: ziel });

console.log(ziel);
console.log(JSON.stringify(await seite.evaluate(() => {
  const Z = window.BRAUHAUS.SUD_ZUSTAND, W = window.BRAUHAUS.welt;
  return {
    jahr: W.zeit.jahr, woche: W.zeit.woche,
    verfahren: window.BRAUHAUS.sud.verfahren(),
    guete: Math.round(Z.guete),
    bottiche: Z.bottiche.map((b) => b.sorte + ' ' + b.fass + 'F reif@' + b.reifAb),
    gaer: window.BRAUHAUS.sud.gaerkeller.belegt() + '/' + window.BRAUHAUS.sud.gaerkeller.plaetze(),
    lager: W.vorrat.faesser.length,
    haltbarkeiten: [...new Set(W.vorrat.faesser.map((f) => (f.sorte || '?') + ':' + f.haltbar))],
    sude: Z.gesamtSude, fass: Z.gesamtFass,
    ueberlauf: document.querySelector('.sud-rolle')
      ? document.querySelector('.sud-rolle').scrollHeight - document.querySelector('.sud-rolle').clientHeight
      : null
  };
})));
console.log(fehler.length ? 'FEHLER: ' + fehler.join(' | ') : 'keine Fehler auf der Seite');
await browser.close();
