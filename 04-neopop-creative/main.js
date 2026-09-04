// ==========================================
// NEOPOP - Hyper-Playful Interactive Engine
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initDraggableStickers();
  initConfettiCanvas();
  initBudgetCalculator();
  initPopAudio();
});

// ------------------------------------------
// 1. Draggable Physics Stickers & Playground
// ------------------------------------------
function initDraggableStickers() {
  const stickers = document.querySelectorAll('[data-drag="true"]');
  const resetBtn = document.getElementById('resetStickersBtn');

  const defaultRotations = [-3, 4, -2, 3, -4, 5];

  stickers.forEach((sticker, idx) => {
    sticker._x = 0;
    sticker._y = 0;
    sticker._rot = defaultRotations[idx % defaultRotations.length];
    
    // Set initial transform
    sticker.style.transform = `translate3d(0px, 0px, 0px) rotate(${sticker._rot}deg)`;
    sticker.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';

    let isDragging = false;
    let startX = 0, startY = 0;
    let initialX = 0, initialY = 0;

    function onPointerDown(e) {
      isDragging = true;
      startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      initialX = sticker._x;
      initialY = sticker._y;

      sticker.style.zIndex = '500';
      sticker.style.transition = 'none';
      sticker.style.cursor = 'grabbing';
      sticker.style.transform = `translate3d(${sticker._x}px, ${sticker._y}px, 0px) rotate(${sticker._rot + 3}deg) scale(1.08)`;
      playPopSound('boing');

      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('touchmove', onPointerMove, { passive: false });
      window.addEventListener('mouseup', onPointerUp);
      window.addEventListener('touchend', onPointerUp);
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      if (e.cancelable && e.type === 'touchmove') e.preventDefault();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const dx = clientX - startX;
      const dy = clientY - startY;

      sticker._x = initialX + dx;
      sticker._y = initialY + dy;
      sticker.style.transform = `translate3d(${sticker._x}px, ${sticker._y}px, 0px) rotate(${sticker._rot + 3}deg) scale(1.08)`;
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      sticker.style.zIndex = '10';
      sticker.style.cursor = 'grab';
      sticker.style.transition = 'transform 0.15s ease, box-shadow 0.15s ease';
      sticker.style.transform = `translate3d(${sticker._x}px, ${sticker._y}px, 0px) rotate(${sticker._rot}deg) scale(1)`;
      playPopSound('pop');

      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
    }

    sticker.addEventListener('mousedown', onPointerDown);
    sticker.addEventListener('touchstart', onPointerDown, { passive: true });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      stickers.forEach((sticker) => {
        sticker._x = 0;
        sticker._y = 0;
        sticker.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        sticker.style.transform = `translate3d(0px, 0px, 0px) rotate(${sticker._rot}deg)`;
      });
      playPopSound('pop');
    });
  }
}

// ------------------------------------------
// 2. Fullscreen Confetti Engine
// ------------------------------------------
let confettiParticles = [];
let confettiCtx = null;
let confettiCanvas = null;

function initConfettiCanvas() {
  confettiCanvas = document.getElementById('confettiCanvas');
  if (!confettiCanvas) return;
  confettiCtx = confettiCanvas.getContext('2d');

  function resize() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function animate() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.rotation += p.vRotation;
      p.life -= 0.012;

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rotation);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      confettiCtx.restore();

      if (p.life <= 0 || p.y > confettiCanvas.height) {
        confettiParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }
  animate();

  const partyBtn = document.getElementById('confettiTrigger');
  if (partyBtn) {
    partyBtn.addEventListener('click', (e) => {
      triggerConfetti(e.clientX, e.clientY);
      playPopSound('cheer');
    });
  }
}

function triggerConfetti(originX, originY) {
  const colors = ['#ffde59', '#b388ff', '#00f0b5', '#ff70a6', '#121212', '#ffffff'];
  for (let i = 0; i < 90; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 12 + 4;
    confettiParticles.push({
      x: originX || window.innerWidth / 2,
      y: originY || window.innerHeight / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6,
      size: Math.random() * 12 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI,
      vRotation: (Math.random() - 0.5) * 0.2,
      life: 1.0
    });
  }
}

