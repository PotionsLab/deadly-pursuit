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
    this.load.spritesheet('mainPlayBtn', this.getResourcePath('play_button.png'), 222, 56, 2);
    this.load.image('road', this.getResourcePath('road_daylight_bg.png'));
    this.load.image('redCar', this.getResourcePath('car_top_red.png'));
    this.load.image('dashboardBg', this.getResourcePath('dashboard_bg.png'));
    this.load.image('fuelBar', this.getResourcePath('fuel_bar.png'));

    this.load.spritesheet('exitBtn', this.getResourcePath('exit_button.png'), 48, 60, 2);
    this.load.spritesheet('garageBtn', this.getResourcePath('garage_button.png'), 48, 60, 2);
    this.load.spritesheet('rankBtn', this.getResourcePath('rank_button.png'), 48, 60, 2);
    this.load.spritesheet('settingsBtn', this.getResourcePath('settings_button.png'), 48, 60, 2);
    
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
