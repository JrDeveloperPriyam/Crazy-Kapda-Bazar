document.addEventListener('DOMContentLoaded', () => {
  const categoryFilter = document.getElementById('categoryFilter');
  const productList = document.getElementById('productList');
  const searchInput = document.getElementById('searchInput');
  const loadingSpinner = document.getElementById('loadingSpinner');

  let allProducts = [];
  let fuse;

  function showLoading(show) {
    loadingSpinner.style.display = show ? 'block' : 'none';
  }

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value.toLowerCase();

    let filteredProducts = allProducts;

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(product => {
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
      filteredProducts = filteredProducts.filter(product =>
        matchedItems.includes(product)
      );
    }

    showProducts(filteredProducts);
  }

  function showProducts(products) {
    productList.innerHTML = '';

    if (products.length === 0) {
      productList.innerHTML = `<p class="no-results">No products found. May be out of stock.</p>`;
      return;
    }

    products.forEach(product => {
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
  }

  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);

  // Fetch products and initialize Fuse
  showLoading(true);
  fetch('./data/product.json')
    .then(response => response.json())
    .then(data => {
      showLoading(false);
      allProducts = data;
      showProducts(allProducts);

      const options = {
        keys: ['name', 'description', 'category', 'sub_category', 'tags'],
        threshold: 0.3,
        includeScore: true,
      };

      fuse = new Fuse(allProducts, options);

      // ✅ Now that Fuse is ready, check for auto-search
      const params = new URLSearchParams(window.location.search);
      const searchTerm = params.get('search');

      if (searchTerm) {
        searchInput.value = searchTerm;
        applyFilters(); // 🔥 Trigger search directly
      }
    });
});
