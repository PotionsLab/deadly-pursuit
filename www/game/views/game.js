/* globals __DEV__ */
/* globals __DEBUG__ */
import Phaser from 'phaser';

import {renderPoint} from 'www/game/views/game/pointsRenderer';
import {
  readTracePathFromMap,
  defineTrecePoints,
  generateCarsOnTracelines,
  createDebuggerArea,
  createTrace,
  updateCars
} from 'www/game/views/game/traceLines';
import {carMovement} from 'www/game/views/game/carMovement';

  var result;

export default class extends Phaser.State {
  init () {
    this.roadPaths = {
      pi: [],
      points: [],
      path: [],
      roadTraceLines: null,
      debuggerDisplayArea: null
    };
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
    readTracePathFromMap(this);
    defineTrecePoints(this.roadPaths);
    generateCarsOnTracelines(this);
    if (__DEBUG__) {
      createDebuggerArea(this);
    }
    createTrace(this);
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
  findObjectsByType(type, map, layer, onlyVisible = false) {
    var result = new Array();
    map.objects[layer].forEach(function(element){
      if(element.type === type 
        && (onlyVisible ? element.visible : true)
      ) {
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
    //collision
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
    this.game.physics.arcade.overlap(this.player, this.cars, this.carCrash, null, this);

    //player movement
    carMovement(this);

    updateCars(this);
  }

  collect(player, collectable) {
    collectable.destroy();
  }

  carCrash(player, car) {
    console.log('You just had a car crash. Game over!');
  }
}
