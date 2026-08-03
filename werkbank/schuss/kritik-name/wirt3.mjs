// Der vernuenftige Wirt, dritte Fassung. Sechs Braujahre je Epoche.
//   node wirt3.mjs <epoche> <saat> <braujahre> <marke> [name:0|1]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const [ep, saat, jahreS, marke, nameS] = process.argv.slice(2);
const jahre = +(jahreS || 6);
const mitName = nameS !== '0';
const out = '/home/user/brewhousesim/werkbank/schuss/kritik-name';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 160)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 160)); });
await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=${saat}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

const klick = z => seite.evaluate(zz => { const e = [...document.querySelectorAll(`[data-zug="${zz}"]`)].find(x => !x.disabled); if (!e) return false; e.click(); return true; }, z);
const klickPre = (pre, deckung, teuerst) => seite.evaluate(([p, d, t]) => {
  const kasse = BRAUHAUS.welt.haus.kasse;
  const c = [...document.querySelectorAll('[data-zug]')].filter(e => {
    if (e.disabled) return false;
    const z = e.getAttribute('data-zug'); if (!z.startsWith(p)) return false;
    const pr = e.getAttribute('data-preis'); if (pr === null) return false;
    const k = -(+pr); if (k <= 0) return false;
    return k * d <= kasse;
  });
  if (!c.length) return null;
  c.sort((a, b) => t ? (+a.getAttribute('data-preis')) - (+b.getAttribute('data-preis')) : (+b.getAttribute('data-preis')) - (+a.getAttribute('data-preis')));
  const el = c[0], z = el.getAttribute('data-zug'), pr = el.getAttribute('data-preis');
  el.click(); return z + ' ' + pr;
}, [pre, deckung, !!teuerst]);

const zaehlung = () => seite.evaluate(() => {
  const sicht = el => { const b = el.getBoundingClientRect(); if (b.width < 2 || b.height < 2) return false; if (b.bottom <= 0 || b.top >= innerHeight || b.right <= 0 || b.left >= innerWidth) return false; const s = getComputedStyle(el); return !(s.visibility === 'hidden' || s.display === 'none' || +s.opacity < .05 || s.pointerEvents === 'none'); };
  const tref = el => { const b = el.getBoundingClientRect(); const t = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2); return !!t && (t === el || el.contains(t)); };
  const W = BRAUHAUS.welt, kasse = W.haus.kasse;
  const pe = [...document.querySelectorAll('[data-zug][data-preis]')].filter(e => Math.abs(+e.getAttribute('data-preis')) > 0);
  const s2 = pe.filter(sicht), aktiv = s2.filter(e => !e.disabled && tref(e));
  const kauf = aktiv.filter(e => +e.getAttribute('data-preis') < 0).map(e => ({ z: e.getAttribute('data-zug'), p: -(+e.getAttribute('data-preis')) }));
  const bez = kauf.filter(k => k.p <= kasse);
  return {
    jahr: W.zeit.jahr, woche: W.zeit.woche, ende: W.zeit.ende, kasse, grut: W.haus.rohstoff,
    faesser: W.vorrat.faesser.length, plaetze: W.vorrat.plaetze,
    nSicht: s2.length, nAktiv: aktiv.length, nKauf: kauf.length, nBez: bez.length,
    minKauf: kauf.length ? Math.min(...kauf.map(k => k.p)) : null,
    minBez: bez.length ? Math.min(...bez.map(k => k.p)) : null,
    maxKauf: kauf.length ? Math.max(...kauf.map(k => k.p)) : null,
    stuecke: [...new Set(kauf.map(k => k.z.split(':')[0]))].sort(),
    kopfDeckung: document.querySelector('.deckung')?.getAttribute('data-deckung') || null,
    kopfText: document.querySelector('.deckung')?.textContent?.slice(0, 100) || null,
    gegnerZuege: document.querySelector('.gg-bandzahl')?.textContent || null,
    gegnerNeu: document.querySelector('.gg-bandneu')?.textContent || null,
    chronik: document.querySelector('[data-zug="preis:chronik-auf"]')?.innerText.replace(/\s+/g, ' ') || null,
    nmRuf: document.querySelector('[data-ruf]')?.getAttribute('data-ruf') || null,
    nmBekannt: document.querySelector('[data-bekannt]')?.getAttribute('data-bekannt') || null,
    nmAufgeldJahr: document.querySelector('[data-aufgeld-jahr]')?.getAttribute('data-aufgeld-jahr') || null,
    nmAufgeldGes: document.querySelector('[data-aufgeld-gesamt]')?.getAttribute('data-aufgeld-gesamt') || null,
    nmEntzug: document.querySelector('[data-entzug]')?.getAttribute('data-entzug') || null,
    nmFasspreis: document.querySelector('[data-fasspreis]')?.getAttribute('data-fasspreis') || null,
    nmAufschlag: document.querySelector('[data-aufschlag]')?.getAttribute('data-aufschlag') || null,
    nmEinl: document.querySelector('[data-einloesung]')?.getAttribute('data-einloesung') || null,
    bandText: (document.querySelector('.nm-band')?.innerText || '').replace(/\s*\n\s*/g, ' | ').slice(0, 200),
  };
});

