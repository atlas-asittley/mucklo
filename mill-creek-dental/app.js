/* ============================================
   Mill Creek Family Dental — App JS
   ============================================ */

(function () {
  'use strict';

  // ── Sticky Header ──────────────────────────
  const header = document.getElementById('site-header');
  function updateHeader() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // ── Mobile Nav Toggle ──────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');
  let navOpen = false;

  navToggle.addEventListener('click', () => {
    navOpen = !navOpen;
    navLinks.classList.toggle('open', navOpen);
    navToggle.setAttribute('aria-expanded', navOpen);
    document.body.style.overflow = navOpen ? 'hidden' : '';
    // Animate hamburger
    const spans = navToggle.querySelectorAll('span');
    if (navOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity  = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close nav on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navOpen = false;
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
      navToggle.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // ── Active Nav Link ────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY + 120 >= sec.offsetTop) {
        current = sec.id;
      }
    });
    links.forEach(l => {
      const href = l.getAttribute('href').replace('#', '');
      l.classList.toggle('active', href === current);
    });
  }
  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  // ── Intersection Observer Animations ──────
  const animatedEls = document.querySelectorAll(
    '.fade-in, .fade-in-left, .fade-in-right'
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  animatedEls.forEach(el => observer.observe(el));

  // ── Contact Form Handling ──────────────────
  const form        = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Basic validation
      let valid = true;
      const required = form.querySelectorAll('[required]');
      required.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#e55';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) return;

      // Simulate submission
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        formSuccess.style.display = 'flex';
      }, 900);
    });

    // Clear error state on input
    form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '';
      });
    });
  }

  // ── Smooth Scroll for anchor links ────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Counter animation for hero stats ──────
  function animateCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
      const text = el.textContent.trim();
      const match = text.match(/^(\d+)(.*)/);
      if (!match) return;
      const target = parseInt(match[1], 10);
      const suffix = match[2];
      if (isNaN(target)) return;

      let start = 0;
      const duration = 1400;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  const heroObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      heroObs.disconnect();
    }
  }, { threshold: 0.5 });
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroObs.observe(heroStats);

})();
