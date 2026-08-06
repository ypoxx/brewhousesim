/* WELCHE ZUEGE KANN DIE HAND UEBERHAUPT NOCH TREFFEN?
     node werkbank/schuss/aufsicht/welle8-trennprobe/knoepfe.mjs

   Die Trennprobe hat gezeigt: DIE STADT hat 1350 verarmt, und es brauchte ihre
   .css, damit es sich zeigt — also das Layout. Dieses Geraet nennt den Weg
   dorthin. Es stellt beide Staende dieselbe Frage, die die messende Hand sich
   in jeder Woche stellt: liegt die Mitte dieses Knopfes frei?

   Der Treffertest ist WOERTLICH der aus rueckkopplung-r3/linie.mjs (Mitte des
   Kastens, elementFromPoint, Treffer wenn das Element sich selbst oder ein Kind
   findet) — eine andere Lesart waere hier wertlos, weil genau diese Lesart
   entscheidet, was die Hand klickt.

   Gemessen wird im Format der messenden Hand, 1920x1000, nicht 2752x1536.
   Wer die Deckung misst, nimmt die Entwurfsleinwand; wer die BEDIENBARKEIT
   misst, nimmt den Schirm, auf dem gespielt wird.                            */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const STAENDE = [
  ['STADT alt (ohneStadt)', 8912],
  ['STADT neu (Welle 8)  ', 8906]
];
const EPOCHE = +(process.argv[2] || 1);
const WOCHEN = +(process.argv[3] || 0);   // wieviele Wochen vorher gespielt wird

const lies = async (hafen) => {
  const b = await chromium.launch();
  const s = await b.newPage({ viewport: { width: 1920, height: 1000 } });
  const fehler = [];
  s.on('pageerror', e => fehler.push(String(e)));
  await s.goto(`http://127.0.0.1:${hafen}/spiel/?epoche=${EPOCHE}&saat=1350`, { waitUntil: 'load' });
  await s.waitForTimeout(1500);
  /* Am Ladepunkt sind beide Staende Zug fuer Zug gleich — gemessen, 104/81/35
     in beiden. Die Wege trennen sich erst im Spiel. Deshalb WEITER klicken,
     bevor gezaehlt wird: nur so sieht man, was die Hand in Woche 9 vorfindet,
     und in Woche 9 faengt der alte Stand an, Faesser zu verkaufen. */
  for (let i = 0; i < WOCHEN; i++) {
    const w = await s.$('[data-zug="weiter"], [data-zug$=":weiter"]');
    if (!w) break;
    try { await w.click({ timeout: 2000 }); } catch { break; }
    await s.waitForTimeout(260);
  }
  await s.waitForTimeout(600);
  const r = await s.evaluate(() => {
    const zuege = [];
    document.querySelectorAll('[data-zug]').forEach(el => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      let hit = false, drueber = null;
      if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
        const t = document.elementFromPoint(cx, cy);
        hit = !!(t && (t === el || el.contains(t)));
        if (!hit && t) drueber = (t.className && typeof t.className === 'string')
          ? t.className.split(/\s+/)[0] : t.tagName.toLowerCase();
      }
      zuege.push({ zug: el.getAttribute('data-zug'), aus: !!el.disabled, hit, drueber });
    });
    return { zuege, lage: window.BRAUHAUS.lage.length, kasse: window.BRAUHAUS.welt.haus.kasse };
  });
  await b.close();
  return { ...r, fehler };
};

const raus = {};
for (const [name, hafen] of STAENDE) {
  const d = await lies(hafen);
  raus[name] = d;
  const offen = d.zuege.filter(z => !z.aus);
  const blind = offen.filter(z => !z.hit);
  console.log(`${name} :${hafen}  ${d.zuege.length} Zuege · offen ${offen.length} · ` +
              `davon VERDECKT ${blind.length} · Kasse ${d.kasse} · lage ${d.lage} · ` +
              `Seitenfehler ${d.fehler.length}`);
  for (const z of blind) console.log(`      verdeckt: ${z.zug}   (darueber: ${z.drueber})`);
}

const [a, b] = Object.values(raus);
const kA = new Set(a.zuege.filter(z => !z.aus && z.hit).map(z => z.zug));
const kB = new Set(b.zuege.filter(z => !z.aus && z.hit).map(z => z.zug));
const weg = [...kA].filter(z => !kB.has(z));
const dazu = [...kB].filter(z => !kA.has(z));
console.log(`\nklickbar in ALT, nicht mehr in NEU (${weg.length}):`);
weg.forEach(z => console.log('   -', z));
console.log(`klickbar erst in NEU (${dazu.length}):`);
dazu.forEach(z => console.log('   +', z));
