game = game || {};

game.canPush = function(tile) {

  var tile = game.isTile(tile),
    hole = game.runtime.tiles[game.config.labels.TILE_PREFIX + game
      .config
      .labels.HOLE_INDEX],
    holePosition = hole.col + "-" + hole.row,
    tilesToPush = 0;

  if (!tile) {
    return false;
  };

  if (game.config.pushMultiple) {
    if (tile.col == hole.col || tile.row == hole.row) {
      tilesToPush = (tile.col - hole.col == 0) ? hole.row - tile.row :
        hole.col - tile.col;
      if (tilesToPush == 0) {
        return false;
      }

      if (tile.col == hole.col) // up or down
      {
        if (tilesToPush > 0) // down
        {
          return ({
            n: (Math.abs(tilesToPush) - 1),
            direction: game.config.labels.DOWN
          });
        } else // up
        {
          return ({
            n: (Math.abs(tilesToPush) - 1),
            direction: game.config.labels.UP
          });
        }
      } else // left or right
      {
        if (tilesToPush > 0) // right
        {
          return ({
            n: (Math.abs(tilesToPush) - 1),
            direction: game.config.labels.RIGHT
          });
        } else // left
        {
          return ({
            n: (Math.abs(tilesToPush) - 1),
            direction: game.config.labels.LEFT
          });
        }
      }
    }

  }

  return false;
};
