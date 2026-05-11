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
| **Session** | Select | `Annecy — Mai 2026 · Performance`, `Vercors — Juillet 2026 · Longévité`, `— Sans session ciblée —` (la function créera automatiquement les nouvelles valeurs si tu ajoutes des sessions) |
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
| `session` (slug) | `Session` | Mappé en libellé lisible |
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

## Test local sans déploiement

Si tu veux développer/tester en local :
1. Installer Vercel CLI : `npm i -g vercel`
2. À la racine du projet : `vercel link` puis `vercel env pull .env.local`
3. `vercel dev` → ouvre `http://localhost:3000/apply.html`, soumissions fonctionnent vraiment

Sans backend du tout (mode preview pur), mettre `SUBMIT_ENDPOINT = null;` dans `apply.html` ligne ~480 → simulation locale, payload affiché dans la console.
