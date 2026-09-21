import { WHEELS, SPOILERS, EXHAUSTS } from './accessories-data.js';

(function () {
  'use strict';

  // --- Web Audio Synthesizer ---
  let audioCtx = null;
  let soundEnabled = false;

  function initAudio() {
    if (audioCtx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    } catch (e) {
      console.warn('Audio not available:', e);
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

  const soundBtn = document.getElementById('sound-btn');
  const soundToast = document.getElementById('sound-toast');

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
        playClickSound(800, 0.08);
      } else {
        soundBtn.classList.remove('active');
        soundBtn.querySelector('.sound-icon').textContent = '🔈';
      }
    });
  }

  // --- Finish Switcher with Real Product Photography ---
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

        // Switch to the authentic high-resolution photograph of that finish
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

  // --- Supercar Brand Filters ---
  const brandPills = document.querySelectorAll('.brand-pill');
  const allCards = document.querySelectorAll('.accessory-card');

  brandPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      playClickSound(500, 0.06);
      brandPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const targetBrand = pill.getAttribute('data-brand');

      allCards.forEach((card) => {
        const cardBrand = card.getAttribute('data-brand');
        const isMatch = targetBrand === 'all' ||
                        cardBrand === targetBrand ||
                        (targetBrand === 'superbike' && ['ducati', 'bmw', 'kawasaki', 'superbike'].includes(cardBrand));
        if (isMatch) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- Modal Inspection System ("thodumbo athinte details venam") ---
  const modal = document.getElementById('details-modal');
  let currentModalItem = null;

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

    if (!item) return;
    currentModalItem = item;

    // Brand badge
    const brandBadge = document.getElementById('modal-brand-badge');
    brandBadge.textContent = item.brandLabel;
    brandBadge.className = 'modal-brand-badge ' + item.brand + '-badge';

    // Type badge
    const typeBadge = document.getElementById('modal-type-badge');
    if (itemType === 'wheel') {
      typeBadge.textContent = 'ORIGINAL FORGED WHEEL';
    } else if (itemType === 'spoiler') {
      typeBadge.textContent = 'ORIGINAL ACTIVE CARBON SPOILER';
    } else {
      typeBadge.textContent = 'ORIGINAL SUPERBIKE RACING EXHAUST';
    }

    // Title & Desc
    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-desc').textContent = item.desc;

    // Graphic render in modal
    const modalImg = document.getElementById('modal-real-img');
    const colorwayWrap = document.getElementById('modal-colorway-wrap');
    const activeFinishVal = document.getElementById('modal-active-finish');
    const sourceCard = document.querySelector(`[data-id="${item.id}"]`);

    const modalLaunchBtn = document.getElementById('modal-launch-360-btn');
    if (modalLaunchBtn) {
      const btnSpan = modalLaunchBtn.querySelector('span:nth-child(3)');
      if (btnSpan) {
        btnSpan.textContent = itemType === 'exhaust' 
          ? 'LAUNCH 360° BIKE INSPECTION (STUDIO VIEW)' 
          : 'LAUNCH 360° VEHICLE INSPECTION (CAR FITTED VIEW)';
      }
    }

    if (itemType === 'wheel') {
      const activeStage = sourceCard ? sourceCard.querySelector('.wheel-visual-stage') : null;
      const activeFinish = activeStage ? activeStage.getAttribute('data-finish') : item.defaultFinish;
      const finishName = sourceCard?.querySelector('.active-finish-name')?.textContent || 'Liquid Titanium Silver';

      colorwayWrap.style.display = 'flex';
      activeFinishVal.textContent = finishName;

      const currentImgSrc = (item.finishImages && item.finishImages[activeFinish]) || item.defaultImage;
      modalImg.src = currentImgSrc;
      modalImg.className = 'modal-real-img wheel-modal-img';
    } else if (itemType === 'spoiler') {
      colorwayWrap.style.display = 'none';
      modalImg.src = item.image;
      modalImg.className = 'modal-real-img spoiler-modal-img';
    } else {
      colorwayWrap.style.display = 'none';
      modalImg.src = item.image;
      modalImg.className = 'modal-real-img exhaust-modal-img';
    }

    // Engineering Specs Table
    const specsTable = document.getElementById('modal-specs-table');
    specsTable.innerHTML = item.detailedSpecs.map((spec) => `
      <div class="modal-spec-row">
        <span class="m-spec-prop">${spec.prop}</span>
        <span class="m-spec-val">${spec.val}</span>
      </div>
    `).join('');

    // Fitment list
    const fitmentList = document.getElementById('modal-fitment-list');
    fitmentList.innerHTML = item.compatible.map((car) => `
      <span class="fitment-chip">${car}</span>
    `).join('');

    // Show modal
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeDetailsModal = function () {
    playClickSound(400, 0.05);
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      window.closeDetailsModal();
    }
  });

  // --- CTA from Modal to Form ---
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

  // --- Form Submit Handler ---
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

  // --- 360° Studio Navigation Handlers ---
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

    // Direct navigation to dedicated 360 studio inspection page with automatic 360 rotation
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

  // --- Auto-fill Concierge Inquiry from 360 Studio Return ---
  try {
    const rawPayload = sessionStorage.getItem('scuderia_inquiry_payload');
    if (rawPayload) {
      const payload = JSON.parse(rawPayload);
      sessionStorage.removeItem('scuderia_inquiry_payload');

      window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          const marqueSelect = document.getElementById('marque-select');
          const modelInput = document.getElementById('model-input');
          const categorySelect = document.getElementById('accessory-category');
          const messageTextarea = document.getElementById('inquiry-notes');

          if (marqueSelect && payload.brand) {
            marqueSelect.value = payload.brand.charAt(0).toUpperCase() + payload.brand.slice(1);
          }
          if (modelInput && payload.carName) {
            modelInput.value = payload.carName;
          }
          if (categorySelect && payload.category) {
            categorySelect.value = payload.category;
          }
          if (messageTextarea && payload.itemTitle) {
            messageTextarea.value = `Inspected in 360 Studio: ${payload.itemTitle} (Finish: ${payload.finish || 'Standard'})`;
          }

          const inquirySection = document.getElementById('inquiry');
          if (inquirySection) {
            inquirySection.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      });
    }
  } catch (err) {
    console.warn('Inquiry session check err:', err);
  }

  // =========================================================================
  // SUPERBIKE ACOUSTIC VIDEO & 4K CINEMA ENGINE
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

})();
