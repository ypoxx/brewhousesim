/* HAELT DAS SIEGEL?  node siegel.mjs <epoche> <kaufZug> <zurueckZug> [wochen]

   Kauft eine mit "unwiderruflich" beschriftete Festlegung des SUDES, klickt
   sofort danach auf die Vorgabe zurueck, dann wieder hin, spielt ein paar
   Wochen und versucht es noch einmal. Erwartet wird DREIMAL "klickbar=false".

   Am Stand vor Welle 4 war es dreimal "klickbar=true", und zwar in allen
   vier Epochen — auch in 1884, das der Kritiker der Runde 1 noch als heil
   gemeldet hatte (dort haelt nur `sperrt:['natureis']`; ueber `warm` und
   ueber die Hefeachse ging es trotzdem zurueck).

   Die sechs Faelle:
     1 sud:wuerze:brief        sud:wuerze:grut
     2 sud:gaerung:keller      sud:gaerung:ober
     3 sud:kaelte:maschine     sud:kaelte:warm
     3 sud:hefe:reinzucht      sud:hefe:betrieb
     4 sud:fuehrung:labor      sud:fuehrung:erfahrung
     4 sud:behandlung:pasteur  sud:behandlung:natur
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const EP = +process.argv[2], KAUF = process.argv[3], ZUR = process.argv[4], W = +(process.argv[5] || 6);
const HAFEN = process.env.HAFEN || '8899';
const b = await chromium.launch();
const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
const fehler = [];
s.on('pageerror', e => fehler.push(String(e).slice(0, 120)));
s.on('console', m => { if (m.type() === 'error') fehler.push(m.text().slice(0, 120)); });
await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${EP}&saat=1350`, { waitUntil: 'networkidle' });
await s.waitForTimeout(900);
const lies = () => s.evaluate(() => {
  const kn = [];
  document.querySelectorAll('[data-zug]').forEach(el => {
    const r = el.getBoundingClientRect(); if (r.width < 3 || r.height < 3) return;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2; let hit = false;
    if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
      const t = document.elementFromPoint(cx, cy); hit = !!(t && (t === el || el.contains(t)));
    }
    kn.push({ zug: el.getAttribute('data-zug'), text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 60),
              aus: !!el.disabled, hit, x: cx, y: cy });
  });
  const B = window.BRAUHAUS;
  return { kn, kasse: B.welt.haus.kasse, jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche,
           verfahren: JSON.stringify(B.sud ? B.sud.verfahren() : null),
           fest: JSON.stringify(B.SUD_ZUSTAND.fest), lage: B.lage.length };
});
async function oeffneSud() {
  for (let i = 0; i < 4; i++) {
    const z = await lies();
    const r = z.kn.find(k => /^stadt:reiter:sud/.test(k.zug) && /zugeklappt/.test(k.text) && !k.aus && k.hit);
    if (!r) return;
    await s.mouse.click(r.x, r.y); await s.waitForTimeout(250);
  }
}
async function klick(zug) {
  const z = await lies(); const k = z.kn.find(x => x.zug === zug);
  if (!k || k.aus || !k.hit) return { ok: false, k };
  await s.mouse.click(k.x, k.y); await s.waitForTimeout(250); return { ok: true, k };
}
await oeffneSud();
let z = await lies();
console.log('START kasse', z.kasse, 'verf', z.verfahren, 'fest', z.fest);
let r = await klick(KAUF);
if (!r.ok) { console.log('KAUF nicht klickbar', JSON.stringify(r.k)); await b.close(); process.exit(0); }
z = await lies();
console.log('GEKAUFT', KAUF, '-> kasse', z.kasse, 'verf', z.verfahren, 'fest', z.fest);
r = await klick(ZUR); z = await lies();
console.log('SOFORT ZURUECK', ZUR, 'klickbar=' + r.ok, r.ok ? ('-> verf ' + z.verfahren) : '');
r = await klick(KAUF); z = await lies();
console.log('WIEDER HIN  ', KAUF, 'klickbar=' + r.ok, r.ok ? ('-> kasse ' + z.kasse) : '');
for (let w = 0; w < W; w++) {
  await klick('fuhre:wie-vorige'); await klick('fuhre:fuellen');
  await klick('fuhre:abschicken'); await klick('weiter');
  await s.waitForTimeout(120); await oeffneSud();
}
z = await lies();
console.log('nach', W, 'Wochen:', z.jahr + '/' + z.woche, 'verf', z.verfahren);
r = await klick(ZUR); z = await lies();
console.log('SPAETER ZURUECK', ZUR, 'klickbar=' + r.ok, r.ok ? ('-> verf ' + z.verfahren) : '');
console.log('lage', z.lage, 'seitenfehler', fehler.length);
await b.close();
