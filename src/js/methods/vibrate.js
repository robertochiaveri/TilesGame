game.vibrate = function(reasonToVibrate) {
  "use strict";
  return false;
  var pattern = [20]

  switch (reasonToVibrate) {

    case "select":
      pattern = [40];
      break;

    case "bump":
      pattern = [60];
      break;

    case "deselect":
      pattern = [30];
      break;

    case "suffle":
      pattern = [Math.round(Math.random() * 300), Math.round(Math.random() * 300), Math.round(Math.random() * 300), Math.round(Math.random() * 300)];
      break;

    case "move":
      pattern = [20];
      break;

    default:
      break;
  }

  console.log("vibrate", reasonToVibrate, pattern);

  if (window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(pattern);
  };

};
