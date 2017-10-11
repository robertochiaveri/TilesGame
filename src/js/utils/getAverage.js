game.utils.getAverage = function(arr) {
  "use strict";

  return arr.reduce(function(p, c) {
    return p + c;
  }) / arr.length;

}
