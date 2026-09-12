// ==========================================
// NEO-NEXUS Interactive Cyber Core Script
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initLanguage();
  initTextScramble();
  initTelemetryTicker();
  initTerminal();
  initAudioSystem();
  initMatrixMode();
  initCardScrollReveal();
  initCardTilt();
});

// ------------------------------------------
// 1. 3D Particle Warp Canvas
// ------------------------------------------
let warpSpeedMultiplier = 1;

function initParticleCanvas() {
  const canvas = document.getElementById('cyberCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const numParticles = 150;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

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
      this.z -= 4 * warpSpeedMultiplier;
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
      warpSpeedMultiplier = 6;
      playSound('warp');
      setTimeout(() => {
        warpSpeedMultiplier = 1;
      }, 1500);
    });
  }

  const scanNetBtn = document.getElementById('scanNetBtn');
  if (scanNetBtn) {
    scanNetBtn.addEventListener('click', () => {
      playSound('beep');
      triggerDiagnosticScan();
    });
  }
}

// ------------------------------------------
// 2. Language Switcher (RU / EN)
// ------------------------------------------
const i18n = {
  ru: {
    docTitle: "NEO-NEXUS // Кибернетические системы нового поколения",
    sysVersion: "SYS_V2.08.4 // НЕЙРО_ЛИНК",
    navCore: "СИСТ_ЯДРО",
    navAug: "АУГМЕНТЫ",
    navTelem: "ТЕЛЕМЕТРИЯ",
    navGrid: "НЕЙРОСЕТЬ",
    audioOff: "ЗВУК: ВЫКЛ",
    audioOn: "ЗВУК: ВКЛ",
    termBtn: "CLI_ТЕРМИНАЛ",
    hub: "ХАБ",
    heroBadgeText: "КВАНТОВЫЙ НЕЙРОИНТЕРФЕЙС В СЕТИ",
    heroBadgeTag: "УР_БЕЗ_9",
    heroTitle: "ПРЕОДОЛЕЙ <br><span class='gradient-text glitch-element' data-text='СИНТЕТИЧЕСКУЮ РЕАЛЬНОСТЬ'>СИНТЕТИЧЕСКУЮ РЕАЛЬНОСТЬ</span>",
    heroSubtitle: "Военные нейроимпланты, субмиллисекундные синаптические мосты и архитектуры био-цифровых аугментаций для экстремальной жизни Нео-Токио.",
    warpBtn: "ВАРП-СКОРОСТЬ",
    scanNetBtn: "ДИАГНОСТИКА СЕТИ",
    lblLatency: "ЗАДЕРЖКА СИНАПСА",
    lblLoad: "НАГРУЗКА СЕТИ",
    lblEnc: "ПРОТОКОЛ ШИФРОВАНИЯ",
    lblNodes: "АКТИВНЫЕ УЗЛЫ",
    secCode: "// 01_КАТАЛОГ_АУГМЕНТАЦИЙ",
    secTitle: "СПЕЦИФИКАЦИИ НЕЙРО-ОБОРУДОВАНИЯ",
    secDesc: "Кибернетические улучшения IV ранга для тактического боя, когнитивного разгона и цифрового проникновения.",
    c1Badge: "MK-VII КОРТЕКС",
    c1Desc: "Ускоряет нейронную обработку в десять раз. Открывает сенсорное предвидение с субатомными полями замедления времени.",
    c1S1Lbl: "ТАКТОВАЯ ЧАСТОТА",
    c1S2Lbl: "РАССЕИВАНИЕ ТЕПЛА",
    c2Badge: "СПЕКТРАЛЬНАЯ ОПТИКА",
    c2Desc: "Мультиспектральная визуальная телеметрия с инфракрасным диапазоном, расшифровкой электромагнитных волн и баллистическим HUD.",
    c2S1Lbl: "СПЕКТРАЛЬНОЕ РАЗРЕШЕНИЕ",
    c2S2Lbl: "ОПТИЧЕСКИЙ ЗУМ",
    c3Badge: "АКТИВНЫЙ СТЕЛС",
    c3Desc: "Преломляет волны фотонов вокруг корпуса. Стирает электронные тепловые следы во всех диапазонах наблюдения.",
    c3S1Lbl: "ОПТИЧЕСКИЙ КАМУФЛЯЖ",
    c3S2Lbl: "РАДИОЛОКАЦИОННАЯ ЭПР",
    c4Badge: "КИБЕР-ВОЙНА",
    c4Desc: "Автономная платформа запуска демонов, способная за секунды нейтрализовать военные файрволы и узлы подсетей.",
    c4S1Lbl: "ПРОПУСКНАЯ СПОСОБНОСТЬ",
    c4S2Lbl: "ПОТОКИ ДЕМОНОВ",
    deployBtn: "АКТИВИРОВАТЬ ПРОТОКОЛ",
    termStatus: "СТАТУС: ЗАЩИЩЕНО",
    termWelcome1: "   NEO-NEXUS НЕЙРО-ТЕРМИНАЛ v2.08 [ЯДРО СБОРКА 77]   ",
    termWelcome2: "Введите <span class='cyan-text'>'помощь'</span> или <span class='cyan-text'>'help'</span> для списка команд.",
    termWelcome3: "Введите <span class='cyan-text'>'matrix'</span> для взлома цифрового потока.",
    termPlaceholder: "введите команду...",
    ftDesc: "Передовые кибернетические архитектуры и тактические нейроаугментации.",
    ftH1: "КАНАЛЫ_СВЯЗИ",
    ftH2: "ДИАГНОСТИКА_СИСТЕМЫ",
    ftPill1: "РАЗГОН: АКТИВЕН",
    ftPill2: "ФАЙРВОЛ: ЦЕЛ",
    ftCopy: "© 2084 КОРПОРАЦИЯ NEO-NEXUS. ВСЕ ПРАВА ЗАЩИЩЕНЫ. ЗА ГРАНЯМИ ЭВОЛЮЦИИ ЧЕЛОВЕКА."
  },
  en: {
    docTitle: "NEO-NEXUS // Next-Gen Cybernetic Systems",
    sysVersion: "SYS_V2.08.4 // NEURAL_LINK",
    navCore: "SYS_CORE",
    navAug: "AUGMENTS",
    navTelem: "TELEMETRY",
    navGrid: "NEURAL_GRID",
    audioOff: "AUDIO: OFF",
    audioOn: "AUDIO: ON",
    termBtn: "CLI_TERMINAL",
    hub: "HUB",
    heroBadgeText: "QUANTUM NEURAL INTERFACE ONLINE",
    heroBadgeTag: "SEC_LVL_9",
    heroTitle: "TRANSCEND <br><span class='gradient-text glitch-element' data-text='SYNTHETIC REALITY'>SYNTHETIC REALITY</span>",
    heroSubtitle: "Military-grade neural implants, sub-millisecond synaptic bridges, and bio-digital augmentation architectures engineered for Neo-Tokyo's high-octane edge.",
    warpBtn: "INITIALIZE WARP SPEED",
    scanNetBtn: "DIAGNOSTIC SCAN",
    lblLatency: "SYNAPSE LATENCY",
    lblLoad: "GRID LOAD",
    lblEnc: "ENCRYPTION PROTOCOL",
    lblNodes: "ACTIVE NODES",
    secCode: "// 01_AUGMENTATION_CATALOG",
    secTitle: "NEURAL HARDWARE SPECIFICATIONS",
    secDesc: "Tier-IV cybernetic enhancements calibrated for tactical combat, cognitive overclocking, and digital infiltration.",
    c1Badge: "MK-VII CORTEX",
    c1Desc: "Accelerates neural processing tenfold. Unlocks sensory pre-cognition with sub-atomic time dilation fields.",
    c1S1Lbl: "CLOCK FREQUENCY",
    c1S2Lbl: "HEAT DISSIPATION",
    c2Badge: "SPECTRAL_OPTICS",
    c2Desc: "Multi-spectrum visual telemetry with infrared, electromagnetic wave deciphering, and ballistic trajectory HUD.",
    c2S1Lbl: "SPECTRAL RESOLUTION",
    c2S2Lbl: "ZOOM MULTIPLIER",
    c3Badge: "ACTIVE_STEALTH",
    c3Desc: "Bends photon wavelengths around host chassis. Erases electronic heat signatures across all surveillance bands.",
    c3S1Lbl: "OPTICAL CAMOUFLAGE",
    c3S2Lbl: "RADAR CROSS-SECTION",
    c4Badge: "CYBER_WARFARE",
    c4Desc: "Autonomous daemon deployment platform capable of neutralizing military firewalls and subnet nodes in seconds.",
    c4S1Lbl: "INTRUSION BANDWIDTH",
    c4S2Lbl: "DAEMON THREADS",
    deployBtn: "DEPLOY PROTOCOL",
    termStatus: "STATUS: SECURE",
    termWelcome1: "   NEO-NEXUS NEURAL TERMINAL v2.08 [KERNEL BUILD 77]   ",
    termWelcome2: "Type <span class='cyan-text'>'help'</span> to see available cyber commands.",
    termWelcome3: "Type <span class='cyan-text'>'matrix'</span> for stream breach.",
    termPlaceholder: "enter command...",
    ftDesc: "Advanced Cybernetic Architectures & Tactical Neural Augmentation.",
    ftH1: "COMMUNICATION_CHANNELS",
    ftH2: "SYSTEM_DIAGNOSTICS",
    ftPill1: "OVERCLOCK: ACTIVE",
    ftPill2: "FIREWALL: UNBREACHED",
    ftCopy: "© 2084 NEO-NEXUS CORP. ALL RIGHTS RESERVED. BEYOND HUMAN EVOLUTION."
  }
};

