/* WIEDERHOLBARKEIT — dieselbe Saat, dieselbe Partie.

   Spielt je Lauf dieselbe feste Folge von Klicks (füllen · abschicken ·
   WEITER, und wenn die Michaelitafel liegt, „Das Jahr beginnen") über N
   Wochen und bildet danach eine Prüfsumme über alles, was der Kritiker
   ziffernweise nachzählen kann: Jahr, Woche, Kasse, Rohstoff, Ansehen,
   Fässer, Chronik, Buch — dazu der ganze Zustand DER JAHRESTAFEL
   (`BRAUHAUS.preis.lage()` ohne die Anzeigefelder).

   Drei Läufe je Epoche müssen EINE Prüfsumme ergeben.

   HAFEN=8922 node wdh.mjs <wochen> <laeufe>                                 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import crypto from 'node:crypto';
import fs from 'fs';

const WOCHEN = +(process.argv[2] || 45);
const LAEUFE = +(process.argv[3] || 3);
const HAFEN = process.env.HAFEN || '8922';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/tafel-w13';

const b = await chromium.launch();
const erg = {};

for (const ep of [1, 2, 3, 4]) {
  erg[ep] = [];
  for (let lauf = 0; lauf < LAEUFE; lauf++) {
    const s = await b.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
    const fehler = [];
    s.on('pageerror', e => fehler.push(String(e).slice(0, 160)));
    await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle' });
    await s.waitForTimeout(1400);
    const kl = async (z) => {
      const l = await s.evaluate(q => {
        const e = document.querySelector(`[data-zug="${q}"]`); if (!e) return null;
        const r = e.getBoundingClientRect(); if (r.width < 4) return null;
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const t = document.elementFromPoint(cx, cy);
        return { x: cx, y: cy, aus: !!e.disabled, hit: !!(t && (t === e || e.contains(t))) };
      }, z);
      if (!l || l.aus || !l.hit) return false;
      await s.mouse.move(l.x, l.y, { steps: 3 });
      await s.mouse.down(); await s.waitForTimeout(55); await s.mouse.up();
      await s.waitForTimeout(230); return true;
    };
    let w = 0;
    for (let i = 0; i < WOCHEN * 3 && w < WOCHEN; i++) {
      const st = await s.evaluate(() => ({
        liegt: !!document.querySelector('.pr-tafel:not(.stadt-zugeklappt)'),
        ende: !!BRAUHAUS.welt.zeit.ende, woche: BRAUHAUS.welt.zeit.woche
      }));
      if (st.ende) break;
      if (st.liegt) { await kl('preis:tafel-zu'); continue; }
      await kl('fuhre:wie-vorige'); await kl('fuhre:abschicken');
      if (await kl('weiter')) w++;
    }
    const stand = await s.evaluate(() => {
      const B = window.BRAUHAUS;
      const Z = B.preis.lage();
      return {
        jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
        kasse: Math.round(B.welt.haus.kasse), rohstoff: B.welt.haus.rohstoff,
        ansehen: B.welt.haus.ansehen, faesser: B.welt.vorrat.faesser.length,
        chronik: B.welt.chronik.length, buch: B.protokoll.length,
        gegner: (B.welt.gegner || []).map(g => g.zuege).join('/'),
        anschlag: Math.round(Z.anschlag), tafelJahr: Z.tafelJahr,
        genommen: Object.keys(Z.genommen).sort().join(','),
        fest: Object.keys(Z.festGenommen).sort().join(','),
        leiter: Z.leiter.map(l => l.jahr + ':' + l.kasse + ':' + l.billigst).join('|'),
        prChronik: Z.chronik.length, lage: B.lage.length
      };
    });
    const summe = crypto.createHash('sha256').update(JSON.stringify(stand)).digest('hex').slice(0, 12);
    erg[ep].push({ lauf: lauf + 1, wochen: w, summe, stand, fehler: fehler.length });
    await s.close();
  }
  const s1 = erg[ep].map(x => x.summe);
  console.log(`E${ep}  ${[...new Set(s1)].length === 1 ? 'EINE Prüfsumme ✔' : 'ABWEICHUNG ✘'}  ${s1.join(' ')}  ` +
    `(${erg[ep][0].stand.jahr}/${erg[ep][0].stand.woche}, Kasse ${erg[ep][0].stand.kasse}, ` +
    `Buch ${erg[ep][0].stand.buch}, lage ${erg[ep][0].stand.lage})`);
}
await b.close();
fs.writeFileSync(`${WURZ}/protokoll/wdh.json`, JSON.stringify(erg, null, 1));
const alleGleich = [1, 2, 3, 4].every(e => new Set(erg[e].map(x => x.summe)).size === 1);
console.log(alleGleich ? '\nWIEDERHOLBAR: vier Epochen, je eine Prüfsumme.' : '\nNICHT WIEDERHOLBAR.');
