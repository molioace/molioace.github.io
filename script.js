document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"], .nav-links a[href*="index.html#"]');
  const sections = document.querySelectorAll('main section[id]');
  const menuToggle = document.getElementById('menuToggle');
  const navLinksContainer = document.getElementById('navLinks');
  const menuIcon = document.getElementById('menuIcon');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sticky nav background on scroll
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 24) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active section highlighting (home page only — sections live in #main)
  if (sections.length) {
    const highlightActive = () => {
      const navHeight = nav ? nav.offsetHeight : 0;
      let currentId = '';
      sections.forEach((section) => {
        const top = section.offsetTop - navHeight - 120;
        if (window.scrollY >= top) currentId = section.id;
      });
      navLinks.forEach((link) => {
        const isMatch = link.getAttribute('href') === `#${currentId}`;
        link.classList.toggle('active', isMatch);
        if (isMatch) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    };
    window.addEventListener('scroll', highlightActive, { passive: true });
    highlightActive();
  }

  // Mobile menu
  function closeMenu() {
    navLinksContainer?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (menuIcon) menuIcon.innerHTML = '<use href="#i-menu"/>';
    document.body.style.overflow = '';
  }
  function openMenu() {
    navLinksContainer?.classList.add('is-open');
    menuToggle?.setAttribute('aria-expanded', 'true');
    if (menuIcon) menuIcon.innerHTML = '<use href="#i-close"/>';
    document.body.style.overflow = 'hidden';
  }
  menuToggle?.addEventListener('click', () => {
    const isOpen = navLinksContainer?.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });
  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  // Scroll reveal — single subtle entrance, skipped entirely if reduced motion
  const revealEls = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Footer year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
