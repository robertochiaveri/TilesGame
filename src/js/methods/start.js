game.start = function() {
  "use strict";
  this.runtime.started = new Date(); //   - - saves the time of game start
  this.runtime.ended = false;
  this.runtime.running = true; //   - - when true the game checks if the user has won at every move during refresh
  this.runtime.movesCount = 0;
  console.log("game started");
};
