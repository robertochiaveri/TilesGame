var game = {

  /** 
   * CONFIGURATION
   */
  config: {
    /*
      if the device supports it listen for touch 
      events instead of mouse events      
     */
    useTouch: useTouch(),


    /*
      listen to keyboard events during game
     */
    useKeyboard: true,


    /*
      if the device supports it use 3D transforms 
      (which should be hardware accellerated) 
      instead of 2D transforms
     */
    use3Dtransforms: use3D(),


    /*
      if the devive supports it, use HTML5 
      localStorage to save games
     */
    useLstorage: useLocalStorage(),


    /*
      if the devive supports it, use CSS3 
      animations
     */
    useCssAnimations: useCSS3Animations(),


    /*
      detects Safari fullscreen mode (for ex. 
      launched as app from home screen)
     */
    launchedAsApp: detectFullscreen(),


    /*
      list of browser vendors prefixes to 
      support for CSS3 properties    
     */
    CSSprefixes: ["", getBrowserPrefix().css],

    /*
      a collection of easing functions
     */
    easings: {
      EASING_TILES_MOVEMENT: "cubic-bezier(0.403, 0.543, 0.754, 1)"
    },

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

    /* keycodes abstractions */
    keycodes: {
      KEY_ARROW_LEFT: 37,
      KEY_ARROW_UP: 38,
      KEY_ARROW_RIGHT: 39,
      KEY_ARROW_DOWN: 40,
      KEY_ESCAPE: 2,
      KEY_RETURN: 13
    },

    toolbarButtons: [{
      id: "new",
      description: "New game",
      handler: function() {
        if (window.confirm("Start a new game?")) {
          game.newGame();
        };
      }
    }, {
      id: "save",
      description: "Save the board",
      handler: function() {
        game.saveGame(game.config.labels.USERSAVE_LABEL);
        addClass(document.getElementById("btn-save"), "on");
      }
    }, {
      id: "load",
      description: "Load the saved board",
      handler: function() {
        if (window.confirm("Load the saved game?")) {
          game.loadGame(game.config.labels.USERSAVE_LABEL);
        };
        game.animate({
          element: document.getElementById("game"),
          animation: "load",
          duration: 1000
        });
      },
    }, {
      id: "settings",
      description: "change your preferences",
      handler: function() {}
    }, {
      id: "info",
      description: "About this game",
      handler: function() {}
    }],


    /*
      abstraction for IDs, CLASSES and so on
     */
    labels: {

      /* 
        id of the main wrapper of the page 
      */
      WRAPPER_ID: "gameWrapper",

      /* html id of the game container */
      GAME_ID: "game", //   - - 


      /* id of the board*/
      BOARD_ID: "board",

      /* id of the toolbar */
      TOOLBAR_ID: "toolbar",


      /* prefix for all tiles ids */
      TILE_PREFIX: "tile-",

      /* prefix for all toolbar buttons ids */
      TBUTTON_PREFIX: "btn-",


      /* class added to a tile when is being dragged */
      SELECTED_LABEL: "selected",

      /* class added to a tile when is being pressed */
      PRESSED_LABEL: "pressed",

      /* class added to the game main div to inhibit transitions */
      NO_TRANSITIONS: "noTransitions",

      /* class added to the game main div when touch enabled */
      USETOUCH_LABEL: "useTouch",

      /* class added to the game main div when touch disabled */
      NO_TOUCH_LABEL: "noTouch",


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
    }
  },

  runtime: { //   - store for all runtime variables
    started: false, //    - - false before running, a date obj when started
    running: false, //    - - true if the game is started (and user can win)    
    ended: false, //    - - false while running, a date obj when ended
    timePlaying: 0, //tbd
    movesCount: false, //   - - number of moves the user has made since the start
    dragging: false, //   - - true when any tile is being dragged
    resizeTimer: -1, //   - - variable needed for the resize timer
    selectedTile: null, //    - - the selected tile object (extends normal tile objects 
    tiles: {}, //   - - tile tiles (associative) array
    latestSelection: 0 //   - - used to ignore doubleclicks
  },

  metrics: {}, //   object with all game dimentions end metrics

  // METHODS 


  init: function() {

    console.log(this.config.size.hgame, game.config.size.h);

    game.createBoard(); //   - - creates the board, the tiles objects and the html       
    game.metricsUpdate();
    game.initListeners(); //   - - create event listeners enabling user interaction
    game.refresh({
      transitions: false
    }); //    - - position each tile according to the game runtime      
    if (!game.loadGame()) {
      game.newGame(); //   - - repeatedly changes random tiles 
    } else {
      game.animate({
        element: document.getElementById("game"),
        animation: "load",
        duration: 1000
      });
      game.start(); //   - - set the game as started. from this moment on the game checks if the user has won
    }
  },
  start: function() {
    //    - (see above)
    game.runtime.started = new Date(); //   - - saves the time of game start
    game.runtime.ended = false;
    game.runtime.running = true; //   - - when true the game checks if the user has won at every move during refresh
    game.runtime.movesCount = 0;
    console.log("game started");
  },
  stop: function() {
    //    - reverse start()
    game.runtime.ended = new Date(); //   - - saves the time of game end
    game.runtime.running = false; //    - - the game won't check if the user has won
    console.log("game stopped");
  },
  createBoard: function() {
    //    - creates the board, the tiles objects and the html 

    // local vars:
    var boardHTML, //   - - the game main html element 
      tile, //    - - each tile object during a loop
      row = 0, //   - - vertical position of each tile, starting from 0
      col = 0; //   - - horizontal position of each tile, starting from 0


    // update game config with the total number of tiles
    game.config.size.n = game.config.size.h * game.config.size.v;

    // save the index of the last tile as the "hole" during the game
    game.config.labels.HOLE_INDEX = game.config.size.n - 1;

    // create the board html element, assigns it its id attribute and adds it to the game di
    boardHTML = document.createElement("div");
    boardHTML.setAttribute("id", game.config.labels.BOARD_ID);
    if (game.config.useTouch) {
      addClass(document.documentElement, game.config.labels.USETOUCH_LABEL);
    } else {
      addClass(document.documentElement, game.config.labels.NO_TOUCH_LABEL);
    }
    document.getElementById(game.config.labels.GAME_ID).appendChild(
      boardHTML); // the board is now in the DOM  


    // populates the board with the tiles
    for (var i = 0; i < game.config.size.n; i++) // repeat until (n) are created
    {
      //  create a new tile 
      tile = {
        i: i, // the index of the tile
        id: game.config.labels.TILE_PREFIX + i, // the id of this tile in the html
        col: col, // horizontal position during the game
        row: row, // vertical position during the game
        correctCol: col, // horizontal position when the game is won
        correctRow: row, // vertical position when the game is won
        even: (i % 2 === 0) ? true : false, //
        evenCol: ((col % 2 === 0)) ? true : false,
        evenRow: ((row % 2 === 0)) ? true : false
      };

      tile.htmlElement = document.createElement("div");

      tile.htmlElement.setAttribute("id", game.config.labels.TILE_PREFIX +
        i);
      tile.htmlElement.setAttribute("tabindex", i);
      tile.htmlElement.setAttribute("class", " tile" + ((tile.evenRow) ?
          " even-row" : " odd-row") + ((tile.evenCol) ? " even-col" :
          " odd-col") + ((tile.even) ? " even" : " odd") + ((i ==
          game.config
          .labels.HOLE_INDEX) ? " hole" : "") + " col-" + col +
        " row-" +
        row);

      tile.htmlElement.innerHTML =
        '<div class="inner"><div class="number">' + (i + 1) +
        '</div></div>';

      game.runtime.tiles[game.config.labels.TILE_PREFIX + i] = tile;
      document.getElementById(game.config.labels.BOARD_ID).appendChild(
        tile.htmlElement);


      col++;
      if (col >= game.config.size.h) {
        row++;
        col = 0;
      };
    };

    game.saveGame(game.config.labels.SORTEDSAVE_LABEL);
  },
  metricsUpdate: function() {

    var wrapperHTML = document.getElementById(game.config.labels.WRAPPER_ID), // main wrapper html element
      gameHTML = document.getElementById(game.config.labels.GAME_ID), // game div html element
      boardHTML = document.getElementById(game.config.labels.BOARD_ID), // game div html element
      wrapperWidth = wrapperHTML.offsetWidth;
    wrapperHeight = wrapperHTML.offsetHeight;
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;


    // save values in metrics obj
    game.metrics.transforms3Dsupport = (game.config.use3Dtransforms) ? [
      "3d", ",0"
    ] : ["", ""]; // allows transformations 2d and 3d 
    game.metrics.wrapperOrientation = (wrapperWidth >= wrapperHeight) ?
      game.config.labels.LANDSCAPE : game.config.labels.PORTRAIT;
    game.metrics.wrapperRatio = wrapperWidth / wrapperHeight;
    game.metrics.pixelRatio = (window.devicePixelRatio > 1) ? window.devicePixelRatio :
      1;


    // if it doesn't exists yet, create wrapperSize obj
    if (typeof game.metrics.wrapperSize === "undefined") {
      game.metrics.wrapperSize = {};
    }

    // if it doesn't exist yet, create a sub-obj for storing metric sinformation for each screen orientation    
    game.metrics.wrapperSize[game.metrics.wrapperOrientation] = {
      width: wrapperWidth,
      height: wrapperHeight,
    };

    // this is info about the board configuration
    game.metrics.boardLayout = (game.config.size.h >= game.config.size
        .v) ?
      game.config.labels.LANDSCAPE : game.config.labels.PORTRAIT;
    game.metrics.boardRatio = game.config.size.h / game.config.size.v;

    // this is a pregmatic way to calculate a good font size for tile numbers
    game.metrics.fontSize = parseInt((document.body.currentStyle || (
      window.getComputedStyle && getComputedStyle(document.body,
        null)) || document.body.style).fontSize);

    // initialize the margin around the game board
    game.metrics.marginH = {
      percent: game.config.margin.h,
      pixels: 0
    };

    // initialize the margin around the game board
    game.metrics.marginV = {
      percent: game.config.margin.v,
      pixels: 0
    };

    // initialize the bezel around the game board
    game.metrics.borderSize = {
      percent: game.config.borderSize,
      pixels: 0
    };

    // depending on orientation, calculate board size to optimize space
    // board will always be a square, so calculate width first
    if (game.metrics.wrapperOrientation === game.config.labels.LANDSCAPE) {

      game.metrics.height = roundTo(wrapperHeight / 100 * (100 - game
          .config
          .borderSize * 2 - game.metrics.marginV.percent * 2), game
        .config
        .size.h);
      game.metrics.width = game.metrics.height;

      game.metrics.borderSize.pixels = Math.round(wrapperHeight / 100 *
        game.config.borderSize);
      game.metrics.marginH.pixels = Math.round(wrapperHeight / 100 *
        game
        .metrics.marginH.percent);
      game.metrics.marginV.pixels = Math.round(wrapperHeight / 100 *
        game
        .metrics.marginV.percent);

      game.metrics.left = Math.round((wrapperWidth - game.metrics.width -
          game.metrics.borderSize.pixels - game.metrics.marginH.pixels
        ) /
        2);
      game.metrics.top = Math.round((game.metrics.wrapperSize[game.metrics
          .wrapperOrientation].height - game.metrics.height -
        game.metrics
        .borderSize.pixels - game.metrics.marginV.pixels) / 2);

    } else {

      game.metrics.width = roundTo(wrapperWidth / 100 * (100 - game.config
          .borderSize * 2 - game.metrics.marginH.percent * 2), game
        .config
        .size.v);
      game.metrics.height = game.metrics.width;

      game.metrics.borderSize.pixels = Math.round(wrapperWidth / 100 *
        game.config.borderSize);
      game.metrics.marginH.pixels = Math.round(wrapperWidth / 100 *
        game.metrics
        .marginH.percent);
      game.metrics.marginV.pixels = Math.round(wrapperWidth / 100 *
        game.metrics
        .marginV.percent);

      game.metrics.left = Math.round((wrapperWidth - game.metrics.width -
          game.metrics.borderSize.pixels - game.metrics.marginH.pixels
        ) /
        2);
      game.metrics.top = Math.round((game.metrics.wrapperSize[game.metrics
          .wrapperOrientation].height - game.metrics.height -
        game.metrics
        .borderSize.pixels - game.metrics.marginV.pixels) / 2);

    }

    // with the board size, get the tile size
    game.metrics.tileWidth = Math.round(game.metrics.width / game.config
      .size
      .h);
    game.metrics.tileHeight = Math.round(game.metrics.height / game.config
      .size.v);


    // WRITING PHASE

    // hide to speed up redraws; also write the page height as inline style to prevent reflows
    wrapperHTML.style.visibility = "hidden";

    // write the css for game html element
    var prefix = "";
    var CSSstyleDeclaration = "" + "padding:" + Math.round(game.metrics
        .borderSize
        .pixels) + "px;" + "width:" + game.metrics.width + "px; " +
      "height:" + game.metrics.height + "px; " + "left:" + game.metrics
      .left +
      "px; " + "top:" + game.metrics.top + "px; ";

    gameHTML.style.cssText = CSSstyleDeclaration;

    // css for tiles
    createCSSClass(".tile",
      "width: " + (100 / game.config.size.h) + "%; " +
      "height: " + (100 / game.config.size.v) + "%; "
    );

    // tiles visible div
    createCSSClass(".tile > .inner",
      "background-size: auto " + game.metrics.height + "px;"
    );

    // tile numbers
    createCSSClass(".tile > .inner > .number",
      "font-size: " + document.getElementById(game.config.labels.BOARD_ID)
      .offsetHeight / game.config.size.v / 2 / 10 + "em;"
    );

    // scroll to top
    window.scrollTo(0, 1);

    // finally, reveal the updated html element
    wrapperHTML.style.visibility = "visible";
  },
  refresh: function(params) {

    var tileID,
      tile,
      CSSstyleDeclaration = "",
      win = true;

    if (typeof params == "undefined") {
      params = {
        transitions: true,
        saveGame: false
      };
    };

    if (params.transitions === false) {
      params.transitionDuration = 0;
    } else // transitions = true
    {
      if (typeof params.transitionDuration != "number") {
        params.transitionDuration = game.config.transitionDuration.generic;
      }
    };


    for (var i = 0; i < game.config.size.n; i++) {

      tileID = game.config.labels.TILE_PREFIX + i;
      tile = game.runtime.tiles[tileID];

      // write the css for tile html element
      var prefix = "";
      for (var p = 0; p < game.config.CSSprefixes.length; p++) {
        prefix = game.config.CSSprefixes[p];
        CSSstyleDeclaration += prefix + "transform:translate" + game.metrics
          .transforms3Dsupport[0] + "(" + (tile.col * 100) + "%," + (
            tile
            .row * 100) + "%" + game.metrics.transforms3Dsupport[1] +
          "); ";


        CSSstyleDeclaration += prefix + "transition-property:" +
          prefix +
          "transform;";
        CSSstyleDeclaration += prefix + "transition-duration:" +
          parseInt(
            Math.abs(params.transitionDuration)) + "ms !important;";
        CSSstyleDeclaration += prefix + "transition-timing-function:" +
          game.config.easings.EASING_TILES_MOVEMENT + ";";


      }


      if (params.redraw !== false) {
        tile.htmlElement.style.cssText = CSSstyleDeclaration;
      }

      tile.htmlElement.childNodes[0].style.backgroundPosition = "-" +
        (
          tile.correctCol * game.metrics.tileWidth) + "px -" + (tile.correctRow *
          game.metrics.tileHeight) + "px";

      tile.canMove = game.canMove(tileID);
      tile.canPush = game.canPush(tileID);

      // clean up data created when dragging or moving a tile
      delete tile.offset;
      delete tile.newPosition;
      delete tile.oldPosition;
      delete tile.timeStamp;
      delete tile.revert;
      delete tile.max;

      // check if the user has won
      if (tile.correctCol != tile.col || tile.correctRow != tile.row) {
        win = false;
      }

    };

    if (game.runtime.running && win /* && game.runtime.movesCount > 0 */ ) {
      setTimeout(function() {
        alert("Hai vinto!")
      }, 500);
      game.stop();
    }

    if (params.saveGame === true) {
      game.saveGame();
    }
  },
  initListeners: function() {

    // BEGIN TOUCH/CLICK EVENTS

    // start/down
    // board
    listenTo(document.getElementById(game.config.labels.BOARD_ID), (
      game.config
      .useTouch ? "touchstart" : "mousedown"), function(event) {

      // ignore doubleclicks  
      if (event.timeStamp - game.runtime.latestSelection < 300) {
        return false;
      }
      game.runtime.latestSelection = event.timeStamp;

      game.selectTile(game.getTile(event), event);

    });

    // move
    listenTo(document.getElementById(game.config.labels.BOARD_ID), (
      game.config
      .useTouch ? "touchmove" : "mousemove"), function(event) {

      if (!!game.runtime.selectedTile) {
        game.dragTile(event);
      } else if (event.type != "mousemove") {

        // ignore doubleclicks  
        if (event.timeStamp - game.runtime.latestSelection < 300) {
          return false;
        }
        game.runtime.latestSelection = event.timeStamp;

        game.selectTile(game.getTile(event), event);
      }


    });

    //  end/up
    listenTo(document.getElementById(game.config.labels.WRAPPER_ID), (
      game.config.useTouch ? "touchend" : "mouseup"), function(
      event) {

      if (typeof game.runtime.selectedTile == "undefined" || game
        .runtime
        .selectedTile === null) {
        return false;
      }

      /*
            if (typeof game.runtime.selectedTile.newPosition != "undefined")
            {
              
              if (( event.timeStamp - game.runtime.selectedTile.timeStamp) < 150)
              {
                game.moveTile(
                  game.getTile(event),
                  {
                    transitions:  true,
                    force:      false,
                    refresh:    true
                  }               
                );
              }
        
            }*/

      game.deselectTile();

    });

    // mouseout
    listenTo(document.getElementById(game.config.labels.GAME_ID),
      "mouseout",
      function(e) {
        e = e ? e : window.event;
        var from = e.relatedTarget || e.toElement;
        if (!from || from.nodeName == "HTML") {
          game.deselectTile();
        }
      });


    // END TOUCH/MOUSE EVENTS

    if (game.config.useKeyboard) {
      listenTo(document.body, "keyup", function(e) {

        switch (e.which) {
          case game.config.keycodes.KEY_ARROW_LEFT:
            game.moveAnyTile({
              direction: game.config.labels.LEFT,
              pushing: e.ctrlKey
            })
            break;

          case game.config.keycodes.KEY_ARROW_UP:
            game.moveAnyTile({
              direction: game.config.labels.UP,
              pushing: e.ctrlKey
            })
            break;

          case game.config.keycodes.KEY_ARROW_RIGHT:
            game.moveAnyTile({
              direction: game.config.labels.RIGHT,
              pushing: e.ctrlKey
            })
            break;

          case game.config.keycodes.KEY_ARROW_DOWN:
            game.moveAnyTile({
              direction: game.config.labels.DOWN,
              pushing: e.ctrlKey
            })
            break;

        }

      });
    }

    // resize
    listenTo(window, "resize", function(e) {

      if (game.runtime.resizeTimer != -1)
        clearTimeout(game.runtime.resizeTimer);

      game.runtime.resizeTimer = window.setTimeout(function() {
        game.deselectTile();
        game.metricsUpdate();
        game.refresh();
      }, 100);

    });
  },
  getTile: function(param) {

    var target = null,
      maxLevels = 5,
      tiles = game.runtime.tiles,
      col = parseInt(param.col),
      row = parseInt(param.row),
      prefix = game.config.labels.TILE_PREFIX;

    switch (typeof param) {

      case "object":

        if (param.srcElement) {
          target = param.srcElement;
        } else if (param.pageX && param.pageY) {
          target = document.elementFromPoint(param.pageX, param.pageY)
        } else if (!isNaN(parseInt(param.col)) && !isNaN(parseInt(
            param.row))) {

          for (var i = 0; i < game.config.size.n; i++) {
            if (tiles[prefix + i].col == col && tiles[prefix + i].row ==
              row) {
              return tiles[prefix + i];
            }
          }
          return false;
        } else {
          return false;
        }

        if (target === null) {
          return false;
        }

        for (i = 0; i < maxLevels; i++) {

          if (
            typeof target == "undefined" ||
            typeof target.parentNode == "undefined" ||
            target === null ||
            target.parentNode === null
          ) {
            return false;
          } else if (target.parentNode.id == game.config.labels.BOARD_ID) {
            return game.runtime.tiles[target.id]
          } else {
            target = target.parentNode;
          }
        }
        return false;

        break;

      case "string":
        if (param.indexOf(prefix) === 0) {
          return tiles[param];
        }
        return false;

      case "number":
        if (param < game.config.size.n) {
          return tiles[prefix + param];
        }
        return false;


    }
  },
  selectTile: function(tile, event) {

    if (!game.runtime.running) {
      return false;
    }

    tile = game.isTile(tile);

    if (!tile) {
      return false;
    };

    var direction = (game.config.pushMultiple && tile.canPush) ? tile
      .canPush
      .direction : tile.canMove;

    game.runtime.selectedTile = tile;

    if (game.canMove(tile) || game.config.pushMultiple) {
      game.runtime.selectedTile.timeStamp = (typeof event !=
          "undefined") ?
        event.timeStamp : new Date();

      game.runtime.selectedTile.oldPosition = {

        left: {
          percent: 100 * tile.col,
          pixels: game.metrics.tileWidth * tile.col
        },
        top: {
          percent: 100 * tile.row,
          pixels: game.metrics.tileHeight * tile.row
        }

      };
      game.runtime.selectedTile.offset = (typeof event != "undefined") ? {
        top: ((event.pageY - game.metrics.top - game.metrics.borderSize
          .pixels) % game.metrics.tileHeight),
        left: ((event.pageX - game.metrics.left - game.metrics.borderSize
          .pixels) % game.metrics.tileWidth)
      } : {
        top: game.metrics.tileHeight / 2,
        left: game.metrics.tileWidth / 2
      };

      game.runtime.selectedTile.newPosition = {
        top: {
          min: {
            pixels: null,
            percent: null
          },
          newValue: {
            pixels: null,
            percent: null
          },
          max: {
            pixels: null,
            percent: null
          }
        },
        left: {
          min: {
            pixels: null,
            percent: null
          },
          newValue: {
            pixels: null,
            percent: null
          },
          max: {
            pixels: null,
            percent: null
          }
        }
      };

      switch (direction) {

        case game.config.labels.UP:
          game.runtime.selectedTile.newPosition.top.min.pixels = Math
            .round(
              game.runtime.selectedTile.oldPosition.top.pixels - game
              .metrics
              .tileHeight);
          game.runtime.selectedTile.newPosition.top.max.pixels = Math
            .round(
              game.runtime.selectedTile.oldPosition.top.pixels);
          game.runtime.selectedTile.newPosition.left.min.pixels =
            Math.round(
              game.runtime.selectedTile.oldPosition.left.pixels);
          game.runtime.selectedTile.newPosition.left.max.pixels =
            Math.round(
              game.runtime.selectedTile.oldPosition.left.pixels);
          break;

        case game.config.labels.DOWN:
          game.runtime.selectedTile.newPosition.top.min.pixels = Math
            .round(
              game.runtime.selectedTile.oldPosition.top.pixels);
          game.runtime.selectedTile.newPosition.top.max.pixels = Math
            .round(
              game.runtime.selectedTile.oldPosition.top.pixels + game
              .metrics
              .tileHeight);
          game.runtime.selectedTile.newPosition.left.min.pixels =
            Math.round(
              game.runtime.selectedTile.oldPosition.left.pixels);
          game.runtime.selectedTile.newPosition.left.max.pixels =
            Math.round(
              game.runtime.selectedTile.oldPosition.left.pixels);
          break;

        case game.config.labels.LEFT:
          game.runtime.selectedTile.newPosition.left.min.pixels =
            Math.round(
              game.runtime.selectedTile.oldPosition.left.pixels -
              game.metrics
              .tileWidth);
          game.runtime.selectedTile.newPosition.left.max.pixels =
            Math.round(
              game.runtime.selectedTile.oldPosition.left.pixels);
          game.runtime.selectedTile.newPosition.top.min.pixels = Math
            .round(
              game.runtime.selectedTile.oldPosition.top.pixels);
          game.runtime.selectedTile.newPosition.top.max.pixels = Math
            .round(
              game.runtime.selectedTile.oldPosition.top.pixels);
          break;

        case game.config.labels.RIGHT:
          game.runtime.selectedTile.newPosition.left.min.pixels =
            Math.round(
              game.runtime.selectedTile.oldPosition.left.pixels);
          game.runtime.selectedTile.newPosition.left.max.pixels =
            Math.round(
              game.runtime.selectedTile.oldPosition.left.pixels +
              game.metrics
              .tileWidth);
          game.runtime.selectedTile.newPosition.top.min.pixels = Math
            .round(
              game.runtime.selectedTile.oldPosition.top.pixels);
          game.runtime.selectedTile.newPosition.top.max.pixels = Math
            .round(
              game.runtime.selectedTile.oldPosition.top.pixels);
          break;
      }

      if (!game.runtime.dragging) {
        addClass(tile.htmlElement, game.config.labels.PRESSED_LABEL +
          " " +
          game.config.labels.SELECTED_LABEL);
      }

      if (game.config.pushMultiple) {

        tile.canPush.tiles = [];

        for (var i = 1; i <= tile.canPush.n; i++) {

          switch (tile.canPush.direction) {

            case game.config.labels.UP:
              tile.canPush.tiles.push(game.getTile({
                col: tile.col,
                row: tile.row - i
              }));
              break;

            case game.config.labels.RIGHT:
              tile.canPush.tiles.push(game.getTile({
                col: tile.col + i,
                row: tile.row
              }));
              break;

            case game.config.labels.DOWN:
              tile.canPush.tiles.push(game.getTile({
                col: tile.col,
                row: tile.row + i
              }));
              break;

            case game.config.labels.LEFT:
              tile.canPush.tiles.push(game.getTile({
                col: tile.col - i,
                row: tile.row
              }));
              break;

          }

          tile.canPush.tiles[i - 1].max = null;

          if (!game.runtime.dragging) {

            addClass(tile.canPush.tiles[i - 1].htmlElement, game.config
              .labels
              .SELECTED_LABEL);

          }

        }

      }

      game.runtime.dragging = true;

      //console.log("selected",tile);

    }
  },
  deselectTile: function() {

    var tile = game.isTile(game.runtime.selectedTile);
    if (!tile) {
      return false;
    };

    removeClass(tile.htmlElement, game.config.labels.SELECTED_LABEL);
    removeClass(tile.htmlElement, game.config.labels.PRESSED_LABEL);


    if (typeof tile.newPosition == "undefined") {
      return false;
    };

    if (typeof tile.newPosition.left.newValue.pixels != "undefined") {

      if (game.config.pushMultiple && typeof tile.canPush.tiles !=
        "undefined") {

        for (var i = tile.canPush.tiles.length; i > 0; i--) {
          if (tile.canPush.tiles[0].revert !== true) {
            game.moveTile(
              tile.canPush.tiles[i - 1], {
                transitions: true,
                force: false,
                refresh: false
              }
            );
          }
          removeClass(tile.canPush.tiles[i - 1].htmlElement, game.config
            .labels
            .SELECTED_LABEL);
        }


        if (
          (Math.abs(tile.newPosition.left.newValue.pixels - tile.oldPosition
            .left.pixels) >= game.metrics.tileWidth / 3) ||
          (Math.abs(tile.newPosition.top.newValue.pixels - tile.oldPosition
            .top.pixels) >= game.metrics.tileHeight / 3)
        ) {
          game.moveTile(
            tile, {
              transitions: true,
              force: false,
              refresh: false
            }
          );

        }

        game.runtime.selectedTile = null;

        // console.log("de-selected",tile);

        game.refresh({
          saveGame: true
        });

      } else {
        if (
          (tile.newPosition.left.newValue.pixels != null) &&
          (
            (Math.abs(tile.newPosition.left.newValue.pixels - tile.oldPosition
              .left.pixels) >= game.metrics.tileWidth / 3) ||
            (Math.abs(tile.newPosition.top.newValue.pixels - tile.oldPosition
              .top.pixels) >= game.metrics.tileHeight / 3)
          )
        ) {
          game.moveTile(
            tile, {
              transitions: true,
              force: false,
              refresh: true
            }
          );
        } else {
          game.refresh();
        }

      }

    }

    game.runtime.selectedTile = null;
    game.runtime.dragging = false;
  },
  canPush: function(tile) {

    var tile = game.isTile(tile),
      hole = game.runtime.tiles[game.config.labels.TILE_PREFIX + game
        .config
        .labels.HOLE_INDEX],
      holePosition = hole.col + "-" + hole.row,
      tilesToPush = 0;

    if (!tile) {
      return false;
    };

    if (game.config.pushMultiple) {
      if (tile.col == hole.col || tile.row == hole.row) {
        tilesToPush = (tile.col - hole.col == 0) ? hole.row - tile.row :
          hole.col - tile.col;
        if (tilesToPush == 0) {
          return false;
        }

        if (tile.col == hole.col) // up or down
        {
          if (tilesToPush > 0) // down
          {
            return ({
              n: (Math.abs(tilesToPush) - 1),
              direction: game.config.labels.DOWN
            });
          } else // up
          {
            return ({
              n: (Math.abs(tilesToPush) - 1),
              direction: game.config.labels.UP
            });
          }
        } else // left or right
        {
          if (tilesToPush > 0) // right
          {
            return ({
              n: (Math.abs(tilesToPush) - 1),
              direction: game.config.labels.RIGHT
            });
          } else // left
          {
            return ({
              n: (Math.abs(tilesToPush) - 1),
              direction: game.config.labels.LEFT
            });
          }
        }
      }

    }

    return false;
  },
  canMove: function(tile) {

    var tile = game.isTile(tile),
      hole = game.runtime.tiles[game.config.labels.TILE_PREFIX + game
        .config
        .labels.HOLE_INDEX],
      holePosition = hole.col + "-" + hole.row,
      tilesToPush = 0;

    if (!tile) {
      return false;
    };

    if (holePosition == (tile.col) + "-" + (tile.row - 1)) {
      return game.config.labels.UP;
    }
    if (holePosition == (tile.col + 1) + "-" + (tile.row)) {
      return game.config.labels.RIGHT;
    }
    if (holePosition == (tile.col) + "-" + (tile.row + 1)) {
      return game.config.labels.DOWN;
    }
    if (holePosition == (tile.col - 1) + "-" + (tile.row)) {
      return game.config.labels.LEFT;
    }

    return false;
  },
  dragTile: function(event) {

    if (!game.runtime.running) {
      game.deselectTile();
      return false;
    }

    var tile = game.isTile(game.runtime.selectedTile),
      direction,
      newposX,
      newPosY,
      offset,
      otherTile,
      otherTileNewPos,
      CSSstyleDeclaration = null;

    if (!tile ||
      (!!!tile.canMove && !tile.canPush.n) ||
      (typeof tile.offset == "undefined") ||
      (typeof tile.newPosition == "undefined")
    ) {
      game.deselectTile();
      return false;
    };

    newPosX = event.pageX - game.metrics.borderSize.pixels - game.metrics
      .left - tile.offset.left;
    newPosY = event.pageY - game.metrics.borderSize.pixels - game.metrics
      .top - tile.offset.top;

    direction = (game.config.pushMultiple && tile.canPush) ? tile.canPush
      .direction : tile.canMove;

    if (newPosY < tile.newPosition.top.min.pixels) {
      newPosY = tile.newPosition.top.min.pixels;
    };
    if (newPosY > tile.newPosition.top.max.pixels) {
      newPosY = tile.newPosition.top.max.pixels;
    };
    if (newPosX < tile.newPosition.left.min.pixels) {
      newPosX = tile.newPosition.left.min.pixels;
    };
    if (newPosX > tile.newPosition.left.max.pixels) {
      newPosX = tile.newPosition.left.max.pixels;
    };



    if (event.pageX - game.metrics.left - game.metrics.borderSize.pixels +
      game.metrics.tileWidth * (game.config.touchTolerance) < newPosX ||
      event.pageX - game.metrics.left - game.metrics.borderSize.pixels -
      game.metrics.tileWidth * (1 + game.config.touchTolerance) >
      newPosX ||
      event.pageY - game.metrics.top - game.metrics.borderSize.pixels +
      game.metrics.tileHeight * (game.config.touchTolerance) <
      newPosY ||
      event.pageY - game.metrics.top - game.metrics.borderSize.pixels -
      game.metrics.tileHeight * (1 + game.config.touchTolerance) >
      newPosY
    ) {

      game.deselectTile();

      // console.log("dropped!");

      return false;
    }



    var prefix = "";

    switch (direction) {

      case game.config.labels.LEFT:
      case game.config.labels.RIGHT:

        tile.newPosition.top.newValue.pixels = tile.oldPosition.top.pixels;
        tile.newPosition.left.newValue.pixels = newPosX;

        tile.newPosition.left.newValue.percent = newPosX * 100 / game
          .metrics
          .tileWidth;

        // write the css for tile html element

        for (var p = 0; p < game.config.CSSprefixes.length; p++) {
          prefix = game.config.CSSprefixes[p];
          CSSstyleDeclaration += prefix + "transform:translate" +
            game.metrics
            .transforms3Dsupport[0] + "(" + tile.newPosition.left.newValue
            .percent + "%," + tile.oldPosition.top.percent + "%" +
            game.metrics
            .transforms3Dsupport[1] + "); " + prefix +
            "transition:none; ";
        }
        tile.htmlElement.style.cssText = CSSstyleDeclaration;
        break;


      case game.config.labels.UP:
      case game.config.labels.DOWN:

        tile.newPosition.top.newValue.pixels = newPosY;
        tile.newPosition.left.newValue.pixels = tile.oldPosition.left
          .pixels;

        tile.newPosition.top.newValue.percent = newPosY * 100 / game.metrics
          .tileHeight;

        // write the css for tile html element
        for (var p = 0; p < game.config.CSSprefixes.length; p++) {
          prefix = game.config.CSSprefixes[p];
          CSSstyleDeclaration += prefix + "transform:translate" +
            game.metrics
            .transforms3Dsupport[0] + "(" + tile.oldPosition.left.percent +
            "%," + tile.newPosition.top.newValue.percent + "%" + game
            .metrics
            .transforms3Dsupport[1] + "); " + prefix +
            "transition:none; ";
        }
        tile.htmlElement.style.cssText = CSSstyleDeclaration;

        break;

    }

    if (!game.config.pushMultiple || typeof tile.canPush.tiles ==
      "undefined") {
      return;
    }


    for (var i = 0; i < tile.canPush.tiles.length; i++) {
      otherTile = tile.canPush.tiles[i];
      var prefix = "";

      switch (direction) {
        case game.config.labels.UP:

          otherTileNewPos = (tile.newPosition.top.newValue.pixels - (
            game
            .metrics.tileHeight * (i + 1)));
          if (otherTileNewPos < tile.canPush.tiles[i].max || tile.canPush
            .tiles[i].max == null) {
            tile.canPush.tiles[i].max = otherTileNewPos;
          } else {
            return false;
          }

          // write the css for tile html element

          for (var p = 0; p < game.config.CSSprefixes.length; p++) {
            prefix = game.config.CSSprefixes[p];
            CSSstyleDeclaration += prefix + "transform:translate" +
              game.metrics
              .transforms3Dsupport[0] + "(" + tile.oldPosition.left.percent +
              "%," + otherTileNewPos + "px" + game.metrics.transforms3Dsupport[
                1] + "); " + prefix + "transition:none; ";
          }

          break;

        case game.config.labels.RIGHT:

          otherTileNewPos = (tile.newPosition.left.newValue.pixels +
            (
              game.metrics.tileWidth * (i + 1)));
          if (otherTileNewPos > tile.canPush.tiles[i].max || tile.canPush
            .tiles[i].max == null) {
            tile.canPush.tiles[i].max = otherTileNewPos;
          } else {
            return false;
          }

          // write the css for tile html element
          for (var p = 0; p < game.config.CSSprefixes.length; p++) {
            prefix = game.config.CSSprefixes[p];
            CSSstyleDeclaration += prefix + "transform:translate" +
              game.metrics
              .transforms3Dsupport[0] + "(" + otherTileNewPos + "px," +
              tile.oldPosition.top.percent + "%" + game.metrics.transforms3Dsupport[
                1] + "); " + prefix + "transition:none; ";
          }
          break;

        case game.config.labels.DOWN:

          otherTileNewPos = (tile.newPosition.top.newValue.pixels + (
            game
            .metrics.tileHeight * (i + 1)));
          if (otherTileNewPos > tile.canPush.tiles[i].max || tile.canPush
            .tiles[i].max == null) {
            tile.canPush.tiles[i].max = otherTileNewPos;
          } else {
            return false;
          }

          // write the css for tile html element
          for (var p = 0; p < game.config.CSSprefixes.length; p++) {
            prefix = game.config.CSSprefixes[p];
            CSSstyleDeclaration += prefix + "transform:translate" +
              game.metrics
              .transforms3Dsupport[0] + "(" + tile.oldPosition.left.percent +
              "%," + otherTileNewPos + "px" + game.metrics.transforms3Dsupport[
                1] + "); " + prefix + "transition:none; ";
          }


          break;

        case game.config.labels.LEFT:

          otherTileNewPos = (tile.newPosition.left.newValue.pixels -
            (
              game.metrics.tileWidth * (i + 1)));
          if (otherTileNewPos < tile.canPush.tiles[i].max || tile.canPush
            .tiles[i].max == null) {
            tile.canPush.tiles[i].max = otherTileNewPos;
          } else {
            return false;
          }

          // write the css for tile html element
          for (var p = 0; p < game.config.CSSprefixes.length; p++) {
            prefix = game.config.CSSprefixes[p];
            CSSstyleDeclaration += prefix + "transform:translate" +
              game.metrics
              .transforms3Dsupport[0] + "(" + otherTileNewPos + "px," +
              tile.oldPosition.top.percent + "%" + game.metrics.transforms3Dsupport[
                1] + "); " + prefix + "transition:none; ";
          }

          break;

      }
      otherTile.htmlElement.style.cssText = CSSstyleDeclaration;

      if (
        Math.abs(tile.oldPosition.left.pixels - tile.newPosition.left
          .newValue
          .pixels) > game.metrics.tileWidth / 4 ||
        Math.abs(tile.oldPosition.top.pixels - tile.newPosition.top.newValue
          .pixels) > game.metrics.tileHeight / 4
      ) {
        otherTile.revert = false;
      } else {
        otherTile.revert = true;
      }

    }
  },
  isTile: function(tile) {
    if (tile == null || tile == undefined) {
      return false;
    }

    switch (typeof tile) {
      case "object":
        if (tile.id.indexOf(game.config.labels.TILE_PREFIX) < 0) {
          return false;
        }
        break;

      case "string":
        tile = game.runtime.tiles[tile];
        if (typeof tile == "undefined") {
          return false;
        }
        if (tile.id.indexOf(game.config.labels.TILE_PREFIX) < 0) {
          return false;
        }
        break

      default:
        return false;
        break
    }
    return tile;
  },
  moveTile: function(tile, params) {

    tile = game.isTile(tile);
    if (!tile) {
      return false;
    };

    var hole = game.runtime.tiles[game.config.labels.TILE_PREFIX +
        game.config
        .labels.HOLE_INDEX],
      temp = {};

    if (!game.canMove(tile)) {
      return false;
    }

    if (params.force !== true) {
      if (!game.runtime.running) {
        return false;
      }
      game.countMove();
    }

    temp.col = tile.col;
    temp.row = tile.row;

    tile.col = hole.col;
    tile.row = hole.row;

    hole.col = temp.col;
    hole.row = temp.row;

    if (params.refresh === true) {
      game.refresh({
        transitions: params.transitions,
        saveGame: !params.force,
        redraw: !!!params.force
      });
    }

    return true;
  },
  countMove: function() {
    game.runtime.movesCount++;
  },
  shuffle: function(n, refresh) {

    console.log("shuffle");

    if (typeof n == "undefined") {
      n = 10 * game.config.size.n;
    }
    if (typeof refresh == "undefined") {
      refresh = true;
    }

    var directions = ["up", "right", "down", "left"];
    var movableTiles = [];

    var d;

    for (var i = 0; i < n; i++) {
      d = directions[Math.round(Math.random() * (directions.length -
        1))];

      movableTiles = game.getMovableTiles({
        direction: d,
        pushing: false,
        moving: true,
        force: true
      });

      game.moveTile(
        movableTiles[0], {
          transitions: false,
          force: true,
          refresh: true
        }
      );
    }

    if (refresh) {
      game.refresh({
        transitions: true,
        transitionDuration: 100
      });
    }
    t1 = new Date();
  },
  cloneTileObj: function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr) && attr != "htmlElement") copy[
          attr] =
        obj[attr];
    }
    return copy;
  },
  saveGame: function(type) {

    if (!game.config.useLstorage) {
      return false;
    }
    if (game.runtime.ended != false) {
      return false;
    }
    if (typeof type == "undefined") {
      type = "automatic";
    }

    var savedGames = {},
      savedGame = {
        saveDate: new Date().toUTCString(),
        type: type,
        size: game.config.size.n,
        tiles: {},
        movesCount: game.runtime.movesCount
      };

    if (JSON.parse(localStorage.getItem(game.config.labels.SAVEDGAMES_LABEL)) !=
      null) {
      savedGames = JSON.parse(localStorage.getItem(game.config.labels
        .SAVEDGAMES_LABEL));
    }

    if (game.runtime.started) {
      savedGame.startedDate = game.runtime.started.toUTCString();
    }

    for (var i = 0; i < game.config.size.n; i++) {

      tileID = game.config.labels.TILE_PREFIX + i;
      savedGame.tiles[tileID] = game.cloneTileObj(game.runtime.tiles[
        tileID]);
    }

    savedGames[type] = savedGame;

    localStorage.setItem(game.config.labels.SAVEDGAMES_LABEL, JSON.stringify(
      savedGames));

    console.log("game saved (" + type + ")");
  },
  loadGame: function(type) {
    if (!game.config.useLstorage) {
      return false;
    }
    if (typeof type == "undefined") {
      type = game.config.labels.AUTOSAVE_LABEL;
    }

    var loadedGames = JSON.parse(localStorage.getItem(game.config.labels
        .SAVEDGAMES_LABEL)),
      loadedGame = null;

    if (loadedGames != null) {
      if (typeof loadedGames[type] != "undefined" && loadedGames[type] !=
        null) {
        loadedGame = loadedGames[type];

        loadedGame.saveDate = new Date(Date.UTC.apply(this,
          loadedGame.saveDate
          .match(/\d+\.{0,1}\d+/g)));


        if (loadedGame.startedDate) {
          loadedGame.startedDate = new Date(Date.UTC.apply(this,
            loadedGame.startedDate.match(/\d+\.{0,1}\d+/g)));
        }

        if (loadedGame.size != game.config.size.n) {
          console.log("cannot load game: different sizes:",
            loadedGame.tiles
            .length, game.config.size.n)
          return false;
        }

        game.runtime.tiles = loadedGame.tiles;


        for (var i = 0; i < game.config.size.n; i++) {

          tileID = game.config.labels.TILE_PREFIX + i;
          loadedGame.tiles[tileID].htmlElement = document.getElementById(
            tileID);
        }

        game.runtime.started = loadedGame.startedDate;
        game.runtime.movesCount = parseInt(loadedGame.movesCount);
        game.refresh({
          transitions: (type == "user")
        });

        console.log("game loaded");
        return true;
      }

      console.log("cannot find saved game '" + type + "'")
      return false;

    }

    console.log("cannot find any saved game");
    return false;
  },
  newGame: function() {

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
  },
  getMovableTiles: function(params) {
    var direction = params.direction,
      pushing = params.pushing,
      moving = params.moving,
      t;

    game.runtime.movableTiles = [];

    if (game.runtime.running || params.force === true) {
      for (var i = 0; i < game.config.size.n; i++) {
        t = game.runtime.tiles["tile-" + i];

        if (!!t.canMove && moving && (typeof direction == "undefined" ||
            direction == t.canMove)) {
          game.runtime.movableTiles.push(game.getTile(game.config.labels
            .TILE_PREFIX + t.i));
        };

        if (
          game.config.pushMultiple && pushing && !!t.canPush && !t.canMove &&
          (typeof direction == "undefined" || direction == t.canPush.direction)
        ) {
          game.runtime.movableTiles.push(game.getTile(game.config.labels
            .TILE_PREFIX + t.i));
        };
      }

    }
    return game.runtime.movableTiles
  },
  moveAnyTile: function(params) {


    var tiles = (params.pushing == true) ? game.getMovableTiles({
        pushing: false,
        moving: true,
        direction: params.direction
      }).concat(game.getMovableTiles({
        pushing: true,
        moving: false,
        direction: params.direction
      }).sort(function(t1, t2) {
        return t1.canPush.n - t2.canPush.n;
      })) :
      game.getMovableTiles({
        pushing: false,
        moving: true,
        direction: params.direction
      });
    for (var i = 0; i < tiles.length; i++) {
      game.moveTile(tiles[i], {
        transitions: false,
        force: false,
        refresh: false
      });
    }
    game.refresh({
      transitionDuration: game.config.transitionDuration.byKeyboard
    });

    return tiles;
  },
  animate: function(params) {

    if (typeof params == "undefined" ||
      typeof params.element == "undefined" ||
      typeof params.animation != "string") {
      return false;
    }
    if (typeof params.duration != "number") {
      params.duration = game.config.transitionDuration.generic;
    }


    var CSSstyleDeclaration = "";

    for (var p = 0; p < game.config.CSSprefixes.length; p++) {
      prefix = game.config.CSSprefixes[p];
      CSSstyleDeclaration += prefix + "animation-fill-mode:both;";
      CSSstyleDeclaration += prefix + "animation-duration:" + params.duration +
        "ms;";
      CSSstyleDeclaration += prefix + "animation-name:" + params.animation +
        ";";

      if (typeof params.iterations != "undefined") {
        CSSstyleDeclaration += prefix + "animation-iteration-count:" +
          params.iteration + ";";
      }

      if (typeof params.delay == "number") {
        CSSstyleDeclaration += prefix + "animation-delay:" + params.delay +
          "ms;";
      }

      if (typeof params.easing == "string") {
        CSSstyleDeclaration += prefix + "animation-timing-function:" +
          params.easing + ";";
      }



      if (p < 0) {
        listenTo(params.element, "animationEnd", function(event) {
          event.target.style["animation"] = "";
        });
      } else {
        listenTo(params.element, game.config.CSSprefixes[p] +
          "AnimationEnd",
          function(event) {
            event.target.style[event.type.replace("End", "")] = "";
          });
      }
    }
    params.element.style.cssText += CSSstyleDeclaration;

  }


};




window.onload = function() {

  if (!window.pageYOffset) {
    window.scrollTo(0, 1);
  }
  addClass(document.documentElement, "loaded");
  game.init();
}
