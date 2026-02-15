// Firebase Configuration
// IMPORTANT: Remplacez les valeurs ci-dessous par vos clés Firebase
// https://console.firebase.google.com → Paramètres du projet → Clés Web

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef1234567890"
};

let db = null;
let auth = null;
let provider = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  provider = new GoogleAuthProvider();
  console.log('✅ Firebase connecté avec succès!');
} catch (error) {
  console.warn('⚠️ Firebase non configuré - mode local actif. Configurez firebase-config.js avec vos clés Firebase.');
}

export { db, auth, provider };
