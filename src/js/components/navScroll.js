const navScroll = () => {

  function getScroll () {
    if ($(window).scrollTop() > 0) {
      $('#nav').addClass("nav--fixed");
    }
    else {
      $('#nav').removeClass("nav--fixed");
    }
  }

  getScroll()

  $(window).scroll(() => {
    getScroll()
  });
}

export default navScroll
