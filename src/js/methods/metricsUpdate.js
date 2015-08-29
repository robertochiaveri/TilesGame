game.metricsUpdate = function() {
  "use strict";

  game.metrics = game.metrics || {};

  var wrapperHTML = document.getElementById(game.config.labels.WRAPPER_ID); // main wrapper html element
  var gameHTML = document.getElementById(game.config.labels.GAME_ID); // game div html element
  var wrapperWidth = wrapperHTML.offsetWidth;
  var wrapperHeight = wrapperHTML.offsetHeight;



  // save values in metrics obj
  game.metrics.transforms3Dsupport = (game.config.use3Dtransforms) ? [
    "3d", ",0"
  ] : ["", ""]; // allows transformations 2d and 3d 
  game.metrics.wrapperOrientation = (wrapperWidth >= wrapperHeight) ?
    game.config.labels.LANDSCAPE : game.config.labels.PORTRAIT;
  game.metrics.wrapperRatio = wrapperWidth / wrapperHeight;
  game.metrics.pixelRatio = (window.devicePixelRatio > 1) ? window.devicePixelRatio :
    1;


  // if it doesn't exists yet, create wrapperSize obj
  if (typeof game.metrics.wrapperSize === "undefined") {
    game.metrics.wrapperSize = {};
  }

  // if it doesn't exist yet, create a sub-obj for storing metric sinformation for each screen orientation    
  game.metrics.wrapperSize[game.metrics.wrapperOrientation] = {
    width: wrapperWidth,
    height: wrapperHeight,
  };

  // this is info about the board configuration
  game.metrics.boardLayout = (game.config.size.h >= game.config.size
      .v) ?
    game.config.labels.LANDSCAPE : game.config.labels.PORTRAIT;
  game.metrics.boardRatio = game.config.size.h / game.config.size.v;

  // this is a pregmatic way to calculate a good font size for tile numbers
  game.metrics.fontSize = parseInt((document.body.currentStyle || (
    window.getComputedStyle && getComputedStyle(document.body,
      null)) || document.body.style).fontSize);

  // initialize the margin around the game board
  game.metrics.marginH = {
    percent: game.config.margin.h,
    pixels: 0
  };

  // initialize the margin around the game board
  game.metrics.marginV = {
    percent: game.config.margin.v,
    pixels: 0
  };

  // initialize the bezel around the game board
  game.metrics.borderSize = {
    percent: game.config.borderSize,
    pixels: 0
  };

  // depending on orientation, calculate board size to optimize space
  // board will always be a square, so calculate width first
  if (game.metrics.wrapperOrientation === game.config.labels.LANDSCAPE) {

    game.metrics.height = game.utils.roundTo(wrapperHeight / 100 * (100 -
        game
        .config
        .borderSize * 2 - game.metrics.marginV.percent * 2), game
      .config
      .size.h);
    game.metrics.width = game.metrics.height;

    game.metrics.borderSize.pixels = Math.round(wrapperHeight / 100 *
      game.config.borderSize);
    game.metrics.marginH.pixels = Math.round(wrapperHeight / 100 *
      game
      .metrics.marginH.percent);
    game.metrics.marginV.pixels = Math.round(wrapperHeight / 100 *
      game
      .metrics.marginV.percent);

    game.metrics.left = Math.round((wrapperWidth - game.metrics.width -
        game.metrics.borderSize.pixels - game.metrics.marginH.pixels
      ) /
      2);
    game.metrics.top = Math.round((game.metrics.wrapperSize[game.metrics
        .wrapperOrientation].height - game.metrics.height -
      game.metrics
      .borderSize.pixels - game.metrics.marginV.pixels) / 2);

  } else {

    game.metrics.width = game.utils.roundTo(wrapperWidth / 100 * (100 - game.config
        .borderSize * 2 - game.metrics.marginH.percent * 2), game
      .config
      .size.v);
    game.metrics.height = game.metrics.width;

    game.metrics.borderSize.pixels = Math.round(wrapperWidth / 100 *
      game.config.borderSize);
    game.metrics.marginH.pixels = Math.round(wrapperWidth / 100 *
      game.metrics
      .marginH.percent);
    game.metrics.marginV.pixels = Math.round(wrapperWidth / 100 *
      game.metrics
      .marginV.percent);

    game.metrics.left = Math.round((wrapperWidth - game.metrics.width -
        game.metrics.borderSize.pixels - game.metrics.marginH.pixels
      ) /
      2);
    game.metrics.top = Math.round((game.metrics.wrapperSize[game.metrics
        .wrapperOrientation].height - game.metrics.height -
      game.metrics
      .borderSize.pixels - game.metrics.marginV.pixels) / 2);

  }

  // with the board size, get the tile size
  game.metrics.tileWidth = Math.round(game.metrics.width / game.config
    .size
    .h);
  game.metrics.tileHeight = Math.round(game.metrics.height / game.config
    .size.v);


  // WRITING PHASE

  // hide to speed up redraws; also write the page height as inline style to prevent reflows
  wrapperHTML.style.visibility = "hidden";

  // write the css for game html element

  var CSSstyleDeclaration = "" + "padding:" + Math.round(game.metrics.borderSize.pixels) + "px;" + "width:" + game.metrics.width + "px; " + "height:" + game.metrics.height + "px; " + "left:" + game.metrics.left + "px; " + "top:" + game.metrics.top + "px; ";

  gameHTML.style.cssText = CSSstyleDeclaration;

  // css for tiles
  game.utils.createCSSClass(".tile",
    "width: " + (100 / game.config.size.h) + "%; " +
    "height: " + (100 / game.config.size.v) + "%; "
  );

  // tiles visible div
  game.utils.createCSSClass(".tile > .inner",
    "background-size: auto " + game.metrics.height + "px;"
  );

  // tile numbers
  game.utils.createCSSClass(".tile > .inner > .number",
    "font-size: " + document.getElementById(game.config.labels.BOARD_ID)
    .offsetHeight / game.config.size.v / 2 / 10 + "em;"
  );

  // scroll to top
  window.scrollTo(0, 1);

  // finally, reveal the updated html element
  wrapperHTML.style.visibility = "visible";
};
