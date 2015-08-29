game.utils.useTouch = function() {
  "use strict";
  return !!("ontouchstart" in window) || !!("onmsgesturechange" in window); // works on ie10
};
