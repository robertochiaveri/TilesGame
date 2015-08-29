game.saveGame = function(type) {
  "use strict";
  if (!game.config.useLstorage) {
    return false;
  }
  if (game.runtime.ended !== false) {
    return false;
  }
  if (typeof type === "undefined") {
    type = "automatic";
  }

  var savedGames = {};
  var savedGame = {
    saveDate: new Date().toUTCString(),
    type: type,
    size: game.config.size.n,
    tiles: {},
    movesCount: game.runtime.movesCount
  };
  var tileID;

  if (JSON.parse(localStorage.getItem(game.config.labels.SAVEDGAMES_LABEL)) != null) {
    savedGames = JSON.parse(localStorage.getItem(game.config.labels.SAVEDGAMES_LABEL));
  }

  if (game.runtime.started) {
    savedGame.startedDate = game.runtime.started.toUTCString();
  }

  for (var i = 0; i < game.config.size.n; i++) {

    tileID = game.config.labels.TILE_PREFIX + i;
    savedGame.tiles[tileID] = game.utils.cloneObj(game.runtime.tiles[
      tileID]);
  }

  savedGames[type] = savedGame;

  localStorage.setItem(game.config.labels.SAVEDGAMES_LABEL, JSON.stringify(
    savedGames));

  console.log("game saved (" + type + ")");
};
