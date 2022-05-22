import 'slick-slider'

// Change option
import {gsap, ScrollTrigger} from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

$( document ).ready(function() {

  window.setTimeout(function () {
    $('.js-preloader').hide();
  }, 1000);

  gsap.utils.toArray('.js-item-animation').forEach(item => {
    gsap.from(
      item,
      {
        y: 75,
        opacity: 0,
        duration: 0.5,
        scrollTrigger: {
          start: "top 90%",
          trigger: item,
        }
      }
    );
  });

  $('body').on('click', function(e) {
    if ($(e.target).closest('.js-dropdown').length) {
      $(this).toggleClass('dropdown--active')
    }
    else {
      $(this).removeClass('dropdown--active')
    }
  })


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


  /* Init Slider */
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

  let prevSlideIndex = 1
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
  /* Init Slider */


  /* Event for scroll anchor */
  const $navbar = $('.nav');
  $('a[href^="#"]').on('click', function(e) {
    e.preventDefault();

    const scrollTop =
      $($(this).attr('href')).position().top - $navbar.outerHeight();

    $('html, body').animate({ scrollTop });
  })
  /* End event for scroll anchor */


  /* Event for fixed nav */
    function getScroll () {
      if ($(window).scrollTop() > 0) {
        $('#nav').addClass("nav--fixed");
      }
      else {
        $('#nav').removeClass("nav--fixed");
      }
    }

    getScroll()

    $(window).scroll(function() {
      getScroll()
    });
  /* End event for fixed nav */


  $('.js-feedback-item').click(function (){
    const $parrent = $(this)
    $parrent.addClass('focused')

    if ($(this).hasClass('error')) {
      $(this).removeClass('error')
    }

    $parrent.addClass('focused');
  })

  $('.js-textarea-input').on('keyup', function() {
    const data = $(this).val()

    if (data.length > 500) {
      $('.js-feedback-wrapper').addClass('error')
    }
    else {
      $('.js-feedback-wrapper').removeClass('error')
    }

    $('.js-feedback-count').find('*')[0].innerHTML = data.length
  });

  $('.js-feedback').on('submit', function(e) {
    e.preventDefault();
    const items = $(this).find('.js-feedback-item');

    // eslint-disable-next-line array-callback-return
    items.map(function(index, item) {

      if ($(item).find('input, textarea').val().length === 0) {
        $(this).addClass('error')
      }
    })
  })
});
