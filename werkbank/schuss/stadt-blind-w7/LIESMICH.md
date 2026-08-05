# Messwerte des blinden Kritikers DIE STADT, Welle 7

Erhoben am eingefrorenen Stand `b6b06bb`, Hafen 8903, am 5. August 2026.
Das Urteil dazu steht in `werkbank/urteile/welle7-die-stadt-urteil.md`.

**Bilder liegen hier nur während des Laufs** — `.gitignore` nimmt sie nicht mit.
Versioniert sind ausschließlich die `.json`, die Geräte (`.mjs`/`.sh`) und diese
Datei. Wer eine Zahl nachstellen will, fährt das Gerät neu.

## Die Geräte

| Datei | wofür |
|---|---|
| `ab-webp-aufsetzen.sh` | baut auf Hafen **8907** denselben Baum wie 8903, nur mit den 32 alten PNG statt der WebP. Der einzige Weg, die Umstellung mit dem Auge zu prüfen. Bricht ab, wenn die PNG-Quelle fehlt, statt still etwas anderes zu messen. |
| `gewicht.mjs` | zählt die **Antworten**, die der Browser empfängt, dreistufig: bis `load`, nach Ruhe **ohne Klick**, nach dem ersten Wochenklick. |
| `bildmasse.mjs` | in welcher Größe kommt jedes Hofbild wirklich auf den Schirm (Faktor gegen die Naturgröße). |
| `latte4-stadt.mjs` | Latte 4 **nach Eigentum** statt nach Klassennamen: welcher Vorfahr trägt eine Stück-Klasse. Zählt auch, was nur im `title` steht und was sichtbar gekappt ist. |
| `ortstreue.mjs` | Fußpunkt jedes Baus, Punkt jedes Ortes, Mitte jeder Marke — in allen vier Epochen, dann verglichen. Prüft „wachsen, ohne den Ort zu wechseln". |
| `spielen.mjs` | spielt mit **echten `page.click`**, nie `el.click()`. Protokolliert je Zug, ob der Klick ankam und ob sich etwas bewegte. |
| `aufbauen.mjs` | spielt eine Epoche voll und nimmt den **gebauten** Hof auf — das Zielbild zeigt einen gehenden Betrieb, die Platte einen leeren Hof. |

## Die Messwerte

| Datei | Inhalt |
|---|---|
| `webp-gegen-png.json` | je Hofbild: PSNR über die sichtbaren Punkte, maxdiff, Alphagleichheit, Dateigrößen |
| `ab-schirm-png-gegen-webp.json` | der Schirm-A/B: PSNR, bitgleiche Punkte, Δ>8/16/32 je Epoche |
| `bildmasse-2752.json` | Anzeigefaktor je Bild |
| `gewicht.json` | Gewicht je Epoche in drei Stufen, nach Dateityp, schwerste Anfragen |
| `latte4-stadt-1366/1920/2752.json` | Latte 4 je Fenstergröße, aufgeschlüsselt nach Stück |
| `ortstreue.json` | alle Fußpunkte, Orte und Marken je Epoche + Liste der Wanderer |
| `spiel-vorsichtig-e1..4.json` | 120 gespielte Züge je Epoche, Zug für Zug |
| `spiel-e1.json` | der gierige Gegendurchlauf in 1350 |
| `voll-e1..4.json` | was der Aufbaulauf gebaut hat und wo er endete |

## Eine Falle, die mich einen Lauf gekostet hat

`stadt:bau:seite` ist der **Seitenumschlag** des Bauhofs, kein Bau. Ein Skript,
das alles mit dem Präfix `stadt:bau:` für einen Kauf hält, blättert
zweihundertmal die Seite um, baut nichts — und scheitert dabei nie.
`aufbauen.mjs` schließt ihn jetzt ausdrücklich aus.
