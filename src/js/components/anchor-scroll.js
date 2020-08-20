import $ from 'jquery'

const anchorScroll = (
  el,
  offset = 0,
  scrollTopFlag = false,
) => {
  if(el) {
    $(el).on('click', function(e) {
      e.preventDefault();
      $("html, body").animate({
        scrollTop: scrollTopFlag ? 0 : $($(this).attr("href")).offset().top - offset
      }, 1000);
    });
  }
}

export default anchorScroll;
