/* ============ VoltEdge — core script ============
   Front-end demo: data lives in localStorage (no backend).
   Admin login:  admin@voltedge.com / admin123
   Demo user:    demo@voltedge.com  / demo123
================================================ */

/* ---- theme (runs immediately to avoid flash) ---- */
(function () {
  const saved = localStorage.getItem('ve_theme');
  const t = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', t);
})();

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const LS = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
};
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => '$' + Number(n).toLocaleString(undefined, { minimumFractionDigits: Number.isInteger(+n) ? 0 : 2, maximumFractionDigits: 2 });
const stars = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));

/* ---- icons ---- */
const ICON = {
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  eye: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>'
};

/* ---- data ---- */
const CATS = [
  { id: 'smartphones', name: 'Smartphones', icon: '📱', g: ['#6366f1', '#8b5cf6'], desc: 'Flagship cameras, all-day battery.' },
  { id: 'laptops', name: 'Laptops', icon: '💻', g: ['#0ea5e9', '#6366f1'], desc: 'Work, create and play anywhere.' },
  { id: 'audio', name: 'Audio', icon: '🎧', g: ['#ec4899', '#8b5cf6'], desc: 'Immersive sound, zero noise.' },
  { id: 'wearables', name: 'Wearables', icon: '⌚', g: ['#10b981', '#06b6d4'], desc: 'Track health and stay connected.' },
  { id: 'accessories', name: 'Accessories', icon: '🔌', g: ['#f59e0b', '#ef4444'], desc: 'Chargers, cases and power.' },
  { id: 'gaming', name: 'Gaming', icon: '🎮', g: ['#ef4444', '#8b5cf6'], desc: 'Controllers, rigs and more.' }
];
const SEED = [
  { id: 1, name: 'Nova X Pro 5G', cat: 'smartphones', price: 799, old: 899, rating: 4.7, reviews: 1284, icon: '📱', badge: 'Hot', stock: 24, desc: '6.7" AMOLED, 200MP camera, 5000mAh battery.' },
  { id: 2, name: 'Aura S Ultra', cat: 'smartphones', price: 1099, rating: 4.8, reviews: 932, icon: '📱', badge: 'New', stock: 12, desc: 'Titanium frame, AI photo suite, 1TB option.' },
  { id: 3, name: 'AeroBook 14 OLED', cat: 'laptops', price: 1299, old: 1449, rating: 4.6, reviews: 604, icon: '💻', badge: '-10%', stock: 9, desc: '14" 2.8K OLED, 32GB RAM, 18h battery.' },
  { id: 4, name: 'Titan G15 Gaming', cat: 'laptops', price: 1599, rating: 4.7, reviews: 418, icon: '🖥️', badge: '', stock: 6, desc: 'RTX graphics, 165Hz display, liquid metal cooling.' },
  { id: 5, name: 'SonicWave ANC Headphones', cat: 'audio', price: 249, old: 299, rating: 4.8, reviews: 2210, icon: '🎧', badge: 'Best seller', stock: 40, desc: 'Adaptive noise cancelling, 40h playtime.' },
  { id: 6, name: 'PulseBuds Pro', cat: 'audio', price: 129, rating: 4.5, reviews: 1730, icon: '🎵', badge: '', stock: 55, desc: 'True wireless earbuds with spatial audio.' },
  { id: 7, name: 'BassBox Mini Speaker', cat: 'audio', price: 79, old: 99, rating: 4.4, reviews: 860, icon: '🔊', badge: 'Sale', stock: 31, desc: 'Waterproof, 360° sound, 20h battery.' },
  { id: 8, name: 'ChronoFit Watch 5', cat: 'wearables', price: 199, rating: 4.6, reviews: 1120, icon: '⌚', badge: 'New', stock: 28, desc: 'GPS, ECG, sleep tracking, AMOLED always-on.' },
  { id: 9, name: 'Orbit Band 3', cat: 'wearables', price: 59, rating: 4.3, reviews: 740, icon: '⌚', badge: '', stock: 60, desc: 'Slim fitness band with 14-day battery.' },
  { id: 10, name: 'VoltCharge 65W GaN', cat: 'accessories', price: 39, rating: 4.7, reviews: 1540, icon: '🔌', badge: 'Popular', stock: 80, desc: 'Fast 3-port charger for phone, tablet and laptop.' },
  { id: 11, name: 'PowerCore 20K Bank', cat: 'accessories', price: 49, old: 65, rating: 4.5, reviews: 990, icon: '🔋', badge: '-25%', stock: 45, desc: '20,000mAh, 45W PD, dual USB-C.' },
  { id: 12, name: 'Phantom Pro Controller', cat: 'gaming', price: 69, rating: 4.6, reviews: 530, icon: '🎮', badge: '', stock: 33, desc: 'Hall-effect sticks, back paddles, wireless.' }
];
const catOf = id => CATS.find(c => c.id === id) || CATS[0];
function products() {
  let p = LS.get('ve_products', null);
  if (!p) { p = SEED; LS.set('ve_products', p); }
  return p;
}
const gradOf = p => { const g = catOf(p.cat).g; return `--g1:${g[0]};--g2:${g[1]}`; };

