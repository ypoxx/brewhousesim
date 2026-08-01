/* ===========================================================================
   kern/ton.js — DER TONBUS.  Fuer Welle 2 uebergeben an DAS STUECK "DER KLANG"
   (ZUSTAENDIGKEIT.md §11). Alle anderen Kerndateien bleiben gesperrt.

   Im Skelett war das hier ein Nichtstuer, der nur mitschrieb. Jetzt klingt er.
   Die API bleibt Zeichen fuer Zeichen, wie sie war — vier Stuecke rufen sie:

       melde · spiele · schleife · halt · bett · setzeStumm · setzeLaut

   spiele() gibt weiterhin einen Wahrheitswert zurueck. Neu ist nur, dass er
   jetzt etwas bedeutet: true, wenn wirklich etwas erklungen ist.

   ---------------------------------------------------------------------------
   DIE LATTE, GEGEN DIE DIESE DATEI GEBAUT IST (MESSLATTE.md, Latte 3)

     Ein fremdes Ohr hoert dreissig Sekunden Spielton OHNE JEDES BILD und soll
     Epoche und Vorgang benennen. Raet es falsch, geht die Arbeit zurueck.

   Deshalb hat jeder Ton zwei Aufgaben zugleich:
     1. ER SAGT DIE ZEIT.   Derselbe Hof, vier Zeiten. Das Muenzenzaehlen von
        1350 ist 1970 eine Registrierkasse; der Ochse wird zum Lastzug; die
        Kreide auf dem Schiefer wird zur Schreibmaschine; das offene Holzfeuer
        unter der Pfanne wird zum Dampfventil und dann zur Kreiselpumpe.
     2. ER SAGT DEN VORGANG. Ein Ruf, der ins Leere geht, ist eine verschenkte
        Stelle — deshalb bedient KATALOG jeden Namen, den die vier Stuecke
        heute rufen, und faengt unbekannte Namen mit einem Ersatzklang ab.

   Drei Schichten liegen uebereinander, und erst zusammen ergeben sie 1350:
     BETT  — Musik der Epoche, leise      (ton/klang/bett1..4.mp3)
     HOF   — das Grundrauschen des Hofes  (ton/klang/hof1..4.mp3)
     WERK  — was gerade geschieht         (Proben + Ersatzklaenge)

   ---------------------------------------------------------------------------
   WIE MAN DREISSIG SEKUNDEN ALS DATEI HERAUSBEKOMMT (ohne ffmpeg!)

   Das Spiel rendert seinen EIGENEN Tongraph mit OfflineAudioContext und reicht
   fertige WAV-Bytes heraus. Kein Mikrofon, kein ffmpeg, keine Dateiablage:

       await BRAUHAUS.ton.wav(30)      -> Base64 eines WAV, 30 s Mitschnitt

   Der Mitschnitt laeuft immer mit — auch bei ?stumm=1 und auch dann, wenn der
   Browser die Wiedergabe noch nicht freigegeben hat. Wer also das Spiel
   bedient und danach wav(30) ruft, bekommt genau das, was in den letzten
   dreissig Sekunden im Hof geschehen ist.

       node werkbank/ohrprobe.mjs      -> vier WAV, eines je Epoche
   =========================================================================== */

