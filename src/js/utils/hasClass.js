game = game || {};
game.utils = game.utils || {};

game.utils.hasClass = function(element, cls) {
  return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
};