let currentLang = localStorage.getItem('site_lang') || 'ru';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('site_lang', lang);
  document.documentElement.lang = lang;

  const d = i18n[lang] || i18n.ru;
  document.title = d.docTitle;

  const sysVer = document.getElementById('sysVersion');
  if (sysVer) sysVer.textContent = d.sysVersion;

  const nCore = document.getElementById('navCore');
  if (nCore) { nCore.textContent = d.navCore; nCore.dataset.scramble = d.navCore; }
  const nAug = document.getElementById('navAug');
  if (nAug) { nAug.textContent = d.navAug; nAug.dataset.scramble = d.navAug; }
  const nTelem = document.getElementById('navTelem');
  if (nTelem) { nTelem.textContent = d.navTelem; nTelem.dataset.scramble = d.navTelem; }
  const nGrid = document.getElementById('navGrid');
  if (nGrid) { nGrid.textContent = d.navGrid; nGrid.dataset.scramble = d.navGrid; }

  const sndLbl = document.getElementById('soundLabel');
  if (sndLbl) sndLbl.textContent = isAudioActive ? d.audioOn : d.audioOff;

  const termLbl = document.getElementById('termBtnLabel');
  if (termLbl) termLbl.textContent = d.termBtn;

  const hubLbl = document.getElementById('hubLabel');
  if (hubLbl) hubLbl.textContent = d.hub;

  const hBadge = document.getElementById('heroBadgeText');
  if (hBadge) hBadge.textContent = d.heroBadgeText;
  const hTag = document.getElementById('heroBadgeTag');
  if (hTag) hTag.textContent = d.heroBadgeTag;

  const hTitle = document.getElementById('heroTitle');
  if (hTitle) hTitle.innerHTML = d.heroTitle;

  const hSub = document.getElementById('heroSubtitle');
  if (hSub) hSub.textContent = d.heroSubtitle;

  const wBtn = document.getElementById('warpBtnText');
  if (wBtn) { wBtn.textContent = d.warpBtn; wBtn.dataset.scramble = d.warpBtn; }
  const sBtn = document.getElementById('scanNetBtnText');
  if (sBtn) { sBtn.textContent = d.scanNetBtn; sBtn.dataset.scramble = d.scanNetBtn; }

  const lLat = document.getElementById('lblLatency');
  if (lLat) lLat.textContent = d.lblLatency;
  const lLoad = document.getElementById('lblLoad');
  if (lLoad) lLoad.textContent = d.lblLoad;
  const lEnc = document.getElementById('lblEnc');
  if (lEnc) lEnc.textContent = d.lblEnc;
  const lNodes = document.getElementById('lblNodes');
  if (lNodes) lNodes.textContent = d.lblNodes;

  const sCode = document.getElementById('secCode');
  if (sCode) sCode.textContent = d.secCode;
  const sTitle = document.getElementById('secTitle');
  if (sTitle) sTitle.textContent = d.secTitle;
  const sDesc = document.getElementById('secDesc');
  if (sDesc) sDesc.textContent = d.secDesc;

  const c1B = document.getElementById('c1Badge');
  if (c1B) c1B.textContent = d.c1Badge;
  const c1D = document.getElementById('c1Desc');
  if (c1D) c1D.textContent = d.c1Desc;
  const c1S1 = document.getElementById('c1S1Lbl');
  if (c1S1) c1S1.textContent = d.c1S1Lbl;
  const c1S2 = document.getElementById('c1S2Lbl');
  if (c1S2) c1S2.textContent = d.c1S2Lbl;

  const c2B = document.getElementById('c2Badge');
  if (c2B) c2B.textContent = d.c2Badge;
  const c2D = document.getElementById('c2Desc');
  if (c2D) c2D.textContent = d.c2Desc;
  const c2S1 = document.getElementById('c2S1Lbl');
  if (c2S1) c2S1.textContent = d.c2S1Lbl;
  const c2S2 = document.getElementById('c2S2Lbl');
  if (c2S2) c2S2.textContent = d.c2S2Lbl;

  const c3B = document.getElementById('c3Badge');
  if (c3B) c3B.textContent = d.c3Badge;
  const c3D = document.getElementById('c3Desc');
  if (c3D) c3D.textContent = d.c3Desc;
  const c3S1 = document.getElementById('c3S1Lbl');
  if (c3S1) c3S1.textContent = d.c3S1Lbl;
  const c3S2 = document.getElementById('c3S2Lbl');
  if (c3S2) c3S2.textContent = d.c3S2Lbl;

  const c4B = document.getElementById('c4Badge');
  if (c4B) c4B.textContent = d.c4Badge;
  const c4D = document.getElementById('c4Desc');
  if (c4D) c4D.textContent = d.c4Desc;
  const c4S1 = document.getElementById('c4S1Lbl');
  if (c4S1) c4S1.textContent = d.c4S1Lbl;
  const c4S2 = document.getElementById('c4S2Lbl');
  if (c4S2) c4S2.textContent = d.c4S2Lbl;

  document.querySelectorAll('.card-btn').forEach(btn => {
    btn.textContent = d.deployBtn;
  });

  const tStatus = document.getElementById('termStatus');
  if (tStatus) tStatus.textContent = d.termStatus;
  const tW1 = document.getElementById('termWelcome1');
  if (tW1) tW1.textContent = d.termWelcome1;
  const tW2 = document.getElementById('termWelcome2');
  if (tW2) tW2.innerHTML = d.termWelcome2;
  const tW3 = document.getElementById('termWelcome3');
  if (tW3) tW3.innerHTML = d.termWelcome3;
  const tInp = document.getElementById('termInput');
  if (tInp) tInp.placeholder = d.termPlaceholder;

  const ftD = document.getElementById('ftDesc');
  if (ftD) ftD.textContent = d.ftDesc;
  const ft1 = document.getElementById('ftH1');
  if (ft1) ft1.textContent = d.ftH1;
  const ft2 = document.getElementById('ftH2');
  if (ft2) ft2.textContent = d.ftH2;
  const ftP1 = document.getElementById('ftPill1');
  if (ftP1) ftP1.textContent = d.ftPill1;
  const ftP2 = document.getElementById('ftPill2');
  if (ftP2) ftP2.textContent = d.ftPill2;
  const ftC = document.getElementById('ftCopy');
  if (ftC) ftC.textContent = d.ftCopy;

  document.querySelectorAll('#langToggle .lang-opt').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.langOpt === lang);
  });
}

