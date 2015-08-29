game.getMovableTiles = function(params) {
  var direction = params.direction,
    pushing = params.pushing,
    moving = params.moving,
    t;

  game.runtime.movableTiles = [];

  if (game.runtime.running || params.force === true) {
    for (var i = 0; i < game.config.size.n; i++) {
      t = game.runtime.tiles["tile-" + i];

      if (!!t.canMove && moving && (typeof direction == "undefined" ||
          direction == t.canMove)) {
        game.runtime.movableTiles.push(game.getTile(game.config.labels
          .TILE_PREFIX + t.i));
      };

      if (
        game.config.pushMultiple && pushing && !!t.canPush && !t.canMove &&
        (typeof direction == "undefined" || direction == t.canPush.direction)
      ) {
        game.runtime.movableTiles.push(game.getTile(game.config.labels
          .TILE_PREFIX + t.i));
      };
    }

  }
  return game.runtime.movableTiles
};
