import revertHeaderColorOnScroll from "./revertHeaderColor";
import headerDropdown from "./headerDropdown";
import mobileMenu from "./mobile-munu";
import mobileMenuAccordion from "./mobile-menu-accordion";
import closeMobileMenuOnResize from "../helpers/closeMobileMenuOnResize";


const menu = () => {
  revertHeaderColorOnScroll();
  headerDropdown();
  mobileMenu();
  mobileMenuAccordion();
  closeMobileMenuOnResize();
}

export default menu
