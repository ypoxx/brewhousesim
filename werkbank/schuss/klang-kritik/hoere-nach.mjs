/* Eigene Messung an der WAV-Datei: Pegel ueber Zeit, Uebersteuerung,
   Oktavband-Energie (Goertzel), damit "es klingt" und "es klingt anders"
   Zahlen bekommen und nicht Eindruecke bleiben. */
import { readFileSync } from 'node:fs';

function lies(pfad) {
  const b = readFileSync(pfad);
  const rate = b.readUInt32LE(24), bits = b.readUInt16LE(34), kan = b.readUInt16LE(22);
  let o = 12;
  while (o < b.length - 8) {
    const id = b.toString('ascii', o, o + 4), len = b.readUInt32LE(o + 4);
    if (id === 'data') { return { rate, bits, kan, daten: b.subarray(o + 8, o + 8 + len) }; }
    o += 8 + len + (len % 2);
  }
  throw new Error('kein data-chunk');
}

const BAENDER = [63, 125, 250, 500, 1000, 2000, 4000, 8000];

export function messe(pfad) {
  const { rate, bits, kan, daten } = lies(pfad);
  const n = daten.length / (bits / 8) / kan;
  const x = new Float32Array(n);
  for (let i = 0; i < n; i++) x[i] = daten.readInt16LE(i * 2 * kan) / 32768;
  const f = Math.round(rate * 0.25);
  const fenster = [];
  for (let i = 0; i + f <= n; i += f) {
    let q = 0, s = 0;
    for (let k = i; k < i + f; k++) { q += x[k] * x[k]; if (Math.abs(x[k]) >= 0.999) s++; }
    fenster.push({ t: +(i / rate).toFixed(2), rms: +Math.sqrt(q / f).toFixed(5), klipp: s });
  }
  let quad = 0, spitze = 0, klipp = 0;
  for (let i = 0; i < n; i++) { quad += x[i] * x[i]; const a = Math.abs(x[i]); if (a > spitze) spitze = a; if (a >= 0.999) klipp++; }
  /* Goertzel je Band, ueber die ganze Datei, in 8192er Bloecken */
  const B = 8192, band = BAENDER.map(() => 0);
  let bl = 0;
  for (let i = 0; i + B <= n; i += B) {
    bl++;
    BAENDER.forEach((fr, bi) => {
      const w = 2 * Math.PI * fr / rate, c = 2 * Math.cos(w);
      let s0 = 0, s1 = 0, s2 = 0;
      for (let k = i; k < i + B; k++) { s0 = x[k] + c * s1 - s2; s2 = s1; s1 = s0; }
      band[bi] += Math.sqrt(s1 * s1 + s2 * s2 - c * s1 * s2) / B;
    });
  }
  const spektrum = {}; BAENDER.forEach((fr, bi) => spektrum[fr] = +(band[bi] / bl).toFixed(6));
  const summe = Object.values(spektrum).reduce((a, b) => a + b, 0) || 1;
  const anteil = {}; BAENDER.forEach(fr => anteil[fr] = +(spektrum[fr] / summe).toFixed(3));
  const rmsWerte = fenster.map(w => w.rms).sort((a, b) => a - b);
  return {
    datei: pfad.split('/').pop(), rate, kanaele: kan, sekunden: +(n / rate).toFixed(2),
    rms: +Math.sqrt(quad / n).toFixed(5), spitze: +spitze.toFixed(4),
    klippProben: klipp, klippAnteil: +(klipp / n * 100).toFixed(3),
    fensterStill: fenster.filter(w => w.rms < 0.002).length, fensterGesamt: fenster.length,
    rmsMin: rmsWerte[0], rmsMedian: rmsWerte[rmsWerte.length >> 1], rmsMax: rmsWerte[rmsWerte.length - 1],
    schwankung: +(rmsWerte[rmsWerte.length - 1] / Math.max(rmsWerte[0], 1e-6)).toFixed(1),
    bandanteil: anteil, spur: fenster.map(w => w.rms)
  };
}

if (process.argv[2]) {
  const aus = process.argv.slice(2).map(messe);
  for (const a of aus) { const { spur, ...rest } = a; console.log(JSON.stringify(rest)); }
  if (aus.length > 1) {
    console.log('\nBandanteile nebeneinander:');
    console.log(['Hz', ...aus.map(a => a.datei.replace('.wav', ''))].join('\t'));
    for (const fr of BAENDER) console.log([fr, ...aus.map(a => a.bandanteil[fr])].join('\t'));
    console.log('\nAbstand der Bandprofile (L1) zwischen den Dateien:');
    for (let i = 0; i < aus.length; i++) for (let j = i + 1; j < aus.length; j++) {
      const d = BAENDER.reduce((s, fr) => s + Math.abs(aus[i].bandanteil[fr] - aus[j].bandanteil[fr]), 0);
      console.log(`${aus[i].datei} <-> ${aus[j].datei}: ${d.toFixed(3)}`);
    }
  }
}
