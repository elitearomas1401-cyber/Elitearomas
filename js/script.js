/* ===========================
   CART STATE
=========================== */
let cart = [];

/* ===========================
   RENDER PRODUCTS
=========================== */
function renderProducts(filter = 'all') {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  grid.innerHTML = '';

  // NUEVO: Leer de localStorage si existe, si no usar MENU de data.js
  const storedProducts = localStorage.getItem('elite_products');
  const currentProducts = storedProducts ? JSON.parse(storedProducts) : MENU;

  const items = filter === 'all' ? currentProducts : currentProducts.filter(p => p.cat === filter);

  items.forEach((product, i) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String((i % 4) * 80));

    const priceDisplay = `<span class="card-price">RD$ ${product.price.toLocaleString()}</span>`;

    card.innerHTML = `
      <div class="card-img-wrap">
        <div class="card-img-gradient" style="background:${GRADIENTS[product.id] || 'linear-gradient(135deg,#222,#000)'}"></div>
        ${product.image ? `<img src="${product.image}" alt="${product.name}" id="img-${product.id}">` : `<div class="card-img-emoji">${product.emoji}</div>`}
        ${product.badge ? `<span class="card-badge">${product.badge}</span>` : ''}
      </div>
      <div class="card-body">
        <div class="card-name">${product.name}</div>
        <div class="card-desc">${product.desc}</div>
        <div class="card-footer">
          ${priceDisplay}
          <button class="add-btn" id="btn-${product.id}" onclick="addToCart('${product.id}')" title="Agregar al carrito">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  AOS.refresh();
}

/* ===========================
   ADD TO CART
=========================== */
function addToCart(id) {
  // NUEVO: Buscar en la fuente de datos actual
  const storedProducts = localStorage.getItem('elite_products');
  const currentProducts = storedProducts ? JSON.parse(storedProducts) : MENU;
  const product = currentProducts.find(p => String(p.id) === String(id));

  if (!product) return;

  let name = product.name;
  let price = product.price;

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: Date.now(), name, price, qty: 1, emoji: product.emoji });
  }

  const btn = document.getElementById(`btn-${id}`);
  if (btn) {
    btn.classList.add('added');
    setTimeout(() => btn.classList.remove('added'), 400);
  }

  const badge = document.getElementById('cart-count');
  badge.classList.add('bump');
  setTimeout(() => badge.classList.remove('bump'), 450);

  showToast(`${product.emoji} ${product.name} agregado`);
  renderCart();
}

/* ===========================
   TOAST
=========================== */
let toastTimer;
function showToast(msg, bg = '#D4AF37') {
  const toast = document.getElementById('add-toast');
  const text  = document.getElementById('toast-text');
  toast.style.background = bg;
  toast.style.color = '#000';
  text.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ===========================
   RENDER CART
=========================== */
function renderCart() {
  const container = document.getElementById('cart-items');
  const summary   = document.getElementById('cart-summary');
  const badge     = document.getElementById('cart-count');
  const waBtn     = document.getElementById('wa-btn');

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  badge.textContent = totalItems;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-bag-shopping"></i>
        <p>Tu carrito está vacío.<br>¡Descubre tu esencia!</p>
      </div>`;
    summary.innerHTML = '';
    waBtn.disabled = true;
    return;
  }

  waBtn.disabled = false;
  container.innerHTML = '';

  cart.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.id = `ci-${item.id}`;
    el.innerHTML = `
      <div class="ci-emoji">${item.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-detail">RD$ ${item.price.toLocaleString()} c/u</div>
      </div>
      <div class="ci-qty-wrap">
        <button class="qty-btn minus" onclick="changeQty(${item.id}, -1)"><i class="fa-solid fa-minus"></i></button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)"><i class="fa-solid fa-plus"></i></button>
      </div>
      <div class="ci-price">RD$ ${(item.price * item.qty).toLocaleString()}</div>
    `;
    container.appendChild(el);
  });

  summary.innerHTML = `
    <div class="summary-row">
      <span>Subtotal (${totalItems} items)</span>
      <span>RD$ ${totalPrice.toLocaleString()}</span>
    </div>
    <div class="summary-row total">
      <span>TOTAL</span>
      <span class="total-val">RD$ ${totalPrice.toLocaleString()}</span>
    </div>
  `;
}

/* ===========================
   QUANTITY CHANGE / REMOVE
=========================== */
function changeQty(id, delta) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx < 0) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) {
    const el = document.getElementById(`ci-${id}`);
    if (el) {
      el.classList.add('removing');
      setTimeout(() => {
        cart.splice(idx, 1);
        renderCart();
      }, 280);
    } else {
      cart.splice(idx, 1);
      renderCart();
    }
    return;
  }
  renderCart();
}

/* ===========================
   CLEAR CART
=========================== */
function clearCart() {
  if (cart.length === 0) return;
  if (!confirm('¿Vaciar el carrito?')) return;
  cart = [];
  renderCart();
}

/* ===========================
   WHATSAPP SEND
=========================== */
function sendWhatsApp() {
  if (cart.length === 0) return;

  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  let msg = "✨ *PEDIDO - ELITE AROMAS* ✨\n\n";

  cart.forEach(item => {
    msg += `✅ *${item.qty}x ${item.name}*\n`;
    msg += `   RD$ ${(item.price * item.qty).toLocaleString()}\n\n`;
  });

  msg += "==========================\n";
  msg += `💰 *TOTAL: RD$ ${totalPrice.toLocaleString()}*\n`;
  msg += "==========================\n\n";
  msg += "¡Hola! Me gustaría adquirir estas fragancias. 😊";

  const encoded = encodeURIComponent(msg);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=18295095974&text=${encoded}`;

  const win = window.open(whatsappUrl, '_blank');
  if (!win) {
    location.href = whatsappUrl;
  }
}

/* ===========================
   UI TOGGLES & LISTENERS
=========================== */
function toggleCart() {
  const panel   = document.getElementById('cart-panel');
  const overlay = document.getElementById('cart-overlay');
  const isOpen  = panel.classList.contains('open');
  panel.classList.toggle('open', !isOpen);
  overlay.classList.toggle('open', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ===========================
   INIT
=========================== */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hide');

    AOS.init({ once: true, duration: 600, offset: 60 });

    // Global filter listeners
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        renderProducts(tab.dataset.cat);
      });
    });

    renderProducts();
    renderCart();
  }, 1600);
});
