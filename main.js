const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/* ---------- Mobile menu ---------- */
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav__toggle');
function closeMenu() {
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', false);
  toggle.textContent = 'Menu';
}
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
  toggle.textContent = open ? 'Close' : 'Menu';
});
document.querySelectorAll('.nav__links a').forEach(a => a.addEventListener('click', closeMenu));

/* ---------- Category filter ---------- */
const filterButtons = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('.card');
function filter(cat) {
  filterButtons.forEach(b => b.classList.toggle('is-active', b.dataset.filter === cat));
  cards.forEach(c => c.hidden = cat !== 'all' && c.dataset.cat !== cat);
}
filterButtons.forEach(b => b.addEventListener('click', () => filter(b.dataset.filter)));
document.querySelectorAll('[data-jump]').forEach(a => a.addEventListener('click', () => filter(a.dataset.jump)));

/* ---------- Bag + toast ---------- */
let bag = 0, toastTimer;
const toast = document.getElementById('toast');
function notify(msg) {
  toast.textContent = msg;
  toast.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-show'), 2200);
}
document.querySelectorAll('.card__add').forEach(btn => btn.addEventListener('click', () => {
  const count = document.getElementById('bag-count');
  count.textContent = ++bag;
  count.parentElement.classList.remove('is-bump');
  void count.parentElement.offsetWidth;
  count.parentElement.classList.add('is-bump');
  notify(btn.closest('.card').querySelector('h3').textContent + ' added to bag');
}));
document.getElementById('news-form').addEventListener('submit', e => {
  e.preventDefault();
  e.target.reset();
  notify('Welcome to Le Club Noir');
});

/* ---------- Scroll reveal ---------- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-in');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('[data-reveal]').forEach((el, i) => {
  el.style.setProperty('--d', (i % 4) * 80 + 'ms');
  revealObserver.observe(el);
});

/* ---------- Custom cursor ---------- */
const cursor = document.querySelector('.cursor');
const pointer = { x: innerWidth / 2, y: innerHeight / 2 };
const cursorPos = { ...pointer };
if (finePointer) {
  document.body.classList.add('has-cursor');
  addEventListener('pointermove', e => { pointer.x = e.clientX; pointer.y = e.clientY; });
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-link'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-link'));
  });
  cards.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-view'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-view'));
  });
}

/* ---------- 1. Hero lens ---------- */
const hero = document.getElementById('hero');
const heroLens = { x: 0, y: 0, tx: 0, ty: 0, lastMove: -1e9, active: false };
function placeHeroDefault() {
  heroLens.tx = heroLens.x = hero.clientWidth * 0.62;
  heroLens.ty = heroLens.y = hero.clientHeight * 0.48;
}
placeHeroDefault();
hero.addEventListener('pointermove', e => {
  const r = hero.getBoundingClientRect();
  heroLens.tx = e.clientX - r.left;
  heroLens.ty = e.clientY - r.top;
  heroLens.lastMove = performance.now();
});
hero.addEventListener('pointerenter', () => { heroLens.active = true; cursor.classList.add('is-hidden'); });
hero.addEventListener('pointerleave', () => { heroLens.active = false; cursor.classList.remove('is-hidden'); });
addEventListener('resize', placeHeroDefault);

/* ---------- 2. Velocity marquee ---------- */
const marquee = document.getElementById('marquee');
let marqueeX = 0, lastScroll = scrollY, velocity = 0, direction = -1;

/* ---------- 3. Card tilt ---------- */
if (finePointer && !reduceMotion) {
  document.querySelectorAll('.card__img').forEach(img => {
    img.addEventListener('pointermove', e => {
      const r = img.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      img.style.setProperty('--rx', ((0.5 - py) * 10).toFixed(2) + 'deg');
      img.style.setProperty('--ry', ((px - 0.5) * 12).toFixed(2) + 'deg');
      img.style.setProperty('--gx', px * 100 + '%');
      img.style.setProperty('--gy', py * 100 + '%');
    });
    img.addEventListener('pointerleave', () => {
      img.style.setProperty('--rx', '0deg');
      img.style.setProperty('--ry', '0deg');
    });
  });
}

