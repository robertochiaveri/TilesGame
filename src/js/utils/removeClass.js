game = game || {};
game.utils = game.utils || {};

game.utils.removeClass = function(element, cls) {
  var regexp = new RegExp('\\b' + cls + '\\b', 'g');
  element.className = " " + element.className + " ";
  element.className = game.utils.trim(element.className.replace(regexp, ''));
  return (element.className);
};
