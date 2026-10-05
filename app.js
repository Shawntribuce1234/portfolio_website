(() => {
  'use strict';
  const root = document.documentElement;
  const button = document.getElementById('theme-toggle');
  function applyTheme(theme, save = true) {
    root.dataset.theme = theme;
    button.setAttribute('aria-pressed', String(theme === 'light'));
    const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`;
    button.setAttribute('aria-label', label);
    button.title = label;
    button.querySelector('.theme-icon').textContent = theme === 'dark' ? '☀' : '☾';
    if (save) { try { localStorage.setItem('shawn-theme', theme); } catch {} }
    window.dispatchEvent(new Event('themechange'));
  }
  applyTheme(root.dataset.theme, false);
  button.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
  window.addEventListener('storage', event => {
    if (event.key === 'shawn-theme') applyTheme(event.newValue === 'light' ? 'light' : 'dark', false);
  });
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = { x: null, y: null };
  let width = 0, height = 0, particles = [], dot, line, frame = 0, previous = 0;
  function readColors() {
    const style = getComputedStyle(root);
    dot = style.getPropertyValue('--dot').trim();
    line = style.getPropertyValue('--line').trim();
  }
  function resize() {
    const oldWidth = width, oldHeight = height;
    width = innerWidth; height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(120, Math.max(42, Math.round(width * height / 8500)));
    particles = particles.slice(0, count);
    for (const p of particles) { p.x *= width / oldWidth; p.y *= height / oldHeight; }
    while (particles.length < count) particles.push({ x: Math.random() * width, y: Math.random() * height, vx: (Math.random() - .5) * .8, vy: (Math.random() - .5) * .8, r: Math.random() * 2 + 1 });
    if (reducedMotion.matches) draw(0);
  }
  function draw(step) {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      if (step && pointer.x !== null) {
        const dx = pointer.x - p.x, dy = pointer.y - p.y;
        if (dx * dx + dy * dy < 40000) { p.x += dx * .02 * step; p.y += dy * .02 * step; }
      }
      p.x += p.vx * step; p.y += p.vy * step;
      if (p.x < 0 || p.x > width) { p.x = Math.max(0, Math.min(width, p.x)); p.vx *= -1; }
      if (p.y < 0 || p.y > height) { p.y = Math.max(0, Math.min(height, p.y)); p.vy *= -1; }
    }
    const linkDistance = Math.min(180, width * .42);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j], distance = Math.hypot(p.x - q.x, p.y - q.y);
        if (distance < linkDistance) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${line},${(1 - distance / linkDistance) * .7})`;
          ctx.lineWidth = 1.2; ctx.stroke();
        }
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${dot},.7)`; ctx.fill();
    }
  }
  function loop(time) {
    const step = previous ? Math.min((time - previous) / (1000 / 60), 2) : 1;
    previous = time; draw(step); frame = requestAnimationFrame(loop);
  }
  function restart() {
    cancelAnimationFrame(frame); previous = 0;
    if (!document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(loop);
    else draw(0);
  }
  window.addEventListener('pointermove', event => { pointer.x = event.clientX; pointer.y = event.clientY; }, { passive: true });
  const clearPointer = () => { pointer.x = pointer.y = null; };
  document.documentElement.addEventListener('pointerleave', clearPointer);
  window.addEventListener('pointerup', event => { if (event.pointerType !== 'mouse') clearPointer(); });
  window.addEventListener('blur', clearPointer);
  window.addEventListener('resize', resize);
  window.addEventListener('themechange', () => { readColors(); if (reducedMotion.matches) draw(0); });
  document.addEventListener('visibilitychange', restart);
  reducedMotion.addEventListener('change', restart);
  readColors(); resize(); restart();
})();
