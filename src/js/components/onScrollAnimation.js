import {gsap, ScrollTrigger} from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const onScrollAnimation = () => {
  ScrollTrigger.matchMedia({
    "(min-width: 1440px)": () => {

      ScrollTrigger.batch(".js-item-animation", {
        onEnter: batch => gsap.from(batch,
          {
            y: 75,
            opacity: 0,
            duration: 0.5
          }
        ),
      });
    }
  })
}

export default onScrollAnimation
