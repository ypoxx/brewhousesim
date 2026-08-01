// ===========================================================================
// werkbank/ohrprobe.mjs — Latte 3, ausfuehrbar: dreissig Sekunden Spielton
// je Epoche als Datei, aus dem LAUFENDEN Spiel.
//
// Es gibt in dieser Umgebung KEIN ffmpeg und kein Mikrofon. Deshalb nimmt
// dieses Skript nichts auf: es SPIELT das Spiel — es klickt echte Knoepfe,
// dieselben, die ein Mensch klickt — und laesst danach das Spiel seinen
// eigenen Tongraphen mit OfflineAudioContext rendern und als WAV
// herausreichen (BRAUHAUS.ton.wav). Geprueft wird damit wirklich das Spiel
// und nicht die Dateiablage des Bauers.
//
//   npx --yes http-server -p 8899 -s . >/dev/null 2>&1 &
//   node werkbank/ohrprobe.mjs
//   node werkbank/ohrprobe.mjs http://127.0.0.1:8899/spiel/ werkbank/ohr 30
//   node werkbank/ohrprobe.mjs http://127.0.0.1:8899/spiel/ werkbank/ohr 30 3
//                                                                      ^ nur Epoche 3
//
// Danach das fremde Ohr:
//   ./werkbank/hoerer.py werkbank/ohr/epoche3.wav --erwartet 3
//   ./werkbank/hoerer.py werkbank/ohr/epoche*.wav --blind
// ===========================================================================

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';

const [
  basis = 'http://127.0.0.1:8899/spiel/',
  ziel = 'werkbank/ohr',
  sekunden = '30',
  nurEpoche = ''
] = process.argv.slice(2);

const SEK = Number(sekunden);
const EPOCHEN = nurEpoche ? [Number(nurEpoche)] : [1, 2, 3, 4];

mkdirSync(ziel, { recursive: true });

const browser = await chromium.launch({
  args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio']
});

for (const epoche of EPOCHEN) {
  const seite = await browser.newPage({ viewport: { width: 1376, height: 768 } });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push('pageerror: ' + e));
  seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });

  const url = `${basis}?epoche=${epoche}&saat=1350`;
  await seite.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await seite.waitForSelector('#buehne[data-bereit="1"]', { timeout: 30000 });
  await seite.waitForTimeout(800);

  // Der Mitschnitt faengt hier bei null an. Alles, was danach klingt, hat
  // dieses Skript durch einen echten Klick ausgeloest.
  await seite.evaluate(() => BRAUHAUS.ton.beginneMitschnitt());

  // ---- das Spiel bedienen, in Echtzeit --------------------------------
  // Ein Mensch klickt nicht dreissigmal in der Sekunde. Die Abstaende sind
  // absichtlich echte Sekunden: der Mitschnitt haelt fest, WANN etwas
  // geschah, und daraus wird spaeter die Zeitachse der WAV-Datei.
  const anfang = Date.now();
  let n = 0;
  const gedrueckt = [];

  while ((Date.now() - anfang) / 1000 < SEK - 3) {
    const zuege = await seite.evaluate(() => {
      const l = [];
      document.querySelectorAll('button[data-zug]').forEach((el) => {
        if (el.disabled) return;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        l.push(el.getAttribute('data-zug'));
      });
      return l;
    });

    // Abwechselnd WEITER (die Uhr) und ein anderer Zug (der Hof arbeitet).
    let zug = 'weiter';
    if (n % 2 === 1) {
      const andere = zuege.filter((z) =>
        z !== 'weiter' && !z.startsWith('kern:') && !z.startsWith('klang:'));
      if (andere.length) zug = andere[(n * 7) % andere.length];
    }

    const treffer = await seite.evaluate((z) => {
      const el = document.querySelector(`button[data-zug="${z}"]:not([disabled])`);
      if (!el) return false;
      el.click();                      // echter Klick auf einen echten Knopf
      return true;
    }, zug);
    if (treffer) gedrueckt.push(zug);

    n += 1;
    await seite.waitForTimeout(2200);
  }

  await seite.waitForTimeout(1500);

  // ---- das Spiel rendert seinen eigenen Ton ----------------------------
  const b64 = await seite.evaluate(
    (s) => BRAUHAUS.ton.wav(s, { rate: 32000, kanaele: 1 }),
    SEK
  );
  const plan = await seite.evaluate((s) => BRAUHAUS.ton.plan(s), SEK);

  const datei = `${ziel}/epoche${epoche}.wav`;
  writeFileSync(datei, Buffer.from(b64, 'base64'));

  console.log(`${datei}  ${(Buffer.from(b64, 'base64').length / 1024) | 0} KB`);
  console.log(`   geklickt: ${gedrueckt.join(' · ') || '(nichts)'}`);
  console.log(`   erklungen: ${plan.map((p) => p.name).join(' · ') || '(nichts)'}`);
  console.log(`   ${fehler.length ? 'FEHLER AUF DER SEITE:\n' + fehler.join('\n') : 'keine Fehler auf der Seite'}`);

  await seite.close();
}

await browser.close();