(function (B) {
  'use strict';

  var LAUT = 0.8;
  var STUMM = false;

  var ORDNER = 'ton/klang/';

  /* Wo die Mischung sitzt. Das Bett darf die Epoche sagen, ohne den Hof zu
     uebertoenen; der Hof traegt den Vorgang. */
  var PEGEL = { bett: 0.38, hof: 0.44, werk: 0.95 };

  /* ======================================================================
     1 — DER KATALOG
     Ein Name aus einem Stueck -> eine Probe. Die Epoche entscheidet mit.
     ====================================================================== */

  function je(a, b, c, d) { return function (e) { return [a, b, c, d][(e || 1) - 1]; }; }
  function stets(x) { return function () { return x; }; }
  function altNeu(alt, neu) { return function (e) { return e >= 4 ? neu : alt; }; }

  var BETT = je('bett1', 'bett2', 'bett3', 'bett4');
  var HOF = je('hof1', 'hof2', 'hof3', 'hof4');

  /* Was vorn und hinten von einer Schleife wegbleibt. Nicht Kosmetik:
     bett4 haengt am Ende einen kurzen Signalton an, den das pruefende Ohr
     ungefragt als "modern, nicht 1970" geruegt hat. Er wird nie gespielt. */
  var SCHNITT = {
    bett1: [0.8, 1.5], bett2: [0.8, 1.5], bett3: [0.8, 1.5], bett4: [0.8, 5.5],
    hof1: [0.3, 0.8], hof2: [0.3, 0.8], hof3: [0.3, 0.8], hof4: [0.3, 0.8]
  };
  function schnitt(datei, buf) {
    var s = SCHNITT[datei] || [0.05, 0.2];
    var von = Math.min(s[0], buf.duration * 0.1);
    var bis = Math.max(von + 1, buf.duration - s[1]);
    return { von: von, bis: bis };
  }

  /* datei: Datei ohne Endung (oder Funktion der Epoche)
     ersatz: Ersatzklang, wenn keine Datei da ist oder sie noch nicht geladen
     laut: relativ zum Werk-Pegel                                          */
  var KATALOG = {
    /* --- DIE FUHRE ------------------------------------------------------ */
    'sud:pfanne':        { datei: je('sud1', 'sud2', 'sud3', 'sud4'), laut: 1.0,
                           sagt: 'Der Sud: offene Pfanne, Dampfventil, Kreiselpumpe.' },
    'fuhre:fass-rollen': { datei: altNeu('fassholz', 'fassstahl'), laut: 0.95,
                           sagt: 'Ein Fass rollt.' },
    'fuhre:abfahrt:ochse':   { datei: stets('abfahrt1'), laut: 1.0 },
    'fuhre:abfahrt:pferd':   { datei: stets('abfahrt2'), laut: 1.0 },
    'fuhre:abfahrt:waggon':  { datei: stets('abfahrt3'), laut: 1.0 },
    'fuhre:abfahrt:lastzug': { datei: stets('abfahrt4'), laut: 1.0 },
    'fuhre:kauf':        { datei: altNeu('muenzen', 'kasse'), laut: 0.85 },
    'fuhre:siegel':      { datei: altNeu('siegel', 'maschine'), laut: 0.8 },
    'fuhre:kerbe':       { ersatz: 'kerbe', laut: 0.7 },
    'tafel:kreide':      { datei: altNeu('kreide', 'maschine'), laut: 0.6 },
    'sommer:keller-leer': { ersatz: 'keller', laut: 0.5, schleife: true },

    /* --- DER PREIS ------------------------------------------------------ */
    'preis:michaeli':    { datei: altNeu('glocke', 'telefon'), laut: 0.9,
                           sagt: 'Michaeli: die Glocke, spaeter das Telefon.' },
    'preis:muenzen':     { datei: altNeu('muenzen', 'kasse'), laut: 0.9 },
    'preis:siegel':      { datei: altNeu('siegel', 'maschine'), laut: 0.85 },
    'preis:handschlag':  { datei: stets('handschlag'), laut: 0.85 },
    'preis:fertig':      { datei: altNeu('bau1', 'bau4'), laut: 0.8 },
    'preis:blatt':       { datei: stets('papier'), laut: 0.5 },

    /* --- DIE STADT ------------------------------------------------------ */
    'stadt:bau':         { datei: altNeu('bau1', 'bau4'), laut: 0.85 },
    'stadt:reiter':      { ersatz: 'blatt', laut: 0.45 },

    /* --- DER GEGNER ----------------------------------------------------- */
    'gegner:werben':      { datei: altNeu('karren', 'telefon'), laut: 0.7 },
    'gegner:entreissen':  { datei: stets('unruhe'), laut: 0.75 },
    'gegner:klage':       { datei: stets('unruhe'), laut: 0.75 },
    'gegner:bauen':       { datei: altNeu('bau1', 'bau4'), laut: 0.6 },
    'gegner:aufstocken':  { datei: altNeu('bau1', 'bau4'), laut: 0.6 },
    'gegner:preis':       { datei: altNeu('kreide', 'maschine'), laut: 0.6 },
    'gegner:fuhre':       { datei: je('abfahrt1', 'abfahrt2', 'abfahrt3', 'abfahrt4'), laut: 0.5 },
    'gegner:macht':       { datei: altNeu('siegel', 'maschine'), laut: 0.7 },
    'gegner:rohstoff':    { datei: altNeu('muenzen', 'kasse'), laut: 0.6 },
    'gegner:unglueck':    { datei: stets('brand'), laut: 0.9 },
    'gegner:verlieren':   { datei: stets('unruhe'), laut: 0.55 },
    'gegner:zuvorkommen': { datei: altNeu('karren', 'telefon'), laut: 0.7 },
    'gegner:abloesen':    { datei: stets('handschlag'), laut: 0.7 },
    'gegner:festlegung':  { datei: altNeu('siegel', 'maschine'), laut: 0.7 },
    'gegner:hinsehen':    { datei: stets('horchen'), ersatz: 'aufmerken', laut: 0.6 },

    /* --- DER KERN -------------------------------------------------------
       Der haeufigste Ton im ganzen Spiel: der WEITER-Knopf. Er war zuerst
       ein synthetisches Glockchen — und das pruefende Ohr hat ihn ungefragt
       als "moderne UI-Pieptoene" geruegt, bei 1350. Jetzt ist es je Epoche
       ein wirkliches Zeichen: Holzklapper, Handglocke, Dampfpfiff, Stechuhr. */
    'uhr:woche':         { datei: je('woche1', 'woche2', 'woche3', 'woche4'),
                           ersatz: 'woche', laut: 0.5,
                           sagt: 'Eine Woche weiter — je Epoche ein anderes Zeichen.' }
  };

  /* Was ein unbekannter Name bekommt, damit kein Ruf ins Leere geht.
     Auch der Notfall greift zu einer wirklichen Probe: ein synthetischer
     Piepser waere in jeder der vier Epochen ein Anachronismus. */
  var NOTFALL = {
    sud:    { datei: je('sud1', 'sud2', 'sud3', 'sud4'), laut: 0.6 },
    fuhre:  { datei: stets('kerbe'), laut: 0.6 },
    tafel:  { datei: altNeu('kreide', 'maschine'), laut: 0.5 },
    preis:  { datei: stets('papier'), laut: 0.5 },
    stadt:  { datei: stets('papier'), ersatz: 'blatt', laut: 0.45 },
    gegner: { datei: stets('horchen'), ersatz: 'aufmerken', laut: 0.55 },
    uhr:    { datei: je('woche1', 'woche2', 'woche3', 'woche4'), laut: 0.5 },
    sommer: { ersatz: 'keller', laut: 0.5 }
  };

  function eintrag(name) {
    if (KATALOG[name]) return KATALOG[name];
    var kopf = String(name).split(':')[0];
    var n = NOTFALL[kopf];
    if (n) return { datei: n.datei, ersatz: n.ersatz, laut: n.laut, geraten: true };
    return { ersatz: 'blatt', laut: 0.5, geraten: true };
  }

  function dateiVon(e, epoche) {
    if (!e || !e.datei) return null;
    return (typeof e.datei === 'function') ? e.datei(epoche) : e.datei;
  }

  /* ======================================================================
     2 — ROHDATEN UND PUFFER
     Es wird NICHTS geladen, bevor Ton wirklich gebraucht wird. Ein
     Bildschirmfoto-Lauf (schuss.mjs, ?stumm=1) laedt damit kein einziges Byte.
     ====================================================================== */

  var roh = {};                       /* datei -> Promise<Uint8Array> */

  function basis() {
    /* Der Pfad des Spiels, egal ob es unter /spiel/ oder / liegt. */
    var p = String(location.pathname);
    return p.replace(/[^/]*$/, '') + ORDNER;
  }

  function hole(datei) {
    if (roh[datei]) return roh[datei];
    roh[datei] = new Promise(function (ja, nein) {
      var x = new XMLHttpRequest();
      x.open('GET', basis() + datei + '.mp3', true);
      x.responseType = 'arraybuffer';
      x.onload = function () {
        if (x.status >= 200 && x.status < 300 && x.response) ja(new Uint8Array(x.response));
        else nein(new Error('Probe ' + datei + ': Status ' + x.status));
      };
      x.onerror = function () { nein(new Error('Probe ' + datei + ' nicht erreichbar')); };
      x.send();
    });
    roh[datei]['catch'](function (f) { B.klage('ton.laden', f); });
    return roh[datei];
  }

  /* Entschluesselte Puffer haengen am jeweiligen Kontext — der Offline-Kontext
     hat eine andere Abtastrate als der lebende und braucht eigene. */
  function puffer(ctx, datei) {
    var fach = ctx.__klangPuffer || (ctx.__klangPuffer = {});
    if (fach[datei]) return fach[datei];
    fach[datei] = hole(datei).then(function (u8) {
      return new Promise(function (ja, nein) {
        /* decodeAudioData loest den ArrayBuffer aus — also immer eine Kopie. */
        var kopie = u8.slice().buffer;
        var p;
        try { p = ctx.decodeAudioData(kopie, ja, nein); }
        catch (f) { nein(f); return; }
        if (p && p.then) p.then(ja, nein);
      });
    });
    fach[datei]['catch'](function (f) { B.klage('ton.deuten', f); });
    return fach[datei];
  }

  function fertig(ctx, datei) {
    var fach = ctx.__klangFertig || (ctx.__klangFertig = {});
    return fach[datei] || null;
  }
  function merke(ctx, datei, buf) {
    var fach = ctx.__klangFertig || (ctx.__klangFertig = {});
    fach[datei] = buf;
  }
  function ladeStill(ctx, datei) {
    if (!datei || fertig(ctx, datei)) return;
    puffer(ctx, datei).then(function (b) { merke(ctx, datei, b); }, function () { });
  }

  /* ======================================================================
     3 — ERSATZKLAENGE
     Sie sind nicht Notnagel, sondern Teil des Entwurfs: die kleinen,
     haeufigen Zeichen (Woche, Reiter, Kerbe) sollen keine Datei kosten.
     Gesaet, nie Math.random — sonst ist der Mitschnitt nicht wiederholbar.
     ====================================================================== */

  var saat = 20250801;
  function zufall() { saat = (saat * 1103515245 + 12345) & 0x7fffffff; return saat / 0x7fffffff; }

  function rauschen(ctx, sek) {
    var schl = 'r' + sek;
    var fach = ctx.__klangRausch || (ctx.__klangRausch = {});
    if (fach[schl]) return fach[schl];
    var n = Math.max(1, Math.floor(ctx.sampleRate * sek));
    var b = ctx.createBuffer(1, n, ctx.sampleRate);
    var d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = zufall() * 2 - 1;
    fach[schl] = b;
    return b;
  }

  /* Ein Keller, der leer ist: Raumton und Tropfen. Als Schleife gebaut. */
  function kellerBand(ctx) {
    if (ctx.__klangKeller) return ctx.__klangKeller;
    var r = ctx.sampleRate, n = Math.floor(r * 6), b = ctx.createBuffer(1, n, r), d = b.getChannelData(0);
    var tief = 0;
    for (var i = 0; i < n; i++) {
      tief = tief * 0.995 + (zufall() * 2 - 1) * 0.005;
      d[i] = tief * 0.9;
    }
    [0.4, 1.9, 3.1, 4.6].forEach(function (t) {
      var a = Math.floor(t * r), len = Math.floor(r * 0.28), f = 900;
      for (var k = 0; k < len && a + k < n; k++) {
        var h = k / len;
        d[a + k] += Math.sin(2 * Math.PI * (f - 480 * h) * k / r) * Math.exp(-9 * h) * 0.32;
      }
    });
    ctx.__klangKeller = b;
    return b;
  }

  function huelle(ctx, ziel, wann, an, halt, ab, spitze) {
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, wann);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, spitze), wann + an);
    g.gain.setValueAtTime(Math.max(0.0002, spitze), wann + an + halt);
    g.gain.exponentialRampToValueAtTime(0.0001, wann + an + halt + ab);
    g.connect(ziel);
    return g;
  }

  function knall(ctx, ziel, wann, mitte, guete, dauer, spitze) {
    var q = ctx.createBufferSource(); q.buffer = rauschen(ctx, 1);
    var f = ctx.createBiquadFilter(); f.type = 'bandpass';
    f.frequency.value = mitte; f.Q.value = guete;
    var g = huelle(ctx, ziel, wann, 0.003, dauer * 0.15, dauer, spitze);
    q.connect(f); f.connect(g);
    q.start(wann); q.stop(wann + dauer + 0.05);
  }

  function ton(ctx, ziel, wann, form, hz, dauer, spitze, bis) {
    var o = ctx.createOscillator(); o.type = form || 'sine';
    o.frequency.setValueAtTime(hz, wann);
    if (bis) o.frequency.exponentialRampToValueAtTime(bis, wann + dauer);
    var g = huelle(ctx, ziel, wann, 0.004, dauer * 0.1, dauer, spitze);
    o.connect(g);
    o.start(wann); o.stop(wann + dauer + 0.05);
  }

  /* Die Woche schlaegt in jeder Epoche anders. Das ist die billigste Stelle,
     an der der Hof seine Zeit verraet — sie kommt am haeufigsten vor. */
  function ersatz(ctx, ziel, welcher, wann, epoche, laut) {
    var v = laut === undefined ? 0.6 : laut;
    switch (welcher) {

      case 'woche':
        if (epoche === 1) {                       /* Holzklopfen und ein Schaellchen */
          knall(ctx, ziel, wann, 340, 1.2, 0.10, 0.55 * v);
          ton(ctx, ziel, wann + 0.05, 'sine', 1180, 0.35, 0.16 * v);
        } else if (epoche === 2) {                /* Handglocke */
          ton(ctx, ziel, wann, 'sine', 1046, 0.55, 0.20 * v);
          ton(ctx, ziel, wann + 0.005, 'sine', 1572, 0.42, 0.10 * v);
        } else if (epoche === 3) {                /* kurzer Dampfpfiff */
          ton(ctx, ziel, wann, 'sawtooth', 760, 0.34, 0.10 * v);
          ton(ctx, ziel, wann + 0.01, 'sawtooth', 1145, 0.30, 0.07 * v);
          knall(ctx, ziel, wann, 2600, 0.7, 0.30, 0.09 * v);
        } else {                                  /* Relais und Summer */
          knall(ctx, ziel, wann, 2400, 3, 0.03, 0.35 * v);
          ton(ctx, ziel, wann + 0.04, 'square', 880, 0.09, 0.10 * v);
        }
        return true;

      case 'kerbe':                               /* Messer schneidet Holz */
        knall(ctx, ziel, wann, 1500, 2.5, 0.08, 0.4 * v);
        knall(ctx, ziel, wann + 0.06, 1900, 2.0, 0.12, 0.25 * v);
        return true;

      case 'blatt':                               /* Papier, Reiter, Umblaettern */
        knall(ctx, ziel, wann, 3000, 0.9, 0.09, 0.22 * v);
        knall(ctx, ziel, wann + 0.07, 2400, 0.9, 0.13, 0.16 * v);
        return true;

      case 'aufmerken':                           /* der Nachbar hat sich geregt */
        ton(ctx, ziel, wann, 'triangle', epoche >= 4 ? 520 : 392, 0.16, 0.13 * v);
        ton(ctx, ziel, wann + 0.14, 'triangle', epoche >= 4 ? 392 : 294, 0.30, 0.11 * v);
        return true;

      case 'keller': {                            /* Schleife: leerer Keller */
        var q = ctx.createBufferSource();
        q.buffer = kellerBand(ctx);
        q.loop = true;
        var g = ctx.createGain(); g.gain.value = 0.8 * v;
        q.connect(g); g.connect(ziel);
        q.start(wann);
        return q;
      }
    }
    knall(ctx, ziel, wann, 1200, 1, 0.08, 0.2 * v);
    return true;
  }

  /* ======================================================================
     4 — DER GRAPH
     Dieselben Funktionen bauen den lebenden und den Offline-Graphen. Nur so
     ist die Datei, die der Pruefer bekommt, wirklich der Ton des Spiels.
     ====================================================================== */

  function baueWerk(ctx) {
    var meister = ctx.createGain();
    meister.gain.value = 0.92;
    var druck;
    try {
      druck = ctx.createDynamicsCompressor();
      druck.threshold.value = -12; druck.knee.value = 24;
      druck.ratio.value = 4; druck.attack.value = 0.006; druck.release.value = 0.25;
      meister.connect(druck); druck.connect(ctx.destination);
    } catch (f) { meister.connect(ctx.destination); }

    var w = { ctx: ctx, meister: meister, bus: {}, schleifen: {} };
    ['bett', 'hof', 'werk'].forEach(function (n) {
      var g = ctx.createGain(); g.gain.value = PEGEL[n];
      g.connect(meister);
      w.bus[n] = g;
    });
    return w;
  }

  /* Eine Schleife (Bett oder Hof) mit weichem Ein- und Ausblenden.
     versatz: wo im Band angefangen wird — damit vier Epochen nicht viermal
     denselben Musikanfang zeigen. */
  function legeSchleife(w, bus, buf, wann, dauer, blende, datei, versatz) {
    var ctx = w.ctx;
    var f = schnitt(datei, buf);
    var q = ctx.createBufferSource();
    q.buffer = buf;
    q.loop = true;
    q.loopStart = f.von;
    q.loopEnd = f.bis;
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, wann);
    g.gain.linearRampToValueAtTime(1, wann + (blende || 1.2));
    q.connect(g); g.connect(w.bus[bus]);
    var ab = f.von + ((versatz || 0) % Math.max(0.5, f.bis - f.von));
    q.start(wann, ab);
    if (dauer) q.stop(wann + dauer + 0.2);
    return { quelle: q, gain: g };
  }

  function blendeAus(w, was, wann) {
    if (!was) return;
    try {
      was.gain.gain.cancelScheduledValues(wann);
      was.gain.gain.setValueAtTime(was.gain.gain.value, wann);
      was.gain.gain.linearRampToValueAtTime(0.0001, wann + 1.1);
      was.quelle.stop(wann + 1.3);
    } catch (f) { /* schon gestoppt */ }
  }

  /* Das Bett duckt sich kurz weg, wenn im Hof etwas geschieht. */
  function ducke(w, wann, tiefe) {
    var g = w.bus.bett.gain;
    try {
      g.cancelScheduledValues(wann);
      g.setValueAtTime(g.value, wann);
      g.linearRampToValueAtTime(PEGEL.bett * (tiefe || 0.55), wann + 0.06);
      g.linearRampToValueAtTime(PEGEL.bett, wann + 0.9);
    } catch (f) { }
  }

  /* Eine einzelne Probe in einen Graphen setzen. Gibt zurueck, ob etwas kam. */
  function setzeProbe(w, name, opt, epoche, wann) {
    var ctx = w.ctx;
    var e = eintrag(name);
    var v = (e.laut === undefined ? 0.8 : e.laut) * (opt && opt.laut !== undefined ? opt.laut / 0.8 : 1);
    v = Math.max(0.05, Math.min(1.6, v));
    var datei = dateiVon(e, epoche);
    var buf = datei ? fertig(ctx, datei) : null;

    if (buf) {
      var q = ctx.createBufferSource();
      q.buffer = buf;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, wann);
      g.gain.linearRampToValueAtTime(v, wann + 0.02);
      if (e.schleife || (opt && opt.art === 'schleife')) {
        q.loop = true;
        w.schleifen[name] = { quelle: q, gain: g };
      } else {
        var d = buf.duration;
        g.gain.setValueAtTime(v, wann + Math.max(0.05, d - 0.25));
        g.gain.linearRampToValueAtTime(0.0001, wann + d);
        q.stop(wann + d + 0.05);
      }
      q.connect(g); g.connect(w.bus.werk);
      q.start(wann);
      ducke(w, wann, 0.6);
      return true;
    }

    if (datei) ladeStill(ctx, datei);              /* fuer das naechste Mal */

    var stueck = ersatz(ctx, w.bus.werk, e.ersatz || VORSILBE[String(name).split(':')[0]] || 'blatt',
                        wann, epoche, v);
    if (stueck && stueck !== true) w.schleifen[name] = { quelle: stueck, gain: null };
    ducke(w, wann, 0.75);
    return true;
  }

  /* ======================================================================
     5 — DAS LEBENDE WERK
     ====================================================================== */

  var werk = null;                 /* der lebende Graph */
  var bettJetzt = null;            /* welche Epoche gerade liegt */
  var liegend = { bett: null, hof: null };
  var wachAn = false;

  function KontextArt() { return window.AudioContext || window.webkitAudioContext; }

  function starteWerk() {
    if (werk) return werk;
    var A = KontextArt();
    if (!A) return null;
    var ctx;
    try { ctx = new A(); } catch (f) { B.klage('ton.kontext', f); return null; }
    werk = baueWerk(ctx);
    werk.meister.gain.value = 0.92 * LAUT;
    return werk;
  }

  function laeuft() {
    return !!(werk && werk.ctx && werk.ctx.state === 'running' && !STUMM);
  }

  /* Browser geben Ton erst nach einer Handlung frei. Wir warten darauf, statt
     eine Konsolenmeldung zu erzeugen — die zaehlt in schuss.mjs als Fehler. */
  function wecke() {
    if (STUMM) return;
    var w = starteWerk();
    if (!w) return;
    if (w.ctx.state === 'suspended' && w.ctx.resume) {
      w.ctx.resume().then(function () { legeBett(bettWunsch); }, function () { });
    } else {
      legeBett(bettWunsch);
    }
  }

  var bettWunsch = null;

  function legeBett(epoche) {
    if (!epoche || STUMM) return;
    var w = starteWerk();
    if (!w || w.ctx.state !== 'running') { bettWunsch = epoche; return; }
    if (bettJetzt === epoche) return;
    bettJetzt = epoche;

    var jetzt = w.ctx.currentTime;
    blendeAus(w, liegend.bett, jetzt);
    blendeAus(w, liegend.hof, jetzt);
    liegend.bett = null; liegend.hof = null;

    [['bett', BETT(epoche)], ['hof', HOF(epoche)]].forEach(function (paar) {
      var bus = paar[0], datei = paar[1];
      puffer(w.ctx, datei).then(function (buf) {
        merke(w.ctx, datei, buf);
        if (bettJetzt !== epoche || !werk) return;
        liegend[bus] = legeSchleife(werk, bus, buf, werk.ctx.currentTime + 0.05, 0, 1.6,
                                    datei, bus === 'bett' ? epoche * 3.7 : epoche * 2.3);
      }, function () { });
    });

    /* Die Proben dieser Epoche im Voraus holen, damit der erste Ruf klingt. */
    vorratDerEpoche(epoche).forEach(function (d) { ladeStill(w.ctx, d); });
  }

  function vorratDerEpoche(epoche) {
    var l = {}, aus = [];
    Object.keys(KATALOG).forEach(function (n) {
      var d = dateiVon(KATALOG[n], epoche);
      if (d && !l[d]) { l[d] = 1; aus.push(d); }
    });
    return aus;
  }

  /* ======================================================================
     6 — DER MITSCHNITT
     Er laeuft IMMER mit, auch stumm. Er ist die Grundlage der Tonlatte:
     wer das Spiel bedient und danach wav(30) ruft, bekommt genau das,
     was geschehen ist — nicht das, was der Bauer sich gedacht hat.
     ====================================================================== */

  var mitschnitt = [];
  var mitAnfang = jetztSek();

  function jetztSek() {
    return (window.performance && performance.now) ? performance.now() / 1000 : Date.now() / 1000;
  }

  /* ======================================================================
     7 — DIE API. Zeichen fuer Zeichen wie im Skelett.
     ====================================================================== */

  var T = {

    protokoll: [],
    proben: {},

    get stumm() { return STUMM; },

    melde: function (name, beschreibung) {
      T.proben[name] = beschreibung || {};
      return name;
    },

    spiele: function (name, opt) {
      opt = opt || {};
      var e = (B.welt && B.welt.zeit) ? B.welt.zeit.epoche : 1;
      T.protokoll.push({
        name: String(name),
        art: opt.art || 'geraeusch',
        ort: opt.ort || null,
        laut: opt.laut === undefined ? LAUT : opt.laut,
        epoche: e,
        jahr: (B.welt && B.welt.zeit) ? B.welt.zeit.jahr : null,
        woche: (B.welt && B.welt.zeit) ? B.welt.zeit.woche : null,
        zeit: Date.now()
      });
      if (T.protokoll.length > 300) T.protokoll.splice(0, 100);

      /* Der Mitschnitt haelt fest, WANN es geschah — auch stumm. */
      if (opt.art !== 'halt') {
        mitschnitt.push({ t: jetztSek(), name: String(name), opt: opt, epoche: e });
        if (mitschnitt.length > 600) mitschnitt.splice(0, 200);
      }

      B.sende('ton', { name: name, opt: opt, epoche: e });

      if (opt.art === 'halt') { haltWirklich(name); return false; }
      if (!laeuft()) return false;

      var klang = false;
      B.wage('ton.spiele', function () {
        klang = setzeProbe(werk, String(name), opt, e, werk.ctx.currentTime + 0.02);
      });
      return !!klang;
    },

    schleife: function (name, opt) { return T.spiele(name, Object.assign({ art: 'schleife' }, opt || {})); },

    halt: function (name) { return T.spiele(name || '*', { art: 'halt' }); },

    bett: function (epoche) {
      var r = T.spiele('bett:epoche' + epoche, { art: 'schleife' });
      B.wage('ton.bett', function () { legeBett(epoche); });
      return r;
    },

    setzeStumm: function (an) {
      STUMM = !!an;
      if (werk) B.wage('ton.stumm', function () {
        werk.meister.gain.value = STUMM ? 0 : 0.92 * LAUT;
      });
      if (!STUMM) wecke();
      B.sende('ton-schalter', { stumm: STUMM });
    },

    setzeLaut: function (l) {
      LAUT = B.grenze(l, 0, 1);
      if (werk && !STUMM) werk.meister.gain.value = 0.92 * LAUT;
      B.sende('ton-schalter', { stumm: STUMM });
    },

    /* ------------------------------------------------------------------
       Neu, und nur additiv: nichts davon aendert einen bestehenden Ruf.
       ------------------------------------------------------------------ */

    get laut() { return LAUT; },
    bereit: function () { return laeuft(); },
    wecke: wecke,
    mitschnitt: function () { return mitschnitt.slice(); },
    beginneMitschnitt: function () { mitschnitt.length = 0; mitAnfang = jetztSek(); return true; },
    katalog: function () { return Object.keys(KATALOG).slice(); },

    /* Was in den letzten sek Sekunden geschah, als Plan fuer den Renderer. */
    plan: function (sek, epoche) {
      var jetzt = jetztSek();
      var ab = jetzt - sek;
      var l = [];
      mitschnitt.forEach(function (m) {
        if (m.t < ab) return;
        if (epoche && m.epoche !== epoche) return;
        if (/^bett:epoche/.test(m.name)) return;      /* das Bett legt der Renderer */
        l.push({ t: Math.max(0, m.t - ab), name: m.name, opt: m.opt });
      });
      return l;
    },

    /* ------------------------------------------------------------------
       DER WEG ZUR DATEI — ohne ffmpeg, ohne Mikrofon.
       Das Spiel rendert seinen eigenen Graphen und reicht WAV heraus.
       ------------------------------------------------------------------ */
    rendere: function (opt) {
      opt = opt || {};
      var sek = opt.sekunden || 30;
      var rate = opt.rate || 32000;
      var kanaele = opt.kanaele || 1;
      var epoche = opt.epoche || ((B.welt && B.welt.zeit) ? B.welt.zeit.epoche : 1);
      var plan = opt.plan || T.plan(sek, epoche);

      var O = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!O) return Promise.reject(new Error('kein OfflineAudioContext'));
      var octx = new O(kanaele, Math.ceil(sek * rate), rate);

      /* Alles, was der Plan braucht, muss VOR dem Rendern entschluesselt sein. */
      var noetig = {};
      noetig[BETT(epoche)] = 1;
      noetig[HOF(epoche)] = 1;
      plan.forEach(function (p) {
        var d = dateiVon(eintrag(p.name), epoche);
        if (d) noetig[d] = 1;
      });

      return Promise.all(Object.keys(noetig).map(function (d) {
        return puffer(octx, d).then(function (b) { merke(octx, d, b); }, function () { });
      })).then(function () {
        var w = baueWerk(octx);
        w.meister.gain.value = 0.92;

        /* Nicht immer bei 0 anfangen: sonst hoert das Ohr viermal denselben
           Musikanfang. Der Versatz haengt an der Epoche, bleibt also gleich. */
        var bettBuf = fertig(octx, BETT(epoche));
        var hofBuf = fertig(octx, HOF(epoche));
        if (bettBuf) legeSchleife(w, 'bett', bettBuf, 0, sek, 0.8, BETT(epoche),
                                  opt.versatz === undefined ? epoche * 3.7 : opt.versatz);
        if (hofBuf) legeSchleife(w, 'hof', hofBuf, 0, sek, 0.6, HOF(epoche),
                                 opt.versatz === undefined ? epoche * 2.3 : opt.versatz);

        plan.forEach(function (p) {
          if (p.t < 0 || p.t > sek - 0.2) return;
          B.wage('ton.rendere.probe', function () {
            setzeProbe(w, p.name, p.opt || {}, epoche, p.t);
          });
        });

        return octx.startRendering();
      }).then(function (buf) {
        return { wav: wavAus(buf, opt.spitze === undefined ? 0.89 : opt.spitze),
                 sekunden: sek, rate: rate, epoche: epoche, ereignisse: plan.length };
      });
    },

    /* Base64 eines WAV — das, was Playwright abholt. */
    wav: function (sek, opt) {
      opt = Object.assign({}, opt || {});
      if (sek) opt.sekunden = sek;
      return T.rendere(opt).then(function (r) { return base64(r.wav); });
    }
  };

  /* ======================================================================
     8 — WAV SCHREIBEN (kein ffmpeg noetig, es ist nur ein Kopf und PCM)
     ====================================================================== */

  function wavAus(buf, spitze) {
    var kn = buf.numberOfChannels, n = buf.length, rate = buf.sampleRate;
    var spuren = [];
    var hoch = 0, i, k;
    for (k = 0; k < kn; k++) {
      var d = buf.getChannelData(k);
      spuren.push(d);
      for (i = 0; i < n; i++) { var a = d[i] < 0 ? -d[i] : d[i]; if (a > hoch) hoch = a; }
    }
    var faktor = (spitze && hoch > 0.0001) ? Math.min(8, spitze / hoch) : 1;

    var bytes = 44 + n * kn * 2;
    var ab = new ArrayBuffer(bytes), s = new DataView(ab);
    function wort(pos, t) { for (var j = 0; j < t.length; j++) s.setUint8(pos + j, t.charCodeAt(j)); }
    wort(0, 'RIFF'); s.setUint32(4, bytes - 8, true); wort(8, 'WAVE');
    wort(12, 'fmt '); s.setUint32(16, 16, true); s.setUint16(20, 1, true);
    s.setUint16(22, kn, true); s.setUint32(24, rate, true);
    s.setUint32(28, rate * kn * 2, true); s.setUint16(32, kn * 2, true); s.setUint16(34, 16, true);
    wort(36, 'data'); s.setUint32(40, n * kn * 2, true);

    var p = 44;
    for (i = 0; i < n; i++) {
      for (k = 0; k < kn; k++) {
        var v = spuren[k][i] * faktor;
        v = v < -1 ? -1 : (v > 1 ? 1 : v);
        s.setInt16(p, v < 0 ? v * 0x8000 : v * 0x7fff, true);
        p += 2;
      }
    }
    return new Uint8Array(ab);
  }

  function base64(u8) {
    var teil = 0x8000, aus = '';
    for (var i = 0; i < u8.length; i += teil) {
      aus += String.fromCharCode.apply(null, u8.subarray(i, i + teil));
    }
    return btoa(aus);
  }

  /* ======================================================================
     9 — HALT
     ====================================================================== */

  function haltWirklich(name) {
    if (!werk) return;
    B.wage('ton.halt', function () {
      var jetzt = werk.ctx.currentTime;
      Object.keys(werk.schleifen).forEach(function (n) {
        if (name !== '*' && n !== name) return;
        var s = werk.schleifen[n];
        try {
          if (s.gain) {
            s.gain.gain.cancelScheduledValues(jetzt);
            s.gain.gain.setValueAtTime(s.gain.gain.value, jetzt);
            s.gain.gain.linearRampToValueAtTime(0.0001, jetzt + 0.4);
            s.quelle.stop(jetzt + 0.5);
          } else { s.quelle.stop(jetzt + 0.05); }
        } catch (f) { }
        delete werk.schleifen[n];
      });
    });
  }

  /* ======================================================================
     10 — ANSCHLUSS
     ====================================================================== */

  B.ton = T;

  if (B.arg && B.arg.stumm) T.setzeStumm(true);
  if (B.arg && B.arg.roh && B.arg.roh.laut) T.setzeLaut(parseFloat(B.arg.roh.laut));

  /* Die erste Handlung des Spielers gibt den Ton frei. Kein Klick geht dabei
     verloren — wir horchen nur mit. */
  function ersteHandlung() {
    if (wachAn) return;
    wachAn = true;
    ['pointerdown', 'mousedown', 'touchstart', 'keydown'].forEach(function (a) {
      document.removeEventListener(a, ersteHandlung, true);
    });
    B.wage('ton.wecken', wecke);
  }
  if (!(B.arg && B.arg.stumm)) {
    ['pointerdown', 'mousedown', 'touchstart', 'keydown'].forEach(function (a) {
      document.addEventListener(a, ersteHandlung, true);
    });
  }

  /* Das Stueck DER KLANG: der sichtbare Schalter und die Ohrprobe-Hilfen.
     index.html ist eingefroren und haengt sie nicht ein — also haengt der
     Tonbus sie selbst ein. Faellt das aus, klingt das Spiel trotzdem. */
  B.wage('ton.stueck-einhaengen', function () {
    if (!document.head) return;
    var s = document.createElement('link');
    s.rel = 'stylesheet'; s.href = 'stil/klang.css';
    document.head.appendChild(s);
    var j = document.createElement('script');
    j.src = 'stuecke/klang.js'; j.async = false;
    document.head.appendChild(j);
  });

})(BRAUHAUS);
