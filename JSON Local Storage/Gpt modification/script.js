// Persistent score -------------------------------------------
const saved = JSON.parse(localStorage.getItem('score')) || { win: 0, lost: 0, tie: 0, rounds: 0 };
let score = { ...saved };

const winsEl   = document.getElementById('wins');
const lossesEl = document.getElementById('losses');
const tiesEl   = document.getElementById('ties');
const roundsEl = document.getElementById('rounds');

const youPick   = document.getElementById('youPick');
const cpuPick   = document.getElementById('cpuPick');
const resultTxt = document.getElementById('resultText');

const rules     = document.getElementById('rules');
const rulesBtn  = document.getElementById('rulesBtn');
const resetBtn  = document.getElementById('resetBtn');
const playAgain = document.getElementById('playAgain');

// Initialize
updateScoreUI(false);
renderPicks(null, null);
resultTxt.textContent = "Make your move!";

// Utility -------------------------------------------
const CHOICES = ["Bat", "Ball", "Stump"];

function randomChoice(){
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

function decide(user, cpu){
  if (user === cpu) return "tie";
  if (
    (user === "Bat"   && cpu === "Ball") ||
    (user === "Ball"  && cpu === "Stump") ||
    (user === "Stump" && cpu === "Bat")
  ) return "win";
  return "lose";
}

function iconFor(choice){
  const map = {
    Bat:   "Assets/cricket-bat.png",
    Ball:  "Assets/cricket-ball.png",
    Stump: "Assets/cricket-stump.png"
  };
  const img = document.createElement('img');
  img.alt = choice;
  img.src = map[choice];
  return img;
}

function renderPicks(you, cpu){
  youPick.innerHTML = "";
  cpuPick.innerHTML = "";
  if (you) youPick.appendChild(iconFor(you));
  if (cpu) cpuPick.appendChild(iconFor(cpu));
}

function animateNumber(el, to){
  const from = +el.textContent || 0;
  const diff = to - from;
  const dur = 350;
  const start = performance.now();
  function step(t){
    const p = Math.min(1, (t - start) / dur);
    el.textContent = Math.round(from + diff * p);
    if (p < 1) requestAnimationFrame(step);
  }
  el.classList.add('bump');
  setTimeout(() => el.classList.remove('bump'), 260);
  requestAnimationFrame(step);
}

function updateScoreUI(animate=true){
  if(animate){
    animateNumber(winsEl,   score.win);
    animateNumber(lossesEl, score.lost);
    animateNumber(tiesEl,   score.tie);
    animateNumber(roundsEl, score.rounds);
  } else {
    winsEl.textContent   = score.win;
    lossesEl.textContent = score.lost;
    tiesEl.textContent   = score.tie;
    roundsEl.textContent = score.rounds;
  }
}

function saveScore(){
  localStorage.setItem('score', JSON.stringify(score));
}

// Ripple helper for nice tap effect
function ripple(e, el){
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  el.style.setProperty('--x', x + 'px');
  el.style.setProperty('--y', y + 'px');
  el.classList.remove('ripple'); // restart
  void el.offsetWidth;
  el.classList.add('ripple');
}

// Gameplay -------------------------------------------
document.querySelectorAll('.choice').forEach(btn => {
  btn.addEventListener('click', (e) => {
    // rules disappear on first selection:
    if (rules.classList.contains('show')) {
      rules.classList.remove('show');
      rulesBtn.setAttribute('aria-expanded', 'false');
    }

    ripple(e, btn);

    const user = btn.dataset.choice;
    // Temporarily fade the picked button for "disappear" feel
    btn.style.opacity = '0.35';
    setTimeout(()=> btn.style.opacity = '', 500);

    const cpu = randomChoice();
    const outcome = decide(user, cpu);

    renderPicks(user, cpu);

    resultTxt.className = 'result-text ' + (outcome === 'win' ? 'win' : outcome === 'lose' ? 'lose' : 'tie');
    resultTxt.textContent =
      outcome === 'win'  ? 'You Won! 🎉' :
      outcome === 'lose' ? 'You Lost 💔' :
                           "It's a Tie 🤝";

    // Update scores
    if(outcome === 'win')  score.win++;
    if(outcome === 'lose') score.lost++;
    if(outcome === 'tie')  score.tie++;
    score.rounds++;
    updateScoreUI(true);
    saveScore();

    // Show "Play again" button briefly
    playAgain.hidden = false;
    setTimeout(()=> { playAgain.hidden = true; }, 1200);
  }, { passive: true });
});

// Buttons -------------------------------------------
rulesBtn.addEventListener('click', () => {
  const showing = rules.classList.toggle('show');
  rulesBtn.setAttribute('aria-expanded', String(showing));
});

resetBtn.addEventListener('click', () => {
  localStorage.clear();
  score = { win:0, lost:0, tie:0, rounds:0 };
  updateScoreUI(true);
  renderPicks(null, null);
  resultTxt.className = 'result-text';
  resultTxt.textContent = "Score reset. Make your move!";
  rules.classList.add('show'); // show rules again after reset
  rulesBtn.setAttribute('aria-expanded', 'true');
});

playAgain.addEventListener('click', () => {
  resultTxt.className = 'result-text';
  resultTxt.textContent = "Make your move!";
  renderPicks(null, null);
});

// Accessibility hint for keyboard players
document.addEventListener('keyup', (e) => {
  const keyMap = { 'b': 'Bat', 'a': 'Ball', 's': 'Stump' }; // b,a,s
  const choice = keyMap[e.key?.toLowerCase()];
  if(choice){
    document.querySelector(`.choice[data-choice="${choice}"]`).click();
  }
});
