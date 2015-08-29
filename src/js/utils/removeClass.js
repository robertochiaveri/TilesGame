game.utils.removeClass = function(element, cls) {
  "use strict";

  var regexp = new RegExp("\\b" + cls + "\\b", "g");
  element.className = " " + element.className + " ";
  element.className = element.className.replace(regexp, "");

  return (element.className.replace(/  +/g, " "));
};
