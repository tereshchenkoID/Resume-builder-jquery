const closeDropdown = ($target) => {
  $target.removeClass("is-open");
};

const openDropdown = ($target) => {
  $target.addClass("is-open");
};

const dropdown = () => {
  const $dropButton = $(".js-dropdown-button");

  $dropButton.on("click", function () {
    const $that = $(this);
    const isOpen = $that.hasClass("is-open");
    const isListVisible = $that.parents(".js-button-wrapper").children(".js-dropdown-menu").is(":visible");

    if (isOpen) {
      closeDropdown($that);
    } else if (isListVisible && !isOpen) {
      closeDropdown($dropButton);
      openDropdown($that);
    }
  });

  $(document).on("click", function (e) {
    if (!$(e.target).parents().hasClass("js-button-wrapper")) {
      closeDropdown($dropButton);
    }
  });
}

export default dropdown
