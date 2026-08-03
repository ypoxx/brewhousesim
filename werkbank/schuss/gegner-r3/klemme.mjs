import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
await s.goto('http://127.0.0.1:8899/spiel/?epoche=4&saat=1350&jahr=1970&woche=29', { waitUntil: 'networkidle' });
await s.waitForTimeout(800);
async function klick(z,w=120){ const l=await s.evaluate(zz=>{const e=document.querySelector(`[data-zug="${zz}"]`);if(!e)return null;
  const q=e.getBoundingClientRect();if(!q.width)return null;const t=document.elementFromPoint(q.left+q.width/2,q.top+q.height/2);
  return{x:q.left+q.width/2,y:q.top+q.height/2,aus:!!e.disabled,frei:!!(t&&(t===e||e.contains(t)))};},z);
  if(!l||l.aus||!l.frei)return false; await s.mouse.click(l.x,l.y); await s.waitForTimeout(w); return true; }
for (let i=0;i<6;i++){
  const w = await s.evaluate(()=>({j:BRAUHAUS.welt.zeit.jahr,w:BRAUHAUS.welt.zeit.woche}));
  const ok = await klick('weiter',200);
  const n = await s.evaluate(()=>({j:BRAUHAUS.welt.zeit.jahr,w:BRAUHAUS.welt.zeit.woche}));
  console.log(JSON.stringify(w),'weiter=',ok,'->',JSON.stringify(n));
  if (!ok || (n.j===w.j&&n.w===w.w)) {
    console.log('offene Sperren:', await s.evaluate(()=>[...document.querySelectorAll('[data-zug]')].filter(e=>{
      const q=e.getBoundingClientRect(); return q.width&&q.height&&!e.disabled;}).map(e=>e.getAttribute('data-zug')).slice(0,40)));
    console.log('weiter:', await s.evaluate(()=>{const e=document.querySelector('[data-zug="weiter"]');const q=e.getBoundingClientRect();
      const t=document.elementFromPoint(q.left+q.width/2,q.top+q.height/2);
      return {aus:e.disabled,txt:e.textContent.trim(),ueber:t?t.tagName+'.'+(typeof t.className==='string'?t.className:''):null};}));
    break;
  }
}
await b.close();
