// Product page. The product comes from the URL hash: product.html#le-rond
const pd = document.getElementById('pd');
const state = { p: null, color: 0, size: null, qty: 1, view: 'front' };
let buyObserver;

const SCENE = `
  <svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" class="pd__scene" aria-hidden="true">
    <defs>
      <linearGradient id="pd-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#bcd9ee"/><stop offset=".6" stop-color="#f6efe2"/><stop offset="1" stop-color="#f4d9b4"/>
      </linearGradient>
    </defs>
    <rect width="600" height="600" fill="url(#pd-sky)"/>
    <circle cx="430" cy="170" r="56" fill="#fff4d6"/>
    <path d="M0 400 Q120 330 240 380 T600 350 V600 H0 Z" fill="#c9a77f"/>
    <path d="M0 450 Q160 400 320 440 T600 430 V600 H0 Z" fill="#8f6b4c"/>
    <path d="M0 520 Q200 480 400 510 T600 500 V600 H0 Z" fill="#4c3a2c"/>
    <g fill="#2a211a"><path d="M90 470 l10 -60 l10 60z"/><path d="M500 470 l8 -48 l8 48z"/><path d="M530 476 l6 -36 l6 36z"/></g>
  </svg>`;

function viewsFor(p) {
  return [
    ['front', 'Front'],
    p.cat === 'sunglasses' ? ['lens', 'Through the lens'] : ['close', 'Close-up'],
    ['size', 'Measurements']
  ];
}

/* Dimension drawing over the product, in the symbol's 200×200 space */
function dimsSVG(p) {
  const d = p.dims;
  const line = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" class="dim"/>` +
    (y1 === y2
      ? `<path d="M${x1} ${y1 - 3} V${y1 + 3} M${x2} ${y2 - 3} V${y2 + 3}" class="dim"/>`
      : `<path d="M${x1 - 3} ${y1} H${x1 + 3} M${x2 - 3} ${y2} H${x2 + 3}" class="dim"/>`);
  const label = (x, y, t, rot) => `<text x="${x}" y="${y}" class="dim-label"${rot ? ` transform="rotate(-90 ${x} ${y})"` : ''}>${t}</text>`;
  let marks = '';
  if (p.cat === 'sunglasses') {
    marks = line(22, 148, 92, 148) + label(57, 160, `Lens ${d.lens} mm`) +
      line(92, 62, 108, 62) + label(100, 54, `Bridge ${d.bridge}`) +
      line(194, 78, 194, 128) + label(188, 103, `Height ${d.height}`, true) +
      label(100, 186, `Temple ${d.temple} mm`);
  } else if (p.cat === 'hats') {
    marks = line(18, 160, 56, 160) + label(37, 172, `Brim ${d.brim}`) +
      line(176, 66, 176, 120) + label(170, 93, `Crown ${d.crown}`, true);
  } else {
    marks = line(40, 182, 160, 182) + label(100, 194, `Length ${d.length}`);
  }
  return `<svg viewBox="0 0 200 200" class="pd__art"><use href="#${p.symbol}" width="200" height="200"/>${marks}</svg>`;
}

function stageHTML(p, view) {
  const use = `<use href="#${p.symbol}"/>`;
  if (view === 'lens') return `${SCENE}<svg class="pd__overlay" aria-hidden="true">${use}</svg><span class="pd__hint">Move to look around</span>`;
  if (view === 'close') return `<svg class="pd__art pd__art--close" aria-hidden="true">${use}</svg><span class="pd__hint">Move to explore</span>`;
  if (view === 'size') return dimsSVG(p);
  return `<svg class="pd__art" aria-hidden="true">${use}</svg>
    <div class="pd__loupe" aria-hidden="true"><div class="pd__loupe-inner"><svg>${use}</svg></div></div>
    ${finePointer ? '<span class="pd__hint">Hover to zoom</span>' : ''}`;
}

