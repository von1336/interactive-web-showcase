// ==========================================
// LUMINA BOTANICA - Interactive Editorial JS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initBotanicalCanvas();
  initLanguage();
  initMagneticCursor();
  initMoodSwitcher();
  initHerbariumFilters();
  initBloomExperience();
  initChimeAudio();
  initInquiryForm();
  initScrollReveal();
});

// ------------------------------------------
// 1. Organic Botanical Particle Canvas & Spore Burst
// ------------------------------------------
let particles = [];
let addSporeBurst = null;

function initBotanicalCanvas() {
  const canvas = document.getElementById('botanicalCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  const count = 50;
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
    constructor(x, y, isBurst = false) {
      this.reset(x, y, isBurst);
    }
    reset(x, y, isBurst = false) {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : Math.random() * height;
      this.size = Math.random() * 5 + 3;
      this.density = Math.random() * 20 + 5;
      this.angle = Math.random() * Math.PI * 2;
      this.angularSpeed = (Math.random() - 0.5) * 0.015;
      this.speedY = isBurst ? (Math.random() - 0.5) * 3 : Math.random() * 0.4 + 0.2;
      this.speedX = isBurst ? (Math.random() - 0.5) * 3 : 0;
      this.life = isBurst ? 1.0 : null;
      this.color = Math.random() > 0.5 ? 'rgba(45, 90, 69, 0.25)' : 'rgba(200, 109, 81, 0.25)';
    }
    update() {
      if (this.life !== null) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 0.015;
        return;
      }

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
      if (this.life !== null) {
        ctx.globalAlpha = Math.max(0, this.life);
      }
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

  addSporeBurst = function(cx, cy) {
    for (let i = 0; i < 14; i++) {
      particles.push(new BotanicalSpore(cx, cy, true));
    }
    // Limit extra burst particles
    if (particles.length > 120) {
      particles.splice(count, 14);
    }
  };

  // Click to burst spores
  window.addEventListener('click', (e) => {
    if (addSporeBurst) {
      addSporeBurst(e.clientX, e.clientY);
    }
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      if (p.life !== null && p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      p.draw();
    }
    requestAnimationFrame(animate);
  }
  animate();

  window.bloomSporePulse = function() {
    for (let i = 0; i < 35; i++) {
      particles.push(new BotanicalSpore(width / 2 + (Math.random() - 0.5) * 200, height / 2 + (Math.random() - 0.5) * 200, true));
    }
  };
}

// ------------------------------------------
// 2. Language Switcher (RU / EN)
// ------------------------------------------
const i18n = {
  ru: {
    docTitle: "LUMINA BOTANICA // Биофильная архитектура и высокая флористика",
    brandSub: "АТЕЛЬЕ ИСКУССТВА И ПРИРОДЫ",
    navPhil: "ФИЛОСОФИЯ",
    navHerb: "ГЕРБАРИЙ",
    navSpaces: "СВЯТИЛИЩА",
    navContact: "ПРОЕКТЫ",
    moodDay: "РАССВЕТ",
    moodDusk: "СУМЕРКИ",
    moodNight: "НОКТЮРН",
    audioOn: "ЗВУК: ВКЛ",
    audioOff: "КОЛОКОЛЬЧИКИ",
    hub: "ХАБ",
    heroTag: "ТОМ XXIII — БИОФИЛЬНАЯ ЖИВАЯ КОЛЛЕКЦИЯ",
    heroHeading: "Где живая природа <br><em>Обретает скульптурную форму</em>",
    heroText: "Lumina Botanica создает эксклюзивные живые экосистемы, ботанические инсталляции и сенсорную биофильную архитектуру для резиденций, музеев и частных святилищ по всему миру.",
    btnExplore: "ИССЛЕДОВАТЬ ЭКСПОНАТЫ",
    bloomTrigger: "РАСЦВЕТ ФЛОРЫ",
    artBadge: "№ 084 // НАСЛЕДИЕ",
    artCaption: "Выращено в микроклиматических стеклянных оранжереях Киото",
    growthLabel: "ЖИЗНЕННЫЙ ТОНУС",
    growthVal: "99.4% ОПТИМАЛЬНО",
    quoteText: "«Творить в согласии с природой — значит не просто вносить зелень в интерьер, но почитать тихий, неспешный ритм живой Земли».",
    quoteCite: "— Астрид Вэнс, главный ботаник и основатель",
    m1Lbl: "Сохраненных реликтовых видов",
    m2Lbl: "Регенеративные почвенные системы",
    m3Lbl: "Глобальных архитектурных святилищ",
    herbSub: "АРХИВ И СЕЛЕКЦИЯ",
    herbHead: "Кураторский гербарий",
    fpAll: "ВСЕ КОЛЛЕКЦИИ",
    fpFlora: "РЕДКАЯ ФЛОРА",
    fpFoliage: "СКУЛЬПТУРНАЯ ЛИСТВА",
    fpArom: "СВЯЩЕННЫЕ АРОМАТЫ",
    sp1Desc: "Архитектурная белая райская птица с величественными изумрудными листьями и кристально-чистыми прицветниками.",
    sp1Origin: "ПРОИСХОЖДЕНИЕ: ЮЖНАЯ АФРИКА",
    sp1Tag: "РЕДКИЙ САЖЕНЕЦ",
    sp2Title: "Орхидея Phalaenopsis Bellina",
    sp2Desc: "Дикая ароматная орхидея с пурпурными лепестками, лаймово-цитрусовой каймой и пьянящим ароматом.",
    sp2Origin: "ПРОИСХОЖДЕНИЕ: БОРНЕО",
    sp2Tag: "БЛАГОУХАЮЩИЙ",
    sp3Title: "Santalum Album (Сандал)",
    sp3Desc: "Священные сандаловые деревья устойчивого разведения, дающие медитативные бальзамические древесные масла.",
    sp3Origin: "ПРОИСХОЖДЕНИЕ: ЮЖНАЯ ИНДИЯ",
    sp3Tag: "НАСЛЕДИЕ",
    sp4Title: "Nelumbo Nucifera 'Celestial' (Лотос)",
    sp4Desc: "Священный водный лотос, почитаемый за супергидрофобные самоочищающиеся листья и многослойные лепестки.",
    sp4Origin: "ПРОИСХОЖДЕНИЕ: ДЕЛЬТА МЕКОНГА",
    sp4Tag: "ВОДНЫЙ",
    sancTag: "АВТОРСКИЕ АРХИТЕКТУРНЫЕ ИНСТАЛЛЯЦИИ",
    sancHeading: "Привнесите древние леса в высокую архитектуру",
    sancDesc: "Наши ландшафтные архитекторы объединяют комнатные микроклиматы, автоматизированное туманообразование с питательными веществами и циркадное освещение музейного уровня для вертикальных лесов.",
    quoteInput: "Введите email для доступа к портфолио...",
    subscribeBtn: "ОТПРАВИТЬ ЗАПРОС",
    confirmMsg: "Благодарим за интерес. Наш куратор свяжется с вами в течение 24 часов.",
    ftBrandDesc: "Ботаническое ателье и биофильная архитектура",
    ftHAteliers: "АТЕЛЬЕ",
    ftHEditions: "ИЗДАНИЯ",
    ftEd1: "Биофильный журнал",
    ftEd2: "Монография о сохранении видов",
    ftEd3: "Регистр редких семян",
    ftCopy: "© 2026 АТЕЛЬЕ LUMINA BOTANICA. ПОСВЯЩЕНО СОХРАНЕНИЮ БОТАНИЧЕСКИХ СОКРОВИЩ ЗЕМЛИ."
  },
  en: {
    docTitle: "LUMINA BOTANICA // Biophilic Architecture & Haute Floristry",
    brandSub: "ATELIER D'ART & NATURE",
    navPhil: "PHILOSOPHY",
    navHerb: "HERBARIUM",
    navSpaces: "SANCTUARIES",
    navContact: "COMMISSIONS",
    moodDay: "DAWN",
    moodDusk: "DUSK",
    moodNight: "NOCTURNE",
    audioOn: "CHIMES: ON",
    audioOff: "CHIMES",
    hub: "HUB",
    heroTag: "VOL. XXIII — THE BIOPHILIC LIVING COLLECTION",
    heroHeading: "Where Living Flora <br><em>Meets Sculptural Form</em>",
    heroText: "Lumina Botanica curates bespoke living ecosystems, botanical installations, and sensory botanical architecture for discerning residences, museums, and private sanctuaries worldwide.",
    btnExplore: "EXPLORE SPECIMENS",
    bloomTrigger: "TRIGGER BLOOM",
    artBadge: "N° 084 // HERITAGE",
    artCaption: "Cultivated under micro-climate glasshouse chambers in Kyoto",
    growthLabel: "VITALITY RATING",
    growthVal: "99.4% OPTIMAL",
    quoteText: "“To design with nature is not merely to bring green indoors, but to honor the quiet, slow cadence of the living earth.”",
    quoteCite: "— Astrid Vance, Master Botanist & Founder",
    m1Lbl: "Heritage Species Preserved",
    m2Lbl: "Regenerative Soil Systems",
    m3Lbl: "Global Architectural Sanctuaries",
    herbSub: "ARCHIVE & SELECTIONS",
    herbHead: "The Curated Herbarium",
    fpAll: "ALL COLLECTIONS",
    fpFlora: "RARE FLORA",
    fpFoliage: "SCULPTURAL FOLIAGE",
    fpArom: "SACRED AROMATICS",
    sp1Desc: "Architectural white bird of paradise featuring statuesque emerald fronds and pure crystalline bracts.",
    sp1Origin: "ORIGIN: SOUTH AFRICA",
    sp1Tag: "RARE SEEDLING",
    sp2Title: "Phalaenopsis Bellina Orchid",
    sp2Desc: "Wild scented orchid exhibiting magenta petals with gradient citrus-lime margins and intoxicating fragrance.",
    sp2Origin: "ORIGIN: BORNEO",
    sp2Tag: "FRAGRANT",
    sp3Title: "Santalum Album (Sandalwood)",
    sp3Desc: "Sustainably propagated sacred sandalwood trees producing meditative, balsamic heartwood oils.",
    sp3Origin: "ORIGIN: SOUTHERN INDIA",
    sp3Tag: "HERITAGE",
    sp4Title: "Nelumbo Nucifera 'Celestial'",
    sp4Desc: "Sacred aquatic lotus revered for its self-cleaning superhydrophobic leaves and multi-layered petals.",
    sp4Origin: "ORIGIN: MEKONG DELTA",
    sp4Tag: "AQUATIC",
    sancTag: "BESPOKE ARCHITECTURAL INSTALLATIONS",
    sancHeading: "Bring Ancient Forests Into High Architecture",
    sancDesc: "Our horticultural architects blend indoor microclimates, automated nutrient misting, and museum-grade circadian illumination to sustain thriving vertical forests in private penthouses and cultural foundations.",
    quoteInput: "Enter your email for private portfolio access...",
    subscribeBtn: "REQUEST INQUIRY",
    confirmMsg: "Thank you for your inquiry. Our curator will be in contact shortly.",
    ftBrandDesc: "Horticultural Atelier & Biophilic Architecture",
    ftHAteliers: "ATELIERS",
    ftHEditions: "EDITIONS",
    ftEd1: "The Biophilic Journal",
    ftEd2: "Conservation Monograph",
    ftEd3: "Rare Seed Register",
    ftCopy: "© 2026 LUMINA BOTANICA ATELIER. DEDICATED TO PRESERVING EARTH'S BOTANICAL TREASURES."
  }
};

let currentLang = localStorage.getItem('site_lang') || 'ru';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('site_lang', lang);
  document.documentElement.lang = lang;

  const d = i18n[lang] || i18n.ru;
  document.title = d.docTitle;

  const bSub = document.getElementById('brandSub');
  if (bSub) bSub.textContent = d.brandSub;

  const nP = document.getElementById('navPhil');
  if (nP) nP.textContent = d.navPhil;
  const nH = document.getElementById('navHerb');
  if (nH) nH.textContent = d.navHerb;
  const nS = document.getElementById('navSpaces');
  if (nS) nS.textContent = d.navSpaces;
  const nC = document.getElementById('navContact');
  if (nC) nC.textContent = d.navContact;

  const mDay = document.getElementById('moodDay');
  if (mDay) mDay.textContent = d.moodDay;
  const mDusk = document.getElementById('moodDusk');
  if (mDusk) mDusk.textContent = d.moodDusk;
  const mNight = document.getElementById('moodNight');
  if (mNight) mNight.textContent = d.moodNight;

  const aLbl = document.getElementById('audioLabel');
  if (aLbl) aLbl.textContent = isAudioPlaying ? d.audioOn : d.audioOff;

  const hLbl = document.getElementById('hubLabel');
  if (hLbl) hLbl.textContent = d.hub;

  const hTag = document.getElementById('heroTag');
  if (hTag) hTag.textContent = d.heroTag;
  const hHead = document.getElementById('heroHeading');
  if (hHead) hHead.innerHTML = d.heroHeading;
  const hText = document.getElementById('heroText');
  if (hText) hText.textContent = d.heroText;

  const bExp = document.getElementById('btnExplore');
  if (bExp) bExp.textContent = d.btnExplore;
  const bBloom = document.getElementById('bloomTrigger');
  if (bBloom) bBloom.textContent = d.bloomTrigger;

  const aBadge = document.getElementById('artBadge');
  if (aBadge) aBadge.textContent = d.artBadge;
  const aCap = document.getElementById('artCaption');
  if (aCap) aCap.textContent = d.artCaption;
  const gLbl = document.getElementById('growthLabel');
  if (gLbl) gLbl.textContent = d.growthLabel;
  const gVal = document.getElementById('growthVal');
  if (gVal) gVal.textContent = d.growthVal;

  const qTxt = document.getElementById('quoteText');
  if (qTxt) qTxt.textContent = d.quoteText;
  const qCit = document.getElementById('quoteCite');
  if (qCit) qCit.textContent = d.quoteCite;

  const m1 = document.getElementById('m1Lbl');
  if (m1) m1.textContent = d.m1Lbl;
  const m2 = document.getElementById('m2Lbl');
  if (m2) m2.textContent = d.m2Lbl;
  const m3 = document.getElementById('m3Lbl');
  if (m3) m3.textContent = d.m3Lbl;

  const hSub = document.getElementById('herbSub');
  if (hSub) hSub.textContent = d.herbSub;
  const hHd = document.getElementById('herbHead');
  if (hHd) hHd.textContent = d.herbHead;

  const fpA = document.getElementById('fpAll');
  if (fpA) fpA.textContent = d.fpAll;
  const fpFl = document.getElementById('fpFlora');
  if (fpFl) fpFl.textContent = d.fpFlora;
  const fpFo = document.getElementById('fpFoliage');
  if (fpFo) fpFo.textContent = d.fpFoliage;
  const fpAr = document.getElementById('fpArom');
  if (fpAr) fpAr.textContent = d.fpArom;

  const sp1D = document.getElementById('sp1Desc');
  if (sp1D) sp1D.textContent = d.sp1Desc;
  const sp1O = document.getElementById('sp1Origin');
  if (sp1O) sp1O.textContent = d.sp1Origin;
  const sp1T = document.getElementById('sp1Tag');
  if (sp1T) sp1T.textContent = d.sp1Tag;

  const sp2T = document.getElementById('sp2Title');
  if (sp2T) sp2T.textContent = d.sp2Title;
  const sp2D = document.getElementById('sp2Desc');
  if (sp2D) sp2D.textContent = d.sp2Desc;
  const sp2O = document.getElementById('sp2Origin');
  if (sp2O) sp2O.textContent = d.sp2Origin;
  const sp2Tg = document.getElementById('sp2Tag');
  if (sp2Tg) sp2Tg.textContent = d.sp2Tag;

  const sp3T = document.getElementById('sp3Title');
  if (sp3T) sp3T.textContent = d.sp3Title;
  const sp3D = document.getElementById('sp3Desc');
  if (sp3D) sp3D.textContent = d.sp3Desc;
  const sp3O = document.getElementById('sp3Origin');
  if (sp3O) sp3O.textContent = d.sp3Origin;
  const sp3Tg = document.getElementById('sp3Tag');
  if (sp3Tg) sp3Tg.textContent = d.sp3Tag;

  const sp4T = document.getElementById('sp4Title');
  if (sp4T) sp4T.textContent = d.sp4Title;
  const sp4D = document.getElementById('sp4Desc');
  if (sp4D) sp4D.textContent = d.sp4Desc;
  const sp4O = document.getElementById('sp4Origin');
  if (sp4O) sp4O.textContent = d.sp4Origin;
  const sp4Tg = document.getElementById('sp4Tag');
  if (sp4Tg) sp4Tg.textContent = d.sp4Tag;

  const scTg = document.getElementById('sancTag');
  if (scTg) scTg.textContent = d.sancTag;
  const scHd = document.getElementById('sancHeading');
  if (scHd) scHd.textContent = d.sancHeading;
  const scDc = document.getElementById('sancDesc');
  if (scDc) scDc.textContent = d.sancDesc;
  const qInp = document.getElementById('quoteInput');
  if (qInp) qInp.placeholder = d.quoteInput;
  const subBtn = document.getElementById('subscribeBtn');
  if (subBtn) subBtn.textContent = d.subscribeBtn;

  const ftBD = document.getElementById('ftBrandDesc');
  if (ftBD) ftBD.textContent = d.ftBrandDesc;
  const ftHA = document.getElementById('ftHAteliers');
  if (ftHA) ftHA.textContent = d.ftHAteliers;
  const ftHE = document.getElementById('ftHEditions');
  if (ftHE) ftHE.textContent = d.ftHEditions;
  const ftE1 = document.getElementById('ftEd1');
  if (ftE1) ftE1.textContent = d.ftEd1;
  const ftE2 = document.getElementById('ftEd2');
  if (ftE2) ftE2.textContent = d.ftEd2;
  const ftE3 = document.getElementById('ftEd3');
  if (ftE3) ftE3.textContent = d.ftEd3;
  const ftCp = document.getElementById('ftCopy');
  if (ftCp) ftCp.textContent = d.ftCopy;

  document.querySelectorAll('#langToggle .lang-opt').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.langOpt === lang);
  });
}

