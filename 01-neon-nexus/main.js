// ==========================================
// NEO-NEXUS Interactive Cyber Core Script
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initTextScramble();
  initTelemetryTicker();
  initTerminal();
  initAudioSystem();
  initMatrixMode();
});

// ------------------------------------------
// 1. 3D Particle Warp Canvas
// ------------------------------------------
function initParticleCanvas() {
  const canvas = document.getElementById('cyberCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const numParticles = 140;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let speedMult = 1;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX - width / 2) * 0.05;
    mouse.targetY = (e.clientY - height / 2) * 0.05;
  });

  class Particle {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = (Math.random() - 0.5) * width * 1.5;
      this.y = (Math.random() - 0.5) * height * 1.5;
      this.z = initial ? Math.random() * 1000 : 1000;
      this.pz = this.z;
      this.color = Math.random() > 0.4 ? '#00f3ff' : (Math.random() > 0.5 ? '#ff0055' : '#ffe600');
    }
    update() {
      this.pz = this.z;
      this.z -= 4 * speedMult;
      if (this.z <= 1) {
        this.reset();
      }
    }
    draw() {
      const k = 300 / this.z;
      const px = this.x * k + width / 2 + mouse.x;
      const py = this.y * k + height / 2 + mouse.y;

      const pk = 300 / this.pz;
      const prevX = this.x * pk + width / 2 + mouse.x;
      const prevY = this.y * pk + height / 2 + mouse.y;

      if (px >= 0 && px <= width && py >= 0 && py <= height) {
        const size = Math.max(1, (1 - this.z / 1000) * 3);
        const alpha = Math.min(1, (1 - this.z / 1000) * 1.2);

        ctx.strokeStyle = this.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(px, py);
        ctx.stroke();
      }
    }
  }

  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }

  function animate() {
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    ctx.fillStyle = 'rgba(7, 8, 12, 0.35)';
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }
  animate();

  // Warp Button Trigger
  const warpBtn = document.getElementById('warpBtn');
  if (warpBtn) {
    warpBtn.addEventListener('click', () => {
      speedMult = 8;
      playSound('warp');
      setTimeout(() => {
        speedMult = 1;
      }, 1400);
    });
  }

  // Scan Network Button Trigger
  const scanBtn = document.getElementById('scanNetBtn');
  if (scanBtn) {
    scanBtn.addEventListener('click', () => {
      playSound('beep');
      triggerDiagnosticScan();
    });
  }
}

// ------------------------------------------
// 2. Text Scrambler / Decrypt Animation
// ------------------------------------------
function initTextScramble() {
  const chars = '!<>-_\\/[]{}—=+*^?#________01010101';
  const elements = document.querySelectorAll('[data-scramble]');

  elements.forEach(el => {
    const originalText = el.getAttribute('data-scramble') || el.innerText;
    el.addEventListener('mouseenter', () => scramble(el, originalText));
  });

  function scramble(el, text) {
    let iteration = 0;
    const interval = setInterval(() => {
      el.innerText = text.split('').map((letter, index) => {
        if (index < iteration) return text[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, 25);
  }
}

// ------------------------------------------
// 3. Web Audio Ambient Synthesizer & SFX
// ------------------------------------------
let audioCtx = null;
let isAudioActive = false;
let droneOsc1 = null;
let droneOsc2 = null;
let droneGain = null;

function initAudioSystem() {
  const soundBtn = document.getElementById('soundToggle');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isAudioActive = !isAudioActive;
    if (isAudioActive) {
      startAmbientDrone();
      soundBtn.querySelector('.btn-label').innerText = 'AUDIO: ON';
      soundBtn.classList.add('accent');
    } else {
      stopAmbientDrone();
      soundBtn.querySelector('.btn-label').innerText = 'AUDIO: OFF';
      soundBtn.classList.remove('accent');
    }
  });

  // Attach button click sounds
  document.querySelectorAll('button, .cyber-link, .card-btn').forEach(item => {
    item.addEventListener('click', () => {
      playSound('click');
    });
  });
}

function startAmbientDrone() {
  if (!audioCtx) return;
  droneGain = audioCtx.createGain();
  droneGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
  droneGain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 3);

  droneOsc1 = audioCtx.createOscillator();
  droneOsc1.type = 'sawtooth';
  droneOsc1.frequency.setValueAtTime(55, audioCtx.currentTime); // Low A

  droneOsc2 = audioCtx.createOscillator();
  droneOsc2.type = 'sine';
  droneOsc2.frequency.setValueAtTime(110.5, audioCtx.currentTime);

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(240, audioCtx.currentTime);

  droneOsc1.connect(filter);
  droneOsc2.connect(filter);
  filter.connect(droneGain);
  droneGain.connect(audioCtx.destination);

  droneOsc1.start();
  droneOsc2.start();
}

function stopAmbientDrone() {
  if (droneGain && audioCtx) {
    droneGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
    setTimeout(() => {
      try {
        droneOsc1?.stop();
        droneOsc2?.stop();
      } catch (e) {}
    }, 800);
  }
}

function playSound(type) {
  if (!isAudioActive || !audioCtx) return;
  const now = audioCtx.currentTime;

  if (type === 'click') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === 'beep') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1320, now + 0.08);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  } else if (type === 'warp') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.6);
    osc.frequency.exponentialRampToValueAtTime(80, now + 1.2);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 1.3);
  }
}

