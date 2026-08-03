/* Auflage 3: zaehlt, wer die Kopfzeile gewinnt, solange der Antrag liegt —
   heute, und mit dem einen Rang, um den dieses Stueck den Kern bittet.
   Der Rang wird im Browser gesetzt, nicht im Quelltext: so ist die Zahl
   gemessen und nicht behauptet. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import { neueSeite, STAND, AUS } from './messe.mjs';

const MITRANG = process.argv[2] === 'mitrang';
const browser = await chromium.launch();
const erg = {};
for (const ep of [1, 2, 3, 4]) {
  const { seite, fehler } = await neueSeite(browser, ep);
  if (MITRANG) await seite.evaluate(() => { window.BRAUHAUS.welt.ZUGRANG.ausgang = 5; });
  let treffer = null;
  for (let i = 0; i < 140; i++) {
    const s = await seite.evaluate(STAND);
    if (s.ende) break;
    const a = await seite.$('[data-zug="fuhre:ausgang:ja"]');
    if (a) {
      /* Ein Bildlauf, damit die Kopfzeile die Meldung dieser Woche traegt. */
      await seite.evaluate(() => window.BRAUHAUS.sende('zeichne', { grund: 'messung' }));
      await seite.waitForTimeout(120);
      const t = await seite.evaluate(STAND);
      const preisJa = await a.getAttribute('data-preis');
      treffer = { jahr: t.jahr, woche: t.woche, kasse: t.kasse,
        antragPreis: preisJa, deckungText: t.deckungText, naechster: t.naechster,
        gewinner: t.naechster && t.naechster.zug === 'fuhre:ausgang:ja' ? 'ANTRAG' : 'anderes' };
      break;
    }
    const w = await seite.$('[data-zug="weiter"]');
    if (!w || await w.isDisabled()) break;
    await w.click(); await seite.waitForTimeout(26);
  }
  erg['e' + ep] = { treffer, fehler };
  console.log(`E${ep}`, MITRANG ? '[mit Rang ausgang=5]' : '[heute]', JSON.stringify(treffer));
  await seite.close();
}
await browser.close();
fs.writeFileSync(`${AUS}kopfzeile-${MITRANG ? 'mitrang' : 'heute'}.json`, JSON.stringify(erg, null, 1));
