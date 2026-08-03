/* Die Gegenprobe des Kritikers, auf die Festlegung DIESES Stuecks angewandt:
   kaufen, sofort wieder anklicken, Kasse und Knoepfe nachsehen. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const EP = Number(process.argv[2] || 4);
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
await s.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(700);
async function klick(z) {
  const l = await s.evaluate(zz => { const e=document.querySelector(`[data-zug="${zz}"]`); if(!e) return null;
    const q=e.getBoundingClientRect(); if(!q.width) return null;
    const t=document.elementFromPoint(q.left+q.width/2,q.top+q.height/2);
    return {x:q.left+q.width/2,y:q.top+q.height/2,aus:!!e.disabled,frei:!!(t&&(t===e||e.contains(t)))}; }, z);
  if (!l||l.aus||!l.frei) return { ok:false, l };
  await s.mouse.click(l.x,l.y); await s.waitForTimeout(120); return { ok:true, l };
}
const kasse = () => s.evaluate(()=>BRAUHAUS.welt.haus.kasse);
const festZahl = () => s.evaluate(()=>{const e=[...document.querySelectorAll('[data-zug]')].find(x=>/Festlegungen/.test(x.textContent||'')); return e?e.textContent.replace(/\s+/g,' ').trim():null;});
for (const r of await s.evaluate(()=>[...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e=>e.getAttribute('data-zug')))) { await klick(r); }
await klick('gegner:blatt');
await s.waitForTimeout(200);
console.log('vor:  Kasse', await kasse(), '| Chronikknopf:', await festZahl());
const g = await klick('gegner:gegenzug');
console.log('Klick gegner:gegenzug ->', g.ok, JSON.stringify(g.l));
console.log('nach: Kasse', await kasse(), '| Chronikknopf:', await festZahl());
console.log('gegner:gegenzug noch da?', await s.evaluate(()=>{const e=document.querySelector('[data-zug="gegner:gegenzug"]'); return e?{aus:e.disabled}:null;}));
const g2 = await klick('gegner:gegenzug');
console.log('zweiter Klick ->', g2.ok, '| Kasse', await kasse());
console.log('Chronik-Eintraege art=festlegung:', await s.evaluate(()=>BRAUHAUS.welt.chronik.filter(c=>c.art==='festlegung').length));
console.log('Wirkung:', await s.evaluate(()=>JSON.stringify(BRAUHAUS.gegner.lage().wirkung)));
await b.close();
