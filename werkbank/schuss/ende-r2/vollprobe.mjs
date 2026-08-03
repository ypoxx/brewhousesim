/* DIE VOLLPROBE: nach dem Ende JEDEN Zug wirklich anklicken, und zwar
   alle. Damit der Lauf nicht an sich selbst scheitert, wird das Urteil
   vorher mit Escape beiseitegelegt — dann liegt der Wiederanfang nicht mehr
   ueber fremden Knoepfen und kann den Lauf nicht in eine neue Partie
   schicken. Uebrig bleiben der Griff (nicht geklickt) und alles andere. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import { neueSeite, ZUEGE, STAND, AUS } from './messe.mjs';
const browser = await chromium.launch();
const erg = {};
for (const weg of ['ja', 'nein']) {
for (const ep of [1, 2, 3, 4]) {
  const { seite, fehler } = await neueSeite(browser, ep);
  for (let i = 0; i < 140; i++) {
    const s = await seite.evaluate(STAND); if (s.ende) break;
    const a = await seite.$('[data-zug="fuhre:ausgang:ja"]');
    if (a && weg === 'ja') { await a.click(); await seite.waitForTimeout(150); break; }
    const w = await seite.$('[data-zug="weiter"]'); if (!w || await w.isDisabled()) break;
    await w.click(); await seite.waitForTimeout(24);
  }
  const s = await seite.evaluate(STAND);
  await seite.keyboard.press('Escape'); await seite.waitForTimeout(200);
  /* alle Bretter aufschlagen, damit auch die verdeckten Zuege drankommen */
  for (const r of await seite.$$eval('[data-zug^="stadt:reiter:"]', e => e.map(x => x.getAttribute('data-zug')))) {
    const el = await seite.$(`[data-zug="${r}"]`);
    if (el) { try { await el.click({ timeout: 500 }); } catch {} await seite.waitForTimeout(30); } }
  const zuege = await seite.evaluate(ZUEGE);
  const startURL = seite.url();
  const vor = await seite.evaluate(STAND);
  const gebucht = [], geklickt = [];
  for (const z of [...new Set(zuege.map(x => x.zug))]) {
    if (z === 'fuhre:urteil-auf' || z === 'fuhre:wiederanfang') continue;
    let a; try { a = await seite.evaluate(STAND); } catch { break; }
    const el = await seite.$(`[data-zug="${z}"]`); if (!el) continue;
    try { await el.click({ force: true, timeout: 600 }); geklickt.push(z); } catch {}
    try { await el.evaluate(e => e.click()); } catch {}
    await seite.waitForTimeout(25);
    if (seite.url() !== startURL) { console.log('   NEUE PARTIE bei', z); break; }
    let b; try { b = await seite.evaluate(STAND); } catch { break; }
    if (b.kasse !== a.kasse || b.protokoll !== a.protokoll || b.chronik !== a.chronik)
      gebucht.push({ zug: z, dKasse: b.kasse - a.kasse, dBuch: b.protokoll - a.protokoll });
  }
  let nach; try { nach = await seite.evaluate(STAND); } catch { nach = vor; }
  const kenn = await seite.evaluate(() => {
    const k = document.querySelector('.deckung[data-deckung]');
    const g = document.querySelector('.gg-kennzahl[data-umkaempft]');
    return { kern: !!(k && k.getClientRects().length), gegner: !!(g && g.getClientRects().length) }; });
  if (weg === 'nein') await seite.screenshot({ path: `${AUS}siegel-e${ep}.png` });
  erg[weg + '-e' + ep] = { ende: s.endgrund, zuege: zuege.length,
    gesperrt: zuege.filter(x => x.aus).length,
    offenSichtbar: zuege.filter(x => !x.aus && x.sichtbar).length,
    offenGetroffen: zuege.filter(x => !x.aus && x.frei).length,
    geklickt: geklickt.length, gebucht, kenn,
    dKasse: nach.kasse - vor.kasse, dBuch: nach.protokoll - vor.protokoll,
    dChronik: nach.chronik - vor.chronik, lage: nach.lage, fehler };
  console.log(`${weg} E${ep} ${s.endgrund} | ${zuege.length} Zuege · ${zuege.filter(x=>x.aus).length} gesperrt`
    + ` · ${zuege.filter(x=>!x.aus&&x.sichtbar).length} noch aktiv+sichtbar · ${zuege.filter(x=>!x.aus&&x.frei).length} noch treffbar`
    + ` | ${geklickt.length} wirklich geklickt, gebucht ${gebucht.length}`
    + ` (Kasse ${nach.kasse-vor.kasse}, Buch ${nach.protokoll-vor.protokoll}, Chronik ${nach.chronik-vor.chronik})`
    + ` | Kennzahl Kern ${kenn.kern} Gegner ${kenn.gegner} | lage ${nach.lage} fehler ${fehler.length}`);
  await seite.close();
}}
await browser.close();
fs.writeFileSync(`${AUS}vollprobe.json`, JSON.stringify(erg, null, 1));
