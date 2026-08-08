// BRAUHAUS.lage + Seitenfehler NICHT nur beim frischen Laden (das prueft
// frage1 schon dreifach), sondern nach 65 echten Wochen Spiel je Epoche --
// das durchlaeuft viel mehr Code (Jahreswechsel, Erbfall-Pruefung, Preistafel,
// Gegnerzuege) als ein bloßer Seitenaufruf.
import { neuerBrowser, neueSeite, adresse, gehezu, klickZug, lage } from './lib.mjs';
import fs from 'node:fs';

const EPOCHEN = [
  { epoche: 1, saat: 1350 }, { epoche: 2, saat: 1600 },
  { epoche: 3, saat: 1884 }, { epoche: 4, saat: 1970 }
];
const browser = await neuerBrowser();
const ausgabe = [];
for (const e of EPOCHEN) {
  const { page, context } = await neueSeite(browser, { breite: 1600, hoehe: 900 });
  await gehezu(page, adresse({ epoche: e.epoche, saat: e.saat, neu: true }));
  await klickZug(page, 'kern:anfangen');
  let gespielt = 0;
  for (let i = 0; i < 65; i++) {
    const r = await klickZug(page, 'weiter');
    if (!r.gegriffen) break;
    gespielt++;
  }
  const l = await lage(page);
  ausgabe.push({ epoche: e.epoche, wochenGespielt: gespielt, lage: l.length, lageDetails: l, fehler: page.__fehler.slice() });
  console.log('Epoche', e.epoche, 'Wochen', gespielt, 'lage', l.length, 'fehler', page.__fehler.length);
  await context.close();
}
await browser.close();
fs.writeFileSync('/home/user/brewhousesim/werkbank/schuss/kritik-w13-k2/mitmessen-tief-ergebnis.json', JSON.stringify(ausgabe, null, 2));
