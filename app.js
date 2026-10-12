(() => {
  'use strict';
  const root = document.documentElement;
  root.dataset.theme = 'dark';
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const face = document.querySelector('.contact-face');
  if (face) {
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    window.addEventListener('pointermove', event => {
      if (motion.matches) return;
      const bounds = face.getBoundingClientRect();
      const dx = event.clientX - (bounds.left + bounds.width / 2);
      const dy = event.clientY - (bounds.top + bounds.height / 2);
      const distance = Math.max(1, Math.hypot(dx, dy));
      face.style.setProperty('--eye-x', `${dx / distance * Math.min(4, distance / 60)}px`);
      face.style.setProperty('--eye-y', `${dy / distance * Math.min(3, distance / 60)}px`);
    }, { passive: true });
    const resetEyes = () => {
      face.style.setProperty('--eye-x', '0px');
      face.style.setProperty('--eye-y', '0px');
    };
    document.documentElement.addEventListener('pointerleave', resetEyes);
    window.addEventListener('blur', resetEyes);
    motion.addEventListener('change', resetEyes);
  }

  const tabs = [...document.querySelectorAll('.coursework-tabs [role="tab"]')];
  function selectTab(selected) {
    tabs.forEach(tab => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      panel.hidden = !active;
      if (!active) {
        panel.querySelectorAll('video').forEach(video => video.pause());
        panel.querySelectorAll('iframe').forEach(frame => { frame.src = frame.src; });
      }
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
      if (event.key === 'ArrowLeft') next = tabs[(index + tabs.length - 1) % tabs.length];
      if (event.key === 'Home') next = tabs[0];
      if (event.key === 'End') next = tabs[tabs.length - 1];
      if (next) { event.preventDefault(); selectTab(next); next.focus(); }
    });
  });

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
