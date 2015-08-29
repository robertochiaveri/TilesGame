game.utils.listenTo = function(element, eventType, fn, listenersList, context) {
  "use strict";

  listenersList = listenersList || {};

  if (!element) {
    console.log("can't find this element: " + element);
    return false;
  }

  var id = element.id;

  if (typeof id === "undefined" || id === "") {

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

  if (typeof listenersList[id] === "undefined") {
    listenersList[id] = {};
  };

  if (typeof listenersList[id][eventType] !== "undefined") {
    console.log("cannot add another listener for " + eventType + " to ",
      element);
    return false;
  };

  listenersList[id][eventType] = fn;


  if (!element.addEventListener) {
    element.attachEvent("on" + eventType, fn);
  } else if (element.addEventListener) {

    if (eventType.indexOf("touch") === 0) {
      element.addEventListener(eventType, function(event, context) {
        event.preventDefault();
        if (event.touches.length === 0) //touchend
        {
          fn(event, context);
        } else {
          for (var i = 0; i < event.touches.length; i++) {
            event.touches[i].timeStamp = event.timeStamp;
            event.touches[i].type = event.type;
            event.touches[i].multiTouchEvent = event;
            fn(event.touches[i], context);
          }
        }
        return;
      }, true);
    } else {
      element.addEventListener(eventType, function(event) {
        fn(event, context);
      }, false);
    }
  }
};
