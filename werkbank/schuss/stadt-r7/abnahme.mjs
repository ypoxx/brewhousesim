// DIE ABNAHME — alles, was vor einer Fertigmeldung nachgewiesen sein muss,
// in einem Lauf und am Bildschirm gemessen.
//
//   node werkbank/schuss/stadt-r7/abnahme.mjs
//
// Je Epoche und je Auflösung: laden, BRAUHAUS.lage, Seitenfehler, DAS LOT,
// DIE TIEFE, die Bauhof-Käufe mit echten Mausklicks, achtzig gespielte Wochen.

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const browser = await chromium.launch();
let schlecht = 0;

async function seiteAuf(browser, w, h, url) {
  const seite = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push('pageerror: ' + String(e).slice(0, 160)));
  seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 160)); });
  seite.on('requestfailed', (r) => fehler.push('404: ' + r.url()));
  await seite.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await seite.waitForTimeout(1000);
  return { seite, fehler };
}

/* 1 — Laden in jeder Epoche, jedem Bauzustand, jeder Auflösung. */
console.log('=== 1 · LADEN ===');
for (const [w, h] of [[2752, 1536], [1920, 1000], [1366, 768]]) {
  for (const ep of [1, 2, 3, 4]) {
    for (const bau of ['', '&bau=keine', '&bau=alle']) {
      const { seite, fehler } = await seiteAuf(browser, w, h,
        `http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=1350&stumm=1${bau}`);
      const d = await seite.evaluate(() => ({
        lage: BRAUHAUS.lage.length,
        boden: BRAUHAUS.stadt.boden.fehler().length,
        tiefe: BRAUHAUS.stadt.tiefe.pruefe().length,
        bau: document.querySelectorAll('#fach-bau-stadt .stadt-haus[data-bau]:not(.geist)').length
      }));
      const gut = !fehler.length && !d.lage && !d.boden && !d.tiefe;
      if (!gut) schlecht++;
      console.log(`  ${gut ? 'ok ' : 'XX '} ${w}x${h} E${ep}${bau || ' (Vorgabe)'}`
        + `  lage ${d.lage} · Boden ${d.boden} · Tiefe ${d.tiefe} · ${d.bau} Aufbauten`
        + (fehler.length ? '  ' + fehler.join(' | ') : ''));
      await seite.close();
    }
  }
}

/* 2 — Der Bauhof: echte Mausklicks, und die Kasse muss fallen. */
console.log('\n=== 2 · BAUHOF, echte Mausklicks ===');
for (const ep of [1, 2, 3, 4]) {
  const { seite, fehler } = await seiteAuf(browser, 1920, 1000,
    `http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=1350&stumm=1`);
  let getroffen = 0, gezahlt = 0, versucht = 0;
  const vorher = await seite.evaluate(() => BRAUHAUS.welt.haus.kasse);
  for (let n = 0; n < 6; n++) {
    const ziel = await seite.evaluate(() => {
      const el = [...document.querySelectorAll('[data-zug^="stadt:bau:"]')].find((e) => !e.disabled);
      if (!el) return null;
      const q = el.getBoundingClientRect();
      const x = q.left + q.width / 2, y = q.top + q.height / 2;
      const t = document.elementFromPoint(x, y);
      return { x, y, zug: el.getAttribute('data-zug'),
               trifft: !!(t && (t === el || el.contains(t))), kasse: BRAUHAUS.welt.haus.kasse };
    });
    if (!ziel) break;
    versucht++;
    if (ziel.trifft) getroffen++;
    await seite.mouse.click(ziel.x, ziel.y);
    await seite.waitForTimeout(220);
    const nachher = await seite.evaluate(() => BRAUHAUS.welt.haus.kasse);
    if (nachher < ziel.kasse) gezahlt++;
  }
  const d = await seite.evaluate(() => ({
    lage: BRAUHAUS.lage.length, boden: BRAUHAUS.stadt.boden.fehler().length,
    tiefe: BRAUHAUS.stadt.tiefe.pruefe().length, kasse: BRAUHAUS.welt.haus.kasse,
    bau: document.querySelectorAll('#fach-bau-stadt .stadt-haus[data-bau]:not(.geist)').length
  }));
  const gut = getroffen === versucht && gezahlt === versucht && !d.lage && !d.boden && !d.tiefe && !fehler.length;
  if (!gut) schlecht++;
  console.log(`  ${gut ? 'ok ' : 'XX '} E${ep}: ${getroffen}/${versucht} getroffen, ${gezahlt}/${versucht} kosten Geld`
    + `  Kasse ${vorher} -> ${d.kasse}  ${d.bau} Aufbauten  lage ${d.lage} · Boden ${d.boden} · Tiefe ${d.tiefe}`
    + (fehler.length ? '  ' + fehler.join(' | ') : ''));
  await seite.close();
}

/* 3 — Achtzig Wochen spielen. */
console.log('\n=== 3 · 80 WOCHEN ===');
for (const ep of [1, 2, 3, 4]) {
  const { seite, fehler } = await seiteAuf(browser, 1920, 1000,
    `http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=1350&stumm=1`);
  const d = await seite.evaluate(async () => {
    for (let i = 0; i < 80; i++) {
      if (BRAUHAUS.welt.zeit.ende) break;
      BRAUHAUS.uhr.naechsteWoche();
    }
    BRAUHAUS.sende('zeichne', { grund: 'abnahme' });
    await new Promise((r) => setTimeout(r, 400));
    return { lage: BRAUHAUS.lage.length, jahr: BRAUHAUS.welt.zeit.jahr,
             boden: BRAUHAUS.stadt.boden.fehler().length,
             tiefe: BRAUHAUS.stadt.tiefe.pruefe().length };
  });
  const gut = !fehler.length && !d.lage && !d.boden && !d.tiefe;
  if (!gut) schlecht++;
  console.log(`  ${gut ? 'ok ' : 'XX '} E${ep}: bis ${d.jahr}  lage ${d.lage} · Boden ${d.boden} · Tiefe ${d.tiefe}`
    + (fehler.length ? '  ' + fehler.join(' | ') : ''));
  await seite.close();
}

await browser.close();
console.log(`\nBeanstandungen insgesamt: ${schlecht}`);
process.exit(schlecht ? 1 : 0);
