/* Nach dem Ende muessen genau drei Wege offen bleiben: das Urteil lesen,
   es nach Escape zurueckholen, und von vorn anfangen. Und der Fund des
   Kritikers muss zu sein: stadt:versatz:pfanne nach dem Entzug der Pfanne. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { neueSeite, STAND, AUS } from './messe.mjs';
const browser = await chromium.launch();
/* Echte Maus, echte Koordinaten: erst nachsehen, was an der Stelle liegt,
   dann dorthin klicken. So misst der Klick dasselbe wie elementFromPoint. */
const mausAuf = async (seite, zug) => {
  const p = await seite.evaluate(z => { const el = document.querySelector(`[data-zug="${z}"]`);
    if (!el) return null; const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, zug);
  if (!p) return 'fehlt';
  await seite.mouse.click(p.x, p.y);
  await seite.waitForTimeout(300);
  return 'geklickt';
};
for (const [ep, weg] of [[1,'nein'],[4,'ja']]) {
  const { seite, fehler } = await neueSeite(browser, ep);
  for (let i = 0; i < 140; i++) {
    const s = await seite.evaluate(STAND); if (s.ende) break;
    const a = await seite.$('[data-zug="fuhre:ausgang:ja"]');
    if (a && weg === 'ja') { await a.click(); await seite.waitForTimeout(150); break; }
    const w = await seite.$('[data-zug="weiter"]'); if (!w || await w.isDisabled()) break;
    await w.click(); await seite.waitForTimeout(26);
  }
  const s0 = await seite.evaluate(STAND);
  const treffe = z => seite.evaluate(zz => { const el = document.querySelector(`[data-zug="${zz}"]`);
    if (!el) return 'fehlt'; const r = el.getBoundingClientRect();
    if (r.width < 2) return 'unsichtbar';
    const t = document.elementFromPoint(r.left + r.width/2, r.top + r.height/2);
    return (t && (t === el || el.contains(t))) ? 'trifft' : 'verdeckt:' + (t ? t.className : '?'); }, z);

  const wa1 = await treffe('fuhre:wiederanfang');
  /* Der Fund des Kritikers: der Versatz nach dem Entzug. */
  const pf = await seite.$('[data-zug="stadt:versatz:pfanne"]');
  let pfErg = 'kein Knopf';
  if (pf) { const a = await seite.evaluate(STAND);
    try { await pf.click({ force: true, timeout: 800 }); } catch {}
    try { await pf.evaluate(e => e.click()); } catch {}
    await seite.waitForTimeout(80);
    const b = await seite.evaluate(STAND);
    pfErg = `aus=${await pf.isDisabled()} dKasse=${b.kasse - a.kasse} dBuch=${b.protokoll - a.protokoll}`; }

  /* Escape legt das Urteil beiseite; der Reiter holt es zurueck. */
  await seite.keyboard.press('Escape'); await seite.waitForTimeout(150);
  const nachEsc = await treffe('fuhre:wiederanfang');
  const reiter = (await seite.$$eval('[data-zug^="stadt:reiter:fuhre-blatt-"]', e => e.map(x => x.getAttribute('data-zug'))))[0];
  if (reiter) { const el = await seite.$(`[data-zug="${reiter}"]`); if (el) { try { await el.click({timeout:1500}); } catch {} await seite.waitForTimeout(200); } }
  const nachReiter = await treffe('fuhre:wiederanfang');

  const griff = await treffe('fuhre:urteil-auf');
  const gk = await mausAuf(seite, 'fuhre:urteil-auf');
  const nachGriff = await treffe('fuhre:wiederanfang');
  console.log(`   Griff nach Escape: ${griff} · Maus ${gk} -> Urteil wieder da: ${nachGriff}`);
  const vorherURL = seite.url();
  await mausAuf(seite, 'fuhre:wiederanfang');
  await seite.waitForTimeout(900);
  const nachher = await seite.evaluate(STAND);
  console.log(`E${ep}/${weg} ende=${s0.endgrund} | wiederanfang ${wa1} · nach Escape ${nachEsc} · nach Reiter ${nachReiter}`);
  console.log(`   stadt:versatz:pfanne -> ${pfErg}`);
  console.log(`   Neuanfang: ${vorherURL.split('/spiel/')[1]}  ->  ${seite.url().split('/spiel/')[1]}`
    + `  jahr=${nachher.jahr} woche=${nachher.woche} kasse=${nachher.kasse} ende=${nachher.ende}`
    + `  hofZu=${await seite.evaluate(() => document.documentElement.getAttribute('data-hof-zu'))}`
    + `  lage=${nachher.lage} fehler=${fehler.length}`);
  await seite.screenshot({ path: `${AUS}wege-e${ep}.png` });
  await seite.close();
}
await browser.close();
