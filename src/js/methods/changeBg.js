game.changeBg = function(params) {
  "use strict";

  try {
    this.setBgImage({
      imgUrl: "https://source.unsplash.com/random/" + this.metrics.width + "x" + this.metrics.height
    });
  } catch (e) {
    console.log("error loading a bg image", e);
  }

}
