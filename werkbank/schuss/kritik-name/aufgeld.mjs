// Spielt vernuenftig und liest danach das AUFGELD-Buch des NAMENs ab.
//   node aufgeld.mjs <epoche> <saat> <wochen> <marke> [ruhe:1]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';
const [ep, saat, wochenS, marke, ruheS] = process.argv.slice(2);
const wochen = +(wochenS || 90);
const out = '/home/user/brewhousesim/werkbank/schuss/kritik-name';
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=${saat}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1000);
const klick = z => seite.evaluate(zz => { const e = [...document.querySelectorAll(`[data-zug="${zz}"]`)].find(x => !x.disabled); if (!e) return false; e.click(); return true; }, z);
if (ruheS === '1') { await klick('stadt:reiter:name-nm-band'); await seite.waitForTimeout(200); await klick('name:ruhe'); await seite.waitForTimeout(200); await klick('stadt:reiter:name-nm-band'); await seite.waitForTimeout(150); }
const marken = [];
for (let i = 0; i < wochen; i++) {
  await seite.evaluate(() => { const g = BRAUHAUS.welt; if (g.haus.rohstoff < g.vorrat.plaetze * 2.5 && g.haus.kasse > 80) { const e = document.querySelector('[data-zug="fuhre:kauf:rohstoff"]'); if (e && !e.disabled) e.click(); } });
  await klick('fuhre:fuellen'); await klick('fuhre:ziel:bar'); await klick('fuhre:abschicken');
  await seite.waitForTimeout(45);
  await seite.locator('[data-zug="weiter"]').first().click({ timeout: 8000 }).catch(() => {});
  await seite.waitForTimeout(55);
  if (i % 15 === 0) marken.push(await seite.evaluate(() => {
    const W = BRAUHAUS.welt; const b = document.querySelector('.nm-band');
    return { j: W.zeit.jahr, w: W.zeit.woche, kasse: W.haus.kasse,
      ruf: document.querySelector('[data-ruf]')?.getAttribute('data-ruf'),
      aufJahr: document.querySelector('[data-aufgeld-jahr]')?.getAttribute('data-aufgeld-jahr'),
      aufGes: document.querySelector('[data-aufgeld-gesamt]')?.getAttribute('data-aufgeld-gesamt'),
      fasspreis: document.querySelector('[data-fasspreis]')?.getAttribute('data-fasspreis'),
      aufschlag: document.querySelector('[data-aufschlag]')?.getAttribute('data-aufschlag'),
      entzug: document.querySelector('[data-entzug]')?.getAttribute('data-entzug') };
  }));
  if (await seite.evaluate(() => BRAUHAUS.welt.zeit.ende)) break;
}
await klick('stadt:reiter:name-nm-band'); await seite.waitForTimeout(250);
await seite.screenshot({ path: `${out}/${marke}-band.png` });
await klick('name:blatt'); await seite.waitForTimeout(400);
await klick('name:reiter:aufgeld'); await seite.waitForTimeout(600);
await seite.screenshot({ path: `${out}/${marke}-aufgeldbuch.png` });
const auf = await seite.evaluate(() => document.querySelector('.nm-koerper')?.innerText.replace(/\s*\n\s*/g, ' | ').slice(0, 3500));
const kopf = await seite.evaluate(() => document.querySelector('.nm-bkopf')?.innerText.replace(/\s*\n\s*/g, ' | '));
writeFileSync(`${out}/${marke}-aufgeld.json`, JSON.stringify({ marken, auf, kopf }, null, 1));
console.log('MARKEN:'); marken.forEach(m => console.log(' ', JSON.stringify(m)));
console.log('KOPF:', kopf);
console.log('AUFGELD:', auf);
await browser.close();
