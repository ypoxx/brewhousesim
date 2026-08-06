/* DER ZUSTAND DES BLINDEN KRITIKERS — 34 Runden bauen, dann Escape.
   Nur dort hat er die zwei leeren Rechtecke (Auflage R5) und den Kasten
   ueber dem Bildrand (R3) gesehen; im Lade- und im 30-Wochen-Zustand
   erscheinen beide nicht.
     HAFEN=8931 NAME=nachher node werkbank/schuss/rahmen-w10/gebautprobe.mjs  */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
const HAFEN = process.env.HAFEN || '8931';
const NAME = process.env.NAME || 'lauf';
const RUNDEN = +(process.env.RUNDEN || 34);
const ZIEL = 'werkbank/schuss/rahmen-w10/messungen';
mkdirSync(ZIEL, { recursive: true });
const b = await chromium.launch();
const zeilen = [];
for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: 2752, height: 1536 } });
  const f = [];
  s.on('pageerror', x => f.push(x.message));
  s.on('console', m => { if (m.type() === 'error') f.push(m.text()); });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1800);
  for (let i = 0; i < RUNDEN; i++) {
    await s.evaluate(() => { const k = document.querySelector('[data-zug="stadt:bauhof"]'); if (k && !k.disabled) k.click(); });
    await s.waitForTimeout(120);
    for (let r = 0; r < 5; r++) {
      const ok = await s.evaluate(() => {
        const k = [...document.querySelectorAll('[data-zug^="stadt:bau:"]')]
          .filter(el => !el.disabled && (el.dataset.zug || '') !== 'stadt:bau:seite');
        if (!k.length) return false; k[0].click(); return true;
      });
      if (!ok) break;
      await s.waitForTimeout(120);
    }
    await s.evaluate(() => { const k = document.querySelector('[data-zug="stadt:bauhof"]'); if (k && !k.disabled) k.click(); });
    await s.waitForTimeout(90);
    await s.evaluate(() => { const k = document.querySelector('[data-zug="weiter"]'); if (k) k.click(); });
    await s.waitForTimeout(160);
  }
  await s.keyboard.press('Escape');
  await s.waitForTimeout(1600);

  const d = await s.evaluate(() => {
    /* fehlende Glyphen — derselbe Abdruck wie in messen.mjs */
    const cv = document.createElement('canvas'); cv.width = 64; cv.height = 64;
    const c = cv.getContext('2d', { willReadFrequently: true });
    const abdruck = (font, ch) => {
      c.clearRect(0, 0, 64, 64); c.font = font; c.fillStyle = '#000'; c.textBaseline = 'alphabetic';
      c.fillText(ch, 4, 48);
      const dd = c.getImageData(0, 0, 64, 64).data;
      let h = 2166136261;
      for (let i = 3; i < dd.length; i += 4) { h ^= (dd[i] > 40 ? 1 : 0); h = Math.imul(h, 16777619); }
      return h >>> 0;
    };
    const gesehen = new Map(); const fehlt = [];
    const w = document.createTreeWalker(document.getElementById('buehne'), NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      const t = n.nodeValue; if (!t || !t.trim()) continue;
      const el = n.parentElement; if (!el) continue;
      const st = getComputedStyle(el);
      if (st.visibility === 'hidden' || st.display === 'none') continue;
      const font = `${st.fontStyle} ${st.fontWeight} 40px ${st.fontFamily}`;
      for (const ch of new Set(t)) {
        if (ch.codePointAt(0) < 0x80) continue;
        const k = font + '|' + ch;
        if (gesehen.has(k)) continue;
        const leer = abdruck(font, ch) === abdruck(font, '￿');
        gesehen.set(k, leer);
        if (leer) fehlt.push({ ch, code: 'U+' + ch.codePointAt(0).toString(16).toUpperCase(),
                               font: st.fontFamily.slice(0, 30), text: t.trim().slice(0, 30) });
      }
    }
    /* ueber dem Rand — dieselbe Kastenregel wie bild-w9 */
    const rgba = t => { const m = String(t).match(/rgba?\(([^)]+)\)/); if (!m) return null;
      const p = m[1].split(',').map(parseFloat); return p.length > 3 ? p[3] : 1; };
    const raus = []; const tafeln = [];
    document.querySelectorAll('#buehne *').forEach(el => {
      const st = getComputedStyle(el);
      if (st.visibility === 'hidden' || st.display === 'none') return;
      if (/inset\(\s*50%/.test(st.clipPath || '')) return;
      if (el.closest('.stadt-zugeklappt,.stadt-verdeckt,.kern-blatt-zu')) return;
      const r = el.getBoundingClientRect();
      if (r.width < 3 || r.height < 3) return;
      if (r.width >= innerWidth * 0.98 && r.height >= innerHeight * 0.98) return;
      const a = rgba(st.backgroundColor);
      const bw = ['borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth']
        .map(k => parseFloat(st[k]) || 0);
      const ab = rgba(st.borderTopColor) ?? rgba(st.borderBottomColor);
      if (!((a !== null && a > 0.35) || /gradient/.test(st.backgroundImage || '')
            || (Math.max(...bw) >= 1 && ab !== null && ab > 0.3))) return;
      const fa = el.closest('.fach');
      const eintrag = { st: fa && fa.getAttribute('data-stueck'),
        kl: String(el.className || '').slice(0, 45),
        m: `${Math.round(r.width)}×${Math.round(r.height)} @${Math.round(r.x)},${Math.round(r.y)}`,
        fl: Math.round(r.width * r.height),
        text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30) };
      if (r.x < -0.5 || r.y < -0.5 || r.right > innerWidth + 0.5 || r.bottom > innerHeight + 0.5) raus.push(eintrag);
      if (eintrag.fl > 200000) tafeln.push(eintrag);
    });
    return { fehlt, raus, tafeln, lage: (BRAUHAUS.lage || []).length,
      verdeckt: (function () { try { return BRAUHAUS.stadt.rahmen.verdeckt().length; } catch (x) { return 'x'; } }()),
      jahr: BRAUHAUS.welt.zeit.jahr };
  });
  zeilen.push(`=== E${e} nach ${RUNDEN} Baurunden + 1 Escape   Jahr ${d.jahr}  lage ${d.lage}  Seitenfehler ${f.length}  verdeckt ${d.verdeckt}`);
  zeilen.push(`  FEHLENDE ZEICHEN: ${d.fehlt.length}` + d.fehlt.map(x => `\n    ${x.code} „${x.ch}" in ${x.font} — „${x.text}"`).join(''));
  zeilen.push(`  UEBER DEM RAND: ${d.raus.length}` + d.raus.map(x => `\n    ${x.st} .${x.kl} ${x.m} „${x.text}"`).join(''));
  zeilen.push(`  TAFELN ueber 200.000 px²: ${d.tafeln.length}` + d.tafeln.map(x => `\n    ${x.st} .${x.kl} ${x.m} = ${x.fl}`).join(''));
  await s.screenshot({ path: `${ZIEL}/${NAME}-e${e}-gebaut.png` });
  await s.screenshot({ path: `${ZIEL}/${NAME}-e${e}-ecke.png`, clip: { x: 2352, y: 900, width: 400, height: 260 } });
  await s.close();
}
await b.close();
const txt = zeilen.join('\n') + '\n';
console.log(txt);
writeFileSync(`${ZIEL}/${NAME}-gebaut.txt`, txt);
