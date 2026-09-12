// ==========================================
// NEOPOP - Hyper-Playful Interactive Engine
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initDraggableStickers();
  initConfettiCanvas();
  initBudgetCalculator();
  initPopAudio();
});

// ------------------------------------------
// 1. Language Switcher (RU / EN)
// ------------------------------------------
const i18n = {
  ru: {
    docTitle: "NEOPOP // Дерзкая и игривая дизайн-студия цифровых продуктов",
    marquee: [
      "// СОЗДАЕМ БЕЗУМНЫЕ ЦИФРОВЫЕ ВПЕЧАТЛЕНИЯ",
      "// НИКАКИХ СКУЧНЫХ САЙТОВ",
      "// 100% БЕСКОМПРОМИССНЫЙ КРЕАТИВ",
      "// БРУТАЛИСТСКИЙ ДИЗАЙН, КОТОРЫЙ ПРОДАЕТ",
      "// ИНТЕРАКТИВНЫЕ СТИКЕРЫ С ФИЗИКОЙ"
    ],
    brandBadge: "СТУДИЯ",
    navWork: "РАБОТЫ",
    navServices: "УСЛУГИ",
    navCalc: "КАЛЬКУЛЯТОР",
    navContact: "НА СВЯЗИ",
    sfxOn: "ЗВУК: ВКЛ",
    sfxOff: "ЗВУК: ВЫКЛ",
    confettiLabel: "ЗАЛП КОНФЕТТИ",
    hub: "ХАБ",
    heroStickerNote: "УДАРНЫЙ ДИЗАЙН И КОД ВЫСОКОЙ КОНВЕРСИИ",
    heroHeadline: "МЫ ДЕЛАЕМ САЙТЫ, <br><span class='highlight-yellow'>КОТОРЫЕ ЗАМЕЧАЮТ.</span>",
    heroPitch: "Устали от унылых корпоративных шаблонов? Мы создаем дерзкие, контрастные цифровые продукты с живой физикой, которые захватывают внимание и приносят реальные продажи.",
    btnCalc: "РАССЧИТАТЬ СМЕТУ",
    btnWork: "СМОТРЕТЬ РАБОТЫ",
    shelfLabel: "// ИНТЕРАКТИВНАЯ ПЛОЩАДКА СО СТИКЕРАМИ: ХВАТАЙ И БРОСАЙ",
    stk1: "ГОРЯЧИЙ РЕЛИЗ // 2026",
    stk2: "[100% ЧИСТЫЙ КОД]",
    stk3: "[ПИКСЕЛЬ-ПЕРФЕКТ]",
    stk4: "ШВЫРНИ МЕНЯ!",
    stk5: "ТОПОВЫЙ ДЕВЕЛОПМЕНТ",
    stk6: "ГОТОВ К ЗАПУСКУ",
    resetStickers: "СБРОСИТЬ СТИКЕРЫ",
    bentoTag: "ИЗБРАННЫЕ РАБОТЫ",
    bentoTitle: "ЦИФРОВОЙ ПОЛИГОН",
    b1Meta: "ИНТЕРНЕТ-МАГАЗИН // 3D WEBGL",
    b1Desc: "3D WebGL кастомизатор скейтов с физикой в реальном времени и генератором наждака. Увеличил конверсию оформления заказов на 214%.",
    b2Meta: "МОБИЛЬНОЕ ВЕБ-ПРИЛОЖЕНИЕ",
    b2Desc: "Мобильный веб-банк нового поколения с высокими ставками доходности, шифрованными картами и тактильным звуковым откликом.",
    b3Meta: "МУЛЬТИМОДАЛЬНЫЙ ИИ",
    b3Desc: "Автономный интеллектуальный движок, превращающий сырую телеметрию в мультимодальные 3D-ассеты за считанные секунды.",
    b4Meta: "ИНТЕРАКТИВНЫЙ ЗАКАЗ",
    b4Desc: "Интерактивная кулинарная система заказов с телеметрией температуры дровяных печей в реальном времени и локальной доставкой.",
    calcTag: "МОЛНИЕНОСНЫЙ РАСЧЕТ СТОИМОСТИ",
    calcHead: "НАСКОЛЬКО БЕЗУМЕН ВАШ ПРОЕКТ?",
    calcDesc: "Перемещайте ползунки или нажимайте на варианты, чтобы рассчитать индивидуальный бюджет в реальном времени.",
    lblScope: "1. МАСШТАБ ПРОЕКТА:",
    scopePill1: "1 стр. Лендинг",
    scopePill2: "3-5 стр. Сайт",
    scopePill3: "Веб-приложение",
    scopePill4: "Корп. портал",
    lblInsanity: "2. СЛОЖНОСТЬ АНИМАЦИЙ И ФИЗИКИ:",
    insPill1: "Стандарт (CSS)",
    insPill2: "Высокая (3D + Звук)",
    insPill3: "Максимум драйва",
    lblBrand: "Брендинг и векторная айдентика (+ $2,500)",
    lblSound: "Синтезированный саунд-дизайн Web Audio (+ $1,800)",
    lblTotal: "ПРИМЕРНЫЙ БЮДЖЕТ ЗАПУСКА",
    bookBtn: "ЗАБРОНИРОВАТЬ ПРОЕКТ",
    ftPitch: "Создаем громкие, радостные и незабываемые цифровые продукты с 2024 года.",
    ftHLinks: "ССЫЛКИ",
    ftL1: "Манифест",
    ftL2: "Цены",
    ftL3: "Контакты",
    ftHSocials: "СОЦСЕТИ",
    ftCopy: "СОЗДАНО С ДРАЙВОМ, КОДОМ И БЕЗ ИЗВИНЕНИЙ. ВСЕ ПРАВА ЗАЩИЩЕНЫ."
  },
  en: {
    docTitle: "NEOPOP // Hyper-Playful Creative & Product Studio",
    marquee: [
      "// WE BUILD WILD DIGITAL EXPERIENCES",
      "// ZERO BORING WEBSITES ALLOWED",
      "// 100% UNAPOLOGETIC CREATIVITY",
      "// BRUTALIST DESIGNS THAT CONVERT",
      "// DRAGGABLE PHYSICS STICKERS EVERYWHERE"
    ],
    brandBadge: "STUDIO",
    navWork: "WORK",
    navServices: "SERVICES",
    navCalc: "ESTIMATOR",
    navContact: "SAY HELLO",
    sfxOn: "SFX: ON",
    sfxOff: "SFX: OFF",
    confettiLabel: "CONFETTI BLAST",
    hub: "HUB",
    heroStickerNote: "HIGH-IMPACT PRODUCT DESIGN & CODE",
    heroHeadline: "WE MAKE WEBSITES <br><span class='highlight-yellow'>THAT STAND OUT.</span>",
    heroPitch: "Tired of generic corporate templates? We engineer bold, high-contrast, physics-infused digital products that captivate audiences and drive measurable conversions.",
    btnCalc: "CALCULATE BUDGET",
    btnWork: "EXPLORE PRODUCTIONS",
    shelfLabel: "// INTERACTIVE STICKER PLAYGROUND: DRAG & TOSS ANYWHERE",
    stk1: "HOT RELEASE // 2026",
    stk2: "[100% PURE CODE]",
    stk3: "[PIXEL PERFECT]",
    stk4: "TOSS ME AROUND",
    stk5: "AWARD WINNING DEV",
    stk6: "READY TO SHIP",
    resetStickers: "RESET STICKERS",
    bentoTag: "FEATURED PRODUCTIONS",
    bentoTitle: "THE DIGITAL PLAYGROUND",
    b1Meta: "E-COMMERCE // 3D WEBGL",
    b1Desc: "3D WebGL skate customizer with real-time physics and custom grip tape generator. Increased checkout conversion by 214%.",
    b2Meta: "MOBILE WEB APP",
    b2Desc: "Next-generation mobile web experience with high APR yields, encrypted cards, and reactive haptic audio.",
    b3Meta: "MULTIMODAL AI",
    b3Desc: "Autonomous intelligence engine turning raw telemetry into multimodal 3D visual assets in seconds.",
    b4Meta: "INTERACTIVE ORDERING",
    b4Desc: "Interactive artisan culinary ordering system with real-time oven temperature telemetry and localized delivery routing.",
    calcTag: "INSTANT ESTIMATE CALCULATOR",
    calcHead: "HOW CRAZY IS YOUR PROJECT?",
    calcDesc: "Slide the sliders or click any tier button to calculate your custom production budget in real time.",
    lblScope: "1. PROJECT SCALE:",
    scopePill1: "1 Page Landing",
    scopePill2: "3-5 Page Site",
    scopePill3: "Full Web App",
    scopePill4: "Enterprise Suite",
    lblInsanity: "2. ANIMATION & PHYSICS COMPLEXITY:",
    insPill1: "Standard (Chunky CSS)",
    insPill2: "High (3D + Sound)",
    insPill3: "Maximum Overdrive",
    lblBrand: "Branding & Bespoke Vector Identity (+ $2,500)",
    lblSound: "Synthesized Web Audio Soundscape (+ $1,800)",
    lblTotal: "ESTIMATED LAUNCH BUDGET",
    bookBtn: "LOCK IN THIS PROJECT",
    ftPitch: "Building loud, joyful, and memorable digital products since 2024.",
    ftHLinks: "LINKS",
    ftL1: "Manifesto",
    ftL2: "Pricing",
    ftL3: "Contact",
    ftHSocials: "SOCIALS",
    ftCopy: "DESIGNED WITH PASSION, CODE & ZERO APOLOGIES. ALL RIGHTS RESERVED."
  }
};

