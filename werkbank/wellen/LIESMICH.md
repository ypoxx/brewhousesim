# Die Wellen — wie eine Runde gefahren wird, ohne sie zu verlieren

**Der Grund, aus dem dieses Verzeichnis existiert.** Am 3. August 2026 hat ein
Container-Reset das Transkriptverzeichnis von `wf_eccf90fc-7a6` gelöscht. Damit
waren weg:

* das **`journal.jsonl`** — also jede Möglichkeit, mit `resumeFromRunId`
  fortzusetzen, und
* die **Urteile der vier blinden Kritiker im Wortlaut**. Elf von zwölf
  Ergebnissen waren da. Keines davon lag im Repo.
* das **Skript der Welle** selbst, unter
  `~/.claude/projects/…/workflows/scripts/` — außerhalb des Repos, also fort.

Der Arbeitsbaum kam zurück, weil die Aufsicht die Dateien der Builder laufend
committet hat. Der Workflow kam nicht zurück, weil sein Zustand nirgends im Repo
stand.

**Die Regel, die daraus folgt, in einem Satz:**

> Was eine Welle hervorbringt und was sie steuert, gehört ins Repo — sofort,
> nicht am Ende.

## Drei Dinge, die jede Welle ab jetzt tut

**1. Das Skript liegt hier.** `werkbank/wellen/welle-<n>.js`. Der
`Workflow`-Aufruf bekommt `{scriptPath: "werkbank/wellen/welle-<n>.js"}` statt
eines eingebetteten Skripts. Dann überlebt es jeden Reset und ist nachlesbar.

**2. Jeder Kritiker schreibt sein Urteil selbst weg, bevor er zurückgibt.**
In den Kritiker-Auftrag gehört wörtlich dieser Absatz:

```
BEVOR du zurueckgibst, schreib dein Urteil nach
werkbank/urteile/welle<N>-<stueck>.md — Urteil, Zahlen, Auflagen, Sperrliste,
alles im Wortlaut. Der Ruecklauf des Workflows ueberlebt keinen
Container-Reset, eine Datei im Repo schon. Ohne diese Datei ist dein Urteil
beim naechsten Reset verloren, und der Builder arbeitet gegen nichts.
```

Die Aufsicht committet `werkbank/urteile/` wie jede andere Builderarbeit.

**3. Die Aufsicht schreibt den Stand nach, sobald ein Ergebnis da ist** — nicht
wenn die Welle durch ist. `werkbank/LAUFENDER-AUFTRAG.md` ist das Gedächtnis;
ein Ergebnis, das nur im Journal steht, ist kein gesichertes Ergebnis.

## Was der Reset nicht kostet

Die Dateien der Builder. Die sind committet, sobald sie geschrieben sind — das
ist die Aufgabe der Aufsicht und der Grund, warum sie so oft committet. Nach dem
Reset vom 3. August war das Spiel unverändert spielbar: 101/111/115/106 Züge,
`BRAUHAUS.lage` leer, keine Konsolenfehler.

## Was beim Wiederherstellen zu beachten ist

`git fetch origin <zweig> && git reset --hard origin/<zweig>` braucht hier
**über zwei Minuten** — das Repo ist 2,2 GiB gepackt, mit den Belegbildern der
Kritiker. Im Vordergrund läuft das in einen Zeitablauf. **Im Hintergrund
starten und auf den Zweigwechsel warten.**

Und beim Pushen: ein Pack mit allen Belegbildern auf einmal wird mit **HTTP 413**
abgewiesen. Erst den Quelltext committen und pushen — damit die Arbeit sicher
ist —, dann die Bilder in Stapeln von etwa vierzig Dateien.
