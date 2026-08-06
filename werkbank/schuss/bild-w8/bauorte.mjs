/* BAUORTE + CHROM — zwei Messungen, ein Browser, alle vier Epochen.

     HAFEN=8906 node werkbank/schuss/bild-w8/bauorte.mjs

   1) CHROM. Die Trennung „Buehne / was darueber liegt" laeuft NICHT entlang der
      Ebenen. `marken` traegt den Hof des Gegners (gemalte Welt) UND seine
      Karten (Bedienoberflaeche); `hand` traegt Fuhrwerke UND die Bretter der
      Fuhre. Wer alle vier oberen Ebenen ausblendet, loescht deshalb auch
      Gemaltes mit.

      Darum drei Aufnahmen je Epoche im gewoehnlichen Ladezustand:
        a-voll     alles
        b-sprite   nur die KAESTEN weg (Elemente mit deckendem Grund in den
                   oberen Ebenen); freigestellte Bilder ohne Grundfarbe bleiben
        c-nackt    nur platte + bau
      a↔b misst die reine Bedienoberflaeche, a↔c alles ueber der Grundplatte.

   2) BAUORTE. Mit ?bau=alle: welcher Aufbau liegt wo auf dem Schirm, damit ein
      Befund den Namen des Bauteils traegt und nicht nur seine Bildpunkte.    */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
const HAFEN = process.env.HAFEN || '8906';
const AUS = 'werkbank/schuss/bild-w8/bilder';
mkdirSync(AUS, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 2752, height: 1536 }, deviceScaleFactor: 1 });

const OBEN = ['marken', 'hand', 'kopf', 'blatt'];
const setze = (art) => p.evaluate((art) => {
  const undurch = (c) => {
    const m = /rgba?\(([^)]+)\)/.exec(c); if (!m) return false;
    const t = m[1].split(',').map(s => parseFloat(s));
    return t.length < 4 || t[3] > 0.15;
  };
  ['marken', 'hand', 'kopf', 'blatt'].forEach(n => {
    const w = document.querySelector('#ebene-' + n); if (!w) return;
    w.style.visibility = '';
    w.querySelectorAll('*').forEach(el => { el.style.visibility = ''; });
    if (art === 'voll') return;
    if (art === 'nackt') { w.style.visibility = 'hidden'; return; }
    /* sprite: jedes Element mit deckendem Grund ODER Rahmen verschwindet;
       ein freigestelltes Bild (background-image, Grund durchsichtig) bleibt. */
    w.querySelectorAll('*').forEach(el => {
      const cs = getComputedStyle(el);
      const hatBild = cs.backgroundImage && cs.backgroundImage !== 'none';
      if ((undurch(cs.backgroundColor) && !hatBild) ||
          (cs.borderTopWidth !== '0px' && undurch(cs.borderTopColor)))
        el.style.visibility = 'hidden';
    });
  });
}, art);

for (const E of [1, 2, 3, 4]) {
  await p.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${E}&saat=1350`,
               { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(1800);
  for (const art of ['voll', 'sprite', 'nackt']) {
    await setze(art); await p.waitForTimeout(350);
    await p.screenshot({ path: `${AUS}/e${E}-4${'vsn'.indexOf(art[0])}-${art}.png` });
  }
  console.log(`EPOCHE ${E}: drei Chrom-Aufnahmen`);
}

for (const E of [1, 2, 3, 4]) {
  await p.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${E}&saat=1350&bau=alle`,
               { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(2000);
  const liste = await p.evaluate(() => {
    const aus = [];
    document.querySelectorAll('#ebene-bau *, #ebene-marken *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width < 6 || r.height < 6) return;
      const bg = getComputedStyle(el).backgroundImage || '';
      const m = bg.match(/(hof|gegner)\/([a-z_0-9]+)\.(webp|png)/i);
      const txt = (el.children.length === 0 ? (el.textContent || '').trim() : '').slice(0, 30);
      if (!m && !txt) return;
      aus.push({ was: m ? m[1] + '/' + m[2] : 'TEXT «' + txt + '»',
                 e: el.closest('.ebene')?.dataset.ebene || '?',
                 x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) });
    });
    return aus;
  });
  console.log(`\n===== EPOCHE ${E} · ${liste.length} Stuecke (bau + marken) =====`);
  liste.sort((a, c) => a.y - c.y);
  for (const s of liste)
    console.log(`  [${s.e}] ${String(s.was).padEnd(26)} x${String(s.x).padStart(4)}..${String(s.x + s.w).padStart(4)} y${String(s.y).padStart(4)}..${String(s.y + s.h).padStart(4)}  (${s.w}×${s.h})`);
}
await b.close();
