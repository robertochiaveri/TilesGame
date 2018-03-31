game.changeBg = function(params) {
  "use strict";

  switch (this.config.bgImages.defaultProvider) {

    default:
      case "none":
      console.log("background images are disabled in config.")
    break;

    case "unsplash_simple":

        game.setBgImage({
          imgUrl: this.config.bgImages.providers["unsplash_simple"].url + this.metrics.width + "x" + this.metrics.height + "?timestamp=" + Date.now()
        });

      break;

    case "pexels":

        var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

          var response = JSON.parse(this.responseText);

          if (response.photos && response.photos.length) {

            var photo = response.photos[0];

            if (photo.width >= game.metrics.width && photo.height >= game.metrics.height) {

              game.setBgImage({
                imgUrl: photo.src.original
              });

            }

          }

        }
      };
      xhttp.open("GET", "https://api.pexels.com/v1/popular?per_page=15&page=1", true);
      xhttp.setRequestHeader("Authorization", "563492ad6f91700001000001ebfc949f4870449eb8e63866846cf127");
      xhttp.send();

      break;

  }

}
