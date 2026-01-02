# Admin Interface - Setup Guide

## ✅ Configuration Terminée

### 1. Base de Données SQLite (Dev Mode)
- ✅ Prisma configuré avec SQLite
- ✅ Schema.prisma mis à jour
- ✅ Fichier: `prisma/schema.prisma`

### 2. Backend Routes
- ✅ Middleware de quotas AI sécurisé
- ✅ Routes tRPC configurées
- ✅ Fichiers: `backend/lib/quota-checker.ts`, `backend/trpc/routes/ai.ts`

### 3. Interface Admin Web
- ✅ Page de login admin: `/admin/login`
- ✅ Dashboard admin: `/admin/dashboard`
- ✅ Gestion utilisateurs: `/admin/users`

---

## 🚀 Démarrage (3 Commandes)

### Étape 1: Générer le Client Prisma
```bash
npx prisma generate
```
Cela va créer le client TypeScript à partir du schema.

### Étape 2: Créer la Base de Données
```bash
npx prisma db push
```
Cela va créer le fichier `prisma/dev.db` localement.

### Étape 3: Démarrer l'Application
```bash
npm run start-web
```
Puis accédez à: **http://localhost:8081/admin/login**

---

## 🔐 Identifiants Admin (Dev)

**Email:** `admin@sportly.com`  
**Password:** `admin123`

---

## 📱 Accès à l'Interface Admin

### Option 1: Navigateur (Recommandé)
1. Lancez `npm run start-web`
2. Ouvrez: `http://localhost:8081/admin/login`
3. Connectez-vous avec les identifiants ci-dessus

### Option 2: Application Mobile
1. Lancez `npm start`
2. Naviguez vers `/admin/login` dans l'app
3. ⚠️ Note: L'interface est optimisée pour le Web

---

## 🎯 Fonctionnalités Admin Disponibles

### ✅ Dashboard Principal
- Vue d'ensemble: Nombre d'utilisateurs, commissions, offres actives
- Statistiques en temps réel (basées sur mock data actuellement)
- Navigation vers les différentes sections

### ✅ Gestion Utilisateurs (`/admin/users`)
- Liste complète des utilisateurs
- Recherche par nom ou ID
- **Actions disponibles:**
  - Bannir/Débannir un utilisateur
  - Promouvoir en Premium
  - Voir les statistiques par utilisateur

### 🔜 À Venir
- Gestion des quotas IA par utilisateur
- Paramètres système (prix, limites globales)
- Logs d'activité
- Analytics détaillés

---

## 🔄 Migration vers PostgreSQL (Production)

Quand vous serez prêt pour la production (Supabase/Neon):

1. **Créez une base PostgreSQL** (Supabase gratuit recommandé)

2. **Mettez à jour `prisma/schema.prisma`:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. **Ajoutez la variable d'environnement:**
```bash
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

4. **Migrez:**
```bash
npx prisma migrate dev --name init
```

---

## 🛡️ Sécurité

### En Développement (Actuel)
- ✅ Auth mockée (email/password hardcodés)
- ✅ Rôle admin vérifié côté client
- ⚠️ Pas de persistance (reload = déconnexion)

### Pour Production (À Implémenter)
- [ ] JWT ou Sessions sécurisées
- [ ] Hash des mots de passe (bcrypt)
- [ ] Rate limiting sur les endpoints admin
- [ ] Logs d'audit des actions admin
- [ ] 2FA recommandé

---

## 📊 Structure des Fichiers Admin

```
app/
├── admin/
│   ├── login.tsx          # Page de connexion admin
│   ├── dashboard.tsx      # Dashboard principal
│   └── users.tsx          # Gestion des utilisateurs
backend/
├── lib/
│   ├── prisma.ts          # Client Prisma
│   └── quota-checker.ts   # Middleware quotas
├── trpc/
│   └── routes/
│       └── ai.ts          # Routes IA protégées
prisma/
├── schema.prisma          # Schema DB (SQLite configuré)
└── dev.db                 # DB locale (généré après push)
```

---

## 🐛 Troubleshooting

### Erreur: "PrismaClient is not a constructor"
**Solution:** Lancez `npx prisma generate`

### La page admin est blanche
**Solution:** Vérifiez que vous êtes bien connecté. Ouvrez la console dev.

### Les données ne persistent pas
**Normal en dev mode.** C'est du mock data. Après `prisma db push`, vous pourrez ajouter de vraies entrées.

---

## 📞 Notes pour l'Équipe

- L'interface Admin est **accessible en Web uniquement** pour le moment
- La base SQLite est **locale** (fichier `prisma/dev.db`)
- Les actions admin (ban, premium) sont **en mémoire** pour le MVP
- Migration PostgreSQL **obligatoire** avant mise en production

---

**Status:** ✅ Infrastructure Admin Opérationnelle  
**Next Step:** `npx prisma generate && npx prisma db push`
