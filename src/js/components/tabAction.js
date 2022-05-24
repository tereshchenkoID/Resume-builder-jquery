const tabAction = () => {

  let prevSlideIndex = 1
  const $options = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    cssEase: 'linear'
  };

  $('.tab__section--active').find('.js-tab-slider').slick($options);

  $('.js-tab-item').on('click', function() {
    const id = $(this).attr('data-id')

    $(`#tab-${prevSlideIndex}`).find('.js-tab-slider').slick('unslick');

    prevSlideIndex = id[id.length - 1]

    $('.js-tab-item').removeClass('tab__item--active')
    $(this).addClass('tab__item--active')

    $('.js-tab-section').removeClass('tab__section--active')
    $(`#${id}`).addClass('tab__section--active')

    if($(`#${id}`).find('.slick-initialized').length === 0) {
      $(`#${id}`).find('.js-tab-slider').slick($options)
    }
  })
}

export default tabAction
