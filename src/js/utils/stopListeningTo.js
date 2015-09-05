game.utils.stopListeningTo = function(element, eventType, listenersList) {
  "use strict";

  if (typeof listenersList === "undefined") {
    console.log("no registered listeners in ", listenersList);
    return false;
  };

  var id = element.id;

  if (typeof element.id === "undefined" || element.id === "") {

    if (element === document.body) {
      id = "body";
    } else if (element === document.documentElement) {
      id = "html";
    } else if (element === window) {
      id = "window";
    } else {
      console.log("better not add a listener to elements witout id: ",
        element);
      return false;
    }
  };

  if (typeof listenersList[id][eventType] !== "undefined") {
    element.removeEventListener(eventType, listenersList[id][eventType]);
    listenersList[id][eventType] = undefined;
    // console.log("removed event listener for " + eventType + " from " + id);
    return true;
  }


  return false;

};
