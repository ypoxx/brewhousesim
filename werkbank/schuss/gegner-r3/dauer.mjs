/* DER LANGE LAUF — so weit die Epoche traegt.
   node dauer.mjs <epoche> <wochen> <stil:ruhig|wirtschaftend> <aus.json> [saat]
   Misst je Woche: Kasse · Kennzahl des Kerns · billigster UMKAEMPFTER Zug
   (nur gegner:-Zuege mit Preisschild, aktiv, am Schirm) · Haeuser der Gegner. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'fs';
const EP = +(process.argv[2] || 4), WOCHEN = +(process.argv[3] || 400);
const STIL = process.argv[4] || 'wirtschaftend';
const AUS = process.argv[5] || null, SAAT = process.argv[6] || '1350';

const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
const fehler = [];
s.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0,160)));
s.on('console', m => { if (m.type()==='error') fehler.push('console: ' + m.text().slice(0,160)); });
await s.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=${SAAT}`, { waitUntil:'networkidle' });
await s.waitForTimeout(800);

async function lage(z){ return s.evaluate(zz=>{ const e=document.querySelector(`[data-zug="${zz}"]`); if(!e) return null;
  const q=e.getBoundingClientRect(); if(!q.width||!q.height) return {sicht:false};
  const cx=q.left+q.width/2, cy=q.top+q.height/2;
  const t=(cx>=0&&cy>=0&&cx<=innerWidth&&cy<=innerHeight)?document.elementFromPoint(cx,cy):null;
  return {sicht:true,aus:!!e.disabled,frei:!!(t&&(t===e||e.contains(t))),x:cx,y:cy}; }, z); }
async function klick(z,w=50){ const l=await lage(z); if(!l||!l.sicht||l.aus||!l.frei) return false;
  await s.mouse.click(l.x,l.y); await s.waitForTimeout(w); return true; }
async function raeume(){ for (const z of ['fuhre:sommer-zu','preis:tafel-zu','kern:blatt-zu','gegner:blatt-zu']) await klick(z,60); }

const stand = () => s.evaluate(() => {
  const umk = [];
  document.querySelectorAll('[data-zug^="gegner:"]').forEach(e => {
    if (e.disabled) return;
    const p = Number(e.getAttribute('data-preis') || 0);
    if (!(p < 0)) return;
    if (!/^gegner:(abloesen|zuvorkommen|abwehren|ueberbieten)/.test(e.getAttribute('data-zug'))) return;
    umk.push({ z: e.getAttribute('data-zug'), p: -p });
  });
  umk.sort((a,c)=>a.p-c.p);
  const g = {};
  (BRAUHAUS.welt.gegner||[]).forEach(x => { g[x.schluessel] = x.zuege; });
  const L = BRAUHAUS.gegner ? BRAUHAUS.gegner.lage() : {};
  return { jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
    kasse: Math.round(BRAUHAUS.welt.haus.kasse),
    kernPreis: BRAUHAUS.welt.naechsterZug ? BRAUHAUS.welt.naechsterZug.preis : null,
    kernZug: BRAUHAUS.welt.naechsterZug ? BRAUHAUS.welt.naechsterZug.was : null,
    kernDeckung: BRAUHAUS.welt.zugDeckung(),
    umkPreis: umk.length?umk[0].p:null, umkZug: umk.length?umk[0].z:null, umkN: umk.length,
    gegnerZuege: L.zaehler||0, angebot: !!L.angebot,
    gehalten: BRAUHAUS.welt.adressenJetzt().filter(a=>a.bindung&&a.bindung.wem&&a.bindung.wem!=='haus').length,
    lage: BRAUHAUS.lage.length, ende: !!BRAUHAUS.welt.zeit.ende };
});

const reihe = []; let abbruch = null;
for (let i=0;i<WOCHEN;i++){
  await raeume();
  const v = await stand();
  reihe.push(v);
  if (v.ende) { abbruch = {grund:'Ende der Uhr', i, stand:v.jahr+'/'+v.woche, kasse:v.kasse}; break; }
  if (STIL === 'wirtschaftend') {
    if (v.woche === 1) { await klick('fuhre:jahresplan:pils',60) || await klick('fuhre:jahresplan:grut',60) || await klick('fuhre:jahresplan:duenn',60); await raeume(); }
    await klick('fuhre:kauf:rohstoff',60);
    if (!(await klick('fuhre:wie-vorige',60))) await klick('fuhre:fuellen',60);
    await klick('fuhre:abschicken',110);
  }
  let n = await stand(), versuch = 0;
  while (n.jahr===v.jahr && n.woche===v.woche && versuch<4) {
    await raeume();
    if (!(await klick('weiter',110))) { await s.keyboard.press('Escape'); await s.waitForTimeout(80); }
    n = await stand(); versuch++;
  }
  if (n.jahr===v.jahr && n.woche===v.woche) {
    abbruch = {grund:'Woche laesst sich nicht wechseln', i, stand:v.jahr+'/'+v.woche, kasse:v.kasse}; break;
  }
}
const u = reihe.filter(r=>r.umkPreis);
const q = r => r.kasse/r.umkPreis;
const med = a => { const x=a.slice().sort((p,r)=>p-r); return x.length? +x[Math.floor(x.length/2)].toFixed(2):null; };
console.log(`E${EP} ${STIL} saat=${SAAT}: ${reihe.length} Wochen ${reihe[0].jahr}W${reihe[0].woche} .. ${reihe[reihe.length-1].jahr}W${reihe[reihe.length-1].woche}`, abbruch||'');
console.log(`  Kasse ${reihe[0].kasse} -> ${reihe[reihe.length-1].kasse} · Gegnerzuege ${reihe[reihe.length-1].gegnerZuege} · gehalten ${reihe[0].gehalten} -> ${reihe[reihe.length-1].gehalten}`);
if (u.length) {
  const vier = Math.ceil(u.length/4);
  console.log(`  UMKAEMPFT n=${u.length}  erste ${q(u[0]).toFixed(2)}x  letzte ${q(u[u.length-1]).toFixed(2)}x  median ${med(u.map(q))}x  max ${Math.max(...u.map(q)).toFixed(2)}x`);
  for (let i=0;i<4;i++){ const t=u.slice(i*vier,(i+1)*vier); if(!t.length) continue;
    console.log(`    V${i+1} ${t[0].jahr}W${t[0].woche}-${t[t.length-1].jahr}W${t[t.length-1].woche}: median ${med(t.map(q))}x · Kasse ${Math.round(t.reduce((a,x)=>a+x.kasse,0)/t.length)} · Preis ${Math.round(t.reduce((a,x)=>a+x.umkPreis,0)/t.length)}`); }
}
const kd = reihe.filter(r=>r.kernDeckung!=null).map(r=>r.kernDeckung);
if (kd.length) console.log(`  KERN-Kennzahl erste ${kd[0].toFixed(1)}x letzte ${kd[kd.length-1].toFixed(1)}x median ${med(kd)}x · Nenner ${[...new Set(reihe.map(r=>r.kernZug))].slice(0,4).join(' | ')}`);
console.log('  Fehler', fehler.length, fehler.slice(0,3));
if (AUS) writeFileSync(AUS, JSON.stringify({epoche:EP,stil:STIL,saat:SAAT,abbruch,fehler,reihe},null,1));
await b.close();
