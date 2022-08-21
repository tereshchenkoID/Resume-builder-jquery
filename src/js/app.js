/* eslint-disable */

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import Quill from 'Quill';

import Cropper from 'cropperjs';

import qrCode from 'qr-code-and-vcard/dist/QrCode.min';

let cropper

function setHeight() {
  const HEIGHT = document.querySelectorAll('.page')[1].offsetHeight

  const pages = Math.ceil(HEIGHT / 1122.52)

  document.querySelectorAll('.page')[0].style.height = `${pages * 1122.5}px`
  document.querySelectorAll('.page')[1].style.height = 'unset'
}

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

// function debounce(func, timeout = 300){
//   let timer;
//   return (...args) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => { func.apply(this, args); }, timeout);
//   };
// }

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

  quill.on('text-change', (delta, oldDelta, source) => {
    if (source === 'user') {
      const id = quill.container.getAttribute('id').replace('editor_', '')

      builder.handleChangeEditor(id, quill.root.innerHTML, item)
    }
  })
}

const a4 = {
  height: 1122.52,
  width: 793.701,
  diff: 1.41428
}

function Builder() {
  this.data = {}
  this.templates = {}
  this.urlConfig = './json/config.json'
  this.urlTemplates = './json/templates.json'
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

  this.refBlock = $('#resume-block')
  this.refBlockTemplate = this.refBlock.find(`#${this.template.toLowerCase()}`)[0]

  this.refCanvas = $('#resume-canvas')
  this.refCanvasTemplate = this.refCanvas.find(`#${this.template.toLowerCase()}`)[0]
}

Builder.prototype.photoUploadHTML = function(){
  const self = this
  const disabled = !!this.refBlockTemplate.querySelector('#t-photo')
  let html = ''

  html += `<div class="dropped ${!disabled ? 'dropped--disabled' : ''}" id="dropped">
             <div class="dropped__alert">This template doesn't support photo upload</div>
             <div class="dropped__container">
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
              </div>
             </div>`

  return html
}

Builder.prototype.savePDF = function() {
  // this.initQR()
  this.refCanvas.html(this.refBlock.html())

  const canvasTemplate = $(this.refCanvas).find(`#${this.template.toLowerCase()}`)
  const HTML_Width = canvasTemplate.outerWidth();
  const HTML_Height = canvasTemplate.outerHeight();
  const PDF_Width = HTML_Width;
  const PDF_Height = PDF_Width * a4.diff;

  const element = this.refCanvas.find(`#${this.template.toLowerCase()}`)[0]

  html2canvas(
    element,
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
    setHeight()

    const canvas = $(this.refCanvas).find(`#${this.template.toLowerCase()}`)
    const HTML_Height = canvas.outerHeight();
    const HTML_Width = canvas.outerWidth();
    const PDF_Width = HTML_Width;
    const PDF_Height = PDF_Width * a4.diff;

    const total = Math.ceil(HTML_Height / PDF_Height) - 1

    this.resume.pages_total = total

    if (this.resume.pages_current > total) {
      this.resume.pages_current = total

      localStorage.setItem('current', total)
    }

    $(this.refBlockTemplate).css({'transform': `translateY(-${localStorage.getItem('current') * PDF_Height}px)`})

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

    const canvas = $(this.refCanvas).find(`#${this.template.toLowerCase()}`)
    const HTML_Width = canvas.outerWidth();
    const PDF_Width = HTML_Width;
    const PDF_Height = PDF_Width * a4.diff;

    $(this.refBlockTemplate).css({'transform': `translateY(-${localStorage.getItem('current') * PDF_Height}px)`})
    // this.refBlockTemplate.style = `transform: translateY(-${localStorage.getItem('current') * PDF_Height}px);`


    // const preview = $(this.refBlock).find(`#${this.template.toLowerCase()}`)
    // preview.css(`height`, `${Math.ceil(canvas.outerHeight() / (canvas.outerWidth() * a4.diff)) * a4.height}px`)

    this.updateCount()
  }
}

Builder.prototype.prevPage = function() {
  if (this.resume.pages_current > 0) {

    --this.resume.pages_current
    localStorage.setItem('current', this.resume.pages_current)

    const canvas = $(this.refCanvas).find(`#${this.template.toLowerCase()}`)
    const HTML_Width = canvas.outerWidth();
    const PDF_Width = HTML_Width;
    const PDF_Height = PDF_Width * a4.diff;

    $(this.refBlockTemplate).css({'transform': `translateY(-${localStorage.getItem('current') * PDF_Height}px)`})
    // this.refBlockTemplate.style = `transform: translateY(-${localStorage.getItem('current') * PDF_Height}px);`

    // const preview = $(this.refBlock).find(`#${this.template.toLowerCase()}`)
    // preview.css(`height`, `${Math.ceil(canvas.outerHeight() / (canvas.outerWidth() * a4.diff)) * a4.height}px`)

    this.updateCount()
  }
}

