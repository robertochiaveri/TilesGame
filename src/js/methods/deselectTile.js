game.deselectTile = function() {
  "use strict";

  var tile = this.isTile(this.runtime.selectedTile);
  var tileMoved = false;;
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

    if (this.config.pushMultiple && !!tile.canPush) {

      console.log("the tile could push other tiles, so it must have pushed them.");

      if (this.utils.isArray(tile.canPush.tiles)) {

        console.log("tile " + tile.id + " can push " + tile.canPush.tiles.length + " other tiles");

        for (var i = tile.canPush.tiles.length; i > 0; i--) {
          if (!tile.canPush.tiles[0].revert) {
            tileMoved = this.moveTile(
              tile.canPush.tiles[i - 1], {
                transitions: true,
                force: false,
                refresh: false
              }
            );
            if (tileMoved) {
              tilesMoved++;
              console.log("moved tile " + tile.canPush.tiles[i - 1].id);
            } else {
              console.log("..couldn't move tile " + tile.canPush.tiles[i - 1].id + "!");
            }
          };
          //  this.utils.removeClass(tile.canPush.tiles[i - 1].htmlElement, this.config.labels.SELECTED_LABEL);
        };
      }

    }

    console.log("now, the tile has been released far enough to its original position in order to move it?")

    if (
      (Math.abs(tile.newPosition.left.newValue.pixels - tile.oldPosition.left.pixels) >= this.metrics.tileWidth * this.config.minDistanceToMoveTile) ||
      (Math.abs(tile.newPosition.top.newValue.pixels - tile.oldPosition.top.pixels) >= this.metrics.tileHeight * this.config.minDistanceToMoveTile)
    ) {

      console.log("yes, it's far enough. ")

      tileMoved = this.moveTile(
        tile, {
          transitions: true,
          force: false,
          refresh: false
        }
      );
      if (tileMoved) {
        tilesMoved++;
        console.log("moved tile " + tile.id);
      } else {
        console.log("couldn't move tile " + tile.id + "!");
      }

    } else {
      console.log("nope, snapping back ")
    };



  } else {

    console.log("tile has not been moved at all.")

    if (this.config.clickToMove) {

      if (tile.canMove || (this.config.pushMultiple && !!tile.canPush)) {

        if (this.utils.isArray(tile.canPush.tiles)) {

          console.log("..but since clickToMove is active, I'm moving tiles anyway: tile " + tile.id + " can push " + tile.canPush.tiles.length + " other tiles");

          for (var i = tile.canPush.tiles.length; i > 0; i--) {
            tileMoved = this.moveTile(
              tile.canPush.tiles[i - 1], {
                transitions: true,
                force: false,
                refresh: false
              }
            );
            if (tileMoved) {
              tilesMoved++;
              console.log("moved tile " + tile.canPush.tiles[i - 1].id);
            } else {
              console.log("couldn't move tile " + tile.canPush.tiles[i - 1].id + "!");
            }
            //    this.utils.removeClass(tile.canPush.tiles[i - 1].htmlElement, this.config.labels.SELECTED_LABEL);
          };
        }

        tileMoved = this.moveTile(
          tile, {
            transitions: true,
            force: false,
            refresh: false
          }
        );
        if (tileMoved) {
          tilesMoved++;
          console.log("moved tile " + tile.id);
        } else {
          console.log("couldn't move tile " + tile.id + "!");
        }

      };

    }

  };


  console.log("tiles moved: " + tilesMoved);

  this.refresh({
    saveGame: !!tilesMoved
  });

};
