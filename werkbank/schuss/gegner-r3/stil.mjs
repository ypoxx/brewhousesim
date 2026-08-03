import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
await s.goto('http://127.0.0.1:8899/spiel/?epoche=4&saat=1350', { waitUntil: 'networkidle' });
await s.waitForTimeout(600);
console.log(await s.evaluate(() => {
  const band = document.querySelector('.gg-band');
  const out = [];
  let e = band;
  while (e && e !== document.documentElement) {
    const c = getComputedStyle(e);
    out.push({ el: e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+'.'+(typeof e.className==='string'?e.className:''),
      pe: c.pointerEvents, vis: c.visibility, op: c.opacity, disp: c.display, ov: c.overflow, z: c.zIndex, pos: c.position });
    e = e.parentElement;
  }
  return out;
}));
await b.close();
