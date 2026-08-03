import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const ep = process.argv[2] || '1';
const saat = process.argv[3] || '1350';
const out = '/home/user/brewhousesim/werkbank/schuss/kritik-name';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', (e) => fehler.push('pageerror: ' + e));
seite.on('console', (m) => { if (m.type() === 'error') fehler.push('console: ' + m.text()); });

await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=${saat}`, { waitUntil: 'networkidle', timeout: 60000 });
await seite.waitForTimeout(1200);

const dump = await seite.evaluate(() => {
  const sichtbar = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const s = getComputedStyle(el);
    if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity < 0.05) return false;
    return true;
  };
  const knoepfe = [...document.querySelectorAll('button, [data-zug], [role=button]')].filter(sichtbar).map(el => {
    const r = el.getBoundingClientRect();
    return {
      zug: el.getAttribute('data-zug'),
      text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 90),
      klasse: el.className,
      disabled: el.disabled === true || el.getAttribute('aria-disabled') === 'true' || el.classList.contains('aus'),
      preis: el.getAttribute('data-preis'),
      x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2),
      w: Math.round(r.width), h: Math.round(r.height),
      inTop: document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) === el
        || el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2))
    };
  });
  const W = window.BRAUHAUS && BRAUHAUS.welt;
  return {
    zeit: W && W.zeit, kasse: W && W.haus && W.haus.kasse,
    epocheAttr: document.getElementById('buehne').getAttribute('data-epoche'),
    knoepfe,
    kopftext: (document.getElementById('ebene-kopf')?.innerText || '').replace(/\n+/g, ' | ').slice(0, 600),
    zuege: Object.keys((window.BRAUHAUS && BRAUHAUS.zuege) || {}).slice(0, 200)
  };
});

console.log(JSON.stringify(dump, null, 1));
console.log('FEHLER:', fehler.length ? fehler.join('\n') : 'keine');
await seite.screenshot({ path: `${out}/recon-e${ep}.png` });
await browser.close();
