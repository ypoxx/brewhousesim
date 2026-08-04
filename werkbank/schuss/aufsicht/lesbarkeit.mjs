/* Lesbarkeit und Bedienbarkeit, statisch am gezeichneten Bild gemessen —
   ohne Klicks, ohne Zeitmessung, damit es neben einem laufenden Kritiker
   ehrlich bleibt.
     HAFEN=8899 BREITE=1280 node werkbank/schuss/aufsicht/lesbarkeit.mjs  */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8899';
const BREITE = +(process.env.BREITE || 1600), HOEHE = +(process.env.HOEHE || 1000);
const b = await chromium.launch();
let gesUeber = 0, gesKlein = 0, gesZiel = 0, gesKnopf = 0;
for (const e of [1,2,3,4]) {
  const s = await b.newPage({ viewport: { width: BREITE, height: HOEHE } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil:'networkidle' });
  await s.waitForTimeout(1300);
  const r = await s.evaluate(() => {
    const alle = [...document.querySelectorAll('*')];
    let ueber = 0, klein = 0, winzig = 0, prefix = {};
    const groessen = {};
    alle.forEach(el => {
      const c = getComputedStyle(el);
      if (el.children.length === 0 && (el.textContent||'').trim()) {
        const px = parseFloat(c.fontSize);
        groessen[Math.round(px)] = (groessen[Math.round(px)]||0)+1;
        if (px < 12) klein++;
        if (px < 10) winzig++;
      }
      if (c.overflow === 'hidden' || c.overflowY === 'hidden') {
        if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) {
          ueber++;
          const z = el.className && typeof el.className === 'string' ? el.className.split(/[\s-]/)[0] : '?';
          prefix[z] = (prefix[z]||0)+1;
        }
      }
    });
    // Knopfgroessen: WCAG empfiehlt 24x24 CSS-px als Mindestziel
    const kn = [...document.querySelectorAll('[data-zug]')].filter(x=>!x.disabled);
    const zuKlein = kn.filter(x => { const c = x.getBoundingClientRect();
      return c.width>0 && c.height>0 && (c.width < 24 || c.height < 24); });
    return { ueber, klein, winzig, prefix, knoepfe: kn.length, zuKlein: zuKlein.length,
             groessen: Object.entries(groessen).sort((a,b)=>a[0]-b[0]).slice(0,6) };
  });
  gesUeber += r.ueber; gesKlein += r.klein; gesZiel += r.zuKlein; gesKnopf += r.knoepfe;
  console.log(`  E${e}: ${r.ueber} abgeschnittene Kaesten · ${r.klein} Textknoten unter 12px (davon ${r.winzig} unter 10px) · ` +
              `${r.zuKlein} von ${r.knoepfe} aktiven Knoepfen unter 24px`);
  const top = Object.entries(r.prefix).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([k,v])=>`${k}:${v}`).join('  ');
  if (top) console.log(`       Ueberlauf nach Stueck: ${top}`);
  console.log(`       kleinste Schriftgroessen: ${r.groessen.map(([px,n])=>`${px}px×${n}`).join('  ')}`);
  await s.close();
}
await b.close();
console.log(`\n  Summe ${BREITE}×${HOEHE}: ${gesUeber} Ueberlaeufe · ${gesKlein} Textknoten unter 12px · ${gesZiel} von ${gesKnopf} Knoepfen unter 24px`);
