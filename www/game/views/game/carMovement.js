  // Check are every car's corner on the road.
  const isOnTheRoad = (game) => {
    const halftWidth = game.player.body.width / 2;
    const halfHeight = game.player.body.height / 2;
    const px = game.player.body.x;
    const py = game.player.body.y;

    // ToDo: also take into account rotation.
    return game.roadBorder.contains(px, py)
      && game.roadBorder.contains(px + game.player.body.width, py)
      && game.roadBorder.contains(px, py + game.player.body.height)
      && game.roadBorder.contains(px + game.player.body.width, py + game.player.body.height);
  }

export const carMovement = (game) => {
  const isOutOfRoad = !isOnTheRoad(game)

  game.player.body.velocity.y = 0;
  game.player.body.velocity.x = 0;

  if (game.cursors.up.isDown) {
    if (isOutOfRoad) {
      game.player.body.velocity.y -= 110;
      game.game.camera.shake(0.004, 100);
    } else {
      game.player.body.velocity.y -= 450;
    }
  } else if (game.cursors.down.isDown) {
    game.player.body.velocity.y += 450;
  }

  if (game.cursors.left.isDown) {
    if (game.cursors.up.isDown || game.cursors.down.isDown) {
      game.player.body.velocity.x -= 160;
    }

    if (game.player.angle >= -20 && !game.cursors.down.isDown) {
      game.player.angle -= 2;
    }

    if (game.player.angle <= 20 && game.cursors.down.isDown) {
      game.player.angle += 2;
    }
  } else if (game.cursors.right.isDown) {
    if (game.cursors.up.isDown || game.cursors.down.isDown) {
      game.player.body.velocity.x += 160;
    }

    if (game.player.angle <= 20 && !game.cursors.down.isDown) {
      game.player.angle += 2;
    }

    if (game.player.angle >= -20 && game.cursors.down.isDown) {
      game.player.angle -= 2;
    }
  } else {
    if (game.player.angle > 0) {
      game.player.angle -= 2;
    } else if (game.player.angle < 0) {
      game.player.angle += 2;
    } else {
      game.player.angle = 0;
    }
  }
}