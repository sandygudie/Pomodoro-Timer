export let states = {
  current: {
    timer: {
      type: {
        name: 'pomodoro',
        length: 1500,
        id: 'timer-1',
      },
      timeleft: 1500,
      progressDeg: 0,
      progressLength: 0,
      running: false,
    },
    setting: {
      length: {
        pomodoro: 1500,
        shortbreak: 300,
        longbreak: 900,
      },
      colorSelected: {
        id: 'color-1',
        type: 'rgb(248, 114, 114)',
      },
      fontSelected: {
        id: 'font-1',
        type: '"Kumbh Sans", sans-serif',
      },
    },
  },

  saveToStorage() {
    if (localStorage.getItem('currentTimer') === null) {
      localStorage.setItem('currentTimer', JSON.stringify(states.current))
    }
  },

  updateStorage() {
    localStorage.setItem('currentTimer', JSON.stringify(states.current))
  },

  setDefault: () => {
    states.current.timer.timeLeft = states.current.timer.type.length
    states.current.timer.running = false
    states.current.timer.completed = false
  },

  retriveStorageData() {
    let savedStates = localStorage.getItem('currentTimer')
    if (savedStates !== null) {
      states.current = savedStates
    }
    return savedStates
  },
}
