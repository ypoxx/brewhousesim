/* Wo ist der Streifen unten rechts wirklich frei? Ueber eine ganze Partie,
   alle vier Epochen, alles Fremde was die Maus faengt. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch();
for (const ep of [1,2,3,4]) {
  const p=await b.newPage({viewport:{width:2752,height:1536}});
  await p.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=1350`,{waitUntil:'networkidle'});
  await p.waitForTimeout(300);
  const k=async z=>{const e=await p.$(`button[data-zug="${z}"]`); if(!e||await e.isDisabled().catch(()=>1))return false;
    await e.click().catch(()=>{}); await p.waitForTimeout(25); return true;};
  let yMin=100, xMax=0, treffer=[];
  for(let i=0;i<100;i++){
    const r=await p.evaluate(()=>{
      const W=window.innerWidth,H=window.innerHeight,out=[];
      document.querySelectorAll('[data-stueck]:not([data-stueck="erbe"]) *').forEach(el=>{
        if(!(el instanceof HTMLElement))return;
        const q=el.getBoundingClientRect();
        if(q.width<4||q.height<4)return;
        if(getComputedStyle(el).pointerEvents==='none')return;
        const x1=q.left/W*100,x2=q.right/W*100,y1=q.top/H*100,y2=q.bottom/H*100;
        if(x2<52||x1>99||y2<64||y1>84)return;
        out.push({s:(el.closest('[data-stueck]')||{getAttribute:()=>null}).getAttribute('data-stueck'),
          k:el.className, x:[+x1.toFixed(1),+x2.toFixed(1)], y:[+y1.toFixed(1),+y2.toFixed(1)]});
      });
      return out;});
    r.forEach(o=>{ if(o.x[1]>54 && o.y[1]>70){ treffer.push(o); } });
    if(await p.evaluate(()=>BRAUHAUS.welt.zeit.ende))break;
    if(!await k('weiter'))break;
  }
  /* untere Kante des freien Feldes bei x >= 54: das kleinste y1 aller Fremden,
     die in x 54-98 hineinragen und unterhalb 70 % beginnen */
  const rein = treffer.filter(o=>o.x[1]>54 && o.x[0]<98);
  const yTop = rein.length? Math.min(...rein.map(o=>o.y[0])) : 100;
  const uniq={}; rein.forEach(o=>{const key=o.s+' '+o.k.split(' ')[0]+' y'+o.y[0]+'-'+o.y[1]+' x'+o.x[0]+'-'+o.x[1]; uniq[key]=(uniq[key]||0)+1;});
  console.log(`E${ep}: unterste freie Kante bei y=${yTop} % (x 54-98). Fremde im Streifen:`);
  Object.keys(uniq).slice(0,10).forEach(x=>console.log('   '+x+'  ('+uniq[x]+'x)'));
  await p.close();
}
await b.close();
