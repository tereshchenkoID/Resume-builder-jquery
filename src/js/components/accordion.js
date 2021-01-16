import $ from 'jquery'

const accordion = () => {
  const $triggers = $('.js-accordion-trigger')

  $triggers.each(function () {
    if(!$(this).hasClass('is-accordion-open')) {
      $(this).next('.js-accordion-content').css('display', 'none')
    }
  });

  $triggers.click(function () {
    $('.is-accordion-open').not(this).removeClass('is-accordion-open').next().slideUp(300);
    $(this).toggleClass('is-accordion-open').next().slideToggle(300);
  });
}

export default accordion;