Builder.prototype.resizeCanvas = function() {
  const resizeObserver = new ResizeObserver((event) => {
    const width = event[0].contentBoxSize[0].inlineSize
    const height = event[0].contentBoxSize[0].blockSize - 92

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
    "height": a4.height,
    "transform": `scale(${this.resume.scale})`
  });

  $('#resume-canvas').css({
    "width": a4.width,
    "height": a4.height
  });
}

Builder.prototype.updateCanvas = function() {
  this.resume.pages_init = false
  this.initPages()
}

Builder.prototype.updateCanvasData = function(remove) {
  const user = JSON.parse(localStorage.getItem('user'))

  if (remove) {
    this.refBlockTemplate.querySelector(`#t-${remove}`).innerHTML = ''
  }

  for (let key in user) {
    if (this.refBlockTemplate.querySelector(`#t-${key}`)) {
      if (user[key].hasOwnProperty('label')) {
        this.refBlockTemplate.querySelector(`#t-${key}`).innerHTML = user[key].label
      }
      else {
        this.refBlockTemplate.querySelector(`#t-${key}`).innerHTML = user[key]
      }
    }
  }

  $.each(this.data.fieldset, function (index, item) {
    $(`#t-section-${index}`).html(item.name)
  })

  this.refCanvas.html(this.refBlock.html())
}

Builder.prototype.updateCanvasPhoto = function() {
  if (this.refBlockTemplate.querySelector('#t-photo')) {

    if (builder.photo.length !== 0) {
      this.refBlockTemplate.querySelector('#t-photo').innerHTML = `<img src="${builder.photo}">`
    }
    else {
      this.refBlockTemplate.querySelector('#t-photo').innerHTML = ''
    }

    this.refCanvas.html(this.refBlock.html())
  }
}

Builder.prototype.handleChange = function(e) {
  const {name, value} = e.currentTarget;
  const section = e.currentTarget.getAttribute('data-section') || false
  const count = e.currentTarget.getAttribute('data-count') || false
  const index = e.currentTarget.getAttribute('data-index') || false
  let remove

  if (value === '') {
    // add condition for delete
    remove = name
    delete this.user[name]
  }
  else {
    if (section) {
      this.user[section][count][index] = value
    }
    else {
      if (e.currentTarget.type !== 'select-one') {
        this.user[name] = value
      }
    }
  }

  if (e.currentTarget.type === 'select-one') {
    if (section) {
      this.user[section][count][index] = value
    }
    else {
      this.user[name] = {
        value,
        label: e.currentTarget.options[e.currentTarget.selectedIndex].text
      }
    }
  }

  localStorage.setItem('user', JSON.stringify(this.user))

  this.updateCanvasData(remove)
  this.updateCanvas()
  setHeight()
}

Builder.prototype.handleChangeEditor = function(name, value, e) {
  const el = $(`#${e.el}`)[0]
  const section = el.getAttribute('data-section') || false
  const count = el.getAttribute('data-count') || false
  const index = el.getAttribute('data-index') || false

  if (section) {
    this.user[section][count][index] = value
  }
  else {
    this.user[name] = value
  }

  localStorage.setItem('user', JSON.stringify(this.user))

  this.updateCanvasData()
  this.updateCanvas()
}

Builder.prototype.addDublicate = function(el) {
  const self = this
  const parent = el.closest('.js-filter')
  const count = parent.getAttribute('data-count')
  const section = parent.getAttribute('data-section')

  self.user[section].push([
    "1",
    "2"
  ])

  console.log(self.data.fieldset[count].fields)

  const content = `<div class="filter__group filter__group--active js-filter-group">
                     <p>Test</p>
                   </div>`;

  el.insertAdjacentHTML("beforebegin", content)
}

Builder.prototype.setDublicate = function() {
  const self = this
  const storage = JSON.parse(localStorage.getItem('user'))

  $.each(self.data.fieldset, function (c_index, c_item) {

    if (c_item.dublicate) {
      $.each(c_item.fields, function (s_index, s_item) {
        const name = c_item.name.replace(' ', '_').toLowerCase()
        const ob = {
          [name]: []
        }

        if (storage && storage.hasOwnProperty(name)) {
          self.user[name] = storage[name]
        }
        else {
          $.each(c_item.row, function (r_index, r_item) {
            ob[name].push(r_item)
          })

          self.user[name] = ob[name]
        }
      })
    }
    else {
      $.each(c_item.fields, function (s_index, s_item) {
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
      })
    }
  })

  localStorage.setItem('user', JSON.stringify(this.user))
}

