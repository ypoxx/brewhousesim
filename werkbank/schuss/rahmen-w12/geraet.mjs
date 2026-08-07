/* WELLE 12 — R9: DIE FRAGE IN EINEM AUFRUF.
   HAFEN=8942 node werkbank/schuss/rahmen-w12/geraet.mjs [wochen]

   Was bisher neun Laeufe zu je vier Minuten gekostet hat („spielt diese Saat
   zwei Partien?"), fragt hier eine Abfrage IM SPIEL:

     BRAUHAUS.runde.pruefe()      -> [] heisst: der Rahmen hat nichts zu melden
     await BRAUHAUS.runde.nachwehen()
                                  -> nimmt den Abdruck der Klemmenlage UND
                                     aller Zuege, wartet 1,2 s, in denen
                                     niemand etwas anfasst, und sieht noch
                                     einmal hin. `ruhig: true` heisst: die
                                     Runde war fertig, als sie zu Ende ging.

   Dazu die Mindestbedingung der Aufsicht: vier Epochen laden,
   BRAUHAUS.lage leer, keine Konsolenfehler. Und die Griffe aus Welle 10:
   haushalt.pruefe(), haushalt.tafeln(), stadt.rahmen.verdeckt().

   Mit WOCHEN=n wird vor der Probe n-mal WEITER gedrueckt — die Frage ist ja
   nicht, ob der LADEzustand ruhig ist, sondern der gespielte.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = process.env.HAFEN || '8942';
const SAAT = process.env.SAAT || '1350';
const WOCHEN = +(process.argv[2] || process.env.WOCHEN || 0);
const FRIST = +(process.env.FRIST || 1200);

const b = await chromium.launch();
let schlecht = 0;

for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: 1920, height: 1000 }, deviceScaleFactor: 1 });
  const f = [];
  s.on('console', m => { if (m.type() === 'error') f.push(m.text().slice(0, 160)); });
  s.on('pageerror', x => f.push('pageerror: ' + x.message.slice(0, 160)));
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=${SAAT}`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(900);

  for (let i = 0; i < WOCHEN; i++) {
    await s.evaluate(() => { const k = document.querySelector('[data-zug="weiter"]'); if (k) k.click(); });
    await s.waitForTimeout(70);
  }
  await s.waitForTimeout(300);

  const d = await s.evaluate(async (frist) => {
    const B = window.BRAUHAUS;
    const nw = B.runde ? await B.runde.nachwehen(frist) : null;
    let verdeckt = null;
    try { verdeckt = B.stadt.rahmen.verdeckt().length; } catch (x) { verdeckt = 'kein Griff'; }
    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche,
      lage: B.lage.length,
      zuege: document.querySelectorAll('[data-zug]').length,
      rundePruefe: B.runde ? B.runde.pruefe() : 'KEIN kern/runde.js',
      rundeZeile: B.runde ? B.runde.zeile() : '—',
      nachwehen: nw,
      haushalt: B.haushalt ? B.haushalt.pruefe() : null,
      tafeln: B.haushalt ? B.haushalt.tafeln() : null,
      ueberRand: B.haushalt ? B.haushalt.ueberRand() : null,
      verdeckt
    };
  }, FRIST);

  const ruhig = d.nachwehen && d.nachwehen.ruhig;
  const ok = ruhig && d.lage === 0 && f.length === 0;
  if (!ok) schlecht++;
  console.log(`E${e} ${d.jahr}/W${d.woche}  ${ok ? 'RUHIG' : '!! UNRUHIG'}`
    + `  lage=${d.lage} fehler=${f.length} zuege=${d.zuege} verdeckt=${d.verdeckt}`
    + ` tafeln=${(d.tafeln || []).length} ueberRand=${(d.ueberRand || []).length}`
    + ` haushalt=${(d.haushalt || []).length}`);
  console.log('     ' + d.rundeZeile);
  if (d.rundePruefe && d.rundePruefe.length) {
    d.rundePruefe.forEach(r => console.log(`     runde.pruefe: ${r.was} (${r.zahl}) — ${r.sagt}`));
  }
  if (!ruhig && d.nachwehen) {
    d.nachwehen.beanstandungen.forEach(x => {
      console.log(`     NACHWEHEN ${x.was}: ${x.sagt}`);
      (x.unterschiede || []).forEach(u => console.log(`        ${u.zug}: "${u.vorher}" -> "${u.nachher}"`));
      if (x.was === 'klemmenlage') {
        console.log(`        vorher : ${x.vorher}`);
        console.log(`        nachher: ${x.nachher}`);
      }
    });
  }
  f.slice(0, 4).forEach(x => console.log('     FEHLER ' + x));
  await s.close();
}
await b.close();
console.log(schlecht ? `!! ${schlecht} von 4 Epochen unruhig` : 'ALLE VIER EPOCHEN RUHIG');
process.exit(schlecht ? 1 : 0);
