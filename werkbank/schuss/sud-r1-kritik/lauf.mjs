// Kritiker DER SUD, Runde 1 — spielen mit der Maus, messen am Bildschirm.
// node lauf.mjs <epoche> <wochen> <stil> <saat> <ausgabe.json>
// stil: sparsam | sudwechsel:<zug>[,<zug>] | gierig
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const EP = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 62);
const STIL = process.argv[4] || 'sparsam';
const SAAT = process.argv[5] || '4242';
const AUS = process.argv[6] || '';

const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 2752, height: 1536 } });
const fehler = [];
s.on('pageerror', (e) => fehler.push('pageerror: ' + e));
s.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
await s.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await s.waitForTimeout(1000);

const lies = () => s.evaluate(() => {
  const wert = (name) => {
    let v = null;
    document.querySelectorAll('.marke').forEach((m) => {
      if ((m.innerText || '').trim() === name) {
        const n = m.nextElementSibling || m.parentElement.querySelector('.wert');
        if (n) v = (n.innerText || '').trim();
      }
    });
    return v;
  };
  const txt = (sel) => { const e = document.querySelector(sel); return e ? (e.innerText || '').trim().replace(/\s+/g, ' ') : null; };
  const knoepfe = [];
  document.querySelectorAll('button[data-zug]').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 3 || r.height < 3) return;
    const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    knoepfe.push({
      zug: el.getAttribute('data-zug'),
      text: (el.innerText || '').trim().replace(/\s+/g, ' '),
      aktiv: !el.disabled,
      getroffen: !!(t && (t === el || el.contains(t))),
      x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2),
    });
  });
  const faesser = [];
  document.querySelectorAll('[class*="fu-fass"],[class*="fass-"]').forEach((el) => {
    const t = (el.getAttribute('title') || '').replace(/\s+/g, ' ');
    if (t) faesser.push(t);
  });
  return {
    kasse: wert('KASSE'), roh: wert('GRUT') || wert('HOPFEN') || wert('MALZ'),
    keller: wert('KELLER') || wert('GEWÖLBE') || wert('EISKELLER') || wert('TANKS'),
    woche: wert('WOCHE'), jahr: wert(document.querySelector('.marke') ? '' : ''),
    kopfzeile: Array.from(document.querySelectorAll('.marke')).map((m) => (m.innerText || '').trim() + '=' + ((m.nextElementSibling || {}).innerText || '').trim().replace(/\s+/g, ' ')).join(' | '),
    deckung: txt('.deckung'),
    sudmarke: txt('.fach-marken-sud'),
    sudbrett: txt('.sud-brett'),
    gaerband: txt('.sud-band'),
    tafel: txt('.fu-tafel'),
    knoepfe, faesser: faesser.slice(0, 40),
    ende: !!document.querySelector('[class*="ende"],[class*="schluss"]'),
  };
});

const klick = async (k) => {
  if (!k || !k.getroffen || !k.aktiv) return false;
  await s.mouse.click(k.x, k.y);
  await s.waitForTimeout(70);
  return true;
};

const finde = (z, zug, opt = {}) => z.knoepfe.find((k) => k.zug === zug && (!opt.aktiv || k.aktiv) && (!opt.tr || k.getroffen));

// Bretter aufklappen
const klappAuf = async () => {
  for (let i = 0; i < 3; i++) {
    const z = await lies();
    const zu = z.knoepfe.filter((k) => /^stadt:reiter:/.test(k.zug) && /zugeklappt/.test(k.text) && k.getroffen);
    if (!zu.length) break;
    for (const k of zu) { await s.mouse.click(k.x, k.y); await s.waitForTimeout(100); }
  }
};
await klappAuf();

const protokoll = [];
const sudAngebot = new Map();   // zug -> {text, malAktiv, malGetroffen, mal, preise:Set}
const wechselZiele = STIL.startsWith('sudwechsel:') ? STIL.slice('sudwechsel:'.length).split(',') : [];
let gewechselt = [];

