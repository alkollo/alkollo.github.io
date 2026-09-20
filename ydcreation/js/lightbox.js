(() => {
  const dlg = document.getElementById('lightbox');
  const img = dlg.querySelector('.lb-img');
  const cap = dlg.querySelector('.lb-cap');
  const count = dlg.querySelector('.lb-count');
  let list = [];
  let i = 0;
  let opener = null;

  const preload = (it) => { if (it) new Image().src = it.src; };

  function show(n) {
    i = (n + list.length) % list.length;
    const it = list[i];
    dlg.style.setProperty('--w', it.w);
    dlg.style.setProperty('--h', it.h);
    img.src = it.src;
    img.alt = `Réalisation ${it.label} n°${it.n}`;
    cap.textContent = it.label;
    count.textContent = `${i + 1} / ${list.length}`;
    preload(list[(i + 1) % list.length]);
    preload(list[(i - 1 + list.length) % list.length]);
  }

  function open(items, index, openerEl) {
    list = items;
    opener = openerEl || null;
    show(index);
    if (!dlg.open) dlg.showModal();
  }

  dlg.querySelector('.lb-prev').addEventListener('click', () => show(i - 1));
  dlg.querySelector('.lb-next').addEventListener('click', () => show(i + 1));
  dlg.querySelector('.lb-close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
  dlg.addEventListener('close', () => {
    img.removeAttribute('src');
    if (opener) opener.focus();
  });

  let x0 = null;
  dlg.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
  dlg.addEventListener('pointerup', (e) => {
    if (x0 !== null && Math.abs(e.clientX - x0) > 50) show(i + (e.clientX < x0 ? 1 : -1));
    x0 = null;
  });

  window.YDLightbox = { open };
})();
