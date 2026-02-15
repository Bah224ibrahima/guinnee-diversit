const jokes = [
  "Pourquoi le livre est-il allé chez le médecin ? Parce qu'il avait la page qui tournait.",
  "Quel animal est toujours heureux ? Le hibou, parce qu'il fait 'hou hou' de joie !",
  "Pourquoi les squelettes ne se battent jamais entre eux ? Ils n'ont pas le cran.",
  "Que dit une tasse à une autre tasse ? On se retrouve au petit-déj !"
];

function random(arr){return arr[Math.floor(Math.random()*arr.length)]}

document.addEventListener('DOMContentLoaded',()=>{
  const jokeEl = document.getElementById('joke');
  const jokeBtn = document.getElementById('jokeBtn');
  const quizBtn = document.getElementById('quizBtn');
  const quizQ = document.getElementById('quizQ');
  const playBtn = document.getElementById('playBtn');

  jokeBtn.addEventListener('click',()=>{ jokeEl.textContent = random(jokes); });

  quizBtn.addEventListener('click',()=>{
    const q = {question:'Quelle est la capitale de la Guinée ?', choices:['Conakry','Bamako','Dakar'], answer:0};
    const reply = prompt(q.question + '\n1) ' + q.choices[0] + '\n2) ' + q.choices[1] + '\n3) ' + q.choices[2] + '\n(Entrez 1, 2 ou 3)');
    const idx = parseInt(reply,10)-1;
    if(!isNaN(idx) && idx>=0 && idx<q.choices.length){
      quizQ.textContent = (idx===q.answer) ? 'Bonne réponse ! 🎉' : 'Raté — la bonne réponse est ' + q.choices[q.answer] + '.';
    } else {
      quizQ.textContent = 'Réponse non valide.';
    }
  });

  playBtn.addEventListener('click',()=>{
    // petit son via WebAudio
    try{
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 440; // La4
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.01);
      o.start();
      // petite mélodie
      const now = ctx.currentTime;
      o.frequency.setValueAtTime(440, now);
      o.frequency.linearRampToValueAtTime(523.25, now + 0.18);
      o.frequency.linearRampToValueAtTime(659.25, now + 0.36);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
      setTimeout(()=>{ o.stop(); ctx.close(); },800);
    }catch(e){ alert('Impossible de jouer le son : ' + e.message); }
  });
});
