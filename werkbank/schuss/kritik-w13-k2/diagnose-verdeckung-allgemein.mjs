import { neuerBrowser, neueSeite, adresse, gehezu } from './lib.mjs';
const browser = await neuerBrowser();
const { page, context } = await neueSeite(browser, { breite: 1600, hoehe: 900 });
await gehezu(page, adresse({ epoche: 1, saat: 1350, neu: true }));
const r = await page.evaluate(() => {
  const namen = ['fuhre:laden:lindenhof', 'gegner:blatt', 'name:band', 'fuhre:kauf:fass', 'fuhre:bann:brueckenwirt'];
  return namen.map((zug) => {
    const el = document.querySelector('[data-zug="' + zug + '"]');
    if (!el) return { zug, existiert: false };
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    const top = document.elementFromPoint(cx, cy);
    return {
      zug, rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
      topTag: top ? top.tagName : null,
      topKlasse: top ? String(top.className) : null,
      topText: top ? (top.textContent || '').trim().slice(0, 40) : null,
      topIstVorfahreDesKnopfs: top ? el.contains(top) : null,
      elIstSichtbar: (function () {
        let e = el;
        while (e && e !== document.body) {
          const cs = getComputedStyle(e);
          if (cs.display === 'none' || cs.visibility === 'hidden') return false;
          e = e.parentElement;
        }
        return true;
      })(),
      elZIndexPfad: (function () {
        let e = el, pfad = [];
        for (let i = 0; i < 4 && e; i++) { pfad.push(e.tagName + '.' + e.className); e = e.parentElement; }
        return pfad;
      })()
    };
  });
});
console.log(JSON.stringify(r, null, 2));
await context.close();
await browser.close();