/* ---- seeded orders/users for the admin panel ---- */
function orders() {
  let o = LS.get('ve_orders', null);
  if (!o) {
    const names = ['Ayesha Khan', 'Hamza Ali', 'Sara Ahmed', 'Bilal Raza', 'Maryam Noor', 'Usman Tariq', 'Zainab Iqbal', 'Ali Hassan'];
    const st = ['Delivered', 'Delivered', 'Shipped', 'Pending', 'Processing', 'Delivered', 'Cancelled'];
    let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    o = [];
    for (let i = 0; i < 28; i++) {
      const p = SEED[Math.floor(rnd() * SEED.length)], q = 1 + Math.floor(rnd() * 2);
      const d = new Date(); d.setDate(d.getDate() - Math.floor(rnd() * 180));
      o.push({ id: '#VE' + (1040 + i), customer: names[i % names.length], items: [{ id: p.id, qty: q }], total: p.price * q, status: st[i % st.length], date: d.toISOString() });
    }
    o.sort((a, b) => new Date(b.date) - new Date(a.date));
    LS.set('ve_orders', o);
  }
  return o;
}
function users() {
  let u = LS.get('ve_users', null);
  if (!u) {
    u = [
      { name: 'Store Admin', email: 'admin@voltedge.com', password: 'admin123', role: 'admin', joined: '2026-01-04' },
      { name: 'Demo User', email: 'demo@voltedge.com', password: 'demo123', role: 'customer', joined: '2026-03-12' },
      { name: 'Ayesha Khan', email: 'ayesha@example.com', password: 'x', role: 'customer', joined: '2026-05-21' },
      { name: 'Hamza Ali', email: 'hamza@example.com', password: 'x', role: 'customer', joined: '2026-07-02' },
      { name: 'Sara Ahmed', email: 'sara@example.com', password: 'x', role: 'customer', joined: '2026-09-18' }
    ];
    LS.set('ve_users', u);
  }
  return u;
}

/* ---- SweetAlert helpers (theme aware) ---- */
const hasSwal = () => typeof Swal !== 'undefined';
function themed() {
  const s = getComputedStyle(document.documentElement);
  return { background: s.getPropertyValue('--card').trim(), color: s.getPropertyValue('--text').trim() };
}
function toast(icon, title) {
  if (!hasSwal()) return console.log(title);
  Swal.fire({ ...themed(), toast: true, position: 'top-end', icon, title, showConfirmButton: false, timer: 2400, timerProgressBar: true });
}
function popup(opts) {
  if (!hasSwal()) { alert(opts.title || opts.text); return Promise.resolve({ isConfirmed: true }); }
  return Swal.fire({ ...themed(), ...opts });
}

/* ---- theme toggle ---- */
function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('ve_theme', t);
  $$('[data-theme-btn]').forEach(b => b.innerHTML = t === 'dark' ? ICON.sun : ICON.moon);
  document.dispatchEvent(new Event('themechange'));
}
const toggleTheme = () => setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');

