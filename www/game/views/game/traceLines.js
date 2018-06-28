/* globals __DEBUG__ */
export const plot = (game) => {

  game.bmd.clear();

  game.path = [];

  let ix = 0;  
  let x = 1 / (game.map.height * game.map.tileWidth);

  for (let i = 0; i <= 1; i += x) {
    const px = game.math.catmullRomInterpolation(game.points.x, i);
    const py = game.math.catmullRomInterpolation(game.points.y, i);

    const node = { x: px, y: py, angle: 0 };
    if (ix > 0) {
        node.angle = game.math.angleBetweenPoints(game.path[ix - 1], node);
    }

    game.path.push(node);
    ix++;

    if (__DEBUG__) {
      game.bmd.rect(px, py, 1, 1, 'rgba(255, 255, 255, 1)');
    }
  }

  if (__DEBUG__) {
    for (let p = 0; p < game.points.x.length; p++) {
      game.bmd.rect(game.points.x[p]-3, game.points.y[p]-3, 6, 6, 'rgba(255, 0, 0, 1)');
    }
  }  
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

  game.blueCar.body.x = game.path[game.pi].x - (game.blueCar.body.width / 2);
  game.blueCar.body.y = game.path[game.pi].y - (game.blueCar.body.height / 2);

  game.pi += 4;

  if (game.pi >= game.path.length) {
    game.pi = 0;
  }

  game.blueCar.rotation = game.path[game.pi].angle + carRotation;
}
