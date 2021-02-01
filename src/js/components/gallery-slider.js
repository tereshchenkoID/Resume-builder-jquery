import $ from 'jquery'
import 'slick-slider'

const $slider = $(".js-gallery-slider");
const $currentSlide = $('.js-current-slide');
const $totalSlides = $('.js-total-slides');
const svgSpritePath = '/img/sprite.svg';

const Icon = (name) => {
  return `
    <svg class="icon ${name} gallery-slider__${name}">
        <use xlink:href="${svgSpritePath}#icon-${name}">
    </svg>
  `;
};

const options = {
  slidesToShow: 1,
  prevArrow:
    `<button type="button" class="slick-prev gallery-slider__nav gallery-slider__prev">
      ${Icon('arrow-left')}
    </button>`,
  nextArrow:
    `<button type="button" class="slick-next gallery-slider__nav gallery-slider__next">
      ${Icon('arrow-right')}
    </button>`,
};

const gallerySlider = () => {
  $slider.slick(options);

  $slider.on('afterChange', (event, slick, currentSlide) => {
    $currentSlide.text(currentSlide + 1);
  });

  const slick = $slider.slick('getSlick');

  $currentSlide.text(slick.currentSlide + 1);
  $totalSlides.text(slick.slideCount);
}

export default gallerySlider
