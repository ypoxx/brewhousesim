/* DIE HOFDECKE — wo im Hof wirklich etwas steht, und wo blanke Platte bleibt.
 *
 *   node werkbank/schuss/stadt-r8/hofdecke.mjs <ziel.json> [epochen…]
 *   HAFEN=8899 node …
 *
 * AUFLAGE 6 des blinden Kritikers, in einem Satz: "Alle Fusspunkte aller
 * Hofbauten liegen in 60,0 bis 73,5 % der Buehnenhoehe; der Hof reicht bis
 * 85 %. Das vordere Drittel ist unberuehrte Platte — dieselbe Pfuetze, mit der
 * die Partie anfaengt, liegt nach dem sechsten Kauf noch da."
 *
 * Das ist eine Zahl, also braucht es ein Geraet und keine Meinung. Verfahren
 * wie bei DAS LOT (stadt-r6/lot.mjs, dieselbe Verstecke-Regel): ein Schuss
 * `?bau=keine` als blanke Platte, ein Schuss `?bau=alle` mit vollem Hof, und
 * dann Zeile fuer Zeile gezaehlt, welcher Anteil des HOFFELDES sich geaendert
 * hat. Fremde Ebenen, Kopfleiste, Werkbank, Namen und Hausschild sind
 * ausgeblendet — sonst misst man Bretter statt Bauten.
 *
 * Das Hoffeld ist nicht geraten: es ist der Bereich, den die Ortsliste dem Hof
 * gibt (kern/orte.js, art 'hof' plus die Bauplaetze) — x 8..62 %, y 55..85 %.
 * Die vordere Kante bei 85 % ist die Hofmauer; darunter faengt die Gasse an
 * (Ort 'strasse' liegt bei y 89).
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8899';
const ZIEL = process.argv[2] || 'werkbank/schuss/stadt-r8/hofdecke.json';
const EPOCHEN = process.argv.slice(3).length ? process.argv.slice(3).map(Number) : [1, 2, 3, 4];
const B = 2752, H = 1536;

/* DAS HOFFELD IST EINE RAUTE, KEIN RECHTECK — und das ist der Grund, warum
   die erste Fassung dieses Geraets zu streng gemessen hat.

   `K.boden` in stadt-daten.js haelt die Mauerlinie, an allen vier leeren
   Hoefen nachgemessen: Scheitel (29,9|78,5), links 0,49 px je px, rechts
   0,45, gueltig von x 16,0 bis 48,3. In Prozent der Buehne heisst das
   0,49 * (2752/1536) = 0,878 bzw. 0,806 Punkte Hoehe je Punkt Breite.

   Der Hof reicht also NUR im Keil um x 30 bis 78,5 % hinunter; bei x 20 ist
   bei 69,8 % Schluss und bei x 40 bei 70,4 %. Ein Rechteck 8..62 x 55..85
   zaehlt deshalb zu zwei Dritteln Flaeche mit, auf der gar kein Hof ist —
   und meldet "vorderes Drittel leer" auch dann, wenn der Keil voll steht.

   Gezaehlt wird ab jetzt je Zeile nur zwischen den beiden Mauerkanten. */
const FELD = { x0: 8, x1: 62, y0: 55, y1: 85 };
const BODEN = { scheitel: { x: 29.9, y: 78.5 }, links: 0.49, rechts: 0.45, von: 16.0, bis: 48.3 };
const SEITE = 2752 / 1536;
/* Die x-Spanne des Hofes in der Tiefe y (Prozent). Leer, wo kein Hof ist. */
function hofspanne(y) {
  const s = BODEN.scheitel;
  if (y > s.y) return null;
  const l = Math.max(BODEN.von, s.x - (s.y - y) / (BODEN.links * SEITE));
  const r = Math.min(BODEN.bis, s.x + (s.y - y) / (BODEN.rechts * SEITE));
  return r - l > 0.5 ? { l, r } : null;
}

const VERSTECKE = `
  [data-stueck]:not([data-stueck="stadt"]) { display: none !important; }
  #ebene-kopf, .stadt-werkbank { display: none !important; }
  .stadt-name, .stadt-schildwerk { display: none !important; }
`;

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: B, height: H }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + e));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });

