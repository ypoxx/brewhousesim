// Echte Maus: jeden Knopf des NAMENs mit page.click() anfassen, ohne JS-click.
//   node maus.mjs <epoche> <saat>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [ep, saat] = process.argv.slice(2);
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const fehler = [];
seite.on('pageerror', e => fehler.push('pageerror: ' + String(e).slice(0, 200)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 200)); });
await seite.goto(`http://127.0.0.1:8899/spiel/?epoche=${ep}&saat=${saat}`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1200);
const maus = async (sel, name) => {
  try { await seite.click(sel, { timeout: 4000 }); await seite.waitForTimeout(320); return 'OK'; }
  catch (e) { return 'FEHL ' + String(e).split('\n')[0].slice(0, 80); }
};
console.log('Reiter DER RUF DES HAUSES  ->', await maus('[data-zug="stadt:reiter:name-nm-band"]'));
for (const z of ['name:aufgeldbuch', 'name:herumgehen', 'name:ruhe', 'name:ruhe', 'name:band', 'name:band', 'name:blatt']) {
  console.log('  ' + z + ' -> ' + await maus(`[data-zug="${z}"]`));
}
for (const z of ['name:reiter:register', 'name:reiter:aufgeld', 'name:reiter:zeichen']) {
  console.log('  ' + z + ' -> ' + await maus(`[data-zug="${z}"]`));
}
const knoepfe = await seite.$$eval('.nm-blatt [data-zug]', els => els.map(e => e.getAttribute('data-zug')).filter(z => !/blatt|reiter|band/.test(z)));
for (const z of knoepfe.slice(0, 8)) console.log('  Blatt ' + z + ' -> ' + await maus(`[data-zug="${z}"]`));
console.log('  name:blatt-zu -> ' + await maus('[data-zug="name:blatt-zu"]'));
console.log('FEHLER:', fehler.length ? fehler : 'keine');
await browser.close();
