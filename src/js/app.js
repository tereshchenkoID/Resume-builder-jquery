$('.js-toggle').on('click', function() {
  $(this).toggleClass('toggle--active')
  $('.js-menu').toggleClass('menu--active')
})

$('.js-checked').on('click', function() {
  $(this).toggleClass('checked--active')
})

$('.js-select').on('click', function(){
  $(this).toggleClass('select--active');
})

$('.js-select-item').on('click', function () {
  $('.js-select-label').text($(this).text());
  $('.js-select-label').attr('value', $(this).attr('value'));
})


function changeJobsView (value) {
  if (value ==='list') {
    $('.js-jobs').removeClass('jobs--grid')
    $('.js-jobs').addClass('jobs--list')
  }
  else {
    $('.js-jobs').removeClass('jobs--list')
    $('.js-jobs').addClass('jobs--grid')
  }
}

$('.js-actions-item').on('click', function() {
  $('.js-actions-item').removeClass('actions__item--active')
  $(this).addClass('actions__item--active')

  changeJobsView(this.getAttribute('data-sort'));
})