let currentLang = localStorage.getItem('site_lang') || 'ru';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('site_lang', lang);
  document.documentElement.lang = lang;

  const d = i18n[lang] || i18n.ru;
  document.title = d.docTitle;

  const mq = document.getElementById('marqueeTrack');
  if (mq) {
    const fullMarquee = [...d.marquee, ...d.marquee].map(s => `<span>${s}</span>`).join('');
    mq.innerHTML = fullMarquee;
  }

  const bb = document.getElementById('brandBadge');
  if (bb) bb.textContent = d.brandBadge;

  const nW = document.getElementById('navWork');
  if (nW) nW.textContent = d.navWork;
  const nS = document.getElementById('navServices');
  if (nS) nS.textContent = d.navServices;
  const nC = document.getElementById('navCalc');
  if (nC) nC.textContent = d.navCalc;
  const nCt = document.getElementById('navContact');
  if (nCt) nCt.textContent = d.navContact;

  const sfxT = document.getElementById('sfxText');
  if (sfxT) sfxT.textContent = isAudioEnabled ? d.sfxOn : d.sfxOff;

  const cfL = document.getElementById('confettiLabel');
  if (cfL) cfL.textContent = d.confettiLabel;

  const hLbl = document.getElementById('hubLabel');
  if (hLbl) hLbl.textContent = d.hub;

  const hSN = document.getElementById('heroStickerNote');
  if (hSN) hSN.textContent = d.heroStickerNote;
  const hHL = document.getElementById('heroHeadline');
  if (hHL) hHL.innerHTML = d.heroHeadline;
  const hPt = document.getElementById('heroPitch');
  if (hPt) hPt.textContent = d.heroPitch;

  const bC = document.getElementById('btnCalc');
  if (bC) bC.textContent = d.btnCalc;
  const bW = document.getElementById('btnWork');
  if (bW) bW.textContent = d.btnWork;

  const shL = document.getElementById('shelfLabel');
  if (shL) shL.textContent = d.shelfLabel;

  const s1 = document.getElementById('stk1');
  if (s1) s1.textContent = d.stk1;
  const s2 = document.getElementById('stk2');
  if (s2) s2.textContent = d.stk2;
  const s3 = document.getElementById('stk3');
  if (s3) s3.textContent = d.stk3;
  const s4 = document.getElementById('stk4');
  if (s4) s4.textContent = d.stk4;
  const s5 = document.getElementById('stk5');
  if (s5) s5.textContent = d.stk5;
  const s6 = document.getElementById('stk6');
  if (s6) s6.textContent = d.stk6;

  const rsb = document.getElementById('resetStickersBtn');
  if (rsb) rsb.textContent = d.resetStickers;

  const bTag = document.getElementById('bentoTag');
  if (bTag) bTag.textContent = d.bentoTag;
  const bTitle = document.getElementById('bentoTitle');
  if (bTitle) bTitle.textContent = d.bentoTitle;

  const b1M = document.getElementById('b1Meta');
  if (b1M) b1M.textContent = d.b1Meta;
  const b1D = document.getElementById('b1Desc');
  if (b1D) b1D.textContent = d.b1Desc;

  const b2M = document.getElementById('b2Meta');
  if (b2M) b2M.textContent = d.b2Meta;
  const b2D = document.getElementById('b2Desc');
  if (b2D) b2D.textContent = d.b2Desc;

  const b3M = document.getElementById('b3Meta');
  if (b3M) b3M.textContent = d.b3Meta;
  const b3D = document.getElementById('b3Desc');
  if (b3D) b3D.textContent = d.b3Desc;

  const b4M = document.getElementById('b4Meta');
  if (b4M) b4M.textContent = d.b4Meta;
  const b4D = document.getElementById('b4Desc');
  if (b4D) b4D.textContent = d.b4Desc;

  const cTg = document.getElementById('calcTag');
  if (cTg) cTg.textContent = d.calcTag;
  const cHd = document.getElementById('calcHead');
  if (cHd) cHd.textContent = d.calcHead;
  const cDc = document.getElementById('calcDesc');
  if (cDc) cDc.textContent = d.calcDesc;

  const lScp = document.getElementById('lblScope');
  if (lScp) lScp.textContent = d.lblScope;
  const scP1 = document.getElementById('scPill1');
  if (scP1) scP1.textContent = d.scopePill1;
  const scP2 = document.getElementById('scPill2');
  if (scP2) scP2.textContent = d.scopePill2;
  const scP3 = document.getElementById('scPill3');
  if (scP3) scP3.textContent = d.scopePill3;
  const scP4 = document.getElementById('scPill4');
  if (scP4) scP4.textContent = d.scopePill4;

  const lIns = document.getElementById('lblInsanity');
  if (lIns) lIns.textContent = d.lblInsanity;
  const inP1 = document.getElementById('insPill1');
  if (inP1) inP1.textContent = d.insPill1;
  const inP2 = document.getElementById('insPill2');
  if (inP2) inP2.textContent = d.insPill2;
  const inP3 = document.getElementById('insPill3');
  if (inP3) inP3.textContent = d.insPill3;

  const lBrd = document.getElementById('lblBrand');
  if (lBrd) lBrd.textContent = d.lblBrand;
  const lSnd = document.getElementById('lblSound');
  if (lSnd) lSnd.textContent = d.lblSound;

  const lTot = document.getElementById('lblTotal');
  if (lTot) lTot.textContent = d.lblTotal;
  const bkBtn = document.getElementById('bookCallBtn');
  if (bkBtn) bkBtn.textContent = d.bookBtn;

  const ftP = document.getElementById('ftPitch');
  if (ftP) ftP.textContent = d.ftPitch;
  const ftHL = document.getElementById('ftHLinks');
  if (ftHL) ftHL.textContent = d.ftHLinks;
  const ftL1 = document.getElementById('ftL1');
  if (ftL1) ftL1.textContent = d.ftL1;
  const ftL2 = document.getElementById('ftL2');
  if (ftL2) ftL2.textContent = d.ftL2;
  const ftL3 = document.getElementById('ftL3');
  if (ftL3) ftL3.textContent = d.ftL3;
  const ftHS = document.getElementById('ftHSocials');
  if (ftHS) ftHS.textContent = d.ftHSocials;
  const ftC = document.getElementById('ftCopy');
  if (ftC) ftC.textContent = d.ftCopy;

  document.querySelectorAll('#langToggle .lang-opt').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.langOpt === lang);
  });

  if (window.recalculateBudget) {
    window.recalculateBudget(false);
  }
}

