import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  
  init () {
    this.SPRITE_URL = './www/assets/sprites/';
  }

  getResourcePath(name) {
    return `${this.SPRITE_URL}${name}`;
  } 

  preload () {

    // TODO: check the loading procedude, it's infinite for now :(
    // WebFont.load({
    //   google: {
    //     families: ['Bangers']
    //   },
    //   active: this.fontsLoaded
    // });

    this.load.image('menuBg', this.getResourcePath('menu_view_bg.png'));
    this.load.spritesheet('mainPlayBtn', this.getResourcePath('play_button.png'), 223, 55);
    this.load.image('road', this.getResourcePath('road_daylight_bg.png'));
    this.load.image('redCar', this.getResourcePath('car_top_red.png'));
    this.load.image('dashboardBg', this.getResourcePath('dashboard_bg.png'));
    this.load.image('fuelBar', this.getResourcePath('fuel_bar.png'));
    
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
