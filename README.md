# trlblzr-web

Site web de **TRLBLZR.run** — immersions de course en montagne pour dirigeants, conduites par des athlètes de trail professionnels.

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 3.4
- Déploiement Vercel
- Domaine : trlblzr.run (registrar GoDaddy)

## Démarrage local

Prérequis : Node.js 20+, npm.

```bash
npm install
npm run dev
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000).

## Workflow d'itération

1. Créer une branche depuis `main` :
   ```bash
   git checkout -b design/<sujet>
   ```
2. Itérer en local avec Claude Code dans VS Code, vérifier sur `npm run dev`
3. Commit + push :
   ```bash
   git add .
   git commit -m "design: ..."
   git push
   ```
4. Vercel génère automatiquement une **preview URL** pour la branche
5. Si validé, **merger sur `main`** via GitHub → la prod (`trlblzr.run`) est mise à jour automatiquement

## Variables d'environnement

À ajouter dans Vercel (Settings → Environment Variables) au moment où le flux de candidature IA sera codé (sprint 3) :

```
ANTHROPIC_API_KEY=   # Batch 5.2 — génération du texte de la Member Card (voir APPLY_BACKEND.md)
NOTION_API_KEY=
NOTION_DB_PEOPLE_PIM=
NOTION_DB_EVENT_OUTREACH=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
NOTIFICATION_EMAIL=etienne@bourdon.com   # plusieurs adresses : séparées par des virgules
WHATSAPP_NUMBER=
AUTH_SECRET=   # Batch 5.1 — secret de signature des liens magiques (voir APPLY_BACKEND.md)
BLOB_READ_WRITE_TOKEN=   # Batch 5.1 — upload photo de profil, auto-injecté par Vercel Storage
```

## Structure du projet

```
trlblzr-web/
├── app/                  Pages (App Router)
│   ├── layout.tsx        Layout racine + fonts
│   ├── page.tsx          Homepage placeholder (V0)
│   └── globals.css       Tailwind + variables globales
├── public/               Assets statiques
│   ├── icon.png          Favicon / logo carré
│   └── logo.png          Logo horizontal complet
├── tailwind.config.ts    Palette + typographie
├── next.config.js
├── tsconfig.json
└── package.json
```

## Cadrage

Le cadrage produit (architecture, sitemap, wireframes, brief design, contenu V1, intégration CRM Notion) se trouve dans le dossier parent `TRLBLZR/01-cadrage/` (hors du repo).
