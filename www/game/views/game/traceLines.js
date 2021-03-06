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

      car.name = "car-"+index;
      car.data.distance = 0;
      car.data.speed = index + 1;
      car.data.pathIndex = index;
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

// Returns:
//  - false - when no collision
//  - car object - when collide with
const isCollideWithOtherCar = (game, car) => {
  let returnValue = false;

  game.cars.children.some((element) => {
    const coll = Phaser.Rectangle.intersects(element.getBounds(), car.getBounds());

    if (coll && element.name !== car.name) {
      returnValue = element;
    }

    return coll;
  });

  return returnValue;
}

const getNewCarPositionX = (game, car, distance) => {
  return game.roadPaths.path[car.data.pathIndex][distance].x - (car.body.width / 2);
};

const getNewCarPositionY = (game, car, distance) => {
  return game.roadPaths.path[car.data.pathIndex][distance].y - (car.body.height / 2);
};

export const updateCars = (game) => {
  const carRotation = 1.5;

  game.cars.children.forEach((car, index) => {
    const {distance, pathIndex, speed} = car.data;

    if (distance < game.roadPaths.path[pathIndex].length) {
      const newX = getNewCarPositionX(game, car, distance);
      const newY = getNewCarPositionY(game, car, distance);
      const collideWithCar = isCollideWithOtherCar(game, car);

      if (!collideWithCar) {
        car.body.x = newX;
        car.body.y = newY;

        car.data.distance += parseInt(speed);
        car.rotation = game.roadPaths.path[pathIndex][distance].angle + carRotation;
      } else {
        if (car.data.distance > 0 && collideWithCar.data.distance) {
          const firstCarsSpeed = car.data.speed;

          // replace car speed
          car.data.speed = collideWithCar.data.speed;
          collideWithCar.data.speed = firstCarsSpeed;     

          if (car.data.distance < collideWithCar.data.distance) {
            car.data.distance -= 1;
            car.body.x = getNewCarPositionX(game, car, car.data.distance);
            car.body.y = getNewCarPositionY(game, car, car.data.distance);
          } else {
            collideWithCar.data.distance -= 1;
            collideWithCar.body.x = getNewCarPositionX(game, collideWithCar, collideWithCar.data.distance);
            collideWithCar.body.y = getNewCarPositionY(game, collideWithCar, collideWithCar.data.distance);
          }
        }
      }

    } else if (distance >= game.roadPaths.path[pathIndex].length) {
      car.data.distance = 0;
    }
  });
}