Builder.prototype.drawConfig = function() {
  let html = ''
  const self = this
  const editor = []

  this.setDublicate()

  const storage = JSON.parse(localStorage.getItem('user'))
  this.user.title = (storage && storage.hasOwnProperty('title')) ? storage['title'] : this.user.title

  $.each(self.data.fieldset, function (c_index, c_item) {
    const name = c_item.name.replace(' ', '_').toLowerCase()

    html += `<div class="filter js-filter ${c_item.open ? 'filter--active' : ''}" data-count="${c_index}" data-section="${name}">
              <h4 class="filter__title js-filter-title">
                <span>${c_item.name}</span>
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.431 7.257l1.352-1.474 5.893 5.48a1 1 0 0 1 0 1.474l-5.893 5.45-1.352-1.475L14.521 12 9.43 7.257z"></path>
                </svg>
              </h4>
              <div class="filter__body">`;

              if(c_index === 0) {
                html += `<div class="filter__item" id="filter-photo-editor">${self.photoUploadHTML()}</div>`
              }

              if (c_item.dublicate) {

                if (c_item.row && c_item.row.length > 0) {
                  $.each(c_item.row, function (r_index, r_item) {
                    html += `<div class="filter__group js-filter-group">
                              <div class="filter__header">
                                  <h6  class="filter__head">${r_item[0] || 'Not specified'}</h6>`

                                  if(r_item.length > 4) {
                                    html += `<p class="filter__subtitle">${r_item[2]}-${r_item[3]}</p>`
                                  }

                         html += `
                                  <button
                                    data-section="${name}"
                                    data-count="${r_index}"
                                    class="filter__button filter__button--remove js-filter-remove"
                                 >
                                    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M14 6h3v2H3V6h3V3c0-.55228.44772-1 1-1h6c.5523 0 1 .44772 1 1v3zm-9 4h10v8H5v-8zm2 6h6v-4H7v4zm5-10V4H8v2h4z" fill="#fff"></path>
                                    </svg>
                                 </button>
                                 <button
                                    class="filter__button filter__button--toggle js-filter-toggle"
                                 >
                                   <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M9.431 7.257l1.352-1.474 5.893 5.48a1 1 0 0 1 0 1.474l-5.893 5.45-1.352-1.475L14.521 12 9.43 7.257z"></path>
                                   </svg>
                                 </button>
                              </div>
                             <div class="filter__dropdown js-filter-dropdown">`

                    $.each(r_item, function (a_index, a_item) {
                      const item = c_item.fields[a_index]

                      if (item.type === 'text' || item.type === 'email' || item.type === 'date') {
                        html += `
                            <div class="filter__item ${item.type === 'date' ? 'filter__item--tiny' : ''}">
                                <p class="filter__label">${item.label}</p>
                                <input
                                  type="${item.type}"
                                  data-section="${name}"
                                  data-count="${r_index}"
                                  data-index="${a_index}"
                                  name="${item.name}"
                                  value="${storage[name].length > 0 ? storage[name][r_index][a_index] : a_item}"
                                  required="${item.required}"
                                  pattern="${item.validation}"
                                  class="field js-field"
                                  autocomplete="true"
                                />
                            </div>`;
                      }
                      else if (item.type === 'textarea') {
                        html += `
                            <div class="filter__item filter__item--wide">
                              <p class="filter__label">${item.label}</p>
                              <div class="editor"
                                data-section="${name}"
                                data-count="${r_index}"
                                data-index="${a_index}"
                                id="editor_${item.name}_${r_index}_${a_index}"
                                pattern="${item.validation}">
                              </div>
                            </div>`

                        editor.push({
                          el: `editor_${item.name}_${r_index}_${a_index}`,
                          placeholder: item.placeholder,
                          value: storage[name].length > 0 ? storage[name][r_index][a_index] : a_item
                        })
                      }
                      else if (item.type  === 'select') {
                        html += `<div class="filter__item">
                                  <p class="filter__label">${item.label}</p>
                                  <select class="select"
                                    data-section="${name}"
                                    data-count="${r_index}"
                                    data-index="${a_index}"
                                    name="${item.name}"
                                    required="${item.required}"
                                  >`;

                                  $.each(item.options, function (o_index, o_item) {
                                    const value = storage[name].length > 0 ? storage[name][r_index][a_index] : a_item
                                    const selected = value === o_item.value
                                    const disabled = o_item.value === "-1" ? 'disabled' : ''

                                    if (selected) {
                                      html += `<option
                                                 value="${o_item.value}"
                                                 selected="${selected}"
                                                 ${disabled}
                                               >
                                                   ${o_item.name}
                                               </option>`
                                    }
                                    else {
                                      html += `<option
                                                 value="${o_item.value}"
                                                 ${disabled}
                                               >
                                                   ${o_item.name}
                                               </option>`
                                    }
                        })

                        html += `</select>
                              </div>`
                      }
                    })

                    html += `</div>
                          </div>`;
                  })
                }

                html += `
                    <a class="filter__link js-filter-link">
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <polygon points="13 11 17 11 17 13 13 13 13 17 11 17 11 13 7 13 7 11 11 11 11 7 13 7" fill="currentColor"></polygon>
                        </svg>
                        <span>Add one more</span>
                    </a>`;
              }
              else {
                $.each(c_item.fields, function (s_index, s_item) {
                  html += `<div class="filter__item ${s_item.type === 'textarea' ? 'filter__item--wide' : ''}">
                              <p class="filter__label">${s_item.label}</p>`

                  if (s_item.type === 'text' || s_item.type === 'email' || s_item.type === 'date') {
                    html += `<input type="${s_item.type}"
                                name="${s_item.name}"
                                value="${self.user[s_item.name] || s_item.value}"
                                required="${s_item.required}"
                                pattern="${s_item.validation}"
                                class="field js-field"
                                autocomplete="true"
                              />`;
                  }
                  else if (s_item.type === 'textarea') {
                    html += `<div class="editor"
                                id="editor_${s_item.name}"
                                pattern="${s_item.validation}"
                             >
                             </div>`

                    editor.push({
                      el: `editor_${s_item.name}`,
                      placeholder: s_item.placeholder,
                      value: self.user[s_item.name] || s_item.value
                    })
                  }
                  else if (s_item.type === 'select') {
                    html += `<select class="select" name="${s_item.name}" required="${s_item.required}">`;

                    $.each(s_item.options, function (o_index, o_item) {
                      const selected = self.user[s_item.name].value === o_item.value
                      const disabled = o_item.value === "-1" ? 'disabled' : ''

                      if (selected) {
                        html += `<option
                                    value="${o_item.value}"
                                    selected="${selected}"
                                    ${disabled}
                                 >
                                     ${o_item.name}
                                 </option>`
                      }
                      else {
                        html += `<option
                                    value="${o_item.value}"
                                    ${disabled}
                                >
                                    ${o_item.name}
                                </option>`
                      }
                    })

                    html += `</select>`
                  }

                  html += `</div>`
                })
              }

    html +=  `</div>
          </div>`;
  });

  localStorage.setItem('user', JSON.stringify(this.user));

  this.updateCanvasData()
  this.updateCanvasPhoto()
  // this.initQR()

  $('#filters-list').html(html)
  $('#filters-title').val(this.user.title)

  if ($('#content-main').length > 0) {
    $.each(editor, function (index, item) {
      initializeQuill(item)
    })
  }

  setTimeout(() => {
    this.updateCanvas();
  }, 500);

  console.log(this.user)
}