/* ---- cart ---- */
const Cart = {
  get() { return LS.get('ve_cart', []).filter(i => products().some(p => p.id === i.id)); },
  save(c) { LS.set('ve_cart', c); Cart.badge(); Cart.render(); },
  add(id) { const c = Cart.get(), i = c.find(x => x.id === id); i ? i.qty++ : c.push({ id, qty: 1 }); Cart.save(c); },
  setQty(id, d) { let c = Cart.get(); const i = c.find(x => x.id === id); if (!i) return; i.qty += d; if (i.qty <= 0) c = c.filter(x => x.id !== id); Cart.save(c); },
  remove(id) { Cart.save(Cart.get().filter(x => x.id !== id)); },
  clear() { Cart.save([]); },
  count() { return Cart.get().reduce((a, b) => a + b.qty, 0); },
  total() { return Cart.get().reduce((a, i) => a + i.qty * products().find(p => p.id === i.id).price, 0); },
  badge() {
    const el = $('#cartCount'); if (!el) return;
    const n = Cart.count(); el.textContent = n; el.classList.toggle('show', n > 0);
    const b = $('#cartBtn'); if (b) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  },
  render() {
    const body = $('#cartBody'); if (!body) return;
    const c = Cart.get();
    $('#cartTotal').textContent = money(Cart.total());
    $('#checkoutBtn').disabled = !c.length;
    body.innerHTML = c.length ? c.map(i => {
      const p = products().find(x => x.id === i.id);
      return `<div class="cart-row"><div class="cart-thumb" style="${gradOf(p)}">${p.icon}</div>
        <div><h4>${esc(p.name)}</h4><small>${money(p.price)} each</small>
        <div class="qty"><button data-qty="${p.id}:-1" aria-label="Decrease">−</button><b>${i.qty}</b><button data-qty="${p.id}:1" aria-label="Increase">+</button></div></div>
        <button class="cart-remove" data-remove="${p.id}" aria-label="Remove">✕</button></div>`;
    }).join('') : '<div class="empty"><div class="big">🛒</div><b>Your cart is empty</b><p>Add something shiny to get started.</p></div>';
  },
  open() { $('#drawer').classList.add('open'); $('#overlay').classList.add('open'); },
  close() { $('#drawer').classList.remove('open'); $('#overlay').classList.remove('open'); },
  async checkout() {
    const s = Auth.session();
    if (!s) {
      const r = await popup({ icon: 'info', title: 'Please log in', text: 'Sign in to complete your purchase.', showCancelButton: true, confirmButtonText: 'Go to login', cancelButtonText: 'Later' });
      if (r.isConfirmed) location.href = 'login.html?next=shop.html';
      return;
    }
    const total = Cart.total();
    const r = await popup({ icon: 'question', title: 'Confirm your order', html: `You are about to pay <b>${money(total)}</b> for <b>${Cart.count()}</b> item(s).`, showCancelButton: true, confirmButtonText: 'Place order', cancelButtonText: 'Cancel' });
    if (!r.isConfirmed) return;
    const o = orders(); const id = '#VE' + (1040 + o.length + Math.floor(Math.random() * 90));
    o.unshift({ id, customer: s.name, items: Cart.get(), total, status: 'Pending', date: new Date().toISOString() });
    LS.set('ve_orders', o); Cart.clear(); Cart.close();
    popup({ icon: 'success', title: 'Order placed! 🎉', html: `Your order <b>${id}</b> is confirmed.<br>We'll email you shipping updates.`, confirmButtonText: 'Awesome' });
  }
};

/* ---- auth ---- */
const Auth = {
  session: () => LS.get('ve_session', null),
  login(email, password) {
    const u = users().find(x => x.email.toLowerCase() === email.toLowerCase() && x.password === password);
    if (u) LS.set('ve_session', { name: u.name, email: u.email, role: u.role });
    return u;
  },
  register(name, email, password) {
    const all = users();
    if (all.some(x => x.email.toLowerCase() === email.toLowerCase())) return false;
    all.push({ name, email, password, role: 'customer', joined: new Date().toISOString().slice(0, 10) });
    LS.set('ve_users', all);
    LS.set('ve_session', { name, email, role: 'customer' });
    return true;
  },
  async logout() {
    localStorage.removeItem('ve_session');
    await popup({ icon: 'success', title: 'Logged out', text: 'See you soon!', timer: 1400, showConfirmButton: false });
    location.href = 'index.html';
  }
};