function initLanguage() {
  const toggleBtn = document.getElementById('langToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      applyLanguage(currentLang === 'ru' ? 'en' : 'ru');
      playSound('beep');
    });
  }
  applyLanguage(currentLang);
}

// ------------------------------------------
// 3. Scroll Reveal for Cyber Cards
// ------------------------------------------
function initCardScrollReveal() {
  const targets = document.querySelectorAll('.cyber-card, .terminal-preview, .section-header, .specs-grid, .faq-item, .cyber-footer');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(c => {
      c.classList.add('revealed');
      c.classList.add('is-revealed');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        entry.target.classList.add('is-revealed');
        
        // Trigger scramble effect on any header inside
        const scrambleEl = entry.target.querySelector('[data-scramble]');
        if (scrambleEl && window.triggerScramble) {
          window.triggerScramble(scrambleEl);
        }
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(t => {
    t.classList.add('scroll-reveal-cyber');
    observer.observe(t);
  });
}

// ------------------------------------------
// 4. Text Scrambler Effect
// ------------------------------------------
function initTextScramble() {
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  const scrambleElements = document.querySelectorAll('[data-scramble]');

  scrambleElements.forEach(el => {
    const originalText = el.dataset.scramble || el.innerText;
    let interval = null;

    el.addEventListener('mouseenter', () => {
      let iteration = 0;
      clearInterval(interval);

      interval = setInterval(() => {
        el.innerText = originalText
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        if (iteration >= originalText.length) {
          clearInterval(interval);
        }
        iteration += 1 / 2;
      }, 30);
    });
  });
}

// ------------------------------------------
// 5. Procedural Web Audio Synthesis
// ------------------------------------------
let audioCtx = null;
let isAudioActive = false;
let droneOsc1, droneOsc2, droneGain;

function initAudioSystem() {
  const soundBtn = document.getElementById('soundToggle');
  const soundLabel = document.getElementById('soundLabel');
  const equalizer = document.getElementById('cyberEqualizer');

  soundBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isAudioActive = !isAudioActive;
    if (isAudioActive) {
      soundLabel.innerText = currentLang === 'ru' ? 'ЗВУК: ВКЛ' : 'AUDIO: ON';
      soundBtn.classList.add('accent');
      if (equalizer) equalizer.classList.add('playing');
      startAmbientDrone();
      playSound('beep');
    } else {
      soundLabel.innerText = currentLang === 'ru' ? 'ЗВУК: ВЫКЛ' : 'AUDIO: OFF';
      soundBtn.classList.remove('accent');
      if (equalizer) equalizer.classList.remove('playing');
      stopAmbientDrone();
    }
  });

  document.querySelectorAll('[data-sound]').forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
    });
  });
}

