/* DIE BLICKPROBE — das Spiel wird durchfotografiert, damit Augen es pruefen.
 *
 *   HAFEN=8958 node werkbank/schuss/aufsicht/blickprobe.mjs <epoche> <zielordner>
 *   HAFEN=8958 node werkbank/schuss/aufsicht/blickprobe.mjs start <zielordner>
 *
 * Angesetzt am 18. August 2026 auf Frage des Auftraggebers: schwer lesbare
 * Texte, Verstecktes hinter Rollbalken, schwerer Einstieg, Ueberlappungen,
 * schlechte Animationen. Die Messgeraete (sicht.mjs, lesbarkeit.mjs) zaehlen
 * Pixel und Kontraste — was haesslich, verwirrend oder versteckt IST, sieht
 * nur ein Blick. Also: EIN agentenloser Durchlauf nimmt auf, DANACH schauen
 * Pruefer die Bilder an. Aufnahme und Urteil sind getrennt, wie immer hier.
 *
 * Aufgenommen wird bei 1366x768 — dem Bildschirm, den die Leute wirklich
 * haben (MESSLATTE.md, Latte 4). Jede Adresse traegt &neu=1&stumm=1.
 *
 * Je Epoche entstehen:
 *   00-anfang.png                der erste Schirm, nichts geklickt
 *   10-reiter-<name>.png         jedes Stadtbrett einmal aufgeklappt
 *   20-tafel.png                 die Michaelitafel geoeffnet
 *   30-mitte.png                 nach 12 gespielten Wochen (Sprung)
 *   40-jahreswechsel.png         Woche 1 des naechsten Braujahrs
 *   50-weiter-0/1/2.png          Klick auf WEITER: sofort / 250 ms / 700 ms
 *   audit.json                   Rollbalken-Audit + Animations-Inventar
 *
 * Fuer 'start' entstehen: startseite, intro-1..4, anleitung-oben/-unten.
 *
 * Der Sprung (B.uhr.springeWochen) ist hier erlaubt: die Blickprobe misst
 * keine Partie, sie stellt Zustaende her. Fuer rho-Zahlen waere er verboten.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const WAS = process.argv[2] || '1';
const ZIEL = process.argv[3] || `werkbank/schuss/aufsicht/blick/${WAS}`;
const HAFEN = process.env.HAFEN || '8958';
const B = 1366, H = 768;

fs.mkdirSync(ZIEL, { recursive: true });
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: B, height: H } });
const fehler = [];
seite.on('pageerror', e => fehler.push(String(e).slice(0, 160)));

async function foto(name) {
  await seite.screenshot({ path: `${ZIEL}/${name}.png` });
  console.log('  ' + name);
}
const ruhe = ms => seite.waitForTimeout(ms);

if (WAS === 'start') {
  /* ---- Startseite, Intro, Anleitung ---- */
  await seite.goto(`http://127.0.0.1:${HAFEN}/start/index.html`, { waitUntil: 'networkidle' });
  await ruhe(700); await foto('startseite');
  await seite.goto(`http://127.0.0.1:${HAFEN}/start/intro/index.html`, { waitUntil: 'networkidle' });
  await ruhe(700); await foto('intro-1');
  for (let i = 2; i <= 4; i++) {
    /* Der Weiter-Knopf des Intros — erster sichtbarer button, der nicht Ton ist. */
    const kn = await seite.$$('button');
    let geklickt = false;
    for (const k of kn) {
      const t = ((await k.textContent()) || '').toLowerCase();
      if (/weiter|nächst|naechst|>/.test(t)) { await k.click(); geklickt = true; break; }
    }
    if (!geklickt && kn.length) await kn[kn.length - 1].click();
    await ruhe(600); await foto('intro-' + i);
  }
  await seite.goto(`http://127.0.0.1:${HAFEN}/start/anleitung.html`, { waitUntil: 'networkidle' });
  await ruhe(500); await foto('anleitung-oben');
  await seite.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await ruhe(300); await foto('anleitung-mitte');
  await seite.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await ruhe(300); await foto('anleitung-unten');
  fs.writeFileSync(`${ZIEL}/audit.json`, JSON.stringify({ fehler }, null, 1));
  await browser.close();
  process.exit(0);
}

