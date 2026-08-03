// A/B: derselbe Wirt, einmal ohne und einmal mit den Zuegen des NAMENs.
//   node ab.mjs <epoche> <saat> <wochen> <variante> <marke>
// variante: ohne | mit | ruhe
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';
const [ep, saat, wochenS, variante, marke] = process.argv.slice(2);
const wochen = +(wochenS || 90);
const out = '/home/user/brewhousesim/werkbank/schuss/kritik-name';
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=${saat}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1000);
const klick = z => seite.evaluate(zz => { const e = [...document.querySelectorAll(`[data-zug="${zz}"]`)].find(x => !x.disabled); if (!e) return false; e.click(); return true; }, z);
const alleNameZuege = { 1: ['name:zeiger', 'name:zunftzeichen', 'name:umtrunk'], 2: ['name:schild', 'name:krug', 'name:kirchweih'], 3: ['name:etikett', 'name:plakat', 'name:saeule', 'name:annonce'], 4: ['name:kronkorken', 'name:bande', 'name:bierdeckel', 'name:kastenaktion'] }[+ep];
let jahrAlt = null, gekauft = [];
if (variante === 'ruhe') { await klick('stadt:reiter:name-nm-band'); await seite.waitForTimeout(200); await klick('name:ruhe'); await seite.waitForTimeout(200); await klick('stadt:reiter:name-nm-band'); await seite.waitForTimeout(150); }
for (let i = 0; i < wochen; i++) {
  const j = await seite.evaluate(() => BRAUHAUS.welt.zeit.jahr);
  if (variante === 'mit' && j !== jahrAlt) {
    jahrAlt = j;
    await klick('stadt:reiter:name-nm-band'); await seite.waitForTimeout(180);
    await klick('name:blatt'); await seite.waitForTimeout(350);
    for (const z of alleNameZuege) {
      const ok = await seite.evaluate(zz => {
        const e = [...document.querySelectorAll(`[data-zug="${zz}"]`)].find(x => !x.disabled);
        if (!e) return null;
        const pr = +(e.getAttribute('data-preis') || 0);
        if (-pr > BRAUHAUS.welt.haus.kasse * 0.5) return 'zu teuer';
        e.click(); return 'ja ' + pr;
      }, z);
      if (ok && ok.startsWith('ja')) gekauft.push(`${j} ${z} ${ok}`);
      await seite.waitForTimeout(120);
    }
    await klick('name:blatt-zu'); await seite.waitForTimeout(150);
    await klick('stadt:reiter:name-nm-band'); await seite.waitForTimeout(150);
  }
  await seite.evaluate(() => { const g = BRAUHAUS.welt; if (g.haus.rohstoff < g.vorrat.plaetze * 2.5 && g.haus.kasse > 80) { const e = document.querySelector('[data-zug="fuhre:kauf:rohstoff"]'); if (e && !e.disabled) e.click(); } });
  await klick('fuhre:fuellen'); await klick('fuhre:ziel:bar'); await klick('fuhre:abschicken');
  await seite.waitForTimeout(45);
  await seite.locator('[data-zug="weiter"]').first().click({ timeout: 8000 }).catch(() => {});
  await seite.waitForTimeout(50);
  if (await seite.evaluate(() => BRAUHAUS.welt.zeit.ende)) break;
}
const end = await seite.evaluate(() => ({
  jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche, kasse: BRAUHAUS.welt.haus.kasse,
  ruf: document.querySelector('[data-ruf]')?.getAttribute('data-ruf'),
  bekannt: document.querySelector('[data-bekannt]')?.getAttribute('data-bekannt'),
  aufGes: document.querySelector('[data-aufgeld-gesamt]')?.getAttribute('data-aufgeld-gesamt'),
  aufschlag: document.querySelector('[data-aufschlag]')?.getAttribute('data-aufschlag'),
  entzug: document.querySelector('[data-entzug]')?.getAttribute('data-entzug'),
  reiter: document.querySelector('[data-zug="stadt:reiter:name-nm-band"]')?.innerText.replace(/\s+/g, ' '),
  ende: BRAUHAUS.welt.zeit.ende,
}));
await klick('stadt:reiter:name-nm-band'); await seite.waitForTimeout(300);
await seite.screenshot({ path: `${out}/${marke}.png` });
const band = await seite.evaluate(() => (document.querySelector('.nm-band')?.innerText || '').replace(/\s*\n\s*/g, ' | ').slice(0, 420));
writeFileSync(`${out}/${marke}.json`, JSON.stringify({ variante, end, gekauft, band }, null, 1));
console.log(variante, JSON.stringify(end));
console.log('gekauft:', gekauft.join(' ; '));
console.log('band:', band);
await browser.close();
