/* ===========================================================================
   stuecke/preis-daten.js — STUMMEL.  GEHOERT DEM BAUER VON "DER PREIS".
   Ersetze diese Datei vollstaendig.
   Besitzstand DER PREIS: stuecke/preis*.js · stil/preis*.css · bild/preis/**
   =========================================================================== */

var PREIS_DATEN = {

  /* Stummelwerte. Der Bauer setzt hier die echte Preislehre hinein —
     und die Sperrliste gilt: ein Marktanteil wird auf die EIGENE
     Gesamtmenge bezogen, nicht auf den Landesausstoss. */
  epochen: {
    1: { einheit: 'Fass', mitte: 9,   spanne: 3,   sagt: 'Der Rat setzt den Bierpreis. Wer darueber geht, wird gestraft.' },
    2: { einheit: 'Fass', mitte: 22,  spanne: 7,   sagt: 'Die Zunft haelt den Preis. Ausbrechen kostet den Ruf.' },
    3: { einheit: 'hl',   mitte: 48,  spanne: 18,  sagt: 'Jetzt entscheidet die Menge, nicht der Rat.' },
    4: { einheit: 'hl',   mitte: 130, spanne: 55,  sagt: 'Der Preis steht im Regal, und das Regal gehoert nicht dir.' }
  }
};
