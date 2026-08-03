// Zaehlt DEN NAMEN am Bildschirm: Zeilen mit Preisschild, gesperrte, unwiderrufliche,
// Deckelung, Register, Aufgeld. Optional nach n Wochen Spiel.
//   node namezaehlung.mjs <epoche> <saat> <wochen> <marke>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [ep, saat, wochenS, marke] = process.argv.slice(2);
const wochen = +(wochenS || 0);
const out = '/home/user/brewhousesim/werkbank/schuss/kritik-name';
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=${saat}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1000);
const klick = z => seite.evaluate(zz => { const e = [...document.querySelectorAll(`[data-zug="${zz}"]`)].find(x => !x.disabled); if (!e) return false; e.click(); return true; }, z);
// spielen: liefern
for (let i = 0; i < wochen; i++) {
  await seite.evaluate(() => { const g = BRAUHAUS.welt; if (g.haus.rohstoff < g.vorrat.plaetze * 2 && g.haus.kasse > 80) { const e = document.querySelector('[data-zug="fuhre:kauf:rohstoff"]'); if (e && !e.disabled) e.click(); } });
  await klick('fuhre:fuellen'); await klick('fuhre:ziel:bar'); await klick('fuhre:abschicken');
  await seite.waitForTimeout(50);
  await seite.locator('[data-zug="weiter"]').first().click(); await seite.waitForTimeout(70);
}
await klick('stadt:reiter:name-nm-band'); await seite.waitForTimeout(250);
await seite.screenshot({ path: `${out}/${marke}-band.png` });
await klick('name:blatt'); await seite.waitForTimeout(600);
await seite.screenshot({ path: `${out}/${marke}-zeichen.png` });

const zeichen = await seite.evaluate(() => {
  const bl = document.querySelector('.nm-blatt');
  const karten = [...bl.querySelectorAll('.nm-karte')].map(k => ({
    text: k.innerText.replace(/\s*\n\s*/g, ' | ').slice(0, 220),
    knopf: k.querySelector('[data-zug]')?.getAttribute('data-zug') || null,
    preis: k.querySelector('[data-preis]')?.getAttribute('data-preis') || null,
    aus: !!k.querySelector('[data-zug]')?.disabled,
    unwiderruflich: /unwiderruflich/i.test(k.textContent),
  }));
  const nebeneinander = [...bl.querySelectorAll('[data-zug][data-preis]')].filter(e => {
    const b = e.getBoundingClientRect(); const t = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
    return b.width > 2 && b.height > 2 && (t === e || e.contains(t));
  }).map(e => ({ z: e.getAttribute('data-zug'), p: +e.getAttribute('data-preis'), aus: e.disabled }));
  return {
    kopf: bl.querySelector('.nm-bkopf')?.innerText.replace(/\s*\n\s*/g, ' | '),
    abschnitte: [...bl.querySelectorAll('h3,.nm-abschnitt')].map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 120)),
    karten, nebeneinander,
    ganzerText: bl.innerText.replace(/\s*\n\s*/g, ' | '),
    kasse: BRAUHAUS.welt.haus.kasse, jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
  };
});
console.log('=== ZEICHEN ===');
console.log(JSON.stringify(zeichen, null, 1).slice(0, 7000));
await klick('name:reiter:register'); await seite.waitForTimeout(500);
await seite.screenshot({ path: `${out}/${marke}-register.png` });
const reg = await seite.evaluate(() => document.querySelector('.nm-koerper')?.innerText.replace(/\s*\n\s*/g, ' | ').slice(0, 3000));
console.log('=== REGISTER ===\n', reg);
await klick('name:reiter:aufgeld'); await seite.waitForTimeout(500);
await seite.screenshot({ path: `${out}/${marke}-aufgeld.png` });
const auf = await seite.evaluate(() => document.querySelector('.nm-koerper')?.innerText.replace(/\s*\n\s*/g, ' | ').slice(0, 2500));
console.log('=== AUFGELD ===\n', auf);
await browser.close();