/* ---------- 4. Lens Lab ---------- */
const tints = {
  noir:   { fill: '#141414', op: .78, blend: 'multiply', name: 'Noir',   desc: 'Deep grey, true colour. The classic for full sun.',  uv: 'UV400 · Cat. 3', vlt: '12%' },
  amber:  { fill: '#b8591a', op: .62, blend: 'multiply', name: 'Amber',  desc: 'Warms the light and sharpens contrast. Golden hour all day.', uv: 'UV400 · Cat. 2', vlt: '22%' },
  rose:   { fill: '#c2566e', op: .5,  blend: 'multiply', name: 'Rosé',   desc: 'A soft pink wash. Easy on the eyes, easier on the mood.', uv: 'UV400 · Cat. 2', vlt: '30%' },
  ocean:  { fill: '#1f5f8b', op: .6,  blend: 'multiply', name: 'Ocean',  desc: 'Cool blue that calms glare off water and white sand.', uv: 'UV400 · Cat. 3', vlt: '16%' },
  sage:   { fill: '#4f6b4a', op: .62, blend: 'multiply', name: 'Sage',   desc: 'Green-grey, the colour of old aviators. Natural contrast.', uv: 'UV400 · Cat. 3', vlt: '15%' },
  mirror: { fill: 'url(#mirror)', op: .92, blend: 'normal', name: 'Mirror', desc: 'Silver flash coating. They see themselves, not you.', uv: 'UV400 · Cat. 3', vlt: '10%' }
};
const lenses = document.querySelector('.lab__lenses');
function setTint(key) {
  const t = tints[key];
  lenses.style.fill = t.fill;
  lenses.style.fillOpacity = t.op;
  lenses.style.mixBlendMode = t.blend;
  document.getElementById('tint-name').textContent = t.name;
  document.getElementById('tint-desc').textContent = t.desc;
  document.getElementById('tint-uv').textContent = t.uv;
  document.getElementById('tint-vlt').textContent = t.vlt;
  document.querySelectorAll('[data-tint]').forEach(b => {
    const on = b.dataset.tint === key;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-checked', on);
  });
}
document.querySelectorAll('[data-tint]').forEach(b => b.addEventListener('click', () => setTint(b.dataset.tint)));
setTint('noir');

// Drag the glasses across the scene
const stage = document.getElementById('lab-stage');
const glasses = document.getElementById('lab-glasses');
const labPos = { x: 0, y: 0, tx: 0, ty: 0 };
let dragging = false, dragStart = null, touchedLab = false;
stage.addEventListener('pointerdown', e => {
  dragging = true;
  touchedLab = true;
  stage.setPointerCapture(e.pointerId);
  dragStart = { x: e.clientX, y: e.clientY, ox: labPos.tx, oy: labPos.ty };
  stage.classList.add('is-dragging');
});
stage.addEventListener('pointermove', e => {
  if (!dragging) return;
  // viewBox is 600 wide; convert screen px to svg units
  const scale = 600 / Math.min(stage.clientWidth, stage.clientHeight);
  labPos.tx = clamp(dragStart.ox + (e.clientX - dragStart.x) * scale, -110, 110);
  labPos.ty = clamp(dragStart.oy + (e.clientY - dragStart.y) * scale, -180, 200);
});
['pointerup', 'pointercancel'].forEach(t => stage.addEventListener(t, () => {
  dragging = false;
  stage.classList.remove('is-dragging');
}));

