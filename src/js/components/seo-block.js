
const seoBlock = () => {
  const trigger = document.querySelector('.js-seo-trigger');
  const text = document.querySelector('.js-seo-text')

  if (!trigger && !text) {
    return;
  }

  trigger.addEventListener('click', () => {
    trigger.classList.toggle('trigger-is-active')
    text.classList.toggle('text-is-opened')
  })
};

export default seoBlock
