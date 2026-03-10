/**
 * ============================================
 * Love Memoir — App Logic
 * ============================================
 *
 * This file handles:
 *   1. Day counter (framework — start date configurable)
 *   2. Scroll-triggered reveal animations
 *   3. Hero entrance animation
 *   4. Smooth parallax-like orb movement
 *
 * All text content is intentionally left empty.
 * Fill in the data-i18n attributes or the CONFIG
 * object below to populate the site.
 */

(function () {
  'use strict';

  /* ------------------------------------------------
     CONFIG — Edit these values to populate the site
     ------------------------------------------------ */
  const CONFIG = {
    // Set your start date here (ISO 8601 format, with timezone)
    // Example: '2025-12-14T00:00:00+08:00'
    startDate: '',

    // Counter labels (leave empty to hide)
    counterLabels: {
      days:    '',
      hours:   '',
      minutes: '',
      seconds: ''
    }
  };


  /* ------------------------------------------------
     1. Day Counter
     ------------------------------------------------ */
  const counterEls = {
    days:    document.getElementById('counter-days'),
    hours:   document.getElementById('counter-hours'),
    minutes: document.getElementById('counter-minutes'),
    seconds: document.getElementById('counter-seconds')
  };

  let startTime = null;

  function initCounter() {
    if (!CONFIG.startDate) return;

    try {
      startTime = new Date(CONFIG.startDate).getTime();
      if (isNaN(startTime)) {
        startTime = null;
        return;
      }
      updateCounter();
      setInterval(updateCounter, 1000);
    } catch (e) {
      // Invalid date — counter stays at '--'
    }
  }

  function updateCounter() {
    if (!startTime) return;

    const now   = Date.now();
    const diff  = Math.max(0, now - startTime);
    const total = Math.floor(diff / 1000);

    const days    = Math.floor(total / 86400);
    const hours   = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    counterEls.days.textContent    = String(days).padStart(2, '0');
    counterEls.hours.textContent   = String(hours).padStart(2, '0');
    counterEls.minutes.textContent = String(minutes).padStart(2, '0');
    counterEls.seconds.textContent = String(seconds).padStart(2, '0');
  }


  /* ------------------------------------------------
     2. Scroll-triggered Reveal Animations
     ------------------------------------------------ */
  function initRevealAnimations() {
    const sections = document.querySelectorAll('.reveal-section');
    const items    = document.querySelectorAll('.reveal-item');

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '-60px 0px' }
    );

    sections.forEach((section) => sectionObserver.observe(section));

    // Timeline items with staggered delay
    const itemObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Add a small stagger delay based on order
            const delay = index * 120;
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, delay);
          }
        });
      },
      { threshold: 0.1, rootMargin: '-40px 0px' }
    );

    items.forEach((item) => itemObserver.observe(item));
  }


  /* ------------------------------------------------
     3. Hero Entrance Animation
     ------------------------------------------------ */
  function initHeroAnimation() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    // Small delay for a polished entrance
    requestAnimationFrame(() => {
      setTimeout(() => {
        heroContent.classList.add('is-visible');
      }, 200);
    });
  }


  /* ------------------------------------------------
     4. Parallax-like Orb Movement on Scroll
     ------------------------------------------------ */
  function initOrbParallax() {
    const orbs = document.querySelectorAll('.orb');
    if (!orbs.length) return;

    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        orbs.forEach((orb, i) => {
          const speed  = 0.02 + (i * 0.008);
          const offset = scrollY * speed;
          orb.style.transform = `translateY(${-offset}px)`;
        });
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ------------------------------------------------
     5. Smooth Scroll for Scroll Hint
     ------------------------------------------------ */
  function initScrollHint() {
    const hint = document.querySelector('.scroll-hint');
    if (!hint) return;

    hint.style.cursor = 'pointer';
    hint.addEventListener('click', () => {
      const about = document.getElementById('about');
      if (about) {
        about.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }


  /* ------------------------------------------------
     6. Hero Parallax on Scroll
     ------------------------------------------------ */
  function initHeroParallax() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollY  = window.scrollY;
        const vh       = window.innerHeight;
        const progress = Math.min(scrollY / vh, 1);

        heroContent.style.opacity   = String(1 - progress * 1.2);
        heroContent.style.transform = `scale(${1 - progress * 0.08})`;
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ------------------------------------------------
     Boot
     ------------------------------------------------ */
  function init() {
    initCounter();
    initHeroAnimation();
    initRevealAnimations();
    initOrbParallax();
    initScrollHint();
    initHeroParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
