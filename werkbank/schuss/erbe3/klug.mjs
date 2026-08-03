/* Kluge Partie: alles aufs Haus schreiben, jeden erbe-Zug druecken, der geht. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const EP=process.argv[2]||'1', SAAT=process.argv[3]||'1350', WEG=process.argv[4]||null;
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1376,height:768}});
const fehler=[]; p.on('pageerror',e=>fehler.push('pageerror: '+e.message));
p.on('console',m=>{if(m.type()==='error')fehler.push(m.text());});
await p.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=${SAAT}`,{waitUntil:'networkidle'});
await p.waitForTimeout(400);
const k=async z=>{const e=await p.$(`button[data-zug="${z}"]`); if(!e)return false;
  if(await e.isDisabled().catch(()=>true))return false; await e.click({timeout:2500}).catch(()=>{}); await p.waitForTimeout(40); return true;};
await k('stadt:reiter:erbe-blatt-erb-buch');
const zeilen=[]; let klicks=0;
for(let i=0;i<140;i++){
  /* jeden erbe-Zug im Buch und auf der Leiste druecken, der bezahlbar ist */
  for(let r=0;r<8;r++){
    const z=await p.evaluate(()=>{
      const l=[...document.querySelectorAll('button[data-zug^="erbe:"]')]
        .filter(k=>!k.disabled && !/uebergabe/.test(k.getAttribute('data-zug')));
      return l.length?l[0].getAttribute('data-zug'):null;});
    if(!z)break; if(await k(z))klicks++; else break;
  }
  const st=await p.evaluate(()=>({z:BRAUHAUS.welt.zeit, kasse:BRAUHAUS.welt.haus.kasse,
    e:BRAUHAUS.erbe.stand(), lage:BRAUHAUS.lage.length}));
  const zg=await p.evaluate(()=>{let n=0;
    document.querySelectorAll('button[data-zug^="erbe:"]').forEach(k=>{
      const r=k.getBoundingClientRect(); if(r.width<2)return;
      const t=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
      if(!t||(t!==k&&!k.contains(t)))return; if(k.disabled)return;
      if(k.querySelector('.preis'))n++;}); return n;});
  zeilen.push({i,jahr:st.z.jahr,woche:st.z.woche,kasse:st.kasse,erbeMitPreis:zg,
    erbfaelle:st.e.erbfaelle,amHaus:st.e.amHaus.length,person:st.e.anDerPerson.length,
    erloschen:st.e.erloschen.length,erloschenSumme:st.e.erloschenSumme,
    widersprochen:st.e.widersprochen,feder:st.e.feder,last:st.e.leibgedingLast,lage:st.lage});
  if(st.z.ende)break;
  if(!await k('weiter'))break;
}
const ende=await p.evaluate(()=>({kasse:BRAUHAUS.welt.haus.kasse,e:BRAUHAUS.erbe.stand(),lage:BRAUHAUS.lage.slice()}));
if(WEG)fs.writeFileSync(WEG,JSON.stringify({zeilen,ende,fehler},null,1));
const nach=zeilen.filter(r=>r.i>=15);
console.log(`E${EP} saat${SAAT}: ${zeilen.length} W, ${klicks} erbe-Klicks, Endkasse ${ende.kasse}`);
console.log(`  ab W16: Mittel ${(nach.reduce((a,r)=>a+r.erbeMitPreis,0)/nach.length).toFixed(2)} preisbeschilderte erbe-Zuege, ${nach.filter(r=>r.erbeMitPreis===0).length}/${nach.length} null`);
console.log(`  Erbfaelle ${ende.e.erbfaelle}, Haende ${ende.e.haende.map(h=>h.nr+'.'+h.name.split(' ')[0]+'/'+h.eigenschaft+'/'+h.feder).join(' ')}`);
console.log(`  erloschen ${ende.e.erloschen.length} (${ende.e.erloschenSumme} offen), widersprochen ${ende.e.widersprochen}, geschrieben ${ende.e.geschrieben.length}`);
console.log(`  lage ${ende.lage.length} ${JSON.stringify(ende.lage).slice(0,300)} · fehler ${fehler.length} ${fehler.slice(0,3).join(' | ')}`);
await b.close();
