import { closeMenu } from "../components/menu";

function closeMobileMenuOnResize() {
  const desktop = window.matchMedia('(min-width: 1280px)');

  function hideMenu(e)  {
    if (e.matches) {
      closeMenu()
    }
  }

  hideMenu(desktop);
  desktop.addEventListener("change", hideMenu);
}

export default closeMobileMenuOnResize;
