document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  const header = $('#mainNav');
  const progress = $('#progress');
  const drawer = $('#drawer');
  const menuToggle = $('#menuToggle');
  const menuIcon = $('#menuIcon');
  const navAnchors = $$('.nav-links a[href^="#"], .nav-links a[href*="index.html#"], .drawer a[href^="#"], .drawer a[href*="index.html#"]');
  const sections = $$('main section[id]');

  /* ---------- Loading screen (index only) ---------- */
  const loader = $('#loader');
  if (loader) {
    const done = () => {
      loader.classList.add('is-done');
      try { sessionStorage.setItem('ms-loaded', '1'); } catch (e) { /* storage unavailable */ }
    };
    if (reduceMotion || document.documentElement.classList.contains('no-loader')) done();
    else setTimeout(done, 2800);
  }

  /* ---------- Scroll: header state + progress bar ---------- */
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 30);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Active section highlighting ---------- */
  if (sections.length) {
    const highlight = () => {
      const offset = (header ? header.offsetHeight : 0) + 120;
      let current = '';
      sections.forEach((s) => { if (window.scrollY >= s.offsetTop - offset) current = s.id; });
      navAnchors.forEach((a) => {
        const match = a.getAttribute('href') === `#${current}`;
        a.classList.toggle('active', match);
        if (match) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      });
    };
    window.addEventListener('scroll', highlight, { passive: true });
    highlight();
  }

  /* ---------- Mobile drawer ---------- */
  const setMenu = (open) => {
    if (!drawer || !menuToggle) return;
    drawer.classList.toggle('is-open', open);
    header?.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    if (menuIcon) menuIcon.innerHTML = `<use href="#${open ? 'i-close' : 'i-menu'}"/>`;
  };
  menuToggle?.addEventListener('click', () => setMenu(!drawer.classList.contains('is-open')));
  navAnchors.forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Stat counters ---------- */
  const counters = $$('[data-count]');
  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.dec || '0', 10);
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / 1600, 1);
      el.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    counters.forEach((c) => { c.textContent = (0).toFixed(parseInt(c.dataset.dec || '0', 10)); });
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { runCounter(entry.target); cio.unobserve(entry.target); } });
    }, { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  }

  /* ---------- Particle network background ---------- */
  const canvas = $('#particles');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, particles = [], raf = 0, running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const init = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(80, Math.floor((w * h) / 15000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5, o: Math.random() * 0.5 + 0.1,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(92, 200, 245, ${p.o})`;
        ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(92, 200, 245, ${0.09 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      if (running) raf = requestAnimationFrame(draw);
    };
    init(); draw();
    let resizeT;
    window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(init, 150); });
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); }
    });
  }

  /* ---------- Cursor glow ---------- */
  const glow = $('#cursorGlow');
  if (glow && finePointer && !reduceMotion) {
    let tx = 0, ty = 0, x = 0, y = 0, on = false;
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!on) { on = true; x = tx; y = ty; glow.classList.add('is-on'); }
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => { on = false; glow.classList.remove('is-on'); });
    const follow = () => {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12;
      glow.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(follow);
    };
    follow();
  }

  /* ---------- Contact form (opens the visitor's mail client) ---------- */
  const form = $('#contactForm');
  if (form) {
    const label = $('#cfSubmit span');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const subject = encodeURIComponent(`Portfolio contact from ${data.get('name')}`);
      const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\nMessage:\n${data.get('message')}`);
      window.location.href = `mailto:mohamedsabbahedu@gmail.com?subject=${subject}&body=${body}`;
      if (label) {
        label.textContent = 'Opening your email app…';
        setTimeout(() => { label.textContent = 'Send Message'; }, 3000);
      }
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = $('#currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
