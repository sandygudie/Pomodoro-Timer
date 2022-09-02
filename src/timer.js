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
let progressStart = 0
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
    this.btnHandler(pomodoro_btn, 1500, 'timer-1')
    this.btnHandler(shortbreak_btn, 300, 'timer-2')
    this.btnHandler(longbreak_btn, 900, 'timer-3')

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

  btnHandler(element, btnType, id) {
    element.addEventListener('click', () => {
      this.toggleBtn(id)
      start_pause_btn.innerHTML = 'START'
      this.ResetTimer(btnType)
    })
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
        child.style.cssText = ` background-color: transparent; color: #1e213e`
      }
      currentSettings.timer.running
        ? (this.ResetTimer(currentSettings.timer.timeleft),
          (start_pause_btn.innerHTML = 'RESUME'),
          (progressBar.style.background = `conic-gradient(
                ${currentSettings.setting.colorSelected.type} ${progressDegree}deg,
                    #161932 ${progressDegree}deg
                  )`))
        : this.ResetTimer(currentSettings.timer.type.length)
    })
  },

  toggleBtn(id) {
    currentSettings.timer.running = false
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
        child.style.cssText = ` background-color: transparent; color: #1e213e`
      }
    })
  },

  ResetTimer(time) {
    console.log(progressStart)
    console.log(progressDegree)

    let minutes = Math.floor(time / 60)
    let seconds = time - minutes * 60
    clearInterval(progress)
    if (start_pause_btn.innerHTML === 'PAUSE') {
      start_pause_btn.innerHTML = 'RESUME'
    } else if (start_pause_btn.innerHTML === 'RESUME') {
      progressStart = currentSettings.timer.progressLength
      //  progressEnd = parseInt(minutes) * 60 + parseInt(seconds)
    } else {
      start_pause_btn.innerHTML = 'START'
      progressBar.style.background = '#161932'
      currentSettings.timer.progressLength = 0
      progressStart = 0
      progressEnd = parseInt(minutes) * 60 + parseInt(seconds)
    }
    progress = null

    // progressDegree;
    // normally more than 2 length mins should be convert to hr
    timer_mins.innerHTML = minutes.toString().length >= 2 ? minutes : `0${minutes}`
    timer_sec.innerHTML = seconds.toString().length >= 2 ? seconds : `0${seconds}`
  },

  progressTrack() {
    let degTravel = 360 / progressEnd
    progressStart++
    secRem = Math.floor((progressEnd - progressStart) % 60)
    minRem = Math.floor((progressEnd - progressStart) / 60)

    console.log(progressStart)
    console.log(progressEnd)
    timer_sec.innerHTML = secRem.toString().length == 2 ? secRem : `0${secRem}`
    timer_mins.innerHTML = minRem.toString().length >= 2 ? minRem : `0${minRem}`
    progressDegree = progressStart * degTravel
    // console.log(progressStart)
    // console.log(progressDegree)
    // console.log (degTravel)
    progressBar.style.background = `conic-gradient(
      ${currentSettings.setting.colorSelected.type} ${progressDegree}deg,
          #161932 ${progressDegree}deg
        )`
    currentSettings.timer.running = true

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
