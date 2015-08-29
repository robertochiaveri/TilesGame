game = game || {};

game.initListeners = function() {

  // BEGIN TOUCH/CLICK EVENTS

  // start/down
  // board
  game.utils.listenTo(
    document.getElementById(game.config.labels.BOARD_ID), (game.config.useTouch ? "touchstart" : "mousedown"),
    function(event) {

      // ignore doubleclicks  
      if (event.timeStamp - game.runtime.latestSelection < 300) {
        return false;
      }
      game.runtime.latestSelection = event.timeStamp;

      game.selectTile(game.getTile(event), event);

    },
    game.runtime.eventListenerseventLisen);

  // move
  game.utils.listenTo(
    document.getElementById(game.config.labels.BOARD_ID), (game.config.useTouch ? "touchmove" : "mousemove"),
    function(event) {

      if (!!game.runtime.selectedTile) {
        game.dragTile(event);
      } else if (event.type != "mousemove") {

        // ignore doubleclicks  
        if (event.timeStamp - game.runtime.latestSelection < 300) {
          return false;
        }
        game.runtime.latestSelection = event.timeStamp;

        game.selectTile(game.getTile(event), event);
      }


    },
    game.runtime.eventListeners);

  //  end/up
  game.utils.listenTo(
    document.getElementById(
      game.config.labels.WRAPPER_ID), (game.config.useTouch ? "touchend" : "mouseup"),
    function(event) {

      if (typeof game.runtime.selectedTile == "undefined" || game
        .runtime
        .selectedTile === null) {
        return false;
      }

      /*
            if (typeof game.runtime.selectedTile.newPosition != "undefined")
            {
              
              if (( event.timeStamp - game.runtime.selectedTile.timeStamp) < 150)
              {
                game.moveTile(
                  game.getTile(event),
                  {
                    transitions:  true,
                    force:      false,
                    refresh:    true
                  }               
                );
              }
        
            }*/

      game.deselectTile();

    },
    game.runtime.eventListeners);

  // mouseout
  game.utils.listenTo(
    document.getElementById(game.config.labels.GAME_ID),
    "mouseout",
    function(e) {
      e = e ? e : window.event;
      var from = e.relatedTarget || e.toElement;
      if (!from || from.nodeName == "HTML") {
        game.deselectTile();
      }
    },
    game.runtime.eventListeners);


  // END TOUCH/MOUSE EVENTS

  if (game.config.useKeyboard) {
    game.utils.listenTo(
      document.body,
      "keyup",
      function(e) {

        switch (e.which) {
          case game.config.keycodes.KEY_ARROW_LEFT:
            game.moveAnyTile({
              direction: game.config.labels.LEFT,
              pushing: e.ctrlKey
            })
            break;

          case game.config.keycodes.KEY_ARROW_UP:
            game.moveAnyTile({
              direction: game.config.labels.UP,
              pushing: e.ctrlKey
            })
            break;

          case game.config.keycodes.KEY_ARROW_RIGHT:
            game.moveAnyTile({
              direction: game.config.labels.RIGHT,
              pushing: e.ctrlKey
            })
            break;

          case game.config.keycodes.KEY_ARROW_DOWN:
            game.moveAnyTile({
              direction: game.config.labels.DOWN,
              pushing: e.ctrlKey
            })
            break;

        }

      },
      game.runtime.eventListeners);
  }

  // resize
  game.utils.listenTo(window, "resize", function(e) {

      if (game.runtime.resizeTimer != -1)
        clearTimeout(game.runtime.resizeTimer);

      game.runtime.resizeTimer = window.setTimeout(function() {
        game.deselectTile();
        game.metricsUpdate();
        game.refresh();
      }, 100);

    },
    game.runtime.eventListeners);
};
