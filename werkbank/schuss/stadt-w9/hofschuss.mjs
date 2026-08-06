/* HOFSCHUSS — den Hof ansehen, mit und ohne Oberflaeche, voll ausgebaut.
 *   HAFEN=8931 node werkbank/schuss/stadt-w9/hofschuss.mjs <epochen> [marke]
 *
 * Fuer die Auflagen A4 (leere Tafeln), A6 (Hofbauten in der Stadt),
 * A7 (der Hof stapelt sich) und A8 (1970 braucht Verkehr) muss man das Bild
 * ANSEHEN, nicht die Tabelle lesen. Dieses Geraet schiesst je Epoche
 *   · den Ladezustand mit `?bau=alle` (die Obergrenze des Gemalten),
 *   · dasselbe ohne die vier oberen Ebenen (nur Platte und Hof),
 * und schreibt dazu die Bildschirmrechtecke aller Aufbauten und Frachten
 * mit Namen — damit ein Befund eine Adresse hat.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8931';
const EPOCHEN = (process.argv[2] || '1,2,3,4').split(',').map(Number);
const MARKE = process.argv[3] || process.env.MARKE || 'hof';
const AUS = 'werkbank/schuss/stadt-w9/bild';
mkdirSync(AUS, { recursive: true });

const b = await chromium.launch();
for (const e of EPOCHEN) {
  const s = await b.newPage({ viewport: { width: 2752, height: 1536 }, deviceScaleFactor: 1 });
  const fehler = [];
  s.on('pageerror', (x) => fehler.push(String(x).slice(0, 160)));
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350&bau=alle`,
    { waitUntil: 'networkidle' });
  await s.waitForTimeout(1800);
  await s.screenshot({ path: `${AUS}/${MARKE}-e${e}-alle.png` });
  const liste = await s.evaluate(() => {
    const aus = [];
    document.querySelectorAll('#ebene-bau *, #ebene-marken *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width < 6 || r.height < 6) return;
      const q = el.getAttribute('data-bau') || el.getAttribute('data-fracht')
        || (el.src || '').split('/').pop() || '';
      const txt = el.children.length === 0 ? (el.textContent || '').trim().slice(0, 28) : '';
      if (!q && !txt) return;
      aus.push({ was: q || 'TEXT «' + txt + '»',
        x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),
        px: +(100 * r.x / innerWidth).toFixed(1), py: +(100 * r.bottom / innerHeight).toFixed(1) });
    });
    return aus.sort((a, c) => a.y - c.y);
  });
  await s.evaluate(() => ['marken', 'hand', 'kopf', 'blatt'].forEach((n) => {
    const w = document.querySelector('#ebene-' + n); if (w) w.style.visibility = 'hidden';
  }));
  await s.waitForTimeout(300);
  await s.screenshot({ path: `${AUS}/${MARKE}-e${e}-alle-nackt.png` });
  console.log(`\n===== EPOCHE ${e} · ${liste.length} Stuecke · Fehler ${fehler.length} =====`);
  liste.forEach((t) => console.log(`  ${String(t.was).padEnd(24)} x${String(t.x).padStart(4)}..`
    + `${String(t.x + t.w).padStart(4)} y${String(t.y).padStart(4)}..${String(t.y + t.h).padStart(4)}`
    + `  (${t.w}x${t.h})  Fuss ${t.py} %`));
  await s.close();
}
await b.close();
