game.changeBg = function(params) {
  "use strict";

  // TBD: retrieve lists of images from different webservices, store it at runtime and use those photos
  // like usplash collections, maps...
  // also provide an offline list

  try {
    this.setBgImage({
      imgUrl: "https://source.unsplash.com/category/nature/"
    });
  } catch (e) {
    console.log("error loading a bg image", e);
  }

}
