$('.js-toggle-default').click(function() {
  $(this).toggleClass('toggle--active');
  $('.nav').toggleClass('nav--active');

  $('.js-top-block-sm').removeClass('top__block--active');
});

$('.js-toggle-collapse').click(function() {
  $('.js-top-block-sm').toggleClass('top__block--active');

  $('.js-toggle-default').removeClass('toggle--active');
  $('.nav').removeClass('nav--active');
});

$('.js-lang').click(function() {
  $(this).toggleClass('lang--active');
});

$('.js-search-filed').on('input', function() {
  if ($(this).val().length > 2) {
    $('.js-search').addClass('search--active')
  }
  else {
    $('.js-search').removeClass('search--active')
  }
});

$('.js-bet-sport-item').click(function() {
  $('.js-bet-sport-item').removeClass('bet-sport__item--active');
  $(this).addClass('bet-sport__item--active');
});

$('.js-search-icon').click(()=>{
  $('.top').toggleClass('top--search');
});

$('.js-login-toggle').click(function(){
  $(this).toggleClass('login__toggle--active');

  if($(this).hasClass('login__toggle--active')) {
    $('.js-login-title').html('Register')
    $('.js-login-subtitle').html('Sign in')
  }
  else {
    $('.js-login-title').html('Login')
    $('.js-login-subtitle').html('Register Now')
  }

  var active = $('.login__tab--active');
  active.removeClass('login__tab--active');
  active.siblings('.login__tab').addClass('login__tab--active');
});

$('.js-shadow').on('click', function(e) {
  if ($(e.target).closest('.js-betslip').length) {
    $('.js-shadow').toggleClass('shadow--active');
  }
  e.stopPropagation();
});


$('.js-shadow').click(function() {
  $('.js-shadow').toggleClass('shadow--active');
});

$('.js-button-odd').click(function() {
  $('.js-shadow').toggleClass('shadow--active');
});

$('.js-betslip-header').click(function() {
  $('.js-betslip').toggleClass('betslip--active');
});

$('.js-select').click(function() {
  $(this).toggleClass('select--active');
});

$('.js-select-item').click(function() {
  var parent = $(this).closest('.js-select'),
    label = parent.children('.js-select-label');

  label.html($(this).html())
  label.attr("value", $(this).attr('value'))
});

$(document).ready(function(){

  $('.js-header-slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    dots: false
  });
});

var Progress = function (selector) {
  if (!selector) return false;

  this.path = selector.querySelector('.js-progress-top');
  this.text = selector.querySelector('.js-progress-text');
  this.length = this.path.r.baseVal.value * 2 * Math.PI;

  this.path.style.strokeDasharray = this.length + ' ' + this.length;
}

Progress.prototype.value = function (val) {
  if (val && typeof val !== undefined) {
    this.path.style.strokeDashoffset = this.length * (val / 100) - this.length;
    this.text.textContent = Math.round(val) + '%';
  } else {
    return this.length / this.path.style.strokeDashoffset;
  }
}

document.querySelectorAll('.js-progress').forEach(function(item, index) {
  const progress = new Progress(item);
  progress.value(Math.random() * 100);
});
