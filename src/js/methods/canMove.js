game.canMove = function(tile) {
  "use strict";
  tile = this.isTile(tile) || null;

  var hole = this.runtime.tiles[this.config.labels.TILE_PREFIX + this.config.labels
      .HOLE_INDEX],
    holePosition = hole.col + "-" + hole.row;

  if (!tile) {
    return false;
  };

  if (holePosition === (tile.col) + "-" + (tile.row - 1)) {
    return this.config.labels.UP;
  }
  if (holePosition === (tile.col + 1) + "-" + (tile.row)) {
    return this.config.labels.RIGHT;
  }
  if (holePosition === (tile.col) + "-" + (tile.row + 1)) {
    return this.config.labels.DOWN;
  }
  if (holePosition === (tile.col - 1) + "-" + (tile.row)) {
    return this.config.labels.LEFT;
  }

  return false;
};
