/* Abschrift von werkbank/schuss/aufsicht/spielprobe.mjs — Zeile fuer Zeile
   dieselbe, nur der Hafen kommt aus der Umgebung. Das Original zeigt fest auf
   8899 (den Arbeitsbaum), und in dieser Welle schreiben drei Builder darin.
   Am fremden Messgeraet wird nicht gedreht; meins steht daneben. */
/* Nach einer Kernaenderung reicht "laedt ohne Fehler" nicht — es muss auch
   noch spielbar sein. 60 Wochen je Epoche mit echten Klicks. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8899';
const b = await chromium.launch();
let schlecht = 0;
for (const e of [1,2,3,4]) {
  const s = await b.newPage({ viewport: { width: 1600, height: 1000 } });
  const f = [];
  s.on('pageerror', x => f.push(x.message));
  s.on('console', m => { if (m.type()==='error') f.push(m.text()); });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil:'networkidle' });
  await s.waitForTimeout(1000);
  let w = 0, geklickt = 0;
  for (; w < 60; w++) {
    if (await s.evaluate(() => !!BRAUHAUS.welt.zeit.ende)) break;
    // ein echter Zug, dann weiter
    const z = await s.$$('[data-zug]:not([disabled])');
    if (z.length > 3) { await z[3].click({ timeout: 1500 }).catch(()=>{}); geklickt++; await s.waitForTimeout(90); }
    const wt = await s.$('[data-zug="weiter"]:not([disabled])');
    if (!wt) break;
    await wt.click({ timeout: 2000 }).catch(()=>{});
    await s.waitForTimeout(90);
  }
  const d = await s.evaluate(() => ({ jahr: BRAUHAUS.welt.zeit.jahr,
    kasse: BRAUHAUS.welt.haus.kasse, lage: BRAUHAUS.lage.length,
    ende: !!BRAUHAUS.welt.zeit.ende }));
  const ok = d.lage === 0 && f.length === 0 && w > 10;
  if (!ok) schlecht++;
  console.log(`  E${e}: ${ok?'OK  ':'FEHL'} ${w} Wochen gespielt, ${geklickt} Zuege, Jahr ${d.jahr}, Kasse ${d.kasse}, lage ${d.lage}, Fehler ${f.length}${d.ende?', Partie zu Ende':''}`);
  f.slice(0,2).forEach(x => console.log('      ! ' + x.slice(0,140)));
  await s.close();
}
await b.close();
console.log(schlecht === 0 ? '\nSPIELPROBE BESTANDEN' : `\nSPIELPROBE FEHLGESCHLAGEN (${schlecht})`);
process.exit(schlecht === 0 ? 0 : 1);
