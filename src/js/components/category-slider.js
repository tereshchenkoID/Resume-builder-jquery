import $ from 'jquery';
import 'slick-slider';
import PhotoSwipeMounter from 'jquery.photoswipe';

PhotoSwipeMounter(jQuery); // mount this plugin into jQuery

const $slider = $('.js-category-slider');
const buttonTopCustomProperty = '--buttonTop';
const mediaSmOnly = window.matchMedia('(min-width: 640px) and (max-width: 1023px)');

const Icon = (name) => {
  return `
    <svg class="icon ${name} gallery-slider__${name}">
        <use xlink:href="#icon-${name}">
    </svg>
  `;
};

const options = {
  slidesToShow: 1,
  prevArrow:
    `<button type="button" class="slick-prev slider-nav category-slider__prev">
      ${Icon('arrow-left')}
    </button>`,
  nextArrow:
    `<button type="button" class="slick-next slider-nav category-slider__next">
      ${Icon('arrow-right')}
    </button>`,
  mobileFirst: true,
  responsive: [
    {
      breakpoint: 639,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        appendArrows: $('.js-category-slider-navigation'),
      }
    },
    {
      breakpoint: 1023,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        appendArrows: $slider,
      }
    },
  ],
};

const categorySlider = () => {
  if (!$slider.length) {
    return;
  }

  $slider.slick(options);

  const slick = $slider.slick('getSlick');

  const handleOnResize = () => {
    const imgHeight = slick.$slides[0].querySelector('img').offsetHeight;
    const newTop = `${imgHeight / 2}px`;
    $slider[0].style.setProperty(buttonTopCustomProperty, newTop);
  }

  const setTopValue = (event) => {
    if (event.matches) {
      window.removeEventListener('resize', handleOnResize);
    } else {

      setTimeout(() => {
        handleOnResize();
        window.addEventListener('resize', handleOnResize);
      }, 100);
    }
  }

  setTopValue(mediaSmOnly);

  mediaSmOnly.addEventListener('change', setTopValue);

  $slider.photoSwipe(
    '.slick-slide:not(.slick-cloned) .js-picture-category', {
      shareEl: false
    });
};

export default categorySlider
