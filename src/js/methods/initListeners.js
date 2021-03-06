game.initListeners = function() {
  "use strict";

  // BEGIN TOUCH/CLICK EVENTS

  // start/down
  // board
  this.utils.listenTo(
    document.getElementById(this.config.labels.BOARD_ID),
    "touchstart mousedown",
    function(event, context) {

      // ignore doubleclicks
      if (event.timeStamp - context.runtime.latestSelection < 300) {
        return false;
      }
      context.runtime.latestSelection = event.timeStamp;

      context.selectTile(context.getTile(event), event);

    },
    this.runtime.eventListeners,
    this);

  // ignore swipes outside the board
  this.utils.listenTo(
    document.getElementById(this.config.labels.WRAPPER_ID),
    "touchmove mousemove",
    function(event, context) {
      return false;
    },
    this.runtime.eventListeners,
    this);

  // swipes on the board;
  this.utils.listenTo(
    document.getElementById(this.config.labels.BOARD_ID),
    "touchmove mousemove",
    function(event, context) {


      if (!!context.runtime.selectedTile) {
        context.dragTile(event);
      } else if (event.type !== "mousemove") {

        // ignore doubleclicks
        if (event.timeStamp - context.runtime.latestSelection < 300) {
          return false;
        }
        context.runtime.latestSelection = event.timeStamp;

        context.selectTile(context.getTile(event), event);
      }


    },
    this.runtime.eventListeners,
    this);

  //  end/up
  this.utils.listenTo(
    document.getElementById(this.config.labels.WRAPPER_ID),
    "touchend mouseup",
    function(event, context) {

      if (typeof context.runtime.selectedTile === "undefined" || context.runtime.selectedTile === null) {
        return false;
      }

      if ((event.timeStamp - context.runtime.selectedTile.timeStamp) > context.config.maxTimeForClickMove) {

        if (
          context.runtime.selectedTile.newPosition.top.newValue.pixels === null &&
          context.runtime.selectedTile.newPosition.left.newValue.pixels === null
        ) {
          context.runtime.selectedTile.newPosition = undefined;
        }
      };

      context.deselectTile();

    },
    this.runtime.eventListeners,
    this);

  // mouseout
  this.utils.listenTo(
    document.getElementById(this.config.labels.GAME_ID),
    "mouseout",
    function(event, context) {
      event = event ? event : window.event;
      var from = event.relatedTarget || event.toElement;
      if (!from || from.nodeName === "HTML") {
        context.deselectTile();
      }
    },
    this.runtime.eventListeners,
    this);


  // END TOUCH/MOUSE EVENTS

  if (this.config.useKeyboard) {
    this.utils.listenTo(
      document.body,
      "keyup",
      function(event, context) {

        switch (event.which) {
          case context.config.keycodes.KEY_ARROW_LEFT:
            context.moveAnyTile({
              direction: context.config.labels.LEFT,
              pushing: event.ctrlKey
            });
            break;

          case context.config.keycodes.KEY_ARROW_UP:
            context.moveAnyTile({
              direction: context.config.labels.UP,
              pushing: event.ctrlKey
            });
            break;

          case context.config.keycodes.KEY_ARROW_RIGHT:
            context.moveAnyTile({
              direction: context.config.labels.RIGHT,
              pushing: event.ctrlKey
            });
            break;

          case context.config.keycodes.KEY_ARROW_DOWN:
            context.moveAnyTile({
              direction: context.config.labels.DOWN,
              pushing: event.ctrlKey
            });
            break;

        }

      },
      this.runtime.eventListeners,
      this);
  }

  // resize event will fire a layoutChange event
  this.utils.listenTo(window,
    "resize",
    function(event, context) {

      var event = new Event('layoutChange');
      window.dispatchEvent(event);
    },
    this.runtime.eventListeners,
    this
  );

  // resize event will fire a layoutChange event
  this.utils.listenTo(window,
    "orientationchange",
    function(event, context) {

      var event = new Event('layoutChange');
      window.dispatchEvent(event);
    },
    this.runtime.eventListeners,
    this
  );


  // layoutChange custom event: fired when resized or rotated
  this.utils.listenTo(window,
    "layoutChange",
    this.utils.debounce(

      function(event, context) {

        console.log("layout change detected, handling it using optimizeRedraws...");

        if (context.config.useOptimizeRedraws) {
          context.optimizeRedraws("on");
        }

        if (context.runtime.resizeTimer !== -1) {
          clearTimeout(context.runtime.resizeTimer);
        }

        context.runtime.resizeTimer = window.setTimeout(function(context) {

          context.layoutChange();

          if (context.config.useOptimizeRedraws) {
            context.optimizeRedraws("off");
          }

        }, 600, context);

      }, 500, true),
    this.runtime.eventListeners,
    this
  );


  this.utils.listenTo(document,
    "visibilitychange",
    function(event, context) {

      if (document.visibilityState == "visible") {
        console.log("game is now visible, refreshing...");
        context.metricsUpdate();
        context.refresh();
      } else {
        console.log("game is now hidden, saving...");
        context.saveGame();
      }

    },
    this.runtime.eventListeners,
    this
  );

};
