game.changeBg = function(params) {
  "use strict";

  try {
    this.setBgImage({
      imgUrl: "https://source.unsplash.com/category/nature/"
    });
  } catch (e) {
    console.log("error loading a bg image", e);
  }

}
