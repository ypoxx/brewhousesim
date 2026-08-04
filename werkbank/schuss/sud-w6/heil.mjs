/* HEIL — ist es ganz? Vier Epochen laden, DEN SUD aufschlagen, BRAUHAUS.lage,
   Konsolenfehler, und Text, der ueber seinen Kasten laeuft.
   Gemessen wird ZWEIMAL: beim Laden und nach WOCHEN sorgfaeltig gespielten
   Wochen (ein Fehler, der nur den trifft, der wirklich spielt, bleibt sonst
   unentdeckt).
   HAFEN=8917 node heil.mjs <epoche> <wochen> <ziel.json>                    */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 30);
const ZIEL = process.argv[4] || `/tmp/sudw6/heil-e${ep}.json`;
const HAFEN = process.env.HAFEN || '8917';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 300)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 300)); });

await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1500);

async function ruhe(ms) {
  await seite.waitForTimeout(Math.min(ms, 40));
  try { await seite.evaluate(() => new Promise((f) => {
    let ab = false; const fertig = () => { if (!ab) { ab = true; f(1); } };
    setTimeout(fertig, 2000);
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(fertig, 0)));
  })); } catch (e) {}
}
async function lage(zug) {
  return await seite.evaluate((z) => {
    const el = document.querySelector(`[data-zug="${z}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return { sichtbar: false, aus: !!el.disabled, hit: false };
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const t = (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight)
      ? document.elementFromPoint(cx, cy) : null;
    return { sichtbar: true, aus: !!el.disabled, hit: !!(t && (t === el || el.contains(t))), x: cx, y: cy };
  }, zug);
}
async function klick(zug, w = 80) {
  const l = await lage(zug);
  if (!l || !l.sichtbar || l.aus || !l.hit) return false;
  await seite.mouse.click(l.x, l.y); await ruhe(w); return true;
}
async function sudAuf() {
  for (let v = 0; v < 5; v++) {
    const zu = await seite.evaluate(() =>
      !!document.querySelector('button[data-zug^="sud:"][data-aus-grund="brett-zugeklappt"]'));
    if (!zu) return true;
    if (!(await klick('stadt:reiter:sud-sud-brett', 300))) return false;
  }
  return false;
}

/* Text, der ueber seinen Kasten laeuft. Gemessen wird der ueberlaufende
   INHALT (scrollWidth/scrollHeight gegen clientWidth/clientHeight) an
   Elementen, die wirklich Text tragen — und zwar nur dort, wo der Kasten
   nicht selbst scrollen darf. */
async function ueberlauf() {
  return await seite.evaluate(() => {
    const raus = [];
    document.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const st = getComputedStyle(el);
      if (st.overflow !== 'visible' && st.overflow !== '' ) {
        if (/auto|scroll/.test(st.overflowX + st.overflowY)) return;
      }
      const dx = el.scrollWidth - el.clientWidth, dy = el.scrollHeight - el.clientHeight;
      if (dx <= 1 && dy <= 1) return;
      if (!el.clientWidth || !el.clientHeight) return;
      const txt = (el.innerText || '').trim();
      if (!txt) return;
      /* Nur Blattkaesten: ein Kasten, dessen Kind ueberlaeuft, wird ueber das
         Kind gemeldet, nicht doppelt. */
      raus.push({ klasse: String(el.className).slice(0, 70), tag: el.tagName,
        zug: el.getAttribute && el.getAttribute('data-zug'),
        dx, dy, w: Math.round(r.width), h: Math.round(r.height),
        ov: st.overflowX + '/' + st.overflowY,
        text: txt.replace(/\s+/g, ' ').slice(0, 80) });
    });
    return raus;
  });
}

const messe = async (marke) => {
  const l = await seite.evaluate(() => ({
    lage: window.BRAUHAUS.lage.length, lageTexte: window.BRAUHAUS.lage.slice(0, 5),
    jahr: window.BRAUHAUS.welt.zeit.jahr, woche: window.BRAUHAUS.welt.zeit.woche }));
  const u = await ueberlauf();
  const uSud = u.filter(x => /sud|kessel/i.test(x.klasse) || /^sud:/.test(x.zug || ''));
  return { marke, ...l, ueberlaufGesamt: u.length, ueberlaufSud: uSud.length,
    beispiele: u.slice(0, 12), sudBeispiele: uSud.slice(0, 12) };
};

const raus = { epoche: ep, hafen: HAFEN, messungen: [] };
await sudAuf();
raus.messungen.push(await messe('geladen, Sudbrett aufgeschlagen'));
await seite.screenshot({ path: `/tmp/sudw6/heil-e${ep}-start.png` });

/* jetzt sorgfaeltig spielen */
for (let i = 0; i < WOCHEN; i++) {
  await sudAuf();
  const knoepfe = await seite.evaluate(() => {
    const r = [];
    document.querySelectorAll('button[data-zug^="sud:"]').forEach(e => {
      if (!e.disabled) r.push(e.getAttribute('data-zug'));
    });
    return r;
  });
  for (const k of knoepfe.filter(k => /^sud:(hefe-fuehren|anstich-jung)$/.test(k))) await klick(k, 90);
  for (const k of knoepfe.filter(k => /^sud:[a-z]+:[a-z]+$/.test(k)).slice(-1)) await klick(k, 120);
  await klick('fuhre:wie-vorige', 60); await klick('fuhre:fuellen', 60);
  await klick('fuhre:abschicken', 100);
  if (!(await klick('weiter', 120))) break;
}
await sudAuf();
raus.messungen.push(await messe(`nach ${WOCHEN} gespielten Wochen`));
await seite.screenshot({ path: `/tmp/sudw6/heil-e${ep}-gespielt.png` });
raus.fehler = fehler;

fs.mkdirSync(ZIEL.replace(/\/[^/]*$/, ''), { recursive: true });
fs.writeFileSync(ZIEL, JSON.stringify(raus, null, 1));
raus.messungen.forEach(m => console.log(`E${ep} ${m.marke}: ${m.jahr}/${m.woche} lage=${m.lage} `
  + `Ueberlauf gesamt ${m.ueberlaufGesamt} davon SUD ${m.ueberlaufSud}`));
console.log(`E${ep} Konsolenfehler: ${fehler.length}` + (fehler.length ? ' — ' + fehler.slice(0, 3).join(' | ') : ''));
await browser.close();
