# Outil A — Calculateur de ROAS seuil de rentabilité

## Nom public
**"Quel ROAS dois-je vraiment viser ?"**
Slug suggéré : `/outils/roas-rentabilite`

## Résumé
Calcule le ROAS minimum qu'une boutique e-commerce doit atteindre pour ne pas perdre d'argent, en fonction de sa marge brute, ses frais fixes et son panier moyen.

## Cible principale
Profil 1 — E-commerce en croissance (PME e-commerce, 500k–5M€ de CA, budget Ads 5k–30k€/mois)

## Douleur adressée
Le ROAS affiché dans Google Ads ne dit pas si les campagnes sont rentables. Beaucoup d'e-commerçants pilotent sur un ROAS cible arbitraire (ex : 4) sans savoir si ce chiffre correspond à leur réalité économique. Résultat : ils scalent à perte sans le savoir, ou ils sous-investissent par peur.

## Accroche
> "Ton ROAS de 3,2 est-il vraiment rentable ?"

## Comment ça marche

### Inputs
| Champ | Type | Exemple | Requis |
|---|---|---|---|
| Marge brute | % | 45% | Oui |
| Frais fixes mensuels | € | 8 000 € | Oui |
| Chiffre d'affaires mensuel total | € | 80 000 € | Oui |
| Dépenses Google Ads mensuelles | € | 5 000 € | Oui |
| ROAS actuel affiché | nombre | 3.2 | Optionnel |

> Note : "CA mensuel total" = CA toutes sources, pas seulement Ads. Sert à calculer la part des frais fixes imputables aux Ads.

### Formules

```
Marge nette sur CA = marge brute - (frais fixes / CA mensuel total)
ROAS seuil = 1 / marge nette sur CA
```

Exemple :
- Marge brute = 45%, frais fixes = 8 000€, CA = 80 000€
- Frais fixes en % du CA = 8 000 / 80 000 = 10%
- Marge nette = 45% - 10% = 35%
- ROAS seuil = 1 / 0.35 = **2,86**

```
Bénéfice réel sur Ads = (dépenses × ROAS actuel × marge brute) - frais fixes imputés
Frais fixes imputés = frais fixes × (dépenses × ROAS actuel / CA mensuel total)
```

### Outputs
- ROAS seuil de rentabilité (chiffre mis en avant, gros)
- Verdict : ROAS actuel > seuil → rentable (vert) / ROAS actuel < seuil → à perte (rouge)
- Bénéfice ou perte mensuelle estimée sur les ventes générées par Ads (€)
- Phrase contextuelle : "Avec ta marge, chaque euro dépensé en Ads doit générer au minimum X€ de CA."
- Simulation : "Si ton ROAS passe de X à Y suite à un scaling, ton résultat mensuel passerait de +Z€ à -W€"

## UX & Copywriting

### Headline
> "Ton ROAS de 4 — est-il vraiment rentable ?"

### Sous-titre
> "Entre ta marge brute. On calcule le ROAS minimum en dessous duquel tu perds de l'argent."

### Structure progressive (3 niveaux)
**Niveau 1 — immédiat (1 champ)** : marge brute → ROAS seuil simplifié affiché en temps réel
**Niveau 2 — optionnel "Affiner"** : frais fixes + CA mensuel → ROAS seuil précis
**Niveau 3 — optionnel "Comparer"** : ROAS actuel → verdict rentable/à perte

### Labels & placeholders
- "Ta marge brute sur les produits vendus (%)" — tooltip : "Prix de vente - coût d'achat / prix de vente. Ex : tu vends 100€, ça te coûte 55€ → 45%"
- "Ton ROAS actuel (affiché dans Google Ads)" — champ optionnel, affiché en grisé avec label "optionnel"
- Placeholder marge brute : "Ex : 45"

### Aha moment
Le ROAS seuil affiché en 48px+ en jaune `#fcb800`. Si ROAS actuel renseigné : ligne rouge de comparaison directe. Phrase générée : "Avec ta marge, tu dois générer au minimum X€ de CA pour chaque euro dépensé en Ads."

### Règles UX
- Calcul en temps réel dès le premier champ renseigné — pas de bouton "Calculer"
- Le CTA n'apparaît qu'après que le résultat est visible
- Pas de bouton submit

## Edge cases
- Marge brute = 0% ou négative → message d'erreur explicatif
- ROAS actuel non renseigné → afficher uniquement le seuil sans verdict
- Frais fixes > CA → situation anormale, avertissement

## Angle différenciant
La plupart des outils parlent de ROAS comme d'un indicateur de perf publicitaire. Cet outil le relie directement à la rentabilité économique de l'entreprise — c'est le langage des fondateurs, pas des media buyers.

## Stack technique
- Vite + React
- CSS pur (pas de Tailwind — suivre la charte graphique Lutie)
- Calcul en temps réel via useState / useEffect
- Pas de backend, pas de routing (single component app)

## Design & UI
Respecter la charte graphique Lutie (`CHARTE_GRAPHIQUE_LUTIE.md`) :
- Inputs : border `#dee2e6`, border-radius `10px`, padding `12px 16px`
- Résultat ROAS seuil : chiffre en gros (48px+), gras, couleur `#fcb800`
- Verdict rentable : fond `#fff8e5`, accent `#fcb800`
- Verdict à perte : fond `#f2f1ff`, accent `#a19aff`
- CTA : bouton jaune `#fcb800` avec animation Lottie
- Texture grain présente en arrière-plan

## CTA
Texte : "Tu veux optimiser tes campagnes pour ta vraie rentabilité ?"
Destination : page de prise de contact / calendly Lutie

## Statut
- [ ] Maquette
- [ ] Développement
- [ ] Mise en ligne