function startAmbientDrone() {
  if (!audioCtx) return;
  droneGain = audioCtx.createGain();
  droneGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  droneGain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 1.5);

  droneOsc1 = audioCtx.createOscillator();
  droneOsc1.type = 'sawtooth';
  droneOsc1.frequency.setValueAtTime(55, audioCtx.currentTime);

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
// 6. Telemetry Real-time Updates
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
// 7. Interactive Cyber Terminal CLI (RU & EN)
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
    playSound('beep');
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
    playSound('click');

    const isRu = (currentLang === 'ru');

    if (!cmd) return;

    if (cmd === 'help' || cmd === 'помощь') {
      if (isRu) {
        printLine('ДОСТУПНЫЕ ДИРЕКТИВЫ ЯДРА:');
        printLine('  <span class="cyan-text">статус / status</span>    - диагностика ядра системы');
        printLine('  <span class="cyan-text">инвентарь / inventory</span> - список нейро-аугментаций');
        printLine('  <span class="cyan-text">скан / scan</span>      - запуск оптической диагностики сети');
        printLine('  <span class="cyan-text">варп / warp</span>      - инициализация гипер-варп скорости');
        printLine('  <span class="cyan-text">matrix / матрица</span>  - перехват видеопотока матрицы');
        printLine('  <span class="cyan-text">очистить / clear</span>  - очистить буфер консоли');
      } else {
        printLine('AVAILABLE SYSTEM CORE DIRECTIVES:');
        printLine('  <span class="cyan-text">status / статус</span>   - run system core diagnostics');
        printLine('  <span class="cyan-text">inventory / инвентарь</span>- list available neuro-implants');
        printLine('  <span class="cyan-text">scan / скан</span>      - trigger network optical scan');
        printLine('  <span class="cyan-text">warp / варп</span>      - engage particle warp burst');
        printLine('  <span class="cyan-text">matrix / матрица</span>  - breach real-time matrix stream');
        printLine('  <span class="cyan-text">clear / очистить</span>  - purge terminal buffer');
      }
    } else if (cmd === 'status' || cmd === 'статус') {
      if (isRu) {
        printLine('СИСТЕМНЫЙ СТАТУС: В СЕТИ [ОПТИМАЛЬНО]');
        printLine('НЕЙРО-ЯДРО: 4.8 GHz // ЗАГРУЗКА: 94.8%');
        printLine('ЗАДЕРЖКА СИНАПСА: 0.14 ms // КРИПТО: HYPER-SHA512');
        printLine('АКТИВНЫХ УЗЛОВ: 14,208 ПО ВСЕМУ НЕО-ТОКИО');
      } else {
        printLine('SYSTEM STATUS: ONLINE [OPTIMAL]');
        printLine('NEURAL CORE: 4.8 GHz // LOAD: 94.8%');
        printLine('SYNAPSE LATENCY: 0.14 ms // CRYPTO: HYPER-SHA512');
        printLine('ACTIVE NODES: 14,208 ACROSS NEO-TOKYO');
      }
    } else if (cmd === 'inventory' || cmd === 'инвентарь') {
      if (isRu) {
        printLine('СПИСОК ДОСТУПНОГО НЕЙРО-ОБОРУДОВАНИЯ:');
        printLine('  [01] Synaptic Overdrive 9000 (Когнитивный разгон)');
        printLine('  [02] Kiroshi Quantum Retinals (Мультиспектр 16K)');
        printLine('  [03] Ghost Phantom Sub-Matrix (Оптический камуфляж 99.9%)');
        printLine('  [04] Valkyrie ICEbreaker Core (Взлом файрволов 100 Tb/s)');
      } else {
        printLine('MOUNTED NEURAL HARDWARE INVENTORY:');
        printLine('  [01] Synaptic Overdrive 9000 (Cognitive Overclock)');
        printLine('  [02] Kiroshi Quantum Retinals (16K Multispectral)');
        printLine('  [03] Ghost Phantom Sub-Matrix (99.9% Optical Stealth)');
        printLine('  [04] Valkyrie ICEbreaker Core (100 Tb/s Firewall Breach)');
      }
    } else if (cmd === 'scan' || cmd === 'скан') {
      printLine(isRu ? 'ИНИЦИАЛИЗАЦИЯ СКАНИРОВАНИЯ...' : 'INITIALIZING DIAGNOSTIC SCAN...');
      triggerDiagnosticScan();
      playSound('beep');
    } else if (cmd === 'warp' || cmd === 'варп') {
      printLine(isRu ? 'ВАРП-ДВИГАТЕЛЬ АКТИВИРОВАН!' : 'WARP ENGINE ENGAGED!');
      warpSpeedMultiplier = 6;
      playSound('warp');
      setTimeout(() => { warpSpeedMultiplier = 1; }, 1500);
    } else if (cmd === 'matrix' || cmd === 'матрица') {
      printLine(isRu ? 'ПЕРЕХВАТ ЦИФРОВОГО ПОТОКА...' : 'BREACHING MATRIX STREAM...');
      modal.classList.remove('active');
      toggleMatrixMode();
    } else if (cmd === 'clear' || cmd === 'очистить') {
      output.innerHTML = '';
    } else {
      printLine(isRu ? `Команда не найдена: '${cmd}'. Введите 'помощь' для справки.` : `Command not recognized: '${cmd}'. Type 'help' for directory.`, 'error');
    }
  }
}

