/* Antwortet der Klang auf den Zug? Je Zug: Ruhepegel davor gegen Spitzenpegel
   danach, und welcher Klangname geschrieben wurde. Nichts wird geglaubt, was
   nicht am Pegel messbar ist. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const EP = Number(process.argv[2] || 1);
const ZIEL = process.argv[3];

const ZUEGE = {
  1: [['Fuhre laden', 'stadt:reiter:fuhre-fu-brett-fu-haeuser'], ['Fuhre laden', 'fuhre:laden:lindenhof'],
      ['Fuhre abschicken', 'stadt:reiter:fuhre-fu-brett-fu-wagen'], ['Fuhre abschicken', 'fuhre:fuellen'], ['Fuhre abschicken', 'fuhre:abschicken'],
      ['Sud', 'stadt:reiter:sud-sud-brett'], ['Sud', 'sud:wuerze:sack'], ['Sud', 'sud:anstich-jung'], ['Sud', 'sud:hefe-fuehren'],
      ['Gegner', 'gegner:beschwerde'], ['Gegner', 'gegner:zuvorkommen:obernberg'], ['Gegner', 'gegner:abloesen:torschenke'],
      ['Preis', 'preis:tafel'], ['Name', 'name:jetzt:umtrunk'], ['Bau', 'stadt:bau:grutkammer'], ['Erbe', 'erbe:verschreibe:ochse']],
  2: [['Fuhre laden', 'stadt:reiter:fuhre-fu-brett-fu-haeuser'], ['Fuhre laden', 'fuhre:laden:lindenhof'],
      ['Fuhre abschicken', 'stadt:reiter:fuhre-fu-brett-fu-wagen'], ['Fuhre abschicken', 'fuhre:fuellen'], ['Fuhre abschicken', 'fuhre:abschicken'],
      ['Sud', 'stadt:reiter:sud-sud-brett'], ['Sud', 'sud:schuettung:weizen'], ['Sud', 'sud:anstich-jung'], ['Sud', 'sud:hefe-fuehren'],
      ['Gegner', 'gegner:beschwerde'], ['Gegner', 'gegner:zuvorkommen:muehlwirt'], ['Gegner', 'gegner:abloesen:ochse'],
      ['Preis', 'preis:tafel'], ['Name', 'name:band'], ['Bau', 'stadt:bau:seite'], ['Erbe', 'stadt:reiter:erbe-blatt-erb-buch']],
  3: [['Fuhre laden', 'stadt:reiter:fuhre-fu-brett-fu-haeuser'], ['Fuhre laden', 'fuhre:laden:lindenhof'],
      ['Fuhre abschicken', 'stadt:reiter:fuhre-fu-brett-fu-wagen'], ['Fuhre abschicken', 'fuhre:fuellen'], ['Fuhre abschicken', 'fuhre:abschicken'],
      ['Sud', 'stadt:reiter:sud-sud-brett'], ['Sud', 'sud:kaelte:maschine'], ['Sud', 'sud:anstich-jung'], ['Sud', 'sud:hefe-fuehren'],
      ['Gegner', 'gegner:beschwerde'], ['Gegner', 'gegner:zuvorkommen:brueckenwirt'], ['Gegner', 'gegner:abloesen:lindenhof'],
      ['Preis', 'preis:tafel'], ['Name', 'name:band'], ['Bau', 'stadt:bau:seite'], ['Erbe', 'stadt:reiter:erbe-blatt-erb-buch']],
  4: [['Fuhre laden', 'stadt:reiter:fuhre-fu-brett-fu-haeuser'], ['Fuhre laden', 'fuhre:laden:lindenhof'],
      ['Fuhre abschicken', 'stadt:reiter:fuhre-fu-brett-fu-wagen'], ['Fuhre abschicken', 'fuhre:fuellen'], ['Fuhre abschicken', 'fuhre:abschicken'],
      ['Sud', 'stadt:reiter:sud-sud-brett'], ['Sud', 'sud:behandlung:filter'], ['Sud', 'sud:anstich-jung'], ['Sud', 'sud:hefe-fuehren'],
      ['Gegner', 'gegner:beschwerde'], ['Gegner', 'gegner:abloesen:brueckenwirt'], ['Gegner', 'gegner:abloesen:hirsch'],
      ['Preis', 'preis:tafel'], ['Name', 'name:band'], ['Bau', 'stadt:bau:seite'], ['Erbe', 'stadt:reiter:erbe-blatt-erb-buch']]
};

const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required', '--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1500, height: 1500 } });
const konsole = [];
p.on('console', m => { if (m.type() === 'error') konsole.push('CONSOLE ' + m.text().slice(0, 200)); });
p.on('pageerror', e => konsole.push('PAGEERROR ' + e.message.slice(0, 200)));
await p.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await p.waitForFunction(() => window.BRAUHAUS && window.BRAUHAUS.ton && window.BRAUHAUS.ton.bereit());
await p.waitForTimeout(500);

async function spitzeUeber(ms) {           // hoechster rms in ms Millisekunden
  return p.evaluate(m => new Promise(r => {
    let h = 0; const bis = performance.now() + m;
    (function s() { const g = BRAUHAUS.ton.pegel(); if (g.rms > h) h = g.rms;
      if (performance.now() < bis) setTimeout(s, 20); else r(+h.toFixed(5)); })();
  }), ms);
}
async function klick(el) { try { await el.scrollIntoViewIfNeeded({ timeout: 1200 }); await el.click({ timeout: 1800 }); return true; } catch (e) { return false; } }

/* Ton wecken */
for (const z of ['klang:ton', 'klang:ton']) { const e = p.locator(`[data-zug="${z}"]`).first(); if (await e.count()) await klick(e); }
await p.waitForTimeout(1500);

