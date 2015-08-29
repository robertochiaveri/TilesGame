window.onload = function() {

  if (!window.pageYOffset) {
    window.scrollTo(0, 1);
  }

  game.utils.addClass(document.documentElement, "loaded");
  game.init();
}
