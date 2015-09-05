/*
  abstraction for IDs, CLASSES and so on
 */
game.config.labels = {

  /* 
    id of the main wrapper of the page 
  */
  WRAPPER_ID: "game-wrapper",

  /* html id of the game container */
  GAME_ID: "game",

  /* id of the board*/
  BOARD_ID: "board",

  /* id of the toolbar */
  TOOLBAR_ID: "toolbar",

  /* id of the background image container */
  BACKGROUND_CONTAINER_ID: "bg",

  /* id of the background image element */
  BACKGROUND_IMAGE_ID: "bg-img",

  /* prefix for all tiles ids */
  TILE_PREFIX: "tile-",

  /* className for tile element */
  TILE_CLASS: "tile",

  /* className for tile inner wrapper */
  TILE_INNER_CLASS: "inner",

  /* className for tile number element*/
  TILE_NUMBER_CLASS: "number",

  /* prefix for all toolbar buttons ids */
  TBUTTON_PREFIX: "btn-",

  /* class added to a tile when is being dragged */
  SELECTED_LABEL: "selected",

  /* class added to a tile when is being pressed */
  PRESSED_LABEL: "pressed",


  /* class added to a tile when is being animated */
  ANIMATED_LABEL: "animationInProgress",


  /* class added to the game main div when touch enabled */
  USETOUCH_LABEL: "touch",

  /* class added to the game main div when touch disabled */
  NO_TOUCH_LABEL: "no-touch",


  /* Directions Abstraction */
  UP: "up",
  RIGHT: "right",
  DOWN: "down",
  LEFT: "left",

  /* Orientations Abstraction */
  LANDSCAPE: "landscape",
  PORTRAIT: "portrait",

  /* Saved games localStorage index */
  SAVEDGAMES_LABEL: "savedGames",


  /* Savegame modes */
  AUTOSAVE_LABEL: "automatic",
  USERSAVE_LABEL: "user",
  SORTEDSAVE_LABEL: "sorted",
  SHUFFLEDSAVE_LABEL: "shuffled"

};
