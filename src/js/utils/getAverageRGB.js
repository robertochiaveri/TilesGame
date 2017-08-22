game.utils.getAverageRGB = function(img) {
  "use strict";

  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  var width = canvas.width = img.naturalWidth;
  var height = canvas.height = img.naturalHeight;
  var imageData, data;
  var defaultRGB = {
    r: 200,
    g: 200,
    b: 200
  };

  ctx.drawImage(img, 0, 0);

  try {
    imageData = ctx.getImageData(0, 0, width, height);
  } catch (e) {
    console.log("Problem parsing this image", e);
    return defaultRGB;
  }

  data = imageData.data;

  var r = 0;
  var g = 0;
  var b = 0;

  for (var i = 0, l = data.length; i < l; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }

  r = Math.floor(r / (data.length / 4));
  g = Math.floor(g / (data.length / 4));
  b = Math.floor(b / (data.length / 4));

  return {
    r: r,
    g: g,
    b: b
  };

};
