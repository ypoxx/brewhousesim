// Gemeinsame Helfer fuer die Kritik K2. Absoluter Import von Playwright,
// wie es die vorhandenen Geraete tun.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

export const BASIS = 'http://127.0.0.1:8933/spiel/';

export async function neuerBrowser() {
  const browser = await chromium.launch();
  return browser;
}

export async function neueSeite(browser, { breite = 1600, hoehe = 900 } = {}) {
  const context = await browser.newContext({ viewport: { width: breite, height: hoehe } });
  const page = await context.newPage();
  const fehler = [];
  page.on('pageerror', (e) => fehler.push('pageerror: ' + e.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') fehler.push('console.error: ' + msg.text());
  });
  page.__fehler = fehler;
  return { context, page };
}

export function adresse({ epoche = 1, saat = 1350, neu = true, extra = '' }) {
  let u = BASIS + '?epoche=' + epoche + '&saat=' + saat;
  if (neu) u += '&neu=1';
  if (extra) u += '&' + extra;
  return u;
}

export async function gehezu(page, url) {
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForSelector('#buehne[data-bereit="1"]', { timeout: 10000 });
  // kurz warten, damit requestAnimationFrame-Nachtraege (Deckung/Ziel) fertig sind
  await page.waitForTimeout(120);
}

// Klickt einen data-zug-Knopf per ECHTEM Mausereignis auf die Mitte seiner
// Flaeche, mit elementFromPoint-Pruefung davor. Gibt zurueck, ob gegriffen
// wurde (true) oder nicht (false, gilt als "nicht gegriffen").
export async function klickZug(page, zug) {
  const info = await page.evaluate((zug) => {
    const el = document.querySelector('[data-zug="' + CSS.escape(zug) + '"]');
    if (!el) return { ok: false, grund: 'kein-element' };
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return { ok: false, grund: 'keine-flaeche' };
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const top = document.elementFromPoint(cx, cy);
    const trifft = top === el || (top && el.contains(top));
    return { ok: true, cx, cy, trifft, disabled: !!el.disabled };
  }, zug);
  if (!info.ok) return { gegriffen: false, grund: info.grund };
  if (!info.trifft) return { gegriffen: false, grund: 'verdeckt' };
  if (info.disabled) return { gegriffen: false, grund: 'gesperrt' };
  await page.mouse.move(info.cx, info.cy);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitForTimeout(40);
  return { gegriffen: true };
}

// Klickt einfach auf Bildschirmkoordinaten und meldet, was elementFromPoint
// dort sieht (fuer die Verdeckungspruefe, Frage 3).
export async function sondierePunkt(page, x, y) {
  return await page.evaluate(({ x, y }) => {
    const el = document.elementFromPoint(x, y);
    if (!el) return null;
    const zugEl = el.closest('[data-zug]');
    return {
      tag: el.tagName,
      klasse: el.className && el.className.toString ? el.className.toString() : String(el.className),
      zug: zugEl ? zugEl.getAttribute('data-zug') : null,
      text: (el.textContent || '').trim().slice(0, 60)
    };
  }, { x, y });
}

export async function zuege(page) {
  return await page.evaluate(() => window.BRAUHAUS.zuege());
}

export async function lage(page) {
  return await page.evaluate(() => (window.BRAUHAUS.lage || []).slice());
}

export async function weiterKlicken(page, n = 1) {
  const ergebnisse = [];
  for (let i = 0; i < n; i++) {
    const r = await klickZug(page, 'weiter');
    ergebnisse.push(r);
    if (!r.gegriffen) break;
    await page.waitForTimeout(30);
  }
  return ergebnisse;
}

// Zaehlt sichtbare Textzeilen im ERSTEN SCHIRM (Viewport). Jede Textknoten-
// Teilzeile (per Range.getClientRects()) zaehlt einzeln, weil umgebrochener
// Fließtext sonst als EIN Knoten gezaehlt wuerde statt als N Zeilen.
// Nur Zeilen, deren Rechteck den Viewport ueberschneidet UND deren Element
// sichtbar ist (display, visibility, opacity>0), zaehlen mit.
export async function zaehleTextzeilen(page) {
  return await page.evaluate(() => {
    function sichtbar(el) {
      while (el && el !== document.body) {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false;
        el = el.parentElement;
      }
      return true;
    }
    const vw = window.innerWidth, vh = window.innerHeight;
    let zeilen = 0;
    const zeilenListe = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (!sichtbar(p)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while ((node = walker.nextNode())) {
      const range = document.createRange();
      range.selectNodeContents(node);
      const rects = range.getClientRects();
      for (const r of rects) {
        if (r.width <= 0 || r.height <= 0) continue;
        if (r.right <= 0 || r.bottom <= 0 || r.left >= vw || r.top >= vh) continue; // ausserhalb des ersten Schirms
        zeilen++;
        zeilenListe.push(node.nodeValue.trim().slice(0, 120));
      }
    }
    return { anzahl: zeilen, zeilen: zeilenListe };
  });
}
