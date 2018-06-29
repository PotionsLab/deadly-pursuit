/* globals __DEV__ */
/* globals __DEBUG__ */
import Phaser from 'phaser';

import {renderPoint} from 'www/game/views/game/pointsRenderer';
import {getValuesFor, plot, updateCars} from 'www/game/views/game/traceLines';
import {carMovement} from 'www/game/views/game/carMovement';

  var result;

export default class extends Phaser.State {
  init () {
    this.pi = 0;
  }

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

    renderPoint(this.game);

    // ROAD BORDER
    this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaa6622 } });
    const roadPolygon = this.findObjectsByType('border', this.map, 'bordersLayer')[0];
    const roadPoints = [];

    roadPolygon.polyline.forEach((point) => {
      roadPoints.push(new Phaser.Point(point[0] + roadPolygon.x, point[1] + roadPolygon.y + 45))
    });

    this.roadBorder = new Phaser.Polygon(roadPoints);

    if (__DEBUG__) {
      this.graphics.beginFill(0xFF00ff);
      this.graphics.drawPolygon(this.roadBorder.points);
      this.graphics.endFill();
      this.graphics.alpha= 0.5;
    }

    // ROAD TRACE
    const roadTraceLine = this.findObjectsByType('trace', this.map, 'tracesLayer');

    this.points = {
      'x': getValuesFor('x', roadTraceLine[3]),
      'y': getValuesFor('y', roadTraceLine[3])
    };

    if (this.points.x.length > 0) {
      this.blueCar = this.game.add.sprite(this.points.x[0], this.points.y[0], 'blueCar');
      this.blueCar.anchor.set(0.5);
      this.game.physics.arcade.enable(this.blueCar);
    }

    this.bmd = this.add.bitmapData(this.map.width * this.map.tileWidth, this.map.height * this.map.tileHeight);
    this.bmd.addToWorld();
    
    this.pi = 0;
    
    plot(this);
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
    carMovement(this);

    updateCars(this);
  }

  // Check are every car's corner on the road.
  isOnTheRoad() {
    const halftWidth = this.player.body.width / 2;
    const halfHeight = this.player.body.height / 2;
    const px = this.player.body.x;
    const py = this.player.body.y;

    // ToDo: also take into account rotation.
    return this.roadBorder.contains(px, py)
      && this.roadBorder.contains(px + this.player.body.width, py)
      && this.roadBorder.contains(px, py + this.player.body.height)
      && this.roadBorder.contains(px + this.player.body.width, py + this.player.body.height);
  }

  collect(player, collectable) {
    collectable.destroy();
  }

  carCrash(player, car) {
    console.log('You just had a car crash. Game over!');
  }
}
