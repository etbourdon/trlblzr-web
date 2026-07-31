# Apply Flow — Backend Notion via Vercel Function

Architecture choisie : front (`apply.html`) → Vercel Serverless Function (`api/apply.js`) → Notion API.

**Pourquoi pas Notion direct depuis le navigateur ?** Deux raisons :
1. Le token d'intégration Notion doit rester côté serveur (sinon n'importe qui peut écrire dans la base depuis le code source de la page).
2. L'API Notion ne supporte pas CORS pour les requêtes depuis le browser — le navigateur bloque l'appel.

La function Vercel est ultra-légère (40 lignes), gratuite sur le plan Hobby, et ne dépend de rien d'autre que la stdlib Node 18 (fetch natif).

---

## Étape 1 — Créer l'intégration Notion

1. Aller sur https://www.notion.so/profile/integrations
2. Cliquer **"New integration"** → nommer `TRLBLZR Apply` → workspace TRLBLZR
3. Type : **Internal**
4. Capabilities cocher : `Read content`, `Insert content`, `Update content` (suffisant pour la création de pages)
5. Cliquer **Save** → copier le **Internal Integration Token** (commence par `ntn_…`) → c'est ton `NOTION_TOKEN`

## Étape 2 — Créer la base Notion "Candidatures"

Dans Notion, créer une nouvelle base de données (Table view) avec **exactement ces colonnes** (noms identiques, casse respectée) :

| Nom de la colonne | Type Notion | Options |
|---|---|---|
| **Name** | Title | (par défaut) |
| **Email** | Email | — |
| **WhatsApp** | Phone | — |
| **LinkedIn** | URL | — |
| **Category** | Select | `Dirigeant`, `Athlète` |
| **Session** | **Multi-select** | Une session par option (ex. `France — 11-13 septembre 2026`), + `— Sans session ciblée —`. Un candidat peut cocher plusieurs sessions à la fois — voir "Multi-sélection des sessions" plus bas. |
| **Status** | Select | `Nouveau`, `En revue`, `Éligible`, `Standby`, `Refusé`, `RDV pris` |
| **Company** | Text | — |
| **ITRA** | Text | — |
| **UTMB** | Text | — |
| **Source** | Text | — |

Recommandé : ajouter aussi à la main `Date soumission` (type Created time, auto-géré par Notion) et `Notes` (type Text).

## Étape 3 — Connecter l'intégration à la base

1. Ouvrir la base "Candidatures"
2. Cliquer sur le menu `...` en haut à droite → **Connections** → **Connect to** → sélectionner `TRLBLZR Apply`
3. Sans cette étape, l'API retournera "object_not_found" même avec le bon token

## Étape 4 — Récupérer l'ID de la base

Ouvrir la base en plein écran. L'URL ressemble à :
```
https://www.notion.so/workspace/abcdef1234567890abcdef1234567890?v=...
```
La partie `abcdef1234567890abcdef1234567890` (32 caractères hex avant `?v=`) est ton `NOTION_DATABASE_ID`.

## Étape 5 — Configurer les variables d'environnement Vercel

1. Dans le dashboard Vercel du projet TRLBLZR
2. **Settings** → **Environment Variables**
3. Ajouter :
   - `NOTION_TOKEN` = le token de l'étape 1
   - `NOTION_DATABASE_ID` = l'ID de l'étape 4
4. Scope : Production + Preview + Development
5. Sauver, puis **redéployer** le projet pour que les nouvelles env vars soient prises en compte

## Étape 6 — Déployer

Si ce repo TRLBLZR.run est déjà connecté à Vercel : un simple `git push` déclenche le déploiement.
Sinon : `vercel` CLI ou import via le dashboard.

La function sera disponible à `https://ton-domaine.vercel.app/api/apply`. Le front envoie déjà au bon chemin relatif (`/api/apply`), donc rien à toucher côté HTML.

## Étape 7 — Tester

1. Ouvrir `/apply.html` sur le déploiement Vercel
2. Sélectionner un profil, remplir les champs, soumettre
3. Vérifier qu'une ligne apparaît dans la base Notion
4. Vérifier que le status est `Nouveau`

En cas d'erreur, ouvrir la console réseau du navigateur (onglet Network), regarder la réponse de `/api/apply`. Les erreurs côté Vercel se voient dans **Vercel dashboard → Logs**.

