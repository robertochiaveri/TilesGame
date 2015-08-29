game.loadGame = function(type) {
  if (!game.config.useLstorage) {
    return false;
  }
  if (typeof type == "undefined") {
    type = game.config.labels.AUTOSAVE_LABEL;
  }

  var loadedGames = JSON.parse(localStorage.getItem(game.config.labels
      .SAVEDGAMES_LABEL)),
    loadedGame = null;

  if (loadedGames != null) {
    if (typeof loadedGames[type] != "undefined" && loadedGames[type] !=
      null) {
      loadedGame = loadedGames[type];

      loadedGame.saveDate = new Date(Date.UTC.apply(this,
        loadedGame.saveDate
        .match(/\d+\.{0,1}\d+/g)));


      if (loadedGame.startedDate) {
        loadedGame.startedDate = new Date(Date.UTC.apply(this,
          loadedGame.startedDate.match(/\d+\.{0,1}\d+/g)));
      }

      if (loadedGame.size != game.config.size.n) {
        console.log("cannot load game: different sizes:",
          loadedGame.tiles
          .length, game.config.size.n)
        return false;
      }

      game.runtime.tiles = loadedGame.tiles;


      for (var i = 0; i < game.config.size.n; i++) {

        tileID = game.config.labels.TILE_PREFIX + i;
        loadedGame.tiles[tileID].htmlElement = document.getElementById(
          tileID);
      }

      game.runtime.started = loadedGame.startedDate;
      game.runtime.movesCount = parseInt(loadedGame.movesCount);
      game.refresh({
        transitions: (type == "user")
      });

      console.log("game loaded");
      return true;
    }

    console.log("cannot find saved game '" + type + "'")
    return false;

  }

  console.log("cannot find any saved game");
  return false;
};
