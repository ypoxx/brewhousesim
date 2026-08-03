// Spielt eine Partie und zaehlt WOECHENTLICH am Bildschirm.
//   node partie.mjs <epoche> <saat> <jahre> <modus> <marke>
// modus: 'weiter'  = nur WEITER klicken
//        'spieler' = jede Woche den billigsten bezahlbaren Zug kaufen
//        'name'    = wie spieler, aber NAME-Zuege bevorzugt
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const [ep, saat, jahreS, modus, marke] = process.argv.slice(2);
const jahre = +(jahreS || 6);
const out = '/home/user/brewhousesim/werkbank/schuss/kritik-name';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const fehler = [];
seite.on('pageerror', (e) => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });

await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=${saat}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

// Alle Reiter am unteren Rand einmal aufschlagen — so sitzt ein Spieler da.
const reiter = await seite.$$eval('[data-zug^="stadt:reiter:"]', els => els.map(e => e.getAttribute('data-zug')));
for (const r of reiter) {
  try { await seite.locator(`[data-zug="${r}"]`).first().click({ timeout: 2500 }); await seite.waitForTimeout(150); } catch {}
}
await seite.waitForTimeout(500);
await seite.screenshot({ path: `${out}/${marke}-aufgeschlagen.png` });

const zaehlung = () => seite.evaluate(() => {
  const sichtbar = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    if (r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth) return false;
    const s = getComputedStyle(el);
    if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity < 0.05) return false;
    if (s.pointerEvents === 'none') return false;
    return true;
  };
  const trifft = (el) => {
    const r = el.getBoundingClientRect();
    const t = document.elementFromPoint(Math.min(innerWidth - 1, Math.max(1, r.x + r.width / 2)), Math.min(innerHeight - 1, Math.max(1, r.y + r.height / 2)));
    return !!t && (t === el || el.contains(t));
  };
  const alle = [...document.querySelectorAll('[data-zug]')];
  const mitPreis = alle.filter(el => {
    const p = el.getAttribute('data-preis');
    return p !== null && Math.abs(+p) > 0;
  });
  const kandidaten = mitPreis.map(el => ({
    el,
    zug: el.getAttribute('data-zug'),
    preis: +el.getAttribute('data-preis'),
    text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 70),
    sicht: sichtbar(el),
    aus: el.disabled === true || el.getAttribute('aria-disabled') === 'true' || el.classList.contains('aus') || el.classList.contains('gesperrt'),
    tref: sichtbar(el) && trifft(el),
    stueck: (el.getAttribute('data-zug') || '').split(':')[0],
  }));
  const W = BRAUHAUS.welt;
  const kasse = W.haus.kasse;
  const aktiv = kandidaten.filter(k => k.sicht && !k.aus && k.tref);
  const kaeufe = aktiv.filter(k => k.preis < 0);
  const bezahlbar = kaeufe.filter(k => -k.preis <= kasse);
  const preise = kaeufe.map(k => -k.preis).sort((a, b) => a - b);
  const bezPreise = bezahlbar.map(k => -k.preis).sort((a, b) => a - b);
  const kopfdeck = document.querySelector('.deckung');
  return {
    jahr: W.zeit.jahr, woche: W.zeit.woche, epoche: W.zeit.epoche, ende: W.zeit.ende,
    kasse, rohstoff: W.haus.rohstoff, ansehen: W.haus.ansehen,
    faesser: W.vorrat.faesser.length, plaetze: W.vorrat.plaetze,
    nPreisSichtbar: kandidaten.filter(k => k.sicht).length,
    nAktiv: aktiv.length,
    nKauf: kaeufe.length,
    nBezahlbar: bezahlbar.length,
    billigster: preise[0] ?? null,
    billigsterBezahlbar: bezPreise[0] ?? null,
    teuerster: preise[preise.length - 1] ?? null,
    proStueck: aktiv.reduce((a, k) => (a[k.stueck] = (a[k.stueck] || 0) + 1, a), {}),
    zuegeAktiv: aktiv.map(k => k.zug + '=' + k.preis),
    gegnerZuegeText: document.querySelector('.gg-bandzahl')?.textContent || null,
    gegnerNeuText: document.querySelector('.gg-bandneu')?.textContent || null,
    kopfDeckung: kopfdeck ? { wert: kopfdeck.getAttribute('data-deckung'), text: kopfdeck.textContent.slice(0, 120) } : null,
    chronikText: document.querySelector('[data-zug="preis:chronik-auf"]')?.innerText.replace(/\s+/g, ' ') || null,
    nameKopf: (document.querySelector('.nm-band')?.innerText || '').replace(/\s*\n\s*/g, ' | ').slice(0, 700),
  };
});

const kaufeBilligsten = () => seite.evaluate((bevorzugt) => {
  const sichtbar = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    if (r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth) return false;
    const s = getComputedStyle(el);
    return !(s.visibility === 'hidden' || s.display === 'none' || +s.opacity < 0.05 || s.pointerEvents === 'none');
  };
  const kasse = BRAUHAUS.welt.haus.kasse;
  let c = [...document.querySelectorAll('[data-zug][data-preis]')]
    .filter(el => sichtbar(el) && !el.disabled && +el.getAttribute('data-preis') < 0
      && -(+el.getAttribute('data-preis')) <= kasse);
  if (bevorzugt) {
    const n = c.filter(el => el.getAttribute('data-zug').startsWith('name:'));
    if (n.length) c = n;
  }
  if (!c.length) return null;
  c.sort((a, b) => (+b.getAttribute('data-preis')) - (+a.getAttribute('data-preis')));
  const el = c[0];
  const z = el.getAttribute('data-zug'), p = el.getAttribute('data-preis');
  el.click();
  return z + ' ' + p;
}, modus === 'name');

const reihe = [];
const gekauft = [];
let z = await zaehlung();
reihe.push({ ...z, was: 'start' });
const WOCHEN = await seite.evaluate(() => BRAUHAUS.uhr.WOCHEN_IM_JAHR);
const schritte = jahre * WOCHEN;

for (let i = 0; i < schritte; i++) {
  if (modus !== 'weiter' && i % 3 === 0) {
    const k = await kaufeBilligsten();
    if (k) { gekauft.push(`${z.jahr}/${z.woche} ${k}`); await seite.waitForTimeout(120); }
  }
  try {
    await seite.locator('[data-zug="weiter"]').first().click({ timeout: 8000 });
  } catch (e) { reihe.push({ was: 'WEITER-FEHL', i, e: String(e).split('\n')[0] }); break; }
  await seite.waitForTimeout(90);
  z = await zaehlung();
  reihe.push({ ...z, was: 'woche' });
  if (z.woche === 1) await seite.screenshot({ path: `${out}/${marke}-j${z.jahr}.png` });
  if (z.ende) break;
}
await seite.screenshot({ path: `${out}/${marke}-ende.png` });

writeFileSync(`${out}/${marke}-reihe.json`, JSON.stringify({ reihe, gekauft, fehler }, null, 1));
console.log('WOCHEN_IM_JAHR', WOCHEN, 'Schritte', reihe.length - 1, 'Kaeufe', gekauft.length);
console.log('FEHLER', fehler.slice(0, 5));
await browser.close();