---

## Mapping champs form → Notion

| Champ form | Champ Notion | Notes |
|---|---|---|
| `firstname` + `lastname` | `Name` | Concaténés `"Prénom Nom"` |
| `email` | `Email` | — |
| `whatsapp` | `WhatsApp` | Notion type Phone |
| `linkedin` | `LinkedIn` | URL |
| `category` (dirigeant/athlete) | `Category` | Mappé en `Dirigeant` / `Athlète` |
| `sessions` (slugs, tableau) | `Session` | Multi-select — chaque slug coché est mappé vers son libellé lisible |
| `company` (dirigeant) | `Company` | Vide si athlète |
| `itra` (athlète) | `ITRA` | Vide si dirigeant |
| `utmb` (athlète) | `UTMB` | Vide si dirigeant |
| (auto) | `Status` | Initialisé à `Nouveau` |
| `referer` | `Source` | URL d'arrivée du candidat |

La référence renvoyée au candidat (`TRLBLZR-2026-XXXX`) est générée côté backend. Tu peux la stocker dans une nouvelle colonne `Référence` si tu veux corréler — il suffit d'ajouter la colonne et la fonction la remplira au prochain déploiement si tu la mappes dans `api/apply.js`.

---

## Workflow Notion recommandé

Vue **Kanban** sur la base avec `Status` comme groupage :

```
Nouveau          → En revue          → Éligible         → RDV pris
                                    ↘                  ↗ (auto via cal.com webhook)
                                       Standby
                                       Refusé
```

Filtres utiles :
- Vue "À traiter" : filter Status = `Nouveau` OR `En revue`
- Vue "Athlètes" : filter Category = `Athlète`
- Vue "Session Annecy Mai" : filter Session contient `Annecy`

## Réponse automatique aux candidats

Notion + Make.com (free 1000 ops/mois) :
1. Make scenario : trigger "Watch Database Items" sur la base Candidatures
2. Filter : Status changed to `Éligible`
3. Action : send email via Gmail/Postmark/Resend avec template incluant le lien `https://cal.com/bourdon/discovery`
4. Update Notion : Status → `Réponse envoyée` (ou laisser à `Éligible`)

Idem pour `Standby` et `Refusé`, templates différents.

## Webhook cal.com → fermer la boucle

cal.com Settings → Webhooks → Add :
- URL : nouvelle Vercel function `/api/cal-webhook` (à créer si besoin) OU directement Make.com scenario
- Event : `BOOKING_CREATED`
- Action : trouver dans Notion la candidature par email, passer Status à `RDV pris`

Cette étape est optionnelle au début — au lancement, gestion manuelle suffit.

---

## Sécurité & RGPD

- Le token Notion n'est jamais exposé au navigateur (env var server-side uniquement)
- La function valide les champs requis et bloque les POST mal formés
- CORS configuré sur `*` parce que la function est sur le même domaine que le front (Vercel) — si tu sépares les domaines un jour, restreindre à ton domaine front
- Conserver les candidatures max 24 mois (DPA Notion), suppression via colonne `À supprimer` + script cleanup
- L'email de suppression de données est `etienne@bourdon.com`

## Coût total

- Vercel Hobby : 0 €/mois (incl. 100 GB-h Functions)
- Notion : déjà payé via plan workspace existant
- Make.com (optionnel pour emails auto) : 0 € si < 1000 ops/mois

**Total : 0 €/mois** pour 100+ candidatures/mois.

---

## Multi-sélection des sessions

Le champ Session du formulaire `/apply` est passé de sélection unique à **multi-choix** (checkboxes) —
un candidat peut déclarer son intérêt pour plusieurs weekends à la fois. En conséquence :

- Notion : la colonne `Session` de la base Candidates est une propriété **Multi-select** (convertie
  depuis Select — les valeurs existantes ont été préservées comme listes à un seul élément).
- Front (`app/apply/page.tsx`) : `form.sessions` est un tableau de slugs, coché via des checkboxes.
- API (`app/api/apply/route.ts`) : le payload envoie `sessions: string[]` ; la route mappe chaque slug
  vers son libellé Notion et écrit `Session: { multi_select: [...] }`. Si aucune session n'est cochée,
  on retombe sur `— Sans session ciblée —`.
- Email de notification (Batch 4 ci-dessous) : les templates de bienvenue et le message WhatsApp
  s'adaptent automatiquement au singulier/pluriel selon le nombre de sessions cochées.

