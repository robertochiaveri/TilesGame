game.newGame = function() {
  "use strict";

  var animationDuration = 2000;

  if (this.runtime.running) {
    console.log("user reset");

    this.stop();

    setTimeout(function(context) {

      context.loadGame(context.config.labels.SORTEDSAVE_LABEL);

      context.refresh({
        transitions: false
      });

      context.saveGame(context.config.labels.SORTEDSAVE_LABEL);


    }, animationDuration * 0.34, this);

    this.animate({
      element: document.getElementById(this.config.labels.GAME_ID),
      animation: "resetboard",
      duration: animationDuration,
      easing: "ease-in-out"
    });

  } else {
    console.log("first launch");

    this.refresh({
      transitions: false
    });

    this.saveGame(this.config.labels.SORTEDSAVE_LABEL);

    this.animate({
      element: document.getElementById(this.config.labels.GAME_ID),
      animation: "intro",
      duration: animationDuration
    });

  }

  this.changeBg(); // will load a random background image
  setTimeout(function(context) {
    context.shuffle(context.config.size.n * context.config.size.n);
    context.saveGame(context.config.labels.SHUFFLEDSAVE_LABEL);
    context.start();

  }, animationDuration * 0.85, this);
};
