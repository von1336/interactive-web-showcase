// ==========================================
// CHRONOCRAFT - Swiss Haute Horlogerie Engine
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initWatchMovementCanvas();
  initLanguage();
  initHorologyAudio();
  initPrecisionStopwatch();
  initEditionTabs();
  init3DCardTilt();
});

// ------------------------------------------
// 1. Live Mechanical Watch Canvas Simulation (Haute Horlogerie Edition)
// ---------------------------------------------------------------------
let isExploded = false;

function initWatchMovementCanvas() {
  const canvas = document.getElementById('watchCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const logicalSize = 460;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = logicalSize * dpr;
  canvas.height = logicalSize * dpr;
  canvas.style.width = logicalSize + 'px';
  canvas.style.height = logicalSize + 'px';

  const center = logicalSize / 2;

  // Animation states
  let balanceAngle = 0;
  let balanceSpeed = 0.28;
  let gearAngle = 0;
  let explodedProgress = 0;
  let mouseGlareX = 0;
  let mouseGlareY = 0;
  let curGlareX = 0;
  let curGlareY = 0;

  // Track cursor for dynamic sapphire AR lens reflection
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseGlareX = ((e.clientX - rect.left) / logicalSize - 0.5) * 2;
    mouseGlareY = ((e.clientY - rect.top) / logicalSize - 0.5) * 2;
  });

  canvas.addEventListener('mouseleave', () => {
    mouseGlareX = 0;
    mouseGlareY = 0;
  });

  // Helper: Draw synthetic corundum ruby in gold chaton with blued screws
  function drawJewelChaton(x, y, radius, withScrews = true) {
    ctx.save();
    ctx.translate(x, y);

    // Gold chaton housing
    const chatonGrad = ctx.createRadialGradient(0, 0, radius * 0.4, 0, 0, radius * 1.8);
    chatonGrad.addColorStop(0, '#fef08a');
    chatonGrad.addColorStop(0.6, '#dfb17b');
    chatonGrad.addColorStop(1, '#926127');
    ctx.fillStyle = chatonGrad;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#5a3a14';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Fixing blued screws around chaton
    if (withScrews) {
      for (let s = 0; s < 3; s++) {
        const sa = (s * Math.PI * 2) / 3 + 0.4;
        const sx = Math.cos(sa) * (radius * 1.4);
        const sy = Math.sin(sa) * (radius * 1.4);
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(sx, sy, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#1e3a8a';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(sx - 1.2, sy);
        ctx.lineTo(sx + 1.2, sy);
        ctx.stroke();
      }
    }

    // Corundum Ruby Jewel
    const rubyGrad = ctx.createRadialGradient(-radius * 0.3, -radius * 0.3, radius * 0.1, 0, 0, radius);
    rubyGrad.addColorStop(0, '#fda4af');
    rubyGrad.addColorStop(0.35, '#e11d48');
    rubyGrad.addColorStop(0.8, '#881337');
    rubyGrad.addColorStop(1, '#4c0519');
    ctx.fillStyle = rubyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // Specular highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(-radius * 0.35, -radius * 0.35, radius * 0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Helper: Draw Côtes de Genève (Geneva Stripes) on a bridge
  function applyGenevaWaves(clipFn, xOffset = 0, yOffset = 0) {
    ctx.save();
    clipFn();
    ctx.clip();
    const stripeWidth = 14;
    for (let x = -200; x < 200; x += stripeWidth) {
      const g = ctx.createLinearGradient(x + xOffset, 0, x + stripeWidth + xOffset, 0);
      g.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
      g.addColorStop(0.48, 'rgba(255, 255, 255, 0.14)');
      g.addColorStop(0.52, 'rgba(0, 0, 0, 0.15)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0.04)');
      ctx.fillStyle = g;
      ctx.fillRect(x + xOffset, -200 + yOffset, stripeWidth, 400);
    }
    ctx.restore();
  }

  function drawDial() {
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, logicalSize, logicalSize);

    // Smooth lerps
    const targetExploded = isExploded ? 1 : 0;
    explodedProgress += (targetExploded - explodedProgress) * 0.075;
    curGlareX += (mouseGlareX - curGlareX) * 0.06;
    curGlareY += (mouseGlareY - curGlareY) * 0.06;

    const exp = explodedProgress;

    // -------------------------------------------------------------
    // Layer 0: Case Outer Rim & 18k Rose Gold / Titanium Bezel
    // -------------------------------------------------------------
    // Outer Titanium Grade-5 Shadow & Bevel
    const caseGrad = ctx.createRadialGradient(center, center, center - 40, center, center, center);
    caseGrad.addColorStop(0, '#12151e');
    caseGrad.addColorStop(0.7, '#1b202e');
    caseGrad.addColorStop(0.92, '#2b334a');
    caseGrad.addColorStop(0.98, '#0d0f17');
    caseGrad.addColorStop(1, '#050608');
    ctx.fillStyle = caseGrad;
    ctx.beginPath();
    ctx.arc(center, center, center - 2, 0, Math.PI * 2);
    ctx.fill();

    // 18k Rose Gold Accent Ring
    ctx.save();
    ctx.lineWidth = 2.5;
    const goldRing = ctx.createLinearGradient(0, 0, logicalSize, logicalSize);
    goldRing.addColorStop(0, '#fef08a');
    goldRing.addColorStop(0.3, '#dfb17b');
    goldRing.addColorStop(0.7, '#8e5c26');
    goldRing.addColorStop(1, '#fce0ad');
    ctx.strokeStyle = goldRing;
    ctx.beginPath();
    ctx.arc(center, center, center - 14, 0, Math.PI * 2);
    ctx.stroke();

    // 12 Titanium Bezel Screws (Hour alignment)
    for (let h = 0; h < 12; h++) {
      const ang = (h * Math.PI * 2) / 12;
      const sx = center + Math.cos(ang) * (center - 9);
      const sy = center + Math.sin(ang) * (center - 9);

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(ang + 0.4); // Realistic varied slot angles

      // Screw head
      const scrGrad = ctx.createLinearGradient(-3, -3, 3, 3);
      scrGrad.addColorStop(0, '#e2e8f0');
      scrGrad.addColorStop(0.5, '#64748b');
      scrGrad.addColorStop(1, '#334155');
      ctx.fillStyle = scrGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Slot
      ctx.strokeStyle = '#090d16';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-2.4, 0);
      ctx.lineTo(2.4, 0);
      ctx.stroke();

      ctx.restore();
    }
    ctx.restore();

    // -------------------------------------------------------------
    // Layer 1: Recessed Chapter Ring / Tachymeter & Caliper Track
    // -------------------------------------------------------------
    ctx.save();
    ctx.translate(center, center);

    // Deep Rehaut Shadow
    const rehautGrad = ctx.createRadialGradient(0, 0, center - 55, 0, 0, center - 16);
    rehautGrad.addColorStop(0, '#090b10');
    rehautGrad.addColorStop(0.85, '#121520');
    rehautGrad.addColorStop(1, '#050609');
    ctx.fillStyle = rehautGrad;
    ctx.beginPath();
    ctx.arc(0, 0, center - 16, 0, Math.PI * 2);
    ctx.fill();

    // Precision 1/5th Second Ticks (COSC 4Hz Caliper)
    for (let t = 0; t < 300; t++) {
      const isFullSec = t % 5 === 0;
      const isFiveSec = t % 25 === 0;
      ctx.beginPath();
      ctx.lineWidth = isFiveSec ? 2.5 : (isFullSec ? 1.4 : 0.6);
      ctx.strokeStyle = isFiveSec ? '#dfb17b' : (isFullSec ? 'rgba(223, 177, 123, 0.7)' : 'rgba(223, 177, 123, 0.25)');
      const outerR = center - 18;
      const innerR = isFiveSec ? center - 34 : (isFullSec ? center - 28 : center - 23);
      ctx.moveTo(0, -outerR);
      ctx.lineTo(0, -innerR);
      ctx.stroke();
      ctx.rotate((Math.PI * 2) / 300);
    }

    // 12 Applied Faceted Hour Batons with Super-LumiNova
    for (let h = 0; h < 12; h++) {
      ctx.save();
      ctx.rotate((h * Math.PI * 2) / 12);
      const isCardinal = h % 3 === 0;
      const bw = isCardinal ? 6 : 4;
      const bh = isCardinal ? 16 : 12;
      const by = -(center - 36);

      // Gold Baton Body with shadow
      ctx.fillStyle = '#dfb17b';
      ctx.fillRect(-bw / 2, by, bw, bh);

      // Super-LumiNova white luminescent core
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-bw / 2 + 1, by + 1.5, bw - 2, bh - 3);

      ctx.restore();
    }

    ctx.restore();

    // -------------------------------------------------------------
    // Layer 2: Skeleton Movement Architecture (Geneva Waves & Bridges)
    // -------------------------------------------------------------
    const bridgeYOffset = exp * 18;

    ctx.save();
    ctx.translate(center, center);

    // Deep movement cavity
    const cavityGrad = ctx.createRadialGradient(0, 0, 30, 0, 0, center - 45);
    cavityGrad.addColorStop(0, '#0a0d14');
    cavityGrad.addColorStop(0.7, '#07080d');
    cavityGrad.addColorStop(1, '#020304');
    ctx.fillStyle = cavityGrad;
    ctx.beginPath();
    ctx.arc(0, 0, center - 42, 0, Math.PI * 2);
    ctx.fill();

    // Upper Barrel & Train Bridge (Top Arch)
    ctx.save();
    ctx.translate(0, -bridgeYOffset);

    function clipTopBridge() {
      ctx.beginPath();
      ctx.moveTo(-120, -40);
      ctx.bezierCurveTo(-110, -140, 110, -140, 120, -40);
      ctx.bezierCurveTo(80, -20, 50, -60, 0, -60);
      ctx.bezierCurveTo(-50, -60, -80, -20, -120, -40);
      ctx.closePath();
    }

    // Bridge metal fill
    ctx.fillStyle = '#1e2433';
    clipTopBridge();
    ctx.fill();

    // Apply Côtes de Genève stripes
    applyGenevaWaves(clipTopBridge, 0, -bridgeYOffset);

    // Mirror polished hand-anglage edge
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.6;
    clipTopBridge();
    ctx.stroke();

    // Rubies & screws on top bridge
    drawJewelChaton(-60, -85, 4.5);
    drawJewelChaton(60, -85, 4.5);
    drawJewelChaton(0, -95, 5);

    // Calibre Inscription in Gold
    ctx.font = '600 8px "Cinzel", serif, sans-serif';
    ctx.fillStyle = '#dfb17b';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '2px';
    ctx.fillText('CHRONOCRAFT • CAL. CC-9800 S', 0, -74);
    ctx.font = '500 6.5px sans-serif';
    ctx.fillStyle = 'rgba(223, 177, 123, 0.6)';
    ctx.fillText('48 JEWELS • FIVE (5) POSITIONS ADJUSTED', 0, -64);

    ctx.restore(); // end top bridge

    // -------------------------------------------------------------
    // Layer 3: Interlocking Mechanical Gear Trains
    // -------------------------------------------------------------
    gearAngle += 0.015;

    // 1. Mainspring Barrel Gear (Top-Left, 10 o'clock)
    ctx.save();
    ctx.translate(-55, -55 - bridgeYOffset * 0.5);
    ctx.rotate(gearAngle * 0.4);

    // Barrel Rim with golden teeth
    ctx.fillStyle = '#c8995a';
    ctx.beginPath();
    ctx.arc(0, 0, 48, 0, Math.PI * 2);
    ctx.fill();

    // Skeleton cutouts (spiral turbine arms)
    ctx.fillStyle = '#0a0d14';
    for (let a = 0; a < 6; a++) {
      ctx.beginPath();
      ctx.arc(Math.cos((a * Math.PI) / 3) * 25, Math.sin((a * Math.PI) / 3) * 25, 12, 0, Math.PI * 2);
      ctx.fill();
    }
    // Gear teeth
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    for (let gt = 0; gt < 24; gt++) {
      ctx.save();
      ctx.rotate((gt * Math.PI * 2) / 24);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(-1.5, -51, 3, 5);
      ctx.restore();
    }
    drawJewelChaton(0, 0, 4, false);
    ctx.restore();

    // 2. Center & Third Wheel (Top-Right, 2 o'clock)
    ctx.save();
    ctx.translate(65, -45 - bridgeYOffset * 0.5);
    ctx.rotate(-gearAngle * 0.8);

    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(0, 0, 38, 0, Math.PI * 2);
    ctx.fill();

    // Cutout spokes
    ctx.fillStyle = '#0a0d14';
    for (let b = 0; b < 5; b++) {
      ctx.beginPath();
      ctx.arc(Math.cos((b * Math.PI * 2) / 5) * 19, Math.sin((b * Math.PI * 2) / 5) * 19, 9, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let gt = 0; gt < 20; gt++) {
      ctx.save();
      ctx.rotate((gt * Math.PI * 2) / 20);
      ctx.fillStyle = '#fce0ad';
      ctx.fillRect(-1.2, -41, 2.4, 4.5);
      ctx.restore();
    }
    drawJewelChaton(0, 0, 3.5, false);
    ctx.restore();

    ctx.restore(); // end movement baseplate translate

    // -------------------------------------------------------------
    // Layer 4: Haute Horlogerie Flying Tourbillon (at 6 o'clock)
    // -------------------------------------------------------------
    const tourbY = center + 78 + (exp * 38);
    ctx.save();
    ctx.translate(center, tourbY);

    // Tourbillon Chamber Aperture (Recessed Beveled Chasm)
    const tbHole = ctx.createRadialGradient(0, 0, 40, 0, 0, 72);
    tbHole.addColorStop(0, '#020305');
    tbHole.addColorStop(0.85, '#080a11');
    tbHole.addColorStop(1, '#dfb17b');
    ctx.fillStyle = tbHole;
    ctx.beginPath();
    ctx.arc(0, 0, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(223, 177, 123, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Tourbillon Carriage 60-Second Rotation (1 RPM = 0.1047 rad/sec)
    const nowForTourb = new Date();
    const tourbCarriageAngle = ((nowForTourb.getSeconds() + nowForTourb.getMilliseconds() / 1000) / 60) * Math.PI * 2;

    // High frequency Balance Wheel Oscillation (4Hz = 8 beats/sec)
    balanceAngle += balanceSpeed;
    const oscOffset = Math.sin(balanceAngle) * 0.85;

    // 1. Escapement Wheel & Ruby Pallet Fork beneath balance
    ctx.save();
    ctx.rotate(tourbCarriageAngle * 3);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    for (let ew = 0; ew < 15; ew++) {
      ctx.save();
      ctx.rotate((ew * Math.PI * 2) / 15);
      ctx.fillStyle = '#0284c7';
      // Hooked escape teeth
      ctx.beginPath();
      ctx.moveTo(-1, -30);
      ctx.lineTo(3, -33);
      ctx.lineTo(0, -36);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    // 2. Glucydur Gold Balance Wheel with Perimeter Regulating Screws
    ctx.save();
    ctx.rotate(oscOffset);

    // Solid Gold Rim
    ctx.lineWidth = 3.2;
    const goldGrad = ctx.createLinearGradient(-50, -50, 50, 50);
    goldGrad.addColorStop(0, '#fef08a');
    goldGrad.addColorStop(0.5, '#dfb17b');
    goldGrad.addColorStop(1, '#b45309');
    ctx.strokeStyle = goldGrad;
    ctx.beginPath();
    ctx.arc(0, 0, 54, 0, Math.PI * 2);
    ctx.stroke();

    // 16 Micro-Regulating Gold Weight Screws
    for (let ms = 0; ms < 16; ms++) {
      const ma = (ms * Math.PI * 2) / 16;
      const mx = Math.cos(ma) * 54;
      const my = Math.sin(ma) * 54;
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(mx, my, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // 3 Aerodynamic Curved Balance Spokes
    for (let sp = 0; sp < 3; sp++) {
      ctx.save();
      ctx.rotate((sp * Math.PI * 2) / 3);
      ctx.beginPath();
      ctx.lineWidth = 2.8;
      ctx.strokeStyle = '#dfb17b';
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(8, 18, 12, 36, 0, 54);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Blued Steel Breguet Overcoil Hairspring (Pulsating)
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = '#38bdf8';
    const springTurns = 6.5;
    const breathingFactor = 1 + Math.sin(balanceAngle) * 0.08;
    for (let a = 0; a < Math.PI * 2 * springTurns; a += 0.08) {
      const r = ((a / (Math.PI * 2 * springTurns)) * 30 + 3) * breathingFactor;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    ctx.restore(); // end balance wheel rotation

    // 4. Titanium Flying Tourbillon Cage Carriage (Rotates with 60-second hand)
    ctx.save();
    ctx.rotate(tourbCarriageAngle);

    // 3 Titanium Cage Arms with High Polish Chamfers
    for (let ca = 0; ca < 3; ca++) {
      ctx.save();
      ctx.rotate((ca * Math.PI * 2) / 3);
      // Arm body
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(-3, 0);
      ctx.lineTo(-6, 42);
      ctx.lineTo(0, 58);
      ctx.lineTo(6, 42);
      ctx.lineTo(3, 0);
      ctx.closePath();
      ctx.fill();
      // Mirror bevel
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Blued counterpoise at tip
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.arc(0, 50, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Tourbillon Center Jewel Cap
    drawJewelChaton(0, 0, 4.2);
    ctx.restore(); // end cage rotation

    // Lower Bridge Anglage Support Bar
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-68, 0);
    ctx.lineTo(-35, 0);
    ctx.moveTo(35, 0);
    ctx.lineTo(68, 0);
    ctx.stroke();
    drawJewelChaton(-50, 0, 3, false);
    drawJewelChaton(50, 0, 3, false);

    ctx.restore(); // end tourbillon translate

    // -------------------------------------------------------------
    // Layer 5: 3D Faceted Dauphine Hands with Cast Depth Shadows
    // -------------------------------------------------------------
    ctx.save();
    ctx.translate(center, center - (exp * 22));

    const now = new Date();
    const secVal = now.getSeconds() + now.getMilliseconds() / 1000;
    const minVal = now.getMinutes() + secVal / 60;
    const hourVal = (now.getHours() % 12) + minVal / 60;

    const secAngle = (secVal / 60) * Math.PI * 2;
    const minAngle = (minVal / 60) * Math.PI * 2;
    const hourAngle = (hourVal / 12) * Math.PI * 2;

    // Helper to draw 3D Faceted Dauphine Hand (Split Light / Dark sides)
    function draw3DFacetedHand(length, baseWidth, lightColor, darkColor) {
      // Realistic Drop Shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
      ctx.shadowBlur = 12 * (1 + exp);
      ctx.shadowOffsetX = 5 + exp * 6;
      ctx.shadowOffsetY = 7 + exp * 6;

      // Overall Hand Silhouette for Shadow
      ctx.beginPath();
      ctx.moveTo(0, 14);
      ctx.lineTo(-baseWidth, 0);
      ctx.lineTo(0, -length);
      ctx.lineTo(baseWidth, 0);
      ctx.closePath();
      ctx.fillStyle = '#000000';
      ctx.fill();
      ctx.restore();

      // Left Facet (Light Reflected Side)
      const lightGrad = ctx.createLinearGradient(-baseWidth, 0, 0, 0);
      lightGrad.addColorStop(0, '#fef9c3');
      lightGrad.addColorStop(1, lightColor);
      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.moveTo(0, 14);
      ctx.lineTo(-baseWidth, 0);
      ctx.lineTo(0, -length);
      ctx.lineTo(0, 14);
      ctx.fill();

      // Right Facet (Beveled Shadow Side)
      const darkGrad = ctx.createLinearGradient(0, 0, baseWidth, 0);
      darkGrad.addColorStop(0, darkColor);
      darkGrad.addColorStop(1, '#5a350c');
      ctx.fillStyle = darkGrad;
      ctx.beginPath();
      ctx.moveTo(0, 14);
      ctx.lineTo(baseWidth, 0);
      ctx.lineTo(0, -length);
      ctx.lineTo(0, 14);
      ctx.fill();

      // Center Ridge Highlight Line
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, 12);
      ctx.lineTo(0, -length + 4);
      ctx.stroke();

      // Super-LumiNova Central Inlay
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(-baseWidth * 0.45, -28);
      ctx.lineTo(0, -length * 0.72);
      ctx.lineTo(baseWidth * 0.45, -28);
      ctx.closePath();
      ctx.fill();
    }

    // 1. Hour Hand (3D Faceted Dauphine)
    ctx.save();
    ctx.rotate(hourAngle);
    draw3DFacetedHand(96, 7.5, '#dfb17b', '#925a1e');
    ctx.restore();

    // 2. Minute Hand (3D Faceted Dauphine)
    ctx.save();
    ctx.rotate(minAngle);
    draw3DFacetedHand(146, 6.5, '#f5d09f', '#9b6526');
    ctx.restore();

    // 3. Central Sweep Seconds Needle (Flame-Blued / Crimson)
    ctx.save();
    ctx.rotate(secAngle);
    // Cast shadow
    ctx.save();
    ctx.shadowColor = 'rgba(239, 68, 68, 0.4)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 4;

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, 26);
    ctx.lineTo(0, -170);
    ctx.stroke();

    // Diamond Counterweight
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.lineTo(-4.5, 22);
    ctx.lineTo(0, 29);
    ctx.lineTo(4.5, 22);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.restore();

    // 4. Central Rose Gold Cannon Pinion Cap & Ruby
    drawJewelChaton(0, 0, 4.5);

    ctx.restore(); // end hands translate

    // -------------------------------------------------------------
    // Layer 6: Exploded View Technical Calipers & Annotations
    // -------------------------------------------------------------
    if (exp > 0.05) {
      ctx.save();
      ctx.globalAlpha = Math.min(exp * 1.5, 1);
      ctx.font = '600 8.5px "Space Mono", monospace';
      ctx.fillStyle = '#dfb17b';
      ctx.strokeStyle = 'rgba(223, 177, 123, 0.4)';
      ctx.lineWidth = 0.8;

      // Top Callout: Calibre CC-9800 S
      ctx.beginPath();
      ctx.moveTo(center - 110, center - 130);
      ctx.lineTo(center - 150, center - 150);
      ctx.lineTo(center - 200, center - 150);
      ctx.stroke();
      ctx.textAlign = 'right';
      ctx.fillText('STAGE 01 // CALIBRE CC-9800 S', center - 160, center - 155);

      // Middle Callout: Hands & Canon Pinion
      ctx.beginPath();
      ctx.moveTo(center + 60, center - 40);
      ctx.lineTo(center + 140, center - 70);
      ctx.lineTo(center + 200, center - 70);
      ctx.stroke();
      ctx.textAlign = 'left';
      ctx.fillText('STAGE 02 // 3D DAUPHINE HANDS', center + 145, center - 75);

      // Bottom Callout: Flying Tourbillon
      ctx.beginPath();
      ctx.moveTo(center - 80, tourbY);
      ctx.lineTo(center - 140, tourbY + 30);
      ctx.lineTo(center - 200, tourbY + 30);
      ctx.stroke();
      ctx.textAlign = 'right';
      ctx.fillText('STAGE 03 // 60s FLYING TOURBILLON', center - 145, tourbY + 25);

      ctx.restore();
    }

    // -------------------------------------------------------------
    // Layer 7: Interactive Sapphire Crystal AR Glare Sheen
    // -------------------------------------------------------------
    ctx.save();
    const glareCenterX = center + curGlareX * 45;
    const glareCenterY = center + curGlareY * 45;

    const sapphireGlare = ctx.createRadialGradient(
      glareCenterX - 60,
      glareCenterY - 80,
      10,
      glareCenterX,
      glareCenterY,
      center - 10
    );
    sapphireGlare.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
    sapphireGlare.addColorStop(0.3, 'rgba(147, 197, 253, 0.08)');
    sapphireGlare.addColorStop(0.65, 'rgba(168, 85, 247, 0.04)');
    sapphireGlare.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = sapphireGlare;
    ctx.beginPath();
    ctx.arc(center, center, center - 14, 0, Math.PI * 2);
    ctx.fill();

    // Curved Bevel Reflection Arc
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(center, center, center - 16, Math.PI * 1.05 + curGlareX * 0.2, Math.PI * 1.55 + curGlareX * 0.2);
    ctx.stroke();

    ctx.restore();

    ctx.restore(); // end dpr scale

    requestAnimationFrame(drawDial);
  }

  drawDial();

  // Exploded View Button
  const explodeBtn = document.getElementById('movementExplodeBtn');
  explodeBtn?.addEventListener('click', () => {
    isExploded = !isExploded;
    const d = i18n[currentLang] || i18n.ru;
    explodeBtn.textContent = isExploded ? d.assembleBtn : d.explodeBtn;
    playEscapementClick();
  });
}

// ------------------------------------------
// 2. Language Switcher (RU / EN)
// ------------------------------------------
const i18n = {
  ru: {
    docTitle: "CHRONOCRAFT // Высокое часовое искусство — Женева",
    brandOrigin: "ЖЕНЕВА • МАНУФАКТУРА 1888",
    navCalibre: "КАЛИБР 01",
    navComp: "УСЛОЖНЕНИЯ",
    navChrono: "ХРОНОМЕТР",
    navAtelier: "АТЕЛЬЕ",
    soundOn: "ТИК: ВКЛ",
    soundOff: "ТИК: ВЫКЛ",
    hub: "ХАБ",
    badgeGold: "СЕРТИФИЦИРОВАНО COSC",
    badgeText: "СВЕРХТОЧНЫЙ ХРОНОМЕТР",
    heroTitle: "Архитектура <br><span class='gold-shimmer'>Бесконечного Времени</span>",
    heroDesc: "Отлит из титана Grade-5 и 18-каратного медового золота. Ручное англирование граней, трехосный турбийон и анкерный спуск, совершающий 28 800 полуколебаний в час.",
    lblCalibre: "КАЛИБР",
    lblPower: "ЗАПАС ХОДА",
    valPower: "120 ЧАСОВ",
    lblJewels: "КАМНИ",
    valJewels: "48 РУБИНОВ",
    lblFreq: "ЧАСТОТА",
    valFreq: "4 ГЦ / 28.8K ПК/Ч",
    btnTestChrono: "ТЕСТ ХРОНОМЕТРА",
    explodeBtn: "ВЗРЫВ-СХЕМА КАЛИБРА",
    assembleBtn: "СОБРАТЬ КАЛИБР",
    compSub: "ШЕДЕВРЫ // КОЛЛЕКЦИЯ 2026",
    compHead: "Трилогия высокого часового искусства",
    tabSkel: "01. ТИТАНОВЫЙ СКЕЛЕТОН",
    tabMoon: "02. ЛУННЫЙ КАЛЕНДАРЬ",
    tabStealth: "03. ОБСИДИАНОВАЯ КЕРАМИКА",
    c1Badge: "ЛИМИТИРОВАНО: 25 ЭКЗЕМПЛЯРОВ",
    c1Sub: "Полный мост из сапфирового стекла открывает пульсирующий баланс и золотые регулировочные винты.",
    c1Btn: "КОНФИГУРИРОВАТЬ ЧАСЫ",
    c2Badge: "МЕТЕОРИТНЫЙ ЦИФЕРБЛАТ",
    c2Sub: "Вырезан из подлинного метеорита Гибеон с астрономическим указателем фаз Луны с точностью до 122 лет.",
    c2Btn: "КОНФИГУРИРОВАТЬ ЧАСЫ",
    c3Badge: "УСТОЙЧИВАЯ К ЦАРАПИНАМ КЕРАМИКА",
    c3Sub: "Матовый черный корпус из диоксида циркония с люминесцентными индексами Super-LumiNova BGW9.",
    c3Btn: "КОНФИГУРИРОВАТЬ ЧАСЫ",
    consoleInd: "● ЛАБОРАТОРНЫЙ ТЕСТОВЫЙ СТЕНД",
    consoleHead: "Швейцарский прецизионный тестер хронометров",
    consoleDesc: "Субсекундное измерение времени высокой точности со сглаживанием в реальном времени.",
    timerStart: "СТАРТ",
    timerStop: "СТОП",
    timerLap: "КРУГ / СПЛИТ",
    timerReset: "СБРОС",
    lapsTitle: "ЗАФИКСИРОВАННЫЕ КРУГИ:",
    lapEmpty: "Круги пока не записаны. Нажмите «СТАРТ» и затем «КРУГ».",
    lapPrefix: "КРУГ",
    ftBrandDesc: "Традиционное высокое часовое искусство • Женевское клеймо",
    ftHAtelier: "АТЕЛЬЕ ВРЕМЕНИ",
    ftHManuf: "МАНУФАКТУРА",
    ftP1: "Мануфактура калибров Валь-де-Травер",
    ftP2: "Прецизионный испытательный стенд обсерватории COSC",
    ftCopy: "© 2026 CHRONOCRAFT SA. ВСЕ МЕХАНИЗМЫ СОБРАНЫ И ОТДЕЛАНЫ В ЖЕНЕВЕ."
  },
  en: {
    docTitle: "CHRONOCRAFT // Haute Horlogerie Suisse — Geneva",
    brandOrigin: "GENÈVE • MANUFACTURE 1888",
    navCalibre: "CALIBRE 01",
    navComp: "COMPLICATIONS",
    navChrono: "CHRONOMETER",
    navAtelier: "L'ATELIER",
    soundOn: "TICK: ON",
    soundOff: "TICK: OFF",
    hub: "HUB",
    badgeGold: "COSC CERTIFIED",
    badgeText: "SUPERLATIVE CHRONOMETER",
    heroTitle: "The Architecture <br><span class='gold-shimmer'>Of Infinite Time</span>",
    heroDesc: "Forged in Grade-5 titanium and 18K honey gold. Hand-beveled anglage, triple-axis tourbillon, and an escapement vibrating at 28,800 beats per hour.",
    lblCalibre: "CALIBRE",
    lblPower: "POWER RESERVE",
    valPower: "120 HOURS",
    lblJewels: "JEWELS",
    valJewels: "48 RUBIES",
    lblFreq: "FREQUENCY",
    valFreq: "4 HZ / 28.8K VPH",
    btnTestChrono: "TEST CHRONOMETER",
    explodeBtn: "EXPLODE CALIBRE",
    assembleBtn: "ASSEMBLE CALIBRE",
    compSub: "MASTERPIECES // COLLECTION 2026",
    compHead: "The Haute Horlogerie Trilogy",
    tabSkel: "01. TITANIUM SKELETON",
    tabMoon: "02. CELESTIAL MOONPHASE",
    tabStealth: "03. OBSIDIAN CERAMIC",
    c1Badge: "LIMITED TO 25 PIECES",
    c1Sub: "Full sapphire crystal bridge showing the pulsating balance wheel and gold balance weights.",
    c1Btn: "CONFIGURE TIMEPIECE",
    c2Badge: "METEORITE DIAL",
    c2Sub: "Carved from genuine Gibeon meteorite with an accurate 122-year astronomical moonphase aperture.",
    c2Btn: "CONFIGURE TIMEPIECE",
    c3Badge: "SCRATCH-PROOF CERAMIC",
    c3Sub: "Matte black zirconium dioxide ceramic casing with luminescent Super-LumiNova BGW9 indices.",
    c3Btn: "CONFIGURE TIMEPIECE",
    consoleInd: "● LIVE LABORATORY BENCH",
    consoleHead: "Swiss Precision Chronometer Tester",
    consoleDesc: "Experience real-time sub-second measurement engineered with precision time-dilation smoothing.",
    timerStart: "START",
    timerStop: "STOP",
    timerLap: "SPLIT / LAP",
    timerReset: "RESET",
    lapsTitle: "RECORDED SPLIT INTERVALS:",
    lapEmpty: "No splits recorded yet. Press 'START' and 'SPLIT'.",
    lapPrefix: "LAP",
    ftBrandDesc: "Haute Horlogerie Traditionnelle • Poinçon de Genève",
    ftHAtelier: "ATELIER DU TEMPS",
    ftHManuf: "MANUFACTURE",
    ftP1: "Val-de-Travers Calibre Facility",
    ftP2: "COSC Observatory Precision Test Bench",
    ftCopy: "© 2026 CHRONOCRAFT SA. ALL MOVEMENTS CRAFTED AND FINISHED IN GENEVA."
  }
};

let currentLang = localStorage.getItem('site_lang') || 'ru';

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('site_lang', lang);
  document.documentElement.lang = lang;

  const d = i18n[lang] || i18n.ru;
  document.title = d.docTitle;

  const bOrig = document.getElementById('brandOrigin');
  if (bOrig) bOrig.textContent = d.brandOrigin;

  const nCal = document.getElementById('navCalibre');
  if (nCal) nCal.textContent = d.navCalibre;
  const nCmp = document.getElementById('navComp');
  if (nCmp) nCmp.textContent = d.navComp;
  const nChr = document.getElementById('navChrono');
  if (nChr) nChr.textContent = d.navChrono;
  const nAtl = document.getElementById('navAtelier');
  if (nAtl) nAtl.textContent = d.navAtelier;

  const sLbl = document.getElementById('soundLabel');
  if (sLbl) sLbl.textContent = isAudioActive ? d.soundOn : d.soundOff;

  const hLbl = document.getElementById('hubLabel');
  if (hLbl) hLbl.textContent = d.hub;

  const bgGold = document.getElementById('badgeGold');
  if (bgGold) bgGold.textContent = d.badgeGold;
  const bgTxt = document.getElementById('badgeText');
  if (bgTxt) bgTxt.textContent = d.badgeText;

  const hTitle = document.getElementById('heroTitle');
  if (hTitle) hTitle.innerHTML = d.heroTitle;
  const hDesc = document.getElementById('heroDesc');
  if (hDesc) hDesc.textContent = d.heroDesc;

  const lCal = document.getElementById('lblCalibre');
  if (lCal) lCal.textContent = d.lblCalibre;
  const lPow = document.getElementById('lblPower');
  if (lPow) lPow.textContent = d.lblPower;
  const vPow = document.getElementById('valPower');
  if (vPow) vPow.textContent = d.valPower;
  const lJew = document.getElementById('lblJewels');
  if (lJew) lJew.textContent = d.lblJewels;
  const vJew = document.getElementById('valJewels');
  if (vJew) vJew.textContent = d.valJewels;
  const lFrq = document.getElementById('lblFreq');
  if (lFrq) lFrq.textContent = d.lblFreq;
  const vFrq = document.getElementById('valFreq');
  if (vFrq) vFrq.textContent = d.valFreq;

  const bTest = document.getElementById('btnTestChrono');
  if (bTest) bTest.textContent = d.btnTestChrono;
  const mExp = document.getElementById('movementExplodeBtn');
  if (mExp) mExp.textContent = isExploded ? d.assembleBtn : d.explodeBtn;

  const cSub = document.getElementById('compSub');
  if (cSub) cSub.textContent = d.compSub;
  const cHd = document.getElementById('compHead');
  if (cHd) cHd.textContent = d.compHead;

  const tSk = document.getElementById('tabSkel');
  if (tSk) tSk.textContent = d.tabSkel;
  const tMn = document.getElementById('tabMoon');
  if (tMn) tMn.textContent = d.tabMoon;
  const tSt = document.getElementById('tabStealth');
  if (tSt) tSt.textContent = d.tabStealth;

  const c1B = document.getElementById('c1Badge');
  if (c1B) c1B.textContent = d.c1Badge;
  const c1S = document.getElementById('c1Sub');
  if (c1S) c1S.textContent = d.c1Sub;
  const c1Btn = document.getElementById('c1Btn');
  if (c1Btn) c1Btn.textContent = d.c1Btn;

  const c2B = document.getElementById('c2Badge');
  if (c2B) c2B.textContent = d.c2Badge;
  const c2S = document.getElementById('c2Sub');
  if (c2S) c2S.textContent = d.c2Sub;
  const c2Btn = document.getElementById('c2Btn');
  if (c2Btn) c2Btn.textContent = d.c2Btn;

  const c3B = document.getElementById('c3Badge');
  if (c3B) c3B.textContent = d.c3Badge;
  const c3S = document.getElementById('c3Sub');
  if (c3S) c3S.textContent = d.c3Sub;
  const c3Btn = document.getElementById('c3Btn');
  if (c3Btn) c3Btn.textContent = d.c3Btn;

  const cInd = document.getElementById('consoleInd');
  if (cInd) cInd.textContent = d.consoleInd;
  const cHd2 = document.getElementById('consoleHead');
  if (cHd2) cHd2.textContent = d.consoleHead;
  const cDc = document.getElementById('consoleDesc');
  if (cDc) cDc.textContent = d.consoleDesc;

  const tStBtn = document.getElementById('timerStartBtn');
  if (tStBtn) tStBtn.textContent = d.timerStart;
  const tSpBtn = document.getElementById('timerStopBtn');
  if (tSpBtn) tSpBtn.textContent = d.timerStop;
  const tLpBtn = document.getElementById('timerLapBtn');
  if (tLpBtn) tLpBtn.textContent = d.timerLap;
  const tRsBtn = document.getElementById('timerResetBtn');
  if (tRsBtn) tRsBtn.textContent = d.timerReset;

  const lTitle = document.getElementById('lapsTitle');
  if (lTitle) lTitle.textContent = d.lapsTitle;
  const lEmpty = document.getElementById('lapEmpty');
  if (lEmpty) lEmpty.textContent = d.lapEmpty;

  const ftB = document.getElementById('ftBrandDesc');
  if (ftB) ftB.textContent = d.ftBrandDesc;
  const ftA = document.getElementById('ftHAtelier');
  if (ftA) ftA.textContent = d.ftHAtelier;
  const ftM = document.getElementById('ftHManuf');
  if (ftM) ftM.textContent = d.ftHManuf;
  const ft1 = document.getElementById('ftP1');
  if (ft1) ft1.textContent = d.ftP1;
  const ft2 = document.getElementById('ftP2');
  if (ft2) ft2.textContent = d.ftP2;
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
      playEscapementClick();
    });
  }
  applyLanguage(currentLang);
}

// ------------------------------------------
// 3. Web Audio 4Hz Escapement Pallet Strike
// ------------------------------------------
let audioCtx = null;
let isAudioActive = false;
let tickTimer = null;

function initHorologyAudio() {
  const audioBtn = document.getElementById('horologyAudioBtn');
  const soundLabel = document.getElementById('soundLabel');

  audioBtn?.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isAudioActive = !isAudioActive;
    const d = i18n[currentLang] || i18n.ru;
    if (isAudioActive) {
      soundLabel.innerText = d.soundOn;
      audioBtn.style.borderColor = 'var(--gold-primary)';
      startEscapementTicks();
    } else {
      soundLabel.innerText = d.soundOff;
      audioBtn.style.borderColor = '';
      stopEscapementTicks();
    }
  });
}

