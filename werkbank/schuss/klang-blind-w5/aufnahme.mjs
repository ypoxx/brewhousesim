/* ===========================================================================
   EIGENES MESSGERAET — nicht das des Bauers.

   Es haengt einen eigenen ScriptProcessor an BRAUHAUS.ton.ausgang() (den
   LEBENDEN Ausgangsknoten) und schreibt die Abtastwerte selbst als WAV.
   Kein Gebrauch von ton.wav()/ton.rendere() — das ist der Offline-Renderer
   des Bauers und beweist nicht, dass im Browser wirklich etwas erklingt.
   Am Geraet des Bauers wird nichts gedreht: der Abgriff endet in einem
   Gain mit 0 und veraendert den Hauptweg nicht.

     node aufnahme.mjs <epoche> <art:gespielt|still> <ziel.wav> [saat]

   Legt daneben ab: <ziel>.json — Pegelverlauf, AudioContext-Zustand,
   Mitschnitt des Spiels (Name + Sekunde), Klickprotokoll, Konsolenfehler.
   =========================================================================== */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const HAFEN = process.env.HAFEN || 'http://127.0.0.1:8917';
const EP = Number(process.argv[2] || 1);
const ART = process.argv[3] || 'gespielt';
const ZIEL = process.argv[4];
const SAAT = process.argv[5] || '1350';
const DAUER = Number(process.env.DAUER || 30);
const VORLAUF_WOCHEN = Number(process.env.VORLAUF || 26);

if (!ZIEL) { console.error('ziel fehlt'); process.exit(1); }

const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required', '--no-sandbox'] });
const s = await b.newContext();
const p = await s.newPage();
const fehler = [];
p.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
p.on('pageerror', e => fehler.push('pageerror: ' + e.message));

