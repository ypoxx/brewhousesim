/* KLEMME — der Fund aus der sorgfaeltig gespielten Partie, sauber ausgemessen.

   Beobachtet: das Sudbrett steht vollstaendig im Bild (902x710 px), die Maus
   trifft seine Knoepfe (elementFromPoint liefert den Knopf), das Brett traegt
   NICHT `stadt-zugeklappt` — und trotzdem sind alle seine Knoepfe `disabled`
   mit `data-aus-grund="brett-zugeklappt"`.

   Dieses Werkzeug fragt: klemmt das, oder war die Hand nur zu schnell?
   Es RUEHRT SICH NICHT, wenn es die Klemme sieht, sondern sieht 8 Sekunden
   lang alle 200 ms nach. Loest sie sich von selbst, war es Zeit. Loest sie
   sich nicht, ist es ein Zustand.

   HAFEN=8917 node klemme.mjs <epoche> <wochen> <ziel.json>                  */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 200);
const ZIEL = process.argv[4] || `/tmp/sudw6/klemme-e${ep}.json`;
const HAFEN = process.env.HAFEN || '8917';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);

const bef = () => seite.evaluate(() => {
  const fach = document.getElementById('fach-hand-sud');
  const brett = fach && fach.firstElementChild;
  const k = document.querySelector('button[data-zug="sud:gaerraum"]')
        || document.querySelector('button[data-zug^="sud:"]');
  const r = brett ? brett.getBoundingClientRect() : null;
  const kr = k ? k.getBoundingClientRect() : null;
  let t = null;
  if (kr && kr.width) t = document.elementFromPoint(kr.left + kr.width / 2, kr.top + kr.height / 2);
  const tot = [...document.querySelectorAll('button[data-zug^="sud:"]')]
    .filter(e => e.getAttribute('data-aus-grund') === 'brett-zugeklappt');
  return {
    brettKlassen: brett ? brett.className : null,
    brettMasse: r ? [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)] : null,
    sichtbar: !!(r && r.width > 200 && r.height > 200),
    knopfTrifft: !!(t && k && (t === k || k.contains(t))),
    totMitGrundZugeklappt: tot.length,
    davonSollJa: tot.filter(e => e.getAttribute('data-soll-aus') === '0').length,
    brettZu: (() => { try { return window.BRAUHAUS.sud.zustand().brettZu; } catch (e) { return null; } })(),
    reiterAuf: (() => { const x = document.querySelector('[data-zug="stadt:reiter:sud-sud-brett"]');
      return x ? x.className.indexOf('auf') >= 0 : null; })()
  };
});

async function klick(zug, w = 90) {
  const l = await seite.evaluate((z) => {
    const el = document.querySelector(`[data-zug="${z}"]`);
    if (!el || el.disabled) return null;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const t = document.elementFromPoint(cx, cy);
    if (!(t && (t === el || el.contains(t)))) return null;
    return { x: cx, y: cy };
  }, zug);
  if (!l) return false;
  await seite.mouse.click(l.x, l.y);
  await seite.waitForTimeout(w);
  return true;
}

const faelle = [];
for (let i = 0; i < WOCHEN && faelle.length < 8; i++) {
  const b = await bef();
  if (b.totMitGrundZugeklappt && b.sichtbar && b.knopfTrifft && !/stadt-zugeklappt/.test(b.brettKlassen || '')) {
    /* GEFUNDEN — jetzt NICHT anfassen, nur zusehen. */
    const reihe = [{ ms: 0, ...b }];
    let geloest = null;
    for (let t = 1; t <= 40; t++) {
      await seite.waitForTimeout(200);
      const x = await bef();
      reihe.push({ ms: t * 200, tot: x.totMitGrundZugeklappt, sichtbar: x.sichtbar,
        trifft: x.knopfTrifft, klassen: x.brettKlassen, brettZu: x.brettZu });
      if (!x.totMitGrundZugeklappt) { geloest = t * 200; break; }
    }
    /* Und jetzt: hilft ein Klick auf den Reiter? */
    let nachKlick = null;
    if (geloest === null) {
      await klick('stadt:reiter:sud-sud-brett', 400);
      const n1 = await bef();
      await klick('stadt:reiter:sud-sud-brett', 400);
      const n2 = await bef();
      nachKlick = { einKlick: n1.totMitGrundZugeklappt, zweiKlicks: n2.totMitGrundZugeklappt,
                    sichtbarDanach: n2.sichtbar, trifftDanach: n2.knopfTrifft };
    }
    const bild = `/tmp/sudw6/klemme-e${ep}-${faelle.length}.png`;
    await seite.screenshot({ path: bild });
    faelle.push({ woche: i, geloestNachMs: geloest, reihe: reihe.slice(0, 6), nachKlick, bild, start: b });
    console.log(`  Klemme in Woche ${i}: tot ${b.totMitGrundZugeklappt} Knoepfe `
      + `(davon soll-aus=0: ${b.davonSollJa}), Brett ${b.brettMasse}, Maus trifft ${b.knopfTrifft}, `
      + `loest sich ${geloest === null ? 'NICHT in 8 s' : 'nach ' + geloest + ' ms'}`
      + (nachKlick ? `; nach Reiterklick ${nachKlick.einKlick}/${nachKlick.zweiKlicks}` : ''));
  }
  await klick('fuhre:wie-vorige', 60);
  await klick('fuhre:abschicken', 90);
  if (!(await klick('weiter', 110))) break;
}

fs.writeFileSync(ZIEL, JSON.stringify({ epoche: ep, wochen: WOCHEN, faelle, fehler }, null, 1));
console.log(`E${ep}: ${faelle.length} Klemmen gefunden, `
  + `davon von selbst geloest: ${faelle.filter(f => f.geloestNachMs !== null).length}`);
await browser.close();
