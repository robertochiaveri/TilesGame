game.dragTile = function(event) {
  "use strict";

  if (!this.runtime.running) {
    this.deselectTile();
    return false;
  }

  var tile = this.isTile(this.runtime.selectedTile),
    direction,
    newPosX,
    newPosY,
    otherTile,
    otherTileNewPos,
    CSSstyleDeclaration = "",
    p;

  if (!tile ||
    (!!!tile.canMove && !tile.canPush.n) ||
    (typeof tile.offset === "undefined") ||
    (typeof tile.newPosition === "undefined")
  ) {
    this.deselectTile();
    return false;
  };

  newPosX = event.pageX - this.metrics.borderSize.pixels - this.metrics.left - tile.offset.left;
  newPosY = event.pageY - this.metrics.borderSize.pixels - this.metrics.top - tile.offset.top;

  direction = (this.config.pushMultiple && tile.canPush) ? tile.canPush.direction : tile.canMove;

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



  if (
    event.pageX - this.metrics.left - this.metrics.borderSize.pixels + this.metrics.tileWidth * (this.config.touchTolerance) < newPosX ||
    event.pageX - this.metrics.left - this.metrics.borderSize.pixels - this.metrics.tileWidth * (1 + this.config.touchTolerance) > newPosX ||
    event.pageY - this.metrics.top - this.metrics.borderSize.pixels + this.metrics.tileHeight * (this.config.touchTolerance) < newPosY ||
    event.pageY - this.metrics.top - this.metrics.borderSize.pixels - this.metrics.tileHeight * (1 + this.config.touchTolerance) > newPosY
  ) {

    //    this.vibrate("bump");
    this.deselectTile();

    // console.log("dropped!");

    return false;
  }



  var prefix = "";

  switch (direction) {

    case this.config.labels.LEFT:
    case this.config.labels.RIGHT:

      tile.newPosition.top.newValue.pixels = tile.oldPosition.top.pixels;
      tile.newPosition.left.newValue.pixels = newPosX;

      tile.newPosition.left.newValue.percent = newPosX * 100 / game.metrics.tileWidth;

      // write the css for tile html element

      for (p = 0; p < this.config.browserPrefixes.css.length; p++) {
        prefix = this.config.browserPrefixes.css[p];
        CSSstyleDeclaration += prefix + "transform:translate" + this.metrics.transforms3Dsupport[0] + "(" + tile.newPosition.left.newValue.percent + "%," + tile.oldPosition.top.percent + "%" + this.metrics.transforms3Dsupport[1] + "); " + prefix + "transition:none; ";
      }
      tile.htmlElement.style.cssText = CSSstyleDeclaration;
      break;


    case this.config.labels.UP:
    case this.config.labels.DOWN:

      tile.newPosition.top.newValue.pixels = newPosY;
      tile.newPosition.left.newValue.pixels = tile.oldPosition.left.pixels;

      tile.newPosition.top.newValue.percent = newPosY * 100 / this.metrics.tileHeight;

      // write the css for tile html element
      for (p = 0; p < this.config.browserPrefixes.css.length; p++) {
        prefix = this.config.browserPrefixes.css[p];
        CSSstyleDeclaration += prefix + "transform:translate" + this.metrics.transforms3Dsupport[0] + "(" + tile.oldPosition.left.percent + "%," + tile.newPosition.top.newValue.percent + "%" + game.metrics.transforms3Dsupport[1] + "); " + prefix + "transition:none; ";
      }
      tile.htmlElement.style.cssText = CSSstyleDeclaration;

      break;

  }

  if (!this.config.pushMultiple || typeof tile.canPush.tiles === "undefined") {
    return;
  }


  for (var i = 0; i < tile.canPush.tiles.length; i++) {

    otherTile = tile.canPush.tiles[i];
    prefix = "";

    switch (direction) {
      case this.config.labels.UP:

        otherTileNewPos = (tile.newPosition.top.newValue.pixels - (this.metrics
          .tileHeight * (i + 1)));

        if (
          otherTileNewPos < tile.canPush.tiles[i].max ||
          tile.canPush.tiles[i].max == null) {
          tile.canPush.tiles[i].max = otherTileNewPos;
        } else {
          return false;
        }

        // write the css for tile html element

        for (p = 0; p < this.config.browserPrefixes.css.length; p++) {
          prefix = this.config.browserPrefixes.css[p];
          CSSstyleDeclaration += prefix + "transform:translate" + this.metrics
            .transforms3Dsupport[0] + "(" + tile.oldPosition.left.percent +
            "%," + otherTileNewPos + "px" + this.metrics.transforms3Dsupport[
              1] + "); " + prefix + "transition:none; ";
        }

        break;

      case this.config.labels.RIGHT:

        otherTileNewPos = (tile.newPosition.left.newValue.pixels +
          (
            this.metrics.tileWidth * (i + 1)));
        if (otherTileNewPos > tile.canPush.tiles[i].max || tile.canPush
          .tiles[i].max == null) {
          tile.canPush.tiles[i].max = otherTileNewPos;
        } else {
          return false;
        }

        // write the css for tile html element
        for (p = 0; p < this.config.browserPrefixes.css.length; p++) {
          prefix = this.config.browserPrefixes.css[p];
          CSSstyleDeclaration += prefix + "transform:translate" +
            this.metrics
            .transforms3Dsupport[0] + "(" + otherTileNewPos + "px," +
            tile.oldPosition.top.percent + "%" + this.metrics.transforms3Dsupport[
              1] + "); " + prefix + "transition:none; ";
        }
        break;

      case this.config.labels.DOWN:

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
        for (p = 0; p < this.config.browserPrefixes.css.length; p++) {
          prefix = this.config.browserPrefixes.css[p];
          CSSstyleDeclaration += prefix + "transform:translate" +
            this.metrics
            .transforms3Dsupport[0] + "(" + tile.oldPosition.left.percent +
            "%," + otherTileNewPos + "px" + this.metrics.transforms3Dsupport[
              1] + "); " + prefix + "transition:none; ";
        }


        break;

      case this.config.labels.LEFT:

        otherTileNewPos = (tile.newPosition.left.newValue.pixels -
          (
            this.metrics.tileWidth * (i + 1)));
        if (otherTileNewPos < tile.canPush.tiles[i].max || tile.canPush
          .tiles[i].max == null) {
          tile.canPush.tiles[i].max = otherTileNewPos;
        } else {
          return false;
        }

        // write the css for tile html element
        for (p = 0; p < this.config.browserPrefixes.css.length; p++) {
          prefix = this.config.browserPrefixes.css[p];
          CSSstyleDeclaration += prefix + "transform:translate" +
            this.metrics
            .transforms3Dsupport[0] + "(" + otherTileNewPos + "px," +
            tile.oldPosition.top.percent + "%" + this.metrics.transforms3Dsupport[
              1] + "); " + prefix + "transition:none; ";
        }

        break;

    }
    otherTile.htmlElement.style.cssText = CSSstyleDeclaration;



    if (
      (Math.abs(tile.newPosition.left.newValue.pixels - tile.oldPosition.left.pixels) >= this.metrics.tileWidth * this.config.minDistanceToMoveTile) ||
      (Math.abs(tile.newPosition.top.newValue.pixels - tile.oldPosition.top.pixels) >= this.metrics.tileHeight * this.config.minDistanceToMoveTile)
    ) {
      otherTile.revert = false;
    } else {
      otherTile.revert = true;
    }

  }
};