Builder.prototype.getConfig = function() {
  const self = this

  $.ajax({
    url: self.urlConfig,
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
    url: `./${self.template}/${self.template}.html`,
    async: false,
    method: "GET",
    success(data) {
      self.refBlock.html(data)
      self.refCanvas.html(self.refBlock.html())

      // self.refCanvas.html(data)
      // self.refBlock.html(self.refCanvas.html())

      self.refBlockTemplate = self.refBlock.find(`#${self.template.toLowerCase()}`)[0]
      self.refCanvasTemplate = self.refCanvas.find(`#${self.template.toLowerCase()}`)[0]

      setTimeout(() => {
        self.refBlock.css('opacity', '1')
      }, 500);
    },
    error(xhr, status, error) {
      console.log(xhr.responseText, status, error);
    }
  });
}

Builder.prototype.drawTemplatesList = function() {
  let html = ''
  const self = this
  const active = localStorage.getItem('template') || this.template

  $.each(self.templates.fieldset, function (index, item) {
    html += `<div class="card js-card ${item.name === active ? 'card--active' : ''}" data-name="${item.name}">
                <p class="card__text">${item.name}</p>
                <div class="card__preview">
                  <div class="card__icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.6917162,8.75389189 L18.3082838,10.2461081 L12.3082838,16.7461081 C11.8845221,17.2051833 11.1639539,17.2195889 10.7221825,16.7778175 L6.22218254,12.2778175 L7.77781746,10.7221825 L11.4682653,14.4126304 L16.6917162,8.75389189 Z"></path>
                    </svg>
                  </div>
                  <div class="card__image" style="background-image: url('${item.img}')"></div>
                </div>
              </div>`
  })

  $('#list').html(html)
}

