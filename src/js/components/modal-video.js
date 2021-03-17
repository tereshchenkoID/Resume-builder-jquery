const modalTemplate = (href) => {
  return (`
    <div class="modal js-modal">
      <div class="modal__dialog js-modal-close">
        <div class="modal__body" style="background-color: var(--black)">
          <div class="video">
            <video class="video__frame" autoplay controls>
              <source src="${href}" type="video/mp4">
            </video>
          </div>
        </div>
      </div>
    <div/>`)
}

const closeModalByEscapeButton = (e, callback) => {
  if(e.which === 27 || e.which === "Escape") {
    callback();
  }
}

const closeVideoModal = () => {
  $('.js-modal').off().hide().remove();
  $(document).unbind('keydown', closeModalByEscapeButton);
  $('body').removeClass('is-overflow-hidden')
}

const openVideoModal = (href) => {
  $('body')
    .append(modalTemplate(href))
    .addClass('is-overflow-hidden')
  $(document).bind('keydown', (e) => closeModalByEscapeButton(e, closeVideoModal))
  $(document).on('click', '.js-modal-close', function(e){
    if(e.target.className === $(this).attr('class')) {
      closeVideoModal()
    }
  })
}

const modalVideo = () => {
  $('.js-modal-video').on('click', function (e){
    e.preventDefault();
    openVideoModal($(this).attr('href'), e);
  })

}

export default modalVideo
