game.init = function() {
  "use strict";

  this.runtime = {
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

  this.checkFeatures();

  this.createBoard(); //   - - creates the board, the tiles objects and the html       
  this.metricsUpdate();
  this.initListeners(); //   - - create event listeners enabling user interaction
  this.refresh({
    transitions: false
  }); //    - - position each tile according to the game runtime      
  if (!this.loadGame()) {
    this.newGame(); //   - - repeatedly changes random tiles 
  } else {
    this.animate({
      element: document.getElementById(this.config.labels.GAME_ID),
      animation: "load",
      duration: 1000
    });
    this.start(); //   - - set the game as started. from this moment on the game checks if the user has won
  }
};
