/* DAS SIEGEL — haelt eine unwiderrufliche Festlegung wirklich?
   HAFEN=8901 node werkbank/schuss/sud-blind-r2/siegel.mjs <ziel.json>

   Gepruefte Fluchtwege, je besiegelter Achse, in dieser Reihenfolge:
     1  Mausklick auf die Geschwisterkarte      (der ehrliche Weg)
     2  `disabled` und `aria-disabled` entfernt, dann MAUSKLICK
     3  `el.click()`
     4  `el.dispatchEvent(new MouseEvent('click', {bubbles:true}))`
     5  Tastatur: focus() + Enter, dann Leertaste
     6  Reiter zu, Reiter auf (neu gezeichnetes Brett), dann Mausklick
     7  ueber den KESSELZETTEL: `sud:zettel-wechsel-*` bei zugeklapptem Brett
     8  `pointer-events` freigeraeumt und der Klick auf die Karte statt den Knopf

   NICHT geprueft, weil es kein Spielzug ist: `BRAUHAUS.sud.zustand().fest`
   direkt umschreiben. Das waere kein Fluchtweg, sondern ein Cheat.

   GERUEST, ausdruecklich benannt: um eine 118.000-DM-Karte ueberhaupt zu
   erreichen, wird die Kasse ueber `B.welt.nimm()` gefuellt. Das ist keine
   Fluchtprobe, sondern die einzige Art, den Pruefzustand in vertretbarer Zeit
   herzustellen — gepruefte wird ausschliesslich, was NACH dem Siegel geht.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ZIEL = process.argv[2] || 'werkbank/schuss/sud-blind-r2/siegel.json';
const HAFEN = process.env.HAFEN || '8901';
const SAAT = process.env.SAAT || '1350';
const browser = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });

const bericht = [];
const fehler = [];

for (const ep of [1, 2, 3, 4]) {
  const seite = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  seite.on('pageerror', e => fehler.push(`e${ep} pageerror: ` + String(e).slice(0, 200)));
  seite.on('console', m => { if (m.type() === 'error') fehler.push(`e${ep} console: ` + m.text().slice(0, 160)); });
  await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(1300);

  const ruhe = async (ms = 120) => {
    await seite.waitForTimeout(Math.min(ms, 60));
    try {
      await seite.evaluate(() => new Promise(f => {
        let ab = false; const g = () => { if (!ab) { ab = true; f(1); } };
        setTimeout(g, 1500);
        requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(g, 0)));
      }));
    } catch (e) {}
  };

  const mitte = async (zug) => seite.evaluate(z => {
    const el = document.querySelector(`[data-zug="${z}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const t = (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight)
      ? document.elementFromPoint(cx, cy) : null;
    return { x: cx, y: cy, aus: !!el.disabled, hit: !!(t && (t === el || el.contains(t))) };
  }, zug);

  const reiterAuf = async () => {
    for (let i = 0; i < 4; i++) {
      const offen = await seite.evaluate(() => {
        const f = document.getElementById('fach-hand-sud');
        const b = f ? f.firstElementChild : null;
        return b ? !b.classList.contains('stadt-zugeklappt') : null;
      });
      if (offen) return true;
      const l = await mitte('stadt:reiter:sud-sud-brett');
      if (!l || l.aus || !l.hit) return false;
      await seite.mouse.click(l.x, l.y);
      await ruhe(200);
    }
    return false;
  };
  const reiterZu = async () => {
    const l = await mitte('stadt:reiter:sud-sud-brett');
    if (l && !l.aus && l.hit) { await seite.mouse.click(l.x, l.y); await ruhe(200); }
  };

  await reiterAuf();

  /* Welche Achsen gibt es, und welche Option ist die teuerste feste? */
  const achsen = await seite.evaluate(() => {
    const B = window.BRAUHAUS;
    const D = B.sud && B.sud.zustand ? null : null;
    /* aus dem Schirm gelesen, nicht aus den Daten: jede Karte, die
       `siegel` in der Klasse fuehrt, ist eine unwiderrufliche. */
    const l = {};
    document.querySelectorAll('.sud-brett button[data-zug^="sud:"]').forEach(el => {
      const z = el.getAttribute('data-zug');
      const m = /^sud:([a-z]+):([a-z0-9-]+)$/.exec(z);
      if (!m) return;
      (l[m[1]] = l[m[1]] || []).push({
        zug: z, k: m[2],
        fest: el.classList.contains('siegel'),
        preis: el.hasAttribute('data-preis') ? Math.abs(+el.getAttribute('data-preis')) : 0,
        text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 50)
      });
    });
    return { achsen: l, verfahren: B.sud.verfahren(), kasse: B.welt.haus.kasse };
  });

  for (const [schl, opts] of Object.entries(achsen.achsen)) {
    const feste = opts.filter(o => o.fest);
    if (!feste.length) continue;
    /* Die GUENSTIGSTE feste Option — von ihr aus ist der Fluchtweg am
       interessantesten (darunter liegt die kostenlose Vorgabe). */
    feste.sort((a, b) => a.preis - b.preis);
    const ziel = feste[0];
    const geschwister = opts.filter(o => o.zug !== ziel.zug);

    /* Geruest: Kasse fuellen. */
    await seite.evaluate(p => window.BRAUHAUS.welt.nimm(p * 3 + 1000, 'Messgeruest Siegelprobe'),
      ziel.preis || 100);
    await seite.evaluate(() => window.BRAUHAUS.sende('zeichne', { grund: 'siegelprobe' }));
    await ruhe(200);
    await reiterAuf();

    const vorher = await seite.evaluate(s => window.BRAUHAUS.sud.verfahren(s), schl);

    /* Das Siegel setzen — mit der Maus. */
    const l = await mitte(ziel.zug);
    let gesetzt = false;
    if (l && !l.aus && l.hit) { await seite.mouse.click(l.x, l.y); await ruhe(250); }
    const nachKauf = await seite.evaluate(s => ({
      v: window.BRAUHAUS.sud.verfahren(s),
      fest: JSON.parse(JSON.stringify(window.BRAUHAUS.sud.zustand().fest || {})),
      kasse: window.BRAUHAUS.welt.haus.kasse
    }), schl);
    gesetzt = nachKauf.v === ziel.k;

    const versuche = [];
    async function probe(name, fn) {
      await reiterAuf();
      let getan = null;
      try { getan = await fn(); } catch (e) { getan = 'FEHLER ' + String(e).slice(0, 80); }
      await ruhe(250);
      const v = await seite.evaluate(s => window.BRAUHAUS.sud.verfahren(s), schl);
      versuche.push({ name, getan, verfahrenDanach: v, entkommen: v !== ziel.k });
    }

    for (const g of geschwister) {
      await probe(`1 Maus auf ${g.k}`, async () => {
        const q = await mitte(g.zug);
        if (!q) return 'kein Knopf';
        if (q.aus) return 'disabled';
        if (!q.hit) return 'nicht getroffen';
        await seite.mouse.click(q.x, q.y);
        return 'geklickt';
      });
      await probe(`2 disabled weg + Maus auf ${g.k}`, async () => {
        const q0 = await seite.evaluate(z => {
          const el = document.querySelector(`[data-zug="${z}"]`);
          if (!el) return null;
          el.disabled = false; el.removeAttribute('disabled'); el.removeAttribute('aria-disabled');
          el.style.pointerEvents = 'auto';
          const r = el.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        }, g.zug);
        if (!q0) return 'kein Knopf';
        await seite.mouse.click(q0.x, q0.y);
        return 'geklickt';
      });
      await probe(`3 el.click() auf ${g.k}`, async () => seite.evaluate(z => {
        const el = document.querySelector(`[data-zug="${z}"]`);
        if (!el) return 'kein Knopf';
        el.disabled = false; el.removeAttribute('disabled');
        el.click(); return 'el.click()';
      }, g.zug));
      await probe(`4 dispatchEvent auf ${g.k}`, async () => seite.evaluate(z => {
        const el = document.querySelector(`[data-zug="${z}"]`);
        if (!el) return 'kein Knopf';
        el.disabled = false; el.removeAttribute('disabled');
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        return 'dispatchEvent';
      }, g.zug));
      await probe(`5 Tastatur auf ${g.k}`, async () => {
        const ok = await seite.evaluate(z => {
          const el = document.querySelector(`[data-zug="${z}"]`);
          if (!el) return false;
          el.disabled = false; el.removeAttribute('disabled'); el.focus(); return true;
        }, g.zug);
        if (!ok) return 'kein Knopf';
        await seite.keyboard.press('Enter');
        await seite.keyboard.press('Space');
        return 'Enter+Space';
      });
    }

    /* 6 — Brett zu, Brett auf: ein FRISCH gezeichnetes Brett. */
    await probe('6 Reiter zu/auf, dann Maus auf Vorgabe', async () => {
      await reiterZu(); await ruhe(300); await reiterAuf(); await ruhe(300);
      const g = geschwister[0];
      const q = await mitte(g.zug);
      if (!q) return 'kein Knopf';
      if (q.aus) return 'disabled';
      await seite.mouse.click(q.x, q.y);
      return 'geklickt';
    });

    /* 7 — der Kesselzettel bei zugeklapptem Brett. */
    const zettel = await (async () => {
      await reiterZu(); await ruhe(400);
      const liste = await seite.evaluate(() =>
        [...document.querySelectorAll('button[data-zug^="sud:zettel-wechsel"]')].map(el => ({
          zug: el.getAttribute('data-zug'), aus: !!el.disabled,
          text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 50) })));
      const erg = [];
      for (const b of liste) {
        const q = await mitte(b.zug);
        if (q && !q.aus && q.hit) { await seite.mouse.click(q.x, q.y); await ruhe(250); }
        const v = await seite.evaluate(s => window.BRAUHAUS.sud.verfahren(s), schl);
        erg.push({ ...b, verfahrenDanach: v, entkommen: v !== ziel.k });
      }
      await reiterAuf();
      return erg;
    })();

    /* 8 — pointer-events der ganzen Karte freigeraeumt. */
    await probe('8 pointer-events frei, Klick auf die Karte', async () => {
      const g = geschwister[0];
      const q = await seite.evaluate(z => {
        const el = document.querySelector(`[data-zug="${z}"]`);
        if (!el) return null;
        const karte = el.closest('.sud-karte') || el;
        karte.style.pointerEvents = 'auto'; karte.classList.remove('weg');
        el.disabled = false; el.removeAttribute('disabled'); el.style.pointerEvents = 'auto';
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      }, g.zug);
      if (!q) return 'kein Knopf';
      await seite.mouse.click(q.x, q.y);
      return 'geklickt';
    });

    /* Die Ratsche nach OBEN: gibt es eine teurere feste Option, ist sie noch da? */
    const hinauf = await seite.evaluate(s => {
      const l = [];
      document.querySelectorAll('.sud-brett button[data-zug^="sud:' + s + ':"]').forEach(el => {
        l.push({ zug: el.getAttribute('data-zug'), aus: !!el.disabled,
                 preis: el.hasAttribute('data-preis') ? Math.abs(+el.getAttribute('data-preis')) : 0,
                 weg: !!el.closest('.sud-karte.weg') });
      });
      return l;
    }, schl);

    const nachher = await seite.evaluate(s => window.BRAUHAUS.sud.verfahren(s), schl);
    bericht.push({
      epoche: ep, achse: schl, ziel: ziel.k, zielText: ziel.text, preis: ziel.preis,
      vorher, gesetzt, kasseVor: nachKauf.kasse + ziel.preis, kasseNach: nachKauf.kasse,
      abgebucht: ziel.preis > 0 ? true : null,
      versuche, zettel, hinauf, verfahrenAmEnde: nachher,
      gehalten: nachher === ziel.k
        && versuche.every(v => !v.entkommen) && zettel.every(z => !z.entkommen)
    });
  }
  await seite.close();
}

fs.mkdirSync(ZIEL.replace(/\/[^/]+$/, ''), { recursive: true });
fs.writeFileSync(ZIEL, JSON.stringify({ fehler, bericht }, null, 1));
bericht.forEach(b => {
  const raus = b.versuche.filter(v => v.entkommen).map(v => v.name)
    .concat(b.zettel.filter(z => z.entkommen).map(z => 'Zettel ' + z.zug));
  console.log(`e${b.epoche} ${b.achse}:${b.ziel} (${b.preis}) gesetzt=${b.gesetzt} `
    + `GEHALTEN=${b.gehalten}${raus.length ? '  ENTKOMMEN ueber: ' + raus.join(', ') : ''}`);
});
console.log('Seitenfehler:', fehler.length);
await browser.close();
