// sitz.mjs — WARUM verliert der Kesselzettel seinen Platz, und wo waere noch
// einer frei?
//
//   node sitz.mjs <epoche> <hafen> <ausgabe.json>
//
// Spielt sorgfaeltig wie rettung.mjs, aber ohne das Sudbrett aufzuschlagen.
// In jeder Woche, in der der Zettel `beiseite` traegt, wird
//   (a) fuer jede der acht ZETTELSTELLEN festgehalten, WORAN sie scheitert
//       (eigener Knopf nicht getroffen / fremder Zug begraben — mit Namen),
//   (b) ein Raster ueber die ganze Buehne gelegt und gezaehlt, wie viele
//       Stellen den Zettel tragen wuerden.

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const EPOCHE = +(process.argv[2] || 1);
const HAFEN = +(process.argv[3] || 8913);
const AUS = process.argv[4] || '/tmp/sitz.json';
const ROH = [40, 65, 120, 340][EPOCHE - 1];
const STARTJAHR = [1350, 1600, 1884, 1970][EPOCHE - 1];
const WOCHEN = +(process.argv[5] || 120);

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const fehler = [];
seite.on('pageerror', (e) => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EPOCHE}&saat=1350`,
  { waitUntil: 'networkidle', timeout: 60000 });
await seite.waitForTimeout(900);

const lage = (z) => seite.evaluate((zz) => {
  const k = document.querySelector(`button[data-zug="${zz}"]`);
  if (!k) return null;
  const r = k.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const drin = r.width >= 3 && r.height >= 3 && x >= 0 && y >= 0 && x <= innerWidth && y <= innerHeight;
  const t = drin ? document.elementFromPoint(x, y) : null;
  return { x, y, aus: !!k.disabled, trifft: !!(t && (t === k || k.contains(t))) };
}, z);
const klick = async (z, w = 40) => {
  const p = await lage(z);
  if (!p || p.aus || !p.trifft) return false;
  await seite.mouse.click(p.x, p.y); await seite.waitForTimeout(w); return true;
};

// Der Kern der Untersuchung: den Zettel probeweise auf eine Stelle setzen und
// die beiden Bedingungen von zettelSitzt() EINZELN beantworten.
const PROBE = ({ raster }) => {
  const B = window.BRAUHAUS;
  const z = document.querySelector('.sud-zettel');
  if (!z) return null;
  const buehne = document.getElementById('buehne') || document.body;
  const bb = buehne.getBoundingClientRect();
  const merkeKlasse = z.className, merkeL = z.style.left, merkeT = z.style.top;
  z.classList.remove('beiseite');

  const ORT = { x: 30, y: 47 };            // 'sudhaus' aus kern/orte.js

  function pruefe() {
    const kn = z.querySelectorAll('button[data-zug]');
    const eigenAus = [];
    for (const k of kn) {
      if (k.getAttribute('data-soll-aus') === '1') continue;
      const r = k.getBoundingClientRect();
      if (r.width < 3 || r.height < 3) { eigenAus.push(k.getAttribute('data-zug') + ' [0x0]'); continue; }
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) {
        eigenAus.push(k.getAttribute('data-zug') + ' [aus dem Bild]'); continue;
      }
      const t = document.elementFromPoint(x, y);
      if (!(t && (t === k || k.contains(t)))) {
        eigenAus.push(k.getAttribute('data-zug') + ' [' + (t ? (t.className || t.tagName) : 'nichts') + ']');
      }
    }
    const q = z.getBoundingClientRect();
    const begraben = [];
    for (const el of document.querySelectorAll('[data-zug]')) {
      if (z.contains(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 3 || r.height < 3) continue;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (cx < q.left || cx > q.right || cy < q.top || cy > q.bottom) continue;
      const t = document.elementFromPoint(cx, cy);
      if (t && z.contains(t)) begraben.push(el.getAttribute('data-zug'));
    }
    return { eigenAus, begraben, ok: !eigenAus.length && !begraben.length };
  }

  function setze(dx, dy) {
    z.style.left = (ORT.x + dx) + '%';
    z.style.top = (ORT.y + dy) + '%';
  }

  const STELLEN = [[0,0],[0,-13],[0,13],[-15,-8],[15,-8],[-15,9],[15,9],[0,-22]];
  const stellen = STELLEN.map(([dx, dy]) => { setze(dx, dy); return { dx, dy, ...pruefe() }; });

  let frei = [], gepr = 0;
  if (raster) {
    for (let x = -28; x <= 62; x += 3) {
      for (let y = -40; y <= 46; y += 3) {
        setze(x, y);
        gepr++;
        const p = pruefe();
        if (p.ok) frei.push([x, y]);
      }
    }
  }

  z.style.left = merkeL; z.style.top = merkeT; z.className = merkeKlasse;
  return { stellen, frei, gepr,
    buehne: { l: bb.left, t: bb.top, b: bb.width, h: bb.height },
    fremdBretter: [...document.querySelectorAll('[data-reiter]')]
      .filter((e) => !e.classList.contains('stadt-zugeklappt'))
      .map((e) => e.getAttribute('data-reiter') + '|' + Math.round(e.getBoundingClientRect().width)
                + 'x' + Math.round(e.getBoundingClientRect().height)) };
};

const wochen = [];
for (let w = 0; w < WOCHEN; w++) {
  await klick('fuhre:sommer-zu');
  const st = await seite.evaluate(() => {
    const B = window.BRAUHAUS;
    const z = document.querySelector('.sud-zettel');
    const r = z ? z.getBoundingClientRect() : null;
    return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche,
             kasse: Math.round(B.welt.haus.kasse),
             klasse: z ? z.className : null,
             breite: r ? Math.round(r.width) : 0, hoehe: r ? Math.round(r.height) : 0,
             brettZu: !!B.SUD_ZUSTAND.brettZu, stelle: B.SUD_ZUSTAND.zettelStelle };
  });
  const weg = /beiseite/.test(st.klasse || '');
  let probe = null;
  if (weg) probe = await seite.evaluate(PROBE, { raster: wochen.filter((x) => x.probe).length < 12 });
  wochen.push({ w: w + 1, ...st, weg, probe });

  const roh = await seite.evaluate(() => Math.round(window.BRAUHAUS.welt.haus.rohstoff));
  if (roh < ROH / 2) { await klick('stadt:reiter:fuhre-fu-brett-fu-schiefer-fu-tafel', 60);
    await klick('fuhre:kauf:rohstoff'); await klick('stadt:reiter:fuhre-fu-brett-fu-schiefer-fu-tafel', 60); }
  await klick('stadt:reiter:fuhre-fu-brett-fu-wagen', 60);
  if (!await klick('fuhre:fuellen')) await klick('fuhre:wie-vorige');
  await klick('fuhre:abschicken', 70);
  await klick('stadt:reiter:fuhre-fu-brett-fu-wagen', 60);
  await klick('sud:zettel-anstich');
  await klick('sud:zettel-charge-frei');

  const z2 = await seite.evaluate(() => ({ jahr: window.BRAUHAUS.welt.zeit.jahr,
    ende: !!window.BRAUHAUS.welt.zeit.ende }));
  if (z2.ende) break;
  if (z2.jahr >= STARTJAHR + 14) break;
  if (!await klick('weiter', 45)) {
    await seite.evaluate(() => { const k = document.querySelector('button[data-zug="weiter"]');
      if (k) { k.disabled = false; k.click(); } });
    await seite.waitForTimeout(45);
  }
}

writeFileSync(AUS, JSON.stringify({ epoche: EPOCHE, fehler, wochen }, null, 0));
const n = wochen.length, weg = wochen.filter((x) => x.weg);
console.log('=== EPOCHE ' + EPOCHE + '  ' + n + ' Wochen, Zettel beiseite in ' + weg.length
  + ' (' + (100 * weg.length / n).toFixed(1) + ' %)');
const mitProbe = weg.filter((x) => x.probe);
if (mitProbe.length) {
  // Woran scheitern die acht Stellen?
  const eigen = {}, begr = {};
  for (const x of mitProbe) for (const s of x.probe.stellen) {
    for (const e of s.eigenAus) eigen[e.replace(/\[.*/, '').trim() + ' ' + (e.match(/\[(.*)\]/) || [])[1]] = (eigen[e.replace(/\[.*/, '').trim() + ' ' + (e.match(/\[(.*)\]/) || [])[1]] || 0) + 1;
    for (const b of s.begraben) begr[b] = (begr[b] || 0) + 1;
  }
  console.log('  eigene Knoepfe nicht getroffen (Stelle x Woche):');
  Object.entries(eigen).sort((a, b) => b[1] - a[1]).slice(0, 12)
    .forEach(([k, v]) => console.log('     ' + v + '  ' + k));
  console.log('  fremde Zuege begraben (Stelle x Woche):');
  Object.entries(begr).sort((a, b) => b[1] - a[1]).slice(0, 12)
    .forEach(([k, v]) => console.log('     ' + v + '  ' + k));
  const mitRaster = mitProbe.filter((x) => x.probe.gepr);
  console.log('  Rasterprobe in ' + mitRaster.length + ' Wochen:');
  mitRaster.forEach((x) => console.log('     ' + x.jahr + '/' + x.woche + '  frei '
    + x.probe.frei.length + '/' + x.probe.gepr
    + (x.probe.frei.length ? '  z.B. ' + JSON.stringify(x.probe.frei.slice(0, 6)) : '')
    + '   offen: ' + x.probe.fremdBretter.join(', ')));
}
console.log('  Fehler: ' + fehler.length);
await browser.close();
