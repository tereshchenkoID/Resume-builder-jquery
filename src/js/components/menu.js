import isTouchDevice from '../helpers/detectTouch'

let isMobileNavOpened = false;

const { body } = document;
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-navigation');
const eventType = isTouchDevice() ? 'touchstart' : 'click';

export function closeMenu() {
  hamburger.classList.remove('is-active');
  body.classList.remove('is-overflow-hidden');
  hamburger.classList.add('is-disabled');
  mobileNav.classList.remove('is-opened');
}

function openMenu() {
  hamburger.classList.add('is-active');
  body.classList.add('is-overflow-hidden');
  hamburger.classList.remove('is-disabled');
  mobileNav.classList.add('is-opened');
}

const menu = () => {
  hamburger.addEventListener(eventType, () => {
    isMobileNavOpened = mobileNav.classList.contains('is-opened');

    if(isMobileNavOpened) {
      closeMenu();
    } else {
      openMenu();
    }
  });
};

export default menu;
