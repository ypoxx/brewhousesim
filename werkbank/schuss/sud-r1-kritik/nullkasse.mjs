// Harte Regel: Kasse auf null (und Kammer leer) — bleibt ein Zug, der etwas ändert?
// Der Zustand wird über die Welt-API hergestellt, geprüft wird mit echten Mausklicks.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const EP = +(process.argv[2] || 1);
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 2752, height: 1536 } });
const fehler = [];
s.on('pageerror', (e) => fehler.push('pageerror: ' + e));
await s.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=4242`, { waitUntil: 'networkidle' });
await s.waitForTimeout(900);

const lies = () => s.evaluate(() => {
  const kn = [];
  document.querySelectorAll('button[data-zug]').forEach((el) => {
    const r = el.getBoundingClientRect(); if (r.width < 3) return;
    const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    kn.push({ zug: el.getAttribute('data-zug'), text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 70), aktiv: !el.disabled, getroffen: !!(t && (t === el || el.contains(t))), x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) });
  });
  return {
    kopf: Array.from(document.querySelectorAll('.marke')).map((m) => m.innerText.trim() + '=' + ((m.nextElementSibling || {}).innerText || '').trim()).join(' | '),
    schirm: (document.body.innerText || '').replace(/\s+/g, ' '),
    kn,
  };
});
const klapp = async () => { for (let i = 0; i < 3; i++) { const z = await lies(); const zu = z.kn.filter(k => /^stadt:reiter:/.test(k.zug) && /zugeklappt/.test(k.text) && k.getroffen); if (!zu.length) break; for (const k of zu) { await s.mouse.click(k.x, k.y); await s.waitForTimeout(90); } } };
await klapp();

// Zustand herstellen: Kasse 0, Rohstoff 0, Keller leer, Gärkeller leer
await s.evaluate(() => {
  const B = window.BRAUHAUS;
  B.welt.zahle(B.welt.haus.kasse, 'Prüfung: Kasse auf null');
  B.welt.haus.rohstoff = 0;
  try { B.welt.nimmHeraus(B.welt.vorrat.faesser.length); } catch (e) {}
  B.welt.vorrat.faesser.length = 0;
  if (B.sud && B.sud.gaerkeller && B.sud.gaerkeller.faesser) B.sud.gaerkeller.faesser.length = 0;
  B.sende('zeichne', { grund: 'pruefung' });
});
await s.waitForTimeout(500);
await klapp();
const vor = await lies();
console.log('=== EPOCHE', EP, '===');
console.log('ZUSTAND:', vor.kopf);
const frei = vor.kn.filter((k) => k.aktiv && k.getroffen);
console.log('aktiv UND von elementFromPoint getroffen:', frei.length);
const sud = frei.filter((k) => /^sud:/.test(k.zug));
console.log('davon SUD:', sud.length, sud.map((k) => k.zug + ' "' + k.text + '"').join(' | '));
// jeden freien Sud-Zug einzeln klicken und prüfen, ob sich der Schirm ändert
for (const k of sud) {
  const a = await lies();
  await s.mouse.click(k.x, k.y);
  await s.waitForTimeout(300);
  const n = await lies();
  const gleich = a.schirm === n.schirm;
  console.log('  KLICK', k.zug, '->', gleich ? 'NICHTS GEÄNDERT' : 'Schirm geändert', '| kopf:', n.kopf.slice(0, 90));
}
// und ein WEITER: ändert die Woche etwas?
const a = await lies();
const wt = a.kn.find((k) => k.zug === 'weiter' && k.aktiv && k.getroffen);
if (wt) { await s.mouse.click(wt.x, wt.y); await s.waitForTimeout(400); }
const n = await lies();
console.log('  WEITER ->', a.schirm === n.schirm ? 'NICHTS GEÄNDERT' : 'Schirm geändert', '|', n.kopf);
console.log('Fehler:', fehler.length ? fehler : 'keine');
await s.screenshot({ path: `/tmp/claude-0/-home-user-brewhousesim/2945a2cf-1639-5611-b3d8-e1847b092d58/scratchpad/null-e${EP}.png` });
await b.close();
