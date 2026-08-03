import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
for (const vp of [[1920,1000],[1440,900],[2752,1536],[1280,800]]) {
  const s = await b.newPage({ viewport: { width: vp[0], height: vp[1] } });
  await s.goto('http://127.0.0.1:8899/spiel/?epoche=4&saat=1350', { waitUntil: 'networkidle' });
  await s.waitForTimeout(600);
  const r = await s.evaluate(() => {
    const e = document.querySelector('[data-zug="gegner:blatt"]');
    const q = e.getBoundingClientRect();
    const cx=q.left+q.width/2, cy=q.top+q.height/2;
    const kette = document.elementsFromPoint(cx,cy).slice(0,4).map(x=>x.tagName.toLowerCase()+'#'+(x.id||'')+'.'+(typeof x.className==='string'?x.className:''));
    const band = document.querySelector('.gg-band');
    const bq = band.getBoundingClientRect();
    const buehne = document.getElementById('buehne').getBoundingClientRect();
    return { rect:[Math.round(q.left),Math.round(q.top),Math.round(q.width),Math.round(q.height)],
             band:[Math.round(bq.left),Math.round(bq.top),Math.round(bq.width),Math.round(bq.height)],
             buehne:[Math.round(buehne.left),Math.round(buehne.top),Math.round(buehne.width),Math.round(buehne.height)],
             kette };
  });
  console.log(vp.join('x'), JSON.stringify(r));
  await s.close();
}
await b.close();
