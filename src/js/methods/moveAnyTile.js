game.moveAnyTile = function(params) {


  var tiles = (params.pushing == true) ? game.getMovableTiles({
      pushing: false,
      moving: true,
      direction: params.direction
    }).concat(game.getMovableTiles({
      pushing: true,
      moving: false,
      direction: params.direction
    }).sort(function(t1, t2) {
      return t1.canPush.n - t2.canPush.n;
    })) :
    game.getMovableTiles({
      pushing: false,
      moving: true,
      direction: params.direction
    });
  for (var i = 0; i < tiles.length; i++) {
    game.moveTile(tiles[i], {
      transitions: false,
      force: false,
      refresh: false
    });
  }
  game.refresh({
    transitionDuration: game.config.transitionDuration.byKeyboard
  });

  return tiles;
};
