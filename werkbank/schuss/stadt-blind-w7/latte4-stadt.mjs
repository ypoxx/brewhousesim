// LATTE 4, aber AM STUECK und nach EIGENTUM statt nach Klassennamen.
//
// Der PREIS hat gemeldet, dass die uebliche Aufschluesselung nach dem ersten
// Wort des Klassennamens sortiert und dabei fremde Kaesten zurechnet. Hier wird
// stattdessen gefragt: in wessen EBENE (`platte`/`bau`/`marken`/`hand`/`blatt`)
// haengt der Knoten, und traegt irgendein Vorfahr eine `stadt-`-Klasse?
//
//   HAFEN=8903 BREITE=1366 HOEHE=768 node …/latte4-stadt.mjs <ziel.json>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const HAFEN = process.env.HAFEN || '8903';
const BREITE = +(process.env.BREITE || 1366), HOEHE = +(process.env.HOEHE || 768);
const ziel = process.argv[2] || 'werkbank/schuss/stadt-blind-w7/latte4-stadt.json';

const b = await chromium.launch({ ignoreDefaultArgs: ['--hide-scrollbars'] });
const alles = {};
for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: BREITE, height: HOEHE } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1500);
  alles['e' + e] = await s.evaluate(() => {
    const wem = (el) => {
      for (let p = el; p; p = p.parentElement) {
        const c = typeof p.className === 'string' ? p.className : '';
        if (/\bstadt-/.test(c)) return 'stadt';
        if (/\bfu-/.test(c)) return 'fuhre';
        if (/\bsud-/.test(c)) return 'sud';
        if (/\bgg-/.test(c) || /\bamort\b/.test(c)) return 'gegner';
        if (/\bnm-/.test(c)) return 'name';
        if (/\berb-/.test(c)) return 'erbe';
        if (/\bpr-/.test(c) || /\bblatt\b/.test(c)) return 'preis';
        if (p.id === 'kopf' || p.id === 'kopfleiste') return 'kern';
      }
      return '?';
    };
    const kappt = (v) => v === 'hidden' || v === 'clip';
    const klein = {}, ueber = {}, listeK = [], listeU = [];
    for (const el of document.querySelectorAll('*')) {
      const c = getComputedStyle(el);
      const w = wem(el);
      if (el.children.length === 0 && (el.textContent || '').trim()) {
        const px = parseFloat(c.fontSize);
        if (px < 12) {
          klein[w] = (klein[w] || 0) + 1;
          if (w === 'stadt') listeK.push({ px: Math.round(px * 10) / 10, kl: el.className, t: el.textContent.trim().slice(0, 40) });
        }
      }
      const abY = el.scrollHeight > el.clientHeight + 1 && kappt(c.overflowY);
      const abX = el.scrollWidth > el.clientWidth + 1 && kappt(c.overflowX);
      if (abY || abX) {
        ueber[w] = (ueber[w] || 0) + 1;
        if (w === 'stadt') listeU.push({ kl: el.className, t: (el.textContent || '').trim().slice(0, 50),
          fehltY: el.scrollHeight - el.clientHeight, fehltX: el.scrollWidth - el.clientWidth });
      }
    }
    /* Knoepfe: aktiv, sichtbar, und wirklich mit der Maus zu treffen. */
    const kn = [...document.querySelectorAll('[data-zug]')];
    const stadtK = kn.filter((x) => (x.dataset.zug || '').startsWith('stadt:'));
    const masse = (l) => l.filter((x) => !x.disabled).map((x) => {
      const r = x.getBoundingClientRect();
      return { zug: x.dataset.zug, w: Math.round(r.width), h: Math.round(r.height),
        klein: r.width > 0 && r.height > 0 && (r.width < 24 || r.height < 24),
        treffbar: (() => { const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          return !!(t && (t === x || x.contains(t))); })() };
    });
    const mk = masse(stadtK);
    /* Was steht NUR im Zeigertitel? Knoepfe/Kaesten mit title, deren
       sichtbarer Text den Titel nicht enthaelt. */
    const nurTitel = [];
    for (const el of document.querySelectorAll('[title]')) {
      if (wem(el) !== 'stadt') continue;
      const r = el.getBoundingClientRect(); if (r.width < 2) continue;
      const sicht = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
      const tit = (el.getAttribute('title') || '').replace(/\s+/g, ' ').trim();
      if (tit && !sicht.includes(tit)) nurTitel.push({ zug: el.dataset.zug || '', sicht: sicht.slice(0, 40), titel: tit.slice(0, 90) });
    }
    /* Abgeschnittener Text mit Auslassungspunkten oder line-clamp im Stueck */
    const gekappt = [];
    for (const el of document.querySelectorAll('*')) {
      if (wem(el) !== 'stadt' || el.children.length) continue;
      const c = getComputedStyle(el);
      const r = el.getBoundingClientRect(); if (r.width < 2) continue;
      const zuBreit = el.scrollWidth > el.clientWidth + 1;
      if (zuBreit && (c.textOverflow === 'ellipsis' || kappt(c.overflowX) || c.webkitLineClamp !== 'none')) {
        gekappt.push({ kl: el.className, voll: (el.textContent || '').trim().slice(0, 60),
          fehlt: el.scrollWidth - el.clientWidth, titel: el.closest('[title]')?.getAttribute('title')?.slice(0, 60) || '' });
      }
    }
    return { klein, ueber, stadt_klein: listeK, stadt_ueber: listeU,
      stadt_knoepfe: mk.length, stadt_zu_klein: mk.filter((x) => x.klein).length,
      stadt_nicht_treffbar: mk.filter((x) => !x.treffbar).map((x) => x.zug),
      nurTitel, gekappt };
  });
  const a = alles['e' + e];
  console.log(`E${e}  STADT: ${a.klein.stadt || 0} Knoten <12px · ${a.ueber.stadt || 0} abgeschnittene Kaesten · ` +
    `${a.stadt_zu_klein}/${a.stadt_knoepfe} Knoepfe <24px · ${a.stadt_nicht_treffbar.length} aktiv aber nicht treffbar`);
  console.log(`     alle Stuecke <12px: ${JSON.stringify(a.klein)}`);
  console.log(`     alle Stuecke Ueberlauf: ${JSON.stringify(a.ueber)}`);
  console.log(`     nur im Zeigertitel: ${a.nurTitel.length} · sichtbar gekappt: ${a.gekappt.length}`);
  await s.close();
}
fs.writeFileSync(ziel, JSON.stringify(alles, null, 1));
await b.close();
