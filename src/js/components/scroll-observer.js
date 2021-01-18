import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const scrollAnimation = () => {

  ScrollTrigger.batch('.js-accent-background-animate', {
    start: "top 80%",
    toggleClass: "active",
    once: true
  })

  ScrollTrigger.batch('.js-image-animation', {
    start: "top 100%",
    toggleClass: "active",
    once: true
  })
};

export default scrollAnimation;
