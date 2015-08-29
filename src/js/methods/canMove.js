game.canMove = function(tile) {

  var tile = game.isTile(tile),
    hole = game.runtime.tiles[game.config.labels.TILE_PREFIX + game
      .config
      .labels.HOLE_INDEX],
    holePosition = hole.col + "-" + hole.row,
    tilesToPush = 0;

  if (!tile) {
    return false;
  };

  if (holePosition == (tile.col) + "-" + (tile.row - 1)) {
    return game.config.labels.UP;
  }
  if (holePosition == (tile.col + 1) + "-" + (tile.row)) {
    return game.config.labels.RIGHT;
  }
  if (holePosition == (tile.col) + "-" + (tile.row + 1)) {
    return game.config.labels.DOWN;
  }
  if (holePosition == (tile.col - 1) + "-" + (tile.row)) {
    return game.config.labels.LEFT;
  }

  return false;
};
