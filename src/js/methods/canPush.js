game.canPush = function(tile) {
  "use strict";
  tile = this.isTile(tile) || false;

  var hole = this.runtime.tiles[this.config.labels.TILE_PREFIX + this.config.labels.HOLE_INDEX];
  var tilesToPush = 0;
  var pushableTiles = 0;

  if (!tile) {
    return false;
  };

  if (this.config.pushMultiple) {
    if (tile.col === hole.col || tile.row === hole.row) {

      tilesToPush = (tile.col - hole.col === 0) ? hole.row - tile.row : hole.col - tile.col;
      pushableTiles = Math.abs(tilesToPush) - 1;


      if (tilesToPush === 0 || pushableTiles === 0) {
        return false;
      }


      if (tile.col === hole.col) // up or down
      {
        if (tilesToPush > 0) // down
        {
          return ({
            n: pushableTiles,
            direction: this.config.labels.DOWN
          });
        } else // up
        {
          return ({
            n: pushableTiles,
            direction: this.config.labels.UP
          });
        }
      } else // left or right
      {
        if (tilesToPush > 0) // right
        {
          return ({
            n: pushableTiles,
            direction: this.config.labels.RIGHT
          });
        } else // left
        {
          return ({
            n: pushableTiles,
            direction: this.config.labels.LEFT
          });
        }
      }
    }

  }

  return false;
};
