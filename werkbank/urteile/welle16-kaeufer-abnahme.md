# Welle 16 · Stück 1 · DER KÄUFER — Abnahme der Aufsicht

*9. August 2026. Die Abnahmeläufe hat die Aufsicht selbst gefahren, agentenlos
durch das Messfenster, nachdem der Builder zweimal mitten im Lauf
verlorenging.*

## Die vier Zahlen

| Maß | vorher | nachher | Schwelle | |
|---|---|---|---|---|
| Kassenhöchststand, suchende Linie 1350 | **126** | **1 212** | > 300 | **✓ weit** |
| Kasse am Partieende | **0** | **177** | — | ✓ |
| Deckungs-Median, suchende Linie | **0,186** | **0,389** | ≥ 1,0 | **✗** |
| Wiederholbarkeit | — | 3 Läufe, **eine** Wochenreihe `488f7a96` | 3/1 | ✓ |

**ρ auf der kundigen Linie, vier Epochen zu 400 Wochen, 1600 zuerst:**

| Epoche | vorher | nachher | |
|---|---|---|---|
| 1350 | −0,259 / −0,236 / −0,389 | **ziffernweise gleich** | |
| 1600 | +0,406 / +0,489 / +0,538 | **ziffernweise gleich** | Reserve 0,162 |
| 1884 | +0,343 / +0,484 / +0,495 | **+0,224 / +0,286 / +0,411** | Reserve 0,205 → **0,289** |
| 1970 | −0,112 / −0,236 / −0,304 | **ziffernweise gleich** | |

**0 von 4 über 0,700.** Ein zweiter Geldweg, der in drei Epochen keine Ziffer
bewegt und in der vierten die zweitknappste Reserve **vergrößert** — das ist
mehr, als das Schutzprotokoll verlangt hat. Dazu: Tor offen in allen vier
Epochen, Kontrakte unverändert 14/16, keine neue Fläche (der Knopf sitzt in
der vorhandenen Kaufreihe, nachdem der Builder sein eigenes Fach selbst
verworfen hat).

## Das Urteil

> **ABGENOMMEN als Erlösarbeit. Die Deckungsschwelle bleibt offen und ist kein
> Versagen dieses Stücks.**

Vorher hat eine Hand, die suchen muss, in 1350 **keinen einzigen Pfennig** über
ihre Startkasse hinaus verdient — 421 Wochen lang, Höchststand gleich
Startkasse, Endstand null. Jetzt verdient sie das **Neunfache** und steht am
Ende der Partie nicht mit leeren Händen da. Das ist der Unterschied zwischen
einem Spiel, das man nicht spielen darf, und einem, das man spielen kann.

**Warum die Deckung trotzdem nur auf 0,389 steigt, und was das bedeutet.**
Die Deckung ist ein *Verhältnis*: Kasse geteilt durch den Preis des nächsten
umkämpften Zuges. Der Zähler ist um das Neunfache gewachsen, das Verhältnis nur
um das Doppelte. **Also ist der Nenner mitgewachsen** — wer mehr verdient,
steht vor teureren nächsten Zügen.

Das ist keine Panne, sondern die eingebaute Rückkopplung des Spiels, und sie
arbeitet hier zum ersten Mal auf der suchenden Linie. Aber sie frisst den
Erlös schneller auf, als er entsteht.

## Was daraus folgt — und es ist genau das, was ich vertagt hatte

Der Umsetzungsplan sah für Welle 15 vor, die **Preisanker** an die gespielte
Leistung zu koppeln. Ich habe das damals zurückgestellt, mit dieser Begründung:

> *„Ein Anker unter einer Kasse, die nie wächst, verschiebt nichts."*

**Die Kasse wächst jetzt.** Damit ist die Voraussetzung erfüllt, und die
Preisarbeit ist nicht mehr eine Option, sondern die Diagnose:

> **Die nächste Welle koppelt den Nenner, nicht den Zähler.** Ziel bleibt
> Deckungs-Median ≥ 1,0× auf der suchenden Linie in 1350 — heute 0,389.
> Gemessen wird an **derselben Hand** (`welle16-kaeufer/hand.mjs`), mit der
> Vorher-Zahl 0,389 daneben, und 1600 wird zuerst gemessen: dort stehen
> unverändert 0,162 Reserve, und ein Preisanker greift genau dort an.

## Zwei Sätze, die diese Abnahme methodisch hinterlässt

**Die richtige Prüfsumme ist die über die Partie, nicht über den Weg der Hand
dorthin.** Der dritte Lauf wich in der Klickkette ab (`5265bd97` statt
`598c4782`) und stimmte in der Wochenreihe überein. Eine erkundende Hand tastet
Bretter auf und zu; diese Klicks ändern den Spielzustand nicht. Wer die
Klickkette zum Maßstab nimmt, erklärt einen sauberen Lauf für bistabil — das
hat diesen Lauf in Welle 11 vier Tage gekostet.

**Mechanik gehört nicht an ein Modell.** Beide Builder dieser Welle sind mitten
in ihren Abnahmeläufen verlorengegangen, und beide Male überlebte ein
verwaister Messprozess seinen Wrapper und gab die Sperre frei. Die restlichen
Läufe hat die Aufsicht agentenlos gefahren — so, wie Tokenregel 1 es seit dem
ersten Tag verlangt. **Kein Modell sieht Skripten beim Laufen zu.**
