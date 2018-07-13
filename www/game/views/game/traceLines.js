/* globals __DEBUG__ */
export const readTracePathFromMap = (game) => {
  game.roadPaths.roadTraceLines = game.findObjectsByType(
    'trace',
    game.map,
    'tracesLayer',
    true
  );
}

export const defineTrecePoints = (roadPaths) => {
  roadPaths.roadTraceLines.forEach((roadTraceLine, index) => {
    roadPaths.points[index] = {
        'x': getValuesFor('x', roadTraceLine),
        'y': getValuesFor('y', roadTraceLine)
      };
  });
}

export const generateCarsOnTracelines = (game) => {
  const {roadPaths} = game;

  roadPaths.roadTraceLines.forEach((roadTraceLine, index) => {
    if (roadPaths.points[index] && roadPaths.points[index].x.length > 0) {
      const car = game.cars.create(
        roadPaths.points[index].x[0],
        roadPaths.points[index].y[0],
        'blueCar'
      );

      car.anchor.set(0.5);
      game.physics.arcade.enable(car);

      car.properties = {};
      car.properties.distance = 0;
      car.properties.speed = index + 1;
      car.properties.pathIndex = index;
      car.properties.name = "car-"+index;
    }
  });
}

export const createDebuggerArea = (game) => {
  // let {debuggerDisplayArea} = game.roadPaths;

  game.roadPaths.debuggerDisplayArea = game.add.bitmapData(
    game.map.width * game.map.tileWidth,
    game.map.height * game.map.tileHeight
  );
  game.roadPaths.debuggerDisplayArea.addToWorld();
}

export const createTrace = (game) => {
  if (__DEBUG__) {
    game.roadPaths.debuggerDisplayArea.clear();
  }

  game.roadPaths.path = [];

  game.roadPaths.roadTraceLines.forEach((roadTraceLine, index) => {
    let ix = 0;  
    let x = 1 / (game.map.height * game.map.tileWidth);

    game.roadPaths.path[index] = [];
    for (let i = 0; i <= 1; i += x) {
      const px = game.math.catmullRomInterpolation(game.roadPaths.points[index].x, i);
      const py = game.math.catmullRomInterpolation(game.roadPaths.points[index].y, i);

      const node = { x: px, y: py, angle: 0 };
      if (ix > 0) {
          node.angle = game.math.angleBetweenPoints(game.roadPaths.path[index][ix - 1], node);
      }

      game.roadPaths.path[index].push(node);
      ix++;

      if (__DEBUG__) {
        game.roadPaths.debuggerDisplayArea.rect(px, py, 1, 1, 'rgba(255, 255, 255, 1)');
      }
    }

    if (__DEBUG__) {
      for (let p = 0; p < game.roadPaths.points[index].x.length; p++) {
        game.roadPaths.debuggerDisplayArea.rect(
          game.roadPaths.points[index].x[p]-3,
          game.roadPaths.points[index].y[p]-3,
          6,
          6,
          'rgba(255, 0, 0, 1)'
        );
      }
    }
  });
}

const getValuesFor = (coordinate, polyline) => {
  return polyline.polyline.map((point) => {
    return coordinate === 'x' 
      ? point[0] + polyline.x
      : point[1] + polyline.y + 45;
  });
}

const isCollideWithOtherCar = (game, car) => {
  let returnValue = false;

  game.cars.children.some((element) => {
    const coll = Phaser.Rectangle.intersects(element.getBounds(), car.getBounds());

    if (coll && element.properties.name !== car.properties.name) {
      returnValue = coll;
    }

    return coll;
  });

  return returnValue;
}

export const updateCars = (game) => {
  const carRotation = 1.5;

  game.cars.children.forEach((car, index) => {
    const {distance, pathIndex, speed} = car.properties;

    if (distance < game.roadPaths.path[pathIndex].length) {
      const newX = game.roadPaths.path[pathIndex][distance].x - (car.body.width / 2);
      const newY = game.roadPaths.path[pathIndex][distance].y - (car.body.height / 2);

      if (!isCollideWithOtherCar(game, car)) {
        car.body.x = newX;
        car.body.y = newY;

        car.properties.distance += speed;
        car.rotation = game.roadPaths.path[pathIndex][distance].angle + carRotation;
      } else {
        if (car.properties.distance > 0) {
          car.properties.distance -= 1;
        }
      }

    } else if (distance >= game.roadPaths.path[pathIndex].length) {
      car.properties.distance = 0;
    }
  });
}
