(() => {
  'use strict';

  const STORAGE_KEY = 'optiview_eyewear_cart_v1';

  // Catalog Data
  const EYEWEAR_CATALOG = [
    {
      id: 'ov-lumina-round',
      name: 'Lumina Round',
      style: 'Round',
      material: 'Italian Acetate',
      colorName: 'Midnight Tortoise',
      frameHex: '#1e293b',
      price: 145,
      dimensions: '48-21-145',
      badge: 'Bestseller'
    },
    {
      id: 'ov-meridian-rect',
      name: 'Meridian Slate',
      style: 'Rectangle',
      material: 'Japanese Titanium',
      colorName: 'Brushed Gunmetal',
      frameHex: '#334155',
      price: 165,
      dimensions: '53-18-145',
      badge: 'Featherlight'
    },
    {
      id: 'ov-solstice-aviator',
      name: 'Solstice Pilot',
      style: 'Aviator',
      material: 'Stainless Steel',
      colorName: 'Champagne Gold',
      frameHex: '#b45309',
      price: 155,
      dimensions: '55-16-140',
      badge: 'New Arrival'
    },
    {
      id: 'ov-velvet-cateye',
      name: 'Vespera Cat-Eye',
      style: 'Cat-Eye',
      material: 'Bio-Acetate',
      colorName: 'Crimson Espresso',
      frameHex: '#881337',
      price: 150,
      dimensions: '51-19-142',
      badge: 'Editor Pick'
    },
    {
      id: 'ov-harbor-round',
      name: 'Harbor Keyhole',
      style: 'Round',
      material: 'Matte Acetate',
      colorName: 'Oceanic Navy',
      frameHex: '#0369a1',
      price: 135,
      dimensions: '49-20-145',
      badge: 'Classic'
    },
    {
      id: 'ov-vertex-rect',
      name: 'Vertex Architectural',
      style: 'Rectangle',
      material: 'Hand-Cured Acetate',
      colorName: 'Obsidian Black',
      frameHex: '#0f172a',
      price: 140,
      dimensions: '54-17-148',
      badge: 'Top Rated'
    },
    {
      id: 'ov-horizon-aviator',
      name: 'Horizon Double-Bridge',
      style: 'Aviator',
      material: 'Beta-Titanium',
      colorName: 'Silver Pewter',
      frameHex: '#475569',
      price: 175,
      dimensions: '56-15-145',
      badge: 'Premium'
    },
    {
      id: 'ov-aura-cateye',
      name: 'Aura Sculpted',
      style: 'Cat-Eye',
      material: 'Translucent Acetate',
      colorName: 'Emerald Amber',
      frameHex: '#065f46',
      price: 160,
      dimensions: '52-18-140',
      badge: 'Limited'
    }
  ];

  // Application State
  let cart = loadCartFromStorage();
  let currentStyleFilter = 'All';
  let currentSearchQuery = '';
  let selectedTryOnFrameId = EYEWEAR_CATALOG[0].id;
  let selectedLensTint = 'clear';

  // DOM References
  const navLinks = document.querySelectorAll('[data-nav-target]');
  const pageSections = document.querySelectorAll('.page-section');
  const catalogGrid = document.getElementById('catalogGrid');
  const catalogCount = document.getElementById('catalogCount');
  const emptyCatalogState = document.getElementById('emptyCatalogState');
  const frameSearchInput = document.getElementById('frameSearchInput');
  const styleFilterButtons = document.querySelectorAll('#styleFilterButtons .btn-filter');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');

  // Cart DOM References
  const cartBadge = document.getElementById('cartBadge');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const clearCartBtn = document.getElementById('clearCartBtn');
  const proceedToCheckoutBtn = document.getElementById('proceedToCheckoutBtn');
  const checkoutCartSummary = document.getElementById('checkoutCartSummary');
  const cartToastEl = document.getElementById('cartToast');
  const cartToastMessage = document.getElementById('cartToastMessage');

  // Try-On DOM References
  const tryOnFrameSelect = document.getElementById('tryOnFrameSelect');
  const tryOnGlassesLayer = document.getElementById('tryOnGlassesLayer');
  const tryOnStyleBadge = document.getElementById('tryOnStyleBadge');
  const tryOnFrameName = document.getElementById('tryOnFrameName');
  const tryOnFramePrice = document.getElementById('tryOnFramePrice');
  const tryOnAddToCartBtn = document.getElementById('tryOnAddToCartBtn');
  const lensTintRadios = document.querySelectorAll('input[name="lensTint"]');

  // Checkout DOM References
  const checkoutForm = document.getElementById('checkoutForm');
  const checkoutFeedback = document.getElementById('checkoutFeedback');

  // SVG Frame Generator for Product Cards
  function generateFrameSvg(style, strokeColor) {
    const lensFill = 'rgba(224, 242, 254, 0.55)';
    switch (style) {
      case 'Round':
        return `
          <svg viewBox="0 0 260 95" width="210" height="78" role="img" aria-label="${style} eyewear frame preview">
            <circle cx="78" cy="48" r="32" fill="${lensFill}" stroke="${strokeColor}" stroke-width="6.5" />
            <circle cx="182" cy="48" r="32" fill="${lensFill}" stroke="${strokeColor}" stroke-width="6.5" />
            <path d="M110 43 Q130 33 150 43" fill="none" stroke="${strokeColor}" stroke-width="6" stroke-linecap="round" />
            <path d="M46 42 L20 38" stroke="${strokeColor}" stroke-width="5" stroke-linecap="round" />
            <path d="M214 42 L240 38" stroke="${strokeColor}" stroke-width="5" stroke-linecap="round" />
          </svg>`;
      case 'Rectangle':
        return `
          <svg viewBox="0 0 260 95" width="210" height="78" role="img" aria-label="${style} eyewear frame preview">
            <rect x="40" y="22" width="74" height="48" rx="10" fill="${lensFill}" stroke="${strokeColor}" stroke-width="6.5" />
            <rect x="146" y="22" width="74" height="48" rx="10" fill="${lensFill}" stroke="${strokeColor}" stroke-width="6.5" />
            <path d="M114 38 L146 38" stroke="${strokeColor}" stroke-width="6" stroke-linecap="round" />
            <path d="M40 34 L18 32" stroke="${strokeColor}" stroke-width="5" stroke-linecap="round" />
            <path d="M220 34 L242 32" stroke="${strokeColor}" stroke-width="5" stroke-linecap="round" />
          </svg>`;
      case 'Aviator':
        return `
          <svg viewBox="0 0 260 95" width="210" height="78" role="img" aria-label="${style} eyewear frame preview">
            <path d="M42 26 Q78 22 112 30 Q114 68 80 74 Q44 72 42 26 Z" fill="${lensFill}" stroke="${strokeColor}" stroke-width="5" />
            <path d="M218 26 Q182 22 148 30 Q146 68 180 74 Q216 72 218 26 Z" fill="${lensFill}" stroke="${strokeColor}" stroke-width="5" />
            <path d="M108 26 L152 26" stroke="${strokeColor}" stroke-width="4" stroke-linecap="round" />
            <path d="M112 36 Q130 30 148 36" fill="none" stroke="${strokeColor}" stroke-width="4.5" stroke-linecap="round" />
            <path d="M42 30 L18 28" stroke="${strokeColor}" stroke-width="4.5" stroke-linecap="round" />
            <path d="M218 30 L242 28" stroke="${strokeColor}" stroke-width="4.5" stroke-linecap="round" />
          </svg>`;
      case 'Cat-Eye':
      default:
        return `
          <svg viewBox="0 0 260 95" width="210" height="78" role="img" aria-label="${style} eyewear frame preview">
            <path d="M36 24 Q78 24 112 34 Q108 70 74 70 Q42 68 36 24 Z" fill="${lensFill}" stroke="${strokeColor}" stroke-width="6.5" stroke-linejoin="round" />
            <path d="M224 24 Q182 24 148 34 Q152 70 186 70 Q218 68 224 24 Z" fill="${lensFill}" stroke="${strokeColor}" stroke-width="6.5" stroke-linejoin="round" />
            <path d="M112 38 Q130 30 148 38" fill="none" stroke="${strokeColor}" stroke-width="6" stroke-linecap="round" />
            <path d="M36 28 L16 25" stroke="${strokeColor}" stroke-width="5" stroke-linecap="round" />
            <path d="M224 28 L244 25" stroke="${strokeColor}" stroke-width="5" stroke-linecap="round" />
          </svg>`;
    }
  }

  // Navigation Handler
  function navigateToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (!targetSection) return;

    pageSections.forEach((sec) => {
      sec.classList.remove('active-section');
    });
    targetSection.classList.add('active-section');

    // Update active state on top navbar links
    document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
      const isMatch = link.getAttribute('data-nav-target') === sectionId;
      link.classList.toggle('active', isMatch);
      if (isMatch) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    // Collapse mobile navbar if expanded
    const navbarCollapse = document.getElementById('primaryNavbar');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
      bsCollapse.hide();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setupNavigation() {
    navLinks.forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        const target = trigger.getAttribute('data-nav-target');
        if (target) {
          event.preventDefault();
          navigateToSection(target);
        }
      });
    });

    proceedToCheckoutBtn.addEventListener('click', () => {
      navigateToSection('tryon-checkout');
    });
  }

  // Catalog Rendering & Filtering
  function getFilteredProducts() {
    return EYEWEAR_CATALOG.filter((item) => {
      const matchesStyle =
        currentStyleFilter === 'All' || item.style === currentStyleFilter;
      const query = currentSearchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.style.toLowerCase().includes(query) ||
        item.material.toLowerCase().includes(query) ||
        item.colorName.toLowerCase().includes(query);

      return matchesStyle && matchesQuery;
    });
  }

  function renderCatalog() {
    const filtered = getFilteredProducts();
    catalogCount.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? 'frame' : 'frames'}`;

    if (filtered.length === 0) {
      catalogGrid.innerHTML = '';
      emptyCatalogState.classList.remove('d-none');
      return;
    }

    emptyCatalogState.classList.add('d-none');
    catalogGrid.innerHTML = filtered
      .map(
        (product) => `
        <div class="col-sm-6 col-lg-3">
          <article class="card product-card h-100 rounded-4 overflow-hidden bg-white shadow-sm">
            <div class="product-visual-box">
              <span class="badge bg-white text-dark border position-absolute top-0 start-0 m-3 rounded-pill small">
                ${product.badge}
              </span>
              ${generateFrameSvg(product.style, product.frameHex)}
            </div>
            <div class="card-body d-flex flex-column p-3">
              <div class="d-flex justify-content-between align-items-start mb-1">
                <h2 class="h6 fw-bold text-primary-dark mb-0">${product.name}</h2>
                <span class="fw-bold text-accent">$${product.price}</span>
              </div>
              <p class="small text-secondary mb-2">${product.style} &bull; ${product.material}</p>
              <div class="d-flex align-items-center gap-2 small text-secondary mb-3">
                <span class="color-dot" style="background-color: ${product.frameHex};" aria-hidden="true"></span>
                <span>${product.colorName}</span>
              </div>
              <div class="mt-auto d-grid gap-2">
                <button
                  type="button"
                  class="btn btn-primary-custom btn-sm rounded-pill fw-semibold"
                  data-add-cart="${product.id}"
                  aria-label="Add ${product.name} to shopping cart"
                >
                  <i class="bi bi-bag-plus me-1" aria-hidden="true"></i> Add to Cart
                </button>
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-sm rounded-pill fw-semibold"
                  data-try-on="${product.id}"
                  aria-label="Try on ${product.name} virtually"
                >
                  <i class="bi bi-camera me-1" aria-hidden="true"></i> Virtual Try-On
                </button>
              </div>
            </div>
          </article>
        </div>`
      )
      .join('');
  }

  function setupCatalogControls() {
    frameSearchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderCatalog();
    });

    styleFilterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        styleFilterButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        currentStyleFilter = btn.getAttribute('data-style');
        renderCatalog();
      });
    });

    resetFiltersBtn.addEventListener('click', () => {
      currentSearchQuery = '';
      currentStyleFilter = 'All';
      frameSearchInput.value = '';
      styleFilterButtons.forEach((b) => {
        const isAll = b.getAttribute('data-style') === 'All';
        b.classList.toggle('active', isAll);
        b.setAttribute('aria-pressed', String(isAll));
      });
      renderCatalog();
    });

    catalogGrid.addEventListener('click', (e) => {
      const addBtn = e.target.closest('[data-add-cart]');
      if (addBtn) {
        const productId = addBtn.getAttribute('data-add-cart');
        addToCart(productId);
        return;
      }

      const tryBtn = e.target.closest('[data-try-on]');
      if (tryBtn) {
        const productId = tryBtn.getAttribute('data-try-on');
        selectTryOnFrame(productId);
        navigateToSection('tryon-checkout');
      }
    });
  }

  // Shopping Cart with localStorage Persistence
  function loadCartFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveCartToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors in restricted modes
    }
  }

  function showToast(message) {
    if (!cartToastEl || !cartToastMessage) return;
    cartToastMessage.textContent = message;
    const toast = bootstrap.Toast.getOrCreateInstance(cartToastEl, { delay: 2400 });
    toast.show();
  }

  function addToCart(productId) {
    const product = EYEWEAR_CATALOG.find((item) => item.id === productId);
    if (!product) return;

    const existing = cart.find((entry) => entry.id === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        style: product.style,
        colorName: product.colorName,
        price: product.price,
        quantity: 1
      });
    }

    saveCartToStorage();
    renderCart();
    showToast(`${product.name} added to your eyewear bag.`);
  }

  function updateCartQuantity(productId, delta) {
    const index = cart.findIndex((entry) => entry.id === productId);
    if (index === -1) return;

    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }

    saveCartToStorage();
    renderCart();
  }

  function removeCartItem(productId) {
    cart = cart.filter((entry) => entry.id !== productId);
    saveCartToStorage();
    renderCart();
  }

  function clearCart() {
    cart = [];
    saveCartToStorage();
    renderCart();
  }

  function getCartTotals() {
    return cart.reduce(
      (acc, item) => {
        acc.totalItems += item.quantity;
        acc.subtotal += item.price * item.quantity;
        return acc;
      },
      { totalItems: 0, subtotal: 0 }
    );
  }

  function renderCart() {
    const { totalItems, subtotal } = getCartTotals();

    cartBadge.textContent = String(totalItems);
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    checkoutCartSummary.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'} ($${subtotal.toFixed(2)})`;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-bag-x display-4 text-secondary d-block mb-3" aria-hidden="true"></i>
          <h3 class="h6 fw-bold text-primary-dark">Your bag is currently empty</h3>
          <p class="small text-secondary mb-3">Browse our catalog to add frames before checkout.</p>
          <button
            type="button"
            class="btn btn-sm btn-primary-custom rounded-pill px-4"
            data-bs-dismiss="offcanvas"
            id="emptyCartBrowseBtn"
          >
            Browse Catalog
          </button>
        </div>`;

      const browseBtn = document.getElementById('emptyCartBrowseBtn');
      if (browseBtn) {
        browseBtn.addEventListener('click', () => navigateToSection('catalog'));
      }
      clearCartBtn.disabled = true;
      return;
    }

    clearCartBtn.disabled = false;
    cartItemsContainer.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item-card rounded-3 p-3 mb-3">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h3 class="h6 fw-bold text-primary-dark mb-0">${item.name}</h3>
              <span class="small text-secondary">${item.style} &bull; ${item.colorName}</span>
            </div>
            <button
              type="button"
              class="btn btn-sm text-danger p-0 border-0"
              data-remove-item="${item.id}"
              aria-label="Remove ${item.name} from cart"
            >
              <i class="bi bi-trash" aria-hidden="true"></i>
            </button>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <div class="btn-group btn-group-sm" role="group" aria-label="Quantity controls for ${item.name}">
              <button
                type="button"
                class="btn btn-outline-secondary"
                data-qty-delta="-1"
                data-item-id="${item.id}"
                aria-label="Decrease quantity of ${item.name}"
              >&minus;</button>
              <span class="btn btn-light disabled text-dark fw-semibold px-3">${item.quantity}</span>
              <button
                type="button"
                class="btn btn-outline-secondary"
                data-qty-delta="1"
                data-item-id="${item.id}"
                aria-label="Increase quantity of ${item.name}"
              >&plus;</button>
            </div>
            <span class="fw-bold text-primary-dark">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        </div>`
      )
      .join('');
  }

  function setupCartControls() {
    cartItemsContainer.addEventListener('click', (e) => {
      const qtyBtn = e.target.closest('[data-qty-delta]');
      if (qtyBtn) {
        const id = qtyBtn.getAttribute('data-item-id');
        const delta = Number(qtyBtn.getAttribute('data-qty-delta'));
        updateCartQuantity(id, delta);
        return;
      }

      const removeBtn = e.target.closest('[data-remove-item]');
      if (removeBtn) {
        const id = removeBtn.getAttribute('data-remove-item');
        removeCartItem(id);
      }
    });

    clearCartBtn.addEventListener('click', () => {
      clearCart();
      showToast('Shopping bag cleared.');
    });
  }

  // Virtual Try-On Interactive Preview
  function populateTryOnSelect() {
    tryOnFrameSelect.innerHTML = EYEWEAR_CATALOG.map(
      (item) =>
        `<option value="${item.id}">${item.name} — ${item.style} ($${item.price})</option>`
    ).join('');
  }

  function selectTryOnFrame(productId) {
    selectedTryOnFrameId = productId;
    if (tryOnFrameSelect) {
      tryOnFrameSelect.value = productId;
    }
    renderVirtualTryOn();
  }

  function getTintFill() {
    switch (selectedLensTint) {
      case 'blue':
        return 'rgba(56, 189, 248, 0.25)';
      case 'sun':
        return 'rgba(15, 23, 42, 0.58)';
      case 'clear':
      default:
        return 'rgba(255, 255, 255, 0.16)';
    }
  }

  function renderVirtualTryOn() {
    const product =
      EYEWEAR_CATALOG.find((item) => item.id === selectedTryOnFrameId) || EYEWEAR_CATALOG[0];
    const stroke = product.frameHex;
    const fill = getTintFill();

    tryOnStyleBadge.textContent = product.style;
    tryOnFrameName.textContent = `${product.name} (${product.colorName})`;
    tryOnFramePrice.textContent = `$${product.price.toFixed(2)}`;

    let glassesMarkup = '';
    if (product.style === 'Round') {
      glassesMarkup = `
        <circle cx="128" cy="130" r="24" fill="${fill}" stroke="${stroke}" stroke-width="5" />
        <circle cx="192" cy="130" r="24" fill="${fill}" stroke="${stroke}" stroke-width="5" />
        <path d="M152 127 Q160 120 168 127" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round" />
        <path d="M104 126 L93 122" stroke="${stroke}" stroke-width="4" stroke-linecap="round" />
        <path d="M216 126 L227 122" stroke="${stroke}" stroke-width="4" stroke-linecap="round" />`;
    } else if (product.style === 'Rectangle') {
      glassesMarkup = `
        <rect x="102" y="114" width="50" height="32" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="5" />
        <rect x="168" y="114" width="50" height="32" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="5" />
        <path d="M152 125 L168 125" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round" />
        <path d="M102 122 L93 120" stroke="${stroke}" stroke-width="4" stroke-linecap="round" />
        <path d="M218 122 L227 120" stroke="${stroke}" stroke-width="4" stroke-linecap="round" />`;
    } else if (product.style === 'Aviator') {
      glassesMarkup = `
        <path d="M102 115 Q128 112 151 118 Q152 145 129 149 Q104 147 102 115 Z" fill="${fill}" stroke="${stroke}" stroke-width="4" />
        <path d="M218 115 Q192 112 169 118 Q168 145 191 149 Q216 147 218 115 Z" fill="${fill}" stroke="${stroke}" stroke-width="4" />
        <path d="M148 115 L172 115" stroke="${stroke}" stroke-width="3.5" stroke-linecap="round" />
        <path d="M151 123 Q160 119 169 123" fill="none" stroke="${stroke}" stroke-width="4" stroke-linecap="round" />`;
    } else {
      glassesMarkup = `
        <path d="M98 113 Q128 113 151 121 Q148 147 125 147 Q103 145 98 113 Z" fill="${fill}" stroke="${stroke}" stroke-width="5" />
        <path d="M222 113 Q192 113 169 121 Q172 147 195 147 Q217 145 222 113 Z" fill="${fill}" stroke="${stroke}" stroke-width="5" />
        <path d="M151 124 Q160 119 169 124" fill="none" stroke="${stroke}" stroke-width="4.5" stroke-linecap="round" />`;
    }

    tryOnGlassesLayer.innerHTML = glassesMarkup;
  }

  function setupVirtualTryOn() {
    populateTryOnSelect();
    renderVirtualTryOn();

    tryOnFrameSelect.addEventListener('change', (e) => {
      selectedTryOnFrameId = e.target.value;
      renderVirtualTryOn();
    });

    lensTintRadios.forEach((radio) => {
      radio.addEventListener('change', (e) => {
        if (e.target.checked) {
          selectedLensTint = e.target.value;
          renderVirtualTryOn();
        }
      });
    });

    tryOnAddToCartBtn.addEventListener('click', () => {
      addToCart(selectedTryOnFrameId);
    });
  }

  // Prescription & Order Checkout Validation
  function isQuarterDiopterStep(value) {
    const num = Number(value);
    if (Number.isNaN(num)) return false;
    return Math.abs(Math.round(num * 4) - num * 4) < 1e-6;
  }

  function showCheckoutAlert(type, title, message) {
    checkoutFeedback.className = `alert alert-${type} rounded-3 mb-4`;
    checkoutFeedback.innerHTML = `
      <div class="fw-bold mb-1">${title}</div>
      <div class="small">${message}</div>
    `;
    checkoutFeedback.classList.remove('d-none');
    checkoutFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function setupCheckoutValidation() {
    const odInput = document.getElementById('odSphere');
    const osInput = document.getElementById('osSphere');

    [odInput, osInput].forEach((input) => {
      input.addEventListener('input', () => {
        if (input.value !== '' && !isQuarterDiopterStep(input.value)) {
          input.setCustomValidity('Sphere values must be in 0.25 diopter increments.');
        } else {
          input.setCustomValidity('');
        }
      });
    });

    checkoutForm.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (odInput.value !== '' && !isQuarterDiopterStep(odInput.value)) {
        odInput.setCustomValidity('Sphere values must be in 0.25 diopter increments.');
      } else {
        odInput.setCustomValidity('');
      }

      if (osInput.value !== '' && !isQuarterDiopterStep(osInput.value)) {
        osInput.setCustomValidity('Sphere values must be in 0.25 diopter increments.');
      } else {
        osInput.setCustomValidity('');
      }

      const isFormValid = checkoutForm.checkValidity();
      checkoutForm.classList.add('was-validated');

      if (!isFormValid) {
        showCheckoutAlert(
          'danger',
          'Please check the highlighted fields',
          'Ensure all required shipping details and valid prescription measurements (0.25 diopter steps) are completed.'
        );
        const firstInvalid = checkoutForm.querySelector(':invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const { totalItems, subtotal } = getCartTotals();
      if (totalItems === 0) {
        showCheckoutAlert(
          'warning',
          'Your eyewear bag is empty',
          'Please add at least one frame from the Eyewear Catalog or Virtual Try-On studio before submitting your prescription order.'
        );
        return;
      }

      const customerName = document.getElementById('customerName').value.trim();
      const customerEmail = document.getElementById('customerEmail').value.trim();
      const rxType = document.getElementById('rxType').value;
      const orderNumber = `OV-${Math.floor(100000 + Math.random() * 900000)}`;

      showCheckoutAlert(
        'success',
        `Order Confirmed! Reference #${orderNumber}`,
        `Thank you, ${customerName}. Your order for ${totalItems} ${totalItems === 1 ? 'frame' : 'frames'} ($${subtotal.toFixed(
          2
        )}) with ${rxType} lenses is now in optical lab verification. Confirmation sent to ${customerEmail}.`
      );

      clearCart();
      checkoutForm.reset();
      checkoutForm.classList.remove('was-validated');
    });
  }

  // Initialize Application
  document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    renderCatalog();
    setupCatalogControls();
    renderCart();
    setupCartControls();
    setupVirtualTryOn();
    setupCheckoutValidation();
  });
})();