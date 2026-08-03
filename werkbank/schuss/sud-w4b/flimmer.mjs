// flimmer.mjs — Verschwindet der Kesselzettel beim Neuzeichnen, und sei es
// nur fuer einen Wimpernschlag? 40 Neuzeichnungen, dazwischen sofort gemessen.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const H=+(process.argv[2]||8915);
const b=await chromium.launch();
for (const e of [1,2,3,4]) {
  const s=await b.newPage({viewport:{width:1920,height:1080}});
  await s.goto(`http://127.0.0.1:${H}/spiel/?epoche=${e}&saat=1350`,{waitUntil:'networkidle',timeout:60000});
  await s.waitForTimeout(2000);
  const r=await s.evaluate(async ()=>{
    let weg=0, proben=0;
    for (let i=0;i<40;i++){
      window.BRAUHAUS.sende('zeichne',{grund:'flimmerprobe'});
      await new Promise(f=>requestAnimationFrame(()=>requestAnimationFrame(f)));
      const z=document.querySelector('.sud-zettel');
      proben++;
      if (!z || z.classList.contains('beiseite') || z.getBoundingClientRect().width<3) weg++;
    }
    return {proben, weg};
  });
  console.log('E'+e+': '+r.weg+' von '+r.proben+' Neuzeichnungen ohne Zettel im Bild');
  await s.close();
}
await b.close();
