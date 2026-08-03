/* Aufsicht, zweiter Anlauf. Der erste klickte alle 430 ms auf DASSELBE Element
   und hat damit vermutlich Leerklicks gemessen. Jetzt: echte, verschiedene,
   nicht gesperrte Zuege, und es wird MITGEZAEHLT, wie viele wirklich landen —
   eine Gegenprobe ohne Klickzahl ist keine. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const SEK = 30;
const erg = {};
for (const e of [1,2,3,4]) {
  for (const modus of ['still','gespielt']) {
    const s = await b.newPage({ viewport: { width: 1600, height: 1000 } });
    await s.goto(`http://127.0.0.1:8899/spiel/?epoche=${e}&saat=1350`, { waitUntil:'networkidle' });
    await s.waitForTimeout(1500);
    await s.evaluate(() => {
      const kn = BRAUHAUS.ton.ausgang(); const ctx = kn.context;
      const an = ctx.createAnalyser(); an.fftSize = 2048; kn.connect(an);
      const buf = new Float32Array(an.fftSize); window.__p = [];
      window.__t = setInterval(() => { an.getFloatTimeDomainData(buf);
        let q=0; for (let i=0;i<buf.length;i++) q+=buf[i]*buf[i];
        window.__p.push(Math.sqrt(q/buf.length)); }, 100);
    });
    let klicks = 0, versuche = 0;
    if (modus === 'gespielt') {
      const bis = Date.now() + SEK*1000;
      let i = 0;
      while (Date.now() < bis) {
        const z = await s.$$('[data-zug]:not([disabled])');
        if (!z.length) break;
        const el = z[i++ % z.length];
        const schl = await el.getAttribute('data-zug').catch(()=>null);
        versuche++;
        const vorher = await s.evaluate(() => BRAUHAUS.welt.zeit.woche + ':' + BRAUHAUS.welt.haus.kasse);
        await el.click({ timeout: 1200 }).catch(()=>{});
        await s.waitForTimeout(180);
        const nachher = await s.evaluate(() => BRAUHAUS.welt.zeit.woche + ':' + BRAUHAUS.welt.haus.kasse);
        if (vorher !== nachher || /weiter/.test(schl||'')) klicks++;
      }
    } else { await s.waitForTimeout(SEK*1000); }
    const r = await s.evaluate(() => { clearInterval(window.__t);
      const p = window.__p||[]; const n = p.length||1;
      return { n, rms: Math.sqrt(p.reduce((a,x)=>a+x*x,0)/n) }; });
    erg[`${e}-${modus}`] = r;
    console.log(`E${e} ${modus.padEnd(9)} rms=${r.rms.toFixed(4)} proben=${r.n}` +
                (modus==='gespielt' ? `  wirksame Klicks=${klicks}/${versuche}` : ''));
    await s.close();
  }
}
await b.close();
console.log('\n  Epoche  still/gespielt  (je niedriger, desto mehr traegt der Vorgang)');
for (const e of [1,2,3,4]) {
  const a = erg[`${e}-still`], c = erg[`${e}-gespielt`];
  console.log(`    ${e}       ${(100*a.rms/c.rms).toFixed(0)} %`);
}
