game.metricsUpdate = function() {
  "use strict";

  this.metrics = this.metrics || {};

  var wrapperHTML = document.getElementById(this.config.labels.WRAPPER_ID); // main wrapper html element
  var gameHTML = document.getElementById(this.config.labels.GAME_ID); // game div html element
  var wrapperWidth = wrapperHTML.offsetWidth;
  var wrapperHeight = wrapperHTML.offsetHeight;
  var cssPrefix = "#" + this.config.labels.GAME_ID + " ";


  // save values in metrics obj
  this.metrics.transforms3Dsupport = (this.config.use3Dtransforms) ? ["3d", ",0"] : ["", ""]; // allows transformations 2d and 3d 
  this.metrics.wrapperOrientation = (wrapperWidth >= wrapperHeight) ? this.config.labels.LANDSCAPE : this.config.labels.PORTRAIT;
  this.metrics.wrapperRatio = wrapperWidth / wrapperHeight;
  this.metrics.pixelRatio = (window.devicePixelRatio > 1) ? window.devicePixelRatio : 1;


  // if it doesn't exists yet, create wrapperSize obj
  if (typeof this.metrics.wrapperSize === "undefined") {
    this.metrics.wrapperSize = {};
  }

  // if it doesn't exist yet, create a sub-obj for storing metric sinformation for each screen orientation    
  this.metrics.wrapperSize[this.metrics.wrapperOrientation] = {
    width: wrapperWidth,
    height: wrapperHeight,
  };

  // this is info about the board configuration
  this.metrics.boardLayout = (this.config.size.h >= this.config.size.v) ? this.config.labels.LANDSCAPE : this.config.labels.PORTRAIT;
  this.metrics.boardRatio = this.config.size.h / this.config.size.v;

  // this is a pregmatic way to calculate a good font size for tile numbers
  this.metrics.fontSize = parseInt((document.body.currentStyle || (window.getComputedStyle && getComputedStyle(document.body, null)) || document.body.style).fontSize);

  // initialize the margin around the game board
  this.metrics.marginH = {
    percent: this.config.margin.h,
    pixels: 0
  };

  // initialize the margin around the game board
  this.metrics.marginV = {
    percent: this.config.margin.v,
    pixels: 0
  };

  // initialize the bezel around the game board
  this.metrics.borderSize = {
    percent: this.config.borderSize,
    pixels: 0
  };

  // depending on orientation, calculate board size to optimize space
  // board will always be a square, so calculate width first
  if (this.metrics.wrapperOrientation === this.config.labels.LANDSCAPE) {

    this.metrics.height = this.utils.roundTo(wrapperHeight / 100 * (100 - this.config.borderSize * 2 - this.metrics.marginV.percent * 2), this.config.size.h);
    this.metrics.width = this.metrics.height;

    this.metrics.borderSize.pixels = Math.round(wrapperHeight / 100 * this.config.borderSize);
    this.metrics.marginH.pixels = Math.round(wrapperHeight / 100 * this.metrics.marginH.percent);
    this.metrics.marginV.pixels = Math.round(wrapperHeight / 100 * this.metrics.marginV.percent);

    this.metrics.left = Math.round((wrapperWidth - this.metrics.width - this.metrics.borderSize.pixels - this.metrics.marginH.pixels) / 2);
    this.metrics.top = Math.round((this.metrics.wrapperSize[this.metrics.wrapperOrientation].height - this.metrics.height - this.metrics.borderSize.pixels - this.metrics.marginV.pixels) / 2);

  } else {

    this.metrics.width = this.utils.roundTo(wrapperWidth / 100 * (100 - this.config.borderSize * 2 - this.metrics.marginH.percent * 2), this.config.size.v);
    this.metrics.height = this.metrics.width;

    this.metrics.borderSize.pixels = Math.round(wrapperWidth / 100 * this.config.borderSize);
    this.metrics.marginH.pixels = Math.round(wrapperWidth / 100 * this.metrics.marginH.percent);
    this.metrics.marginV.pixels = Math.round(wrapperWidth / 100 * this.metrics.marginV.percent);

    this.metrics.left = Math.round((wrapperWidth - this.metrics.width - this.metrics.borderSize.pixels - this.metrics.marginH.pixels) / 2);
    this.metrics.top = Math.round((this.metrics.wrapperSize[this.metrics.wrapperOrientation].height - this.metrics.height - this.metrics.borderSize.pixels - this.metrics.marginV.pixels) / 2);

  }

  // with the board size, get the tile size
  this.metrics.tileWidth = Math.round(this.metrics.width / this.config.size.h);
  this.metrics.tileHeight = Math.round(this.metrics.height / this.config.size.v);


  // WRITING PHASE

  // hide to speed up redraws; also write the page height as inline style to prevent reflows
  wrapperHTML.style.visibility = "hidden";

  // write the css for game html element

  var CSSstyleDeclaration = "" + "padding:" + Math.round(this.metrics.borderSize.pixels) + "px;" + "width:" + this.metrics.width + "px; " + "height:" + this.metrics.height + "px; " + "left:" + this.metrics.left + "px; " + "top:" + this.metrics.top + "px; ";

  gameHTML.style.cssText = CSSstyleDeclaration;

  // font size (used both for numbers, spacing and borders)

  document.getElementById(this.config.labels.GAME_ID).style.fontSize = "" + document.getElementById(this.config.labels.BOARD_ID).offsetHeight / this.config.size.v / 2 + "px";


  console.log("metricsUpdate");

  // css for tiles
  this.utils.createCSSClass(cssPrefix + ".tile",
    "width: " + (100 / this.config.size.h) + "%; " +
    "height: " + (100 / this.config.size.v) + "%; "
  );

  // tiles visible div
  this.utils.createCSSClass(cssPrefix + ".tile > .inner",
    "background-size: auto " + this.metrics.height + "px;"
  );

  // finally, reveal the updated html element
  wrapperHTML.style.visibility = "visible";

};
