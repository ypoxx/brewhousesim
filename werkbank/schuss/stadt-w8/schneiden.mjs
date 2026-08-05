/* SCHNEIDEN — einen 2x2-Bogen in freigestellte WebP zerlegen.
 *
 *   node werkbank/schuss/stadt-w8/schneiden.mjs <bogen.jpg> <plan.json>
 *
 * WARUM NICHT stadt-r6/freistellen.py: auf dieser Maschine liegt weder numpy
 * noch PIL noch scipy (geprueft am 5.8.2026 — `import numpy` schlaegt fehl).
 * Das Geraet der Runde 6 laeuft hier nicht mehr. Chromium kann beides selbst:
 * Alphakanal rechnen im Canvas und WebP schreiben mit libwebp; denselben Weg
 * geht stadt-gewicht/umpacken.mjs seit Welle 7.
 *
 * DER SCHLUESSEL IST MAGENTA, NICHT WEISS. Die Boegen entstehen auf reinem
 * #FF00FF, weil im Hof brauner Holzton und weisse Leinenhemden vorkommen —
 * ein Weiss-Schluessel haette die Hemden aufgefressen. Das Mass ist
 *      m = min(r,b) - g
 * fuer reines Magenta 255, fuer Braun -40, fuer Haut -30, fuer Grau 0.
 * Ueber SCHWELLE_AUS ist Hintergrund, unter SCHWELLE_AN Objekt, dazwischen
 * weich — und im weichen Saum wird der Magentastich herausgerechnet, sonst
 * bleibt eine rosa Kante stehen (derselbe Fehler, den die Runde-5-Notiz in
 * spiel/bild/LIESMICH.md "Entfaerben des Magentasaums" nennt).
 *
 * Danach: auf den Kasten der deckenden Pixel beschneiden, RAND_LEER Reihen
 * ganz leer und RAND_WEICH weich anlaufend lassen (die Fugennaht-Regel aus
 * bild/LIESMICH.md), auf ZIEL_BREITE herunterrechnen, als WebP schreiben.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const bogen = process.argv[2];
const plan = JSON.parse(readFileSync(process.argv[3], 'utf8'));
const Q = Number(process.env.Q || 0.86);

const b = await chromium.launch();
const s = await b.newPage();
await s.setContent('<body style="margin:0">');
const roh = readFileSync(bogen).toString('base64');
const art = bogen.endsWith('.png') ? 'png' : 'jpeg';

for (const t of plan.teile) {
  const daten = await s.evaluate(async ({ roh, art, t, Q, cfg }) => {
    const bild = new Image();
    await new Promise((ok, weh) => { bild.onload = ok; bild.onerror = weh; bild.src = `data:image/${art};base64,${roh}`; });
    const BW = bild.naturalWidth, BH = bild.naturalHeight;
    const x0 = Math.round(t.k[0] * BW), y0 = Math.round(t.k[1] * BH);
    const w = Math.round(t.k[2] * BW) - x0, h = Math.round(t.k[3] * BH) - y0;

    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d');
    g.drawImage(bild, x0, y0, w, h, 0, 0, w, h);
    const d = g.getImageData(0, 0, w, h), p = d.data;

    /* 1. Alphakanal aus dem Magentamass, Saum entfaerben. */
    for (let i = 0; i < p.length; i += 4) {
      const r = p[i], gg = p[i + 1], bb = p[i + 2];
      const m = Math.min(r, bb) - gg;
      let a;
      if (m >= cfg.aus) a = 0;
      else if (m <= cfg.an) a = 255;
      else a = Math.round(255 * (cfg.aus - m) / (cfg.aus - cfg.an));
      if (a > 0 && m > cfg.an) {                      /* Magentastich heraus */
        const zu = (m - cfg.an) / (cfg.aus - cfg.an);
        p[i] = Math.round(r - (r - gg) * zu * 0.9);
        p[i + 2] = Math.round(bb - (bb - gg) * zu * 0.9);
      }
      p[i + 3] = a;
    }
    /* 2. Streusel weg: ein deckendes Pixel braucht deckende Nachbarn.
          (Die Runde-7-Notiz "ein Staubkorn zog den Rahmen auf" — genau das.) */
    const alt = new Uint8Array(w * h);
    for (let i = 0, k = 0; i < p.length; i += 4, k++) alt[k] = p[i + 3];
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const k = y * w + x;
      if (alt[k] === 0 || alt[k] > 40) continue;
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (alt[k + dy * w + dx] > 40) n++;
      if (n === 0) p[k * 4 + 3] = 0;
    }
    /* 3. Kasten der deckenden Pixel. */
    let lx = w, rx = -1, oy = h, uy = -1;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (p[(y * w + x) * 4 + 3] < 12) continue;
      if (x < lx) lx = x; if (x > rx) rx = x;
      if (y < oy) oy = y; if (y > uy) uy = y;
    }
    if (rx < 0) return null;
    g.putImageData(d, 0, 0);

    /* 4. Beschneiden, Rand anlegen, auf Zielbreite rechnen. */
    const iw = rx - lx + 1, ih = uy - oy + 1;
    const rand = cfg.leer + cfg.weich;
    const skala = Math.min(1, t.breite / iw);
    const zw = Math.round(iw * skala), zh = Math.round(ih * skala);
    const z = document.createElement('canvas');
    z.width = zw + 2 * rand; z.height = zh + 2 * rand;
    const zg = z.getContext('2d');
    zg.imageSmoothingQuality = 'high';
    zg.drawImage(c, lx, oy, iw, ih, rand, rand, zw, zh);
    /* Fugennaht: aeussere Reihen leer, die naechsten weich anlaufend. */
    const zd = zg.getImageData(0, 0, z.width, z.height), q = zd.data;
    for (let y = 0; y < z.height; y++) for (let x = 0; x < z.width; x++) {
      const rndAbst = Math.min(x, y, z.width - 1 - x, z.height - 1 - y);
      if (rndAbst >= rand) continue;
      const k = (y * z.width + x) * 4;
      if (rndAbst < cfg.leer) q[k + 3] = 0;
      else q[k + 3] = Math.round(q[k + 3] * (rndAbst - cfg.leer + 1) / (cfg.weich + 1));
    }
    zg.putImageData(zd, 0, 0);
    return { url: z.toDataURL('image/webp', Q), w: z.width, h: z.height, roh: [iw, ih] };
  }, { roh, art, t, Q, cfg: plan.cfg });

  if (!daten) { console.log(`!! ${t.name}: kein deckendes Pixel`); continue; }
  const buf = Buffer.from(daten.url.split(',')[1], 'base64');
  writeFileSync(t.ziel, buf);
  console.log(`${t.ziel}  ${daten.w}x${daten.h}  ${(buf.length / 1024).toFixed(0)} KB  (roh ${daten.roh[0]}x${daten.roh[1]})`);
}
await b.close();
