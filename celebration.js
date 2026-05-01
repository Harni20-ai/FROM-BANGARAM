// === ENTRANCE ===
// === ENTER CELEBRATION (starts Sakha immediately on tap) ===
function enterCelebration() {
  // Start Sakha music IMMEDIATELY
  const bgMusic = document.getElementById('bgMusic');
  bgMusic.volume = 0.5;
  bgMusic.play();
  playing = true;
  document.getElementById('musicBtn').classList.add('playing');
  document.getElementById('playBtn').textContent = '⏸ Pause';

  // Hide click screen, show entrance animation
  document.getElementById('clickEnter').style.display = 'none';
  document.getElementById('entranceOverlay').style.display = 'flex';

  // Launch fireworks during entrance
  launchFireworks();

  // After entrance animation, reveal site
  setTimeout(() => {
    document.getElementById('entranceOverlay').classList.add('hidden');
    initGold(); initPetals(); initScroll(); initBlessing();
  }, 2500);
}

// === GOLD PARTICLES ===
function initGold() {
  const c = document.getElementById('goldCanvas'), ctx = c.getContext('2d');
  const mob = window.innerWidth < 768, N = mob ? 35 : 80;
  let ps = [];
  function resize() { c.width = innerWidth; c.height = innerHeight; } resize();
  window.addEventListener('resize', resize);
  class P {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * c.width;
      this.y = c.height + Math.random() * 80;
      this.s = Math.random() * 3 + 1;
      this.vy = -(Math.random() * .5 + .2);
      this.vx = (Math.random() - .5) * .3;
      this.o = Math.random() * .6 + .2;
      this.g = Math.random() > .7;
    }
    update() { this.y += this.vy; this.x += this.vx; this.o -= .001; if (this.y < -10 || this.o <= 0) this.reset(); }
    draw() {
      ctx.save(); ctx.globalAlpha = this.o;
      if (this.g) { ctx.shadowBlur = 15; ctx.shadowColor = '#FFD700'; }
      ctx.fillStyle = '#D4AF37'; ctx.beginPath(); ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
  }
  for (let i = 0; i < N; i++) { const p = new P(); p.y = Math.random() * c.height; ps.push(p); }
  (function anim() { ctx.clearRect(0, 0, c.width, c.height); ps.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(anim); })();
}