## Batch 4 — Reception email + welcome manuel

Depuis Batch 4, chaque candidature déclenche un email récap automatique vers `NOTIFICATION_EMAIL`
(Etienne), envoyé via **Resend**. L'email contient :

- Le résumé complet du candidat (catégorie, session, contact, niveau trail, motivation…) + lien Notion
- Un template email de bienvenue **FR** et **EN**, pré-rempli avec `{Name}`, `{Company}`, la session
  ciblée — prêt à copier-coller (celui dans la langue préférée du candidat est surligné)
- Un message WhatsApp pré-rempli, avec un lien `wa.me/<numéro du candidat>?text=…` cliquable qui
  ouvre directement la conversation avec le message prêt à envoyer

**Rien n'est envoyé automatiquement au candidat** — Etienne copie-colle et envoie manuellement
(~2 min/candidat). L'automatisation complète (V2) est décrite dans `07-decisions-et-impacts.md`.

### Setup Resend

1. Créer un compte sur https://resend.com (gratuit jusqu'à 3000 emails/mois)
2. **Domains** → ajouter `trlblzr.run` → suivre les instructions DNS (TXT/CNAME chez le registrar)
   pour vérifier le domaine. Tant que le domaine n'est pas vérifié, utiliser l'expéditeur de test
   `onboarding@resend.dev` (valeur par défaut si `RESEND_FROM_EMAIL` n'est pas défini)
3. **API Keys** → créer une clé → c'est ton `RESEND_API_KEY`
4. Variables d'environnement Vercel (Production + Preview + Development) :
   - `RESEND_API_KEY` = la clé de l'étape 3
   - `RESEND_FROM_EMAIL` = ex. `TRLBLZR.run <apply@trlblzr.run>` (une fois le domaine vérifié)
   - `NOTIFICATION_EMAIL` = `etienne@bourdon.com` (déjà listé dans le README). Plusieurs destinataires
     possibles : séparer les adresses par une virgule, ex. `etienne@bourdon.com, autre@domaine.com`
5. Si `RESEND_API_KEY` est absent, la route `/api/apply` continue de fonctionner normalement
   (candidature enregistrée dans Notion) — elle log juste un warning et n'envoie pas d'email.

## Batch 5.1 — Auth email magic link + profil éditable

Scope livré (self-contained, ne dépend pas de 5.2/5.3) :

- **Vérification email** : chaque candidature déclenche l'envoi d'un email "confirme ton email"
  au candidat (distinct de la notification Etienne du Batch 4). Le clic marque
  `Email verified` (checkbox) + `Email verified at` (date) dans Candidates DB, et connecte
  automatiquement le candidat (redirection vers `/profile`).
- **`/login`** : page où n'importe quel candidat entre son email pour recevoir un nouveau lien
  de connexion (valable 20 min). Réponse toujours générique ("vérifie ta boîte mail"), qu'un
  email corresponde ou non à une candidature — pour ne jamais révéler qui est dans la base.
- **`/profile`** (protégée par cookie de session) : édition directe des champs Candidates DB
  (self-description, Role / Title, Company, LinkedIn, Strava, Pro website, Other link, City,
  Country, Sport level, Looking for, Motivation, Profile picture URL). Pas de champ "Card
  status" — ça, c'est le rôle de Batch 5.2/5.3, pas encore construit.

### Mécanisme d'auth (pas de Clerk, pas d'Auth.js, pas de nouvelle base de données)

Liens signés HMAC-SHA256 maison (`lib/auth.ts`) : `base64url(payload).base64url(signature)`,
vérifiés par recalcul de la signature (comparaison à temps constant) + contrôle d'expiration.
Payload = `{ candidateId, email, purpose: 'verify'|'login'|'session', exp }`.

- Lien de vérification / connexion : 20 minutes de validité.
- Cookie de session (`trlblzr_session`, httpOnly, secure, sameSite=lax) : 30 jours.

**Limite connue** : les liens ne sont pas strictement à usage unique (pas de store côté serveur
pour marquer "déjà utilisé" — ça demanderait une base de données, ce que cette conception évite
délibérément). La courte durée de vie est la mitigation. Suffisant pour un outil communautaire à
faible volume ; à revisiter si ça change un jour.

### Variable d'environnement requise

- `AUTH_SECRET` : chaîne aléatoire longue, utilisée pour signer tous les liens/cookies. À générer
  une fois et ajouter dans Vercel (Production + Preview + Development) — **jamais commitée dans
  le repo**. Exemple de génération : `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`.
  Si absent, les routes `/api/auth/*` et `/api/profile` échouent (candidature elle-même toujours
  sauvegardée normalement dans Notion, seule la partie auth est affectée).

## Batch 5.1 (suite) — Photo de profil, ville/pays, langue, complétion

Quatre ajustements suite au premier retour de test en prod (29-30/07) :

- **Session (WE) éditable** + **lien "Se connecter" dans le footer** du site (déjà en place).
- **Ville/Pays** : sélectionner Paris ou Lyon pré-remplit Pays = France, Bucharest pré-remplit
  Pays = Romania (toujours modifiable). Choisir "Autre" fait apparaître un champ "Quelle ville ?"
  dédié (nouvelle propriété Notion `Other city`) — avant, ce cas écrasait le champ Pays, qui ne
  contenait plus alors ni le pays ni la ville proprement.
- **Langue préférée** : bascule FR/EN explicite dans `/profile`, indépendante de la langue
  d'affichage du site à l'instant présent (pas de changement silencieux surprise).
- **Photo de profil — upload réel** via **Vercel Blob** (pas un nouveau vendor : partie de la
  même plateforme Vercel déjà utilisée). L'image uploadée devient aussi la **cover** de la page
  Notion du candidat, donc Etienne la voit directement dans Notion, pas juste un lien.
- **Jauge de complétion** du profil (barre de progression, calcul 100% côté client, aucun impact
  backend).

### Setup Vercel Blob

**Important** : deux projets Vercel existent pour ce repo (`trlblzr-web` et `trlblzr-next`) — c'est
**`trlblzr-next`** qui sert réellement `trlblzr.run` (confirmé via son alias de déploiement). Le
Blob store doit être connecté à **ce projet-là**, pas à `trlblzr-web`.

1. Dashboard Vercel → projet **`trlblzr-next`** → onglet **Storage** → **Create Database** → **Blob**
2. Choisir explicitement l'accès **Public** à la création (pas Private — les stores créés sans
   préciser peuvent être Private par défaut, et une image de profil doit être lisible sans token,
   à la fois par le `<img>` du site et par le fetch de cover Notion). Erreur si mauvais choix :
   `Cannot use public access on a private store`.