function initLanguage() {
  const toggleBtn = document.getElementById('langToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      applyLanguage(currentLang === 'ru' ? 'en' : 'ru');
      playChimeNote(528);
    });
  }
  applyLanguage(currentLang);
}

// ------------------------------------------
// 3. Silky Scroll Reveal
// ------------------------------------------
function initScrollReveal() {
  const elements = document.querySelectorAll('.specimen-card, .philosophy-quote, .metric-card, .sanctuary-box');
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, idx * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

// ------------------------------------------
// 4. Custom Magnetic Cursor
// ------------------------------------------
function initMagneticCursor() {
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const cursorText = cursorRing?.querySelector('.cursor-text');
  if (!cursorDot || !cursorRing) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(renderRing);
  }
  renderRing();

  document.querySelectorAll('[data-cursor]').forEach(item => {
    item.addEventListener('mouseenter', () => {
      cursorRing.classList.add('active');
      if (cursorText) {
        cursorText.innerText = item.dataset.cursor;
      }
    });
    item.addEventListener('mouseleave', () => {
      cursorRing.classList.remove('active');
      if (cursorText) {
        cursorText.innerText = '';
      }
    });
  });
}

// ------------------------------------------
// 5. Lighting Mood Switcher
// ------------------------------------------
function initMoodSwitcher() {
  const moodBtns = document.querySelectorAll('.mood-btn');
  const body = document.body;

  moodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      moodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mood = btn.dataset.mood;
      body.classList.remove('mood-dusk', 'mood-night');

      if (mood === 'dusk') {
        body.classList.add('mood-dusk');
      } else if (mood === 'night') {
        body.classList.add('mood-night');
      }

      playChimeNote(660);
      if (window.bloomSporePulse) window.bloomSporePulse();
    });
  });
}

