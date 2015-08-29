game.createBoard = function() {
  "use strict";
  //    - creates the board, the tiles objects and the html 

  // local vars:
  var boardHTML, //   - - the game main html element 
    tile, //    - - each tile object during a loop
    row = 0, //   - - vertical position of each tile, starting from 0
    col = 0; //   - - horizontal position of each tile, starting from 0

  if (document.getElementById(this.config.labels.BOARD_ID) === null) {
    // create the board html element, assigns it its id attribute and adds it to the game di
    boardHTML = document.createElement("div");
    boardHTML.setAttribute("id", this.config.labels.BOARD_ID);

    document.getElementById(this.config.labels.GAME_ID).appendChild(boardHTML); // the board is now in the DOM  

  } else {

    document.getElementById(this.config.labels.BOARD_ID).innerHTML = "";

  };


  /**
   * TODO: handle re-creation of the board with different sizes
   */


  // update game config with the total number of tiles
  this.config.size.n = this.config.size.h * this.config.size.v;

  // save the index of the last tile as the "hole" during the game
  this.config.labels.HOLE_INDEX = this.config.size.n - 1;


  // populates the board with the tiles
  for (var i = 0; i < this.config.size.n; i++) // repeat until (n) are created
  {
    //  create a new tile 
    tile = {
      i: i, // the index of the tile
      id: this.config.labels.TILE_PREFIX + i, // the id of this tile in the html
      col: col, // horizontal position during the game
      row: row, // vertical position during the game
      correctCol: col, // horizontal position when the game is won
      correctRow: row, // vertical position when the game is won
      even: (i % 2 === 0) ? true : false, //
      evenCol: ((col % 2 === 0)) ? true : false,
      evenRow: ((row % 2 === 0)) ? true : false
    };

    tile.htmlElement = document.createElement("div");

    tile.htmlElement.setAttribute("id", this.config.labels.TILE_PREFIX + i);
    tile.htmlElement.setAttribute("tabindex", i);
    tile.htmlElement.setAttribute("class", " tile" +
      ((tile.evenRow) ? " even-row" : " odd-row") +
      ((tile.evenCol) ? " even-col" : " odd-col") +
      ((tile.even) ? " even" : " odd") +
      ((i === this.config.labels.HOLE_INDEX) ? " hole" : "") +
      " col-" + col +
      " row-" + row
    );
    tile.htmlElement.innerHTML = '<div class="inner"><div class="number">' + (i + 1) + '</div></div>';

    this.runtime.tiles[this.config.labels.TILE_PREFIX + i] = tile;

    document.getElementById(this.config.labels.BOARD_ID).appendChild(tile.htmlElement);

    col++;
    if (col >= this.config.size.h) {
      row++;
      col = 0;
    };
  };

  this.saveGame(this.config.labels.SORTEDSAVE_LABEL);

};
