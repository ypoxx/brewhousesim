/* WELLE 12 — R9: DIE FRAGE IN EINEM AUFRUF.
   HAFEN=8942 node werkbank/schuss/rahmen-w12/geraet.mjs [wochen]

   Was bisher neun Laeufe zu je vier Minuten gekostet hat („spielt diese Saat
   zwei Partien?"), fragt hier eine Abfrage IM SPIEL:

     BRAUHAUS.runde.pruefe()      -> [] heisst: der Rahmen hat nichts zu melden
     await BRAUHAUS.runde.nachwehen()
                                  -> nimmt den Abdruck der Klemmenlage UND
                                     aller Zuege, wartet 1,2 s, in denen
                                     niemand etwas anfasst, und sieht noch
                                     einmal hin. `ruhig: true` heisst: die
                                     Runde war fertig, als sie zu Ende ging.

   Dazu die Mindestbedingung der Aufsicht: vier Epochen laden,
   BRAUHAUS.lage leer, keine Konsolenfehler. Und die Griffe aus Welle 10:
   haushalt.pruefe(), haushalt.tafeln(), stadt.rahmen.verdeckt().

   Mit WOCHEN=n wird vor der Probe n-mal WEITER gedrueckt — die Frage ist ja
   nicht, ob der LADEzustand ruhig ist, sondern der gespielte.
*/
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const HAFEN = process.env.HAFEN || '8942';
const SAAT = process.env.SAAT || '1350';
const WOCHEN = +(process.argv[2] || process.env.WOCHEN || 0);
const FRIST = +(process.env.FRIST || 1200);

const b = await chromium.launch();
let schlecht = 0;

for (const e of [1, 2, 3, 4]) {
  const s = await b.newPage({ viewport: { width: 1920, height: 1000 }, deviceScaleFactor: 1 });
  const f = [];
  s.on('console', m => { if (m.type() === 'error') f.push(m.text().slice(0, 160)); });
  s.on('pageerror', x => f.push('pageerror: ' + x.message.slice(0, 160)));
  await s.goto(`http://127.0.0.1:${HAFEN}/spiel/?epoche=${e}&saat=${SAAT}`, { waitUntil: 'networkidle' });
  await s.waitForTimeout(900);

  for (let i = 0; i < WOCHEN; i++) {
    await s.evaluate(() => { const k = document.querySelector('[data-zug="weiter"]'); if (k) k.click(); });
    await s.waitForTimeout(70);
  }
  await s.waitForTimeout(300);

  /* Damit dieselbe Frage auch am VORZUSTAND gestellt werden kann, an dem es
     `BRAUHAUS.runde` noch gar nicht gibt, traegt die Probe ihre eigene
     Fassung von `nachwehen()` mit sich. Sie liest genau dieselben zwei
     Abdruecke (Klemmenlage, Zuege) und wartet dieselbe Frist. */
  const d = await s.evaluate(async (frist) => {
    const B = window.BRAUHAUS;
    const KLEMMEN = '.stadt-zugeklappt, .stadt-verdeckt, .kern-blatt-zu';
    const abdruck = () => [...document.querySelectorAll(KLEMMEN)]
      .map(el => ((el.closest('.fach') || {}).id || '?') + '/' + el.className).sort().join('|');
    const T = '\u0001', S = '\u0002';
    const schirm = () => [...document.querySelectorAll('[data-zug]')]
      .map(el => el.getAttribute('data-zug') + T + (el.disabled ? '1' : '0')
        + T + String(el.textContent || '').replace(/\s+/g, ' ').trim())
      .sort().join(S);
    const eigen = async () => {
      const a1 = abdruck(), s1 = schirm();
      await new Promise(f => setTimeout(f, frist));
      const a2 = abdruck(), s2 = schirm();
      const raus = [];
      if (a1 !== a2) raus.push({ was: 'klemmenlage', vorher: a1, nachher: a2,
        sagt: 'Klemmenlage hat sich nach dem Ende der Runde geaendert.' });
      if (s1 !== s2) {
        const zerlege = t => new Map(t.split(S).filter(Boolean).map(z => [z.split(T)[0], z]));
        const m1 = zerlege(s1), m2 = zerlege(s2);
        const zeig = x => {
          if (!x) return '(fort)';
          const t = x.split(T);
          return (t[1] === '1' ? 'gesperrt \u00b7 ' : '') + (t[2] || '').slice(0, 60);
        };
        const u = [];
        for (const [k, v] of m1) if (v !== m2.get(k) && u.length < 12) u.push({ zug: k, vorher: zeig(v), nachher: zeig(m2.get(k)) });
        raus.push({ was: 'zuege', unterschiede: u,
          sagt: 'Beschriftung oder Sperre eines Zuges hat sich nach dem Ende der Runde geaendert.' });
      }
      return { frist, ruhig: raus.length === 0, beanstandungen: raus, eigen: true };
    };
    const nw = (B.runde && B.runde.nachwehen) ? await B.runde.nachwehen(frist) : await eigen();
    let verdeckt = null;
    try { verdeckt = B.stadt.rahmen.verdeckt().length; } catch (x) { verdeckt = 'kein Griff'; }
    return {
      jahr: B.welt.zeit.jahr, woche: B.welt.zeit.woche,
      lage: B.lage.length,
      zuege: document.querySelectorAll('[data-zug]').length,
      rundePruefe: B.runde ? B.runde.pruefe() : 'KEIN kern/runde.js',
      rundeZeile: B.runde ? B.runde.zeile() : '—',
      nachwehen: nw,
      haushalt: B.haushalt ? B.haushalt.pruefe() : null,
      tafeln: B.haushalt ? B.haushalt.tafeln() : null,
      ueberRand: B.haushalt ? B.haushalt.ueberRand() : null,
      verdeckt
    };
  }, FRIST);

  const ruhig = d.nachwehen && d.nachwehen.ruhig;
  const ok = ruhig && d.lage === 0 && f.length === 0;
  if (!ok) schlecht++;
  console.log(`E${e} ${d.jahr}/W${d.woche}  ${ok ? 'RUHIG' : '!! UNRUHIG'}`
    + `  lage=${d.lage} fehler=${f.length} zuege=${d.zuege} verdeckt=${d.verdeckt}`
    + ` tafeln=${(d.tafeln || []).length} ueberRand=${(d.ueberRand || []).length}`
    + ` haushalt=${(d.haushalt || []).length}`);
  console.log('     ' + d.rundeZeile);
  if (d.rundePruefe && d.rundePruefe.length) {
    d.rundePruefe.forEach(r => console.log(`     runde.pruefe: ${r.was} (${r.zahl}) — ${r.sagt}`));
  }
  if (!ruhig && d.nachwehen) {
    d.nachwehen.beanstandungen.forEach(x => {
      console.log(`     NACHWEHEN ${x.was}: ${x.sagt}`);
      (x.unterschiede || []).forEach(u => console.log(`        ${u.zug}: "${u.vorher}" -> "${u.nachher}"`));
      if (x.was === 'klemmenlage') {
        console.log(`        vorher : ${x.vorher}`);
        console.log(`        nachher: ${x.nachher}`);
      }
    });
  }
  f.slice(0, 4).forEach(x => console.log('     FEHLER ' + x));
  await s.close();
}
await b.close();
console.log(schlecht ? `!! ${schlecht} von 4 Epochen unruhig` : 'ALLE VIER EPOCHEN RUHIG');
process.exit(schlecht ? 1 : 0);
