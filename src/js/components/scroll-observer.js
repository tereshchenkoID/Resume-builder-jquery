import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const scrollAnimation = () => {
  document.querySelectorAll('.animated').forEach((item)=>{
    gsap.to(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 60%",
        toggleActions: "restart none none reverse",
      },
      x: 500,
      rotation: 360,
      duration: 1,
    });
  })



};

export default scrollAnimation;
