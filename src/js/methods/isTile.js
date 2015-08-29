game = game || {};

game.isTile = function(tile) {
  if (tile == null || tile == undefined) {
    return false;
  }

  switch (typeof tile) {
    case "object":
      if (tile.id.indexOf(game.config.labels.TILE_PREFIX) < 0) {
        return false;
      }
      break;

    case "string":
      tile = game.runtime.tiles[tile];
      if (typeof tile == "undefined") {
        return false;
      }
      if (tile.id.indexOf(game.config.labels.TILE_PREFIX) < 0) {
        return false;
      }
      break

    default:
      return false;
      break
  }
  return tile;
};