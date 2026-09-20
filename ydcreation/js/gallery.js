(() => {
  const { categories } = window.YD;
  const ALL = 'toutes';
  const filters = document.getElementById('filters');
  const grid = document.getElementById('grid');
  const status = document.getElementById('grid-status');
  const section = document.getElementById('realisations');

  const items = categories.flatMap((c) =>
    c.photos.map((p, k) => ({ ...p, cat: c.slug, label: c.label, n: k + 1 })));
  const labelOf = (slug) => (categories.find((c) => c.slug === slug) || {}).label || 'Toutes';

  let current = ALL;

  const tiles = items.map((it) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tile';
    btn.dataset.label = it.label;
    btn.setAttribute('aria-label', `Agrandir : réalisation ${it.label} n°${it.n}`);
    const im = document.createElement('img');
    Object.assign(im, {
      src: it.src, width: it.w, height: it.h, loading: 'lazy', decoding: 'async',
      alt: `Réalisation ${it.label} n°${it.n}`,
    });
    btn.append(im);
    btn.addEventListener('click', () => {
      const visible = items.filter((x) => current === ALL || x.cat === current);
      window.YDLightbox.open(visible, visible.indexOf(it), btn);
    });
    li.append(btn);
    grid.append(li);
    return { li, it };
  });

  const buttons = [[ALL, `Toutes (${items.length})`],
    ...categories.map((c) => [c.slug, `${c.label} (${c.photos.length})`])].map(([slug, text]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = text;
    b.dataset.slug = slug;
    b.addEventListener('click', () => { history.replaceState(null, '', `#${slug}`); apply(slug); });
    filters.append(b);
    return b;
  });

  function apply(slug) {
    current = slug;
    let shown = 0;
    tiles.forEach(({ li, it }) => {
      const on = slug === ALL || it.cat === slug;
      li.hidden = !on;
      if (on) shown += 1;
    });
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.slug === slug)));
    status.textContent = `${shown} réalisations : ${slug === ALL ? 'toutes catégories' : labelOf(slug)}`;
  }

  function fromHash() {
    const s = decodeURIComponent(location.hash.replace(/^#/, ''));
    if (s === ALL || categories.some((c) => c.slug === s)) {
      apply(s);
      section.scrollIntoView();
      return true;
    }
    return false;
  }

  apply(ALL);
  fromHash();
  window.addEventListener('hashchange', fromHash);
})();
