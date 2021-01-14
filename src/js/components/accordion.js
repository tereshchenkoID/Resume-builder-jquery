import $ from 'jquery'

const accordion = () => {
  const $triggers = $('.js-accordion-trigger')

  $triggers.each(function () {
    if(!$(this).hasClass('is-open')) {
      $(this).next('.js-accordion-content').css('display', 'none')
    }
  });

  $triggers.click(function () {
    $('.is-open').not(this).removeClass('is-open').next().slideUp(300);
    $(this).toggleClass('is-open').next().slideToggle(300);
  });
}

export default accordion;
