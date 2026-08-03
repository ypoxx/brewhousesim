/* WER LIEGT AUF DER MICHAELITAFEL?

   HAFEN=8900 node decke.mjs <epoche> <jahre>

   Der Befund, der diese Datei noetig macht: in der sorgfaeltig gespielten
   Partie sind die Karten der Michaelitafel in EINIGEN Jahren von
   `elementFromPoint` nicht zu treffen, obwohl sie Flaeche haben und nicht
   `disabled` sind. Ein Knopf, den das Spiel erlaubt und den die Maus nicht
   erreicht, ist Spalte (a) der zweiten Messlatte.

   Diese Hand spielt NICHT. Sie geht Woche fuer Woche weiter, schlaegt zu
   Michaeli die Tafel auf und schreibt auf, WELCHES Element an der Stelle des
   Knopfes liegt — Klassenname und Fach, damit die Stelle benennbar ist.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const JAHRE = +(process.argv[3] || 14);
const HAFEN = process.env.HAFEN || '8900';
const SAAT = process.env.SAAT || '1350';
const ZIEL = process.argv[4] || `/tmp/pk5/decke-e${ep}.json`;

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 160)); });

await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(900);

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

const griffText = () => seite.evaluate(() => {
  const el = document.querySelector('[data-zug="preis:tafel"]');
  return el ? (el.innerText || '').trim().replace(/\s+/g, ' ') : null;
});

async function klick(zug) {
  const l = await seite.evaluate((z) => {
    const el = document.querySelector(`[data-zug="${z}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, aus: !!el.disabled };
  }, zug);
  if (!l || l.aus) return false;
  await seite.mouse.click(l.x, l.y);
  await ruhe(200);
  return true;
}

/* Was auf dem Knopf liegt: der Pfad des getroffenen Elements bis zur Ebene. */
const blick = () => seite.evaluate(() => {
  const out = [];
  document.querySelectorAll('[data-zug^="preis:festlege:"],[data-zug^="preis:nimm:"]').forEach(el => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) { out.push({ zug: el.getAttribute('data-zug'), flaeche: 0 }); return; }
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const t = (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight)
      ? document.elementFromPoint(cx, cy) : null;
    const hit = !!(t && (t === el || el.contains(t)));
    let pfad = null, zi = null;
    if (!hit) {
      const teile = [];
      let n = t;
      while (n && n !== document.body && teile.length < 7) {
        teile.push(n.tagName.toLowerCase() + (n.id ? '#' + n.id : '')
          + (n.className && typeof n.className === 'string' ? '.' + n.className.trim().split(/\s+/).join('.') : ''));
        const cs = getComputedStyle(n);
        if (zi === null && cs.zIndex !== 'auto') zi = n.tagName.toLowerCase()
          + (typeof n.className === 'string' && n.className ? '.' + n.className.trim().split(/\s+/)[0] : '')
          + ' z=' + cs.zIndex;
        n = n.parentElement;
      }
      pfad = teile.join(' < ');
    }
    out.push({ zug: el.getAttribute('data-zug'), aus: !!el.disabled,
               sollAus: el.getAttribute('data-soll-aus'), hit, pfad, zi,
               oben: Math.round(r.top), links: Math.round(r.left) });
  });
  /* Alle Faecher der Ebene, mit z-index und sichtbarer Flaeche. */
  const faecher = [...document.querySelectorAll('[id^="fach-"],[class*="fach"]')].slice(0, 40).map(e => {
    const r = e.getBoundingClientRect();
    return { id: e.id || e.className, z: getComputedStyle(e).zIndex,
             w: Math.round(r.width), h: Math.round(r.height) };
  }).filter(x => x.w > 100 && x.h > 100);
  return { knoepfe: out, faecher, jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
           kasse: BRAUHAUS.welt.haus.kasse,
           amtszeit: BRAUHAUS.welt.zeit.amtszeit ? BRAUHAUS.welt.zeit.amtszeit.nr : null };
});

const reihe = [];
for (let j = 0; j < JAHRE; j++) {
  /* zu Michaeli (Woche 1) */
  const st = await seite.evaluate(() => BRAUHAUS.welt.zeit.woche);
  if (st === 1) {
    if (await seite.evaluate(() => !!document.querySelector('.fu-sommerblatt'))) {
      await klick('fuhre:sommer-zu');
    }
    let t = await griffText();
    if (t && !/schließen/.test(t)) await klick('preis:tafel');
    await ruhe(300);
    const b = await blick();
    b.griff = await griffText();
    reihe.push(b);
    console.log(`E${ep} ${b.jahr}/${b.woche} Amtszeit ${b.amtszeit} Kasse ${Math.round(b.kasse)}  `
      + `Griff ${JSON.stringify(b.griff)}  `
      + `getroffen ${b.knoepfe.filter(k => k.hit).length}/${b.knoepfe.length}`);
    b.knoepfe.filter(k => !k.hit).slice(0, 2).forEach(k =>
      console.log(`     verdeckt ${k.zug} von: ${k.pfad}   [${k.zi}]`));
    /* Tafel wieder zu */
    t = await griffText();
    if (t && /schließen/.test(t)) await klick('preis:tafel');
  }
  /* ein Braujahr weiter */
  for (let w = 0; w < 30; w++) {
    if (!(await klick('weiter'))) break;
  }
}

fs.writeFileSync(ZIEL, JSON.stringify({ epoche: ep, fehler, reihe }, null, 1));
await browser.close();