// ------------------------------------------
// 3. Interactive Budget Calculator
// ------------------------------------------
function initBudgetCalculator() {
  const scopeSlider = document.getElementById('scopeSlider');
  const insanitySlider = document.getElementById('insanitySlider');
  const scopeDecBtn = document.getElementById('scopeDecBtn');
  const scopeIncBtn = document.getElementById('scopeIncBtn');
  const insanityDecBtn = document.getElementById('insanityDecBtn');
  const insanityIncBtn = document.getElementById('insanityIncBtn');
  const scopePills = document.querySelectorAll('#scopePills .tier-pill');
  const insanityPills = document.querySelectorAll('#insanityPills .tier-pill');
  const checkBrand = document.getElementById('checkBrand');
  const checkSound = document.getElementById('checkSound');
  const scopeLabel = document.getElementById('scopeLabel');
  const insanityLabel = document.getElementById('insanityLabel');
  const totalBudget = document.getElementById('totalBudget');
  const bookCallBtn = document.getElementById('bookCallBtn');

  if (!scopeSlider || !insanitySlider) return;

  const scopeTexts = {
    1: '1-Page Brutalist Landing Page',
    2: '3-5 Page Interactive Site',
    3: 'Full Web App & Product Experience',
    4: 'Enterprise Multi-Platform System'
  };

  const insanityTexts = {
    1: 'Standard (Chunky CSS + Micro-interactions)',
    2: 'High (3D Canvas + Custom Sound)',
    3: 'MAXIMUM OVERDRIVE (Physics + WebGL + Chaos)'
  };

  function calculate() {
    const scopeVal = Math.min(4, Math.max(1, parseInt(scopeSlider.value, 10) || 1));
    const insanityVal = Math.min(3, Math.max(1, parseInt(insanitySlider.value, 10) || 1));

    if (scopeLabel) scopeLabel.innerText = scopeTexts[scopeVal] || '';
    if (insanityLabel) insanityLabel.innerText = insanityTexts[insanityVal] || '';

    // Synchronize Pill buttons active classes
    scopePills.forEach(pill => {
      pill.classList.toggle('active', parseInt(pill.dataset.val, 10) === scopeVal);
    });
    insanityPills.forEach(pill => {
      pill.classList.toggle('active', parseInt(pill.dataset.val, 10) === insanityVal);
    });

    let base = scopeVal * 4200;
    let multiplier = insanityVal === 1 ? 1.0 : (insanityVal === 2 ? 1.45 : 1.95);
    let total = base * multiplier;

    if (checkBrand && checkBrand.checked) total += 2500;
    if (checkSound && checkSound.checked) total += 1800;

    if (totalBudget) {
      totalBudget.innerText = `$${Math.round(total).toLocaleString()}`;
    }
  }

  // Dual listener for slider (input = real-time drag, change = final step)
  [scopeSlider, insanitySlider].forEach(slider => {
    slider.addEventListener('input', () => {
      calculate();
      playPopSound('blip');
    });
    slider.addEventListener('change', () => {
      calculate();
    });
  });

  // Stepper buttons [-] and [+] for Scope
  if (scopeDecBtn) {
    scopeDecBtn.addEventListener('click', () => {
      let val = parseInt(scopeSlider.value, 10);
      if (val > 1) {
        scopeSlider.value = val - 1;
        calculate();
        playPopSound('blip');
      }
    });
  }
  if (scopeIncBtn) {
    scopeIncBtn.addEventListener('click', () => {
      let val = parseInt(scopeSlider.value, 10);
      if (val < 4) {
        scopeSlider.value = val + 1;
        calculate();
        playPopSound('blip');
      }
    });
  }

  // Stepper buttons [-] and [+] for Complexity
  if (insanityDecBtn) {
    insanityDecBtn.addEventListener('click', () => {
      let val = parseInt(insanitySlider.value, 10);
      if (val > 1) {
        insanitySlider.value = val - 1;
        calculate();
        playPopSound('blip');
      }
    });
  }
  if (insanityIncBtn) {
    insanityIncBtn.addEventListener('click', () => {
      let val = parseInt(insanitySlider.value, 10);
      if (val < 3) {
        insanitySlider.value = val + 1;
        calculate();
        playPopSound('blip');
      }
    });
  }

  // Clickable Tier Pills
  scopePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const val = parseInt(pill.dataset.val, 10);
      if (val) {
        scopeSlider.value = val;
        calculate();
        playPopSound('blip');
      }
    });
  });

  insanityPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const val = parseInt(pill.dataset.val, 10);
      if (val) {
        insanitySlider.value = val;
        calculate();
        playPopSound('blip');
      }
    });
  });

  // Checkboxes
  [checkBrand, checkSound].forEach(chk => {
    if (chk) {
      chk.addEventListener('change', () => {
        calculate();
        playPopSound('pop');
      });
    }
  });

  calculate();

  if (bookCallBtn) {
    bookCallBtn.addEventListener('click', (e) => {
      triggerConfetti(e.clientX, e.clientY);
      playPopSound('cheer');
      const originalText = bookCallBtn.innerText;
      bookCallBtn.innerText = 'PROJECT LOCKED! WE WILL CONTACT YOU SHORTLY';
      setTimeout(() => {
        bookCallBtn.innerText = originalText;
      }, 3500);
    });
  }
}

