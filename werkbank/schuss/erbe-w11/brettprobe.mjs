/* BRETTPROBE — WELCHES BRETT LIEGT NACH 30 WOCHEN UND EINEM ESCAPE OFFEN?
     HAFEN=8941 MARKE=vor node werkbank/schuss/erbe-w11/brettprobe.mjs

   Anlass: auf dem Nachstand springt die Gesamtdeckung nach 30 Wochen und
   einem Escape von 18,0 auf 47,0 %, und `haushalt.tafeln()` meldet zusaetzlich
   `sud .sud-brett` 1293x1091 = 1.410.554 px^2 als OFFEN. Auf dem Vorzustand
   ist dasselbe Brett zugeklappt. Zwischen beiden Staenden liegt nur, dass
   `erb-buch` nicht mehr im DOM steht. Die Frage ist: hat das Erbe-Buch das
   Sud-Brett verdeckt gehalten — und zwar so, dass die Zahl der Welle 10 das
   Sud-Brett nie gesehen hat?

   Ausgegeben wird die Lage JEDES Bretts nach der Buchfuehrung der STADT
   (`BRAUHAUS.stadt.rahmen.lage()`) samt der tatsaechlichen Klasse am Element
   — `stadt-zugeklappt` heisst weggeschnitten, sonst liegt es wirklich auf. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = process.env.HAFEN || '8941';
const MARKE = process.env.MARKE || 'vor';
const W = 2752, H = 1536;

const lies = () => {
  const B = window.BRAUHAUS;
  const bu = document.getElementById('buehne');
  const kx = 2752 / bu.clientWidth, ky = 1536 / bu.clientHeight;
  const gross = [];
  bu.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect();
    const f = r.width * kx * r.height * ky;
    if (f < 200000) return;
    if (r.width >= bu.clientWidth * 0.98 && r.height >= bu.clientHeight * 0.98) return;
    const c = getComputedStyle(el);
    if (c.visibility === 'hidden' || c.display === 'none') return;
    let clip = null, p = el;
    while (p && p !== document.documentElement) {
      if (/inset\(\s*50%/.test(getComputedStyle(p).clipPath || '')) {
        clip = String(p.className || p.tagName).slice(0, 30); break;
      }
      p = p.parentNode;
    }
    gross.push({ k: String(el.className || '').slice(0, 46),
      mass: Math.round(r.width * kx) + 'x' + Math.round(r.height * ky),
      flaeche: Math.round(f), anteilProzent: +(100 * f / (2752 * 1536)).toFixed(1),
      weggeschnitten: clip });
  });
  gross.sort((a, b2) => b2.flaeche - a.flaeche);
  return {
    lage: B.stadt.rahmen.lage(),
    bauhof: B.stadt.rahmen.bauhof(),
    gross: gross.slice(0, 8),
    tafeln: B.haushalt.tafeln().map(t => t.stueck + ' ' + t.klasse + ' ' + t.mass),
    blaetter: B.haushalt.blaetter().map(t => t.stueck + ' ' + t.klasse),
    geklemmt: B.haushalt.geklemmt(),
    erbe: (B.haushalt.miss().je.erbe || {}).px ?? null,
    sud: (B.haushalt.miss().je.sud || {}).px ?? null,
    gesamt: +B.haushalt.miss().gesamt.anteil.toFixed(1),
    verdeckt: B.stadt.rahmen.verdeckt(), lageFehler: B.lage.length
  };
};

const b = await chromium.launch();
for (const e of [1, 4]) {
  const s = await b.newPage({ viewport: { width: W, height: H } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1600);
  for (let i = 0; i < 30; i++) {
    await s.evaluate(() => { const k = document.querySelector('[data-zug="weiter"]'); if (k) k.click(); });
    await s.waitForTimeout(180);
  }
  await s.waitForTimeout(400);
  const vorEsc = await s.evaluate(lies);
  await s.keyboard.press('Escape');
  await s.waitForTimeout(3200);
  const nachEsc = await s.evaluate(lies);
  console.log(`\n===== ${MARKE} E${e} =====`);
  for (const [wie, d] of [['30 Wochen, VOR Escape', vorEsc], ['30 Wochen + 1x Escape', nachEsc]]) {
    console.log(` ${wie}: gesamt ${d.gesamt} % · erbe ${d.erbe} · sud ${d.sud} · verdeckt ${JSON.stringify(d.verdeckt)} · lage ${d.lageFehler}`);
    console.log('   Lage der Bretter:', JSON.stringify(d.lage));
    d.gross.forEach(g => console.log(`     ${String(g.flaeche).padStart(8)} px² (${String(g.anteilProzent).padStart(4)} %) ${g.mass.padEnd(10)} .${g.k}${g.weggeschnitten ? '   WEGGESCHNITTEN von .' + g.weggeschnitten : '   LIEGT OFFEN'}`));
    console.log('   tafeln:', JSON.stringify(d.tafeln), '· blaetter:', JSON.stringify(d.blaetter), '· geklemmt:', JSON.stringify(d.geklemmt));
  }
  await s.close();
}
await b.close();
