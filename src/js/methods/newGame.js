game = game || {};

game.newGame = function() {

  var animationDuration = 2000;

  if (game.runtime.running) {
    console.log("user reset");

    game.stop();


    setTimeout(function() {

      game.loadGame(game.config.labels.SORTEDSAVE_LABEL);

      game.refresh({
        transitions: false
      });

      game.saveGame(game.config.labels.SORTEDSAVE_LABEL);


    }, animationDuration * .34);

    game.animate({
      element: document.getElementById("game"),
      animation: "resetboard",
      duration: animationDuration,
      easing: "ease-in-out"
    });

  } else {
    console.log("first launch");

    game.refresh({
      transitions: false
    });

    game.saveGame(game.config.labels.SORTEDSAVE_LABEL);

    game.animate({
      element: document.getElementById("game"),
      animation: "intro",
      duration: animationDuration
    });

  }

  setTimeout(function() {

    game.shuffle(game.config.size.n * game.config.size.n);
    game.saveGame(game.config.labels.SHUFFLEDSAVE_LABEL);
    game.start();

  }, animationDuration * .85);
};
