import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const scrollAnimation = () => {
  // const animated = gsap.utils.toArray('.animated')

  // animated.forEach(item => {
  //   const animationX = gsap.to(item, {
  //     x: 500,
  //     rotation: 360,
  //     duration: 1,
  //   })
  //   ScrollTrigger.create({
  //     trigger: item,
  //     start: "top 60%",
  //     toggleActions: "play none none none",
  //     once: true,
  //     animation: animationX,
  //     toggleClass: {
  //       targets: item,
  //       className: 'active'
  //     }
  //   });
  // })

  ScrollTrigger.batch('.js-accent-background-animate', {
    start: "top 60%",
    toggleClass: "active",
    once: true,
  })
};

export default scrollAnimation;
