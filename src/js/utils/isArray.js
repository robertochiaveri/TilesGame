game.utils.isArray = function(arr) {
  "use strict";

  if (typeof arr === "object") {
    return arr.constructor.toString().indexOf("Array") > -1;
  }

  return false;

};
