/* WAS `B.uhr.springe()` MIT DER FUHRE MACHT — gemessen, nicht behauptet.

   WELLE-13 R13 nennt `B.uhr.springe(12)` als das Werkzeug fuer „ruhige Jahre
   werden erzaehlt, nicht geklickt" und haelt fest, dass kein Stueck es je
   ruft. Bevor DIE WOCHE es ruft, wird nachgesehen, was es tut: die Uhr setzt
   `woche = 30` und ruft `schliesseJahr()` — also faellt fuer jedes
   uebersprungene Jahr die volle Jahresabrechnung an (`jahresende`, `jahr`),
   aber KEIN einziges `woche`-Ereignis. Fuer DIE FUHRE heisst das: kein Sud,
   keine Fuhre, kein Umlauf, kein Unterhalt, keine Frist — und trotzdem
   `mahnenUndVerlieren`.

   Gemessen wird der Unterschied an den Zahlen, die die Partie tragen.
   HAFEN=8923 node springeprobe.mjs <epoche> [jahre]                        */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const ep = +(process.argv[2] || 1);
const JAHRE = +(process.argv[3] || 1);
const HAFEN = process.env.HAFEN || '8923';
const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const fehler = [];
seite.on('pageerror', e => fehler.push(String(e).slice(0, 200)));
await seite.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=1350&neu=1`, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1500);

const lese = () => seite.evaluate(() => {
  const B = window.BRAUHAUS;
  const f = B.fuhre ? B.fuhre.stand() : {};
  return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, ende: !!B.welt.zeit.ende,
    endgrund: B.welt.zeit.endgrund || null,
    kasse: B.welt.haus.kasse, rohstoff: B.welt.haus.rohstoff,
    faesser: B.welt.vorrat.faesser.length,
    haeuser: B.welt.adressenJetzt().filter(a => !(f.verloren || []).includes(a.schluessel)).length,
    verloren: (f.verloren || []).length, fuhren: f.fuhren, frist: f.frist,
    chronik: (B.welt.chronik || []).length, lage: B.lage.length };
});

const vorher = await lese();
const w = await seite.evaluate((n) => {
  const B = window.BRAUHAUS;
  let woche = 0, jahr = 0;
  const aw = () => woche++, aj = () => jahr++;
  B.auf('woche', aw); B.auf('jahr', aj);
  B.uhr.springe(n);
  B.ab('woche', aw); B.ab('jahr', aj);
  return { wocheEreignisse: woche, jahrEreignisse: jahr };
}, JAHRE);
await seite.waitForTimeout(600);
const nachher = await lese();

console.log(JSON.stringify({ epoche: ep, gesprungeneJahre: JAHRE, ereignisse: w,
  vorher, nachher, fehler }, null, 1));
await browser.close();
