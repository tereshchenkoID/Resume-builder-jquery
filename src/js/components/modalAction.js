const modalAction = () => {

  $('.js-button-modal').on('click', function() {
    $('.js-modal').show();
  })

  $('.js-modal-close').on('click', function() {
    $('.js-modal').hide();
  })
}

export default modalAction
