const revertHeaderColorOnScroll = () => {
  const header = document.querySelector('.header');
  const heroSection = document.querySelector('.hero-section');

  if (!heroSection) {
    header.classList.remove('is-transparent');
    return
  }


  window.addEventListener('scroll', () => {
    if (window.scrollY < (window.innerHeight - header.offsetHeight) || window.scrollY <= 0) {
      header.classList.add('is-transparent');
    } else {
      header.classList.remove('is-transparent');
    }
  })
}

export default revertHeaderColorOnScroll
