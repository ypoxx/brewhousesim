/* WELLE 8 · BILDVERGLEICH — vier Aufnahmen je Epoche, in EINER Sitzung.
   Ein Browser je Aufruf, ein Aufruf je Epoche, alles durchs Messfenster.

     HAFEN=8906 node werkbank/schuss/bild-w8/aufnehmen.mjs <epoche> [wochen]

   Was entsteht (in werkbank/schuss/bild-w8/bilder/):
     e<E>-00-roh.png         gleich nach dem Laden, alles sichtbar
     e<E>-01-roh-nackt.png   dasselbe, obere Ebenen (marken/hand/kopf/blatt) aus
     e<E>-10-gespielt.png    nach <wochen> Wochen mit Kaeufen, alles sichtbar
     e<E>-11-gespielt-nackt.png   dasselbe nackt

   Warum nackt: die Bildlatte fragt nach dem gemalten Bild. Was die
   Bedienoberflaeche zudeckt, gehoert getrennt gemessen — und zwar in
   BILDPUNKTEN (siehe deckung.mjs daneben), nicht in Kaesten.

   Alle Klicks sind echte Mausklicks auf echte Knopfflaechen. Das Protokoll
   wird vollstaendig ausgegeben, damit die Partie nachstellbar ist.           */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8906';
const EP = process.argv[2] || '1';
const WOCHEN = +(process.argv[3] || 30);
const AUS = 'werkbank/schuss/bild-w8/bilder';
mkdirSync(AUS, { recursive: true });

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 2752, height: 1536 }, deviceScaleFactor: 1 });
const fehler = [];
p.on('pageerror', e => fehler.push('pageerror: ' + e));
p.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
await p.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle', timeout: 60000 });
await p.waitForTimeout(1800);

const log = [];

/* Die oberen vier Ebenen ausblenden — die beiden Bildebenen (platte, bau)
   bleiben stehen. Genau die Trennung, die spiel/LIESMICH.md nennt. */
const nackt = (an) => p.evaluate((an) => {
  ['marken', 'hand', 'kopf', 'blatt'].forEach(n => {
    const w = document.querySelector('#ebene-' + n);
    if (w) w.style.visibility = an ? 'hidden' : '';
  });
}, an);

async function schuss(name) {
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${AUS}/${name}.png` });
  console.log('BILD ' + name);
}

async function klickeMaus(el, was) {
  try {
    const bb = await el.boundingBox();
    if (!bb) return false;
    await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
    await p.mouse.down(); await p.waitForTimeout(40); await p.mouse.up();
    await p.waitForTimeout(200);
    log.push(was);
    return true;
  } catch { return false; }
}

/* Hofbauten kaufen: gezielt ueber data-zug, nicht ueber eine y-Spanne.
   'stadt:bau:seite' ist der Reiter selbst und faellt raus. */
async function bauhof() {
  const r = p.locator('button[data-zug="stadt:bau:seite"]').first();
  if (await r.count()) { try { await r.click({ timeout: 2000 }); } catch {} await p.waitForTimeout(250); }
}
async function kaufen(runde) {
  await bauhof();
  const alle = await p.locator('button[data-zug^="stadt:bau:"]').all();
  let n = 0;
  for (const el of alle) {
    const zug = await el.getAttribute('data-zug').catch(() => '');
    if (!zug || zug === 'stadt:bau:seite') continue;
    const aus = await el.evaluate(e => e.disabled || e.classList.contains('aus') ||
      e.classList.contains('gesperrt') || getComputedStyle(e).pointerEvents === 'none').catch(() => true);
    if (aus) continue;
    const t = ((await el.textContent().catch(() => '')) || '').replace(/\s+/g, ' ').trim();
    if (await klickeMaus(el, `w${runde} KAUF ${zug} «${t}»`)) n++;
  }
  return n;
}
async function weiter() {
  const w = p.locator('button[data-zug="weiter"]').first();
  if (!(await w.count())) return false;
  return await klickeMaus(w, 'WEITER');
}
const stand = () => p.evaluate(() => {
  const W = window.BRAUHAUS;
  if (!W) return {};
  return { jahr: W.welt.zeit.jahr, woche: W.welt.zeit.woche, epoche: W.welt.zeit.epoche,
           kasse: Math.round(W.welt.haus.kasse), lage: (W.lage || []).length,
           bau: document.querySelector('#ebene-bau')?.querySelectorAll('*').length || 0 };
});

console.log('== EPOCHE ' + EP + ' · Saat 1350 · Hafen ' + HAFEN);
console.log('STAND-ROH ' + JSON.stringify(await stand()));

await schuss(`e${EP}-00-roh`);
await nackt(true);  await schuss(`e${EP}-01-roh-nackt`);
await nackt(false);

let gekauft = 0;
gekauft += await kaufen(0);
for (let i = 0; i < WOCHEN; i++) {
  if (!(await weiter())) { log.push('WEITER fehlt bei Woche ' + i); break; }
  await p.waitForTimeout(240);
  if (i % 3 === 2) gekauft += await kaufen(i + 1);
}
gekauft += await kaufen('E');
await p.waitForTimeout(800);

console.log('STAND-GESPIELT ' + JSON.stringify(await stand()));
await schuss(`e${EP}-10-gespielt`);
await nackt(true);  await schuss(`e${EP}-11-gespielt-nackt`);
await nackt(false);

/* Beschriftungen: stehen sie GANZ da? Nicht Ueberlauf zaehlen, sondern
   Kuerzung — auch die sauber gekuerzte ("Gasthof Lin…") laeuft nirgends ueber
   und fehlt trotzdem. */
const schrift = await p.evaluate(() => {
  const roh = [];
  document.querySelectorAll('*').forEach(el => {
    if (el.children.length) return;
    const t = (el.textContent || '').trim();
    if (!t) return;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') return;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    const abgeschnitten = el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1;
    const punkte = cs.textOverflow === 'ellipsis' && abgeschnitten;
    const klemm = cs.webkitLineClamp && cs.webkitLineClamp !== 'none' && el.scrollHeight > el.clientHeight + 1;
    if (abgeschnitten || punkte || klemm)
      roh.push({ t: t.slice(0, 60), k: el.className.toString().slice(0, 40),
                 sw: el.scrollWidth, cw: el.clientWidth, sh: el.scrollHeight, ch: el.clientHeight,
                 ell: !!punkte, klemm: !!klemm });
  });
  return roh;
});
console.log('GEKUERZT ' + schrift.length);
for (const s of schrift.slice(0, 40))
  console.log(`   «${s.t}» .${s.k} ${s.sw}/${s.cw} × ${s.sh}/${s.ch}${s.ell ? ' …' : ''}${s.klemm ? ' klemm' : ''}`);

const kopf = await p.evaluate(() => (document.querySelector('#ebene-kopf')?.innerText || '').replace(/\s+/g, ' ').slice(0, 400));
console.log('KOPF: ' + kopf);
console.log('KAEUFE: ' + gekauft);
console.log('KLICKS: ' + log.length);
console.log('PROTOKOLL:\n' + log.join('\n'));
console.log(fehler.length ? 'FEHLER:\n' + fehler.slice(0, 10).join('\n') : 'keine Fehler auf der Seite');
await b.close();
