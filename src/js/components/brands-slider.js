import $ from 'jquery'
import 'slick-slider'

const brandsSlider = () => {
  const $slickFor = $('.js-slider-for')
  const $slickNav = $('.js-slider-nav')

  $slickFor.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    asNavFor: '.js-slider-nav'
  });
  $slickNav.slick({
    slidesToShow: 2,
    slidesToScroll: 1,
    asNavFor: '.js-slider-for',
    focusOnSelect: true,
    arrows: false,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
          arrows: false,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: false,
        }
      }
    ]
  });
}

export default brandsSlider