function initLanguage() {
  const toggleBtn = document.getElementById('langToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      applyLanguage(currentLang === 'ru' ? 'en' : 'ru');
      playPopSound('pop');
    });
  }
  applyLanguage(currentLang);
}

// ------------------------------------------
// 2. Draggable Physics Stickers
// ------------------------------------------
function initDraggableStickers() {
  const stickers = document.querySelectorAll('[data-drag="true"]');
  const resetBtn = document.getElementById('resetStickersBtn');
  const defaultRotations = [-3, 4, -2, 3, -4, 5];

  stickers.forEach((sticker, idx) => {
    sticker._x = 0;
    sticker._y = 0;
    sticker._rot = defaultRotations[idx % defaultRotations.length];
    sticker.style.setProperty('--rot', `${sticker._rot}deg`);
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

      sticker.style.animation = 'none'; // stop idle bobbing
      sticker.style.zIndex = '500';
      sticker.style.transition = 'none';
      sticker.style.cursor = 'grabbing';
      sticker.style.transform = `translate3d(${sticker._x}px, ${sticker._y}px, 0px) rotate(${sticker._rot + 4}deg) scale(1.08)`;
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
      sticker.style.transform = `translate3d(${sticker._x}px, ${sticker._y}px, 0px) rotate(${sticker._rot + 4}deg) scale(1.08)`;
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      sticker.style.zIndex = '10';
      sticker.style.cursor = 'grab';
      sticker.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
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
        setTimeout(() => { sticker.style.animation = ''; }, 400);
      });
      playPopSound('pop');
    });
  }
}

