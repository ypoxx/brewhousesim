#!/usr/bin/env python3
import json, sys, statistics as st

def lade(p):
    with open(p) as f: return json.load(f)

def spearman(xs, ys):
    n = len(xs)
    if n < 3: return None
    def rang(v):
        s = sorted(range(len(v)), key=lambda i: v[i]); r=[0]*len(v)
        for k,i in enumerate(s): r[i]=k+1
        return r
    rx, ry = rang(xs), rang(ys)
    mx, my = sum(rx)/n, sum(ry)/n
    num = sum((a-mx)*(b-my) for a,b in zip(rx,ry))
    den = (sum((a-mx)**2 for a in rx)*sum((b-my)**2 for b in ry))**.5
    return num/den if den else None

for e in (1,2,3,4):
    for stil in sys.argv[1:] or ['sparsam']:
        try: d = lade(f'/tmp/eichung/e{e}-{stil}.json')
        except FileNotFoundError: continue
        print('='*100)
        print(f'EPOCHE {e} · Stil {stil} · {d["wochen"]} Wochen · Seitenfehler {len(d["fehler"])} · Abbruch {d["abgebrochen"]}')
        print('-- MICHAELITAGE ' + '-'*80)
        for m in d['michaelis']:
            preise = sorted(abs(a['preis']) for a in m['angeboteAlle'] if a['zug'].startswith('preis:nimm:') and a['preis'])
            zweit = preise[1] if len(preise)>1 else None
            print(f'  {m["jahr"]}  Kasse {str(m["kasseAmSchirm"]):>12}  '
                  f'Angebote aktiv+klickbar {m["angeboteAktiv"]}/{m["angeboteGesamt"]}  '
                  f'Festlegungen {m["festAktiv"]}/{m["festGesamt"]}  '
                  f'HEUTE-NICHT {m["heuteNicht"]}  '
                  f'2.-billigstes Angebot {zweit}  '
                  f'aktiv: {[ (a["zug"].split(":")[-1], -a["preis"]) for a in m["angeboteAktivListe"]]}  '
                  f'fest: {[ (a["zug"].split(":")[-1], -a["preis"]) for a in m["festAktivListe"]]}')
        r = d['reihe']
        print('-- KENNZAHL (Barschaft / billigster lageaendernder Zug am Schirm) ' + '-'*30)
        jahre = sorted(set(x['jahr'] for x in r))
        med = []
        for j in jahre:
            w = [x['lageDeckung'] for x in r if x['jahr']==j and x['lageDeckung'] is not None]
            ws = [x['schirmDeckung'] for x in r if x['jahr']==j and x['schirmDeckung'] is not None]
            if not w:
                print(f'  {j}: keine Kennzahl (kein lageaendernder Zug am Schirm!)'); med.append(None); continue
            med.append(st.median(w))
            unter1 = sum(1 for v in w if v < 1)
            print(f'  {j}: n={len(w):2d}  min {min(w):8.2f}  median {st.median(w):8.2f}  max {max(w):8.2f}  '
                  f'unter 1x: {unter1}/{len(w)}   | Schirmzahl median {st.median(ws) if ws else None}')
        gm = [m for m in med if m is not None]
        gj = [j for j,m in zip(jahre,med) if m is not None]
        if len(gm)>2:
            rho = spearman(gj, gm)
            print(f'  >> Jahresmediane: {[round(x,2) for x in gm]}')
            print(f'  >> Spearman-Trend ueber {len(gm)} Jahre: rho={rho:.3f}  '
                  f'(|rho|>0.7 = kippt in eine Richtung)')
            print(f'  >> Jahre mit Median <1x: {sum(1 for x in gm if x<1)} von {len(gm)}; '
                  f'laengste Kette <1x: ', end='')
            best=cur=0
            for x in gm:
                cur = cur+1 if x<1 else 0; best=max(best,cur)
            print(best)
            print(f'  >> Spanne Median: {min(gm):.2f} .. {max(gm):.2f}')
        # Schirmzahl (was das Spiel selbst aufschreibt)
        zug = {}
        for x in r:
            zug[x['schirmZug']] = zug.get(x['schirmZug'],0)+1
        print('  >> Nenner am Schirm (was das Spiel selbst als naechsten Zug nennt):',
              sorted(zug.items(), key=lambda t:-t[1])[:4])
        zug2 = {}
        for x in r:
            zug2[x['lageZug']] = zug2.get(x['lageZug'],0)+1
        print('  >> Nenner lageaendernd:', sorted(zug2.items(), key=lambda t:-t[1])[:5])
