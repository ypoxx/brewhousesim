/* DAS ABNAHMETOR — vier Epochen laden, nichts anklicken, hinsehen.
   BRAUHAUS.lage.length === 0 · keine Seiten- und Konsolenfehler ·
   die Kopfzeile · und der Satz auf der Karte der unwiderruflichen Wahl.

   HAFEN=8901 node tor.mjs
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = process.env.HAFEN || '8901';
const SAAT = process.env.SAAT || '1350';
const browser = await chromium.launch();
let schlecht = 0;

for (const ep of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
  const fehler = [];
  seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 160)));
  seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 160)); });
  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(1200);

  /* Die Michaelitafel aufschlagen — sonst steht die Karte nicht am Schirm. */
  const griff = await seite.$('[data-zug="preis:tafel"]');
  if (griff) { await griff.click(); await seite.waitForTimeout(700); }

  const d = await seite.evaluate(() => {
    const B = window.BRAUHAUS;
    const kopf = document.querySelector('.deckung');
    const karten = [...document.querySelectorAll('.pr-fest')].map(k => {
      const s = k.querySelector('.pr-satz-klein');
      return { name: (k.querySelector('.pr-fest-name') || {}).textContent || '',
               satz: s ? s.textContent.replace(/\s+/g, ' ').trim() : null };
    });
    const lasten = [...document.querySelectorAll('.pr-last, .pr-kommend, .pr-kommend-zeile')]
      .map(e => e.textContent.replace(/\s+/g, ' ').trim()).slice(0, 8);
    return {
      lage: B.lage.length,
      jahr: B.welt.zeit.jahr, amtszeit: B.welt.zeit.amtszeit ? B.welt.zeit.amtszeit.nr : null,
      amtBis: B.welt.zeit.amtszeit ? B.welt.zeit.amtszeit.bis : null,
      kopf: kopf ? kopf.textContent.replace(/\s+/g, ' ').trim() : null,
      karten, lasten,
      zuege: document.querySelectorAll('[data-zug]').length
    };
  });
  await seite.close();

  const ok = d.lage === 0 && fehler.length === 0;
  if (!ok) schlecht++;
  console.log(`E${ep}  lage ${d.lage}  Fehler ${fehler.length}  Zuege ${d.zuege}  `
    + `Amtszeit ${d.amtszeit} (bis-Wuerfel ${d.amtBis})  ${ok ? 'OK' : 'SCHLECHT'}`);
  console.log(`     Kopfzeile: ${d.kopf}`);
  d.karten.slice(0, 2).forEach(k => console.log(`     Karte "${k.name}": ${k.satz}`));
  if (d.lasten.length) console.log(`     kommende Lasten: ${d.lasten.slice(0, 3).join(' | ')}`);
  fehler.forEach(f => console.log('     ' + f));
}
console.log(schlecht ? `TOR: ${schlecht} Epochen schlecht` : 'TOR: alle vier Epochen sauber');
await browser.close();