// ------------------------------------------
// 3. Fullscreen Confetti Engine
// ------------------------------------------
let confettiParticles = [];

function initConfettiCanvas() {
  const canvas = document.getElementById('confettiCanvas');
  const triggerBtn = document.getElementById('confettiTrigger');
  const bookBtn = document.getElementById('bookCallBtn');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const colors = ['#ffde59', '#b388ff', '#00f0b5', '#ff70a6', '#121212', '#ffffff'];

  class Confetti {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 12 + 6;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.vx = (Math.random() - 0.5) * 22;
      this.vy = (Math.random() - 0.75) * 26;
      this.rot = Math.random() * 360;
      this.vRot = (Math.random() - 0.5) * 15;
      this.gravity = 0.65;
      this.alpha = 1;
    }
    update() {
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rot += this.vRot;
      this.alpha -= 0.009;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rot * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.strokeStyle = '#121212';
      ctx.lineWidth = 1.5;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.7);
      ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.7);
      ctx.restore();
    }
  }

  function launchConfetti(originX, originY) {
    for (let i = 0; i < 90; i++) {
      confettiParticles.push(new Confetti(originX || width / 2, originY || height / 3));
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.update();
      p.draw();
      if (p.alpha <= 0 || p.y > height + 20) {
        confettiParticles.splice(i, 1);
      }
    }
    requestAnimationFrame(animate);
  }
  animate();

  triggerBtn?.addEventListener('click', (e) => {
    const rect = triggerBtn.getBoundingClientRect();
    launchConfetti(rect.left + rect.width / 2, rect.top);
    playPopSound('fanfare');
  });

  bookBtn?.addEventListener('click', () => {
    launchConfetti(width / 2, height / 2);
    playPopSound('fanfare');
  });
}

