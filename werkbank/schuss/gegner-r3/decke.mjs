/* Welche Zuege dieses Stuecks sind mit der Maus nicht zu treffen? */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const vp of [[1920,1000],[1440,900],[2752,1536]]) {
for (const ep of [1,2,3,4]) {
  const s = await b.newPage({ viewport: { width: vp[0], height: vp[1] } });
  await s.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(700);
  const klick = async (z) => { const l = await s.evaluate(zz => { const e=document.querySelector(`[data-zug="${zz}"]`); if(!e) return null;
      const q=e.getBoundingClientRect(); if(!q.width) return null;
      const t=document.elementFromPoint(q.left+q.width/2,q.top+q.height/2);
      return {x:q.left+q.width/2,y:q.top+q.height/2,aus:!!e.disabled,frei:!!(t&&(t===e||e.contains(t)))}; }, z);
    if (!l||l.aus||!l.frei) return false; await s.mouse.click(l.x,l.y); await s.waitForTimeout(90); return true; };
  for (const r of await s.evaluate(()=>[...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e=>e.getAttribute('data-zug')))) await klick(r);
  await klick('gegner:blatt');
  await s.waitForTimeout(250);
  const r = await s.evaluate(() => {
    const out = [];
    document.querySelectorAll('[data-zug^="gegner:"]').forEach(el => {
      const q = el.getBoundingClientRect();
      if (!q.width || !q.height) { out.push({z:el.getAttribute('data-zug'), lage:'unsichtbar'}); return; }
      const cx=q.left+q.width/2, cy=q.top+q.height/2;
      if (cx<0||cy<0||cx>innerWidth||cy>innerHeight) { out.push({z:el.getAttribute('data-zug'), lage:'ausserhalb', y:Math.round(cy)}); return; }
      const t = document.elementFromPoint(cx,cy);
      if (t && (t===el || el.contains(t))) return;
      const k=(t&&(typeof t.className==='string'?t.className:''))||'';
      out.push({ z: el.getAttribute('data-zug'), y: Math.round(cy), yp: (cy/innerHeight*100).toFixed(1)+'%',
                 decke: t ? (t.tagName.toLowerCase()+(k?'.'+String(k).trim().split(/\s+/).join('.'):'')) : 'nichts' });
    });
    const bl = document.querySelector('.gg-blatt');
    const bq = bl ? bl.getBoundingClientRect() : null;
    return { verdeckt: out, gesamt: document.querySelectorAll('[data-zug^="gegner:"]').length,
             blatt: bq ? {top:(bq.top/innerHeight*100).toFixed(1), bot:(bq.bottom/innerHeight*100).toFixed(1), h:Math.round(bq.height)} : null };
  });
  console.log(`${vp.join('x')} E${ep}: ${r.verdeckt.length} von ${r.gesamt} gegner-Zuegen nicht erreichbar; Blatt ${r.blatt ? r.blatt.top+'%..'+r.blatt.bot+'%' : 'zu'}`);
  r.verdeckt.slice(0,12).forEach(x => console.log('   ', x.z, x.yp||x.lage, x.decke||''));
  await s.close();
}
}
await b.close();
