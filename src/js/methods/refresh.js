game.refresh = function(params) {

  var tileID,
    tile,
    CSSstyleDeclaration = "",
    win = true;

  if (typeof params == "undefined") {
    params = {
      transitions: true,
      saveGame: false
    };
  };

  if (params.transitions === false) {
    params.transitionDuration = 0;
  } else // transitions = true
  {
    if (typeof params.transitionDuration != "number") {
      params.transitionDuration = game.config.transitionDuration.generic;
    }
  };


  for (var i = 0; i < game.config.size.n; i++) {

    tileID = game.config.labels.TILE_PREFIX + i;
    tile = game.runtime.tiles[tileID];

    // write the css for tile html element
    var prefix = "";
    for (var p = 0; p < game.config.CSSprefixes.length; p++) {
      prefix = game.config.CSSprefixes[p];
      CSSstyleDeclaration += prefix + "transform:translate" + game.metrics
        .transforms3Dsupport[0] + "(" + (tile.col * 100) + "%," + (
          tile
          .row * 100) + "%" + game.metrics.transforms3Dsupport[1] +
        "); ";


      CSSstyleDeclaration += prefix + "transition-property:" +
        prefix +
        "transform;";
      CSSstyleDeclaration += prefix + "transition-duration:" +
        parseInt(
          Math.abs(params.transitionDuration)) + "ms !important;";
      CSSstyleDeclaration += prefix + "transition-timing-function:" +
        game.config.easings.EASING_TILES_MOVEMENT + ";";


    }


    if (params.redraw !== false) {
      tile.htmlElement.style.cssText = CSSstyleDeclaration;
    }

    tile.htmlElement.childNodes[0].style.backgroundPosition = "-" +
      (
        tile.correctCol * game.metrics.tileWidth) + "px -" + (tile.correctRow *
        game.metrics.tileHeight) + "px";

    tile.canMove = game.canMove(tileID);
    tile.canPush = game.canPush(tileID);

    // clean up data created when dragging or moving a tile
    delete tile.offset;
    delete tile.newPosition;
    delete tile.oldPosition;
    delete tile.timeStamp;
    delete tile.revert;
    delete tile.max;

    // check if the user has won
    if (tile.correctCol != tile.col || tile.correctRow != tile.row) {
      win = false;
    }

  };

  if (game.runtime.running && win /* && game.runtime.movesCount > 0 */ ) {
    setTimeout(function() {
      alert("Hai vinto!")
    }, 500);
    game.stop();
  }

  if (params.saveGame === true) {
    game.saveGame();
  }
};