/* ---- product card + catalog ---- */
function cardHTML(p) {
  const wish = LS.get('ve_wish', []).includes(p.id);
  return `<article class="card product reveal" data-id="${p.id}">
    <div class="p-visual" style="${gradOf(p)}">
      ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : ''}
      <button class="wish ${wish ? 'on' : ''}" data-wish="${p.id}" aria-label="Wishlist">${wish ? '♥' : '♡'}</button>
      <div class="p-emoji">${p.icon}</div>
    </div>
    <div class="p-body">
      <span class="p-cat">${esc(catOf(p.cat).name)}</span>
      <h3>${esc(p.name)}</h3>
      <p class="p-desc">${esc(p.desc || '')}</p>
      <div class="rating">${stars(p.rating)} <small>${p.rating} (${p.reviews})</small></div>
      <div class="p-foot">
        <div class="price">${p.old ? `<s>${money(p.old)}</s>` : ''}${money(p.price)}</div>
        <button class="btn btn-primary btn-sm" data-add="${p.id}">Add to Cart</button>
      </div>
    </div></article>`;
}

function mountCatalog(o) {
  const st = { cat: o.cat || 'all', q: '', sort: 'featured', max: Infinity };
  const grid = $(o.grid);
  const chipsEl = $(o.chips);
  const chipList = [{ id: 'all', name: 'All' }, ...CATS];
  chipsEl.innerHTML = chipList.map(c => `<button class="chip ${c.id === st.cat ? 'active' : ''}" data-filter="${c.id}">${c.name}</button>`).join('');
  function list() {
    let l = products().filter(p => (st.cat === 'all' || p.cat === st.cat) && p.name.toLowerCase().includes(st.q.toLowerCase()) && p.price <= st.max);
    if (st.sort === 'low') l.sort((a, b) => a.price - b.price);
    else if (st.sort === 'high') l.sort((a, b) => b.price - a.price);
    else if (st.sort === 'rating') l.sort((a, b) => b.rating - a.rating);
    return o.limit ? l.slice(0, o.limit) : l;
  }
  function render() {
    const l = list();
    grid.innerHTML = l.length ? l.map(cardHTML).join('') : '<div class="empty" style="grid-column:1/-1"><div class="big">🔍</div><b>No products found</b><p>Try another category, search term or price.</p></div>';
    if (o.count) $(o.count).textContent = `Showing ${l.length} product${l.length === 1 ? '' : 's'}`;
    observeReveal();
  }
  chipsEl.addEventListener('click', e => {
    const b = e.target.closest('[data-filter]'); if (!b) return;
    st.cat = b.dataset.filter;
    $$('.chip', chipsEl).forEach(c => c.classList.toggle('active', c === b));
    render();
  });
  if (o.search) $(o.search).addEventListener('input', e => { st.q = e.target.value.trim(); render(); });
  if (o.sort) $(o.sort).addEventListener('change', e => { st.sort = e.target.value; render(); });
  if (o.range) {
    const r = $(o.range), lab = $(o.rangeLabel);
    const maxP = Math.max(...products().map(p => p.price));
    r.max = Math.ceil(maxP / 50) * 50; r.value = r.max; st.max = +r.value; lab.textContent = 'Any';
    r.addEventListener('input', () => { st.max = +r.value; lab.textContent = +r.value >= +r.max ? 'Any' : 'Up to ' + money(r.value); render(); });
  }
  render();
  return { st, render };
}

