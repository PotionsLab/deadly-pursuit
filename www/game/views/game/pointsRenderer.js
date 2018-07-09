export const renderPoint = (context) => {
    var text = context.game.add.text(10, 10, 'dist: 0');

    text.align = 'left';
    text.font = 'Diary of an 8-bit mage';
    text.fontSize = 17;
    text.fontWeight = "lighter";
    text.setShadow(1, 2, '#430b29', 0);
    text.fill = '#fff5d2';
    text.fixedToCamera = true;
    text.smoothed = false;

    context.ui.points = text;
  };

export const updatePoints = (context) => {
  // console.log((context.game.world.height - context.player.position.y).toFixed(0));
  context.ui.points.setText('dist: ' + (context.game.world.height - context.player.position.y).toFixed(0));
}
