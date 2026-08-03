/* ZWEI PARTIEN, EIN JAHRHUNDERT, VERSCHIEDENES BIER.
   node zweipartien.mjs <epoche> [wochen]

   Die Frage des Kritikers dieser Welle lautet: "Kann er zwei Partien
   derselben Epoche mit verschiedenem Bier spielen und den Unterschied am
   Bildschirm benennen?" Also wird genau das getan — zweimal dieselbe Saat,
   dieselbe Hand, ein einziger Unterschied:

     TEUER   nimmt die unwiderrufliche Festlegung, sobald sie bezahlbar ist,
             und fuehrt die Hefe jede Woche.
     BILLIG  nimmt die kostenlose Abkuerzung (Hopfen im Sack, Hafer, ohne
             Kuehlung, naturtrueb) und ruehrt die Hefe nie an.

   Verglichen wird NUR, was am Bildschirm steht: die Rangzeile des
   Kesselzettels, die Sorten im Keller, der Gaerkeller, das Sudbuch.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const EP = +(process.argv[2] || 1);
const W = +(process.argv[3] || 120);
const HAFEN = process.env.HAFEN || '8899';

const browser = await chromium.launch();

async function partie(art) {
  const s = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
  const fehler = [];
  s.on('pageerror', e => fehler.push(String(e).slice(0, 140)));
  s.on('console', m => { if (m.type() === 'error') fehler.push(m.text().slice(0, 140)); });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(900);

  const lies = () => s.evaluate(() => {
    const kn = [];
    document.querySelectorAll('[data-zug]').forEach(el => {
      const r = el.getBoundingClientRect(); if (r.width < 3 || r.height < 3) return;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2; let hit = false;
      if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
        const t = document.elementFromPoint(cx, cy); hit = !!(t && (t === el || el.contains(t)));
      }
      kn.push({ zug: el.getAttribute('data-zug'), text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60),
                preis: el.getAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
                aus: !!el.disabled, hit, x: cx, y: cy });
    });
    const B = window.BRAUHAUS, Z = B.SUD_ZUSTAND || {};
    const rang = document.querySelector('.sud-zrang');
    const sorten = {};
    B.welt.vorrat.faesser.forEach(f => { sorten[f.sorte] = (sorten[f.sorte] || 0) + 1; });
    const halt = B.welt.vorrat.faesser.map(f => f.haltbar || 0);
    return { kn, jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
             kasse: B.welt.haus.kasse, faesser: B.welt.vorrat.faesser.length, sorten,
             haltMittel: halt.length ? Math.round(halt.reduce((a, b) => a + b, 0) / halt.length * 10) / 10 : 0,
             lage: B.lage.length,
             rang: rang ? rang.textContent.trim() : null,
             sud: { verfahren: B.sud.verfahren(), fest: Object.keys(Z.fest || {}), guete: Math.round(Z.guete),
                    bottiche: (Z.bottiche || []).length, gestuftGesamt: Z.gestuftGesamt || 0, gestuftJahr: Z.gestuft || 0,
                    gesamtSude: Z.gesamtSude, gesamtFass: Z.gesamtFass, jahrFehl: Z.jahrFehl } };
  });
  const reiter = () => s.evaluate(() =>
    [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e => e.getAttribute('data-zug')));
  async function klick(zug) {
    let z = await lies(); let k = z.kn.find(x => x.zug === zug);
    if (!k || k.aus) {
      /* zugeklapptes eigenes Brett aufschlagen und noch einmal hinsehen */
      for (const r of await reiter()) {
        const rl = (await lies()).kn.find(x => x.zug === r);
        if (!rl || rl.aus || !rl.hit) continue;
        await s.mouse.click(rl.x, rl.y); await s.waitForTimeout(120);
        z = await lies(); k = z.kn.find(x => x.zug === zug);
        if (k && !k.aus && k.hit) break;
      }
    }
    if (!k || k.aus || !k.hit) return false;
    await s.mouse.click(k.x, k.y); await s.waitForTimeout(160); return true;
  }

  const genommen = [];
  for (let i = 0; i < W; i++) {
    let z = await lies();
    if (z.ende) break;
    if (await s.evaluate(() => !!document.querySelector('.fu-sommerblatt'))) {
      if (!(await klick('fuhre:jahresplan:grut'))) await klick('fuhre:jahresplan:duenn');
      await klick('fuhre:sommer-zu');
    }
    /* --- der eine Unterschied --- */
    z = await lies();
    const achsen = z.kn.filter(x => /^sud:[a-z]+:[a-z]+$/.test(x.zug) && !/^sud:(zettel|charge)/.test(x.zug));
    if (art === 'teuer') {
      const fest = achsen.filter(x => x.preis && !x.aus);
      if (fest.length) {
        const b = fest.reduce((a, x) => (Math.abs(x.preis) > Math.abs(a.preis) ? x : a));
        if (await klick(b.zug)) genommen.push(z.jahr + '/' + z.woche + ' ' + b.zug + ' ' + b.preis);
      }
      if (!(await klick('sud:hefe-fuehren'))) await klick('sud:zettel-anstich');
    } else {
      const billig = achsen.filter(x => !x.preis && /Sack|Hafer|Kühlung|Naturtrüb|heimlich/i.test(x.text));
      if (billig.length && !genommen.some(g => g.indexOf(billig[0].zug) >= 0)) {
        if (await klick(billig[0].zug)) genommen.push(z.jahr + '/' + z.woche + ' ' + billig[0].zug);
      }
    }
    /* --- der Betrieb, in beiden Partien gleich --- */
    if (!(await klick('fuhre:wie-vorige'))) await klick('fuhre:fuellen');
    await klick('fuhre:abschicken');
    const vor = z.jahr * 100 + z.woche;
    let n = await lies();
    if (n.jahr * 100 + n.woche === vor) { if (!(await klick('weiter'))) break; }
    await s.waitForTimeout(60);
  }
  const e = await lies();
  await s.close();
  return { art, genommen, e, fehler };
}

const t = await partie('teuer');
const bl = await partie('billig');
for (const r of [t, bl]) {
  console.log(`--- ${r.art.toUpperCase()}  E${EP}  Stand ${r.e.jahr}/${r.e.woche}  lage ${r.e.lage}  Seitenfehler ${r.fehler.length}`);
  console.log('    genommen  :', r.genommen.join(' | ') || '—');
  console.log('    Zettelrang:', r.e.rang);
  console.log('    Verfahren :', JSON.stringify(r.e.sud.verfahren), 'fest', JSON.stringify(r.e.sud.fest));
  console.log('    Guete     :', r.e.sud.guete, '· Bottiche', r.e.sud.bottiche,
              '· Sude', r.e.sud.gesamtSude, '· Fass', r.e.sud.gesamtFass);
  console.log('    Keller    :', r.e.faesser, 'Fass', JSON.stringify(r.e.sorten),
              '· Haltbarkeit im Mittel', r.e.haltMittel, 'Wochen');
  console.log('    Kasse     :', r.e.kasse);
}
await browser.close();