// ------------------------------------------
// 6. Curated Herbarium Category Filters
// ------------------------------------------
function initHerbariumFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.specimen-card');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
      playChimeNote(440);
    });
  });
}

// ------------------------------------------
// 7. Interactive Bloom Trigger
// ------------------------------------------
function initBloomExperience() {
  const bloomBtn = document.getElementById('bloomTrigger');
  const photo = document.getElementById('heroBotanicalPhoto');

  bloomBtn?.addEventListener('click', () => {
    if (photo) {
      photo.style.transform = 'scale(1.08)';
      photo.style.filter = 'brightness(1.2) contrast(1.15) saturate(1.25)';
      setTimeout(() => {
        photo.style.transform = '';
        photo.style.filter = '';
      }, 1400);
    }
    if (window.bloomSporePulse) {
      window.bloomSporePulse();
    }
    playChimeChord();
  });
}

// ------------------------------------------
// 8. Solfeggio Wind Chime Audio Engine
// ------------------------------------------
let audioCtx = null;
let isAudioPlaying = false;
let chimeInterval = null;
const frequencies = [396, 417, 528, 639, 741, 852];

function initChimeAudio() {
  const audioBtn = document.getElementById('audioToggle');
  const audioText = document.getElementById('audioLabel');

  audioBtn?.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isAudioPlaying = !isAudioPlaying;
    if (isAudioPlaying) {
      audioBtn.classList.add('active');
      if (audioText) audioText.textContent = currentLang === 'ru' ? 'ЗВУК: ВКЛ' : 'CHIMES: ON';
      playChimeChord();
      chimeInterval = setInterval(() => {
        const randFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
        playChimeNote(randFreq);
      }, 2600);
    } else {
      audioBtn.classList.remove('active');
      if (audioText) audioText.textContent = currentLang === 'ru' ? 'КОЛОКОЛЬЧИКИ' : 'CHIMES';
      clearInterval(chimeInterval);
    }
  });
}

