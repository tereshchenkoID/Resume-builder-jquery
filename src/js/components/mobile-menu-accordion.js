import $ from 'jquery'

const mobileMenuAccordion = () => {
  const $mobileNav = $('#mobile-navigation');
  const $triggers = $mobileNav.find('.mobile-submenu-toggle');
  const isActive = 'is-active'

  $triggers.on('click', function(event) {
    event.preventDefault();

    $(`.${isActive}`).not(this).removeClass(isActive).next().slideUp(300);
    $(this).toggleClass(isActive).next('.submenu').slideToggle(300);
  })
}

export default mobileMenuAccordion
