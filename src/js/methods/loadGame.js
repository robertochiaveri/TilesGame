game.loadGame = function(type) {
  "use strict";
  if (!this.config.useLstorage) {
    return false;
  }
  if (typeof type === "undefined") {
    type = this.config.labels.AUTOSAVE_LABEL;
  }

  var loadedGames = JSON.parse(localStorage.getItem(this.config.labels.SAVEDGAMES_LABEL));
  var loadedGame = null;
  var tileID;

  if (loadedGames !== null) {
    if (typeof loadedGames[type] !== "undefined" && loadedGames[type] !==
      null) {
      loadedGame = loadedGames[type];

      loadedGame.saveDate = new Date(Date.UTC.apply(this,
        loadedGame.saveDate.match(/\d+\.{0,1}\d+/g)));


      if (loadedGame.startedDate) {
        loadedGame.startedDate = new Date(Date.UTC.apply(this,
          loadedGame.startedDate.match(/\d+\.{0,1}\d+/g)));
      }

      if (loadedGame.size !== this.config.size.n) {
        console.log("cannot load game: different sizes:",
          loadedGame.size, this.config.size.n);
        return false;
      }

      if (loadedGame.bgImage) {
        console.log("Loading saved background image: " + loadedGame.bgImage + "...");
        this.setBgImage({
          imgUrl: loadedGame.bgImage
        });
      } else {
        this.changeBg();
      }

      this.runtime.tiles = loadedGame.tiles;

      for (var i = 0; i < this.config.size.n; i++) {

        tileID = this.config.labels.TILE_PREFIX + i;
        loadedGame.tiles[tileID].htmlElement = document.getElementById(
          tileID);
      }

      this.runtime.started = loadedGame.startedDate;
      this.runtime.movesCount = parseInt(loadedGame.movesCount);
      this.refresh({
        transitions: (type === "user")
      });

      console.log("game loaded");
      return true;
    }

    console.log("cannot find saved game '" + type + "'");
    return false;

  }

  console.log("cannot find any saved game");
  return false;
};
