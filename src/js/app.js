import $ from 'jquery'
import menu from './components/menu'
import dropdown from './components/dropdown'
import scrollAnimation from './components/scroll-observer'
import accordion from './components/accordion'
import numAnimationOnScroll from './components/num-animatio-on-scroll'
import anchorScroll from './components/anchor-scroll'
import brandsSlider from './components/brands-slider'
import scrollSpyObserver from './components/scroll-spy'

menu();
dropdown();
scrollAnimation();
accordion();
numAnimationOnScroll();
anchorScroll('a[href^=\\#]', $('.header').height() + 30);
brandsSlider();
scrollSpyObserver();
