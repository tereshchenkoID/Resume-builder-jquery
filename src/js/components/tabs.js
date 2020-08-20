import $ from 'jquery'

const tabs = (tabsSelector, contentSelector, flag) => {
  $(tabsSelector).on('click', function () {
    $(this).addClass('is-active').siblings().removeClass('is-active')
    $(contentSelector).eq($(this).index()).addClass('is-active').siblings().removeClass('is-active')
    if(flag) {
      $(contentSelector).eq($(this).index()).find('.slick-slider').slick('refresh')
    }
  })
}

export default tabs;
