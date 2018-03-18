game.gravity = function() {
  "use strict";

  if (this.config.tilesFallAfterLayoutChange) {
    this.moveAnyTile({
      pushing: true,
      direction: this.config.labels["DOWN"]
    })
  };
  console.log("Gravity could have moved one or more tiles.");
};
