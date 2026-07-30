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

1. Dashboard Vercel → projet `trlblzr-web` → onglet **Storage** → **Create Database** → **Blob**
2. Connecter le store créé à ce projet (Vercel propose généralement de le faire automatiquement)
3. Vercel injecte alors `BLOB_READ_WRITE_TOKEN` tout seul dans les variables d'environnement du
   projet (Production + Preview + Development) — pas de token à copier-coller manuellement dans
   la plupart des cas. Si besoin, vérifier dans Settings → Environment Variables que la variable
   est bien présente pour les trois environnements.
4. Sans cette variable, `/api/profile/upload` répond une erreur claire ("Upload failed — is
   Vercel Blob configured?") — le reste du profil continue de fonctionner normalement.
5. Limite actuelle : upload d'images uniquement, 5 Mo max par fichier (`app/api/profile/upload/route.ts`).

## Test local sans déploiement

Si tu veux développer/tester en local :
1. Installer Vercel CLI : `npm i -g vercel`
2. À la racine du projet : `vercel link` puis `vercel env pull .env.local`
3. `vercel dev` → ouvre `http://localhost:3000/apply.html`, soumissions fonctionnent vraiment

Sans backend du tout (mode preview pur), mettre `SUBMIT_ENDPOINT = null;` dans `apply.html` ligne ~480 → simulation locale, payload affiché dans la console.
