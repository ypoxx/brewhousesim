/* DIE ABNAHME — dieselben vier Zaehlungen, die der Kritiker fuehrt.
   node abnahme.mjs */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const alles = {};
for (const ep of [1,2,3,4]) {
  const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
  const fehler = [];
  s.on('pageerror', e => fehler.push('pageerror: '+String(e).slice(0,120)));
  s.on('console', m => { if (m.type()==='error') fehler.push('console: '+m.text().slice(0,120)); });
  await s.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=1350`, { waitUntil:'networkidle' });
  await s.waitForTimeout(800);
  const klick = async (z,w=90) => { const l = await s.evaluate(zz=>{const e=document.querySelector(`[data-zug="${zz}"]`);if(!e)return null;
      const q=e.getBoundingClientRect();if(!q.width||!q.height)return null;
      const t=document.elementFromPoint(q.left+q.width/2,q.top+q.height/2);
      return{x:q.left+q.width/2,y:q.top+q.height/2,aus:!!e.disabled,frei:!!(t&&(t===e||e.contains(t)))};},z);
    if(!l||l.aus||!l.frei)return false; await s.mouse.click(l.x,l.y); await s.waitForTimeout(w); return true; };

  /* 1 — Entscheidungen mit Preisschild, erreichbar UND aktiv, Woche 1 */
  for (const r of await s.evaluate(()=>[...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e=>e.getAttribute('data-zug')))) await klick(r,80);
  await klick('gegner:blatt',150);
  const w1 = await s.evaluate(() => {
    const l = [];
    document.querySelectorAll('[data-zug]').forEach(e => {
      const p = e.getAttribute('data-preis');
      if (p === null || +p === 0) return;
      const q = e.getBoundingClientRect();
      if (!q.width || !q.height || e.disabled) return;
      const cx=q.left+q.width/2, cy=q.top+q.height/2;
      if (cx<0||cy<0||cx>innerWidth||cy>innerHeight) return;
      const t = document.elementFromPoint(cx,cy);
      if (!(t && (t===e || e.contains(t)))) return;
      l.push({ z: e.getAttribute('data-zug'), p: +p });
    });
    return l;
  });
  const meins = w1.filter(x=>/^gegner:/.test(x.z));

  /* 2 — die eigene unwiderrufliche Festlegung */
  const fest = await s.evaluate(()=>{const e=document.querySelector('[data-zug="gegner:gegenzug"]');
    const q=e?e.getBoundingClientRect():null;
    return e?{aus:e.disabled, yp:+(((q.top+q.height/2)/innerHeight)*100).toFixed(1),
      frei:(()=>{const t=document.elementFromPoint(q.left+q.width/2,q.top+q.height/2);return !!(t&&(t===e||e.contains(t)));})(),
      preis:e.getAttribute('data-preis')}:null;});

  /* 4 — die beiden Kennzahlen nebeneinander */
  const zahlen = await s.evaluate(()=>{
    const k = document.querySelector('.deckung'), u = document.querySelector('.gg-kennzahl');
    return { kern: k?+k.getAttribute('data-deckung'):null, kernText: k?k.textContent:null,
             umk: u?+u.getAttribute('data-umkaempft'):null, umkPreis: u?+u.getAttribute('data-umkaempft-preis'):null,
             umkText: u?u.textContent:null };
  });

  /* 3 — Zuege ohne den Spieler, 40 Wochen, kein gegner:-Klick */
  await klick('gegner:blatt-zu',80);
  await s.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=1350`, { waitUntil:'networkidle' });
  await s.waitForTimeout(700);
  const vorher = await s.evaluate(()=>BRAUHAUS.welt.adressenJetzt().filter(a=>a.bindung&&a.bindung.wem&&a.bindung.wem!=='haus').length);
  for (let i=0;i<40;i++){ for (const z of ['preis:tafel-zu','kern:blatt-zu','fuhre:sommer-zu']) await klick(z,40);
    if (!await klick('weiter',60)) break; }
  const nach = await s.evaluate(()=>({
    zuege: BRAUHAUS.gegner.zahl(),
    gehalten: BRAUHAUS.welt.adressenJetzt().filter(a=>a.bindung&&a.bindung.wem&&a.bindung.wem!=='haus').length,
    jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
    lage: BRAUHAUS.lage.length,
    verben: [...new Set(BRAUHAUS.zuege().filter(z=>/^gegner:/.test(z.zug)).map(z=>z.zug.split(':')[1]))]
  }));
  alles['E'+ep] = { entscheidungen: w1.length, davonGegner: meins.length,
    gegnerZuege: meins.map(x=>x.z+' '+x.p), fest, zahlen, vorher, ...nach, fehler: fehler.length, fehlerText: fehler.slice(0,3) };
  console.log(`E${ep}: ${w1.length} Entscheidungen mit Preisschild in Woche 1 (davon ${meins.length} dieses Stuecks)`);
  console.log(`   Festlegung gegner:gegenzug: ${JSON.stringify(fest)}`);
  console.log(`   Kennzahl KERN ${zahlen.kern}x  ·  UMKAEMPFT ${zahlen.umk}x (${zahlen.umkPreis}) — Faktor ${zahlen.kern&&zahlen.umk?(zahlen.kern/zahlen.umk).toFixed(1):'—'}`);
  console.log(`   40 Wochen ohne einen gegner-Klick: ${nach.zuege} Zuege, gehalten ${vorher} -> ${nach.gehalten}, Stand ${nach.jahr}W${nach.woche}, lage=${nach.lage}, Fehler=${fehler.length}`);
  console.log(`   Verben am Schirm: ${nach.verben.join(' · ')}`);
  await s.close();
}
await b.close();
