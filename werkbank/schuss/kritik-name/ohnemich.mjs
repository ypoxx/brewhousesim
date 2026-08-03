// Was geschieht am NAMEN, wenn ich nur WEITER klicke? Sechs Braujahre.
//   node ohnemich.mjs <epoche> <saat> <marke>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';
const [ep, saat, marke] = process.argv.slice(2);
const out = '/home/user/brewhousesim/werkbank/schuss/kritik-name';
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=${saat}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1000);
const klick = z => seite.evaluate(zz => { const e = [...document.querySelectorAll(`[data-zug="${zz}"]`)].find(x => !x.disabled); if (!e) return false; e.click(); return true; }, z);
const stand = () => seite.evaluate(() => ({
  jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche, kasse: BRAUHAUS.welt.haus.kasse,
  ruf: document.querySelector('[data-ruf]')?.getAttribute('data-ruf'),
  bekannt: document.querySelector('[data-bekannt]')?.getAttribute('data-bekannt'),
  entzug: document.querySelector('[data-entzug]')?.getAttribute('data-entzug'),
  entzugBis: document.querySelector('[data-entzug-bis]')?.getAttribute('data-entzug-bis'),
  reiter: document.querySelector('[data-zug="stadt:reiter:name-nm-band"]')?.innerText.replace(/\s+/g, ' '),
  gegner: document.querySelector('.gg-bandzahl')?.textContent,
  gegnerNeu: document.querySelector('.gg-bandneu')?.textContent,
  nachgeahmt: !!document.querySelector('.nm-nachgeahmt'),
  bandKurz: (document.querySelector('.nm-band')?.innerText || '').replace(/\s*\n\s*/g, ' | ').slice(0, 160),
}));
const spur = [];
spur.push({ ...(await stand()), i: -1 });
for (let i = 0; i < 180; i++) {
  await seite.locator('[data-zug="weiter"]').first().click({ timeout: 8000 }).catch(() => {});
  await seite.waitForTimeout(60);
  const s = await stand();
  spur.push({ ...s, i });
  if (await seite.evaluate(() => BRAUHAUS.welt.zeit.ende)) break;
}
await klick('stadt:reiter:name-nm-band'); await seite.waitForTimeout(250);
await klick('name:blatt'); await seite.waitForTimeout(500);
await klick('name:reiter:register'); await seite.waitForTimeout(600);
await seite.screenshot({ path: `${out}/${marke}-register-ende.png` });
const reg = await seite.evaluate(() => {
  const k = document.querySelector('.nm-koerper');
  const zeilen = [...k.querySelectorAll('.nm-zeile, li, .nm-satz')].map(e => e.innerText.replace(/\s*\n\s*/g, ' · ').slice(0, 200));
  return { text: k.innerText.replace(/\s*\n\s*/g, ' | ').slice(0, 4000), zeilen, n: zeilen.length,
    kopf: document.querySelector('.nm-bkopf')?.innerText.replace(/\s*\n\s*/g, ' | ') };
});
await klick('name:reiter:aufgeld'); await seite.waitForTimeout(500);
const auf = await seite.evaluate(() => document.querySelector('.nm-koerper')?.innerText.replace(/\s*\n\s*/g, ' | ').slice(0, 1200));
writeFileSync(`${out}/${marke}-ohnemich.json`, JSON.stringify({ spur, reg, auf }, null, 1));
console.log('Wochen', spur.length - 1, 'Endstand', JSON.stringify(spur[spur.length - 1]));
console.log('REGISTERKOPF:', reg.kopf);
console.log('REGISTER n=', reg.n);
console.log(reg.text.slice(0, 2600));
console.log('AUFGELD:', auf);
await browser.close();
