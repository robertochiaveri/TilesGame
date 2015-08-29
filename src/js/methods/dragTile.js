game.dragTile = function(event) {

  if (!game.runtime.running) {
    game.deselectTile();
    return false;
  }

  var tile = game.isTile(game.runtime.selectedTile),
    direction,
    newposX,
    newPosY,
    offset,
    otherTile,
    otherTileNewPos,
    CSSstyleDeclaration = null;

  if (!tile ||
    (!!!tile.canMove && !tile.canPush.n) ||
    (typeof tile.offset == "undefined") ||
    (typeof tile.newPosition == "undefined")
  ) {
    game.deselectTile();
    return false;
  };

  newPosX = event.pageX - game.metrics.borderSize.pixels - game.metrics
    .left - tile.offset.left;
  newPosY = event.pageY - game.metrics.borderSize.pixels - game.metrics
    .top - tile.offset.top;

  direction = (game.config.pushMultiple && tile.canPush) ? tile.canPush
    .direction : tile.canMove;

  if (newPosY < tile.newPosition.top.min.pixels) {
    newPosY = tile.newPosition.top.min.pixels;
  };
  if (newPosY > tile.newPosition.top.max.pixels) {
    newPosY = tile.newPosition.top.max.pixels;
  };
  if (newPosX < tile.newPosition.left.min.pixels) {
    newPosX = tile.newPosition.left.min.pixels;
  };
  if (newPosX > tile.newPosition.left.max.pixels) {
    newPosX = tile.newPosition.left.max.pixels;
  };



  if (event.pageX - game.metrics.left - game.metrics.borderSize.pixels +
    game.metrics.tileWidth * (game.config.touchTolerance) < newPosX ||
    event.pageX - game.metrics.left - game.metrics.borderSize.pixels -
    game.metrics.tileWidth * (1 + game.config.touchTolerance) >
    newPosX ||
    event.pageY - game.metrics.top - game.metrics.borderSize.pixels +
    game.metrics.tileHeight * (game.config.touchTolerance) <
    newPosY ||
    event.pageY - game.metrics.top - game.metrics.borderSize.pixels -
    game.metrics.tileHeight * (1 + game.config.touchTolerance) >
    newPosY
  ) {

    game.deselectTile();

    // console.log("dropped!");

    return false;
  }



  var prefix = "";

  switch (direction) {

    case game.config.labels.LEFT:
    case game.config.labels.RIGHT:

      tile.newPosition.top.newValue.pixels = tile.oldPosition.top.pixels;
      tile.newPosition.left.newValue.pixels = newPosX;

      tile.newPosition.left.newValue.percent = newPosX * 100 / game
        .metrics
        .tileWidth;

      // write the css for tile html element

      for (var p = 0; p < game.config.CSSprefixes.length; p++) {
        prefix = game.config.CSSprefixes[p];
        CSSstyleDeclaration += prefix + "transform:translate" +
          game.metrics
          .transforms3Dsupport[0] + "(" + tile.newPosition.left.newValue
          .percent + "%," + tile.oldPosition.top.percent + "%" +
          game.metrics
          .transforms3Dsupport[1] + "); " + prefix +
          "transition:none; ";
      }
      tile.htmlElement.style.cssText = CSSstyleDeclaration;
      break;


    case game.config.labels.UP:
    case game.config.labels.DOWN:

      tile.newPosition.top.newValue.pixels = newPosY;
      tile.newPosition.left.newValue.pixels = tile.oldPosition.left
        .pixels;

      tile.newPosition.top.newValue.percent = newPosY * 100 / game.metrics
        .tileHeight;

      // write the css for tile html element
      for (var p = 0; p < game.config.CSSprefixes.length; p++) {
        prefix = game.config.CSSprefixes[p];
        CSSstyleDeclaration += prefix + "transform:translate" +
          game.metrics
          .transforms3Dsupport[0] + "(" + tile.oldPosition.left.percent +
          "%," + tile.newPosition.top.newValue.percent + "%" + game
          .metrics
          .transforms3Dsupport[1] + "); " + prefix +
          "transition:none; ";
      }
      tile.htmlElement.style.cssText = CSSstyleDeclaration;

      break;

  }

  if (!game.config.pushMultiple || typeof tile.canPush.tiles ==
    "undefined") {
    return;
  }


  for (var i = 0; i < tile.canPush.tiles.length; i++) {
    otherTile = tile.canPush.tiles[i];
    var prefix = "";

    switch (direction) {
      case game.config.labels.UP:

        otherTileNewPos = (tile.newPosition.top.newValue.pixels - (
          game
          .metrics.tileHeight * (i + 1)));
        if (otherTileNewPos < tile.canPush.tiles[i].max || tile.canPush
          .tiles[i].max == null) {
          tile.canPush.tiles[i].max = otherTileNewPos;
        } else {
          return false;
        }

        // write the css for tile html element

        for (var p = 0; p < game.config.CSSprefixes.length; p++) {
          prefix = game.config.CSSprefixes[p];
          CSSstyleDeclaration += prefix + "transform:translate" +
            game.metrics
            .transforms3Dsupport[0] + "(" + tile.oldPosition.left.percent +
            "%," + otherTileNewPos + "px" + game.metrics.transforms3Dsupport[
              1] + "); " + prefix + "transition:none; ";
        }

        break;

      case game.config.labels.RIGHT:

        otherTileNewPos = (tile.newPosition.left.newValue.pixels +
          (
            game.metrics.tileWidth * (i + 1)));
        if (otherTileNewPos > tile.canPush.tiles[i].max || tile.canPush
          .tiles[i].max == null) {
          tile.canPush.tiles[i].max = otherTileNewPos;
        } else {
          return false;
        }

        // write the css for tile html element
        for (var p = 0; p < game.config.CSSprefixes.length; p++) {
          prefix = game.config.CSSprefixes[p];
          CSSstyleDeclaration += prefix + "transform:translate" +
            game.metrics
            .transforms3Dsupport[0] + "(" + otherTileNewPos + "px," +
            tile.oldPosition.top.percent + "%" + game.metrics.transforms3Dsupport[
              1] + "); " + prefix + "transition:none; ";
        }
        break;

      case game.config.labels.DOWN:

        otherTileNewPos = (tile.newPosition.top.newValue.pixels + (
          game
          .metrics.tileHeight * (i + 1)));
        if (otherTileNewPos > tile.canPush.tiles[i].max || tile.canPush
          .tiles[i].max == null) {
          tile.canPush.tiles[i].max = otherTileNewPos;
        } else {
          return false;
        }

        // write the css for tile html element
        for (var p = 0; p < game.config.CSSprefixes.length; p++) {
          prefix = game.config.CSSprefixes[p];
          CSSstyleDeclaration += prefix + "transform:translate" +
            game.metrics
            .transforms3Dsupport[0] + "(" + tile.oldPosition.left.percent +
            "%," + otherTileNewPos + "px" + game.metrics.transforms3Dsupport[
              1] + "); " + prefix + "transition:none; ";
        }


        break;

      case game.config.labels.LEFT:

        otherTileNewPos = (tile.newPosition.left.newValue.pixels -
          (
            game.metrics.tileWidth * (i + 1)));
        if (otherTileNewPos < tile.canPush.tiles[i].max || tile.canPush
          .tiles[i].max == null) {
          tile.canPush.tiles[i].max = otherTileNewPos;
        } else {
          return false;
        }

        // write the css for tile html element
        for (var p = 0; p < game.config.CSSprefixes.length; p++) {
          prefix = game.config.CSSprefixes[p];
          CSSstyleDeclaration += prefix + "transform:translate" +
            game.metrics
            .transforms3Dsupport[0] + "(" + otherTileNewPos + "px," +
            tile.oldPosition.top.percent + "%" + game.metrics.transforms3Dsupport[
              1] + "); " + prefix + "transition:none; ";
        }

        break;

    }
    otherTile.htmlElement.style.cssText = CSSstyleDeclaration;

    if (
      Math.abs(tile.oldPosition.left.pixels - tile.newPosition.left
        .newValue
        .pixels) > game.metrics.tileWidth / 4 ||
      Math.abs(tile.oldPosition.top.pixels - tile.newPosition.top.newValue
        .pixels) > game.metrics.tileHeight / 4
    ) {
      otherTile.revert = false;
    } else {
      otherTile.revert = true;
    }

  }
};
