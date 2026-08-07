/* WER RAGT AUS DER BANDLISTE — die 8 px, die `schmal.mjs` bei 1366x768 meldet.

   `.gg-bandliste` hat `overflow-x: hidden`; bei 1366 px liegt ihre scrollWidth
   5 bis 8 px ueber der clientWidth. Das heisst: irgendein Nachkomme steht
   rechts hinaus und wird abgeschnitten. Auflage 10 unterscheidet, WAS da
   abgeschnitten wird — eine falsch gelesene Zahl ist schlimmer als ein
   gekuerzter Satz. Also wird nicht geraten, sondern der Uebeltaeter benannt.

     HAFEN=8962 BREITE=1366 node werkbank/schuss/gegner-w11/bandrand.mjs
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN  = process.env.HAFEN || '8962';
const BREITE = +(process.env.BREITE || 1366), HOEHE = +(process.env.HOEHE || 768);
const b = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: BREITE, height: HOEHE } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1300);
  const r = await s.evaluate(() => {
    const l = document.querySelector('.gg-bandliste');
    if (!l) return { fehlt: true };
    const rl = l.getBoundingClientRect();
    const innen = rl.right - parseFloat(getComputedStyle(l).borderRightWidth || 0);
    const raus = [];
    [...l.querySelectorAll('*')].forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width < 1) return;
      const ueber = r.right - innen;
      if (ueber <= 0.5) return;
      const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
      raus.push({ klasse: String(el.className || ''), tag: el.tagName.toLowerCase(),
                  ueber: Math.round(ueber * 10) / 10,
                  breite: Math.round(r.width), links: Math.round(r.left - rl.left),
                  kinder: el.children.length,
                  ziffern: /\d/.test(t), text: t.slice(0, 70) });
    });
    raus.sort((a, b) => b.ueber - a.ueber);
    return { liste: `${Math.round(l.clientWidth)}×${Math.round(l.clientHeight)}`,
             scrollWidth: l.scrollWidth, clientWidth: l.clientWidth, raus };
  });
  console.log(`=== EPOCHE ${e}  .gg-bandliste ${r.liste}  scrollWidth ${r.scrollWidth} vs clientWidth ${r.clientWidth}`);
  if (r.fehlt) { console.log('  keine .gg-bandliste'); }
  else if (!r.raus.length) console.log('  KEIN Nachkomme ragt ueber die rechte Innenkante');
  else r.raus.forEach(x => console.log(
    `  +${String(x.ueber).padStart(5)} px  ${x.tag}.${x.klasse}  (${x.breite} px breit, links ${x.links}, ` +
    `${x.kinder} Kinder)${x.ziffern ? '  [ZIFFERN]' : ''}\n       „${x.text}“`));
  await s.close();
}
await b.close();