/* ---- layout injection (navbar, cart drawer, footer) ---- */
function layout() {
  const page = location.pathname.split('/').pop() || 'index.html';
  const links = [['index.html', 'Home'], ['shop.html', 'Shop'], ['categories.html', 'Categories'], ['about.html', 'About'], ['contact.html', 'Contact']];
  const nav = `<header class="nav"><div class="container nav-in">
    <a class="logo" href="index.html"><span class="logo-mark">⚡</span>Volt<b>Edge</b></a>
    <nav class="nav-links" id="navLinks">${links.map(([h, t]) => `<a href="${h}" class="${page === h ? 'active' : ''}">${t}</a>`).join('')}</nav>
    <div class="nav-actions">
      <button class="icon-btn" data-theme-btn aria-label="Toggle dark mode"></button>
      <button class="icon-btn" id="cartBtn" aria-label="Open cart">${ICON.cart}<span class="cart-count" id="cartCount">0</span></button>
      <div id="authArea"></div>
      <button class="icon-btn burger" id="burger" aria-label="Menu">${ICON.menu}</button>
    </div></div></header>`;
  const drawer = `<div class="overlay" id="overlay"></div>
    <aside class="drawer" id="drawer" aria-label="Shopping cart">
      <div class="drawer-head"><h3>🛒 Your Cart</h3><button class="icon-btn" id="closeCart" aria-label="Close">✕</button></div>
      <div class="drawer-body" id="cartBody"></div>
      <div class="drawer-foot"><div class="cart-total"><span>Total</span><span id="cartTotal">$0</span></div>
      <button class="btn btn-primary btn-block" id="checkoutBtn">Checkout</button>
      <button class="btn btn-ghost btn-block btn-sm" id="clearCart" style="margin-top:10px">Clear cart</button></div>
    </aside>`;
  const footer = `<footer class="footer"><div class="container">
    <div class="footer-grid">
      <div><a class="logo" href="index.html"><span class="logo-mark">⚡</span>VoltEdge</a><p>Premium electronics, honest prices and support that actually answers. Powering your everyday since 2018.</p>
        <div class="socials"><a href="#" aria-label="Facebook">f</a><a href="#" aria-label="X / Twitter">𝕏</a><a href="#" aria-label="Instagram">ig</a><a href="#" aria-label="YouTube">▶</a><a href="#" aria-label="LinkedIn">in</a></div></div>
      <div><h5>Shop</h5><ul><li><a href="shop.html?cat=smartphones">Smartphones</a></li><li><a href="shop.html?cat=laptops">Laptops</a></li><li><a href="shop.html?cat=audio">Audio</a></li><li><a href="shop.html?cat=accessories">Accessories</a></li></ul></div>
      <div><h5>Company</h5><ul><li><a href="about.html">About us</a></li><li><a href="contact.html">Contact</a></li><li><a href="login.html">Login</a></li><li><a href="register.html">Register</a></li></ul></div>
      <div><h5>Visit us</h5><p>📍 21 Tech Avenue, Gulberg III, Lahore<br>📞 +92 300 123 4567<br>✉️ hello@voltedge.com<br>🕘 Mon–Sat, 10am – 9pm</p></div>
    </div>
    <div class="footer-bottom"><span>© <span id="yr"></span> VoltEdge Electronics. All rights reserved.</span><span>Made with ⚡ for tech lovers</span></div>
  </div></footer>`;
  document.body.insertAdjacentHTML('afterbegin', nav + drawer);
  document.body.insertAdjacentHTML('beforeend', footer);
  $('#yr').textContent = new Date().getFullYear();
}

function renderAuthArea() {
  const el = $('#authArea'); if (!el) return;
  const s = Auth.session();
  el.innerHTML = s
    ? `${s.role === 'admin' ? '<a class="btn btn-ghost btn-sm" href="admin.html">Admin</a>' : ''}
       <div class="user-chip"><div class="avatar">${esc(s.name[0].toUpperCase())}</div><span>${esc(s.name.split(' ')[0])}</span></div>
       <button class="btn btn-danger btn-sm" id="logoutBtn">Logout</button>`
    : `<a class="btn btn-ghost btn-sm" href="login.html">Login</a><a class="btn btn-primary btn-sm" href="register.html">Register</a>`;
  const lo = $('#logoutBtn'); if (lo) lo.onclick = () => Auth.logout();
}

