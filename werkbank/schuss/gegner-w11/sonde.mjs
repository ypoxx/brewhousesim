/* SONDE — was DER GEGNER ins Bild stellt, Kasten fuer Kasten.
 *
 *   HAFEN=8961 EPOCHE=3 node werkbank/schuss/gegner-w11/sonde.mjs <name>
 *   WOCHEN=30 ESC=1 BAUEN=34 …
 *
 * Sie macht KEINE Aufnahme und misst keine Bildpunkte — sie liest nur das DOM
 * und den Haushalt des Rahmens. Deshalb ist sie billig und darf oft laufen.
 * Die photographische Zahl kommt aus rahmen-w10/messen.mjs bzw.
 * bild-w9/deckung.mjs; diese hier sagt, WO die Flaeche steckt.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';

const HAFEN  = process.env.HAFEN || '8961';
const W = 2752, H = 1536;
const WOCHEN = +(process.env.WOCHEN || 0);
const ESC    = +(process.env.ESC || 0);
const BAUEN  = +(process.env.BAUEN || 0);
const EPOCHEN = (process.env.EPOCHE || '1,2,3,4').split(',').map(Number);
const NAME   = process.argv[2] || 'sonde';
const ZIEL   = 'werkbank/schuss/gegner-w11/messungen';
mkdirSync(ZIEL, { recursive: true });

const lies = () => {
  const rgba = t => { const m = String(t).match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(',').map(parseFloat); return p.length > 3 ? p[3] : 1; };
  const weg = (el) => {                       /* clip-path vererbt sich nicht */
    let n = el;
    while (n && n.nodeType === 1 && n.id !== 'buehne') {
      const c = getComputedStyle(n);
      if (/inset\(\s*50%/.test(c.clipPath || '') || parseFloat(c.opacity) < 0.05
          || c.visibility === 'hidden' || c.display === 'none') return true;
      n = n.parentElement;
    }
    return false;
  };
  const kaesten = [];
  const schnitt = [];
  document.querySelectorAll('#buehne *').forEach(el => {
    const c = getComputedStyle(el);
    if (c.visibility === 'hidden' || c.display === 'none') return;
    const r = el.getBoundingClientRect();
    if (r.width < 3 || r.height < 3) return;
    if (r.width >= innerWidth * 0.98 && r.height >= innerHeight * 0.98) return;
    const f = el.closest('.fach');
    const st = (f && f.getAttribute('data-stueck')) || 'ohne-fach';
    const a = rgba(c.backgroundColor);
    const bw = ['borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth']
      .map(k => parseFloat(c[k]) || 0);
    const ab = rgba(c.borderTopColor) ?? rgba(c.borderBottomColor);
    const kasten = (a !== null && a > 0.35) || /gradient/.test(c.backgroundImage || '')
      || (Math.max(...bw) >= 1 && ab !== null && ab > 0.3);
    const kl = String(el.className && el.className.baseVal !== undefined
      ? el.className.baseVal : (el.className || ''));
    if (kasten && !weg(el) && st === 'gegner') {
      kaesten.push({ klasse: kl.slice(0, 46), tag: el.tagName.toLowerCase(),
        x: Math.round(r.x), y: Math.round(r.y), b: Math.round(r.width), h: Math.round(r.height),
        flaeche: Math.round(r.width * r.height),
        raus: (r.x < -0.5 || r.y < -0.5 || r.right > innerWidth + 0.5 || r.bottom > innerHeight + 0.5),
        text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 46) });
    }
    /* abgeschnittener Text — egal welches Stueck, aber mit Zuordnung */
    if (el.children.length === 0 && el.scrollWidth > el.clientWidth + 2 && c.overflowX !== 'visible') {
      schnitt.push({ stueck: st, klasse: kl.slice(0, 40), soll: el.scrollWidth, ist: el.clientWidth,
        ellipse: c.textOverflow, text: (el.textContent || '').trim().slice(0, 60) });
    }
  });
  /* die gemalten Ortsschilder der STADT — an denen darf die Karte nicht kratzen */
  const schilder = [];
  document.querySelectorAll('#buehne .fach[data-stueck="stadt"] *').forEach(el => {
    const t = (el.textContent || '').trim().replace(/\s+/g, ' ');
    if (!t) return;
    if (el.children.length) return;
    const r = el.getBoundingClientRect();
    if (r.width < 20 || r.height < 8) return;
    schilder.push({ text: t.slice(0, 40), klasse: String(el.className || '').slice(0, 40),
      x: Math.round(r.x), y: Math.round(r.y), b: Math.round(r.width), h: Math.round(r.height) });
  });

  /* A3 — schneidet IRGENDEIN Ding des GEGNERS eine gemalte Beschriftung an?
     Gefragt sind die vier, die die Auflage nennt, und zwar unabhaengig davon,
     ob das Ding ein Kasten ist: ein Hofbild deckt genauso zu wie eine Karte. */
  const VIER = /ST\. MICHAEL|GASTHOF LINDENHOF|BRAUEREI ADLER|BRAUSTATT ADLER|BRAUHAUS ZUM ADLER|ADLER-BR|NORDSTERN-GRUPPE|BRAUHAUS$|ZUM ANKER|GEGR\./i;
  const ziele = schilder.filter(v => VIER.test(v.text));
  const treffer = [];
  document.querySelectorAll('#buehne .fach[data-stueck="gegner"] *').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width < 6 || r.height < 6) return;
    const c = getComputedStyle(el);
    if (c.visibility === 'hidden' || c.display === 'none') return;
    if (parseFloat(c.opacity) < 0.05) return;
    let n = el, weg = false;
    while (n && n.nodeType === 1 && n.id !== 'buehne') {
      const cc = getComputedStyle(n);
      if (/inset\(\s*50%/.test(cc.clipPath || '')) { weg = true; break; }
      n = n.parentElement;
    }
    if (weg) return;
    const kl = String(el.className && el.className.baseVal !== undefined
      ? el.className.baseVal : (el.className || ''));
    ziele.forEach(v => {
      const ux = Math.max(0, Math.min(r.right, v.x + v.b) - Math.max(r.x, v.x));
      const uy = Math.max(0, Math.min(r.bottom, v.y + v.h) - Math.max(r.y, v.y));
      if (ux > 1 && uy > 1) treffer.push({ schild: v.text, ueber: Math.round(ux * uy),
        klasse: kl.slice(0, 40), tag: el.tagName.toLowerCase(),
        mass: `${Math.round(r.width)}×${Math.round(r.height)} @${Math.round(r.x)},${Math.round(r.y)}` });
    });
  });

  /* A10 — abgeschnittene ZAHLEN. Ein Text, dessen Kasten schmaler ist als
     sein Inhalt, gilt hier auch dann als abgeschnitten, wenn er ueber den
     Rand seines Elternteils quillt statt weggeschnitten zu werden — beides
     macht eine Zahl unlesbar oder falsch lesbar. */
  const zahlen = [];
  document.querySelectorAll('#buehne .fach[data-stueck="gegner"] *').forEach(el => {
    if (el.children.length) return;
    const t = (el.textContent || '').trim();
    if (!t || !/\d/.test(t)) return;
    const c = getComputedStyle(el);
    if (c.visibility === 'hidden' || c.display === 'none') return;
    const eng = el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0;
    const p = el.parentElement;
    let quillt = false;
    if (p) {
      const r = el.getBoundingClientRect(), q = p.getBoundingClientRect();
      quillt = r.right > q.right + 1.5 || r.x < q.x - 1.5;
    }
    if (eng || quillt) zahlen.push({ klasse: String(el.className || '').slice(0, 30),
      soll: el.scrollWidth, ist: el.clientWidth, quillt, ellipse: c.textOverflow,
      text: t.slice(0, 40) });
  });
  const h = (BRAUHAUS.haushalt ? BRAUHAUS.haushalt.miss() : null);
  return {
    kaesten: kaesten.sort((a, b) => b.flaeche - a.flaeche),
    schnitt: schnitt.sort((a, b) => (b.soll - b.ist) - (a.soll - a.ist)).slice(0, 24),
    schilder, treffer, zahlen,
    haushalt: h ? { gesamt: h.gesamt, oben: h.oben, gegner: h.je.gegner || null } : null,
    pruefe: BRAUHAUS.haushalt ? BRAUHAUS.haushalt.pruefe() : null,
    ueberRand: BRAUHAUS.haushalt ? BRAUHAUS.haushalt.ueberRand() : null,
    tafeln: BRAUHAUS.haushalt ? BRAUHAUS.haushalt.tafeln() : null,
    geklemmt: BRAUHAUS.haushalt ? BRAUHAUS.haushalt.geklemmt() : null,
    /* Die Bedienung des Stuecks, Zug fuer Zug — damit ein Vorher/Nachher
       beweisen kann, dass nichts vom Schirm verschwunden ist. `hit` sagt,
       ob die Maus den Knopf an seiner Mitte wirklich trifft. */
    gegnerzuege: [...document.querySelectorAll('#buehne [data-zug^="gegner:"]')].map(el => {
      const r = el.getBoundingClientRect();
      let hit = false;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (r.width > 0 && cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
        const t = document.elementFromPoint(cx, cy);
        hit = !!(t && (t === el || el.contains(t)));
      }
      return { zug: el.getAttribute('data-zug'), aus: !!el.disabled, hit,
        b: Math.round(r.width), h: Math.round(r.height),
        preis: el.getAttribute('data-preis'),
        text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 44) };
    }).sort((a, b) => a.zug.localeCompare(b.zug)),
    lage: (BRAUHAUS.lage || []).length,
    lagetext: (BRAUHAUS.lage || []).slice(0, 4).map(String),
    verdeckt: (() => { try { return BRAUHAUS.stadt.rahmen.verdeckt(); } catch (x) { return 'FEHLER'; } })(),
    zuege: (() => { try { return document.querySelectorAll('#buehne [data-zug]').length; } catch (x) { return -1; } })()
  };
};

