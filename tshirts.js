// tshirts.js

document.addEventListener('DOMContentLoaded', () => {
  // ——— Config & State ———
  const PER_PAGE = 10;
  let allProducts = [];
  let filtered = [];
  let page = 1;

  // ——— DOM References ———
  const container    = document.getElementById('cloth-container');
  const loader       = document.getElementById('loader');
  const sentinel     = document.getElementById('scroll-sentinel');
  const priceInputs  = Array.from(document.querySelectorAll('input[name="price"]'));
  const genderInputs = Array.from(document.querySelectorAll('input[name="gender"]'));
  const sortSelect   = document.getElementById('sortSelect');
  const searchBox    = document.getElementById('searchBox');
  const mobileBtns   = document.querySelectorAll('.mobile-filter-bar button');
  const popupWrapper = document.getElementById('popupContainer');
  const popupInner   = document.getElementById('popupContent');

  // ——— Search Redirect ———
  searchBox?.addEventListener('focus', () => {
    window.location.href = 'search.html';
  });

  // ——— Desktop Filters ———
  priceInputs.forEach(r => r.addEventListener('change', applyFilters));
  genderInputs.forEach(r => r.addEventListener('change', applyFilters));
  sortSelect?.addEventListener('change', applyFilters);

  // ——— Mobile Bottom Bar ———
  mobileBtns.forEach(btn =>
    btn.addEventListener('click', () => openPopup(btn.dataset.toggle))
  );

  // ——— Mobile Pop-up Delegated Change ———
  popupInner.addEventListener('change', e => {
    const t = e.target;
    // Price or Gender radio
    if (t.tagName === 'INPUT' && t.type === 'radio') {
      const group = Array.from(
        popupInner.querySelectorAll(`input[name="${t.name}"]`)
      );
      const idx = group.indexOf(t);
      Array.from(document.getElementsByName(t.name))
        .forEach((orig, i) => orig.checked = (i === idx));
      popupWrapper.classList.remove('active');
      applyFilters();
    }
    // Sort dropdown
    if (t.tagName === 'SELECT') {
      sortSelect.value = t.value;
      popupWrapper.classList.remove('active');
      applyFilters();
    }
  });

  // ——— Fetch & Initialize ———
  fetch('data/product.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      // Only t-shirts
      allProducts = data.filter(p => {
        const sub = (p.sub_category || '').toLowerCase();
        return sub.includes('t-shirt');
      });

      if (!allProducts.length) {
        container.innerHTML =
          '<p class="no-items">No T-shirts found. Try another category.</p>';
        return;
      }

      applyFilters();
      observer.observe(sentinel);
    })
    .catch(err => {
      console.error(err);
      container.innerHTML =
        '<p class="no-items">Failed to load products.</p>';
    });

  // ——— Core: Filter → Sort → Render Page 1 ———
  function applyFilters() {
    const { min, max } = priceInputs.find(i => i.checked).dataset;
    const genderVal    = genderInputs.find(i => i.checked).value.toLowerCase();

    filtered = allProducts.filter(p => {
      const inPrice  = p.price >= +min && p.price <= +max;
      const inGender = genderVal === 'all'
        ? true
        : p.gender?.toLowerCase() === genderVal;
      return inPrice && inGender;
    });

    // ——— Out of Stock Handling ———
    if (filtered.length === 0) {
      container.innerHTML =
        '<p class="no-items">Out of Stock — no items match your filters.</p>';
      loader.classList.add('hidden');
      observer.disconnect();
      return;
    }

    applySort();

    page = 1;
    container.innerHTML = filtered
      .slice(0, PER_PAGE)
      .map(renderCard)
      .join('');

    if (filtered.length <= PER_PAGE) {
      loader.classList.add('hidden');
      observer.disconnect();
    }
  }

  // ——— Sort Helper ———
  function applySort() {
    const [key, order] = (sortSelect.value || 'default').split('-');
    if (key === 'price') {
      filtered.sort((a, b) =>
        order === 'asc' ? a.price - b.price : b.price - a.price
      );
    } else if (key === 'name') {
      filtered.sort((a, b) =>
        order === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    }
  }

  // ——— Infinite Scroll Loader ———
  function loadMore() {
    const start = page * PER_PAGE;
    if (start >= filtered.length) {
      observer.disconnect();
      return;
    }
    loader.classList.remove('hidden');
    setTimeout(() => {
      filtered
        .slice(start, start + PER_PAGE)
        .forEach(p =>
          container.insertAdjacentHTML('beforeend', renderCard(p))
        );
      page++;
      loader.classList.add('hidden');
    }, 200);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting && loadMore());
  }, { rootMargin: '200px' });

  // ——— Render Product Card ———
  function renderCard(p) {
    const imgFile = Array.isArray(p.image) ? p.image[0].trim() : '';
    const imgUrl  = imgFile.startsWith('http') ? imgFile : imgFile;
    return `
      <div class="product-card">
        <img
          src="${imgUrl}"
          alt="${p.name}"
          loading="lazy"
          onerror="this.src='https://via.placeholder.com/400?text=No+Image';"
        />
        <div class="product-info">
          <h3>${p.name}</h3>
          <p class="price">₹${p.price.toLocaleString()}</p>
        </div>
      </div>`;
  }

  // ——— Open Mobile Pop-up ———
  function openPopup(type) {
    let source;
    if (type === 'price')  source = document.getElementById('price-filter');
    if (type === 'gender') source = document.getElementById('gender-filter');
    if (type === 'sort')   source = document.querySelector('.sort-bar');

    popupInner.innerHTML =
      `<h3>${type.charAt(0).toUpperCase() + type.slice(1)}</h3>`;
    const clone = source.cloneNode(true);
    clone.removeAttribute('id');
    if (type === 'sort') clone.querySelector('select').id = '';
    popupInner.appendChild(clone);
    popupWrapper.classList.add('active');
  }
});
