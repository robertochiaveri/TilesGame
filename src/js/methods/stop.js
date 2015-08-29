game.stop = function() {
  "use strict";
  //    - reverse start()
  this.runtime.ended = new Date(); //   - - saves the time of game end
  this.runtime.running = false; //    - - the game won't check if the user has won
  console.log("game stopped");
};
