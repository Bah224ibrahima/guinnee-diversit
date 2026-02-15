const users = ['Ibrahima', 'Amara', 'Fatou', 'Mamoudou', 'Khadija', 'Sékou', 'Aissatou', 'Koré'];
const colors = ['#CE1126', '#007A5E', '#FCD116', '#CE1126', '#007A5E', '#FCD116', '#E74C3C', '#1a5f7a'];
let posts = [
  {id:1, user:'Ibrahima Bah', avatar:'I', color:'#CE1126', text:'Bienvenue sur Guinée Divertisity! Divertissez-vous avec la communauté 🇬🇳 🎉', time:'2h', likes:42, liked:false},
  {id:2, user:'Amara Diallo', avatar:'A', color:'#007A5E', text:'J\'aime cette plateforme! À bientôt pour plus de contenu guinéen! ✨', time:'1h', likes:28, liked:false}
];

function getRandomUser() { return {name:users[Math.floor(Math.random()*users.length)], color:colors[Math.floor(Math.random()*colors.length)]}; }
function formatTime() { const h = Math.floor(Math.random()*48)+1; return h+'h'; }

function renderPosts() {
  const feed = document.getElementById('feed');
  feed.innerHTML = '';
  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.className = 'card';
    postEl.innerHTML = `
      <div class="card-header">
        <div class="avatar" style="background:${post.color}">${post.avatar}</div>
        <div>
          <h3>${post.user}</h3>
          <div class="card-meta">${post.time}</div>
        </div>
      </div>
      <p>${post.text}</p>
      <div class="card-actions">
        <button class="like-btn ${post.liked?'liked':''} like-${post.id}" onclick="toggleLike(${post.id})">❤️ ${post.likes}</button>
        <button onclick="alert('💬 Les commentaires seront disponibles très bientôt!')">💬 Commenter</button>
        <button onclick="alert('🔄 Partagez avec vos amis bientôt!')">🔄 Partager</button>
      </div>
    `;
    feed.appendChild(postEl);
  });
}

function toggleLike(id) {
  const post = posts.find(p => p.id === id);
  if(post) {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    renderPosts();
  }
}

function addPost(text) {
  if(!text.trim()) return alert('Veuillez écrire quelque chose à partager avec la communauté!');
  const user = getRandomUser();
  const newPost = {
    id:posts.length + 1,
    user:user.name,
    avatar:user.name[0],
    color:user.color,
    text:text,
    time:'À l\'instant',
    likes:0,
    liked:false
  };
  posts.unshift(newPost);
  document.getElementById('postInput').value = '';
  renderPosts();
}

document.addEventListener('DOMContentLoaded',()=>{
  renderPosts();
  document.getElementById('postBtn').addEventListener('click',()=>{
    addPost(document.getElementById('postInput').value);
  });
  document.getElementById('postInput').addEventListener('keypress',(e)=>{
    if(e.key==='Enter') addPost(e.target.value);
  });
});