// ------------------------------------------
// 4. Interactive Budget & Scope Calculator
// ------------------------------------------
function initBudgetCalculator() {
  const scopeSlider = document.getElementById('scopeSlider');
  const insanitySlider = document.getElementById('insanitySlider');
  const scopeLabel = document.getElementById('scopeLabel');
  const insanityLabel = document.getElementById('insanityLabel');
  const scopePills = document.querySelectorAll('#scopePills .tier-pill');
  const insanityPills = document.querySelectorAll('#insanityPills .tier-pill');
  const checkBrand = document.getElementById('checkBrand');
  const checkSound = document.getElementById('checkSound');
  const totalBudget = document.getElementById('totalBudget');

  const scopeTexts = {
    ru: ['Лендинг (1 страница)', 'Интерактивный сайт (3-5 стр.)', 'Полноценное веб-приложение', 'Корпоративный портал'],
    en: ['1 Page Landing', '3-5 Page Interactive Site', 'Full Web App', 'Enterprise Suite']
  };

  const insanityTexts = {
    ru: ['Стандарт (Стильный CSS)', 'Высокая (3D Canvas + Звук)', 'Максимальный драйв (Полная физика)'],
    en: ['Standard (Chunky CSS)', 'High (3D Canvas + Custom Sound)', 'Maximum Overdrive']
  };

  const scopePrices = [3500, 7500, 14000, 24000];
  const insanityMults = [1.0, 1.35, 1.75];

  let currentDisplayedBudget = 14300;

  function animateBudgetValue(targetVal) {
    const startVal = currentDisplayedBudget;
    const diff = targetVal - startVal;
    const duration = 250;
    const startTimestamp = performance.now();

    function step(timestamp) {
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(startVal + diff * ease);
      totalBudget.innerText = `$${val.toLocaleString()}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        currentDisplayedBudget = targetVal;
        totalBudget.innerText = `$${targetVal.toLocaleString()}`;
      }
    }
    requestAnimationFrame(step);
  }

  function calculate(animate = true) {
    const scopeVal = parseInt(scopeSlider.value) || 1;
    const insanityVal = parseInt(insanitySlider.value) || 1;

    const langKey = currentLang === 'ru' ? 'ru' : 'en';
    if (scopeLabel) scopeLabel.innerText = scopeTexts[langKey][scopeVal - 1];
    if (insanityLabel) insanityLabel.innerText = insanityTexts[langKey][insanityVal - 1];

    let base = scopePrices[scopeVal - 1];
    base *= insanityMults[insanityVal - 1];

    if (checkBrand && checkBrand.checked) base += 2500;
    if (checkSound && checkSound.checked) base += 1800;

    const finalSum = Math.round(base);

    if (animate) {
      animateBudgetValue(finalSum);
      playPopSound('pop');
    } else {
      currentDisplayedBudget = finalSum;
      if (totalBudget) totalBudget.innerText = `$${finalSum.toLocaleString()}`;
    }

    scopePills.forEach(p => p.classList.toggle('active', p.dataset.val === String(scopeVal)));
    insanityPills.forEach(p => p.classList.toggle('active', p.dataset.val === String(insanityVal)));
  }

  window.recalculateBudget = calculate;

  scopeSlider?.addEventListener('input', () => calculate(true));
  insanitySlider?.addEventListener('input', () => calculate(true));
  checkBrand?.addEventListener('change', () => calculate(true));
  checkSound?.addEventListener('change', () => calculate(true));

  document.getElementById('scopeDecBtn')?.addEventListener('click', () => {
    scopeSlider.value = Math.max(1, parseInt(scopeSlider.value) - 1);
    calculate(true);
  });
  document.getElementById('scopeIncBtn')?.addEventListener('click', () => {
    scopeSlider.value = Math.min(4, parseInt(scopeSlider.value) + 1);
    calculate(true);
  });

  document.getElementById('insanityDecBtn')?.addEventListener('click', () => {
    insanitySlider.value = Math.max(1, parseInt(insanitySlider.value) - 1);
    calculate(true);
  });
  document.getElementById('insanityIncBtn')?.addEventListener('click', () => {
    insanitySlider.value = Math.min(3, parseInt(insanitySlider.value) + 1);
    calculate(true);
  });

  scopePills.forEach(pill => {
    pill.addEventListener('click', () => {
      scopeSlider.value = pill.dataset.val;
      calculate(true);
    });
  });

  insanityPills.forEach(pill => {
    pill.addEventListener('click', () => {
      insanitySlider.value = pill.dataset.val;
      calculate(true);
    });
  });

  calculate(false);
}

// ------------------------------------------
// 5. Synthesized 8-Bit Web Audio Engine
// ------------------------------------------
let audioCtx = null;
let isAudioEnabled = true;

function initPopAudio() {
  const sfxBtn = document.getElementById('sfxToggle');
  const sfxText = document.getElementById('sfxText');

  sfxBtn?.addEventListener('click', () => {
    isAudioEnabled = !isAudioEnabled;
    const d = i18n[currentLang] || i18n.ru;
    if (sfxText) sfxText.innerText = isAudioEnabled ? d.sfxOn : d.sfxOff;
    if (isAudioEnabled) playPopSound('pop');
  });
}

function playPopSound(type) {
  if (!isAudioEnabled) return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;

  if (type === 'pop') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } else if (type === 'boing') {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(550, now + 0.12);
    osc.frequency.linearRampToValueAtTime(280, now + 0.22);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  } else if (type === 'fanfare') {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.18);
      }, idx * 75);
    });
  }
}

// Neo-Brutalist Spring Scroll Reveal Observer
function initPopScrollReveal() {
  const elements = document.querySelectorAll('.bento-card, .calculator-box, .sticker-canvas-wrap, .section-tag, .pop-footer');
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
    el.classList.add('scroll-reveal-pop');
    observer.observe(el);
  });
}
