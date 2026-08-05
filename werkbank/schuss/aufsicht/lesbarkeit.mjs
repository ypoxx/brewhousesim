/* Lesbarkeit und Bedienbarkeit, statisch am gezeichneten Bild gemessen —
   ohne Klicks, ohne Zeitmessung, damit es neben einem laufenden Kritiker
   ehrlich bleibt.
     HAFEN=8899 BREITE=1280 node werkbank/schuss/aufsicht/lesbarkeit.mjs

   ZWEI FEHLER, die dieses Geraet bis zum 5. August 2026 hatte. Gemeldet vom
   blinden Kritiker DIE FUHRE, von der Aufsicht im Quelltext nachgeprueft:

   1. ES MASS OHNE ROLLLEISTE. `--hide-scrollbars` ist Playwrights eigene
      Startvorgabe (playwright-core/.../chromium/chromium.js:284) — niemand hat
      sie gesetzt, und ein Jahr lang hat sie niemand bemerkt. Ein echter Browser
      nimmt rund 15 px Breite weg; Kaesten, die hier passten, schneiden dort ab.
      SAEMTLICHE Zahlen der vierten Latte vor dem 5. August sind so entstanden
      und sind Untergrenzen, keine Ergebnisse. Behoben mit
      ignoreDefaultArgs: ['--hide-scrollbars'].

   2. ES ZAEHLTE ROLLENDE KAESTEN ALS ABGESCHNITTEN. Die Pruefung sah nur
      `overflow === 'hidden' || overflowY === 'hidden'`. Ein Kasten mit
      overflow-y: hidden UND overflow-x: auto rollt waagerecht und wurde
      trotzdem gezaehlt. Jetzt wird JE RICHTUNG gefragt, ob sie ueberlaeuft UND
      in dieser Richtung nicht rollbar ist.

   Die Lehre, die dieser Lauf schon fuenfmal bezahlt hat: ein Messgeraet, das
   im Fehlerfall schweigt, ist gefaehrlicher als keins. Hier schwieg es nicht
   einmal im Fehlerfall — es schwieg immer, weil die Vorgabe unsichtbar war.  */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8899';
const BREITE = +(process.env.BREITE || 1600), HOEHE = +(process.env.HOEHE || 1000);
/* OHNE_LEISTE=1 stellt das alte Verhalten her — nur, um alte Zahlen
   nachzustellen, nie um neue zu erheben. */
const b = process.env.OHNE_LEISTE === '1'
  ? await chromium.launch()
  : await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
let gesUeber = 0, gesKlein = 0, gesZiel = 0, gesKnopf = 0;
for (const e of [1,2,3,4]) {
  const s = await b.newPage({ viewport: { width: BREITE, height: HOEHE } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil:'networkidle' });
  await s.waitForTimeout(1300);
  const r = await s.evaluate(() => {
    const alle = [...document.querySelectorAll('*')];
    let ueber = 0, klein = 0, winzig = 0, prefix = {};
    const groessen = {};
    alle.forEach(el => {
      const c = getComputedStyle(el);
      if (el.children.length === 0 && (el.textContent||'').trim()) {
        const px = parseFloat(c.fontSize);
        groessen[Math.round(px)] = (groessen[Math.round(px)]||0)+1;
        if (px < 12) klein++;
        if (px < 10) winzig++;
      }
      /* Je Richtung getrennt: abgeschnitten ist ein Kasten nur, wenn er in
         DIESER Richtung ueberlaeuft UND in DIESER Richtung nicht rollen kann.
         Vorher galt schon overflow-y: hidden als Beweis — auch fuer einen
         Kasten, der waagerecht rollt und nichts verbirgt.
         `visible` zaehlt NICHT: so ein Kasten laeuft ueber, verbirgt aber
         nichts — der Text steht dann ausserhalb. Nur `hidden` und `clip`
         schneiden wirklich ab. */
      const kappt = v => v === 'hidden' || v === 'clip';
      const abY = el.scrollHeight > el.clientHeight + 1 && kappt(c.overflowY);
      const abX = el.scrollWidth  > el.clientWidth  + 1 && kappt(c.overflowX);
      if (abY || abX) {
        ueber++;
        const z = el.className && typeof el.className === 'string' ? el.className.split(/[\s-]/)[0] : '?';
        prefix[z] = (prefix[z]||0)+1;
      }
    });
    // Knopfgroessen: WCAG empfiehlt 24x24 CSS-px als Mindestziel
    const kn = [...document.querySelectorAll('[data-zug]')].filter(x=>!x.disabled);
    const zuKlein = kn.filter(x => { const c = x.getBoundingClientRect();
      return c.width>0 && c.height>0 && (c.width < 24 || c.height < 24); });
    return { ueber, klein, winzig, prefix, knoepfe: kn.length, zuKlein: zuKlein.length,
             groessen: Object.entries(groessen).sort((a,b)=>a[0]-b[0]).slice(0,6) };
  });
  gesUeber += r.ueber; gesKlein += r.klein; gesZiel += r.zuKlein; gesKnopf += r.knoepfe;
  console.log(`  E${e}: ${r.ueber} abgeschnittene Kaesten · ${r.klein} Textknoten unter 12px (davon ${r.winzig} unter 10px) · ` +
              `${r.zuKlein} von ${r.knoepfe} aktiven Knoepfen unter 24px`);
  const top = Object.entries(r.prefix).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([k,v])=>`${k}:${v}`).join('  ');
  if (top) console.log(`       Ueberlauf nach Stueck: ${top}`);
  console.log(`       kleinste Schriftgroessen: ${r.groessen.map(([px,n])=>`${px}px×${n}`).join('  ')}`);
  await s.close();
}
await b.close();
console.log(`\n  Summe ${BREITE}×${HOEHE}: ${gesUeber} Ueberlaeufe · ${gesKlein} Textknoten unter 12px · ${gesZiel} von ${gesKnopf} Knoepfen unter 24px`);
