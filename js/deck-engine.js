(function() {
  'use strict';

  var slides = Array.from(document.querySelectorAll('.slide'));
  var total = slides.length;
  var current = 0;
  var overviewMode = false;
  var announcer = document.getElementById('slide-announcer');
  var scrubber = document.getElementById('scrubber-container');

  document.getElementById('nav-total').textContent = total;

  // Set scrubber max value
  if (scrubber) scrubber.setAttribute('aria-valuemax', total);

  // --- Slide label helper ---
  function getSlideLabel(index) {
    var slide = slides[index];
    var label = slide.getAttribute('aria-label');
    if (label) return label;
    return 'Slide ' + (index + 1) + ' of ' + total;
  }

  // --- Navigation ---
  function goTo(index, instant) {
    if (index < 0 || index >= total) return;
    current = index;

    slides.forEach(function(s, i) {
      if (i === current) {
        s.classList.add('active');
        s.setAttribute('aria-current', 'step');
        if (instant) { s.style.transition = 'none'; requestAnimationFrame(function() { s.style.transition = ''; }); }
      } else {
        s.classList.remove('active');
        s.removeAttribute('aria-current');
        resetSteps(s);
        resetStream(s);
      }
    });

    // Stream in bullets on active slide
    streamBullets(slides[current]);

    // Update nav
    document.getElementById('nav-current').textContent = current + 1;

    // Update hash
    history.replaceState(null, '', '#' + (current + 1));

    // Hide watermark on title (first) and closing (last) slides
    var logo = document.getElementById('logoWatermark');
    if (current === 0 || current === total - 1) {
      logo.classList.add('hidden');
    } else {
      logo.classList.remove('hidden');
    }

    // Carousel management
    if (window.pauseCarousel) window.pauseCarousel(current === 0 ? 0 : current - 1);
    if (window.startCarousel) window.startCarousel(current);

    // Update scrubber (visual + ARIA)
    if (window.updateScrubber) window.updateScrubber(current, total);
    if (scrubber) {
      scrubber.setAttribute('aria-valuenow', current + 1);
      scrubber.setAttribute('aria-valuetext', getSlideLabel(current));
    }

    // Announce slide change to screen readers
    if (announcer && !instant) {
      announcer.textContent = '';
      requestAnimationFrame(function() {
        announcer.textContent = getSlideLabel(current);
      });
    }

    // Show nav briefly
    var nav = document.getElementById('nav-bar');
    nav.classList.add('visible');
    clearTimeout(nav._hideTimeout);
    nav._hideTimeout = setTimeout(function() { nav.classList.remove('visible'); }, 2000);
  }

  // --- Step Reveal ---
  function revealNextStep() {
    var slide = slides[current];
    var hidden = slide.querySelector('.step-hidden:not(.step-visible)');
    if (hidden) {
      hidden.classList.add('step-visible');
      return true; // consumed the advance
    }
    return false;
  }

  function resetSteps(slideEl) {
    var steps = slideEl.querySelectorAll('[data-step]');
    steps.forEach(function(el) { el.classList.remove('step-visible'); });
  }

  // --- Stream-in for bullet lists ---
  function streamBullets(slideEl) {
    var items = slideEl.querySelectorAll('.stream-list li');
    items.forEach(function(li, i) {
      li.classList.remove('streamed');
      setTimeout(function() { li.classList.add('streamed'); }, 200 + i * 250);
    });
  }

  function resetStream(slideEl) {
    var items = slideEl.querySelectorAll('.stream-list li');
    items.forEach(function(li) { li.classList.remove('streamed'); });
  }

  function next() {
    if (!revealNextStep()) goTo(current + 1);
  }
  function prev() { goTo(current - 1); }

  // --- Overview Mode ---
  function toggleOverview() {
    overviewMode = !overviewMode;
    document.body.classList.toggle('overview-mode', overviewMode);

    if (overviewMode) {
      // Make slides focusable in overview
      slides.forEach(function(slide, i) {
        slide.setAttribute('tabindex', '0');
        slide.setAttribute('role', 'button');
        slide.setAttribute('aria-label', 'Go to ' + getSlideLabel(i));
      });
      if (announcer) announcer.textContent = 'Overview mode. Use arrow keys to browse slides, Enter to select.';
      requestAnimationFrame(function() {
        slides[current].scrollIntoView({ block: 'center', behavior: 'instant' });
        slides[current].focus();
      });
    } else {
      // Restore slide semantics
      slides.forEach(function(slide) {
        slide.removeAttribute('tabindex');
        slide.setAttribute('role', 'group');
        slide.removeAttribute('aria-label');
      });
      // Re-set aria-labels from original attributes
      slides.forEach(function(slide) {
        var origLabel = slide.getAttribute('aria-roledescription') ? slide.dataset.ariaLabel : null;
      });
    }
  }

  // Store original aria-labels so we can restore after overview
  slides.forEach(function(slide) {
    slide.dataset.origAriaLabel = slide.getAttribute('aria-label') || '';
  });

  // Patched toggleOverview to properly restore labels
  var _toggleOverview = toggleOverview;
  toggleOverview = function() {
    _toggleOverview();
    if (!overviewMode) {
      slides.forEach(function(slide) {
        slide.setAttribute('aria-label', slide.dataset.origAriaLabel);
        slide.setAttribute('role', 'group');
      });
    }
  };

  // --- Keyboard ---
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { e.preventDefault(); toggleOverview(); return; }
    if (overviewMode) {
      // Arrow key navigation in overview
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        var nextIdx = Math.min(current + 1, total - 1);
        current = nextIdx;
        slides[current].scrollIntoView({ block: 'center', behavior: 'smooth' });
        slides[current].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        var prevIdx = Math.max(current - 1, 0);
        current = prevIdx;
        slides[current].scrollIntoView({ block: 'center', behavior: 'smooth' });
        slides[current].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goTo(current, true);
        toggleOverview();
      }
      return;
    }

    // Scrubber keyboard support
    if (document.activeElement === scrubber) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); next(); return; }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); prev(); return; }
      if (e.key === 'Home') { e.preventDefault(); goTo(0); return; }
      if (e.key === 'End') { e.preventDefault(); goTo(total - 1); return; }
    }

    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev(); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(total - 1); }
  });

  // --- Touch/Swipe ---
  var touchStartX = 0;
  var touchStartY = 0;
  document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) next(); else prev();
    }
  }, { passive: true });

  // --- Hash routing ---
  function readHash() {
    var h = parseInt(location.hash.replace('#', ''), 10);
    if (h >= 1 && h <= total) return h - 1;
    return 0;
  }

  // --- Arrow button double-click protection (300ms debounce) ---
  var lastClickTime = 0;
  var leftArrow = document.getElementById('arrow-prev');
  var rightArrow = document.getElementById('arrow-next');
  if (leftArrow) {
    leftArrow.addEventListener('click', function(e) {
      e.preventDefault();
      var now = Date.now();
      if (now - lastClickTime < 300) return;
      lastClickTime = now;
      prev();
    });
  }
  if (rightArrow) {
    rightArrow.addEventListener('click', function(e) {
      e.preventDefault();
      var now = Date.now();
      if (now - lastClickTime < 300) return;
      lastClickTime = now;
      next();
    });
  }

  // --- Overview click-to-jump ---
  slides.forEach(function(slide, i) {
    slide.addEventListener('click', function(e) {
      if (!overviewMode) return;
      e.stopPropagation();
      goTo(i, true);
      toggleOverview();
    });
  });

  // --- Expose on window ---
  window.goTo = goTo;
  window.next = next;
  window.prev = prev;
  window.toggleOverview = toggleOverview;
  window.deckEngine = {
    goTo: goTo,
    next: next,
    prev: prev,
    currentSlide: function() { return current; },
    totalSlides: function() { return total; }
  };

  // --- Init ---
  var startSlide = readHash();
  goTo(startSlide, true);

  window.addEventListener('hashchange', function() { goTo(readHash()); });
})();