Builder.prototype.getTemplatesList = function() {
  const self = this

  $.ajax({
    url: self.urlTemplates,
    method: "GET",
    dataType: "json",
    success (data) {
      self.templates = data;
      self.drawTemplatesList()
    },
    error(xhr, status, error){
      console.log(xhr.responseText, status, error);
    }
  });
}

Builder.prototype.initCard = function() {
  const active = localStorage.getItem('template') || this.template

  $(`[data-name="${active}"]`).addClass('card--active')
}

Builder.prototype.initQR = function() {

  const testCard = {
    version: '3.0',
    lastName: this.user.last_name,
    firstName: this.user.first_name,
    namePrefix: 'MR',
    gender: 'M',
    homePhone: this.user.phone,
    birthday: this.user.date_birth,
    email: this.user.email,
    homeAddress: {
      label: 'Home Address',
      street: this.user.address,
      city: this.user.city,
      postalCode: this.user.postal_code,
      countryRegion:  this.user.country,
    },
  }

  this.refBlockTemplate.querySelector('#t-qr-code').innerHTML = qrCode.createVCardQr(
    testCard,
    {
      typeNumber: 15,
      cellSize: 10
    }
  )
}

const builder = new Builder();

builder.initTemplate()
builder.getTemplatesList()
builder.getConfig()
builder.resizeCanvas()


$('#filters').on('input', 'input', function(e) {
  builder.handleChange(e)
});

$('#filters').on('change', 'select', function(e) {
  builder.handleChange(e)
});

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
});

$('#dropped-modal-close').on('click', function() {
  $('#dropped-modal').toggleClass('dropped-modal--active')
})

$('body').on('click', '.js-card', function() {
  $('.js-card').removeClass('card--active')

  const a = $(this).attr('data-name')

  builder.template = a
  localStorage.setItem('template', a)

  builder.initCard()
  builder.initTemplate()

  setTimeout(() => {
    builder.updateCanvasData()
    builder.updateCanvasPhoto()
    // builder.initQR()
    builder.updateCanvas()
  }, 500);
})

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

  if(cropper) cropper.destroy()

  $('#filter-photo-editor').html(builder.photoUploadHTML())
  $('#dropped-modal-button').addClass('dropped-modal__button--disabled')
});

$('body').on('click', '.js-filter-title', function() {
  $(this).closest('.js-filter').toggleClass('filter--active')
});

// Editor Events
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
// End Editor Events


function initLanguage() {
  const select = $('.js-language-select').find('span')
  const set = localStorage.getItem('language') || false
  let find;

  if (set) {
    find = $(`.language__item[data-lang="${set}"]`)
    select.text(find.text())
    select[0].setAttribute('data-lang', set)
  }
  else {
    find = $('.language__item')[0]
    select.text($(find).text())
    select[0].setAttribute('data-lang', find.getAttribute('data-lang'))
  }

  $(find).addClass('language__item--active')
}

initLanguage()

$('.js-language').click(function() {
  $(this).toggleClass('language--active')
})

$('.js-language-item').click(function() {
  const select = $('.js-language-select').find('span')
  $('.language__item').removeClass('language__item--active')
  $(this).addClass('language__item--active')

  select.text($(this).text())
  select[0].setAttribute('data-lang', $(this)[0].getAttribute('data-lang'))

  localStorage.setItem('language', $(this)[0].getAttribute('data-lang'))
})


$('body').on('click', '.js-filter-toggle', function() {
  $(this).closest('.js-filter-group').toggleClass('filter__group--active')
})

$('body').on('click', '.js-filter-remove', function() {
  const el = $(this)[0]
  $(this).parent('.js-filter-group').remove()

  // const section = el.getAttribute('data-section') || false
  // const count = el.getAttribute('data-count') || false
  //
  // builder.user[section].splice(builder.user[section][count].indexOf(), 1)
  // console.log(builder.user)
})

$('body').on('click', '.js-filter-link', function() {
  const el = $(this)[0]

  builder.addDublicate(el)
})
