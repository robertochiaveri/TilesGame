game = game || {};

game.getTile = function(param) {

  var target = null,
    maxLevels = 5,
    tiles = game.runtime.tiles,
    col = parseInt(param.col),
    row = parseInt(param.row),
    prefix = game.config.labels.TILE_PREFIX;

  switch (typeof param) {

    case "object":

      if (param.srcElement) {
        target = param.srcElement;
      } else if (param.pageX && param.pageY) {
        target = document.elementFromPoint(param.pageX, param.pageY)
      } else if (!isNaN(parseInt(param.col)) && !isNaN(parseInt(
          param.row))) {

        for (var i = 0; i < game.config.size.n; i++) {
          if (tiles[prefix + i].col == col && tiles[prefix + i].row ==
            row) {
            return tiles[prefix + i];
          }
        }
        return false;
      } else {
        return false;
      }

      if (target === null) {
        return false;
      }

      for (i = 0; i < maxLevels; i++) {

        if (
          typeof target == "undefined" ||
          typeof target.parentNode == "undefined" ||
          target === null ||
          target.parentNode === null
        ) {
          return false;
        } else if (target.parentNode.id == game.config.labels.BOARD_ID) {
          return game.runtime.tiles[target.id]
        } else {
          target = target.parentNode;
        }
      }
      return false;

      break;

    case "string":
      if (param.indexOf(prefix) === 0) {
        return tiles[param];
      }
      return false;

    case "number":
      if (param < game.config.size.n) {
        return tiles[prefix + param];
      }
      return false;


  }
};
