game.utils.addClass = function(element, cls) {
  "use strict";
  if ((" " + element.className + " ").indexOf(" " + cls + " ") === -1) {
    element.className = element.className + " " + cls;
  }
  return element.className.replace(/  +/g, " ");
};
