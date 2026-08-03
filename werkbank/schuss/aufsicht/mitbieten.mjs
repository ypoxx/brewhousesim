/* MITBIETEN — die Gegenprobe der Aufsicht zum fuenften Verb in 1970.
   HAFEN=8900 node werkbank/schuss/aufsicht/mitbieten.mjs

   DER GEGNER meldet fuer Auflage 5 ein Verb, das es nur in 1970 gibt: drei
   Gebote nebeneinander, jedes mit eigenem Preisschild, jedes schliesst die
   beiden anderen aus, keines sicher (34/62/88 von 100), fuenf Wochen Frist,
   Bietungssicherheit zurueck bis auf 12 % Notarkosten.

   Diese Datei glaubt das nicht, sondern zaehlt am Bildschirm nach:
     1. Taucht der Notartermin ueberhaupt auf, und in welcher Woche?
     2. Stehen die drei Gebote GLEICHZEITIG da, erreichbar und aktiv?
     3. Schliessen sie einander wirklich aus — nach einem Klick die anderen aus?
     4. Gibt es das Verb in 1350/1600/1884 wirklich nicht?
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const HAFEN = process.env.HAFEN || '8899';
const browser = await chromium.launch();

async function lage(s, z) {
  return s.evaluate((zz) => {
    const e = document.querySelector(`[data-zug="${zz}"]`);
    if (!e) return null;
    const r = e.getBoundingClientRect(); if (!r.width) return { da: true, sichtbar: false };
    const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return { da: true, sichtbar: true, aus: !!e.disabled,
             frei: !!(t && (t === e || e.contains(t))),
             preis: e.getAttribute('data-preis'),
             text: (e.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 70) };
  }, z);
}

for (const ep of [1, 2, 3, 4]) {
  const s = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
  const fehler = [];
  s.on('pageerror', e => fehler.push(String(e).slice(0, 120)));
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(800);

  let gefunden = null;
  for (let w = 0; w < 120 && !gefunden; w++) {
    const gebote = await s.evaluate(() =>
      [...document.querySelectorAll('[data-zug^="gegner:mitbieten"]')].map(e => e.getAttribute('data-zug')));
    if (gebote.length) {
      gefunden = { woche: w, zeit: await s.evaluate(() => ({ ...BRAUHAUS.welt.zeit })), gebote };
      break;
    }
    const ok = await s.evaluate(() => {
      const frei = z => { const e = document.querySelector(`[data-zug="${z}"]`); if (!e) return false;
        const r = e.getBoundingClientRect(); if (!r.width) return false;
        const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return !!(t && (t === e || e.contains(t))); };
      const tu = z => { const e = document.querySelector(`[data-zug="${z}"]`);
        if (e && !e.disabled) { e.click(); return true; } return false; };
      if (document.querySelector('.fu-sperre')) tu('fuhre:sommer-zu');
      if (!frei('weiter')) for (const r of document.querySelectorAll('[data-zug^="stadt:reiter:"]')) {
        if (frei('weiter')) break; r.click();
      }
      return tu('weiter');
    });
    await s.waitForTimeout(45);
    if (!ok) break;
  }

  if (!gefunden) {
    console.log(`E${ep}: kein gegner:mitbieten* in 120 Wochen — Verb nicht vorhanden`);
    await s.close(); continue;
  }

  console.log(`\nE${ep}: Notartermin in Woche ${gefunden.woche} (${gefunden.zeit.jahr}/${gefunden.zeit.woche}) ` +
              `— ${gefunden.gebote.length} Gebote: ${gefunden.gebote.join(', ')}`);
  for (const g of gefunden.gebote) {
    const l = await lage(s, g);
    console.log(`   ${g.padEnd(24)} preis=${l && l.preis} aus=${l && l.aus} frei=${l && l.frei} | ${l && l.text}`);
  }
  /* Schliessen sie einander aus? Eines nehmen, die anderen nachsehen. */
  const erste = gefunden.gebote[0];
  const vorKasse = await s.evaluate(() => BRAUHAUS.welt.haus.kasse);
  await s.evaluate(z => document.querySelector(`[data-zug="${z}"]`)?.click(), erste);
  await s.waitForTimeout(250);
  const nach = [];
  for (const g of gefunden.gebote) nach.push([g, await lage(s, g)]);
  const nachKasse = await s.evaluate(() => BRAUHAUS.welt.haus.kasse);
  console.log(`   nach Klick auf ${erste}: Kasse ${vorKasse} → ${nachKasse}`);
  for (const [g, l] of nach) console.log(`     ${g.padEnd(24)} ${l ? (l.sichtbar ? ('aus=' + l.aus) : 'nicht gezeichnet') : 'weg'}`);
  console.log(`   Seitenfehler: ${fehler.length}`);
  await s.close();
}
await browser.close();
