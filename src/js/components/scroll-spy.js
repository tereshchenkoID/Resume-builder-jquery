import $ from 'jquery'
import HEADER_OFFSET from './constats';

const scrollSpyObserver = () => {
  const $sections = $('.js-scroll-spy-section');
  const headerHeight = $('.header').height();
  const headerOffset = headerHeight + HEADER_OFFSET
  const firstSectionOffset = $sections.eq(0).offset().top

  $(window).on('scroll', function(){
    const scrollTopPos = $(this).scrollTop()

    $sections.each(function() {
      const id = $(this).attr('id');
      const offset = $(this).offset().top - headerOffset;
      const height = $(this).height();

      if(scrollTopPos < firstSectionOffset - headerOffset) {
        $('.js-scroll-spy').removeClass('active')
      }

      if(scrollTopPos >= offset && scrollTopPos < offset + height) {
        $(`a[href="#${id}"]`)
          .closest('.js-scroll-spy')
          .addClass('active')
          .siblings()
          .removeClass('active')
      }
    });
  })
}

export default scrollSpyObserver;
