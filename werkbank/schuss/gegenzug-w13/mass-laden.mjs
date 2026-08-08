/* MASS BEIM LADEN — dieselbe Frage wie `mass.mjs`, aber ohne Hand.

   Zwei Bäume, dieselbe URL, derselbe Augenblick: ändert die Aufschrift des
   eigenen Reiters (R16) irgendeine Größe, an der die messende Hand hängt?
   Ohne gespielte Wochen gibt es keine Streuung — was hier abweicht, ist
   meine Änderung und sonst nichts.

   HAFEN_A=8933 HAFEN_B=8934 node mass-laden.mjs                             */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const A = process.env.HAFEN_A || '8933';
const Bp = process.env.HAFEN_B || '8934';
const FENSTER = [[1600, 900], [1920, 1080], [1366, 768], [2752, 1536]];
const LAGEN = [];
for (const ep of [1, 2, 3, 4]) for (const [j, w] of [[0, 0], [3, 10], [8, 22]])
  LAGEN.push({ ep, j, w });

const browser = await chromium.launch();

async function mess(hafen, ep, j, w, br, ho) {
  const seite = await browser.newPage({ viewport: { width: br, height: ho }, deviceScaleFactor: 1 });
  const jahr = [1350, 1600, 1884, 1970][ep - 1] + j;
  const url = `http://127.0.0.1:${hafen}/spiel/?epoche=${ep}&saat=1350`
    + (j || w ? `&jahr=${jahr}&woche=${Math.max(1, w)}` : '');
  await seite.goto(url, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(900);
  const d = await seite.evaluate(() => {
    const r = (s) => { const e = document.querySelector(s); if (!e) return null;
      const b = e.getBoundingClientRect();
      return [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; };
    const B = window.BRAUHAUS;
    const knoepfe = {};
    ['weiter', 'fuhre:abschicken', 'fuhre:wie-vorige', 'fuhre:fuellen', 'preis:tafel']
      .forEach(z => { knoepfe[z] = r(`[data-zug="${z}"]`); });
    return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, kasse: B.welt.haus.kasse,
      lage: B.lage.length, zaehler: (B.gegner ? B.gegner.zahl() : null),
      zeile: r('.stadt-reiterzeile'), werkbank: r('.stadt-werkbank'),
      schmal: !!document.querySelector('.stadt-werkbank.schmal'),
      reiterN: document.querySelectorAll('[data-zug^="stadt:reiter:"]').length,
      meiner: r('[data-zug="stadt:reiter:gegner-amort-gg-band"]'),
      meinerText: (() => { const e = document.querySelector('[data-zug="stadt:reiter:gegner-amort-gg-band"]');
        return e ? (e.innerText || '').trim().replace(/\s+/g, ' ') : null; })(),
      knoepfe };
  });
  await seite.close();
  return d;
}

let abw = 0, n = 0;
for (const [br, ho] of FENSTER) {
  for (const { ep, j, w } of LAGEN) {
    const a = await mess(A, ep, j, w, br, ho);
    const b = await mess(Bp, ep, j, w, br, ho);
    n++;
    const felder = ['zeile', 'werkbank', 'schmal', 'reiterN', 'meiner', 'knoepfe', 'kasse', 'zaehler'];
    const diff = felder.filter(f => JSON.stringify(a[f]) !== JSON.stringify(b[f]));
    const kopf = `${br}x${ho} E${ep} ${a.jahr}/${a.woche} (${a.zaehler} Züge, ${a.reiterN} Reiter, `
      + `${a.schmal ? 'schmal' : 'breit'})`;
    if (diff.length) {
      abw++;
      console.log(`${kopf}  ABWEICHUNG: ${diff.join(',')}`);
      diff.forEach(f => console.log(`    ${f}  A ${JSON.stringify(a[f])}\n         B ${JSON.stringify(b[f])}`));
    } else {
      console.log(`${kopf}  gleich   Reiter A "${a.meinerText}" ${JSON.stringify(a.meiner)}`);
      console.log(`${' '.repeat(kopf.length)}           Reiter B "${b.meinerText}" ${JSON.stringify(b.meiner)}`);
    }
  }
}
console.log(`\n${abw} Abweichungen in ${n} Lagen (4 Fenster x 4 Epochen x 3 Zeitpunkte).`);
await browser.close();
