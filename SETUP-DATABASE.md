# 🗄️ Setup Base de Données SQLite

Ce guide explique comment initialiser la base de données locale pour le développement.

## 📋 Prérequis

- Node.js installé
- Le projet cloné localement

## 🚀 Étapes d'Installation

### 1. Générer le Client Prisma

```bash
npx prisma generate
```

Cette commande génère le client TypeScript pour interagir avec la base de données.

### 2. Créer la Base de Données

```bash
npx prisma db push
```

Cette commande crée le fichier `prisma/dev.db` (SQLite) avec toutes les tables définies dans `schema.prisma`.

### 3. Peupler avec des Données de Test

```bash
npx tsx prisma/seed.ts
```

Cette commande va créer:
- **3 utilisateurs de test** avec différents rôles (USER, PARTNER, USER banni)
- **Quotas d'utilisation IA** pour chaque utilisateur
- **Paramètres Admin** (limites quotidiennes)

## 👥 Utilisateurs Créés

| Nom | Email | Rôle | Plan | Quota Jour | Statut |
|-----|-------|------|------|------------|--------|
| John Doe | john.doe@example.com | USER | FREE | 3/5 | ✅ Actif |
| Marie Coach | marie.coach@example.com | PARTNER | PRO | 12/50 | ✅ Actif |
| Pierre Martin | pierre.martin@example.com | USER | FREE | 5/5 | 🚫 Banni |

## 🔍 Vérifier l'Installation

### Option 1: Via l'Interface Admin

1. Lancer l'application:
```bash
npm run start-web
```

2. Naviguer vers: `/admin/users`

3. Vous devriez voir:
   - Liste des 3 utilisateurs
   - Leurs quotas IA
   - Statut actif/banni
   - Possibilité de bannir/débannir
   - Possibilité de changer le plan (FREE ↔ PRO)

### Option 2: Via Prisma Studio

```bash
npx prisma studio
```

Ouvre une interface web sur `http://localhost:5555` pour explorer la base de données.

## 📊 Structure de la Base

### Tables Principales

- **User**: Utilisateurs (clients, coachs, admins)
- **QuotaUsage**: Compteurs d'utilisation IA
- **AdminSettings**: Configuration dynamique
- **Offer**: Offres créées par les partenaires
- **Booking**: Réservations
- **Review**: Avis/notes

## 🔧 Commandes Utiles

```bash
# Réinitialiser la base (⚠️ Supprime toutes les données)
rm prisma/dev.db
npx prisma db push
npx tsx prisma/seed.ts

# Voir les logs de la base de données
# (Les logs SQL sont activés automatiquement en développement)

# Créer une migration (pour production future)
npx prisma migrate dev --name nom_de_la_migration
```

## 🎯 Prochaine Étape: Test de l'Admin

Une fois la base de données créée, tu peux:

1. Lancer l'app: `npm run start-web`
2. Aller sur `/admin/users`
3. **Tester les fonctionnalités:**
   - Bannir un utilisateur → Le statut doit passer à "BANNI"
   - Changer le plan FREE → PRO → L'icône Crown apparaît
   - Voir les quotas IA en temps réel

## ⚠️ Important

- **SQLite = Développement uniquement**
- Pour la production, on migrera vers PostgreSQL (Supabase/Neon)
- Le fichier `prisma/dev.db` est dans `.gitignore` (ne pas commit)
- Les données de seed sont fictives (pas de vrais utilisateurs)

## 🐛 Dépannage

### Erreur: "PrismaClient not generated"
```bash
npx prisma generate
```

### Erreur: "Table already exists"
```bash
rm prisma/dev.db
npx prisma db push
```

### Les données n'apparaissent pas dans l'admin
1. Vérifier que `npx tsx prisma/seed.ts` a réussi
2. Redémarrer l'application (`npm run start-web`)
3. Vérifier la console pour les erreurs tRPC
