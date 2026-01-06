# 🚀 Guide de Déploiement - Blog Dr. Tchuifon

Ce guide vous aidera à déployer votre application gratuitement en utilisant **Render** pour le backend et **Vercel** pour le frontend.

## 📋 Prérequis

- Compte GitHub (déjà fait ✅)
- Compte [Render.com](https://render.com) (gratuit)
- Compte [Vercel.com](https://vercel.com) (gratuit)

## 🗄️ PARTIE 1 : Déployer le Backend sur Render

### Étape 1 : Préparer le dépôt

1. Assurez-vous que tous les fichiers sont bien poussés sur GitHub :
   ```bash
   cd server
   git add .
   git commit -m "Fix: Déplacement des @types vers dependencies pour Render"
   git push origin main
   ```

### Étape 2 : Créer un compte Render

1. Allez sur [render.com](https://render.com)
2. Cliquez sur **"Get Started for Free"**
3. Connectez-vous avec votre compte GitHub

### Étape 3 : Créer la base de données PostgreSQL

1. Dans le dashboard Render, cliquez sur **"New +"** → **"PostgreSQL"**
2. Configurez :
   - **Name** : `blog-dr-tchuifon-db`
   - **Database** : `blog_dr_tchuifon`
   - **User** : `blog_user`
   - **Region** : Choisissez la région la plus proche (Frankfurt pour l'Europe)
   - **Plan** : Sélectionnez **"Free"**
3. Cliquez sur **"Create Database"**
4. ⚠️ **IMPORTANT** : Une fois créée, copiez la **"External Database URL"** (vous en aurez besoin)

### Étape 4 : Créer le service Web

1. Cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre dépôt GitHub : `TSEFACKDEV/blog-Dr-Tchuifon`
3. Configurez :
   - **Name** : `blog-dr-tchuifon-api`
   - **Region** : Même région que la base de données
   - **Branch** : `main`
   - **Root Directory** : (laissez vide)
   - **Runtime** : `Node`
   - **Build Command** : 
     ```
     npm install && npm run build && npx prisma generate && npx prisma migrate deploy
     ```
   - **Start Command** : 
     ```
     npm run start:prod
     ```
   - **Plan** : Sélectionnez **"Free"**

### Étape 5 : Configurer les variables d'environnement

Dans la section **"Environment Variables"**, ajoutez :

| Clé | Valeur |
|-----|--------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DATABASE_URL` | La Database URL copiée à l'étape 3 |
| `JWT_SECRET` | Générez un secret aléatoire (min 32 caractères) |
| `SMTP_HOST` | `smtp.gmail.com` (ou votre fournisseur) |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Votre email Gmail |
| `SMTP_PASS` | Mot de passe d'application Gmail |
| `FROM_EMAIL` | `noreply@votredomaine.com` (optionnel) |
| `FROM_NAME` | `Dr Tchuifon` (optionnel) |
| `ALLOWED_ORIGINS` | `*` (on mettra l'URL Vercel après) |

**Pour générer un JWT_SECRET sécurisé** :
- Sur Windows PowerShell : 
  ```powershell
  -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
  ```
- Ou utilisez : `VotreSecretTresLongEtComplexe123456789`

**Pour obtenir un mot de passe d'application Gmail** :
1. Allez sur [myaccount.google.com/security](https://myaccount.google.com/security)
2. Activez la "Validation en 2 étapes" si ce n'est pas déjà fait
3. Cherchez "Mots de passe des applications" (App passwords)
4. Sélectionnez "Autre (nom personnalisé)" et entrez "Render Blog"
5. Copiez le mot de passe généré (16 caractères) et utilisez-le comme `SMTP_PASS`

⚠️ **Important** : N'utilisez JAMAIS votre mot de passe Gmail principal !

### Étape 6 : Déployer

1. Cliquez sur **"Create Web Service"**
2. Render va automatiquement :
   - Installer les dépendances
   - Compiler TypeScript
   - Générer Prisma Client
   - Appliquer les migrations
   - Démarrer le serveur

3. Attendez que le déploiement soit terminé (5-10 minutes la première fois)
4. ✅ Votre API sera accessible sur : `https://blog-dr-tchuifon-api.onrender.com`

⚠️ **Note** : Avec le plan gratuit, le service s'endort après 15 minutes d'inactivité et met ~50 secondes à redémarrer.

---

## 🎨 PARTIE 2 : Déployer le Frontend sur Vercel

### Étape 1 : Préparer le dépôt

1. Assurez-vous que tous les fichiers sont bien poussés sur GitHub :
   ```bash
   cd client
   git add .
   git commit -m "Prêt pour le déploiement"
   git push origin main
   ```

### Étape 2 : Créer un compte Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"**
3. Connectez-vous avec votre compte GitHub

### Étape 3 : Importer le projet

1. Cliquez sur **"Add New..."** → **"Project"**
2. Sélectionnez le dépôt `TSEFACKDEV/blog-Dr-Tchuifon-client`
3. Cliquez sur **"Import"**

### Étape 4 : Configurer le projet

1. **Framework Preset** : Vercel détectera automatiquement "Vite"
2. **Root Directory** : (laissez vide)
3. **Build Command** : `npm run build` (par défaut)
4. **Output Directory** : `dist` (par défaut)

### Étape 5 : Configurer les variables d'environnement

Dans la section **"Environment Variables"**, ajoutez :

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://blog-dr-tchuifon-api.onrender.com` |

⚠️ Remplacez par l'URL exacte de votre API Render !

### Étape 6 : Déployer

1. Cliquez sur **"Deploy"**
2. Attendez la fin du build (2-3 minutes)
3. ✅ Votre application sera accessible sur : `https://blog-dr-tchuifon-client.vercel.app`

---

## 🔗 PARTIE 3 : Configurer les CORS

Maintenant que vous avez l'URL Vercel, il faut autoriser le frontend à communiquer avec le backend.

### Sur Render :

1. Retournez sur le dashboard Render
2. Cliquez sur votre service web `blog-dr-tchuifon-api`
3. Allez dans **"Environment"**
4. Modifiez la variable `ALLOWED_ORIGINS` :
   ```
   https://blog-dr-tchuifon-client.vercel.app
   ```
   (Si vous avez un domaine personnalisé sur Vercel, ajoutez-le aussi séparé par une virgule)
5. Cliquez sur **"Save Changes"**
6. Le service va redémarrer automatiquement

---

## ✅ PARTIE 4 : Vérification finale

1. **Testez l'API** : Visitez `https://blog-dr-tchuifon-api.onrender.com/health` (si vous avez une route health)
2. **Testez le frontend** : Visitez votre URL Vercel
3. **Testez la connexion** : Essayez de vous connecter depuis le frontend

---

## 🎯 Domaines personnalisés (Optionnel)

### Pour Render :
- Allez dans Settings → Custom Domain
- Ajoutez votre domaine (ex: `api.votredomaine.com`)
- Configurez les DNS selon les instructions

### Pour Vercel :
- Allez dans Settings → Domains
- Ajoutez votre domaine (ex: `www.votredomaine.com`)
- Configurez les DNS selon les instructions

---

## 🔧 Commandes utiles

### Voir les logs sur Render :
- Cliquez sur votre service → **"Logs"**

### Voir les logs sur Vercel :
- Cliquez sur votre projet → **"Deployments"** → Sélectionnez un déploiement → **"View Function Logs"**

### Redéployer manuellement :
- **Render** : Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"**
- **Vercel** : Push sur GitHub, ça redéploie automatiquement !

---

## ⚡ Limitations du plan gratuit

### Render :
- Le service s'endort après 15 minutes d'inactivité
- 750 heures/mois (suffisant si 1 seul projet)
- Redémarrage en ~50 secondes

### Vercel :
- 100 GB de bande passante/mois
- Builds illimités
- Pas de mise en veille !

---

## 🆘 Dépannage

### L'API ne démarre pas :
1. Vérifiez les logs sur Render
2. Vérifiez que `DATABASE_URL` est correct
3. Vérifiez que les migrations Prisma se sont bien appliquées

### Le frontend ne se connecte pas à l'API :
1. Vérifiez `VITE_API_URL` dans Vercel
2. Vérifiez `ALLOWED_ORIGINS` dans Render
3. Ouvrez la console du navigateur pour voir les erreurs CORS

### Erreurs Prisma :
```bash
# En local, testez les migrations :
cd server
npx prisma migrate deploy
npx prisma generate
```

---

## 📝 Prochaines étapes

1. ✅ Configurez l'envoi d'emails (Gmail App Password)
2. ✅ Seedez votre base de données si nécessaire
3. ✅ Configurez un domaine personnalisé
4. ✅ Configurez la sauvegarde de la base de données

---

## 🎉 Félicitations !

Votre application est maintenant en ligne et accessible à tous ! 🚀

**Liens utiles** :
- Documentation Render : https://render.com/docs
- Documentation Vercel : https://vercel.com/docs
- Documentation Prisma : https://www.prisma.io/docs
