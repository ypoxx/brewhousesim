/* Recon: 40 Wochen nur WEITER, danach das Gegnerbrett aufschlagen und alles zaehlen. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const EP = Number(process.argv[2] || 4);
const WOCHEN = Number(process.argv[3] || 40);
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
const fehler = [];
s.on('pageerror', e => fehler.push('pageerror: ' + e.message));
s.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
await s.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(700);

async function klick(z) {
  const l = await s.evaluate(zz => {
    const e = document.querySelector(`[data-zug="${zz}"]`);
    if (!e) return null;
    const q = e.getBoundingClientRect();
    return { x: q.left + q.width / 2, y: q.top + q.height / 2, aus: !!e.disabled, w: q.width };
  }, z);
  if (!l || l.aus || !l.w) return false;
  await s.mouse.click(l.x, l.y);
  await s.waitForTimeout(60);
  return true;
}

const stand = () => s.evaluate(() => ({
  jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
  kasse: BRAUHAUS.welt.haus.kasse,
  zug: BRAUHAUS.welt.naechsterZug,
  deckung: BRAUHAUS.welt.zugDeckung(),
  gegner: BRAUHAUS.welt.gegner.map(g => ({ k: g.k, name: g.name, br: g.brauereien })),
  lage: BRAUHAUS.lage.length
}));

const kurve = [];
kurve.push(await stand());
for (let i = 0; i < WOCHEN; i++) {
  // Blaetter, die den WEITER-Knopf blockieren, zumachen
  for (const z of ['preis:tafel-zu', 'kern:blatt-zu']) await klick(z);
  const ok = await klick('weiter');
  if (!ok) { console.log('WEITER klemmt in Woche', i); break; }
  kurve.push(await stand());
}
const letzte = kurve[kurve.length - 1];
console.log('EPOCHE', EP, 'nach', WOCHEN, 'Wochen:', JSON.stringify(letzte));
console.log('Start:', JSON.stringify(kurve[0]));

// Brett aufschlagen
for (const z of ['preis:tafel-zu', 'kern:blatt-zu']) await klick(z);
await klick('gegner:blatt');
await s.waitForTimeout(200);
const zuege = await s.evaluate(() => BRAUHAUS.zuege().filter(z => /^gegner:/.test(z.zug)));
console.log('GEGNERZUEGE auf dem Schirm:', zuege.length);
zuege.forEach(z => console.log(' ', z.offen ? 'AN ' : 'aus', z.zug, '|', z.preis, '|', z.text.slice(0, 70)));
console.log('FEHLER:', fehler.length, fehler.slice(0, 5));
await s.screenshot({ path: `/home/user/brewhousesim/werkbank/schuss/gegner-r3/recon-e${EP}.png` });
await b.close();