/* ---- reveal & counters ---- */
let io;
function observeReveal() {
  if (!io) io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.reveal:not(.in)').forEach(el => io.observe(el));
}
function counters() {
  const co = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; co.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now();
    const step = t => { const k = Math.min((t - t0) / 1400, 1); el.textContent = Math.floor(end * (1 - Math.pow(1 - k, 3))).toLocaleString() + suf; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }), { threshold: .5 });
  $$('[data-count]').forEach(el => co.observe(el));
}

/* ---- global events ---- */
function bindGlobal() {
  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = products().find(x => x.id === +add.dataset.add); if (!p) return;
      Cart.add(p.id); toast('success', `${p.name} added to cart`);
      const t = add.textContent; add.textContent = 'Added ✓'; setTimeout(() => add.textContent = t, 1100);
      return;
    }
    const w = e.target.closest('[data-wish]');
    if (w) {
      const id = +w.dataset.wish; let l = LS.get('ve_wish', []);
      const on = l.includes(id); l = on ? l.filter(x => x !== id) : [...l, id]; LS.set('ve_wish', l);
      w.classList.toggle('on', !on); w.textContent = on ? '♡' : '♥';
      toast(on ? 'info' : 'success', on ? 'Removed from wishlist' : 'Saved to wishlist');
      return;
    }
    const q = e.target.closest('[data-qty]'); if (q) { const [id, d] = q.dataset.qty.split(':'); Cart.setQty(+id, +d); return; }
    const r = e.target.closest('[data-remove]'); if (r) { Cart.remove(+r.dataset.remove); return; }
    const pw = e.target.closest('[data-toggle-pw]');
    if (pw) { const i = pw.parentElement.querySelector('input'); i.type = i.type === 'password' ? 'text' : 'password'; }
  });
  const on = (id, ev, fn) => { const el = $(id); if (el) el.addEventListener(ev, fn); };
  on('#cartBtn', 'click', Cart.open); on('#closeCart', 'click', Cart.close); on('#overlay', 'click', Cart.close);
  on('#checkoutBtn', 'click', Cart.checkout);
  on('#clearCart', 'click', async () => {
    if (!Cart.count()) return;
    const r = await popup({ icon: 'warning', title: 'Clear your cart?', showCancelButton: true, confirmButtonText: 'Yes, clear it' });
    if (r.isConfirmed) { Cart.clear(); toast('info', 'Cart cleared'); }
  });
  on('#burger', 'click', () => $('#navLinks').classList.toggle('open'));
  $$('[data-theme-btn]').forEach(b => b.onclick = toggleTheme);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') Cart.close(); });
}

/* ---- page scripts ---- */
const nextUrl = () => { const n = new URLSearchParams(location.search).get('next'); return /^[a-z-]+\.html$/i.test(n || '') ? n : null; };

