game.refresh = function(params) {
  "use strict";

  var tileID,
    tile,
    CSSstyleDeclaration = "",
    win = true;

  if (typeof params === "undefined") {
    params = {
      transitions: true,
      saveGame: false
    };
  };

  if (params.transitions === false) {
    params.transitionDuration = 0;
  } else // transitions = true
  {
    if (typeof params.transitionDuration !== "number") {
      params.transitionDuration = this.config.transitionDuration.generic;
    }
  };


  for (var i = 0; i < this.config.size.n; i++) {

    tileID = this.config.labels.TILE_PREFIX + i;
    tile = this.runtime.tiles[tileID];

    // write the css for tile html element
    var prefix = "";
    for (var p = 0; p < this.config.CSSprefixes.length; p++) {
      prefix = this.config.CSSprefixes[p];
      CSSstyleDeclaration += prefix + "transform:translate" + this.metrics
        .transforms3Dsupport[0] + "(" + (tile.col * 100) + "%," + (
          tile
          .row * 100) + "%" + this.metrics.transforms3Dsupport[1] +
        "); ";


      CSSstyleDeclaration += prefix + "transition-property:" +
        prefix +
        "transform;";
      CSSstyleDeclaration += prefix + "transition-duration:" +
        parseInt(
          Math.abs(params.transitionDuration)) + "ms !important;";
      CSSstyleDeclaration += prefix + "transition-timing-function:" +
        this.config.easings.EASING_TILES_MOVEMENT + ";";


    }


    if (params.redraw !== false) {
      tile.htmlElement.style.cssText = CSSstyleDeclaration;
    }

    tile.htmlElement.childNodes[0].style.backgroundPosition = "-" +
      (
        tile.correctCol * this.metrics.tileWidth) + "px -" + (tile.correctRow *
        this.metrics.tileHeight) + "px";

    tile.canMove = this.canMove(tileID);
    tile.canPush = this.canPush(tileID);

    // clean up data created when dragging or moving a tile
    delete tile.offset;
    delete tile.newPosition;
    delete tile.oldPosition;
    delete tile.timeStamp;
    delete tile.revert;
    delete tile.max;

    // check if the user has won
    if (tile.correctCol !== tile.col || tile.correctRow !== tile.row) {
      win = false;
    }

  };

  if (this.runtime.running && win /* && this.runtime.movesCount > 0 */ ) {
    setTimeout(function() {
      window.alert("Hai vinto!");
    }, 500);
    this.stop();
  }

  if (params.saveGame === true) {
    this.saveGame();
  }
};
