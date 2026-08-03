/* Auflage 4 (gehoert DER RUECKKOPPLUNG — hier die Zahl unter dem heutigen
   Stand): Deckung Woche fuer Woche, Politik "nur WEITER", KEIN Brett
   aufgeschlagen — sonst misst man den eigenen Rundgang. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import { neueSeite, STAND, AUS } from './messe.mjs';
const rho = (a) => { const n = a.length; if (n < 3) return null;
  const rang = (v) => { const s = v.map((x,i)=>[x,i]).sort((p,q)=>p[0]-q[0]); const r = new Array(n);
    let i = 0; while (i < n) { let j = i; while (j+1 < n && s[j+1][0] === s[i][0]) j++;
      const m = (i+j)/2 + 1; for (let k = i; k <= j; k++) r[s[k][1]] = m; i = j+1; } return r; };
  const x = rang(a.map((_,i)=>i)), y = rang(a);
  const mx = x.reduce((s,v)=>s+v,0)/n, my = y.reduce((s,v)=>s+v,0)/n;
  let sxy=0,sx=0,sy=0; for (let i=0;i<n;i++){const dx=x[i]-mx,dy=y[i]-my; sxy+=dx*dy; sx+=dx*dx; sy+=dy*dy;}
  return sx && sy ? +(sxy/Math.sqrt(sx*sy)).toFixed(3) : null; };
const med = (a) => { const s = a.slice().sort((p,q)=>p-q); return s.length ? +s[Math.floor(s.length/2)].toFixed(2) : null; };
const browser = await chromium.launch();
const erg = {};
for (const ep of [1,2,3,4]) {
  const { seite, fehler } = await neueSeite(browser, ep);
  const reihe = [];
  for (let i = 0; i < 130; i++) {
    const s = await seite.evaluate(STAND);
    if (s.ende) break;
    reihe.push({ jahr: s.jahr, woche: s.woche, kasse: s.kasse,
      d: s.deckung === null ? null : +s.deckung, sichtbar: s.deckungSichtbar });
    const w = await seite.$('[data-zug="weiter"]'); if (!w || await w.isDisabled()) break;
    await w.click(); await seite.waitForTimeout(24);
  }
  const mitZahl = reihe.filter(r => r.d !== null);
  const jahre = {};
  mitZahl.forEach(r => (jahre[r.jahr] = jahre[r.jahr] || []).push(r.d));
  const jm = Object.keys(jahre).sort().map(j => j + ':' + med(jahre[j]));
  erg['e'+ep] = { wochen: reihe.length, mitZahl: mitZahl.length,
    rho: rho(mitZahl.map(r => r.d)), jahresmediane: jm,
    unter1: Object.keys(jahre).filter(j => med(jahre[j]) < 1).length,
    jahre: Object.keys(jahre).length, ohneZahl: reihe.length - mitZahl.length, fehler };
  console.log(`E${ep} ${reihe.length} Wochen · rho ${erg['e'+ep].rho} · Jahresmediane ${jm.join(' ')}`
    + ` · Jahre unter 1x ${erg['e'+ep].unter1}/${erg['e'+ep].jahre} · Wochen ohne Zahl ${erg['e'+ep].ohneZahl}`
    + ` · fehler ${fehler.length}`);
  await seite.close();
}
await browser.close();
fs.writeFileSync(`${AUS}leiter.json`, JSON.stringify(erg, null, 1));