function playChimeNote(freq) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 2.6);
}

function playChimeChord() {
  [528, 639, 852].forEach((f, i) => {
    setTimeout(() => playChimeNote(f), i * 180);
  });
}

// ------------------------------------------
// 9. Sanctuary Private Inquiry Form
// ------------------------------------------
function initInquiryForm() {
  const btn = document.getElementById('subscribeBtn');
  const input = document.getElementById('quoteInput');
  const msg = document.getElementById('confirmMsg');

  btn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (input && input.value.includes('@')) {
      const d = i18n[currentLang] || i18n.ru;
      msg.textContent = d.confirmMsg;
      msg.style.display = 'block';
      input.value = '';
      playChimeChord();
      setTimeout(() => {
        msg.style.display = 'none';
      }, 5000);
    } else if (input) {
      input.style.borderColor = 'var(--accent-clay)';
      setTimeout(() => {
        input.style.borderColor = '';
      }, 2000);
    }
  });
}

// Biophilic Scroll Reveal Observer
function initBotanicaScrollReveal() {
  const elements = document.querySelectorAll('.specimen-card, .editorial-manifesto, .sensory-station, .quote-banner, .botanical-footer, .art-frame');
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
    el.classList.add('scroll-reveal-botanica');
    observer.observe(el);
  });
}
