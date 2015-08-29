game.utils.hasClass = function(element, cls) {
  "use strict";
  return (" " + element.className + " ").indexOf(" " + cls + " ") > -1;
};
