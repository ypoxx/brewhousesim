/* BAUORTE — welcher Aufbau liegt wo auf dem Schirm, in allen vier Epochen.
     HAFEN=8906 node werkbank/schuss/bild-w8/bauorte.mjs

   Damit ein Befund wie „hier steht ein Hofbau auf dem Marktbrunnen" den Namen
   des Bauteils traegt und nicht nur seine Bildpunkte. Ein Browser fuer alle
   vier Epochen, ?bau=alle, kein Klick.                                      */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8906';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 2752, height: 1536 }, deviceScaleFactor: 1 });
for (const E of [1, 2, 3, 4]) {
  await p.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${E}&saat=1350&bau=alle`,
               { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(2000);
  const liste = await p.evaluate(() => {
    const aus = [];
    document.querySelectorAll('#ebene-bau *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width < 6 || r.height < 6) return;
      const bg = getComputedStyle(el).backgroundImage || '';
      const m = bg.match(/hof\/([a-z_0-9]+)\.(webp|png)/i);
      const txt = (el.children.length === 0 ? (el.textContent || '').trim() : '').slice(0, 40);
      if (!m && !txt) return;
      aus.push({ was: m ? m[1] : 'TEXT:' + txt, k: el.className.toString().slice(0, 30),
                 x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
                 z: getComputedStyle(el).zIndex });
    });
    return aus;
  });
  console.log(`\n===== EPOCHE ${E} · ${liste.length} Stuecke in ebene-bau =====`);
  liste.sort((a, b) => a.y - b.y);
  for (const s of liste)
    console.log(`  ${String(s.was).padEnd(22)} x${String(s.x).padStart(4)}..${String(s.x + s.w).padStart(4)} y${String(s.y).padStart(4)}..${String(s.y + s.h).padStart(4)}  (${s.w}×${s.h}) z${s.z}`);
}
await b.close();
