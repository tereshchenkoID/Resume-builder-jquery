import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const scrollAnimation = () => {

  ScrollTrigger.batch('.js-accent-background-animate', {
    start: "top 80%",
    toggleClass: "active",
  })

  ScrollTrigger.batch('.js-image-animation', {
    start: "top 100%",
    stop: "top -100%",
    toggleClass: "active",
  })
};

export default scrollAnimation;
