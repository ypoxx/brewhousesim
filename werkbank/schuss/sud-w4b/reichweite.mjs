// reichweite.mjs — Wie weit traegt eine Kernaenderung an B.knopf()?
// Zaehlt je Epoche, wie viele Knoepfe mit data-zug die Klasse 'knopf' tragen
// (also aus B.knopf stammen) und wie viele nicht.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const H=+(process.argv[2]||8913);
const b=await chromium.launch();
let gesamt=0, ausKnopf=0, fremd=[];
for (const e of [1,2,3,4]) {
  const s=await b.newPage({viewport:{width:1920,height:1080}});
  await s.goto(`http://127.0.0.1:${H}/spiel/?epoche=${e}&saat=1350`,{waitUntil:'networkidle',timeout:60000});
  await s.waitForTimeout(1800);
  const r=await s.evaluate(()=>{
    const l=[...document.querySelectorAll('[data-zug]')];
    const knopf=l.filter(k=>k.tagName==='BUTTON'&&k.classList.contains('knopf'));
    const rest=l.filter(k=>!(k.tagName==='BUTTON'&&k.classList.contains('knopf')));
    const gesperrt=l.filter(k=>k.disabled);
    return {alle:l.length, ausKnopf:knopf.length,
      rest:rest.map(k=>k.tagName+'.'+(k.className||'')+' ['+k.getAttribute('data-zug')+']').slice(0,8),
      restN:rest.length,
      gesperrt:gesperrt.length,
      gesperrtMitAttribut:gesperrt.filter(k=>k.hasAttribute('data-soll-aus')).length,
      gesperrtOhne:gesperrt.filter(k=>!k.hasAttribute('data-soll-aus')).length,
      gesperrtOhneStueck:[...new Set(gesperrt.filter(k=>!k.hasAttribute('data-soll-aus'))
        .map(k=>(k.getAttribute('data-zug')||'').split(':')[0]))].join(' ')};
  });
  console.log('E'+e+': Zuege '+r.alle+'  aus B.knopf '+r.ausKnopf+'  andere '+r.restN
    +'   gesperrt '+r.gesperrt+' (mit data-soll-aus '+r.gesperrtMitAttribut
    +', ohne '+r.gesperrtOhne+')');
  console.log('     gesperrt ohne Attribut, nach Stueck: '+r.gesperrtOhneStueck);
  if (r.restN) console.log('     nicht aus B.knopf: '+r.rest.join(' | '));
  await s.close();
}
await b.close();