const b = await chromium.launch();
const aus = [];
const daten = {};
for (const e of EPOCHEN) {
  const s = await b.newPage({ viewport: { width: W, height: H } });
  const fehler = [];
  s.on('pageerror', x => fehler.push(x.message));
  s.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1600);
  for (let i = 0; i < BAUEN; i++) {              /* der Zustand des Kritikers */
    await s.evaluate(() => {
      const auf = document.querySelector('[data-zug="stadt:bauhof"]'); if (auf) auf.click();
    });
    await s.waitForTimeout(120);
    await s.evaluate(() => {
      const k = [...document.querySelectorAll('[data-zug^="stadt:bau:"]')].filter(x => !x.disabled);
      k.slice(0, 5).forEach(x => x.click());
    });
    await s.waitForTimeout(120);
    await s.evaluate(() => {
      const zu = document.querySelector('[data-zug="stadt:bauhof"]'); if (zu) zu.click();
    });
    await s.evaluate(() => { const k = document.querySelector('[data-zug="weiter"]'); if (k) k.click(); });
    await s.waitForTimeout(180);
  }
  for (let i = 0; i < WOCHEN; i++) {
    await s.evaluate(() => { const k = document.querySelector('[data-zug="weiter"]'); if (k) k.click(); });
    await s.waitForTimeout(180);
  }
  for (let i = 0; i < ESC; i++) { await s.keyboard.press('Escape'); await s.waitForTimeout(250); }
  await s.waitForTimeout(800);
  const d = await s.evaluate(lies);
  d.fehler = fehler.length; d.fehlertext = fehler.slice(0, 3);
  daten[e] = d;
  const gg = d.haushalt && d.haushalt.gegner;
  aus.push(`\n=== EPOCHE ${e}${BAUEN ? ' nach ' + BAUEN + ' Baurunden' : ''}${WOCHEN ? ' nach ' + WOCHEN + ' Wochen' : ''}${ESC ? ' +' + ESC + '× Esc' : ''}`
    + `  lage ${d.lage} Seitenfehler ${d.fehler} verdeckt ${d.verdeckt} Zuege ${d.zuege}`);
  aus.push(`  HAUSHALT gesamt ${Math.round(d.haushalt.gesamt.px)} px (${d.haushalt.gesamt.anteil.toFixed(1)} %)`
    + `  oben ${Math.round(d.haushalt.oben.px)} px (${d.haushalt.oben.anteil.toFixed(1)} %)`);
  aus.push(`  GEGNER   ${gg ? gg.px + '/' + gg.grenze + ' px   oben ' + gg.obenPx + '/' + gg.grenzeOben + ' px   ' + gg.kaesten + ' Kaesten' : '— nichts'}`);
  aus.push(`  pruefe(): ${JSON.stringify(d.pruefe)}`);
  aus.push(`  ueberRand(): ${JSON.stringify(d.ueberRand)}`);
  aus.push(`  tafeln(): ${JSON.stringify(d.tafeln)}`);
  aus.push(`  geklemmt(): ${JSON.stringify(d.geklemmt)}`);
  aus.push(`  Kaesten des GEGNERS (Huelle, groesste zuerst):`);
  d.kaesten.slice(0, 22).forEach(k => aus.push(
    `    ${String(k.flaeche).padStart(7)} px²  ${String(k.b).padStart(4)}×${String(k.h).padStart(3)} @${k.x},${k.y}`
    + `${k.raus ? ' RAUS' : ''}  .${k.klasse}  „${k.text}"`));
  aus.push(`    (${d.kaesten.length} Kaesten, Summe der Huellen ${d.kaesten.reduce((a, k) => a + k.flaeche, 0)} px²)`);
  aus.push(`  BEDIENUNG des GEGNERS: ${d.gegnerzuege.length} Zuege, `
    + `${d.gegnerzuege.filter(z => z.hit).length} von der Maus zu treffen, `
    + `${d.gegnerzuege.filter(z => z.aus).length} abgeschaltet, `
    + `${d.gegnerzuege.filter(z => z.preis !== null).length} mit Preisschild, `
    + `${d.gegnerzuege.filter(z => Math.min(z.b, z.h) < 24).length} unter 24 px`);
  d.gegnerzuege.forEach(z => aus.push(`    ${z.hit ? ' ' : '!'} ${z.zug.padEnd(30)} `
    + `${String(z.b).padStart(4)}×${String(z.h).padStart(3)} ${z.aus ? 'AUS' : '   '} `
    + `${(z.preis === null ? '' : z.preis).padStart(9)}  „${z.text}"`));
  aus.push(`  A3 — GEGNER auf gemalter Beschriftung: ${d.treffer.length}`);
  d.treffer.forEach(t => aus.push(`    „${t.schild}"  ${t.ueber} px² unter ${t.tag}.${t.klasse}  ${t.mass}`));
  aus.push(`  A10 — abgeschnittene/quellende ZAHLEN des GEGNERS: ${d.zahlen.length}`);
  d.zahlen.forEach(z => aus.push(`    ${z.soll} px in ${z.ist} px${z.quillt ? ' QUILLT' : ''}  ${z.ellipse}  .${z.klasse}  „${z.text}"`));
  aus.push(`  ORTSSCHILDER der STADT:`);
  d.schilder.forEach(v => aus.push(`    ${String(v.b).padStart(4)}×${String(v.h).padStart(3)} @${v.x},${v.y}  „${v.text}"  .${v.klasse}`));
  aus.push(`  ABGESCHNITTENER TEXT (alle Stuecke, groesster Verlust zuerst):`);
  d.schnitt.forEach(v => aus.push(`    ${v.stueck.padEnd(7)} ${String(v.soll).padStart(5)} px in ${String(v.ist).padStart(4)} px  ${v.ellipse}  .${v.klasse}  „${v.text}"`));
  await s.close();
}
await b.close();
const txt = aus.join('\n') + '\n';
console.log(txt);
writeFileSync(`${ZIEL}/${NAME}.txt`, txt);
writeFileSync(`${ZIEL}/${NAME}.json`, JSON.stringify(daten));
