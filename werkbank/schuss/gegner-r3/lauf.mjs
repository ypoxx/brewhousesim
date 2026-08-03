/* DER LAUF — n Wochen nur WEITER, jede Woche vom Schirm abgelesen.
   node lauf.mjs <epoche> <wochen> [ausgabe.json]
   Misst: Kasse · Kennzahl des Kerns · billigster umkaempfter Zug (aus dem Bild,
   data-preis) · Haeuser der Gegner · Zuege ohne den Spieler. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'fs';
const EP = Number(process.argv[2] || 4);
const WOCHEN = Number(process.argv[3] || 40);
const AUS = process.argv[4] || null;
const SAAT = process.argv[5] || '1350';

const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
const fehler = [];
s.on('pageerror', e => fehler.push('pageerror: ' + e.message));
s.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
await s.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await s.waitForTimeout(700);

const stand = () => s.evaluate(() => {
  const umk = [];
  document.querySelectorAll('[data-zug^="gegner:abloesen:"],[data-zug^="gegner:abwehren:"],[data-zug^="gegner:zuvorkommen:"]').forEach(e => {
    const p = Math.abs(Number(e.getAttribute('data-preis') || 0));
    if (p > 0) umk.push({ z: e.getAttribute('data-zug'), p: p });
  });
  umk.sort((a, c) => a.p - c.p);
  const g = [...document.querySelectorAll('[data-zug^="gegner:oeffnen:"]')].map(e => (e.textContent||'').replace(/\s+/g,' ').trim());
  return {
    jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
    kasse: Math.round(BRAUHAUS.welt.haus.kasse),
    kernZug: BRAUHAUS.welt.naechsterZug ? BRAUHAUS.welt.naechsterZug.was : null,
    kernPreis: BRAUHAUS.welt.naechsterZug ? BRAUHAUS.welt.naechsterZug.preis : null,
    kernDeckung: BRAUHAUS.welt.zugDeckung(),
    umkPreis: umk.length ? umk[0].p : null,
    umkZug: umk.length ? umk[0].z : null,
    umkAnzahl: umk.length,
    band: (document.querySelector('.gg-bandzahl')||{}).textContent || null,
    gegner: g,
    lage: BRAUHAUS.lage.length
  };
});

async function klick(z) {
  const l = await s.evaluate(zz => {
    const e = document.querySelector(`[data-zug="${zz}"]`);
    if (!e) return null;
    const q = e.getBoundingClientRect();
    if (!q.width || !q.height) return null;
    const t = document.elementFromPoint(q.left + q.width/2, q.top + q.height/2);
    return { x: q.left+q.width/2, y: q.top+q.height/2, aus: !!e.disabled, frei: !!(t && (t===e || e.contains(t))) };
  }, z);
  if (!l || l.aus || !l.frei) return false;
  await s.mouse.click(l.x, l.y);
  await s.waitForTimeout(35);
  return true;
}

const kurve = [kurve0()];
function kurve0() { return null; }
kurve.length = 0;
kurve.push(await stand());
for (let i = 0; i < WOCHEN; i++) {
  for (const z of ['preis:tafel-zu', 'kern:blatt-zu']) await klick(z);
  if (!await klick('weiter')) {
    const w = await s.evaluate(() => { const e = document.querySelector('[data-zug="weiter"]'); return e ? {aus:e.disabled, txt:e.textContent} : null; });
    console.log('WEITER klemmt bei Woche', i, JSON.stringify(w));
    break;
  }
  kurve.push(await stand());
}
const a = kurve[0], z = kurve[kurve.length-1];
const q = x => x.umkPreis ? x.kasse / x.umkPreis : null;
console.log(`E${EP} saat=${SAAT} ${kurve.length-1} Wochen ${a.jahr}W${a.woche} -> ${z.jahr}W${z.woche}`);
console.log(`  Kasse ${a.kasse} -> ${z.kasse}`);
console.log(`  Kern-Kennzahl ${a.kernDeckung?.toFixed(2)}x (${a.kernZug} ${a.kernPreis}) -> ${z.kernDeckung?.toFixed(2)}x (${z.kernZug} ${z.kernPreis})`);
console.log(`  Umkaempft     ${q(a)?.toFixed(2)}x (${a.umkZug} ${a.umkPreis}) -> ${q(z)?.toFixed(2)}x (${z.umkZug} ${z.umkPreis})`);
console.log(`  Band ${a.band} -> ${z.band}`);
console.log(`  Gegner ${JSON.stringify(a.gegner)} -> ${JSON.stringify(z.gegner)}`);
console.log(`  Fehler ${fehler.length}`, fehler.slice(0,4));
if (AUS) writeFileSync(AUS, JSON.stringify({ epoche: EP, saat: SAAT, kurve, fehler }, null, 1));
await b.close();