/* ---------- Delivery estimate ---------- */
const isWorkday = d => d.getDay() % 6 !== 0;
function addWorkdays(date, n) {
  const d = new Date(date);
  while (n > 0) { d.setDate(d.getDate() + 1); if (isWorkday(d)) n--; }
  return d;
}
const fmtDay = d => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
function updateDelivery() {
  const out = document.getElementById('dispatch');
  if (!out) return;
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setHours(16, 0, 0, 0);
  let dispatch = now;
  if (isWorkday(now) && now < cutoff) {
    const s = Math.floor((cutoff - now) / 1000);
    const hms = `${Math.floor(s / 3600)}h ${String(Math.floor(s / 60) % 60).padStart(2, '0')}m ${String(s % 60).padStart(2, '0')}s`;
    out.innerHTML = `Order within <strong>${hms}</strong> for dispatch today`;
  } else {
    dispatch = addWorkdays(now, 1);
    out.innerHTML = `Order now for dispatch on <strong>${dispatch.toLocaleDateString('en-GB', { weekday: 'long' })}</strong>`;
  }
  document.getElementById('delivery').textContent =
    `Delivered ${fmtDay(addWorkdays(dispatch, 2))} – ${fmtDay(addWorkdays(dispatch, 4))}`;
}
setInterval(updateDelivery, 1000);

