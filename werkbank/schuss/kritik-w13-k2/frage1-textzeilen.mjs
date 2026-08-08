// Frage 1 + Mitmessen: Textzeilen des ersten Schirms je Epoche, Treffer auf
// Ziel/gewinnen/ueberleben/Uebergabe, BRAUHAUS.lage.length, Seitenfehler.
// Bei 1600x900 UND 1366x768. Jeder Lauf zweimal, fuer die Wiederholbarkeit.
import { neuerBrowser, neueSeite, adresse, gehezu, zaehleTextzeilen, lage } from './lib.mjs';
import fs from 'node:fs';

const EPOCHEN = [
  { epoche: 1, saat: 1350, jahr: 1350 },
  { epoche: 2, saat: 1600, jahr: 1600 },
  { epoche: 3, saat: 1884, jahr: 1884 },
  { epoche: 4, saat: 1970, jahr: 1970 }
];
const FENSTER = [ { breite: 1600, hoehe: 900 }, { breite: 1366, hoehe: 768 } ];
const MUSTER = /Ziel|gewinnen|überleb|Übergabe/i;

async function einLauf(browser, fenster) {
  const ergebnis = [];
  for (const e of EPOCHEN) {
    const { page, context } = await neueSeite(browser, fenster);
    await gehezu(page, adresse({ epoche: e.epoche, saat: e.saat, neu: true }));
    const t = await zaehleTextzeilen(page);
    const l = await lage(page);
    const treffer = t.zeilen.filter((z) => MUSTER.test(z));
    ergebnis.push({
      epoche: e.epoche, jahr: e.jahr, fenster: fenster.breite + 'x' + fenster.hoehe,
      textzeilen: t.anzahl, treffer: treffer.length, trefferText: treffer,
      lage: l.length, fehler: page.__fehler.slice()
    });
    await context.close();
  }
  return ergebnis;
}

const browser = await neuerBrowser();
const ausgabe = {};
for (const fenster of FENSTER) {
  const key = fenster.breite + 'x' + fenster.hoehe;
  ausgabe[key] = {
    lauf1: await einLauf(browser, fenster),
    lauf2: await einLauf(browser, fenster),
    lauf3: await einLauf(browser, fenster)
  };
}
await browser.close();

fs.writeFileSync('/home/user/brewhousesim/werkbank/schuss/kritik-w13-k2/frage1-ergebnis.json',
  JSON.stringify(ausgabe, null, 2));
console.log(JSON.stringify(ausgabe, null, 2));
