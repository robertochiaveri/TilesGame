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

  console.log("refresh", params);

  for (var i = 0; i < this.config.size.n; i++) {

    tileID = this.config.labels.TILE_PREFIX + i;
    tile = this.runtime.tiles[tileID];

    // write the css for tile html element
    var prefix = "";
    for (var p = 0; p < this.config.browserPrefixes.css.length; p++) {

      prefix = this.config.browserPrefixes.css[p];

      CSSstyleDeclaration += prefix + "transform:translate" + this.metrics.transforms3Dsupport[0] + "(" + (tile.col * 100) + "%," + (tile.row * 100) + "%" + this.metrics.transforms3Dsupport[1] + "); ";
      CSSstyleDeclaration += prefix + "transition-property:" + prefix + "transform;";
      CSSstyleDeclaration += prefix + "transition-duration:" + parseInt(Math.abs(params.transitionDuration)) + "ms !important;";
      CSSstyleDeclaration += prefix + "transition-timing-function:" + this.config.easings.EASING_TILES_MOVEMENT + ";";
    }


    if (params.redraw !== false) {
      tile.htmlElement.style.cssText = CSSstyleDeclaration;
    }

    tile.htmlElement.childNodes[0].style.backgroundPosition = "-" + (tile.correctCol * this.metrics.tileWidth) + "px -" + (tile.correctRow * this.metrics.tileHeight) + "px";

    tile.canMove = this.canMove(tileID);
    tile.canPush = this.canPush(tileID);

    // clean up data created when dragging or moving a tile
    tile.offse = undefined;
    tile.newPosition = undefined;
    tile.oldPosition = undefined;
    tile.timeStamp = undefined;
    tile.revert = undefined;
    tile.max = undefined;

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

    this.newGame();
  }

  if (params.saveGame === true) {
    this.saveGame();
  }
};
