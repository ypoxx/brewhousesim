import { neuerBrowser, neueSeite, adresse, gehezu, zuege } from './lib.mjs';

const browser = await neuerBrowser();

// Test A: Klick auf eine LEERE Stelle (Himmel oben rechts, kein data-zug dort)
{
  const { page, context } = await neueSeite(browser, { breite: 1600, hoehe: 900 });
  await gehezu(page, adresse({ epoche: 1, saat: 1350, neu: true }));
  const vor = await zuege(page);
  const punkt = await page.evaluate(() => {
    const el = document.elementFromPoint(1550, 20);
    return { tag: el ? el.tagName : null, zug: el ? (el.closest('[data-zug]') || {}).getAttribute?.('data-zug') : null };
  });
  await page.mouse.move(1550, 20);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitForTimeout(150);
  const nach = await zuege(page);
  console.log('TEST A — Klick auf leere Stelle', punkt, ': vor', vor.length, 'nach', nach.length);
  await context.close();
}

// Test B: GAR KEIN Klick, nur Mausbewegung ohne down/up
{
  const { page, context } = await neueSeite(browser, { breite: 1600, hoehe: 900 });
  await gehezu(page, adresse({ epoche: 1, saat: 1350, neu: true }));
  const vor = await zuege(page);
  await page.mouse.move(35, 869); // Position des Anfangen-Knopfs, aber ohne Klick
  await page.waitForTimeout(150);
  const nach = await zuege(page);
  console.log('TEST B — nur Mausbewegung, kein Klick: vor', vor.length, 'nach', nach.length);
  await context.close();
}

// Test C: mousedown+up GENAU auf dem Anfangen-Knopf, aber Seite danach NICHT bewegt
{
  const { page, context } = await neueSeite(browser, { breite: 1600, hoehe: 900 });
  await gehezu(page, adresse({ epoche: 1, saat: 1350, neu: true }));
  const vor = await zuege(page);
  const r = await page.evaluate(() => {
    const el = document.querySelector('[data-zug="kern:anfangen"]');
    const rect = el.getBoundingClientRect();
    return { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 };
  });
  await page.mouse.move(r.cx, r.cy);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitForTimeout(150);
  const nach = await zuege(page);
  console.log('TEST C — Klick auf Anfangen: vor', vor.length, 'nach', nach.length);
  await context.close();
}

await browser.close();
