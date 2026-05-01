// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loadingScreen').classList.add('hidden');
    initParticles();
    initPetals();
    initScrollAnimations();
    initMessageWords();
    initTimelineScroll();
    initParallax();
  }, 3000);
});

// ===== PARALLAX SCROLL =====
function initParallax() {
  const bg = document.getElementById('parallaxBg');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    bg.style.transform = `scale(1.1) translateY(${scrollY * 0.3}px)`;
  }, { passive: true });
}

// ===== GOLD DUST PARTICLES =====
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const isMobile = window.innerWidth < 768;
  const count = isMobile ? 30 : 70;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 100;
      this.size = Math.random() * 3 + 1;
      this.speedY = -(Math.random() * 0.5 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.glow = Math.random() > 0.7;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.opacity -= 0.001;
      if (this.y < -20 || this.opacity <= 0) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      if (this.glow) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#FFD700';
      }
      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < count; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height;
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== FALLING PETALS =====
function initPetals() {
  const canvas = document.getElementById('petals-canvas');
  const ctx = canvas.getContext('2d');
  let petals = [];
  const isMobile = window.innerWidth < 768;
  const count = isMobile ? 12 : 25;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#FF6B6B', '#FF8E53', '#FFD700', '#FF4757', '#FFA502', '#e74c3c'];

  class Petal {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.size = Math.random() * 8 + 4;
      this.speedY = Math.random() * 1.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 1;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 3;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.opacity = Math.random() * 0.5 + 0.3;
      this.wave = Math.random() * Math.PI * 2;
    }
    update() {
      this.y += this.speedY;
      this.wave += 0.03;
      this.x += Math.sin(this.wave) * 0.5 + this.speedX;
      this.rotation += this.rotSpeed;
      if (this.y > canvas.height + 20) this.reset();
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.6, this.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < count; i++) {
    const p = new Petal();
    p.y = Math.random() * canvas.height;
    petals.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .reveal-scale').forEach(el => observer.observe(el));
}

// ===== TIMELINE SCROLL =====
function initTimelineScroll() {
  const items = document.querySelectorAll('.timeline-item');
  const progress = document.getElementById('timelineProgress');
  const timeline = document.querySelector('.timeline');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => observer.observe(item));

  window.addEventListener('scroll', () => {
    if (!timeline) return;
    const rect = timeline.getBoundingClientRect();
    const top = rect.top;
    const height = rect.height;
    const windowH = window.innerHeight;
    const scrolled = Math.max(0, Math.min(1, (windowH - top) / (height + windowH)));
    if (progress) progress.style.height = `${scrolled * 100}%`;
  }, { passive: true });
}

// ===== MESSAGE WORD-BY-WORD =====
function initMessageWords() {
  const el = document.getElementById('messageText');
  if (!el) return;
  const text = el.textContent.trim();
  const words = text.split(/\s+/);
  el.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');

  const wordSpans = el.querySelectorAll('.word');
  const underline = document.getElementById('goldUnderline');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        wordSpans.forEach((span, i) => {
          setTimeout(() => span.classList.add('visible'), i * 80);
        });
        setTimeout(() => underline && underline.classList.add('visible'), words.length * 80 + 300);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(el);
}

// ===== CELEBRATION =====
function celebrate() {
  const overlay = document.getElementById('celebrationOverlay');
  overlay.classList.add('active');
  launchFireworks();
  createPetalBurst();
  playCelebrationSound();

  // Redirect to celebration page after brief fireworks display
  setTimeout(() => {
    window.location.href = 'celebration.html';
  }, 2500);
}

