#!/usr/bin/env python3
"""DER PREIS — Auswertung des blinden Kritikers, Welle 5.

  python3 auswerten.py /tmp/pk5/e*.json

Rechnet je Epoche und Lauf:
  (d) rho ueber (Jahr, Kennzahl aus BRAUHAUS.preis.leiter().zugVerh),
      Spearman und Pearson, Jahre unter 1x, Spannweite ueber die Laeufe
  (a) Entscheidungen mit Preisschild: gesamt / aktiv nach data-soll-aus /
      erreichbar+aktiv, dazu die zwei Fehlerzaehler von ZUSTAENDIGKEIT 25
  (b) unwiderrufliche Festlegungen: geklickt, in der Chronik, im Zaehler
  (c) Gegnerzuege aus B.protokoll (wer == 'gegner')
  KASSENBODEN: Wochen auf 0, Wochen unter 0, Handlungsfaehigkeit dort
"""
import json, sys, glob, statistics as st, collections


def pearson(xs, ys):
    n = len(xs)
    if n < 3:
        return None
    mx, my = sum(xs) / n, sum(ys) / n
    num = sum((a - mx) * (b - my) for a, b in zip(xs, ys))
    den = (sum((a - mx) ** 2 for a in xs) * sum((b - my) ** 2 for b in ys)) ** .5
    return num / den if den else None


def raenge(v):
    s = sorted(range(len(v)), key=lambda i: v[i])
    r = [0] * len(v)
    i = 0
    while i < len(s):
        j = i
        while j + 1 < len(s) and v[s[j + 1]] == v[s[i]]:
            j += 1
        mittel = (i + j) / 2 + 1
        for k in range(i, j + 1):
            r[s[k]] = mittel
        i = j + 1
    return r


def spearman(xs, ys):
    if len(xs) < 3:
        return None
    return pearson(raenge(xs), raenge(ys))


def f(x, n=3):
    return '—' if x is None else f'{x:+.{n}f}'.replace('.', ',')


dateien = sys.argv[1:] or sorted(glob.glob('/tmp/pk5/e*.json'))
proEpoche = collections.defaultdict(list)
for p in sorted(dateien):
    d = json.load(open(p))
    proEpoche[d['epoche']].append((p, d))

EPJ = {1: 1350, 2: 1600, 3: 1884, 4: 1970}
zus = {}