for (let w = 0; w < WOCHEN; w++) {
  let z = await lies();
  if (z.ende) { protokoll.push({ w, ende: true }); break; }
  // Sud-Angebot buchführen
  for (const k of z.knoepfe) {
    if (!/^sud[:.]/.test(k.zug)) continue;
    const e = sudAngebot.get(k.zug) || { text: k.text, mal: 0, malAktiv: 0, malGetroffen: 0, texte: new Set() };
    e.mal++; if (k.aktiv) e.malAktiv++; if (k.getroffen) e.malGetroffen++; e.texte.add(k.text);
    sudAngebot.set(k.zug, e);
  }
  protokoll.push({
    w, kopf: z.kopfzeile, kasse: z.kasse, keller: z.keller, roh: z.roh,
    deckung: z.deckung, sudmarke: z.sudmarke,
    sudAktiv: z.knoepfe.filter((k) => /^sud[:.]/.test(k.zug) && k.aktiv && k.getroffen).length,
  });

  // Sudwechsel zum vorgesehenen Zeitpunkt
  for (const ziel of wechselZiele) {
    const [zug, wannS] = ziel.split('@');
    const wann = +(wannS || 1);
    if (w === wann) {
      const k = finde(z, zug, { aktiv: true, tr: true });
      if (k) {
        const vor = z.kasse, vorMarke = z.sudmarke;
        await klick(k);
        await s.waitForTimeout(200);
        const n = await lies();
        gewechselt.push({ w, zug, text: k.text, kasseVor: vor, kasseNach: n.kasse, markeVor: vorMarke, markeNach: n.sudmarke });
        z = n;
      } else {
        gewechselt.push({ w, zug, versucht: true, gescheitert: true, grund: 'nicht aktiv oder nicht getroffen' });
      }
    }
  }

  // Jahresanfang: Sommerblatt liegt über WEITER — Plan machen und schliessen
  if (finde(z, 'fuhre:sommer-zu', { aktiv: true, tr: true })) {
    for (const p of z.knoepfe.filter((k) => /^fuhre:jahresplan:/.test(k.zug) && k.aktiv && k.getroffen).slice(0, 2)) {
      await klick(p); await klick(p);
    }
    z = await lies();
    const zu = finde(z, 'fuhre:sommer-zu', { aktiv: true, tr: true });
    if (zu) { await klick(zu); await s.waitForTimeout(200); }
    await klappAuf();
    z = await lies();
  }

  if (STIL === 'gierig') {
    for (const k of z.knoepfe.filter((k) => /^(stadt:bau|fuhre:kauf|sud:gaerraum)/.test(k.zug) && k.aktiv && k.getroffen)) {
      await klick(k); await s.waitForTimeout(60);
    }
    z = await lies();
  }

  // bescheidener Wochenzug: Rohstoff nachkaufen wenn knapp, füllen, laden, abschicken
  const roh = parseInt((z.roh || '0').replace(/\D/g, '') || '0', 10);
  if (roh < 20) { const k = finde(z, 'fuhre:kauf:rohstoff', { aktiv: true, tr: true }); if (k) await klick(k); }
  let k2 = finde(await lies(), 'fuhre:fuellen', { aktiv: true, tr: true });
  if (k2) await klick(k2);
  z = await lies();
  for (const k of z.knoepfe.filter((k) => /^fuhre:laden:/.test(k.zug) && k.aktiv && k.getroffen).slice(0, 5)) {
    await klick(k); await klick(k);
  }
  z = await lies();
  let ab = finde(z, 'fuhre:abschicken', { aktiv: true, tr: true });
  if (ab) { await klick(ab); await s.waitForTimeout(180); }
  else {
    let wt = finde(z, 'weiter', { aktiv: true, tr: true });
    if (!wt) {
      // Sperrblatt? irgendetwas, das die Woche freigibt
      z = await lies();
      const sperr = z.knoepfe.find((k) => k.getroffen && k.aktiv && /(schliess|schließ|weiter|zettel|zur kenntnis|tafel|georgi|annehmen|fort)/i.test(k.text + k.zug));
      if (sperr) { await klick(sperr); await s.waitForTimeout(150); }
      z = await lies();
      wt = finde(z, 'weiter', { aktiv: true, tr: true });
    }
    if (wt) { await klick(wt); await s.waitForTimeout(180); }
    else protokoll[protokoll.length - 1].steckt = true;
  }
  await klappAuf();
}

const schluss = await lies();
const erg = {
  epoche: EP, wochen: WOCHEN, stil: STIL, saat: SAAT, fehler,
  angebot: Array.from(sudAngebot.entries()).map(([zug, e]) => ({ zug, mal: e.mal, aktiv: e.malAktiv, getroffen: e.malGetroffen, texte: Array.from(e.texte) })),
  gewechselt, protokoll, schluss: { kopf: schluss.kopfzeile, sudmarke: schluss.sudmarke, deckung: schluss.deckung, gaerband: schluss.gaerband },
};
if (AUS) fs.writeFileSync(AUS, JSON.stringify(erg, null, 1));
console.log(JSON.stringify({ epoche: EP, stil: STIL, fehler: fehler.length, wochen: protokoll.length, ende: schluss.kopfzeile, sudmarke: schluss.sudmarke, gewechselt }, null, 1));
await b.close();
