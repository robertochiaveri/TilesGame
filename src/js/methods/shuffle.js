game.shuffle = function(n, refresh) {

  console.log("shuffle");

  if (typeof n == "undefined") {
    n = 10 * game.config.size.n;
  }
  if (typeof refresh == "undefined") {
    refresh = true;
  }

  var directions = ["up", "right", "down", "left"];
  var movableTiles = [];

  var d;

  for (var i = 0; i < n; i++) {
    d = directions[Math.round(Math.random() * (directions.length -
      1))];

    movableTiles = game.getMovableTiles({
      direction: d,
      pushing: false,
      moving: true,
      force: true
    });

    game.moveTile(
      movableTiles[0], {
        transitions: false,
        force: true,
        refresh: true
      }
    );
  }

  if (refresh) {
    game.refresh({
      transitions: true,
      transitionDuration: 100
    });
  }
  t1 = new Date();
};
