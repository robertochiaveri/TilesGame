game.selectTile = function(tile, event) {
  "use strict";
  if (!game.runtime.running) {
    return false;
  }

  tile = game.isTile(tile);

  if (!tile) {
    return false;
  };

  var direction = (game.config.pushMultiple && tile.canPush) ? tile.canPush.direction : tile.canMove;

  game.runtime.selectedTile = tile;

  if (game.canMove(tile) || game.config.pushMultiple) {
    game.runtime.selectedTile.timeStamp = (typeof event !== "undefined") ?
      event.timeStamp : new Date();

    game.runtime.selectedTile.oldPosition = {

      left: {
        percent: 100 * tile.col,
        pixels: game.metrics.tileWidth * tile.col
      },
      top: {
        percent: 100 * tile.row,
        pixels: game.metrics.tileHeight * tile.row
      }

    };
    game.runtime.selectedTile.offset = (typeof event !== "undefined") ? {
      top: ((event.pageY - game.metrics.top - game.metrics.borderSize
        .pixels) % game.metrics.tileHeight),
      left: ((event.pageX - game.metrics.left - game.metrics.borderSize
        .pixels) % game.metrics.tileWidth)
    } : {
      top: game.metrics.tileHeight / 2,
      left: game.metrics.tileWidth / 2
    };

    game.runtime.selectedTile.newPosition = {
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

      case game.config.labels.UP:
        game.runtime.selectedTile.newPosition.top.min.pixels = Math
          .round(
            game.runtime.selectedTile.oldPosition.top.pixels - game
            .metrics
            .tileHeight);
        game.runtime.selectedTile.newPosition.top.max.pixels = Math
          .round(
            game.runtime.selectedTile.oldPosition.top.pixels);
        game.runtime.selectedTile.newPosition.left.min.pixels =
          Math.round(
            game.runtime.selectedTile.oldPosition.left.pixels);
        game.runtime.selectedTile.newPosition.left.max.pixels =
          Math.round(
            game.runtime.selectedTile.oldPosition.left.pixels);
        break;

      case game.config.labels.DOWN:
        game.runtime.selectedTile.newPosition.top.min.pixels = Math
          .round(
            game.runtime.selectedTile.oldPosition.top.pixels);
        game.runtime.selectedTile.newPosition.top.max.pixels = Math
          .round(
            game.runtime.selectedTile.oldPosition.top.pixels + game
            .metrics
            .tileHeight);
        game.runtime.selectedTile.newPosition.left.min.pixels =
          Math.round(
            game.runtime.selectedTile.oldPosition.left.pixels);
        game.runtime.selectedTile.newPosition.left.max.pixels =
          Math.round(
            game.runtime.selectedTile.oldPosition.left.pixels);
        break;

      case game.config.labels.LEFT:
        game.runtime.selectedTile.newPosition.left.min.pixels =
          Math.round(
            game.runtime.selectedTile.oldPosition.left.pixels -
            game.metrics
            .tileWidth);
        game.runtime.selectedTile.newPosition.left.max.pixels =
          Math.round(
            game.runtime.selectedTile.oldPosition.left.pixels);
        game.runtime.selectedTile.newPosition.top.min.pixels = Math
          .round(
            game.runtime.selectedTile.oldPosition.top.pixels);
        game.runtime.selectedTile.newPosition.top.max.pixels = Math
          .round(
            game.runtime.selectedTile.oldPosition.top.pixels);
        break;

      case game.config.labels.RIGHT:
        game.runtime.selectedTile.newPosition.left.min.pixels =
          Math.round(
            game.runtime.selectedTile.oldPosition.left.pixels);
        game.runtime.selectedTile.newPosition.left.max.pixels =
          Math.round(
            game.runtime.selectedTile.oldPosition.left.pixels +
            game.metrics
            .tileWidth);
        game.runtime.selectedTile.newPosition.top.min.pixels = Math
          .round(
            game.runtime.selectedTile.oldPosition.top.pixels);
        game.runtime.selectedTile.newPosition.top.max.pixels = Math
          .round(
            game.runtime.selectedTile.oldPosition.top.pixels);
        break;
    }

    if (!game.runtime.dragging) {
      game.utils.addClass(tile.htmlElement, game.config.labels.PRESSED_LABEL +
        " " +
        game.config.labels.SELECTED_LABEL);
    }

    if (tile.canPush !== false && game.config.pushMultiple) {

      tile.canPush.tiles = [];

      for (var i = 1; i <= tile.canPush.n; i++) {

        switch (tile.canPush.direction) {

          case game.config.labels.UP:
            tile.canPush.tiles.push(game.getTile({
              col: tile.col,
              row: tile.row - i
            }));
            break;

          case game.config.labels.RIGHT:
            tile.canPush.tiles.push(game.getTile({
              col: tile.col + i,
              row: tile.row
            }));
            break;

          case game.config.labels.DOWN:
            tile.canPush.tiles.push(game.getTile({
              col: tile.col,
              row: tile.row + i
            }));
            break;

          case game.config.labels.LEFT:
            tile.canPush.tiles.push(game.getTile({
              col: tile.col - i,
              row: tile.row
            }));
            break;

        }

        tile.canPush.tiles[i - 1].max = null;

        if (!game.runtime.dragging) {

          game.utils.addClass(tile.canPush.tiles[i - 1].htmlElement, game.config
            .labels
            .SELECTED_LABEL);

        }

      }

    }

    game.runtime.dragging = true;

    //console.log("selected",tile);

  }
};
