game.utils.addClass = function(element, cls) {
  "use strict";
  if (!game.utils.hasClass(element, cls)) {
    element.className = element.className + " " + game.utils.trim(cls);
  }
  return (element.className);
};
