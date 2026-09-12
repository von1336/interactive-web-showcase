// ==========================================
// ASTRONEX - Deep Space Astrophysics Engine
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initSpaceCanvas();
  initOrbitalSimulator();
  initPulsarAudio();
  initTelemetryTicker();
});

// ------------------------------------------
// 1. Interactive 3D Rotatable Starfield Canvas
// ------------------------------------------
let hyperdriveMultiplier = 1;

function initSpaceCanvas() {
  const canvas = document.getElementById('spaceCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  const starCount = 380;

  let rotX = 0;
  let rotY = 0;
  let targetRotX = 0;
  let targetRotY = 0;
  let zoom = 1.0;
  let targetZoom = 1.0;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;

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
      this.prevZ = this.z;
      this.size = Math.random() * 2.2 + 0.8;
      this.color = Math.random() > 0.6 ? '#38bdf8' : (Math.random() > 0.4 ? '#818cf8' : '#fbbf24');
    }
    update() {
      this.prevZ = this.z;
      if (hyperdriveMultiplier > 1) {
        this.z -= 35 * (hyperdriveMultiplier / 2);
        if (this.z < -1000) {
          this.z = 1000;
          this.prevZ = 1000;
        }
      }
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

    ctx.fillStyle = hyperdriveMultiplier > 1 ? 'rgba(3, 7, 18, 0.22)' : 'rgba(3, 7, 18, 0.35)';
    ctx.fillRect(0, 0, width, height);

    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    stars.forEach(star => {
      star.update();

      // Rotate around Y
      let x1 = star.x * cosY - star.z * sinY;
      let z1 = star.z * cosY + star.x * sinY;

      // Rotate around X
      let y1 = star.y * cosX - z1 * sinX;
      let z2 = z1 * cosX + star.y * sinX;

      const fov = 400 * zoom;
      const depth = z2 + 800;

      if (depth > 10) {
        const k = fov / depth;
        const px = x1 * k + width / 2;
        const py = y1 * k + height / 2;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const alpha = Math.min(1, Math.max(0.15, 1 - depth / 1800));

          if (hyperdriveMultiplier > 1) {
            // Draw warp speed streak
            const pk = fov / (star.prevZ + 800);
            const prevPx = x1 * pk + width / 2;
            const prevPy = y1 * pk + height / 2;

            ctx.strokeStyle = star.color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = star.size * k * 1.5;
            ctx.beginPath();
            ctx.moveTo(prevPx, prevPy);
            ctx.lineTo(px, py);
            ctx.stroke();
          } else {
            ctx.fillStyle = star.color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(px, py, star.size * k * 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    });

    requestAnimationFrame(render);
  }
  render();

  // Hyperdrive Warp Jump Button
  const warpBtn = document.getElementById('galaxyWarpBtn');
  warpBtn?.addEventListener('click', () => {
    hyperdriveMultiplier = 8;
    document.body.classList.add('warp-shake');
    playPulsarWarpChirp();
    setTimeout(() => {
      hyperdriveMultiplier = 1;
      document.body.classList.remove('warp-shake');
    }, 1400);
  });
}

// ------------------------------------------
// 2. Language Switcher (RU / EN)
// ------------------------------------------
const i18n = {
  ru: {
    docTitle: "ASTRONEX // Обсерватория глубокого космоса и телеметрия экзопланет",
    navObs: "ОБСЕРВАТОРИЯ",
    navSim: "ОРБИТАЛЬНЫЙ_СИМ",
    navExo: "ЭКЗОПЛАНЕТЫ",
    navSpectro: "СПЕКТРОГРАФ",
    pulsarOn: "ПУЛЬСАР: ВКЛ",
    pulsarOff: "ПУЛЬСАР: ВЫКЛ",
    hub: "ХАБ",
    hudArrayStatus: "СЕТЬ ГЛУБОКОГО КОСМОСА // МАССИВ 09 В СЕТИ",
    hudAperture: "АПЕРТУРА: 30.5M",
    heroTitle: "ОТКРЫВАЯ МИРЫ <br><span class='cosmic-gradient'>ВНЕШНЕГО РУБЕЖА</span>",
    heroDesc: "Картографирование землеподобных экзопланет, атмосферных биосигнатур и гравитационных эхо в рукаве Персея с помощью автономных спутников-интерферометров.",
    btnEnterSim: "ВОЙТИ В СИМУЛЯТОР ОРБИТ",
    galaxyWarpBtn: "ГИПЕРПРОСТРАНСТВЕННЫЙ ПРЫЖОК",
    statPlanetTag: "ОТКРЫТЫЕ ЭКЗОПЛАНЕТЫ",
    statNoiseTag: "РЕЛИКТОВОЕ ИЗЛУЧЕНИЕ",
    statRedshiftTag: "КРАСНОЕ СМЕЩЕНИЕ (z)",
    statRangeTag: "ДИАПАЗОН СВЕТОВЫХ ЛЕТ",
    statRangeVal: "12,400 СВ. Л.",
    simBadge: "ИНТЕРАКТИВНАЯ АСТРОФИЗИЧЕСКАЯ ЛАБОРАТОРИЯ",
    simHeading: "Кеплеровский орбитальный движок экзопланет",
    simDesc: "Управляйте гравитационными параметрами, скоростью орбит и исследуйте атмосферы планет в реальном времени.",
    simHint: "Нажмите на планету для спектрального анализа",
    simPanelTitle: "ПАРАМЕТРЫ СИСТЕМЫ",
    lblSpeed: "МНОЖИТЕЛЬ СКОРОСТИ ОРБИТ",
    lblGrav: "ГРАВИТАЦИОННАЯ СИЛА ЗВЕЗДЫ",
    compGas1: "АЗОТ (N₂)",
    compGas2: "ВОДЯНОЙ ПАР (H₂O)",
    compGas3: "УГЛЕКИСЛЫЙ ГАЗ (CO₂)",
    catBadge: "СПЕКТРАЛЬНЫЙ АРХИВ",
    catHeading: "Приоритетные экзомиры",
    catDesc: "Снимки высокого разрешения, полученные нашей спутниковой интерферометрической группировкой.",
    p1Badge: "КУЗИН ЗЕМЛИ // ЗВЕЗДА ТИПА G",
    p1Desc: "Обращается вокруг звезды класса G2, идентичной нашему Солнцу. Радиус в 1.6 раз больше земного, геологическая активность и плотная облачность.",
    p1Stat1Lbl: "РАССТОЯНИЕ",
    p1Stat1Val: "1,400 СВ. Л.",
    p1Stat2Lbl: "ПЕРИОД",
    p1Stat2Val: "385 ДНЕЙ",
    p1Stat3Lbl: "МАССА",
    p2Badge: "ЗОНА ЗЛАТОВЛАСКИ",
    p2Desc: "Ультракомпактная система красного карлика из 7 планет. Получает сопоставимый с Землей звездный поток с умеренным климатом.",
    p2Stat1Lbl: "РАССТОЯНИЕ",
    p2Stat1Val: "39.5 СВ. Л.",
    p2Stat2Lbl: "ПЕРИОД",
    p2Stat2Val: "6.1 ДНЕЙ",
    p2Stat3Lbl: "МАССА",
    p3Badge: "БЛИЖАЙШАЯ ЭКЗОПЛАНЕТА",
    p3Desc: "Наш ближайший межзвездный сосед. Каменистый мир в приливном захвате, подверженный периодическим вспышкам родительской звезды.",
    p3Stat1Lbl: "РАССТОЯНИЕ",
    p3Stat1Val: "4.24 СВ. Л.",
    p3Stat2Lbl: "ПЕРИОД",
    p3Stat2Val: "11.2 ДНЕЙ",
    p3Stat3Lbl: "МАССА",
    ftBrandDesc: "Интерферометрическая обсерватория астрофизики и инициатива исследований глубокого космоса.",
    ftArrayStatus: "СТАТУС МАССИВА: ЗАФИКСИРОВАН НА СТРЕЛЬЦЕ A*",
    ftHStations: "СТАНЦИИ ОБСЕРВАТОРИИ",
    ftHProtocols: "ПРОТОКОЛЫ ДАННЫХ",
    ftCopy: "© 2026 ИНИЦИАТИВА ГЛУБОКОГО КОСМОСА ASTRONEX. В ПОИСКАХ ЖИЗНИ СРЕДИ ЗВЕЗД.",
    planets: {
      trappist: {
        name: "TRAPPIST-1e",
        type: "ЗЕМЛЕПОДОБНАЯ / ЗОНА ОБИТАЕМОСТИ",
        desc: "Высокая вероятность жидких океанов. Атмосферный спектр показывает равновесие азота и углекислого газа с мощной защитной магнитосферой."
      },
      kepler: {
        name: "Kepler-452b",
        type: "СУПЕРЗЕМЛЯ / ЗВЕЗДА КЛАССА G2",
        desc: "Радиус 1.63 R⊕. Оптимальная плотность атмосферы со следами водяного пара и плотным стратосферным облачным покровом."
      },
      proxima: {
        name: "Proxima Centauri b",
        type: "ПРИЛИВНОЙ ЗАХВАТ / КАМЕНИСТЫЙ МИР",
        desc: "Ближайшая к Земле экзопланета (4.24 св. л.). Потенциальная умеренная кольцевая зона сумерек между освещенным и темным полушариями."
      }
    }
  },
  en: {
    docTitle: "ASTRONEX // Deep Space Observatory & Exoplanet Telemetry",
    navObs: "OBSERVATORY",
    navSim: "ORBITAL_SIM",
    navExo: "EXOPLANETS",
    navSpectro: "SPECTROGRAPH",
    pulsarOn: "PULSAR: ON",
    pulsarOff: "PULSAR: OFF",
    hub: "HUB",
    hudArrayStatus: "DEEP SPACE ARRAY // ARRAY 09 ONLINE",
    hudAperture: "APERTURE: 30.5M",
    heroTitle: "UNVEILING THE <br><span class='cosmic-gradient'>OUTER RIM WORLDS</span>",
    heroDesc: "Mapping terrestrial exoplanets, atmospheric biosignatures, and gravitational wave echoes across the Perseus Arm with autonomous interferometer satellites.",
    btnEnterSim: "ENTER ORBITAL SIMULATOR",
    galaxyWarpBtn: "HYPERDRIVE JUMP",
    statPlanetTag: "OBSERVED EXOPLANETS",
    statNoiseTag: "COSMIC BACKGROUND NOISE",
    statRedshiftTag: "REDSHIFT PARAMETER (z)",
    statRangeTag: "LIGHT-YEAR RANGE",
    statRangeVal: "12,400 LY",
    simBadge: "INTERACTIVE ASTROPHYSICS LABORATORY",
    simHeading: "Kepler Exoplanetary Orbital Engine",
    simDesc: "Control gravitational parameters, orbital velocity, and inspect planetary atmospheres in real time.",
    simHint: "Drag or click planets to focus spectral analysis",
    simPanelTitle: "SYSTEM PARAMETERS",
    lblSpeed: "ORBITAL SPEED MULTIPLIER",
    lblGrav: "STELLAR GRAVITY FORCE",
    compGas1: "NITROGEN (N₂)",
    compGas2: "WATER VAPOR (H₂O)",
    compGas3: "CARBON DIOXIDE (CO₂)",
    catBadge: "SPECTRAL ARCHIVE",
    catHeading: "Prime Target Exoworlds",
    catDesc: "High-resolution interferometric captures processed by our orbital space telemetry array.",
    p1Badge: "EARTH'S COUSIN // G-STAR",
    p1Desc: "Orbits a G2-type star identical to our Sun. 1.6x Earth radius with geological activity and dense cloud formations.",
    p1Stat1Lbl: "DISTANCE",
    p1Stat1Val: "1,400 LY",
    p1Stat2Lbl: "PERIOD",
    p1Stat2Val: "385 DAYS",
    p1Stat3Lbl: "MASS",
    p2Badge: "GOLDILOCKS ZONE",
    p2Desc: "Ultra-compact 7-planet red dwarf system. Receives comparable stellar flux to Earth with potential temperate climate.",
    p2Stat1Lbl: "DISTANCE",
    p2Stat1Val: "39.5 LY",
    p2Stat2Lbl: "PERIOD",
    p2Stat2Val: "6.1 DAYS",
    p2Stat3Lbl: "MASS",
    p3Badge: "CLOSEST EXOPLANET",
    p3Desc: "Our nearest interstellar neighbor. Tidally locked rocky world subjected to periodic high-energy stellar flares.",
    p3Stat1Lbl: "DISTANCE",
    p3Stat1Val: "4.24 LY",
    p3Stat2Lbl: "PERIOD",
    p3Stat2Val: "11.2 DAYS",
    p3Stat3Lbl: "MASS",
    ftBrandDesc: "Interferometric Astrophysics Observatory & Deep Space Planetary Research Initiative.",
    ftArrayStatus: "ARRAY STATUS: LOCKED TO SAGITTARIUS A*",
    ftHStations: "OBSERVATORY STATIONS",
    ftHProtocols: "DATA PROTOCOLS",
    ftCopy: "© 2026 ASTRONEX DEEP SPACE INITIATIVE. SEARCHING FOR LIFE AMONG THE STARS.",
    planets: {
      trappist: {
        name: "TRAPPIST-1e",
        type: "TERRESTRIAL / HABITABLE ZONE",
        desc: "High probability of liquid oceans. Atmospheric spectrum reveals strong nitrogen-carbon dioxide equilibrium with protective magnetosphere."
      },
      kepler: {
        name: "Kepler-452b",
        type: "SUPER-EARTH / G2 HOST STAR",
        desc: "1.63x Earth radius. Optimal atmospheric density with detected water vapor lines and dense stratospheric cloud deck."
      },
      proxima: {
        name: "Proxima Centauri b",
        type: "TIDAL LOCK / ROCKY WORLD",
        desc: "Earth's closest interstellar neighbor (4.24 LY). Potential temperate ring twilight zone between irradiated day and subzero night sides."
      }
    }
  }
};

let currentLang = localStorage.getItem('site_lang') || 'ru';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('site_lang', lang);
  document.documentElement.lang = lang;

  const d = i18n[lang] || i18n.ru;
  document.title = d.docTitle;

  const nO = document.getElementById('navObs');
  if (nO) nO.textContent = d.navObs;
  const nS = document.getElementById('navSim');
  if (nS) nS.textContent = d.navSim;
  const nE = document.getElementById('navExo');
  if (nE) nE.textContent = d.navExo;
  const nSp = document.getElementById('navSpectro');
  if (nSp) nSp.textContent = d.navSpectro;

  const pLbl = document.getElementById('pulsarLabel');
  if (pLbl) pLbl.textContent = isAudioPlaying ? d.pulsarOn : d.pulsarOff;

  const hLbl = document.getElementById('hubLabel');
  if (hLbl) hLbl.textContent = d.hub;

  const hArr = document.getElementById('hudArrayStatus');
  if (hArr) hArr.textContent = d.hudArrayStatus;
  const hAp = document.getElementById('hudAperture');
  if (hAp) hAp.textContent = d.hudAperture;

  const hT = document.getElementById('heroTitle');
  if (hT) hT.innerHTML = d.heroTitle;
  const hD = document.getElementById('heroDesc');
  if (hD) hD.textContent = d.heroDesc;

  const bES = document.getElementById('btnEnterSim');
  if (bES) bES.textContent = d.btnEnterSim;
  const gWp = document.getElementById('galaxyWarpBtn');
  if (gWp) gWp.textContent = d.galaxyWarpBtn;

  const sPT = document.getElementById('statPlanetTag');
  if (sPT) sPT.textContent = d.statPlanetTag;
  const sNT = document.getElementById('statNoiseTag');
  if (sNT) sNT.textContent = d.statNoiseTag;
  const sRT = document.getElementById('statRedshiftTag');
  if (sRT) sRT.textContent = d.statRedshiftTag;
  const sRngT = document.getElementById('statRangeTag');
  if (sRngT) sRngT.textContent = d.statRangeTag;
  const sRngV = document.getElementById('statRangeVal');
  if (sRngV) sRngV.textContent = d.statRangeVal;

  const sBdg = document.getElementById('simBadge');
  if (sBdg) sBdg.textContent = d.simBadge;
  const sHead = document.getElementById('simHeading');
  if (sHead) sHead.textContent = d.simHeading;
  const sDc = document.getElementById('simDesc');
  if (sDc) sDc.textContent = d.simDesc;
  const sHnt = document.getElementById('simHint');
  if (sHnt) sHnt.textContent = d.simHint;
  const sPTt = document.getElementById('simPanelTitle');
  if (sPTt) sPTt.textContent = d.simPanelTitle;

  const lSpd = document.getElementById('lblSpeed');
  if (lSpd) lSpd.textContent = d.lblSpeed;
  const lGrv = document.getElementById('lblGrav');
  if (lGrv) lGrv.textContent = d.lblGrav;

  const cG1 = document.getElementById('compGas1');
  if (cG1) cG1.textContent = d.compGas1;
  const cG2 = document.getElementById('compGas2');
  if (cG2) cG2.textContent = d.compGas2;
  const cG3 = document.getElementById('compGas3');
  if (cG3) cG3.textContent = d.compGas3;

  const cBdg = document.getElementById('catBadge');
  if (cBdg) cBdg.textContent = d.catBadge;
  const cHd = document.getElementById('catHeading');
  if (cHd) cHd.textContent = d.catHeading;
  const cDc2 = document.getElementById('catDesc');
  if (cDc2) cDc2.textContent = d.catDesc;

  const p1B = document.getElementById('p1Badge');
  if (p1B) p1B.textContent = d.p1Badge;
  const p1D = document.getElementById('p1Desc');
  if (p1D) p1D.textContent = d.p1Desc;
  const p1S1L = document.getElementById('p1Stat1Lbl');
  if (p1S1L) p1S1L.textContent = d.p1Stat1Lbl;
  const p1S1V = document.getElementById('p1Stat1Val');
  if (p1S1V) p1S1V.textContent = d.p1Stat1Val;
  const p1S2L = document.getElementById('p1Stat2Lbl');
  if (p1S2L) p1S2L.textContent = d.p1Stat2Lbl;
  const p1S2V = document.getElementById('p1Stat2Val');
  if (p1S2V) p1S2V.textContent = d.p1Stat2Val;
  const p1S3L = document.getElementById('p1Stat3Lbl');
  if (p1S3L) p1S3L.textContent = d.p1Stat3Lbl;

  const p2B = document.getElementById('p2Badge');
  if (p2B) p2B.textContent = d.p2Badge;
  const p2D = document.getElementById('p2Desc');
  if (p2D) p2D.textContent = d.p2Desc;
  const p2S1L = document.getElementById('p2Stat1Lbl');
  if (p2S1L) p2S1L.textContent = d.p2Stat1Lbl;
  const p2S1V = document.getElementById('p2Stat1Val');
  if (p2S1V) p2S1V.textContent = d.p2Stat1Val;
  const p2S2L = document.getElementById('p2Stat2Lbl');
  if (p2S2L) p2S2L.textContent = d.p2Stat2Lbl;
  const p2S2V = document.getElementById('p2Stat2Val');
  if (p2S2V) p2S2V.textContent = d.p2Stat2Val;
  const p2S3L = document.getElementById('p2Stat3Lbl');
  if (p2S3L) p2S3L.textContent = d.p2Stat3Lbl;

  const p3B = document.getElementById('p3Badge');
  if (p3B) p3B.textContent = d.p3Badge;
  const p3D = document.getElementById('p3Desc');
  if (p3D) p3D.textContent = d.p3Desc;
  const p3S1L = document.getElementById('p3Stat1Lbl');
  if (p3S1L) p3S1L.textContent = d.p3Stat1Lbl;
  const p3S1V = document.getElementById('p3Stat1Val');
  if (p3S1V) p3S1V.textContent = d.p3Stat1Val;
  const p3S2L = document.getElementById('p3Stat2Lbl');
  if (p3S2L) p3S2L.textContent = d.p3Stat2Lbl;
  const p3S2V = document.getElementById('p3Stat2Val');
  if (p3S2V) p3S2V.textContent = d.p3Stat2Val;
  const p3S3L = document.getElementById('p3Stat3Lbl');
  if (p3S3L) p3S3L.textContent = d.p3Stat3Lbl;

  const ftB = document.getElementById('ftBrandDesc');
  if (ftB) ftB.textContent = d.ftBrandDesc;
  const ftA = document.getElementById('ftArrayStatus');
  if (ftA) ftA.textContent = d.ftArrayStatus;
  const ftS = document.getElementById('ftHStations');
  if (ftS) ftS.textContent = d.ftHStations;
  const ftP = document.getElementById('ftHProtocols');
  if (ftP) ftP.textContent = d.ftHProtocols;
  const ftC = document.getElementById('ftCopy');
  if (ftC) ftC.textContent = d.ftCopy;

  document.querySelectorAll('#langToggle .lang-opt').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.langOpt === lang);
  });

  if (window.updateActivePlanetCard) {
    window.updateActivePlanetCard();
  }
}

