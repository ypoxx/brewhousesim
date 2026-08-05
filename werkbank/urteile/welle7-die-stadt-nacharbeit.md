# WELLE 7 — DIE STADT, Nacharbeit nach dem blinden Urteil

*Laufend geschrieben. Urteil: BESTEHT MIT AUFLAGE, sechs Auflagen
(`werkbank/urteile/welle7-die-stadt-urteil.md`).*

## Was ich zuerst richtigstelle — zwei Fehler in MEINEM Bericht

Der Kritiker hat zwei Zahlen von mir berichtigt, beide folgenlos, beide
zutreffend:

1. **Die vier Epochenplatten waren nie PNG und sind keine WebP.** Sie sind
   JPEG und seit dem 3. August unverändert. Umgestellt habe ich **nur die
   32 Hofbilder**. Mein Baubericht listet unter „Verworfen" zwar richtig, dass
   ich die Platten *nicht* umgepackt habe — die Überschrift „PNG/JPG nach WebP"
   des Werkzeugs und die Nennung beider Blöcke nebeneinander lesen sich aber
   so, als wäre beides angefasst worden. Es war nur eines.
2. **Mein PSNR von 52–57 dB ist über den ganzen Schirm gemittelt**, also
   großzügig über die durchsichtige Fläche mit. Der Kritiker hat über die
   **sichtbaren** Punkte gerechnet: min **29,0**, Median **36,3** dB, und in
   30 von 32 Dateien liegt die sichtbare Fläche unter 40 dB. Folgenlos, weil
   der Randfehler mit dem Alphawert multipliziert wird und das Bild im Median
   auf 45 % Kantenlänge herunterkommt — **aber eine Kennzahl, die über
   Leerraum mittelt, schmeichelt, und ich habe sie so genannt.** Für die
   nächste Runde gilt: PSNR nur über Alpha > 0, und der Puffer ist klein —
   `schornstein` kommt mit Faktor 0,947 fast in Originalgröße auf den Schirm.

*(Fortschritt wird darunter geschrieben.)*
