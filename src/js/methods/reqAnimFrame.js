game.addMovingTile = function(tileObj, cssString) {
  "use strict";

  if (typeof this.runtime.movingTiles !== "object") {
    this.runtime.movingTiles = {};
  }

  this.runtime.movingTiles[tileObj.id] = cssString;
  return this.runtime.movingTiles;

};


game.renderMovingTiles = function() {

  var movingTiles = game.runtime.movingTiles;

  for (tileId in movingTiles) {
    if (!!movingTiles[tileId]) {
      console.log("--- moving " + tileId)
      game.runtime.tiles[tileId].htmlElement.style.cssText = movingTiles[tileId];
    }
  }
  game.runtime.movingTiles = {};

  return game.runtime.movingTiles;

}
