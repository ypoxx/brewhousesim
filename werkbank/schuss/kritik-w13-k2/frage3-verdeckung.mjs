// Frage 3: Verdeckt der neue Anfang etwas? Zwei neue Kaesten aus Welle 13:
// (a) DER ANSCHLAG AM ANFANG ("startzettel", kern/start.js) — auf jedem
//     frischen Schirm da, geht mit dem ersten Wochenwechsel oder "Anfangen" weg.
// (b) DIE RUECKFRAGE beim "Neue Partie"-Knopf (kern-neu-frage, kern/kopf.js) —
//     erscheint nur, wenn ein Spielstand vorliegt und "Neue Partie" gedrueckt wird.
//
// Methode: BRAUHAUS.zuege() (alles Bedienbare) VOR und NACH dem jeweiligen
// Kasten, plus elementFromPoint-Probe je Knopfmitte — was nicht unter dem
// Zeiger liegt, gilt als nicht gegriffen. Ausserdem zwei aus dem Quelltext
// bekannte fruehere Verdeckungsfaelle gezielt geprueft: sud:gaerung:keller
// (1600) und fuhre:listen:neustadt (1970).
import { neuerBrowser, neueSeite, adresse, gehezu, zuege, klickZug, weiterKlicken } from './lib.mjs';
import fs from 'node:fs';

async function greifbarkeit(page) {
  const liste = await zuege(page);
  const out = [];
  for (const z of liste) {
    const info = await page.evaluate((zug) => {
      const el = document.querySelector('[data-zug="' + CSS.escape(zug) + '"]');
      if (!el) return { existiert: false };
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return { existiert: true, flaeche: false };
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const top = document.elementFromPoint(cx, cy);
      const trifft = top === el || (top && el.contains(top));
      return { existiert: true, flaeche: true, trifft, disabled: !!el.disabled };
    }, z.zug);
    out.push({ zug: z.zug, text: z.text, offen: z.offen, ...info });
  }
  return out;
}

function greifbareZahl(liste) {
  return liste.filter((z) => z.existiert && z.flaeche && z.trifft && !z.disabled).length;
}

const ausgabe = { startzettel: [], rueckfrage: [] };
const browser = await neuerBrowser();

// --- (a) Der Anschlag am Anfang, in allen vier Epochen ---
const EPOCHEN = [
  { epoche: 1, saat: 1350 }, { epoche: 2, saat: 1600 },
  { epoche: 3, saat: 1884 }, { epoche: 4, saat: 1970 }
];
for (const e of EPOCHEN) {
  const { page, context } = await neueSeite(browser, { breite: 1600, hoehe: 900 });
  await gehezu(page, adresse({ epoche: e.epoche, saat: e.saat, neu: true }));

  const zettelRect = await page.evaluate(() => {
    const z = document.querySelector('.startzettel');
    if (!z) return null;
    const r = z.getBoundingClientRect();
    const cs = getComputedStyle(z);
    const knopf = z.querySelector('[data-zug="kern:anfangen"]');
    const kcs = knopf ? getComputedStyle(knopf) : null;
    return {
      rect: { x: r.x, y: r.y, w: r.width, h: r.height },
      pointerEvents: cs.pointerEvents,
      knopfPointerEvents: kcs ? kcs.pointerEvents : null
    };
  });

  const mitZettel = await greifbarkeit(page);
  // gezielte Probe der beiden im Quelltext genannten frueheren Bruchstellen
  const gezielt = {};
  for (const zug of ['sud:gaerung:keller', 'fuhre:listen:neustadt']) {
    const eintrag = mitZettel.find((z) => z.zug === zug);
    gezielt[zug] = eintrag || { existiert: false, hinweis: 'in dieser Epoche/Woche nicht auf dem Brett' };
  }

  // Kasten wegklicken (echter Mausklick auf "Anfangen")
  const klick = await klickZug(page, 'kern:anfangen');
  await page.waitForTimeout(80);
  const ohneZettel = await greifbarkeit(page);

  // Verdeckt NUR, was OHNE Zettel greifbar ist UND MIT Zettel nicht mehr.
  const ohneZettelGreifbar = new Set(
    ohneZettel.filter((z) => z.existiert && z.flaeche && z.trifft && !z.disabled).map((z) => z.zug)
  );
  const verdecktDurchZettel = mitZettel.filter((z) =>
    ohneZettelGreifbar.has(z.zug) && !(z.existiert && z.flaeche && z.trifft && !z.disabled)
  ).map((z) => ({ zug: z.zug, text: z.text }));

  ausgabe.startzettel.push({
    epoche: e.epoche,
    zettelRect,
    anfangenGeklickt: klick,
    greifbarMitZettel: greifbareZahl(mitZettel),
    greifbarOhneZettel: greifbareZahl(ohneZettel),
    gesamtZuegeMitZettel: mitZettel.length,
    gesamtZuegeOhneZettel: ohneZettel.length,
    verdecktDurchZettel,
    gezielt
  });
  await context.close();
}

