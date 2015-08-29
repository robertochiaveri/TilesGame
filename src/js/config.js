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
    percent of tile size to add during touch drag before dropping
   */
  touchTolerance: 0.2,


  /*
    transitonDurations
   */
  transitionDuration: {

    /* for tile movements on clicks, drags and gestures */
    generic: 150,

    /* for tile movement initiated by keyboard events*/
    byKeyboard: 100
  },

  /*
    listen to keyboard events during game
   */
  useKeyboard: true


};
