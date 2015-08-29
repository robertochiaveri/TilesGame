game.getMovableTiles = function(params) {
  "use strict";
  var direction = params.direction,
    pushing = params.pushing,
    moving = params.moving,
    t;

  this.runtime.movableTiles = [];

  if (this.runtime.running || params.force === true) {
    for (var i = 0; i < this.config.size.n; i++) {
      t = this.runtime.tiles["tile-" + i];

      if (!!t.canMove && moving && (typeof direction === "undefined" ||
          direction === t.canMove)) {
        this.runtime.movableTiles.push(this.getTile(this.config.labels.TILE_PREFIX +
          t.i));
      };

      if (this.config.pushMultiple && pushing && !!t.canPush && !t.canMove &&
        (typeof direction === "undefined" || direction === t.canPush.direction)
      ) {
        this.runtime.movableTiles.push(this.getTile(this.config.labels.TILE_PREFIX +
          t.i));
      };
    }

  };
  return this.runtime.movableTiles;
};