function startEscapementTicks() {
  let tickCount = 0;
  tickTimer = setInterval(() => {
    const isHigh = (tickCount % 2 === 0);
    playPalletStrike(isHigh ? 1800 : 1550);
    tickCount++;
  }, 250); // 4Hz = 250ms interval (28,800 bph)
}

function stopEscapementTicks() {
  clearInterval(tickTimer);
}

function playPalletStrike(freq) {
  if (!audioCtx || !isAudioActive) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.025);

  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.025);
}

function playEscapementClick() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(2200, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
  gain.gain.setValueAtTime(0.05, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.04);
}

// ------------------------------------------
// 4. Precision Swiss Chronometer Stopwatch
// ------------------------------------------
function initPrecisionStopwatch() {
  let startTime = 0;
  let elapsedBeforePause = 0;
  let timerInterval = null;
  let isRunning = false;
  let laps = [];

  const digits = document.getElementById('stopwatchDigits');
  const startBtn = document.getElementById('timerStartBtn');
  const stopBtn = document.getElementById('timerStopBtn');
  const lapBtn = document.getElementById('timerLapBtn');
  const resetBtn = document.getElementById('timerResetBtn');
  const lapsList = document.getElementById('lapsList');

  function formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const mins = Math.floor((ms % 3600000) / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const millis = Math.floor((ms % 1000) / 10);

    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(mins)}:${pad(secs)}.<span class="millis">${pad(millis)}</span>`;
  }

  function formatTimePlain(ms) {
    const hours = Math.floor(ms / 3600000);
    const mins = Math.floor((ms % 3600000) / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const millis = Math.floor((ms % 1000) / 10);

    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(mins)}:${pad(secs)}.${pad(millis)}`;
  }

  function update() {
    const now = performance.now();
    const total = elapsedBeforePause + (now - startTime);
    digits.innerHTML = formatTime(total);
  }

  startBtn?.addEventListener('click', () => {
    if (!isRunning) {
      isRunning = true;
      startTime = performance.now();
      timerInterval = setInterval(update, 20);
      startBtn.disabled = true;
      stopBtn.disabled = false;
      lapBtn.disabled = false;
      playEscapementClick();
    }
  });

  stopBtn?.addEventListener('click', () => {
    if (isRunning) {
      isRunning = false;
      clearInterval(timerInterval);
      elapsedBeforePause += performance.now() - startTime;
      startBtn.disabled = false;
      stopBtn.disabled = true;
      lapBtn.disabled = true;
      playEscapementClick();
    }
  });

  lapBtn?.addEventListener('click', () => {
    if (isRunning) {
      const now = performance.now();
      const currentElapsed = elapsedBeforePause + (now - startTime);
      laps.push(currentElapsed);
      renderLaps();
      playEscapementClick();
    }
  });

  resetBtn?.addEventListener('click', () => {
    isRunning = false;
    clearInterval(timerInterval);
    elapsedBeforePause = 0;
    digits.innerHTML = '00:00:00.<span class="millis">00</span>';
    startBtn.disabled = false;
    stopBtn.disabled = true;
    lapBtn.disabled = true;
    laps = [];
    renderLaps();
    playEscapementClick();
  });

  function renderLaps() {
    if (!lapsList) return;
    const d = i18n[currentLang] || i18n.ru;
    if (laps.length === 0) {
      lapsList.innerHTML = `<li class="lap-empty" id="lapEmpty">${d.lapEmpty}</li>`;
      return;
    }
    lapsList.innerHTML = laps.map((lap, idx) => `
      <li class="lap-item">
        <span class="lap-num">${d.lapPrefix} #${String(idx + 1).padStart(2, '0')}</span>
        <span class="lap-time">${formatTimePlain(lap)}</span>
      </li>
    `).reverse().join('');
  }
}

