/*
  Prüflauf für die Demo — spielt sie, statt sie zu lesen.
  Erzeugt die Zahlen, auf die sich VOTUM-GESTALTER.md und VOTUM-SPIELDESIGNER.md berufen.

      npm i playwright && node pruefen.mjs

  Die Demo bleibt unberührt: für den Lauf wird eine Kopie mit einer einzigen
  zusätzlichen Zeile angelegt (`window.__Z = Z`), damit der Zustand von außen
  lesbar ist. Ohne diese Sonde bliebe nur, Pixel zu raten.
*/
import { chromium } from 'playwright';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = path.dirname(fileURLToPath(import.meta.url));
const ANKER = '  Z.haeuser = frischeHaeuser();';

const quelle = fs.readFileSync(path.join(HIER, 'index.html'), 'utf8');
if (!quelle.includes(ANKER)) throw new Error('Anker für die Sonde nicht gefunden — index.html hat sich geändert.');
const probe = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'fuhre-')), 'probe.html');
fs.writeFileSync(probe, quelle.replace(ANKER, ANKER + '\n  window.__Z = Z;'));

// Vorinstallierte Browser (z. B. PLAYWRIGHT_BROWSERS_PATH) haben oft eine andere
// Build-Nummer als die npm-Fassung erwartet. Dann von Hand suchen statt nachladen.
function browserSuchen() {
  const wurzel = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!wurzel || !fs.existsSync(wurzel)) return undefined;
  for (const ordner of fs.readdirSync(wurzel).filter(n => n.startsWith('chromium-')).sort().reverse()) {
    const exe = path.join(wurzel, ordner, 'chrome-linux', 'chrome');
    if (fs.existsSync(exe)) return exe;
  }
  return undefined;
}

const browser = await chromium.launch({ executablePath: browserSuchen() });
const bericht = {};

const Z = p => p.evaluate(() => ({
  woche: __Z.woche, phase: __Z.phase, kasse: __Z.kasse,
  keller: __Z.keller.length,
  haeuser: __Z.haeuser.map(h => ({ id: h.id, km: h.km, will: h.will, durst: h.durst,
    unser: h.unser, adler: h.adler, umworben: h.umworben })),
  geladen: Object.values(__Z.ladung).reduce((s, a) => s + a.length, 0)
}));
const hinweis = p => p.evaluate(() => document.getElementById('hinweis').textContent);
const fassVon = (p, sorte) => p.evaluate(s => (__Z.keller.find(f => f.sorte === s) || {}).id || null, sorte);

async function klick(p, sel) {
  const k = await p.locator(sel).first().boundingBox();
  if (!k) throw new Error('nicht sichtbar: ' + sel);
  await p.mouse.click(k.x + k.width / 2, k.y + k.height / 2);
}
async function neueBuehne() {
  const p = await browser.newPage({ viewport: { width: 1600, height: 950 } });
  p.on('pageerror', e => (bericht.seitenfehler = [...(bericht.seitenfehler || []), e.message]));
  await p.goto('file://' + probe);
  await p.waitForTimeout(800);
  await klick(p, 'g[role="button"][aria-label="Das Braujahr beginnen"]');
  await p.waitForTimeout(1200);
  return p;
}
async function fahrtAbwarten(p) {
  for (let i = 0; i < 50; i++) { await p.waitForTimeout(300); if ((await Z(p)).phase !== 'fahrt') break; }
  await p.waitForTimeout(2600);   // Meldungen (Schild, Verlust) laufen bis 2,6 s
}