/* ---------- Render ---------- */
function render() {
  const p = findProduct(location.hash.slice(1)) || PRODUCTS[0];
  Object.assign(state, { p, color: 0, size: null, qty: 1, view: 'front' });
  document.title = `${p.name} · Maison Noir`;

  const i = PRODUCTS.indexOf(p);
  const prev = PRODUCTS[(i - 1 + PRODUCTS.length) % PRODUCTS.length];
  const next = PRODUCTS[(i + 1) % PRODUCTS.length];
  const pairs = [...PRODUCTS.filter(o => o.cat !== p.cat), ...PRODUCTS.filter(o => o.cat === p.cat && o !== p)].slice(0, 3);
  const made = MADE[p.made];

  const specRows = [];
  if (p.cat === 'sunglasses') {
    specRows.push(['Frame size', `${p.dims.lens} □ ${p.dims.bridge} — ${p.dims.temple}`]);
    specRows.push(['Lens width', p.dims.lens + ' mm'], ['Bridge', p.dims.bridge + ' mm'], ['Temple', p.dims.temple + ' mm'], ['Lens height', p.dims.height + ' mm']);
  }
  specRows.push(...p.specs);

  pd.innerHTML = `
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="index.html">Home</a><span>/</span><a href="index.html#${p.cat}">${CATEGORY_LABEL[p.cat]}</a><span>/</span><span aria-current="page">${p.name}</span>
    </nav>

    <section class="pd">
      <div class="pd__gallery">
        <div class="pd__stage" id="stage"></div>
        <div class="pd__views" role="tablist" aria-label="Product views">
          ${viewsFor(p).map(([key, label]) => `<button role="tab" data-view="${key}">${label}</button>`).join('')}
        </div>
      </div>

      <div class="pd__info">
        <p class="eyebrow">${CATEGORY_LABEL[p.cat]}${p.badge ? ` · ${p.badge}` : ''}</p>
        <h1 class="pd__name">${p.name}</h1>
        <p class="pd__price">${money(p.price)}</p>
        <p class="pd__tagline">${p.tagline}</p>

        <div class="pd__group">
          <div class="pd__label">Colour <span id="color-name"></span></div>
          <div class="swatch-row">
            ${p.colors.map((c, ci) => `<button class="swatch" style="--c:${c.swatch}" data-color="${ci}" aria-label="${c.name}"></button>`).join('')}
          </div>
        </div>

        ${p.sizes ? `
        <div class="pd__group" id="size-group">
          <div class="pd__label">Size <span id="size-name">Choose a size</span>
            <button class="link pd__finder-toggle" id="finder-toggle" aria-expanded="false" aria-controls="finder">Find your size</button>
          </div>
          <div class="size-row">
            ${HAT_SIZES.map(s => `<button class="size" data-size="${s.size}"><strong>${s.size}</strong><small>${s.range}</small></button>`).join('')}
          </div>
          <div class="finder" id="finder" hidden>
            <p>Wrap a tape measure around your head, just above your ears and eyebrows.</p>
            <label for="head">Head circumference <strong id="head-out">57 cm</strong></label>
            <input type="range" id="head" min="53" max="62" step="0.5" value="57">
            <div class="finder__scale">${HAT_SIZES.map(s => `<span>${s.size}</span>`).join('')}<i id="head-marker"></i></div>
            <div class="finder__result">We recommend size <strong id="head-size">M</strong>
              <button class="btn btn--sm" id="use-size">Use this size</button>
            </div>
          </div>
        </div>` : ''}

        <div class="pd__buy">
          <div class="stepper" aria-label="Quantity">
            <button data-qty="-1" aria-label="Decrease quantity">−</button>
            <span id="qty">1</span>
            <button data-qty="1" aria-label="Increase quantity">+</button>
          </div>
          <button class="btn btn--block" id="add-btn"></button>
        </div>
        <p class="pd__error" id="pd-error" role="alert"></p>

        <div class="pd__ship">
          <p id="dispatch"></p>
          <p id="delivery"></p>
          <p>Free returns within 30 days.</p>
        </div>

        <div class="pd__acc">
          <details open>
            <summary>Details</summary>
            <p>${p.desc}</p>
            <ul>${p.details.map(d => `<li>${d}</li>`).join('')}</ul>
          </details>
          <details>
            <summary>Materials &amp; care</summary>
            <p>${made.care}</p>
          </details>
          <details>
            <summary>Shipping &amp; returns</summary>
            <p>Free shipping on orders over €150, otherwise €8. Orders placed before 16:00 on a weekday leave the same day and arrive in 2–4 working days. Return unworn pieces within 30 days for a full refund.</p>
          </details>
        </div>
      </div>
    </section>

    <section class="pd-specs">
      <div class="pd-specs__intro" data-reveal>
        <p class="eyebrow">Specifications</p>
        <h2>Measured <em>to the millimetre.</em></h2>
        ${p.cat === 'sunglasses'
          ? '<p>The frame size reads lens width, bridge and temple length, in that order. Compare it with a pair you already own.</p>'
          : p.sizes ? '<p>Hats are sized by head circumference. If you are between sizes, choose the larger one: felt and cotton both shrink a little in the rain.</p>'
          : '<p>Every chain is measured and pull-tested before it leaves the studio.</p>'}
      </div>
      <dl class="spec-table" data-reveal>
        ${specRows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
        ${p.sizes ? HAT_SIZES.map(s => `<div><dt>Size ${s.size}</dt><dd>${s.range}</dd></div>`).join('') : ''}
      </dl>
    </section>

    <section class="pd-made">
      <p class="eyebrow">How it is made</p>
      <h2>Four steps, <em>by hand.</em></h2>
      <ol class="steps">
        ${made.steps.map(([t, d], si) => `<li data-reveal><span class="steps__n">${String(si + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}
      </ol>
    </section>

    <section class="pd-pair">
      <div class="shop__head"><h2>Wear it <em>with</em></h2></div>
      <div class="grid grid--3">${pairs.map(cardHTML).join('')}</div>
    </section>

    <nav class="pd-nav" aria-label="More products">
      <a href="#${prev.id}"><span>Previous</span><strong>← ${prev.name}</strong></a>
      <a href="#${next.id}"><span>Next</span><strong>${next.name} →</strong></a>
    </nav>

    <div class="buybar" id="buybar" aria-hidden="true">
      <div class="buybar__img" id="buybar-img"><svg><use href="#${p.symbol}"/></svg></div>
      <div class="buybar__text"><strong>${p.name}</strong><span id="buybar-meta"></span></div>
      <button class="btn" id="buybar-add" tabindex="-1">Add to bag</button>
    </div>`;

  bind();
  setView('front');
  setColor(0);
  updateQty();
  updateDelivery();
  initTilt(pd);
  initReveal(pd);
}

/* ---------- State updates ---------- */
function setColor(ci) {
  state.color = ci;
  const c = state.p.colors[ci];
  const style = varsStyle(c.vars);
  document.getElementById('stage').setAttribute('style', style);
  document.getElementById('buybar-img').setAttribute('style', style);
  document.getElementById('color-name').textContent = c.name;
  document.querySelectorAll('[data-color]').forEach(b => b.setAttribute('aria-pressed', Number(b.dataset.color) === ci));
  const stage = document.getElementById('stage');
  stage.classList.remove('is-swap');
  void stage.offsetWidth;
  stage.classList.add('is-swap');
  updateQty();
}

function setView(view) {
  state.view = view;
  const stage = document.getElementById('stage');
  stage.dataset.view = view;
  stage.innerHTML = stageHTML(state.p, view);
  document.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-selected', b.dataset.view === view));
}

function setSize(size) {
  state.size = size;
  document.getElementById('size-name').textContent = size ? `${size} · ${HAT_SIZES.find(s => s.size === size).range}` : 'Choose a size';
  document.querySelectorAll('[data-size]').forEach(b => b.setAttribute('aria-pressed', b.dataset.size === size));
  document.getElementById('pd-error').textContent = '';
  document.getElementById('size-group').classList.remove('is-error');
  updateQty();
}

function updateQty() {
  const { p, qty, color, size } = state;
  document.getElementById('qty').textContent = qty;
  document.getElementById('add-btn').textContent = `Add to bag · ${money(p.price * qty)}`;
  document.getElementById('buybar-meta').textContent =
    [p.colors[color].name, size, money(p.price * qty)].filter(Boolean).join(' · ');
}

function add() {
  const { p } = state;
  if (p.sizes && !state.size) {
    const group = document.getElementById('size-group');
    document.getElementById('pd-error').textContent = 'Choose a size first.';
    group.classList.remove('is-error');
    void group.offsetWidth;
    group.classList.add('is-error');
    group.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    return;
  }
  addToBag(p.id, state.color, p.sizes ? state.size : null, state.qty);
}

function recommendSize(cm) {
  return HAT_SIZES.find(s => cm <= s.max).size;
}

/* ---------- Events ---------- */
function bind() {
  pd.querySelectorAll('[data-color]').forEach(b => b.addEventListener('click', () => setColor(Number(b.dataset.color))));
  pd.querySelectorAll('[data-view]').forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
  pd.querySelectorAll('[data-size]').forEach(b => b.addEventListener('click', () => setSize(b.dataset.size)));
  pd.querySelectorAll('[data-qty]').forEach(b => b.addEventListener('click', () => {
    state.qty = clamp(state.qty + Number(b.dataset.qty), 1, 9);
    updateQty();
  }));
  document.getElementById('add-btn').addEventListener('click', add);
  document.getElementById('buybar-add').addEventListener('click', add);

  // Size finder
  if (state.p.sizes) {
    const toggle = document.getElementById('finder-toggle');
    const finder = document.getElementById('finder');
    const head = document.getElementById('head');
    toggle.addEventListener('click', () => {
      finder.hidden = !finder.hidden;
      toggle.setAttribute('aria-expanded', !finder.hidden);
    });
    const updateFinder = () => {
      const cm = Number(head.value);
      document.getElementById('head-out').textContent = `${cm} cm`;
      document.getElementById('head-size').textContent = recommendSize(cm);
      document.getElementById('head-marker').style.left = ((cm - head.min) / (head.max - head.min)) * 100 + '%';
    };
    head.addEventListener('input', updateFinder);
    updateFinder();
    document.getElementById('use-size').addEventListener('click', () => setSize(recommendSize(Number(head.value))));
  }

  // Stage: loupe zoom, close-up pan, lens look-around, swipe between views
  const stage = document.getElementById('stage');
  let swipeX = null;
  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    stage.style.setProperty('--px', (x / r.width * 100).toFixed(1) + '%');
    stage.style.setProperty('--py', (y / r.height * 100).toFixed(1) + '%');
    const loupe = stage.querySelector('.pd__loupe');
    if (loupe && e.pointerType === 'mouse') {
      const zoom = 2.6, size = loupe.offsetWidth;
      const inner = loupe.firstElementChild;
      inner.style.width = r.width * zoom + 'px';
      inner.style.height = r.height * zoom + 'px';
      inner.style.transform = `translate(${size / 2 - x * zoom}px, ${size / 2 - y * zoom}px)`;
      loupe.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`;
    }
  });
  stage.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') swipeX = e.clientX; });
  stage.addEventListener('pointerup', e => {
    if (swipeX === null) return;
    const dx = e.clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) < 40) return;
    const views = viewsFor(state.p).map(v => v[0]);
    const idx = views.indexOf(state.view) + (dx < 0 ? 1 : -1);
    setView(views[(idx + views.length) % views.length]);
  });

  // Sticky buy bar once the main button scrolls away
  const bar = document.getElementById('buybar');
  if (buyObserver) buyObserver.disconnect();
  buyObserver = new IntersectionObserver(([e]) => {
    const show = !e.isIntersecting && e.boundingClientRect.top < 0;
    bar.classList.toggle('is-show', show);
    bar.setAttribute('aria-hidden', !show);
    document.getElementById('buybar-add').tabIndex = show ? 0 : -1;
  });
  buyObserver.observe(document.getElementById('add-btn'));
}

addEventListener('hashchange', () => {
  // plain "#" links (Search, Account, footer) should not switch product
  if (!findProduct(location.hash.slice(1)) || location.hash.slice(1) === state.p.id) return;
  render();
  scrollTo({ top: 0, behavior: 'auto' });
});
render();
