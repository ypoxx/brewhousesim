/* Frage F, Kandidat 3 — NUTZEN, sauber isoliert.

   Die Sammelhand konnte 'konzern' in 1970 in zwei Laeufen (150+ echte Wochen)
   NIE greifen, obwohl F2 zeigt: sie liegt volle Sicht, ein Klick vom Griff
   entfernt. Der Grund ist vermutlich, dass die eigene Erkundung/Kauf-Routine
   die Tafel wieder zuklappt, bevor der gezielte Griff dran ist — ein
   Erreichbarkeits-, kein Sichtbarkeits- oder Nutzenproblem.

   Dieses Skript umgeht das Problem, um den NUTZEN trotzdem sauber zu messen:
   EIN gezielter Klick auf 'preis:festlege:<key>' (oder keiner, im
   Kontroll-Lauf), danach ausschliesslich `B.uhr.springe(n)` — die dokumentierte
   API fuer "n Braujahre erzaehlen", die selbst keine Kaufentscheidung trifft.
   Beide Laeufe (mit/ohne) sind danach WORT-FUER-WORT gleich bis auf die eine
   Festlegung; jeder Unterschied in der Endkasse kommt aus genau dieser einen
   Entscheidung.

   HAFEN=8936 SAAT=1350 node nutzen-f3.mjs <epoche> <festlege-key|keine> <braujahre> <lauf-name>
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const ep      = +(process.argv[2] || 4);
const KEY     = process.argv[3] || 'keine';
const JAHRE   = +(process.argv[4] || 6);
const LAUF    = process.argv[5] || `nutzen-e${ep}-${KEY}`;
const HAFEN   = process.env.HAFEN || '8936';
const SAAT    = process.env.SAAT || '1350';
const WURZ    = '/home/user/brewhousesim/werkbank/schuss/welle14';

const browser = await chromium.launch();
const seite = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
const fehler = [];
seite.on('pageerror', e => fehler.push(String(e).slice(0, 250)));
seite.on('console', m => { if (m.type() === 'error') fehler.push('console: ' + m.text().slice(0, 250)); });

const URL = `http://127.0.0.1:${HAFEN}/spiel/?epoche=${ep}&saat=${SAAT}&neu=1`;
await seite.goto(URL, { waitUntil: 'networkidle' });
await seite.waitForTimeout(1000);

async function lage() {
  return await seite.evaluate(() => {
    const B = window.BRAUHAUS;
    return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, kasse: B.welt.haus.kasse,
      ende: !!B.welt.zeit.ende, endgrund: B.welt.zeit.endgrund || null };
  });
}
async function klickZug(zug) {
  const el = await seite.evaluateHandle((z) => document.querySelector(`[data-zug="${z}"]`), zug);
  const box = await el.asElement()?.boundingBox();
  if (!box) return false;
  await seite.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await seite.waitForTimeout(300);
  return true;
}

const vor = await lage();
let festlegungOk = null;
if (KEY !== 'keine') {
  const griffOk = await klickZug('preis:tafel');
  await seite.waitForTimeout(300);
  const zug = `preis:festlege:${KEY}`;
  const vorKlick = await seite.evaluate((z) => {
    const el = document.querySelector(`[data-zug="${z}"]`);
    if (!el) return null;
    return { aus: !!el.disabled, preis: el.getAttribute('data-preis'), text: el.textContent };
  }, zug);
  const geklickt = await klickZug(zug);
  const nachKlick = await lage();
  festlegungOk = { griffOk, vorKlick, geklickt, kasseVor: vor.kasse, kasseNach: nachKlick.kasse };
  await klickZug('preis:tafel-zu');
}

/* Sonst IDENTISCH weiterspielen: die Fuhre auf denselben Plan setzen (einmal,
   "wie vorige Woche" braucht einen ersten Plan) und danach 'fuhre:sprung'
   ("faehrt dieselbe Runde weiter, ohne dass jemand hinsieht") verwenden,
   solange er da ist — bei jedem Halt (Michaeli, Uebergabe-Angebot) NUR die
   Tafel schliessen, NIE etwas kaufen. Das haelt beide Laeufe (mit/ohne
   Festlegung) auf demselben Pfad, bis auf die eine Entscheidung. */
