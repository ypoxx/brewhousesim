/* LATTE 4, aufgeschluesselt nach STUECK — sonst haftet DER SUD fuer 1128
   Textknoten, von denen ihm die wenigsten gehoeren.
     HAFEN=8901 BREITE=1366 HOEHE=768 node .../lesbar-je-stueck.mjs [ziel.json]

   Zugeordnet wird ueber `data-stueck` am Fach (kern/buehne.js legt je Ebene
   und Stueck ein Fach an, stadt.js:481 liest genau dieses Attribut). Was
   keinem Fach untersteht, faellt unter '(ohne)'.

   Rollleiste: gezeichnet (die Vorgabe seit dem 5. August). Pruefung je
   Richtung wie in aufsicht/lesbarkeit.mjs nach deren Reparatur — Zeile fuer
   Zeile dieselbe Regel, damit die Summen vergleichbar bleiben. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const HAFEN = process.env.HAFEN || '8901';
const BREITE = +(process.env.BREITE || 1366), HOEHE = +(process.env.HOEHE || 768);
const ZIEL = process.argv[2] || 'werkbank/schuss/sud-blind-r2/lesbar-je-stueck.json';
const b = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
const alles = {};
for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: BREITE, height: HOEHE } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1400);
  /* BRETT=auf schlaegt das Sudbrett auf — das ist der Zustand, in dem der
     Spieler die Erklaersaetze wirklich liest. Ein einzelner Bildschirm, keine
     Wochenfolge; das Messfenster braucht das nicht. */
  if (process.env.BRETT === 'auf') {
    for (let i = 0; i < 3; i++) {
      const offen = await s.evaluate(() => {
        const f = document.getElementById('fach-hand-sud');
        const b = f ? f.firstElementChild : null;
        return b ? !b.classList.contains('stadt-zugeklappt') : null;
      });
      if (offen) break;
      const l = await s.evaluate(() => {
        const el = document.querySelector('[data-zug="stadt:reiter:sud-sud-brett"]');
        if (!el || el.disabled) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      if (!l) break;
      await s.mouse.click(l.x, l.y);
      await s.waitForTimeout(700);
    }
  }
  alles['e' + e] = await s.evaluate(() => {
    const wem = (el) => {
      const f = el.closest('[data-stueck]');
      return f ? f.getAttribute('data-stueck') : '(ohne)';
    };
    const kappt = v => v === 'hidden' || v === 'clip';
    const st = {};
    const hol = (w) => (st[w] = st[w] || { ueber: 0, klein: 0, winzig: 0, kleinste: 999,
                                           knoepfe: 0, zuKlein: 0, beispiele: [] });
    [...document.querySelectorAll('*')].forEach(el => {
      const c = getComputedStyle(el);
      const w = wem(el);
      if (el.children.length === 0 && (el.textContent || '').trim()) {
        const px = parseFloat(c.fontSize);
        const o = hol(w);
        if (px < 12) { o.klein++; if (px < o.kleinste) o.kleinste = Math.round(px * 10) / 10; }
        if (px < 10) o.winzig++;
      }
      const abY = el.scrollHeight > el.clientHeight + 1 && kappt(c.overflowY);
      const abX = el.scrollWidth > el.clientWidth + 1 && kappt(c.overflowX);
      if (abY || abX) {
        const o = hol(w);
        o.ueber++;
        if (o.beispiele.length < 6) o.beispiele.push(
          (typeof el.className === 'string' ? el.className : '').slice(0, 40) + ' :: '
          + (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50));
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
    return st;
  });
  await s.close();
}
await b.close();
const stuecke = new Set();
Object.values(alles).forEach(x => Object.keys(x).forEach(k => stuecke.add(k)));
const summe = {};
console.log(`LATTE 4 je Stueck, ${BREITE}x${HOEHE}, MIT Rollleiste`);
console.log(`${'Stueck'.padEnd(10)} ${'Ueberl.'.padStart(8)} ${'<12px'.padStart(7)} ${'<10px'.padStart(7)} ${'Knopf<24'.padStart(9)} ${'Knoepfe'.padStart(8)}  kleinste`);
[...stuecke].sort().forEach(k => {
  let u = 0, kl = 0, wz = 0, zk = 0, kn = 0, mini = 999;
  [1, 2, 3, 4].forEach(e => {
    const x = alles['e' + e][k]; if (!x) return;
    u += x.ueber; kl += x.klein; wz += x.winzig; zk += x.zuKlein; kn += x.knoepfe;
    if (x.kleinste < mini) mini = x.kleinste;
  });
  summe[k] = { ueber: u, klein: kl, winzig: wz, zuKlein: zk, knoepfe: kn, kleinste: mini };
  console.log(`${k.padEnd(10)} ${String(u).padStart(8)} ${String(kl).padStart(7)} ${String(wz).padStart(7)} ${String(zk).padStart(9)} ${String(kn).padStart(8)}  ${mini === 999 ? '-' : mini + 'px'}`);
});
const g = Object.values(summe).reduce((a, x) => ({ ueber: a.ueber + x.ueber, klein: a.klein + x.klein,
  zuKlein: a.zuKlein + x.zuKlein, knoepfe: a.knoepfe + x.knoepfe }), { ueber: 0, klein: 0, zuKlein: 0, knoepfe: 0 });
console.log(`${'SUMME'.padEnd(10)} ${String(g.ueber).padStart(8)} ${String(g.klein).padStart(7)} ${''.padStart(7)} ${String(g.zuKlein).padStart(9)} ${String(g.knoepfe).padStart(8)}`);
fs.mkdirSync(ZIEL.replace(/\/[^/]+$/, ''), { recursive: true });
fs.writeFileSync(ZIEL, JSON.stringify({ fenster: `${BREITE}x${HOEHE}`, jeEpoche: alles, summe }, null, 1));
console.log('\nBeispiele SUD:');
[1, 2, 3, 4].forEach(e => {
  const x = alles['e' + e].sud;
  if (x) console.log(` E${e} (${x.ueber} Ueberl., kleinste ${x.kleinste}px):`, JSON.stringify(x.beispiele));
});
