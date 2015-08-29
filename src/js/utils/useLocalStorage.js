game.utils.useLocalStorage = function() {
  return (typeof(Storage) !== "undefined" && typeof localStorage !==
    "undefined");
};
