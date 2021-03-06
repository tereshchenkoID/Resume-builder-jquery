/* eslint-disable */

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import Quill from 'Quill';

import Cropper from 'cropperjs';

let cropper

function initCropped() {
  cropper = new Cropper(document.getElementById('dropped-modal-image'),
    {
      aspectRatio: 1,
      preview: "#dropped-modal-preview",
      dragMode: "crop",
      guides: true,
      center: true,
      scalable: true,
      background: true,
      zoomable: true,
      zoomOnWheel: true,
      setDragMode: "move",

      done: function(){
        cropper.destroy()
      }
    })

  $('#dropped-modal-button').removeClass('dropped-modal__button--disabled')
}

function debounce(func, timeout = 300){
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

const initializeQuill = function (item) {
  const quill = new Quill(`#${item.el}`, {
    modules: {
      toolbar: [
        [{header: [1, 2, 3, 4, 5, 6, false]}],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['bold', 'italic', 'underline'],
        [{'align': []}],
      ]
    },
    placeholder: item.placeholder,
    theme: 'snow',
  });

  quill.root.innerHTML = item.value;

  const a = debounce((delta, oldDelta, source) => {
    if (source === 'user') {
      const id = quill.container.getAttribute('id').replace('editor_', '')

      builder.handleChangeEditor(id, quill.root.innerHTML)
    }
  }, builder.timeout)

  quill.on('text-change', (delta, oldDelta, source) => a(delta, oldDelta, source))
}

const a4 = {
  height: 1122.52,
  width: 793.701,
  diff: 1.41428
}

function Builder() {
  this.timeout = 2000
  this.data = {}
  this.url = './json/config.json'
  this.user = {
    'title': 'Title'
  }
  this.photo = localStorage.getItem('photo') || '',
  this.resume = {
    height: 0,
    width: 0,
    scale: 1,
    pages_total: 0,
    pages_current: localStorage.getItem('current') || 0,
    pages_init: false
  }

  this.template = localStorage.getItem('template') || "Dublin"
  this.refTemplate = document.getElementById(this.template.toLowerCase())
  this.refCanvas = document.getElementById('resume-canvas')
}

Builder.prototype.photoUploadHTML = function(){
  const self = this
  let html = '';

  html += `<div class="dropped" id="dropped">
             <div class="dropped__image">`;

    if(self.photo !== '') {
      html += ` <img src="${self.photo}" alt="" class="img dropped__picture">`
    }
    else {
      html += ` <svg width="40px" height="40px" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7,35 L33,35 L33,30 L24.9627594,26.8044586 C24.5698041,26.6156354 24.3340309,26.2379889 24.3340309,25.8225778 L24.3340309,24.6518737 C24.3340309,24.3875212 24.412622,24.1231687 24.6090996,23.9343454 C25.9058522,22.5370535 26.770354,20.4599979 27.0061272,19.8557636 C27.0454227,19.7424697 27.1240138,19.6291757 27.2026048,19.5536464 C27.438378,19.3648232 27.8313333,18.8738828 28.1064021,17.7031787 C28.3421753,16.5702393 27.9099244,15.9282403 27.6348557,15.6261232 C27.4776736,15.4750646 27.3990825,15.2862413 27.3990825,15.0974181 L27.3990825,10.2257787 C26.8882406,7.43119483 25.1592371,6.1094322 23.4302337,5.50519785 C21.5833436,4.82543421 18.2825188,4.82543421 16.3963333,5.5429625 C14.7459209,6.18496149 13.056213,7.46895948 12.5846666,10.2257787 L12.5846666,15.0974181 C12.5846666,15.2862413 12.5060755,15.4750646 12.3488934,15.6261232 C12.0738246,15.9282403 11.6415738,16.5702393 11.877347,17.7031787 C12.1131202,18.8738828 12.545371,19.3648232 12.7811442,19.5536464 C12.8597353,19.6291757 12.9383264,19.7424697 12.9776219,19.8557636 C13.2133951,20.4977626 14.0778968,22.4992889 15.3353539,23.8965808 C15.5318315,24.1231687 15.6497181,24.4252858 15.6497181,24.727403 L15.6497181,25.7470485 C15.6497181,26.2379889 15.3746494,26.6534 14.903103,26.8799879 L7,30 L7,35 Z"></path>
                </svg>`
    }

    html += ` </div>
              <div class="dropped__options">`

      if(self.photo !== '') {
        html += `<button class="dropped__link dropped__link--accent" id="dropped-edit-link">Edit photo</button>
                 <button class="dropped__link dropped__link--default" id="dropped-delete-link">Delete photo</button>`
      }
      else {
        html += `<button class="dropped__link dropped__link--accent" id="dropped-add-link">Upload photo</button>`
      }

    html += ` </div>
             </div>`

  return html
}

Builder.prototype.savePDF = function() {
  const HTML_Width = this.refTemplate.offsetWidth;
  const HTML_Height = this.refTemplate.offsetHeight;
  const PDF_Width = HTML_Width;
  const PDF_Height = PDF_Width * a4.diff;

  html2canvas(
    this.refTemplate,
    {
      scale: 2,
      imageTimeout: 0
    }
  ).then(
    (canvas) => {
      canvas.getContext('2d');
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF('p', 'pt',  [PDF_Width, PDF_Height]);

      pdf.addImage(
        imgData,
        'JPG',
        0,
        0,
        HTML_Width,
        HTML_Height
      );

      for (let i = 1; i <= this.resume.pages_total; i++) {
        pdf.addPage();
        pdf.addImage(
          imgData,
          'JPG',
          0,
          -(PDF_Height * i),
          HTML_Width,
          HTML_Height
        );
      }

      pdf.save(`${this.user.title}.pdf`);
    }
  )
}

Builder.prototype.initPages = function() {
  if (!this.resume.pages_init) {

    let HTML_Height = this.refTemplate.offsetHeight;
    const HTML_Width = this.refTemplate.offsetWidth;
    const PDF_Width = HTML_Width;
    const PDF_Height = PDF_Width * a4.diff;

    const total = Math.ceil(HTML_Height / PDF_Height) - 1

    this.resume.pages_total = total

    // $(this.refTemplate).css('height', Math.ceil(HTML_Height / PDF_Height) * a4.height)
    // HTML_Height = Math.ceil(HTML_Height / PDF_Height) * a4.height
    //
    // console.log(HTML_Height)

    if (this.resume.pages_current > total) {
      this.resume.pages_current = total

      localStorage.setItem('current', total)
    }

    this.refCanvas.innerHTML = '';

    html2canvas(
      this.refTemplate,
      {
        scale: 2,
        imageTimeout: 0,
        backgroundColor:	'#fff',
        height: PDF_Height * (Math.ceil(HTML_Height / PDF_Height) + 1)
      }
    ).then(
      (canvas) => {
        canvas.getContext('2d');

        canvas.style = `width: ${PDF_Width}px; transform: translateY(-${localStorage.getItem('current') * PDF_Height}px);`
        // canvas.style = `width: ${PDF_Width}px; transform: translateY(-${this.resume.pages_current * PDF_Height}px);`

        this.resume.pages_init = true
        this.refCanvas.appendChild(canvas)
      }
    )

    this.updateCount()
  }
}

Builder.prototype.updateCount = function () {
  $('#count-current').html(this.resume.pages_current)
  $('#count-total').html(this.resume.pages_total)
}

Builder.prototype.nextPage = function() {
  if (this.resume.pages_current < this.resume.pages_total) {

    ++this.resume.pages_current
    localStorage.setItem('current', this.resume.pages_current)

    const HTML_Width = this.refTemplate.offsetWidth;
    const PDF_Width = HTML_Width;
    const PDF_Height = PDF_Width * a4.diff;

    this.refCanvas.innerHTML = '';

    html2canvas(
      this.refTemplate,
      {
        scale: 2,
        imageTimeout: 0,
        backgroundColor: '#fff',
        height: a4.height * (this.resume.pages_total + 1)
      }
    ).then(
      (canvas) => {
        canvas.getContext('2d');

        canvas.style = `width: ${PDF_Width}px; transform: translateY(-${this.resume.pages_current * PDF_Height}px);`

        this.refCanvas.appendChild(canvas)
        this.updateCount()
      }
    )
  }
}

Builder.prototype.prevPage = function() {
  if (this.resume.pages_current > 0) {

    --this.resume.pages_current
    localStorage.setItem('current', this.resume.pages_current)

    const HTML_Width = this.refTemplate.offsetWidth;
    const PDF_Width = HTML_Width;
    const PDF_Height = PDF_Width * a4.diff;

    this.refCanvas.innerHTML = '';

    html2canvas(
      this.refTemplate,
      {
        scale: 2,
        imageTimeout: 0,
        backgroundColor: '#fff',
        height: a4.height * (this.resume.pages_total + 1)
      }
    ).then(
      (canvas) => {
        canvas.getContext('2d');

        canvas.style = `width: ${PDF_Width}px; transform: translateY(-${this.resume.pages_current * PDF_Height}px);`

        this.refCanvas.appendChild(canvas)
        this.updateCount()
      }
    )
  }
}

Builder.prototype.resizeCanvas = function() {
  const resizeObserver = new ResizeObserver((event) => {
    const width = event[0].contentBoxSize[0].inlineSize
    const height = event[0].contentBoxSize[0].blockSize

    if (height < width * a4.diff) {
      this.resume.height = height
      this.resume.width = height / a4.diff
      this.resume.scale = height / a4.height
    }
    else {
      this.resume.height = width * a4.diff
      this.resume.width = width
      this.resume.scale = width / a4.width
    }

    this.initCanvas()
  });

  resizeObserver.observe(document.getElementById('right'));
}

Builder.prototype.initCanvas = function() {
  $('#resume').css({
    "width": this.resume.width,
    "height": this.resume.height
  });

  $('#resume-block').css({
    "width": a4.width,
    "height": a4.height
  });

  $('#resume-canvas').css({
    "width": a4.width,
    "height": a4.height,
    "transform": `scale(${this.resume.scale})`
  });
}

Builder.prototype.updateCanvas = function() {
  this.resume.pages_init = false
  this.initPages()
}

Builder.prototype.updateCanvasData = function(remove) {
  const block = document.getElementById(this.template.toLowerCase())
  const user = JSON.parse(localStorage.getItem('user'))

  if (remove) {
    block.querySelector(`#t-${remove}`).innerHTML = ''
  }

  for (let key in user) {
    if (block.querySelector(`#t-${key}`)) {
      if (user[key].hasOwnProperty('label')) {
        block.querySelector(`#t-${key}`).innerHTML = user[key].label
      }
      else {
        block.querySelector(`#t-${key}`).innerHTML = user[key]
      }
    }
  }

  $.each(this.data.fieldset, function (index, item) {
    $(`#t-section-${index}`).html(item.name)
  })
}

Builder.prototype.updateCanvasPhoto = function() {
  $('#t-photo').attr('src', builder.photo)
}

Builder.prototype.handleChange = function(e) {
  const {name, value} = e.currentTarget;
  let remove

  if (value === '') {
    remove = name
    delete this.user[name]
  }
  else {
    this.user[name] = value
  }

  if (e.currentTarget.type === 'select-one') {
    this.user[name] = {
      value,
      label: e.currentTarget.options[e.currentTarget.selectedIndex].text
    }
  }

  localStorage.setItem('user', JSON.stringify(this.user))


  this.updateCanvasData(remove)
  this.updateCanvas()
}

Builder.prototype.handleChangeEditor = function(name, value) {
  this.user[name] = value

  localStorage.setItem('user', JSON.stringify(this.user))

  this.updateCanvasData()
  this.updateCanvas()
}

Builder.prototype.drawConfig = function() {
  const self = this
  let html = ''
  const editor = []

  const storage = JSON.parse(localStorage.getItem('user'))

  this.user.title = (storage && storage.hasOwnProperty('title')) ? storage['title'] : this.user.title

  $.each(self.data.fieldset, function (c_index, c_item) {
    html += `<div class="filter">
              <h4 class="filter__title">${c_item.name}</h4>
              <div class="filter__body">`;

              if(c_index === 0) {
                html += `<div class="filter__item" id="filter-photo-editor">${self.photoUploadHTML()}</div>`
              }

              $.each(c_item.fields, function (s_index, s_item) {

                html += `<div class="filter__item ${s_item.type === 'textarea' && 'filter__item--wide'}">
                            <p class="filter__label">${s_item.label}</p>`

                if (s_item.type === 'select') {
                  if (storage && storage.hasOwnProperty(s_item.name)) {
                    self.user[s_item.name] = storage[s_item.name]
                  }
                  else {
                    const find = s_item.options.find(function (e) {
                      return e.selected
                    })

                    self.user[s_item.name] = {
                      label: find.name,
                      value: find.value
                    }
                  }
                }
                else {
                  if (storage && storage.hasOwnProperty(s_item.name)) {
                    self.user[s_item.name] = storage[s_item.name]
                  }
                  else {
                    self.user[s_item.name] = s_item.value
                  }
                }

                if (s_item.type === 'text' || s_item.type === 'email') {
                  html += `<input type="${s_item.type}" name="${s_item.name}" value="${self.user[s_item.name] || s_item.value}" required="${s_item.required}" class="field js-field" autocomplete="true"/>`;
                }
                else if (s_item.type === 'textarea') {
                  html += `<div class="editor" id="editor_${s_item.name}"></div>`

                  editor.push({
                    el: `editor_${s_item.name}`,
                    placeholder: s_item.placeholder,
                    value: self.user[s_item.name] || s_item.value
                  })

                  // html += `<textarea class="textarea" name="${s_item.name}" required="${s_item.required}" autocomplete="true">${self.user[s_item.name] || s_item.value}</textarea>`
                }
                else if (s_item.type === 'select') {
                  html += `<select class="select" name="${s_item.name}" required="${s_item.required}">`;

                          $.each(s_item.options, function (o_index, o_item) {
                            const selected = self.user[s_item.name].value === o_item.value

                            if (selected) {
                              html += `<option value="${o_item.value}" selected="${selected}">${o_item.name}</option>`
                            }
                            else {
                              html += `<option value="${o_item.value}">${o_item.name}</option>`
                            }
                          })

                  html += `</select>`
                }

                html += `</div>`
              })

    html +=  `</div>
          </div>`;
  });

  localStorage.setItem('user', JSON.stringify(this.user));

  this.refTemplate = document.getElementById(this.template.toLowerCase())

  this.updateCanvasData()
  this.updateCanvasPhoto()
  this.initPages();

  $('#filters-list').html(html)
  $('#filters-title').val(this.user.title)

  $.each(editor, function (index, item) {
    initializeQuill(item)
  })
}

Builder.prototype.getConfig = function() {
  const self = this

  $.ajax({
    url: self.url,
    method: "GET",
    dataType: "json",
    success (data) {
      self.data = data;
      self.drawConfig()
    },
    error(xhr, status, error){
      console.log(xhr.responseText, status, error);
    }
  });
}

Builder.prototype.initTemplate = function() {
  const self = this

  $.ajax({
    url: `./${this.template}/${this.template}.html`,
    async: false,
    method: "GET",
    success(data) {
      $('#resume-block').html(data)

      self.refTemplate = document.getElementById($('#resume-block').find('.page').attr('id'))
    },
    error(xhr, status, error) {
      console.log(xhr.responseText, status, error);
    }
  });
}

Builder.prototype.initCard = function() {
  const active = localStorage.getItem('template') || this.template

  $(`[data-name="${active}"]`).addClass('card--active')
}

const builder = new Builder();

builder.initTemplate()
builder.getConfig()
// builder.initCanvas()
builder.resizeCanvas()
builder.initCard()

$('#filters').on('change', 'input', function(e) {
  builder.handleChange(e)
});

$('#filters').on('change', 'select', function(e) {
  builder.handleChange(e)
});

$('.js-card').on('click', function() {
  $('.js-card').removeClass('card--active')

  const a = $(this).attr('data-name')

  builder.template = a
  localStorage.setItem('template', a)

  builder.initCard()
  builder.initTemplate()
  builder.updateCanvasData()
  builder.updateCanvasPhoto()
  builder.updateCanvas()
})

$('#count-next').on('click', function() {
  builder.nextPage()
})

$('#count-prev').on('click', function() {
  builder.prevPage()
})

$('#button-save').on('click', function() {
  builder.savePDF()
})

$('#button-send').on('click', function() {
  console.log(builder.user)
});

$('#dropped-modal-input').on('change', function() {
  let reader = new FileReader();

  reader.onload = () => {
    $('#dropped-modal-uploading').hide()
    $('#dropped-modal-edit').show()
    $('#dropped-modal-image').attr('src', reader.result.toString())

    localStorage.setItem('o_photo', reader.result.toString())

    initCropped();
  };

  reader.readAsDataURL($('#dropped-modal-input')[0].files[0]);
});

$('#dropped-modal-new-input').on('change', function() {
  let reader = new FileReader();

  reader.onload = () => {
    $('#dropped-modal-image').attr('src', reader.result.toString())

    localStorage.setItem('o_photo', reader.result.toString())

    if (cropper) {
      cropper.destroy()
    }

    $('#dropped-modal-uploading').hide()
    $('#dropped-modal-edit').show()
    $('#dropped-modal-image').attr('src', reader.result.toString())

    initCropped();
  };

  reader.readAsDataURL($('#dropped-modal-new-input')[0].files[0]);
});

$('#dropped-modal-button').on('click', function() {
  cropper.getCroppedCanvas(
    {
      fillColor: '#fff',
      imageSmoothingQuality: 'high',
    }
  )

  const path = cropper.getCroppedCanvas().toDataURL()

  builder.photo = path
  localStorage.setItem('photo', path)

  $('#dropped-modal').toggleClass('dropped-modal--active')
  $('#dropped-modal-uploading').show()
  $('#dropped-modal-edit').hide()
  $('#filter-photo-editor').html(builder.photoUploadHTML())

  builder.updateCanvasPhoto()

  setTimeout(() => {
    builder.updateCanvas()
  }, 500);
});


$('body').on('click', '#dropped-add-link', function() {
  $('#dropped-modal').toggleClass('dropped-modal--active')
});

$('body').on('click', '#dropped-edit-link', function() {
  $('#dropped-modal').toggleClass('dropped-modal--active')

  $('#dropped-modal-uploading').hide()
  $('#dropped-modal-edit').show()

  if (!cropper) {
    $('#dropped-modal-image').attr('src', localStorage.getItem('o_photo'))

    initCropped();
  }
});

$('body').on('click', '#dropped-delete-link', function() {
  builder.photo = ''
  localStorage.setItem('photo', '')
  localStorage.setItem('o_photo', '')

  builder.updateCanvasPhoto()
  builder.updateCanvas()

  if(cropper) cropper.destroy()

  $('#filter-photo-editor').html(builder.photoUploadHTML())
  $('#dropped-modal-button').addClass('dropped-modal__button--disabled')
});


$('.js-cropped-button').on('click', function (){
  $('.js-cropped-button').removeClass('btn-group__button--active')
  $(this).toggleClass('btn-group__button--active')
})

$('.js-cropped-button-move').on('click', function (){
  const way = $(this).attr('data-style')

  if (cropper) {

    if(way === 'top') {
      cropper.move(0, -10)
    }
    else if(way === 'bottom') {
      cropper.move(0, 10)
    }
    else if(way === 'left') {
      cropper.move(-10, 0)
    }
    else if(way === 'right') {
      cropper.move(10, 0)
    }
  }
})

$('.js-cropped-button-zoom').on('click', function (){
  const way = $(this).attr('data-style')

  if (cropper) {

    if(way === 'up') {
      cropper.zoom(0.1)
    }
    else if(way === 'down') {
      cropper.zoom(-0.1)
    }
  }
})

$('.js-cropped-button-rotate').on('click', function (){
  const way = $(this).attr('data-style')

  if (cropper) {

    if (way === 'left') {
      cropper.rotate(-5)
    }
    else if (way === 'right') {
      cropper.rotate(5)
    }
  }
})

$('.js-cropped-button-move').on('click', function (){
  if (cropper) {
    cropper.setDragMode('move')
  }
})

$('.js-cropped-button-crop').on('click', function (){
  if (cropper) {
    cropper.setDragMode('crop')
  }
})

$('#dropped-modal-close').on('click', function() {
  $('#dropped-modal').toggleClass('dropped-modal--active')
})
