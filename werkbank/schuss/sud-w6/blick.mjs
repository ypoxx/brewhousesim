/* BLICK — reine Aufnahme: lade eine Epoche, schlag DEN SUD auf, und schreib
   jeden Knopf mit Trefferprobe (elementFromPoint auf dem KNOPF, nicht auf dem
   Brett), disabled, data-soll-aus, data-preis, Text.
   HAFEN=8917 node blick.mjs <epoche> <wochen> <ziel.json>        */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 0);
const ZIEL = process.argv[4] || `/tmp/sudw6/blick-e${ep}.json`;
const HAFEN = process.env.HAFEN || '8917';
const SAAT = process.env.SAAT || '1350';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 300)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 300)); });

await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

async function ruhe(ms) {
  await seite.waitForTimeout(Math.min(ms, 40));
  try {
    await seite.evaluate(() => new Promise((f) => {
      let ab = false; const fertig = () => { if (!ab) { ab = true; f(1); } };
      setTimeout(fertig, 2000);
      requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(fertig, 0)));
    }));
  } catch (e) {}
}

async function aufnahme() {
  return await seite.evaluate(() => {
    const B = window.BRAUHAUS;
    const zuege = [];
    document.querySelectorAll('[data-zug]').forEach(el => {
      const r = el.getBoundingClientRect();
      const sicht = !!(r.width && r.height);
      let hit = false, t = null;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (sicht && cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
        const e2 = document.elementFromPoint(cx, cy);
        hit = !!(e2 && (e2 === el || el.contains(e2)));
        t = e2 ? (e2.tagName + '.' + (e2.className && e2.className.baseVal !== undefined ? '' : String(e2.className || '')).slice(0, 60)) : null;
      }
      zuege.push({
        zug: el.getAttribute('data-zug'), tag: el.tagName,
        sicht, hit, deckung: t,
        aus: !!el.disabled, sollAus: el.getAttribute('data-soll-aus'),
        preis: el.getAttribute('data-preis'),
        x: Math.round(cx), y: Math.round(cy), w: Math.round(r.width), h: Math.round(r.height),
        text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 90)
      });
    });
    let sud = null;
    try { sud = JSON.parse(JSON.stringify(B.sud && B.sud.stand ? B.sud.stand : (B.sud || null))); } catch (e) { sud = 'unlesbar'; }
    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, epoche: B.welt.epoche && B.welt.epoche.nr,
      kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff,
      lage: B.lage.length, lageTexte: B.lage.slice(0, 6),
      zuege, sud,
      sudKeys: window.BRAUHAUS.sud ? Object.keys(window.BRAUHAUS.sud) : null
    };
  });
}

const reiter = async () => seite.evaluate(() =>
  [...document.querySelectorAll('[data-zug^="stadt:reiter:"]')].map(e => ({
    zug: e.getAttribute('data-zug'), text: (e.innerText || '').trim().slice(0, 30) })));

const r = await reiter();
const sudReiter = r.find(x => /sud/i.test(x.zug) || /sud|brau/i.test(x.text));
const vorher = await aufnahme();
let nachher = null;
if (sudReiter) {
  const l = await seite.evaluate((z) => {
    const el = document.querySelector(`[data-zug="${z}"]`); const b = el.getBoundingClientRect();
    return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
  }, sudReiter.zug);
  await seite.mouse.click(l.x, l.y);
  await ruhe(300);
  nachher = await aufnahme();
}

fs.mkdirSync(ZIEL.replace(/\/[^/]*$/, ''), { recursive: true });
fs.writeFileSync(ZIEL, JSON.stringify({ epoche: ep, hafen: HAFEN, fehler, reiter: r, sudReiter, vorher, nachher }, null, 1));
console.log(`E${ep}: reiter=${r.map(x => x.zug).join(',')}`);
console.log(`  sudReiter=${sudReiter && sudReiter.zug}  lage=${vorher.lage}  fehler=${fehler.length}`);
const n = nachher || vorher;
console.log(`  sud-zuege sichtbar: ${n.zuege.filter(z => /^sud:/.test(z.zug) && z.sicht).length} / gesamt ${n.zuege.filter(z => /^sud:/.test(z.zug)).length}`);
await browser.close();
