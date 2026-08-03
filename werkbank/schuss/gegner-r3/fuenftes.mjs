/* DAS FUENFTE VERB — kommt der Notartermin, ist er im Bild, und beisst er?
   node fuenftes.mjs [stufe 0..2] [saat] */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const STUFE = process.argv[2] === undefined ? 1 : +process.argv[2];
const SAAT = process.argv[3] || '1350';
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
const fehler = [];
s.on('pageerror', e => fehler.push('pageerror: '+e.message));
s.on('console', m => { if (m.type()==='error') fehler.push('console: '+m.text()); });
await s.goto(`http://127.0.0.1:8899/spiel/?epoche=4&saat=${SAAT}`, { waitUntil:'networkidle' });
await s.waitForTimeout(700);
async function lage(z){ return s.evaluate(zz=>{const e=document.querySelector(`[data-zug="${zz}"]`);if(!e)return null;
  const q=e.getBoundingClientRect(); if(!q.width||!q.height) return {sicht:false};
  const cx=q.left+q.width/2, cy=q.top+q.height/2;
  const t=(cx>=0&&cy>=0&&cx<=innerWidth&&cy<=innerHeight)?document.elementFromPoint(cx,cy):null;
  return {sicht:true,aus:!!e.disabled,frei:!!(t&&(t===e||e.contains(t))),x:cx,y:cy,yp:+(cy/innerHeight*100).toFixed(1),
          text:(e.innerText||'').replace(/\s+/g,' ').trim(),preis:e.getAttribute('data-preis')};},z); }
async function klick(z,w=90){ const l=await lage(z); if(!l||!l.sicht||l.aus||!l.frei) return false;
  await s.mouse.click(l.x,l.y); await s.waitForTimeout(w); return true; }
const G = () => s.evaluate(()=>{const L=BRAUHAUS.gegner.lage();
  return {gebot: L.gebot?{...L.gebot}:null, angebot: L.angebot?{...L.angebot}:null,
    kasse: BRAUHAUS.welt.haus.kasse, jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
    br: (BRAUHAUS.welt.gegner.find(x=>x.schluessel==='konzern')||{}).zuege};});

let wo=null;
for (let i=0;i<120;i++){
  for (const z of ['preis:tafel-zu','kern:blatt-zu']) await klick(z,40);
  if (!await klick('weiter',60)) break;
  const g = await G();
  if (g.gebot) { wo=g; break; }
}
console.log('Notartermin angesetzt:', JSON.stringify(wo));
if (!wo) { console.log('kein Gebot in 120 Wochen'); await b.close(); process.exit(0); }
// im Bild, ohne irgendein Brett aufzuschlagen?
for (const n of [0,1,2]) console.log('  Bild  gegner:mitbieten:'+n, JSON.stringify(await lage('gegner:mitbieten:'+n)));
const adr = await s.evaluate(()=>{const L=BRAUHAUS.gegner.lage(); const a=BRAUHAUS.welt.adresse(L.gebot.k);
  return {name:a.name, bindung:a.bindung?a.bindung.wem:null};});
console.log('  umstrittene Adresse:', JSON.stringify(adr));
await s.screenshot({path:`/home/user/brewhousesim/werkbank/schuss/gegner-r3/gebot-vor-${SAAT}.png`});
const vor = await G();
const ok = await klick('gegner:mitbieten:'+STUFE, 250);
console.log('  Klick Stufe', STUFE, '->', ok);
const nach = await G();
console.log('  Kasse', vor.kasse, '->', nach.kasse, '| Gebot jetzt', nach.gebot);
console.log('  Adresse jetzt:', JSON.stringify(await s.evaluate((k)=>{const a=BRAUHAUS.welt.adresse(k); return {name:a.name,bindung:a.bindung?a.bindung.wem:null};}, wo.gebot.k)));
console.log('  Meldung:', await s.evaluate(()=>BRAUHAUS.gegner.lage().meldung));
console.log('  Knopf noch da?', JSON.stringify(await lage('gegner:mitbieten:'+STUFE)));
console.log('  Chronik letzte:', await s.evaluate(()=>BRAUHAUS.welt.chronik.slice(-2).map(c=>c.text||c.satz||JSON.stringify(c))));
console.log('  lage', await s.evaluate(()=>BRAUHAUS.lage.length), 'Fehler', fehler.length, fehler.slice(0,3));
await s.screenshot({path:`/home/user/brewhousesim/werkbank/schuss/gegner-r3/gebot-${SAAT}.png`});
await b.close();
