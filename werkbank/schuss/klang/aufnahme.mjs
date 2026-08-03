// ===========================================================================
// werkbank/schuss/klang/aufnahme.mjs — Latte 3, Welle 4.
//
// Dreissig Sekunden Spielton je Epoche, und zwar DER VORGANG, nach dem die
// Latte fragt: die Fuhre wird beladen und faehrt ab, ein Fass wird
// angestochen, Rohstoff gekauft, die Michaelitafel geht auf, der Nachbar
// wird abgeloest. Nicht zufaellig geklickt — ein Wunschzettel, der in jeder
// Epoche dieselben VORGAENGE sucht und dabei nimmt, was die Epoche hat.
//
// Drei Dinge fallen dabei ab, und alle drei stehen im Bericht:
//   1. epocheN.wav   — der Ton selbst (das Spiel rendert seinen Graphen)
//   2. pegel.json    — was am LEBENDEN Ausgang wirklich gemessen wurde
//   3. epocheN.webm  — Mitschnitt vom lebenden Ausgang (MediaRecorder),
//                      als Beleg, dass nicht nur der Offline-Renderer klingt
//
// Wer "es klingt" sagt, ohne 2 und 3 zu zeigen, hat nichts gezeigt.
//
//   node werkbank/schuss/klang/aufnahme.mjs
//   node werkbank/schuss/klang/aufnahme.mjs http://127.0.0.1:8899/spiel/ werkbank/schuss/klang 30
// ===========================================================================

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';

const [
  basis = 'http://127.0.0.1:8899/spiel/',
  ziel = 'werkbank/schuss/klang',
  sekunden = '30',
  nurEpoche = ''
] = process.argv.slice(2);

const SEK = Number(sekunden);
const EPOCHEN = nurEpoche ? [Number(nurEpoche)] : [1, 2, 3, 4];
mkdirSync(ziel, { recursive: true });

// Der Wunschzettel. Jede Zeile ist EIN Vorgang; die Liste dahinter sind die
// Knoepfe, die ihn in irgendeiner Epoche ausloesen — genommen wird der erste,
// den es gerade gibt. `^` heisst Praefix, alles andere ist ein ganzer Schluessel.
const WUNSCH = [
  ['Fass auf den Wagen',   ['^fuhre:laden:']],
  ['noch ein Fass',        ['^fuhre:laden:']],
  ['die Fuhre faehrt ab',  ['fuhre:abschicken']],
  ['ein Fass anstechen',   ['sud:zettel-anstich', '^sud:zettel-hefe', '^sud:anstich', '^sud:zettel-']],
  ['Rohstoff kaufen',      ['fuhre:kauf:rohstoff', '^fuhre:kauf:']],
  ['eine Woche weiter',    ['weiter']],
  ['der Sud wird angestellt', ['^sud:anstellen', '^sud:brauen', '^sud:zettel-wechsel', '^sud:']],
  ['die Michaelitafel',    ['preis:tafel']],
  ['die Tafel wieder zu',  ['preis:tafel-zu', 'preis:tafel']],
  ['dem Nachbarn zuvorkommen', ['^gegner:zuvorkommen:', '^gegner:abloesen:', '^gegner:hinhalten:']],
  ['eine Woche weiter',    ['weiter']],
  ['Fass auf den Wagen',   ['^fuhre:laden:']],
  ['die Fuhre faehrt ab',  ['fuhre:abschicken']],
  ['eine Woche weiter',    ['weiter']]
];

const browser = await chromium.launch({
  args: ['--autoplay-policy=no-user-gesture-required']
});

const bericht = {};

