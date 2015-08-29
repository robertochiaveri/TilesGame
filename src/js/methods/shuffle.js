game.shuffle = function(n, refresh) {
  "use strict";

  console.log("shuffle");

  if (typeof n === "undefined") {
    n = 10 * this.config.size.n;
  }
  if (typeof refresh === "undefined") {
    refresh = true;
  }

  var directions = [
    this.config.labels.UP,
    this.config.labels.RIGHT,
    this.config.labels.DOWN,
    this.config.labels.LEFT
  ];

  var movableTiles = [];

  var d;

  for (var i = 0; i < n; i++) {
    d = directions[Math.round(Math.random() * (directions.length - 1))];

    movableTiles = this.getMovableTiles({
      direction: d,
      pushing: false,
      moving: true,
      force: true
    });

    this.moveTile(
      movableTiles[0], {
        transitions: false,
        force: true,
        refresh: true
      }
    );
  }

  if (refresh) {
    this.refresh({
      transitions: true,
      transitionDuration: 100
    });
  }

};
