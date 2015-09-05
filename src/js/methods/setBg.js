game.setBg = function(params) {
  "use strict";

  if (!document.createElement ||
    typeof params.imgUrl !== "string"
  ) {
    return false;
  }


  var img = document.getElementById(this.config.labels.BACKGROUND_IMAGE_ID) || document.createElement("img");
  var rgb = {};

  img.src = params.imgUrl;
  img.id = this.config.labels.BACKGROUND_IMAGE_ID;

  game.utils.listenTo(img, "load", function(event, context) {

      context.runtime.backgroundImage = context.runtime.backgroundImage || {};
      context.runtime.backgroundImage.src = img.src;


      var rgb = context.utils.getAverageRGB(img);
      document.getElementById(context.config.labels.BACKGROUND_CONTAINER_ID).style.backgroundColor = ("rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")");
      context.runtime.backgroundImage.averageRGB = rgb;

    },
    this.runtime.eventListeners,
    this);




  document.getElementById(this.config.labels.BACKGROUND_CONTAINER_ID).appendChild(img);



  return true;



};
