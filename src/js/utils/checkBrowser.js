game.utils.checkBrowser = function() {
  return !(/MSIE\s/.test(navigator.userAgent) && parseFloat(navigator.appVersion.split("MSIE")[1]) < 11);
}
