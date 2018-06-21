export const renderPoint = (game) => {
    var text = game.add.text(10, 10, '$00000000123');

    text.align = 'left';
    text.font = 'Diary of an 8-bit mage';
    text.fontSize = 17;
    text.fontWeight = "lighter";
    text.setShadow(1, 2, '#430b29', 0);
    text.fill = '#fff5d2';
    text.fixedToCamera = true;
    text.smoothed = false;

    return text;
  };

