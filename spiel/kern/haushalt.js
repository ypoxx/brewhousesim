/* ===========================================================================
   kern/haushalt.js — DER FLAECHENHAUSHALT UND DIE BLATTAUFSICHT.
   GEHOERT DEM SKELETT.  Neu in Welle 10.

   Drei Dinge, die kein einzelnes Stueck haben kann, weil sie ueber alle acht
   zugleich gelten:

     1  DER HAUSHALT (Auflage R6/A15).  Jedes Stueck bekommt eine Obergrenze
        in Bildpunkten — eine fuer die ganze Flaeche, eine fuer das oberste
        Sechstel. Der Rahmen misst, wieviel jedes wirklich deckt, und
        `BRAUHAUS.haushalt.pruefe()` sagt, wer darueber liegt. Leere Liste =
        in Ordnung, genau wie `BRAUHAUS.stadt.rahmen.verdeckt()`.

     2  DIE BLATTAUFSICHT (Auflage R2/A16).  Hoechstens EIN ganzseitiges
        Blatt liegt gleichzeitig auf, und Escape raeumt den Tisch leer —
        nicht die oberste Tafel gegen die naechste tauschen.

     3  DIE RANDWACHE (Auflage R3/A8).  Kein Kasten haengt aus der Flaeche.
        Der Rahmen kann einen fremden Kasten nicht verruecken; er kann ihn
        nennen. `BRAUHAUS.haushalt.ueberRand()` nennt ihn, mit Stueck,
        Klasse und Mass.

   ---------------------------------------------------------------------------
   WAS EIN KASTEN IST — dieselbe Regel wie beim blinden Kritiker
   ---------------------------------------------------------------------------
   `werkbank/schuss/bild-w9/deckung.mjs` trennt NACH EIGENSCHAFT, nicht nach
   Ebene: Kasten ist, was einen deckenden Grund (Alpha > 0,35 oder einen
   Verlauf) oder einen sichtbaren Rand (>= 1 px, Alpha > 0,3) hat. Was nur ein
   freigestelltes Bild oder Schrift traegt, ist WELT. Die beiden aelteren
   Geraete (`aufsicht/deckung-je-stueck.mjs`, `bild-w8/deckung.mjs`) trennen
   nach Ebene und loeschen dabei gemalte Schilder, Faesser und Wagen mit; der
   Kritiker hat sie aus genau diesem Grund verworfen, und dieses Modul auch.

   ---------------------------------------------------------------------------
   WAS DIE MESSUNG HIER KANN UND WAS NICHT — ehrlich, weil es sonst truegt
   ---------------------------------------------------------------------------
   Der Kritiker misst photographisch: zwei Aufnahmen, einmal mit und einmal
   ohne die Kaesten, Unterschied in Bildpunkten. Das kann eine Seite ueber
   sich selbst nicht — sie hat keine Kamera. Dieses Modul VEREINIGT statt
   dessen die HUELLEN aller Kaesten eines Stuecks auf einem Raster von 4 px
   und zaehlt die belegten Zellen.

   Wie nah das ist, wurde vor der ersten Zeile Code nachgerechnet
   (`werkbank/schuss/rahmen-w10/ARBEITSSTAND.md`, Punkt 3): im Ladezustand
   E1 sind die Huellen des Rahmens 105.123 + 33.033 = 138.156 px, und
   `messen.mjs` misst photographisch 138.084 px im obersten Sechstel — 0,05 %
   Unterschied. Die Vereinigung ist also brauchbar.

   SIE IST TROTZDEM NICHT DASSELBE, und zwar in beide Richtungen:
     * ZU VIEL zaehlt sie bei einem Kasten, der einen Rand hat, aber
       durchsichtig ist: die Huelle deckt, was in ihr durchsichtig ist, nicht.
     * ZU WENIG zaehlt sie bei Schlagschatten, die neben die Huelle fallen.
   Wer eine Zahl vor den blinden Kritiker traegt, misst mit
   `werkbank/schuss/rahmen-w10/messen.mjs`. Diese hier ist der Haushalt IM
   SPIEL, damit ein Stueck-Bauer nicht erst eine Kamera bauen muss, um zu
   sehen, ob er ueber seiner Grenze liegt.
   =========================================================================== */