// ------------------------------------------
// 8. Interactive Matrix Rain Mode
// ------------------------------------------
function initMatrixMode() {
  const canvas = document.getElementById('matrixCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let columns;
  let drops = [];
  const matrixChars = '0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ';
  let animationId = null;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / 18);
    drops = Array(columns).fill(1);
  }

  function drawMatrix() {
    ctx.fillStyle = 'rgba(4, 7, 10, 0.08)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#00f3ff';
    ctx.font = '15px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
      ctx.fillText(text, i * 18, drops[i] * 18);

      if (drops[i] * 18 > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    animationId = requestAnimationFrame(drawMatrix);
  }

  window.toggleMatrixMode = function() {
    if (canvas.classList.contains('hidden')) {
      canvas.classList.remove('hidden');
      resize();
      drawMatrix();
      playSound('beep');
    } else {
      canvas.classList.add('hidden');
      cancelAnimationFrame(animationId);
    }
  };

  canvas.addEventListener('click', () => {
    window.toggleMatrixMode();
  });
}

// ------------------------------------------
// 9. 21st.dev 3D Card Tilt & Audio Synthesis
// ------------------------------------------
function initCardTilt() {
  const cards = document.querySelectorAll('.cyber-card');
  cards.forEach(card => {
    let rect = card.getBoundingClientRect();
    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
      playSound('beep');
    });
    card.addEventListener('mousemove', (e) => {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rx = ((y - rect.height / 2) / (rect.height / 2)) * -9;
      const ry = ((x - rect.width / 2) / (rect.width / 2)) * 9;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      card.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(8px) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)';
    });
  });
}
