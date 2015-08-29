game.utils.use3D = function() {
  "use strict";
  return ("WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix());
}
