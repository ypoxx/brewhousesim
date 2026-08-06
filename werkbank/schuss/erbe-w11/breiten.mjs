/* BREITEN — was die Knoepfe der Erbe-Leiste an Platz WIRKLICH brauchen, und
   wieviel vom Buch benutzt ist.  Entwurfsgrundlage, keine Abnahme.

     HAFEN=8941 node werkbank/schuss/erbe-w11/breiten.mjs

   Misst je Epoche im Ladezustand UND nach 30 Wochen (ohne Escape):
     · je erbe-Knopf: scrollWidth des .wort, Breite des .preis, ganze Breite
     · das Buch: Hoehe des Inhalts gegen die Hoehe des Kastens (das untere
       Drittel des Kritikers)
     · alle Kaesten des Stuecks mit Mass                                     */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8941';
const W = 2752, H = 1536;

const lies = () => {
  const B = window.BRAUHAUS;
  const bu = document.getElementById('buehne');
  const kx = 2752 / bu.clientWidth;
  const knoepfe = [];
  document.querySelectorAll('.fach-erbe button[data-zug], .erb-leiste button, .erb-buch button').forEach(k => {
    const w = k.querySelector('.wort'), p = k.querySelector('.preis');
    const r = k.getBoundingClientRect();
    knoepfe.push({
      zug: k.getAttribute('data-zug'),
      text: (w ? w.textContent : k.textContent).trim(),
      wortNoetig: w ? Math.ceil(w.scrollWidth * kx) : 0,
      wortHat: w ? Math.ceil(w.clientWidth * kx) : 0,
      gekuerzt: w ? w.scrollWidth > w.clientWidth + 1 : false,
      preisBr: p ? Math.ceil(p.getBoundingClientRect().width * kx) : 0,
      preisText: p ? p.textContent : '',
      br: Math.round(r.width * kx), ho: Math.round(r.height * (1536 / bu.clientHeight))
    });
  });
  /* Das Buch: wo endet der Inhalt? */
  const buch = document.querySelector('.erb-buch');
  let buchInfo = null;
  if (buch) {
    const rb = buch.getBoundingClientRect();
    let unten = rb.top;
    buch.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.height < 1) return;
      if (r.bottom > unten) unten = r.bottom;
    });
    buchInfo = {
      mass: Math.round(rb.width * kx) + 'x' + Math.round(rb.height * (1536 / bu.clientHeight)),
      flaecheAnteil: +(100 * (rb.width * rb.height) / (bu.clientWidth * bu.clientHeight)).toFixed(1),
      inhaltHoehe: Math.round((unten - rb.top) * (1536 / bu.clientHeight)),
      kastenHoehe: Math.round(rb.height * (1536 / bu.clientHeight)),
      scrollH: buch.scrollHeight, clientH: buch.clientHeight,
      zuege: buch.querySelectorAll('[data-zug]').length,
      zugeklappt: buch.className,
      laden: [...buch.querySelectorAll('.erb-lade')].map(l => ({
        k: l.className.replace('erb-lade ', ''),
        h: Math.round(l.getBoundingClientRect().height * (1536 / bu.clientHeight)),
        n: l.querySelectorAll('.erb-satz').length
      }))
    };
  }
  const band = document.querySelector('.erb-band');
  return {
    knoepfe, buch: buchInfo,
    band: band ? { br: Math.round(band.getBoundingClientRect().width * kx),
                   ho: Math.round(band.getBoundingClientRect().height * (1536 / bu.clientHeight)),
                   spalten: band.children.length,
                   text: band.textContent.trim().replace(/\s+/g, ' ').slice(0, 160) } : null,
    erbe: B.haushalt.miss().je.erbe || null,
    stand: B.erbe ? { erbfaelle: B.erbe.stand().erbfaelle, taten: B.erbe.stand().taten } : null
  };
};

const b = await chromium.launch();
const aus = [];
for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: W, height: H } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1600);
  const laden = await s.evaluate(lies);
  for (let i = 0; i < 30; i++) {
    await s.evaluate(() => { const k = document.querySelector('[data-zug="weiter"]'); if (k) k.click(); });
    await s.waitForTimeout(180);
  }
  await s.waitForTimeout(900);
  const w30 = await s.evaluate(lies);
  /* Buch aufschlagen: den Reiter der STADT klicken, damit der Inhalt echt misst */
  await s.evaluate(() => {
    const r = [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')]
      .find(x => /erbe/.test(x.getAttribute('data-zug')));
    if (r) r.click();
  });
  await s.waitForTimeout(900);
  const offen = await s.evaluate(lies);
  aus.push({ epoche: e, laden, w30, buchOffen: offen });
  console.log(`\n===== E${e} =====`);
  for (const [wie, d] of [['laden', laden], ['w30', w30], ['w30+buch auf', offen]]) {
    console.log(` -- ${wie}: erbe ${d.erbe ? d.erbe.px + ' px (oben ' + d.erbe.obenPx + ')' : '—'}`);
    if (d.band) console.log(`    band ${d.band.br}x${d.band.ho}, ${d.band.spalten} Spalten: ${d.band.text}`);
    d.knoepfe.filter(k => /erbe:(uebergabe|tafel|widerspruch|nachschrift|verlaengern|anfechten|seelgeraet)/.test(k.zug || ''))
      .forEach(k => console.log(`    ${String(k.br).padStart(4)}x${k.ho}  wort ${String(k.wortNoetig).padStart(4)}/${String(k.wortHat).padStart(4)}${k.gekuerzt ? ' GEKUERZT' : '        '} preis ${String(k.preisBr).padStart(3)} "${k.preisText}"  ${k.zug}  ${k.text}`));
    if (d.buch) console.log(`    buch ${d.buch.mass} = ${d.buch.flaecheAnteil} % · Inhalt ${d.buch.inhaltHoehe} von ${d.buch.kastenHoehe} px · scroll ${d.buch.scrollH}/${d.buch.clientH} · ${d.buch.zuege} Zuege · Laden ${JSON.stringify(d.buch.laden)}`);
  }
  await s.close();
}
await b.close();
writeFileSync('werkbank/schuss/erbe-w11/messungen/breiten.json', JSON.stringify(aus, null, 1));
console.log('\ngeschrieben');
