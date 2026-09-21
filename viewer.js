/**
 * SCUDERIA VELOCE // 360° SUPERCAR VEHICLE & ACCESSORY INSPECTION STUDIO
 * Pure Supercar Turntable Studio (Ferrari SF90, Lamborghini Revuelto, Bugatti Chiron)
 * - Strict Separation of Views:
 *   * Alloy Wheel Car View: Strictly showcases the car's alloy wheel & tyre fitment (Zero spoilers shown!)
 *   * Spoiler Car View: Strictly showcases the car's rear wing & aerodynamic profile (Zero wheels shown!)
 * - Zero artificial photo overlays or pasted 2D stickers: 100% authentic factory-fitted supercar look
 * - Continuous 360° showroom turntable autorotation by default
 * - Dedicated 8K Macro Component HUD for active component
 * - Category-specific switcher tray (Wheels-only for wheel view; Spoilers-only for spoiler view)
 */

import { WHEELS, SPOILERS, EXHAUSTS } from './accessories-data.js';

(function () {
  'use strict';

  // --- Parse URL Parameters ---
  const urlParams = new URLSearchParams(window.location.search);
  let currentType = urlParams.get('type') || 'wheel';
  let currentId = urlParams.get('id') || 'wheel-ferrari-corsa';
  let currentFinish = urlParams.get('finish') || 'silver';

  // Find active item
  let listForType = currentType === 'wheel' ? WHEELS : (currentType === 'spoiler' ? SPOILERS : EXHAUSTS);
  let currentItem = listForType.find(i => i.id === currentId);
  if (!currentItem) {
    currentItem = WHEELS.find(i => i.id === currentId) || 
                  SPOILERS.find(i => i.id === currentId) || 
                  EXHAUSTS.find(i => i.id === currentId) || 
                  WHEELS[0];
    currentType = currentItem.id.startsWith('wheel') ? 'wheel' : (currentItem.id.startsWith('spoiler') ? 'spoiler' : 'exhaust');
  }

  // Active vehicle configuration
  let currentCar = currentItem.fittedCar;

  // --- Canvas & Stage References ---
  const stage = document.getElementById('viewer-stage');
  const canvas = document.getElementById('studio-360-canvas');
  const ctx = canvas.getContext('2d', { alpha: true });

  // HUD & Telemetry Elements
  const carBrandBadge = document.getElementById('car-brand-badge');
  const fittedCategoryBadge = document.getElementById('fitted-category-badge');
  const carTitle = document.getElementById('car-title');
  const carSubtitle = document.getElementById('car-subtitle');
  const telemetryAngle = document.getElementById('telemetry-angle');
  const telemetryZoom = document.getElementById('telemetry-zoom');
  const telemetryMode = document.getElementById('telemetry-mode');
  const turntablePointer = document.getElementById('turntable-pointer');
  const angleSlider = document.getElementById('angle-slider');
  const dragHint = document.getElementById('drag-hint');
  const loaderHud = document.getElementById('viewer-loader');
  const loaderProgress = document.getElementById('loader-progress');

  // Hotspot Elements
  const hotspotWrapper = document.getElementById('hotspot-wrapper');
  const hotspotPin = document.getElementById('hotspot-pin');
  const hotspotLabel = document.getElementById('hotspot-label');
  const hotspotPopup = document.getElementById('hotspot-popup');
  const popupTitle = document.getElementById('popup-title');
  const popupPartNo = document.getElementById('popup-part-no');
  const popupSpecsGrid = document.getElementById('popup-specs-grid');
  const popupViewSpecBtn = document.getElementById('popup-view-spec-btn');

  // Live Macro Lens Elements (Top-Right HUD)
  const wheelMacroLens = document.getElementById('wheel-macro-lens');
  const lensMacroImg = document.getElementById('lens-macro-img');
  const lensWheelTitle = document.getElementById('lens-wheel-title');
  const lensFinishTag = document.getElementById('lens-finish-tag');

  // Finish Palette Elements
  const finishPalette = document.getElementById('studio-finish-palette');
  const paletteFinishName = document.getElementById('palette-finish-name');
  const finishDots = document.querySelectorAll('.finish-choice-dot');

  // Fitted Drawer Elements
  const fittedThumbImg = document.getElementById('fitted-thumb-img');
  const fittedCardTitle = document.getElementById('fitted-card-title');
  const fittedSpecsMini = document.getElementById('fitted-specs-mini');
  const fittedQuoteBtn = document.getElementById('fitted-quote-btn');
  const viewerInquireBtn = document.getElementById('viewer-inquire-btn');

  // Controls Buttons
  const btnResetAngle = document.getElementById('btn-reset-angle');
  const btnAutospin = document.getElementById('btn-autospin');
  const autospinIcon = document.getElementById('autospin-icon');
  const autospinText = document.getElementById('autospin-text');
  const btnZoom = document.getElementById('btn-zoom');
  const zoomText = document.getElementById('zoom-text');
  const btnHotspotToggle = document.getElementById('btn-hotspot-toggle');
  const btnSwitchTray = document.getElementById('btn-switch-tray');

  // Quick Switcher Tray
  const quickSwitcherTray = document.getElementById('quick-switcher-tray');
  const closeTrayBtn = document.getElementById('close-tray-btn');
  const trayItemsCarousel = document.getElementById('tray-items-carousel');
  const trayKicker = document.querySelector('.tray-kicker');
  const trayTitle = document.querySelector('.tray-title');

  // Technical Spec Modal
  const fullSpecModal = document.getElementById('full-spec-modal');
  const closeSpecModalBtn = document.getElementById('close-spec-modal-btn');
  const specModalImg = document.getElementById('spec-modal-img');
  const specModalTitle = document.getElementById('spec-modal-title');
  const specModalDesc = document.getElementById('spec-modal-desc');
  const specModalTable = document.getElementById('spec-modal-table');
  const specModalFitment = document.getElementById('spec-modal-fitment');

  // Sound Engine
  const soundBtn = document.getElementById('viewer-sound-btn');
  const soundToast = document.getElementById('sound-toast');
  let audioCtx = null;
  let soundEnabled = false;
  let motorOsc = null;
  let motorGain = null;

  // --- 360 Rotation & Physics State ---
  // AUTOMATIC ROTATION BY DEFAULT
  let isAutoRotating = true;
  let autoRotateSpeed = 0.42;
  let resumeSpinTimeout = null;
  let userManuallyPaused = false;

  let angle = 45; // default angle
  let targetAngle = 45;
  let defaultAngle = 45;
  let dragVelocity = 0;
  let isDragging = false;
  let lastPointerX = 0;
  let hasInteracted = false;

  let zoom = 1.0;
  let targetZoom = 1.0;
  let zoomCenterX = 0.5;
  let zoomCenterY = 0.5;

  let hotspotsVisible = true;

  // Dedicated Studio Photography Cache
  // For Wheel View: loads frontImg (authentic wheel-focused supercar view)
  // For Spoiler View: loads rearImg (authentic spoiler-focused supercar view)
  const studioImg = new Image();
  let studioImgLoaded = false;

  // --- Web Audio Synthesizer ---
  function initAudio() {
    if (audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      motorGain = audioCtx.createGain();
      motorGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);

      motorOsc = audioCtx.createOscillator();
      motorOsc.type = 'sawtooth';
      motorOsc.frequency.setValueAtTime(55, audioCtx.currentTime);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, audioCtx.currentTime);

      motorOsc.connect(filter);
      filter.connect(motorGain);
      motorGain.connect(audioCtx.destination);
      motorOsc.start();
    } catch (e) {
      console.warn('Web Audio unavailable:', e);
    }
  }

  function playSoundTone(freq = 600, duration = 0.05, type = 'sine') {
    if (!soundEnabled || !audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.07, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  function updateMotorSound(velocity) {
    if (!soundEnabled || !audioCtx || !motorGain) return;
    const speed = Math.abs(velocity);
    if (speed > 0.05) {
      const targetGain = Math.min(0.035, speed * 0.015);
      const targetFreq = 45 + Math.min(120, speed * 25);
      motorGain.gain.setTargetAtTime(targetGain, audioCtx.currentTime, 0.05);
      motorOsc.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.05);
    } else {
      motorGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.08);
    }
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundBtn.classList.add('active');
        soundBtn.querySelector('.sound-icon').textContent = '🔊';
        if (soundToast) {
          soundToast.classList.add('show');
          setTimeout(() => soundToast.classList.remove('show'), 3000);
        }
        playSoundTone(780, 0.08);
      } else {
        soundBtn.classList.remove('active');
        soundBtn.querySelector('.sound-icon').textContent = '🔈';
      }
    });
  }

  // --- Preload Dedicated Supercar Studio Photography ---
  function preloadSupercarStudioImages() {
    if (loaderHud) loaderHud.classList.add('active');
    const compLabel = currentType === 'wheel' ? 'ALLOY WHEEL' : (currentType === 'spoiler' ? 'CARBON SPOILER' : 'PERFORMANCE EXHAUST');
    if (loaderProgress) loaderProgress.textContent = `CALIBRATING ${currentCar.name.toUpperCase()} ${compLabel} TURNTABLE...`;

    studioImgLoaded = false;
    // Strictly load ONLY the relevant component studio photography!
    // Wheel view loads frontImg (wheel view of car)
    // Spoiler view loads rearImg (spoiler view of car)
    // Exhaust view loads fittedHeroImg / frontImg (superbike studio view)
    const targetSrc = currentType === 'wheel' ? currentCar.frontImg : (currentType === 'spoiler' ? currentCar.rearImg : (currentCar.fittedHeroImg || currentCar.frontImg));
    studioImg.src = targetSrc;

    const onDone = () => {
      studioImgLoaded = true;
      if (loaderHud) loaderHud.classList.remove('active');
      drawCanvas();
    };

    studioImg.onload = onDone;
    studioImg.onerror = onDone;
  }

  // --- Canvas Sizing & High-DPI Rendering ---
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = stage.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }
    drawCanvas();
  }

  // --- Draw Canvas Frame (Strict Dedicated Turntable View) ---
  function drawCanvas() {
    const rect = stage.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (w <= 0 || h <= 0) return;

    ctx.clearRect(0, 0, w, h);

    // Save context for transform & zoom
    ctx.save();

    // Zoom transform centered around active component
    if (zoom > 1.001) {
      const cx = w * zoomCenterX;
      const cy = h * zoomCenterY;
      ctx.translate(cx, cy);
      ctx.scale(zoom, zoom);
      ctx.translate(-cx, -cy);
    }

    const normalizedAngle = ((angle % 360) + 360) % 360;
    const angleRad = (normalizedAngle * Math.PI) / 180;

    // Smooth turntable perspective yaw orbit
    // For wheel: continuous smooth yaw orbit highlighting wheel spokes & concavity
    // For spoiler: continuous smooth yaw orbit highlighting rear wing airfoil & endplates
    const skewX = Math.sin(angleRad) * 22;
    const scaleY = 1.0 - Math.abs(Math.sin(angleRad)) * 0.04;

    ctx.save();
    ctx.translate(skewX, 0);
    ctx.scale(1.0, scaleY);

    // Render ONLY the relevant component image (Zero cross-contamination!)
    // Wheel view shows ONLY wheel!
    // Spoiler view shows ONLY spoiler!
    if (studioImg.complete && studioImg.naturalWidth) {
      renderImageContain(studioImg, w, h);
    }

    ctx.restore(); // restore yaw translate

    ctx.restore(); // restore zoom transform

    // Render Studio Ambient Turntable Specular Floor Reflection
    renderTurntableFloor(w, h);

    // Update Hotspot Screen Position (Smooth dynamic 3D orbit around the specific component)
    updateHotspotPosition(w, h);
  }

  // --- Render Image with High-Fidelity Contain Fit ---
  function renderImageContain(img, stageW, stageH) {
    if (!img.naturalWidth || !img.naturalHeight) return { drawX: 0, drawY: 0, drawW: stageW, drawH: stageH };

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const stageRatio = stageW / stageH;

    let drawW, drawH, drawX, drawY;
    const maxOccupancy = 0.94;

    if (stageRatio > imgRatio) {
      drawH = stageH * maxOccupancy;
      drawW = drawH * imgRatio;
      drawX = (stageW - drawW) / 2;
      drawY = (stageH - drawH) / 2 + 10;
    } else {
      drawW = stageW * maxOccupancy;
      drawH = drawW / imgRatio;
      drawX = (stageW - drawW) / 2;
      drawY = (stageH - drawH) / 2 + 10;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    return { drawX, drawY, drawW, drawH };
  }

  // --- Render Studio Floor Reflection Effect ---
  function renderTurntableFloor(w, h) {
    const centerX = w / 2;
    const centerY = h * 0.78;
    const radiusX = w * 0.38;
    const radiusY = h * 0.12;

    const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radiusX);
    if (currentCar.brand === 'ferrari' || currentCar.brand === 'ducati') {
      grad.addColorStop(0, 'rgba(255, 40, 0, 0.09)');
      grad.addColorStop(0.7, 'rgba(255, 40, 0, 0.015)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else if (currentCar.brand === 'lamborghini') {
      grad.addColorStop(0, 'rgba(255, 180, 0, 0.09)');
      grad.addColorStop(0.7, 'rgba(255, 180, 0, 0.015)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else if (currentCar.brand === 'kawasaki') {
      grad.addColorStop(0, 'rgba(0, 230, 0, 0.09)');
      grad.addColorStop(0.7, 'rgba(0, 230, 0, 0.015)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      grad.addColorStop(0, 'rgba(0, 140, 255, 0.09)');
      grad.addColorStop(0.7, 'rgba(0, 140, 255, 0.015)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }

    ctx.save();
    ctx.scale(1, radiusY / radiusX);
    ctx.beginPath();
    ctx.arc(centerX, (centerY * radiusX) / radiusY, radiusX, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  // --- Dynamic Hotspot Screen Position & Occlusion ---
  function updateHotspotPosition(w, h) {
    if (!hotspotWrapper || !hotspotsVisible) {
      if (hotspotWrapper) hotspotWrapper.style.display = 'none';
      return;
    }

    const hs = currentCar.hotspot;
    if (!hs) {
      hotspotWrapper.style.display = 'none';
      return;
    }

    const normalizedAngle = ((angle % 360) + 360) % 360;
    const rad = (normalizedAngle * Math.PI) / 180;

    // Subtle 3D perspective orbit around the component
    const orbitRadiusX = w * 0.06;
    const baseScreenX = (w * hs.x) / 100;
    const baseScreenY = (h * hs.y) / 100;

    const dynamicX = baseScreenX + Math.sin(rad) * orbitRadiusX;
    const dynamicY = baseScreenY + Math.cos(rad) * 5;

    hotspotWrapper.style.display = 'block';
    hotspotWrapper.style.left = `${dynamicX}px`;
    hotspotWrapper.style.top = `${dynamicY}px`;
    hotspotWrapper.style.opacity = '1';
    hotspotWrapper.style.pointerEvents = 'auto';
    hotspotWrapper.style.transform = 'translate(-50%, -50%) scale(1)';
  }

  // --- Main Animation & Inertia Physics Loop (Continuous 360 Turntable Spin) ---
  function animate() {
    requestAnimationFrame(animate);

    // Continuous 360 Auto-spin
    if (isAutoRotating && !isDragging) {
      targetAngle = (targetAngle + autoRotateSpeed) % 360;
    }

    // Inertia damping when released
    if (!isDragging && Math.abs(dragVelocity) > 0.02) {
      targetAngle = (targetAngle + dragVelocity) % 360;
      dragVelocity *= 0.92;
      updateMotorSound(dragVelocity);
    } else if (!isDragging && Math.abs(dragVelocity) <= 0.02) {
      dragVelocity = 0;
      updateMotorSound(0);
    }

    // Smooth LERP towards targetAngle
    const angleDiff = ((targetAngle - angle + 540) % 360) - 180;
    if (Math.abs(angleDiff) > 0.01) {
      angle += angleDiff * 0.16;
      angle = ((angle % 360) + 360) % 360;
    }

    // Smooth Zoom LERP
    if (Math.abs(targetZoom - zoom) > 0.005) {
      zoom += (targetZoom - zoom) * 0.12;
    }

    // Update Telemetry Indicators
    const roundedDeg = Math.round(angle);
    if (telemetryAngle) telemetryAngle.textContent = `${String(roundedDeg).padStart(3, '0')}°`;
    if (angleSlider && !isDragging) angleSlider.value = roundedDeg;
    if (turntablePointer) turntablePointer.style.transform = `rotate(${roundedDeg}deg)`;

    drawCanvas();
  }

  // --- Pointer Drag / Touch Interactions ---
  stage.addEventListener('pointerdown', (e) => {
    isDragging = true;
    lastPointerX = e.clientX;
    dragVelocity = 0;
    stage.setPointerCapture(e.pointerId);
    stage.classList.add('grabbing');
    if (telemetryMode) telemetryMode.textContent = 'MANUAL DRAG';

    if (resumeSpinTimeout) clearTimeout(resumeSpinTimeout);
    isAutoRotating = false;

    if (!hasInteracted) {
      hasInteracted = true;
      if (dragHint) dragHint.classList.add('fade-out');
    }
  });

  stage.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    const dx = e.clientX - lastPointerX;
    lastPointerX = e.clientX;

    const sensitivity = 0.42;
    dragVelocity = dx * sensitivity;
    targetAngle = (targetAngle + dragVelocity + 360) % 360;

    updateMotorSound(dragVelocity);
  });

  const endDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;
    stage.classList.remove('grabbing');
    try {
      stage.releasePointerCapture(e.pointerId);
    } catch (err) {}

    // Resume smooth 360 auto-spinning after 1.8s of inactivity unless user explicitly paused
    if (!userManuallyPaused) {
      if (resumeSpinTimeout) clearTimeout(resumeSpinTimeout);
      resumeSpinTimeout = setTimeout(() => {
        isAutoRotating = true;
        updateAutoSpinUI();
      }, 1800);
    }
  };

  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  // --- Slider Scrubber Input ---
  if (angleSlider) {
    angleSlider.addEventListener('input', (e) => {
      targetAngle = parseFloat(e.target.value);
      dragVelocity = 0;
      if (resumeSpinTimeout) clearTimeout(resumeSpinTimeout);
      isAutoRotating = false;
      if (!userManuallyPaused) {
        resumeSpinTimeout = setTimeout(() => {
          isAutoRotating = true;
          updateAutoSpinUI();
        }, 2200);
      }
      playSoundTone(800, 0.02, 'triangle');
    });
  }

  // --- Button Handlers ---
  function updateAutoSpinUI() {
    if (btnAutospin) {
      if (isAutoRotating) {
        btnAutospin.classList.add('active');
        if (autospinIcon) autospinIcon.textContent = '⏸';
        if (autospinText) autospinText.textContent = 'PAUSE 360° SPIN';
        if (telemetryMode) telemetryMode.textContent = 'AUTO-ROTATE 360°';
      } else {
        btnAutospin.classList.remove('active');
        if (autospinIcon) autospinIcon.textContent = '▶';
        if (autospinText) autospinText.textContent = 'AUTO-ROTATE 360°';
        if (telemetryMode) telemetryMode.textContent = 'MANUAL DRAG';
      }
    }
  }

  if (btnAutospin) {
    btnAutospin.addEventListener('click', () => {
      isAutoRotating = !isAutoRotating;
      userManuallyPaused = !isAutoRotating;
      if (resumeSpinTimeout) clearTimeout(resumeSpinTimeout);
      updateAutoSpinUI();
      playSoundTone(isAutoRotating ? 880 : 440, 0.08);
    });
  }

  if (btnResetAngle) {
    btnResetAngle.addEventListener('click', () => {
      targetAngle = defaultAngle;
      dragVelocity = 0;
      targetZoom = 1.0;
      if (telemetryZoom) telemetryZoom.textContent = '1.0X';
      if (btnZoom) btnZoom.classList.remove('active');
      isAutoRotating = true;
      userManuallyPaused = false;
      updateAutoSpinUI();
      playSoundTone(520, 0.08);
    });
  }

  if (btnZoom) {
    btnZoom.addEventListener('click', () => {
      if (targetZoom > 1.1) {
        targetZoom = 1.0;
        btnZoom.classList.remove('active');
        if (zoomText) zoomText.textContent = currentType === 'wheel' ? 'ZOOM WHEEL FITMENT' : 'ZOOM SPOILER AERO';
        if (telemetryZoom) telemetryZoom.textContent = '1.0X';
      } else {
        targetZoom = 1.65;
        if (currentType === 'wheel') {
          zoomCenterX = currentCar.frontWheelHub ? currentCar.frontWheelHub.x : 0.58;
          zoomCenterY = currentCar.frontWheelHub ? currentCar.frontWheelHub.y : 0.62;
        } else {
          zoomCenterX = (currentCar.hotspot ? currentCar.hotspot.x : 50) / 100;
          zoomCenterY = (currentCar.hotspot ? currentCar.hotspot.y : 40) / 100;
        }
        btnZoom.classList.add('active');
        if (zoomText) zoomText.textContent = 'RESET ZOOM';
        if (telemetryZoom) telemetryZoom.textContent = `1.65X (${currentType === 'wheel' ? 'WHEEL' : 'SPOILER'})`;
      }
      playSoundTone(900, 0.06);
    });
  }

  if (btnHotspotToggle) {
    btnHotspotToggle.addEventListener('click', () => {
      hotspotsVisible = !hotspotsVisible;
      btnHotspotToggle.classList.toggle('active', hotspotsVisible);
      if (hotspotWrapper) hotspotWrapper.style.display = hotspotsVisible ? 'block' : 'none';
      playSoundTone(700, 0.05);
    });
  }

  // --- Hotspot Popup Interaction ---
  if (hotspotPin) {
    hotspotPin.addEventListener('click', (e) => {
      e.stopPropagation();
      hotspotPopup.classList.toggle('open');
      playSoundTone(850, 0.07);
    });
  }

  document.addEventListener('click', (e) => {
    if (hotspotPopup && !hotspotPopup.contains(e.target) && e.target !== hotspotPin) {
      hotspotPopup.classList.remove('open');
    }
  });

  if (popupViewSpecBtn) {
    popupViewSpecBtn.addEventListener('click', () => {
      openSpecModal();
    });
  }

  // --- Technical Spec Sheet Modal ---
  function openSpecModal() {
    if (!fullSpecModal) return;
    playSoundTone(740, 0.08);

    const activePhoto = (currentItem.finishImages && currentItem.finishImages[currentFinish]) || currentItem.defaultImage || currentItem.image;
    specModalImg.src = activePhoto;
    specModalTitle.textContent = currentItem.title;
    specModalDesc.textContent = currentItem.desc;

    specModalTable.innerHTML = currentItem.detailedSpecs.map(s => `
      <div class="modal-spec-row">
        <span class="m-spec-prop">${s.prop}</span>
        <span class="m-spec-val">${s.val}</span>
      </div>
    `).join('');

    specModalFitment.innerHTML = currentItem.compatible.map(c => `
      <span class="fitment-chip">${c}</span>
    `).join('');

    fullSpecModal.classList.add('open');
  }

  if (closeSpecModalBtn) {
    closeSpecModalBtn.addEventListener('click', () => {
      fullSpecModal.classList.remove('open');
      playSoundTone(420, 0.05);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (fullSpecModal && fullSpecModal.classList.contains('open')) fullSpecModal.classList.remove('open');
      if (quickSwitcherTray && quickSwitcherTray.classList.contains('open')) quickSwitcherTray.classList.remove('open');
    }
  });

  // --- Finish Switcher (Updates Live Macro Lens HUD & Spec Drawer) ---
  finishDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      playSoundTone(980, 0.05);

      finishDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');

      const finishKey = dot.getAttribute('data-finish');
      const finishName = dot.getAttribute('data-name');
      currentFinish = finishKey;

      if (paletteFinishName) paletteFinishName.textContent = finishName;

      // Update Live Macro Lens
      updateMacroLensDisplay();

      // Update thumbnail image in fitted drawer
      const activePhoto = (currentItem.finishImages && currentItem.finishImages[finishKey]) || currentItem.defaultImage;
      if (fittedThumbImg) fittedThumbImg.src = activePhoto;

      // Update URL without reload
      const newUrl = new URL(window.location);
      newUrl.searchParams.set('finish', finishKey);
      window.history.replaceState({}, '', newUrl);

      // Redraw canvas cleanly
      drawCanvas();
    });
  });

  // Update Live Macro Lens (Top-Right Telemetry Widget)
  function updateMacroLensDisplay() {
    if (!wheelMacroLens) return;

    if (currentType === 'wheel') {
      wheelMacroLens.style.display = 'flex';
      const activePhoto = (currentItem.finishImages && currentItem.finishImages[currentFinish]) || currentItem.defaultImage;
      if (lensMacroImg) lensMacroImg.src = activePhoto;
      if (lensWheelTitle) lensWheelTitle.textContent = currentItem.title;
      const fDot = document.querySelector(`.finish-choice-dot[data-finish="${currentFinish}"]`);
      const finishName = fDot ? fDot.getAttribute('data-name') : currentFinish.toUpperCase();
      if (lensFinishTag) lensFinishTag.textContent = `COAT: ${finishName}`;
    } else if (currentType === 'spoiler') {
      wheelMacroLens.style.display = 'flex';
      if (lensMacroImg) lensMacroImg.src = currentItem.image;
      if (lensWheelTitle) lensWheelTitle.textContent = currentItem.title;
      if (lensFinishTag) lensFinishTag.textContent = `DOWNFORCE: ${currentItem.downforce || 'ACTIVE CARBON'}`;
    } else if (currentType === 'exhaust') {
      wheelMacroLens.style.display = 'flex';
      if (lensMacroImg) lensMacroImg.src = currentItem.image;
      if (lensWheelTitle) lensWheelTitle.textContent = currentItem.title;
      if (lensFinishTag) lensFinishTag.textContent = `SOUND: ${currentItem.soundLevel || '108 dB TRACK SPEC'}`;
    } else {
      wheelMacroLens.style.display = 'none';
    }
  }

  // --- Quick Switcher Tray Logic (Strictly shows ONLY items from active category!) ---
  function populateQuickTray() {
    if (!trayItemsCarousel) return;

    // Strictly show ONLY wheels when in wheel inspection!
    // Strictly show ONLY spoilers when in spoiler inspection!
    // Strictly show ONLY exhausts when in exhaust inspection!
    const itemsToShow = currentType === 'wheel' ? WHEELS : (currentType === 'spoiler' ? SPOILERS : EXHAUSTS);

    if (trayKicker) {
      if (currentType === 'wheel') trayKicker.textContent = 'ORIGINAL FORGED ALLOY WHEELS CATALOG';
      else if (currentType === 'spoiler') trayKicker.textContent = 'ORIGINAL ACTIVE CARBON SPOILERS CATALOG';
      else trayKicker.textContent = 'ORIGINAL SUPERBIKE RACING EXHAUST CATALOG';
    }

    if (trayTitle) {
      if (currentType === 'wheel') trayTitle.textContent = 'INSPECT OTHER FORGED WHEELS ON THIS VEHICLE';
      else if (currentType === 'spoiler') trayTitle.textContent = 'INSPECT OTHER ACTIVE SPOILERS ON THIS VEHICLE';
      else trayTitle.textContent = 'INSPECT OTHER SUPERBIKE RACING EXHAUSTS';
    }

    if (btnSwitchTray) {
      const bText = btnSwitchTray.querySelector('.btn-text');
      if (bText) {
        if (currentType === 'wheel') bText.textContent = 'SWITCH WHEEL';
        else if (currentType === 'spoiler') bText.textContent = 'SWITCH SPOILER';
        else bText.textContent = 'SWITCH EXHAUST';
      }
    }

    trayItemsCarousel.innerHTML = itemsToShow.map(item => {
      const isCurrent = item.id === currentItem.id;
      const thumb = item.defaultImage || item.image;
      const cardTypeLabel = currentType === 'wheel' ? 'FORGED WHEEL' : (currentType === 'spoiler' ? 'ACTIVE CARBON SPOILER' : 'RACING EXHAUST');

      return `
        <div class="tray-card ${isCurrent ? 'active' : ''}" data-id="${item.id}" data-type="${currentType}">
          <div class="tray-card-thumb">
            <img src="${thumb}" alt="${item.title}">
            <span class="tray-card-badge ${item.brand}-badge">${item.brand.toUpperCase()}</span>
          </div>
          <div class="tray-card-info">
            <span class="tray-card-type">${cardTypeLabel}</span>
            <h5 class="tray-card-title">${item.title}</h5>
          </div>
        </div>
      `;
    }).join('');

    trayItemsCarousel.querySelectorAll('.tray-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const type = card.getAttribute('data-type');
        switchItem(id, type);
      });
    });
  }

  if (btnSwitchTray) {
    btnSwitchTray.addEventListener('click', () => {
      quickSwitcherTray.classList.toggle('open');
      playSoundTone(680, 0.06);
    });
  }

  if (closeTrayBtn) {
    closeTrayBtn.addEventListener('click', () => {
      quickSwitcherTray.classList.remove('open');
      playSoundTone(420, 0.05);
    });
  }

  // --- Switch Item Engine ---
  function switchItem(newId, newType) {
    const list = newType === 'wheel' ? WHEELS : (newType === 'spoiler' ? SPOILERS : EXHAUSTS);
    const nextItem = list.find(i => i.id === newId);
    if (!nextItem) return;

    playSoundTone(840, 0.1);
    currentItem = nextItem;
    currentType = newType;
    currentCar = currentItem.fittedCar;
    currentFinish = currentItem.defaultFinish || 'silver';

    // Update URL
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('type', currentType);
    newUrl.searchParams.set('id', currentItem.id);
    newUrl.searchParams.set('finish', currentFinish);
    newUrl.searchParams.set('autospin', '1');
    window.history.pushState({}, '', newUrl);

    if (quickSwitcherTray) quickSwitcherTray.classList.remove('open');

    // Reinitialize studio with new supercar and component
    initializeStudio();
  }

  // --- Fitment Concierge Booking Navigation ---
  function navigateToConciergeBooking() {
    playSoundTone(920, 0.12);

    let categoryName = 'Original Forged Alloy Wheels';
    if (currentType === 'spoiler') categoryName = 'Original Active Aerodynamic Spoiler';
    else if (currentType === 'exhaust') categoryName = 'Original Superbike Racing Exhaust';

    const inquiryPayload = {
      brand: currentCar.brand,
      carName: currentCar.name,
      itemId: currentItem.id,
      itemTitle: currentItem.title,
      category: categoryName,
      finish: currentFinish
    };

    sessionStorage.setItem('scuderia_inquiry_payload', JSON.stringify(inquiryPayload));
    window.location.href = 'services.html#inquiry';
  }

  if (fittedQuoteBtn) fittedQuoteBtn.addEventListener('click', navigateToConciergeBooking);
  if (viewerInquireBtn) viewerInquireBtn.addEventListener('click', navigateToConciergeBooking);

  // --- Initialize Studio View for Active Item ---
  function initializeStudio() {
    // 1. Vehicle Marque & Titles
    carBrandBadge.textContent = currentItem.brandLabel;
    carBrandBadge.className = `modal-brand-badge ${currentItem.brand}-badge`;

    if (currentType === 'wheel') {
      fittedCategoryBadge.textContent = 'FITTED ALLOY WHEEL';
    } else if (currentType === 'spoiler') {
      fittedCategoryBadge.textContent = 'FITTED ACTIVE SPOILER';
    } else {
      fittedCategoryBadge.textContent = 'FITTED RACING EXHAUST';
    }

    const viewerVideoBtn = document.getElementById('viewer-video-btn');
    if (viewerVideoBtn) {
      viewerVideoBtn.style.display = currentType === 'exhaust' ? 'inline-flex' : 'none';
    }

    const modeSwitcherBar = document.getElementById('viewer-mode-switcher');
    const stageVideoContainer = document.getElementById('viewer-bike-video-stage');
    const stageVideo = document.getElementById('viewer-stage-video');
    const canvasElement = document.getElementById('studio-360-canvas');
    const turntableRingElement = document.getElementById('turntable-ring');

    if (currentType === 'exhaust') {
      if (modeSwitcherBar) modeSwitcherBar.style.display = 'inline-flex';
      const modeBtnVideo = document.getElementById('mode-btn-video');
      if (modeBtnVideo) {
        modeBtnVideo.className = `mode-switch-btn active mode-${currentItem.brand}`;
      }
      if (typeof window.setViewerDisplayMode === 'function') {
        window.setViewerDisplayMode('video');
      }
    } else {
      if (modeSwitcherBar) modeSwitcherBar.style.display = 'none';
      if (stageVideoContainer) stageVideoContainer.style.display = 'none';
      if (stageVideo) stageVideo.pause();
      if (canvasElement) canvasElement.style.opacity = '1';
      if (turntableRingElement) turntableRingElement.style.display = 'block';
    }

    carTitle.textContent = currentCar.name.toUpperCase();
    carSubtitle.textContent = currentCar.subtitle;

    // 2. Default Inspection Angles & Zoom Target
    defaultAngle = currentType === 'wheel' ? 45 : (currentType === 'spoiler' ? 190 : 35);
    targetAngle = defaultAngle;
    angle = defaultAngle;
    dragVelocity = 0;

    if (currentType === 'wheel') {
      zoomCenterX = currentCar.frontWheelHub ? currentCar.frontWheelHub.x : 0.58;
      zoomCenterY = currentCar.frontWheelHub ? currentCar.frontWheelHub.y : 0.62;
      if (zoomText) zoomText.textContent = 'ZOOM WHEEL FITMENT';
    } else if (currentType === 'spoiler') {
      zoomCenterX = (currentCar.hotspot ? currentCar.hotspot.x : 50) / 100;
      zoomCenterY = (currentCar.hotspot ? currentCar.hotspot.y : 40) / 100;
      if (zoomText) zoomText.textContent = 'ZOOM SPOILER AERO';
    } else {
      zoomCenterX = (currentCar.hotspot ? currentCar.hotspot.x : 35) / 100;
      zoomCenterY = (currentCar.hotspot ? currentCar.hotspot.y : 60) / 100;
      if (zoomText) zoomText.textContent = 'ZOOM EXHAUST SYSTEM';
    }

    // 3. Always Start Auto-Spinning in 360 immediately
    isAutoRotating = true;
    userManuallyPaused = false;
    updateAutoSpinUI();

    // 4. Hotspot Telemetry Setup
    hotspotLabel.textContent = currentCar.hotspot.title;
    popupTitle.textContent = currentItem.title;
    popupPartNo.textContent = currentCar.hotspot.oem;

    popupSpecsGrid.innerHTML = currentItem.specs.map(s => `
      <div class="popup-spec-pill">
        <span class="spec-prop">${s.label}</span>
        <span class="spec-val">${s.val}</span>
      </div>
    `).join('');

    // 5. Finish Palette Setup (Shown ONLY for alloy wheels!)
    if (currentType === 'wheel') {
      finishPalette.style.display = 'block';
      finishDots.forEach(d => {
        const fKey = d.getAttribute('data-finish');
        d.classList.toggle('active', fKey === currentFinish);
        if (fKey === currentFinish && paletteFinishName) {
          paletteFinishName.textContent = d.getAttribute('data-name');
        }
      });
    } else {
      finishPalette.style.display = 'none'; // NEVER show wheel finish palette in spoiler view!
    }

    // 6. Update Live Macro Lens HUD
    updateMacroLensDisplay();

    // 7. Fitted Card Drawer Setup
    const thumbImg = (currentItem.finishImages && currentItem.finishImages[currentFinish]) || currentItem.defaultImage || currentItem.image;
    fittedThumbImg.src = thumbImg;
    fittedCardTitle.textContent = currentItem.title;

    fittedSpecsMini.innerHTML = currentItem.specs.slice(0, 2).map(s => `
      <div class="mini-spec-row">
        <span class="mini-k">${s.label}:</span>
        <span class="mini-v">${s.val}</span>
      </div>
    `).join('');

    // 8. Preload Supercar Studio Photography (Strictly for this component!)
    preloadSupercarStudioImages();

    // 9. Update Quick Switcher Tray (Strictly for this component category!)
    populateQuickTray();

    // 10. Trigger Resize & Redraw
    resizeCanvas();

    // Auto-fade drag hint after 3.5s
    setTimeout(() => {
      if (dragHint) dragHint.classList.add('fade-out');
    }, 3500);
  }

  // Window Resize
  window.addEventListener('resize', resizeCanvas);

  // Superbike Cinema Modal Logic
  const viewerVideoBtn = document.getElementById('viewer-video-btn');
  const cinemaModal = document.getElementById('superbike-cinema-modal');
  const cinemaVideoPlayer = document.getElementById('cinema-video-player');
  const cinemaCloseBtn = document.getElementById('cinema-close-btn');
  const cinemaBackdrop = document.getElementById('cinema-backdrop');
  const cinemaBadge = document.getElementById('cinema-badge');
  const cinemaTitle = document.getElementById('cinema-title');
  const cinemaExhaustSpec = document.getElementById('cinema-exhaust-spec');
  const cinemaPowerSpec = document.getElementById('cinema-power-spec');
  const cinemaWeightSpec = document.getElementById('cinema-weight-spec');
  const cinemaWhatsAppBtn = document.getElementById('cinema-whatsapp-btn');

  const SUPERBIKE_VIDEOS = {
    'exhaust-ducati-panigale': {
      videoSrc: 'ducati%20panigale/ducati%20panigale.mp4',
      badge: 'DUCATI CORSE',
      title: 'Ducati Panigale V4 Akrapovič Full Titanium Track Run',
      exhaustSpec: 'Dual Slash-Cut // Full Titanium',
      powerSpec: '+12.5 HP @ 13,000 RPM',
      weightSpec: '-6.2 KG Full Titanium',
      waText: 'Hello Scuderia Veloce, I am interested in the Ducati Panigale V4 Akrapovič Full Titanium Racing Exhaust.'
    },
    'exhaust-bmw-m1000rr': {
      videoSrc: 'bmw%20m%201000%20rr/bmw%20m%20100%20rr.mp4',
      badge: 'BMW MOTORRAD M',
      title: 'BMW M 1000 RR Akrapovič Hexagonal Titanium Track Run',
      exhaustSpec: 'Hexagonal Carbon // Titanium Link',
      powerSpec: '+10.8 HP @ 14,500 RPM',
      weightSpec: '-5.4 KG Aerospace Titanium',
      waText: 'Hello Scuderia Veloce, I am interested in the BMW M 1000 RR Akrapovič M-Performance Titanium Exhaust.'
    },
    'exhaust-kawasaki-h2': {
      videoSrc: 'Ninja%20h2/ninja%20h2.mp4',
      badge: 'KAWASAKI RACING',
      title: 'Kawasaki Ninja H2 Supercharged Megaphone Track Run',
      exhaustSpec: 'Supercharged Megaphone // Slash-Cut',
      powerSpec: '+16.4 HP Supercharged Boost',
      weightSpec: '-7.1 KG Hand-TIG Titanium',
      waText: 'Hello Scuderia Veloce, I am interested in the Kawasaki Ninja H2 Supercharged Megaphone Racing Exhaust.'
    }
  };

  // On-Stage Superbike Video & Mode Control
  const modeSwitcherBar = document.getElementById('viewer-mode-switcher');
  const modeBtnVideo = document.getElementById('mode-btn-video');
  const modeBtn360 = document.getElementById('mode-btn-360');
  const stageVideoContainer = document.getElementById('viewer-bike-video-stage');
  const stageVideo = document.getElementById('viewer-stage-video');
  const canvasElement = document.getElementById('studio-360-canvas');
  const turntableRingElement = document.getElementById('turntable-ring');
  const dragHintElement = document.getElementById('drag-hint');

  window.setViewerDisplayMode = function (mode) {
    playSoundTone(700, 0.05);
    if (mode === 'video') {
      if (modeBtnVideo) modeBtnVideo.classList.add('active');
      if (modeBtn360) modeBtn360.classList.remove('active');
      if (stageVideoContainer) stageVideoContainer.style.display = 'flex';
      if (canvasElement) canvasElement.style.opacity = '0.08';
      if (turntableRingElement) turntableRingElement.style.display = 'none';
      if (dragHintElement) dragHintElement.style.display = 'none';
      isAutoRotating = false;

      const data = SUPERBIKE_VIDEOS[currentItem.id] || SUPERBIKE_VIDEOS['exhaust-ducati-panigale'];
      if (stageVideo) {
        stageVideo.muted = true;
        stageVideo.volume = 0;
        if (!stageVideo.src || (!stageVideo.src.includes(encodeURIComponent(data.videoSrc)) && !stageVideo.src.includes(data.videoSrc))) {
          stageVideo.src = data.videoSrc;
          stageVideo.load();
        }
        stageVideo.play().catch(e => console.warn('Stage video play blocked:', e));
      }
    } else {
      if (modeBtnVideo) modeBtnVideo.classList.remove('active');
      if (modeBtn360) modeBtn360.classList.add('active');
      if (stageVideoContainer) stageVideoContainer.style.display = 'none';
      if (stageVideo) stageVideo.pause();
      if (canvasElement) canvasElement.style.opacity = '1';
      if (turntableRingElement) turntableRingElement.style.display = 'block';
      isAutoRotating = true;
      userManuallyPaused = false;
    }
  };

  if (modeBtnVideo) {
    modeBtnVideo.addEventListener('click', () => window.setViewerDisplayMode('video'));
  }
  if (modeBtn360) {
    modeBtn360.addEventListener('click', () => window.setViewerDisplayMode('360'));
  }

  function openViewerCinema() {
    playSoundTone(850, 0.08);
    const data = SUPERBIKE_VIDEOS[currentItem.id] || SUPERBIKE_VIDEOS['exhaust-ducati-panigale'];
    if (cinemaBadge) cinemaBadge.textContent = data.badge;
    if (cinemaTitle) cinemaTitle.textContent = data.title;
    if (cinemaExhaustSpec) cinemaExhaustSpec.textContent = data.exhaustSpec;
    if (cinemaPowerSpec) cinemaPowerSpec.textContent = data.powerSpec;
    if (cinemaWeightSpec) cinemaWeightSpec.textContent = data.weightSpec;
    if (cinemaWhatsAppBtn) {
      cinemaWhatsAppBtn.href = `https://wa.me/918086648642?text=${encodeURIComponent(data.waText)}`;
    }

    if (cinemaVideoPlayer) {
      cinemaVideoPlayer.src = data.videoSrc;
      cinemaVideoPlayer.muted = true;
      cinemaVideoPlayer.volume = 0;
      cinemaVideoPlayer.load();
      cinemaVideoPlayer.play().catch(e => {
        console.warn('Cinema video playback warning:', e);
      });
    }

    if (cinemaModal) {
      cinemaModal.classList.add('open');
    }
  }

  function closeViewerCinema() {
    playSoundTone(500, 0.05);
    if (cinemaVideoPlayer) {
      cinemaVideoPlayer.pause();
      cinemaVideoPlayer.removeAttribute('src');
      cinemaVideoPlayer.load();
    }
    if (cinemaModal) {
      cinemaModal.classList.remove('open');
    }
  }

  if (viewerVideoBtn) {
    viewerVideoBtn.addEventListener('click', openViewerCinema);
  }
  if (cinemaCloseBtn) {
    cinemaCloseBtn.addEventListener('click', closeViewerCinema);
  }
  if (cinemaBackdrop) {
    cinemaBackdrop.addEventListener('click', closeViewerCinema);
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cinemaModal && cinemaModal.classList.contains('open')) {
      closeViewerCinema();
    }
  });

  // --- Initial Launch ---
  initializeStudio();
  if (currentType === 'exhaust') {
    window.setViewerDisplayMode('video');
  }
  animate();

})();
