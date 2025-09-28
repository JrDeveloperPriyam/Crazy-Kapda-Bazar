////////////////////////////////// menu btn /////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const menuBtnMobile = document.querySelector('.menu-btn-mobile');
  const sidebarMobile = document.querySelector('#sidebar-mobile');
  const overlayMobile = document.querySelector('#overlay-mobile');
  const closeBtnMobile = document.querySelector('.close-btn-mobile');

  if (menuBtnMobile && sidebarMobile && overlayMobile && closeBtnMobile) {
    // Open menu
    menuBtnMobile.addEventListener('click', () => {
      sidebarMobile.classList.add('show');
      overlayMobile.classList.add('show');
    });

    // Close on close button click
    closeBtnMobile.addEventListener('click', () => {
      sidebarMobile.classList.remove('show');
      overlayMobile.classList.remove('show');
    });

    // Close when clicking outside
    overlayMobile.addEventListener('click', () => {
      sidebarMobile.classList.remove('show');
      overlayMobile.classList.remove('show');
    });
  } else {
    console.error("Mobile menu elements not found in DOM.");
  }
});



////////////////////////////// Small box container ////////////////////////////////////////

  const sliders = document.querySelectorAll('.bottom-sub-loths.slider');
  sliders.forEach(slider => {
    const images = slider.querySelectorAll('img');
    let index = 0;

    // Show first image initially
    images[index].classList.add('active');

    setInterval(() => {
      images[index].classList.remove('active');
      index = (index + 1) % images.length; // Loop infinitely
      images[index].classList.add('active');
    }, 4000); // Change every 4 seconds
  });

////////////////////////////////////////////////////////////////
/////////////////////////// Carousel ///////////////////////////
const slides = document.querySelectorAll(".carousel-slide");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");
let currentIndex = 0;
let interval;
// Function to show a specific slide
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) slide.classList.add("active");
  });
}
// Function to show the next slide
function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}
// Function to show the previous slide
function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
}
// Auto slide with 6-second interval
function startAutoSlide() {
  interval = setInterval(nextSlide, 6000); // 6000ms = 6 seconds
}
// Stop auto sliding when user interacts
function stopAutoSlide() {
  clearInterval(interval);
}
// Event listeners for buttons
nextBtn.addEventListener("click", () => {
  stopAutoSlide();
  nextSlide();
  startAutoSlide();
});
prevBtn.addEventListener("click", () => {
  stopAutoSlide();
  prevSlide();
  startAutoSlide();
});
// Initialize carousel
showSlide(currentIndex);
startAutoSlide();



//////////////////////// Search Product Mnagement //////////////////

document.getElementById('searchBox').addEventListener('focus', () =>{
  //redirect to the search Page
  window.location.href = "search.html";
})

/////////////////////// nike sneakers poster //////////////////////////

document.querySelector('.NikeSneakerPoster').addEventListener('click', () => {
  const searchTerm = 'Nike Sneakers';
  window.location.href = `search.html?search=${encodeURIComponent(searchTerm)}`;
});

document.querySelector(".Clogs").addEventListener ('click', () =>{
  const searchTerm1 = "Clogs";
  window.location.href = `search.html?search=${encodeURIComponent(searchTerm1)}`
});


document.querySelector("#Track-Pants").addEventListener ('click', () =>{
  const searchTerm2 = "Track Pants";
  window.location.href = `search.html?search=${encodeURIComponent(searchTerm2)}`
});


document.querySelector("#ShirtsMen").addEventListener ('click', () =>{
  const searchTerm2 = "Shirts";
  window.location.href = `search.html?search=${encodeURIComponent(searchTerm2)}`
});

document.querySelector("#FormalLongPants").addEventListener ('click', () =>{
  const searchTerm3 = "Trousers for men";
  window.location.href = `search.html?search=${encodeURIComponent(searchTerm3)}`
});

document.querySelector("#JeansMen").addEventListener ('click', () =>{
  const searchTerm4 = "Jeans for mens..";
  window.location.href = `search.html?search=${encodeURIComponent(searchTerm4)}`
});

document.querySelector("#JeansWomen").addEventListener ('click', () =>{
  const searchTerm4 = "Jeans for womens...";
  window.location.href = `search.html?search=${encodeURIComponent(searchTerm4)}`
});

document.querySelector("#TShirt").addEventListener ('click', () =>{
  const searchTerm4 = "T-Shirts..";
  window.location.href = `search.html?search=${encodeURIComponent(searchTerm4)}`
});














