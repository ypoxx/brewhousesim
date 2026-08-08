/* GRIFFPROBE w13 — zwei Fragen an EINEN Augenblick.

   1  STEHT DER ANSCHLAG AM ANFANG IRGENDEINEM ZUG IM WEG?
      Die Gefahr ist gemessen belegbar und nicht theoretisch: die Hand des
      blinden Kritikers prueft vor JEDEM Klick mit `document.elementFromPoint`,
      ob unter dem Zeiger auch wirklich dieser Knopf liegt. Was nicht darunter
      liegt, gilt als NICHT GEGRIFFEN, der Klick faellt ersatzlos aus — und
      ein ausgefallener Klick macht eine andere Partie.

      ERSTER ANLAUF, UND ER TAUGTE NICHT: einmal MIT Anschlag ablesen, dann
      „Anfangen" druecken und OHNE noch einmal ablesen. Dazwischen hat DER
      PREIS seine Michaelitafel aufgeschlagen (Welle 13, R7) — 33 Zuege
      Unterschied, von denen keiner mir gehoerte. Zwei Augenblicke lassen
      sich in einem Spiel, an dem drei andere Builder arbeiten, nicht
      vergleichen.

      JETZT wird EIN Augenblick gefragt: fuer jeden `[data-zug]` liefert
      `elementFromPoint` ein Element — liegt das INNERHALB des Anschlags?
      Dann steht er im Weg. Der Knopf `kern:anfangen` ist der einzige, bei
      dem das erlaubt ist, denn er IST der Anschlag.

   2  WAS KOSTET DIESE WELLE AN FLAECHE?
      `haushalt.miss().je.kern` wird zweimal gelesen: einmal wie es steht,
      und einmal, nachdem die vier Dinge, die diese Welle an den Bildschirm
      geschrieben hat (`.standzeile`, `.zielzeile`, `.startzettel`,
      `.neu-frage`), aus dem DOM genommen wurden. Beide Zahlen im selben
      Augenblick, im selben Fenster — der Unterschied ist der Preis.

   Dazu die Woerter, nach denen die Abnahme fragt: Ziel · gewinnen ·
   überleben, gezaehlt ueber alle sichtbaren Textzeilen — so wie §5 des
   Urteils sie gezaehlt hat (dort: 0 von 613).

   HAFEN=8921 node griffprobe.mjs <epoche> [breite] [hoehe]                  */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const BR = +(process.argv[3] || 1600), HO = +(process.argv[4] || 900);
const HAFEN = process.env.HAFEN || '8921';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/rahmen-w13';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: BR, height: HO }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });

await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350&neu=1`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1300);
await seite.screenshot({ path: `${WURZ}/schuesse/griff-e${ep}-${BR}x${HO}.png` });

const erg = await seite.evaluate(() => {
  const B = window.BRAUHAUS;
  const zettel = document.querySelector('.startzettel');

  /* --- 1: verdeckt der Anschlag einen Zug? ------------------------------ */
  const verdeckt = [], blind = [];
  let gezaehlt = 0, greifbar = 0;
  document.querySelectorAll('[data-zug]').forEach(el => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (cx < 0 || cy < 0 || cx > innerWidth || cy > innerHeight) return;
    gezaehlt++;
    const t = document.elementFromPoint(cx, cy);
    const hit = !!(t && (t === el || el.contains(t)));
    if (hit && !el.disabled) greifbar++;
    if (hit) return;
    const zug = el.getAttribute('data-zug');
    blind.push(zug);
    if (zettel && t && zettel.contains(t)) verdeckt.push({ zug: zug, durch: t.className || t.tagName });
  });

  /* --- 2: was kostet diese Welle an Flaeche? ---------------------------- */
  const meins = [...document.querySelectorAll('.standzeile, .zielzeile, .startzettel, .neu-frage')];
  const vorher = B.haushalt.miss();
  const geparkt = meins.map(el => [el, el.parentNode, el.nextSibling]);
  geparkt.forEach(([el, p]) => p && p.removeChild(el));
  const nachher = B.haushalt.miss();
  geparkt.forEach(([el, p, n]) => p && p.insertBefore(el, n));

  /* --- 3: die drei Woerter auf dem ersten Schirm ------------------------- */
  const zeilen = [];
  const geher = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = geher.nextNode())) {
    const t = (n.nodeValue || '').trim();
    if (!t) continue;
    const el = n.parentElement;
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const c = getComputedStyle(el);
    if (c.visibility === 'hidden' || c.display === 'none' || parseFloat(c.opacity) < 0.05) continue;
    zeilen.push(t);
  }
  const alles = zeilen.join('\n');
  const zaehl = (w) => (alles.match(new RegExp(w, 'g')) || []).length;

  return {
    zettelDa: !!zettel,
    zuegeImSichtfeld: gezaehlt, greifbar,
    blindeZuege: blind.length,
    vomAnschlagVerdeckt: verdeckt,
    textzeilen: zeilen.length,
    woerter: { Ziel: zaehl('Ziel'), gewinnen: zaehl('[Gg]ewinn'), ueberleben: zaehl('[Üü]berleb') },
    kernMit: vorher.je.kern || null,
    kernOhne: nachher.je.kern || null,
    gesamtMit: vorher.gesamt, gesamtOhne: nachher.gesamt,
    obenMit: vorher.oben, obenOhne: nachher.oben,
    haushalt: B.haushalt.pruefe(),
    tafeln: B.haushalt.tafeln(),
    ueberRand: B.haushalt.ueberRand(),
    lage: B.lage.map(l => l.text.slice(0, 120))
  };
});

erg.epoche = ep; erg.fenster = `${BR}x${HO}`; erg.fehler = fehler;
erg.kostetFlaeche = erg.kernMit && erg.kernOhne
  ? { gesamt: erg.kernMit.px - erg.kernOhne.px, oben: erg.kernMit.obenPx - erg.kernOhne.obenPx }
  : null;
erg.bestanden = erg.vomAnschlagVerdeckt.length === 0 && fehler.length === 0
  && erg.woerter.Ziel > 0 && erg.woerter.gewinnen > 0 && erg.woerter.ueberleben > 0;

fs.writeFileSync(`${WURZ}/protokoll/griffprobe-e${ep}-${BR}x${HO}.json`, JSON.stringify(erg, null, 1));
console.log(JSON.stringify({
  epoche: ep, fenster: erg.fenster, bestanden: erg.bestanden,
  zettelDa: erg.zettelDa, zuegeImSichtfeld: erg.zuegeImSichtfeld, greifbar: erg.greifbar,
  blindeZuege: erg.blindeZuege, vomAnschlagVerdeckt: erg.vomAnschlagVerdeckt,
  textzeilen: erg.textzeilen, woerter: erg.woerter,
  kernMit: erg.kernMit && [erg.kernMit.px, erg.kernMit.obenPx],
  kernOhne: erg.kernOhne && [erg.kernOhne.px, erg.kernOhne.obenPx],
  kostetFlaeche: erg.kostetFlaeche,
  haushalt: erg.haushalt, tafeln: erg.tafeln.length, ueberRand: erg.ueberRand.length,
  lage: erg.lage, fehler
}, null, 1));
await browser.close();
