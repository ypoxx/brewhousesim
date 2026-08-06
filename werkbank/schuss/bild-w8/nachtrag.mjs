/* NACHTRAG — zwei Zustaende, die der erste Satz nicht hatte, in EINEM Browser.
     HAFEN=8906 node werkbank/schuss/bild-w8/nachtrag.mjs <epoche> [wochen]

   a) ?bau=alle — der Hof mit allen Aufbauten, ohne eine Woche zu spielen.
      Das ist die OBERGRENZE des Gemalten. Verliert schon dieses Bild, liegt es
      am Gezeichneten; gewinnt es, waehrend die gespielte Partie verliert, liegt
      es am Tempo. Zwei ganz verschiedene Auflagen.

   b) gespielt UND das aufliegende Blatt weggelegt. Der erste Satz landete in
      1350 auf der Jahrestafel, die 60 % des Rahmens deckt. Das ist ein echter
      Zustand, aber nicht der gewoehnliche — beide gehoeren gemessen, sonst
      misst man den Zufall des Haltepunkts.

   Je Zustand eine Aufnahme mit und eine ohne die oberen vier Ebenen.        */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8906';
const EP = process.argv[2] || '1';
const WOCHEN = +(process.argv[3] || 30);
const AUS = 'werkbank/schuss/bild-w8/bilder';
mkdirSync(AUS, { recursive: true });

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 2752, height: 1536 }, deviceScaleFactor: 1 });
const fehler = [];
p.on('pageerror', e => fehler.push('pageerror: ' + e));
p.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
const log = [];

const nackt = (an) => p.evaluate((an) => {
  ['marken', 'hand', 'kopf', 'blatt'].forEach(n => {
    const w = document.querySelector('#ebene-' + n); if (w) w.style.visibility = an ? 'hidden' : '';
  });
}, an);
async function paar(name) {
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${AUS}/${name}.png` });
  await nackt(true); await p.waitForTimeout(250);
  await p.screenshot({ path: `${AUS}/${name}-nackt.png` });
  await nackt(false); await p.waitForTimeout(200);
  console.log('BILD ' + name + ' (+nackt)');
}
async function klickeMaus(el, was) {
  try {
    const bb = await el.boundingBox(); if (!bb) return false;
    await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
    await p.mouse.down(); await p.waitForTimeout(40); await p.mouse.up();
    await p.waitForTimeout(200); log.push(was); return true;
  } catch { return false; }
}

/* ---------- a) die Obergrenze ---------- */
await p.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EP}&saat=1350&bau=alle`,
             { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(2200);
console.log('BAU-STUECKE bau=alle: ' + await p.evaluate(() =>
  document.querySelector('#ebene-bau')?.children.length || 0));
await paar(`e${EP}-20-baualle`);

/* ---------- b) gespielt, Blatt weggelegt ---------- */
await p.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EP}&saat=1350`,
             { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(1800);
async function kaufen(r) {
  const t = p.locator('button[data-zug="stadt:bau:seite"]').first();
  if (await t.count()) { try { await t.click({ timeout: 2000 }); } catch {} await p.waitForTimeout(250); }
  for (const el of await p.locator('button[data-zug^="stadt:bau:"]').all()) {
    const zug = await el.getAttribute('data-zug').catch(() => '');
    if (!zug || zug === 'stadt:bau:seite') continue;
    const aus = await el.evaluate(e => e.disabled || e.classList.contains('aus') ||
      e.classList.contains('gesperrt') || getComputedStyle(e).pointerEvents === 'none').catch(() => true);
    if (aus) continue;
    await klickeMaus(el, `w${r} KAUF ${zug}`);
  }
}
await kaufen(0);
for (let i = 0; i < WOCHEN; i++) {
  const w = p.locator('button[data-zug="weiter"]').first();
  if (!(await w.count()) || !(await klickeMaus(w, 'WEITER'))) break;
  await p.waitForTimeout(240);
  if (i % 3 === 2) await kaufen(i + 1);
}
/* Das aufliegende Blatt weglegen — erst der eigene Knopf, dann Escape. */
for (let v = 0; v < 6; v++) {
  const zu = p.locator('#ebene-blatt button', { hasText: /schlie|weglegen|zurück|zurueck|fertig/i }).first();
  if (await zu.count()) { await klickeMaus(zu, 'BLATT ZU'); continue; }
  break;
}
for (let v = 0; v < 4; v++) { await p.keyboard.press('Escape'); await p.waitForTimeout(250); }
log.push('ESCAPE ×4');
const rest = await p.evaluate(() => {
  const w = document.querySelector('#ebene-blatt');
  let n = 0; [...(w?.children || [])].forEach(k => { if (k.getBoundingClientRect().width > 4) n++; });
  return n;
});
console.log('BLATT-KINDER nach dem Weglegen: ' + rest);
console.log('STAND ' + JSON.stringify(await p.evaluate(() => ({
  jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
  kasse: Math.round(BRAUHAUS.welt.haus.kasse), lage: (BRAUHAUS.lage || []).length,
  bau: document.querySelector('#ebene-bau')?.children.length || 0 }))));
await paar(`e${EP}-30-gespielt-frei`);
console.log('KLICKS: ' + log.length);
console.log('PROTOKOLL:\n' + log.join('\n'));
console.log(fehler.length ? 'FEHLER:\n' + fehler.slice(0, 8).join('\n') : 'keine Fehler auf der Seite');
await b.close();
