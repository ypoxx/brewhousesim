# Welle 7 — Latte 1, der Blindvergleich

**Fremdes Auge, Bildvergleich. Messstand `08baf32`, Hafen 8905, Saat 1350.**
Gegenprobe `/.messstand-marke` → `08baf32`. Aufnahmen 2752×1536, dieselbe Fläche wie
die Zielbilder.

Gelesen wurden: `gauntlet/MESSLATTE.md`, `zielbild/README.md`, der Quelltext des Spiels.
**Nicht** gelesen: irgendetwas unter `werkbank/urteile/`, `werkbank/LAUFENDER-AUFTRAG.md`,
keine git-Historie. Das Urteil steht auf Pixeln, nicht auf Berichten.

## Die Aufnahmen

Je Epoche zwei Zustände: gleich nach dem Laden, und nach ~20 gespielten Wochen mit
echten Mausklicks (`p.mouse.down/up` auf die tatsächliche Knopffläche), damit gekaufte
Hofbauten im Bild stehen. Skript: `werkbank/schuss/bild-w7/spielen.mjs`.
Bilder liegen in `werkbank/schuss/bild-w7/` und sind nicht versioniert.

| Datei | md5 |
|---|---|
| `spiel-e1-laden.png` | `b07ea3e0544238503ff33a7ff555ab78` |
| `spiel-e1-gespielt.png` | `cf3cfabdea0450d6ddd72704d3589c66` |
| `spiel-e2-laden.png` | `db4f249dd285b95ec7853c0ab6f35269` |
| `spiel-e3-laden.png` | `421bd897d306cc044e8b6f43fb538b2a` |
| `spiel-e4-laden.png` | `343784f62b86559b78dcbcf342fbd9c0` |
| `zielbild/01-1350.jpg` | `f56bd4c1b96dfce34ea7a4db11c55653` |
| `zielbild/02-1600.jpg` | `f40f7f4fd5635e4ab677b271e0718611` |
| `zielbild/03-1884.jpg` | `136c44b4480190e2d326af05b934ddcd` |
| `zielbild/04-1970.jpg` | `0ae9bc55768f9536d1c3c08da7c9d276` |

Klickprotokoll 1350 (33 Klicks, keine Seitenfehler): Grutkammer −13 Pf, Gärbottiche
−15 Pf, Gewölbekeller −21 Pf, Ochsenstall −18 Pf gekauft; Rest WEITER bis Woche 30/30.
Küferei blieb ungekauft — die Kasse trug sie nicht.

| `spiel-e2-gespielt.png` | `4ab0b6ad3288856365c0e42f1b95b64e` |

## Was zuerst auffällt, in allen vier Epochen gleich

**Die Bühne ist gut. Was darüber liegt, ist das Problem.**

Wenn man die drei Ebenen `ebene-marken`, `ebene-kopf`, `ebene-blatt` unsichtbar
schaltet und sonst nichts ändert, steht ein Bild da, das dem Zielbild in Kamera, Ort,
Farbe und Strich sehr nahe kommt — in 1970 stellenweise besser (die Mauerruine liegt
dort in einer Grünanlage mit Bänken, der Schornstein raucht nicht mehr, die Straße hat
Mittelstreifen und Autos). Das ist gemessen, nicht geschätzt:

| | UI deckt die Fläche | unteres Drittel | unteres Sechstel |
|---|---|---|---|
| 1350 | **28,0 %** | 41,4 % | **61,0 %** |
| 1600 | 28,4 % | 40,9 % | 59,8 % |
| 1884 | 27,2 % | 41,7 % | 60,2 % |
| 1970 | 28,0 % | 43,0 % | **59,9 %** |

*(Bildpunktvergleich derselben Seite mit und ohne die drei Ebenen, Schwelle 18.)*

**Das untere Sechstel ist die teuerste Stelle.** Genau dort trägt jedes Zielblatt seinen
Vordergrund: 1350 der Marktstand mit gelber Plane, der Pferdefuhrwerk mit Fässern, die
Gasse; 1970 die **Asphaltstraße mit Mittelstreifen, Käfer, Limousinen, Laterne** — das,
was die Epoche IV im README ausmacht („Autos auf Asphalt"). Im Spiel liegen dort zwei
durchgehende braune Bänder (Reiterzeile + BAUHOF-Lade), die 60 % dieses Streifens
zudecken. Die Autos sind auf der Platte gemalt und im Spiel teilweise zu sehen — der
Straßenrand davor ist es nicht.

## Der Ort über 620 Jahre — das hält

Die härteste Einzelforderung ist **erfüllt**. Flussbogen, Steinbrücke unten rechts,
Mühlensteg oben rechts, `ST. MICHAEL`, `GASTHOF LINDENHOF`, die Hügelkette und die
Kameraposition stehen in allen vier Epochen an derselben Stelle und wachsen richtig mit:
Holzsteg 1350 → Steinbogen ab 1600 an derselben Stelle, Mühle 1350/1600 → Brauerei Adler
1884 → Adler-Bräu mit Stahltanks 1970, Bahn und Bahnhof ab 1884, Fahrleitung 1970,
Stadtmauer geschlossen 1350 → Ruine/Fragment in der Grünanlage 1970. Das ist eine echte
Leistung und wird von keinem der Funde unten in Frage gestellt.

*(wird laufend fortgeschrieben)*
