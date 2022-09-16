import '/src/sass/style.scss'

// $fa-font-path: '~@fortawesome/fontawesome-free/webfonts';
// import '~@fortawesome/fontawesome-free/scss/fontawesome';
// import '~@fortawesome/fontawesome-free/scss/regular';
// import '~@fortawesome/fontawesome-free/scss/solid';
import { settings } from './settings.js'
import { timer } from './timer.js'

timer.timerHandler()
settings.settingsHandler()
