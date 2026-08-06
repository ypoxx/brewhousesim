/* BLICK — Aufnahmen zum Ansehen, nicht zum Zaehlen.
     HAFEN=8942 MARKE=nach node werkbank/schuss/erbe-w11/blick.mjs

   Je Epoche drei Bilder:
     <marke>-eN-leiste.png   Ausschnitt der Leiste, 3x vergroessert — traegt
                             die Schrift ohne Papier ueber der gemalten Welt?
     <marke>-eN-buch.png     das aufgeschlagene Buch, Ausschnitt
     <marke>-eN-ganz.png     die ganze Flaeche 2752x1536
   Dazu die Rollhoehe des Buchkoerpers: rollt er, oder passt alles?          */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';

const HAFEN = process.env.HAFEN || '8942';
const MARKE = process.env.MARKE || 'nach';
const WOCHEN = +(process.env.WOCHEN || 0);
const W = 2752, H = 1536;
const ZIEL = 'werkbank/schuss/erbe-w11/bilder';
mkdirSync(ZIEL, { recursive: true });

const b = await chromium.launch();
for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: W, height: H } });
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=1350`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(1600);
  for (let i = 0; i < WOCHEN; i++) {
    await s.evaluate(() => { const k = document.querySelector('[data-zug="weiter"]'); if (k) k.click(); });
    await s.waitForTimeout(180);
  }
  await s.waitForTimeout(600);
  await s.screenshot({ path: `${ZIEL}/${MARKE}-e${e}-ganz.png` });
  /* Die Leiste: der Streifen, in dem sie sitzt, gross genug zum Lesen */
  await s.screenshot({ path: `${ZIEL}/${MARKE}-e${e}-leiste.png`,
    clip: { x: 1440, y: 1080, width: 1300, height: 130 } });

  const auf = await s.evaluate(() => {
    const k = document.querySelector('[data-zug="erbe:buch"]');
    if (!k) return null; k.click(); return 1;
  });
  await s.waitForTimeout(1000);
  const d = await s.evaluate(() => {
    const buch = document.querySelector('.erb-buch');
    if (!buch) return null;
    const ko = buch.querySelector('.erb-koerper');
    const r = buch.getBoundingClientRect();
    return { klasse: buch.className,
      kasten: Math.round(r.width) + 'x' + Math.round(r.height) + ' @' + Math.round(r.x) + ',' + Math.round(r.y),
      koerperRollt: ko ? (ko.scrollHeight > ko.clientHeight + 1) : null,
      koerper: ko ? ko.scrollHeight + '/' + ko.clientHeight : '-',
      zuege: [...buch.querySelectorAll('[data-zug]')].map(x => x.getAttribute('data-zug')),
      /* schneidet irgendein Kind im Buch noch ab? */
      abgeschnitten: [...buch.querySelectorAll('*')].filter(x => {
        const c = getComputedStyle(x);
        const kappt = v => v === 'hidden' || v === 'clip';
        return (x.scrollHeight > x.clientHeight + 1 && kappt(c.overflowY))
            || (x.scrollWidth > x.clientWidth + 1 && kappt(c.overflowX));
      }).map(x => String(x.className || x.tagName).slice(0, 40) + ' "' + (x.textContent || '').trim().slice(0, 30) + '"')
    };
  });
  if (d) {
    await s.screenshot({ path: `${ZIEL}/${MARKE}-e${e}-buch.png`,
      clip: { x: 40, y: 250, width: 1180, height: 880 } });
  }
  console.log(`E${e} ${auf ? 'Buch auf' : 'KEIN GRIFF'} ·`, JSON.stringify(d));
  await s.close();
}
await b.close();
console.log('Bilder in ' + ZIEL);
