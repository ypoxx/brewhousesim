/* BLINDER KRITIKER · DIE FUHRE · Welle 6 — DIE EIGENE HAND.

   Kein Regelwerk, das selbst spielt: eine Liste von Klicks, die ICH nach
   dem Ansehen des jeweiligen Bildes anhaenge. Weil die Saat fest ist, ist
   die Wiederholung von vorn identisch — die Partie waechst also mit jedem
   Aufruf um die Zuege, die ich dazugeschrieben habe.

     node hand.mjs <epoche> <zugliste.txt> <bild.png> <stand.json>

   Die Zugliste: ein data-zug je Zeile. `#` ist Kommentar. `!schirm` macht
   an dieser Stelle eine Zwischenaufnahme.

   Geschrieben wird bei jedem Halt der volle Schirm: alle [data-zug] mit
   Preisschild, Zustand, Trefferprobe — das ist das Klickprotokoll, das die
   Messlatte verlangt.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const EP = +(process.argv[2] || 1);
const LISTE = process.argv[3];
const BILD = process.argv[4] || null;
const STAND = process.argv[5] || null;
const HAFEN = process.env.HAFEN || '8900';

const zuege = fs.existsSync(LISTE)
  ? fs.readFileSync(LISTE, 'utf8').split('\n').map(s => s.trim()).filter(s => s && s[0] !== '#')
  : [];

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push(String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

const ruhe = async () => {
  await seite.waitForTimeout(60);
  try {
    await seite.evaluate(() => new Promise(f => {
      let ab = false; const g = () => { if (!ab) { ab = true; f(1); } };
      setTimeout(g, 1500);
      requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(g, 0)));
    }));
  } catch (x) { }
};

const schirm = () => seite.evaluate(() => {
  const B = window.BRAUHAUS;
  const zuege = [];
  document.querySelectorAll('[data-zug]').forEach(el => {
    const r = el.getBoundingClientRect();
    const flaeche = r.width > 0 && r.height > 0;
    let trifft = false;
    if (flaeche) {
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
        const t = document.elementFromPoint(cx, cy);
        trifft = !!(t && (t === el || el.contains(t)));
      }
    }
    zuege.push({ zug: el.getAttribute('data-zug'),
      preis: el.getAttribute('data-preis') ? +el.getAttribute('data-preis') : null,
      aus: !!el.disabled, flaeche, trifft,
      text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 54) });
  });
  return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
    kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff, ansehen: B.welt.haus.ansehen,
    faesser: B.welt.vorrat.faesser.length, plaetze: B.welt.vorrat.plaetze,
    lage: B.lage.slice(0, 5), lageN: B.lage.length,
    chronik: (B.welt.chronik || []).slice(-6).map(c => (c.text || c.was || JSON.stringify(c)).slice(0, 110)),
    zuege };
});

const klick = async (zug) => {
  const l = await seite.evaluate(z => {
    const el = document.querySelector(`[data-zug="${z}"]`);
    if (!el) return { da: false };
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return { da: true, flaeche: false };
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const t = (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight)
      ? document.elementFromPoint(cx, cy) : null;
    return { da: true, flaeche: true, aus: !!el.disabled, x: cx, y: cy,
      trifft: !!(t && (t === el || el.contains(t))),
      wer: t ? ((typeof t.className === 'string' ? t.className : '') || t.tagName) : null,
      text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40) };
  }, zug);
  if (!l.da) return { zug, erg: 'GIBT ES NICHT' };
  if (!l.flaeche) return { zug, erg: 'KEINE FLAECHE' };
  if (l.aus) return { zug, erg: 'GESPERRT', text: l.text };
  if (!l.trifft) {
    // wie ein Mensch: das eigene Brett in den Blick rollen
    await seite.evaluate(z => {
      const el = document.querySelector(`[data-zug="${z}"]`);
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'center' });
    }, zug);
    await ruhe();
    const l2 = await seite.evaluate(z => {
      const el = document.querySelector(`[data-zug="${z}"]`);
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const t = (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight)
        ? document.elementFromPoint(cx, cy) : null;
      return { x: cx, y: cy, trifft: !!(t && (t === el || el.contains(t))),
        wer: t ? ((typeof t.className === 'string' ? t.className : '') || t.tagName) : null };
    }, zug);
    if (!l2.trifft) return { zug, erg: 'VERDECKT', wer: l2.wer, text: l.text };
    await seite.mouse.click(l2.x, l2.y);
    await ruhe();
    return { zug, erg: 'geklickt (erst gerollt)', text: l.text };
  }
  await seite.mouse.click(l.x, l.y);
  await ruhe();
  return { zug, erg: 'geklickt', text: l.text };
};

const protokoll = [];
let bildN = 0;
for (const z of zuege) {
  if (z === '!schirm') {
    bildN++;
    if (BILD) await seite.screenshot({ path: BILD.replace(/\.png$/, `-${bildN}.png`) });
    const s = await schirm();
    protokoll.push({ halt: bildN, jahr: s.jahr, woche: s.woche, kasse: s.kasse });
    continue;
  }
  const r = await klick(z);
  const s = await schirm();
  r.nach = `${s.jahr}/${s.woche} Kasse ${s.kasse}`;
  protokoll.push(r);
  console.log(`${r.erg.padEnd(24)} ${z.padEnd(34)} ${r.nach}  ${r.text || ''}`);
  if (s.ende) { console.log('  == DIE PARTIE IST ZU ENDE =='); break; }
}
const s = await schirm();
if (BILD) await seite.screenshot({ path: BILD });
if (STAND) fs.writeFileSync(STAND, JSON.stringify({ epoche: EP, protokoll, schirm: s, fehler }, null, 1));
console.log(`\nSTAND E${EP}: ${s.jahr}/${s.woche} · Kasse ${s.kasse} · Rohstoff ${s.rohstoff} · `
  + `Keller ${s.faesser}/${s.plaetze} · BRAUHAUS.lage ${s.lageN} · Seitenfehler ${fehler.length}`);
const akt = s.zuege.filter(z => !z.aus && z.flaeche);
console.log(`ZUEGE: ${s.zuege.length} gesamt · ${akt.length} aktiv mit Flaeche · `
  + `${akt.filter(z => z.preis).length} davon mit Preisschild · `
  + `${akt.filter(z => z.trifft).length} von der Maus getroffen`);
console.log('CHRONIK zuletzt:'); s.chronik.forEach(c => console.log('   ' + c));
await browser.close();
