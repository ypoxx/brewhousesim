/* DIE DECKUNG — wieviel des BILDES deckt welches Stück wirklich zu?
     HAFEN=8899 node werkbank/schuss/aufsicht/deckung-je-stueck.mjs

   WARUM ES DAS GIBT: Der Blindvergleich vom 5. August 2026 hat die erste Latte
   gerissen und die Ursache benannt — nicht die Bühne verliert, sondern was auf
   ihr liegt: 27-28 % der Fläche, 60 % des untersten Sechstels. Er nennt aber
   nicht, WELCHES STÜCK wieviel deckt, und ohne das wäre der nächste Auftrag
   geraten.

   EIN VERWORFENER ERSTER ANLAUF, verzeichnet, damit ihn niemand wiederholt:
   Das Gerät zählte zuerst die Rechteck-Hüllen aller Elemente mit Hintergrund
   in ein Raster. Ergebnis 72-74 % — mehr als das Doppelte der gemessenen
   Deckung. Zwei Fehler steckten darin:
     1. Die EPOCHENPLATTE selbst wurde mitgezählt, also die Bühne als Deckung
        der Bühne. DIE STADT stand dadurch bei 47 % des untersten Sechstels,
        und das ist der Hof.
     2. Auch nach dem Ausschluss der Bildebenen blieb es bei 72 %: eine
        Rechteck-Hülle deckt nicht, was in ihr durchsichtig ist. Ein Kasten mit
        Rundung, Polster und halbdurchsichtigem Grund zählt voll, deckt aber
        wenig.
   Die Lehre: WER DECKUNG MESSEN WILL, VERGLEICHT PIXEL, NICHT KÄSTEN. Genau
   das hat der blinde Kritiker getan, und deshalb stimmt seine Zahl.

   SO MISST DIESES GERÄT: dieselbe Seite zweimal aufgenommen — einmal mit
   ausgeblendeter Oberfläche (das nackte Bild), einmal mit. Was sich
   unterscheidet, ist gedeckt. Je Stück wird die Oberfläche bis auf dieses eine
   Stück ausgeblendet; die Summe der Stücke darf die Gesamtdeckung übersteigen,
   weil Stücke einander überlappen — das ist selbst ein Befund.               */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { pngLesen } from './png-lesen.mjs';

const HAFEN = process.env.HAFEN || '8899';
const BREITE = +(process.env.BREITE || 2752), HOEHE = +(process.env.HOEHE || 1536);
const STUECKE = ['stadt','fu','preis','gg','sud','nm','erb','kopf'];
const namen = { stadt:'DIE STADT', fu:'DIE FUHRE', preis:'DER PREIS', gg:'DER GEGNER',
                sud:'DER SUD', nm:'DER NAME', erb:'DAS ERBE', kopf:'die Kopfleiste' };

/* Die Bildebenen (platte, bau) sind das BILD und werden nie ausgeblendet.
   spiel/LIESMICH.md nennt die z-Ordnung platte < bau < marken < hand < kopf
   < blatt. */
const blende = (nur) => {
  const ebenen = [...document.querySelectorAll('.ebene')];
  const bild = ebenen.slice(0, 2);                 // platte, bau
  ebenen.forEach(w => {
    if (bild.includes(w)) return;
    [...w.children].forEach(el => {
      const c = (el.className && typeof el.className === 'string') ? el.className : '';
      const m = c.match(/\b(stadt|fu|preis|gg|sud|nm|erb|kopf)[-\w]*/);
      const wem = m ? m[1] : null;
      el.style.visibility = (nur === null || wem === nur) ? (nur === null ? 'hidden' : 'visible')
                                                          : 'hidden';
      if (nur === '*') el.style.visibility = 'visible';
    });
  });
};

const anders = (a, b, nurUnten) => {
  const A = pngLesen(a), B = pngLesen(b);
  let n = 0, ges = 0;
  const y0 = nurUnten ? Math.floor(A.hoehe * 5/6) : 0;
  for (let y = y0; y < A.hoehe; y++) for (let x = 0; x < A.breite; x++) {
    const i = (y*A.breite + x) * 4; ges++;
    if (Math.abs(A.daten[i]-B.daten[i]) > 8 || Math.abs(A.daten[i+1]-B.daten[i+1]) > 8 ||
        Math.abs(A.daten[i+2]-B.daten[i+2]) > 8) n++;
  }
  return n/ges;
};

const b = await chromium.launch();
for (const e of [1,2,3,4]) {
  const s = await b.newPage({ viewport: { width: BREITE, height: HOEHE } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil:'networkidle' });
  await s.waitForTimeout(1200);
  const voll = await s.screenshot();
  await s.evaluate(blende, null);  await s.waitForTimeout(200);
  const nackt = await s.screenshot();
  const p = n => (n*100).toFixed(1).padStart(5) + ' %';
  console.log(`E${e}:  gesamt ${p(anders(voll,nackt,false))} der Flaeche, ` +
              `${p(anders(voll,nackt,true))} des untersten Sechstels`);
  const zeilen = [];
  for (const k of STUECKE) {
    await s.evaluate(blende, k); await s.waitForTimeout(150);
    const nur = await s.screenshot();
    zeilen.push([k, anders(nur,nackt,false), anders(nur,nackt,true)]);
  }
  zeilen.sort((x,y) => y[2]-x[2]).forEach(([k,g,u]) =>
    console.log(`     ${(namen[k]||k).padEnd(14)} ${p(g)}   unten ${p(u)}`));
  await s.close();
}
await b.close();
