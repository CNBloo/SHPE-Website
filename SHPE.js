// SHPE Indiana University — Main JS

// ─── Sticky header ───────────────────────────────────────────
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ─── Mobile menu toggle ───────────────────────────────────────
const mobileBtn  = document.querySelector('.mobile-menu');
const navLinks   = document.querySelector('.nav-links');

if (mobileBtn && navLinks) {
  mobileBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    mobileBtn.classList.toggle('open', isOpen);
    mobileBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileBtn.classList.remove('open');
      mobileBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// ─── Smooth scroll ────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── Scroll reveal ────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings that appear in the same paint
      const delay = entry.target.dataset.delay ?? 0;
      entry.target.style.transitionDelay = `${delay}ms`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.addEventListener('DOMContentLoaded', () => {
  // Add staggered delays to grid children
  document.querySelectorAll(
    '.leadership-grid, .programs-grid, .events-grid, .dev-grid, .contact-info, .sponsors-grid'
  ).forEach(grid => {
    grid.querySelectorAll('.reveal').forEach((el, i) => {
      el.dataset.delay = i * 80;
    });
  });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});

// ─── Stats counter ────────────────────────────────────────────
function easeOutQuad(t) { return t * (2 - t); }

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1400; // ms
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = Math.round(easeOutQuad(progress) * target);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number[data-target]').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

document.addEventListener('DOMContentLoaded', () => {
  const statsSection = document.querySelector('.stats');
  if (statsSection) statsObserver.observe(statsSection);
});
