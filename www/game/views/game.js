/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}
  
  preload () {
    this.road = this.add.tileSprite(0, 0, 270, 392, 'road');
    this.redCar = this.add.sprite(game.world.width - 150, game.world.height - 150, 'redCar');
    this.dashboardBg = this.add.image(0, game.world.height - 98, 'dashboardBg');
    this.fuelBar = this.add.image(10, game.world.height - 70, 'fuelBar');
  }

  create () {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.redCar.anchor.setTo(0, 0);
    game.physics.enable(this.redCar, Phaser.Physics.ARCADE);

    this.cursors = game.input.keyboard.createCursorKeys();
  }

  update () {
    this.road.tilePosition.y += 2;
    if (this.cursors.left.isDown) {
        this.redCar.body.velocity.x = -200;
    } else if (this.cursors.right.isDown) {
        this.redCar.body.velocity.x = 200;
    } else {
      this.redCar.body.velocity.x = 0;
    }
  }
}
