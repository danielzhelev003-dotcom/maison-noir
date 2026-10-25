// Shared by every page: menu, bag + drawer, toast, cursor, scroll reveal, footer wordmark.
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const money = n => '€' + n.toLocaleString('en-IE');
const FREE_SHIPPING = 150;

/* ---------- Mobile menu ---------- */
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav__toggle');
function closeMenu() {
  nav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', false);
  navToggle.textContent = 'Menu';
}
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', open);
  navToggle.textContent = open ? 'Close' : 'Menu';
});
document.querySelectorAll('.nav__links a').forEach(a => a.addEventListener('click', closeMenu));

/* ---------- Toast ---------- */
const toast = document.createElement('div');
toast.className = 'toast';
toast.setAttribute('role', 'status');
toast.setAttribute('aria-live', 'polite');
document.body.append(toast);
let toastTimer;
function notify(msg) {
  toast.textContent = msg;
  toast.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-show'), 2200);
}

/* ---------- Bag (kept in this browser between pages) ---------- */
const BAG_KEY = 'mn-bag';
let bagItems = [];
try { bagItems = JSON.parse(localStorage.getItem(BAG_KEY)) || []; } catch { bagItems = []; }
bagItems = bagItems.filter(i => findProduct(i.id));
function saveBag() {
  try { localStorage.setItem(BAG_KEY, JSON.stringify(bagItems)); } catch { /* storage blocked: bag lasts for this page only */ }
}

document.body.insertAdjacentHTML('beforeend', `
  <div class="drawer" id="drawer" hidden>
    <div class="drawer__scrim" data-close></div>
    <aside class="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <header class="drawer__head">
        <h2 id="drawer-title">Your bag</h2>
        <button class="drawer__close" data-close aria-label="Close bag">Close</button>
      </header>
      <div class="drawer__ship">
        <p id="ship-text"></p>
        <div class="drawer__bar"><span id="ship-bar"></span></div>
      </div>
      <ul class="drawer__list" id="bag-list"></ul>
      <footer class="drawer__foot">
        <div class="drawer__total"><span>Subtotal</span><strong id="bag-total">€0</strong></div>
        <p class="drawer__note">Taxes included. Shipping calculated at checkout.</p>
        <button class="btn btn--block" id="checkout">Checkout</button>
      </footer>
    </aside>
  </div>`);

const drawer = document.getElementById('drawer');
function openBag() {
  drawer.hidden = false;
  requestAnimationFrame(() => drawer.classList.add('is-open'));
  document.body.classList.add('no-scroll');
  drawer.querySelector('.drawer__close').focus();
}
function closeBag() {
  drawer.classList.remove('is-open');
  document.body.classList.remove('no-scroll');
  setTimeout(() => { drawer.hidden = true; }, 350);
}
drawer.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeBag(); });
addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) closeBag(); });
document.querySelectorAll('.nav__bag').forEach(b => b.addEventListener('click', openBag));
document.getElementById('checkout').addEventListener('click', () => notify('Checkout opens with the launch of Collection 01'));

function itemLabel(item) {
  const p = findProduct(item.id);
  return [p.colors[item.color].name, item.size && 'Size ' + item.size].filter(Boolean).join(' · ');
}

function renderBag() {
  const count = bagItems.reduce((n, i) => n + i.qty, 0);
  const total = bagItems.reduce((n, i) => n + i.qty * findProduct(i.id).price, 0);
  document.querySelectorAll('.bag-count').forEach(el => el.textContent = count);
  document.getElementById('drawer-title').textContent = `Your bag (${count})`;
  document.getElementById('bag-total').textContent = money(total);

  const left = FREE_SHIPPING - total;
  document.getElementById('ship-text').innerHTML = left > 0
    ? `You are <strong>${money(left)}</strong> away from free shipping.`
    : 'You have <strong>free shipping</strong>.';
  document.getElementById('ship-bar').style.transform = `scaleX(${clamp(total / FREE_SHIPPING, 0, 1)})`;

  const list = document.getElementById('bag-list');
  if (!bagItems.length) {
    list.innerHTML = `<li class="drawer__empty"><p>Your bag is empty.</p><a href="index.html#shop" class="link">Browse the collection</a></li>`;
    return;
  }
  list.innerHTML = bagItems.map((item, i) => {
    const p = findProduct(item.id);
    return `
      <li class="bag-item">
        <a href="${productUrl(p.id)}" class="bag-item__img" style="${varsStyle(p.colors[item.color].vars)}"><svg><use href="#${p.symbol}"/></svg></a>
        <div class="bag-item__body">
          <div class="bag-item__row"><a href="${productUrl(p.id)}">${p.name}</a><span>${money(p.price * item.qty)}</span></div>
          <p>${itemLabel(item)}</p>
          <div class="bag-item__row">
            <div class="stepper stepper--sm">
              <button data-step="-1" data-i="${i}" aria-label="Decrease quantity">−</button>
              <span>${item.qty}</span>
              <button data-step="1" data-i="${i}" aria-label="Increase quantity">+</button>
            </div>
            <button class="link" data-remove="${i}">Remove</button>
          </div>
        </div>
      </li>`;
  }).join('');
}
document.getElementById('bag-list').addEventListener('click', e => {
  const step = e.target.closest('[data-step]');
  const remove = e.target.closest('[data-remove]');
  if (step) {
    const item = bagItems[step.dataset.i];
    item.qty = clamp(item.qty + Number(step.dataset.step), 0, 9);
    if (!item.qty) bagItems.splice(step.dataset.i, 1);
  } else if (remove) {
    bagItems.splice(remove.dataset.remove, 1);
  } else return;
  saveBag();
  renderBag();
});