(function (B) {
  'use strict';

  /* Bezugsformat der Buehne. Alle Grenzen stehen in Bildpunkten DIESER
     Flaeche, unabhaengig davon, wie gross das Fenster gerade ist. */
  var BEZUG_B = 2752, BEZUG_H = 1536;
  var BEZUG_FLAECHE = BEZUG_B * BEZUG_H;              /* 4.227.072 */
  var SECHSTEL = BEZUG_FLAECHE / 6;                   /*   704.512 */

  /* Rasterweite der Vereinigung, in Bildpunkten des Bildschirms. 4 px ist
     fein genug (Fehler hoechstens 4 px je Kante) und billig genug, dass die
     Messung auf Zuruf laeuft, ohne den Bildaufbau zu halten. */
  var RASTER = 4;

  /* Ab hier ist ein Kasten ein GANZSEITIGES BLATT (Auflage A16 nennt die
     Zahl: 200.000 px^2 auf 2752x1536). */
  var BLATTGRENZE = 200000;

  /* ======================================================================
     DER HAUSHALT — die Zahlen, die Welle 11 einzuhalten hat.

     Die Rechnung dahinter, in einem Satz: A15 verlangt unter 8 % Deckung im
     Ladezustand (= 338.166 px) und unter 25 % im obersten Sechstel
     (= 176.128 px). Die Summe der Anteile ist immer GROESSER ODER GLEICH dem
     Ganzen, weil sich Kaesten ueberlappen — wer also die Summe der Grenzen
     unter die Latte legt, hat die Latte sicher genommen, egal wie die
     Stuecke sich ueberlagern. Deshalb summieren sich diese Grenzen auf
     332.000 px (7,86 %) und 171.000 px im obersten Sechstel (24,3 %), und
     der Rest ist Vorrat.

     Wer wieviel bekommt:
       kern   — was das ZIELBLATT dem Rahmen gibt, und knapp darunter:
                Kopfleiste 1610x72 + WEITER-Tafel 262x62 = 132.164 px.
                Der Rahmen nimmt sich 120.000.
       stadt  — die Reiterzeile plus die vier GEMALTEN Ortsschilder. Die
                zaehlt der Kritiker als Kasten (sie haben deckenden Grund)
                und rechnet sie selbst mit rund 28.000 px als Welt heraus.
       preis  — Michaelitafel und Chronikgriff, beide oben.
       fuhre  — vier Reiter und die Hofanzeige.
       gegner — die Gegnerkarte.
       erbe   — die Erbe-Leiste.
       sud    — ein Reiter und das zugeklappte Brett.
       name   — das Band.
       klang  — der Notenknopf, 50x50.
     ====================================================================== */
  var GRENZEN = {
    kern:   { gesamt: 120000, oben: 80000 },
    stadt:  { gesamt:  40000, oben: 26000 },
    sud:    { gesamt:  34000, oben:  6000 },
    fuhre:  { gesamt:  34000, oben: 10000 },
    gegner: { gesamt:  28000, oben:  8000 },
    erbe:   { gesamt:  28000, oben:  6000 },
    preis:  { gesamt:  24000, oben: 20000 },
    name:   { gesamt:  20000, oben: 12000 },
    klang:  { gesamt:   4000, oben:  3000 }
  };
  /* Ein Stueck, das hier nicht steht, bekommt den Rest — und faellt damit
     sofort auf. Kein stiller Freibrief. */
  var UNBEKANNT = { gesamt: 6000, oben: 5000 };

  /* ---------------------------------------------------------------------- */

  function buehneEl() { return document.getElementById('buehne'); }

  function alpha(farbe) {
    var m = String(farbe || '').match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    var p = m[1].split(',').map(parseFloat);
    return p.length > 3 ? p[3] : 1;
  }

  /* Weggeschnitten ist nicht offen: `clip-path: inset(50%)` traegt die
     Huelle weiter, deckt aber nichts. `.stadt-zugeklappt` und
     `.kern-blatt-zu` arbeiten beide so. */
  function weggeschnitten(c) {
    return /inset\(\s*50%/.test(c.clipPath || '');
  }

  function istKasten(c) {
    var a = alpha(c.backgroundColor);
    if (a !== null && a > 0.35) return true;
    if (/gradient/.test(c.backgroundImage || '')) return true;
    var breit = Math.max(
      parseFloat(c.borderTopWidth) || 0, parseFloat(c.borderRightWidth) || 0,
      parseFloat(c.borderBottomWidth) || 0, parseFloat(c.borderLeftWidth) || 0);
    if (breit < 1) return false;
    var ab = alpha(c.borderTopColor);
    if (ab === null) ab = alpha(c.borderBottomColor);
    return ab !== null && ab > 0.3;
  }

  function wemGehoert(el) {
    var f = el.closest ? el.closest('.fach') : null;
    return (f && f.getAttribute('data-stueck')) || 'ohne-fach';
  }

  /* ----------------------------------------------------------------------
     DIE EINE SAMMLUNG, auf der alles andere steht.
     ---------------------------------------------------------------------- */
  function sammle() {
    var bu = buehneEl();
    var VB = bu ? bu.clientWidth : BEZUG_B;
    var VH = bu ? bu.clientHeight : BEZUG_H;
    var liste = [];
    if (!bu) return { liste: liste, breite: VB, hoehe: VH };
    var alle = bu.querySelectorAll('*');
    for (var i = 0; i < alle.length; i++) {
      var el = alle[i];
      var r = el.getBoundingClientRect();
      if (r.width < 3 || r.height < 3) continue;
      /* Die Epochenplatte ist das einzige Element, dessen Flaeche den ganzen
         Schirm fuellt. Sie ist das BILD und wird ausgenommen — so haelt es
         der blinde Kritiker auch. */
      if (r.width >= VB * 0.98 && r.height >= VH * 0.98) continue;
      var c = getComputedStyle(el);
      if (c.visibility === 'hidden' || c.display === 'none') continue;
      if (parseFloat(c.opacity) < 0.05) continue;
      if (weggeschnitten(c)) continue;
      if (!istKasten(c)) continue;
      liste.push({
        el: el,
        stueck: wemGehoert(el),
        klasse: String(el.className && el.className.baseVal !== undefined
          ? el.className.baseVal : (el.className || '')),
        x: r.x, y: r.y, b: r.width, h: r.height,
        flaeche: r.width * r.height
      });
    }
    return { liste: liste, breite: VB, hoehe: VH };
  }

  /* ----------------------------------------------------------------------
     MESSEN — Vereinigung der Huellen je Stueck auf einem Raster.
     ---------------------------------------------------------------------- */
  function miss() {
    var s = sammle();
    var VB = s.breite, VH = s.hoehe;
    var sx = Math.ceil(VB / RASTER), sy = Math.ceil(VH / RASTER);
    var obenBis = Math.ceil((VH / 6) / RASTER);          /* oberstes Sechstel */
    /* Eine Zelle des Rasters, umgerechnet auf die Bezugsflaeche 2752x1536. */
    var jeZelle = (RASTER * RASTER) * (BEZUG_FLAECHE / (VB * VH));

    var felder = {};
    var ganz = new Uint8Array(sx * sy);
    var anzahl = {};

    function male(feld, k) {
      var x0 = Math.max(0, Math.floor(k.x / RASTER));
      var y0 = Math.max(0, Math.floor(k.y / RASTER));
      var x1 = Math.min(sx, Math.ceil((k.x + k.b) / RASTER));
      var y1 = Math.min(sy, Math.ceil((k.y + k.h) / RASTER));
      for (var y = y0; y < y1; y++) {
        var z = y * sx;
        for (var x = x0; x < x1; x++) feld[z + x] = 1;
      }
    }

    for (var i = 0; i < s.liste.length; i++) {
      var k = s.liste[i];
      if (!felder[k.stueck]) { felder[k.stueck] = new Uint8Array(sx * sy); anzahl[k.stueck] = 0; }
      anzahl[k.stueck]++;
      male(felder[k.stueck], k);
      male(ganz, k);
    }

    function zaehle(feld) {
      var g = 0, o = 0;
      for (var y = 0; y < sy; y++) {
        var z = y * sx, r = 0;
        for (var x = 0; x < sx; x++) r += feld[z + x];
        g += r;
        if (y < obenBis) o += r;
      }
      return { px: Math.round(g * jeZelle), obenPx: Math.round(o * jeZelle) };
    }

    var je = {}, ueber = [];
    Object.keys(felder).forEach(function (name) {
      var z = zaehle(felder[name]);
      var gr = GRENZEN[name] || UNBEKANNT;
      var eintrag = {
        stueck: name,
        kaesten: anzahl[name],
        px: z.px,
        anteil: 100 * z.px / BEZUG_FLAECHE,
        obenPx: z.obenPx,
        obenAnteil: 100 * z.obenPx / SECHSTEL,
        grenze: gr.gesamt,
        grenzeOben: gr.oben,
        bekannt: !!GRENZEN[name]
      };
      eintrag.ueber = z.px - gr.gesamt;
      eintrag.ueberOben = z.obenPx - gr.oben;
      je[name] = eintrag;
      if (eintrag.ueber > 0 || eintrag.ueberOben > 0) ueber.push(eintrag);
    });

    var gz = zaehle(ganz);
    ueber.sort(function (a, b2) { return b2.ueber - a.ueber; });

    return {
      flaeche: { breite: VB, hoehe: VH },
      bezug: { breite: BEZUG_B, hoehe: BEZUG_H, flaeche: BEZUG_FLAECHE },
      gesamt: { px: gz.px, anteil: 100 * gz.px / BEZUG_FLAECHE },
      oben: { px: gz.obenPx, anteil: 100 * gz.obenPx / SECHSTEL },
      kaesten: s.liste.length,
      je: je,
      ueber: ueber
    };
  }

  /* Die kurze Frage, genau wie `verdeckt()`: leere Liste heisst in Ordnung. */
  function pruefe() {
    return miss().ueber.map(function (e) {
      return e.stueck + ': ' + e.px + '/' + e.grenze + ' px'
        + (e.ueberOben > 0 ? '  oben ' + e.obenPx + '/' + e.grenzeOben + ' px' : '');
    });
  }

  /* Auflage R3/A8 — was aus der Flaeche haengt. Der Rahmen kann einen
     fremden Kasten nicht verruecken, ohne in fremdes DOM zu schreiben; er
     kann ihn nennen, und das ist der Weg fuer Welle 11. */
  function ueberRand() {
    var s = sammle();
    var raus = [];
    s.liste.forEach(function (k) {
      if (k.x < -0.5 || k.y < -0.5 || k.x + k.b > s.breite + 0.5 || k.y + k.h > s.hoehe + 0.5) {
        raus.push({
          stueck: k.stueck, klasse: k.klasse,
          mass: Math.round(k.b) + '×' + Math.round(k.h)
            + ' @' + Math.round(k.x) + ',' + Math.round(k.y),
          text: (k.el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40)
        });
      }
    });
    return raus;
  }

  /* ======================================================================
     DIE BLATTAUFSICHT  (Auflage R2/A16)

     BEFUND, der ihr zugrunde liegt, nachgestellt mit
     `werkbank/schuss/rahmen-w10/sonde.mjs` (30x WEITER, alle vier Epochen):
       ohne Escape liegt GENAU EIN Blatt ueber 200.000 px^2 auf — das
       Sommerblatt der FUHRE, 1596x943. `erb-buch` ist zu.
       Nach EINEM Escape ist das Sommerblatt fort und `erb-buch` 1156x1075
       ist AUF. Escape hat es nicht freigelegt, es hat es geoeffnet: der
       Rahmen der STADT schlaegt das naechste Brett auf, sobald der Deckel
       darueber faellt.
     Der blinde Kritiker konnte zwischen beiden Lesarten nicht entscheiden
     (§6 Punkt 6 seines Urteils). Jetzt ist es entschieden.

     Also: Escape heisst TISCH LEER, und zwar in einem Anschlag. Der Rahmen
     schliesst danach so lange nach, bis nichts Ganzseitiges mehr aufliegt —
     mit dem Griff des Stuecks, nicht gegen es.
     ====================================================================== */

  /* Ein Stueck kann dem Rahmen sagen, wie sein Blatt zugeht. Damit braucht
     die Aufsicht keine Klemme. FUER WELLE 11 der saubere Weg:
         BRAUHAUS.blatt.melde(el, function () { ...zumachen... }); */
  var gemeldet = [];       /* [{el, zu}] */

  function melde(el, zu) {
    if (!el || typeof zu !== 'function') return;
    for (var i = 0; i < gemeldet.length; i++) if (gemeldet[i].el === el) { gemeldet[i].zu = zu; return; }
    gemeldet.push({ el: el, zu: zu });
    if (gemeldet.length > 64) gemeldet.shift();
  }

  function eigenerGriff(el) {
    for (var i = 0; i < gemeldet.length; i++) if (gemeldet[i].el === el) return gemeldet[i].zu;
    return null;
  }

  /* Alle ganzseitigen Blaetter, die gerade wirklich decken. */
  function blaetter() {
    var s = sammle();
    var grenze = BLATTGRENZE * ((s.breite * s.hoehe) / BEZUG_FLAECHE);
    return s.liste.filter(function (k) { return k.flaeche > grenze; })
      .sort(function (a, b2) { return b2.flaeche - a.flaeche; });
  }

  var SCHLIESSWORT = /(^|[:\-])(zu|zumachen|schliessen|schliess|weg|zurueck|beiseite)$/i;
  var SCHLIESSTEXT = /^(schlie|zurück|beiseite|zumachen|weg\b)/i;

  function knopfImBlatt(el) {
    var kn = el.querySelectorAll('[data-zug]');
    for (var i = 0; i < kn.length; i++) {
      var k = kn[i];
      if (k.disabled) continue;
      var z = k.getAttribute('data-zug') || '';
      var t = (k.textContent || '').trim();
      if (SCHLIESSWORT.test(z) || SCHLIESSTEXT.test(t)) return k;
    }
    return null;
  }

  /* Der Reiter der STADT. Sie gibt jedem Brett einen und schreibt seinen
     Namen als `data-reiter` an das Brett selbst — daran wird er gefunden.
     Hilfsweise ueber den Schluessel im `data-zug`, der aus Stueckname und
     Klassen gebaut ist (`stadt:reiter:erbe-blatt-erb-buch`). */
  function reiterZu(k) {
    var reiter = document.querySelectorAll('[data-zug^="stadt:reiter:"]');
    var name = k.el.getAttribute('data-reiter');
    var i, r;
    if (name) {
      for (i = 0; i < reiter.length; i++) {
        r = reiter[i];
        if (!r.disabled && (r.textContent || '').trim().indexOf(name.trim()) === 0) return r;
      }
    }
    var klassen = k.klasse.split(/\s+/).filter(function (c) { return c && c !== 'blatt' && c !== 'amort'; });
    for (i = 0; i < reiter.length; i++) {
      r = reiter[i];
      if (r.disabled) continue;
      var zug = r.getAttribute('data-zug') || '';
      if (zug.indexOf(':' + k.stueck + '-') < 0 && zug.indexOf('-' + k.stueck + '-') < 0) continue;
      var passt = klassen.length > 0;
      for (var j = 0; j < klassen.length; j++) if (zug.indexOf(klassen[j]) < 0) passt = false;
      if (passt) return r;
    }
    return null;
  }

  /* Schliesst EIN Blatt. Gibt zurueck, womit — fuer den Bericht. */
  function schliesse(k) {
    var eigen = eigenerGriff(k.el);
    if (eigen) { B.wage('haushalt:griff', eigen); return 'griff'; }
    var kn = knopfImBlatt(k.el);
    if (kn) { kn.click(); return 'knopf:' + kn.getAttribute('data-zug'); }
    var r = reiterZu(k);
    if (r) { r.click(); return 'reiter:' + r.getAttribute('data-zug'); }
    /* Letzter Weg: wegklemmen. Weggeschnitten, nicht versteckt — Platz,
       Groesse und Umbruch bleiben stehen, gedeckt wird nichts, und die
       Klemme faellt beim naechsten Neuzeichnen des Stuecks von selbst ab.
       Wer hier landet, steht im Bericht und bekommt in Welle 11 einen
       eigenen Schliessknopf. */
    if (k.el.classList) k.el.classList.add('kern-blatt-zu');
    geklemmt[k.stueck + ' .' + k.klasse] = (geklemmt[k.stueck + ' .' + k.klasse] || 0) + 1;
    return 'klemme';
  }

  var geklemmt = {};

  /* Raeumt den Tisch. `alles` = jedes ganzseitige Blatt (Escape);
     sonst nur die aelteren, damit hoechstens EINES aufliegt. */
  function raeumeAuf(alles) {
    var offen = blaetter();
    if (!offen.length) return [];
    if (!alles && offen.length < 2) return [];
    /* Wer zuletzt aufgeschlagen wurde, bleibt liegen. Die Reihenfolge im
       DOM ist die des Aufschlagens nicht zuverlaessig; deshalb bleibt das
       Blatt mit dem hoechsten z-Wert bzw. das zuletzt eingehaengte. */
    var behalte = alles ? null : offen[offen.length - 1].el;
    var getan = [];
    offen.forEach(function (k) {
      if (k.el === behalte) return;
      if (!k.el.isConnected) return;
      getan.push(k.stueck + ' .' + k.klasse + ' -> ' + schliesse(k));
    });
    return getan;
  }

  /* Escape: nachfassen, bis der Tisch leer ist. Der Rahmen der STADT sieht
     alle 240 ms nach und kann ein Brett aufschlagen, nachdem der Rahmen es
     geschlossen hat — also wird in mehreren Anlaeufen geraeumt, die diesen
     Takt ueberspannen. Sieben Anlaeufe ueber 1,3 s; danach steht der Tisch. */
  var ANLAEUFE = [0, 60, 140, 260, 420, 640, 900, 1300];
  var laeuft = 0;

  function tischLeeren() {
    var marke = ++laeuft;
    ANLAEUFE.forEach(function (ms) {
      setTimeout(function () {
        if (marke !== laeuft) return;          /* ein neuer Escape hat uebernommen */
        B.wage('haushalt:escape', function () { raeumeAuf(true); });
      }, ms);
    });
  }

  /* Escape. Der Horcher von kern/kopf.js ist frueher angemeldet und
     schliesst zuerst das eigene Blatt des Rahmens; danach kommt dieser. */
  document.addEventListener('keydown', function (e) {
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.key === 'Escape') tischLeeren();
  });

  /* HOECHSTENS EIN GANZSEITIGES BLATT.
     Gedrosselt, und mit Absicht sparsam: die Regel greift nur, wenn wirklich
     ZWEI ganzseitige Blaetter zugleich decken. Gemessen ist das im heutigen
     Stand nie der Fall — der Rahmen der STADT haelt es schon —, und eine
     Wache, die staendig durch das DOM laeuft, wuerde den Bildaufbau bremsen
     und damit die zweite Messlatte bewegen. Sie bremst nichts, solange
     nichts zu tun ist: der Blick kostet einen Durchgang durch die Kaesten,
     hoechstens dreimal in der Sekunde. */
  var letzterBlick = 0;
  function wache() {
    var jetzt = Date.now();
    if (jetzt - letzterBlick < 350) return;
    letzterBlick = jetzt;
    B.wage('haushalt:wache', function () { raeumeAuf(false); });
  }

  B.auf('zeichne', function () {
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(wache);
    else wache();
  });

  /* ---------------------------------------------------------------------- */

  B.haushalt = {
    GRENZEN: GRENZEN,
    BLATTGRENZE: BLATTGRENZE,
    miss: miss,
    pruefe: pruefe,
    ueberRand: ueberRand,
    blaetter: function () {
      return blaetter().map(function (k) {
        return {
          stueck: k.stueck, klasse: k.klasse,
          mass: Math.round(k.b) + '×' + Math.round(k.h)
            + ' @' + Math.round(k.x) + ',' + Math.round(k.y),
          flaeche: Math.round(k.flaeche)
        };
      });
    },
    raeumeAuf: raeumeAuf,
    geklemmt: function () { return geklemmt; },
    /* Kurzfassung fuer die Konsole — eine Zeile je Stueck. */
    tafel: function () {
      var m = miss();
      var zeilen = ['FLAECHENHAUSHALT  gesamt ' + m.gesamt.anteil.toFixed(1) + ' %'
        + '   oberstes 1/6 ' + m.oben.anteil.toFixed(1) + ' %'
        + '   (' + m.kaesten + ' Kaesten)'];
      Object.keys(m.je).sort(function (a, b2) { return m.je[b2].px - m.je[a].px; })
        .forEach(function (n) {
          var e = m.je[n];
          zeilen.push('  ' + (n + '          ').slice(0, 10)
            + String(e.px).padStart(7) + ' / ' + String(e.grenze).padStart(6) + ' px'
            + (e.ueber > 0 ? '  UEBER +' + e.ueber : '        ')
            + '   oben ' + String(e.obenPx).padStart(6) + ' / ' + String(e.grenzeOben).padStart(6)
            + (e.ueberOben > 0 ? '  UEBER +' + e.ueberOben : ''));
        });
      return zeilen.join('\n');
    }
  };

  B.blatt = { melde: melde, aufsicht: raeumeAuf, offene: B.haushalt.blaetter };

})(BRAUHAUS);
