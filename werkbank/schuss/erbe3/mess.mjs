/* Messung DAS ERBE — echte Mausklicks, Treffertest per elementFromPoint. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const EP    = process.argv[2] || '1';
const SAAT  = process.argv[3] || '1350';
const WOCHEN= parseInt(process.argv[4] || '120', 10);
const AUS   = process.argv[5] || null;
const VOR   = process.argv[6] ? process.argv[6].split(',') : [];   /* Zuege vorab */

const b = await chromium.launch();
const s = await b.newContext({ viewport: { width: 1376, height: 768 }, deviceScaleFactor: 1 });
const p = await s.newPage();
const fehler = [];
p.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
p.on('pageerror', e => fehler.push('pageerror: ' + e.message));

await p.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=${SAAT}`, { waitUntil: 'networkidle' });
await p.waitForTimeout(500);

/* Treffertest: nur was der Mauszeiger wirklich trifft und was nicht disabled ist. */
const messeZuege = async () => p.evaluate(() => {
  const out = { erbeMitPreis: 0, alleMitPreis: 0, erbeZuege: [], alle: [] };
  document.querySelectorAll('button[data-zug]').forEach(k => {
    const r = k.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const t = document.elementFromPoint(x, y);
    if (!t || (t !== k && !k.contains(t))) return;
    if (k.disabled || k.hasAttribute('disabled')) return;
    const preisEl = k.querySelector('.preis');
    const preis = preisEl ? preisEl.innerText.trim() : '';
    const hatPreis = !!preis;
    const zug = k.getAttribute('data-zug');
    if (hatPreis) out.alleMitPreis++;
    out.alle.push(zug);
    if (zug.startsWith('erbe:')) {
      out.erbeZuege.push(zug + (hatPreis ? ' ' + preis : ''));
      if (hatPreis) out.erbeMitPreis++;
    }
  });
  return out;
});

const stand = async () => p.evaluate(() => {
  const W = BRAUHAUS.welt;
  const L = document.querySelector('.erb-leiste');
  const kopf = document.querySelector('#fach-kopf, .kopfleiste');
  return {
    jahr: W.zeit.jahr, woche: W.zeit.woche, ende: !!W.zeit.ende,
    kasse: W.haus.kasse,
    amt: { nr: W.zeit.amtszeit.nr, name: W.zeit.amtszeit.name, eig: W.zeit.amtszeit.eigenschaft },
    erbe: BRAUHAUS.erbe ? BRAUHAUS.erbe.stand() : null,
    leiste: L ? L.innerText.replace(/\s+/g, ' ').trim() : null,
    lage: BRAUHAUS.lage.length
  };
});

const klick = async (zug) => {
  const el = await p.$(`button[data-zug="${zug}"]`);
  if (!el) return false;
  const dis = await el.isDisabled().catch(() => true);
  if (dis) return false;
  await el.click({ timeout: 3000 }).catch(() => {});
  await p.waitForTimeout(60);
  return true;
};

const zeilen = [];
const start = await stand();

for (const z of VOR) { await klick(z); }
const nachVor = await stand();

for (let i = 0; i < WOCHEN; i++) {
  const st = await stand();
  const zg = await messeZuege();
  zeilen.push({ i, jahr: st.jahr, woche: st.woche, kasse: st.kasse,
    amtNr: st.amt.nr, amtName: st.amt.name, amtEig: st.amt.eig,
    uebergeben: st.erbe ? st.erbe.uebergeben : null,
    form: st.erbe ? st.erbe.form : null,
    amHaus: st.erbe ? st.erbe.amHaus.length : null,
    person: st.erbe ? st.erbe.anDerPerson.length : null,
    erbeMitPreis: zg.erbeMitPreis, alleMitPreis: zg.alleMitPreis,
    erbeZuege: zg.erbeZuege, leiste: st.leiste });
  if (st.ende) break;
  const ok = await klick('weiter');
  if (!ok) break;
}
const ende = await stand();
const erg = { epoche: EP, saat: SAAT, vor: VOR, start, nachVor, ende, zeilen, fehler,
  lage: await p.evaluate(() => BRAUHAUS.lage.slice()) };
if (AUS) fs.writeFileSync(AUS, JSON.stringify(erg, null, 1));
console.log(JSON.stringify({ epoche: EP, wochen: zeilen.length, fehler: fehler.length,
  lage: erg.lage.length,
  endeKasse: ende.kasse, endeJahr: ende.jahr + '/' + ende.woche }, null, 1));
await b.close();
