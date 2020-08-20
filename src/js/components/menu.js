import { TimelineMax } from 'gsap';
import isTouchDevice from '../helpers/detectTouch'

const menu = () => {
  const tl = new TimelineMax();
  const { body } = document;
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-navigation');
  const mobileLang = document.getElementById('mobile-languages');
  const mobileSocials = document.getElementById('mobile-socials');
  const languages = mobileLang.querySelector('.languages').children;
  const socialLinks = mobileSocials.querySelectorAll('.social-list__item');
  const navListItems = mobileNav.querySelectorAll('.nav__item');
  const eventType = isTouchDevice() ? 'touchstart' : 'click';
  const staggerElements = [...navListItems, ...languages, ...socialLinks];

  const closeMenu = () => {
    hamburger.classList.remove('is-active');
    hamburger.classList.add('is-disabled');

    tl.fromTo(mobileNav, 0.3, {x: '0%', opacity: 1}, {x: '-100%', opacity: 0, onComplete: () => {
      mobileNav.classList.remove('is-opened');
      hamburger.classList.remove('is-disabled');
      body.classList.remove('is-overflow-hidden');
    }});
  };

  const openMenu = () => {
    hamburger.classList.add('is-active');
    body.classList.add('is-overflow-hidden');
    hamburger.classList.add('is-disabled');

    tl
      .fromTo(mobileNav, 0.3, {x: '-100%', opacity: 0}, {x: '0%', opacity: 1})
      .staggerFromTo(
        staggerElements,
        0.3,
        {x: -20, opacity: 0},
        {x: 0, opacity: 1, onComplete: () => {
          mobileNav.classList.add('is-opened');
          hamburger.classList.remove('is-disabled');
        }}, 0.05);
  };

  hamburger.addEventListener(eventType, () => {
    const isMobileNavOpened = mobileNav.classList.contains('is-opened');

    if(isMobileNavOpened) {
      closeMenu();
    } else {
      openMenu();
    }
  });
};

export default menu;
