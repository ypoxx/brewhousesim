/* Erkundung: was gibt das laufende Spiel her? Eigenes Messgeraet, nichts gedreht. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = process.env.HAFEN || 'http://127.0.0.1:8917';
const EP = Number(process.argv[2] || 1);

const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required', '--no-sandbox'] });
const s = await b.newContext();
const p = await s.newPage();
const fehler = [];
p.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
p.on('pageerror', e => fehler.push('pageerror: ' + e.message));

await p.goto(`${HAFEN}/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await p.waitForTimeout(2500);

const info = await p.evaluate(() => {
  const B = window.BRAUHAUS;
  const knoepfe = [...document.querySelectorAll('[data-zug]')].map(e => ({
    zug: e.dataset.zug,
    text: (e.textContent || '').trim().slice(0, 40),
    aus: e.disabled === true || e.dataset.sollAus === '1' || e.getAttribute('aria-disabled') === 'true',
    sichtbar: !!(e.offsetParent || e.getClientRects().length)
  }));
  return {
    hatTon: !!(B && B.ton),
    api: B && B.ton ? Object.keys(B.ton) : [],
    zeit: B && B.welt ? JSON.parse(JSON.stringify(B.welt.zeit)) : null,
    lage: B && B.lage ? B.lage.length : 'keine lage',
    lageTexte: B && B.lage ? B.lage.slice(0, 5) : [],
    pegel: B && B.ton && B.ton.pegel ? B.ton.pegel() : null,
    ausgang: !!(B && B.ton && B.ton.ausgang && B.ton.ausgang()),
    ctxState: (B && B.ton && B.ton.ausgang && B.ton.ausgang()) ? B.ton.ausgang().context.state : null,
    ctxRate: (B && B.ton && B.ton.ausgang && B.ton.ausgang()) ? B.ton.ausgang().context.sampleRate : null,
    katalog: B && B.ton && B.ton.katalog ? B.ton.katalog().length : null,
    knoepfe,
    reiter: [...document.querySelectorAll('[data-reiter],[data-blatt],[role="tab"]')].map(e => e.dataset.reiter || e.dataset.blatt || e.textContent.trim()).slice(0, 30)
  };
});
console.log(JSON.stringify({ epoche: EP, fehler, ...info }, null, 1));
await b.close();
