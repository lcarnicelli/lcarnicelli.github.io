window.onload = (e) => {
  
  var cjcHeaderNav = document.getElementById('cjc-header-nav');
  var cjcLogo = document.getElementById('cjc-logo');
  var cjcHomeSections = document.querySelectorAll('.cjc-home-section');

  document.addEventListener('scroll', (event) => {
    
    //Header logo animation
    if (window.scrollY > 50) {
      if (cjcHeaderNav) cjcHeaderNav.classList.add('shadow-sm');
      cjcLogo.classList.add('cjc-logo-min');
    } else {
      if (cjcHeaderNav) cjcHeaderNav.classList.remove('shadow-sm');
      cjcLogo.classList.remove('cjc-logo-min');
    }

    /*Home sections background
    if (cjcHomeSections) {
      cjcHomeSections.forEach((s) => {
        if (window.scrollY > s.offsetTop - (screen.height / 4) && 
            window.scrollY < s.offsetTop + s.offsetHeight - (screen.height / 4)) {
          s.querySelector('.container').classList.add('bg-light');
        } else {
          s.querySelector('.container').classList.remove('bg-light');
        }
      });
    }*/
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
