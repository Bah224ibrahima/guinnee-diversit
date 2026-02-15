# Guinée Divertisity - Configuration Firebase

Application de réseau social avec intégration **Google Firebase Firestore** pour la persistance des données.

## Configuration Firebase (IMPORTANT ✅)

### Étape 1 : Créer un projet Firebase

1. Allez sur **https://console.firebase.google.com**
2. Cliquez **"Créer un projet"** (ou créer un nouveau projet)
3. Nommez-le : `Guinee Divertisity`
4. Acceptez les conditions et créez

### Étape 2 : Activer Firestore

1. Dans Firebase Console → **Firestore Database**
2. Cliquez **"Créer une base de données"**
3. Mode: **Mode test** (développement)
4. Localisation: **Europe (belgique)** ou la plus proche
5. Cliquez **"Créer"**

### Étape 3 : Récupérer vos clés Firebase

1. Allez à **Paramètres du projet** (⚙️ en haut à gauche)
2. Onglet **"Vos apps"**
3. Cliquez sur le bouton `</>` pour enregistrer une application web
4. Nommez-la : `Guinée Divertisity`
5. Copiez le contenu entre `const firebaseConfig = {...}`

### Étape 4 : Mettre à jour `firebase-config.js`

Ouvrez le fichier `firebase-config.js` et remplacez :

```javascript
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",                    // Copier d'ici ↓
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef1234567890"   // Jusqu'ici ↑
};
```

**Exemple (avec vraies clés) :**
```javascript
const firebaseConfig = {
  apiKey: "AIzaXyDxQfKj2n4p6kL9mQ0V1jW3eR5tY7uZ9sA",
  authDomain: "guinee-divertisity.firebaseapp.com",
  projectId: "guinee-divertisity",
  storageBucket: "guinee-divertisity.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789"
};
```

## Fonctionnalités

✅ **Avec Firebase activé** :
- Posts sauvegardés dans Firestore (base de données)
- Les posts persistent après rechargement
- Synchronisation en temps réel entre appareils
 - Authentification des utilisateurs (Google et e-mail)

✅ **Mode local** (Firebase non configuré) :
- L'application fonctionne quand même
- Les posts restent en mémoire (réinitialisés au rechargement)

## Fichiers principaux

- `index.html` — Page principale
- `styles.css` — Styles (couleurs de la Guinée)
- `app.js` — Logique (firebase-config.js requis)
- `firebase-config.js` — **À configurer avec vos clés**

## Lancer l'application

1. Ouvrez `index.html` dans un navigateur
2. Les posts apparaissent (locaux ou Firebase)
3. Publiez un post — il sera sauvegardé!

## Aide

- Console navigateur : Appuyez sur **F12** → **Console** pour voir les logs
- ✅ "Firebase connecté" = succès
- ⚠️ "Mode local" = Firebase non configuré (c'est normal pour tester)

## Activer l'Authentification

1. Dans Firebase Console → Authentication → Méthode de connexion
2. Activez **Google** (cliquez et activez)
3. Activez **E-mail/Mot de passe**
4. Dans **Paramètres du projet → Vos apps**, copiez `authDomain` et les autres clés dans `firebase-config.js`

Après cela, les boutons "Se connecter avec Google" et l'inscription par e-mail fonctionneront.

---

**Créé par Ibrahima Bah** 🇬🇳
