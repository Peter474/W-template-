/* ════════════════════════════════════════
   Alex & Samira Wedding — script.js
   ════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ────────────────────────────────────
     1. FLOATING PETALS
  ──────────────────────────────────── */
  (function initPetals() {
    const container = document.getElementById('petals');
    if (!container) return;
    const symbols = ['🌸', '🌺', '💮', '🌼', '✿', '❀', '🌷'];
    for (let i = 0; i < 20; i++) {
      const el = document.createElement('div');
      el.className = 'petal';
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.cssText = [
        `left: ${Math.random() * 100}%`,
        `animation-duration: ${7 + Math.random() * 11}s`,
        `animation-delay: ${Math.random() * 14}s`,
        `font-size: ${0.75 + Math.random() * 0.85}rem`
      ].join(';');
      container.appendChild(el);
    }
  })();


  /* ────────────────────────────────────
     2. NAVBAR — scroll shadow + active link
  ──────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });


  /* ────────────────────────────────────
     3. HAMBURGER MENU
  ──────────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });


  /* ────────────────────────────────────
     4. SCROLL-TO on hero scroll hint
  ──────────────────────────────────── */
  var scrollHint = document.getElementById('scrollHint');
  if (scrollHint) {
    scrollHint.addEventListener('click', function () {
      var story = document.getElementById('story');
      if (story) story.scrollIntoView({ behavior: 'smooth' });
    });
  }


  /* ────────────────────────────────────
     5. COUNTDOWN
  ──────────────────────────────────── */
  var weddingDate = new Date('January 01, 2026 19:00:00').getTime();

  function updateCountdown() {
    var el = document.getElementById('countdown');
    if (!el) return;
    var dist = weddingDate - Date.now();

    if (dist <= 0) {
      el.innerHTML = '<span class="countdown-done">💖 Today is the day! 💖</span>';
      return;
    }

    var days    = Math.floor(dist / 86400000);
    var hours   = Math.floor((dist % 86400000) / 3600000);
    var minutes = Math.floor((dist % 3600000) / 60000);
    var seconds = Math.floor((dist % 60000) / 1000);

    var units = [
      { label: 'Days',  val: days    },
      { label: 'Hours', val: hours   },
      { label: 'Mins',  val: minutes },
      { label: 'Secs',  val: seconds }
    ];

    el.innerHTML = units.map(function (u) {
      return '<div class="countdown-unit">' +
               '<span class="countdown-num">' + String(u.val).padStart(2, '0') + '</span>' +
               '<span class="countdown-label">' + u.label + '</span>' +
             '</div>';
    }).join('');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* ────────────────────────────────────
     6. SCROLL REVEAL
  ──────────────────────────────────── */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // fire once
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ────────────────────────────────────
     7. GALLERY — filter + lightbox
  ──────────────────────────────────── */

  // --- Filter buttons ---
  var filterBtns = document.querySelectorAll('.filter-btn');
  var galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-filter');

      galleryItems.forEach(function (item) {
        var cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // --- Lightbox ---
  var lightbox      = document.getElementById('lightbox');
  var lightboxImg   = document.getElementById('lightboxImg');
  var lightboxCap   = document.getElementById('lightboxCaption');
  var lightboxCount = document.getElementById('lightboxCounter');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev  = document.getElementById('lightboxPrev');
  var lightboxNext  = document.getElementById('lightboxNext');

  var currentIndex   = 0;
  var visibleItems   = [];   // live list of non-hidden items

  function getVisible() {
    return Array.from(galleryItems).filter(function (i) {
      return !i.classList.contains('hidden');
    });
  }

  function openLightbox(index) {
    visibleItems = getVisible();
    if (!visibleItems.length) return;

    currentIndex = index;
    showSlide(currentIndex);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // clear src after transition
    setTimeout(function () {
      lightboxImg.src = '';
    }, 380);
  }

  function showSlide(idx) {
    var item = visibleItems[idx];
    if (!item) return;

    var src     = item.getAttribute('data-src')     || item.querySelector('img').src;
    var caption = item.getAttribute('data-caption') || '';

    lightboxImg.style.opacity = '0';
    lightboxImg.src = src;
    lightboxImg.onload = function () {
      lightboxImg.style.transition = 'opacity .3s';
      lightboxImg.style.opacity = '1';
    };

    lightboxCap.textContent   = caption;
    lightboxCount.textContent = (idx + 1) + ' / ' + visibleItems.length;
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    showSlide(currentIndex);
  }
  function nextSlide() {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    showSlide(currentIndex);
  }

  // Open on gallery item click
  galleryItems.forEach(function (item, idx) {
    item.addEventListener('click', function () {
      // Determine index among visible items
      visibleItems = getVisible();
      var visIdx = visibleItems.indexOf(item);
      if (visIdx !== -1) openLightbox(visIdx);
    });
  });

  // Controls
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', prevSlide);
  lightboxNext.addEventListener('click', nextSlide);

  // Click backdrop
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape' || e.key === 'Esc') closeLightbox();
    if (e.key === 'ArrowLeft')  prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  });

  // Touch swipe on lightbox
  var touchStartX = 0;
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) nextSlide(); else prevSlide();
    }
  }, { passive: true });

  // Add shimmer class while images load
  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.classList.add('loading');
    var img = item.querySelector('img');
    if (img) {
      img.addEventListener('load',  function () { item.classList.remove('loading'); });
      img.addEventListener('error', function () { item.classList.remove('loading'); });
      if (img.complete) item.classList.remove('loading');
    }
  });


  /* ────────────────────────────────────
     8. COPY VENUE ADDRESS (toast)
  ──────────────────────────────────── */
  window.copyVenue = function () {
    var address = '[Venue Name / Address]'; // ← replace with real address
    if (navigator.clipboard) {
      navigator.clipboard.writeText(address).catch(function () {});
    } else {
      // Fallback for older browsers
      var ta = document.createElement('textarea');
      ta.value = address;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    var toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 2600);
  };

}); // end DOMContentLoaded
