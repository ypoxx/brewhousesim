import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { neueSeite, ZUEGE, STAND } from './messe.mjs';
const ep = +(process.argv[2] || 4);
const ZIEL = process.argv.slice(3);
const browser = await chromium.launch();
const { seite, fehler } = await neueSeite(browser, ep);
for (let i = 0; i < 130; i++) {
  const s = await seite.evaluate(STAND); if (s.ende) break;
  const a = await seite.$('[data-zug="fuhre:ausgang:ja"]');
  if (a) { await a.click(); await seite.waitForTimeout(150); break; }
  const w = await seite.$('[data-zug="weiter"]'); if (!w || await w.isDisabled()) break;
  await w.click(); await seite.waitForTimeout(30);
}
console.log('ENDE:', JSON.stringify(await seite.evaluate(STAND), null, 0).slice(0, 400));
for (const z of ZIEL) {
  const a = await seite.evaluate(STAND);
  const el = await seite.$(`[data-zug="${z}"]`);
  if (!el) { console.log(z, 'NICHT DA'); continue; }
  const info = await el.evaluate(e => { const r = e.getBoundingClientRect();
    const t = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2);
    return { aus: e.disabled, r: [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)],
      trifft: !!(t && (t===e || e.contains(t))), decker: t ? (t.closest('[data-zug]')?.getAttribute('data-zug') || t.className) : null }; });
  let err = null;
  try { await el.click({ timeout: 1500 }); } catch (e) { err = String(e.message).split('\n')[0]; }
  await seite.waitForTimeout(120);
  const b = await seite.evaluate(STAND);
  console.log(z, JSON.stringify(info), 'err=', err,
    'dKasse=', b.kasse - a.kasse, 'dBuch=', b.protokoll - a.protokoll, 'dChronik=', b.chronik - a.chronik);
}
console.log('fehler', fehler);
await browser.close();