function initLanguage() {
  const toggleBtn = document.getElementById('langToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      applyLanguage(currentLang === 'ru' ? 'en' : 'ru');
      playPulsarChirp(600);
    });
  }
  applyLanguage(currentLang);
}

// ------------------------------------------
// 3. Kepler Orbital Mechanics Simulator
// ------------------------------------------
let selectedPlanetKey = 'trappist';

function initOrbitalSimulator() {
  const canvas = document.getElementById('orbitSimCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width = 600;
  const height = canvas.height = 460;
  const center = { x: width / 2, y: height / 2 };

  const speedSlider = document.getElementById('speedSlider');
  const gravSlider = document.getElementById('gravSlider');
  const speedVal = document.getElementById('speedVal');
  const gravVal = document.getElementById('gravVal');

  let speedMult = 1.0;
  let gravityMult = 1.0;

  speedSlider?.addEventListener('input', (e) => {
    speedMult = parseFloat(e.target.value);
    if (speedVal) speedVal.innerText = speedMult.toFixed(1) + 'x';
  });

  gravSlider?.addEventListener('input', (e) => {
    gravityMult = parseFloat(e.target.value);
    if (gravVal) gravVal.innerText = gravityMult.toFixed(1) + ' G';
  });

  const planets = [
    { name: 'TRAPPIST-1e', key: 'trappist', semiMajor: 90, semiMinor: 85, speed: 0.035, angle: 0, radius: 6, color: '#38bdf8' },
    { name: 'Kepler-452b', key: 'kepler', semiMajor: 160, semiMinor: 145, speed: 0.018, angle: 2, radius: 9, color: '#00f0b5' },
    { name: 'Proxima Centauri b', key: 'proxima', semiMajor: 225, semiMinor: 200, speed: 0.009, angle: 4, radius: 7, color: '#f87171' }
  ];

  window.updateActivePlanetCard = function() {
    const d = i18n[currentLang] || i18n.ru;
    const pInfo = d.planets[selectedPlanetKey] || d.planets.trappist;
    const nameEl = document.getElementById('focusPlanetName');
    const typeEl = document.getElementById('focusPlanetType');
    const descEl = document.getElementById('focusPlanetDesc');
    if (nameEl) nameEl.textContent = pInfo.name;
    if (typeEl) typeEl.textContent = pInfo.type;
    if (descEl) descEl.textContent = pInfo.desc;
  };

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (width / rect.width);
    const clickY = (e.clientY - rect.top) * (height / rect.height);

    planets.forEach(p => {
      const px = center.x + Math.cos(p.angle) * p.semiMajor;
      const py = center.y + Math.sin(p.angle) * p.semiMinor;
      const dist = Math.hypot(clickX - px, clickY - py);
      if (dist < p.radius + 14) {
        selectedPlanetKey = p.key;
        window.updateActivePlanetCard();
        playPulsarChirp(880);
      }
    });
  });

  // Clicking cards also switches active planet
  document.querySelectorAll('[data-planet]').forEach(card => {
    card.addEventListener('click', () => {
      selectedPlanetKey = card.dataset.planet;
      window.updateActivePlanetCard();
      playPulsarChirp(660);
    });
  });

  function drawOrbits() {
    ctx.clearRect(0, 0, width, height);

    // Central Host Star (G-type or Red Dwarf)
    const starGlow = ctx.createRadialGradient(center.x, center.y, 4, center.x, center.y, 40);
    starGlow.addColorStop(0, '#ffffff');
    starGlow.addColorStop(0.25, '#fbbf24');
    starGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = starGlow;
    ctx.beginPath();
    ctx.arc(center.x, center.y, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fffae0';
    ctx.beginPath();
    ctx.arc(center.x, center.y, 14, 0, Math.PI * 2);
    ctx.fill();

    // Draw planetary orbits & planets
    planets.forEach(p => {
      // Elliptical orbit line
      ctx.beginPath();
      ctx.strokeStyle = p.key === selectedPlanetKey ? 'rgba(56, 189, 248, 0.45)' : 'rgba(148, 163, 184, 0.15)';
      ctx.lineWidth = p.key === selectedPlanetKey ? 1.8 : 1;
      ctx.ellipse(center.x, center.y, p.semiMajor, p.semiMinor, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Update position based on Keplerian velocity (faster when closer / higher gravity)
      p.angle += p.speed * speedMult * gravityMult;

      const px = center.x + Math.cos(p.angle) * p.semiMajor;
      const py = center.y + Math.sin(p.angle) * p.semiMinor;

      // Planet Glow
      const pGlow = ctx.createRadialGradient(px, py, 1, px, py, p.radius * 2.5);
      pGlow.addColorStop(0, p.color);
      pGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = pGlow;
      ctx.beginPath();
      ctx.arc(px, py, p.radius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Planet Body
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // Selection ring
      if (p.key === selectedPlanetKey) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(px, py, p.radius + 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    requestAnimationFrame(drawOrbits);
  }
  drawOrbits();
}

// ------------------------------------------
// 4. Web Audio Deep Space Pulsar Drone
// ------------------------------------------
let audioCtx = null;
let isAudioPlaying = false;
let pulsarInterval = null;

function initPulsarAudio() {
  const btn = document.getElementById('pulsarAudioBtn');
  const label = document.getElementById('pulsarLabel');

  btn?.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isAudioPlaying = !isAudioPlaying;
    const d = i18n[currentLang] || i18n.ru;
    if (isAudioPlaying) {
      btn.style.borderColor = 'var(--blue-glow)';
      if (label) label.innerText = d.pulsarOn;
      startPulsarDrone();
    } else {
      btn.style.borderColor = '';
      if (label) label.innerText = d.pulsarOff;
      stopPulsarDrone();
    }
  });
}

function startPulsarDrone() {
  playPulsarChirp(440);
  pulsarInterval = setInterval(() => {
    playPulsarChirp(320);
  }, 1300);
}

function stopPulsarDrone() {
  clearInterval(pulsarInterval);
}

function playPulsarChirp(freq) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.35);
}

function playPulsarWarpChirp() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(90, now);
  osc.frequency.exponentialRampToValueAtTime(1400, now + 0.6);
  osc.frequency.exponentialRampToValueAtTime(60, now + 1.2);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 1.3);
}

// ------------------------------------------
// 5. Telemetry Real-time & Rolling Tickers
// ------------------------------------------
function initTelemetryTicker() {
  const planetEl = document.getElementById('planetCount');
  const redshiftEl = document.getElementById('redshiftVal');

  // Rolling counter on page entrance
  if (planetEl) {
    let current = 5400;
    const target = 5632;
    const interval = setInterval(() => {
      current += 8;
      if (current >= target) {
        planetEl.innerText = target.toLocaleString();
        clearInterval(interval);
      } else {
        planetEl.innerText = current.toLocaleString();
      }
    }, 25);
  }

  // Periodic subtle telemetry update
  setInterval(() => {
    if (redshiftEl) {
      redshiftEl.innerText = (1.480 + Math.random() * 0.006).toFixed(3);
    }
  }, 3000);
}

// Aerospace HUD Telemetry Scroll Reveal Observer
function initSpaceScrollReveal() {
  const elements = document.querySelectorAll('.planet-card, .simulator-card, .spectroscopy-card, .mission-log, .space-footer');
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => {
    el.classList.add('scroll-reveal-space');
    observer.observe(el);
  });
}