// ------------------------------------------
// 4. Web Audio Retro 8-Bit SFX Engine
// ------------------------------------------
let sfxAudioCtx = null;
let sfxEnabled = true;

function initPopAudio() {
  const toggleBtn = document.getElementById('sfxToggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    try {
      if (!sfxAudioCtx) {
        sfxAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (sfxAudioCtx.state === 'suspended') {
        sfxAudioCtx.resume();
      }
    } catch (e) {}

    sfxEnabled = !sfxEnabled;
    const textSpan = toggleBtn.querySelector('.sfx-text');
    if (textSpan) {
      textSpan.innerText = sfxEnabled ? 'SFX: ON' : 'SFX: OFF';
    }
    toggleBtn.style.background = sfxEnabled ? 'var(--mint)' : 'var(--bg-creme)';
    playPopSound('blip');
  });

  // Interactive UI hover pops
  document.querySelectorAll('a, button, .bento-card, .tier-pill').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      if (Math.random() > 0.6) playPopSound('click');
    });
  });
}

function playPopSound(type) {
  if (!sfxEnabled) return;
  try {
    if (!sfxAudioCtx) {
      sfxAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (sfxAudioCtx.state === 'suspended') {
      sfxAudioCtx.resume();
    }

    const now = sfxAudioCtx.currentTime;

    if (type === 'blip') {
      const osc = sfxAudioCtx.createOscillator();
      const gain = sfxAudioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(sfxAudioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'pop') {
      const osc = sfxAudioCtx.createOscillator();
      const gain = sfxAudioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.06);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(sfxAudioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'boing') {
      const osc = sfxAudioCtx.createOscillator();
      const gain = sfxAudioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.1);
      osc.frequency.linearRampToValueAtTime(250, now + 0.2);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(sfxAudioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'cheer') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, index) => {
        const osc = sfxAudioCtx.createOscillator();
        const gain = sfxAudioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.07);
        gain.gain.setValueAtTime(0.06, now + index * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.07 + 0.3);
        osc.connect(gain);
        gain.connect(sfxAudioCtx.destination);
        osc.start(now + index * 0.07);
        osc.stop(now + index * 0.07 + 0.3);
      });
    } else if (type === 'click') {
      const osc = sfxAudioCtx.createOscillator();
      const gain = sfxAudioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(sfxAudioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    }
  } catch (err) {
    // Gracefully ignore audio synthesis errors if context blocked
  }
}
