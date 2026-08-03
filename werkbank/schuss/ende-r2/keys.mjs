import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import { neueSeite, STAND } from './messe.mjs';
const browser = await chromium.launch();
const alles = {};
for (const ep of [1,2,3,4]) {
  const { seite } = await neueSeite(browser, ep);
  for (let i = 0; i < 130; i++) {
    const s = await seite.evaluate(STAND); if (s.ende) break;
    const a = await seite.$('[data-zug="fuhre:ausgang:ja"]');
    if (a) { await a.click(); await seite.waitForTimeout(150); break; }
    const w = await seite.$('[data-zug="weiter"]'); if (!w || await w.isDisabled()) break;
    await w.click(); await seite.waitForTimeout(28);
  }
  /* alle Reiter aufschlagen, damit auch verdeckte Knoepfe im DOM stehen */
  const reiter = await seite.$$eval('[data-zug^="stadt:reiter:"]', e => e.map(x => x.getAttribute('data-zug')));
  for (const r of reiter) { const el = await seite.$(`[data-zug="${r}"]`);
    if (el) { try { await el.click({timeout:600}); } catch {} await seite.waitForTimeout(40); } }
  const liste = await seite.evaluate(() => {
    const m = [];
    document.querySelectorAll('[data-zug]').forEach(el => {
      const fach = el.closest('.fach');
      m.push({ zug: el.getAttribute('data-zug'), tag: el.tagName,
        knopf: el.classList.contains('knopf'), aus: !!el.disabled,
        preis: el.getAttribute('data-preis'),
        stueck: fach ? fach.getAttribute('data-stueck') : null,
        text: (el.textContent||'').trim().replace(/\s+/g,' ').slice(0,40) });
    });
    return m;
  });
  alles['e'+ep] = liste;
  console.log('E'+ep, liste.length, 'zuege; rohbuttons:', liste.filter(z=>!z.knopf).length);
  await seite.close();
}
await browser.close();
fs.writeFileSync('/home/user/brewhousesim/werkbank/schuss/ende-r2/keys.json', JSON.stringify(alles,null,1));
const roh = new Set(), kn = new Set();
for (const k in alles) alles[k].forEach(z => (z.knopf?kn:roh).add(z.zug.replace(/:[^:]*$/, m=>m)));
console.log('\n--- ROHE BUTTONS (nicht via B.knopf) ---'); console.log([...roh].sort().join('\n'));
