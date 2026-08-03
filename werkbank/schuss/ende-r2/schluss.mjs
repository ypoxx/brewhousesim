/* Der Abnahmelauf: beide Enden, alle vier Epochen, alles auf einmal. */
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
  const kenn = await seite.evaluate(() => {
    const k = document.querySelector('.deckung[data-deckung]');
    const g = document.querySelector('.gg-kennzahl[data-umkaempft]');
    return { kern: !!(k && k.getClientRects().length), gegner: !!(g && g.getClientRects().length),
      textWirbt: /nächster Zug:|Kasse reicht/.test(document.body.innerText || '') };
  });
  const zuege = await seite.evaluate(ZUEGE);
  /* alles anklicken, force und programmatisch */
  const vor = await seite.evaluate(STAND);
  const startURL = seite.url();
  const gebucht = [];
  for (const z of [...new Set(zuege.map(x => x.zug))].filter(x => x !== 'fuhre:wiederanfang')) {
    let a; try { a = await seite.evaluate(STAND); } catch { break; }
    const el = await seite.$(`[data-zug="${z}"]`); if (!el) continue;
    try { await el.click({ force: true, timeout: 700 }); } catch {}
    try { await el.evaluate(e => e.click()); } catch {}
    await seite.waitForTimeout(25);
    /* Traf der Zeiger doch den Wiederanfang, der ueber dem Knopf liegt, ist
       die Partie neu — ab da misst man ein anderes Spiel. Sofort aufhoeren. */
    if (seite.url() !== startURL) { console.log('   NEUE PARTIE bei', z, '— Lauf hier zu Ende'); break; }
    let b; try { b = await seite.evaluate(STAND); } catch { console.log('   NAVIGIERT bei', z); break; }
    if (b.kasse !== a.kasse || b.protokoll !== a.protokoll || b.chronik !== a.chronik)
      gebucht.push({ zug: z, dKasse: b.kasse - a.kasse });
  }
  let nach; try { nach = await seite.evaluate(STAND); } catch { nach = vor; }
  if (weg === 'nein') await seite.screenshot({ path: `${AUS}siegel-e${ep}.png` });
  erg[weg + '-e' + ep] = { ende: s.endgrund, jahr: s.jahr, kasse: s.kasse,
    zuege: zuege.length, aus: zuege.filter(z => z.aus).length,
    offenSichtbar: zuege.filter(z => !z.aus && z.sichtbar).length,
    offenGetroffen: zuege.filter(z => !z.aus && z.frei).length,
    kenn, gebucht, dKasse: nach.kasse - vor.kasse, dBuch: nach.protokoll - vor.protokoll,
    lage: nach.lage, fehler };
  console.log(`${weg} E${ep} ${s.endgrund} | ${zuege.length} Zuege, ${zuege.filter(z=>z.aus).length} gesperrt,`
    + ` ${zuege.filter(z=>!z.aus&&z.frei).length} noch treffbar | gebucht ${gebucht.length} (${nach.kasse-vor.kasse})`
    + ` | Kennzahl Kern ${kenn.kern} Gegner ${kenn.gegner} | lage ${nach.lage} fehler ${fehler.length}`);
  await seite.close();
}}
await browser.close();
fs.writeFileSync(`${AUS}schluss.json`, JSON.stringify(erg, null, 1));