const tat = [], reihe = [];
reihe.push({ ...(await zaehlung()), was: 'start' });
const startjahr = reihe[0].jahr;
let letztesJahr = null, namezuege = 0;

for (let i = 0; i < jahre * 32 + 40; i++) {
  const z0 = await zaehlung();
  if (z0.ende) break;
  if (z0.jahr - startjahr >= jahre) break;

  if (z0.jahr !== letztesJahr) {
    letztesJahr = z0.jahr;
    await klick('preis:tafel'); await seite.waitForTimeout(280);
    const a = await klickPre('preis:nimm:', 1.5, true); if (a) tat.push(`${z0.jahr} ANGEBOT ${a}`);
    await seite.waitForTimeout(160);
    const f = await klickPre('preis:festlege:', 1.1, true); if (f) tat.push(`${z0.jahr} FESTLEGUNG ${f}`);
    await seite.waitForTimeout(160);
    await klick('preis:tafel-zu'); await seite.waitForTimeout(200);
    if (mitName) {
      await klick('stadt:reiter:name-nm-band'); await seite.waitForTimeout(180);
      await klick('name:blatt'); await seite.waitForTimeout(400);
      const n = await klickPre('name:', 2.0, false);
      if (n) { tat.push(`${z0.jahr} NAME ${n}`); namezuege++; }
      await seite.waitForTimeout(200);
      await klick('name:blatt-zu'); await seite.waitForTimeout(150);
      await klick('stadt:reiter:name-nm-band'); await seite.waitForTimeout(150);
    }
  }
  if (z0.grut < z0.plaetze * 2.5 && z0.kasse > 60) { const g = await klick('fuhre:kauf:rohstoff'); if (g) tat.push('grut'); await seite.waitForTimeout(60); }
  const z1 = await zaehlung();
  if (z1.faesser >= z1.plaetze - 1 && z1.kasse > 90) { const f = await klick('fuhre:kauf:fass'); if (f) tat.push('fass'); await seite.waitForTimeout(60); }
  const b = await klickPre('stadt:bau:', 2.5, true); if (b) tat.push(`${z0.jahr}/${z0.woche} BAU ${b}`);
  await klick('fuhre:fuellen'); await seite.waitForTimeout(50);
  await klick('fuhre:ziel:bar'); await seite.waitForTimeout(50);
  await klick('fuhre:abschicken'); await seite.waitForTimeout(90);
  try { await seite.locator('[data-zug="weiter"]').first().click({ timeout: 8000 }); }
  catch (e) { reihe.push({ was: 'WEITERFEHL', e: String(e).split('\n')[0] }); break; }
  await seite.waitForTimeout(80);
  const z = await zaehlung();
  reihe.push({ ...z, was: 'w' });
  if (z.woche <= 2) await seite.screenshot({ path: `${out}/${marke}-${z.jahr}.png` });
  if (z.ende) break;
}
await seite.screenshot({ path: `${out}/${marke}-ende.png` });
await klick('preis:tafel'); await seite.waitForTimeout(700);
await seite.screenshot({ path: `${out}/${marke}-leiter.png` });
const leiter = await seite.evaluate(() => {
  const els = [...document.querySelectorAll('div,section,table')].filter(e => /DIE LEITER/.test(e.textContent));
  const k = els[els.length - 1];
  return k ? k.innerText.replace(/\s*\n\s*/g, ' | ').slice(0, 900) : null;
});
writeFileSync(`${out}/${marke}-reihe.json`, JSON.stringify({ reihe, tat, leiter, fehler, namezuege }, null, 1));
console.log('Schritte', reihe.length - 1, 'NAME-Zuege', namezuege, 'Fehler', fehler.length);
console.log('LEITER:', leiter);
console.log(fehler.slice(0, 4));
await browser.close();
