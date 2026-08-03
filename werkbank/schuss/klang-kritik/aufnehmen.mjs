/* Eigener Pruefstand fuer Latte 3. Nimmt LIVE am Ausgangsknoten des laufenden
   Spiels ab (B.ton.ausgang(), = Kompressor vor ctx.destination), nicht am
   Offline-Renderer. Spielt waehrenddessen mit echten Mausklicks. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const EP = Number(process.argv[2] || 1);
const ZIEL = process.argv[3];
const SEK = 30;
mkdirSync(ZIEL, { recursive: true });

const PLAN = {
  1: { sud: ['sud:wuerze:grut', 'sud:wuerze:sack'], zusatz: ['name:jetzt:umtrunk'] },
  2: { sud: ['sud:schuettung:weizen', 'sud:gaerung:keller'], zusatz: ['name:jetzt:zunftzeichen'] },
  3: { sud: ['sud:kaelte:maschine', 'sud:hefe:reinzucht'], zusatz: [] },
  4: { sud: ['sud:behandlung:filter', 'sud:fuehrung:rechner'], zusatz: [] }
};

const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required', '--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1500, height: 1500 } });
const konsole = [];
p.on('console', m => { if (m.type() === 'error') konsole.push('CONSOLE ' + m.text().slice(0, 200)); });
p.on('pageerror', e => konsole.push('PAGEERROR ' + e.message.slice(0, 200)));

await p.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await p.waitForFunction(() => window.BRAUHAUS && window.BRAUHAUS.ton && window.BRAUHAUS.ton.bereit(), null, { timeout: 20000 });
await p.waitForTimeout(600);

const protokoll = [];
let T0 = 0;
async function klick(zug, warte = 260) {
  const el = p.locator(`[data-zug="${zug}"]`).first();
  const t = T0 ? (Date.now() - T0) / 1000 : -1;
  if (!(await el.count())) { protokoll.push({ t, zug, stand: 'nicht-da' }); return false; }
  try {
    await el.scrollIntoViewIfNeeded({ timeout: 1200 });
    await el.click({ timeout: 1800 });
  } catch (e) {
    protokoll.push({ t, zug, stand: 'unklickbar' });
    return false;
  }
  await p.waitForTimeout(warte);
  const nach = await p.evaluate(() => ({
    w: BRAUHAUS.welt.zeit.woche, j: BRAUHAUS.welt.zeit.jahr,
    n: BRAUHAUS.ton.protokoll.length
  }));
  protokoll.push({ t, zug, stand: 'geklickt', w: nach.w, j: nach.j });
  return true;
}

/* --- Vorlauf: Ton wecken, bis kurz vor den Jahreswechsel spielen --- */
await klick('klang:ton', 120);            // aus
await klick('klang:ton', 400);            // wieder an  -> echte Nutzergeste
const vorPegel = await p.evaluate(() => BRAUHAUS.ton.pegel());

for (let i = 0; i < 40; i++) {
  const z = await p.evaluate(() => BRAUHAUS.welt.zeit.woche);
  if (z >= 29) break;
  await klick('weiter', 130);
}
const standVorlauf = await p.evaluate(() => ({ w: BRAUHAUS.welt.zeit.woche, j: BRAUHAUS.welt.zeit.jahr }));

/* --- Abgriff am lebenden Ausgang --- */
const abgriff = await p.evaluate(() => {
  const B = window.BRAUHAUS;
  const aus = B.ton.ausgang();
  if (!aus) return { fehler: 'kein Ausgangsknoten' };
  const ctx = aus.context;
  const w = window.__pruef = { rate: ctx.sampleRate, bloecke: [], pegel: [], t0: performance.now() };
  const proc = ctx.createScriptProcessor(4096, 1, 1);
  const still = ctx.createGain(); still.gain.value = 0;
  proc.onaudioprocess = function (e) {
    w.bloecke.push(new Float32Array(e.inputBuffer.getChannelData(0)));
  };
  aus.connect(proc); proc.connect(still); still.connect(ctx.destination);
  w.uhr = setInterval(function () {
    const g = B.ton.pegel();
    w.pegel.push({ t: (performance.now() - w.t0) / 1000, rms: g.rms, spitze: g.spitze, zustand: g.zustand });
  }, 100);
  B.ton.beginneMitschnitt();
  return { rate: ctx.sampleRate, zustand: ctx.state, kanaele: aus.channelCount };
});

T0 = Date.now();
const schritt = async (bisSek, zuege) => {
  for (const z of zuege) await klick(z);
  const rest = bisSek * 1000 - (Date.now() - T0);
  if (rest > 0) await p.waitForTimeout(rest);
};

