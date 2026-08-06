/* KAUFPROBE — geht Bauen noch, wenn die Lade zugeklappt liegt?
 *
 *   HAFEN=8931 node werkbank/schuss/stadt-w9/kaufprobe.mjs
 *
 * Seit Welle 9 liegt die BAUHOF-Lade beim Laden zu, und `stadt:bau:*` steht
 * dann nicht im DOM. Das ist die eine Stelle, an der diese Aenderung das
 * SPIEL kaputtmachen koennte statt nur das Bild zu verbessern — also wird
 * sie mit echten Mausklicks geprueft und nicht mit einer Zusicherung:
 *
 *   Reiter BAUHOF anklicken -> Lade auf -> billigsten Bau anklicken ->
 *   steht er danach im Hof, ist die Kasse kleiner, hat der Reiter eine
 *   neue Kennzahl?
 *
 * Jeder Klick ist mouse.move/down/up auf die Mitte einer echten
 * Trefferflaeche, nie element.click().
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = process.env.HAFEN || '8931';
const b = await chromium.launch();
let schlecht = 0;
for (const e of [1, 2, 3, 4]) {
  for (const [BR, HO] of [[2752, 1536], [1366, 768]]) {
    const s = await b.newPage({ viewport: { width: BR, height: HO }, deviceScaleFactor: 1 });
    const fehler = [];
    s.on('pageerror', (x) => fehler.push(String(x).slice(0, 140)));
    s.on('console', (m) => { if (m.type() === 'error') fehler.push(m.text().slice(0, 140)); });
    await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
    await s.waitForTimeout(1300);

    const klick = async (zug) => {
      const l = await s.evaluate((z) => {
        const el = document.querySelector(`[data-zug="${z}"]`);
        if (!el || el.disabled) return null;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return null;
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const t = document.elementFromPoint(cx, cy);
        return { x: cx, y: cy, hit: !!(t && (t === el || el.contains(t))) };
      }, zug);
      if (!l || !l.hit) return false;
      await s.mouse.move(l.x, l.y); await s.mouse.down(); await s.mouse.up();
      await s.waitForTimeout(320);
      return true;
    };

    const vor = await s.evaluate(() => ({
      kasse: BRAUHAUS.welt.haus.kasse,
      bauten: BRAUHAUS.stadt.stehend().length,
      bauzuege: document.querySelectorAll('[data-zug^="stadt:bau:"]').length,
      reiter: (document.querySelector('[data-zug="stadt:bauhof"] .zahl') || {}).textContent
    }));
    const auf = await klick('stadt:bauhof');
    const offen = await s.evaluate(() =>
      [...document.querySelectorAll('[data-zug^="stadt:bau:"]')]
        .filter((x) => x.getAttribute('data-zug') !== 'stadt:bau:seite' && !x.disabled)
        .map((x) => x.getAttribute('data-zug')));
    const gekauft = offen.length ? await klick(offen[0]) : false;
    const nach = await s.evaluate(() => ({
      kasse: BRAUHAUS.welt.haus.kasse,
      bauten: BRAUHAUS.stadt.stehend().length,
      lade: BRAUHAUS.stadt.rahmen.bauhof(),
      reiter: (document.querySelector('[data-zug="stadt:bauhof"] .zahl') || {}).textContent,
      lage: BRAUHAUS.lage.length
    }));
    const ok = auf && gekauft && nach.bauten === vor.bauten + 1
      && nach.kasse < vor.kasse && !nach.lage && !fehler.length;
    if (!ok) schlecht++;
    console.log(`E${e} ${BR}x${HO} ${ok ? 'OK ' : 'XX '} `
      + `Lade auf=${auf} · ${vor.bauzuege} stadt:bau vor dem Klick, ${offen.length} danach · `
      + `gekauft ${offen[0] || '—'} · Bauten ${vor.bauten}->${nach.bauten} · `
      + `Kasse ${vor.kasse}->${nach.kasse} · Lade ${nach.lade} · lage ${nach.lage} · fehler ${fehler.length}`);
    console.log(`      Reiter: "${vor.reiter}"  ->  "${nach.reiter}"`);
    fehler.slice(0, 2).forEach((f) => console.log('      ! ' + f));
    await s.close();
  }
}
await b.close();
console.log(schlecht ? `${schlecht} Faelle mit Befund` : 'Bauen geht in allen vier Epochen und beiden Fenstern');
