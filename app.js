// App.js - Guinée Divertisity avec Firebase Firestore
import { db, auth, provider } from './firebase-config.js';
import { collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const users = ['Ibrahima', 'Amara', 'Fatou', 'Mamoudou', 'Khadija', 'Sékou', 'Aissatou', 'Koré'];
const colors = ['#CE1126', '#007A5E', '#FCD116', '#CE1126', '#007A5E', '#FCD116', '#E74C3C', '#1a5f7a'];
let posts = [
  {id:1, user:'Ibrahima Bah', avatar:'I', color:'#CE1126', text:'Bienvenue sur Guinée Divertisity! Divertissez-vous avec la communauté 🇬🇳 🎉', time:'2h', likes:42, liked:false},
  {id:2, user:'Amara Diallo', avatar:'A', color:'#007A5E', text:'J\'aime cette plateforme! À bientôt pour plus de contenu guinéen! ✨', time:'1h', likes:28, liked:false}
];

function getRandomUser() { 
  return {
    name: users[Math.floor(Math.random()*users.length)], 
    color: colors[Math.floor(Math.random()*colors.length)]
  }; 
}

// --- Authentication helpers ---
async function signInWithGoogle() {
  if(!auth || !provider) return alert('Firebase non configuré.');
  try {
    await signInWithPopup(auth, provider);
  } catch (e) { console.error(e); alert('Erreur connexion Google: '+e.message); }
}

async function signOutUser() {
  if(!auth) return;
  try { await signOut(auth); } catch(e){ console.error(e); }
}

async function registerWithEmail(email, pass) {
  if(!auth) return alert('Firebase non configuré.');
  try { await createUserWithEmailAndPassword(auth, email, pass); } catch(e){ alert('Erreur inscription: '+e.message); }
}

async function loginWithEmail(email, pass) {
  if(!auth) return alert('Firebase non configuré.');
  try { await signInWithEmailAndPassword(auth, email, pass); } catch(e){ alert('Erreur login: '+e.message); }
}

window.signInWithGoogle = signInWithGoogle;
window.signOutUser = signOutUser;
window.registerWithEmail = registerWithEmail;
window.loginWithEmail = loginWithEmail;

// --- LocalStorage Authentication ---
function creerCompte() {
    const nom = document.getElementById('username').value;
    const mdp = document.getElementById('password').value;
    const message = document.getElementById('auth-message');

    if(nom === "" || mdp === "") {
        message.innerText = "❌ Veuillez remplir tous les champs";
        message.style.color = "red";
    } else {
        // Sauvegarde locale sur le téléphone
        localStorage.setItem('user_nom', nom);
        localStorage.setItem('user_mdp', mdp);
        
        message.innerText = "✅ Compte créé pour " + nom + " !";
        message.style.color = "#009460";
        
        // Cache le formulaire après 2 secondes
        setTimeout(() => {
            document.getElementById('auth-section').innerHTML = "<h3>Bienvenue, " + nom + " ! 👋</h3>";
        }, 2000);
    }
}

window.creerCompte = creerCompte;

function renderPosts() {
  const feed = document.getElementById('feed');
  feed.innerHTML = '';
  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.className = 'card';
    postEl.innerHTML = `
      <div class="card-header">
        <div class="avatar" style="background:${post.color}">
          <span>${post.photo ? `<img src="${post.photo}" alt="${post.user}">` : post.avatar}</span>
        </div>
        <div>
          <h3>${post.user}</h3>
          <div class="card-meta">${post.time}</div>
        </div>
      </div>
      <p>${post.text}</p>
      <div class="card-actions">
        <button class="like-btn ${post.liked?'liked':''} like-${post.id}" onclick="window.toggleLike(${post.id})">❤️ ${post.likes}</button>
        <button onclick="alert('💬 Les commentaires seront disponibles très bientôt!')">💬 Commenter</button>
        <button onclick="alert('🔄 Partagez avec vos amis bientôt!')">🔄 Partager</button>
      </div>
    `;
    feed.appendChild(postEl);
  });
}

window.toggleLike = function(id) {
  const post = posts.find(p => p.id === id);
  if(post) {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    renderPosts();
  }
}

