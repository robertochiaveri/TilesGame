game.isTile = function(tile) {
  "use strict";

  if (tile === null || tile === undefined) {
    return false;
  }

  switch (typeof tile) {
    case "object":
      if (tile.id.indexOf(this.config.labels.TILE_PREFIX) < 0) {
        return false;
      }
      break;

    case "string":
      tile = this.runtime.tiles[tile];
      if (typeof tile === "undefined") {
        return false;
      };
      if (tile.id.indexOf(this.config.labels.TILE_PREFIX) < 0) {
        return false;
      };
      break;

    default:
      return false;
      break;
  }
  return tile;
};
