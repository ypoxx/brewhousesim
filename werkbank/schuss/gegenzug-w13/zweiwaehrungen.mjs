import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const fehler=[]; seite.on('pageerror',e=>fehler.push(String(e).slice(0,200)));
for (const [ep,jahr] of [[1,1353],[4,1973]]) {
  for (const leer of [false,true]) {
    await seite.goto(`http://127.0.0.1:8924/spiel/?epoche=${ep}&saat=1350&jahr=${jahr}&woche=1`, { waitUntil:'networkidle' });
    await seite.waitForTimeout(900);
    if (leer) { await seite.evaluate(()=>{const n=BRAUHAUS.welt.vorrat.faesser.length; if(n)BRAUHAUS.welt.nimmHeraus(n); BRAUHAUS.sende('zeichne',{grund:'p'});}); await seite.waitForTimeout(400); }
    const r = await seite.evaluate(()=>({
      kasse: BRAUHAUS.welt.geld(BRAUHAUS.welt.haus.kasse), fass: BRAUHAUS.welt.vorrat.faesser.length,
      preis: BRAUHAUS.gegner.fasspreis(), lage: BRAUHAUS.lage.length,
      knoepfe: [...document.querySelectorAll('[data-zug^="gegner:hinhalten:"],[data-zug^="gegner:zukaufen:"]')].slice(0,4)
        .map(e=>({z:e.getAttribute('data-zug'), p:e.getAttribute('data-preis'), aus:e.disabled, t:(e.innerText||'').replace(/\s+/g,' ').trim()}))
    }));
    console.log(`E${ep} ${leer?'Keller LEER':'Keller voll'} Kasse ${r.kasse} Fass ${r.fass} lage ${r.lage}`, JSON.stringify(r.preis));
    r.knoepfe.forEach(x=>console.log('   ',x.z,'| preis',x.p,'| aus',x.aus,'|',JSON.stringify(x.t)));
  }
}
// Klickprobe: zukaufen druecken
await seite.goto('http://127.0.0.1:8924/spiel/?epoche=1&saat=1350&jahr=1353&woche=1',{waitUntil:'networkidle'});
await seite.waitForTimeout(900);
const vor = await seite.evaluate(()=>({k:BRAUHAUS.welt.haus.kasse,f:BRAUHAUS.welt.vorrat.faesser.length}));
const ok = await seite.evaluate(()=>{const e=document.querySelector('[data-zug^="gegner:zukaufen:"]'); if(!e||e.disabled)return false; e.click(); return true;});
await seite.waitForTimeout(400);
const nach = await seite.evaluate(()=>({k:BRAUHAUS.welt.haus.kasse,f:BRAUHAUS.welt.vorrat.faesser.length,m:(BRAUHAUS.gegner.lage().meldung||'').slice(0,160), lage:BRAUHAUS.lage.length}));
console.log('zukaufen geklickt:', ok, 'vorher', vor, 'nachher', nach);
console.log('Seitenfehler', fehler.length, fehler.slice(0,3));
await browser.close();
