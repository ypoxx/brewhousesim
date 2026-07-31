/* ===========================================================================
   stuecke/fuhre-daten.js — STUMMEL.  GEHOERT DEM BAUER VON "DIE FUHRE".
   Ersetze diese Datei vollstaendig.
   Besitzstand DIE FUHRE: stuecke/fuhre*.js · stil/fuhre*.css · bild/fuhre/**
   =========================================================================== */

var FUHRE_DATEN = {

  /* Was ein Gespann je Epoche schafft und kostet. Nur Stummelwerte —
     der Bauer setzt hier die echte Fuhrwerkslehre hinein. */
  gespann: {
    1: { name: 'Ochsenkarren', fass: 4,  kostenJeKm: 3,   reichweite: 8,   sagt: 'Bier verdirbt in Tagen. Reichweite ist Haltbarkeit.' },
    2: { name: 'Pferdefuhrwerk', fass: 8, kostenJeKm: 4,  reichweite: 20,  sagt: 'Gehopftes Bier reist weiter als Grutbier.' },
    3: { name: 'Bahnwaggon', fass: 60,  kostenJeKm: 1.2,  reichweite: 400, sagt: 'Die Bahn macht Entfernung billig — und den Gegner naeher.' },
    4: { name: 'Lastwagen',  fass: 90,  kostenJeKm: 0.9,  reichweite: 700, sagt: 'Jetzt kostet nicht der Weg, sondern das Regal am Ziel.' }
  }
};
