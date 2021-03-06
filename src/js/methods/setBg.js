game.getClosestColor = getClosestColor; /* Bower dependency included in the main .js */

game.setBgImage = function(params) {
  "use strict";

  if (!document.createElement || typeof params.imgUrl !== "string") {
    return false;
  }

  if (!this.runtime.backgroundImage) {
    this.runtime.backgroundImage = {
      url: params.imgUrl
    };
  } else if (typeof this.runtime.backgroundImage.src == "string") {
    if (params.imgUrl == this.runtime.backgroundImage.src) {
      console.log("Won't load the same background image twice: " + params.imgUrl);
      return false;
    }
  }

  var img = document.getElementById(this.config.labels.BACKGROUND_IMAGE_ID) || document.createElement("img");
  var rgb = {};

  console.log("loading image " + params.imgUrl + "...");
  img.src = params.imgUrl;
  img.crossOrigin = "";
  img.id = this.config.labels.BACKGROUND_IMAGE_ID;

  this.utils.listenTo(img, "load", game.handleBgImageLoaded, this.runtime.eventListeners, this);
  this.utils.listenTo(img, "error", game.handleBgImageError, this.runtime.eventListeners, this);

  return true;

};

game.unsetBgImage = function() {
  this.unApplyBgImage();
  this.unApplyBgColor();
  console.log("Background image and colors removed.");
}

game.handleBgImageLoaded = function(event, context) {

  console.log("background image loading complete");
  context.utils.stopListeningTo(event.target, "load", context.runtime.eventListeners);
  context.utils.stopListeningTo(event.target, "error", context.runtime.eventListeners);

  var averageRGB = context.utils.getAverageRGB(event.target);

  if (context.utils.getAverage([averageRGB.r, averageRGB.g, averageRGB.b]) > 50) {
    context.applyBgColor(averageRGB);
    context.applyBgImage(event.target);

    console.log("background image set successfully.");

  } else {
    console.log("The average color for this image is too dark (" + averageRGB.r + "," + averageRGB.g + "," + averageRGB.b + "), better to load another...");
  }

};

game.handleBgImageError = function(event, context) {

  console.log("background image loading ERROR", event);
  context.utils.stopListeningTo(event.target, "load", context.runtime.eventListeners);
  context.utils.stopListeningTo(event.target, "error", context.runtime.eventListeners);

};

game.applyBgImage = function(img) {

  "use strict";

  var i;
  var tileName;
  var tile;

  this.runtime.backgroundImage = this.runtime.backgroundImage || {};
  this.runtime.backgroundImage.src = img.src;


  for (tileName in this.runtime.tiles) {
    tile = this.getTile(tileName).htmlElement;
    for (i = 0; i < tile.childNodes.length; i++) {
      if (tile.childNodes[i].className === this.config.labels.TILE_INNER_CLASS) {
        tile.childNodes[i].style.backgroundImage = "url(" + this.runtime.backgroundImage.src + ")";
        break;
      }
    }
  }

  if (
    typeof this.runtime.eventListeners[img.id]["load"] !== "undefined" ||
    typeof this.runtime.eventListeners[img.id]["error"] !== "undefined"
  ) {
    context.utils.stopListeningTo(event.target, "load", context.runtime.eventListeners);
    context.utils.stopListeningTo(event.target, "error", context.runtime.eventListeners);
  }

  document.getElementById(this.config.labels.BACKGROUND_CONTAINER_ID).innerHTML = "";

};

game.unApplyBgImage = function() {

  "use strict";

  var i;
  var tileName;
  var tile;

  this.runtime.backgroundImage = {};

  for (tileName in this.runtime.tiles) {
    tile = this.getTile(tileName).htmlElement;
    for (i = 0; i < tile.childNodes.length; i++) {
      if (tile.childNodes[i].className === this.config.labels.TILE_INNER_CLASS) {
        tile.childNodes[i].style.backgroundImage = "none";
        break;
      }
    }
  }
}

game.adjustColor = function(rgb, mode, amount) {
  "use strict";

  if (typeof rgb === "undefined") {
    console.log("which color?");
    return false;
  }
  if (typeof amount !== "number") {
    amount = 0.25;
  }

  function limit(n, min, max) {

    n = Math.round(n);

    if (n < min) {
      return min;
    }
    if (n > max) {
      return max;
    }
    return n;
  }

  switch (mode) {

    case "brighter":
      return {
        r: limit(rgb.r * (1 + amount), 0, 255),
        g: limit(rgb.g * (1 + amount), 0, 255),
        b: limit(rgb.b * (1 + amount), 0, 255)
      };

    case "darker":
      return {
        r: limit(rgb.r * (1 - amount), 0, 255),
        g: limit(rgb.g * (1 - amount), 0, 255),
        b: limit(rgb.b * (1 - amount), 0, 255)
      };

    default:
      console.log("color not changed", rgb);
      return rgb;

  };

};