for (const epoche of EPOCHEN) {
  const seite = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push('pageerror: ' + e));
  seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });

  await seite.goto(`${basis}?epoche=${epoche}&saat=1350`,
                   { waitUntil: 'domcontentloaded', timeout: 60000 });
  await seite.waitForSelector('#buehne[data-bereit="1"]', { timeout: 30000 });
  await seite.waitForTimeout(700);

  // Der Browser gibt Ton erst nach einer Handlung frei — also eine echte.
  await seite.mouse.click(688, 745);
  await seite.waitForTimeout(1200);

  const wach = await seite.evaluate(() => ({
    zustand: BRAUHAUS.ton.pegel().zustand, bereit: BRAUHAUS.ton.bereit()
  }));

  // Mitschnitt am LEBENDEN Ausgang.
  const nimmt = await seite.evaluate(() => {
    const aus = BRAUHAUS.ton.ausgang();
    if (!aus || typeof MediaRecorder === 'undefined') return false;
    try {
      const zielK = aus.context.createMediaStreamDestination();
      aus.connect(zielK);
      const rec = new MediaRecorder(zielK.stream,
        { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 64000 });
      window.__stuecke = [];
      rec.ondataavailable = (e) => { if (e.data && e.data.size) window.__stuecke.push(e.data); };
      window.__fertig = new Promise((r) => { rec.onstop = r; });
      window.__rec = rec;
      rec.start(1000);
      return true;
    } catch (f) { return String(f).slice(0, 120); }
  });

  await seite.evaluate(() => BRAUHAUS.ton.beginneMitschnitt());

  // ---- spielen, in echten Sekunden ------------------------------------
  const anfang = Date.now();
  const getan = [];
  const pegel = [];
  let i = 0;

  const messer = setInterval(async () => {
    try { pegel.push(await seite.evaluate(() => BRAUHAUS.ton.pegel())); } catch (f) { /* Seite zu */ }
  }, 250);

  while ((Date.now() - anfang) / 1000 < SEK - 2.5) {
    const wunsch = WUNSCH[i % WUNSCH.length];
    const traf = await seite.evaluate(({ kandidaten }) => {
      for (const k of kandidaten) {
        let el = null;
        if (k[0] === '^') {
          el = [...document.querySelectorAll('button[data-zug]:not([disabled])')]
            .find((b) => b.getAttribute('data-zug').startsWith(k.slice(1))
                      && b.getBoundingClientRect().width > 0);
        } else {
          el = document.querySelector(`button[data-zug="${k}"]:not([disabled])`);
          if (el && !el.getBoundingClientRect().width) el = null;
        }
        if (el) { el.click(); return el.getAttribute('data-zug'); }
      }
      return null;
    }, { kandidaten: wunsch[1] });

    getan.push((traf || '—') + '  (' + wunsch[0] + ')');
    i += 1;
    await seite.waitForTimeout(2000);
  }

  await seite.waitForTimeout(1200);
  clearInterval(messer);

  // ---- der lebende Mitschnitt ------------------------------------------
  let webm = null;
  if (nimmt === true) {
    webm = await seite.evaluate(async () => {
      window.__rec.stop();
      await window.__fertig;
      const b = new Blob(window.__stuecke, { type: 'audio/webm' });
      const puffer = new Uint8Array(await b.arrayBuffer());
      let s = '';
      for (let k = 0; k < puffer.length; k += 0x8000) {
        s += String.fromCharCode.apply(null, puffer.subarray(k, k + 0x8000));
      }
      return btoa(s);
    });
  }

  // ---- das Spiel rendert seinen eigenen Ton -----------------------------
  const b64 = await seite.evaluate((s) => BRAUHAUS.ton.wav(s, { rate: 32000, kanaele: 1 }), SEK);
  const plan = await seite.evaluate((s) => BRAUHAUS.ton.plan(s), SEK);
  const geraten = await seite.evaluate(() => BRAUHAUS.ton.geraten());
  const lage = await seite.evaluate(() => BRAUHAUS.lage.length);

  const wav = Buffer.from(b64, 'base64');
  writeFileSync(`${ziel}/epoche${epoche}.wav`, wav);
  if (webm) writeFileSync(`${ziel}/epoche${epoche}.webm`, Buffer.from(webm, 'base64'));

  const rmsWerte = pegel.map((p) => p.rms);
  const hoechste = pegel.length ? Math.max(...pegel.map((p) => p.hoechste)) : 0;
  const lauteste = pegel.length ? Math.max(...pegel.map((p) => p.lauteste || 0)) : 0;
  const ueberNull = rmsWerte.filter((r) => r > 0.001).length;

  bericht['epoche' + epoche] = {
    zustand: wach.zustand, bereit: wach.bereit,
    messungen: pegel.length, rmsUeberNull: ueberNull,
    rmsMittel: +(rmsWerte.reduce((a, b) => a + b, 0) / (rmsWerte.length || 1)).toFixed(5),
    rmsGroesster: +Math.max(0, ...rmsWerte).toFixed(5),
    spitzeHoechste: +hoechste.toFixed(4), rmsLauteste: +lauteste.toFixed(5),
    wavBytes: wav.length, webmBytes: webm ? Buffer.from(webm, 'base64').length : 0,
    lage: lage, fehler: fehler,
    geklickt: getan, erklungen: plan.map((p) => p.name), geraten: geraten
  };

  console.log(`\n── Epoche ${epoche}`);
  console.log(`   Kontext: ${wach.zustand}   bereit=${wach.bereit}   Mitschnitt=${nimmt}`);
  console.log(`   PEGEL am lebenden Ausgang: ${ueberNull}/${pegel.length} Messungen über null · ` +
              `RMS Mittel ${bericht['epoche' + epoche].rmsMittel} · ` +
              `RMS größter ${bericht['epoche' + epoche].rmsGroesster} · ` +
              `Spitze ${bericht['epoche' + epoche].spitzeHoechste}`);
  console.log(`   geklickt: ${getan.join(' · ')}`);
  console.log(`   erklungen (${plan.length}): ${plan.map((p) => p.name).join(' · ') || '(nichts)'}`);
  const g = Object.keys(geraten);
  console.log(`   geraten: ${g.length ? g.join(' · ') : '(kein Ruf im Notfallkasten)'}`);
  console.log(`   ${wav.length / 1024 | 0} KB wav` + (webm ? ` · ${Buffer.from(webm, 'base64').length / 1024 | 0} KB webm` : ' · kein webm'));
  console.log(`   lage=${lage}  ${fehler.length ? 'FEHLER:\n     ' + fehler.slice(0, 5).join('\n     ') : 'keine Fehler auf der Seite'}`);

  await seite.close();
}

writeFileSync(`${ziel}/pegel.json`, JSON.stringify(bericht, null, 1));
await browser.close();