function createPetalBurst() {
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const petal = document.createElement('div');
      petal.style.cssText = `
        position: fixed; z-index: 10001;
        width: ${Math.random() * 15 + 5}px;
        height: ${Math.random() * 15 + 5}px;
        background: ${['#FF6B6B','#FFD700','#FF4757','#FFA502','#e74c3c','#FF8E53'][Math.floor(Math.random()*6)]};
        border-radius: 50% 0 50% 0;
        left: 50%; top: 50%;
        pointer-events: none;
        animation: burstPetal ${Math.random() * 2 + 2}s ease-out forwards;
      `;
      const angle = (Math.PI * 2 * i) / 50;
      const dist = Math.random() * 400 + 100;
      petal.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
      petal.style.setProperty('--ty', `${Math.sin(angle) * dist - 200}px`);
      document.body.appendChild(petal);
      setTimeout(() => petal.remove(), 4000);
    }, i * 30);
  }

  // Add dynamic keyframe for petal burst
  if (!document.getElementById('burstStyle')) {
    const style = document.createElement('style');
    style.id = 'burstStyle';
    style.textContent = `
      @keyframes burstPetal {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
        100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ===== FIREWORKS =====
function launchFireworks() {
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let fireworks = [];
  let sparks = [];
  let running = true;

  class Spark {
    constructor(x, y, color) {
      this.x = x; this.y = y;
      this.color = color;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.life = 1;
      this.decay = Math.random() * 0.02 + 0.01;
      this.size = Math.random() * 3 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.05;
      this.life -= this.decay;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.life;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function addFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.5;
    const colors = ['#FFD700', '#D4AF37', '#FF6B6B', '#FFA502', '#FF4757', '#FF8E53'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 60; i++) sparks.push(new Spark(x, y, color));
  }

  function animate() {
    if (!running) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    sparks = sparks.filter(s => s.life > 0);
    sparks.forEach(s => { s.update(); s.draw(); });
    requestAnimationFrame(animate);
  }

  // Launch multiple fireworks
  for (let i = 0; i < 8; i++) setTimeout(addFirework, i * 500);
  animate();

  setTimeout(() => {
    running = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 6000);
}

// ===== AUDIO SYSTEM =====
let isPlaying = false;
let customAudio = null;
const bgMusic = document.getElementById('bgMusic');

// Auto-play after loading screen
window.addEventListener('load', () => {
  setTimeout(() => {
    bgMusic.volume = 0.5;
    bgMusic.play().then(() => {
      isPlaying = true;
      document.getElementById('musicBtn').classList.add('playing');
      document.getElementById('playPauseBtn').textContent = '⏸ Pause';
    }).catch(() => {
      // Browser blocked autoplay - user needs to click
    });
  }, 3200);
});

function toggleMusicPanel() {
  document.getElementById('musicPanel').classList.toggle('open');
}

function toggleMusic() {
  const btn = document.getElementById('playPauseBtn');
  const musicBtn = document.getElementById('musicBtn');
  const audio = customAudio || bgMusic;

  if (audio.paused) {
    audio.play();
    btn.textContent = '⏸ Pause';
    musicBtn.classList.add('playing');
    isPlaying = true;
  } else {
    audio.pause();
    btn.textContent = '▶ Play';
    musicBtn.classList.remove('playing');
    isPlaying = false;
  }
}

function handleUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  bgMusic.pause();
  if (customAudio) customAudio.pause();
  customAudio = new Audio(URL.createObjectURL(file));
  customAudio.loop = true;
  customAudio.play();
  isPlaying = true;
  document.getElementById('playPauseBtn').textContent = '⏸ Pause';
  document.getElementById('musicBtn').classList.add('playing');
}

function selectTrack(value) {
  if (value === 'tharime') {
    if (customAudio) { customAudio.pause(); customAudio = null; }
    bgMusic.play();
    isPlaying = true;
  }
  document.getElementById('playPauseBtn').textContent = '⏸ Pause';
  document.getElementById('musicBtn').classList.add('playing');
}

function playCelebrationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const celebNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    celebNotes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.2);
      g.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.2 + 0.1);
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.2 + 0.8);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.2);
      osc.stop(ctx.currentTime + i * 0.2 + 0.8);
    });
  } catch(e) {}
}
