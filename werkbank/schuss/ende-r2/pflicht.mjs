/* Die Pflichtpruefung: vier Epochen laden, spielen, BRAUHAUS.lage leer,
   keine Konsolenfehler — und die Versiegelung darf VOR dem Ende nichts
   sperren. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { neueSeite, ZUEGE, STAND, AUS } from './messe.mjs';
const browser = await chromium.launch();
let schlecht = 0;
for (const ep of [1, 2, 3, 4]) {
  const { seite, fehler } = await neueSeite(browser, ep);
  const start = await seite.evaluate(ZUEGE);
  /* 40 Wochen normal spielen, dabei jede Woche einmal laden und fahren. */
  let fuhren = 0;
  const klick = async (z) => { const el = await seite.$(`[data-zug="${z}"]`);
    if (!el || await el.isDisabled()) return false;
    try { await el.click({ timeout: 600 }); } catch { return false; }
    await seite.waitForTimeout(25); return true; };
  await klick('stadt:reiter:fuhre-fu-brett-fu-haeuser');
  for (let i = 0; i < 40; i++) {
    const laden = await seite.$$eval('[data-zug^="fuhre:laden:"]:not([disabled])',
      e => e.slice(0, 3).map(x => x.getAttribute('data-zug')));
    for (const l of laden) await klick(l);
    if (await klick('fuhre:abfahrt')) fuhren++;
    const w = await seite.$('[data-zug="weiter"]');
    if (!w || await w.isDisabled()) break;
    await w.click(); await seite.waitForTimeout(25);
  }
  const s = await seite.evaluate(STAND);
  const zuege = await seite.evaluate(ZUEGE);
  const aktiv = zuege.filter(z => !z.aus && z.frei).length;
  const hof = await seite.evaluate(() => document.documentElement.getAttribute('data-hof-zu'));
  await seite.screenshot({ path: `${AUS}pflicht-e${ep}.png` });
  const ok = s.lage === 0 && fehler.length === 0 && (s.ende ? true : hof === null) && aktiv > 20;
  if (!ok) schlecht++;
  console.log(`E${ep} ${ok ? 'OK ' : 'FEHLER'} jahr=${s.jahr}/${s.woche} kasse=${s.kasse}`
    + ` fuhren=${fuhren} aktiv+frei=${aktiv} (start ${start.filter(z=>!z.aus&&z.frei).length})`
    + ` lage=${s.lage} konsole=${fehler.length} hofZu=${hof} ende=${s.ende}`);
  if (fehler.length) console.log('   ', fehler.slice(0, 3));
  await seite.close();
}
await browser.close();
console.log(schlecht ? 'NICHT SAUBER' : 'keine Fehler auf der Seite — alle vier Epochen');