game.applyBgColor = function(rgb) {

  "use strict";

  var rgbVal = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
  var hexVal = "#" + rgb.r.toString(16) + rgb.g.toString(16) + rgb.b.toString(16);

  var rgbDark = this.adjustColor(rgb, "darker", 0.65);
  var rgbDarkVal = "rgb(" + rgbDark.r + "," + rgbDark.g + "," + rgbDark.b + ")";
  var hexDarkVal = "#" + rgbDark.r.toString(16) + rgbDark.g.toString(16) + rgbDark.b.toString(16);


  var rgbBright = this.adjustColor(rgb, "brighter", 0.2);
  var rgbBrightVal = "rgb(" + rgbBright.r + "," + rgbBright.g + "," + rgbBright.b + ")";
  var hexBrightVal = "#" + rgbBright.r.toString(16) + rgbBright.g.toString(16) + rgbBright.b.toString(16);


  this.runtime.backgroundImage = this.runtime.backgroundImage || {};

  this.runtime.backgroundImage.averageRGB = rgbVal;
  this.runtime.backgroundImage.averageRGB_darker = rgbDarkVal;
  this.runtime.backgroundImage.averageRGB_brighter = rgbBrightVal;

  this.runtime.backgroundImage.averageHEX = hexVal;
  this.runtime.backgroundImage.averageHEX_darker = hexDarkVal;
  this.runtime.backgroundImage.averageHEX_brighter = hexBrightVal;

  this.runtime.backgroundImage.blackish = (getClosestColor(hexVal, ["#000", "#FFF"]) == "#000");
  this.runtime.backgroundImage.whiteish = !this.runtime.backgroundImage.blackish;

  document.getElementById(this.config.labels.BACKGROUND_CONTAINER_ID).style.backgroundColor = rgbVal;
  document.getElementById(this.config.labels.GAME_ID).style.backgroundColor = hexBrightVal;


  var currentBoxShadow = this.utils.editCSSRule("#" + this.config.labels.BOARD_ID + " ." + this.config.labels.TILE_INNER_CLASS, "boxShadow");

  if (!!currentBoxShadow) {

    var boxShadowProps = currentBoxShadow.replace(/,\s+/g, ",").split(" ");

    for (var i = 0; i < boxShadowProps.length; i++) {
      if (boxShadowProps[i].indexOf("rgb") > -1 || boxShadowProps[i].indexOf("#") > -1) {
        boxShadowProps[i] = rgbDarkVal;
      };
      break;
    }

    this.utils.editCSSRule("#" + this.config.labels.BOARD_ID + " ." + this.config.labels.TILE_INNER_CLASS, "boxShadow", boxShadowProps.join(" "));

    document.getElementById(this.config.labels.BOARD_ID).style.backgroundColor = hexDarkVal;

  };

};

game.unApplyBgColor = function() {

  "use strict";

  var removeBgColor = function(elem) {
    elem.style.cssText = elem.style.cssText.replace(/background-color:(\s*?)([^\;]+)\;/gi, "");
  };

  removeBgColor(document.getElementById(this.config.labels.BACKGROUND_CONTAINER_ID));
  removeBgColor(document.getElementById(this.config.labels.BOARD_ID));
  removeBgColor(document.getElementById(this.config.labels.GAME_ID));

  var boxShadowColor = getComputedStyle(document.getElementById(this.config.labels.BOARD_ID)).backgroundColor;

  var currentBoxShadow = this.utils.editCSSRule("#" + this.config.labels.BOARD_ID + " ." + this.config.labels.TILE_INNER_CLASS, "boxShadow");

  if (!!currentBoxShadow) {

    var boxShadowProps = currentBoxShadow.replace(/,\s+/g, ",").split(" ");

    for (var i = 0; i < boxShadowProps.length; i++) {
      if (boxShadowProps[i].indexOf("rgb") > -1 || boxShadowProps[i].indexOf("#") > -1) {
        boxShadowProps[i] = boxShadowColor;
      };
      break;
    }

    this.utils.editCSSRule("#" + this.config.labels.BOARD_ID + " ." + this.config.labels.TILE_INNER_CLASS, "boxShadow", boxShadowProps.join(" "));

  }

}
