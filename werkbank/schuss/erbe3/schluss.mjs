/* Schlussmessung. Alles am Bildschirm, Treffertest per elementFromPoint. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const b=await chromium.launch();
const erg={};
for (const ep of [1,2,3,4]) {
  const p=await b.newPage({viewport:{width:2752,height:1536}});
  const f=[]; p.on('pageerror',e=>f.push(e.message)); p.on('console',m=>{if(m.type()==='error')f.push(m.text());});
  await p.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=1350`,{waitUntil:'networkidle'});
  await p.waitForTimeout(400);
  const messe = () => p.evaluate(() => {
    const out={alle:[], erbe:[]};
    document.querySelectorAll('button[data-zug]').forEach(k=>{
      const r=k.getBoundingClientRect(); if(r.width<2||r.height<2)return;
      const t=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
      if(!t||(t!==k&&!k.contains(t)))return; if(k.disabled)return;
      const pe=k.querySelector('.preis'); if(!pe)return;
      const roh=k.getAttribute('data-preis');
      const z=k.getAttribute('data-zug');
      const p=roh?Math.abs(parseFloat(roh)):null;
      if(p===null||!isFinite(p)||p<=0)return;
      out.alle.push({z,p}); if(z.startsWith('erbe:'))out.erbe.push({z,p});
    });
    return {...out, kasse:BRAUHAUS.welt.haus.kasse,
      jahr:BRAUHAUS.welt.zeit.jahr, woche:BRAUHAUS.welt.zeit.woche};
  });
  const k=async z=>{const e=await p.$(`button[data-zug="${z}"]`); if(!e||await e.isDisabled().catch(()=>1))return false;
    await e.click().catch(()=>{}); await p.waitForTimeout(25); return true;};
  const ohneKlick = await messe();
  const rho=[]; const rhoOhne=[]; const erbeAnteil=[];
  for(let i=0;i<110;i++){
    const m=await messe();
    if(m.woche===1||m.woche===15){
      const min=m.alle.length?Math.min(...m.alle.map(x=>x.p)):null;
      const ohne=m.alle.filter(x=>!x.z.startsWith('erbe:'));
      const minO=ohne.length?Math.min(...ohne.map(x=>x.p)):null;
      const minE=m.erbe.length?Math.min(...m.erbe.map(x=>x.p)):null;
      rho.push(min?+(m.kasse/min).toFixed(2):null);
      rhoOhne.push(minO?+(m.kasse/minO).toFixed(2):null);
      erbeAnteil.push(minE!==null&&min!==null&&minE<=min);
    }
    if(await p.evaluate(()=>BRAUHAUS.welt.zeit.ende))break;
    if(!await k('weiter'))break;
  }
  const st=await p.evaluate(()=>({e:BRAUHAUS.erbe.stand(),lage:BRAUHAUS.lage.length,kasse:BRAUHAUS.welt.haus.kasse}));
  erg[ep]={ohneKlickAlle:ohneKlick.alle.length, ohneKlickErbe:ohneKlick.erbe.length,
    erbeZuege:ohneKlick.erbe.map(x=>x.z), rho, erbeBilligster:erbeAnteil.filter(Boolean).length+'/'+erbeAnteil.length,
    unter1: rho.filter(x=>x!==null&&x<1).length+'/'+rho.length,
    rhoOhne, unter1Ohne: rhoOhne.filter(x=>x!==null&&x<1).length+'/'+rhoOhne.length,
    erbfaelle:st.e.erbfaelle, endeKasse:st.kasse, lage:st.lage, fehler:f.length};
  console.log(`E${ep}: ohne Klick ${ohneKlick.alle.length} Zuege mit Preis treffbar+aktiv, davon ERBE ${ohneKlick.erbe.length} (${ohneKlick.erbe.map(x=>x.z).join(', ')})`);
  console.log(`   rho MIT  ERBE ${JSON.stringify(rho)} · unter 1x ${erg[ep].unter1} · ERBE billigster in ${erg[ep].erbeBilligster}`);
  console.log(`   rho OHNE ERBE ${JSON.stringify(rhoOhne)} · unter 1x ${erg[ep].unter1Ohne}`);
  console.log(`   Erbfaelle ${st.e.erbfaelle} · Endkasse ${st.kasse} · lage ${st.lage} · fehler ${f.length}`);
  await p.close();
}
fs.writeFileSync('werkbank/schuss/erbe3/schluss.json',JSON.stringify(erg,null,1));
await b.close();
