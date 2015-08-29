game.deselectTile = function() {
  "use strict";

  var tile = this.isTile(this.runtime.selectedTile);
  if (!tile) {
    return false;
  };

  this.utils.removeClass(tile.htmlElement, this.config.labels.SELECTED_LABEL);
  this.utils.removeClass(tile.htmlElement, this.config.labels.PRESSED_LABEL);


  if (typeof tile.newPosition === "undefined") {
    return false;
  };

  if (typeof tile.newPosition.left.newValue.pixels !== "undefined") {

    if (this.config.pushMultiple && typeof tile.canPush.tiles !== "undefined") {

      for (var i = tile.canPush.tiles.length; i > 0; i--) {
        if (tile.canPush.tiles[0].revert !== true) {
          this.moveTile(
            tile.canPush.tiles[i - 1], {
              transitions: true,
              force: false,
              refresh: false
            }
          );
        }
        this.utils.removeClass(tile.canPush.tiles[i - 1].htmlElement, this.config.labels.SELECTED_LABEL);
      }


      if (
        (Math.abs(tile.newPosition.left.newValue.pixels - tile.oldPosition.left.pixels) >= this.metrics.tileWidth / 3) ||
        (Math.abs(tile.newPosition.top.newValue.pixels - tile.oldPosition.top.pixels) >= this.metrics.tileHeight / 3)
      ) {
        this.moveTile(
          tile, {
            transitions: true,
            force: false,
            refresh: false
          }
        );

      }

      this.runtime.selectedTile = null;

      // console.log("de-selected",tile);

      this.refresh({
        saveGame: true
      });

    } else {
      if (
        (tile.newPosition.left.newValue.pixels != null) &&
        (
          (Math.abs(tile.newPosition.left.newValue.pixels - tile.oldPosition.left.pixels) >= this.metrics.tileWidth / 3) ||
          (Math.abs(tile.newPosition.top.newValue.pixels - tile.oldPosition.top.pixels) >= this.metrics.tileHeight / 3)
        )
      ) {
        this.moveTile(
          tile, {
            transitions: true,
            force: false,
            refresh: true
          }
        );
      } else {
        this.refresh();
      }

    }

  }

  this.runtime.selectedTile = null;
  this.runtime.dragging = false;
};
