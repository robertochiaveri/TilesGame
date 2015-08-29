game = game || {};
game.utils = game.utils || {};

game.utils.detectFullscreen = function() {
  if (("standalone" in window.navigator) && window.navigator.standalone) {
    return true;
  }
  return false;
};
