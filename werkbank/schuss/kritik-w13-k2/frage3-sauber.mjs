// Sauberer, direkter Test: BLOCKIERT der Anschlag (startzettel) irgendeinen
// gerade sichtbaren, aktiven Knopf? Keine Vorher/Nachher-Differenz noetig
// (die verfaelscht sich durch den Erst-Klick-Effekt der Preistafel, siehe
// diagnose-klick-ueberall.mjs / diagnose-weiter.mjs) — direkte Pruefung: fuer
// jeden Knopf, der WAEHREND der Anschlag steht offen und mit Flaeche ist,
// muss elementFromPoint an seiner Mitte auf ihn selbst treffen.
import { neuerBrowser, neueSeite, adresse, gehezu } from './lib.mjs';
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
  // KEIN Klick, KEINE Mausbewegung -- reiner Ist-Zustand mit Zettel.
  const r = await page.evaluate(() => {
    const zettel = document.querySelector('.startzettel');
    const zettelDa = !!zettel;
    const liste = [];
    document.querySelectorAll('[data-zug]').forEach((el) => {
      if (el.disabled) return;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      const top = document.elementFromPoint(cx, cy);
      const trifft = top === el || (top && el.contains(top));
      const unterZettel = zettel ? (
        cx >= zettel.getBoundingClientRect().left && cx <= zettel.getBoundingClientRect().right &&
        cy >= zettel.getBoundingClientRect().top && cy <= zettel.getBoundingClientRect().bottom
      ) : false;
      liste.push({ zug: el.getAttribute('data-zug'), trifft, unterZettel,
        topIstAnfangen: !!(top && top.closest('[data-zug="kern:anfangen"]')) });
    });
    return {
      zettelDa,
      zettelRect: zettel ? (() => { const b = zettel.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; })() : null,
      gesamtOffenMitFlaeche: liste.length,
      nichtGetroffen: liste.filter((x) => !x.trifft),
      unterZettelUndGetroffen: liste.filter((x) => x.unterZettel && x.trifft).length,
      unterZettelUndNichtGetroffen: liste.filter((x) => x.unterZettel && !x.trifft)
    };
  });
  ausgabe.push({ epoche: e.epoche, ...r });
  await context.close();
}
await browser.close();
fs.writeFileSync('/home/user/brewhousesim/werkbank/schuss/kritik-w13-k2/frage3-sauber-ergebnis.json', JSON.stringify(ausgabe, null, 2));
console.log(JSON.stringify(ausgabe, null, 2));