/* ---- eine Spielepoche ---- */
const ep = +WAS;
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350&neu=1&stumm=1`,
                 { waitUntil: 'networkidle' });
await ruhe(1600);
await foto('00-anfang');

/* Jedes Stadtbrett einmal aufklappen und ansehen. */
const reiter = await seite.evaluate(() =>
  [...document.querySelectorAll('[data-zug]')]
    .map(e => e.getAttribute('data-zug'))
    .filter(z => z && z.startsWith('stadt:reiter:')));
for (const z of reiter) {
  const el = await seite.$(`[data-zug="${z}"]`);
  if (!el) continue;
  try { await el.click({ timeout: 2000 }); } catch (e) { continue; }
  await ruhe(500);
  await foto('10-reiter-' + z.split(':').pop().replace(/[^a-z0-9-]/gi, '_'));
}

/* Die Michaelitafel. */
const tafel = await seite.$('[data-zug="preis:tafel"]');
if (tafel) { try { await tafel.click({ timeout: 2000 }); await ruhe(600); await foto('20-tafel'); } catch (e) {} }

/* Zwoelf Wochen hinein, dann der Jahreswechsel. */
await seite.evaluate(() => BRAUHAUS.uhr.springeWochen(12));
await ruhe(900); await foto('30-mitte');
await seite.evaluate(() => BRAUHAUS.uhr.springeWochen(18));
await ruhe(900); await foto('40-jahreswechsel');

/* WEITER-Klick als Dreierserie — der einzige Blick auf Bewegung. */
const weiter = await seite.$('[data-zug="weiter"]');
if (weiter) {
  try {
    await weiter.click({ timeout: 2000 });
    await foto('50-weiter-0'); await ruhe(250);
    await foto('50-weiter-1'); await ruhe(450);
    await foto('50-weiter-2');
  } catch (e) {}
}

/* ---- Das Audit: was rollt, was liegt unter der Kante, was bewegt sich ---- */
const audit = await seite.evaluate(() => {
  const rollt = [];
  for (const el of document.querySelectorAll('*')) {
    const c = getComputedStyle(el);
    const kannY = /(auto|scroll)/.test(c.overflowY);
    if (!kannY || el.scrollHeight <= el.clientHeight + 8) continue;
    if (el.clientHeight < 40 || el.clientWidth < 40) continue;
    const versteckt = el.scrollHeight - el.clientHeight;
    const r = el.getBoundingClientRect();
    let zuegeUnterKante = 0;
    for (const k of el.querySelectorAll('[data-zug]')) {
      const kr = k.getBoundingClientRect();
      if (kr.top >= r.bottom - 2 || kr.bottom <= r.top + 2) zuegeUnterKante++;
    }
    rollt.push({
      wer: (el.className && String(el.className).split(/\s+/)[0]) || el.tagName,
      hoehe: el.clientHeight, inhalt: el.scrollHeight,
      verstecktPx: versteckt,
      verstecktAnteil: +(versteckt / el.scrollHeight).toFixed(2),
      zuegeUnterKante
    });
  }
  rollt.sort((a, b) => b.verstecktPx - a.verstecktPx);
  const zuege = [...document.querySelectorAll('[data-zug]')];
  const ausserhalb = zuege.filter(k => {
    const r = k.getBoundingClientRect();
    return r.width > 0 && (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth);
  }).length;
  return {
    seiteScrollt: document.documentElement.scrollHeight > innerHeight + 4,
    rollende_kaesten: rollt.slice(0, 20),
    zuege_gesamt: zuege.length,
    zuege_ausserhalb_des_fensters: ausserhalb,
    laufende_animationen: document.getAnimations ? document.getAnimations().length : null
  };
});
audit.fehler = fehler;
fs.writeFileSync(`${ZIEL}/audit.json`, JSON.stringify(audit, null, 1));
console.log('  audit.json — ' + audit.rollende_kaesten.length + ' rollende Kaesten, '
            + audit.zuege_ausserhalb_des_fensters + ' Zuege ausserhalb des Fensters');
await browser.close();