for ep in sorted(proEpoche):
    print('=' * 104)
    print(f'EPOCHE {EPJ.get(ep, ep)}')
    sp_alle, pe_alle = [], []
    for p, d in proEpoche[ep]:
        name = p.split('/')[-1]
        w = d.get('reihe') or []
        roh = [r for r in (d.get('leiterRoh') or []) if r.get('zugVerh')]
        werte = [r['zugVerh'] for r in roh]
        jahre = [r['jahr'] for r in roh]
        sp, pe = spearman(jahre, werte), pearson(jahre, werte)
        unter = sum(1 for x in werte if x < 1)
        sp_alle.append(sp); pe_alle.append(pe)
        print(f'  {name:14s} {len(w):3d} W / {len(werte):2d} J   Spearman {f(sp)}  Pearson {f(pe)}  '
              f'<1x {unter}/{len(werte)}  Seitenfehler {len(d.get("fehler") or [])}  '
              f'Abbruch {d.get("abgebrochen") or "nein"}')
        # DIE LATTE HAENGT AN DER ZAHL DER JAHRE. Der eingetragene Stand
        # (+0,591 / +0,231 / +0,393 / +0,108) steht auf VIERZEHN Michaelitagen
        # (400 Wochen des Vorbilds). Also beide Zahlen nennen.
        print('       rho nach Zahl der Michaelitage: ' + '  '.join(
            f'{n}J {f(spearman(jahre[:n], werte[:n]),3)}' for n in (12, 13, 14, 15) if n <= len(werte)))
        print('                 Kennzahl: ' + ' · '.join(f'{x:.2f}'.replace('.', ',') for x in werte))
        # ---- (b) Festlegungen
        chron = d.get('chronik') or []
        cf = [c for c in chron if c.get('art') == 'festlegung']
        print(f'   (b) Festlegungen: geklickt {d.get("festGesetzt")}x '
              f'(davon Plus-Preisschild {d.get("festPlus")}x) · Angebote genommen '
              f'{d.get("nimmGesetzt")}x (Plus {d.get("nimmPlus")}x) · '
              f'Chronik art=festlegung {len(cf)} · Zaehler zum Schluss: '
              f'{d["schluss"].get("zaehlerText")!r}')
        for x in (d.get('festListe') or []):
            print(f'        {x["jahr"]}  {x["zug"]:34s} Preisschild {x["preis"]:+}')
        # Zaehlerstand je Jahr
        zt = [(j['jahr'], j.get('chronikFest'), j.get('zaehlerNachSchluss')) for j in (d.get('jahre') or [])]
        for j, cfz, t in zt:
            print(f'        Michaeli {j}: chronik.festlegung={cfz}  Zaehler={t!r}')
        # ---- DIE TAFEL AN JEDEM MICHAELI: aktiv, erreichbar, und die Eichung
        # aus ZUSTAENDIGKEIT 17 (Barschaft >= zweitbilligstes Angebot in den
        # ersten fuenf Braujahren).
        print('   MICHAELI  Kasse | Festl. aktiv/erreichbar | Angeb. aktiv/erreichbar | getroffen | Eichung §17')
        for i, a in enumerate(d.get('festAngeboten') or []):
            F = a['feste']; A = a['angebote']
            fa = [z for z in F if not z['aus']]; fe = [z for z in fa if z['hit']]
            aa = [z for z in A if not z['aus']]; ae = [z for z in aa if z['hit']]
            hit = sum(1 for z in F + A if z['hit'])
            preise = sorted(abs(z['preis']) for z in A if z['preis'])
            zweit = preise[1] if len(preise) > 1 else None
            eich = '—' if zweit is None or i >= 5 else ('ja' if a['kasse'] >= zweit else f'NEIN ({round(a["kasse"])} < {zweit})')
            print(f'     {a["jahr"]}  {round(a["kasse"]):>7} | {len(fa)}/{len(fe)} | {len(aa)}/{len(ae)} | '
                  f'{hit}/{len(F)+len(A)} | {eich}')
        # ---- (a) Preisschilder
        gz = [x['mitPreis'] for x in w]
        ga = [x['mitPreisAktiv'] for x in w]
        ge = [x['mitPreisErreichbar'] for x in w]
        print(f'   (a) Preisschilder je Woche: gesamt Median {st.median(gz):.0f} '
              f'({min(gz)}–{max(gz)}) · aktiv nach data-soll-aus Median {st.median(ga):.0f} '
              f'({min(ga)}–{max(ga)}) · erreichbar+aktiv Median {st.median(ge):.0f} ({min(ge)}–{max(ge)})')
        s0 = sum(x['ausMitSoll0'] for x in w)
        sf = sum(x['sollAusFehlt'] for x in w)
        print(f'       ZUSTAENDIGKEIT 25: disabled MIT data-soll-aus="0" (verdeckt, Fehler) '
              f'{s0} Sichtungen · Knoepfe ganz OHNE data-soll-aus {sf} Sichtungen')
        # ---- (c) Gegner
        prot = d.get('protokoll') or []
        geg = [x for x in prot if x.get('wer') == 'gegner']
        print(f'   (c) Gegnerzuege: {len(geg)} in {len(w)} Wochen '
              f'({len(geg)/max(1,len(w))*100:.1f} je 100 W) · Wochen mit Zuwachs: '
              f'{sum(1 for i in range(1,len(w)) if w[i]["gegnerZuege"] > w[i-1]["gegnerZuege"])}')
        # ---- Kassenboden
        null = [x for x in w if x['kasse'] == 0]
        neg = [x for x in w if x['kasse'] < 0]
        print(f'   KASSE: {d["kasseMin"]} … {d["kasseMax"]} · auf 0: {len(null)} W · unter 0: {len(neg)} W')
        for x in (null + neg)[:14]:
            akt = x['mitPreisErreichbar']
            print(f'        {x["jahr"]}/{x["woche"]:2d}  Kasse {x["kasse"]:>8}  '
                  f'erreichbare Preiszuege {akt}  Kennzahl {x.get("deckung")}')
            for b in (x.get('letzteBuchungen') or [])[-3:]:
                print(f'            < {b}')
        # ---- DER KASSENBODEN BUCHUNG FUER BUCHUNG.
        # Woche fuer Woche zu messen reicht nicht: `kern/uhr.js:170`
        # (`rechneJahrAb`) und der Michaeli des Stuecks laufen INNERHALB eines
        # einzigen WEITER-Klicks. Wer nur am Wochenanfang hinsieht, sieht die
        # Kasse erst wieder, nachdem der Vorgriff sie gehoben hat.
        # `B.protokoll` ist vollstaendig — die Summe aller Buchungen plus der
        # Anfangslade trifft die Endkasse auf den Pfennig (nachgeprueft).
        # `welt.zahle` schreibt eine NICHT bezahlbare Forderung ebenfalls ins
        # Protokoll (`misslungen: true`, `preis: -betrag`) und ruehrt die Kasse
        # NICHT an (kern/welt.js:265-268). Wer diese Zeilen mitrechnet, erfindet
        # sich einen Kassenboden, den es nicht gibt.
        LADE = {1: 112, 2: 640, 3: 14250, 4: 86000}
        k = LADE[ep]; mn = k; wo = None
        unter, nulls = [], []
        for e in prot:
            if e.get('misslungen'): continue
            k += e.get('preis') or 0
            if k < 0: unter.append(e)
            if k == 0: nulls.append(e)
            if k < mn: mn = k; wo = e
        print(f'   BODEN Buchung fuer Buchung: {len(prot)} Buchungen, Endkasse rekonstruiert {k} '
              f'(gemessen {round(d["schluss"]["kasse"])}) · Minimum {mn} bei '
              f'{wo["jahr"] if wo else "?"}/{wo["woche"] if wo else "?"} {wo["was"][:44] if wo else ""}')
        print(f'        Buchungen mit Kasse UNTER 0: {len(unter)} · Buchungen mit Kasse GENAU 0: {len(nulls)}')
        for e in (unter + nulls)[:8]:
            print(f'            {e["jahr"]}/{e["woche"]:2d} {e["wer"]:8s} {e["was"][:60]} {e["preis"]:+}')
        # Vorgriff aus der Leiter
        vg = [(r['jahr'], r.get('vorgriff'), r.get('rueckstand')) for r in (d.get('leiterRoh') or [])]
        vgs = [x for x in vg if x[1]]
        print(f'   VORGRIFF auf den Notpfennig: {len(vgs)} von {len(vg)} Jahren  ' +
              ' '.join(f'{j}:{v}' for j, v, _ in vgs))
        rs = [(j, r) for j, v, r in vg]
        print('   RUECKSTAND je Jahr: ' + ' '.join(f'{j}:{r}' for j, r in rs))
        ohneKz = sum(1 for x in w if not x.get('deckung'))
        print(f'   Wochen ohne Kennzahl (zugDeckung null): {ohneKz}/{len(w)}')
    gs = [s for s in sp_alle if s is not None]
    gp = [s for s in pe_alle if s is not None]
    if gs:
        print('  >> SPEARMAN {} bis {}  Spannweite {}'.format(
            f(min(gs)), f(max(gs)), f'{max(gs)-min(gs):.3f}'.replace('.', ',')))
        print('  >> PEARSON  {} bis {}  Spannweite {}'.format(
            f(min(gp)), f(max(gp)), f'{max(gp)-min(gp):.3f}'.replace('.', ',')))
        u = 'BESTEHT' if max(abs(x) for x in gs) < 0.700 else 'REISST'
        print(f'  >> LATTE |rho| < 0,700 nach Spearman: {u}')
        zus[ep] = (min(gs), max(gs), u)

print('=' * 104)
for ep in sorted(zus):
    a, b, u = zus[ep]
    print('{}  Spearman {} bis {}   {}'.format(EPJ.get(ep, ep), f(a), f(b), u))
