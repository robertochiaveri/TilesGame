game.vibrate = function(reasonToVibrate) {
  "use strict";

  if (this.config.vibration) {

    var pattern = 20

    switch (reasonToVibrate) {

      case "select":
        pattern = 0;
        break;

      case "bump":
        pattern = 40;
        break;

      case "deselect":
        pattern = 5;
        break;

      case "suffle":
        pattern = [Math.round(Math.random() * 300), Math.round(Math.random() * 300), Math.round(Math.random() * 300), Math.round(Math.random() * 300), Math.round(Math.random() * 300), Math.round(Math.random() * 300), Math.round(Math.random() * 300), Math.round(Math.random() * 300)];
        break;

      case "move":
        pattern = 0;
        break;

      default:
        break;
    }

    console.log("vibrate", reasonToVibrate, pattern);

    if (window.navigator && window.navigator.vibrate) {
      try {
        window.navigator.vibrate(pattern);
      } catch (e) {
        console.log("couldn't vibrate this time", e);
      }
    };

  }

};