async function bild(url) {
  await seite.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await seite.addStyleTag({ content: VERSTECKE });
  await seite.evaluate(async () => { await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
  await seite.waitForTimeout(500);
  return seite.screenshot({ type: 'png' });
}

/* Der Vergleich laeuft im Browser: zwei Datenschuesse auf zwei Canvas, dann
   zeilenweise zaehlen. Kein PNG-Auspacker noetig, keine Fremdbibliothek. */
async function vergleiche(a, b, feld) {
  return seite.evaluate(async ([da, db, f, W, Hh, bo, se]) => {
    const spanne = (y) => {
      if (y > bo.scheitel.y) return null;
      const l = Math.max(bo.von, bo.scheitel.x - (bo.scheitel.y - y) / (bo.links * se));
      const r = Math.min(bo.bis, bo.scheitel.x + (bo.scheitel.y - y) / (bo.rechts * se));
      return r - l > 0.5 ? { l, r } : null;
    };
    const L = async q => { const i = new Image(); await new Promise(r => { i.onload = r; i.src = q; }); return i; };
    const ia = await L(da), ib = await L(db);
    const k = (im) => { const c = document.createElement('canvas'); c.width = W; c.height = Hh;
      const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0);
      return x.getImageData(0, 0, W, Hh).data; };
    const pa = k(ia), pb = k(ib);
    const y0 = Math.round(f.y0 / 100 * Hh), y1 = Math.round(f.y1 / 100 * Hh);
    const zeilen = [];
    for (let y = y0; y < y1; y++) {
      const sp = spanne(100 * y / Hh);
      if (!sp) { zeilen.push(null); continue; }
      const x0 = Math.round(sp.l / 100 * W), x1 = Math.round(sp.r / 100 * W);
      let anders = 0;
      for (let x = x0; x < x1; x++) {
        const o = (y * W + x) * 4;
        if (Math.abs(pa[o] - pb[o]) > 8 || Math.abs(pa[o + 1] - pb[o + 1]) > 8 ||
            Math.abs(pa[o + 2] - pb[o + 2]) > 8) anders++;
      }
      zeilen.push(anders / (x1 - x0));
    }
    return { zeilen, y0, y1, hoehe: Hh };
  }, [a, b, feld, B, H, BODEN, SEITE]);
}

const erg = { stand: new Date().toISOString(), feld: FELD };
mkdirSync('werkbank/schuss/stadt-r8', { recursive: true });

for (const ep of EPOCHEN) {
  const leer = await bild(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350&bau=keine`);
  const voll = await bild(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350&bau=alle`);
  const d = a => 'data:image/png;base64,' + a.toString('base64');
  const r = await vergleiche(d(leer), d(voll), FELD);

  /* Gezaehlt wird nur ueber Zeilen, in denen es ueberhaupt Hof gibt. */
  const mit = r.zeilen.map((v, i) => ({ v, y: FELD.y0 + (i / r.zeilen.length) * (FELD.y1 - FELD.y0) }))
                      .filter(z => z.v !== null);
  const mittel = l => l.length ? +(100 * l.reduce((s, z) => s + z.v, 0) / l.length).toFixed(1) : null;
  const yMin = mit[0].y, yMax = mit[mit.length - 1].y, spanY = yMax - yMin;
  const drittel = [0, 1, 2].map(t =>
    mittel(mit.filter(z => z.y >= yMin + t * spanY / 3 && z.y < yMin + (t + 1) * spanY / 3 + (t === 2 ? 1 : 0))));
  const baender = [];
  for (let y = FELD.y0; y < FELD.y1; y += 5) {
    const l = mit.filter(z => z.y >= y && z.y < y + 5);
    if (l.length) baender.push({ von: y, bis: y + 5, fuellung: mittel(l) });
  }
  erg['e' + ep] = { drittel_hinten_mitte_vorn: drittel, baender };
  console.log(`E${ep}: hinten ${drittel[0]} %  mitte ${drittel[1]} %  VORN ${drittel[2]} %` +
              `   |  ${baender.map(b => b.von + '–' + b.bis + ': ' + b.fuellung).join('  ')}`);
}

await browser.close();
erg.seitenfehler = fehler.length;
writeFileSync(ZIEL, JSON.stringify(erg, null, 2));
console.log(fehler.length ? 'FEHLER: ' + fehler.slice(0, 2).join(' | ') : 'keine Fehler auf der Seite');
console.log('geschrieben: ' + ZIEL);
