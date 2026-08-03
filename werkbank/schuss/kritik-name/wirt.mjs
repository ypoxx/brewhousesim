// Der vernuenftige Spieler: liefert jede Woche aus, nimmt Angebote an,
// baut, wenn die Kasse das Dreifache traegt. Zaehlt woechentlich am Schirm.
//   node wirt.mjs <epoche> <saat> <jahre> <marke> [namekauf]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const [ep, saat, jahreS, marke, namekaufS] = process.argv.slice(2);
const jahre = +(jahreS || 6);
const namekauf = namekaufS === '1';
const out = '/home/user/brewhousesim/werkbank/schuss/kritik-name';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 160)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 160)); });

await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=${saat}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

const klick = (zug) => seite.evaluate((z) => {
  const el = [...document.querySelectorAll(`[data-zug="${z}"]`)].find(e => !e.disabled);
  if (!el) return false;
  el.click(); return true;
}, zug);

const klickPraefix = (praefix, maxPreisAnteil) => seite.evaluate(([p, anteil]) => {
  const kasse = BRAUHAUS.welt.haus.kasse;
  const c = [...document.querySelectorAll('[data-zug]')].filter(e => {
    if (e.disabled) return false;
    if (!e.getAttribute('data-zug').startsWith(p)) return false;
    const pr = e.getAttribute('data-preis');
    if (pr === null) return anteil === null;
    const k = -(+pr);
    if (k <= 0) return true;
    return anteil !== null && k * anteil <= kasse;
  });
  if (!c.length) return null;
  c.sort((a, b) => (+(b.getAttribute('data-preis') || 0)) - (+(a.getAttribute('data-preis') || 0)));
  const el = c[0], z = el.getAttribute('data-zug'), pr = el.getAttribute('data-preis') || '0';
  el.click(); return z + ' ' + pr;
}, [praefix, maxPreisAnteil === undefined ? null : maxPreisAnteil]);

const zaehlung = () => seite.evaluate(() => {
  const sicht = el => {
    const b = el.getBoundingClientRect();
    if (b.width < 2 || b.height < 2) return false;
    if (b.bottom <= 0 || b.top >= innerHeight || b.right <= 0 || b.left >= innerWidth) return false;
    const s = getComputedStyle(el);
    return !(s.visibility === 'hidden' || s.display === 'none' || +s.opacity < .05 || s.pointerEvents === 'none');
  };
  const treffer = el => { const b = el.getBoundingClientRect(); const t = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2); return !!t && (t === el || el.contains(t)); };
  const W = BRAUHAUS.welt, kasse = W.haus.kasse;
  const preisEl = [...document.querySelectorAll('[data-zug][data-preis]')].filter(e => Math.abs(+e.getAttribute('data-preis')) > 0);
  const sichtbare = preisEl.filter(sicht);
  const aktiv = sichtbare.filter(e => !e.disabled && treffer(e));
  const kauf = aktiv.filter(e => +e.getAttribute('data-preis') < 0).map(e => ({ z: e.getAttribute('data-zug'), p: -(+e.getAttribute('data-preis')) }));
  const bez = kauf.filter(k => k.p <= kasse);
  const unw = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && /unwiderruflich/i.test(e.textContent) && sicht(e)).length;
  return {
    jahr: W.zeit.jahr, woche: W.zeit.woche, ende: W.zeit.ende, kasse,
    nSicht: sichtbare.length, nAktiv: aktiv.length, nKauf: kauf.length, nBez: bez.length,
    minKauf: kauf.length ? Math.min(...kauf.map(k => k.p)) : null,
    minBez: bez.length ? Math.min(...bez.map(k => k.p)) : null,
    maxKauf: kauf.length ? Math.max(...kauf.map(k => k.p)) : null,
    stuecke: [...new Set(kauf.map(k => k.z.split(':')[0]))],
    nameKauf: kauf.filter(k => k.z.startsWith('name:')).map(k => k.z + '=' + k.p),
    unwSichtbar: unw,
    gegnerZuege: document.querySelector('.gg-bandzahl')?.textContent || null,
    gegnerNeu: document.querySelector('.gg-bandneu')?.textContent || null,
    kopfDeckung: document.querySelector('.deckung')?.getAttribute('data-deckung') || null,
    kopfDeckungText: document.querySelector('.deckung')?.textContent?.slice(0, 90) || null,
    chronik: document.querySelector('[data-zug="preis:chronik-auf"]')?.innerText.replace(/\s+/g, ' ') || null,
    ruf: (document.querySelector('.nm-band')?.innerText || '').replace(/\s*\n\s*/g, ' | ').slice(0, 260),
    aufgeldJahr: document.querySelector('[data-aufgeld-jahr]')?.getAttribute('data-aufgeld-jahr') || null,
    aufgeldGes: document.querySelector('[data-aufgeld-gesamt]')?.getAttribute('data-aufgeld-gesamt') || null,
    nmRuf: document.querySelector('[data-ruf]')?.getAttribute('data-ruf') || null,
    nmBekannt: document.querySelector('[data-bekannt]')?.getAttribute('data-bekannt') || null,
    nmEntzug: document.querySelector('[data-entzug]')?.getAttribute('data-entzug') || null,
  };
});

