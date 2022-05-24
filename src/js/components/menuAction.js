const menuAction = () => {

  $('.js-toggle').on('click', function() {
    $('.js-menu').toggleClass('menu--active');
  })

  $('.js-menu-close').on('click', function() {
    $('.js-menu').toggleClass('menu--active');
  })

  $('.js-menu-link').on('click', function() {
    $('.js-menu-link').removeClass('menu__link--active')
    $(this).addClass('menu__link--active')

    if ($(window).width() < 1440) {
      $('.js-menu').toggleClass('menu--active');
    }
  })
}

export default menuAction
