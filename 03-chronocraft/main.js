// ==========================================
// CHRONOCRAFT - Swiss Haute Horlogerie Engine
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initWatchMovementCanvas();
  initHorologyAudio();
  initPrecisionStopwatch();
  initEditionTabs();
  init3DCardTilt();
});

// ------------------------------------------
// 1. Live Mechanical Watch Canvas Simulation
// ------------------------------------------
let isExploded = false;

function initWatchMovementCanvas() {
  const canvas = document.getElementById('watchCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = 460;
  canvas.width = size;
  canvas.height = size;
  const center = size / 2;

  let balanceAngle = 0;
  let balanceSpeed = 0.28;
  let gearAngle = 0;

  function drawDial() {
    ctx.clearRect(0, 0, size, size);

    // Outer Bezel Rim
    const gradBezel = ctx.createRadialGradient(center, center, center - 40, center, center, center);
    gradBezel.addColorStop(0, '#151822');
    gradBezel.addColorStop(0.85, '#0a0b0e');
    gradBezel.addColorStop(1, '#dfb17b');
    ctx.fillStyle = gradBezel;
    ctx.beginPath();
    ctx.arc(center, center, center - 8, 0, Math.PI * 2);
    ctx.fill();

    // Minute Ticks & Caliper Track
    ctx.save();
    ctx.translate(center, center);
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      const isHour = i % 5 === 0;
      ctx.lineWidth = isHour ? 3 : 1;
      ctx.strokeStyle = isHour ? '#dfb17b' : 'rgba(223, 177, 123, 0.35)';
      ctx.moveTo(0, -(center - 24));
      ctx.lineTo(0, -(center - (isHour ? 38 : 30)));
      ctx.stroke();
      ctx.rotate((Math.PI * 2) / 60);
    }
    ctx.restore();

    // Tourbillon Cage & Balance Wheel (Mechanical heart)
    ctx.save();
    ctx.translate(center, center + (isExploded ? 60 : 30));
    
    // Balance oscillation
    balanceAngle += balanceSpeed;
    const oscOffset = Math.sin(balanceAngle) * 0.75;
    ctx.rotate(oscOffset);

    // Balance wheel rim (Gold with adjustment screws)
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#dfb17b';
    ctx.beginPath();
    ctx.arc(0, 0, 55, 0, Math.PI * 2);
    ctx.stroke();

    // Balance spokes
    for (let j = 0; j < 3; j++) {
      ctx.save();
      ctx.rotate((j * Math.PI * 2) / 3);
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#c5a059';
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 55);
      ctx.stroke();

      // Gold poising screws
      ctx.fillStyle = '#fce0ad';
      ctx.beginPath();
      ctx.arc(0, 55, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Hairspring spiral
    ctx.beginPath();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = '#79808d';
    for (let a = 0; a < Math.PI * 7; a += 0.1) {
      const r = (a / (Math.PI * 7)) * 32 + (Math.sin(balanceAngle) * 2);
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Center Ruby Jewel
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fce0ad';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();

    // Mechanical Escapement Gear
    ctx.save();
    ctx.translate(center - 70, center - (isExploded ? 70 : 40));
    gearAngle += 0.015;
    ctx.rotate(gearAngle);
    ctx.strokeStyle = '#8c602a';
    ctx.lineWidth = 2;
    for (let g = 0; g < 16; g++) {
      ctx.rotate((Math.PI * 2) / 16);
      ctx.beginPath();
      ctx.moveTo(0, 30);
      ctx.lineTo(4, 42);
      ctx.lineTo(-4, 42);
      ctx.closePath();
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.stroke();
    // Center brass arbor
    ctx.fillStyle = '#dfb17b';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Real-time Hands (Hours, Minutes, Sweeping Seconds)
    const date = new Date();
    const millis = date.getMilliseconds();
    const secs = date.getSeconds() + millis / 1000;
    const mins = date.getMinutes() + secs / 60;
    const hours = (date.getHours() % 12) + mins / 60;

    // Hour Hand (Brushed Rose Gold)
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate((hours * Math.PI * 2) / 12);
    ctx.strokeStyle = '#dfb17b';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.lineTo(0, -90);
    ctx.stroke();
    ctx.restore();

    // Minute Hand (Sleek Sword shape)
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate((mins * Math.PI * 2) / 60);
    ctx.strokeStyle = '#fce0ad';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(0, -140);
    ctx.stroke();
    ctx.restore();

    // Chrono Sweep Second Hand (Titanium blue/gold with counter-balance)
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate((secs * Math.PI * 2) / 60);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, 35);
    ctx.lineTo(0, -165);
    ctx.stroke();
    // Round counter-weight
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(0, 25, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Center Cap
    ctx.fillStyle = '#dfb17b';
    ctx.beginPath();
    ctx.arc(center, center, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#08090c';
    ctx.beginPath();
    ctx.arc(center, center, 3, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(drawDial);
  }
  drawDial();

  // Explode Calibre button interaction
  const explodeBtn = document.getElementById('movementExplodeBtn');
  if (explodeBtn) {
    explodeBtn.addEventListener('click', () => {
      isExploded = !isExploded;
      explodeBtn.innerText = isExploded ? 'ASSEMBLE CALIBRE' : 'EXPLODE CALIBRE';
      explodeBtn.classList.toggle('active', isExploded);
      playWatchTick(true);
    });
  }
}

// ------------------------------------------
// 2. Web Audio Escapement Tick-Tock Synthesizer
// ------------------------------------------
let horologyAudioCtx = null;
let tickIntervalId = null;
let isHorologyAudioOn = false;
let tickTockState = false;

function initHorologyAudio() {
  const soundBtn = document.getElementById('horologyAudioBtn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    if (!horologyAudioCtx) {
      horologyAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (horologyAudioCtx.state === 'suspended') {
      horologyAudioCtx.resume();
    }

    isHorologyAudioOn = !isHorologyAudioOn;
    if (isHorologyAudioOn) {
      soundBtn.classList.add('active');
      soundBtn.querySelector('.sound-text').innerText = 'TICK: ON (4Hz)';
      // 4 Hz = 250ms interval between pallet strikes
      tickIntervalId = setInterval(() => {
        playWatchTick();
      }, 250);
    } else {
      soundBtn.classList.remove('active');
      soundBtn.querySelector('.sound-text').innerText = 'TICK: OFF';
      clearInterval(tickIntervalId);
    }
  });
}

function playWatchTick(isMetallicChime = false) {
  if (!horologyAudioCtx) return;
  const now = horologyAudioCtx.currentTime;

  tickTockState = !tickTockState;
  const freq = isMetallicChime ? 3200 : (tickTockState ? 2400 : 2100);

  const osc = horologyAudioCtx.createOscillator();
  const gain = horologyAudioCtx.createGain();

  osc.type = 'highpass' === 'triangle' ? 'triangle' : 'sine';
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.025);

  gain.gain.setValueAtTime(0.04, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

  osc.connect(gain);
  gain.connect(horologyAudioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.035);
}

// ------------------------------------------
// 3. Functional Swiss Stopwatch Bench
// ------------------------------------------
function initPrecisionStopwatch() {
  const digits = document.getElementById('stopwatchDigits');
  const startBtn = document.getElementById('timerStartBtn');
  const stopBtn = document.getElementById('timerStopBtn');
  const lapBtn = document.getElementById('timerLapBtn');
  const resetBtn = document.getElementById('timerResetBtn');
  const lapsList = document.getElementById('lapsList');

  if (!digits || !startBtn) return;

  let startTime = 0;
  let elapsedTime = 0;
  let timerRaf = null;
  let isRunning = false;
  let lapCount = 0;

  function formatTime(ms) {
    const totalSecs = Math.floor(ms / 1000);
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    const hundredths = Math.floor((ms % 1000) / 10);

    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(mins)}:${pad(secs)}.<span class="millis">${pad(hundredths)}</span>`;
  }

  function update() {
    const current = performance.now();
    const diff = current - startTime + elapsedTime;
    digits.innerHTML = formatTime(diff);
    timerRaf = requestAnimationFrame(update);
  }

  startBtn.addEventListener('click', () => {
    if (!isRunning) {
      isRunning = true;
      startTime = performance.now();
      timerRaf = requestAnimationFrame(update);

      startBtn.disabled = true;
      stopBtn.disabled = false;
      lapBtn.disabled = false;
      playWatchTick(true);
    }
  });

  stopBtn.addEventListener('click', () => {
    if (isRunning) {
      isRunning = false;
      cancelAnimationFrame(timerRaf);
      elapsedTime += performance.now() - startTime;

      startBtn.disabled = false;
      stopBtn.disabled = true;
      lapBtn.disabled = true;
      playWatchTick(true);
    }
  });

  lapBtn.addEventListener('click', () => {
    if (isRunning) {
      const current = performance.now();
      const currentElapsed = current - startTime + elapsedTime;
      lapCount++;

      const empty = lapsList.querySelector('.lap-empty');
      if (empty) empty.remove();

      const li = document.createElement('li');
      li.innerHTML = `<span>SPLIT ${String(lapCount).padStart(2, '0')}</span> <strong>${formatTime(currentElapsed).replace('<span class="millis">', '').replace('</span>', '')}</strong>`;
      lapsList.prepend(li);
      playWatchTick();
    }
  });

  resetBtn.addEventListener('click', () => {
    isRunning = false;
    cancelAnimationFrame(timerRaf);
    elapsedTime = 0;
    lapCount = 0;
    digits.innerHTML = '00:00:00.<span class="millis">00</span>';
    startBtn.disabled = false;
    stopBtn.disabled = true;
    lapBtn.disabled = true;
    lapsList.innerHTML = '<li class="lap-empty">No splits recorded yet. Press "START" and "SPLIT".</li>';
    playWatchTick(true);
  });
}

// ------------------------------------------
// 4. Edition Switcher Tabs
// ------------------------------------------
function initEditionTabs() {
  const tabs = document.querySelectorAll('.edition-tab');
  const cards = document.querySelectorAll('.timepiece-card');

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      cards.forEach((card, cIndex) => {
        if (cIndex === index) {
          card.style.borderColor = '#dfb17b';
          card.style.boxShadow = '0 0 30px rgba(223, 177, 123, 0.3)';
        } else {
          card.style.borderColor = '';
          card.style.boxShadow = '';
        }
      });
      playWatchTick();
    });
  });
}

// ------------------------------------------
// 5. 3D Perspective Card Tilt
// ------------------------------------------
function init3DCardTilt() {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const tiltX = -(y / (rect.height / 2)) * 8;
      const tiltY = (x / (rect.width / 2)) * 8;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
