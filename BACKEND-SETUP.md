# Configuration Backend - Sportly v2.0

## ✅ LIVRAISON : Backend Core (Quotas IA Sécurisés)

### 📦 Ce qui a été implémenté

#### 1. 🔒 Le "Douanier" (Middleware de Sécurité)
**Fichier : `backend/lib/quota-checker.ts`**
- ✅ Vérifie le rôle de l'utilisateur (USER/PARTNER/SUPER_ADMIN)
- ✅ Vérifie le plan (FREE/PRO/PREMIUM)
- ✅ Compte les utilisations journalières et mensuelles
- ✅ **BLOQUE avec erreur 429** si quota dépassé
- ✅ Log chaque utilisation en base de données

**Limites configurées :**
```
FREE:     5 requêtes/jour,    100 requêtes/mois
PRO:     50 requêtes/jour,  1,000 requêtes/mois
PREMIUM: 1,000 requêtes/jour, 10,000 requêtes/mois
SUPER_ADMIN: ♾️ Illimité
```

#### 2. 📊 Base de Données (Schéma Prisma)
**Fichier : `prisma/schema.prisma`**
- ✅ Table **User** (avec champs `role` et `plan`)
- ✅ Table **QuotaUsage** (compteur d'utilisation journalier/mensuel)
- ✅ Table **AdminSettings** (configuration sans redéploiement)
- ✅ Table **Offer** (offres des partenaires)
- ✅ Table **Booking** (réservations)
- ✅ Table **Review** (avis)

#### 3. 🚀 Route API Sécurisée
**Fichier : `backend/trpc/routes/ai.ts`**
- ✅ Route `/api/trpc/ai.generate` (protégée par authentification)
- ✅ Vérifie les quotas **AVANT** d'appeler OpenAI
- ✅ Stocke la clé OpenAI côté serveur uniquement
- ✅ Routes supplémentaires :
  - `ai.getRemainingQuota` (consulter le solde restant)
  - `ai.getUsageHistory` (historique d'utilisation)

#### 4. 🔐 Système d'Authentification
**Fichier : `backend/trpc/create-context.ts`**
- ✅ Middleware `protectedProcedure` (bloque les non-authentifiés)
- ✅ Extraction du Bearer Token depuis le header Authorization
- ✅ Context tRPC avec `userId` et `prisma`

---

## 🚦 PROCHAINES ÉTAPES (Configuration Requise)

### Étape 1 : Configurer la Base de Données

#### A. Créer un compte PostgreSQL (Supabase recommandé)
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Copier la **Connection String** (Database URL)

#### B. Configurer les variables d'environnement
Créer un fichier `.env` à la racine :

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:[PORT]/[DATABASE]?pgbouncer=true"
OPENAI_API_KEY="sk-..."
```

### Étape 2 : Générer le Client Prisma

```bash
npx prisma generate
```

Cette commande génère les types TypeScript et le client Prisma. **L'erreur actuelle disparaîtra après cette étape.**

### Étape 3 : Créer les Tables en Base de Données

```bash
npx prisma db push
```

Cette commande crée toutes les tables définies dans `schema.prisma`.

### Étape 4 : (Optionnel) Visualiser la Base de Données

```bash
npx prisma studio
```

Ouvre une interface web pour voir/éditer les données.

---

## 🧪 TESTER LE SYSTÈME

### Test 1 : Appel API depuis l'app mobile

```typescript
import { trpc } from '@/lib/trpc';

// Dans votre composant
const generateMutation = trpc.ai.generate.useMutation();

const handleGenerate = async () => {
  try {
    const result = await generateMutation.mutateAsync({
      prompt: "Génère un plan d'entraînement de 30 minutes",
      model: "gpt-3.5-turbo"
    });
    console.log(result.content);
  } catch (error: any) {
    if (error.data?.code === 'TOO_MANY_REQUESTS') {
      Alert.alert("Quota dépassé", error.message);
    }
  }
};
```

### Test 2 : Vérifier le Quota Restant

```typescript
const quotaQuery = trpc.ai.getRemainingQuota.useQuery();

console.log(`Quota restant : ${quotaQuery.data?.daily} requêtes aujourd'hui`);
```

---

## 🏗️ ARCHITECTURE DE SÉCURITÉ

### Flux de Requête IA (Sécurisé)

```
[App Mobile]
    ↓ (Bearer Token dans Header)
[Middleware Auth] ← Vérifie le token
    ↓ (ctx.userId)
[Middleware Quota] ← checkAndUpdateQuota()
    ↓ (Si quota OK)
[Route ai.generate] ← Appelle OpenAI avec MASTER KEY
    ↓
[OpenAI API]
    ↓
[Réponse + Log Usage]
    ↓
[App Mobile] (Reçoit le résultat)
```

**Point critique :** La clé OpenAI n'est JAMAIS exposée au client.

---

## 📋 CHECKLIST DE VALIDATION

### Backend Core ✅
- [x] Schéma Prisma créé
- [x] Middleware Quota implémenté
- [x] Route AI sécurisée créée
- [x] Système d'authentification ajouté
- [x] Protection de la clé OpenAI

### À Faire (Configuration)
- [ ] Configurer PostgreSQL (Supabase/Neon)
- [ ] Ajouter DATABASE_URL dans .env
- [ ] Ajouter OPENAI_API_KEY dans .env
- [ ] Exécuter `npx prisma generate`
- [ ] Exécuter `npx prisma db push`
- [ ] Tester la route ai.generate depuis l'app

---

## 🚨 NOTES IMPORTANTES

### Séparation Admin Dashboard
Comme demandé, l'administration **NE DOIT PAS** être dans l'app mobile. Le fichier actuel `app/admin/dashboard.tsx` est une interface temporaire pour tests.

**Pour la production**, vous devrez créer un projet Next.js séparé :
- URL : `admin.sportly.com`
- Utilise les mêmes routes tRPC
- Accessible uniquement avec role `SUPER_ADMIN`

### Authentification (Amélioration Requise)
L'authentification actuelle utilise l'`userId` directement comme token. Pour la production :
- Implémenter JWT (JSON Web Tokens)
- Ajouter refresh tokens
- Hasher les mots de passe avec bcrypt

---

## 📞 STATUT : PRÊT POUR CONFIGURATION DB

**Le code est pushé et prêt.** Les fichiers critiques sont :
- ✅ `backend/lib/quota-checker.ts` (Le Douanier)
- ✅ `prisma/schema.prisma` (Schéma DB)
- ✅ `backend/trpc/routes/ai.ts` (Route IA sécurisée)

**Action requise de votre part :**
1. Créer une base PostgreSQL
2. Ajouter DATABASE_URL dans .env
3. Exécuter `npx prisma generate && npx prisma db push`

Une fois ces étapes complétées, le système sera opérationnel.
