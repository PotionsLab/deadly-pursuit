import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootView from './views/boot'
import SplashView from './views/splash'
import GameView from './views/game'

class App extends Phaser.Game {
  constructor () {
    const width = 120;
    const height = 190;

    super(width, height, Phaser.CANVAS, 'game', null)

    this.state.add('Boot', BootView, false)
    this.state.add('Splash', SplashView, false)
    this.state.add('Game', GameView, false)

    this.state.start('Boot')
  }
}

window.game = new App()
