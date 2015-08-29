game.stop = function() {
  "use strict";
  //    - reverse start()
  game.runtime.ended = new Date(); //   - - saves the time of game end
  game.runtime.running = false; //    - - the game won't check if the user has won
  console.log("game stopped");
};
