import $ from 'jquery'
import 'slick-slider'
import PhotoSwipeMounter from 'jquery.photoswipe';

PhotoSwipeMounter(jQuery); // mount this plugin into jQuery

const $gallery = $('.js-article-layout-gallery')

const Icon = (name) => {
  return `
    <svg class="icon ${name} gallery-slider__${name}">
        <use xlink:href="#icon-${name}">
    </svg>
  `;
};

const getPictureTitle = (slick) => {
  return $(slick.$slides[slick.currentSlide])
    .find('.js-slide-picture')
    .data('title');
}

const options = {
  slidesToShow: 1,
  prevArrow:
    `<button type="button" class="slick-prev slider-nav gallery-slider__prev">
      ${Icon('arrow-left')}
    </button>`,
  nextArrow:
    `<button type="button" class="slick-next slider-nav gallery-slider__next">
      ${Icon('arrow-right')}
    </button>`,
};

const gallerySlider = () => {
  $gallery.each(function(){
    const $slider = $(this).find('.js-gallery-slider');
    const $sliderPagination = $(this).find('.js-slider-pagination');
    const $currentSlide = $sliderPagination.find('.js-current-slide');
    const $totalSlides = $sliderPagination.find('.js-total-slides');
    const $slideTitle = $(this).find('.js-slide-title');

    if (!$slider.length) {
      return;
    }

    $slider.slick(options);

    $slider.photoSwipe(
      '.slick-slide:not(.slick-cloned) .js-picture-gallery', {
        shareEl: false
      });

    $slider.on('afterChange', (event, slick, currentSlide) => {
      $slideTitle.text(getPictureTitle(slick));
      $currentSlide.text(currentSlide + 1);
    });

    const slick = $slider.slick('getSlick');

    $slideTitle.text(getPictureTitle(slick));

    if (slick.slideCount === 1) {
      $sliderPagination.hide();
      return;
    }

    $currentSlide.text(slick.currentSlide + 1);
    $totalSlides.text(slick.slideCount);
  })
}

export default gallerySlider
