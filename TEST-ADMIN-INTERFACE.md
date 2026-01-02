# 📸 Guide de Test - Dashboard Admin

## 🎯 Ce que tu dois faire

Maintenant que tout le code est en place, suis ces étapes **dans ton terminal local** :

### Étape 1: Initialiser la Base de Données

```bash
# Générer le client Prisma
npx prisma generate

# Créer la base de données SQLite
npx prisma db push

# Peupler avec les utilisateurs de test
npx tsx prisma/seed.ts
```

Tu devrais voir ce message:
```
✅ Database seeded successfully!
Created 3 users with quotas
```

### Étape 2: Lancer l'Application

```bash
npm run start-web
```

### Étape 3: Naviguer vers l'Admin

1. Ouvre ton navigateur
2. Va sur l'URL affichée (généralement `http://localhost:8081`)
3. Navigue vers: **`/admin/users`**

---

## ✅ Ce que tu vas voir (Preuve de Fonctionnement)

### 📊 Statistiques en Haut

```
Total: 3 | Bannis: 1 | Premium: 1
```

### 👥 Liste des Utilisateurs

#### Utilisateur 1: John Doe ✅
- **Email:** john.doe@example.com
- **Rôle:** USER | **Plan:** FREE
- **Quota:** 3 aujourd'hui | 45 ce mois | 1200 tokens
- **Statut:** Actif (peut être banni)

#### Utilisateur 2: Marie Coach 👑
- **Email:** marie.coach@example.com
- **Rôle:** PARTNER | **Plan:** PRO (icône couronne dorée)
- **Quota:** 12 aujourd'hui | 180 ce mois | 5400 tokens
- **Statut:** Actif (peut être banni)

#### Utilisateur 3: Pierre Martin 🚫
- **Email:** pierre.martin@example.com
- **Rôle:** USER | **Plan:** FREE
- **Quota:** 5 aujourd'hui | 5 ce mois | 200 tokens
- **Statut:** 🚫 BANNI (barre rouge sur la gauche)

---

## 🎬 Actions à Tester (Capture Vidéo/GIF Recommandée)

### Test 1: Bannir un Utilisateur

1. Clique sur le bouton 🚫 à droite de "John Doe"
2. Confirme l'action
3. **Résultat attendu:**
   - La carte devient grisée (opacity: 0.7)
   - Barre rouge apparaît à gauche
   - Tag "🚫 BANNI" apparaît sous le nom
   - Le compteur "Bannis" en haut passe de 1 à 2

### Test 2: Débannir un Utilisateur

1. Clique sur le bouton ✅ à droite de "Pierre Martin" (déjà banni)
2. Confirme l'action
3. **Résultat attendu:**
   - La carte redevient normale
   - Barre rouge disparaît
   - Tag "🚫 BANNI" disparaît
   - Le compteur "Bannis" passe de 2 à 1 (si tu as fait Test 1)

### Test 3: Changer le Plan (FREE ↔ PRO)

1. Clique sur le bouton 👑 à droite de "John Doe"
2. Confirme le passage en PRO
3. **Résultat attendu:**
   - Icône couronne dorée 👑 apparaît à côté du nom
   - Le bouton 👑 passe en fond jaune doré
   - Le compteur "Premium" augmente de 1
   - Le tag **PRO** apparaît sous le rôle

### Test 4: Recherche

1. Tape "marie" dans la barre de recherche
2. **Résultat attendu:** Seul "Marie Coach" apparaît
3. Tape "banni" ou vide la recherche
4. **Résultat attendu:** Tous les utilisateurs réapparaissent

### Test 5: Rafraîchir les Données

1. Clique sur l'icône 🔄 en haut à droite
2. **Résultat attendu:** 
   - Spinner de chargement apparaît brièvement
   - Les données se rechargent depuis la base de données

---

## 📸 Ce que j'ai Besoin de Voir

**Envoie-moi une capture d'écran ou vidéo montrant:**

1. ✅ La page `/admin/users` avec les 3 utilisateurs visibles
2. ✅ Les quotas IA affichés (ex: "3 aujourd'hui | 45 ce mois | 1200 tokens")
3. ✅ L'utilisateur "Pierre Martin" avec le tag "🚫 BANNI"
4. ✅ Un avant/après de l'action "Bannir John Doe" (si possible)
5. ✅ Les compteurs en haut qui changent après une action

---

## 🐛 Si Quelque Chose Ne Marche Pas

### Erreur: "Database not initialized"
```bash
npx prisma generate
npx prisma db push
```

### Les utilisateurs n'apparaissent pas
```bash
# Vérifier que le seed a fonctionné
npx prisma studio
# Ça ouvre une interface web sur localhost:5555
# Tu devrais voir 3 utilisateurs dans la table "User"
```

### Erreur TypeScript dans la console
```bash
# Redémarre l'application
npm run start-web
```

---

## ✨ Validation du Milestone

Une fois que tu m'envoies la capture/vidéo avec:
- ✅ Liste des utilisateurs de la base de données
- ✅ Quotas IA visibles
- ✅ Action de bannir qui fonctionne
- ✅ Changement de statut en temps réel

**Je valide le Backend Core comme TERMINÉ** et on passe à la prochaine phase (Paiements Stripe ou autre feature prioritaire).

---

## 📝 Notes Techniques (Pour Info)

- **Base de données:** SQLite (`prisma/dev.db`) - local uniquement
- **Backend API:** Hono + tRPC (route `/api/trpc/admin.*`)
- **Frontend Admin:** React Native Web (même codebase que l'app mobile)
- **Protection:** Pour l'instant pas d'authentification sur les routes admin (à sécuriser en prod)
- **Production future:** Migration vers PostgreSQL (Supabase/Neon) requise

Au travail ! 🚀