3. Connecter le store à `trlblzr-next` puis **redéployer** (les variables d'environnement ne
   s'appliquent qu'aux déploiements créés après leur ajout).
4. **Piège de nommage** : Vercel préfixe la variable injectée avec le **nom du store**, pas
   `BLOB_READ_WRITE_TOKEN` tel quel. Un store nommé `BlobPublic` donne `BLOBPublic_READ_WRITE_TOKEN`.
   `app/api/profile/upload/route.ts` gère ça automatiquement (`findBlobToken()` cherche
   `BLOB_READ_WRITE_TOKEN` puis, à défaut, n'importe quelle variable finissant par
   `_READ_WRITE_TOKEN`) — donc peu importe le nom donné au store, pas besoin de renommer quoi
   que ce soit à la main.
5. Sans token trouvable, `/api/profile/upload` répond une erreur claire ("Upload failed — is
   Vercel Blob configured?") — le reste du profil continue de fonctionner normalement.
6. Limite actuelle : upload d'images uniquement, 5 Mo max par fichier (`app/api/profile/upload/route.ts`).

## Batch 5.2 — Member Card (génération + preview + itération)

Template visuel approuvé le 30/07 (voir `components/MemberCard.tsx`), revu en format paysage le
même jour suite au premier envoi WhatsApp réel (le format portrait initial était rogné dans la
bulle de chat) : colonne gauche = photo N&B (logo TRLBLZR.run et numéro de membre en overlay,
placeholder appareil photo + "NO PHOTO YET" si pas encore de photo) puis rangée d'icônes
(LinkedIn, Strava, site perso, WhatsApp) sous la photo ; colonne droite, alignée à gauche et
ancrée au coin de la photo = nom / rôle @ société / ville, bio, "looking for", puis niveau trail
et index ITRA empilés verticalement (alignés sur la même largeur de label). Le texte n'est
volontairement pas tronqué (pas de line-clamp) pour laisser de la place à de futurs champs — la
colonne gauche porte elle-même le fond noir de la card sur toute sa hauteur, donc si la colonne de
texte est plus haute que la photo, l'espace en dessous des icônes reste simplement du fond de
card, pas un vide ou un artefact visuel. Coins arrondis conservés ; l'export (`toBlob` dans
`app/profile/page.tsx`) fixe explicitement `backgroundColor: '#0A0A0A'` car WhatsApp (et la
plupart des apps de chat) aplatit les zones transparentes d'un PNG partagé en blanc lors de la
compression — sans ce fond explicite, les coins arrondis exportés deviennent un halo blanc au
lieu de rester discrets.

