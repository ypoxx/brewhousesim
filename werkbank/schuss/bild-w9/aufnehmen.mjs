/* AUFNEHMEN — zwei Zustaende je Epoche, in der Flaeche der Zielbilder.
     HAFEN=8907 node werkbank/schuss/bild-w9/aufnehmen.mjs <epoche> <wochen>

   Zustand A: gleich nach dem Laden.
   Zustand B: nach <wochen> gespielten Wochen, wobei zwischendurch alles
              gekauft wird, was nach einem Hofbau aussieht (Bauten stehen
              sonst nie im Bild).
   Schreibt ein Klickprotokoll neben jede Aufnahme.                          */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8907';
const E = process.argv[2] || '1';
const WOCHEN = +(process.argv[3] || 34);
const W = 2752, H = 1536;
const ZIEL = 'werkbank/schuss/bild-w9/bilder';

const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: W, height: H } });
const fehler = [];
s.on('pageerror', e => fehler.push('pageerror: ' + String(e)));
s.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });

const prot = [];
const log = t => { prot.push(t); console.log('  ' + t); };

await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${E}&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(1800);

const stand = async () => s.evaluate(() => ({
  jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
  epoche: BRAUHAUS.welt.zeit.epoche, kasse: Math.round(BRAUHAUS.welt.haus.kasse),
  lage: BRAUHAUS.lage.length
}));

let z = await stand();
log(`geladen: ${z.jahr}/${z.woche}  Epoche ${z.epoche}  Kasse ${z.kasse}`);
await s.screenshot({ path: `${ZIEL}/e${E}-a-laden.png` });
log(`AUFNAHME A -> e${E}-a-laden.png`);

/* --- spielen --- */
const BAUWORT = /(bau|errichte|graben|kaufe[nx]?|anlegen|stellen|setzen|hof)/i;
let gebaut = 0, klicks = 0;
for (let i = 0; i < WOCHEN; i++) {
  /* erst alles bauen, was bezahlbar ist */
  for (let runde = 0; runde < 4; runde++) {
    const traf = await s.evaluate(() => {
      const kand = [...document.querySelectorAll('button[data-zug]')].filter(el => {
        if (el.disabled) return false;
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) return false;
        const zug = el.dataset.zug || '';
        return /^(stadt|hof):.*(bau|kauf|errichte|grab)/i.test(zug) ||
               /^stadt:bau/i.test(zug) || /bau:/i.test(zug);
      });
      if (!kand.length) return null;
      const el = kand[0];
      const t = (el.textContent || '').trim().slice(0, 60);
      const zug = el.dataset.zug;
      el.click();
      return { zug, t };
    });
    if (!traf) break;
    gebaut++; klicks++;
    log(`bauen: ${traf.zug} — ${traf.t.replace(/\s+/g, ' ')}`);
    await s.waitForTimeout(120);
  }
  /* Woche weiter */
  const ok = await s.evaluate(() => {
    const k = document.querySelector('[data-zug="weiter"]');
    if (!k || k.disabled) return false;
    k.click(); return true;
  });
  klicks++;
  if (!ok) {
    /* WEITER gesperrt — Tafel wegklicken und noch einmal */
    await s.keyboard.press('Escape');
    await s.waitForTimeout(150);
    await s.evaluate(() => { const k = document.querySelector('[data-zug="weiter"]'); if (k) k.click(); });
    log(`WEITER war gesperrt in Runde ${i + 1} — Escape, dann erneut`);
  }
  await s.waitForTimeout(230);
}
z = await stand();
log(`gespielt: ${klicks} Klicks, davon ${gebaut} Bau-/Kaufklicks -> ${z.jahr}/${z.woche}  Kasse ${z.kasse}  lage ${z.lage}`);

await s.waitForTimeout(900);
await s.screenshot({ path: `${ZIEL}/e${E}-b-gespielt.png` });
log(`AUFNAHME B -> e${E}-b-gespielt.png`);

/* Zustand B ohne offene Tafeln: Escape, dann noch eine Aufnahme */
await s.keyboard.press('Escape');
await s.waitForTimeout(600);
await s.screenshot({ path: `${ZIEL}/e${E}-c-gespielt-esc.png` });
log(`AUFNAHME C (nach Escape) -> e${E}-c-gespielt-esc.png`);

prot.push('fehler: ' + (fehler.length ? JSON.stringify(fehler.slice(0, 10)) : 'keine'));
console.log('fehler:', fehler.length ? fehler.slice(0, 6) : 'keine');
writeFileSync(`${ZIEL}/e${E}-protokoll.txt`, prot.join('\n') + '\n');
await b.close();