/* 1 — DAS BETT ALLEIN: acht Sekunden ohne jeden Klick */
const bett = [];
for (let i = 0; i < 16; i++) { bett.push(await spitzeUeber(500)); }
const bettSort = [...bett].sort((a, b) => a - b);
const ruhe = bettSort[bettSort.length >> 1];

/* 2 — Je Zug: Ruhe davor, Spitze danach */
const messung = [];
for (const [vorgang, zug] of ZUEGE[EP]) {
  const el = p.locator(`[data-zug="${zug}"]`).first();
  if (!(await el.count())) { messung.push({ vorgang, zug, stand: 'nicht-da' }); continue; }
  await p.waitForTimeout(900);
  const davor = await spitzeUeber(400);
  const v = await p.evaluate(() => BRAUHAUS.ton.protokoll.length);
  if (!(await klick(el))) { messung.push({ vorgang, zug, stand: 'unklickbar' }); continue; }
  const danach = await spitzeUeber(900);
  const toene = await p.evaluate(v => BRAUHAUS.ton.protokoll.slice(v).map(x => x.name), v);
  messung.push({ vorgang, zug, stand: 'geklickt', davor, danach, hub: +(danach / Math.max(davor, 1e-4)).toFixed(2), toene });
}

/* 3 — Michaelitag: bis zum Jahreswechsel weiterklicken */
let michaeli = null;
const weiter = p.locator('[data-zug="weiter"]').first();
for (let i = 0; i < 40; i++) {
  const w = await p.evaluate(() => BRAUHAUS.welt.zeit.woche);
  if (w >= 30) break;
  await klick(weiter); await p.waitForTimeout(120);
}
{
  await p.waitForTimeout(900);
  const davor = await spitzeUeber(400);
  const v = await p.evaluate(() => BRAUHAUS.ton.protokoll.length);
  await klick(weiter);
  const danach = await spitzeUeber(1200);
  const d = await p.evaluate(v => ({ toene: BRAUHAUS.ton.protokoll.slice(v).map(x => x.name), j: BRAUHAUS.welt.zeit.jahr, w: BRAUHAUS.welt.zeit.woche }), v);
  michaeli = { vorgang: 'Michaelitag', zug: 'weiter (Jahreswechsel)', davor, danach, hub: +(danach / Math.max(davor, 1e-4)).toFixed(2), ...d };
}

/* 4 — Gegenzug: zwanzig Wochen weiter, welche gegner:*-Klaenge kommen von selbst */
const gegen = [];
for (let i = 0; i < 20; i++) {
  const v = await p.evaluate(() => BRAUHAUS.ton.protokoll.length);
  await klick(weiter);
  const danach = await spitzeUeber(700);
  const t = await p.evaluate(v => BRAUHAUS.ton.protokoll.slice(v).map(x => x.name), v);
  gegen.push({ woche: await p.evaluate(() => BRAUHAUS.welt.zeit.woche), toene: t, spitze: danach });
}

const schluss = await p.evaluate(() => ({
  geraten: BRAUHAUS.ton.geraten(), lage: BRAUHAUS.lage.length, lageInhalt: BRAUHAUS.lage.slice(0, 8),
  zeit: BRAUHAUS.welt.zeit.jahr + '/' + BRAUHAUS.welt.zeit.woche, pegel: BRAUHAUS.ton.pegel()
}));
writeFileSync(`${ZIEL}/antwort-epoche${EP}.json`, JSON.stringify({ epoche: EP, bettSpur: bett, ruhe, messung, michaeli, gegen, schluss, konsole }, null, 1));
console.log(JSON.stringify({
  epoche: EP, ruheRms: ruhe, bettMin: bettSort[0], bettMax: bettSort[bettSort.length - 1],
  geklickt: messung.filter(m => m.stand === 'geklickt').length,
  mitKlang: messung.filter(m => m.toene && m.toene.length).length,
  ohneKlang: messung.filter(m => m.stand === 'geklickt' && (!m.toene || !m.toene.length)).map(m => m.zug),
  michaeliToene: michaeli.toene, michaeliHub: michaeli.hub,
  gegnerVonSelbst: gegen.flatMap(g => g.toene).filter(t => /^gegner:/.test(t)),
  geraten: schluss.geraten, lage: schluss.lage, konsole: konsole.length
}));
await b.close();
