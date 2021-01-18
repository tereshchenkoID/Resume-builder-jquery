const headerDropdown = () => {
  const nav = document.getElementById('header-navigation');

  function open(trigger) {
    trigger.classList.add('is-open');
    trigger.parentElement
      .querySelector('.js-submenu-desktop')
      .classList.add('is-visible');
  }

  function close(trigger) {
    trigger.classList.remove('is-open');
    trigger.parentElement
      .querySelector('.js-submenu-desktop')
      .classList.remove('is-visible');
  }

  function onDocumentClick(event) {
    const { target } = event;

    const triggers = Array.from(
      nav.querySelectorAll('.js-desktop-submenu-trigger')
    );

    if (!triggers.length) {
      return;
    }

    triggers.forEach(trigger => {
      const submenu = trigger.parentElement.querySelector('.js-submenu-desktop');

      if (!trigger.contains(target) && !submenu.contains(target)) {
        close(trigger);
      }
    });
  }

  function onNavClick(event) {
    const { target } = event;

    if (!target.classList.contains('js-desktop-submenu-trigger')) {
      return;
    }

    event.preventDefault();

    const isOpen = target.classList.contains('is-open');

    if (!isOpen) {
      open(target);
      document.addEventListener('click', onDocumentClick);
    } else {
      close(target);
      document.removeEventListener('click', onDocumentClick);
    }
  }

  nav.addEventListener('click', onNavClick);
}

export default headerDropdown
