/* DIE VOLLPROBE, zweiter Anlauf — ohne Gewalt.

   Der erste Anlauf ist an sich selbst gescheitert: ein Klick "mit Gewalt"
   auf die Koordinaten eines verdeckten Knopfes trifft den Knopf, der
   DARUEBER liegt — und das war der Wiederanfang. Ab da mass der Lauf eine
   neue Partie.

   Also zwei Durchgaenge, beide ohne Gewalt:
     A  el.click() programmatisch auf JEDEN Zug. Erreicht auch den
        verdeckten Knopf und laeuft durch jeden Horcher, den er hat. Ein
        gesperrter Knopf tut dabei nichts (HTML-Norm), ein freier wird vom
        Fanghorcher geschluckt.
     B  echte Maus, aber nur dort, wo elementFromPoint den Knopf auch
        liefert — das ist, was ein Mensch treffen kann.
   Ausgenommen sind die zwei Zuege, die absichtlich woanders hinfuehren. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import { neueSeite, ZUEGE, STAND, AUS } from './messe.mjs';
const AUS_ZUG = ['fuhre:wiederanfang', 'fuhre:urteil-auf'];
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
  for (const r of await seite.$$eval('[data-zug^="stadt:reiter:"]', e => e.map(x => x.getAttribute('data-zug')))) {
    const el = await seite.$(`[data-zug="${r}"]`);
    if (el) { try { await el.click({ timeout: 500 }); } catch {} await seite.waitForTimeout(30); } }
  const zuege = await seite.evaluate(ZUEGE);
  const namen = [...new Set(zuege.map(x => x.zug))].filter(z => AUS_ZUG.indexOf(z) < 0);
  const startURL = seite.url();
  const vor = await seite.evaluate(STAND);
  const gebucht = []; let a1 = 0, b1 = 0;
  for (const z of namen) {
    let a; try { a = await seite.evaluate(STAND); } catch { break; }
    const el = await seite.$(`[data-zug="${z}"]`); if (!el) continue;
    try { await el.evaluate(e => e.click()); a1++; } catch {}
    await seite.waitForTimeout(60);
    if (seite.url() !== startURL) { console.log('   NEUE PARTIE (A) bei', z); break; }
    let b; try { b = await seite.evaluate(STAND); } catch { break; }
    if (b.kasse !== a.kasse || b.protokoll !== a.protokoll || b.chronik !== a.chronik)
      gebucht.push({ durchgang: 'A', zug: z, dKasse: b.kasse - a.kasse, dBuch: b.protokoll - a.protokoll });
  }
  for (const z of namen) {
    let a; try { a = await seite.evaluate(STAND); } catch { break; }
    const p = await seite.evaluate(zz => { const el = document.querySelector(`[data-zug="${zz}"]`);
      if (!el) return null; const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return null;
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const t = document.elementFromPoint(x, y);
      return (t && (t === el || el.contains(t))) ? { x, y } : null; }, z);
    if (!p) continue;
    try { await seite.mouse.click(p.x, p.y); b1++; } catch {}
    await seite.waitForTimeout(60);
    if (seite.url() !== startURL) { console.log('   NEUE PARTIE (B) bei', z); break; }
    let b; try { b = await seite.evaluate(STAND); } catch { break; }
    if (b.kasse !== a.kasse || b.protokoll !== a.protokoll || b.chronik !== a.chronik)
      gebucht.push({ durchgang: 'B', zug: z, dKasse: b.kasse - a.kasse, dBuch: b.protokoll - a.protokoll });
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
    klicksA: a1, klicksB: b1, gebucht, kenn,
    dKasse: nach.kasse - vor.kasse, dBuch: nach.protokoll - vor.protokoll,
    dChronik: nach.chronik - vor.chronik, lage: nach.lage, fehler };
  console.log(`${weg} E${ep} ${s.endgrund} | ${zuege.length} Zuege · ${zuege.filter(x=>x.aus).length} gesperrt`
    + ` · ${zuege.filter(x=>!x.aus&&x.sichtbar).length} aktiv+sichtbar · ${zuege.filter(x=>!x.aus&&x.frei).length} treffbar`
    + ` | Klicks A ${a1} B ${b1} · gebucht ${gebucht.length}`
    + ` (Kasse ${nach.kasse-vor.kasse}, Buch ${nach.protokoll-vor.protokoll}, Chronik ${nach.chronik-vor.chronik})`
    + ` | Kennzahl Kern ${kenn.kern} Gegner ${kenn.gegner} | lage ${nach.lage} fehler ${fehler.length}`);
  await seite.close();
}}
await browser.close();
fs.writeFileSync(`${AUS}vollprobe.json`, JSON.stringify(erg, null, 1));
