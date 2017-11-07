import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  init () {}

  preload () {

    // TODO: check the loading procedude, it's infinite for now :(
    // WebFont.load({
    //   google: {
    //     families: ['Bangers']
    //   },
    //   active: this.fontsLoaded
    // });

    this.load.image('menuBg', './www/assets/sprites/menu_view_bg.png');
    this.load.spritesheet('mainPlayBtn', './www/assets/sprites/play_button.png', 223, 55);

    this.fontsLoaded();
  }

  render () {
    if (this.fontsReady) {
      this.state.start('Splash')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
