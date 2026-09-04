// ==========================================
// ASTRONEX - Deep Space Astrophysics Engine
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initSpaceCanvas();
  initOrbitalSimulator();
  initPulsarAudio();
  initTelemetryTicker();
});

// ------------------------------------------
// 1. Interactive 3D Rotatable Starfield Canvas
// ------------------------------------------
function initSpaceCanvas() {
  const canvas = document.getElementById('spaceCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  const starCount = 350;

  // 3D rotation angles & zoom
  let rotX = 0;
  let rotY = 0;
  let targetRotX = 0;
  let targetRotY = 0;
  let zoom = 1.0;
  let targetZoom = 1.0;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let hyperdriveSpeed = 1;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Star {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = (Math.random() - 0.5) * 2000;
      this.y = (Math.random() - 0.5) * 2000;
      this.z = (Math.random() - 0.5) * 2000;
      this.size = Math.random() * 2 + 0.8;
      this.color = Math.random() > 0.6 ? '#38bdf8' : (Math.random() > 0.4 ? '#818cf8' : '#fbbf24');
    }
  }

  for (let i = 0; i < starCount; i++) {
    stars.push(new Star());
  }

  // Mouse Interaction for 3D Orbiting
  window.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      targetRotY += dx * 0.003;
      targetRotX += dy * 0.003;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    }
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  // Zoom with scroll wheel
  window.addEventListener('wheel', (e) => {
    targetZoom += e.deltaY * -0.001;
    targetZoom = Math.max(0.5, Math.min(2.5, targetZoom));
  }, { passive: true });

  function render() {
    rotX += (targetRotX - rotX) * 0.05;
    rotY += (targetRotY - rotY) * 0.05;
    zoom += (targetZoom - zoom) * 0.05;

    ctx.fillStyle = 'rgba(3, 7, 18, 0.35)';
    ctx.fillRect(0, 0, width, height);

    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    stars.forEach(star => {
      // Rotate around Y
      let x1 = star.x * cosY - star.z * sinY;
      let z1 = star.z * cosY + star.x * sinY;

      // Rotate around X
      let y1 = star.y * cosX - z1 * sinX;
      let z2 = z1 * cosX + star.y * sinX;

      // Hyperdrive move
      star.z -= 0.5 * hyperdriveSpeed;
      if (star.z < -1000) star.z += 2000;

      // Projection
      const fov = 450 * zoom;
      const scale = fov / (fov + z2 + 800);

      if (scale > 0) {
        const px = x1 * scale + width / 2;
        const py = y1 * scale + height / 2;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const alpha = Math.min(1, Math.max(0.1, scale * 1.5));
          ctx.fillStyle = star.color;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(px, py, star.size * scale * (hyperdriveSpeed > 1 ? 1.5 : 1), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    requestAnimationFrame(render);
  }
  render();

  // Hyperdrive Warp Button
  const warpBtn = document.getElementById('galaxyWarpBtn');
  if (warpBtn) {
    warpBtn.addEventListener('click', () => {
      hyperdriveSpeed = 20;
      playPulsarTone(800, 1.2);
      setTimeout(() => {
        hyperdriveSpeed = 1;
      }, 1600);
    });
  }
}

// ------------------------------------------
// 2. Interactive Kepler Orbital Simulator
// ------------------------------------------
function initOrbitalSimulator() {
  const canvas = document.getElementById('orbitSimCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const cx = width / 2;
  const cy = height / 2;

  const speedSlider = document.getElementById('speedSlider');
  const gravSlider = document.getElementById('gravSlider');
  const speedVal = document.getElementById('speedVal');
  const gravVal = document.getElementById('gravVal');

  let speedMult = 1.0;
  let gravityMult = 1.0;

  speedSlider?.addEventListener('input', (e) => {
    speedMult = parseFloat(e.target.value);
    speedVal.innerText = speedMult.toFixed(1) + 'x';
    playPulsarTone(350 + speedMult * 100, 0.05);
  });

  gravSlider?.addEventListener('input', (e) => {
    gravityMult = parseFloat(e.target.value);
    gravVal.innerText = gravityMult.toFixed(1) + ' G';
    playPulsarTone(200 + gravityMult * 100, 0.05);
  });

  const planets = [
    {
      name: 'TRAPPIST-1e',
      type: 'TERRESTRIAL / HABITABLE ZONE',
      desc: 'High probability of liquid oceans. Atmospheric spectrum reveals strong nitrogen-carbon dioxide equilibrium with protective magnetosphere.',
      radius: 65,
      size: 7,
      color: '#38bdf8',
      angle: 0,
      baseSpeed: 0.025,
      comp: { n2: '78%', h2o: '18%', co2: '4%' }
    },
    {
      name: 'Kepler-452b',
      type: 'SUPER-EARTH / G-STAR ORBIT',
      desc: 'Super-Earth with 1.6x Earth radius. Thicker atmosphere with intense volcanic activity, cloud belts, and high surface pressure.',
      radius: 125,
      size: 11,
      color: '#818cf8',
      angle: 2,
      baseSpeed: 0.015,
      comp: { n2: '65%', h2o: '12%', co2: '23%' }
    },
    {
      name: 'Proxima Centauri b',
      type: 'TIDALLY LOCKED ROCKY WORLD',
      desc: 'Orbits a tempestuous flare star. Dayside features scorched regolith; terminator zone harbors liquid subsurface aquifers.',
      radius: 185,
      size: 9,
      color: '#fb7185',
      angle: 4.2,
      baseSpeed: 0.009,
      comp: { n2: '45%', h2o: '5%', co2: '50%' }
    }
  ];

  function updatePlanetInfo(planet) {
    document.getElementById('focusPlanetName').innerText = planet.name;
    document.getElementById('focusPlanetType').innerText = planet.type;
    document.getElementById('focusPlanetDesc').innerText = planet.desc;
  }

  // Click on planet detection
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    planets.forEach(p => {
      const px = cx + Math.cos(p.angle) * p.radius;
      const py = cy + Math.sin(p.angle) * p.radius;
      const dist = Math.hypot(mx - px, my - py);
      if (dist < p.size + 12) {
        updatePlanetInfo(p);
        playPulsarTone(600, 0.15);
      }
    });
  });

  let starPulse = 0;

  function renderSim() {
    ctx.clearRect(0, 0, width, height);

    // Host Star (Kepler Sun)
    starPulse += 0.03;
    const sunGlow = 22 + Math.sin(starPulse) * 2;
    const gradSun = ctx.createRadialGradient(cx, cy, 5, cx, cy, sunGlow * 1.8);
    gradSun.addColorStop(0, '#ffffff');
    gradSun.addColorStop(0.3, '#fbbf24');
    gradSun.addColorStop(0.7, '#f97316');
    gradSun.addColorStop(1, 'transparent');

    ctx.fillStyle = gradSun;
    ctx.beginPath();
    ctx.arc(cx, cy, sunGlow * 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Orbital Rings & Planets
    planets.forEach(p => {
      // Ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, p.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Movement calculation with gravity multiplier
      p.angle += p.baseSpeed * speedMult * Math.sqrt(gravityMult);

      const px = cx + Math.cos(p.angle) * p.radius;
      const py = cy + Math.sin(p.angle) * p.radius;

      // Glow halo
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(renderSim);
  }
  renderSim();
}

// ------------------------------------------
// 3. Web Audio Deep Space Pulsar Drone
// ------------------------------------------
let spaceAudioCtx = null;
let isSpaceAudioActive = false;
let pulsarInterval = null;
let subDroneOsc = null;

function initPulsarAudio() {
  const btn = document.getElementById('pulsarAudioBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!spaceAudioCtx) {
      spaceAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (spaceAudioCtx.state === 'suspended') {
      spaceAudioCtx.resume();
    }

    isSpaceAudioActive = !isSpaceAudioActive;
    if (isSpaceAudioActive) {
      btn.classList.add('active');
      btn.querySelector('.btn-label').innerText = 'PULSAR: ON';
      startSpaceDrone();
    } else {
      btn.classList.remove('active');
      btn.querySelector('.btn-label').innerText = 'PULSAR: OFF';
      stopSpaceDrone();
    }
  });
}

function startSpaceDrone() {
  if (!spaceAudioCtx) return;
  const now = spaceAudioCtx.currentTime;

  subDroneOsc = spaceAudioCtx.createOscillator();
  const subGain = spaceAudioCtx.createGain();

  subDroneOsc.type = 'sine';
  subDroneOsc.frequency.setValueAtTime(65.4, now); // Low C

  subGain.gain.setValueAtTime(0.01, now);
  subGain.gain.exponentialRampToValueAtTime(0.06, now + 2);

  subDroneOsc.connect(subGain);
  subGain.connect(spaceAudioCtx.destination);
  subDroneOsc.start(now);

  // Periodic pulsar click
  pulsarInterval = setInterval(() => {
    playPulsarTone(1450, 0.04);
  }, 1200);
}

function stopSpaceDrone() {
  if (subDroneOsc) {
    try {
      subDroneOsc.stop();
      subDroneOsc.disconnect();
    } catch (e) {}
  }
  if (pulsarInterval) clearInterval(pulsarInterval);
}

function playPulsarTone(freq, duration) {
  if (!spaceAudioCtx) return;
  const now = spaceAudioCtx.currentTime;

  const osc = spaceAudioCtx.createOscillator();
  const gain = spaceAudioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.03, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(spaceAudioCtx.destination);

  osc.start(now);
  osc.stop(now + duration);
}

// ------------------------------------------
// 4. Telemetry Real-time Ticker
// ------------------------------------------
function initTelemetryTicker() {
  const redshiftVal = document.getElementById('redshiftVal');
  const planetCount = document.getElementById('planetCount');

  setInterval(() => {
    if (redshiftVal) {
      redshiftVal.innerText = (1.480 + (Math.random() - 0.5) * 0.006).toFixed(3);
    }
  }, 1800);
}