await p.goto(`${HAFEN}/spiel/?epoche=${EP}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await p.waitForTimeout(2000);

/* --- ein echter Mausklick auf einen sichtbaren, nicht gesperrten Zug -----
   Locator statt ElementHandle: das Spiel zeichnet bei jeder Woche neu, ein
   festgehaltenes Element ist danach tot. Der Locator fragt neu. */
async function klick(praefix, frist = 900) {
  const loc = p.locator(`[data-zug^="${praefix}"]:not([data-soll-aus="1"]):visible`).first();
  try {
    const zug = await loc.getAttribute('data-zug', { timeout: frist });
    await loc.click({ timeout: frist, noWaitAfter: true });
    return zug;
  } catch (_) { return null; }
}

/* --- VORLAUF: mit der Maus bis kurz vor den Jahreswechsel ---------------- */
const vorlauf = [];
for (let i = 0; i < 200; i++) {
  const w = await p.evaluate(() => BRAUHAUS.welt.zeit.woche);
  if (w >= VORLAUF_WOCHEN) break;
  const z = await klick('weiter');
  vorlauf.push(z);
  if (!z) break;
  await p.waitForTimeout(60);
}
const standVor = await p.evaluate(() => JSON.parse(JSON.stringify(BRAUHAUS.welt.zeit)));

/* --- MEIN ABGRIFF -------------------------------------------------------- */
const start = await p.evaluate(() => {
  const B = window.BRAUHAUS;
  const aus = B.ton.ausgang && B.ton.ausgang();
  if (!aus) return { ok: false, grund: 'kein ausgang()' };
  const ctx = aus.context;
  const proc = ctx.createScriptProcessor(4096, 1, 1);
  const nichts = ctx.createGain(); nichts.gain.value = 0;
  aus.connect(proc); proc.connect(nichts); nichts.connect(ctx.destination);
  const K = { rate: ctx.sampleRate, teile: [], proc, nichts, ctx, t0: ctx.currentTime,
              perf0: performance.now() / 1000 };
  proc.onaudioprocess = function (e) { K.teile.push(new Float32Array(e.inputBuffer.getChannelData(0))); };
  window.__KRITIKER = K;
  B.ton.beginneMitschnitt();
  return { ok: true, rate: ctx.sampleRate, zustand: ctx.state, t0: K.t0,
           laut: B.ton.laut, stumm: B.ton.stumm, pegelVorher: B.ton.pegel() };
});
if (!start.ok) { console.error('Abgriff fehlgeschlagen: ' + start.grund); await b.close(); process.exit(2); }

/* --- DIE DREISSIG SEKUNDEN ---------------------------------------------- */
const t0 = Date.now();
const sek = () => (Date.now() - t0) / 1000;
const klicks = [];
const pegelReihe = [];

/* Zugplan: was ein Mensch in einer halben Minute tut. Immer dieselbe
   Reihenfolge, damit die vier Epochen vergleichbar bleiben. */
const PLAN = [
  [0.8, 'stadt:reiter:fuhre-fu-brett-fu-wagen'],
  [2.0, 'fuhre:fuellen'], [3.4, 'fuhre:abschicken'],
  [6.0, 'sud:zettel-anstich'], [7.5, 'weiter'],
  [9.5, 'fuhre:fuellen'], [11.0, 'fuhre:abschicken'],
  [13.5, 'weiter'], [15.0, 'weiter'],
  [17.0, 'fuhre:fuellen'], [18.5, 'fuhre:abschicken'],
  [21.0, 'weiter'], [22.5, 'weiter'],
  [24.0, 'fuhre:fuellen'], [25.5, 'fuhre:abschicken'],
  [27.5, 'weiter'], [29.0, 'weiter']
];
let n = 0;
while (sek() < DAUER) {
  const t = sek();
  if (ART === 'gespielt' && n < PLAN.length && t >= PLAN[n][0]) {
    const wunsch = PLAN[n][1]; n++;
    const vor = sek();
    const z = await klick(wunsch);
    klicks.push({ t: Number(vor.toFixed(2)), wunsch, zug: z });
    continue;
  }
  const pg = await p.evaluate(() => BRAUHAUS.ton.pegel());
  pegelReihe.push({ t: Number(sek().toFixed(2)), rms: pg.rms, spitze: pg.spitze, zustand: pg.zustand });
  await p.waitForTimeout(120);
}

/* --- ABHOLEN: eigenes WAV, eigene Zahlen -------------------------------- */
const ergebnis = await p.evaluate(() => {
  const B = window.BRAUHAUS, K = window.__KRITIKER;
  K.proc.onaudioprocess = null;
  try { K.proc.disconnect(); K.nichts.disconnect(); } catch (_) { }
  let n = 0; K.teile.forEach(t => n += t.length);
  const alle = new Float32Array(n); let o = 0;
  K.teile.forEach(t => { alle.set(t, o); o += t.length; });

  /* eigener WAV-Schreiber, 16 bit PCM, OHNE Normalisierung */
  const bytes = 44 + n * 2, ab = new ArrayBuffer(bytes), v = new DataView(ab);
  const w = (pos, t) => { for (let j = 0; j < t.length; j++) v.setUint8(pos + j, t.charCodeAt(j)); };
  w(0, 'RIFF'); v.setUint32(4, bytes - 8, true); w(8, 'WAVE');
  w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, K.rate, true); v.setUint32(28, K.rate * 2, true);
  v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  w(36, 'data'); v.setUint32(40, n * 2, true);
  let spitze = 0, quad = 0;
  for (let i = 0; i < n; i++) {
    const x = alle[i]; const a = x < 0 ? -x : x;
    if (a > spitze) spitze = a; quad += x * x;
    let y = Math.max(-1, Math.min(1, x));
    v.setInt16(44 + i * 2, y < 0 ? y * 0x8000 : y * 0x7FFF, true);
  }
  const roh = new Uint8Array(ab); let bin = '';
  for (let i = 0; i < roh.length; i += 0x8000) bin += String.fromCharCode.apply(null, roh.subarray(i, i + 0x8000));

  return {
    wav: btoa(bin),
    abtastwerte: n, rate: K.rate,
    sekundenGemessen: n / K.rate,
    spitze: spitze, rms: Math.sqrt(quad / Math.max(1, n)),
    zustand: K.ctx.state,
    /* auf die SEKUNDE DER AUFNAHME umgerechnet, nicht auf die Seitenzeit */
    mitschnitt: B.ton.mitschnitt().map(m => ({
      t: Number((m.t - K.perf0).toFixed(2)), name: m.name, opt: m.opt, epoche: m.epoche
    })),
    geraten: B.ton.geraten(),
    zeit: JSON.parse(JSON.stringify(B.welt.zeit)),
    lage: B.lage ? B.lage.length : -1,
    lageTexte: B.lage ? B.lage.slice(0, 6) : []
  };
});

fs.mkdirSync(path.dirname(ZIEL), { recursive: true });
fs.writeFileSync(ZIEL, Buffer.from(ergebnis.wav, 'base64'));
delete ergebnis.wav;
fs.writeFileSync(ZIEL.replace(/\.wav$/, '.json'), JSON.stringify({
  epoche: EP, art: ART, saat: SAAT, hafen: HAFEN, dauer: DAUER,
  start, standVorAufnahme: standVor, vorlaufKlicks: vorlauf.length,
  klicks, pegelReihe, fehler, ...ergebnis
}, null, 1));

console.log(JSON.stringify({
  ziel: ZIEL, epoche: EP, art: ART,
  sek: ergebnis.sekundenGemessen.toFixed(2), rate: ergebnis.rate,
  zustand: ergebnis.zustand, rms: ergebnis.rms.toFixed(5), spitze: ergebnis.spitze.toFixed(4),
  ereignisse: ergebnis.mitschnitt.length, klicks: klicks.filter(k => k.zug).length,
  jahr: ergebnis.zeit.jahr, woche: ergebnis.zeit.woche, lage: ergebnis.lage, fehler: fehler.length
}));
await b.close();
