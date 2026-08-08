import { neuerBrowser, neueSeite, adresse, gehezu } from './lib.mjs';
const browser = await neuerBrowser();
const faelle = [
  { epoche: 1, saat: 1350, zuege: ['fuhre:bann:brueckenwirt', 'fuhre:bann:faehrhaus', 'fuhre:bann:hirsch', 'fuhre:bann:obernberg'] },
  { epoche: 4, saat: 1970, zuege: ['fuhre:laden:brueckenwirt', 'fuhre:listen:faehrhaus', 'fuhre:listen:hirsch', 'fuhre:listen:markt', 'fuhre:listen:bahnhofswirt'] }
];
for (const f of faelle) {
  const { page, context } = await neueSeite(browser, { breite: 1600, hoehe: 900 });
  await gehezu(page, adresse({ epoche: f.epoche, saat: f.saat, neu: true }));
  const r = await page.evaluate((zuegeNamen) => {
    return zuegeNamen.map((zug) => {
      const el = document.querySelector('[data-zug="' + zug + '"]');
      if (!el) return { zug, existiert: false };
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      const top = document.elementFromPoint(cx, cy);
      const istZettel = top ? !!top.closest('.startzettel') : false;
      let pfad = [], e = el;
      for (let i = 0; i < 7 && e; i++) { pfad.push(e.tagName + '.' + (e.className || '')); e = e.parentElement; }
      return {
        zug, istZettel, topTag: top ? top.tagName : null, topKlasse: top ? String(top.className) : null,
        pfad
      };
    });
  }, f.zuege);
  console.log('Epoche', f.epoche, JSON.stringify(r, null, 2));
  await context.close();
}
await browser.close();
