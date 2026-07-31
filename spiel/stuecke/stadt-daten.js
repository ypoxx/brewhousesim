/* ===========================================================================
   stuecke/stadt-daten.js — STUMMEL.  GEHOERT DEM BAUER VON "DIE STADT".
   Ersetze diese Datei vollstaendig. Sie ist in spiel/index.html bereits
   eingehaengt und wird VOR stadt.js geladen — hier gehoeren Tabellen,
   Bildlisten und Epochendaten hin, nicht Logik.

   Besitzstand DIE STADT:  stuecke/stadt*.js · stil/stadt*.css · bild/**
   (bild/ gehoert der Stadt als Ganzes, weil dort die vier Epochenplatten
   liegen; die drei anderen Stuecke legen ihre Bilder unter bild/<name>/ ab.)
   =========================================================================== */

var STADT_DATEN = {

  /* Was in welcher Epoche am selben Ort steht. Die Koordinaten stehen NICHT
     hier, sondern in kern/orte.js — das ist der Grund, warum alle vier
     Epochen denselben Ort zeigen. */
  epochen: {
    1: { jahr: 1350, name: 'Das Recht',
         platte: 'bild/platte-1350.jpg',
         sagt: 'Ein Holzhaus, offene Pfanne ueber offenem Feuer, Malzboden auf Stelzen, '
             + 'Ziehbrunnen, Ochsenkarren. Stadtmauer neu und geschlossen, Holzsteg ueber '
             + 'den Fluss. Kein Schornstein, kein Hopfen.' },
    2: { jahr: 1600, name: 'Die Ordnung',
         platte: 'bild/platte-1600.jpg',
         sagt: 'Steinbrauhaus mit Darre, Fasslager, Kueferei. Stadt fuellt die Mauer, '
             + 'Kirche bekommt den Spitzhelm, Steinbogenbruecke, erste Hopfenstangen. '
             + 'KEINE Bahn — daran ist schon ein Zielbild gescheitert.' },
    3: { jahr: 1884, name: 'Die Maschine',
         platte: 'bild/platte-1884.jpg',
         sagt: 'Fabrik: Schornstein, Gaertanks, Eiskeller, Laderampe. Mauer ist Ruine, '
             + 'Stadt darueber hinausgewachsen, Bahn ist da, Konkurrenz jenseits des Flusses.' },
    4: { jahr: 1970, name: 'Die Marke',
         platte: 'bild/platte-1970.jpg',
         sagt: 'Abfuellhalle, Lastwagen, Gabelstapler, Kastenlager. Wohnbloecke, Autos auf '
             + 'Asphalt, Fahrleitung ueber den Gleisen. Der Schornstein von 1884 steht noch '
             + 'und raucht nicht mehr.' }
  }
};
