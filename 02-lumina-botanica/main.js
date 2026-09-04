// ==========================================
// LUMINA BOTANICA - Interactive Editorial JS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initBotanicalCanvas();
  initMagneticCursor();
  initMoodSwitcher();
  initHerbariumFilters();
  initBloomExperience();
  initChimeAudio();
  initInquiryForm();
});

// ------------------------------------------
// 1. Organic Botanical Particle Canvas
// ------------------------------------------
function initBotanicalCanvas() {
  const canvas = document.getElementById('botanicalCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const count = 45;
  let mouse = { x: -100, y: -100, radius: 120 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class BotanicalSpore {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 5 + 3;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = Math.random() * 20 + 5;
      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = (Math.random() - 0.5) * 0.015;
      this.speedY = Math.random() * 0.4 + 0.2;
      this.color = Math.random() > 0.5 ? 'rgba(45, 90, 69, 0.25)' : 'rgba(200, 109, 81, 0.25)';
    }
    update() {
      this.y -= this.speedY;
      this.angle += this.angularSpeed;
      this.x += Math.sin(this.angle) * 0.4;

      if (this.y < -20) {
        this.y = height + 20;
        this.x = Math.random() * width;
      }

      // Mouse repulsion with spring
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 5;
        this.y -= (dy / dist) * force * 5;
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 1.5, this.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < count; i++) {
    particles.push(new BotanicalSpore());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();

  // Expose function for Bloom trigger
  window.burstPetals = function() {
    for (let i = 0; i < 30; i++) {
      const p = new BotanicalSpore();
      p.x = width / 2 + (Math.random() - 0.5) * 200;
      p.y = height / 2 + (Math.random() - 0.5) * 200;
      p.size = Math.random() * 8 + 4;
      p.speedY = Math.random() * 3 + 1;
      p.color = 'rgba(200, 109, 81, 0.45)';
      particles.push(p);
    }
  };
}

// ------------------------------------------
// 2. Custom Magnetic Cursor
// ------------------------------------------
function initMagneticCursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const text = ring.querySelector('.cursor-text');

  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover target interactions
  const interactiveElements = document.querySelectorAll('[data-cursor], a, button, .specimen-card');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('active');
      const label = el.getAttribute('data-cursor') || 'VIEW';
      text.innerText = label;
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('active');
      text.innerText = '';
    });
  });
}

// ------------------------------------------
// 3. Mood Switcher (Dawn, Dusk, Nocturne)
// ------------------------------------------
function initMoodSwitcher() {
  const moodBtns = document.querySelectorAll('.mood-btn');
  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      moodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mood = btn.getAttribute('data-mood');
      document.body.className = '';
      if (mood === 'dusk') document.body.classList.add('mood-dusk');
      if (mood === 'night') document.body.classList.add('mood-night');
      playChime(440);
    });
  });
}

// ------------------------------------------
// 4. Herbarium Filter Tabs
// ------------------------------------------
function initHerbariumFilters() {
  const filterBtns = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.specimen-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
      playChime(660);
    });
  });
}

// ------------------------------------------
// 5. Trigger Bloom Interactive Experience
// ------------------------------------------
function initBloomExperience() {
  const bloomBtn = document.getElementById('bloomTrigger');
  const heroPhoto = document.getElementById('heroBotanicalPhoto');

  if (!bloomBtn) return;

  bloomBtn.addEventListener('click', () => {
    if (window.burstPetals) {
      window.burstPetals();
    }
    if (heroPhoto) {
      heroPhoto.style.transform = 'scale(1.12)';
      heroPhoto.style.filter = 'brightness(1.2) contrast(1.1) saturate(1.2)';
      setTimeout(() => {
        heroPhoto.style.transform = '';
        heroPhoto.style.filter = '';
      }, 2400);
    }
    playChime(523.25);
    setTimeout(() => playChime(659.25), 150);
    setTimeout(() => playChime(783.99), 300);
  });
}

// ------------------------------------------
// 6. Gentle Wind Chime Synthesizer
// ------------------------------------------
let botanicalAudioCtx = null;
let chimesEnabled = false;

function initChimeAudio() {
  const audioBtn = document.getElementById('audioToggle');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    if (!botanicalAudioCtx) {
      botanicalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (botanicalAudioCtx.state === 'suspended') {
      botanicalAudioCtx.resume();
    }

    chimesEnabled = !chimesEnabled;
    if (chimesEnabled) {
      audioBtn.style.borderColor = 'var(--accent-sage)';
      audioBtn.style.color = 'var(--accent-sage)';
      playChime(528); // Solfeggio 528Hz love/nature frequency
    } else {
      audioBtn.style.borderColor = '';
      audioBtn.style.color = '';
    }
  });
}

function playChime(freq) {
  if (!chimesEnabled || !botanicalAudioCtx) return;
  const now = botanicalAudioCtx.currentTime;

  const osc = botanicalAudioCtx.createOscillator();
  const gain = botanicalAudioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

  osc.connect(gain);
  gain.connect(botanicalAudioCtx.destination);

  osc.start(now);
  osc.stop(now + 1.6);
}

// ------------------------------------------
// 7. Inquiry Form Simulation
// ------------------------------------------
function initInquiryForm() {
  const subscribeBtn = document.getElementById('subscribeBtn');
  const confirmMsg = document.getElementById('confirmMsg');
  const input = document.querySelector('.editorial-input');

  if (!subscribeBtn || !input) return;

  subscribeBtn.addEventListener('click', () => {
    if (!input.value || !input.value.includes('@')) {
      confirmMsg.innerText = 'Please enter a valid email address.';
      confirmMsg.style.color = 'var(--accent-clay)';
      return;
    }

    confirmMsg.innerText = 'Thank you. The Vol. XXIII Living Archive catalogue has been dispatched.';
    confirmMsg.style.color = 'var(--accent-sage)';
    input.value = '';
    playChime(880);
  });
}
