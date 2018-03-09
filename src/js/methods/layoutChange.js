game.layoutChange = function() {
  "use strict";

  this.deselectTile();
  this.metricsUpdate();
  this.refresh();

  console.log("Tiles deselected, metrics updated and game refreshed after a layout change.");
};
