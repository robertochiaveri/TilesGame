game.utils.useLocalStorage = function() {
  "use strict";
  return (typeof(Storage) !== "undefined" && typeof localStorage !== "undefined");
};
