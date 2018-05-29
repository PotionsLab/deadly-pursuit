import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  
  init () {
    this.SPRITE_URL = './www/assets/sprites/';
    this.TILEMAPS_URL = './www/assets/tilemaps/';
  }

  getResourcePath(name, type) {
    return `${type}${name}`;
  } 

  preload () {

    // TODO: check the loading procedude, it's infinite for now :(
    // WebFont.load({
    //   google: {
    //     families: ['Bangers']
    //   },
    //   active: this.fontsLoaded
    // });

    this.load.image('menuBg', this.getResourcePath('menu_view_bg.png', this.SPRITE_URL));
    this.load.spritesheet('mainPlayBtn', this.getResourcePath('play_button.png', this.SPRITE_URL), 222, 56, 2);
    this.load.image('road', this.getResourcePath('road_daylight_bg.png', this.SPRITE_URL));
    this.load.image('redCar', this.getResourcePath('car_top_red.png', this.SPRITE_URL));
    this.load.image('dashboardBg', this.getResourcePath('dashboard_bg.png', this.SPRITE_URL));
    this.load.image('fuelBar', this.getResourcePath('fuel_bar.png', this.SPRITE_URL));

    this.load.spritesheet('exitBtn', this.getResourcePath('exit_button.png', this.SPRITE_URL), 48, 60, 2);
    this.load.spritesheet('garageBtn', this.getResourcePath('garage_button.png', this.SPRITE_URL), 48, 60, 2);
    this.load.spritesheet('rankBtn', this.getResourcePath('rank_button.png', this.SPRITE_URL), 48, 60, 2);
    this.load.spritesheet('settingsBtn', this.getResourcePath('settings_button.png', this.SPRITE_URL), 48, 60, 2);

    // new
    this.load.image('tilemap_turns', this.getResourcePath('tilemap_turns.png', this.SPRITE_URL));
    this.load.tilemap('level1', this.getResourcePath('level1.json', this.TILEMAPS_URL), null, Phaser.Tilemap.TILED_JSON);
    // new END
    
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
