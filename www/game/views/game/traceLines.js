/* globals __DEBUG__ */
export const plot = (game) => {

  game.bmd.clear();

  game.path = [];

  game.roadTraceLines.forEach((roadTraceLine, index) => {
    let ix = 0;  
    let x = 1 / (game.map.height * game.map.tileWidth);

    game.path[index] = [];
    for (let i = 0; i <= 1; i += x) {
      const px = game.math.catmullRomInterpolation(game.points[index].x, i);
      const py = game.math.catmullRomInterpolation(game.points[index].y, i);

      const node = { x: px, y: py, angle: 0 };
      if (ix > 0) {
          node.angle = game.math.angleBetweenPoints(game.path[index][ix - 1], node);
      }

      game.path[index].push(node);
      ix++;

      if (__DEBUG__) {
        game.bmd.rect(px, py, 1, 1, 'rgba(255, 255, 255, 1)');
      }
    }

    if (__DEBUG__) {
      for (let p = 0; p < game.points[index].x.length; p++) {
        game.bmd.rect(game.points[index].x[p]-3, game.points[index].y[p]-3, 6, 6, 'rgba(255, 0, 0, 1)');
      }
    }
  });
}

export const getValuesFor = (coordinate, polyline) => {
  return polyline.polyline.map((point) => {
    return coordinate === 'x' 
      ? point[0] + polyline.x
      : point[1] + polyline.y + 45;
  });
}

export const updateCars = (game) => {
  const carRotation = 1.5;

  game.roadTraceLines.forEach((roadTraceLine, index) => {
    game.cars[index].body.x = game.path[index][game.pi[index]].x - (game.cars[index].body.width / 2);
    game.cars[index].body.y = game.path[index][game.pi[index]].y - (game.cars[index].body.height / 2);

    game.pi[index] += 4;

    if (game.pi[index] >= game.path[index].length) {
      game.pi[index] = 0;
    }

    game.cars[index].rotation = game.path[index][game.pi[index]].angle + carRotation;
  });
}
