const feedbackAction = () => {

  $('.js-feedback-item').click(function (){
    const $parrent = $(this)
    $parrent.addClass('focused')

    if ($(this).hasClass('error')) {
      $(this).removeClass('error')
    }

    $parrent.addClass('focused');
  })

  $('.js-textarea-input').on('keyup', function() {
    const parent = $(this).closest('.js-feedback')
    const data = $(this).val()

    if (data.length > 500) {
      $(parent).find('.js-feedback-wrapper').addClass('error')
    }
    else {
      $(parent).find('.js-feedback-wrapper').removeClass('error')
    }

    $(parent).find('.js-feedback-count').find('*')[0].innerHTML = data.length
  });


  $('.js-feedback').on('submit', function(e) {
    e.preventDefault();
    const items = $(this).find('.js-feedback-item');

    items.map(function(index, item) {

      if ($(item).find('input, textarea').val().length === 0) {
        $(this).addClass('error')
      }

      return true
    })
  })
}

export default feedbackAction
