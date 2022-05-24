const dropdownAction = () => {

  $('body').on('click', function(e) {
    if ($(e.target).closest('.js-dropdown').length) {
      $(this).toggleClass('dropdown--active')
    }
    else {
      $(this).removeClass('dropdown--active')
    }
  })
}

export default dropdownAction
