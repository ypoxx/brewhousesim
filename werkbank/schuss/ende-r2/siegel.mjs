/* Zaehlt, was das Ende versiegelt — und was es nicht versiegelt.
   Jeder nach dem Ende noch aktive Knopf wird WIRKLICH geklickt, zweimal:
   einmal mit der Maus (force), einmal programmatisch (el.click()), damit
   auch ein Horcher in der Fangphase gepruefte Wirkung zeigen muss. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import { neueSeite, ZUEGE, STAND, AUS } from './messe.mjs';

const MARKE = process.argv[2] || 'nach';
const WEG = process.argv[3] || 'ja';        /* ja = Antrag annehmen, nein = Frist verstreichen */
const browser = await chromium.launch();
const erg = {};

for (const ep of [1, 2, 3, 4]) {
  const { seite, fehler } = await neueSeite(browser, ep);
  let antragStand = null;
  for (let i = 0; i < 140; i++) {
    const s = await seite.evaluate(STAND);
    if (s.ende) break;
    const a = await seite.$('[data-zug="fuhre:ausgang:ja"]');
    if (a) {
      if (!antragStand) antragStand = { jahr: s.jahr, woche: s.woche, deckung: s.deckung,
        deckungText: s.deckungText, naechster: s.naechster };
      if (WEG === 'ja') { await a.click(); await seite.waitForTimeout(150); break; }
    }
    const w = await seite.$('[data-zug="weiter"]');
    if (!w || await w.isDisabled()) break;
    await w.click(); await seite.waitForTimeout(28);
  }

  const nachEnde = await seite.evaluate(STAND);
  /* Alle Reiter aufschlagen: was verdeckt im DOM liegt, zaehlt auch. */
  const reiter = await seite.$$eval('[data-zug^="stadt:reiter:"]',
    e => e.map(x => x.getAttribute('data-zug')));
  for (const r of reiter) { const el = await seite.$(`[data-zug="${r}"]`);
    if (el) { try { await el.click({ timeout: 500 }); } catch {} await seite.waitForTimeout(30); } }

  const zuege = await seite.evaluate(ZUEGE);
  const offen = zuege.filter(z => !z.aus);
  const offenUndSichtbar = zuege.filter(z => !z.aus && z.sichtbar);
  const offenUndFrei = zuege.filter(z => !z.aus && z.frei);

  /* Jetzt roh drauf: jeden Zug anklicken, egal ob er gesperrt aussieht. */
  const vor = await seite.evaluate(STAND);
  const gebucht = [];
  const namen = [...new Set(zuege.map(z => z.zug))].filter(z => z !== 'fuhre:wiederanfang');
  for (const z of namen) {
    const a = await seite.evaluate(STAND);
    const el = await seite.$(`[data-zug="${z}"]`);
    if (!el) continue;
    try { await el.click({ force: true, timeout: 900 }); } catch {}
    try { await el.evaluate(e => e.click()); } catch {}
    await seite.waitForTimeout(30);
    const b = await seite.evaluate(STAND);
    if (b.kasse !== a.kasse || b.protokoll !== a.protokoll || b.chronik !== a.chronik) {
      gebucht.push({ zug: z, dKasse: b.kasse - a.kasse,
        dBuch: b.protokoll - a.protokoll, dChronik: b.chronik - a.chronik });
    }
  }
  const nachKlicks = await seite.evaluate(STAND);
  await seite.screenshot({ path: `${AUS}${MARKE}-${WEG}-e${ep}.png` });

  erg['e' + ep] = {
    antragStand, ende: nachEnde.endgrund,
    kasse: [nachEnde.kasse, nachKlicks.kasse],
    buch: [nachEnde.protokoll, nachKlicks.protokoll],
    chronik: [nachEnde.chronik, nachKlicks.chronik],
    deckung: { wert: nachEnde.deckung, text: nachEnde.deckungText,
      sichtbar: nachEnde.deckungSichtbar, imText: nachEnde.deckungImText },
    zuege: zuege.length,
    offen: offen.length, offenUndSichtbar: offenUndSichtbar.length,
    offenUndFrei: offenUndFrei.length,
    freieNamen: [...new Set(offenUndFrei.map(z => z.zug))],
    offeneNamen: [...new Set(offen.map(z => z.zug))],
    gebucht, lage: nachKlicks.lage, fehler
  };
  console.log(`E${ep} ende=${nachEnde.endgrund} zuege=${zuege.length} offen=${offen.length}`
    + ` offen+sichtbar=${offenUndSichtbar.length} offen+frei=${offenUndFrei.length} gebucht=${gebucht.length}`
    + ` dKasse=${nachKlicks.kasse - vor.kasse} deckungSichtbar=${nachEnde.deckungSichtbar}`
    + ` lage=${nachKlicks.lage} fehler=${fehler.length}`);
  await seite.close();
}
await browser.close();
fs.writeFileSync(`${AUS}${MARKE}-${WEG}.json`, JSON.stringify(erg, null, 1));
