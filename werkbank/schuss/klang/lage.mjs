// ===========================================================================
// werkbank/schuss/klang/lage.mjs — das Abnahmetor fuer DEN KLANG.
//
// Laedt alle vier Epochen, klickt einmal (der Browser gibt Ton erst nach einer
// Handlung frei), und meldet je Epoche:
//   BRAUHAUS.lage.length · Konsolenfehler · AudioContext-Zustand · ob der
//   Tonbus bereit ist · welche Proben geladen sind.
//
//   node werkbank/schuss/klang/lage.mjs
//   node werkbank/schuss/klang/lage.mjs http://127.0.0.1:8899/spiel/
// ===========================================================================

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const basis = process.argv[2] || 'http://127.0.0.1:8899/spiel/';

const browser = await chromium.launch({
  args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio']
});

let schlecht = 0;

for (const epoche of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push('pageerror: ' + e));
  seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
  seite.on('requestfailed', (r) => fehler.push('404/fail: ' + r.url()));

  await seite.goto(`${basis}?epoche=${epoche}&saat=1350`,
                   { waitUntil: 'domcontentloaded', timeout: 60000 });
  await seite.waitForSelector('#buehne[data-bereit="1"]', { timeout: 30000 });
  await seite.waitForTimeout(700);

  // Eine echte Handlung — genau die, die der Browser sehen will.
  await seite.mouse.click(688, 740);
  await seite.waitForTimeout(1800);

  const b = await seite.evaluate(() => ({
    lage: BRAUHAUS.lage.length,
    lageText: BRAUHAUS.lage.slice(0, 4).map(String),
    bereit: BRAUHAUS.ton.bereit(),
    stumm: BRAUHAUS.ton.stumm,
    knopf: !!document.querySelector('[data-zug="klang:ton"]'),
    zuege: document.querySelectorAll('button[data-zug]:not([disabled])').length
  }));

  const gut = b.lage === 0 && fehler.length === 0;
  if (!gut) schlecht++;
  console.log(`E${epoche}  lage=${b.lage}  bereit=${b.bereit}  stumm=${b.stumm}  ` +
              `schalter=${b.knopf}  zuege=${b.zuege}  ` +
              (fehler.length ? 'FEHLER AUF DER SEITE' : 'keine Fehler auf der Seite'));
  if (b.lage) console.log('   lage: ' + b.lageText.join(' | '));
  fehler.slice(0, 6).forEach((f) => console.log('   ' + f.slice(0, 240)));
  await seite.close();
}

await browser.close();
console.log(schlecht ? `\n${schlecht} von 4 Epochen mit Befund.` : '\n4 von 4 Epochen sauber.');
