/* PROBE — schnelle Selbstkontrolle waehrend des Bauens.
     HAFEN=8899 node werkbank/schuss/erbe-w11/probe.mjs
   Ladezustand aller vier Epochen: Haushalt, Kaesten, gekuerzte Knoepfe,
   Buch auf/zu, Escape, verdeckt(), lage. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = process.env.HAFEN || '8899';
const W = 2752, H = 1536;
const WOCHEN = +(process.env.WOCHEN || 0);

const lies = () => {
  const B = window.BRAUHAUS;
  const bu = document.getElementById('buehne');
  const kx = 2752 / bu.clientWidth, ky = 1536 / bu.clientHeight;
  const m = B.haushalt.miss();
  const kaesten = [];
  bu.querySelectorAll('.fach-erbe *').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width < 3 || r.height < 3) return;
    const c = getComputedStyle(el);
    if (c.visibility === 'hidden' || c.display === 'none' || parseFloat(c.opacity) < 0.05) return;
    const rgba = t => { const q = String(t).match(/rgba?\(([^)]+)\)/); if (!q) return null;
      const p = q[1].split(',').map(parseFloat); return p.length > 3 ? p[3] : 1; };
    const a = rgba(c.backgroundColor);
    const bw = ['borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth'].map(k => parseFloat(c[k]) || 0);
    const ab = rgba(c.borderTopColor) ?? rgba(c.borderBottomColor);
    const kasten = (a !== null && a > 0.35) || /gradient/.test(c.backgroundImage || 'none')
                 || (Math.max(...bw) >= 1 && ab !== null && ab > 0.3);
    let clip = false, p = el;
    while (p && p !== document.documentElement) {
      if (/inset\(\s*50%/.test(getComputedStyle(p).clipPath || '')) { clip = true; break; }
      p = p.parentNode;
    }
    if (!kasten || clip) return;
    kaesten.push({ k: String(el.className || '').slice(0, 48),
      mass: Math.round(r.width * kx) + 'x' + Math.round(r.height * ky)
          + ' @' + Math.round(r.x * kx) + ',' + Math.round(r.y * ky),
      px: Math.round(r.width * r.height * kx * ky) });
  });
  kaesten.sort((x, y) => y.px - x.px);
  const gek = [];
  document.querySelectorAll('#buehne button[data-preis]').forEach(k => {
    k.querySelectorAll('*').forEach(t => {
      if (t.children.length) return;
      const txt = (t.textContent || '').trim();
      if (/…|\.\.\.$/.test(txt) || t.scrollWidth > t.clientWidth + 1) {
        gek.push(k.getAttribute('data-zug') + ' :: ' + txt.slice(0, 44));
      }
    });
  });
  /* jeder erbe-Knopf: wird er vom Mauszeiger getroffen? */
  const treffbar = [];
  document.querySelectorAll('.fach-erbe button[data-zug]').forEach(k => {
    const r = k.getBoundingClientRect();
    const t = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    treffbar.push(k.getAttribute('data-zug') + (k.contains(t) ? '' : ' !!VERDECKT von .' + (t ? t.className : '?')));
  });
  const buch = document.querySelector('.erb-buch');
  return {
    erbe: m.je.erbe || null, gesamt: m.gesamt, oben: m.oben,
    kaesten, gek, treffbar,
    buch: buch ? { mass: Math.round(buch.getBoundingClientRect().width * kx) + 'x'
                       + Math.round(buch.getBoundingClientRect().height * ky),
                   zuege: buch.querySelectorAll('[data-zug]').length,
                   scroll: buch.scrollHeight + '/' + buch.clientHeight,
                   klasse: buch.className } : null,
    buchOffen: B.erbe.stand().buchOffen,
    pruefe: B.haushalt.pruefe(), tafeln: B.haushalt.tafeln().map(t => t.stueck + ' ' + t.klasse),
    geklemmt: B.haushalt.geklemmt(), ohneGriff: B.haushalt.ohneGriff ? B.haushalt.ohneGriff() : null,
    blaetter: B.haushalt.blaetter().map(t => t.stueck + ' ' + t.klasse),
    ueberRand: B.haushalt.ueberRand(),
    verdeckt: B.stadt.rahmen.verdeckt(), lage: B.lage.length,
    lageTexte: B.lage.slice(0, 4).map(String),
    zuege: B.zuege ? B.zuege().length : 'n/a'
  };
};

