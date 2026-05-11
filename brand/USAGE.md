# TRLBLZR — Guide d'usage du kit de marque

## Palette

| Couleur | Hex | Usage |
|---------|-----|-------|
| Noir | `#0A0A0A` | Fond principal, texte sur clair |
| Orange | `#E85D2C` | Accent brand, CTA, icône, séparateurs |
| Blanc | `#F5F5F5` | Texte sur sombre, fond clair |
| Gris secondaire | `#888888` | Baselines, légendes, métadonnées |

## Quel fichier utiliser quand ?

### Icône
- **`icon_full`** — usage principal, ≥ 64 px (web header, hero, social avatar)
- **`icon_simple`** — favicon, taille ≤ 64 px, contextes très petits
- **`icon_on_light`** — site / matériaux à fond clair (papier, slides blanches)
- **`icon_mono_white`** — overlay sur photo, watermark blanc
- **`icon_mono_black`** — print monochrome sur papier clair
- **`icon_mono_orange`** — variant orange pur sur fond neutre

### Lockup horizontal (icône + nom + baseline)
- **`lockup_horizontal`** — header de site, signature email, pied de page sombre
- **`lockup_horizontal_light`** — papier à entête, cartes de visite fond clair

### Wordmark seul (sans icône)
- **`wordmark` / `wordmark_light`** — quand l'icône est déjà visible ailleurs sur la même surface

## Intégration web (HTML head)

```html
<link rel="icon" type="image/x-icon" href="/brand/favicons/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/brand/favicons/favicon_32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/brand/favicons/favicon_16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/brand/favicons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/brand/favicons/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/brand/favicons/android-chrome-512x512.png">
```

## Hero vidéo

```html
<video autoplay muted loop playsinline
       poster="/hero/hero_poster.jpg"
       style="width:100%;height:100%;object-fit:cover;">
  <source src="/hero/hero_720p.mp4" type="video/mp4">
</video>
```

- 22 s, en boucle, sans son. Le fondu d'entrée/sortie est intégré pour une boucle fluide.
- `poster` garantit un visuel premium même avant chargement de la vidéo.

## Typographie

Le wordmark est dessiné en **Helvetica Bold / Arial Bold** (sans empattement, condensé), letter-spacing ~8-10. Pour le site, utiliser Inter, Helvetica Neue, ou Suisse Int'l comme typo principale.

Le mark complet se lit **TRLBLZR.RUN** avec ".RUN" en plus petit (≈40 % de la taille de TRLBLZR), aligné sur la baseline, et dans la **même couleur que TRLBLZR** (blanc sur fond sombre, noir sur fond clair) — la hiérarchie vient du contraste de taille, pas de la couleur. La baseline (sous-titre) est **TRAIL RUNNING BUSINESS CLUB**.

## Espace de protection

Garder une marge minimale autour du lockup équivalente à la hauteur de la lettre "T" du wordmark. Ne pas placer texte ou élément graphique à l'intérieur de cette zone.

## Ce qu'il ne faut pas faire

- Ne pas remplir l'icône d'une autre couleur que celles de la palette
- Ne pas étirer ou déformer le lockup (utiliser un scale uniforme)
- Ne pas placer l'icône sur des fonds très contrastés sans préserver le contraste minimum (orange sur orange = interdit)
- Ne pas séparer l'icône de la flèche — c'est un ensemble
