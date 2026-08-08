// Frage 4: 1350 bis 1355 spielen, OHNE einen Reiter anzufassen. Klickt nur
// 'weiter', sonst nichts — auch keine anderen Knoepfe. Schuss alle 10 Wochen
// und bei jeder Aenderung des Uebergabe-Zustands, damit man als Spieler
// hinsehen kann, nicht nur zaehlen.

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const zielVerzeichnis = 'werkbank/schuss/kritik-w13-k4/passiv-1350';
fs.mkdirSync(zielVerzeichnis, { recursive: true });

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const seitenfehler = [];
seite.on('pageerror', (e) => seitenfehler.push('pageerror: ' + String(e)));
seite.on('console', (m) => { if (m.type() === 'error') seitenfehler.push('console: ' + m.text()); });

await seite.goto('http://127.0.0.1:8933/spiel/?epoche=1&saat=1350&neu=1', { waitUntil: 'networkidle', timeout: 60000 });
await seite.waitForTimeout(700);

async function echterKlick(zug) {
  const handle = await seite.$(`[data-zug="${zug}"]`);
  if (!handle) return { ok: false, grund: 'nicht-im-dom' };
  const box = await handle.boundingBox();
  if (!box || box.width <= 0 || box.height <= 0) return { ok: false, grund: 'keine-flaeche' };
  const x = box.x + box.width / 2, y = box.y + box.height / 2;
  const treffer = await seite.evaluate(([x, y, zug]) => {
    const el = document.elementFromPoint(x, y);
    const ziel = el ? el.closest('[data-zug]') : null;
    return !!ziel && ziel.getAttribute('data-zug') === zug;
  }, [x, y, zug]);
  if (!treffer) return { ok: false, grund: 'nicht-unter-zeiger' };
  await seite.mouse.click(x, y);
  return { ok: true };
}

let letzterUebergabeZustand = null;
const protokoll = [];
let w = 0;
while (w < 180) {
  w++;
  const zustand = await seite.evaluate(() => {
    const w = BRAUHAUS.welt;
    return { jahr: w.zeit.jahr, woche: w.zeit.woche, ende: !!w.zeit.ende };
  });
  if (zustand.ende) break;
  if (zustand.jahr >= 1356) break;

  const zuege = await seite.evaluate(() => BRAUHAUS.zuege());
  const uebergabeKnopf = zuege.find(z => z.zug === 'fuhre:uebergabe-auf');
  const jetzt = uebergabeKnopf ? (uebergabeKnopf.text + '|' + uebergabeKnopf.offen) : null;
  if (jetzt !== letzterUebergabeZustand) {
    protokoll.push({ w, jahr: zustand.jahr, woche: zustand.woche, uebergabeKnopf: uebergabeKnopf || null });
    letzterUebergabeZustand = jetzt;
    await seite.screenshot({ path: `${zielVerzeichnis}/wechsel-w${String(w).padStart(3, '0')}.png` });
  }
  if (w % 10 === 1) {
    await seite.screenshot({ path: `${zielVerzeichnis}/serie-w${String(w).padStart(3, '0')}.png` });
  }

  await echterKlick('weiter');
  await seite.waitForTimeout(90);
}

const endZustand = await seite.evaluate(() => {
  const w = BRAUHAUS.welt;
  return { jahr: w.zeit.jahr, woche: w.zeit.woche, ende: !!w.zeit.ende, kasse: w.haus.kasse };
});
await seite.screenshot({ path: `${zielVerzeichnis}/ende.png` });

fs.writeFileSync(`${zielVerzeichnis}/protokoll.json`, JSON.stringify({ protokoll, endZustand, wochenGespielt: w, seitenfehler }, null, 1));
console.log('fertig. wochen=', w, 'endZustand=', JSON.stringify(endZustand));
console.log('Uebergabe-Wechsel:', JSON.stringify(protokoll, null, 1));
await browser.close();
