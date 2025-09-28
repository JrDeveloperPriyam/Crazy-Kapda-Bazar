document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  fetch("./data/product.json")
    .then(res => res.json())
    .then(data => {
      const product = data.find(p => p.id === productId);
      if (!product) return;

      renderProductDetails(product);
      renderThumbnails(product.image);
      renderColorSwatches(data, product);
      renderSimilarProducts(data, product);
    })
    .catch(err => console.error("Failed to load product data:", err));
});

function renderProductDetails(product) {
  document.getElementById("mainImage").src = product.image[0];
  document.getElementById("detailName").textContent = product.name;
  document.getElementById("detailDescription").textContent = product.description;
  document.getElementById("detailPrice").textContent = product.price;
  document.getElementById("breadcrumbCategory").textContent = product.sub_category;
}

function renderThumbnails(images) {
  const gallery = document.getElementById("thumbnailGallery");
  gallery.innerHTML = "";

  const angleLabels = ["Front", "Side", "Back", "Zoom"];

  images.forEach((img, index) => {
    const thumb = document.createElement("img");
    thumb.src = img;
    thumb.className = "thumb";
    if (index === 0) thumb.classList.add("active");

    const label = document.createElement("span");
    label.textContent = angleLabels[index] || `View ${index + 1}`;
    label.className = "thumb-label";

    const wrapper = document.createElement("div");
    wrapper.className = "thumb-wrapper";
    wrapper.appendChild(thumb);
    wrapper.appendChild(label);

    thumb.addEventListener("click", () => {
      document.getElementById("mainImage").src = img;
      document.querySelectorAll(".thumb").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
    });

    gallery.appendChild(wrapper);
  });
}

function renderColorSwatches(data, product) {
  const colorContainer = document.querySelector(".color-swatches");
  const variants = data.filter(p => p.group_id === product.group_id);
  colorContainer.innerHTML = "";

  variants.forEach(variant => {
    const wrapper = document.createElement("div");
    wrapper.className = "swatch-wrapper";

    const swatch = document.createElement("span");
    swatch.className = "swatch";
    swatch.title = variant.color || variant.colo || "Unknown";

    if (variant.id === product.id) {
      swatch.classList.add("selected");
    }

    swatch.addEventListener("click", () => {
      window.location.href = `product.html?id=${variant.id}`;
    });

    const label = document.createElement("span");
    label.className = "swatch-label";
    label.textContent = variant.color || variant.colo || "Unknown";

    wrapper.appendChild(swatch);
    wrapper.appendChild(label);
    colorContainer.appendChild(wrapper);
  });
}

function renderSimilarProducts(data, product) {
  const currentSub = product.sub_category?.trim().toLowerCase();
  const similarProducts = data.filter(p =>
    p.sub_category?.trim().toLowerCase() === currentSub &&
    p.id !== product.id
  );

  const similarGrid = document.getElementById("similarGrid");
  similarGrid.innerHTML = "";

  if (similarProducts.length === 0) {
    similarGrid.innerHTML = `<p>No similar products found.</p>`;
  } else {
    similarProducts.slice(0, 20).forEach(similar => {
      const card = document.createElement("div");
      card.className = "similar-card";
      card.innerHTML = `
        <a href="product.html?id=${similar.id}">
          <img src="${similar.image[0]}" alt="${similar.name}" />
          <h3>${similar.name}</h3>
          <p>₹${similar.price}</p>
        </a>
      `;
      similarGrid.appendChild(card);
    });
  }
}

////////////// sHARE AND COPY LINK ////////////////////// 
document.getElementById("copyLinkBtn").addEventListener("click", () => {
  const url = window.location.href;
  navigator.clipboard.writeText(url)
    .then(() => alert("✅ Product link copied to clipboard!"))
    .catch(err => console.error("Copy failed:", err));
});

document.getElementById("shareBtn").addEventListener("click", () => {
  const url = window.location.href;
  const title = document.getElementById("detailName").textContent;

  if (navigator.share) {
    navigator.share({
      title: title,
      url: url
    }).catch(err => console.error("Share failed:", err));
  } else {
    alert("Sharing not supported on this device.");
  }
});
