window.onload = (e) => {
  // Logo animation
  var cjcLogo = document.getElementById('cjc-logo');
  document.addEventListener('scroll', (event) => {
    if (window.scrollY > 50) {
      cjcLogo.classList.add('cjc-logo-min');
    } else {
      cjcLogo.classList.remove('cjc-logo-min');
    }
  });

  //Carousel
  var cjcCarousel = document.querySelector('#cjc-carousel');
  var objCarousel;
  if (cjcCarousel) {
    objCarousel = new bootstrap.Carousel(cjcCarousel, {
      interval: 5000,
      ride: 'carousel'
    });
  }
};
