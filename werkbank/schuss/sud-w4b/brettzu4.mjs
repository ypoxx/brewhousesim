import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const H=+(process.argv[2]||8915);
const b=await chromium.launch();
for (const p of [H]) for (const e of [4]) for (const warte of [500,1500,3000,5000]) {
  const s=await b.newPage({viewport:{width:1920,height:1080}});
  await s.goto(`http://127.0.0.1:${p}/spiel/?epoche=${e}&saat=1350`,{waitUntil:'networkidle',timeout:60000});
  await s.waitForTimeout(warte);
  const r=await s.evaluate(()=>{
    const f=document.getElementById('fach-hand-sud');
    const br=f?f.firstElementChild:null;
    const z=document.querySelector('.sud-zettel');
    return {brettZu: window.BRAUHAUS.SUD_ZUSTAND.brettZu,
      klasseBrett: br?br.className:null, klasseZettel:z?z.className:null,
      sitz: window.BRAUHAUS.SUD_ZUSTAND.zettelSitz};
  });
  console.log('Hafen '+p+' E'+e+' nach '+warte+' ms: '+JSON.stringify(r));
  await s.close();
}
await b.close();
