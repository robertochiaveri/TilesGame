/* keycodes abstractions */
game.config.toolbarButtons = [{
  id: "new",
  description: "New game",
  handler: function() {
    if (window.confirm("Start a new game?")) {
      this.newGame();
    };
  }
}, {
  id: "save",
  description: "Save the board",
  handler: function() {
    this.saveGame(this.config.labels.USERSAVE_LABEL);
    this.utils.addClass(document.getElementById("btn-save"), "on");
  }
}, {
  id: "load",
  description: "Load the saved board",
  handler: function() {
    if (window.confirm("Load the saved game?")) {
      this.loadGame(this.config.labels.USERSAVE_LABEL);
    };
    this.animate({
      element: document.getElementById(this.config.labels.GAME_ID),
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
