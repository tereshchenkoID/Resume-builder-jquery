import $ from 'jquery'

const mobileMenuAccordion = () => {
  const $mobileNav = $('#mobile-navigation');
  const $triggers = $mobileNav.find('.js-mobile-submenu-trigger');
  const isActive = 'is-active-link'

  function triggerAccordion(event) {
    event.preventDefault();

    $(`.${isActive}`).not(this).removeClass(isActive).next().slideUp(300);
    $(this).toggleClass(isActive).next('.submenu').slideToggle(300);
  }

  $triggers.on('click', triggerAccordion)
}

export default mobileMenuAccordion
