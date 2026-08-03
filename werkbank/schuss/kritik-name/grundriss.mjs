// Was steht beim Laden ohne einen einzigen Klick nebeneinander auf dem Schirm?
//   node grundriss.mjs <epoche> <saat>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [ep, saat] = process.argv.slice(2);
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=${saat}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1400);
const r = await seite.evaluate(() => {
  const sicht = el => { const b = el.getBoundingClientRect(); if (b.width < 2 || b.height < 2) return false; if (b.bottom <= 0 || b.top >= innerHeight || b.right <= 0 || b.left >= innerWidth) return false; const s = getComputedStyle(el); return !(s.visibility === 'hidden' || s.display === 'none' || +s.opacity < .05 || s.pointerEvents === 'none'); };
  const tref = el => { const b = el.getBoundingClientRect(); const t = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2); return !!t && (t === el || el.contains(t)); };
  const alle = [...document.querySelectorAll('[data-zug]')];
  const mitPreis = alle.filter(e => e.getAttribute('data-preis') !== null && Math.abs(+e.getAttribute('data-preis')) > 0);
  const offen = mitPreis.filter(e => sicht(e) && tref(e) && !e.disabled);
  const gesperrt = mitPreis.filter(e => sicht(e) && tref(e) && e.disabled);
  const reiter = alle.filter(e => /^stadt:reiter:|^stadt:ortsmarken|^preis:tafel$|^gegner:blatt$/.test(e.getAttribute('data-zug')) && sicht(e) && tref(e));
  const kasse = BRAUHAUS.welt.haus.kasse;
  return {
    jahr: BRAUHAUS.welt.zeit.jahr, kasse,
    offen: offen.map(e => ({ z: e.getAttribute('data-zug'), p: +e.getAttribute('data-preis') })),
    nOffen: offen.length, nGesperrt: gesperrt.length,
    bezahlbar: offen.filter(e => -(+e.getAttribute('data-preis')) <= kasse).length,
    proStueck: offen.reduce((a, e) => { const s = e.getAttribute('data-zug').split(':')[0]; a[s] = (a[s] || 0) + 1; return a; }, {}),
    reiter: reiter.map(e => e.innerText.replace(/\s+/g, ' ').slice(0, 46)),
    nReiter: reiter.length,
  };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
