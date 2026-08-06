/* SONDE — was DAS ERBE gerade auf den Schirm legt, Kasten fuer Kasten.
     HAFEN=8941 [WOCHEN=30] [ESCAPE=1] node werkbank/schuss/erbe-w11/sonde.mjs

   Nutzt den Haushalt des Rahmens (kern/haushalt.js) als Innensicht: er kennt
   `clip-path`-Vererbung und rechnet auf die Bezugsflaeche 2752x1536 um.
   Dazu die Liste der erbe-Kaesten mit Mass und Klasse, damit man sieht,
   WELCHER Kasten die Bildpunkte traegt. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8941';
const W = 2752, H = 1536;
const WOCHEN = +(process.env.WOCHEN || 0);
const MARKE = process.env.MARKE || 'sonde';

const b = await chromium.launch();
const aus = [];
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
  if (process.env.ESCAPE) { await s.keyboard.press('Escape'); await s.waitForTimeout(400); }
  await s.waitForTimeout(700);

  const d = await s.evaluate(() => {
    const B = window.BRAUHAUS;
    const m = B.haushalt.miss();
    const bu = document.getElementById('buehne');
    const SK = (2752 * 1536) / (bu.clientWidth * bu.clientHeight);
    /* jeden erbe-Kasten einzeln auflisten */
    const kaesten = [];
    bu.querySelectorAll('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width < 3 || r.height < 3) return;
      let n = el, stueck = null;
      while (n && n !== bu) {
        const f = String(n.className && n.className.baseVal !== undefined ? n.className.baseVal : (n.className || ''));
        const mm = f.match(/(?:^|\s)fach-([a-z]+)/);
        if (mm) { stueck = mm[1]; break; }
        n = n.parentNode;
      }
      if (stueck !== 'erbe') return;
      const c = getComputedStyle(el);
      if (c.visibility === 'hidden' || c.display === 'none') return;
      const rgba = t => { const q = String(t).match(/rgba?\(([^)]+)\)/); if (!q) return null;
        const p = q[1].split(',').map(parseFloat); return p.length > 3 ? p[3] : 1; };
      const a = rgba(c.backgroundColor);
      const bw = ['borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth'].map(k => parseFloat(c[k]) || 0);
      const ab = rgba(c.borderTopColor) ?? rgba(c.borderBottomColor);
      const kasten = (a !== null && a > 0.35) || /gradient/.test(c.backgroundImage || 'none')
                   || (Math.max(...bw) >= 1 && ab !== null && ab > 0.3);
      /* weggeschnitten? den Weg nach oben gehen */
      let clip = false, p = el;
      while (p && p !== document.documentElement) {
        const cc = getComputedStyle(p);
        if (/inset\(\s*50%/.test(cc.clipPath || '')) { clip = true; break; }
        p = p.parentNode;
      }
      if (!kasten || clip) return;
      kaesten.push({
        klasse: String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : (el.className || '')).slice(0, 60),
        tag: el.tagName.toLowerCase(),
        mass: Math.round(r.width * (2752 / bu.clientWidth)) + 'x' + Math.round(r.height * (1536 / bu.clientHeight))
            + ' @' + Math.round(r.x * (2752 / bu.clientWidth)) + ',' + Math.round(r.y * (1536 / bu.clientHeight)),
        px: Math.round(r.width * r.height * SK),
        oben: r.y < bu.clientHeight / 6
      });
    });
    kaesten.sort((x, y) => y.px - x.px);
    /* Auslassungszeichen an Knoepfen mit Preisschild */
    const gekuerzt = [];
    document.querySelectorAll('#buehne button').forEach(k => {
      const pr = k.querySelector('.preis');
      k.querySelectorAll('*').forEach(t => {
        if (t.children.length) return;
        const txt = (t.textContent || '').trim();
        const abgeschnitten = t.scrollWidth > t.clientWidth + 1;
        if (/…|\.\.\.$/.test(txt) || abgeschnitten) {
          gekuerzt.push({ zug: k.getAttribute('data-zug'), preis: !!pr, text: txt.slice(0, 50),
                          scroll: t.scrollWidth, client: t.clientWidth });
        }
      });
    });
    const buch = document.querySelector('.erb-buch');
    return {
      erbe: m.je.erbe || null,
      gesamt: m.gesamt, obenGesamt: m.oben,
      kaesten,
      pruefe: B.haushalt.pruefe(),
      tafeln: B.haushalt.tafeln().map(t => t.stueck + ' ' + t.klasse + ' ' + t.mass),
      ueberRand: B.haushalt.ueberRand(),
      geklemmt: B.haushalt.geklemmt ? B.haushalt.geklemmt() : null,
      blaetter: B.haushalt.blaetter ? B.haushalt.blaetter().map(t => t.stueck + ' ' + t.klasse) : null,
      verdeckt: B.stadt && B.stadt.rahmen ? B.stadt.rahmen.verdeckt() : 'n/a',
      lage: B.lage.length, lageTexte: B.lage.slice(0, 5).map(String),
      gekuerzt,
      buchZuege: buch ? buch.querySelectorAll('[data-zug]').length : 'kein buch',
      buchMass: buch ? Math.round(buch.getBoundingClientRect().width * (2752 / bu.clientWidth)) + 'x'
                     + Math.round(buch.getBoundingClientRect().height * (1536 / bu.clientHeight)) : '-',
      zuege: B.zuege ? B.zuege().length : 'n/a'
    };
  });
  d.epoche = e; d.fehler = fehler;
  aus.push(d);
  console.log(`\n=== E${e} ${WOCHEN ? 'w' + WOCHEN : 'laden'}${process.env.ESCAPE ? '+esc' : ''} ===`);
  console.log('erbe:', d.erbe ? `${d.erbe.px} px (Grenze ${d.erbe.grenze}) · oben ${d.erbe.obenPx} (${d.erbe.grenzeOben}) · ${d.erbe.kaesten} Kaesten` : 'kein Kasten');
  console.log('gesamt:', Math.round(d.gesamt.px), 'px =', d.gesamt.anteil.toFixed(1) + ' %  oben', d.obenGesamt.anteil.toFixed(1) + ' %');
  console.log('buch:', d.buchMass, '· data-zug darin:', d.buchZuege);
  d.kaesten.slice(0, 14).forEach(k => console.log(`   ${String(k.px).padStart(7)} px  ${k.mass.padEnd(22)} ${k.tag} .${k.klasse}`));
  console.log('gekuerzt:', JSON.stringify(d.gekuerzt.slice(0, 8)));
  console.log('pruefe:', JSON.stringify(d.pruefe));
  console.log('tafeln:', JSON.stringify(d.tafeln), '· ueberRand:', d.ueberRand.length, '· verdeckt:', d.verdeckt, '· lage:', d.lage, d.lageTexte.join(' | '), '· Fehler:', fehler.length, fehler.slice(0,3).join(' | '));
  await s.close();
}
await b.close();
writeFileSync(`werkbank/schuss/erbe-w11/messungen/${MARKE}.json`, JSON.stringify(aus, null, 1));
console.log('\ngeschrieben: werkbank/schuss/erbe-w11/messungen/' + MARKE + '.json');
