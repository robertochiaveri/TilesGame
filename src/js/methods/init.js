game.init = function() {
  "use strict";

  game.runtime = {
    started: false, //    - - false before running, a date obj when started
    running: false, //    - - true if the game is started (and user can win)    
    ended: false, //    - - false while running, a date obj when ended
    timePlaying: 0, //tbd
    movesCount: false, //   - - number of moves the user has made since the start
    dragging: false, //   - - true when any tile is being dragged
    resizeTimer: -1, //   - - variable needed for the resize timer
    selectedTile: null, //    - - the selected tile object (extends normal tile objects 
    tiles: {}, //   - - tile tiles (associative) array
    latestSelection: 0, //   - - used to ignore doubleclicks
    eventListeners: {}
  };

  game.checkFeatures();

  game.createBoard(); //   - - creates the board, the tiles objects and the html       
  game.metricsUpdate();
  game.initListeners(); //   - - create event listeners enabling user interaction
  game.refresh({
    transitions: false
  }); //    - - position each tile according to the game runtime      
  if (!game.loadGame()) {
    game.newGame(); //   - - repeatedly changes random tiles 
  } else {
    game.animate({
      element: document.getElementById(game.config.labels.GAME_ID),
      animation: "load",
      duration: 1000
    });
    game.start(); //   - - set the game as started. from this moment on the game checks if the user has won
  }
};
