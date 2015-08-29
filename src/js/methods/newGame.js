game.newGame = function() {
  "use strict";

  var animationDuration = 2000;

  if (this.runtime.running) {
    console.log("user reset");

    this.stop();

    setTimeout(function() {

      this.loadGame(this.config.labels.SORTEDSAVE_LABEL);

      this.refresh({
        transitions: false
      });

      this.saveGame(this.config.labels.SORTEDSAVE_LABEL);


    }, animationDuration * 0.34);

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

  setTimeout(function() {

    this.shuffle(this.config.size.n * this.config.size.n);
    this.saveGame(this.config.labels.SHUFFLEDSAVE_LABEL);
    this.start();

  }, animationDuration * 0.85);
};
