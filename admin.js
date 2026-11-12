/* ============ VoltEdge — admin panel ============ */
(function () {
  const s = Auth.session();
  if (!s || s.role !== 'admin') {
    document.body.style.visibility = 'hidden';
    popup({ icon: 'error', title: 'Admins only', text: 'Please log in with an admin account.', confirmButtonText: 'Go to login', allowOutsideClick: false })
      .then(() => location.href = 'login.html?next=admin.html');
    return;
  }

  setTheme(document.documentElement.getAttribute('data-theme'));
  $('#adminName').textContent = s.name.split(' ')[0];
  $('#adminAvatar').textContent = s.name[0].toUpperCase();
  $('#welcome').textContent = `Welcome back, ${s.name.split(' ')[0]} 👋`;
  $('#adminLogout').onclick = () => Auth.logout();
  $$('[data-theme-btn]').forEach(b => b.onclick = toggleTheme);

  const fmtDate = d => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  const titles = { dashboard: 'Dashboard', products: 'Products', orders: 'Orders', users: 'Customers', messages: 'Messages' };

  /* ---- tabs ---- */
  function go(tab) {
    $$('.tab').forEach(t => t.classList.toggle('active', t.id === 'tab-' + tab));
    $$('.side-link').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    $('#pageTitle').textContent = titles[tab];
    history.replaceState(null, '', '#' + tab);
    if (tab === 'dashboard') drawCharts();
  }
  $$('.side-link').forEach(b => b.onclick = () => go(b.dataset.tab));
  $$('[data-goto]').forEach(b => b.onclick = () => go(b.dataset.goto));

  /* ---- dashboard ---- */
  function kpis() {
    const o = orders(), live = o.filter(x => x.status !== 'Cancelled');
    const rev = live.reduce((a, b) => a + b.total, 0);
    const low = products().filter(p => p.stock < 10).length;
    const cards = [
      ['💰', money(rev), 'Total revenue', '+12.4%', ['#10b981', '#06b6d4']],
      ['🧾', o.length, 'Orders', '+8.1%', ['#6366f1', '#8b5cf6']],
      ['👥', users().filter(u => u.role !== 'admin').length, 'Customers', '+5.7%', ['#ec4899', '#8b5cf6']],
      ['⚠️', low, 'Low-stock items', low ? 'Restock' : 'All good', ['#f59e0b', '#ef4444']]
    ];
    $('#kpis').innerHTML = cards.map(([i, v, l, t, g]) => `<div class="card kpi"><div class="k-icon" style="--g1:${g[0]};--g2:${g[1]}">${i}</div><strong>${v}</strong><span>${l}</span><span class="trend">${t}</span></div>`).join('');
    $('#recentOrders').innerHTML = o.slice(0, 6).map(x => `<tr><td><b>${esc(x.id)}</b></td><td>${esc(x.customer)}</td><td>${fmtDate(x.date)}</td><td>${money(x.total)}</td><td><span class="pill ${x.status}">${x.status}</span></td></tr>`).join('');
  }

  let rev, cat;
  function drawCharts() {
    if (typeof Chart === 'undefined') return;
    const css = getComputedStyle(document.documentElement);
    const text = css.getPropertyValue('--muted').trim(), grid = css.getPropertyValue('--border').trim();
    Chart.defaults.color = text; Chart.defaults.font.family = 'Plus Jakarta Sans, sans-serif';
    const months = [], now = new Date();
    for (let i = 5; i >= 0; i--) { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); months.push({ k: d.getFullYear() + '-' + d.getMonth(), l: d.toLocaleString(undefined, { month: 'short' }) }); }
    const o = orders().filter(x => x.status !== 'Cancelled');
    const data = months.map(m => o.filter(x => { const d = new Date(x.date); return d.getFullYear() + '-' + d.getMonth() === m.k; }).reduce((a, b) => a + b.total, 0));
    rev && rev.destroy(); cat && cat.destroy();
    const ctx = $('#revChart').getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 280); g.addColorStop(0, 'rgba(99,102,241,.45)'); g.addColorStop(1, 'rgba(99,102,241,0)');
    rev = new Chart(ctx, { type: 'line', data: { labels: months.map(m => m.l), datasets: [{ data, fill: true, backgroundColor: g, borderColor: '#6366f1', borderWidth: 3, tension: .4, pointRadius: 5, pointBackgroundColor: '#8b5cf6' }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { color: grid }, ticks: { callback: v => '$' + v } } } } });
    const units = CATS.map(c => o.reduce((a, x) => a + x.items.reduce((n, i) => { const p = products().find(p => p.id === i.id); return n + (p && p.cat === c.id ? i.qty : 0); }, 0), 0));
    cat = new Chart($('#catChart'), { type: 'doughnut', data: { labels: CATS.map(c => c.name), datasets: [{ data: units, backgroundColor: ['#6366f1', '#0ea5e9', '#ec4899', '#10b981', '#f59e0b', '#ef4444'], borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '66%', plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, usePointStyle: true } } } } });
  }
  document.addEventListener('themechange', () => { if ($('#tab-dashboard').classList.contains('active')) drawCharts(); });

  /* ---- products ---- */
  function renderProducts() {
    const q = $('#prodSearch').value.toLowerCase();
    const l = products().filter(p => p.name.toLowerCase().includes(q));
    $('#prodBody').innerHTML = l.length ? l.map(p => `<tr>
      <td><div class="t-prod"><div class="t-thumb" style="${gradOf(p)}">${p.icon}</div>${esc(p.name)}</div></td>
      <td>${esc(catOf(p.cat).name)}</td><td><b>${money(p.price)}</b></td>
      <td><span class="pill ${p.stock < 10 ? 'bad' : p.stock < 25 ? 'warn' : 'ok'}">${p.stock} in stock</span></td>
      <td><span class="rating">★</span> ${p.rating}</td>
      <td><div class="actions"><button class="btn btn-ghost btn-sm" data-edit="${p.id}">Edit</button><button class="btn btn-danger btn-sm" data-del="${p.id}">Delete</button></div></td></tr>`).join('')
      : '<tr><td colspan="6"><div class="empty">No products found.</div></td></tr>';
  }
  $('#prodSearch').oninput = renderProducts;

  const prodForm = (p = {}) => `<div class="swal-form">
    <label>Name</label><input id="f-name" class="swal2-input" value="${esc(p.name || '')}" placeholder="Product name">
    <label>Category</label><select id="f-cat" class="swal2-select">${CATS.map(c => `<option value="${c.id}" ${p.cat === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}</select>
    <label>Price ($)</label><input id="f-price" type="number" min="1" step="0.01" class="swal2-input" value="${p.price || ''}" placeholder="199">
    <label>Stock</label><input id="f-stock" type="number" min="0" class="swal2-input" value="${p.stock ?? ''}" placeholder="25">
    <label>Emoji icon</label><input id="f-icon" class="swal2-input" value="${esc(p.icon || '📦')}" maxlength="4">
    <label>Short description</label><input id="f-desc" class="swal2-input" value="${esc(p.desc || '')}" placeholder="One line description"></div>`;
  async function openForm(p) {
    const r = await popup({
      title: p ? 'Edit product' : 'Add product', html: prodForm(p || {}), showCancelButton: true, confirmButtonText: p ? 'Save changes' : 'Add product', focusConfirm: false,
      preConfirm: () => {
        const v = { name: $('#f-name').value.trim(), cat: $('#f-cat').value, price: +$('#f-price').value, stock: +$('#f-stock').value, icon: $('#f-icon').value.trim() || '📦', desc: $('#f-desc').value.trim() };
        if (!v.name || !(v.price > 0) || isNaN(v.stock)) { Swal.showValidationMessage('Please enter a name, a valid price and stock.'); return false; }
        return v;
      }
    });
    if (!r.isConfirmed) return;
    const all = products();
    if (p) Object.assign(all.find(x => x.id === p.id), r.value);
    else all.push({ id: Math.max(0, ...all.map(x => x.id)) + 1, rating: 4.5, reviews: 0, badge: 'New', ...r.value });
    LS.set('ve_products', all); renderProducts(); kpis();
    toast('success', p ? 'Product updated' : 'Product added');
  }
  $('#addProduct').onclick = () => openForm();
  $('#prodBody').onclick = async e => {
    const ed = e.target.closest('[data-edit]'), del = e.target.closest('[data-del]');
    if (ed) openForm(products().find(p => p.id === +ed.dataset.edit));
    if (del) {
      const p = products().find(x => x.id === +del.dataset.del);
      const r = await popup({ icon: 'warning', title: 'Delete product?', text: `"${p.name}" will be removed from the store.`, showCancelButton: true, confirmButtonText: 'Yes, delete', confirmButtonColor: '#ef4444' });
      if (r.isConfirmed) { LS.set('ve_products', products().filter(x => x.id !== p.id)); renderProducts(); kpis(); toast('success', 'Product deleted'); }
    }
  };

  /* ---- orders ---- */
  const itemsLabel = it => it.map(i => { const p = products().find(x => x.id === i.id); return `${p ? esc(p.name) : 'Removed item'} ×${i.qty}`; }).join(', ');
  function renderOrders() {
    const f = $('#orderFilter').value;
    const l = orders().filter(o => f === 'all' || o.status === f);
    $('#orderBody').innerHTML = l.length ? l.map(o => `<tr><td><b>${esc(o.id)}</b></td><td>${esc(o.customer)}</td>
      <td style="max-width:260px;color:var(--muted)">${itemsLabel(o.items)}</td><td>${fmtDate(o.date)}</td><td><b>${money(o.total)}</b></td>
      <td><select class="select" data-status="${esc(o.id)}" style="padding:6px 10px">${['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => `<option ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}</select></td></tr>`).join('')
      : '<tr><td colspan="6"><div class="empty">No orders in this status.</div></td></tr>';
  }
  $('#orderFilter').onchange = renderOrders;
  $('#orderBody').onchange = e => {
    const sel = e.target.closest('[data-status]'); if (!sel) return;
    const all = orders(); all.find(o => o.id === sel.dataset.status).status = sel.value;
    LS.set('ve_orders', all); kpis(); toast('success', `Order ${sel.dataset.status} → ${sel.value}`);
  };
  $('#exportOrders').onclick = () => {
    const rows = [['Order', 'Customer', 'Date', 'Total', 'Status'], ...orders().map(o => [o.id, o.customer, o.date.slice(0, 10), o.total, o.status])];
    const blob = new Blob([rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'orders.csv'; a.click();
    toast('success', 'Orders exported');
  };

  /* ---- users ---- */
  function renderUsers() {
    $('#userBody').innerHTML = users().map(u => `<tr>
      <td><div class="t-prod"><div class="avatar">${esc(u.name[0].toUpperCase())}</div>${esc(u.name)}</div></td>
      <td>${esc(u.email)}</td><td><span class="pill ${u.role === 'admin' ? 'Processing' : 'ok'}">${u.role}</span></td><td>${fmtDate(u.joined)}</td>
      <td>${u.role === 'admin' ? '<span class="muted">—</span>' : `<button class="btn btn-danger btn-sm" data-rm="${esc(u.email)}">Remove</button>`}</td></tr>`).join('');
  }
  $('#userBody').onclick = async e => {
    const b = e.target.closest('[data-rm]'); if (!b) return;
    const r = await popup({ icon: 'warning', title: 'Remove this user?', text: b.dataset.rm, showCancelButton: true, confirmButtonText: 'Remove', confirmButtonColor: '#ef4444' });
    if (r.isConfirmed) { LS.set('ve_users', users().filter(u => u.email !== b.dataset.rm)); renderUsers(); kpis(); toast('success', 'User removed'); }
  };

  /* ---- messages ---- */
  function renderMessages() {
    const m = LS.get('ve_messages', []);
    $('#msgList').innerHTML = m.length ? m.map((x, i) => `<div class="card msg"><div class="msg-top"><div><b>${esc(x.name)}</b> <span class="muted">· ${esc(x.email)}</span></div>
      <div style="display:flex;gap:10px;align-items:center"><span class="pill Processing">${esc(x.subject)}</span><span class="muted" style="font-size:.82rem">${fmtDate(x.date)}</span>
      <button class="btn btn-danger btn-sm" data-msg="${i}">Delete</button></div></div><p>${esc(x.message)}</p></div>`).join('')
      : '<div class="card empty"><div class="big">📭</div><b>No messages yet</b><p>Messages sent from the contact page appear here.</p></div>';
  }
  $('#msgList').onclick = e => {
    const b = e.target.closest('[data-msg]'); if (!b) return;
    const m = LS.get('ve_messages', []); m.splice(+b.dataset.msg, 1); LS.set('ve_messages', m); renderMessages(); toast('success', 'Message deleted');
  };

  /* ---- boot ---- */
  kpis(); renderProducts(); renderOrders(); renderUsers(); renderMessages();
  const start = location.hash.slice(1);
  go(titles[start] ? start : 'dashboard');
})();
