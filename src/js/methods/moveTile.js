game.moveTile = function(tile, params) {
  "use strict";

  tile = this.isTile(tile);
  if (!tile) {
    return false;
  };

  var hole = this.runtime.tiles[this.config.labels.TILE_PREFIX + this.config.labels.HOLE_INDEX];
  var temp = {};

  if (!this.canMove(tile)) {
    return false;
  }

  if (params.force !== true) {
    if (!this.runtime.running) {
      return false;
    }
    this.countMove();
  }

  temp.col = tile.col;
  temp.row = tile.row;

  tile.col = hole.col;
  tile.row = hole.row;

  hole.col = temp.col;
  hole.row = temp.row;

  if (params.refresh === true) {
    this.refresh({
      transitions: params.transitions,
      saveGame: !params.force,
      redraw: !!!params.force
    });
  }

  return true;
};
