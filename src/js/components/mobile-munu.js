import isTouchDevice from "../helpers/detectTouch";

let isMobileNavOpened = false;

const { body } = document;
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-navigation');
const eventType = isTouchDevice() ? 'touchstart' : 'click';

export const closeMenu = () => {
  hamburger.classList.remove('is-active');
  body.classList.remove('is-overflow-hidden');
  hamburger.classList.add('is-disabled');
  mobileNav.classList.remove('is-opened');
}

const closeMenuOnDocumentClick = event => {
  const { target } = event;

  if (!mobileNav.contains(target) && !hamburger.contains(target)) {
    closeMenu();
  }
}

const openMenu = () => {
  hamburger.classList.add('is-active');
  body.classList.add('is-overflow-hidden');
  hamburger.classList.remove('is-disabled');
  mobileNav.classList.add('is-opened');
}

const mobileMenu = () => {
  hamburger.addEventListener(eventType, () => {
    isMobileNavOpened = mobileNav.classList.contains('is-opened');

    if(isMobileNavOpened) {
      closeMenu();
      document.removeEventListener(eventType, closeMenuOnDocumentClick);
    } else {
      openMenu();
      document.addEventListener(eventType, closeMenuOnDocumentClick);
    }
  });
};

export default mobileMenu;
