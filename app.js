/**
 * SCUDERIA VELOCE // UNIFIED INTERACTIVE ENGINE
 * Seamless Continuity: 3D Scroll Hero (01 Wheel -> 02 Spoiler -> 03 Exhaust -> 04 Icons)
 * -> Continuous transition into Supercar Services & Accessories Atelier
 * -> Dedicated 360 Vehicle Inspection Integration
 */

import { WHEELS, SPOILERS, EXHAUSTS } from './accessories-data.js';

(function () {
  'use strict';

  // --- Configuration ---
  const TOTAL_FRAMES = 300;
  const FOLDER_PATH = '3D%20VIDEO%20HEROSECTION';
  const FRAME_PREFIX = 'ezgif-frame-';
  const FRAME_EXT = '.png';
  
  // --- DOM Elements: Hero Section ---
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const canvasStickyWrap = document.querySelector('.canvas-sticky-wrap');
  
  const preloader = document.getElementById('preloader');
  const progressBar = document.getElementById('progress-bar-fill');
  const loadPercent = document.getElementById('load-percent');
  const loadStatus = document.getElementById('load-status');
  
  const scrollPrompt = document.getElementById('scroll-prompt');
  const telemetryHud = document.querySelector('.telemetry-hud');
  const hudFrame = document.getElementById('hud-frame');
  const hudScroll = document.getElementById('hud-scroll');
  const hudSpeed = document.getElementById('hud-speed');
  const hudGforce = document.getElementById('hud-gforce');
  const tachometerFill = document.getElementById('tachometer-fill');
  
  const scrollContainer = document.querySelector('.scroll-container');
  const storyBlocks = document.querySelectorAll('.story-block');
  const chapterPills = document.querySelectorAll('.chapter-pill');
  
  const bottomControls = document.querySelector('.bottom-controls');
  const scrubberRange = document.getElementById('scrubber-range');
  const scrubPlayBtn = document.getElementById('scrub-play-btn');
  const scrubPlayIcon = document.getElementById('scrub-play-icon');
  const scrubFrameCurrent = document.getElementById('scrub-frame-current');
  const topJumpBtn = document.getElementById('top-jump-btn');
  
  const soundBtn = document.getElementById('sound-btn');
  const soundToast = document.getElementById('sound-toast');
  const autoplayBtn = document.getElementById('autoplay-btn');

  // --- DOM Elements: Services & Modal ---
  const detailsModal = document.getElementById('details-modal');
  let currentModalItem = null;

  // --- State Variables ---
  const images = new Array(TOTAL_FRAMES + 1);
  const loadedFlags = new Array(TOTAL_FRAMES + 1).fill(false);
  let loadedCount = 0;
  
  let currentFrame = 1;
  let targetFrame = 1;
  let lastDrawnFrame = -1;
  
  let isAutoplaying = false;
  let autoplaySpeed = 0.45; // Frames per tick
  let isDraggingScrubber = false;
  
  let scrollVelocity = 0;
  let lastScrollY = window.scrollY;
  let lastScrollTime = performance.now();

  // --- Web Audio Engine (Synthesized V8 / Turbo Acoustics & UI Beeps) ---
  let audioCtx = null;
  let engineOsc1 = null;
  let engineOsc2 = null;
  let engineGain = null;
  let engineFilter = null;
  let soundEnabled = false;

  function initAudio() {
    if (audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Main Gain
      engineGain = audioCtx.createGain();
      engineGain.gain.setValueAtTime(0.001, audioCtx.currentTime);

      // Low pass filter to shape throaty exhaust note
      engineFilter = audioCtx.createBiquadFilter();
      engineFilter.type = 'lowpass';
      engineFilter.frequency.setValueAtTime(240, audioCtx.currentTime);
      engineFilter.Q.setValueAtTime(4.5, audioCtx.currentTime);

      // Sub-harmonic oscillator (Deep Rumble)
      engineOsc1 = audioCtx.createOscillator();
      engineOsc1.type = 'sawtooth';
      engineOsc1.frequency.setValueAtTime(48, audioCtx.currentTime);

      // Mid harmonics (V8 mechanical buzz)
      engineOsc2 = audioCtx.createOscillator();
      engineOsc2.type = 'triangle';
      engineOsc2.frequency.setValueAtTime(96, audioCtx.currentTime);

      engineOsc1.connect(engineFilter);
      engineOsc2.connect(engineFilter);
      engineFilter.connect(engineGain);
      engineGain.connect(audioCtx.destination);

      engineOsc1.start();
      engineOsc2.start();
    } catch (e) {
      console.warn('Web Audio unavailable:', e);
    }
  }

  function playClickSound(freq = 600, duration = 0.04) {
    if (!soundEnabled || !audioCtx) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  }

  function updateAudio(speedFactor) {
    if (!soundEnabled || !audioCtx || !engineGain) return;

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const clampedSpeed = Math.max(0, Math.min(1.5, speedFactor));
    const targetFreq1 = 45 + (clampedSpeed * 75);
    const targetFreq2 = 90 + (clampedSpeed * 150);
    const targetCutoff = 220 + (clampedSpeed * 580);
    const targetGain = 0.02 + (clampedSpeed * 0.09);

    const now = audioCtx.currentTime;
    engineOsc1.frequency.setTargetAtTime(targetFreq1, now, 0.08);
    engineOsc2.frequency.setTargetAtTime(targetFreq2, now, 0.08);
    engineFilter.frequency.setTargetAtTime(targetCutoff, now, 0.08);
    engineGain.gain.setTargetAtTime(targetGain, now, 0.08);
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
          setTimeout(() => soundToast.classList.remove('show'), 3500);
        }
        updateAudio(0.3);
      } else {
        soundBtn.classList.remove('active');
        soundBtn.querySelector('.sound-icon').textContent = '🔈';
        if (engineGain) {
          engineGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.1);
        }
      }
    });
  }

  // --- Helper: Frame URL Constructor ---
  function getFrameUrl(frameIndex) {
    const padIndex = String(frameIndex).padStart(3, '0');
    return `${FOLDER_PATH}/${FRAME_PREFIX}${padIndex}${FRAME_EXT}`;
  }

  // --- Image Preloading with Priority Queuing ---
  function preloadImages() {
    let keyframesLoaded = 0;
    const keyframeThreshold = 24;
    let hasDismissedPreloader = false;

    const priorityIndices = [];
    for (let i = 1; i <= 20; i++) priorityIndices.push(i);
    for (let i = 25; i <= TOTAL_FRAMES; i += 10) priorityIndices.push(i);

    const remainingIndices = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      if (!priorityIndices.includes(i)) remainingIndices.push(i);
    }

    function loadSingleImage(i, isKeyframe = false) {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = getFrameUrl(i);
        
        img.onload = () => {
          images[i] = img;
          loadedFlags[i] = true;
          loadedCount++;
          if (isKeyframe) keyframesLoaded++;

          const pct = Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100));
          if (progressBar) progressBar.style.width = `${pct}%`;
          if (loadPercent) loadPercent.textContent = `${pct}%`;

          if (!hasDismissedPreloader && (keyframesLoaded >= keyframeThreshold || pct >= 20)) {
            hasDismissedPreloader = true;
            if (loadStatus) loadStatus.textContent = 'TELEMETRY READY // LAUNCHING...';
            setTimeout(dismissPreloader, 400);
          }

          if (i === Math.round(currentFrame)) {
            drawFrame(i);
          }

          resolve();
        };

        img.onerror = () => {
          resolve();
        };
      });
    }

    Promise.all(priorityIndices.map(idx => loadSingleImage(idx, true))).then(() => {
      let currentIndex = 0;
      function loadNextBatch() {
        if (currentIndex >= remainingIndices.length) {
          if (loadStatus) loadStatus.textContent = 'ALL 300 FRAMES CACHED (60-120 FPS)';
          return;
        }
        const batch = remainingIndices.slice(currentIndex, currentIndex + 12);
        currentIndex += 12;
        Promise.all(batch.map(idx => loadSingleImage(idx, false))).then(loadNextBatch);
      }
      loadNextBatch();
    });
  }

  function dismissPreloader() {
    if (preloader) {
      preloader.classList.add('fade-out');
      drawFrame(1);
    }
  }

  function getClosestLoadedFrame(target) {
    if (loadedFlags[target]) return target;
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      if (target - offset >= 1 && loadedFlags[target - offset]) return target - offset;
      if (target + offset <= TOTAL_FRAMES && loadedFlags[target + offset]) return target + offset;
    }
    return 1;
  }

  // --- High-DPI Canvas Sizing & Rendering ---
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      ctx.scale(dpr, dpr);
    }
    drawFrame(Math.round(currentFrame));
  }

  function drawFrame(frameIndex) {
    if (frameIndex === lastDrawnFrame) return;

    const actualFrame = getClosestLoadedFrame(frameIndex);
    const img = images[actualFrame];
    if (!img) return;

    lastDrawnFrame = frameIndex;

    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    ctx.clearRect(0, 0, displayWidth, displayHeight);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const screenRatio = displayWidth / displayHeight;

    let renderW, renderH, offsetX, offsetY;

    if (screenRatio > imgRatio) {
      renderW = displayWidth;
      renderH = displayWidth / imgRatio;
      offsetX = 0;
      offsetY = (displayHeight - renderH) / 2;
    } else {
      renderH = displayHeight;
      renderW = displayHeight * imgRatio;
      offsetX = (displayWidth - renderW) / 2;
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
  }

  // --- Scroll Tracking & Physics Loop (With Continuous Hero -> Services Transition) ---
  function getHeroMaxScroll() {
    if (!scrollContainer) return 3800;
    return Math.max(1000, scrollContainer.offsetHeight - window.innerHeight);
  }

  function updateScrollTarget() {
    if (isDraggingScrubber || isAutoplaying) return;

    const scrollTop = window.scrollY || window.pageYOffset;
    const heroMaxScroll = getHeroMaxScroll();

    // Map 0..heroMaxScroll to 1..TOTAL_FRAMES
    const heroProgress = Math.max(0, Math.min(1, scrollTop / heroMaxScroll));
    targetFrame = 1 + heroProgress * (TOTAL_FRAMES - 1);

    // Calculate scroll velocity
    const now = performance.now();
    const dt = Math.max(16, now - lastScrollTime);
    const dy = Math.abs(scrollTop - lastScrollY);
    scrollVelocity = (dy / dt) * 16.6;
    lastScrollY = scrollTop;
    lastScrollTime = now;

    // Hide scroll prompt
    if (heroProgress > 0.02 && scrollPrompt && !scrollPrompt.classList.contains('hide')) {
      scrollPrompt.classList.add('hide');
    }

    // CONTINUITY DYNAMICS: When scrolling past Chapter 4 into Services & Accessories
    if (scrollTop > heroMaxScroll + 40) {
      const overScroll = scrollTop - (heroMaxScroll + 40);
      const fadeRatio = Math.min(1, overScroll / 260);

      // Fade HUD and Scrubber so they never obscure the product cards
      if (telemetryHud) {
        telemetryHud.style.opacity = String(1 - fadeRatio);
        telemetryHud.style.pointerEvents = fadeRatio > 0.5 ? 'none' : 'auto';
      }
      if (bottomControls) {
        bottomControls.style.opacity = String(1 - fadeRatio);
        bottomControls.style.transform = `translateY(${fadeRatio * 90}px)`;
        bottomControls.style.pointerEvents = fadeRatio > 0.5 ? 'none' : 'auto';
      }
      if (canvasStickyWrap) {
        canvasStickyWrap.style.opacity = String(1 - fadeRatio * 0.86); // Soft dark carbon backdrop (0.14)
      }
    } else {
      if (telemetryHud) {
        telemetryHud.style.opacity = '1';
        telemetryHud.style.pointerEvents = 'auto';
      }
      if (bottomControls) {
        bottomControls.style.opacity = '1';
        bottomControls.style.transform = 'translateY(0)';
        bottomControls.style.pointerEvents = 'auto';
      }
      if (canvasStickyWrap) {
        canvasStickyWrap.style.opacity = '1';
      }
    }
  }

  // --- Render & Animation Loop (LERP for silky 60-120fps) ---
  function renderLoop() {
    if (isAutoplaying) {
      targetFrame += autoplaySpeed;
      if (targetFrame > TOTAL_FRAMES) {
        targetFrame = 1;
      }
      
      const heroMaxScroll = getHeroMaxScroll();
      const autoProgress = (targetFrame - 1) / (TOTAL_FRAMES - 1);
      window.scrollTo({
        top: autoProgress * heroMaxScroll,
        behavior: 'instant'
      });
    }

    const diff = targetFrame - currentFrame;
    if (Math.abs(diff) > 0.01) {
      const lerpFactor = isDraggingScrubber ? 0.4 : 0.18;
      currentFrame += diff * lerpFactor;
    } else {
      currentFrame = targetFrame;
    }

    const frameToDraw = Math.round(currentFrame);
    drawFrame(frameToDraw);
    updateUI(currentFrame);

    scrollVelocity *= 0.88;

    requestAnimationFrame(renderLoop);
  }

  // --- Synchronize Typographic Overlays & Telemetry ---
  function updateUI(frameVal) {
    const progress = Math.max(0, Math.min(1, (frameVal - 1) / (TOTAL_FRAMES - 1)));
    const frameInt = Math.round(frameVal);

    if (!isDraggingScrubber && scrubberRange) {
      scrubberRange.value = frameInt;
    }
    if (scrubFrameCurrent) {
      scrubFrameCurrent.textContent = String(frameInt).padStart(3, '0');
    }

    if (hudFrame) hudFrame.textContent = `${String(frameInt).padStart(3, '0')} / ${TOTAL_FRAMES}`;
    if (hudScroll) hudScroll.textContent = `${(progress * 100).toFixed(1)}%`;

    let baseSpeed = 0;
    let baseG = 0.05;

    if (frameInt <= 75) {
      baseSpeed = Math.round((frameInt / 75) * 220);
      baseG = 0.4 + (scrollVelocity * 0.08);
    } else if (frameInt <= 150) {
      baseSpeed = Math.round(220 + ((frameInt - 75) / 75) * 90);
      baseG = 1.1 + (scrollVelocity * 0.12);
    } else if (frameInt <= 225) {
      baseSpeed = Math.round(180 + ((frameInt - 150) / 75) * 110);
      baseG = 0.8 + (scrollVelocity * 0.1);
    } else {
      baseSpeed = 340;
      baseG = 0.15;
    }

    if (hudSpeed) hudSpeed.textContent = `${baseSpeed} KM/H`;
    if (hudGforce) hudGforce.textContent = `${baseG.toFixed(2)} G`;

    const tachRatio = Math.min(1, (baseSpeed / 340) + (scrollVelocity * 0.05));
    if (tachometerFill) tachometerFill.style.width = `${Math.round(tachRatio * 100)}%`;

    if (soundEnabled) {
      const audioIntensity = Math.min(1, tachRatio * 0.7 + (scrollVelocity * 0.3));
      updateAudio(audioIntensity);
    }

    // Active Chapter Pills
    let activeChapter = 0;
    if (frameInt < 72) activeChapter = 0;
    else if (frameInt < 145) activeChapter = 1;
    else if (frameInt < 220) activeChapter = 2;
    else activeChapter = 3;

    storyBlocks.forEach((block, idx) => {
      block.classList.toggle('is-active', idx === activeChapter);
    });

    chapterPills.forEach((pill, idx) => {
      pill.classList.toggle('active', idx === activeChapter);
    });
  }

  // --- Interactive Scrubber Events ---
  if (scrubberRange) {
    scrubberRange.addEventListener('input', (e) => {
      isDraggingScrubber = true;
      if (isAutoplaying) stopAutoplay();
      
      const val = parseInt(e.target.value, 10);
      targetFrame = val;

      const heroMaxScroll = getHeroMaxScroll();
      const progress = (val - 1) / (TOTAL_FRAMES - 1);
      window.scrollTo({
        top: progress * heroMaxScroll,
        behavior: 'instant'
      });
    });

    scrubberRange.addEventListener('change', () => {
      setTimeout(() => { isDraggingScrubber = false; }, 50);
    });
  }

  // --- Chapter Pill Click Nav ---
  chapterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const targetRatio = parseFloat(pill.getAttribute('data-target'));
      const heroMaxScroll = getHeroMaxScroll();
      window.scrollTo({
        top: targetRatio * heroMaxScroll,
        behavior: 'smooth'
      });
      playClickSound(750, 0.05);
    });
  });

  // --- Jump to Top Button ---
  if (topJumpBtn) {
    topJumpBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playClickSound(600, 0.06);
    });
  }

  // --- Autoplay Toggle ---
  function startAutoplay() {
    isAutoplaying = true;
    if (autoplayBtn) autoplayBtn.classList.add('active');
    if (scrubPlayBtn) scrubPlayBtn.classList.add('active');
    if (scrubPlayIcon) scrubPlayIcon.textContent = '⏸';
  }

  function stopAutoplay() {
    isAutoplaying = false;
    if (autoplayBtn) autoplayBtn.classList.remove('active');
    if (scrubPlayBtn) scrubPlayBtn.classList.remove('active');
    if (scrubPlayIcon) scrubPlayIcon.textContent = '▶';
  }

  if (autoplayBtn) {
    autoplayBtn.addEventListener('click', () => {
      if (isAutoplaying) stopAutoplay();
      else startAutoplay();
      playClickSound(850, 0.05);
    });
  }

  if (scrubPlayBtn) {
    scrubPlayBtn.addEventListener('click', () => {
      if (isAutoplaying) stopAutoplay();
      else startAutoplay();
      playClickSound(850, 0.05);
    });
  }

  // =========================================================================
  // SERVICES & ACCESSORIES CONTINUITY ENGINE
  // =========================================================================

  // 1. Finish Switcher on Accessory Cards
  document.querySelectorAll('.accessory-card').forEach((card) => {
    const cardId = card.getAttribute('data-id');
    const colorDots = card.querySelectorAll('.color-dot');
    const visualStage = card.querySelector('.wheel-visual-stage');
    const finishLabel = card.querySelector('.active-finish-name');
    const imgElement = card.querySelector('.wheel-product-img');

    const wheelData = WHEELS.find((w) => w.id === cardId);

    colorDots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        playClickSound(950, 0.05);

        colorDots.forEach((d) => d.classList.remove('active'));
        dot.classList.add('active');

        const colorKey = dot.getAttribute('data-color');
        const colorName = dot.getAttribute('data-name');

        if (visualStage) visualStage.setAttribute('data-finish', colorKey);
        if (finishLabel) finishLabel.textContent = colorName;

        if (imgElement && wheelData && wheelData.finishImages && wheelData.finishImages[colorKey]) {
          imgElement.style.opacity = '0.3';
          imgElement.style.transform = 'scale(0.96)';
          setTimeout(() => {
            imgElement.src = wheelData.finishImages[colorKey];
            imgElement.style.opacity = '1';
            imgElement.style.transform = 'scale(1)';
          }, 120);
        }
      });
    });
  });

  // 2. Supercar Brand Filter Pills
  const brandPills = document.querySelectorAll('.brand-pill');
  const allCards = document.querySelectorAll('.accessory-card');

  brandPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      playClickSound(700, 0.05);
      brandPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const brand = pill.getAttribute('data-brand');

      allCards.forEach((card) => {
        const cardBrand = card.getAttribute('data-brand');
        const isMatch = brand === 'all' ||
                        cardBrand === brand ||
                        (brand === 'superbike' && ['ducati', 'bmw', 'kawasaki', 'superbike'].includes(cardBrand));
        if (isMatch) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  // 3. Technical Engineering Spec Sheet Modal
  window.openDetailsModal = function (itemId) {
    playClickSound(700, 0.08);
    let item = WHEELS.find((w) => w.id === itemId);
    let itemType = 'wheel';

    if (!item) {
      item = SPOILERS.find((s) => s.id === itemId);
      itemType = 'spoiler';
    }

    if (!item) {
      item = EXHAUSTS.find((e) => e.id === itemId);
      itemType = 'exhaust';
    }

    if (!item || !detailsModal) return;
    currentModalItem = item;

    const brandBadge = document.getElementById('modal-brand-badge');
    if (brandBadge) {
      brandBadge.textContent = item.brandLabel;
      brandBadge.className = 'modal-brand-badge ' + item.brand + '-badge';
    }

    const typeBadge = document.getElementById('modal-type-badge');
    if (typeBadge) {
      if (itemType === 'wheel') typeBadge.textContent = 'ORIGINAL FORGED WHEEL';
      else if (itemType === 'spoiler') typeBadge.textContent = 'ORIGINAL ACTIVE CARBON SPOILER';
      else typeBadge.textContent = 'ORIGINAL SUPERBIKE RACING EXHAUST';
    }

    const mTitle = document.getElementById('modal-title');
    const mDesc = document.getElementById('modal-desc');
    if (mTitle) mTitle.textContent = item.title;
    if (mDesc) mDesc.textContent = item.desc;

    const modalLaunchBtn = document.getElementById('modal-launch-360-btn');
    if (modalLaunchBtn) {
      const btnSpan = modalLaunchBtn.querySelector('span:nth-child(3)');
      if (btnSpan) {
        btnSpan.textContent = itemType === 'exhaust' 
          ? 'LAUNCH 360° BIKE INSPECTION (STUDIO VIEW)' 
          : 'LAUNCH 360° VEHICLE INSPECTION (CAR FITTED VIEW)';
      }
    }

    const modalImg = document.getElementById('modal-real-img');
    const colorwayWrap = document.getElementById('modal-colorway-wrap');
    const activeFinishVal = document.getElementById('modal-active-finish');
    const sourceCard = document.querySelector(`[data-id="${item.id}"]`);

    if (itemType === 'wheel') {
      const activeStage = sourceCard ? sourceCard.querySelector('.wheel-visual-stage') : null;
      const activeFinish = activeStage ? activeStage.getAttribute('data-finish') : item.defaultFinish;
      const finishName = sourceCard?.querySelector('.active-finish-name')?.textContent || 'Liquid Titanium Silver';

      if (colorwayWrap) colorwayWrap.style.display = 'flex';
      if (activeFinishVal) activeFinishVal.textContent = finishName;

      const currentImgSrc = (item.finishImages && item.finishImages[activeFinish]) || item.defaultImage;
      if (modalImg) {
        modalImg.src = currentImgSrc;
        modalImg.className = 'modal-real-img wheel-modal-img';
      }
    } else if (itemType === 'spoiler') {
      if (colorwayWrap) colorwayWrap.style.display = 'none';
      if (modalImg) {
        modalImg.src = item.image;
        modalImg.className = 'modal-real-img spoiler-modal-img';
      }
    } else {
      if (colorwayWrap) colorwayWrap.style.display = 'none';
      if (modalImg) {
        modalImg.src = item.image;
        modalImg.className = 'modal-real-img exhaust-modal-img';
      }
    }

    const specsTable = document.getElementById('modal-specs-table');
    if (specsTable) {
      specsTable.innerHTML = item.detailedSpecs.map((spec) => `
        <div class="modal-spec-row">
          <span class="m-spec-prop">${spec.prop}</span>
          <span class="m-spec-val">${spec.val}</span>
        </div>
      `).join('');
    }

    const fitmentList = document.getElementById('modal-fitment-list');
    if (fitmentList) {
      fitmentList.innerHTML = item.compatible.map((car) => `
        <span class="fitment-chip">${car}</span>
      `).join('');
    }

    detailsModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeDetailsModal = function () {
    playClickSound(400, 0.05);
    if (detailsModal) detailsModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && detailsModal && detailsModal.classList.contains('open')) {
      window.closeDetailsModal();
    }
  });

  // 4. CTA from Modal to Concierge Form
  window.inquireThisItem = function () {
    if (!currentModalItem) return;
    window.closeDetailsModal();

    const marqueSelect = document.getElementById('marque-select');
    const modelInput = document.getElementById('model-input');
    const categorySelect = document.getElementById('accessory-category');

    if (marqueSelect) {
      if (currentModalItem.brand === 'ferrari') marqueSelect.value = 'Ferrari';
      else if (currentModalItem.brand === 'lamborghini') marqueSelect.value = 'Lamborghini';
      else if (currentModalItem.brand === 'bugatti') marqueSelect.value = 'Bugatti';
      else if (currentModalItem.brand === 'ducati') marqueSelect.value = 'Ducati';
      else if (currentModalItem.brand === 'bmw') marqueSelect.value = 'BMW';
      else if (currentModalItem.brand === 'kawasaki') marqueSelect.value = 'Kawasaki';
    }

    if (modelInput && currentModalItem.compatible && currentModalItem.compatible.length > 0) {
      modelInput.value = currentModalItem.compatible[0];
    }

    if (categorySelect) {
      if (currentModalItem.id.startsWith('wheel')) {
        categorySelect.value = 'Original Forged Alloy Wheels';
      } else if (currentModalItem.id.startsWith('spoiler')) {
        categorySelect.value = 'Original Active Aerodynamic Spoiler';
      } else {
        categorySelect.value = 'Original Superbike Racing Exhaust';
      }
    }

    const inquirySection = document.getElementById('inquiry');
    if (inquirySection) {
      inquirySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 5. Form Submit Handler
  window.handleFitmentSubmit = function (e) {
    e.preventDefault();
    playClickSound(900, 0.12);
    const toast = document.getElementById('form-success-toast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        document.getElementById('fitment-form').reset();
      }, 4500);
    }
  };

  // 6. Direct 360° Studio Navigation Handlers (With Dedicated Mode & Auto-Spin)
  window.launch360Inspection = function (itemId, type) {
    playClickSound(850, 0.08);

    let finish = 'silver';
    if (type === 'wheel') {
      const card = document.querySelector(`[data-id="${itemId}"]`);
      if (card) {
        const visualStage = card.querySelector('.wheel-visual-stage');
        if (visualStage && visualStage.getAttribute('data-finish')) {
          finish = visualStage.getAttribute('data-finish');
        }
      }
    }

    const targetUrl = `viewer.html?type=${encodeURIComponent(type)}&id=${encodeURIComponent(itemId)}&finish=${encodeURIComponent(finish)}&autospin=1`;
    window.location.href = targetUrl;
  };

  window.launch360FromModal = function () {
    if (!currentModalItem) return;
    playClickSound(850, 0.08);

    let type = 'wheel';
    if (currentModalItem.id.startsWith('spoiler')) type = 'spoiler';
    else if (currentModalItem.id.startsWith('exhaust')) type = 'exhaust';

    let finish = currentModalItem.defaultFinish || 'silver';
    if (type === 'wheel') {
      const sourceCard = document.querySelector(`[data-id="${currentModalItem.id}"]`);
      if (sourceCard) {
        const activeStage = sourceCard.querySelector('.wheel-visual-stage');
        if (activeStage && activeStage.getAttribute('data-finish')) {
          finish = activeStage.getAttribute('data-finish');
        }
      }
    }

    const targetUrl = `viewer.html?type=${encodeURIComponent(type)}&id=${encodeURIComponent(currentModalItem.id)}&finish=${encodeURIComponent(finish)}&autospin=1`;
    window.location.href = targetUrl;
  };

  // =========================================================================
  // 7. SUPERBIKE ACOUSTIC VIDEO & 4K CINEMA ENGINE
  // =========================================================================
  let currentCinemaBikeId = 'exhaust-ducati-panigale';
  const cinemaModal = document.getElementById('superbike-cinema-modal');
  const cinemaVideoPlayer = document.getElementById('cinema-video-player');
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

  function startBikeInlineVideo(bikeId) {
    const stage = document.getElementById(`stage-${bikeId}`);
    const video = document.getElementById(`card-video-${bikeId}`);
    const livePill = document.getElementById(`live-pill-${bikeId}`);
    if (!video || !stage) return;

    stage.classList.add('video-active');
    if (livePill) livePill.style.display = 'inline-flex';
    video.muted = true;
    video.play().catch(e => console.warn('Autoplay prevented:', e));

    const playBtn = stage.querySelector('.stage-play-overlay-btn');
    if (playBtn) {
      const tri = playBtn.querySelector('.play-triangle');
      const txt = playBtn.querySelector('.spo-text');
      if (tri) tri.textContent = '⏸';
      if (txt) txt.textContent = 'PAUSE VIDEO';
    }
  }

  window.toggleCardVideo = function (itemId, event) {
    if (event) event.stopPropagation();
    playClickSound(700, 0.05);

    const stage = document.getElementById(`stage-${itemId}`);
    const video = document.getElementById(`card-video-${itemId}`);
    const livePill = document.getElementById(`live-pill-${itemId}`);
    if (!video || !stage) return;

    if (video.paused) {
      // Pause all other card videos
      document.querySelectorAll('.superbike-card-video').forEach((v) => {
        if (v !== video) {
          v.pause();
          const parentStage = v.closest('.exhaust-visual-stage');
          if (parentStage) {
            parentStage.classList.remove('video-active');
            const pPlayBtn = parentStage.querySelector('.stage-play-overlay-btn');
            if (pPlayBtn) {
              const tri = pPlayBtn.querySelector('.play-triangle');
              const txt = pPlayBtn.querySelector('.spo-text');
              if (tri) tri.textContent = '▶';
              if (txt) txt.textContent = 'WATCH ON-TRACK';
            }
          }
        }
      });

      stage.classList.add('video-active');
      if (livePill) livePill.style.display = 'inline-flex';
      video.play().catch(e => console.warn('Card video autoplay prevented:', e));

      const playBtn = stage.querySelector('.stage-play-overlay-btn');
      if (playBtn) {
        const tri = playBtn.querySelector('.play-triangle');
        const txt = playBtn.querySelector('.spo-text');
        if (tri) tri.textContent = '⏸';
        if (txt) txt.textContent = 'PAUSE VIDEO';
      }
    } else {
      video.pause();
      stage.classList.remove('video-active');
      if (livePill) livePill.style.display = 'none';

      const playBtn = stage.querySelector('.stage-play-overlay-btn');
      if (playBtn) {
        const tri = playBtn.querySelector('.play-triangle');
        const txt = playBtn.querySelector('.spo-text');
        if (tri) tri.textContent = '▶';
        if (txt) txt.textContent = 'WATCH ON-TRACK';
      }
    }
  };

  window.toggleCardAudio = function (itemId, event) {
    if (event) event.stopPropagation();
    playClickSound(800, 0.05);

    const video = document.getElementById(`card-video-${itemId}`);
    const stage = document.getElementById(`stage-${itemId}`);
    if (!video || !stage) return;

    video.muted = !video.muted;
    const soundIcon = stage.querySelector('.sound-status-icon');
    if (soundIcon) {
      soundIcon.textContent = video.muted ? '🔇' : '🔊';
    }
  };

  window.filterSuperbikes = function (brand) {
    playClickSound(750, 0.05);

    const filterBtns = document.querySelectorAll('.sb-filter-btn');
    filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-target') === brand);
    });

    const exhaustCards = document.querySelectorAll('.exhaust-card');
    exhaustCards.forEach(card => {
      const cardBrand = card.getAttribute('data-brand');
      const isMatch = brand === 'all' || cardBrand === brand;

      if (isMatch) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      } else {
        card.style.opacity = '0.2';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
          const currentBtn = document.querySelector(`.sb-filter-btn[data-target="${brand}"]`);
          if (currentBtn && !currentBtn.classList.contains('active')) return;
          if (brand !== 'all' && cardBrand !== brand) {
            card.style.display = 'none';
          }
        }, 220);
      }
    });

    if (brand === 'ducati') {
      const ducatiCard = document.querySelector('[data-id="exhaust-ducati-panigale"]');
      if (ducatiCard) {
        ducatiCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (brand === 'bmw') {
      const bmwCard = document.querySelector('[data-id="exhaust-bmw-m1000rr"]');
      if (bmwCard) {
        bmwCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (brand === 'kawasaki') {
      const kawaCard = document.querySelector('[data-id="exhaust-kawasaki-h2"]');
      if (kawaCard) {
        kawaCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Primary handler: clicking "BIKE VIEW" triggers the authentic video in full 4K cinema mode
  window.openBikeView = function (bikeId) {
    window.openSuperbikeCinema(bikeId);
  };

  window.openSuperbikeCinema = function (bikeId) {
    if (typeof playClickSound === 'function') playClickSound(850, 0.08);
    currentCinemaBikeId = bikeId;

    const modal = document.getElementById('superbike-cinema-modal');
    const player = document.getElementById('cinema-video-player');
    const badge = document.getElementById('cinema-badge');
    const title = document.getElementById('cinema-title');
    const exhaustSpec = document.getElementById('cinema-exhaust-spec');
    const powerSpec = document.getElementById('cinema-power-spec');
    const weightSpec = document.getElementById('cinema-weight-spec');
    const whatsAppBtn = document.getElementById('cinema-whatsapp-btn');

    const data = SUPERBIKE_VIDEOS[bikeId] || SUPERBIKE_VIDEOS['exhaust-ducati-panigale'];
    if (badge) badge.textContent = data.badge;
    if (title) title.textContent = data.title;
    if (exhaustSpec) exhaustSpec.textContent = data.exhaustSpec;
    if (powerSpec) powerSpec.textContent = data.powerSpec;
    if (weightSpec) weightSpec.textContent = data.weightSpec;
    if (whatsAppBtn) {
      whatsAppBtn.href = `https://wa.me/918086648642?text=${encodeURIComponent(data.waText)}`;
    }

    if (player) {
      player.src = data.videoSrc;
      player.muted = true;
      player.volume = 0;
      player.load();
      player.play().catch(e => {
        console.warn('Cinema video playback warning:', e);
      });
    }

    startBikeInlineVideo(bikeId);

    if (modal) {
      modal.classList.add('open');
      modal.style.display = 'flex';
      modal.style.opacity = '1';
      modal.style.pointerEvents = 'auto';
      modal.style.visibility = 'visible';
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeSuperbikeCinema = function () {
    if (typeof playClickSound === 'function') playClickSound(500, 0.05);
    const modal = document.getElementById('superbike-cinema-modal');
    const player = document.getElementById('cinema-video-player');
    if (player) {
      player.pause();
      player.removeAttribute('src');
      player.load();
    }
    if (modal) {
      modal.classList.remove('open');
      modal.style.display = 'none';
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
      modal.style.visibility = 'hidden';
      document.body.style.overflow = '';
    }
  };

  window.onCinemaBackdropClick = function (event) {
    if (event.target === cinemaModal || event.target.classList.contains('cinema-backdrop')) {
      window.closeSuperbikeCinema();
    }
  };

  window.launch360FromCinema = function () {
    window.closeSuperbikeCinema();
    window.launch360Inspection(currentCinemaBikeId, 'exhaust');
  };

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cinemaModal && cinemaModal.classList.contains('open')) {
      window.closeSuperbikeCinema();
    }
  });

  // Pause videos when scrolling away from bike exhausts
  const bikeExhaustsSection = document.getElementById('bike-exhausts');
  if (bikeExhaustsSection && 'IntersectionObserver' in window) {
    const exhaustObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          document.querySelectorAll('.superbike-card-video').forEach((v) => {
            v.pause();
            const pStage = v.closest('.exhaust-visual-stage');
            if (pStage) {
              pStage.classList.remove('video-active');
              const pPlayBtn = pStage.querySelector('.stage-play-overlay-btn');
              if (pPlayBtn) {
                const tri = pPlayBtn.querySelector('.play-triangle');
                const txt = pPlayBtn.querySelector('.spo-text');
                if (tri) tri.textContent = '▶';
                if (txt) txt.textContent = 'WATCH ON-TRACK';
              }
            }
          });
        }
      });
    }, { threshold: 0.1 });

    exhaustObserver.observe(bikeExhaustsSection);
  }

  // --- Window Event Listeners ---
  window.addEventListener('scroll', updateScrollTarget, { passive: true });
  window.addEventListener('resize', resizeCanvas);

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      targetFrame = Math.min(TOTAL_FRAMES, targetFrame + 4);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      targetFrame = Math.max(1, targetFrame - 4);
    } else if (e.key === ' ') {
      if (isAutoplaying) stopAutoplay();
      else startAutoplay();
    }
  });

  // --- Initial Launch ---
  resizeCanvas();
  preloadImages();
  renderLoop();

})();
