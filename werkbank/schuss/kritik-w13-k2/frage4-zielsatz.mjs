// Frage 4: Kommt der Zielsatz (".zielzeile", "Ziel: ...") in JEDER Woche,
// oder nur in manchen? Mindestens 60 Wochen je Epoche, echte Mausklicks auf
// WEITER.
import { neuerBrowser, neueSeite, adresse, gehezu, klickZug } from './lib.mjs';
import fs from 'node:fs';

const WOCHEN = 65; // > 60, deckt zwei volle Braujahre + Rest
const EPOCHEN = [
  { epoche: 1, saat: 1350 }, { epoche: 2, saat: 1600 },
  { epoche: 3, saat: 1884 }, { epoche: 4, saat: 1970 }
];

async function leseZiel(page) {
  return await page.evaluate(() => {
    const z = document.querySelector('.zielzeile');
    return z ? { da: true, text: z.textContent, naehe: z.getAttribute('data-ziel-naehe') } : { da: false };
  });
}
async function leseZeit(page) {
  return await page.evaluate(() => {
    const w = window.BRAUHAUS.welt;
    return { jahr: w.zeit.jahr, woche: w.zeit.woche, ende: !!w.zeit.ende };
  });
}

async function einLauf(browser, e) {
  const { page, context } = await neueSeite(browser, { breite: 1600, hoehe: 900 });
  await gehezu(page, adresse({ epoche: e.epoche, saat: e.saat, neu: true }));
  const protokoll = [];
  // Woche 0: Anfangszustand VOR dem ersten Klick (Zettel liegt noch da)
  const z0 = await leseZiel(page);
  const t0 = await leseZeit(page);
  protokoll.push({ schritt: 0, ...t0, ziel: z0 });
  await klickZug(page, 'kern:anfangen');

  for (let i = 1; i <= WOCHEN; i++) {
    const r = await klickZug(page, 'weiter');
    if (!r.gegriffen) { protokoll.push({ schritt: i, abgebrochen: true, grund: r.grund }); break; }
    const z = await leseZiel(page);
    const t = await leseZeit(page);
    protokoll.push({ schritt: i, ...t, ziel: z });
    if (t.ende) break;
  }
  await context.close();
  return protokoll;
}

const browser = await neuerBrowser();
const ausgabe = {};
for (const e of EPOCHEN) {
  ausgabe['epoche' + e.epoche] = await einLauf(browser, e);
  console.log('epoche', e.epoche, 'fertig,', ausgabe['epoche' + e.epoche].length, 'eintraege');
}
await browser.close();
fs.writeFileSync('/home/user/brewhousesim/werkbank/schuss/kritik-w13-k2/frage4-ergebnis.json', JSON.stringify(ausgabe, null, 2));

// Kurzauswertung
for (const key of Object.keys(ausgabe)) {
  const p = ausgabe[key];
  const spielwochen = p.filter((x) => !x.abgebrochen && x.schritt > 0);
  const mitZiel = spielwochen.filter((x) => x.ziel.da && x.ziel.text && x.ziel.text.trim());
  console.log(key, ': Wochen gespielt', spielwochen.length, '· mit Zielsatz', mitZiel.length,
    '· ohne', spielwochen.length - mitZiel.length);
}