const b = await chromium.launch();
for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: W, height: H } });
  const fehler = [];
  s.on('pageerror', x => fehler.push(String(x)));
  s.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1600);
  for (let i = 0; i < WOCHEN; i++) {
    await s.evaluate(() => { const k = document.querySelector('[data-zug="weiter"]'); if (k) k.click(); });
    await s.waitForTimeout(180);
  }
  await s.waitForTimeout(700);
  const d = await s.evaluate(lies);
  console.log(`\n===== E${e} ${WOCHEN ? 'w' + WOCHEN : 'laden'} =====`);
  console.log(' erbe:', d.erbe ? `${d.erbe.px}/${d.erbe.grenze} px · oben ${d.erbe.obenPx}/${d.erbe.grenzeOben} · ${d.erbe.kaesten} Kaesten` : 'KEIN KASTEN');
  console.log(' gesamt:', d.gesamt.anteil.toFixed(1) + ' %  oben ' + d.oben.anteil.toFixed(1) + ' %');
  d.kaesten.forEach(k => console.log(`   ${String(k.px).padStart(6)} px  ${k.mass.padEnd(24)} .${k.k}`));
  console.log(' Buch:', JSON.stringify(d.buch), 'offen:', d.buchOffen);
  console.log(' gekuerzt mit Preisschild:', JSON.stringify(d.gek));
  console.log(' treffbar:', d.treffbar.join(' | '));
  console.log(' pruefe:', JSON.stringify(d.pruefe));
  console.log(' tafeln:', JSON.stringify(d.tafeln), 'blaetter:', JSON.stringify(d.blaetter));
  console.log(' geklemmt:', JSON.stringify(d.geklemmt), 'ohneGriff:', JSON.stringify(d.ohneGriff), 'ueberRand:', d.ueberRand.length);
  console.log(' verdeckt:', JSON.stringify(d.verdeckt), 'lage:', d.lage, d.lageTexte.join(' | '), 'Zuege:', d.zuege, 'Fehler:', fehler.length, fehler.slice(0, 3).join(' | '));

  /* Buch aufschlagen und wieder zu — der eigene Griff */
  const auf = await s.evaluate(async () => {
    const k = document.querySelector('[data-zug="erbe:buch"]');
    if (!k) return 'kein Griff';
    k.click();
    return 'geklickt';
  });
  await s.waitForTimeout(900);
  const d2 = await s.evaluate(lies);
  console.log(' -- Griff:', auf, '· Buch:', JSON.stringify(d2.buch), 'offen:', d2.buchOffen,
              '· erbe', d2.erbe ? d2.erbe.px + ' px (oben ' + d2.erbe.obenPx + ')' : '—',
              '· blaetter', JSON.stringify(d2.blaetter), '· verdeckt', JSON.stringify(d2.verdeckt));
  await s.keyboard.press('Escape');
  await s.waitForTimeout(1200);
  const d3 = await s.evaluate(lies);
  console.log(' -- nach Escape: Buch offen:', d3.buchOffen, '· im DOM:', !!d3.buch,
              '· geklemmt', JSON.stringify(d3.geklemmt), '· erbe', d3.erbe ? d3.erbe.px : '—',
              '· lage', d3.lage, '· Fehler', fehler.length);
  /* und noch einmal auf, dann mit dem eigenen Schliessknopf zu.
     3,2 s Pause: das Escape-Fenster des Rahmens fasst ueber 2,6 s nach
     (kern/haushalt.js, ANLAEUFE) und macht ein Blatt, das INNERHALB dieser
     Frist wieder aufgeht, sofort wieder zu. Beim ersten Anlauf habe ich nur
     1,2 s gewartet und daraufhin „KEIN SCHLIESSKNOPF" gemessen — das war
     nicht das Buch, das war die Uhr des Rahmens. */
  await s.waitForTimeout(3200);
  await s.evaluate(() => { const k = document.querySelector('[data-zug="erbe:buch"]'); if (k) k.click(); });
  await s.waitForTimeout(800);
  const zu = await s.evaluate(() => {
    const k = document.querySelector('[data-zug="erbe:buch:zu"]');
    if (!k) return 'KEIN SCHLIESSKNOPF';
    k.click(); return 'geklickt';
  });
  await s.waitForTimeout(800);
  const d4 = await s.evaluate(lies);
  console.log(' -- Schliessknopf:', zu, '· Buch im DOM:', !!d4.buch, '· erbe', d4.erbe ? d4.erbe.px : '—',
              '· Fehler', fehler.length, fehler.slice(0, 2).join(' | '));
  await s.close();
}
await b.close();
