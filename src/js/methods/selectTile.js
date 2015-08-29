game.selectTile = function(tile, event) {
  "use strict";

  if (!this.runtime.running) {
    return false;
  }

  tile = this.isTile(tile);

  if (!tile) {
    return false;
  };

  var direction = (this.config.pushMultiple && tile.canPush) ? tile.canPush.direction : tile.canMove;

  this.runtime.selectedTile = tile;

  if (this.canMove(tile) || this.config.pushMultiple) {

    this.runtime.selectedTile.timeStamp = (typeof event !== "undefined") ? event.timeStamp : new Date();

    this.runtime.selectedTile.oldPosition = {

      left: {
        percent: 100 * tile.col,
        pixels: this.metrics.tileWidth * tile.col
      },
      top: {
        percent: 100 * tile.row,
        pixels: this.metrics.tileHeight * tile.row
      }

    };
    this.runtime.selectedTile.offset = (typeof event !== "undefined") ? {
      top: ((event.pageY - this.metrics.top - this.metrics.borderSize.pixels) % this.metrics.tileHeight),
      left: ((event.pageX - this.metrics.left - this.metrics.borderSize.pixels) % this.metrics.tileWidth)
    } : {
      top: this.metrics.tileHeight / 2,
      left: this.metrics.tileWidth / 2
    };

    this.runtime.selectedTile.newPosition = {
      top: {
        min: {
          pixels: null,
          percent: null
        },
        newValue: {
          pixels: null,
          percent: null
        },
        max: {
          pixels: null,
          percent: null
        }
      },
      left: {
        min: {
          pixels: null,
          percent: null
        },
        newValue: {
          pixels: null,
          percent: null
        },
        max: {
          pixels: null,
          percent: null
        }
      }
    };

    switch (direction) {

      case this.config.labels.UP:
        this.runtime.selectedTile.newPosition.top.min.pixels = Math.round(this.runtime.selectedTile.oldPosition.top.pixels - this.metrics.tileHeight);
        this.runtime.selectedTile.newPosition.top.max.pixels = Math.round(this.runtime.selectedTile.oldPosition.top.pixels);
        this.runtime.selectedTile.newPosition.left.min.pixels = Math.round(this.runtime.selectedTile.oldPosition.left.pixels);
        this.runtime.selectedTile.newPosition.left.max.pixels = Math.round(this.runtime.selectedTile.oldPosition.left.pixels);
        break;

      case this.config.labels.DOWN:
        this.runtime.selectedTile.newPosition.top.min.pixels = Math.round(this.runtime.selectedTile.oldPosition.top.pixels);
        this.runtime.selectedTile.newPosition.top.max.pixels = Math.round(this.runtime.selectedTile.oldPosition.top.pixels + this.metrics.tileHeight);
        this.runtime.selectedTile.newPosition.left.min.pixels = Math.round(this.runtime.selectedTile.oldPosition.left.pixels);
        this.runtime.selectedTile.newPosition.left.max.pixels = Math.round(this.runtime.selectedTile.oldPosition.left.pixels);
        break;

      case this.config.labels.LEFT:
        this.runtime.selectedTile.newPosition.left.min.pixels = Math.round(this.runtime.selectedTile.oldPosition.left.pixels - this.metrics.tileWidth);
        this.runtime.selectedTile.newPosition.left.max.pixels = Math.round(this.runtime.selectedTile.oldPosition.left.pixels);
        this.runtime.selectedTile.newPosition.top.min.pixels = Math.round(this.runtime.selectedTile.oldPosition.top.pixels);
        this.runtime.selectedTile.newPosition.top.max.pixels = Math.round(this.runtime.selectedTile.oldPosition.top.pixels);
        break;

      case this.config.labels.RIGHT:
        this.runtime.selectedTile.newPosition.left.min.pixels = Math.round(this.runtime.selectedTile.oldPosition.left.pixels);
        this.runtime.selectedTile.newPosition.left.max.pixels = Math.round(this.runtime.selectedTile.oldPosition.left.pixels + this.metrics.tileWidth);
        this.runtime.selectedTile.newPosition.top.min.pixels = Math.round(this.runtime.selectedTile.oldPosition.top.pixels);
        this.runtime.selectedTile.newPosition.top.max.pixels = Math.round(this.runtime.selectedTile.oldPosition.top.pixels);
        break;
    }

    if (!this.runtime.dragging) {
      this.utils.addClass(tile.htmlElement, this.config.labels.PRESSED_LABEL +
        " " +
        this.config.labels.SELECTED_LABEL);
    }

    if (tile.canPush !== false && this.config.pushMultiple) {

      tile.canPush.tiles = [];

      for (var i = 1; i <= tile.canPush.n; i++) {

        switch (tile.canPush.direction) {

          case this.config.labels.UP:
            tile.canPush.tiles.push(this.getTile({
              col: tile.col,
              row: tile.row - i
            }));
            break;

          case this.config.labels.RIGHT:
            tile.canPush.tiles.push(this.getTile({
              col: tile.col + i,
              row: tile.row
            }));
            break;

          case this.config.labels.DOWN:
            tile.canPush.tiles.push(this.getTile({
              col: tile.col,
              row: tile.row + i
            }));
            break;

          case this.config.labels.LEFT:
            tile.canPush.tiles.push(this.getTile({
              col: tile.col - i,
              row: tile.row
            }));
            break;

        }

        tile.canPush.tiles[i - 1].max = null;

        if (!this.runtime.dragging) {

          this.utils.addClass(tile.canPush.tiles[i - 1].htmlElement, this.config
            .labels
            .SELECTED_LABEL);

        }

      }

    }

    this.runtime.dragging = true;

    //console.log("selected",tile);

  }
};
