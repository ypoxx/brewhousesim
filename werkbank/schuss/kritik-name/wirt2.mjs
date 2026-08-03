// Der vernuenftige Wirt, zweite Fassung: liefert aus, nimmt zu Michaeli ein
// Angebot, kauft Grut nach, baut, und nutzt die Zuege des NAMENs.
//   node wirt2.mjs <epoche> <saat> <braujahre> <marke> [name:0|1]
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
const klickPre = (pre, deckung) => seite.evaluate(([p, d]) => {
  const kasse = BRAUHAUS.welt.haus.kasse;
  const c = [...document.querySelectorAll('[data-zug]')].filter(e => {
    if (e.disabled) return false;
    const z = e.getAttribute('data-zug'); if (!z.startsWith(p)) return false;
    const pr = e.getAttribute('data-preis'); if (pr === null) return false;
    const k = -(+pr); if (k <= 0) return false;
    return k * d <= kasse;
  });
  if (!c.length) return null;
  c.sort((a, b) => (+a.getAttribute('data-preis')) - (+b.getAttribute('data-preis'))); // teuerster zuerst
  const el = c[0], z = el.getAttribute('data-zug'), pr = el.getAttribute('data-preis');
  el.click(); return z + ' ' + pr;
}, [pre, deckung]);

const zaehlung = () => seite.evaluate(() => {
  const sicht = el => { const b = el.getBoundingClientRect(); if (b.width < 2 || b.height < 2) return false; if (b.bottom <= 0 || b.top >= innerHeight || b.right <= 0 || b.left >= innerWidth) return false; const s = getComputedStyle(el); return !(s.visibility === 'hidden' || s.display === 'none' || +s.opacity < .05 || s.pointerEvents === 'none'); };
  const tref = el => { const b = el.getBoundingClientRect(); const t = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2); return !!t && (t === el || el.contains(t)); };
  const W = BRAUHAUS.welt, kasse = W.haus.kasse;
  const pe = [...document.querySelectorAll('[data-zug][data-preis]')].filter(e => Math.abs(+e.getAttribute('data-preis')) > 0);
  const s2 = pe.filter(sicht), aktiv = s2.filter(e => !e.disabled && tref(e));
  const kauf = aktiv.filter(e => +e.getAttribute('data-preis') < 0).map(e => ({ z: e.getAttribute('data-zug'), p: -(+e.getAttribute('data-preis')) }));
  const bez = kauf.filter(k => k.p <= kasse);
  return {
    jahr: W.zeit.jahr, woche: W.zeit.woche, ende: W.zeit.ende, kasse,
    nSicht: s2.length, nAktiv: aktiv.length, nKauf: kauf.length, nBez: bez.length,
    minKauf: kauf.length ? Math.min(...kauf.map(k => k.p)) : null,
    minBez: bez.length ? Math.min(...bez.map(k => k.p)) : null,
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
  };
});

const tat = [], reihe = [];
reihe.push({ ...(await zaehlung()), was: 'start' });
let letztesJahr = null;
let namezuege = 0;

for (let i = 0; i < jahre * 30 + 60; i++) {
  const z0 = await zaehlung();
  if (z0.ende) break;
  if (z0.jahr - (reihe[0].jahr) >= jahre) break;

  // Michaeli: Angebot nehmen
  if (z0.jahr !== letztesJahr) {
    letztesJahr = z0.jahr;
    await klick('preis:tafel'); await seite.waitForTimeout(250);
    const a = await klickPre('preis:nimm:', 1.6); if (a) tat.push(`${z0.jahr} angebot ${a}`);
    await seite.waitForTimeout(150);
    const f = await klickPre('preis:festlege:', 1.2); if (f) tat.push(`${z0.jahr} FESTLEGUNG ${f}`);
    await seite.waitForTimeout(150);
    await klick('preis:tafel-zu'); await seite.waitForTimeout(200);
    // NAME-Zug einmal im Braujahr
    if (mitName) {
      await klick('stadt:reiter:name-nm-band'); await seite.waitForTimeout(180);
      await klick('name:blatt'); await seite.waitForTimeout(350);
      const n = await klickPre('name:', 2.5);
      if (n) { tat.push(`${z0.jahr} NAME ${n}`); namezuege++; }
      await seite.waitForTimeout(200);
      await klick('name:blatt-zu'); await seite.waitForTimeout(150);
      await klick('stadt:reiter:name-nm-band'); await seite.waitForTimeout(150);
    }
  }
  // Rohstoff nachkaufen
  if (i % 4 === 0) { const g = await klickPre('fuhre:kauf:rohstoff', 3); if (g) tat.push('grut ' + g); }
  if (i % 9 === 0) { const b = await klickPre('stadt:bau:', 5); if (b) tat.push('bau ' + b); }
  await klick('fuhre:fuellen'); await seite.waitForTimeout(60);
  const ab = await klick('fuhre:abschicken'); if (ab) tat.push('ab');
  await seite.waitForTimeout(80);
  try { await seite.locator('[data-zug="weiter"]').first().click({ timeout: 8000 }); }
  catch (e) { reihe.push({ was: 'WEITERFEHL', e: String(e).split('\n')[0] }); break; }
  await seite.waitForTimeout(70);
  const z = await zaehlung();
  reihe.push({ ...z, was: 'w' });
  if (z.woche <= 2) await seite.screenshot({ path: `${out}/${marke}-${z.jahr}.png` });
  if (z.ende) break;
}
// Zum Schluss die Leiter des Spiels selbst ablesen
await klick('preis:tafel'); await seite.waitForTimeout(600);
await seite.screenshot({ path: `${out}/${marke}-leiter.png` });
const leiter = await seite.evaluate(() => {
  const t = [...document.querySelectorAll('*')].find(e => /DIE LEITER/.test(e.textContent) && e.children.length < 30 && e.textContent.length < 1400);
  return t ? t.innerText.replace(/\s*\n\s*/g, ' | ') : null;
});
await klick('preis:tafel-zu');
await seite.screenshot({ path: `${out}/${marke}-ende.png` });
writeFileSync(`${out}/${marke}-reihe.json`, JSON.stringify({ reihe, tat, leiter, fehler, namezuege }, null, 1));
console.log('Schritte', reihe.length - 1, 'NAME-Zuege', namezuege, 'Fehler', fehler.length);
console.log('LEITER:', leiter);
console.log(fehler.slice(0, 4));
await browser.close();
