game.start = function() {
  game.runtime.started = new Date(); //   - - saves the time of game start
  game.runtime.ended = false;
  game.runtime.running = true; //   - - when true the game checks if the user has won at every move during refresh
  game.runtime.movesCount = 0;
  console.log("game started");
};
