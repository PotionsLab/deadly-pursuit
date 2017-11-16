import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.menuBg = this.add.image(0, 0, 'menuBg');
    //TODO: Button click animation not working, maybe the bad sprite sizing
    this.mainPlayBtn = this.add.button(25, game.world.height - 130, 'mainPlayBtn', this.startGame, this, 0, 0, 1);
    this.rankBtn = this.add.button(25, game.world.height - 65, 'rankBtn');
    this.garageBtn = this.add.button(85, game.world.height - 65, 'garageBtn');
    this.settingsBtn = this.add.button(145, game.world.height - 65, 'settingsBtn');
    this.exitBtn = this.add.button(205, game.world.height - 65, 'exitBtn', this.exitBtn, this, 0, 0, 1);
  }

  create () {
  }

  startGame() {
    console.log('Lets the party begins...');
    this.state.start('Game');
  }

  exitGame() {
    if (navigator.app) {
      navigator.app.exitApp();
    } else if (navigator.device) {
      navigator.device.exitApp();
    } else {
      window.close();
    }
  }
}
