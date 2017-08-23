game.optimizeRedraws = function(state) {
  "use strict";

  var elements = [
    this.config.labels.WRAPPER_ID,
    this.config.labels.BACKGROUND_CONTAINER_ID,
    this.config.labels.GAME_ID
  ];

  var i = 0;


  if (state == "on") {

    console.log("hiding elements during layout change...")
    for (i = 0; i < elements.length; i++) {
      document.getElementById(elements[i]).style.visibility = "hidden";
    }

  } else {

    console.log("...showing back again elements after layout change")
    for (i = 0; i < elements.length; i++) {
      document.getElementById(elements[i]).style.visibility = "visible";

    }

  };


}
