/* GEGENPROBE: spielt wie ein Mensch — wer an ein verdecktes Brett will,
   klappt das Brett darüber zu. Sonst identisch zum sparsamen Stil der Eichung. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const EP = +(process.argv[2] || 2);
const WOCHEN = +(process.argv[3] || 100);
const ALT = process.env.ALT === '1';   // ALT=1 → wie die Eichung: alles offen lassen

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(900);

const lage = z => seite.evaluate(zz => {
  const el = document.querySelector(`[data-zug="${zz}"]`);
  if (!el) return null;
  const q = el.getBoundingClientRect();
  if (!q.width || !q.height) return { aus: true, hit: false };
  const cx = q.left + q.width / 2, cy = q.top + q.height / 2;
  const t = (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) ? document.elementFromPoint(cx, cy) : null;
  const brett = el.closest('.fu-brett, .sud-brett, .gg-band, .nm-band, [class*="-brett"]');
  return { aus: !!el.disabled, hit: !!(t && (t === el || el.contains(t))), x: cx, y: cy,
           zu: !!el.closest('.stadt-zugeklappt'),
           deckeBrett: (() => { let n = t; while (n && n !== document.body) {
             const k = (n.className && n.className.baseVal !== undefined ? n.className.baseVal : n.className) || '';
             if (/-brett|-band/.test(String(k))) return String(k).trim().split(/\s+/)[0]; n = n.parentElement; } return null; })(),
           eigenBrett: brett ? (brett.className || '').trim().split(/\s+/)[0] : null };
}, z);

const alleReiter = () => seite.evaluate(() =>
  [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e => e.getAttribute('data-zug')));

/* Klicken, notfalls das eigene Brett aufschlagen.

   Seit die STADT eine Platzordnung hat, genügt genau das: wer aufschlägt,
   liegt oben, und was ihn zudecken würde, klappt von selbst zu. Vorher
   musste man zusätzlich das fremde Brett darüber wegräumen — diese
   Heuristik ist jetzt falsch, weil sie gegen die Platzordnung arbeitet.

   Welcher Reiter zu welchem Brett gehört, wird nicht geraten, sondern
   ausprobiert: nach jedem Reiterklick wird das Ziel neu angefasst. */
async function roh(z) {
  let l = await lage(z);
  if (!l || l.aus) return false;
  if (!l.hit && !ALT) {
    for (const r of await alleReiter()) {
      await seite.evaluate(x => { const e = document.querySelector(`[data-zug="${x}"]`); if (e) e.click(); }, r);
      await seite.waitForTimeout(120);
      l = await lage(z);
      if (l && l.hit) break;
      if (l && !l.zu) continue;      /* eigenes Brett liegt offen — weitersuchen */
    }
  }
  if (!l || l.aus || !l.hit) return false;
  await seite.mouse.click(l.x, l.y);
  await seite.waitForTimeout(90);
  return true;
}

if (ALT) {   // die Eichung klappt zu Beginn alles auf
  for (let i = 0; i < 2; i++)
    for (const r of await seite.evaluate(() => [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e => e.getAttribute('data-zug')))) {
      const vor = await seite.evaluate(() => document.querySelectorAll('.stadt-zugeklappt').length);
      if (!vor) break;
      await seite.evaluate(x => { const e = document.querySelector(`[data-zug="${x}"]`); if (e) e.click(); }, r);
      await seite.waitForTimeout(80);
      if ((await seite.evaluate(() => document.querySelectorAll('.stadt-zugeklappt').length)) > vor)
        await seite.evaluate(x => { const e = document.querySelector(`[data-zug="${x}"]`); if (e) e.click(); }, r);
    }
}

const blick = () => seite.evaluate(() => ({
  jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
  kasse: Math.round(BRAUHAUS.welt.haus.kasse), roh: BRAUHAUS.welt.haus.rohstoff,
  keller: BRAUHAUS.welt.vorrat.faesser.length
}));

const jahre = {};
let kaeufe = 0;
for (let i = 0; i < WOCHEN; i++) {
  const b = await blick();
  if (b.woche === 1) {
    if (await seite.evaluate(() => !!document.querySelector('.fu-sperre'))) {
      if (!(await roh('fuhre:jahresplan:grut'))) await roh('fuhre:jahresplan:duenn');
      await roh('fuhre:sommer-zu');
    }
    const t = await lage('preis:tafel');
    if (t && t.hit) await seite.mouse.click(t.x, t.y), await seite.waitForTimeout(200);
  }
  (jahre[b.jahr] = jahre[b.jahr] || []).push(b);

  const vor = b.jahr * 100 + b.woche;
  if (b.roh < 30) { if (await roh('fuhre:kauf:rohstoff')) kaeufe++; }
  if (!(await roh('fuhre:wie-vorige'))) await roh('fuhre:fuellen');
  await roh('fuhre:abschicken');
  let n = await blick();
  if (n.jahr * 100 + n.woche === vor) {
    if (!(await roh('weiter'))) {
      await roh('fuhre:sommer-zu'); await seite.keyboard.press('Escape');
      if (!(await roh('weiter'))) { console.log(`# Abbruch ${b.jahr}/${b.woche}`); break; }
    }
  }
}
await browser.close();

console.log(`EPOCHE ${EP} · ${ALT ? 'wie die Eichung (alles offen)' : 'wie ein Spieler (Bretter freiräumen)'}`
  + ` · ${WOCHEN} Wochen · ${kaeufe} Rohstoffkäufe`);
for (const [j, ws] of Object.entries(jahre)) {
  const k = ws.map(w => w.kasse), r = ws.map(w => w.roh);
  console.log(`  ${j}  Kasse ${String(k[0]).padStart(6)} → ${String(k[k.length-1]).padStart(6)}`
    + `  (min ${String(Math.min(...k)).padStart(5)})   Rohstoff ${String(Math.min(...r)).padStart(4)}…${String(Math.max(...r)).padStart(4)}`
    + `   Keller max ${Math.max(...ws.map(w => w.keller))}`);
}
