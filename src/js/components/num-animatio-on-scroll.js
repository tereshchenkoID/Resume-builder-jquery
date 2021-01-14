import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const COUNT={ val:0 };
const DURATION = 1.5;

function numbersAnimation() {
  document.querySelectorAll('[data-digit]').forEach((item, index) => {
    const itemData = item.dataset.digit.match(/(\d+|[^\d]+)/g).join(',').split(',');
    $(item).empty()
    itemData.forEach(text => {
      if($.isNumeric(text)) {
        $(item).append(`<span class="indicator__digit-${text.length}" id="js-animation-${text}-${index}">0</span>`)
        gsap.to(
          COUNT,
          DURATION, {
            val: text,
            roundProps: 'val',
            onUpdate(){
              $(`#js-animation-${text}-${index}`).html(COUNT.val)
            }
          });
      } else {
        $(item).append(`<span>${text}</span>`)
      }
    })
  })
}

const numAnimationOnScroll = () => {
  ScrollTrigger.batch('[data-digit]', {
    start: "top 100%",
    stop: "top -100%",
    onEnter: numbersAnimation,
    once: true,
  })
}

export default numAnimationOnScroll;
