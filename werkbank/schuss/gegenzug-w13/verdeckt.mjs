import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8932';
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 } });
for (const [ep, jahr, woche] of [[4,1971,5],[4,1971,20],[1,1353,1]]) {
  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350&jahr=${jahr}&woche=${woche}`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(1000);
  const r = await seite.evaluate(() => {
    const out = [];
    document.querySelectorAll('[data-zug^="gegner:"]').forEach(el => {
      const b = el.getBoundingClientRect();
      if (!b.width || !b.height) return;
      const cx = b.left + b.width/2, cy = b.top + b.height/2;
      if (!(cx>=0&&cy>=0&&cx<=innerWidth&&cy<=innerHeight)) { out.push([el.getAttribute('data-zug'),'ausserhalb']); return; }
      const t = document.elementFromPoint(cx, cy);
      const hit = !!(t && (t===el || el.contains(t)));
      if (!hit) {
        let d = t, kette = [];
        while (d && kette.length < 4) { kette.push(d.className && d.className.baseVal !== undefined ? 'svg' : (d.className||d.tagName)); d = d.parentElement; }
        out.push([el.getAttribute('data-zug'), 'verdeckt von: ' + kette.join(' < ')]);
      }
    });
    return { jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche, out };
  });
  console.log('E'+ep, r.jahr+'/'+r.woche, 'verdeckte:', r.out.length);
  r.out.slice(0,6).forEach(x => console.log('   ', x[0], '|', x[1]));
}
await browser.close();
