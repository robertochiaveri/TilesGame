game.checkFeatures = function() {
  "use strict";

  /*
    if the device supports it listen for touch 
    events instead of mouse events      
   */
  this.config.useTouch = Modernizr.touch;


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
  this.config.CSSprefixes = ["", this.utils.getBrowserPrefix().css];




};
