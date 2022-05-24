import 'slick-slider'

import preloaderAction from './components/preloaderAction';
import menuAction from './components/menuAction';
import navScroll from './components/navScroll'
import modalAction from './components/modalAction';
import dropdownAction from './components/dropdownAction';
import feedbackAction from './components/feedbackAction';
import tabAction from './components/tabAction';

import anchorScroll from './components/anchorScroll';
import onScrollAnimation from './components/onScrollAnimation'

$(document).ready(function() {

  preloaderAction()
  menuAction()
  modalAction()
  feedbackAction()
  tabAction()
  dropdownAction()

  navScroll()
  anchorScroll()

  onScrollAnimation()
});
