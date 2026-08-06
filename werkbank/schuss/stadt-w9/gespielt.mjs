/* A3 IM SPIEL — dreissig Wochen klicken und dabei fragen, ob ein Brett ein
 * anderes anschneidet.
 *
 *   HAFEN=8931 node werkbank/schuss/stadt-w9/gespielt.mjs [epochen] [wochen]
 *
 * Die beiden Faelle der Auflage A3 stehen beide in `e1-30-gespielt-frei.png`,
 * also NACH dem Spielen und nach einem Jahreswechsel — im Ladezustand ist
 * nichts davon zu sehen. Also wird gespielt: echte Mausklicks auf WEITER,
 * dazwischen wird ein Brett aufgeschlagen (damit die Regel ueberhaupt etwas
 * zu tun bekommt), und am Ende gefragt:
 *
 *   BRAUHAUS.stadt.rahmen.schneidet()   — liegt ein Blattkopf unter der Werkbank?
 *   BRAUHAUS.stadt.rahmen.verdeckt()    — deckt die Werkbank einen fremden Zug?
 *   .stadt-verdeckt                     — welche Karte liegt unter einem Blatt?
 *
 * Und es schiesst dabei, damit man es ansehen kann statt es zu glauben.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8931';
const EPOCHEN = (process.argv[2] || '1,2,3,4').split(',').map(Number);
const WOCHEN = +(process.argv[3] || 30);
const AUS = 'werkbank/schuss/stadt-w9/bild';
mkdirSync(AUS, { recursive: true });

const b = await chromium.launch();
let schlecht = 0;
for (const e of EPOCHEN) {
  const s = await b.newPage({ viewport: { width: 2752, height: 1536 }, deviceScaleFactor: 1 });
  const fehler = [];
  s.on('pageerror', (x) => fehler.push('pageerror: ' + String(x).slice(0, 160)));
  s.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 160)); });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1400);

  /* Ein Brett aufschlagen — sonst prueft die Regel nichts. Echter Mausklick
     auf die Mitte einer echten Trefferflaeche, kein element.click(). */
  const auf = async (zug) => {
    const l = await s.evaluate((z) => {
      const el = document.querySelector(`[data-zug="${z}"]`);
      if (!el || el.disabled) return null;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return null;
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }, zug);
    if (!l) return false;
    await s.mouse.click(l.x, l.y);
    await s.waitForTimeout(260);
    return true;
  };
  const reiter = await s.evaluate(() =>
    [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map((x) => x.getAttribute('data-zug')));
  for (const r of reiter.slice(0, 3)) await auf(r);
  await auf('stadt:bauhof');

  let klicks = 0;
  for (let i = 0; i < WOCHEN; i++) {
    if (await auf('weiter')) klicks++;
    else break;
  }
  await s.waitForTimeout(900);

  const d = await s.evaluate(() => {
    const B = window.BRAUHAUS;
    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, lage: B.lage.length,
      schneidet: B.stadt.rahmen.schneidet(),
      verdeckt: B.stadt.rahmen.verdeckt(),
      bauhof: B.stadt.rahmen.bauhof(),
      verdeckteKarten: [...document.querySelectorAll('.stadt-verdeckt')]
        .map((x) => String(x.className).slice(0, 40)),
      offen: Object.entries(B.stadt.rahmen.lage()).filter(([, v]) => v === 'auf').map(([k]) => k),
      blattkinder: [...document.querySelectorAll('#ebene-blatt > *')].length
    };
  });
  await s.screenshot({ path: `${AUS}/gespielt-e${e}.png` });
  const ok = !fehler.length && !d.lage && !d.schneidet.length && !d.verdeckt.length;
  if (!ok) schlecht++;
  console.log(`E${e} ${ok ? 'OK ' : 'XX '} ${klicks} Klicks -> ${d.jahr}/${d.woche}`
    + ` · lage=${d.lage} fehler=${fehler.length} · Lade ${d.bauhof}`
    + ` · schneidet ${d.schneidet.length} · verdeckt ${d.verdeckt.length}`
    + ` · offene Bretter ${d.offen.length} · verdeckte Karten ${d.verdeckteKarten.length}`
    + ` · BLATT-KINDER ${d.blattkinder}`);
  if (d.schneidet.length) console.log('    ! ' + JSON.stringify(d.schneidet).slice(0, 400));
  if (d.verdeckt.length) console.log('    ! ' + JSON.stringify(d.verdeckt).slice(0, 400));
  if (d.verdeckteKarten.length) console.log('    verdeckte Karten: ' + d.verdeckteKarten.join(' | '));
  fehler.slice(0, 3).forEach((f) => console.log('    ! ' + f));
  await s.close();
}
await b.close();
console.log(schlecht ? `${schlecht} Epochen mit Befund` : 'alle Epochen sauber');
