/* globals __DEV__ */
/* globals __DEBUG__ */
import Phaser from 'phaser'

  var result;

export default class extends Phaser.State {
  init () {}

  create() {
    this.game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
    this.game.stage.smoothed = false;

    // Layers
    this.layers = this.add.group();

    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('tiles', 'tilemap_turns');
    this.backgroundlayer = this.map.createLayer('backgroundLayer');

    const TileMapLayer = this.layers.add(this.backgroundlayer);

    this.backgroundlayer.resizeWorld();

    this.createItems();
    this.createCars();    

    const playerStart = this.findObjectsByType('playerStart', this.map, 'objectsLayer')[0];
    this.player = this.game.add.sprite(playerStart.x, playerStart.y, 'redCar');

    this.game.physics.arcade.enable(this.player);
    this.player.anchor.setTo(0.5, 0.5);

    let camera = this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.9, 0.9);
    this.game.camera.targetOffset.y = -100;

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.renderPoint();

    this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaa6622 } });
    const roadBorder = this.findObjectsByType('border', this.map, 'bordersLayer')[0];
    const polyArray = [];

    roadBorder.polyline.forEach((point) => {
      polyArray.push(new Phaser.Point(point[0] + roadBorder.x, point[1] + roadBorder.y + 45))
    });

    this.poly = new Phaser.Polygon(polyArray);

    if (__DEBUG__) {
      this.graphics.beginFill(0xFF00ff);
      this.graphics.drawPolygon(this.poly.points);
      this.graphics.endFill();
      this.graphics.alpha= 0.5;
    }
  }

  createItems() {
    //create items
    this.items = this.game.add.group();
    this.items.enableBody = true;

    result = this.findObjectsByType('item', this.map, 'objectsLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.items);
    }, this);
  }

  createCars() {
    //create cars
    this.cars = this.game.add.group();
    this.cars.enableBody = true;
    result = this.findObjectsByType('car', this.map, 'objectsLayer');

    result.forEach(function(element){
      this.createFromTiledObject(element, this.cars);
    }, this);
  }

  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.type === type) {
        element.y -= map.tileHeight;
        result.push(element);
      }      
    });
    return result;
  }

  //create a sprite from an object
  createFromTiledObject(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);

      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
  }

  update() {
    const isOutOfRoad = !this.isOnTheRoad()

    //collision
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
    this.game.physics.arcade.overlap(this.player, this.cars, this.carCrash, null, this);

    //player movement
    this.player.body.velocity.y = 0;
    this.player.body.velocity.x = 0;

    if (this.cursors.up.isDown) {
      if (isOutOfRoad) {
        this.player.body.velocity.y -= 110;
        this.game.camera.shake(0.004, 100);
      } else {
        this.player.body.velocity.y -= 150;
      }
    } else if (this.cursors.down.isDown) {
      this.player.body.velocity.y += 150;
    }

    if (this.cursors.left.isDown) {
      if (this.cursors.up.isDown || this.cursors.down.isDown) {
        this.player.body.velocity.x -= 100;
      }

      if (this.player.angle >= -20 && !this.cursors.down.isDown) {
        this.player.angle -= 2;
      }

      if (this.player.angle <= 20 && this.cursors.down.isDown) {
        this.player.angle += 2;
      }
    } else if (this.cursors.right.isDown) {
      if (this.cursors.up.isDown || this.cursors.down.isDown) {
        this.player.body.velocity.x += 100;
      }

      if (this.player.angle <= 20 && !this.cursors.down.isDown) {
        this.player.angle += 2;
      }

      if (this.player.angle >= -20 && this.cursors.down.isDown) {
        this.player.angle -= 2;
      }
    } else {
      if (this.player.angle > 0) {
        this.player.angle -= 2;
      } else if (this.player.angle < 0) {
        this.player.angle += 2;
      } else {
        this.player.angle = 0;
      }
    }
  }

  // Check are every car's corner on the road.
  isOnTheRoad() {
    const halftWidth = this.player.body.width / 2;
    const halfHeight = this.player.body.height / 2;
    const px = this.player.body.x;
    const py = this.player.body.y;

    // ToDo: also take into account rotation.
    return this.poly.contains(px, py)
      && this.poly.contains(px + this.player.body.width, py)
      && this.poly.contains(px, py + this.player.body.height)
      && this.poly.contains(px + this.player.body.width, py + this.player.body.height);
  }

  collect(player, collectable) {
    collectable.destroy();
  }

  carCrash(player, car) {
    console.log('You just had a car crash. Game over!');
  }

  renderPoint() {
    var text = this.game.add.text(10, 10, '$00000000123');

    text.align = 'left';
    text.font = 'Diary of an 8-bit mage';
    text.fontSize = 17;
    text.fontWeight = "lighter";
    text.setShadow(1, 2, '#430b29', 0);
    text.fill = '#fff5d2';
    text.fixedToCamera = true;
    text.smoothed = false;

    return text;
  }
}
