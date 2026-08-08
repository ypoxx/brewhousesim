/* AUFLAGE R9 — KEIN ABGESCHNITTENER TEXT AUF DER MICHAELITAFEL.

   Gemessen MIT gezeichneter Rollleiste (`ignoreDefaultArgs:
   ['--hide-scrollbars']`) — Playwright blendet sie sonst aus, und alle
   Ueberlaufzahlen dieses Laufs vor dem 5. August 2026 sind deshalb
   Untergrenzen (siehe Kopf von `werkbank/schuss/aufsicht/lesbarkeit.mjs`).

   Zwei Fenster: 1600×900 (das Fenster des Kritikers) und 1366×768 (die
   vierte Messlatte). Zwei Seiten der Tafel: Angebote und Chronik.

   Abgeschnitten heisst hier — je Richtung getrennt —: der Kasten laeuft in
   dieser Richtung ueber UND kann in dieser Richtung nicht rollen. Ein
   Kasten mit `overflow-y: auto` verbirgt nichts, er rollt.
   Dazu die zweite Sorte, die der Kritiker mit blossem Auge gesehen hat:
   ein Knopfwort, das MITTEN IM WORT bricht („Nehme n −110 P f").

   HAFEN=8922 node ueberlauf.mjs [marke]                                     */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const MARKE = process.argv[2] || 'ueberlauf';
const HAFEN = process.env.HAFEN || '8922';
const WURZ = '/home/user/brewhousesim/werkbank/schuss/tafel-w13';
const JAHR = { 1: 1359, 2: 1609, 3: 1893, 4: 1979 };

const b = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
const alles = [];

for (const [br, ho] of [[1600, 900], [1366, 768]]) {
  for (const ep of [1, 2, 3, 4]) {
    for (const seiteName of ['tafel', 'chronik']) {
      const s = await b.newPage({ viewport: { width: br, height: ho }, deviceScaleFactor: 1 });
      const fehler = [];
      s.on('pageerror', e => fehler.push(String(e).slice(0, 200)));
      await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350&jahr=${JAHR[ep]}&woche=1`,
        { waitUntil: 'networkidle' });
      await s.waitForTimeout(1300);
      /* Tafel aufschlagen, falls der Rahmen sie beim Laden weggeklappt hat. */
      for (let v = 0; v < 3; v++) {
        const liegt = await s.evaluate(() => {
          const t = document.querySelector('.pr-tafel');
          return !!(t && !t.classList.contains('stadt-zugeklappt'));
        });
        if (liegt) break;
        const k = await s.$('[data-zug="preis:tafel"]');
        if (k) await k.click();
        await s.waitForTimeout(400);
      }
      if (seiteName === 'chronik') {
        const k = await s.$('[data-zug="preis:chronik"]');
        if (k) { await k.click(); await s.waitForTimeout(400); }
      }

      const r = await s.evaluate(() => {
        const t = document.querySelector('.pr-tafel');
        if (!t) return { fehlt: true };
        const kappt = v => v === 'hidden' || v === 'clip';
        const ab = [];
        t.querySelectorAll('*').forEach(el => {
          const c = getComputedStyle(el);
          const abY = el.scrollHeight > el.clientHeight + 1 && kappt(c.overflowY);
          const abX = el.scrollWidth > el.clientWidth + 1 && kappt(c.overflowX);
          if (!abY && !abX) return;
          ab.push({
            klasse: (el.className || '').toString().slice(0, 60),
            richtung: (abY ? 'y' : '') + (abX ? 'x' : ''),
            fehltY: abY ? el.scrollHeight - el.clientHeight : 0,
            fehltX: abX ? el.scrollWidth - el.clientWidth : 0,
            text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90)
          });
        });
        /* Knopfwoerter, die mitten im Wort brechen: das Wort ist breiter als
           sein Kasten, obwohl es nicht umbrechen dürfte. */
        const bruch = [];
        const zeilenVon = (el) => {
          const rg = document.createRange();
          rg.selectNodeContents(el);
          const rs = [...rg.getClientRects()].filter(r => r.width > 0.5 && r.height > 0.5);
          const oben = [...new Set(rs.map(r => Math.round(r.top)))];
          return { n: oben.length, breiteste: Math.max(0, ...rs.map(r => r.width)) };
        };
        t.querySelectorAll('.knopf').forEach(k => {
          k.querySelectorAll('.wort, .preis').forEach(w => {
            const wort = (w.textContent || '').trim();
            if (!wort) return;
            const z = zeilenVon(w);
            /* Ein Wort ohne Leerzeichen, das auf zwei Zeilen steht, ist
               mitten im Wort gebrochen. „Nehmen" hat kein Leerzeichen.
               Ein Preisschild („−110 Pf") traegt ein GESCHUETZTES
               Leerzeichen und darf ebenfalls nie brechen. */
            const teile = wort.split(/[\s ]+/).filter(Boolean);
            if (z.n > teile.length || (teile.length === 1 && z.n > 1)) {
              bruch.push({ zug: k.getAttribute('data-zug'), teil: w.className,
                text: wort.slice(0, 40), zeilen: z.n, woerter: teile.length,
                breite: Math.round(w.getBoundingClientRect().width) });
            }
          });
        });
        const rt = t.getBoundingClientRect();
        return { fehlt: false, ab, bruch,
          tafel: { b: Math.round(rt.width), h: Math.round(rt.height) },
          rand: document.documentElement.scrollWidth > document.documentElement.clientWidth };
      });
      alles.push({ fenster: br + 'x' + ho, epoche: ep, seite: seiteName, fehler, ...r });
      await s.close();
    }
  }
}
await b.close();

fs.writeFileSync(`${WURZ}/protokoll/${MARKE}.json`, JSON.stringify(alles, null, 1));
let sum = 0, sumB = 0;
alles.forEach(a => {
  const n = a.ab ? a.ab.length : -1, nb = a.bruch ? a.bruch.length : -1;
  sum += Math.max(0, n); sumB += Math.max(0, nb);
  console.log(`${a.fenster}  E${a.epoche} ${a.seite.padEnd(8)} ` +
    (a.fehlt ? 'KEINE TAFEL' : `${n} abgeschnitten · ${nb} Wortbruch · Tafel ${a.tafel.b}x${a.tafel.h}` +
      (a.fehler.length ? ' · FEHLER' : '')));
  if (!a.fehlt) a.ab.slice(0, 8).forEach(x =>
    console.log(`      [${x.richtung}] .${x.klasse}  -${x.fehltY || x.fehltX}px  „${x.text}"`));
  if (!a.fehlt) a.bruch.slice(0, 6).forEach(x =>
    console.log(`      BRUCH ${x.zug} .${x.teil} — „${x.text}" (${x.woerter} Wort/Wörter auf ${x.zeilen} Zeilen, ${x.breite}px)`));
  if (a.fehler && a.fehler.length) a.fehler.slice(0, 3).forEach(f => console.log('      SEITENFEHLER ' + f));
});
console.log(`\nSUMME: ${sum} abgeschnittene Kästen · ${sumB} Wortbrüche über 16 Blätter`);