await schritt(2.0, []);
await schritt(7.0, ['stadt:reiter:fuhre-fu-brett-fu-haeuser', 'fuhre:laden:lindenhof', 'fuhre:laden:torschenke']);
await schritt(11.0, ['stadt:reiter:fuhre-fu-brett-fu-wagen', 'fuhre:fuellen', 'fuhre:abschicken']);
await schritt(17.0, ['stadt:reiter:sud-sud-brett', ...PLAN[EP].sud, 'sud:anstich-jung', 'sud:gaerraum']);
await schritt(21.0, ['weiter', 'weiter']);          // Jahreswechsel -> Michaeli
await schritt(26.0, ['gegner:beschwerde', ...(await p.evaluate(() => {
  const l = [...document.querySelectorAll('[data-zug^="gegner:abloesen:"],[data-zug^="gegner:zuvorkommen:"]')];
  return l.slice(0, 2).map(e => e.dataset.zug);
}))]);
await schritt(29.0, ['weiter']);
await schritt(SEK + 0.5, []);

/* --- Abgriff schliessen, WAV bauen --- */
const ergebnis = await p.evaluate((sek) => {
  const w = window.__pruef;
  clearInterval(w.uhr);
  const rate = w.rate;
  const n = Math.min(w.bloecke.length * 4096, Math.round(rate * sek));
  const pcm = new Float32Array(n);
  let o = 0;
  for (const b of w.bloecke) { if (o >= n) break; pcm.set(b.subarray(0, Math.min(b.length, n - o)), o); o += b.length; }
  /* Int16 + WAV-Kopf */
  const kopf = 44, buf = new ArrayBuffer(kopf + n * 2), dv = new DataView(buf);
  const s = (p, t) => { for (let i = 0; i < t.length; i++) dv.setUint8(p + i, t.charCodeAt(i)); };
  s(0, 'RIFF'); dv.setUint32(4, 36 + n * 2, true); s(8, 'WAVE'); s(12, 'fmt ');
  dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
  dv.setUint32(24, rate, true); dv.setUint32(28, rate * 2, true);
  dv.setUint16(32, 2, true); dv.setUint16(34, 16, true); s(36, 'data'); dv.setUint32(40, n * 2, true);
  let spitze = 0, quad = 0;
  for (let i = 0; i < n; i++) {
    const v = Math.max(-1, Math.min(1, pcm[i]));
    quad += v * v; if (Math.abs(v) > spitze) spitze = Math.abs(v);
    dv.setInt16(kopf + i * 2, v < 0 ? v * 0x8000 : v * 0x7fff, true);
  }
  /* Fenster-RMS, 250 ms */
  const f = Math.round(rate * 0.25), fenster = [];
  for (let i = 0; i + f <= n; i += f) {
    let q = 0; for (let k = i; k < i + f; k++) q += pcm[k] * pcm[k];
    fenster.push(+(Math.sqrt(q / f)).toFixed(5));
  }
  const bin = new Uint8Array(buf);
  let roh = ''; const stueck = 32768;
  for (let i = 0; i < bin.length; i += stueck) roh += String.fromCharCode.apply(null, bin.subarray(i, i + stueck));
  return {
    wav: btoa(roh), rate, samples: n, sekunden: +(n / rate).toFixed(2),
    spitze: +spitze.toFixed(4), rms: +Math.sqrt(quad / n).toFixed(5), fenster,
    pegelSpur: window.__pruef.pegel,
    mitschnitt: BRAUHAUS.ton.mitschnitt().map(m => ({ t: +m.t.toFixed(2), name: m.name, e: m.epoche })),
    tonProtokoll: BRAUHAUS.ton.protokoll.map(x => x.name),
    geraten: BRAUHAUS.ton.geraten(),
    lage: BRAUHAUS.lage.length, lageInhalt: BRAUHAUS.lage.slice(0, 6),
    zeit: { j: BRAUHAUS.welt.zeit.jahr, w: BRAUHAUS.welt.zeit.woche, e: BRAUHAUS.welt.zeit.epoche },
    endPegel: BRAUHAUS.ton.pegel()
  };
}, SEK);

writeFileSync(`${ZIEL}/epoche${EP}.wav`, Buffer.from(ergebnis.wav, 'base64'));
delete ergebnis.wav;
writeFileSync(`${ZIEL}/epoche${EP}-messung.json`, JSON.stringify({
  epoche: EP, abgriff, vorPegel, standVorlauf, konsole, klickprotokoll: protokoll, ...ergebnis
}, null, 1));
console.log(JSON.stringify({
  epoche: EP, rate: ergebnis.rate, sekunden: ergebnis.sekunden, rms: ergebnis.rms, spitze: ergebnis.spitze,
  stille: ergebnis.fenster.filter(x => x < 0.001).length + '/' + ergebnis.fenster.length,
  lage: ergebnis.lage, konsole: konsole.length, zeit: ergebnis.zeit,
  geklickt: protokoll.filter(x => x.stand === 'geklickt').length,
  daneben: protokoll.filter(x => x.stand !== 'geklickt').map(x => x.zug)
}));
await b.close();
