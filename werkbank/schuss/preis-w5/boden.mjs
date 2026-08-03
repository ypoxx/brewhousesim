/* DER KASSENBODEN — wer nimmt das letzte Geld?
   HAFEN=8900 node boden.mjs <epoche> <wochen>

   Spielt mit der GROBEN Hand der `spielprobe.mjs` (dritter erreichbarer Knopf,
   dann WEITER) — genau die Hand, mit der die Aufsicht den Boden gemessen hat —
   und schreibt Woche fuer Woche die Kasse mit, dazu jede Protokollzeile, die in
   dieser Woche neu dazugekommen ist. Damit steht am Ende nicht nur DASS die
   Kasse unter null faellt, sondern WELCHE Buchung sie dort hingebracht hat. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const ep = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 60);
const HAFEN = process.env.HAFEN || '8899';
const SAAT = process.env.SAAT || '1350';

const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 1600, height: 1000 } });
const fehler = [];
s.on('pageerror', x => fehler.push(x.message));
s.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await s.waitForTimeout(1000);

const stand = () => s.evaluate(() => ({
  jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
  kasse: BRAUHAUS.welt.haus.kasse, ende: !!BRAUHAUS.welt.zeit.ende,
  n: BRAUHAUS.protokoll.length, lage: BRAUHAUS.lage.length
}));
const neueZeilen = (ab) => s.evaluate((k) => BRAUHAUS.protokoll.slice(k)
  .map(p => ({ wer: p.wer, was: String(p.was).slice(0, 58), preis: p.preis })), ab);

let vor = await stand();
const reihe = [{ jahr: vor.jahr, woche: vor.woche, kasse: vor.kasse, gebucht: [] }];
let tiefst = { kasse: vor.kasse, jahr: vor.jahr, woche: vor.woche, gebucht: [] };

for (let w = 0; w < WOCHEN; w++) {
  if ((await s.evaluate(() => !!BRAUHAUS.welt.zeit.ende))) break;
  const z = await s.$$('[data-zug]:not([disabled])');
  if (z.length > 3) { await z[3].click({ timeout: 1500 }).catch(() => {}); await s.waitForTimeout(90); }
  const wt = await s.$('[data-zug="weiter"]:not([disabled])');
  if (!wt) break;
  await wt.click({ timeout: 2000 }).catch(() => {});
  await s.waitForTimeout(90);

  const jetzt = await stand();
  const gebucht = await neueZeilen(vor.n);
  const zeile = { jahr: jetzt.jahr, woche: jetzt.woche, kasse: jetzt.kasse, vorher: vor.kasse, gebucht };
  reihe.push(zeile);
  if (jetzt.kasse < tiefst.kasse) tiefst = zeile;
  vor = jetzt;
}

const unterNull = reihe.filter(r => r.kasse < 0);
console.log(`E${ep}@${HAFEN}: ${reihe.length - 1} Wochen, Kasse zuletzt ${vor.kasse}, `
  + `tiefst ${tiefst.kasse} (${tiefst.jahr}/${tiefst.woche}), unter null in ${unterNull.length} Wochen, `
  + `Seitenfehler ${fehler.length}`);
if (tiefst.kasse <= 0) {
  console.log(`  Die Buchungen der Woche ${tiefst.jahr}/${tiefst.woche} (vorher ${tiefst.vorher}):`);
  (tiefst.gebucht || []).forEach(g => console.log(`    ${g.wer.padEnd(8)} ${String(g.preis).padStart(9)}  ${g.was}`));
}
if (process.env.ZIEL) {
  const fs = await import('fs');
  fs.writeFileSync(process.env.ZIEL, JSON.stringify({ epoche: ep, hafen: HAFEN, fehler, reihe }, null, 1));
}
const ersteNeg = reihe.find(r => r.kasse < 0);
if (ersteNeg && ersteNeg !== tiefst) {
  console.log(`  ERSTMALS unter null ${ersteNeg.jahr}/${ersteNeg.woche} (vorher ${ersteNeg.vorher}):`);
  ersteNeg.gebucht.forEach(g => console.log(`    ${g.wer.padEnd(8)} ${String(g.preis).padStart(9)}  ${g.was}`));
}
await b.close();
