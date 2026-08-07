/* PROBE — erster Blick auf den Schirm. Kein Spiel, nur Inventur.
   HAFEN=8911 node probe.mjs <epoche> <breite> <hoehe> <ausgabe-praefix>          */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const BR = +(process.argv[3] || 1366);
const HO = +(process.argv[4] || 768);
const PRAEF = process.argv[5] || `/home/user/brewhousesim/werkbank/schuss/spiel-w12/schuesse/probe-e${ep}`;
const HAFEN = process.env.HAFEN || '8911';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: BR, height: HO }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 300)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 300)); });

await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1500);

const inv = await seite.evaluate(() => {
  const B = window.BRAUHAUS;
  const zuege = [];
  document.querySelectorAll('[data-zug]').forEach(el => {
    const r = el.getBoundingClientRect();
    const sicht = !!(r.width && r.height);
    let hit = false, oben = null;
    if (sicht) {
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
        const t = document.elementFromPoint(cx, cy);
        hit = !!(t && (t === el || el.contains(t)));
        if (!hit && t) oben = (t.className || '') + '';
      }
    }
    zuege.push({
      zug: el.getAttribute('data-zug'),
      text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 90),
      titel: el.title || '',
      preis: el.getAttribute('data-preis'),
      aus: !!el.disabled, sicht, hit, oben,
      w: Math.round(r.width), h: Math.round(r.height),
      x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2),
      klasse: (el.className || '') + ''
    });
  });
  // sichtbarer Text der Kopfzeile / Tafeln
  const texte = [];
  document.querySelectorAll('body *').forEach(el => {
    if (el.children.length) return;
    const t = (el.textContent || '').trim();
    if (!t) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    if (r.top > innerHeight || r.left > innerWidth || r.bottom < 0 || r.right < 0) return;
    const cs = getComputedStyle(el);
    texte.push({ t: t.slice(0, 120), px: Math.round(parseFloat(cs.fontSize) * 10) / 10,
                 x: Math.round(r.left), y: Math.round(r.top) });
  });
  return {
    jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, epoche: B.welt.zeit.epoche,
    kasse: B.welt.haus.kasse, name: B.welt.haus.name,
    lage: B.lage.length, lagen: B.lage.map(l => l.text),
    zuege, texte,
    welt: Object.keys(B.welt), stuecke: Object.keys(B.stuecke || {})
  };
});

fs.writeFileSync(PRAEF + '.json', JSON.stringify({ ep, BR, HO, fehler, ...inv }, null, 1));
await seite.screenshot({ path: PRAEF + '.png' });
console.log(`E${ep} ${BR}x${HO}: ${inv.jahr}/${inv.woche} Kasse ${inv.kasse}, ` +
  `${inv.zuege.length} data-zug (${inv.zuege.filter(z => z.sicht).length} sichtbar, ` +
  `${inv.zuege.filter(z => z.hit).length} treffbar, ${inv.zuege.filter(z => z.aus).length} aus), ` +
  `Lage ${inv.lage}, Seitenfehler ${fehler.length}`);
if (fehler.length) console.log(fehler.slice(0, 5).join('\n'));
await browser.close();
