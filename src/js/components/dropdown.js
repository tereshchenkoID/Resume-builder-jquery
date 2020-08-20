const dropdown = () => {
  const $dropButton = $(".js-dropdown-button")

  $dropButton.on('click', function () {
    $dropButton.removeClass("is-open");
    if ($(this).parents(".js-button-wrapper").children(".js-dropdown-menu").is(":visible")) {
      $(this).parents(".js-button-wrapper")
        .children(".js-dropdown-button")
        .addClass("is-open")
    }
  });
  $(document).on("click", function (e) {
    if (!$(e.target).parents().hasClass("js-button-wrapper")) {
      $dropButton.removeClass("is-open");
    }
  });
}

export default dropdown
