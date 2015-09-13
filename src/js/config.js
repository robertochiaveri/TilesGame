game.config = {

  /*
    size of the board, in tiles 
    (h for columns, v for rows)
   */
  size: {
    h: 4,
    v: 4
  },

  /*
    minimum space btw the board and the screen, in %
   */
  margin: {
    h: 4,
    v: 4
  },

  /*
    thickness of the border around the board, in %
   */
  borderSize: 4,

  /*
    when true tiles near the hole can be pushed by dragged tiles    
   */
  pushMultiple: true,


  /*
    move tolerance; the percent of a tile size after which 
    the tile snaps into the new position. If it's moved less than
    this, the tile snaps back.
   */
  minDistanceToMoveTile: 0.25,


  /* 
    allow move by click (touching and shortly releasing a tile 
    but not dragging it)
  */

  clickToMove: true,


  /*
    time in ms after which releasing a tile won't trigger a movement
   */
  maxTimeForClickMove: 200,


  /*
    touch tolerance area around the tile considered draggable 
    during touch drag before dropping
   */
  touchTolerance: 0.2,

  /*
    transitonDurations
   */
  transitionDuration: {

    /* for tile movements on clicks, drags and gestures */
    generic: 60,

    /* for tile movement initiated by keyboard events*/
    byKeyboard: 100
  },

  /*
    listen to keyboard events during game
   */
  useKeyboard: true


};
