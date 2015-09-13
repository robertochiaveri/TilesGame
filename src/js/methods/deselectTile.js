game.deselectTile = function() {
  "use strict";

  var tile = this.isTile(this.runtime.selectedTile);
  var tilesMoved = 0;

  if (!tile) {
    return false;
  };

  console.log("de-selecting");
  this.runtime.selectedTile = null;
  this.utils.removeClass(tile.htmlElement, this.config.labels.SELECTED_LABEL);
  this.utils.removeClass(tile.htmlElement, this.config.labels.PRESSED_LABEL);
  this.runtime.dragging = false;
  this.vibrate("deselect");

  if (typeof tile.newPosition === "undefined") {
    return false;
  };


  // has the tile been moved?
  if (tile.newPosition.left.newValue.pixels !== null) {

    console.log("the tile has been moved.")

    if ((this.config.pushMultiple && !!tile.canPush)) {

      console.log("the tile could push other tiles, so it must have pushed them.");

      for (var i = tile.canPush.tiles.length; i > 0; i--) {
        if (!tile.canPush.tiles[0].revert) {
          tilesMoved++;
          this.moveTile(
            tile.canPush.tiles[i - 1], {
              transitions: true,
              force: false,
              refresh: false
            }
          );
        };
        //  this.utils.removeClass(tile.canPush.tiles[i - 1].htmlElement, this.config.labels.SELECTED_LABEL);
      };

    }

    console.log("now, the tile has been released far enough to its original position in order to move it?")

    if (
      (Math.abs(tile.newPosition.left.newValue.pixels - tile.oldPosition.left.pixels) >= this.metrics.tileWidth * this.config.minDistanceToMoveTile) ||
      (Math.abs(tile.newPosition.top.newValue.pixels - tile.oldPosition.top.pixels) >= this.metrics.tileHeight * this.config.minDistanceToMoveTile)
    ) {

      console.log("yes, it's far enough. ")

      tilesMoved++;

      this.moveTile(
        tile, {
          transitions: true,
          force: false,
          refresh: false
        }
      );
    } else {
      console.log("nope, snapping back ")
    };



  } else {

    console.log("tile has not been moved at all.")

    if (this.config.clickToMove) {

      if (tile.canMove || (this.config.pushMultiple && !!tile.canPush)) {
        for (var i = tile.canPush.tiles.length; i > 0; i--) {
          tilesMoved++;
          this.moveTile(
            tile.canPush.tiles[i - 1], {
              transitions: true,
              force: false,
              refresh: false
            }
          );
          //    this.utils.removeClass(tile.canPush.tiles[i - 1].htmlElement, this.config.labels.SELECTED_LABEL);
        };

        tilesMoved++;
        this.moveTile(
          tile, {
            transitions: true,
            force: false,
            refresh: false
          }
        );


      };

    }

  };


  console.log("tiles moved: " + tilesMoved);

  this.refresh({
    saveGame: !!tilesMoved
  });

};
