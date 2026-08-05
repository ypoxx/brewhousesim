/* DIE KLEMME am einzelnen Bildschirm: was tut EIN Reiterklick?
   Kein Wochenlauf — vier Seiten, je hoechstens fuenf Klicks. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const HAFEN = process.env.HAFEN || '8901';
const b = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
const alles = [];
for (const e of [1,2,3,4]) {
  const s = await b.newPage({ viewport: { width: 1366, height: 768 } });
  const fehler = [];
  s.on('pageerror', x => fehler.push(String(x).slice(0,120)));
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil:'networkidle' });
  await s.waitForTimeout(1400);
  const lage = () => s.evaluate(() => {
    const f = document.getElementById('fach-hand-sud');
    const br = f ? f.firstElementChild : null;
    if (!br) return null;
    const cs = getComputedStyle(br);
    const r = br.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const t = (cx>=0&&cy>=0&&cx<=innerWidth&&cy<=innerHeight)?document.elementFromPoint(cx,cy):null;
    const kn = [...br.querySelectorAll('button[data-zug]')];
    const bed = kn.filter(k=>{
      if (k.disabled) return false;
      const q=k.getBoundingClientRect(); if(!q.width||!q.height) return false;
      const x=q.left+q.width/2,y=q.top+q.height/2;
      if(x<0||y<0||x>innerWidth||y>innerHeight) return false;
      const z=document.elementFromPoint(x,y); return !!(z&&(z===k||k.contains(z)));
    });
    const gruende = {};
    kn.forEach(k=>{ if(k.disabled){const g=k.getAttribute('data-aus-grund')||'(ohne)';gruende[g]=(gruende[g]||0)+1;} });
    return { klasseZu: br.classList.contains('stadt-zugeklappt'),
      clip: cs.clipPath, brettTrifft: !!(t&&(t===br||br.contains(t))),
      knoepfe: kn.length, bedienbar: bed.length,
      sollAus0UndAus: kn.filter(k=>k.disabled && k.getAttribute('data-soll-aus')==='0').length,
      gruende };
  });
  const klickReiter = async () => {
    const l = await s.evaluate(()=>{const el=document.querySelector('[data-zug="stadt:reiter:sud-sud-brett"]');
      if(!el) return null; const r=el.getBoundingClientRect();
      return {x:r.left+r.width/2,y:r.top+r.height/2,aus:!!el.disabled};});
    if (!l||l.aus) return false;
    await s.mouse.click(l.x,l.y); return true;
  };
  const schritte = [];
  schritte.push({ was:'nach dem Laden', ...(await lage()) });
  for (let i=1;i<=3;i++){
    const ok = await klickReiter();
    if (!ok) { schritte.push({was:`Klick ${i}: Reiter nicht klickbar`}); break; }
    /* SOFORT nachsehen — im selben Wimpernschlag, ohne zu warten */
    schritte.push({ was:`Klick ${i}, sofort (0 ms)`, ...(await lage()) });
    await s.waitForTimeout(120);
    schritte.push({ was:`Klick ${i}, +120 ms`, ...(await lage()) });
    await s.waitForTimeout(500);
    schritte.push({ was:`Klick ${i}, +620 ms`, ...(await lage()) });
    await s.waitForTimeout(2000);
    schritte.push({ was:`Klick ${i}, +2,6 s`, ...(await lage()) });
    const l = schritte[schritte.length-1];
    if (!l.klasseZu && l.bedienbar > 0) break;
  }
  alles.push({ epoche:e, fehler, schritte });
  console.log(`\nE${e}:`);
  schritte.forEach(x=>console.log(`  ${String(x.was).padEnd(24)} zu=${x.klasseZu} trifft=${x.brettTrifft} `
    +`bedienbar=${x.bedienbar}/${x.knoepfe} sollAus0&aus=${x.sollAus0UndAus} ${JSON.stringify(x.gruende||{})}`));
  await s.close();
}
await b.close();
fs.writeFileSync('werkbank/schuss/sud-blind-r2/reiterprobe.json', JSON.stringify(alles,null,1));