// ------------------------------------------
// 5. Dial Switcher Tabs
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
          card.style.borderColor = 'var(--gold-primary)';
          card.style.transform = 'translateY(-10px) scale(1.02)';
          card.style.boxShadow = '0 20px 40px rgba(223, 177, 123, 0.25)';
        } else {
          card.style.borderColor = '';
          card.style.transform = '';
          card.style.boxShadow = '';
        }
      });
      playEscapementClick();
    });
  });
}

// ------------------------------------------
// 6. 3D Card Gyroscopic Tilt
// ------------------------------------------
function init3DCardTilt() {
  const cards = document.querySelectorAll('[data-tilt]');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

// Horological Mechanical Scroll Reveal & Number Counter
function initChronoScrollReveal() {
  const elements = document.querySelectorAll('.timepiece-card, .bench-console, .calibre-showcase, .atelier-manifesto, .chrono-footer');
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        
        // If calibre specs are visible, animate numbers
        if (entry.target.classList.contains('calibre-showcase')) {
          animateSpecCounters();
        }
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => {
    el.classList.add('scroll-reveal-chrono');
    observer.observe(el);
  });
}

function animateSpecCounters() {
  const valPower = document.getElementById('valPower');
  const valJewels = document.getElementById('valJewels');
  if (valPower && !valPower.dataset.counted) {
    valPower.dataset.counted = "true";
    let count = 0;
    const interval = setInterval(() => {
      count += 4;
      if (count >= 120) {
        count = 120;
        clearInterval(interval);
      }
      valPower.textContent = count + (currentLang === 'ru' ? ' ЧАСОВ' : ' HOURS');
    }, 25);
  }
}
