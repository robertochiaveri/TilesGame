game.utils.detectFullscreen = function() {
  "use strict";
  if (("standalone" in window.navigator) && window.navigator.standalone) {
    return true;
  }
  return false;
};
