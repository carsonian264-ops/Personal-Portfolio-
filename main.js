(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.querySelector('.nav');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.innerHTML = isOpen
        ? '<svg class="icon" aria-hidden="true"><use href="#i-close"></use></svg>'
        : '<svg class="icon" aria-hidden="true"><use href="#i-menu"></use></svg>';
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-menu"></use></svg>';
      });
    });
  }

  /* ---------- Scrollspy ---------- */
  const sections = [...document.querySelectorAll('main > section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-link[data-nav]')];
  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('is-active'));
          const active = navLinks.find(l => l.getAttribute('href') === `#${entry.target.id}`);
          if (active) active.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Case study dialogs ---------- */
  document.querySelectorAll('[data-case-study]').forEach(btn => {
    btn.addEventListener('click', () => {
      const dialog = document.getElementById(`case-study-${btn.dataset.caseStudy}`);
      if (dialog && typeof dialog.showModal === 'function') dialog.showModal();
    });
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Contact form (mailto fallback, real client-side validation) ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    const fields = {
      name: { input: document.getElementById('cf-name'), error: document.getElementById('cf-name-error') },
      email: { input: document.getElementById('cf-email'), error: document.getElementById('cf-email-error') },
      message: { input: document.getElementById('cf-message'), error: document.getElementById('cf-message-error') },
    };
    const status = document.getElementById('form-status');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validate() {
      let valid = true;
      if (!fields.name.input.value.trim()) {
        fields.name.error.textContent = 'Please enter your name.'; valid = false;
      } else fields.name.error.textContent = '';

      if (!emailRe.test(fields.email.input.value.trim())) {
        fields.email.error.textContent = 'Please enter a valid email address.'; valid = false;
      } else fields.email.error.textContent = '';

      if (!fields.message.input.value.trim()) {
        fields.message.error.textContent = 'Please enter a message.'; valid = false;
      } else fields.message.error.textContent = '';

      return valid;
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!validate()) {
        status.textContent = '';
        return;
      }
      const name = fields.name.input.value.trim();
      const email = fields.email.input.value.trim();
      const message = fields.message.input.value.trim();
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:carsonian264@gmail.com?subject=${subject}&body=${body}`;
      status.textContent = 'Opening your email client…';
    });
  }

  /* ---------- Lightweight particle field (hero only) ---------- */
  const canvas = document.getElementById('particle-canvas');
  if (canvas && !prefersReducedMotion && window.innerWidth > 640) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let raf = null;
    let running = true;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      const count = Math.min(46, Math.floor(rect.width / 28));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        r: Math.random() * 1.6 + 0.6,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        hue: Math.random() > 0.5 ? '79,214,255' : '155,107,255',
      }));
    }

    function tick() {
      if (!running) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > rect.width) p.vx *= -1;
        if (p.y < 0 || p.y > rect.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},0.5)`;
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    }

    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) tick(); else if (raf) cancelAnimationFrame(raf);
    });

    window.addEventListener('resize', resize, { passive: true });
    resize();
    tick();
  }
})();