/* ---------- 5. Golden hour ---------- */
const hour = document.getElementById('hour');
const skyStops = [
  { p: 0,    top: [158, 201, 232], bottom: [238, 243, 244], sun: [255, 250, 230] },
  { p: 0.45, top: [242, 166, 90],  bottom: [251, 224, 176], sun: [255, 214, 140] },
  { p: 0.7,  top: [150, 64, 92],   bottom: [240, 138, 75],  sun: [255, 110, 60] },
  { p: 1,    top: [10, 14, 30],    bottom: [36, 32, 60],    sun: [255, 90, 50] }
];
function skyAt(p) {
  let i = 0;
  while (i < skyStops.length - 2 && p > skyStops[i + 1].p) i++;
  const a = skyStops[i], b = skyStops[i + 1];
  const t = clamp((p - a.p) / (b.p - a.p), 0, 1);
  const mix = k => a[k].map((v, j) => Math.round(lerp(v, b[k][j], t))).join(',');
  return { top: mix('top'), bottom: mix('bottom'), sun: mix('sun') };
}
const clock = document.getElementById('clock');
const hourBar = document.getElementById('hour-bar');
const slides = document.querySelectorAll('.hour__slide');
function updateHour() {
  const r = hour.getBoundingClientRect();
  const p = clamp(-r.top / (r.height - innerHeight), 0, 1);
  const sky = skyAt(p);
  hour.style.setProperty('--sky-top', `rgb(${sky.top})`);
  hour.style.setProperty('--sky-bottom', `rgb(${sky.bottom})`);
  hour.style.setProperty('--sun', `rgb(${sky.sun})`);
  hour.style.setProperty('--p', p.toFixed(4));
  hour.classList.toggle('is-night', p > 0.62);
  // 12:00 -> 22:00
  const minutes = Math.round(12 * 60 + p * 600);
  clock.textContent = `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
  hourBar.style.transform = `scaleY(${p})`;
  const idx = p < 0.36 ? 0 : p < 0.7 ? 1 : 2;
  slides.forEach((s, i) => s.classList.toggle('is-active', i === idx));
}

/* ---------- 6. About words ---------- */
const aboutText = document.getElementById('about-text');
aboutText.innerHTML = aboutText.textContent.split(' ').map(w => `<span>${w}</span>`).join(' ');
const words = aboutText.querySelectorAll('span');
function updateAbout() {
  const r = aboutText.getBoundingClientRect();
  const p = clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35), 0, 1);
  const lit = p * words.length;
  words.forEach((w, i) => w.style.opacity = clamp(lit - i, 0.12, 1));
}

/* ---------- Footer wordmark ---------- */
const mark = document.getElementById('footer-mark');
mark.innerHTML = [...mark.textContent].map((c, i) =>
  `<span style="--i:${i}" aria-hidden="true">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
new IntersectionObserver(([e]) => mark.classList.toggle('is-in', e.isIntersecting), { threshold: 0.3 }).observe(mark);

/* ---------- Main loop ---------- */
function frame(now) {
  // cursor
  if (finePointer) {
    cursorPos.x = lerp(cursorPos.x, pointer.x, 0.2);
    cursorPos.y = lerp(cursorPos.y, pointer.y, 0.2);
    cursor.style.transform = `translate(${cursorPos.x}px, ${cursorPos.y}px)`;
  }

  // hero: follow the pointer, or wander on its own when idle / on touch
  if (!heroLens.active || now - heroLens.lastMove > 2500) {
    // keep the whole frame on screen (frame is 460 units wide, scaled by --s)
    const w = hero.clientWidth, h = hero.clientHeight, t = now / 1000;
    const s = parseFloat(getComputedStyle(hero).getPropertyValue('--s')) || 1;
    const room = Math.max(0, w / 2 - 230 * s - 8);
    heroLens.tx = w / 2 + Math.sin(t * 0.45) * room;
    heroLens.ty = h * (0.46 + Math.sin(t * 0.8) * 0.14);
  }
  const ease = reduceMotion ? 1 : 0.09;
  heroLens.x = lerp(heroLens.x, heroLens.tx, ease);
  heroLens.y = lerp(heroLens.y, heroLens.ty, ease);
  hero.style.setProperty('--x', heroLens.x.toFixed(1) + 'px');
  hero.style.setProperty('--y', heroLens.y.toFixed(1) + 'px');

  // marquee: base speed plus scroll velocity, direction follows scroll
  const dy = scrollY - lastScroll;
  lastScroll = scrollY;
  if (dy !== 0) direction = dy > 0 ? -1 : 1;
  velocity = lerp(velocity, Math.abs(dy), 0.1);
  if (!reduceMotion) {
    marqueeX += direction * (0.6 + velocity * 0.6);
    const half = marquee.scrollWidth / 2;
    if (marqueeX <= -half) marqueeX += half;
    if (marqueeX > 0) marqueeX -= half;
    marquee.style.transform = `translateX(${marqueeX}px) skewX(${clamp(-direction * velocity * 0.4, -12, 12)}deg)`;
  }

  // lens lab: idle sway until the user grabs it
  if (!touchedLab && !reduceMotion) labPos.tx = Math.sin(now / 1400) * 70;
  labPos.x = lerp(labPos.x, labPos.tx, 0.15);
  labPos.y = lerp(labPos.y, labPos.ty, 0.15);
  glasses.setAttribute('transform', `translate(${labPos.x.toFixed(1)} ${labPos.y.toFixed(1)})`);

  updateHour();
  updateAbout();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
