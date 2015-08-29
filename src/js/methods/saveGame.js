game.saveGame = function(type) {
  "use strict";
  if (!this.config.useLstorage) {
    return false;
  }
  if (this.runtime.ended !== false) {
    return false;
  }
  if (typeof type === "undefined") {
    type = this.config.labels.AUTOSAVE_LABEL;
  }

  var savedGames = {};
  var savedGame = {
    saveDate: new Date().toUTCString(),
    type: type,
    size: this.config.size.n,
    tiles: {},
    movesCount: this.runtime.movesCount
  };
  var tileID;

  if (JSON.parse(localStorage.getItem(this.config.labels.SAVEDGAMES_LABEL)) != null) {
    savedGames = JSON.parse(localStorage.getItem(this.config.labels.SAVEDGAMES_LABEL));
  }

  if (this.runtime.started) {
    savedGame.startedDate = this.runtime.started.toUTCString();
  }

  for (var i = 0; i < this.config.size.n; i++) {

    tileID = this.config.labels.TILE_PREFIX + i;
    savedGame.tiles[tileID] = this.utils.cloneObj(this.runtime.tiles[tileID]);
  }

  savedGames[type] = savedGame;

  localStorage.setItem(this.config.labels.SAVEDGAMES_LABEL, JSON.stringify(savedGames));

  console.log("game saved (" + type + ")");
};
