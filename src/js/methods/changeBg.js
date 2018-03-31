game.changeBg = function(params) {
  "use strict";

  switch (this.config.bgImages.defaultProvider) {

    default:
      case "none":
      console.log("background images are disabled in config.");
    this.unsetBgImage();
    break;

    case "unsplash_simple":

        game.setBgImage({
          imgUrl: this.config.bgImages.providers["unsplash_simple"].url + this.metrics.width + "x" + this.metrics.height + "?timestamp=" + Date.now()
        });

      break;

  }

}
