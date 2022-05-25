$('.js-toggle').on('click', function() {
  $('.js-toggle').toggleClass('toggle--active')
  $('.js-menu').toggleClass('menu--active')
})

function getScroll () {
  if ($(window).scrollTop() > 0) {
    $('.js-nav').addClass("nav--fixed");
  }
  else {
    $('.js-nav').removeClass("nav--fixed");
  }
}

getScroll()

$(window).scroll(() => {
  getScroll()
});
