game.deselectTile = function() {
  "use strict";

  var tile = game.isTile(game.runtime.selectedTile);
  if (!tile) {
    return false;
  };

  game.utils.removeClass(tile.htmlElement, game.config.labels.SELECTED_LABEL);
  game.utils.removeClass(tile.htmlElement, game.config.labels.PRESSED_LABEL);


  if (typeof tile.newPosition === "undefined") {
    return false;
  };

  if (typeof tile.newPosition.left.newValue.pixels !== "undefined") {

    if (game.config.pushMultiple && typeof tile.canPush.tiles !== "undefined") {

      for (var i = tile.canPush.tiles.length; i > 0; i--) {
        if (tile.canPush.tiles[0].revert !== true) {
          game.moveTile(
            tile.canPush.tiles[i - 1], {
              transitions: true,
              force: false,
              refresh: false
            }
          );
        }
        game.utils.removeClass(tile.canPush.tiles[i - 1].htmlElement, game.config
          .labels
          .SELECTED_LABEL);
      }


      if (
        (Math.abs(tile.newPosition.left.newValue.pixels - tile.oldPosition
          .left.pixels) >= game.metrics.tileWidth / 3) ||
        (Math.abs(tile.newPosition.top.newValue.pixels - tile.oldPosition
          .top.pixels) >= game.metrics.tileHeight / 3)
      ) {
        game.moveTile(
          tile, {
            transitions: true,
            force: false,
            refresh: false
          }
        );

      }

      game.runtime.selectedTile = null;

      // console.log("de-selected",tile);

      game.refresh({
        saveGame: true
      });

    } else {
      if (
        (tile.newPosition.left.newValue.pixels != null) &&
        (
          (Math.abs(tile.newPosition.left.newValue.pixels - tile.oldPosition
            .left.pixels) >= game.metrics.tileWidth / 3) ||
          (Math.abs(tile.newPosition.top.newValue.pixels - tile.oldPosition
            .top.pixels) >= game.metrics.tileHeight / 3)
        )
      ) {
        game.moveTile(
          tile, {
            transitions: true,
            force: false,
            refresh: true
          }
        );
      } else {
        game.refresh();
      }

    }

  }

  game.runtime.selectedTile = null;
  game.runtime.dragging = false;
};
