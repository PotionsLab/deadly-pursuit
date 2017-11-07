import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.menuBg = this.add.image(0, 0, 'menuBg');
    //TODO: Button click animation not working, maybe the bad sprite sizing
    this.mainPlayBtn = this.add.button(25, game.world.height - 100, 'mainPlayBtn', this.startGame, this, 0, 0, 1);
  }

  create () {
  }

  startGame() {
    console.log('Lets the party begins...');
    this.state.start('Game');
  }
}
