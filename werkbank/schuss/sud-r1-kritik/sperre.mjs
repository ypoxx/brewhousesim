// Vorgabestand-Zensus + Sperrlisten-Suche im gesamten Bildschirmtext.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const EP of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: 2752, height: 1536 } });
  await s.goto(`http://127.0.0.1:8899/spiel/?epoche=${EP}&saat=4242`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1000);
  const vor = await s.evaluate(() => {
    const kn = [];
    document.querySelectorAll('button[data-zug]').forEach((el) => {
      const r = el.getBoundingClientRect(); if (r.width < 3) return;
      const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      if (!(t && (t === el || el.contains(t))) || el.disabled) return;
      kn.push({ zug: el.getAttribute('data-zug'), text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60), preis: /[−-]\s?\d/.test(el.innerText || '') });
    });
    return kn;
  });
  const sud = vor.filter((k) => /^sud:/.test(k.zug));
  console.log(`E${EP} VORGABESTAND: erreichbar+aktiv gesamt ${vor.length}, davon SUD ${sud.length} (mit Preisschild ${sud.filter((k) => k.preis).length}): ${sud.map((k) => k.zug + ' "' + k.text + '"').join(' | ')}`);
  // Brett auf, dann Sperrlistensuche über den gesamten Schirmtext
  for (let i = 0; i < 3; i++) {
    const r = await s.$$('button[data-zug^="stadt:reiter:"]');
    for (const el of r) { const t = (await el.innerText()).replace(/\s+/g, ' '); if (/zugeklappt/.test(t)) { try { await el.click({ timeout: 1500 }); await s.waitForTimeout(100); } catch (e) {} } }
  }
  await s.waitForTimeout(400);
  const t = await s.evaluate(() => {
    const alles = [];
    document.querySelectorAll('*').forEach((el) => { if (el.children.length === 0 && el.innerText) alles.push(el.innerText); });
    document.querySelectorAll('[title]').forEach((el) => alles.push(el.getAttribute('title')));
    document.querySelectorAll('img').forEach((el) => alles.push('IMG:' + el.getAttribute('src')));
    document.querySelectorAll('*').forEach((el) => { const bg = getComputedStyle(el).backgroundImage; if (bg && bg !== 'none') alles.push('BG:' + bg.slice(0, 200)); });
    return alles.join(' \n ');
  });
  const treffer = {};
  for (const w of ['Destill', 'Blase', 'Brennblase', 'Brennerei', 'Schnaps', 'Alembik', 'Email', 'Emaille', 'Marktanteil', 'Pfanne', 'Kessel', 'Helm']) {
    const m = t.match(new RegExp('.{0,60}' + w + '.{0,60}', 'g'));
    if (m) treffer[w] = Array.from(new Set(m)).slice(0, 4);
  }
  console.log(`   Sperrlisten-Suche:`, JSON.stringify(treffer, null, 0).slice(0, 1400));
  const bilder = await s.evaluate(() => Array.from(new Set(Array.from(document.querySelectorAll('img')).map((i) => i.getAttribute('src')).filter((x) => x && /sud/.test(x)))));
  console.log('   Bilder mit "sud" im Pfad:', JSON.stringify(bilder));
  await s.close();
}
await b.close();
