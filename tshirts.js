document.addEventListener('DOMContentLoaded', () => {
  const PER_PAGE = 10;
  let products = [];
  let page     = 0;

  const container = document.getElementById('cloth-container');
  const loader    = document.getElementById('loader');
  const sentinel  = document.getElementById('scroll-sentinel');

  // Fetch product.json once
  fetch('data/product.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      // Filter only t-shirts
      products = data.filter(p =>
        p.sub_category &&
        p.sub_category.toLowerCase().includes('t-shirt')
      );

      if (!products.length) {
        container.innerHTML = '<p class="no-items">No t-shirts found.</p>';
        return;
      }

      loadMore();                 // initial batch
      observer.observe(sentinel); // start infinite scroll
    })
    .catch(err => {
      console.error('Failed to load products:', err);
      container.innerHTML =
        '<p class="no-items">Failed to load products.</p>';
    });

  // Render next batch of products
  function loadMore() {
    if (page * PER_PAGE >= products.length) {
      observer.disconnect();
      return;
    }

    loader.classList.remove('hidden');

    setTimeout(() => {
      const start = page * PER_PAGE;
      const end   = Math.min(start + PER_PAGE, products.length);
      products.slice(start, end).forEach(p => {
        const imgFile = Array.isArray(p.image) ? p.image[0].trim() : "";
        const imgUrl  = imgFile.startsWith('http') ? imgFile : imgFile;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <img
            src="${imgUrl}"
            alt="${p.name}"
            loading="lazy"
            onerror="this.src='https://via.placeholder.com/400?text=No+Image';"
          />
          <div class="product-info">
            <h3>${p.name}</h3>
            <p class="price">₹${p.price.toLocaleString()}</p>
          </div>`;
        container.appendChild(card);
      });

      page++;
      loader.classList.add('hidden');
    }, 300);
  }

  // Infinite scroll trigger
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadMore();
      }
    });
  }, {
    rootMargin: '200px'
  });
});



document.getElementById('searchBox').addEventListener('focus', () =>{
  //redirect to the search Page
  window.location.href = "search.html";
})