import $ from 'jquery'

const seoBlock = () => {
  $(document).on('click', '.js-seo-trigger', function(){
    const $text = $(this).prev('.js-seo-text');
    $(this).toggleClass('trigger-is-active');
    $text.toggleClass('text-is-opened');
  });
};

export default seoBlock