async function addPost(text) {
  if(!text.trim()) return alert('Veuillez écrire quelque chose à partager avec la communauté!');
  
  const user = getRandomUser();
  const currentUser = (typeof auth !== 'undefined' && auth && auth.currentUser) ? auth.currentUser : null;
  const displayName = currentUser && currentUser.displayName ? currentUser.displayName : user.name;
  const avatarChar = displayName ? displayName[0] : user.name[0];
  const photoUrl = currentUser && currentUser.photoURL ? currentUser.photoURL : null;
  const newPost = {
    user: displayName,
    avatar: avatarChar,
    photo: photoUrl,
    color: user.color,
    text: text,
    time: 'À l\'instant',
    likes: 0,
    liked: false
  };
  
  // Ajouter à Firebase si disponible
  if(db) {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        user: newPost.user,
        avatar: newPost.avatar,
        photo: newPost.photo || null,
        color: newPost.color,
        text: newPost.text,
        likes: 0,
        timestamp: new Date(),
        createdAt: new Date().toISOString()
      });
      newPost.id = docRef.id;
      console.log('✅ Post sauvegardé sur Firebase:', docRef.id);
    } catch (error) {
      console.error('❌ Erreur Firebase:', error);
    }
  } else {
    newPost.id = posts.length + 1;
  }
  
  posts.unshift(newPost);
  document.getElementById('postInput').value = '';
  renderPosts();
}

window.addPost = addPost;

// Charger les posts depuis Firebase au démarrage
async function loadPostsFromFirebase() {
  if(!db) {
    console.log('ℹ️ Mode local (Firebase non configuré)');
    return;
  }
  
  try {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    const firebasePosts = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      firebasePosts.push({
        id: doc.id,
        user: data.user,
        avatar: data.avatar,
        photo: data.photo || null,
        color: data.color,
        text: data.text,
        time: '📱 Firebase',
        likes: data.likes || 0,
        liked: false
      });
    });
    if(firebasePosts.length > 0) {
      posts = firebasePosts.concat(posts.slice(0, 2)); // Ajouter posts de démo
      console.log('✅ Posts chargés depuis Firebase:', firebasePosts.length);
    }
  } catch (error) {
    console.error('Erreur lors du chargement Firebase:', error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // Attendre le chargement Firebase
  await new Promise(resolve => setTimeout(resolve, 500));
  // Charger les posts
  await loadPostsFromFirebase();
  renderPosts();
  
  // Événements des boutons
  document.getElementById('postBtn').addEventListener('click', () => {
    addPost(document.getElementById('postInput').value);
  });
  
  document.getElementById('postInput').addEventListener('keypress', (e) => {
    if(e.key === 'Enter') addPost(e.target.value);
  });

  // Auth UI bindings
  const googleBtn = document.getElementById('googleSignIn');
  const signOutBtn = document.getElementById('signOutBtn');
  const showEmail = document.getElementById('showEmailForm');
  const emailAuth = document.getElementById('emailAuth');
  const emailReg = document.getElementById('emailRegister');
  const emailLogin = document.getElementById('emailLogin');

  if(googleBtn) googleBtn.addEventListener('click', signInWithGoogle);
  if(signOutBtn) signOutBtn.addEventListener('click', signOutUser);
  if(showEmail) showEmail.addEventListener('click', ()=>{ if(emailAuth) emailAuth.style.display = emailAuth.style.display === 'none' ? 'flex' : 'none'; });
  if(emailReg) emailReg.addEventListener('click', ()=> registerWithEmail(document.getElementById('emailInput').value, document.getElementById('passInput').value));
  if(emailLogin) emailLogin.addEventListener('click', ()=> loginWithEmail(document.getElementById('emailInput').value, document.getElementById('passInput').value));

  // Auth state observer
  if(auth) {
    onAuthStateChanged(auth, (user) => {
      const welcome = document.getElementById('welcomeText');
      const avatarSmall = document.getElementById('avatarSmall');
      const authButtons = document.getElementById('authButtons');
      const signOutBtn = document.getElementById('signOutBtn');
      const postSection = document.getElementById('postSection');
      if(user) {
        const name = user.displayName || user.email.split('@')[0];
        if(welcome) welcome.textContent = 'Connecté: ' + name;
        if(avatarSmall) { avatarSmall.style.display = 'flex'; avatarSmall.textContent = name[0].toUpperCase(); avatarSmall.style.background = colors[Math.floor(Math.random()*colors.length)]; }
        if(signOutBtn) signOutBtn.style.display = 'inline-block';
        if(postSection) postSection.style.display = 'flex';
      } else {
        if(welcome) welcome.textContent = 'Vous n\'êtes pas connecté';
        if(avatarSmall) avatarSmall.style.display = 'none';
        if(signOutBtn) signOutBtn.style.display = 'none';
        if(postSection) postSection.style.display = 'flex'; // allow posting in local mode
      }
    });
  }
});

