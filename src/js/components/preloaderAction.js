const preloaderAction = () => {
  window.setTimeout( () => {
    $('.js-preloader').hide();
  }, 1000);
}

export default preloaderAction