function addToBag(id, color = 0, size = null, qty = 1) {
  const existing = bagItems.find(i => i.id === id && i.color === color && i.size === size);
  if (existing) existing.qty = Math.min(9, existing.qty + qty);
  else bagItems.push({ id, color, size, qty });
  saveBag();
  renderBag();
  document.querySelectorAll('.nav__bag').forEach(b => {
    b.classList.remove('is-bump');
    void b.offsetWidth;
    b.classList.add('is-bump');
  });
  notify(`${findProduct(id).name} added to bag`);
}
renderBag();

/* ---------- Custom cursor (mouse only) ---------- */
const cursor = document.createElement('div');
cursor.className = 'cursor';
cursor.setAttribute('aria-hidden', 'true');
cursor.innerHTML = '<span></span>';
document.body.append(cursor);
const pointer = { x: innerWidth / 2, y: innerHeight / 2 };
const cursorPos = { ...pointer };
if (finePointer) {
  document.body.classList.add('has-cursor');
  addEventListener('pointermove', e => { pointer.x = e.clientX; pointer.y = e.clientY; });
  document.addEventListener('pointerover', e => {
    cursor.classList.toggle('is-view', !!e.target.closest('.card__link, .pair__link'));
    cursor.classList.toggle('is-link', !!e.target.closest('a, button, label, input[type=range]'));
    cursor.classList.toggle('is-hidden', !!e.target.closest('.hero, .pd__stage'));
  });
  (function loop() {
    cursorPos.x = lerp(cursorPos.x, pointer.x, 0.2);
    cursorPos.y = lerp(cursorPos.y, pointer.y, 0.2);
    cursor.style.transform = `translate(${cursorPos.x}px, ${cursorPos.y}px)`;
    requestAnimationFrame(loop);
  })();
}

/* ---------- Scroll reveal ---------- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-in');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
function initReveal(root = document) {
  root.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el, i) => {
    el.style.setProperty('--d', (i % 4) * 80 + 'ms');
    revealObserver.observe(el);
  });
}

/* ---------- Product card tilt ---------- */
function initTilt(root = document) {
  if (!finePointer || reduceMotion) return;
  root.querySelectorAll('.card__img').forEach(img => {
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

function cardHTML(p) {
  return `
    <article class="card" data-cat="${p.cat}" data-reveal>
      <div class="card__img">
        ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ''}
        <svg aria-hidden="true"><use href="#${p.symbol}"/></svg>
        <a class="card__link" href="${productUrl(p.id)}" aria-label="View ${p.name}"></a>
        <button class="card__add" data-add="${p.id}">${p.sizes ? 'Quick add · M' : 'Add to bag'}</button>
      </div>
      <div class="card__info"><h3><a href="${productUrl(p.id)}">${p.name}</a></h3><span>${money(p.price)}</span></div>
      <div class="card__swatches">${p.colors.map(c => `<i style="--c:${c.swatch}" title="${c.name}"></i>`).join('')}</div>
    </article>`;
}
document.addEventListener('click', e => {
  const add = e.target.closest('[data-add]');
  if (!add) return;
  const p = findProduct(add.dataset.add);
  addToBag(p.id, 0, p.sizes ? 'M' : null);
});

/* ---------- Footer wordmark ---------- */
const mark = document.getElementById('footer-mark');
if (mark) {
  mark.innerHTML = [...mark.textContent].map((c, i) =>
    `<span style="--i:${i}" aria-hidden="true">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  new IntersectionObserver(([e]) => mark.classList.toggle('is-in', e.isIntersecting), { threshold: 0.3 }).observe(mark);
}
