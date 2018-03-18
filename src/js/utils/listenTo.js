game.utils.listenTo = function(element, eventType, fn, listenersList, context) {
  "use strict";

  if (!element || element === null) {
    console.log("can't find this element: " + element);
    return false;
  }

  if (typeof eventType !== "string") {
    console.log("event type to listen for was non specified or wasn't usable", eventType);
    return false;
  } else {

    if (!!eventType.match(/\s/g)) {

      var eventTypes = eventType.match(/\S+/g);

      console.log("listening to multiple events: ", eventTypes);

      for (var i = 0; i < eventTypes.length; i++) {
        context.utils.listenTo(element, eventTypes[i], fn, listenersList, context);
      }
      return;

    }

  }

  var id = element.id || false;

  console.log("Adding event listener to " + eventType + " on " + element.id + "...");

  if (!id || element.id == "") {

    if (element === document.body) {
      id = "body";
    } else if (element === document.documentElement) {
      id = "html";
    } else if (element === window) {
      id = "window";
    } else {
      console.log("better not add a listener to elements witout id: ", element);
      return false;
    }
  };

  listenersList = listenersList || {};

  if (typeof listenersList[id] === "undefined") {
    listenersList[id] = {};
  };

  if (typeof listenersList[id][eventType] !== "undefined") {
    console.log("cannot add another listener for " + eventType + " to ", element);
    return false;
  };


  if (!element.addEventListener) {
    element.attachEvent("on" + eventType, fn);
  } else if (element.addEventListener) {

    var fnWrapper;

    if (eventType.indexOf("touch") === 0) {

      fnWrapper = function(event) {
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
      };

      element.addEventListener(eventType, fnWrapper, true);

    } else {

      fnWrapper = function(event) {
        fn(event, context);
      };

      element.addEventListener(eventType, fnWrapper, false);

    }

    listenersList[id][eventType] = fnWrapper;

  }
};