// ------------------------------------------
// 4. Telemetry Real-time Updates
// ------------------------------------------
function initTelemetryTicker() {
  const valLatency = document.getElementById('valLatency');
  const valLoad = document.getElementById('valLoad');
  const valNodes = document.getElementById('valNodes');

  setInterval(() => {
    if (valLatency) {
      valLatency.innerText = (0.12 + Math.random() * 0.06).toFixed(2) + ' ms';
    }
    if (valLoad) {
      valLoad.innerText = (93 + Math.random() * 5).toFixed(1) + '%';
    }
    if (valNodes) {
      valNodes.innerText = (14200 + Math.floor(Math.random() * 40)).toLocaleString();
    }
  }, 2200);
}

function triggerDiagnosticScan() {
  const cards = document.querySelectorAll('.cyber-card');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.style.borderColor = '#00f3ff';
      card.style.boxShadow = '0 0 35px #00f3ff';
      setTimeout(() => {
        card.style.borderColor = '';
        card.style.boxShadow = '';
      }, 500);
    }, index * 180);
  });
}

// ------------------------------------------
// 5. Interactive Cyber Terminal CLI
// ------------------------------------------
function initTerminal() {
  const modal = document.getElementById('terminalModal');
  const toggleBtn = document.getElementById('terminalToggle');
  const closeBtn = document.getElementById('termClose');
  const input = document.getElementById('termInput');
  const output = document.getElementById('termOutput');

  if (!modal || !toggleBtn || !input) return;

  toggleBtn.addEventListener('click', () => {
    modal.classList.add('active');
    input.focus();
  });

  closeBtn?.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = input.value.trim().toLowerCase();
      input.value = '';
      executeCommand(command);
    }
  });

  function printLine(text, className = '') {
    const line = document.createElement('div');
    line.className = 'term-line ' + className;
    line.innerHTML = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function executeCommand(cmd) {
    printLine(`<span class="prompt">guest@nexus:~$</span> ${cmd}`);

    switch (cmd) {
      case 'help':
        printLine('Available protocols:');
        printLine(' - <span class="cyan-text">status</span> : System diagnostics');
        printLine(' - <span class="cyan-text">scan</span>   : Deep port diagnostic scan');
        printLine(' - <span class="cyan-text">matrix</span> : Enter high-bandwidth raw data stream');
        printLine(' - <span class="cyan-text">audio</span>  : Toggle atmospheric soundscape');
        printLine(' - <span class="cyan-text">clear</span>  : Flush terminal buffer');
        break;
      case 'status':
        printLine('SYS_STATUS: OPTIMAL | KERNEL: 5.19.8-rt-cyber | FIREWALL: ARMORED');
        printLine('ACTIVE DAEMONS: 1,024 | SYNAPTIC CHATTER: 0.12ms');
        break;
      case 'scan':
        printLine('Initiating network probe on sub-octets...');
        triggerDiagnosticScan();
        setTimeout(() => printLine('[200 OK] 4 nodes verified. Zero security vulnerabilities found.', 'welcome'), 800);
        break;
      case 'matrix':
        printLine('LAUNCHING MATRIX STREAM... Click canvas or press ESC to abort.');
        modal.classList.remove('active');
        toggleMatrixMode(true);
        break;
      case 'audio':
        document.getElementById('soundToggle')?.click();
        printLine('Audio toggled.');
        break;
      case 'clear':
        output.innerHTML = '';
        break;
      case '':
        break;
      default:
        printLine(`Command not recognized: "${cmd}". Type <span class="cyan-text">'help'</span> for instructions.`);
    }
  }
}

// ------------------------------------------
// 6. Matrix Code Rain Canvas
// ------------------------------------------
let matrixAnimationId = null;

function initMatrixMode() {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !canvas.classList.contains('hidden')) {
      toggleMatrixMode(false);
    }
  });

  canvas.addEventListener('click', () => {
    toggleMatrixMode(false);
  });
}

function toggleMatrixMode(show) {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;

  if (show) {
    canvas.classList.remove('hidden');
    startMatrixRain(canvas);
  } else {
    canvas.classList.add('hidden');
    if (matrixAnimationId) {
      cancelAnimationFrame(matrixAnimationId);
      matrixAnimationId = null;
    }
  }
}

function startMatrixRain(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const characters = 'アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ01010101';
  const fontSize = 16;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(4, 7, 10, 0.12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff66';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = characters.charAt(Math.floor(Math.random() * characters.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    matrixAnimationId = requestAnimationFrame(draw);
  }
  draw();
}
