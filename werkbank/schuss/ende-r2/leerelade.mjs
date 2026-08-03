/* Auflage 4, Absturzseite: was steht einem Haus mit leerer Lade wirklich
   offen? Der Kritiker hat NUR Preisschilder gezaehlt (data-preis). Hier
   werden alle vier Sorten gezaehlt, jede Woche, an allen aufgeschlagenen
   Brettern: bezahlbare Ausgaben · Einnahmen · Zuege ohne Preisschild · und
   was der Klick daran wirklich bewegt. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import { neueSeite, STAND, AUS } from './messe.mjs';

const EP = +(process.argv[2] || 1);
const browser = await chromium.launch();
const { seite, fehler } = await neueSeite(browser, EP);
/* Alle Bretter aufschlagen, damit nichts wegen Verdeckung fehlt. */
const auf = async () => {
  const r = await seite.$$eval('[data-zug^="stadt:reiter:"]', e => e.map(x => x.getAttribute('data-zug')));
  for (const z of r) { const el = await seite.$(`[data-zug="${z}"]`);
    if (el) { try { await el.click({ timeout: 400 }); } catch {} } }
};
await auf();
const reihe = [];
for (let i = 0; i < 105; i++) {
  const s = await seite.evaluate(STAND);
  if (s.ende) break;
  const z = await seite.evaluate(() => {
    const o = { aktiv: 0, mitPreis: 0, bezahlbar: 0, einnahme: 0, ohnePreis: 0,
                probe: 0, laden: 0, kerbe: 0, rueckkauf: 0, versatz: 0, freiWirksam: 0,
                namen: [], namenFrei: [], namenBez: [], namenEin: [] };
    const kasse = window.BRAUHAUS.welt.haus.kasse;
    document.querySelectorAll('button[data-zug]').forEach(el => {
      if (el.disabled) return;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return;
      const t = document.elementFromPoint(x, y);
      if (!(t && (t === el || el.contains(t)))) return;
      o.aktiv++;
      const zug = el.getAttribute('data-zug');
      const p = el.getAttribute('data-preis');
      if (p === null) { o.ohnePreis++; }
      else {
        const n = parseFloat(p);
        o.mitPreis++;
        if (n > 0) o.einnahme++;
        else if (Math.abs(n) <= kasse) o.bezahlbar++;
      }
      if (zug.indexOf('fuhre:probe:') === 0) o.probe++;
      if (zug.indexOf('fuhre:laden:') === 0) o.laden++;
      if (zug.indexOf('fuhre:kerbe') === 0) o.kerbe++;
      if (zug.indexOf('fuhre:rueckkauf') === 0) o.rueckkauf++;
      if (zug.indexOf('stadt:versatz') === 0 || zug.indexOf('stadt:wiederkauf') === 0
        || zug.indexOf('stadt:hypothek') === 0 || zug.indexOf('stadt:abbruch') === 0) o.versatz++;
      const lesen = /^(kern:|klang:|stadt:reiter:|stadt:marke:|stadt:ortsmarken|stadt:alles-zuklappen|gegner:oeffnen:|gegner:zeige:|preis:tafel|preis:chronik-auf|sud:schluss-auf|fuhre:schluss-auf|name:band|erbe:)/.test(zug);
      if (!lesen) {
        if (p === null) { o.freiWirksam = (o.freiWirksam||0) + 1; o.namenFrei.push(zug); }
        else if (parseFloat(p) > 0) o.namenEin.push(zug + '=' + p);
        else if (Math.abs(parseFloat(p)) <= kasse) o.namenBez.push(zug + '=' + p);
      }
      o.namen.push(zug);
    });
    return o;
  });
  reihe.push({ jahr: s.jahr, woche: s.woche, kasse: s.kasse, deckung: s.deckung, ...z, namen: undefined });
  const w = await seite.$('[data-zug="weiter"]');
  if (!w || await w.isDisabled()) break;
  await w.click(); await seite.waitForTimeout(26);
  if (i % 12 === 0) await auf();
}
await seite.close(); await browser.close();
fs.writeFileSync(`${AUS}leerelade-e${EP}.json`, JSON.stringify({ reihe, fehler }, null, 1));
const leer = reihe.filter(r => r.kasse <= 0);
const med = a => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
console.log(`E${EP}: ${reihe.length} Wochen, davon ${leer.length} mit Kasse <= 0.`);
console.log(' In den Wochen mit leerer Lade — Median je Woche:');
console.log('   aktiv+getroffen', med(leer.map(r => r.aktiv)),
  '| bezahlbare Ausgabe', med(leer.map(r => r.bezahlbar)),
  '| Einnahme', med(leer.map(r => r.einnahme)),
  '| ohne Preisschild', med(leer.map(r => r.ohnePreis)),
  '| Probefass', med(leer.map(r => r.probe)),
  '| Laden', med(leer.map(r => r.laden)),
  '| Kerbholz', med(leer.map(r => r.kerbe)),
  '| Rueckkauf', med(leer.map(r => r.rueckkauf)),
  '| Verwertung', med(leer.map(r => r.versatz)));
console.log(' Median wirksamer Zuege OHNE Preisschild (Lesen abgezogen):', med(leer.map(r => r.freiWirksam)));
console.log(' Wochen mit leerer Lade und NULL wirksamem Zug:',
  leer.filter(r => r.bezahlbar + r.einnahme + r.freiWirksam === 0).length);
const zaehl = {};
leer.forEach(r => [].concat(r.namenBez||[], r.namenEin||[], r.namenFrei||[])
  .forEach(n => zaehl[n] = (zaehl[n]||0)+1));
console.log(' Was bei leerer Lade bedienbar war (Zug=Preis : Wochen):');
Object.entries(zaehl).sort((a,b)=>b[1]-a[1]).slice(0,25).forEach(([k,v])=>console.log('   ',k,':',v));
console.log(' fehler', fehler.length);
