/* Project Uddipon — main.js */

// Dynamic footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile navigation drawer
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const navScrim  = document.getElementById('navScrim');
const setNav = (open) => {
  if (!navLinks) return;
  navLinks.classList.toggle('nav-open', open);
  navScrim?.classList.toggle('show', open);
  navToggle?.setAttribute('aria-expanded', String(open));
  const icon = navToggle?.querySelector('.material-symbols-outlined');
  if (icon) icon.textContent = open ? 'close' : 'menu';
  document.body.style.overflow = open ? 'hidden' : '';
};
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => setNav(!navLinks.classList.contains('nav-open')));
  navScrim?.addEventListener('click', () => setNav(false));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNav(false)));
}

// Header border/shadow once the page scrolls
const header = document.querySelector('.header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Scroll-to-top button
const fabTop = document.getElementById('fabTop');
if (fabTop) {
  window.addEventListener('scroll', () => {
    fabTop.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  fabTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length && 'IntersectionObserver' in window) {
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); ro.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => ro.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in-view'));
}

// Animated counters (elements with data-target="5000+")
function animateCount(el) {
  const raw = el.getAttribute('data-target') || '';
  const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return;
  const suffix = raw.includes('+') ? '+' : (raw.includes('%') ? '%' : '');
  const dur = 1600;
  const start = performance.now();
  const tick = now => {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(e * num).toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(tick); else el.textContent = raw;
  };
  requestAnimationFrame(tick);
}
const counterEls = document.querySelectorAll('[data-target]');
if (counterEls.length && 'IntersectionObserver' in window) {
  const co = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => co.observe(el));
}

// Stories: show the first few, expand on request
const storiesGrid   = document.getElementById('galleryGrid');
const storiesToggle = document.getElementById('storiesToggle');
if (storiesGrid && storiesToggle) {
  storiesToggle.addEventListener('click', () => {
    const collapsed = storiesGrid.classList.toggle('collapsed');
    storiesToggle.innerHTML = collapsed
      ? '<span class="material-symbols-outlined">expand_more</span> Show all stories'
      : '<span class="material-symbols-outlined">expand_less</span> Show fewer';
    if (collapsed) storiesGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// Lightbox for story cards
const lb        = document.getElementById('lightboxBackdrop');
const lbImg     = document.getElementById('lightboxImg');
const lbCap     = document.getElementById('lightboxCaption');
const lbClose   = document.getElementById('lightboxClose');
const lbDetails = document.getElementById('lightboxDetails');
if (lb) {
  document.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', e => {
      e.preventDefault();
      const img = card.querySelector('img');
      lbImg.src = card.getAttribute('href') || img?.src || '';
      lbCap.textContent = card.getAttribute('data-caption') || '';
      const detailsUrl = card.getAttribute('data-details');
      if (lbDetails) {
        if (detailsUrl) { lbDetails.href = detailsUrl; lbDetails.classList.add('show'); }
        else { lbDetails.removeAttribute('href'); lbDetails.classList.remove('show'); }
      }
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      lbClose?.focus();
    });
  });
  const closeLb = () => { lb.classList.remove('open'); document.body.style.overflow = ''; lbImg.src = ''; };
  lbClose?.addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    closeLb();
    setNav(false);
  });
}

// Donation amount picker → updates the WhatsApp message
const tiers      = document.querySelectorAll('.tier');
const donateWa   = document.getElementById('donateWa');
const donateAmt  = document.getElementById('donateAmount');
tiers.forEach(tier => {
  tier.addEventListener('click', () => {
    tiers.forEach(t => { t.classList.remove('selected'); t.setAttribute('aria-checked', 'false'); });
    tier.classList.add('selected');
    tier.setAttribute('aria-checked', 'true');
    const amount = tier.getAttribute('data-amount');
    if (donateAmt) donateAmt.textContent = `৳${amount}`;
    if (donateWa) {
      const msg = `Assalamu Alaikum, I would like to donate ৳${amount} to support Project Uddipon. Please share the donation details.`;
      donateWa.href = `https://wa.me/8801894634149?text=${encodeURIComponent(msg)}`;
    }
  });
});

// Message template: copy, or open WhatsApp with it pre-filled
const tpl      = document.getElementById('msgTemplate');
const copyBtn  = document.getElementById('copyTemplate');
const sendTpl  = document.getElementById('sendTemplate');
if (tpl && sendTpl) {
  sendTpl.href = `https://wa.me/8801894634149?text=${encodeURIComponent(tpl.textContent)}`;
}
if (tpl && copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const label = copyBtn.querySelector('span:last-child');
    try {
      await navigator.clipboard.writeText(tpl.textContent);
      if (label) label.textContent = 'Copied!';
    } catch {
      if (label) label.textContent = 'Select & copy';
    }
    setTimeout(() => { if (label) label.textContent = 'Copy'; }, 2000);
  });
}

// Highlight the nav link for the section in view
const sections   = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav a.nav-link[href^="#"]');
if (sections.length && navAnchors.length && 'IntersectionObserver' in window) {
  const no = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const a = document.querySelector(`.nav a.nav-link[href="#${entry.target.id}"]`);
      if (!a) return;
      navAnchors.forEach(x => x.classList.remove('active'));
      a.classList.add('active');
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => no.observe(s));
}
