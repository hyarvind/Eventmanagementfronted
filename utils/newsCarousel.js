// News carousel
const latestNewsData = document.querySelectorAll(".news-container .item");
const nextBtn = document.querySelector(".next-btn");
const prevBtn = document.querySelector(".prev-btn");
const slideIndicator = document.querySelector(".slide-indicator");

let currentIndex = 0;
let autoSlideInterval;

function createIndicators() {
  latestNewsData.forEach((_, index) => {
    const indicatorBtn = document.createElement("button");
    indicatorBtn.setAttribute("aria-label", "news slide button indicator");
    indicatorBtn.setAttribute("aria-current", index === 0 ? "true" : "false");

    indicatorBtn.addEventListener("click", () => {
      showSlide(index);
      resetAutoSlide();
    });

    slideIndicator.appendChild(indicatorBtn);
  });
}

function updateIndicators() {
  const indicatorButtons = slideIndicator.querySelectorAll("button");
  indicatorButtons.forEach((button, index) => {
    button.setAttribute(
      "aria-current",
      index === currentIndex ? "true" : "false",
    );
  });
}

function updateSlideAria() {
  latestNewsData.forEach((slide, index) => {
    slide.setAttribute(
      "aria-current",
      index === currentIndex ? "true" : "false",
    );
    slide.setAttribute(
      "aria-hidden",
      index === currentIndex ? "false" : "true",
    );
  });
}

function showSlide(index) {
  const newsContainer = document.querySelector(".news-container");
  const totalItems = latestNewsData.length;

  currentIndex = index;
  const offset = -currentIndex * 100;
  newsContainer.style.transform = `translateX(${offset}%)`;

  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === totalItems - 1;

  updateIndicators();
  updateSlideAria();
}

function nextSlide() {
  if (currentIndex < latestNewsData.length - 1) {
    showSlide(currentIndex + 1);
  } else {
    showSlide(0); // Loop back to the start
  }
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(nextSlide, 10000);
}

nextBtn.addEventListener("click", () => {
  if (currentIndex < latestNewsData.length - 1) {
    showSlide(currentIndex + 1);
  }
  resetAutoSlide();
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    showSlide(currentIndex - 1);
  }
  resetAutoSlide();
});

// Initialize the carousel
createIndicators();
showSlide(currentIndex);
resetAutoSlide();
//
