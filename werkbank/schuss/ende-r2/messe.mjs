import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const BASIS = 'http://127.0.0.1:8899/spiel/';
const AUS = '/home/user/brewhousesim/werkbank/schuss/ende-r2/';

export async function neueSeite(browser, epoche, saat = 1350) {
  const seite = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
  const fehler = [];
  seite.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
  seite.on('pageerror', e => fehler.push('pageerror: ' + e.message));
  await seite.goto(`${BASIS}?epoche=${epoche}&saat=${saat}`, { waitUntil: 'networkidle' });
  await seite.waitForTimeout(300);
  return { seite, fehler };
}

/* Alles Bedienbare am Bildschirm, mit Treffertest per elementFromPoint. */
export const ZUEGE = () => {
  const l = [];
  document.querySelectorAll('[data-zug]').forEach(el => {
    const r = el.getBoundingClientRect();
    const sichtbar = r.width > 1 && r.height > 1
      && r.left < innerWidth && r.top < innerHeight && r.right > 0 && r.bottom > 0;
    let frei = false, deckerZug = null;
    if (sichtbar) {
      const x = Math.min(innerWidth - 1, Math.max(0, r.left + r.width / 2));
      const y = Math.min(innerHeight - 1, Math.max(0, r.top + r.height / 2));
      const t = document.elementFromPoint(x, y);
      frei = !!(t && (t === el || el.contains(t)));
      if (!frei && t) {
        const d = t.closest('[data-zug]');
        deckerZug = d ? d.getAttribute('data-zug') : (t.className || t.tagName);
      }
    }
    const fach = el.closest('.fach');
    l.push({
      zug: el.getAttribute('data-zug'),
      text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 70),
      preis: el.getAttribute('data-preis'),
      aus: !!el.disabled,
      sichtbar, frei, deckerZug,
      stueck: fach ? fach.getAttribute('data-stueck') : null
    });
  });
  return l;
};

export const STAND = () => {
  const B = window.BRAUHAUS;
  const d = document.querySelector('.deckung[data-deckung]');
  return {
    jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche,
    ende: B.welt.zeit.ende || null, endgrund: B.welt.zeit.endgrund || null,
    kasse: B.welt.haus.kasse,
    keller: B.welt.vorrat.faesser.length,
    protokoll: B.protokoll.length,
    chronik: B.welt.chronik.length,
    lage: B.lage.length,
    deckung: d ? d.getAttribute('data-deckung') : null,
    deckungText: d ? d.textContent.trim() : null,
    /* Sichtbar heisst: hat Kaesten am Bildschirm. display:none hat keine. */
    deckungSichtbar: !!(d && d.getClientRects().length),
    deckungImText: (document.body.innerText || '').indexOf('nächster Zug:') >= 0,
    naechster: B.welt.naechsterZug ? { ...B.welt.naechsterZug } : null,
    fuhre: B.fuhre ? B.fuhre.stand() : null
  };
};

export { BASIS, AUS };
