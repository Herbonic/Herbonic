document.addEventListener('DOMContentLoaded', () => {
  // Hamburger Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });

  // Update Price
  window.updatePrice = function(select) {
    const price = select.options[select.selectedIndex].dataset.price;
    console.log(`Selected price: ₨${price}`);
  };

  // Product Image Slider
  const sliders = document.querySelectorAll('.slider-container');
  sliders.forEach(sliderContainer => {
    const slides = sliderContainer.querySelectorAll('.slide');
    const prevBtn = sliderContainer.querySelector('.prev-btn');
    const nextBtn = sliderContainer.querySelector('.next-btn');
    const indicators = sliderContainer.querySelectorAll('.indicator');
    let currentSlide = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.remove('active');
        indicators[i].classList.remove('active');
        if (i === index) {
          slide.classList.add('active');
          indicators[i].classList.add('active');
        }
      });
      sliderContainer.querySelector('.slider').style.transform = `translateX(-${index * 100}%)`;
    }

    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    });

    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    });

    indicators.forEach((indicator, i) => {
      indicator.addEventListener('click', () => {
        currentSlide = i;
        showSlide(currentSlide);
      });
    });

    showSlide(currentSlide); // Initialize first slide
  });
});