// === PETALS ===
function initPetals() {
  const c = document.getElementById('petalCanvas'), ctx = c.getContext('2d');
  const mob = window.innerWidth < 768, N = mob ? 15 : 30;
  let ps = [];
  function resize() { c.width = innerWidth; c.height = innerHeight; } resize();
  window.addEventListener('resize', resize);
  const cols = ['#FF6B6B', '#FF8E53', '#FFD700', '#FF4757', '#FFA502', '#e74c3c', '#FF69B4', '#FFC300'];
  class Pt {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * c.width; this.y = -15;
      this.s = Math.random() * 9 + 4; this.vy = Math.random() * 1.2 + .4;
      this.vx = (Math.random() - .5) * .8; this.r = Math.random() * 360;
      this.rs = (Math.random() - .5) * 3; this.col = cols[Math.floor(Math.random() * cols.length)];
      this.o = Math.random() * .5 + .3; this.w = Math.random() * Math.PI * 2;
    }
    update() { this.y += this.vy; this.w += .03; this.x += Math.sin(this.w) * .5 + this.vx; this.r += this.rs; if (this.y > c.height + 15) this.reset(); }
    draw() {
      ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.r * Math.PI / 180);
      ctx.globalAlpha = this.o; ctx.fillStyle = this.col;
      ctx.beginPath(); ctx.ellipse(0, 0, this.s, this.s * .6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(0, 0, this.s * .6, this.s, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }
  for (let i = 0; i < N; i++) { const p = new Pt(); p.y = Math.random() * c.height; ps.push(p); }
  (function anim() { ctx.clearRect(0, 0, c.width, c.height); ps.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(anim); })();
}

// === FIREWORKS ===
function launchFireworks() {
  const c = document.getElementById('fireworkCanvas'), ctx = c.getContext('2d');
  c.width = innerWidth; c.height = innerHeight;
  let sparks = [], running = true;
  class S {
    constructor(x, y, col) {
      this.x = x; this.y = y; this.col = col;
      const a = Math.random() * Math.PI * 2, sp = Math.random() * 6 + 2;
      this.vx = Math.cos(a) * sp; this.vy = Math.sin(a) * sp;
      this.life = 1; this.dc = Math.random() * .02 + .008; this.sz = Math.random() * 3 + 1;
    }
    update() { this.x += this.vx; this.y += this.vy; this.vy += .04; this.life -= this.dc; }
    draw() {
      ctx.save(); ctx.globalAlpha = this.life; ctx.shadowBlur = 12; ctx.shadowColor = this.col;
      ctx.fillStyle = this.col; ctx.beginPath(); ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
  }
  function add() {
    const x = Math.random() * c.width, y = Math.random() * c.height * .5;
    const col = ['#FFD700','#D4AF37','#FF6B6B','#FFA502','#FF4757','#FF8E53'][Math.floor(Math.random() * 6)];
    for (let i = 0; i < 70; i++) sparks.push(new S(x, y, col));
  }
  for (let i = 0; i < 10; i++) setTimeout(add, i * 600);
  (function anim() {
    if (!running) { ctx.clearRect(0, 0, c.width, c.height); return; }
    ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fillRect(0, 0, c.width, c.height);
    sparks = sparks.filter(s => s.life > 0); sparks.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(anim);
  })();
  setTimeout(() => { running = false; ctx.clearRect(0, 0, c.width, c.height); }, 7000);
}

// === SCROLL REVEAL ===
function initScroll() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  const obs2 = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const d = e.target.dataset.delay || 0;
        setTimeout(() => e.target.classList.add('visible'), parseInt(d));
      }
    });
  }, { threshold: .1 });
  document.querySelectorAll('.reveal-item').forEach(el => obs2.observe(el));
}

// === BLESSING WORDS ===
function initBlessing() {
  const el = document.getElementById('blessingText');
  if (!el) return;
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map(w => `<span class="bword">${w}</span>`).join(' ');
  const spans = el.querySelectorAll('.bword');
  const line = document.getElementById('blessingLine');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        spans.forEach((s, i) => setTimeout(() => s.classList.add('vis'), i * 70));
        setTimeout(() => line && line.classList.add('vis'), words.length * 70 + 300);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: .25 });
  obs.observe(el);
}

// === MUSIC SYSTEM ===
let playing = false;
let customAudio = null;
const bgMusic = document.getElementById('bgMusic');

function togglePanel() { document.getElementById('musicPanel').classList.toggle('open'); }

function togglePlay() {
  const btn = document.getElementById('playBtn'), mb = document.getElementById('musicBtn');
  const audio = customAudio || bgMusic;
  if (audio.paused) {
    audio.play(); btn.textContent = '⏸ Pause'; mb.classList.add('playing'); playing = true;
  } else {
    audio.pause(); btn.textContent = '▶ Play Sakha'; mb.classList.remove('playing'); playing = false;
  }
}

function uploadSong(e) {
  const f = e.target.files[0]; if (!f) return;
  bgMusic.pause();
  if (customAudio) customAudio.pause();
  customAudio = new Audio(URL.createObjectURL(f)); customAudio.loop = true; customAudio.play();
  playing = true; document.getElementById('playBtn').textContent = '⏸ Pause';
  document.getElementById('musicBtn').classList.add('playing');
}

function switchTrack(v) {
  if (v === 'sakha') {
    if (customAudio) { customAudio.pause(); customAudio = null; }
    bgMusic.play(); playing = true;
  }
  document.getElementById('playBtn').textContent = '⏸ Pause';
  document.getElementById('musicBtn').classList.add('playing');
}