async function schirm2() {
  return await seite.evaluate(() => {
    const zuege = [];
    document.querySelectorAll('[data-zug]').forEach(el => {
      const r = el.getBoundingClientRect();
      let hit = false;
      if (r.width && r.height) {
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        if (cx >= 0 && cy >= 0 && cx <= innerWidth && cy <= innerHeight) {
          const t = document.elementFromPoint(cx, cy);
          hit = !!(t && (t === el || el.contains(t)));
        }
      }
      zuege.push({ zug: el.getAttribute('data-zug'), aus: !!el.disabled, hit,
        text: (el.textContent || '').trim().slice(0, 60),
        x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) });
    });
    const B = window.BRAUHAUS;
    return { jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche, kasse: B.welt.haus.kasse,
      ende: !!B.welt.zeit.ende, zuege };
  });
}
async function klick(x, y) {
  await seite.mouse.click(x, y); await seite.waitForTimeout(220);
}

/* Erster Fuhrplan, damit 'wie vorige Woche' und 'fuhre:sprung' ueberhaupt
   etwas zu wiederholen haben. */
{
  const s = await schirm2();
  const plan = s.zuege.find(z => z.zug && z.zug.startsWith('fuhre:plan:') && z.hit && !z.aus);
  if (plan) await klick(plan.x, plan.y);
}

const ZIEL_WOCHEN = JAHRE * 30;
let runden = 0, sprungKlicks = 0, weiterKlicks = 0, tafelZuKlicks = 0;
const start0 = await lage();
while (runden < ZIEL_WOCHEN * 3) {   // grosszuegige Deckel, ein 'sprung' deckt mehrere Wochen ab
  runden++;
  let s = await schirm2();
  if (s.ende) break;
  const jetztWochen = (s.jahr - start0.jahr) * 30 + s.woche;
  if (jetztWochen >= ZIEL_WOCHEN) break;

  const sprung = s.zuege.find(z => z.zug === 'fuhre:sprung' && z.hit && !z.aus);
  if (sprung) { await klick(sprung.x, sprung.y); sprungKlicks++; continue; }

  /* Liefern zuerst — sonst stirbt das Haus an "kein Abnehmer mehr" und die
     Restpartie ist vorbei, bevor die Festlegung ueberhaupt wirken kann. Das
     ist die eine zugelassene Handlung ausser der Festlegung selbst. */
  const plan2 = s.zuege.find(z => z.zug && z.zug.startsWith('fuhre:plan:') && z.hit && !z.aus);
  if (plan2) { await klick(plan2.x, plan2.y); continue; }
  /* Dann 'weiter' — NICHT den Tafel-Griff, der ist ein Auf/Zu-Schalter und
     wuerde sonst endlos zwischen offen und zu hin- und herklicken, ohne die
     Woche je zu bewegen (genau der Fehler des ersten Versuchs: 540
     Griffklicks, keine einzige Woche weiter). */
  const weiterBtn = s.zuege.find(z => z.zug === 'weiter' && z.hit && !z.aus);
  if (weiterBtn) { await klick(weiterBtn.x, weiterBtn.y); weiterKlicks++; continue; }
  /* Nur schliessen, wenn die Tafel gerade OFFEN ist (Text zeigt "schließen"). */
  const griffOffen = s.zuege.find(z => z.zug === 'preis:tafel' && z.hit && !z.aus && z.text && /schließen/i.test(z.text));
  if (griffOffen) { await klick(griffOffen.x, griffOffen.y); tafelZuKlicks++; continue; }
  break;   // nichts mehr zu tun ohne zu kaufen
}
const sprung = { runden, sprungKlicks, weiterKlicks, tafelZuKlicks };

const nach = await lage();
const ausgabe = {
  epoche: ep, festlegeKey: KEY, braujahre: JAHRE, lauf: LAUF,
  vor, festlegungOk, sprung, nach,
  kasseDelta: nach.kasse - vor.kasse,
  fehler
};
fs.writeFileSync(`${WURZ}/protokoll/${LAUF}-ergebnis.json`, JSON.stringify(ausgabe, null, 1));
console.log(JSON.stringify(ausgabe));
await browser.close();
