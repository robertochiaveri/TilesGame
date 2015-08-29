/* keycodes abstractions */
game.config.toolbarButtons = [{
  id: "new",
  description: "New game",
  handler: function() {
    if (window.confirm("Start a new game?")) {
      game.newGame();
    };
  }
}, {
  id: "save",
  description: "Save the board",
  handler: function() {
    game.saveGame(game.config.labels.USERSAVE_LABEL);
    game.utils.addClass(document.getElementById("btn-save"), "on");
  }
}, {
  id: "load",
  description: "Load the saved board",
  handler: function() {
    if (window.confirm("Load the saved game?")) {
      game.loadGame(game.config.labels.USERSAVE_LABEL);
    };
    game.animate({
      element: document.getElementById(game.config.labels.GAME_ID),
      animation: "load",
      duration: 1000
    });
  },
}, {
  id: "settings",
  description: "change your preferences",
  handler: function() {}
}, {
  id: "info",
  description: "About this game",
  handler: function() {}
}];
