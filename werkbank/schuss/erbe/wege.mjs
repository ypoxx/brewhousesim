/* DIE DREI WEGE — vorher und nachher gezaehlt, am Bildschirm.
   node werkbank/schuss/erbe/wege.mjs <epoche>

   Vier Partien derselben Saat, nur durch DAS ERBE unterschieden:
     stunde      niemand entscheidet — die Stunde kommt in Woche 16
     bruch       in Woche 8 mit leeren Haenden uebergeben
     abfindung   in Woche 8 abgefunden
     leibgeding  in Woche 8 ein Jahrgeld versprochen
   Dazwischen wird gespielt wie sonst: Bretter auf, bezahlbare Zuege nehmen.
   Gelesen wird die Kopfleiste (KELLER n/m) und die Erbleiste — innerText.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const EP = +(process.argv[2] || 1);
const HAFEN = process.env.HAFEN || '8899';
const WEGE = ['stunde', 'bruch', 'abfindung', 'leibgeding'];
const b = await chromium.launch();
const aus = [];

for (const weg of WEGE) {
  const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
  const fehler = [];
  s.on('pageerror', e => fehler.push(e.message));
  s.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(800);

  const spiele = () => s.evaluate(() => {
    let n = 0;
    const frei = e => { const q = e.getBoundingClientRect(); if (!q.width) return false;
      const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
      return !!(t && (t === e || e.contains(t))); };
    for (const r of document.querySelectorAll('[data-zug^="stadt:reiter:"]')) {
      r.click();
      for (const e of document.querySelectorAll('[data-zug]')) {
        const z = e.getAttribute('data-zug');
        if (e.disabled || z === 'weiter' || z.startsWith('stadt:') || z.startsWith('erbe:')) continue;
        if (!frei(e)) continue;
        e.click(); n++;
        if (n > 5) return n;
      }
    }
    return n;
  });
  const kopf = () => s.evaluate(() => {
    const k = document.querySelector('.kopfleiste');
    return {
      kopfzeile: k ? (k.innerText || '').replace(/\s+/g, ' ').trim() : null,
      leiste: (document.querySelector('.erb-leiste') || {}).innerText
        ? document.querySelector('.erb-leiste').innerText.replace(/\n+/g, ' | ').trim() : null,
      stand: BRAUHAUS.erbe.stand(),
      kasse: BRAUHAUS.welt.haus.kasse,
      keller: BRAUHAUS.welt.vorrat.faesser.length,
      jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche
    };
  });

  let vor = null, nach = null, michaeli = [];
  for (let w = 0; w < 120; w++) {
    await spiele(); await s.waitForTimeout(25);
    if (w === 7) {
      vor = await kopf();
      if (weg !== 'stunde') {
        await s.evaluate(k => { const e = document.querySelector(`[data-zug="erbe:uebergabe:${k}"]`);
          if (e && !e.disabled) e.click(); }, weg);
        await s.waitForTimeout(80);
        nach = await kopf();
      }
    }
    const ok = await s.evaluate(() => {
      const frei = z => { const e = document.querySelector(`[data-zug="${z}"]`); if (!e) return false;
        const q = e.getBoundingClientRect(); if (!q.width) return false;
        const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
        return !!(t && (t === e || e.contains(t))); };
      const tu = z => { const e = document.querySelector(`[data-zug="${z}"]`);
        if (e && !e.disabled) { e.click(); return true; } return false; };
      if (document.querySelector('.fu-sperre')) tu('fuhre:sommer-zu');
      if (!frei('weiter')) for (const r of document.querySelectorAll('[data-zug^="stadt:reiter:"]')) {
        if (frei('weiter')) break; r.click();
      }
      return tu('weiter');
    });
    await s.waitForTimeout(40);
    if (weg === 'stunde' && w === 14) vor = await kopf();
    if (weg === 'stunde' && w === 15) nach = await kopf();
    if ([29, 59, 89].includes(w)) michaeli.push(await kopf());
    if (!ok) break;
  }
  const schluss = await s.evaluate(() => ({
    jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
    endgrund: BRAUHAUS.welt.zeit.endgrund, kasse: BRAUHAUS.welt.haus.kasse,
    keller: BRAUHAUS.welt.vorrat.faesser.length, lage: BRAUHAUS.lage.length,
    stand: BRAUHAUS.erbe.stand(),
    leibgedingGezahlt: BRAUHAUS.protokoll.filter(p => /Leibgeding|Ausgedinge|Leibrente|Versorgungszusage/i.test(p.was))
      .map(p => p.jahr + '/' + p.woche + ' ' + p.was + ' ' + p.preis)
  }));
  aus.push({ weg, vor, nach, michaeli, schluss, fehler: fehler.length });
  await s.close();
}
await b.close();
console.log(JSON.stringify({ epoche: EP, wege: aus }, null, 1));
