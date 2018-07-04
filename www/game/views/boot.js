import Phaser from 'phaser'
import WebFont from 'webfontloader'
import FontFaceObserver from 'fontfaceobserver';

function CustomLoader(game) {
  Phaser.Loader.call(this, game);
}

CustomLoader.prototype = Object.create(Phaser.Loader.prototype);
CustomLoader.prototype.constructor = CustomLoader;

// new method to load webfonts
// this follows the structure of all of the file assets loading methods
CustomLoader.prototype.webfont = function (key, fontName, overwrite) {
  if (typeof overwrite === 'undefined') { 
    overwrite = false;
  }

  this.addToFileList('webfont', key, fontName);
  return this;
};

CustomLoader.prototype.loadFile = function (file) {
  Phaser.Loader.prototype.loadFile.call(this, file);

  // we need to call asyncComplete once the file has loaded
  if (file.type === 'webfont') {
      var _this = this;
      var font = new FontFaceObserver(file.url);
      font.load(null, 10000).then(function () {
          _this.asyncComplete(file);
      }, function ()  {
          _this.asyncComplete(file, 'Error loading font ' + file.url);
      });
  }
};

export default class extends Phaser.State {
  
  init () {
    this.SPRITE_URL = './www/assets/sprites/';
    this.TILEMAPS_URL = './www/assets/tilemaps/';
    this.FONTS = './www/fonts/';

    // swap Phaser.Loader for our custom one
    this.game.load = new CustomLoader(this.game);
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

    this.game.load.webfont('Super Mario World Text Box', 'Super Mario World Text Box');
    // this.getResourcePath('Super_Mario_World_Text_Box.ttf', this.FONTS)
    this.game.load.webfont('Diary of an 8-bit mage', 'Diary of an 8-bit mage');
    

    this.game.load.image('menuBg', this.getResourcePath('menu_view_bg.png', this.SPRITE_URL));
    this.game.load.spritesheet('mainPlayBtn', this.getResourcePath('play_button.png', this.SPRITE_URL), 222, 56, 2);
    this.game.load.image('road', this.getResourcePath('road_daylight_bg.png', this.SPRITE_URL));
    this.game.load.image('redCar', this.getResourcePath('car_top_red.png', this.SPRITE_URL));
    this.game.load.image('blueCar', this.getResourcePath('car_top_blue.png', this.SPRITE_URL));
    this.game.load.image('greenCar', this.getResourcePath('car_top_green.png', this.SPRITE_URL));
    this.game.load.image('greenPlainCar', this.getResourcePath('car_top_green_plain.png', this.SPRITE_URL));
    this.game.load.image('blackSkullCar', this.getResourcePath('car_top_black_skull.png', this.SPRITE_URL));
    
    this.game.load.image('dashboardBg', this.getResourcePath('dashboard_bg.png', this.SPRITE_URL));
    this.game.load.image('fuelBar', this.getResourcePath('fuel_bar.png', this.SPRITE_URL));

    this.game.load.spritesheet('exitBtn', this.getResourcePath('exit_button.png', this.SPRITE_URL), 48, 60, 2);
    this.game.load.spritesheet('garageBtn', this.getResourcePath('garage_button.png', this.SPRITE_URL), 48, 60, 2);
    this.game.load.spritesheet('rankBtn', this.getResourcePath('rank_button.png', this.SPRITE_URL), 48, 60, 2);
    this.game.load.spritesheet('settingsBtn', this.getResourcePath('settings_button.png', this.SPRITE_URL), 48, 60, 2);

    // new
    this.game.load.image('tilemap_turns', this.getResourcePath('tilemap_turns.png', this.SPRITE_URL));
    this.game.load.tilemap('level1', this.getResourcePath('level1.json', this.TILEMAPS_URL), null, Phaser.Tilemap.TILED_JSON);
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
