game = game || {};

game.moveTile = function(tile, params) {

  tile = game.isTile(tile);
  if (!tile) {
    return false;
  };

  var hole = game.runtime.tiles[game.config.labels.TILE_PREFIX +
      game.config
      .labels.HOLE_INDEX],
    temp = {};

  if (!game.canMove(tile)) {
    return false;
  }

  if (params.force !== true) {
    if (!game.runtime.running) {
      return false;
    }
    game.countMove();
  }

  temp.col = tile.col;
  temp.row = tile.row;

  tile.col = hole.col;
  tile.row = hole.row;

  hole.col = temp.col;
  hole.row = temp.row;

  if (params.refresh === true) {
    game.refresh({
      transitions: params.transitions,
      saveGame: !params.force,
      redraw: !!!params.force
    });
  }

  return true;
};
