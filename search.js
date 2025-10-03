document.addEventListener('DOMContentLoaded', () => {
  const categoryFilter = document.getElementById('categoryFilter');
  const productList = document.getElementById('productList');
  const searchInput = document.getElementById('searchInput');
  const loadingSpinner = document.getElementById('loadingSpinner');

  let allProducts = [];
  let visibleProducts = [];
  let currentIndex = 0;
  let fuse;

  const PRODUCTS_PER_BATCH = 12;

  function showLoading(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
  }

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value.toLowerCase();

    let filtered = allProducts;

    if (selectedCategory) {
      filtered = filtered.filter(product => {
        const categoryField = product.category;
        if (Array.isArray(categoryField)) {
          return categoryField.map(c => c.toLowerCase()).includes(selectedCategory);
        } else if (typeof categoryField === 'string') {
          return categoryField.toLowerCase() === selectedCategory;
        }
        return false;
      });
    }

    if (query && fuse) {
      const results = fuse.search(query);
      const matchedItems = results.map(result => result.item);
      filtered = filtered.filter(product => matchedItems.includes(product));
    }

    visibleProducts = filtered;
    currentIndex = 0;
    productList.innerHTML = '';
    loadMore(); // Load first batch
  }

  function loadMore() {
    const nextBatch = visibleProducts.slice(currentIndex, currentIndex + PRODUCTS_PER_BATCH);
    nextBatch.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <a href="product.html?id=${product.id}">
          <img src="${product.image[0]}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>₹${product.price}</p>
        </a>
      `;
      productList.appendChild(card);
    });

    currentIndex += PRODUCTS_PER_BATCH;

    if (currentIndex >= visibleProducts.length && visibleProducts.length === 0) {
      productList.innerHTML = `<p class="no-results">No products found. May be out of stock.</p>`;
    }
  }

  function handleScroll() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const fullHeight = document.body.offsetHeight;

    if (scrollY + viewportHeight >= fullHeight - 100) {
      loadMore();
    }
  }

  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
  window.addEventListener('scroll', handleScroll);

  showLoading(true);
  fetch('./data/product.json')
    .then(response => response.json())
    .then(data => {
      showLoading(false);
      allProducts = data;

      const options = {
        keys: ['name', 'description', 'category', 'sub_category', 'tags'],
        threshold: 0.3,
        includeScore: true,
      };

      fuse = new Fuse(allProducts, options);

      const params = new URLSearchParams(window.location.search);
      const searchTerm = params.get('search');

      if (searchTerm) {
        searchInput.value = searchTerm;
        applyFilters();
      } else {
        visibleProducts = allProducts;
        loadMore();
      }
    });
});