const tat = [];
const reihe = [];
const WOCHEN = await seite.evaluate(() => BRAUHAUS.uhr.WOCHEN_IM_JAHR);

// Einmal die NAME-Sachen kaufen, wenn gewuenscht (Epoche-eigene Zuege)
if (namekauf) {
  await klick('stadt:reiter:name-nm-band'); await seite.waitForTimeout(250);
  await klick('name:blatt'); await seite.waitForTimeout(500);
  const k = await klickPraefix('name:', 3);
  if (k) tat.push('NAMEKAUF ' + k);
  await seite.waitForTimeout(300);
  await klick('name:blatt-zu'); await seite.waitForTimeout(200);
}

reihe.push({ ...(await zaehlung()), was: 'start' });

for (let i = 0; i < jahre * WOCHEN; i++) {
  // 1. Fuhre fuellen und abschicken
  const f1 = await klick('fuhre:fuellen'); if (f1) { await seite.waitForTimeout(70); tat.push('fuellen'); }
  const f2 = await klick('fuhre:abschicken'); if (f2) { await seite.waitForTimeout(90); tat.push('abschicken'); }
  // 2. Angebot der Preistafel nehmen (nur wenn sichtbar)
  const p = await klickPraefix('preis:nimm:', 1); if (p) tat.push('preis ' + p);
  // 3. Bauen, wenn die Kasse das Vierfache traegt
  if (i % 5 === 0) { const b = await klickPraefix('stadt:bau:', 4); if (b) tat.push('bau ' + b); }
  // 4. NAME-Zug, wenn die Kasse das Vierfache traegt
  if (namekauf && i % 7 === 3) {
    await klick('name:blatt'); await seite.waitForTimeout(250);
    const n = await klickPraefix('name:', 4);
    if (n && !n.startsWith('name:blatt') && !n.startsWith('name:reiter')) tat.push('name ' + n);
    await seite.waitForTimeout(150);
    await klick('name:blatt-zu'); await seite.waitForTimeout(120);
  }
  try { await seite.locator('[data-zug="weiter"]').first().click({ timeout: 8000 }); }
  catch (e) { reihe.push({ was: 'WEITERFEHL', e: String(e).split('\n')[0] }); break; }
  await seite.waitForTimeout(70);
  const z = await zaehlung();
  reihe.push({ ...z, was: 'w' });
  if (z.woche === 1 || z.ende) await seite.screenshot({ path: `${out}/${marke}-${z.jahr}.png` });
  if (z.ende) break;
}
await seite.screenshot({ path: `${out}/${marke}-ende.png` });
writeFileSync(`${out}/${marke}-reihe.json`, JSON.stringify({ reihe, tat: tat.slice(0, 400), fehler }, null, 1));
console.log('Schritte', reihe.length - 1, 'Taten', tat.length, 'Fehler', fehler.length);
console.log(fehler.slice(0, 4));
await browser.close();