**Ce que Claude génère réellement** : uniquement `bio` (1-2 phrases) et `lookingFor` (1 phrase),
à partir des champs texte bruts du profil (self-description, motivation, looking-for, role,
company, niveau trail). Tout le reste de la card (nom, rôle, société, ville, photo, liens, niveau
trail, ITRA) est un passthrough direct de champs déjà structurés — pas de génération là-dessus.
`lib/card-generation.ts` appelle l'API Anthropic directement (pas de SDK), modèle
`claude-haiku-4-5-20251001` (économique).

### Flow

1. `/profile` affiche un aperçu live de la card avec les valeurs actuelles du formulaire (même
   non sauvegardées) via `components/MemberCard.tsx`.
2. Bouton "Générer ma card" → `POST /api/profile/card/generate` (session requise) → Claude
   renvoie `{bio, lookingFor}` → affichés dans des champs modifiables. Ne touche pas Notion.
3. L'utilisateur peut éditer le texte généré à la main et/ou cliquer "Régénérer" en boucle. Chaque
   génération est gardée en mémoire côté client (pas persisté, juste pour la session en cours) —
   des flèches `‹ 2/3 ›` apparaissent dès qu'il y a plus d'une proposition, pour revenir à une
   version précédente sans avoir à la regénérer à l'identique. Régénérer après être revenu en
   arrière écrase les propositions plus récentes (comportement classique d'undo/redo).
4. Case de consentement RGPD obligatoire ("mon profil est visible publiquement...").
5. Bouton "Envoyer pour validation" → `POST /api/profile/card/validate` (session requise) →
   sauvegarde `Card bio` / `Card looking for` dans Notion, `Card status` passe à `submitted`,
   `Card consent` = true, assigne `Member No` (voir plus bas) si pas déjà fait, upload l'image de
   la card vers Vercel Blob et sauvegarde son URL. Envoie aussi un email (best-effort, via Resend
   — voir Batch 5.3 plus bas) pour prévenir qu'une card attend une validation.

### Numéro de membre

Notion ne permet pas de créer une propriété `auto_increment_id` via l'API (uniquement en lecture
sur des propriétés système existantes). `Member No` est donc une propriété `Number` classique,
assignée par le code (`getNextMemberNumber()` dans `lib/notion-candidates.ts` : max existant + 1),
une seule fois, au premier envoi de la card. Ne change jamais ensuite, même en cas de ré-envoi
après édition.

### Variable d'environnement requise

- `ANTHROPIC_API_KEY` : clé API Anthropic (console.anthropic.com) à ajouter dans Vercel
  (Production + Preview + Development). Sans elle, `/api/profile/card/generate` répond une
  erreur claire ("Generation failed — is ANTHROPIC_API_KEY configured?") — le reste du profil
  continue de fonctionner normalement.

## Batch 5.3 — Publication, suspension, suppression de la card

