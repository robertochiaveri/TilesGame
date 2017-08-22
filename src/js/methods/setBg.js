game.setBgImage = function(params) {
  "use strict";

  if (!document.createElement ||
    typeof params.imgUrl !== "string"
  ) {
    return false;
  }

  var img = document.getElementById(this.config.labels.BACKGROUND_IMAGE_ID) || document.createElement("img");
  var rgb = {};

  console.log("loading image " + params.imgUrl + "...");
  img.crossOrigin = '';
  img.src = params.imgUrl;
  img.crossOrigin = "";
  img.id = this.config.labels.BACKGROUND_IMAGE_ID;

  this.utils.listenTo(img, "load", function(event, context) {
      console.log("background image loading complete", img)
      context.applyBgImage(event.target);
    },
    this.runtime.eventListeners,
    this
  );

  return true;

};


game.applyBgImage = function(img) {

  "use strict";

  var i;
  var tileName;
  var tile;
  var averageRGB;

  this.runtime.backgroundImage = this.runtime.backgroundImage || {};
  this.runtime.backgroundImage.src = img.src;


  for (tileName in this.runtime.tiles) {
    tile = this.getTile(tileName).htmlElement;
    for (i = 0; i < tile.childNodes.length; i++) {
      if (tile.childNodes[i].className === this.config.labels.TILE_INNER_CLASS) {
        tile.childNodes[i].style.backgroundImage = "url(" + img.src + ")";
        break;
      }
    }
  }

  document.getElementById(this.config.labels.BACKGROUND_CONTAINER_ID).appendChild(img);

  averageRGB = this.utils.getAverageRGB(img);

  console.log("The average color for this image is ", averageRGB);

  this.applyBgColor(averageRGB);

  this.utils.stopListeningTo(
    img,
    "load",
    this.runtime.eventListeners
  );

};

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

  var rgbDark = this.adjustColor(rgb, "darker", 0.75);
  var rgbDarkVal = "rgb(" + rgbDark.r + "," + rgbDark.g + "," + rgbDark.b + ")";


  var rgbBright = this.adjustColor(rgb, "brighter", 0.25);
  var rgbBrightVal = "rgb(" + rgbBright.r + "," + rgbBright.g + "," + rgbBright.b + ")";


  this.runtime.backgroundImage = this.runtime.backgroundImage || {};
  this.runtime.backgroundImage.averageRGB = rgb;
  this.runtime.backgroundImage.averageRGB_darker = rgbDark;
  this.runtime.backgroundImage.averageRGB_brighter = rgbBright;

  document.getElementById(this.config.labels.BACKGROUND_CONTAINER_ID).style.backgroundColor = rgbVal;
  document.getElementById(this.config.labels.GAME_ID).style.backgroundColor = rgbBrightVal;


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

    document.getElementById(this.config.labels.BOARD_ID).style.backgroundColor = rgbDarkVal;

  };

};
