game.checkFeatures = function() {
  "use strict";




  /*
    if the device supports it listen for touch 
    events instead of mouse events      
   */
  game.config.useTouch = game.utils.useTouch();


  /*
    if the device supports it use 3D transforms 
    (which should be hardware accellerated) 
    instead of 2D transforms
   */
  game.config.use3Dtransforms = game.utils.use3D();


  /*
    if the devive supports it, use HTML5 
    localStorage to save games
   */
  game.config.useLstorage = game.utils.useLocalStorage();


  /*
    if the devive supports it, use CSS3 
    animations
   */
  game.config.useCssAnimations = game.utils.useCSS3Animations();


  /*
    detects Safari fullscreen mode (for ex. 
    launched as app from home screen)
   */
  game.config.launchedAsApp = game.utils.detectFullscreen();


  /*
    list of browser vendors prefixes to 
    support for CSS3 properties    
   */
  game.config.CSSprefixes = ["", game.utils.getBrowserPrefix().css];




};
