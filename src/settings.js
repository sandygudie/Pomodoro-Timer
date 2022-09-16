import { timer, currentSettings } from './timer.js'
import { states } from './states.js'
let modal = document.querySelector('.modal')
let setting_btn = document.querySelector('.setting_btn')
let closeButton = document.querySelector('.close-button')
let pomodoroMins = document.querySelector('#pomodoro_mins')
let shortMins = document.querySelector('#short_mins')
let longMins = document.querySelector('#long_mins')
let applySettingBtn = document.querySelector('.apply_btn')
let fontSelection = document.querySelector('.font_types')
let colorSelection = document.querySelector('.color_types')
let selected_font
let selected_color
let font_id
let color_id

export const settings = {
  settingsHandler() {
    setting_btn.addEventListener('click', this.toggleModal)
    closeButton.addEventListener('click', this.toggleModal)
    window.addEventListener('click', this.windowOnClick)
    applySettingBtn.addEventListener('click', this.applySettings)

    fontSelection.addEventListener('click', (e) => {
      if (e.target.tagName == 'SPAN') {
        selected_font = getComputedStyle(e.target).fontFamily
        font_id = e.target.getAttribute('id')
        this.toggleFontOrColor(fontSelection, font_id)
      }
    })
    colorSelection.addEventListener('click', (e) => {
      if (e.target.tagName == 'SPAN') {
        selected_color = getComputedStyle(e.target).backgroundColor
        color_id = e.target.getAttribute('id')
        this.toggleFontOrColor(colorSelection, color_id)
      }
    })
  },

  toggleModal() {
    pomodoroMins.value = currentSettings.setting.length.pomodoro / 60
    shortMins.value = currentSettings.setting.length.shortbreak / 60
    longMins.value = currentSettings.setting.length.longbreak / 60

    // indicate the existing selected font and color
    applySettingBtn.style.backgroundColor = currentSettings.setting.colorSelected.type

    settings.toggleFontOrColor(colorSelection, currentSettings.setting.colorSelected.id)
    settings.toggleFontOrColor(fontSelection, currentSettings.setting.fontSelected.id)
    modal.classList.toggle('show-modal')
    modal.classList.toggle('add_animation')
  },

  windowOnClick(event) {
    if (event.target === modal) {
      settings.toggleModal()
    }
  },

  toggleFontOrColor(element, id) {
    element === colorSelection
      ? Array.from(element.children).filter((child) => {
          child.id === id
            ? ((child.lastChild.style.display = 'block'),
              (currentSettings.setting.colorSelected.id = id))
            : (child.lastChild.style.display = 'none')
        })
      : element === fontSelection
      ? Array.from(element.children).filter((child) => {
          child.id === id
            ? ((child.style.cssText += `background-color:black; color:white`),
              (currentSettings.setting.fontSelected.id = id))
            : (child.style.backgroundColor = 'hsl(227deg, 100%, 92%)')
        })
      : null
  },

  applySettings() {
    let pomodoroMinsVal = pomodoroMins.value * 60
    let shortMinsVal = shortMins.value * 60
    let longMinsVal = longMins.value * 60
    const formSettings = {
      length: {
        pomodoro: pomodoroMinsVal,
        shortbreak: shortMinsVal,
        longbreak: longMinsVal,
      },
      colorSelected: {
        id: currentSettings.setting.colorSelected.id,
        type: selected_color || currentSettings.setting.colorSelected.type,
      },
      fontSelected: {
        id: font_id || currentSettings.setting.fontSelected.id,
        type: selected_font || currentSettings.setting.fontSelected.type,
      },
    }
    currentSettings.setting = { ...currentSettings.setting, ...formSettings }
    states.current = currentSettings
    states.updateStorage()
    timer.setDefault()
    timer.loadCurrentTimer()
    settings.toggleModal()
  },
}