Publication = partage sur WhatsApp uniquement, pas de galerie publique sur le site. Validation
admin = directement dans Notion (pas de nouvelle interface d'admin). Suppression après suspension
= manuelle pour l'instant (pas de job automatisé).

### Ce qui a changé côté membre (`/profile`)

- **Télécharger ma card** : capture la card affichée telle quelle (via `html-to-image`,
  `toBlob` sur le conteneur `cardRef`) et déclenche un téléchargement PNG local, sans rien
  envoyer à Notion. Disponible dès qu'un texte a été généré, indépendamment du statut.
- **Envoyer pour validation** : en plus de sauvegarder `bio`/`lookingFor` (Batch 5.2), capture
  maintenant aussi l'image de la card, l'upload vers Vercel Blob via
  `POST /api/profile/card/upload-image` (route dédiée, chemin `member-cards/{candidateId}.png`,
  distincte de l'upload de photo de profil — ne touche pas la cover Notion), et enregistre l'URL
  résultante dans la propriété Notion `Card image URL`. C'est cette image, prête à l'emploi,
  qu'Etienne récupère directement depuis la fiche Notion pour la poster sur WhatsApp.
- **Retirer ma card** : `POST /api/profile/card/suspend` — passe `Card status` à `suspended`,
  stampe `Card suspended at` (aujourd'hui) et calcule `Card delete after` (+90 jours). Le membre
  garde un droit à l'oubli auto-service sans que ce soit une suppression brutale immédiate.
- **Réactiver ma card** : visible uniquement si `Card status = suspended` et qu'on est encore
  avant `Card delete after`. `POST /api/profile/card/reactivate` restaure directement à
  `validated` (le contenu n'a pas changé, pas besoin de repasser par une revue) et efface les
  dates de suspension.

### Workflow admin (entièrement dans Notion, aucune UI dédiée)

0. **Notification** : dès qu'un membre soumet sa card, un email part vers `NOTIFICATION_EMAIL`
   (même variable que Batch 4, fallback `etienne@bourdon.com`) via `lib/card-notification.ts` +
   `lib/resend.ts` — objet "Card à valider — {nom}", contenu = bio/looking-for, lien direct vers
   la fiche Notion, et un bouton vers l'image de la card. Sans ça, rien ne signale qu'une card
   attend une revue. Best-effort (comme la notification de candidature) : un échec d'envoi
   n'empêche jamais la soumission de réussir côté membre.
1. Vue **"Cards — Pending review"** (filtre `Card status = submitted`) : ouvrir la fiche, relire
   `Card bio` / `Card looking for`, ouvrir `Card image URL` pour voir/télécharger l'image prête à
   poster, puis flipper `Card status` sur `validated` pour approuver.
2. Poster l'image récupérée sur le groupe WhatsApp — geste manuel, hors du site.
3. Vue **"Cards — Suspended (check delete-after)"** (filtre `Card status = suspended`, triée par
   `Card delete after` croissant) : passage régulier pour repérer les fiches dont la date est
   dépassée et purger manuellement (`Card bio`, `Card looking for`, `Card image URL`, `Card
   status` → vider/remettre à blanc) — pas de job planifié pour l'instant, décision volontaire
   pour garder le système simple tant que le volume reste faible.

### Corrections de mise en page (2026-07-31)

- **Card poussée dans une colonne étroite en grand écran** : la section Member Card empilait la
  card et les champs éditables en `flex-row` à partir de `md:`, ce qui écrasait la colonne de
  contenu sur les écrans larges (la card fait 640px de large). Passé en `flex-col` permanent,
  card centrée au-dessus, contenu éditable en pleine largeur en dessous — quelle que soit la
  taille d'écran.
- **Rectangle noir superflu sur l'export** : le conteneur `<div ref={cardRef}>` n'était pas
  contraint en largeur ; dans l'ancien layout `flex-row`, il s'étirait plus large que la card
  elle-même (640px), et `toBlob({backgroundColor: '#0A0A0A'})` remplissait cet espace excédentaire
  en noir plein — visible comme un bandeau noir à droite de la card sur l'image exportée. Fixé en
  rendant ce conteneur `inline-block` (largeur = contenu exact), donc la capture correspond
  pixel pour pixel à la card visible, sans marge cachée.

### Statuts possibles de `Card status`

`draft` (jamais envoyée) → `submitted` (en attente) → `validated` (publiable) → `suspended`
(retirée par le membre, en sursis 90 jours) → suppression manuelle. Toute ré-édition après
suspension repasse automatiquement par `submitted` (voir `/api/profile/card/validate`), même si
la card avait déjà été validée avant.

## Test local sans déploiement

Si tu veux développer/tester en local :
1. Installer Vercel CLI : `npm i -g vercel`
2. À la racine du projet : `vercel link` puis `vercel env pull .env.local`
3. `vercel dev` → ouvre `http://localhost:3000/apply.html`, soumissions fonctionnent vraiment

Sans backend du tout (mode preview pur), mettre `SUBMIT_ENDPOINT = null;` dans `apply.html` ligne ~480 → simulation locale, payload affiché dans la console.
