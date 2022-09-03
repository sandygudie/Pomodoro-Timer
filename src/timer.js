import { states } from './states.js'
let pomodoro_btn = document.querySelector('.pomodoro_btn')
let shortbreak_btn = document.querySelector('.short_break_btn')
let longbreak_btn = document.querySelector('.long_break_btn')
let timer_mins = document.querySelector('.timer_mins')
let timer_sec = document.querySelector('.timer_sec')
let start_pause_btn = document.querySelector('.start_pause_btn')
const progressBar = document.querySelector('.progress_bar')
const btn_container = document.querySelector('.btn-container').children

let minutes
let seconds
let progress = null
let progressStart
let progressEnd
let speed = 1000
let secRem = 0
let minRem = 0
let progressDegree
let timeRem

export let currentSettings

export const timer = {
  timerHandler() {
    states.saveToStorage()
    currentSettings = JSON.parse(states.retriveStorageData())
    this.loadCurrentTimer()
    this.btnHandler(pomodoro_btn, 'timer-1')
    this.btnHandler(shortbreak_btn, 'timer-2')
    this.btnHandler(longbreak_btn, 'timer-3')

    start_pause_btn.addEventListener('click', () => {
      if (start_pause_btn.innerHTML === 'START') {
        if (!(parseInt(minutes) === 0 && parseInt(seconds) === 0)) {
          start_pause_btn.innerHTML = 'PAUSE'
          this.startPauseProgress()
        }
      } else if (start_pause_btn.innerHTML === 'PAUSE') {
        this.PauseTimer()
      } else if (start_pause_btn.innerHTML === 'RESUME') {
        start_pause_btn.innerHTML = 'PAUSE'
        this.startPauseProgress()
      }
    })
  },

  btnHandler(element, id) {
    element.addEventListener('click', () => {
      this.toggleBtn(id)
      this.loadCurrentTimer()
    })
  },

  setDefault: () => {
    start_pause_btn.innerHTML = 'START'
    currentSettings.timer.timeleft = currentSettings.timer.type.length
    currentSettings.timer.running = false
    currentSettings.timer.progressDeg = 0
    currentSettings.timer.progressLength = 0
  },

  loadCurrentTimer() {
    document.body.style.fontFamily = currentSettings.setting.fontSelected.type
    progressDegree = currentSettings.timer.progressDeg
    progressStart = currentSettings.timer.progressLength

    Array.from(btn_container).filter((child) => {
      if (child.id === currentSettings.timer.type.id) {
        child.style.cssText = `background-color: ${currentSettings.setting.colorSelected.type}; color: #1e213e`
        Object.keys(currentSettings.setting.length).map((key) => {
          key === child.textContent
            ? (currentSettings.timer.type.length = currentSettings.setting.length[key])
            : null
        })
      } else {
        child.style.cssText = ` background-color: transparent; color: grey`
      }
      currentSettings.timer.running
        ? ((start_pause_btn.innerHTML = 'RESUME'),
          this.ResetTimer(currentSettings.timer.timeleft),
          (progressBar.style.background = `conic-gradient(
                ${currentSettings.setting.colorSelected.type} ${progressDegree}deg,
                    #161932 ${progressDegree}deg
                  )`))
        : this.ResetTimer(currentSettings.timer.type.length)
    })
  },

  toggleBtn(id) {
    this.setDefault()
    Array.from(btn_container).filter((child) => {
      if (child.id === id) {
        child.style.cssText = `background-color: ${currentSettings.setting.colorSelected.type}; color: #1e213e`
        let current_length
        Object.keys(currentSettings.setting.length).map((key) => {
          key === child.textContent ? (current_length = currentSettings.setting.length[key]) : null
        })
        const type = {
          name: child.textContent,
          length: current_length,
          id: child.id,
        }
        currentSettings.timer = { ...currentSettings.timer, type: type }
        states.current = currentSettings
        states.updateStorage()
      } else {
        child.style.cssText = ` background-color: transparent; color: gray`
      }
    })
  },

  ResetTimer(time) {
    let minutes = Math.floor(time / 60)
    let seconds = time - minutes * 60
    clearInterval(progress)
    if (start_pause_btn.innerHTML === 'PAUSE') {
      start_pause_btn.innerHTML = 'RESUME'
    } else if (start_pause_btn.innerHTML === 'RESUME') {
      progressStart = currentSettings.timer.progressLength
      Object.keys(currentSettings.setting.length).map((key) => {
        key === currentSettings.timer.type.name
          ? (progressEnd = currentSettings.setting.length[key])
          : null
      })
    } else if (start_pause_btn.innerHTML === 'START') {
      progressBar.style.background = '#161932'
      currentSettings.timer.progressLength = 0
      progressEnd = parseInt(minutes) * 60 + parseInt(seconds)
    }
    progress = null
    timer.displayTimerText(minutes, seconds)
  },

  displayTimerText(mins, secs) {
    timer_mins.innerHTML = mins.toString().length >= 2 ? mins : `0${mins}`
    timer_sec.innerHTML = secs.toString().length >= 2 ? secs : `0${secs}`
  },

  progressTrack() {
    currentSettings.timer.running = true
    let degTravel = 360 / progressEnd
    progressStart++
    secRem = Math.floor((progressEnd - progressStart) % 60)
    minRem = Math.floor((progressEnd - progressStart) / 60)
    timer.displayTimerText(minRem, secRem)
    progressDegree = progressStart * degTravel
    progressBar.style.background = `conic-gradient(
      ${currentSettings.setting.colorSelected.type} ${progressDegree}deg,
          #161932 ${progressDegree}deg
        )`
    timeRem = parseInt(timer_mins.innerHTML) * 60 + parseInt(timer_sec.innerHTML)
    currentSettings.timer = {
      ...currentSettings.timer,
      timeleft: timeRem,
      progressDeg: progressDegree,
      progressLength: progressStart,
    }
    states.current = currentSettings
    states.updateStorage()

    if (progressStart == progressEnd) {
      progressBar.style.background = `conic-gradient(
          #00aa51 360deg,
          #00aa51 360deg
        )`
      clearInterval(progress)
      start_pause_btn.innerHTML = 'START'
      currentSettings.timer.running = false
      progress = null
      progressStart = 0
    }
  },
  PauseTimer() {
    this.ResetTimer(timeRem)
  },
  startPauseProgress() {
    if (!progress) {
      progress = setInterval(this.progressTrack, speed)
    }
  },
}
