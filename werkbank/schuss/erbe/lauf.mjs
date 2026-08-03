/* DAS ERBE, am Bildschirm gezaehlt.
   HAFEN=8899 node werkbank/schuss/erbe/lauf.mjs <epoche> <wochen> [stil]
   stil: 'weiter' | 'vorsorge' (schreibt, was bezahlbar ist) | 'leibgeding' | 'abfindung'

   Liest die Zahlen, die auf der Erbtafel stehen — innerText, nicht Quelltext —
   und daneben den Haken auf welt.erbe.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const EP = +(process.argv[2] || 1), WOCHEN = +(process.argv[3] || 140), STIL = process.argv[4] || 'weiter';
const HAFEN = process.env.HAFEN || '8899';

const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
const fehler = [];
s.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
s.on('pageerror', e => fehler.push('pageerror: ' + e.message));

await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(800);

await s.evaluate(() => {
  const W = BRAUHAUS.welt;
  window.__h = { rufe: [], ereignisse: [] };
  const alt = W.erbe.bind(W);
  W.erbe = function () {
    window.__h.rufe.push({ jahr: W.zeit.jahr, woche: W.zeit.woche, vorher: W.zeit.amtszeit.name });
    return alt();
  };
  BRAUHAUS.auf('erbfall', d => window.__h.ereignisse.push({
    jahr: W.zeit.jahr, woche: W.zeit.woche, neu: d && d.amtszeit && d.amtszeit.name,
    eigenschaft: d && d.amtszeit && d.amtszeit.eigenschaft }));
});

/* Was die Tafel am Bildschirm sagt — innerText, elementFromPoint. */
const tafel = () => s.evaluate(() => {
  const t = document.querySelector('.erb-tafel');
  if (!t) return null;
  const q = t.getBoundingClientRect();
  const bue = document.getElementById('buehne').getBoundingClientRect();
  const knoepfe = [...t.querySelectorAll('[data-zug]')].map(e => {
    const r = e.getBoundingClientRect();
    const el = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return { zug: e.getAttribute('data-zug'), text: (e.innerText || '').replace(/\s+/g, ' ').trim(),
             preis: e.getAttribute('data-preis'), aktiv: !e.disabled,
             frei: !!(el && (el === e || e.contains(el))) };
  });
  return {
    text: (t.innerText || '').replace(/\n+/g, ' | ').trim(),
    anteil: +((q.width * q.height) / (bue.width * bue.height) * 100).toFixed(2),
    zugeklappt: t.classList.contains('stadt-zugeklappt'),
    knoepfe
  };
});

const start = { tafel: await tafel(), stand: await s.evaluate(() => BRAUHAUS.erbe.stand()) };

const drueck = z => s.evaluate(k => {
  const e = document.querySelector(`[data-zug="${k}"]`);
  if (!e || e.disabled) return false;
  e.click(); return true;
}, z);

const verlauf = [];
let klicks = 0, geschrieben = 0;
/* Ein Haus, das wirklich spielt: jede Woche die Bretter aufschlagen und
   drueckbare, bezahlbare Zuege nehmen — ohne die drei Uebergabeknoepfe,
   die gehoeren dem Stil. Sonst hat das Haus in Woche 40 nichts mehr, was
   ein Erbe waere, und der Erbfall trifft eine leere Stube. */
const spiele = async () => s.evaluate(() => {
  let n = 0;
  const frei = e => { const q = e.getBoundingClientRect(); if (!q.width) return false;
    const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
    return !!(t && (t === e || e.contains(t))); };
  for (const r of document.querySelectorAll('[data-zug^="stadt:reiter:"]')) {
    r.click();
    for (const e of document.querySelectorAll('[data-zug]')) {
      const z = e.getAttribute('data-zug');
      if (e.disabled) continue;
      if (z === 'weiter' || z.startsWith('stadt:') || z.startsWith('erbe:uebergabe')) continue;
      if (!frei(e)) continue;
      e.click(); n++;
      if (n > 5) return n;
    }
  }
  return n;
});

