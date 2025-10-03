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
  renderSizes(product.sizes);
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
    wrapper.className = "color-box-wrapper";

    const img = document.createElement("img");
    img.src = variant.image[0];
    img.alt = variant.color || variant.colo || "Variant";
    img.className = "color-box";

    if (variant.id === product.id) {
      img.classList.add("selected");
    }

    img.addEventListener("click", () => {
      window.location.href = `product.html?id=${variant.id}`;
    });

    const label = document.createElement("span");
    label.className = "color-label";
    label.textContent = variant.color || variant.colo || "Unknown";

    wrapper.appendChild(img);
    wrapper.appendChild(label);
    colorContainer.appendChild(wrapper);
  });
}

function renderSimilarProducts(data, product) {
  const currentTags = Array.isArray(product.tags)
    ? product.tags.map(t => t.trim().toLowerCase())
    : [product.tags.trim().toLowerCase()];

  const similarProducts = data.filter(p => {
    if (p.id === product.id) return false;

    const otherTags = Array.isArray(p.tags)
      ? p.tags.map(t => t.trim().toLowerCase())
      : [p.tags?.trim().toLowerCase()];

    return otherTags.some(tag => currentTags.includes(tag));
  });

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



// Share and Copy
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

// Size selection + Order Now
let selectedSize = null;

function renderSizes(sizesArray) {
  const sizeContainer = document.querySelector(".size-options");
  const sizeSection = document.getElementById("sizeSection");

  if (!sizesArray || sizesArray.length === 0) {
    sizeSection.style.display = "none";
    return;
  }

  sizeContainer.innerHTML = "";

  sizesArray.forEach(size => {
    const btn = document.createElement("button");
    btn.textContent = size;

    btn.addEventListener("click", () => {
      selectedSize = size;
      document.querySelectorAll(".size-options button").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });

    sizeContainer.appendChild(btn);
  });
}


document.getElementById("orderNowBtn").addEventListener("click", () => {
  if (!selectedSize) {
    alert("⚠️ Please select a size before ordering.");
    return;
  }

  const productName = document.getElementById("detailName").textContent;
  const productURL = window.location.href;

  const message = `Hi, I want to order:\n\n🧥 *${productName}*\n📏 Size: ${selectedSize}\n🔗 Link:\n${productURL}`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/919394708768?text=${encodedMessage}`;

  window.open(whatsappURL, "_blank");
});
