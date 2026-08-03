/* DIE DECKE — welche Bedienelemente sind zugedeckt?
   node decke.mjs

   Klappt in jeder Epoche alle Bretter auf (wie messe.mjs es tut) und prüft
   für jedes [data-zug], ob sein Mittelpunkt wirklich es selbst trifft.
   Was nicht sich selbst trifft, ist für die Maus nicht da — gleichgültig,
   ob es aktiv aussieht. Ausgegeben wird, WAS darüber liegt.

   Gebaut für den Befund in spiel/BEFUND-BRETTER.md.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const ep of [1,2,3,4]) {
  const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
  await s.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(900);
  const reiter = await s.evaluate(() => [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e=>e.getAttribute('data-zug')));
  for (const r of reiter) {
    const l = await s.evaluate(z=>{const e=document.querySelector(`[data-zug="${z}"]`);if(!e)return null;
      const q=e.getBoundingClientRect();return{x:q.left+q.width/2,y:q.top+q.height/2,aus:!!e.disabled};},r);
    if (l && !l.aus) { await s.mouse.click(l.x,l.y); await s.waitForTimeout(70); }
  }
  const r = await s.evaluate(() => {
    const out = [];
    document.querySelectorAll('[data-zug]').forEach(el => {
      const z = el.getAttribute('data-zug');
      const q = el.getBoundingClientRect();
      if (!q.width || !q.height) return;
      const cx=q.left+q.width/2, cy=q.top+q.height/2;
      if (cx<0||cy<0||cx>innerWidth||cy>innerHeight) { out.push({z, lage:'ausserhalb'}); return; }
      const t = document.elementFromPoint(cx,cy);
      if (t && (t===el || el.contains(t))) return;                 // erreichbar, alles gut
      const k=(t&&(t.className&&t.className.baseVal!==undefined?t.className.baseVal:t.className))||'';
      out.push({ z, aus: !!el.disabled, decke: t ? (t.tagName.toLowerCase()+(k?'.'+String(k).trim().split(/\s+/)[0]:'')) : 'nichts' });
    });
    return out;
  });
  const fremd = r.filter(x => x.decke && !/^(html|body|div$)/.test(x.decke));
  console.log(`\n=== EPOCHE ${ep} — ${r.length} von ${await s.evaluate(()=>document.querySelectorAll('[data-zug]').length)} Zügen nicht erreichbar ===`);
  const nachDecke = {};
  r.forEach(x => { const k = x.lage || x.decke || '?'; (nachDecke[k] = nachDecke[k] || []).push(x.z); });
  Object.entries(nachDecke).sort((a,b)=>b[1].length-a[1].length).forEach(([d, zs]) =>
    console.log(`  ${String(zs.length).padStart(3)}×  verdeckt von ${d.padEnd(24)} z.B. ${zs.slice(0,4).join(', ')}`));
  await s.close();
}
await b.close();