// --- (b) Die Rueckfrage bei "Neue Partie" (epoche 1 und 4) ---
// WICHTIG: derselbe Browserkontext fuer Spielen + Neuladen, sonst sieht das
// zweite Laden den localStorage der ersten Seite nicht (eigener Fund, siehe
// Journal weiter unten).
for (const e of [{ epoche: 1, saat: 1350 }, { epoche: 4, saat: 1970 }]) {
  const { page, context } = await neueSeite(browser, { breite: 1600, hoehe: 900 });
  // OHNE neu=1: nur so schreibt kern/stand.js ueberhaupt einen Spielstand.
  // Der Kontext ist frisch, localStorage also leer -- das ist beim ersten
  // Laden aequivalent zu &neu=1, nur dass ab jetzt auch GESCHRIEBEN wird.
  await gehezu(page, adresse({ epoche: e.epoche, saat: e.saat, neu: false }));
  await klickZug(page, 'kern:anfangen');
  await weiterKlicken(page, 6); // ein paar Wochen spielen, damit ein Stand entsteht

  // gleiche Adresse OHNE neu=1 erneut laden, IM SELBEN KONTEXT -> Stand wird eingesetzt
  await gehezu(page, adresse({ epoche: e.epoche, saat: e.saat, neu: false }));

  const neuKnopfDa = (await zuege(page)).some((z) => z.zug === 'kern:neu');
  const vorRueckfrage = await greifbarkeit(page);
  const klick = await klickZug(page, 'kern:neu');
  await page.waitForTimeout(80);

  const kastenRect = await page.evaluate(() => {
    const k = document.querySelector('.neu-frage');
    if (!k) return null;
    const r = k.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  const mitKasten = await greifbarkeit(page);
  const zu = await klickZug(page, 'kern:neu:nein');
  await page.waitForTimeout(80);
  const nachSchliessen = await greifbarkeit(page);

  // Verdeckt NUR, was VORHER (ohne Kasten) greifbar war UND jetzt nicht mehr.
  const vorherGreifbareZuege = new Set(
    vorRueckfrage.filter((z) => z.existiert && z.flaeche && z.trifft && !z.disabled).map((z) => z.zug)
  );
  const verdecktDurchKasten = mitKasten.filter((z) =>
    vorherGreifbareZuege.has(z.zug) && !(z.existiert && z.flaeche && z.trifft && !z.disabled)
  ).map((z) => ({ zug: z.zug, text: z.text }));

  ausgabe.rueckfrage.push({
    epoche: e.epoche,
    neuKnopfDa,
    klickAufNeu: klick,
    kastenRect,
    greifbarVorRueckfrage: greifbareZahl(vorRueckfrage),
    greifbarMitRueckfrage: greifbareZahl(mitKasten),
    greifbarNachSchliessen: greifbareZahl(nachSchliessen),
    verdecktDurchKasten,
    schliessKlick: zu
  });
  await context.close();
}

await browser.close();
fs.writeFileSync('/home/user/brewhousesim/werkbank/schuss/kritik-w13-k2/frage3-ergebnis.json', JSON.stringify(ausgabe, null, 2));
console.log(JSON.stringify(ausgabe, null, 2));