const pages = {
  home() {
    mountCatalog({ grid: '#grid', chips: '#chips', limit: 8, search: '#q', sort: '#sort' });
    const end = new Date(); end.setHours(23, 59, 59, 999);
    const tick = () => {
      let s = Math.max(0, Math.floor((end - new Date()) / 1000));
      const v = [Math.floor(s / 3600), Math.floor(s % 3600 / 60), s % 60].map(n => String(n).padStart(2, '0'));
      ['cdH', 'cdM', 'cdS'].forEach((id, i) => $('#' + id).textContent = v[i]);
    };
    tick(); setInterval(tick, 1000);
    $('#newsForm').addEventListener('submit', e => { e.preventDefault(); popup({ icon: 'success', title: 'You’re subscribed!', text: 'Check your inbox for a 10% welcome code.' }); e.target.reset(); });
    $('#dealBtn').addEventListener('click', () => { Cart.add(5); toast('success', 'SonicWave ANC Headphones added to cart'); Cart.open(); });
  },
  shop() {
    const p = new URLSearchParams(location.search);
    const cat = CATS.some(c => c.id === p.get('cat')) ? p.get('cat') : 'all';
    const m = mountCatalog({ grid: '#grid', chips: '#chips', cat, count: '#count', search: '#q', sort: '#sort', range: '#range', rangeLabel: '#rangeLabel' });
    if (p.get('q')) { $('#q').value = p.get('q'); m.st.q = p.get('q'); m.render(); }
  },
  categories() {
    const all = products();
    $('#bigCats').innerHTML = CATS.map(c => `<a class="big-cat reveal" style="--g1:${c.g[0]};--g2:${c.g[1]}" href="shop.html?cat=${c.id}">
      <span class="em">${c.icon}</span><h3>${c.name}</h3><span>${all.filter(p => p.cat === c.id).length} products · ${c.desc}</span></a>`).join('');
    $('#catRows').innerHTML = CATS.map(c => {
      const l = all.filter(p => p.cat === c.id).slice(0, 4); if (!l.length) return '';
      return `<section class="cat-section" id="${c.id}"><div class="cat-section-head"><h2><span class="cat-icon" style="--g1:${c.g[0]};--g2:${c.g[1]}">${c.icon}</span>${c.name}</h2>
        <a class="btn btn-ghost btn-sm" href="shop.html?cat=${c.id}">View all →</a></div><div class="products">${l.map(cardHTML).join('')}</div></section>`;
    }).join('');
    observeReveal();
  },
  contact() {
    $('#contactForm').addEventListener('submit', e => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      const m = LS.get('ve_messages', []); m.unshift({ ...f, date: new Date().toISOString() }); LS.set('ve_messages', m);
      popup({ icon: 'success', title: 'Message sent!', text: `Thanks ${f.name.split(' ')[0]}, we'll reply within 24 hours.` });
      e.target.reset();
    });
  },
  register() {
    const pw = $('#password'), bars = $$('.strength i'), lab = $('#strengthLabel');
    pw.addEventListener('input', () => {
      const v = pw.value; let sc = 0;
      if (v.length >= 6) sc++; if (v.length >= 10) sc++; if (/[A-Z]/.test(v) && /[a-z]/.test(v)) sc++; if (/\d/.test(v) && /[^\w]/.test(v)) sc++;
      const cols = ['#ef4444', '#f59e0b', '#06b6d4', '#10b981'], names = ['Weak', 'Okay', 'Good', 'Strong'];
      bars.forEach((b, i) => b.style.background = i < sc ? cols[sc - 1] : '');
      lab.textContent = v ? names[Math.max(sc - 1, 0)] : 'Use 6+ characters';
    });
    $('#regForm').addEventListener('submit', async e => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      if (f.password.length < 6) return popup({ icon: 'error', title: 'Password too short', text: 'Use at least 6 characters.' });
      if (f.password !== f.confirm) return popup({ icon: 'error', title: 'Passwords don’t match', text: 'Please re-enter your password.' });
      if (!Auth.register(f.name.trim(), f.email.trim(), f.password)) return popup({ icon: 'warning', title: 'Email already registered', text: 'Try logging in instead.' });
      await popup({ icon: 'success', title: `Welcome, ${f.name.split(' ')[0]}! 🎉`, text: 'Your account has been created.', timer: 1800, showConfirmButton: false });
      location.href = nextUrl() || 'shop.html';
    });
  },
  login() {
    $$('[data-fill]').forEach(b => b.onclick = () => { const [em, pw] = b.dataset.fill.split('|'); $('#email').value = em; $('#password').value = pw; });
    $('#loginForm').addEventListener('submit', async e => {
      e.preventDefault();
      const u = Auth.login($('#email').value.trim(), $('#password').value);
      if (!u) return popup({ icon: 'error', title: 'Login failed', text: 'Incorrect email or password.' });
      await popup({ icon: 'success', title: `Welcome back, ${u.name.split(' ')[0]}!`, timer: 1300, showConfirmButton: false });
      location.href = nextUrl() || (u.role === 'admin' ? 'admin.html' : 'index.html');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (!document.body.hasAttribute('data-bare')) { layout(); renderAuthArea(); Cart.badge(); Cart.render(); }
  bindGlobal();
  setTheme(document.documentElement.getAttribute('data-theme'));
  observeReveal(); counters();
  const pg = document.body.dataset.page; if (pages[pg]) pages[pg]();
  const c = $('#cartCount'); if (c) c.classList.toggle('show', Cart.count() > 0);
});
