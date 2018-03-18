game.checkFeatures = function() {
  "use strict";


  this.config.browserOK = game.utils.checkBrowser();

  if (!this.config.browserOK) {
    console.log("Browser not supported");
    alert("this browser version isn't supported")
    return false;
  }

  /*
    if the device supports it use 3D transforms
    (which should be hardware accellerated)
    instead of 2D transforms
   */
  this.config.useCSStransitions = Modernizr.csstransitions;

  if (!this.config.useCSStransitions)  {

    console.log("css transitions are disabled");

    this.utils.createCSSClass(
      "#" + this.config.labels.GAME_ID + " * ",
      "transition: none !important;"
    );

  }

  /*
    if the device supports it use 3D transforms
    (which should be hardware accellerated)
    instead of 2D transforms
   */
  this.config.use3Dtransforms = Modernizr.csstransforms3d;


  /*
    if the devive supports it, use HTML5
    localStorage to save games
   */
  this.config.useLstorage = Modernizr.localstorage;


  this.config.useVibration = true;


  /*
    if the devive supports it, use CSS3
    animations
   */
  this.config.useCssAnimations = Modernizr.cssanimations;


  /*
    detects Safari fullscreen mode (for ex.
    launched as app from home screen)
   */
  this.config.launchedAsApp = this.utils.detectFullscreen();


  /*
    list of browser vendors prefixes to
    support for CSS3 properties
   */
  this.config.browserPrefixes = this.utils.getBrowserPrefix();


  /*
    will use RAF when supported by the browser
  */
  this.config.useReqAnimFrame = !!window.requestAnimationFrame;

};
