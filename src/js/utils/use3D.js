game = game || {};
game.utils = game.utils || {};

game.utils.use3D = function() {
  return ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());
}
