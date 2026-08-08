/* GRIFFPROBE w13 — steht der Anschlag am Anfang irgendeinem Zug im Weg?

   Die Gefahr ist gemessen belegbar und nicht theoretisch: die Hand des
   blinden Kritikers prueft vor JEDEM Klick mit `document.elementFromPoint`,
   ob unter dem Zeiger auch wirklich dieser Knopf liegt. Was nicht darunter
   liegt, gilt als NICHT GEGRIFFEN, der Klick faellt ersatzlos aus — und ein
   ausgefallener Klick macht eine andere Partie (siehe den Kopf von
   `werkbank/schuss/rueckkopplung-r3/linie.mjs`).

   Also wird gezaehlt, was der Kritiker zaehlen wuerde: alle `[data-zug]` mit
   Flaeche im Sichtfeld, und fuer jeden, ob `elementFromPoint` auf seiner
   Mitte ihn trifft. Einmal MIT liegendem Anschlag, einmal nachdem er mit
   „Anfangen" beiseitegelegt wurde. Der Unterschied darf genau der Knopf
   `kern:anfangen` sein und sonst nichts.

   Dazu die Woerter, nach denen die Abnahme fragt: Ziel · gewinnen ·
   überleben auf dem ersten Schirm, gezaehlt ueber alle sichtbaren
   Textzeilen — so wie §5 des Urteils sie gezaehlt hat (dort: 0 von 613).

   HAFEN=8921 node griffprobe.mjs <epoche> [breite] [hoehe]                  */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const BR = +(process.argv[3] || 1600), HO = +(process.argv[4] || 900);
const HAFEN = process.env.HAFEN || '8921';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/rahmen-w13';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: BR, height: HO }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });

await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350&neu=1`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

const schirm = () => seite.evaluate(() => {
  const B = window.BRAUHAUS;
  const zuege = [];
  document.querySelectorAll('[data-zug]').forEach(el => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let hit = false;
    if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
      const t = document.elementFromPoint(cx, cy);
      hit = !!(t && (t === el || el.contains(t)));
    }
    zuege.push({ zug: el.getAttribute('data-zug'), aus: !!el.disabled, hit });
  });
  /* Sichtbare Textzeilen und die drei Woerter — Zaehlweise wie §5 des Urteils. */
  const zeilen = [];
  const geher = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = geher.nextNode())) {
    const t = (n.nodeValue || '').trim();
    if (!t) continue;
    const el = n.parentElement;
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const c = getComputedStyle(el);
    if (c.visibility === 'hidden' || c.display === 'none' || parseFloat(c.opacity) < 0.05) continue;
    zeilen.push(t);
  }
  const alles = zeilen.join('\n');
  const zaehl = (w) => (alles.match(new RegExp(w, 'gi')) || []).length;
  return {
    zuege, greifbar: zuege.filter(z => z.hit && !z.aus).length,
    textzeilen: zeilen.length,
    woerter: { Ziel: zaehl('ziel'), gewinnen: zaehl('gewinn'), ueberleben: zaehl('überleb') },
    zettel: !!document.querySelector('.startzettel'),
    haushalt: B.haushalt.pruefe(),
    haushaltKern: B.haushalt.miss().je.kern || null,
    tafeln: B.haushalt.tafeln(),
    ueberRand: B.haushalt.ueberRand(),
    lage: B.lage.map(l => l.text.slice(0, 110))
  };
});

const mit = await schirm();
await seite.screenshot({ path: `${WURZ}/schuesse/griff-e${ep}-mit-anschlag.png` });

/* „Anfangen" druecken — mit echter Maus, wie der Kritiker. */
const l = await seite.evaluate(() => {
  const el = document.querySelector('[data-zug="kern:anfangen"]');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const t = document.elementFromPoint(cx, cy);
  return { x: cx, y: cy, hit: !!(t && (t === el || el.contains(t))) };
});
if (l) { await seite.mouse.move(l.x, l.y, { steps: 4 }); await seite.mouse.click(l.x, l.y); }
await seite.waitForTimeout(400);
const ohne = await schirm();
await seite.screenshot({ path: `${WURZ}/schuesse/griff-e${ep}-ohne-anschlag.png` });

const alsKarte = (s) => { const m = {}; s.zuege.forEach(z => { m[z.zug] = (z.aus ? 'aus' : '') + (z.hit ? 'hit' : 'blind'); }); return m; };
const a = alsKarte(mit), b = alsKarte(ohne);
const unterschied = [];
Object.keys(b).forEach(k => { if (a[k] !== b[k]) unterschied.push({ zug: k, mitAnschlag: a[k] || '(fort)', ohne: b[k] }); });
Object.keys(a).forEach(k => { if (!(k in b)) unterschied.push({ zug: k, mitAnschlag: a[k], ohne: '(fort)' }); });

const erg = {
  epoche: ep, fenster: `${BR}x${HO}`, fehler,
  mitAnschlag: { greifbar: mit.greifbar, zuege: mit.zuege.length, textzeilen: mit.textzeilen,
                 woerter: mit.woerter, zettel: mit.zettel },
  ohneAnschlag: { greifbar: ohne.greifbar, zuege: ohne.zuege.length, textzeilen: ohne.textzeilen,
                  woerter: ohne.woerter, zettel: ohne.zettel },
  anfangenGetroffen: l ? l.hit : null,
  unterschied,
  nurDerAnschlagKnopf: unterschied.length === 1 && unterschied[0].zug === 'kern:anfangen',
  haushalt: mit.haushalt, haushaltKern: mit.haushaltKern,
  tafeln: mit.tafeln, ueberRand: mit.ueberRand, lage: mit.lage
};
fs.writeFileSync(`${WURZ}/protokoll/griffprobe-e${ep}-${BR}x${HO}.json`, JSON.stringify(erg, null, 1));
console.log(JSON.stringify(erg, null, 1));
await browser.close();
