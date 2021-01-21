const scrollSpyObserver = () => {
  const sections = document.querySelectorAll('.js-scroll-spy-section');
  const navItems = document.querySelectorAll('.js-scroll-spy');

  if(!sections || !navItems) return

  const sectionsArr = [...sections];

  function activateNavByIndex(index) {
    if (sectionsArr[index].classList.contains('active'))
      return;

    const currentActive = document.querySelectorAll('.js-scroll-spy.active');

    for (let i = currentActive.length - 1; i >= 0; i--) {
      currentActive[i].classList.remove('active');
    }
    navItems[index].classList.add('active');
  }

  const intersectionCallback = (entries, observer) => {
    if (entries[0].intesectionRatio <= 0)
      return;

    if (entries[0].intersectionRatio > 0.5) {
      activateNavByIndex(sectionsArr.indexOf(entries[0].target))
    }
  };

  const intersectionOptions = {
    threshold: [0, 0.5, 1],
    rootMargin: '50px 0px 0px 0px',
    root: null
  };

  const intersectionObserver = new IntersectionObserver(intersectionCallback, intersectionOptions);

  for (let i = 0; i < sections.length; i++) {
    intersectionObserver.observe(sections[i]);
  }
}

export default scrollSpyObserver;
