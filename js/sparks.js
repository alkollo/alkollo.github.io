(() => {
  const canvas = document.getElementById('sparks');
  const hero = document.getElementById('accueil');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (!canvas || !hero || reduce.matches) return;
  const ctx = canvas.getContext('2d');
  let w = 0;
  let h = 0;
  let parts = [];
  let raf = 0;
  let visible = true;

  const spawn = (scatter) => ({
    x: Math.random() * w,
    y: scatter ? Math.random() * h : h + 10,
    vx: (Math.random() - 0.5) * 0.35,
    vy: -(0.4 + Math.random() * 1.1),
    r: 0.6 + Math.random() * 1.6,
    t: scatter ? Math.random() * 300 : 0,
    life: 220 + Math.random() * 260,
    hue: 24 + Math.random() * 22,
  });

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = hero.clientWidth;
    h = hero.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    parts = Array.from({ length: Math.min(70, Math.round(w / 22)) }, () => spawn(true));
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    parts.forEach((p, k) => {
      p.t += 1;
      p.x += p.vx + Math.sin(p.t * 0.03 + p.x) * 0.15;
      p.y += p.vy;
      if (p.t >= p.life || p.y < -10) { parts[k] = spawn(false); return; }
      const a = Math.sin((Math.PI * p.t) / p.life);
      ctx.fillStyle = `hsla(${p.hue} 95% 58% / ${a * 0.18})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3.2, 0, 6.283); ctx.fill();
      ctx.fillStyle = `hsla(${p.hue} 100% 66% / ${a * 0.95})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
    });
    raf = requestAnimationFrame(frame);
  }

  const start = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); }).observe(hero);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
  new ResizeObserver(resize).observe(hero);
  reduce.addEventListener('change', (e) => { if (e.matches) { stop(); ctx.clearRect(0, 0, w, h); } });
  resize();
  start();
})();