/* 1 — Ein sauber gespieltes Jahr: wer am längsten wartet und erreichbar ist, bekommt. */
{
  const p = await neueBuehne();
  const KM = { land: 8, maerz: 32, expo: 65 };
  const jahr = [];
  for (let w = 1; w <= 12; w++) {
    const z = await Z(p);
    if (z.phase !== 'plan') break;
    const ziele = z.haeuser.filter(h => h.unser).sort((a, b) => (b.durst - a.durst) || (a.km - b.km));
    const offen = Object.fromEntries(ziele.map(h => [h.id, h.will]));
    const keller = await p.evaluate(() => __Z.keller.map(f => ({ id: f.id, sorte: f.sorte })));
    let frei = 3, abgewiesen = 0;
    for (const f of keller) {
      if (!frei) break;
      const ziel = ziele.find(h => offen[h.id] > 0 && h.km <= KM[f.sorte]);
      if (!ziel) { abgewiesen++; continue; }
      await klick(p, `g[data-fass="${f.id}"]`);
      await klick(p, `g[data-haus="${ziel.id}"] rect.treffer`);
      offen[ziel.id]--; frei--;
    }
    await klick(p, 'g[role="button"][aria-label="Den Wagen abschicken"]');
    await fahrtAbwarten(p);
    const n = await Z(p);
    jahr.push({ woche: w, kasse: n.kasse, keller: n.keller,
      durst: n.haeuser.filter(h => h.unser).map(h => h.durst).join(''),
      sortenAbsagen: abgewiesen });
    if (n.phase !== 'plan') break;
  }
  bericht.sauberesJahr = jahr;
  bericht.sauberesJahrBefund = {
    kassenzuwachsJeWoche: [...new Set(jahr.slice(1).map((r, i) => r.kasse - jahr[i].kasse))],
    kellerstaende: [...new Set(jahr.map(r => r.keller))],
    hoechsterDurst: Math.max(...jahr.flatMap(r => [...r.durst].map(Number))),
    reichweitenAbsagenGesamt: jahr.reduce((s, r) => s + r.sortenAbsagen, 0)
  };
  await p.close();
}

/* 2 — Die Absagen: was sagt die Bühne, wenn es nicht geht? */
{
  const p = await neueBuehne();
  const versuche = [['land', 'sonne'], ['land', 'loewen'], ['maerz', 'sonne']];
  bericht.absagen = {};
  for (const [sorte, haus] of versuche) {
    const f = await fassVon(p, sorte);
    if (!f) continue;
    await klick(p, `g[data-fass="${f}"]`);
    await klick(p, `g[data-haus="${haus}"] rect.treffer`);
    bericht.absagen[`${sorte}->${haus}`] = await hinweis(p);
    await p.waitForTimeout(250);
  }
  bericht.beschriftungSonne = await p.evaluate(() =>
    [...document.querySelectorAll('g[data-haus="sonne"] text')].map(t => t.textContent));
  await p.close();
}

/* 3 — Vernachlässigung: greift der Verfall, und endet er irgendwo? */
{
  const p = await neueBuehne();
  const spur = [];
  for (let w = 1; w <= 9; w++) {
    const f = await fassVon(p, 'land');
    if (f) { await klick(p, `g[data-fass="${f}"]`); await klick(p, 'g[data-haus="krone"] rect.treffer'); }
    if (!(await p.locator('g[role="button"][aria-label="Den Wagen abschicken"]').count())) break;
    await klick(p, 'g[role="button"][aria-label="Den Wagen abschicken"]');
    await fahrtAbwarten(p);
    const z = await Z(p);
    spur.push({ woche: z.woche, keller: z.keller, phase: z.phase,
      haeuser: z.haeuser.map(h => `${h.id}:${h.durst}${h.umworben ? '·umworben' : ''}${h.adler ? '·ADLER' : ''}`) });
    if (z.phase !== 'plan') break;
  }
  bericht.vernachlaessigung = spur;
  await p.close();
}

/* 4 — Die Tastatur: trägt der zweite Bedienweg? */
{
  const p = await neueBuehne();
  const folge = [];
  for (let i = 0; i < 10; i++) {
    await p.keyboard.press('Tab');
    folge.push(await p.evaluate(() => {
      const a = document.activeElement;
      return a && a.getAttribute ? (a.getAttribute('aria-label') || a.tagName) : null;
    }));
  }
  await p.evaluate(() => document.querySelector('g[data-fass]').focus());
  await p.keyboard.press('Enter');
  const gewaehlt = await p.evaluate(() => __Z.gewaehlt);
  await p.evaluate(() => document.querySelector('g[data-haus="krone"]').focus());
  await p.keyboard.press('Enter');
  await p.waitForTimeout(250);
  bericht.tastatur = {
    tabfolge: folge,
    fassPerEnterAufgenommen: !!gewaehlt,
    hausFokussierbar: await p.evaluate(() => document.querySelector('g[data-haus="krone"]').hasAttribute('tabindex')),
    geladenNachEnter: (await Z(p)).geladen
  };
  await p.close();
}

await browser.close();
fs.rmSync(path.dirname(probe), { recursive: true, force: true });
console.log(JSON.stringify(bericht, null, 2));
