game.moveAnyTile = function(params) {
  "use strict";

  var tiles = (params.pushing === true) ? this.getMovableTiles({
      pushing: false,
      moving: true,
      direction: params.direction
    }).concat(this.getMovableTiles({
      pushing: true,
      moving: false,
      direction: params.direction
    }).sort(function(t1, t2) {
      return t1.canPush.n - t2.canPush.n;
    })) :
    this.getMovableTiles({
      pushing: false,
      moving: true,
      direction: params.direction
    });
  for (var i = 0; i < tiles.length; i++) {
    this.moveTile(tiles[i], {
      transitions: false,
      force: false,
      refresh: false
    });
  }
  this.refresh({
    transitionDuration: this.config.transitionDuration.byKeyboard
  });

  return tiles;
};
