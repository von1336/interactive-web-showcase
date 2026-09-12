/**
 * ZENITH STUDIO // 3D Interactive Zero-Block Showcase
 * Engine: Procedural Canvas 3D Avatar with Scroll-Reactive Farewell Gesture
 * Pure Vanilla JavaScript (0 external dependencies)
 */

(() => {
  'use strict';

  // ==========================================
  // 1. SOUND SYSTEM (Procedural Web Audio API)
  // ==========================================
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.init();
    }

    init() {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }

    ensureContext() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, type = 'sine', duration = 0.12, gainVal = 0.08) {
      if (!this.enabled || !this.ctx) return;
      this.ensureContext();
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }

    playChirp() {
      if (!this.enabled || !this.ctx) return;
      this.ensureContext();
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(now + 0.2);
      } catch (e) {}
    }

    playJump() {
      if (!this.enabled || !this.ctx) return;
      this.ensureContext();
      try {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
        notes.forEach((f, i) => {
          setTimeout(() => this.playTone(f, 'sine', 0.14, 0.07), i * 45);
        });
      } catch (e) {}
    }

    playWaveSound() {
      if (!this.enabled || !this.ctx) return;
      this.playTone(650, 'sine', 0.08, 0.04);
    }
  }

  const sfx = new SoundEngine();

  // ==========================================
  // 2. 3D CHARACTER ENGINE (Procedural Canvas 3D)
  // ==========================================
  class Character3D {
    constructor(canvas, isMini = false, isFooter = false) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.isMini = isMini;
      this.isFooter = isFooter;

      this.width = canvas.width;
      this.height = canvas.height;

      // Orientation and physics
      this.yaw = 0;
      this.pitch = 0;
      this.targetYaw = 0;
      this.targetPitch = 0;
      this.roll = 0;

      // Jump / Click animation
      this.jumpY = 0;
      this.jumpVel = 0;
      this.spinAngle = 0;
      this.spinVel = 0;
      this.isJumping = false;

      // Blink animation
      this.eyeScaleY = 1;
      this.blinkTimer = 0;
      this.nextBlink = 120 + Math.random() * 150;

      // Scroll & wave state
      this.scrollWaveAmount = 0; // 0 = idle, 1 = intense wave
      this.isWaving = false;

      // Time accumulator
      this.time = Math.random() * 100;
    }

    setTargetLook(normalizedX, normalizedY) {
      // normalizedX/Y range from -1 to 1
      this.targetYaw = normalizedX * 0.45;
      this.targetPitch = -normalizedY * 0.35;
    }

    jump() {
      if (this.isJumping) return;
      this.isJumping = true;
      this.jumpVel = -14;
      this.spinVel = Math.PI * 0.28;
      sfx.playJump();
    }

    update(dt, scrollProgress, globalTime) {
      this.time += dt;

      // Smooth look interpolation
      this.yaw += (this.targetYaw - this.yaw) * 0.08;
      this.pitch += (this.targetPitch - this.pitch) * 0.08;

      // Jump physics
      if (this.isJumping) {
        this.jumpY += this.jumpVel;
        this.jumpVel += 0.98; // gravity
        this.spinAngle += this.spinVel;

        if (this.jumpY >= 0) {
          this.jumpY = 0;
          this.jumpVel = 0;
          this.spinAngle = 0;
          this.isJumping = false;
        }
      }

      // Blink logic
      this.blinkTimer++;
      if (this.blinkTimer > this.nextBlink) {
        this.eyeScaleY -= 0.25;
        if (this.eyeScaleY <= 0) {
          this.eyeScaleY = 1;
          this.blinkTimer = 0;
          this.nextBlink = 140 + Math.random() * 220;
        }
      }

      // Scroll-wave intensity:
      // When user scrolls down, wave amount increases smoothly
      let targetWave = 0;
      if (this.isFooter) {
        targetWave = 1.0; // footer character is always enthusiastically waving goodbye!
      } else {
        // Hero & mini avatar: reacts to scroll progression
        targetWave = Math.min(Math.max((scrollProgress - 0.04) * 2.8, 0), 1);
      }
      this.scrollWaveAmount += (targetWave - this.scrollWaveAmount) * 0.12;
      this.isWaving = this.scrollWaveAmount > 0.05;
    }

    render() {
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;

      ctx.clearRect(0, 0, w, h);

      ctx.save();
      // Center origin
      const centerX = w / 2;
      const centerY = (h / 2) + 20 + this.jumpY;
      ctx.translate(centerX, centerY);

      // Spin rotation when clicked/jumped
      if (this.spinAngle !== 0) {
        ctx.rotate(this.spinAngle);
      }

      // Breathing / hover bobbing
      const hoverY = Math.sin(this.time * 2.5) * (this.isMini ? 3 : 7);
      ctx.translate(0, hoverY);

      // Floor shadow (when in hero or footer)
      if (!this.isMini) {
        const shadowScale = Math.max(0.2, 1 - (Math.abs(this.jumpY) / 120));
        ctx.save();
        ctx.translate(0, 155 - this.jumpY - hoverY);
        ctx.scale(shadowScale, shadowScale * 0.3);
        const shadowGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 100);
        shadowGrad.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
        shadowGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0.45)');
        shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 100, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Overall scale based on canvas size
      const baseScale = this.isMini ? 0.38 : (this.isFooter ? 0.68 : 1.0);
      ctx.scale(baseScale, baseScale);

      // Draw Character Components with pseudo-3D layers
      this.drawThruster(ctx);
      this.drawTorso(ctx);
      this.drawLeftArm(ctx);
      this.drawRightArm(ctx); // The waving arm!
      this.drawHead(ctx);

      ctx.restore();
    }

    drawThruster(ctx) {
      // Hovering propulsion energy cone below torso
      const flicker = 0.85 + Math.sin(this.time * 25) * 0.15;
      ctx.save();
      ctx.translate(0, 75);

      // Jet exhaust rings
      ctx.beginPath();
      ctx.ellipse(0, 5, 26, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#00f0ff';
      ctx.stroke();

      // Energy beam
      const beamGrad = ctx.createRadialGradient(0, 12, 2, 0, 28, 45 * flicker);
      beamGrad.addColorStop(0, 'rgba(0, 240, 255, 0.9)');
      beamGrad.addColorStop(0.3, 'rgba(112, 0, 255, 0.6)');
      beamGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(-18, 8);
      ctx.lineTo(18, 8);
      ctx.lineTo(0, 48 * flicker);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    drawTorso(ctx) {
      ctx.save();
      // Body tilt tracking yaw
      const bodyTiltX = this.yaw * 18;
      ctx.translate(bodyTiltX * 0.4, 15);

      // Torso shell (cyber-armor capsule)
      const torsoGrad = ctx.createLinearGradient(-45, -40, 45, 60);
      torsoGrad.addColorStop(0, '#1e293b');
      torsoGrad.addColorStop(0.5, '#0f172a');
      torsoGrad.addColorStop(1, '#020617');

      ctx.fillStyle = torsoGrad;
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';

      ctx.beginPath();
      ctx.roundRect(-42, -35, 84, 95, [28, 28, 38, 38]);
      ctx.fill();
      ctx.stroke();

      // Cyber chest plating seams
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-30, 0);
      ctx.lineTo(30, 0);
      ctx.stroke();

      // Glowing Arc Reactor in Chest
      const pulse = Math.sin(this.time * 4) * 0.2 + 0.8;
      const reactorGrad = ctx.createRadialGradient(bodyTiltX * 0.5, -5, 2, bodyTiltX * 0.5, -5, 22);
      reactorGrad.addColorStop(0, '#ffffff');
      reactorGrad.addColorStop(0.3, '#00f0ff');
      reactorGrad.addColorStop(0.7, 'rgba(112, 0, 255, 0.7)');
      reactorGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');

      ctx.fillStyle = reactorGrad;
      ctx.beginPath();
      ctx.arc(bodyTiltX * 0.5, -5, 20 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Inner Core Hexagon
      ctx.save();
      ctx.translate(bodyTiltX * 0.5, -5);
      ctx.rotate(this.time * 0.8);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (i * Math.PI) / 3;
        const hx = Math.cos(ang) * 9;
        const hy = Math.sin(ang) * 9;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    }

    drawLeftArm(ctx) {
      ctx.save();
      // Left shoulder anchor
      ctx.translate(-50, -10);

      // Idle bobbing / stabilizer movement
      const idleArm = Math.sin(this.time * 2 + 1) * 0.12;
      ctx.rotate(idleArm);

      // Upper arm
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-12, 0, 22, 46, 11);
      ctx.fill();
      ctx.stroke();

      // Elbow joint
      ctx.translate(0, 46);
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(-1, 0, 7, 0, Math.PI * 2);
      ctx.fill();

      // Forearm & hand
      ctx.rotate(0.2 + Math.sin(this.time * 1.8) * 0.08);
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.roundRect(-10, 0, 18, 38, 9);
      ctx.fill();
      ctx.stroke();

      // Hand palm
      ctx.translate(-1, 38);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, 4, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    drawRightArm(ctx) {
      ctx.save();
      // Right shoulder anchor
      ctx.translate(50, -10);

      const waveAmt = this.scrollWaveAmount; // 0 = idle resting, 1 = high wave goodbye!

      // Blend between resting idle pose and waving pose
      // In idle: arm points slightly down (angle ~ 0.2 rad)
      // When waving: arm raises UP and outwards (angle ~ -2.1 rad)
      const idleAngle = 0.25 + Math.sin(this.time * 2) * 0.08;
      const raisedAngle = -2.15;
      const shoulderAngle = idleAngle * (1 - waveAmt) + raisedAngle * waveAmt;

      ctx.rotate(shoulderAngle);

      // Upper arm
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = waveAmt > 0.3 ? '#00f0ff' : 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-10, 0, 22, 48, 11);
      ctx.fill();
      ctx.stroke();

      // Elbow joint
      ctx.translate(0, 48);
      ctx.fillStyle = waveAmt > 0.3 ? '#ff007a' : '#00f0ff';
      ctx.beginPath();
      ctx.arc(1, 0, 7.5, 0, Math.PI * 2);
      ctx.fill();

      // Forearm:
      // When waving, forearm oscillates rapidly left and right (the waving motion!)
      const waveSpeed = 13; // Enthusiastic waving speed!
      const waveOscillation = Math.sin(this.time * waveSpeed) * 0.55 * waveAmt;
      const forearmRestAngle = 0.35;
      const forearmWaveAngle = 0.75 + waveOscillation;
      const forearmAngle = forearmRestAngle * (1 - waveAmt) + forearmWaveAngle * waveAmt;

      ctx.rotate(forearmAngle);

      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.roundRect(-9, 0, 18, 40, 9);
      ctx.fill();
      ctx.stroke();

      // Hand palm & fingers
      ctx.translate(0, 40);

      // Hand flutter wave
      const handFlutter = Math.sin(this.time * waveSpeed + 0.8) * 0.35 * waveAmt;
      ctx.rotate(handFlutter);

      // Palm
      ctx.fillStyle = waveAmt > 0.4 ? '#00f0ff' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, 5, 9, 0, Math.PI * 2);
      ctx.fill();

      // Waving fingers (cyber-glove open hand gesture when waving!)
      if (waveAmt > 0.15) {
        ctx.fillStyle = '#ffffff';
        for (let f = -2; f <= 2; f++) {
          ctx.save();
          ctx.translate(f * 3.8, 8);
          ctx.rotate((f * 0.18) + Math.sin(this.time * waveSpeed + f) * 0.2 * waveAmt);
          ctx.fillRect(-1.5, 0, 3, 9);
          ctx.restore();
        }

        // Sparkle / motion trail rings around waving hand
        if (waveAmt > 0.5) {
          const glowGrad = ctx.createRadialGradient(0, 5, 2, 0, 5, 24);
          glowGrad.addColorStop(0, 'rgba(0, 240, 255, 0.7)');
          glowGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(0, 5, 22, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    }

    drawHead(ctx) {
      ctx.save();
      // Head position on top of torso
      ctx.translate(0, -65);

      // Dynamic 3D tilt tracking cursor
      const headTiltX = this.yaw * 24;
      const headTiltY = this.pitch * 18;
      ctx.translate(headTiltX, headTiltY);

      // Slight roll angle with yaw
      ctx.rotate(this.yaw * 0.35);

      // Neck joint ring
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 22, 16, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cyber-Headset / Ear Antennas
      // Left Ear
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-58, -12, 12, 28, 6);
      ctx.fill();
      ctx.stroke();

      // Left glowing antenna
      ctx.beginPath();
      ctx.moveTo(-54, -12);
      ctx.lineTo(-62, -32);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#ff007a';
      ctx.beginPath();
      ctx.arc(-62, -32, 4, 0, Math.PI * 2);
      ctx.fill();

      // Right Ear
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(46, -12, 12, 28, 6);
      ctx.fill();
      ctx.stroke();

      // Right antenna
      ctx.beginPath();
      ctx.moveTo(50, -12);
      ctx.lineTo(58, -32);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(58, -32, 4, 0, Math.PI * 2);
      ctx.fill();

      // Head Base Helmet (smooth glossy sphere/capsule)
      const helmetGrad = ctx.createRadialGradient(-15, -20, 10, 0, 0, 56);
      helmetGrad.addColorStop(0, '#f8fafc');
      helmetGrad.addColorStop(0.5, '#cbd5e1');
      helmetGrad.addColorStop(0.9, '#475569');
      helmetGrad.addColorStop(1, '#1e293b');

      ctx.fillStyle = helmetGrad;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 0, 50, 44, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Glossy Visor (Dark obsidian glass with neon reflections)
      const visorX = this.yaw * 12;
      const visorY = this.pitch * 8;

      ctx.save();
      ctx.translate(visorX, visorY);

      const visorGrad = ctx.createLinearGradient(0, -25, 0, 25);
      visorGrad.addColorStop(0, '#0f172a');
      visorGrad.addColorStop(0.6, '#020617');
      visorGrad.addColorStop(1, '#0b0f19');

      ctx.fillStyle = visorGrad;
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.roundRect(-36, -18, 72, 36, 18);
      ctx.fill();
      ctx.stroke();

      // Visor Curved Specular Glare
      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.beginPath();
      ctx.ellipse(-8, -10, 22, 5, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Expressive LED Eyes inside Visor
      const eyeSpacing = 16;
      const eyeLookX = this.yaw * 6;
      const eyeLookY = this.pitch * 4;

      // Color shifts to warm pink/gold when waving goodbye
      const eyeColor = this.scrollWaveAmount > 0.4 ? '#38bdf8' : '#00f0ff';
      ctx.fillStyle = eyeColor;
      ctx.shadowColor = eyeColor;
      ctx.shadowBlur = 10;

      // When waving, eye shape can morph into happy curved smiles (^ ^)
      if (this.scrollWaveAmount > 0.5) {
        // Happy arch eyes
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';

        // Left eye arch
        ctx.beginPath();
        ctx.arc(-eyeSpacing + eyeLookX, eyeLookY + 2, 7, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();

        // Right eye arch
        ctx.beginPath();
        ctx.arc(eyeSpacing + eyeLookX, eyeLookY + 2, 7, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
      } else {
        // Normal blinking oval eyes
        // Left Eye
        ctx.beginPath();
        ctx.ellipse(
          -eyeSpacing + eyeLookX,
          eyeLookY,
          6,
          8 * this.eyeScaleY,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Right Eye
        ctx.beginPath();
        ctx.ellipse(
          eyeSpacing + eyeLookX,
          eyeLookY,
          6,
          8 * this.eyeScaleY,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // White pupil glints
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        if (this.eyeScaleY > 0.5) {
          ctx.beginPath();
          ctx.arc(-eyeSpacing + eyeLookX + 2, eyeLookY - 2, 2.2, 0, Math.PI * 2);
          ctx.arc(eyeSpacing + eyeLookX + 2, eyeLookY - 2, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore(); // Restore Visor

      ctx.restore(); // Restore Head
    }
  }

  // ==========================================
  // 3. AURORA AMBIENT BACKGROUND CANVAS
  // ==========================================
  class AuroraCanvas {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.time = 0;
    }

    resize() {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }

    render(dt) {
      this.time += dt * 0.6;
      const ctx = this.ctx;
      const w = this.width;
      const h = this.height;

      ctx.clearRect(0, 0, w, h);

      // Blob 1: Cyan
      const x1 = w * 0.3 + Math.sin(this.time * 0.8) * (w * 0.18);
      const y1 = h * 0.35 + Math.cos(this.time * 0.6) * (h * 0.15);
      const g1 = ctx.createRadialGradient(x1, y1, 10, x1, y1, w * 0.45);
      g1.addColorStop(0, 'rgba(0, 240, 255, 0.08)');
      g1.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = g1;
      ctx.beginPath();
      ctx.arc(x1, y1, w * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Blob 2: Violet
      const x2 = w * 0.75 + Math.cos(this.time * 0.7) * (w * 0.15);
      const y2 = h * 0.55 + Math.sin(this.time * 0.9) * (h * 0.2);
      const g2 = ctx.createRadialGradient(x2, y2, 10, x2, y2, w * 0.5);
      g2.addColorStop(0, 'rgba(112, 0, 255, 0.09)');
      g2.addColorStop(1, 'rgba(112, 0, 255, 0)');
      ctx.fillStyle = g2;
      ctx.beginPath();
      ctx.arc(x2, y2, w * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // Blob 3: Fuchsia accent
      const x3 = w * 0.5 + Math.sin(this.time * 1.1) * (w * 0.25);
      const y3 = h * 0.2 + Math.cos(this.time * 0.8) * (h * 0.12);
      const g3 = ctx.createRadialGradient(x3, y3, 10, x3, y3, w * 0.35);
      g3.addColorStop(0, 'rgba(255, 0, 122, 0.06)');
      g3.addColorStop(1, 'rgba(255, 0, 122, 0)');
      ctx.fillStyle = g3;
      ctx.beginPath();
      ctx.arc(x3, y3, w * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ==========================================
  // 4. MAIN ORCHESTRATION & APP INIT
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    // Canvas references
    const auroraEl = document.getElementById('auroraCanvas');
    const heroCanvas = document.getElementById('heroAvatarCanvas');
    const miniCanvas = document.getElementById('miniAvatarCanvas');
    const footerCanvas = document.getElementById('footerAvatarCanvas');

    // Speech Bubbles and Sticky Companion
    const speechBubble = document.getElementById('heroSpeechBubble');
    const speechText = document.getElementById('speechText');
    const stickyCompanion = document.getElementById('stickyCompanion');
    const companionBubble = document.getElementById('companionBubble');
    const companionClickable = document.getElementById('companionClickable');

    // Instantiate 3D objects
    const aurora = auroraEl ? new AuroraCanvas(auroraEl) : null;
    const heroAvatar = heroCanvas ? new Character3D(heroCanvas, false, false) : null;
    const miniAvatar = miniCanvas ? new Character3D(miniCanvas, true, false) : null;
    const footerAvatar = footerCanvas ? new Character3D(footerCanvas, false, true) : null;

    // Mouse tracking for 3D look-at
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetNormX = 0;
    let targetNormY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Normalize coordinates around screen center (-1 to 1)
      targetNormX = (mouseX / window.innerWidth) * 2 - 1;
      targetNormY = (mouseY / window.innerHeight) * 2 - 1;

      if (heroAvatar) heroAvatar.setTargetLook(targetNormX, targetNormY);
      if (miniAvatar) miniAvatar.setTargetLook(targetNormX, targetNormY);
      if (footerAvatar) footerAvatar.setTargetLook(targetNormX, targetNormY);
    });

    // Touch support for mobile devices
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        const t = e.touches[0];
        targetNormX = (t.clientX / window.innerWidth) * 2 - 1;
        targetNormY = (t.clientY / window.innerHeight) * 2 - 1;
        if (heroAvatar) heroAvatar.setTargetLook(targetNormX, targetNormY);
      }
    }, { passive: true });

    // Click on avatars to trigger jump & spin
    if (heroCanvas) {
      heroCanvas.addEventListener('click', () => {
        if (heroAvatar) {
          heroAvatar.jump();
          showToast(currentLang === 'ru' ? 'Прыжок! ✨' : 'Jump! ✨');
        }
      });
    }

    if (companionClickable) {
      companionClickable.addEventListener('click', () => {
        if (miniAvatar) {
          miniAvatar.jump();
          sfx.playChirp();
          showToast(currentLang === 'ru' ? 'Привет от мини-гида! 🚀' : 'Hello from mini-guide! 🚀');
        }
      });
    }

    if (footerCanvas) {
      footerCanvas.addEventListener('click', () => {
        if (footerAvatar) {
          footerAvatar.jump();
          showToast(currentLang === 'ru' ? 'Счастливого пути! 👋' : 'Safe travels! 👋');
        }
      });
    }

    // Scroll state management
    let scrollProgress = 0;
    let lastWaveSoundTime = 0;

    function handleScroll() {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

      // Sticky companion in bottom right:
      // Appears after scrolling past 350px, disappears when near top or footer
      if (stickyCompanion) {
        if (scrollY > 350 && scrollY < maxScroll - 400) {
          stickyCompanion.classList.add('visible');
        } else {
          stickyCompanion.classList.remove('visible');
        }
      }

      // Dynamic Speech Bubble messages during scroll
      if (speechText) {
        if (scrollY < 180) {
          speechText.textContent = currentLang === 'ru' 
            ? 'Привет! Я твой 3D-гид. Прокрути вниз! 👇' 
            : 'Hey! I\'m your 3D guide. Scroll down! 👇';
        } else if (scrollY < 650) {
          speechText.textContent = currentLang === 'ru' 
            ? 'О, ты скроллишь! Я машу тебе рукой! 👋' 
            : 'Oh, you\'re scrolling! Waving goodbye! 👋';
        } else if (scrollY < 1600) {
          speechText.textContent = currentLang === 'ru' 
            ? 'Увидимся внизу! Не забудь оценить кейсы! 🚀' 
            : 'See you below! Don\'t miss the cases! 🚀';
        } else {
          speechText.textContent = currentLang === 'ru' 
            ? 'Пока-пока! Отличного дня! ✨' 
            : 'Bye-bye! Have an awesome day! ✨';
        }
      }

      // Companion speech bubble
      if (companionBubble) {
        if (scrollY > maxScroll - 800) {
          companionBubble.textContent = currentLang === 'ru' ? 'Мы почти у финиша! 👋' : 'Almost there! 👋';
        } else {
          companionBubble.textContent = currentLang === 'ru' ? 'Машу на прощание! 👋' : 'Waving goodbye! 👋';
        }
      }

      // Play soft wave audio blip on entering scroll waving zone
      const now = performance.now();
      if (scrollY > 200 && now - lastWaveSoundTime > 3000) {
        sfx.playWaveSound();
        lastWaveSoundTime = now;
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Main animation render loop
    let lastTime = performance.now();

    function animate(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Aurora background
      if (aurora) aurora.render(dt);

      // 3D Avatars
      if (heroAvatar) {
        heroAvatar.update(dt, scrollProgress, now * 0.001);
        heroAvatar.render();
      }

      if (miniAvatar) {
        miniAvatar.update(dt, scrollProgress, now * 0.001);
        miniAvatar.render();
      }

      if (footerAvatar) {
        footerAvatar.update(dt, scrollProgress, now * 0.001);
        footerAvatar.render();
      }

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    // ==========================================
    // 5. INTERACTIVE 3D TILT EFFECT ON CARDS
    // ==========================================
    const tiltElements = document.querySelectorAll('[data-tilt]');
    tiltElements.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -9;
        const rotateY = ((x - centerX) / centerX) * 9;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });

    // ==========================================
    // 6. TILDA ESTIMATOR CALCULATOR LOGIC
    // ==========================================
    let baseScopeCost = 2500;
    let baseScopeDays = 7;
    let baseDepthCost = 1800;
    let baseDepthDays = 5;

    const scopeBtns = document.querySelectorAll('#scopeSelector .pill-btn');
    const depthBtns = document.querySelectorAll('#depthSelector .pill-btn');
    const addonCheckboxes = document.querySelectorAll('.checkbox-grid input[type="checkbox"]');
    const priceDisplay = document.getElementById('totalPrice');
    const daysDisplay = document.getElementById('totalDays');

    function calculateEstimate() {
      let totalCost = baseScopeCost + baseDepthCost;
      let totalDays = baseScopeDays + baseDepthDays;

      addonCheckboxes.forEach(cb => {
        if (cb.checked) {
          totalCost += parseInt(cb.getAttribute('data-cost') || 0, 10);
          totalDays += parseInt(cb.getAttribute('data-days') || 0, 10);
        }
      });

      // Animate price
      if (priceDisplay) {
        priceDisplay.textContent = `$${totalCost.toLocaleString()}`;
        priceDisplay.classList.add('price-bump');
        setTimeout(() => priceDisplay.classList.remove('price-bump'), 250);
      }

      if (daysDisplay) {
        const dayWord = currentLang === 'ru' ? 'рабочих дней' : 'business days';
        daysDisplay.textContent = `${totalDays} ${dayWord}`;
      }
    }

    scopeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        scopeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        baseScopeCost = parseInt(btn.getAttribute('data-cost'), 10);
        baseScopeDays = parseInt(btn.getAttribute('data-days'), 10);
        sfx.playTone(520, 'sine', 0.08, 0.06);
        calculateEstimate();
      });
    });

    depthBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        depthBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        baseDepthCost = parseInt(btn.getAttribute('data-cost'), 10);
        baseDepthDays = parseInt(btn.getAttribute('data-days'), 10);
        sfx.playTone(680, 'sine', 0.08, 0.06);
        calculateEstimate();
      });
    });

    addonCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        sfx.playTone(cb.checked ? 750 : 380, 'triangle', 0.08, 0.05);
        calculateEstimate();
      });
    });

    // Order estimate button
    const btnOrder = document.getElementById('btnOrderEstimate');
    if (btnOrder) {
      btnOrder.addEventListener('click', () => {
        sfx.playChirp();
        const price = priceDisplay ? priceDisplay.textContent : '$6,300';
        const msg = currentLang === 'ru'
          ? `Заявка сформирована! Предварительная оценка: ${price}. Свяжитесь с нами в Telegram!`
          : `Proposal ready! Estimated budget: ${price}. Reach out on Telegram!`;
        showToast(msg);
      });
    }

    // ==========================================
    // 7. SFX AUDIO TOGGLE
    // ==========================================
    const sfxBtn = document.getElementById('sfxToggleBtn');
    const sfxLabel = document.getElementById('sfxLabel');
    if (sfxBtn) {
      sfxBtn.addEventListener('click', () => {
        sfx.enabled = !sfx.enabled;
        if (sfxLabel) {
          sfxLabel.textContent = sfx.enabled ? 'SFX: ON' : 'SFX: OFF';
        }
        if (sfx.enabled) {
          sfx.playTone(800, 'sine', 0.1, 0.1);
        }
      });
    }

    // ==========================================
    // 8. BILINGUAL SWITCHER (RU / EN)
    // ==========================================
    let currentLang = 'ru';
    const langBtn = document.getElementById('langToggleBtn');

    const i18n = {
      ru: {
        txtBackToHub: 'ХАБ',
        navLink1: 'Философия',
        navLink2: 'Проекты',
        navLink3: 'Услуги',
        navLink4: 'Оценка',
        btnNavCta: 'Обсудить проект',
        heroBadge: '06 // ZERO-BLOCK 3D EXPERIENCE',
        heroTitle: 'Цифровой опыт <br><span class="text-gradient">будущего поколения.</span>',
        heroSubtitle: 'Создаем премиальные веб-интерфейсы в эстетике Tilda Zero-Block и Awwwards: кинематографичная 3D-анимация, живые интерактивные персонажи и бескомпромиссная скорость.',
        txtBtnExplore: 'Смотреть работы',
        txtBtnCalculate: 'Рассчитать смету',
        mLabel1: 'Оценка производительности',
        mLabel2: 'Международных наград',
        mLabel3: 'Задержка 3D-рендеринга',
        stageHintText: 'Двигай курсор или нажми на меня для прыжка!',
        txtScrollDown: 'КРУТИТЕ ВНИЗ',
        sec1Label: 'ФИЛОСОФИЯ И ПОДХОД',
        sec1Head: 'Как мы стираем грань между <br><span class="text-gradient-cyan">дизайном и чистым кодом.</span>',
        st1Title: 'Живая 3D-мимика',
        st1Desc: 'Персонажи и объекты на сайте чувствуют действия пользователя: реагируют на скролл, провожают курсор взглядом и прощаются при завершении чтения.',
        st2Title: 'Zero-Block Типографика',
        st2Desc: 'Свободная швейцарская сетка с крупными акцентными заголовками, адаптивным кернингом и плавной анимацией масок при попадании во вьюпорт.',
        st3Title: 'Тактильный Звук',
        st3Desc: 'Каждое взаимодействие озвучивается процедурным синтезатором Web Audio API. Приятный клик и мягкий резонанс погружают глубже, чем статичный экран.',
        sec2Label: 'ИЗБРАННЫЕ КЕЙСЫ',
        sec2Head: 'Интерфейсы, завоевавшие <br><span class="text-gradient">внимание сотен тысяч людей.</span>',
        zb1Desc: 'Интерактивный 3D-кошелек нового поколения: вращающиеся карты, динамическое преломление света и биометрия.',
        zb2Desc: 'Нейросетевая платформа с генерацией UI на лету и визуализацией эмбеддингов в реальном времени.',
        zb3Desc: 'Флагманский магазин премиальных часов с интерактивным разбором механизма по слоям.',
        zb4Desc: 'Высоконагруженная экосистема из 23+ микросервисов: real-time брокеры сообщений, WebSockets и Celery кластеры.',
        sec3Label: 'КАЛЬКУЛЯТОР ПРОЕКТА',
        sec3Head: 'Рассчитайте бюджет запуска <br><span class="text-gradient">за пару кликов в реальном времени.</span>',
        estLbl1: '1. Масштаб и тип сайта:',
        scopeOpt1: 'Промо / Лендинг (3D)',
        scopeOpt2: 'Корпоративный сайт',
        scopeOpt3: 'Веб-сервис / Платформа',
        estLbl2: '2. Уровень 3D и интерактива:',
        depthOpt1: 'Базовый (Parallax)',
        depthOpt2: '3D-Персонаж + Скролл',
        depthOpt3: 'Полная 3D-Сцена WebGL',
        estLbl3: '3. Дополнительные модули:',
        addonTxt1: 'Процедурный саунд-дизайн Web Audio (+$600)',
        addonTxt2: 'FastAPI / Telegram Бот интеграция (+$1,400)',
        addonTxt3: 'Мультиязычность RU / EN (+$500)',
        txtEstTimeline: 'Срок разработки:',
        txtBtnOrder: 'Оформить заявку',
        txtFarewellTitle: 'Спасибо за внимание! До новых встреч! 👋',
        txtFarewellDesc: 'Вы долистали до самого конца. Наш 3D-персонаж машет вам рукой на прощание и желает великолепных проектов. Возвращайтесь в общий хаб, чтобы изучить остальные лаборатории!',
        txtReturnHub: 'Вернуться в Хаб'
      },
      en: {
        txtBackToHub: 'HUB',
        navLink1: 'Philosophy',
        navLink2: 'Projects',
        navLink3: 'Services',
        navLink4: 'Estimator',
        btnNavCta: 'Start Project',
        heroBadge: '06 // ZERO-BLOCK 3D EXPERIENCE',
        heroTitle: 'Next-Generation <br><span class="text-gradient">Digital Experience.</span>',
        heroSubtitle: 'Crafting premium web interfaces in Tilda Zero-Block & Awwwards aesthetics: cinematic 3D animation, lifelike responsive characters, and uncompromising speed.',
        txtBtnExplore: 'Explore Cases',
        txtBtnCalculate: 'Estimate Budget',
        mLabel1: 'Performance Score',
        mLabel2: 'International Awards',
        mLabel3: '3D Rendering Latency',
        stageHintText: 'Move cursor or click me for a 360° jump!',
        txtScrollDown: 'SCROLL DOWN',
        sec1Label: 'PHILOSOPHY & CRAFT',
        sec1Head: 'Blurring the line between <br><span class="text-gradient-cyan">pure design and pristine code.</span>',
        st1Title: 'Living 3D Mimicry',
        st1Desc: 'Interactive characters and elements perceive user actions: responding to scroll depth, following cursor movement, and waving farewell upon page completion.',
        st2Title: 'Zero-Block Editorial',
        st2Desc: 'Swiss typography grid with bold headline treatments, dynamic kerning, and buttery smooth mask reveals on viewport entry.',
        st3Title: 'Tactile Audio',
        st3Desc: 'Every interaction is sonified via procedural Web Audio synthesizer. Crisp haptic clicks and soft harmonics deepen emotional engagement.',
        sec2Label: 'FEATURED CASES',
        sec2Head: 'Interfaces commanding <br><span class="text-gradient">attention across hundreds of thousands.</span>',
        zb1Desc: 'Next-gen interactive 3D crypto wallet: spinning cards, dynamic light caustics, and biometric auth.',
        zb2Desc: 'Generative AI platform with real-time UI synthesis and live high-dimensional embedding visualization.',
        zb3Desc: 'Flagship horology boutique featuring interactive exploded-view watch mechanics.',
        zb4Desc: 'High-throughput 23+ microservices mesh: real-time message brokers, WebSockets, and Celery worker clusters.',
        sec3Label: 'PROJECT ESTIMATOR',
        sec3Head: 'Estimate launch budget <br><span class="text-gradient">in a couple of clicks in real time.</span>',
        estLbl1: '1. Scale & Website Type:',
        scopeOpt1: 'Promo / Landing (3D)',
        scopeOpt2: 'Corporate Portal',
        scopeOpt3: 'Web App / SaaS Platform',
        estLbl2: '2. 3D & Interactivity Depth:',
        depthOpt1: 'Basic (Parallax)',
        depthOpt2: '3D Character + Scroll',
        depthOpt3: 'Full WebGL 3D World',
        estLbl3: '3. Additional Modules:',
        addonTxt1: 'Procedural Web Audio Soundscape (+$600)',
        addonTxt2: 'FastAPI / Telegram Bot Integration (+$1,400)',
        addonTxt3: 'Bilingual Support RU / EN (+$500)',
        txtEstTimeline: 'Estimated timeline:',
        txtBtnOrder: 'Submit Inquiry',
        txtFarewellTitle: 'Thank You For Visiting! See You Soon! 👋',
        txtFarewellDesc: 'You reached the very bottom. Our 3D character waves goodbye and wishes you exceptional launches. Head back to the Hub to explore the remaining creative labs!',
        txtReturnHub: 'Back to Hub'
      }
    };

    function applyLanguage(lang) {
      currentLang = lang;
      const dict = i18n[lang];
      if (!dict) return;

      Object.keys(dict).forEach(key => {
        const el = document.getElementById(key);
        if (el) {
          if (dict[key].includes('<')) {
            el.innerHTML = dict[key];
          } else {
            el.textContent = dict[key];
          }
        }
      });

      // Update pill active classes
      if (langBtn) {
        const ruItem = langBtn.querySelector('[data-lang="ru"]');
        const enItem = langBtn.querySelector('[data-lang="en"]');
        if (ruItem && enItem) {
          ruItem.classList.toggle('active', lang === 'ru');
          enItem.classList.toggle('active', lang === 'en');
        }
      }

      handleScroll();
      calculateEstimate();
    }

    if (langBtn) {
      langBtn.addEventListener('click', () => {
        sfx.playTone(700, 'sine', 0.09, 0.05);
        applyLanguage(currentLang === 'ru' ? 'en' : 'ru');
      });
    }

    // ==========================================
    // 9. TOAST NOTIFICATION HELPER
    // ==========================================
    function showToast(text) {
      let toast = document.getElementById('zenithToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'zenithToast';
        toast.style.position = 'fixed';
        toast.style.bottom = '30px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        toast.style.background = 'rgba(15, 23, 42, 0.95)';
        toast.style.border = '1px solid rgba(0, 240, 255, 0.5)';
        toast.style.backdropFilter = 'blur(12px)';
        toast.style.color = '#ffffff';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '999px';
        toast.style.fontFamily = 'Plus Jakarta Sans, sans-serif';
        toast.style.fontSize = '0.9rem';
        toast.style.fontWeight = '600';
        toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)';
        toast.style.zIndex = '9999';
        toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        toast.style.opacity = '0';
        toast.style.pointerEvents = 'none';
        document.body.appendChild(toast);
      }

      toast.textContent = text;
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
      }, 2600);
    }

  });
})();
