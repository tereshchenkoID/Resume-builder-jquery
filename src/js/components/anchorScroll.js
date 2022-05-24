const anchorScroll = () => {
  $('a[href^="#"]').on('click', function(e) {
    e.preventDefault();

    const scrollTop =
      $($(this).attr('href')).position().top -$('.nav').outerHeight();

    $('html, body').animate({ scrollTop });
  })
}

export default anchorScroll
