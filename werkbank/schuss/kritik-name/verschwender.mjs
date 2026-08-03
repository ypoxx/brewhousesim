// Wie wirt3, aber das Geld bleibt nicht liegen: jede Woche wird der teuerste
// bezahlbare Zug gekauft, den das Haus sich zweimal leisten kann.
//   node verschwender.mjs <epoche> <saat> <braujahre> <marke>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';
const [ep, saat, jahreS, marke] = process.argv.slice(2);
const jahre = +(jahreS || 6);
const out = '/home/user/brewhousesim/werkbank/schuss/kritik-name';
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=${saat}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);
const klick = z => seite.evaluate(zz => { const e = [...document.querySelectorAll(`[data-zug="${zz}"]`)].find(x => !x.disabled); if (!e) return false; e.click(); return true; }, z);
const teuerster = (deck) => seite.evaluate(d => {
  const kasse = BRAUHAUS.welt.haus.kasse;
  const aus = /^(weiter|klang|kern|stadt:reiter|stadt:alles|preis:tafel$|preis:chronik|gegner:blatt|name:blatt|name:reiter|name:band|fuhre:leeren)/;
  const c = [...document.querySelectorAll('[data-zug][data-preis]')].filter(e => {
    if (e.disabled) return false;
    const z = e.getAttribute('data-zug'); if (aus.test(z)) return false;
    const p = -(+e.getAttribute('data-preis')); if (p <= 0) return false;
    return p * d <= kasse;
  });
  if (!c.length) return null;
  c.sort((a, b) => (+a.getAttribute('data-preis')) - (+b.getAttribute('data-preis')));
  const el = c[0]; const r = el.getAttribute('data-zug') + ' ' + el.getAttribute('data-preis');
  el.click(); return r;
}, deck);
const zaehlung = () => seite.evaluate(() => {
  const sicht = el => { const b = el.getBoundingClientRect(); if (b.width < 2 || b.height < 2) return false; if (b.bottom <= 0 || b.top >= innerHeight || b.right <= 0 || b.left >= innerWidth) return false; const s = getComputedStyle(el); return !(s.visibility === 'hidden' || s.display === 'none' || +s.opacity < .05 || s.pointerEvents === 'none'); };
  const tref = el => { const b = el.getBoundingClientRect(); const t = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2); return !!t && (t === el || el.contains(t)); };
  const W = BRAUHAUS.welt, kasse = W.haus.kasse;
  const pe = [...document.querySelectorAll('[data-zug][data-preis]')].filter(e => Math.abs(+e.getAttribute('data-preis')) > 0);
  const aktiv = pe.filter(e => sicht(e) && !e.disabled && tref(e));
  const kauf = aktiv.filter(e => +e.getAttribute('data-preis') < 0).map(e => -(+e.getAttribute('data-preis')));
  const bez = kauf.filter(p => p <= kasse);
  return { jahr: W.zeit.jahr, woche: W.zeit.woche, ende: W.zeit.ende, kasse, grut: W.haus.rohstoff,
    faesser: W.vorrat.faesser.length, plaetze: W.vorrat.plaetze,
    nAktiv: aktiv.length, nKauf: kauf.length, nBez: bez.length,
    minKauf: kauf.length ? Math.min(...kauf) : null, minBez: bez.length ? Math.min(...bez) : null,
    kopfDeckung: document.querySelector('.deckung')?.getAttribute('data-deckung') || null,
    gegnerZuege: document.querySelector('.gg-bandzahl')?.textContent || null };
});
const reihe = [], tat = [];
reihe.push({ ...(await zaehlung()), was: 'start' });
const start = reihe[0].jahr;
let jAlt = null;
for (let i = 0; i < jahre * 32 + 40; i++) {
  const z0 = await zaehlung();
  if (z0.ende || z0.jahr - start >= jahre) break;
  if (z0.jahr !== jAlt) {
    jAlt = z0.jahr;
    await klick('preis:tafel'); await seite.waitForTimeout(280);
    for (let q = 0; q < 3; q++) { const a = await teuerster(1.2); if (a) tat.push(`${z0.jahr} TAFEL ${a}`); await seite.waitForTimeout(140); }
    await klick('preis:tafel-zu'); await seite.waitForTimeout(180);
    await klick('stadt:reiter:name-nm-band'); await seite.waitForTimeout(160);
    await klick('name:blatt'); await seite.waitForTimeout(350);
    for (let q = 0; q < 3; q++) { const a = await teuerster(2); if (a) tat.push(`${z0.jahr} NAME ${a}`); await seite.waitForTimeout(140); }
    await klick('name:blatt-zu'); await seite.waitForTimeout(140);
    await klick('stadt:reiter:name-nm-band'); await seite.waitForTimeout(140);
  }
  if (z0.grut < z0.plaetze * 2.5 && z0.kasse > 60) await klick('fuhre:kauf:rohstoff');
  const t = await teuerster(2); if (t) tat.push(`${z0.jahr}/${z0.woche} ${t}`);
  await seite.waitForTimeout(60);
  await klick('fuhre:fuellen'); await klick('fuhre:ziel:bar'); await klick('fuhre:abschicken');
  await seite.waitForTimeout(60);
  await seite.locator('[data-zug="weiter"]').first().click({ timeout: 8000 }).catch(() => {});
  await seite.waitForTimeout(60);
  const z = await zaehlung(); reihe.push({ ...z, was: 'w' });
  if (z.ende) break;
}
await seite.screenshot({ path: `${out}/${marke}-ende.png` });
writeFileSync(`${out}/${marke}-reihe.json`, JSON.stringify({ reihe, tat }, null, 1));
console.log('Schritte', reihe.length - 1, 'Kaeufe', tat.length);
await browser.close();
