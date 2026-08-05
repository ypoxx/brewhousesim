/* LATTE 4 fuer DER PREIS — je Stueck gezaehlt UND die Klassen benannt.
     HAFEN=8899 BREITE=1366 HOEHE=768 node werkbank/schuss/preis-w7/lesbar-preis.mjs [ziel.json]

   Die Zaehlregeln sind Zeile fuer Zeile die von
   `werkbank/schuss/sud-blind-r2/lesbar-je-stueck.mjs`, damit die Summen mit
   denen der Aufsicht vergleichbar bleiben: Zuordnung ueber `data-stueck` am
   Fach, Rollleiste gezeichnet (`ignoreDefaultArgs: ['--hide-scrollbars']`),
   Ueberlauf je Richtung getrennt geprueft.

   DAZU, und das ist der Unterschied: fuer das eigene Stueck wird die
   KLASSENLISTE jedes zu kleinen Knotens mitgezaehlt. Ohne sie sucht man 113
   Knoten in 56 font-size-Regeln von Hand.

   Kein Klick, keine Zeitmessung — laeuft neben einer Wochenmessung, ohne sie
   zu verderben (dieselbe Bauart wie aufsicht/lesbarkeit.mjs). */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const HAFEN = process.env.HAFEN || '8899';
const BREITE = +(process.env.BREITE || 1366), HOEHE = +(process.env.HOEHE || 768);
const MEIN = process.env.STUECK || 'preis';
const ZIEL = process.argv[2] || 'werkbank/schuss/preis-w7/lesbar-preis.json';
const b = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
const alles = {};
for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: BREITE, height: HOEHE } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1400);
  /* TAFEL=auf schlaegt die Michaelitafel auf. Zugeklappt misst man von
     diesem Stueck nur den Griff — zwei Knoepfe und ein Dutzend Zeilen. Der
     Spieler liest die Rechnungsspalte, DIE LEITER und die Angebotskarten,
     und die sind nur auf der aufgeschlagenen Tafel da. */
  if (process.env.TAFEL === 'auf') {
    for (let i = 0; i < 3; i++) {
      const l = await s.evaluate(() => {
        const el = document.querySelector('[data-zug="preis:tafel"]');
        if (!el || el.disabled) return null;
        if (/schließen/.test((el.innerText || ''))) return 'offen';
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return null;
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      if (l === 'offen' || !l) break;
      await s.mouse.click(l.x, l.y);
      await s.waitForTimeout(800);
    }
  }
  alles['e' + e] = await s.evaluate((mein) => {
    const wem = (el) => {
      const f = el.closest('[data-stueck]');
      return f ? f.getAttribute('data-stueck') : '(ohne)';
    };
    const kappt = v => v === 'hidden' || v === 'clip';
    const st = {};
    const klassen = {};
    const ueberKlassen = {};
    const hol = (w) => (st[w] = st[w] || { ueber: 0, klein: 0, winzig: 0, kleinste: 999,
                                           knoepfe: 0, zuKlein: 0 });
    [...document.querySelectorAll('*')].forEach(el => {
      const c = getComputedStyle(el);
      const w = wem(el);
      const kn = (typeof el.className === 'string' ? el.className : '').trim() || el.tagName.toLowerCase();
      if (el.children.length === 0 && (el.textContent || '').trim()) {
        const px = parseFloat(c.fontSize);
        const o = hol(w);
        if (px < 12) {
          o.klein++;
          if (px < o.kleinste) o.kleinste = Math.round(px * 10) / 10;
          if (w === mein) {
            const s = kn + ' @' + (Math.round(px * 10) / 10) + 'px';
            klassen[s] = (klassen[s] || 0) + 1;
          }
        }
        if (px < 10) o.winzig++;
      }
      const abY = el.scrollHeight > el.clientHeight + 1 && kappt(c.overflowY);
      const abX = el.scrollWidth > el.clientWidth + 1 && kappt(c.overflowX);
      if (abY || abX) {
        hol(w).ueber++;
        if (w === mein) {
          const s = kn + (abY ? ' [Y]' : '') + (abX ? ' [X]' : '')
            + ' :: ' + (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 44);
          ueberKlassen[s] = (ueberKlassen[s] || 0) + 1;
        }
      }
    });
    [...document.querySelectorAll('[data-zug]')].forEach(el => {
      const o = hol(wem(el));
      if (el.disabled) return;
      const r = el.getBoundingClientRect();
      if (!(r.width > 0 && r.height > 0)) return;
      o.knoepfe++;
      if (r.width < 24 || r.height < 24) o.zuKlein++;
    });
    return { st, klassen, ueberKlassen };
  }, MEIN);
  await s.close();
}
await b.close();
const stuecke = new Set();
Object.values(alles).forEach(x => Object.keys(x.st).forEach(k => stuecke.add(k)));
const summe = {};
console.log(`LATTE 4 je Stueck, ${BREITE}x${HOEHE}, MIT Rollleiste`);
console.log(`${'Stueck'.padEnd(10)} ${'Ueberl.'.padStart(8)} ${'<12px'.padStart(7)} ${'<10px'.padStart(7)} ${'Knopf<24'.padStart(9)} ${'Knoepfe'.padStart(8)}  kleinste`);
[...stuecke].sort().forEach(k => {
  let u = 0, kl = 0, wz = 0, zk = 0, kn = 0, mini = 999;
  [1, 2, 3, 4].forEach(e => {
    const x = alles['e' + e].st[k]; if (!x) return;
    u += x.ueber; kl += x.klein; wz += x.winzig; zk += x.zuKlein; kn += x.knoepfe;
    if (x.kleinste < mini) mini = x.kleinste;
  });
  summe[k] = { ueber: u, klein: kl, winzig: wz, zuKlein: zk, knoepfe: kn, kleinste: mini };
  console.log(`${k.padEnd(10)} ${String(u).padStart(8)} ${String(kl).padStart(7)} ${String(wz).padStart(7)} ${String(zk).padStart(9)} ${String(kn).padStart(8)}  ${mini === 999 ? '-' : mini + 'px'}`);
});
const g = Object.values(summe).reduce((a, x) => ({ ueber: a.ueber + x.ueber, klein: a.klein + x.klein,
  zuKlein: a.zuKlein + x.zuKlein, knoepfe: a.knoepfe + x.knoepfe }), { ueber: 0, klein: 0, zuKlein: 0, knoepfe: 0 });
console.log(`${'SUMME'.padEnd(10)} ${String(g.ueber).padStart(8)} ${String(g.klein).padStart(7)} ${''.padStart(7)} ${String(g.zuKlein).padStart(9)} ${String(g.knoepfe).padStart(8)}`);

const kl = {}, ue = {};
[1, 2, 3, 4].forEach(e => {
  Object.entries(alles['e' + e].klassen).forEach(([s, n]) => (kl[s] = (kl[s] || 0) + n));
  Object.entries(alles['e' + e].ueberKlassen).forEach(([s, n]) => (ue[s] = (ue[s] || 0) + n));
});
console.log(`\nZU KLEINE KNOTEN VON "${MEIN}", nach Klasse (alle vier Epochen):`);
Object.entries(kl).sort((a, b) => b[1] - a[1]).forEach(([s, n]) => console.log(`  ${String(n).padStart(4)}x  ${s}`));
console.log(`\nUEBERLAUFENDE KAESTEN VON "${MEIN}":`);
Object.entries(ue).sort((a, b) => b[1] - a[1]).slice(0, 40).forEach(([s, n]) => console.log(`  ${String(n).padStart(4)}x  ${s}`));

fs.mkdirSync(ZIEL.replace(/\/[^/]+$/, ''), { recursive: true });
fs.writeFileSync(ZIEL, JSON.stringify({ fenster: `${BREITE}x${HOEHE}`, stueck: MEIN,
  jeEpoche: alles, summe, klassen: kl, ueberKlassen: ue }, null, 1));
