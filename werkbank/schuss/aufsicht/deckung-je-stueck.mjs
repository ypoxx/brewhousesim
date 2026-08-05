/* DIE DECKUNG — wieviel der Bühne deckt welches Stück zu?
     HAFEN=8899 node werkbank/schuss/aufsicht/deckung-je-stueck.mjs

   WARUM ES DAS GIBT: Der Blindvergleich vom 5. August 2026 hat die erste
   Latte gerissen und die Ursache benannt — nicht die Bühne verliert, sondern
   was auf ihr liegt. Er nennt 27-28 % der Fläche und 60 % des untersten
   Sechstels, aber NICHT, welches Stück davon wieviel deckt.

   Ohne diese Aufteilung waere der naechste Auftrag geraten. Datei-Eigentum
   geht in diesem Lauf nach Vorsilbe (spiel/LIESMICH.md) — also muss auch die
   Deckung nach Vorsilbe gezaehlt werden, sonst bekommt ein Builder eine Zahl,
   die zur Haelfte einem anderen gehoert. Genau dieser Fehler ist am 5. August
   schon einmal passiert: die Textknoten-Tabelle ordnete nach Klassennamen,
   und 65 der DEM PREIS zugerechneten Knoten lagen in Kaesten von ERBE, STADT
   und NAME.

   GEZAEHLT WIRD, WAS DER SPIELER SIEHT: nur sichtbare Elemente mit Flaeche,
   die ueber der Buehne liegen. Ueberlappen sich zwei Kaesten desselben
   Stuecks, zaehlt die Flaeche EINMAL — deshalb ein Raster statt einer Summe
   von Rechtecken. Das Raster ist 8 px grob; feiner kostet Zeit und aendert
   die Aussage nicht.                                                        */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8899';
const BREITE = +(process.env.BREITE || 2752), HOEHE = +(process.env.HOEHE || 1536);
const WOCHEN = +(process.env.WOCHEN || 0);

const b = await chromium.launch();
const namen = { stadt:'DIE STADT', fu:'DIE FUHRE', preis:'DER PREIS', gg:'DER GEGNER',
                sud:'DER SUD', nm:'DER NAME', erb:'DAS ERBE', kopf:'die Kopfleiste' };
for (const e of [1,2,3,4]) {
  const s = await b.newPage({ viewport: { width: BREITE, height: HOEHE } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil:'networkidle' });
  await s.waitForTimeout(1200);
  for (let w = 0; w < WOCHEN; w++) {
    const k = await s.$('[data-zug="weiter"]:not([disabled])');
    if (!k) break;
    await k.click().catch(()=>{});
    await s.waitForTimeout(120);
  }
  const r = await s.evaluate(() => {
    const R = 8, sp = Math.ceil(innerWidth / R), ze = Math.ceil(innerHeight / R);
    const feld = {};                       // stueck -> Set von Rasterzellen
    const treffer = el => {
      let n = el, k = null;
      while (n && n !== document.body) {
        const c = (n.className && typeof n.className === 'string') ? n.className : '';
        const m = c.match(/\b(stadt|fu|preis|gg|sud|nm|erb|kopf)[-\w]*/);
        if (m) { k = m[1]; break; }
        n = n.parentElement;
      }
      return k;
    };
    document.querySelectorAll('*').forEach(el => {
      const c = getComputedStyle(el);
      if (c.visibility === 'hidden' || c.display === 'none' || +c.opacity === 0) return;
      /* Nur Deckendes: es muss einen eigenen Grund oder Rahmen haben, sonst
         ist es durchsichtig und deckt nichts. */
      const grund = c.backgroundColor, bild = c.backgroundImage;
      const deckt = (grund && !/rgba\(0, 0, 0, 0\)|transparent/.test(grund)) ||
                    (bild && bild !== 'none');
      if (!deckt) return;
      const q = el.getBoundingClientRect();
      if (q.width < 4 || q.height < 4) return;
      if (q.bottom < 0 || q.top > innerHeight || q.right < 0 || q.left > innerWidth) return;
      const k = treffer(el); if (!k) return;
      (feld[k] = feld[k] || new Set());
      for (let x = Math.max(0, Math.floor(q.left/R)); x < Math.min(sp, Math.ceil(q.right/R)); x++)
        for (let y = Math.max(0, Math.floor(q.top/R)); y < Math.min(ze, Math.ceil(q.bottom/R)); y++)
          feld[k].add(y*sp + x);
    });
    const unten = Math.floor(ze * 5/6);   // unterstes Sechstel
    const aus = {};
    for (const k in feld) {
      const z = [...feld[k]];
      aus[k] = { ganz: z.length / (sp*ze),
                 unten: z.filter(i => Math.floor(i/sp) >= unten).length / (sp*(ze-unten)) };
    }
    const alle = new Set(); for (const k in feld) for (const i of feld[k]) alle.add(i);
    aus._summe = { ganz: alle.size/(sp*ze),
                   unten: [...alle].filter(i=>Math.floor(i/sp)>=unten).length/(sp*(ze-unten)) };
    return aus;
  });
  const p = n => (n*100).toFixed(1).padStart(5) + ' %';
  console.log(`E${e}${WOCHEN?` nach ${WOCHEN} Wochen`:''}:  ` +
    `gesamt ${p(r._summe.ganz)} der Flaeche, ${p(r._summe.unten)} des untersten Sechstels`);
  Object.entries(r).filter(([k])=>k!=='_summe').sort((a,b)=>b[1].unten-a[1].unten)
    .forEach(([k,v]) => console.log(`     ${(namen[k]||k).padEnd(14)} ${p(v.ganz)}   unten ${p(v.unten)}`));
  await s.close();
}
await b.close();
