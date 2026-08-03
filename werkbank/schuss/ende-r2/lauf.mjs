import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import { neueSeite, ZUEGE, STAND, AUS } from './messe.mjs';

const MARKE = process.argv[2] || 'vor';
const MAXW = 130;

const browser = await chromium.launch();
const ergebnis = {};

for (const ep of [1, 2, 3, 4]) {
  const { seite, fehler } = await neueSeite(browser, ep);
  const start = await seite.evaluate(STAND);

  /* Politik C: WEITER bis der Antrag im Bild steht, dann annehmen. */
  let antragWoche = null, i = 0;
  for (; i < MAXW; i++) {
    const s = await seite.evaluate(STAND);
    if (s.ende) break;
    const antrag = await seite.$('[data-zug="fuhre:ausgang:ja"]');
    if (antrag) {
      antragWoche = { jahr: s.jahr, woche: s.woche, i,
        deckung: s.deckung, deckungText: s.deckungText, naechster: s.naechster };
      await antrag.click();
      await seite.waitForTimeout(120);
      break;
    }
    const w = await seite.$('[data-zug="weiter"]');
    if (!w || await w.isDisabled()) break;
    await w.click();
    await seite.waitForTimeout(35);
  }

  const nachEnde = await seite.evaluate(STAND);
  const zuege = await seite.evaluate(ZUEGE);

  /* JETZT: jeden noch freien und aktiven Knopf wirklich klicken. */
  const klickbar = zuege.filter(z => z.frei && !z.aus && z.zug !== 'fuhre:wiederanfang');
  const gebucht = [];
  const vor = await seite.evaluate(STAND);
  for (const z of klickbar) {
    const el = await seite.$(`[data-zug="${z.zug}"]`);
    if (!el) continue;
    let a; try { a = await seite.evaluate(STAND); } catch { break; }
    try { await el.click({ timeout: 800 }); } catch { continue; }
    await seite.waitForTimeout(40);
    let b; try { b = await seite.evaluate(STAND); } catch { break; }
    if (b.kasse !== a.kasse || b.protokoll !== a.protokoll || b.chronik !== a.chronik) {
      gebucht.push({ zug: z.zug, text: z.text, stueck: z.stueck,
        dKasse: b.kasse - a.kasse, dBuch: b.protokoll - a.protokoll, dChronik: b.chronik - a.chronik });
    }
  }
  const nachKlicks = await seite.evaluate(STAND);
  await seite.screenshot({ path: `${AUS}${MARKE}-e${ep}.png` });

  ergebnis['e' + ep] = {
    start: { kasse: start.kasse, jahr: start.jahr },
    antragWoche, nachEnde, nachKlicks,
    fehler,
    zaehl: {
      alle: zuege.length,
      aktivSichtbar: zuege.filter(z => !z.aus && z.sichtbar).length,
      aktivFrei: zuege.filter(z => !z.aus && z.frei).length,
      jeStueck: zuege.filter(z => !z.aus && z.frei)
        .reduce((m, z) => (m[z.stueck || '?'] = (m[z.stueck || '?'] || 0) + 1, m), {})
    },
    gebucht,
    gebuchtSumme: gebucht.reduce((s, g) => s + Math.abs(g.dKasse), 0),
    freieZuege: klickbar.map(z => z.zug)
  };
  console.log(`E${ep} ende=${nachEnde.endgrund} aktivFrei=${ergebnis['e'+ep].zaehl.aktivFrei}`
    + ` gebucht=${gebucht.length} dKasse=${nachKlicks.kasse - vor.kasse}`
    + ` deckung=${nachEnde.deckungText} fehler=${fehler.length}`);
  await seite.close();
}
await browser.close();
fs.writeFileSync(`${AUS}${MARKE}.json`, JSON.stringify(ergebnis, null, 1));
console.log('geschrieben: ' + AUS + MARKE + '.json');
