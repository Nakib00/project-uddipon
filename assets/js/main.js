/* Project Uddipon — main.js */

// Dynamic footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('nav-open'));
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('nav-open'))
  );
}

// Header shadow on scroll
const header = document.querySelector('.site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// Scroll-to-top FAB
const fabTop = document.getElementById('fabTop');
if (fabTop) {
  window.addEventListener('scroll', () => {
    fabTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  fabTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); ro.unobserve(e.target); }
    });
  }, { threshold: 0.10 });
  revealEls.forEach(el => ro.observe(el));
}

// Animated counters
function animateCount(el) {
  const raw    = el.getAttribute('data-target') || '';
  if (!raw) return;
  const num    = parseFloat(raw.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return;
  const suffix = raw.includes('+') ? '+' : (raw.includes('%') ? '%' : '');
  const dur    = 1800;
  const start  = performance.now();
  const tick   = now => {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(e * num) + suffix;
    if (p < 1) requestAnimationFrame(tick); else el.textContent = raw;
  };
  requestAnimationFrame(tick);
}
const counterEls = document.querySelectorAll('[data-target]');
if (counterEls.length) {
  const co = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => co.observe(el));
}

// Lightbox — works with .gallery-card elements
const lb      = document.getElementById('lightboxBackdrop');
const lbImg   = document.getElementById('lightboxImg');
const lbCap   = document.getElementById('lightboxCaption');
const lbClose = document.getElementById('lightboxClose');

if (lb) {
  document.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      const img = card.querySelector('img');
      lbImg.src        = card.getAttribute('href') || img?.src || '';
      lbCap.textContent = card.getAttribute('data-caption') || card.querySelector('.gallery-caption')?.textContent || '';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  const closeLb = () => { lb.classList.remove('open'); document.body.style.overflow = ''; lbImg.src = ''; };
  lbClose?.addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
}

// Active nav on scroll
const sections   = document.querySelectorAll('section[id], div[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
if (sections.length && navAnchors.length) {
  const no = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const a = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => no.observe(s));
}