for (let w = 0; w < WOCHEN; w++) {
  if (STIL === 'spielend' || STIL === 'spielend-leibgeding') {
    await spiele(); await s.waitForTimeout(30);
    if (STIL === 'spielend-leibgeding' && w === 40) {
      await drueck('erbe:uebergabe:leibgeding'); await s.waitForTimeout(60);
    }
  }
  if (STIL === 'vorsorge') {
    /* Jede Woche den Tafelknopf druecken, wenn er aktiv ist. */
    if (await drueck('erbe:tafel:verschreibe')) { geschrieben++; await s.waitForTimeout(30); }
  }
  if (STIL === 'leibgeding' && w === 12) { await drueck('erbe:uebergabe:leibgeding'); await s.waitForTimeout(60); }
  if (STIL === 'abfindung' && w === 12) { await drueck('erbe:uebergabe:abfindung'); await s.waitForTimeout(60); }

  const ok = await s.evaluate(() => {
    const frei = z => { const e = document.querySelector(`[data-zug="${z}"]`); if (!e) return false;
      const q = e.getBoundingClientRect(); if (!q.width) return false;
      const t = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
      return !!(t && (t === e || e.contains(t))); };
    const tu = z => { const e = document.querySelector(`[data-zug="${z}"]`);
      if (e && !e.disabled) { e.click(); return true; } return false; };
    if (document.querySelector('.fu-sperre')) tu('fuhre:sommer-zu');
    if (!frei('weiter')) for (const r of document.querySelectorAll('[data-zug^="stadt:reiter:"]')) {
      if (frei('weiter')) break; r.click();
    }
    return tu('weiter');
  });
  await s.waitForTimeout(45);
  klicks++;
  if (klicks % 10 === 0 || klicks === 59 || klicks === 60 || klicks === 61) {
    const t = await tafel();
    const st = await s.evaluate(() => ({ ...BRAUHAUS.erbe.stand(),
      kasse: BRAUHAUS.welt.haus.kasse, jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
      deckung: (document.querySelector('.deckung') || {}).innerText || null }));
    verlauf.push({ klick: klicks, jahr: st.jahr, woche: st.woche, kasse: st.kasse,
      amHaus: st.amHaus.length, person: st.anDerPerson.length, uebergeben: st.uebergeben,
      form: st.form, eigenschaft: st.eigenschaft, faktor: st.faktor,
      tafel: t ? t.text : null,
      amHausL: st.amHaus, personL: st.anDerPerson,
      preise: t ? t.knoepfe.map(k => k.zug + '=' + k.preis + (k.aktiv ? '' : '(aus)') + (k.frei ? '' : '(verdeckt)')).join(' ') : null });
  }
  if (!ok) break;
}

const ende = await s.evaluate(() => ({
  ...BRAUHAUS.erbe.stand(),
  jahr: BRAUHAUS.welt.zeit.jahr, woche: BRAUHAUS.welt.zeit.woche,
  endgrund: BRAUHAUS.welt.zeit.endgrund || null, kasse: BRAUHAUS.welt.haus.kasse,
  haken: window.__h,
  chronikErbfall: BRAUHAUS.welt.chronik.filter(c => c.art === 'erbfall').length,
  chronikFestlegung: BRAUHAUS.welt.chronik.filter(c => c.art === 'festlegung').length,
  handlohn: (BRAUHAUS.protokoll || []).filter(p => /Handlohn/i.test(p.was)).map(p => p.jahr + ': ' + p.was + ' ' + p.preis),
  lage: BRAUHAUS.lage.length
}));

console.log(JSON.stringify({ epoche: EP, stil: STIL, klicks, geschrieben, start, verlauf, ende,
  seitenfehler: fehler.length, fehler: fehler.slice(0, 4) }, null, 1));
await b.close();
